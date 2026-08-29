import categories from "@content/categories.json";
import type { Category, Product } from "../types";
import seoPages from "./seoPages.json";

const allCats = categories as Category[];
const catById = new Map(allCats.map((c) => [c.term_id, c]));

const WOMEN_ROOT = 18;
const MEN_ROOT = 19;
const ACCESSORY_ROOT = 40;

const GENERIC_CAT_NAMES = new Set(["زنانه", "مردانه", "کفش", "کیف", "بدون دسته‌بندی"]);

const COLORS: [RegExp, string][] = [
  [/خردلی/, "خردلی"],
  [/فیروزه/, "فیروزه‌ای"],
  [/کاربنی/, "کاربنی"],
  [/کهنه/, "کهنه‌ای"],
  [/سرمه‌ای/, "سرمه‌ای"],
  [/زرشکی/, "زرشکی"],
  [/طوسی/, "طوسی"],
  [/یشمی/, "یشمی"],
  [/بنفش/, "بنفش"],
  [/عسلی/, "عسلی"],
  [/قهوه/, "قهوه‌ای"],
  [/مشکی/, "مشکی"],
  [/سفید/, "سفید"],
  [/قرمز/, "قرمز"],
  [/آبی/, "آبی"],
  [/کرم/, "کرم"],
  [/زرد/, "زرد"],
];

export type ProductGender = "زنانه" | "مردانه" | "اکسسوری" | "";

export interface ProductTag {
  label: string;
  href?: string;
}

export interface ProductFacts {
  name: string;
  gender: ProductGender;
  type: string;
  material: string;
  colors: string[];
  leafCategory?: { name: string; slug: string };
  tags: ProductTag[];
  keywords: string[];
}

export function cleanProductTitle(title: string): string {
  return title.replace(/^مدل:\s*/i, "").replace(/\s+/g, " ").trim();
}

export function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function categoryAncestors(termId: number): Category[] {
  const out: Category[] = [];
  let cur = catById.get(termId);
  const seen = new Set<number>();
  while (cur && !seen.has(cur.term_id)) {
    seen.add(cur.term_id);
    out.push(cur);
    cur = cur.parent ? catById.get(cur.parent) : undefined;
  }
  return out;
}

export function productGender(product: Product): ProductGender {
  for (const ref of product.categories) {
    const ids = categoryAncestors(ref.id).map((c) => c.term_id);
    if (ids.includes(MEN_ROOT)) return "مردانه";
    if (ids.includes(WOMEN_ROOT)) return "زنانه";
    if (ids.includes(ACCESSORY_ROOT)) return "اکسسوری";
  }
  return "";
}

export function productColors(title: string): string[] {
  const found: string[] = [];
  for (const [re, label] of COLORS) {
    if (re.test(title) && !found.includes(label)) found.push(label);
  }
  return found;
}

/** جنس واقعی — بافت کروکو/پیتون چاپ یا پرس است، نه پوست کروکودیل یا پیتون */
export function detectMaterial(title: string): string {
  if (/شترمرغ|ostrich/i.test(title)) {
    if (/تنه/.test(title)) return "چرم تنه شترمرغ";
    if (/ساق/.test(title)) return "چرم ساق شترمرغ";
    return "چرم طبیعی شترمرغ";
  }

  const parts: string[] = [];
  if (/وجیتال|veg/i.test(title)) parts.push("وجیتال");
  if (/فلوتر|floater/i.test(title)) parts.push("فلوتر");
  if (/نابوک|nubuck/i.test(title)) parts.push("نابوک");
  if (/ورنی/.test(title)) parts.push("ورنی");
  if (/حصیری/.test(title)) parts.push("حصیری");
  if (/لیزری/.test(title)) parts.push("لیزری");
  if (/حوله‌/.test(title)) parts.push("حوله‌ای");
  if (/خشتی/.test(title)) parts.push("خشتی");
  if (/کروکو|croc/i.test(title)) parts.push("بافت کروکو");
  if (/پیتون|python/i.test(title)) parts.push("بافت پیتون");

  if (!parts.length) return "چرم طبیعی گاوی";
  return `چرم ${parts.join("، ")}`;
}

function materialTags(title: string): string[] {
  const tags: string[] = [];
  if (/شترمرغ|ostrich/i.test(title)) {
    tags.push("چرم شترمرغ");
    if (/تنه/.test(title)) tags.push("تنه");
    if (/ساق/.test(title)) tags.push("ساق");
    return tags;
  }
  if (/وجیتال/i.test(title)) tags.push("وجیتال");
  if (/فلوتر/i.test(title)) tags.push("فلوتر");
  if (/نابوک/i.test(title)) tags.push("نابوک");
  if (/ورنی/.test(title)) tags.push("ورنی");
  if (/حصیری/.test(title)) tags.push("حصیری");
  if (/لیزری/.test(title)) tags.push("لیزری");
  if (/حوله‌/.test(title)) tags.push("حوله‌ای");
  if (/خشتی/.test(title)) tags.push("خشتی");
  if (/کروکو/i.test(title)) tags.push("بافت کروکو");
  if (/پیتون/i.test(title)) tags.push("بافت پیتون");
  if (tags.length) tags.unshift("چرم طبیعی");
  else tags.push("چرم طبیعی");
  return tags;
}

