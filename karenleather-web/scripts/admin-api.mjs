import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const contentRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../_content");
const productsPath = path.join(contentRoot, "products.json");
const storePath = path.join(contentRoot, "admin-store.json");
const credsPath = path.join(contentRoot, "admin-credentials.json");

const sessions = new Map();
const loginAttempts = new Map();

const PRODUCT_EDIT_FIELDS = ["title", "price", "regular_price", "sale_price", "stock", "hidden", "description"];
const SETTINGS_FIELDS = ["showPrices", "whatsappPhone", "whatsappMessage", "adminEmail", "siteName"];
const ORDER_STATUSES = new Set(["pending", "processing", "completed", "cancelled"]);

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(`karen:${password}`).digest("hex");
}

function readStore() {
  return readJson(storePath, {
    settings: {},
    orders: [],
    productEdits: {},
    hiddenProductIds: [],
  });
}

function writeStore(store) {
  writeJson(storePath, store);
}

function readBaseProducts() {
  return readJson(productsPath, []);
}

function mergeProducts() {
  const base = readBaseProducts();
  const store = readStore();
  const hidden = new Set(store.hiddenProductIds ?? []);
  const edits = store.productEdits ?? {};

  return base
    .filter((p) => !hidden.has(p.id))
    .map((p) => {
      const edit = edits[String(p.id)];
      return edit ? { ...p, ...edit, id: p.id } : p;
    });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 2_000_000) reject(new Error("Body too large"));
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function getToken(req) {
  const auth = req.headers.authorization ?? "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

function requireAuth(req) {
  const token = getToken(req);
  if (!token || !sessions.has(token)) return null;
  const session = sessions.get(token);
  if (session.expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function newOrderId() {
  return `KL-${Date.now().toString(36).toUpperCase()}`;
}

function clientIp(req) {
  return req.socket?.remoteAddress || "local";
}

function isRateLimited(key, max, windowMs) {
  const now = Date.now();
  const rec = loginAttempts.get(key);
  if (!rec || rec.reset < now) {
    loginAttempts.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  rec.count += 1;
  return rec.count > max;
}

function clipText(value, max) {
  return String(value ?? "")
    .replace(/[<>]/g, "")
    .slice(0, max)
    .trim();
}

function pickFields(source, keys) {
  const out = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(source, key)) out[key] = source[key];
  }
  return out;
}

function productGender(product) {
  const womenRoots = new Set([18, 47, 46, 53, 52]);
  const menRoots = new Set([19, 54, 59]);
  for (const c of product.categories ?? []) {
    if (womenRoots.has(c.id)) return "زنانه";
    if (menRoots.has(c.id)) return "مردانه";
  }
  if (product.categories?.some((c) => c.slug === "aksesori")) return "اکسسوری";
  return "—";
}

function isInStock(product) {
  return product.stock !== "outofstock" && product.stock !== "out_of_stock";
}

export async function handleAdminApi(req, res, pathname) {
  if (pathname === "/api/store/catalog" && req.method === "GET") {
    const store = readStore();
    return json(res, 200, {
      products: mergeProducts(),
      settings: store.settings ?? {},
    });
  }

  if (pathname === "/api/store/orders" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const catalog = mergeProducts();
      const byId = new Map(catalog.map((p) => [p.id, p]));
      const rawItems = Array.isArray(body.items) ? body.items : [];
      const items = [];
      for (const raw of rawItems) {
        const id = Number(raw.productId ?? raw.id);
        const product = byId.get(id);
        if (!product) continue;
        const qty = Math.min(20, Math.max(1, Number(raw.qty) || 1));
        const unit = Number(product.price || product.regular_price) || 0;
        items.push({
          productId: product.id,
          title: product.title,
          qty,
          price: unit,
        });
      }
      if (!items.length) return json(res, 400, { error: "Empty order" });

      const store = readStore();
      const order = {
        id: newOrderId(),
        status: "pending",
        payment: "whatsapp",
        customer: {
          name: clipText(body.customer?.name, 80) || "مهمان",
          phone: clipText(body.customer?.phone, 20),
          email: clipText(body.customer?.email, 120),
        },
        items,
        total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
        note: clipText(body.note, 500),
        createdAt: new Date().toISOString(),
      };
      store.orders = [order, ...(store.orders ?? [])].slice(0, 500);
      writeStore(store);
      return json(res, 201, { ok: true, order });
    } catch {
      return json(res, 400, { error: "Invalid request" });
    }
  }

  if (pathname === "/api/admin/login" && req.method === "POST") {
    try {
      if (isRateLimited(`login:${clientIp(req)}`, 8, 15 * 60 * 1000)) {
        return json(res, 429, { error: "Too many attempts" });
      }
      const body = await parseBody(req);
      const creds = readJson(credsPath, null);
      if (!creds) return json(res, 500, { error: "Admin not configured" });

      const hash = hashPassword(body.password ?? "");
      const legacyHash = crypto.createHash("sha256").update(body.password ?? "").digest("hex");
      const ok =
        body.email === creds.email &&
        (hash === creds.passwordHash || legacyHash === creds.passwordHash);

      if (!ok) return json(res, 401, { error: "Incorrect email or password" });

      const token = crypto.randomBytes(32).toString("hex");
      sessions.set(token, { email: creds.email, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
      return json(res, 200, { token, email: creds.email });
    } catch {
      return json(res, 400, { error: "Invalid request" });
    }
  }

  if (pathname === "/api/admin/session" && req.method === "GET") {
    const session = requireAuth(req);
    if (!session) return json(res, 401, { error: "Unauthorized" });
    return json(res, 200, { email: session.email });
  }

  if (pathname === "/api/admin/logout" && req.method === "POST") {
    const token = getToken(req);
    if (token) sessions.delete(token);
    return json(res, 200, { ok: true });
  }

  const session = requireAuth(req);
  if (!session) {
    if (pathname.startsWith("/api/admin/")) {
      return json(res, 401, { error: "Unauthorized" });
    }
  }

  if (pathname === "/api/admin/dashboard" && req.method === "GET") {
    const products = mergeProducts();
    const store = readStore();
    const orders = store.orders ?? [];
    const inStock = products.filter(isInStock).length;
    const revenue = orders.reduce((n, o) => n + (Number(o.total) || 0), 0);

    return json(res, 200, {
      stats: {
        total: products.length,
        inStock,
        outStock: products.length - inStock,
        orders: orders.length,
        revenue,
      },
      recentOrders: orders.slice(0, 5),
      lowStock: products.filter((p) => isInStock(p)).slice(0, 5).map((p) => ({
        id: p.id,
        title: p.title,
        stock: p.stock,
      })),
    });
  }

  if (pathname === "/api/admin/products" && req.method === "GET") {
    const products = mergeProducts().map((p) => ({
      ...p,
      gender: productGender(p),
      inStock: isInStock(p),
    }));
    return json(res, 200, { products });
  }

  const productMatch = pathname.match(/^\/api\/admin\/products\/(\d+)$/);
  if (productMatch && req.method === "PUT") {
    try {
      const id = Number(productMatch[1]);
      const body = await parseBody(req);
      const store = readStore();
      const key = String(id);
      const patch = pickFields(body, PRODUCT_EDIT_FIELDS);
      if (patch.stock && patch.stock !== "instock" && patch.stock !== "outofstock") {
        delete patch.stock;
      }
      if (typeof patch.title === "string") patch.title = clipText(patch.title, 200);
      if (typeof patch.description === "string") patch.description = String(patch.description).slice(0, 20_000);
      store.productEdits = store.productEdits ?? {};
      store.productEdits[key] = {
        ...(store.productEdits[key] ?? {}),
        ...patch,
        modified: new Date().toISOString(),
      };
      if (body.hidden === true) {
        store.hiddenProductIds = [...new Set([...(store.hiddenProductIds ?? []), id])];
      }
      if (body.hidden === false) {
        store.hiddenProductIds = (store.hiddenProductIds ?? []).filter((x) => x !== id);
      }
      writeStore(store);
      return json(res, 200, { ok: true });
    } catch {
      return json(res, 400, { error: "Invalid request" });
    }
  }

  if (pathname === "/api/admin/orders" && req.method === "GET") {
    const store = readStore();
    return json(res, 200, { orders: store.orders ?? [] });
  }

  const orderMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)$/);
  if (orderMatch && req.method === "PUT") {
    try {
      const id = decodeURIComponent(orderMatch[1]);
      const body = await parseBody(req);
      const status = typeof body.status === "string" ? body.status : "";
      if (!ORDER_STATUSES.has(status)) return json(res, 400, { error: "Invalid status" });
      const store = readStore();
      store.orders = (store.orders ?? []).map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o,
      );
      writeStore(store);
      return json(res, 200, { ok: true });
    } catch {
      return json(res, 400, { error: "Invalid request" });
    }
  }

  if (pathname === "/api/admin/settings" && req.method === "GET") {
    const store = readStore();
    return json(res, 200, { settings: store.settings ?? {} });
  }

  if (pathname === "/api/admin/settings" && req.method === "PUT") {
    try {
      const body = await parseBody(req);
      const store = readStore();
      const patch = pickFields(body, SETTINGS_FIELDS);
      if (typeof patch.siteName === "string") patch.siteName = clipText(patch.siteName, 80);
      if (typeof patch.adminEmail === "string") patch.adminEmail = clipText(patch.adminEmail, 120);
      if (typeof patch.whatsappPhone === "string") patch.whatsappPhone = String(patch.whatsappPhone).replace(/\D/g, "").slice(0, 20);
      if (typeof patch.whatsappMessage === "string") patch.whatsappMessage = clipText(patch.whatsappMessage, 500);
      if ("showPrices" in patch) patch.showPrices = Boolean(patch.showPrices);
      store.settings = { ...(store.settings ?? {}), ...patch };
      writeStore(store);
      return json(res, 200, { settings: store.settings });
    } catch {
      return json(res, 400, { error: "Invalid request" });
    }
  }

  return false;
}
