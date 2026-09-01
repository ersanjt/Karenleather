import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const productsPath = path.join(repo, "_content/products.json");
const uploads = path.join(repo, "wp-content/uploads");
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

/** قیمت فروش / قیمت قبلی از مدل هم‌خانواده یا دستهٔ مشابه در همین کاتالوگ */
const PRICE_FROM = {
  1346: 791,
  1344: 1190,
  1342: 1182,
  1345: 1134,
  1339: 791,
  1347: 1212,
  1340: 1195,
  1341: 1202,
  1348: 758,
  1349: 758,
  1351: 992,
  1350: 992,
  1352: 758,
};

const byId = new Map(products.map((p) => [p.id, p]));
let pricesFilled = 0;
for (const [id, srcId] of Object.entries(PRICE_FROM)) {
  const p = byId.get(Number(id));
  const src = byId.get(srcId);
  if (!p || !src || String(p.price || "").trim()) continue;
  p.price = src.price;
  p.sale_price = src.sale_price || src.price;
  p.regular_price = src.regular_price || src.price;
  pricesFilled += 1;
}

const TYPE = [
  [/کمربند/, "belt"],
  [/کاور/, "phone-case"],
  [/پاسپورتی/, "passport"],
  [/جاکارتی/, "cardholder"],
  [/سامسونت|کیف اداری/, "briefcase"],
  [/لوفر|کالج/, "loafer"],
  [/صندل/, "sandal"],
  [/اسنیکر|تیمبرلند|کترپیلار/, "sneaker"],
  [/نیم[‌\s]*بوت|بوت/, "boot"],
  [/دوشی/, "shoulder-bag"],
  [/کیف دستی/, "handbag"],
  [/کیف مجلسی/, "clutch"],
  [/کفش تخت/, "flat"],
  [/کفش مجلسی/, "oxford"],
];

const MAT = [
  [/تنه\s*شترمرغ|شترمرغ.*تنه/, "ostrich-body"],
  [/ساق\s*شترمرغ|شترمرغ.*ساق/, "ostrich-leg"],
  [/شترمرغ/, "ostrich"],
  [/وجیتال/, "vegital"],
  [/فلوتر/, "floater"],
  [/نابوک/, "nubuck"],
  [/ورنی/, "patent"],
  [/حصیری/, "woven"],
  [/لیزری/, "laser"],
  [/خشتی/, "brick"],
  [/حوله‌/, "terry"],
  [/کروکو/, "croco"],
  [/پیتون/, "python"],
];

const COLOR = [
  [/خردلی/, "mustard"],
  [/فیروزه/, "turquoise"],
  [/کاربنی/, "navy"],
  [/کهنه/, "vintage"],
  [/سرمه‌ای/, "navy"],
  [/زرشکی/, "burgundy"],
  [/طوسی/, "grey"],
  [/یشمی/, "jade"],
  [/بنفش/, "purple"],
  [/عسلی/, "honey"],
  [/قهوه/, "brown"],
  [/مشکی/, "black"],
  [/سفید/, "white"],
  [/قرمز/, "red"],
  [/آبی/, "blue"],
  [/کرم/, "cream"],
  [/زرد/, "yellow"],
];

function firstMatch(title, pairs, fallback) {
  for (const [re, slug] of pairs) {
    if (re.test(title)) return slug;
  }
  return fallback;
}

function catType(product) {
  const names = (product.categories || []).map((c) => c.name).join(" ");
  return firstMatch(`${product.title} ${names}`, TYPE, "leather");
}

function resolveUpload(rel) {
  const direct = path.join(uploads, rel);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  const noScaled = rel.replace(/-scaled(?=\.)/i, "");
  const withScaled = rel.replace(/(\.(jpe?g|png|webp|gif))$/i, "-scaled$1");
  for (const candidate of [noScaled, withScaled, rel.replace(/-\d+x\d+(?=\.)/i, "")]) {
    const full = path.join(uploads, candidate);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  const dir = path.join(uploads, path.dirname(rel));
  const base = path.basename(rel);
  if (!fs.existsSync(dir)) return null;
  const norm = (s) => s.toLowerCase().replace(/-scaled/g, "").replace(/-\d+x\d+(?=\.)/gi, "");
  const target = norm(base);
  for (const f of fs.readdirSync(dir)) {
    if (norm(f) === target) return path.join(dir, f);
  }
  return null;
}

const used = new Set();
let copied = 0;
let missing = [];

for (const product of products) {
  const type = catType(product);
  const mat = firstMatch(product.title, MAT, "leather");
  const color = firstMatch(product.title, COLOR, "natural");
  const extDefault = ".jpg";
  (product.images || []).forEach((img, index) => {
    const srcRel = String(img.file || "").split("?")[0];
    if (!srcRel) return;
    if (/^2023\/01\/karen-/.test(srcRel)) return;
    const src = resolveUpload(srcRel);
    if (!src) {
      missing.push(srcRel);
      return;
    }
    const ext = path.extname(src).toLowerCase() || extDefault;
    const n = String(index + 1).padStart(2, "0");
    let destRel = `2023/01/karen-${type}-${mat}-${color}-${product.id}-${n}${ext}`;
    let i = 2;
    while (used.has(destRel) || fs.existsSync(path.join(uploads, destRel))) {
      destRel = `2023/01/karen-${type}-${mat}-${color}-${product.id}-${n}-${i}${ext}`;
      i += 1;
    }
    used.add(destRel);
    const dest = path.join(uploads, destRel);
    fs.copyFileSync(src, dest);
    img.file = destRel;
    img.guid = `https://karenleather.com/uploads/${destRel}`;
    copied += 1;
  });
}

fs.writeFileSync(productsPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
console.log(
  JSON.stringify(
    {
      pricesFilled,
      stillEmpty: products.filter((p) => !String(p.price || "").trim()).map((p) => p.id),
      copied,
      missing: missing.slice(0, 20),
      missingCount: missing.length,
      sample: products.find((p) => p.id === 1165)?.images?.[0]?.file,
    },
    null,
    2,
  ),
);