function typeFromTitle(title: string): string {
  if (/کمربند/.test(title)) return "کمربند";
  if (/کاور/.test(title)) return "کاور موبایل";
  if (/پاسپورتی/.test(title)) return "کیف پاسپورتی";
  if (/جاکارتی/.test(title)) return "جاکارتی";
  if (/سامسونت/.test(title)) return "کیف اداری";
  if (/لوفر/.test(title)) return "لوفر";
  if (/کالج/.test(title)) return "کالج";
  if (/صندل/.test(title)) return "صندل";
  if (/اسنیکر|کترپیلار|تیمبرلند/.test(title)) return "اسنیکر";
  if (/نیم[‌\s]*بوت|بوت/.test(title)) return "بوت";
  if (/کیف دستی|دوشی/.test(title)) return "کیف";
  return "";
}

function leafCategory(product: Product): { name: string; slug: string } | undefined {
  const specific = product.categories.find((c) => !GENERIC_CAT_NAMES.has(c.name));
  const cat = specific ?? product.categories[0];
  return cat ? { name: cat.name, slug: cat.slug } : undefined;
}

function productType(product: Product, title: string): string {
  return typeFromTitle(title) || leafCategory(product)?.name || "محصول چرم";
}

function genderHref(gender: ProductGender): string | undefined {
  if (gender === "مردانه") return "/shop?cat=men";
  if (gender === "زنانه") return `/shop?cat=${encodeURIComponent("زنانه")}`;
  if (gender === "اکسسوری") return "/shop?cat=aksesori";
  return undefined;
}

export function productFacts(product: Product): ProductFacts {
  const name = cleanProductTitle(product.title);
  const gender = productGender(product);
  const type = productType(product, name);
  const material = detectMaterial(name);
  const colors = productColors(name);
  const leaf = leafCategory(product);
  const seen = new Set<string>();
  const tags: ProductTag[] = [];

  const push = (label: string, href?: string) => {
    const key = label.trim();
    if (!key || seen.has(key)) return;
    seen.add(key);
    tags.push({ label: key, href });
  };

  for (const t of product.tags) {
    push(t.name);
  }
  if (gender) push(gender, genderHref(gender));
  if (leaf && leaf.name !== gender) {
    push(leaf.name, `/shop?cat=${encodeURIComponent(normalizeSlug(leaf.slug))}`);
  }
  if (type && type !== gender && type !== leaf?.name) push(type);
  for (const m of materialTags(name)) push(m);
  for (const c of colors) push(c);
  push("ساخت تبریز");

  const keywords: string[] = [];
  const addKw = (k: string) => {
    const v = k.trim();
    if (v && !keywords.includes(v)) keywords.push(v);
  };
  addKw(name);
  addKw(`${type} چرم`);
  if (gender && gender !== "اکسسوری") addKw(`${type} ${gender}`);
  addKw(material);
  for (const c of colors) addKw(c);
  addKw("چرم کارن");
  addKw("تبریز");
  addKw(`خرید ${type}`);

  return { name, gender, type, material, colors, leafCategory: leaf, tags: tags.slice(0, 10), keywords: keywords.slice(0, 12) };
}

export function joinKeywords(list: string[]): string {
  return list.filter(Boolean).join(", ");
}

export function clampMeta(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return (at > 80 ? cut.slice(0, at) : cut).trim();
}

export function lookupCategoryCopy(slug: string): { title?: string; description: string; keywords: string } | undefined {
  const decoded = normalizeSlug(slug);
  const map = seoPages.categories as Record<string, { title?: string; description: string; keywords: string }>;
  return map[decoded] ?? map[slug];
}

export function categorySeoTitle(cat: { name: string; slug: string }): string {
  return lookupCategoryCopy(cat.slug)?.title || cat.name;
}

export function categorySeoDescription(cat: { name: string; slug: string; description?: string }): string {
  const copy = lookupCategoryCopy(cat.slug);
  if (copy?.description) return copy.description;
  if (cat.description?.trim()) return cat.description.trim();
  return `خرید ${cat.name} چرم طبیعی از چرم کارن تبریز. دست‌ساز، گارانتی ۲ ساله، ارسال به سراسر ایران.`;
}

export function categoryKeywords(cat: { name: string; slug: string }): string {
  const copy = lookupCategoryCopy(cat.slug);
  if (copy?.keywords) return copy.keywords;
  return `${cat.name} چرم, خرید ${cat.name}, چرم کارن تبریز`;
}

export function productSeoDescription(product: Product): string {
  if (product.excerpt?.trim()) return clampMeta(product.excerpt.trim());
  const { name, gender, type, material } = productFacts(product);
  const who = gender && gender !== "اکسسوری" ? ` ${gender}` : "";
  return clampMeta(
    `خرید ${name} از چرم کارن تبریز — ${type}${who}. ${material} دست‌ساز، گارانتی ۲ ساله، ارسال سراسری.`,
  );
}

export function productKeywords(product: Product): string {
  return joinKeywords(productFacts(product).keywords);
}

export function productBodyHtml(product: Product): string {
  if (product.description?.trim()) return product.description;
  const { name, gender, type, material, colors, leafCategory } = productFacts(product);
  const catLine = leafCategory?.name ?? type;
  const colorLine = colors.length ? ` رنگ ${colors.join(" و ")}` : "";
  const who = gender ? ` ${gender}` : "";
  return `<p><strong>${name}</strong> از مجموعه چرم کارن — ${catLine}${who}.</p>
<p>این محصول با <strong>${material}</strong>${colorLine} در کارگاه تبریز دوخته شده است. تمامی محصولات چرم کارن دارای <strong>گارانتی ۲ ساله</strong> اصالت و کیفیت هستند.</p>
<p>برای مشاوره خرید، سفارش اختصاصی یا موجودی با ۰۹۱۴-۴۱۹-۹۹۳۵ تماس بگیرید.</p>`;
}

export function productDisplayTags(product: Product): ProductTag[] {
  return productFacts(product).tags;
}
