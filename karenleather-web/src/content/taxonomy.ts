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
  details: string[];
  leafCategory?: { name: string; slug: string };
  tags: ProductTag[];
  keywords: string[];
}

export function cleanProductTitle(title: string): string {
  return title.replace(/^مدل:\s*/i, "").replace(/\s+/g, " ").trim();
}

function toFaDigits(value: string): string {
  return value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
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

function productDetails(title: string): string[] {
  const details: string[] = [];
  const push = (label: string) => {
    if (!details.includes(label)) details.push(label);
  };
  if (/۳[.\s]?۵|3[.\s]?5/.test(title)) push("عرض ۳٫۵ سانتی‌متر");
  else if (/۲[.\s]?۵|2[.\s]?5/.test(title)) push("عرض ۲٫۵ سانتی‌متر");
  if (/بندی/.test(title)) push("بندی");
  if (/زیپ/.test(title)) push("زیپ‌دار");
  if (/کش[‌\s-]*دار/.test(title)) push("کش‌دار");
  if (/منگوله/.test(title)) push("منگوله‌دار");
  if (/دوسگک|دو[\s‌]*سگک/.test(title)) push("دوسگک");
  else if (/سگک/.test(title)) push("سگک‌دار");
  if (/یراق ایتالیایی/.test(title)) push("یراق ایتالیایی");
  if (/آلبوم/.test(title)) push("آلبوم‌دار");
  if (/رگلاژ/.test(title)) push("رگلاژی");
  if (/کراواتی/.test(title)) push("کراواتی");
  if (/تک[\s‌]*قفل/.test(title)) push("تک‌قفل");
  if (/دو[\s‌]*قفل/.test(title)) push("دو قفل");
  if (/باریک/.test(title)) push("مدل باریک");
  return details;
}

function typeUseCopy(type: string, gender: ProductGender): string {
  switch (type) {
    case "کفش مجلسی":
      return gender === "زنانه"
        ? "برای مجلس، مهمانی و استایل رسمی زنانه طراحی شده است."
        : "برای محل کار، مجلس و استایل رسمی مردانه مناسب است.";
    case "لوفر":
    case "کالج":
      return "سبک کالج و لوفر برای استفاده روزانه و استایل کژوال‌رسمی.";
    case "بوت":
      return "پوشش ساق و دوام بیشتر در فصل سرد — مناسب پیاده‌روی شهری.";
    case "اسنیکر":
      return "ترکیب راحتی روزمره با رویه چرم طبیعی برای استایل شهری.";
    case "صندل":
      return "مدل تابستانه با رویه چرم؛ سبک و مناسب گردش روزانه.";
    case "کفش تخت":
      return "کفش تخت چرم برای راحتی روزمره بدون پاشنه بلند.";
    case "کمربند":
      return "کمربند چرم کارن برای شلوار رسمی و کژوال؛ بافت و عرض در عنوان مدل مشخص است.";
    case "کیف اداری":
    case "سامسونت":
      return "برای حمل مدارک و لوازم کار با دوخت کارگاهی و یراق مقاوم.";
    case "جاکارتی":
      return "جاکارتی جمع‌وجور برای کارت بانکی و شناسایی.";
    case "کیف پاسپورتی":
      return "کیف پاسپورتی برای مدارک سفر و کارت‌ها.";
    case "کاور موبایل":
      return "کاور تمام‌چرم برای محافظت از گوشی با بافت طبیعی شترمرغ.";
    case "کیف":
      return gender === "زنانه"
        ? "کیف زنانه برای همراهی روزانه، مجلس یا استفاده رودوشی."
        : "کیف مردانه برای مدارک و استفاده روزانه.";
    default:
      return "دست‌دوز کارگاه تبریز با چرم طبیعی و استاندارد کارن.";
  }
}

function materialCopy(material: string): string {
  if (material.includes("تنه شترمرغ")) {
    return "چرم تنه شترمرغ با بافت نقاط طبیعی — از لوکس‌ترین چرم‌های تزئینی جهان.";
  }
  if (material.includes("ساق شترمرغ")) {
    return "چرم ساق شترمرغ با بافت پوست‌مار؛ مناسب جزئیات و کمربند.";
  }
  if (material.includes("شترمرغ")) {
    return "چرم طبیعی شترمرغ با بافت نقاط مشخص؛ امضای کلکسیون کارن.";
  }
  if (material.includes("وجیتال")) {
    return "چرم وجیتال گیاه‌دباغی با سطحی طبیعی و تنفس‌پذیر.";
  }
  if (material.includes("فلوتر")) {
    return "چرم فلوتر با دانه درشت و مقاومت بالا در برابر خط و خش.";
  }
  if (material.includes("نابوک")) {
    return "چرم نابوک با سطح جیرمانند و ظاهر مات.";
  }
  if (material.includes("ورنی")) {
    return "چرم ورنی براق برای استایل رسمی و مجلسی.";
  }
  if (material.includes("کروکو")) {
    return "بافت کروکو پرس‌شده روی چرم گاوی — ظاهر لاکچری بدون پوست کروکودیل.";
  }
  if (material.includes("پیتون")) {
    return "بافت پیتون چاپ‌شده روی چرم طبیعی؛ نقش فلس مشخص.";
  }
  return "چرم طبیعی گاوی دباغی‌شده در خط تولید تبریز.";
}

/** H1 و عنوان سئو: نوع + جنسیت + نام مدل، بدون تکرار */
export function productHeading(product: Product): string {
  const { name, gender, type } = productFacts(product);
  const genderPart = gender && gender !== "اکسسوری" ? gender : "";
  const hasType = Boolean(type && type !== "محصول چرم" && name.includes(type));
  const hasGender = Boolean(genderPart && name.includes(genderPart));

  if (hasType && hasGender) return toFaDigits(name);
  if (hasType && genderPart) {
    return toFaDigits(name.replace(type, `${type} ${genderPart}`));
  }
  if (!hasType && type && type !== "محصول چرم" && genderPart) return toFaDigits(`${type} ${genderPart} ${name}`);
  if (!hasType && type && type !== "محصول چرم") return toFaDigits(`${type} ${name}`);
  if (genderPart && !hasGender) return toFaDigits(`${genderPart} ${name}`);
  return toFaDigits(name);
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
  const details = productDetails(name);
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

  return {
    name,
    gender,
    type,
    material,
    colors,
    details,
    leafCategory: leaf,
    tags: tags.slice(0, 10),
    keywords: keywords.slice(0, 12),
  };
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

export function productSeoTitle(product: Product, brand: string): string {
  const heading = productHeading(product);
  const branded = `${heading} — ${brand}`;
  if ([...branded].length <= 62) return branded;
  const { name, type } = productFacts(product);
  return `${name} | ${type} — ${brand}`;
}

export function productSeoDescription(product: Product): string {
  if (product.excerpt?.trim()) return clampMeta(product.excerpt.trim());
  const { gender, type, material, colors, details } = productFacts(product);
  const heading = productHeading(product);
  const who = gender && gender !== "اکسسوری" ? ` ${gender}` : "";
  const color = colors.length ? ` رنگ ${colors.join(" و ")}` : "";
  const extra = details.length ? ` ${details.slice(0, 3).join("، ")}.` : "";
  return clampMeta(
    `خرید ${heading} از کارگاه چرم کارن تبریز — ${type}${who}${color}. ${material}.${extra} دست‌ساز، گارانتی ۲ ساله، ارسال سراسری.`,
  );
}

export function productKeywords(product: Product): string {
  return joinKeywords(productFacts(product).keywords);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function productBodyHtml(product: Product): string {
  if (product.description?.trim()) return product.description;
  const { name, gender, type, material, colors, details, leafCategory } = productFacts(product);
  const heading = productHeading(product);
  const catLine = leafCategory?.name ?? type;
  const colorLine = colors.length ? ` در رنگ ${colors.join(" و ")}` : "";
  const detailLine = details.length ? ` جزئیات ساخت: ${details.join("، ")}.` : "";
  const catHref = leafCategory
    ? `/shop?cat=${encodeURIComponent(normalizeSlug(leafCategory.slug))}`
    : "/shop";
  const genderLink = genderHref(gender);
  const genderHtml = gender && genderLink
    ? ` در <a href="${genderLink}">کلکسیون ${escapeHtml(gender)}</a>`
    : gender
      ? ` در کلکسیون ${escapeHtml(gender)}`
      : "";
  const ostrichLink = /شترمرغ/.test(material)
    ? ` برای خرید پوست و چرم خام، <a href="/wholesale">فروش عمده تنه و ساق</a> را ببینید.`
    : "";

  return `<p><strong>${escapeHtml(heading)}</strong> — مدل «${escapeHtml(name)}» از <a href="${catHref}">${escapeHtml(catLine)}</a>${genderHtml} چرم کارن تبریز.</p>
<p>${escapeHtml(materialCopy(material))}${escapeHtml(colorLine)}. ${escapeHtml(typeUseCopy(type, gender))}${escapeHtml(detailLine)}</p>
<p>این ${escapeHtml(type)} در کارگاه تبریز دوخته می‌شود و با <strong>گارانتی ۲ ساله</strong> اصالت و کیفیت عرضه می‌گردد. ساخت ایران، رنگرزی استاندارد، ارسال به سراسر کشور.</p>
<p>مشاهده <a href="/shop">فروشگاه آنلاین چرم کارن</a>، <a href="${catHref}">سایر مدل‌های ${escapeHtml(catLine)}</a> یا <a href="/contact">تماس برای مشاوره خرید</a>.${ostrichLink}</p>`;
}

export function productDisplayTags(product: Product): ProductTag[] {
  return productFacts(product).tags;
}
