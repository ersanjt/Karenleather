import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const productsPath = path.join(root, "_content/products.json");
const categoriesPath = path.join(root, "_content/categories.json");

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf8"));
const catById = new Map(categories.map((c) => [c.term_id, c]));

const WOMEN_ROOT = 18;
const MEN_ROOT = 19;
const ACCESSORY_ROOT = 40;
const GENERIC = new Set(["زنانه", "مردانه", "کفش", "کیف", "بدون دسته‌بندی"]);

const COLORS = [
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

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cleanTitle(title) {
  return String(title ?? "")
    .replace(/^مدل:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function ancestors(termId) {
  const out = [];
  let id = termId;
  const seen = new Set();
  while (id && !seen.has(id)) {
    seen.add(id);
    const cur = catById.get(id);
    if (!cur) break;
    out.push(cur);
    id = cur.parent;
  }
  return out;
}

function genderOf(product) {
  for (const ref of product.categories || []) {
    const ids = ancestors(ref.id).map((c) => c.term_id);
    if (ids.includes(MEN_ROOT)) return "مردانه";
    if (ids.includes(WOMEN_ROOT)) return "زنانه";
    if (ids.includes(ACCESSORY_ROOT)) return "اکسسوری";
  }
  return "";
}

function colorsOf(title) {
  const found = [];
  for (const [re, label] of COLORS) {
    if (re.test(title) && !found.includes(label)) found.push(label);
  }
  return found;
}

function materialOf(title) {
  if (/شترمرغ|ostrich/i.test(title)) {
    if (/تنه/.test(title)) return "چرم تنه شترمرغ";
    if (/ساق/.test(title)) return "چرم ساق شترمرغ";
    return "چرم طبیعی شترمرغ";
  }
  const parts = [];
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

function typeOf(title, leaf) {
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
  return leaf?.name || "محصول چرم";
}

function detailsOf(title) {
  const details = [];
  const push = (label) => {
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
  if (/نمونه ۲/.test(title)) push("نمونه بافت دوم");
  if (/نمونه ۳/.test(title)) push("نمونه بافت سوم");
  return details;
}

function toFaDigits(value) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

function headingOf(name, gender, type) {
  const genderPart = gender && gender !== "اکسسوری" ? gender : "";
  const hasType = Boolean(type && type !== "محصول چرم" && name.includes(type));
  const hasGender = Boolean(genderPart && name.includes(genderPart));
  if (hasType && hasGender) return name;
  if (hasType && genderPart) return name.replace(type, `${type} ${genderPart}`);
  if (!hasType && type && type !== "محصول چرم" && genderPart) return `${type} ${genderPart} ${name}`;
  if (!hasType && type && type !== "محصول چرم") return `${type} ${name}`;
  if (genderPart && !hasGender) return `${genderPart} ${name}`;
  return name;
}

function decodeSlug(slug) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function materialEssay(material, name) {
  if (material.includes("تنه شترمرغ")) {
    return `رویه از ${material} است؛ بافت نقاط طبیعی تنه روی «${name}» مشخص است و با چرم گاوی معمولی فرق دارد. این چرم از لوکس‌ترین پوست‌های تزئینی جهان است و در کارگاه تبریز برش و دوخته می‌شود.`;
  }
  if (material.includes("ساق شترمرغ")) {
    return `جنس کار ${material} با نقش پوست‌مار است. ساق شترمرغ برای جزئیات باریک مثل کمربند مناسب است و سطح آن با تنه فرق دارد.`;
  }
  if (material.includes("شترمرغ")) {
    return `این مدل با ${material} ساخته شده و بافت نقاط شترمرغ امضای کلکسیون کارن است.`;
  }
  if (material.includes("وجیتال") && material.includes("کروکو")) {
    return `ترکیب ${material} یعنی پایه گیاه‌دباغی وجیتال با نقش پرس‌شده کروکو روی چرم گاوی — ظاهر لاکچری بدون پوست کروکودیل.`;
  }
  if (material.includes("وجیتال") && material.includes("پیتون")) {
    return `${material} یعنی رویه گیاه‌دباغی با چاپ فلس پیتون؛ نقش مشخص است ولی جنس، چرم طبیعی گاوی است نه پوست مار.`;
  }
  if (material.includes("فلوتر") && material.includes("کروکو")) {
    return `${material} دانه درشت فلوتر را با بافت کروکو ترکیب می‌کند تا هم دوام خط‌وخش بالا باشد هم جلوه مجلسی حفظ شود.`;
  }
  if (material.includes("وجیتال")) {
    return `${material} گیاه‌دباغی است، سطح طبیعی و تنفس‌پذیر دارد و برای استفاده روزانه و رسمی هر دو مناسب است.`;
  }
  if (material.includes("فلوتر")) {
    return `${material} دانه درشت و مقاوم در برابر خط است؛ برای بوت، لوفر و کیف اداری که زیاد جابه‌جا می‌شوند انتخاب کارگاهی است.`;
  }
  if (material.includes("نابوک")) {
    return `${material} سطح جیرمانند و مات دارد. لمس مخملی است و برای اسنیکر، کالج و مدل‌های شهری کارن استفاده می‌شود.`;
  }
  if (material.includes("ورنی")) {
    return `${material} براق است و برای استایل رسمی و مجلسی انتخاب می‌شود؛ سطح را از رطوبت و گردوغبار دور نگه دارید.`;
  }
  if (material.includes("حصیری")) {
    return `${material} بافت حصیری روی چرم طبیعی دارد و به لوفر و کالج عمق بصری می‌دهد.`;
  }
  if (material.includes("لیزری")) {
    return `${material} نقش لیزری ظریف روی رویه دارد؛ جزئیات طرح فقط روی همین مدل تکرار می‌شود.`;
  }
  if (material.includes("خشتی")) {
    return `${material} نقش خشتی هندسی دارد و برای کفش تخت روزمره زنانه طراحی شده است.`;
  }
  if (material.includes("کروکو")) {
    return `${material} پرس‌شده روی چرم گاوی است، نه پوست کروکودیل. جلوه لاکچری می‌دهد و در مجلسی و کیف‌های شب کارن زیاد دیده می‌شود.`;
  }
  if (material.includes("پیتون")) {
    return `${material} چاپ فلس روی چرم طبیعی است. نقش مشخص است و با رنگ مدل هماهنگ شده.`;
  }
  return `${material} در خط تولید تبریز دباغی و برش می‌شود. دوخت کارگاهی و کنترل کیفیت روی هر جفت یا هر قطعه انجام می‌گیرد.`;
}

function useEssay(type, gender, name, details) {
  const who = gender && gender !== "اکسسوری" ? gender : "";
  const d = details.join("، ");
  const extra = d ? ` جزئیات ساخت این مدل: ${d}.` : "";
  switch (type) {
    case "کفش مجلسی":
      return who === "زنانه"
        ? `«${name}» کفش مجلسی زنانه است برای مهمانی، عقد و استایل رسمی. پاشنه و رویه برای ایستادن طولانی در مجلس در نظر گرفته شده.${extra}`
        : `«${name}» کفش مجلسی مردانه است برای محل کار، جلسه و مراسم. فرم آکسفورد/رسمی با کت‌وشلوار قهوه‌ای، سرمه‌ای یا مشکی هماهنگ می‌شود.${extra}`;
    case "لوفر":
    case "کالج":
      return `سبک ${type} بدون بند یا با سگک، برای استفاده روزانه و کژوال‌رسمی است. «${name}» را می‌توان با شلوار پارچه‌ای یا جین تیره پوشید.${extra}`;
    case "بوت":
      return `پوشش ساق بوت در فصل سرد و پیاده‌روی شهری کمک می‌کند. «${name}» برای پاییز و زمستان تبریز و سفر طراحی شده است.${extra}`;
    case "اسنیکر":
      return `اسنیکر چرم کارن راحتی کتانی را با رویه چرم طبیعی جمع می‌کند. «${name}» برای استایل شهری، دانشگاه و سفر کوتاه مناسب است.${extra}`;
    case "صندل":
      return `صندل تابستانه با رویه چرم؛ سبک است و برای گردش روزانه و مجلس غیررسمی تابستان به کار می‌آید.${extra}`;
    case "کفش تخت":
      return `کفش تخت چرم بدون پاشنه بلند، برای راحتی روزمره زنانه. «${name}» را می‌توان تمام‌روز در شهر پوشید.${extra}`;
    case "کمربند":
      return `کمربند چرم کارن برای شلوار رسمی و کژوال است. عرض و بافت (تنه یا ساق شترمرغ) در عنوان مدل مشخص شده تا با سگک و حلقه شلوار جور درآید.${extra}`;
    case "کیف اداری":
      return `برای حمل مدارک، لپ‌تاپ سبک و لوازم کار. یراق و قفل در این خانواده سامسونت مشخص است و دوخت برای استفاده اداری تقویت شده.${extra}`;
    case "جاکارتی":
      return `جاکارتی جمع‌وجور برای کارت بانکی و شناسایی. در جیب کت یا کیف اداری جا می‌شود.${extra}`;
    case "کیف پاسپورتی":
      return `کیف پاسپورتی برای مدارک سفر، کارت و اسکناس. مدل آلبوم‌دار برگه‌های جدا دارد.${extra}`;
    case "کاور موبایل":
      return `کاور تمام‌چرم شترمرغ برای آیفون X؛ محافظت از بدنه با بافت طبیعی نقاط، نه پلاستیک معمولی.${extra}`;
    case "کیف":
      return who === "زنانه"
        ? `کیف زنانه برای همراهی روزانه، مجلس یا استفاده رودوشی. فرم مستطیلی یا دسته‌دار در عنوان آمده است.${extra}`
        : `کیف مردانه برای مدارک و استفاده روزانه کنار کت یا بدون کت.${extra}`;
    default:
      return `این ${type} دست‌دوز کارگاه تبریز است و برای استفاده واقعی روزمره و رسمی ساخته شده، نه ویترین.${extra}`;
  }
}

function pairingEssay(type, colors, id) {
  const color = colors[0] || "چرم طبیعی";
  const bank = [
    `رنگ ${color} با پارچه‌های خنثی، کرم و سرمه‌ای راحت ست می‌شود.`,
    `اگر استایل شما روشن است، ${color} نقطه تمرکز می‌سازد؛ اگر تیره است، با مشکی و زغالی یکدست می‌ماند.`,
    `برای ست رسمی، ${color} را با کمربند یا کیف هم‌خانواده چرم کارن هماهنگ کنید.`,
    `در نور روز بافت چرم ${color} بیشتر دیده می‌شود؛ برای عکس محصول همین گالری را ببینید.`,
  ];
  if (type === "کمربند") {
    return `این کمربند ${color} را با کفش یا کیف هم‌رنگ چرم کارن ست کنید تا مجموعه یکدست بماند.`;
  }
  return bank[id % bank.length];
}

function namedEssay(name) {
  if (/^101\b/.test(name)) return "مدل ۱۰۱ از پرفروش‌های مجلسی مردانه کارن است و فرم کلاسیک وجیتال قهوه‌ای دارد.";
  if (/^102\b/.test(name)) return "مدل ۱۰۲ رویه ورنی براق دارد و برای مراسم رسمی‌تر از وجیتال مات انتخاب می‌شود.";
  if (/تیمبرلند/.test(name)) return "فرم تیمبرلند در کلکسیون کارن با رویه نابوک اجرا شده؛ ظاهر کوهنوردی شهری دارد نه کپی برند خارجی.";
  if (/کترپیلار/.test(name)) return "فرم کترپیلار با نابوک حوله‌ای برای استفاده خشن‌تر شهری و پاییز است.";
  if (/سامسونت/.test(name)) return "سامسونت کارن برای دفتر و جلسه ساخته شده؛ قفل و یراق بخشی از هویت مدل است.";
  if (/گلوریا/.test(name)) return "گلوریا کیف مجلسی زنانه بافت کروکو است برای شب و مهمانی.";
  if (/ماسیمو/.test(name)) return "ماسیمو اسنیکر وجیتال کارن است؛ سه رنگ در کاتالوگ برای ست‌های مختلف آمده.";
  if (/گوچی/.test(name)) return "نام «گوچی» در کاتالوگ کارن به فرم لوفر اشاره دارد، نه برند ایتالیایی؛ دوخت و چرم تولید تبریز است.";
  if (/اتزیو|باکسر|لوکاس|لوفر وجیتال/.test(name)) return "این لوفر مردانه از خط کالج کارن است و برای استفاده بدون بند طراحی شده.";
  if (/سارا|لیزا|ملیسا|مرلین|مدوسا|میوسا|ویکتوریا|پاچو/.test(name)) {
    return `نام «${name.split(" ")[0]}» در کاتالوگ زنانه کارن برای تشخیص فرم آخرین و پاشنه به کار می‌رود.`;
  }
  if (/آیفون/.test(name)) return "کاور فقط برای اندازه آیفون X برش خورده است؛ مدل‌های جدیدتر گوشی را جدا استعلام کنید.";
  if (/نمونه ۲/.test(name)) return "این نسخه، نمونه دوم همان رنگ قهوه‌ای تنه شترمرغ است؛ عکس و بافت با کالای اول فرق دارد.";
  if (/نمونه ۳/.test(name)) return "این نسخه، نمونه سوم همان رنگ است تا خریدار بتواند بافت نقاط را روی سه فریم جدا ببیند.";
  return "";
}

function wordCount(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function compose(product) {
  const name = cleanTitle(product.title);
  const gender = genderOf(product);
  const leaf =
    (product.categories || []).find((c) => !GENERIC.has(c.name)) || product.categories?.[0];
  const type = typeOf(name, leaf);
  const material = materialOf(name);
  const colors = colorsOf(name);
  const details = detailsOf(name);
  const heading = toFaDigits(headingOf(name, gender, type));
  const sku = product.sku || `KL-${product.id}`;
  const shots = (product.images || []).length;
  const catName = leaf?.name || type;
  const catHref = leaf ? `/shop?cat=${encodeURIComponent(decodeSlug(leaf.slug))}` : "/shop";
  const genderHref =
    gender === "مردانه" ? "/shop?cat=men" : gender === "زنانه" ? `/shop?cat=${encodeURIComponent("زنانه")}` : "/shop?cat=aksesori";
  const colorLine = colors.length ? ` رنگ ${colors.join(" و ")}` : "";
  const whoHtml =
    gender && gender !== "اکسسوری"
      ? ` در <a href="${genderHref}">کلکسیون ${esc(gender)}</a>`
      : gender === "اکسسوری"
        ? " در کلکسیون اکسسوری"
        : "";
  const named = namedEssay(name);
  const ostrich = /شترمرغ/.test(material)
    ? ` اگر پوست خام تنه و ساق می‌خواهید، صفحه <a href="/wholesale">فروش عمده چرم شترمرغ</a> را ببینید.`
    : "";
  const gallery =
    shots > 1
      ? ` گالری همین صفحه ${shots.toLocaleString("fa-IR")} نمای جدا از «${name}» دارد.`
      : ` برای این مدل یک نمای اصلی در کاتالوگ ثبت شده است.`;
  const priceNote = String(product.price || "").trim()
    ? ""
    : " قیمت این کالا در فروشگاه ثبت نشده؛ برای استعلام از صفحه تماس یا واتساپ پیام بدهید.";

  const p1 = `<p><strong>${esc(heading)}</strong> با کد ${esc(sku)} از دسته <a href="${catHref}">${esc(catName)}</a>${whoHtml} چرم کارن تبریز است.${esc(colorLine ? ` این مدل${colorLine} دیده می‌شود.` : "")} رویه ${esc(material)} است و در کارگاه از سال ۱۳۹۴ با استاندارد دوخت کارن ساخته می‌شود.</p>`;
  const p2full = `<p>${esc(materialEssay(material, name))}</p>`;
  const p2short = `<p>رویه ${esc(material)} است؛ برش و دوخت در کارگاه تبریز انجام می‌شود.</p>`;
  const p3full = `<p>${esc(useEssay(type, gender, name, details))}${named ? ` ${esc(named)}` : ""}</p>`;
  const p3short = `<p>${esc(useEssay(type, gender, name, details))}</p>`;
  const p4full = `<p>${esc(pairingEssay(type, colors, product.id))}${esc(gallery)} هر قطعه با <strong>گارانتی ۲ ساله</strong> اصالت چرم و خدمات پس از فروش در دفتر تبریز عرضه می‌شود. ساخت ایران، رنگرزی استاندارد، ارسال به سراسر کشور.${esc(priceNote)}</p>`;
  const p4short = `<p>هر قطعه با <strong>گارانتی ۲ ساله</strong> اصالت چرم و خدمات پس از فروش در دفتر تبریز عرضه می‌شود. ساخت ایران، ارسال سراسری.${esc(priceNote)}</p>`;
  const p5 = `<p>مشاهده <a href="/shop">فروشگاه آنلاین چرم کارن</a>، <a href="${catHref}">سایر مدل‌های ${esc(catName)}</a> یا <a href="/contact">تماس برای مشاوره خرید</a>.${ostrich}</p>`;
  const p5min = `<p>مشاهده <a href="/shop">فروشگاه آنلاین چرم کارن</a> یا <a href="/contact">تماس برای مشاوره خرید</a>.</p>`;

  const candidates = [
    p1 + p2full + p3full + p4full + p5,
    p1 + p2full + p3full + p4short + p5,
    p1 + p2short + p3full + p4short + p5,
    p1 + p2short + p3short + p4short + p5,
    p1 + p2short + p3short + p4short + p5min,
  ];
  let html = candidates.find((h) => wordCount(h) <= 150) || candidates[candidates.length - 1];
  const fillers = [
    `دوخت داخلی و کنترل کیفیت روی کد ${sku} جدا از مدل‌های هم‌خانواده انجام می‌شود.`,
    `اگر سایز یا موجودی رنگ ${colors[0] || "این مدل"} را می‌خواهید، قبل از سفارش از فروشگاه بپرسید.`,
    `چرم را از باران شدید و حرارت مستقیم دور نگه دارید.`,
  ];
  let i = 0;
  while (wordCount(html) < 80 && i < fillers.length) {
    const extra = `<p>${esc(fillers[(product.id + i) % fillers.length])}</p>`;
    const next = p1 + p2short + extra + p3short + p4short + p5min;
    if (wordCount(next) <= 150) html = next;
    i += 1;
  }
  return html.replace(/\s+<\/p>/g, "</p>");
}

function excerptFrom(name, type, sku, colors) {
  const color = colors.length ? ` رنگ ${colors.join(" و ")}` : "";
  const raw = `خرید ${name} از کارگاه چرم کارن تبریز — ${type}${color}. کد ${sku}. دست‌ساز، گارانتی ۲ ساله، ارسال سراسری.`;
  const chars = [...raw];
  return chars.length <= 160 ? raw : `${chars.slice(0, 157).join("").trim()}…`;
}

const seenDesc = new Set();
const stats = { words: [], dup: 0, short: [], long: [] };

for (const product of products) {
  product.title = cleanTitle(product.title);
  const name = product.title;
  const leaf =
    (product.categories || []).find((c) => !GENERIC.has(c.name)) || product.categories?.[0];
  const type = typeOf(name, leaf);
  const colors = colorsOf(name);
  const sku = product.sku || `KL-${product.id}`;
  product.sku = sku;
  product.excerpt = excerptFrom(name, type, sku, colors);
  product.description = compose(product);

  const n = wordCount(product.description);
  stats.words.push(n);
  if (n < 80) stats.short.push({ id: product.id, n });
  if (n > 150) stats.long.push({ id: product.id, n });
  if (seenDesc.has(product.description)) stats.dup += 1;
  seenDesc.add(product.description);

  const cat = leaf?.name ?? "چرم طبیعی";
  (product.images || []).forEach((img, index) => {
    const base = `${name} — ${cat} — چرم کارن`;
    img.alt = index > 0 ? `${base} — نمای ${String(index + 1).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])}` : base;
  });
}

fs.writeFileSync(productsPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");

const avg = Math.round(stats.words.reduce((a, b) => a + b, 0) / stats.words.length);
const stillModel = products.filter((p) => /^مدل:/.test(p.title)).length;
const missingLinks = products.filter(
  (p) => !p.description.includes('href="/shop"') || !p.description.includes('href="/contact"'),
).length;

console.log(
  JSON.stringify(
    {
      count: products.length,
      stillModel,
      missingLinks,
      unique: seenDesc.size,
      dup: stats.dup,
      avgWords: avg,
      min: Math.min(...stats.words),
      max: Math.max(...stats.words),
      short: stats.short,
      long: stats.long,
      sample101: products.find((p) => p.id === 1165)?.title,
      words101: wordCount(products.find((p) => p.id === 1165)?.description || ""),
    },
    null,
    2,
  ),
);
