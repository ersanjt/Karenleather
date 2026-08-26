const TOKEN_KEY = "karen_admin_token";

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function adminFetch(path: string, init: RequestInit = {}) {
  const token = getAdminToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(path, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return data;
}

export const adminApi = {
  login(email: string, password: string) {
    return adminFetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }) as Promise<{ token: string; email: string }>;
  },
  logout() {
    return adminFetch("/api/admin/logout", { method: "POST" });
  },
  session() {
    return adminFetch("/api/admin/session") as Promise<{ email: string }>;
  },
  dashboard() {
    return adminFetch("/api/admin/dashboard") as Promise<{
      stats: {
        total: number;
        inStock: number;
        outStock: number;
        orders: number;
        revenue: number;
      };
      recentOrders: AdminOrder[];
      lowStock: { id: number; title: string; stock: string }[];
    }>;
  },
  products() {
    return adminFetch("/api/admin/products") as Promise<{ products: AdminProduct[] }>;
  },
  updateProduct(id: number, patch: Record<string, unknown>) {
    return adminFetch(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  },
  orders() {
    return adminFetch("/api/admin/orders") as Promise<{ orders: AdminOrder[] }>;
  },
  updateOrder(id: string, patch: Record<string, unknown>) {
    return adminFetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  },
  settings() {
    return adminFetch("/api/admin/settings") as Promise<{ settings: AdminSettings }>;
  },
  saveSettings(patch: Partial<AdminSettings>) {
    return adminFetch("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify(patch),
    }) as Promise<{ settings: AdminSettings }>;
  },
};

export interface AdminSettings {
  showPrices: boolean;
  whatsappPhone: string;
  whatsappMessage: string;
  adminEmail: string;
  siteName: string;
}

export interface AdminOrder {
  id: string;
  status: string;
  payment: string;
  customer: { name: string; phone?: string; email?: string };
  items: { title: string; qty: number; price?: number }[];
  total: number;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminProduct {
  id: number;
  title: string;
  slug: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock: string;
  categories: { id: number; name: string; slug: string }[];
  images: { file: string }[];
  gender: string;
  inStock: boolean;
  modified: string;
}
