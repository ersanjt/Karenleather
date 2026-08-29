import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentRoot = path.resolve(root, "../_content");

function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function generateSeoFiles(outDir) {

const SITE = "https://karenleather.com";

const products = JSON.parse(fs.readFileSync(path.join(contentRoot, "products.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(contentRoot, "categories.json"), "utf8"));
const seoPages = JSON.parse(fs.readFileSync(path.join(root, "src/content/seoPages.json"), "utf8"));

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function productLoc(p) {
  const slug = encodeURIComponent(safeDecode(p.slug));
  return `${SITE}/product/${p.id}/${slug}`;
}

function catLoc(c) {
  return `${SITE}/shop?cat=${encodeURIComponent(safeDecode(c.slug))}`;
}

const today = new Date().toISOString().slice(0, 10);
const urls = [];

const staticRoutes = [
  { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly", lastmod: today },
  { loc: `${SITE}/shop`, priority: "0.95", changefreq: "daily", lastmod: today },
  { loc: `${SITE}/about`, priority: "0.8", changefreq: "monthly", lastmod: today },
  { loc: `${SITE}/contact`, priority: "0.8", changefreq: "monthly", lastmod: today },
  { loc: `${SITE}/wholesale`, priority: "0.85", changefreq: "monthly", lastmod: today },
  { loc: `${SITE}/representation`, priority: "0.75", changefreq: "monthly", lastmod: today },
  { loc: `${SITE}/sitemap.html`, priority: "0.4", changefreq: "weekly", lastmod: today },
];

for (const r of staticRoutes) urls.push(r);

for (const p of products) {
  urls.push({
    loc: productLoc(p),
    lastmod: p.modified?.slice(0, 10) || undefined,
    priority: "0.7",
    changefreq: "weekly",
  });
}

for (const c of categories) {
  if (![18, 19, 40].includes(c.term_id) && (!c.count || c.count <= 0)) continue;
  urls.push({
    loc: catLoc(c),
    priority: "0.65",
    changefreq: "weekly",
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${esc(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

fs.mkdirSync(outDir, { recursive: true });

const publicDir = path.join(root, "public");
if (fs.existsSync(publicDir)) {
  for (const name of fs.readdirSync(publicDir)) {
    if (name === "sitemap.xml") continue;
    const from = path.join(publicDir, name);
    if (fs.statSync(from).isFile()) {
      fs.copyFileSync(from, path.join(outDir, name));
    }
  }
}

fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);
writeHtmlSitemap(outDir, SITE, urls, products, categories);
writeSharePages(outDir, SITE, products, categories, seoPages);

console.log(`SEO files: ${urls.length} URLs → ${path.join(outDir, "sitemap.xml")}`);
}

const OG_SIZE = { width: 1200, height: 630 };

function writeHtmlSitemap(outDir, SITE, urls, products, categories) {
  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const productHref = (p) => `${SITE}/product/${p.id}/${encodeURIComponent(safeDecode(p.slug))}`;
  const catHref = (c) => `${SITE}/shop?cat=${encodeURIComponent(safeDecode(c.slug))}`;
  const staticLinks = [
    ["صفحه اصلی", `${SITE}/`],
    ["فروشگاه", `${SITE}/shop`],
    ["درباره ما", `${SITE}/about`],
    ["تماس با ما", `${SITE}/contact`],
    ["فروش عمده", `${SITE}/wholesale`],
    ["نمایندگی", `${SITE}/representation`],
  ];
  const catLinks = categories
    .filter((c) => [18, 19, 40].includes(c.term_id) || (c.count && c.count > 0))
    .map((c) => [c.name, catHref(c)]);
  const productLinks = products.map((p) => [cleanTitle(p.title), productHref(p)]);

  const list = (items) =>
    items
      .map(([label, href]) => `      <li><a href="${esc(href)}">${esc(label)}</a></li>`)
      .join("\n");

  const html = `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>نقشه سایت — چرم کارن</title>
    <meta name="description" content="فهرست صفحات، دسته‌ها و ${products.length} محصول فروشگاه چرم کارن تبریز." />
    <link rel="canonical" href="${SITE}/sitemap.html" />
    <style>
      body { font-family: Tahoma, sans-serif; margin: 0 auto; max-width: 52rem; padding: 1.5rem; color: #041434; }
      h1 { font-size: 1.4rem; }
      h2 { font-size: 1.1rem; margin-top: 2rem; }
      ul { line-height: 1.9; padding-right: 1.2rem; }
      a { color: #041434; }
    </style>
  </head>
  <body>
    <h1>نقشه سایت چرم کارن</h1>
    <p>فهرست صفحات ایندکس‌شونده فروشگاه — ${urls.length.toLocaleString("fa-IR")} آدرس.</p>
    <h2>صفحات اصلی</h2>
    <ul>
${list(staticLinks)}
    </ul>
    <h2>دسته‌ها</h2>
    <ul>
${list(catLinks)}
    </ul>
    <h2>محصولات</h2>
    <ul>
${list(productLinks)}
    </ul>
  </body>
</html>
`;
  fs.writeFileSync(path.join(outDir, "sitemap.html"), html);
}

function ogCard(site, file, alt) {
  return {
    image: `${site}/uploads/campaign/og/${file}`,
    imageAlt: alt,
    ...OG_SIZE,
  };
}

function uploadAbs(site, file) {
  if (!file) return `${site}/uploads/campaign/og/og-home-1200x630.jpg`;
  const rel = String(file).split("?")[0].replace(/^\/+/, "").replace(/^uploads\//, "");
  return `${site}/uploads/${rel}`;
}

function cleanTitle(title) {
  return String(title || "").replace(/^مدل:\s*/i, "").replace(/\s+/g, " ").trim();
}

function detectMaterial(title) {
  if (/شترمرغ|ostrich/i.test(title)) {
    if (/تنه/.test(title)) return "چرم تنه شترمرغ";
    if (/ساق/.test(title)) return "چرم ساق شترمرغ";
    return "چرم طبیعی شترمرغ";
  }
  const parts = [];
  if (/وجیتال/i.test(title)) parts.push("وجیتال");
  if (/فلوتر/i.test(title)) parts.push("فلوتر");
  if (/نابوک/i.test(title)) parts.push("نابوک");
  if (/ورنی/.test(title)) parts.push("ورنی");
  if (/حصیری/.test(title)) parts.push("حصیری");
  if (/لیزری/.test(title)) parts.push("لیزری");
  if (/حوله‌/.test(title)) parts.push("حوله‌ای");
  if (/خشتی/.test(title)) parts.push("خشتی");
  if (/کروکو/i.test(title)) parts.push("بافت کروکو");
  if (/پیتون/i.test(title)) parts.push("بافت پیتون");
  if (!parts.length) return "چرم طبیعی گاوی";
  return `چرم ${parts.join("، ")}`;
}

function typeFromTitle(title) {
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
  return "";
}

function productShareMeta(p, catById) {
  const name = cleanTitle(p.title);
  const generic = new Set(["زنانه", "مردانه", "کفش", "کیف", "بدون دسته‌بندی"]);
  const leaf = (p.categories || []).find((c) => !generic.has(c.name)) || p.categories?.[0];
  const type = typeFromTitle(name) || leaf?.name || "محصول چرم";
  let gender = "";
  for (const ref of p.categories || []) {
    const seen = new Set();
    let id = ref.id;
    while (id && !seen.has(id)) {
      seen.add(id);
      if (id === 19) {
        gender = "مردانه";
        break;
      }
      if (id === 18) {
        gender = "زنانه";
        break;
      }
      if (id === 40) {
        gender = "اکسسوری";
        break;
      }
      id = catById.get(id)?.parent || 0;
    }
    if (gender) break;
  }
  const material = detectMaterial(name);
  const who = gender && gender !== "اکسسوری" ? ` ${gender}` : "";
  const description = p.excerpt?.trim()
    ? p.excerpt.trim()
    : `خرید ${name} از چرم کارن تبریز — ${type}${who}. ${material} دست‌ساز، گارانتی ۲ ساله، ارسال سراسری.`;
  const keywords = [name, `${type} چرم`, gender, material, "چرم کارن", "تبریز", `خرید ${type}`]
    .filter(Boolean)
    .join(", ");
  return { name, type, description, keywords, leaf };
}

function writeSharePages(outDir, SITE, products, categories, seoPages) {
  const homeOg = ogCard(SITE, "og-home-1200x630.jpg", "ست کیف و بوت چرم زرد کارن تبریز روی سنگفرش");
  const shopOg = ogCard(SITE, "og-shop-1200x630.jpg", "کیف چرم زرشکی بافت کروکو با دسته‌گرد کارن تبریز");
  const aboutOg = ogCard(SITE, "og-about-1200x630.jpg", "کیف چرم زرد کارن در برابر معماری تاریخی تبریز");
  const contactOg = ogCard(SITE, "og-contact-1200x630.jpg", "نمای فروشگاه چرم کارن — شعبه هتل شهریار تبریز");
  const menOg = ogCard(SITE, "og-men-1200x630.jpg", "لوفر مردانه چرم شترمرغ کارن با سگک فلزی روی پوست طبیعی");
  const wholesaleOg = ogCard(SITE, "og-wholesale-1200x630.jpg", "اسنیکر چرم شترمرغ کهنه‌ای کارن — کلکسیون کفش");

  const catById = new Map(categories.map((c) => [c.term_id, c]));

  const pages = {
    "/": {
      title: seoPages.home.title,
      description: seoPages.home.description,
      keywords: seoPages.home.keywords,
      type: "website",
      ...homeOg,
    },
    "/shop": {
      title: seoPages.shop.title,
      description: seoPages.shop.description,
      keywords: seoPages.shop.keywords,
      type: "website",
      ...shopOg,
    },
    "/shop?filter=women": {
      title: `${seoPages.filters.women.title} — چرم کارن`,
      description: seoPages.filters.women.description,
      keywords: seoPages.filters.women.keywords,
      type: "website",
      ...homeOg,
    },
    "/shop?filter=men": {
      title: `${seoPages.filters.men.title} — چرم کارن`,
      description: seoPages.filters.men.description,
      keywords: seoPages.filters.men.keywords,
      type: "website",
      ...menOg,
    },
    "/shop?filter=footwear": {
      title: `${seoPages.filters.footwear.title} — چرم کارن`,
      description: seoPages.filters.footwear.description,
      keywords: seoPages.filters.footwear.keywords,
      type: "website",
      ...menOg,
    },
    "/shop?filter=accessories": {
      title: `${seoPages.filters.accessories.title} — چرم کارن`,
      description: seoPages.filters.accessories.description,
      keywords: seoPages.filters.accessories.keywords,
      type: "website",
      ...shopOg,
    },
    "/shop?filter=new": {
      title: `${seoPages.filters.new.title} — چرم کارن`,
      description: seoPages.filters.new.description,
      keywords: seoPages.filters.new.keywords,
      type: "website",
      ...shopOg,
    },
    "/about": {
      title: seoPages.about.title,
      description: seoPages.about.description,
      keywords: seoPages.about.keywords,
      type: "website",
      ...aboutOg,
    },
    "/contact": {
      title: seoPages.contact.title,
      description: seoPages.contact.description,
      keywords: seoPages.contact.keywords,
      type: "website",
      ...contactOg,
    },
    "/wholesale": {
      title: seoPages.wholesale.title,
      description: seoPages.wholesale.description,
      keywords: seoPages.wholesale.keywords,
      type: "website",
      ...wholesaleOg,
    },
    "/representation": {
      title: seoPages.representation.title,
      description: seoPages.representation.description,
      keywords: seoPages.representation.keywords,
      type: "website",
      ...homeOg,
    },
  };

  const genderRoots = new Set([18, 19, 40]);
  for (const c of categories) {
    if (!genderRoots.has(c.term_id) && (!c.count || c.count <= 0)) continue;
    const decoded = safeDecode(c.slug);
    const copy = seoPages.categories[decoded] || seoPages.categories[c.slug];
    const description =
      copy?.description ||
      `خرید ${c.name} چرم طبیعی از چرم کارن تبریز. دست‌ساز، گارانتی ۲ ساله، ارسال به سراسر ایران.`;
    const keywords = copy?.keywords || `${c.name} چرم, خرید ${c.name}, چرم کارن تبریز`;
    const isShoes = /کفش|لوفر|بوت|اسنیکر|footwear|men|مردانه/i.test(`${c.name} ${decoded}`);
    const heading = copy?.title || c.name;
    const entry = {
      title: `${heading} — خرید آنلاین | چرم کارن`,
      description,
      keywords,
      type: "website",
      ...(isShoes ? menOg : shopOg),
    };
    const keys = new Set([
      `/shop?cat=${encodeURIComponent(decoded)}`,
      `/shop?cat=${encodeURIComponent(c.slug)}`,
      `/shop?cat=${c.slug}`,
      `/shop?cat=${decoded}`,
    ]);
    for (const key of keys) pages[key] = entry;
  }

  const productMap = {};
  for (const p of products) {
    const meta = productShareMeta(p, catById);
    const catLabel = meta.leaf?.name ?? meta.type;
    productMap[String(p.id)] = {
      title: `${meta.name} | ${catLabel} — چرم کارن`,
      description: meta.description,
      keywords: meta.keywords,
      image: uploadAbs(SITE, p.images?.[0]?.file),
      imageAlt: `${meta.name} — ${catLabel} — چرم کارن`,
      type: "product",
    };
  }

  fs.writeFileSync(path.join(outDir, "share-pages.json"), JSON.stringify({ pages, products: productMap }));
}

export function isShareCrawler(ua) {
  return /facebookexternalhit|Facebot|WhatsApp|TelegramBot|Twitterbot|LinkedInBot|Slackbot|Pinterest|Discordbot|SkypeUriPreview|redditbot|Embedly|Iframely|vkShare|meta-externalagent|meta-externalfetcher|QQBot|MicroMessenger/i.test(
    ua || "",
  );
}

export function lookupSharePage(data, pathname, searchParams) {
  const pages = data?.pages || {};
  const home = pages["/"] || null;
  const path = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname || "/";
  const product = path.match(/^\/product\/(\d+)/);
  if (product) return data?.products?.[product[1]] || home;

  const keys = [];
  if (path === "/shop") {
    const filter = searchParams.get("filter");
    const cat = searchParams.get("cat");
    if (filter) keys.push(`/shop?filter=${filter}`);
    if (cat) keys.push(`/shop?cat=${encodeURIComponent(cat)}`, `/shop?cat=${cat}`);
    keys.push("/shop");
  }
  keys.push(path, "/");
  for (const k of keys) {
    if (pages[k]) return pages[k];
  }
  return home;
}

export function renderShareHtml(page, canonical) {
  const esc = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const title = page?.title || "چرم کارن";
  const desc = page?.description || "";
  const keywords = page?.keywords || "";
  const image = page?.image || "https://karenleather.com/uploads/campaign/og/og-home-1200x630.jpg";
  const alt = page?.imageAlt || title;
  const width = page?.width || "";
  const height = page?.height || "";
  const type = page?.type || "website";
  const mime = String(image).toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
  const dim =
    width && height
      ? `<meta property="og:image:width" content="${width}" />
    <meta property="og:image:height" content="${height}" />`
      : "";
  const kw = keywords ? `<meta name="keywords" content="${esc(keywords)}" />` : "";
  const productMeta =
    type === "product"
      ? `<meta property="product:brand" content="چرم کارن" />
    <meta property="product:condition" content="new" />`
      : "";
  return `<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    ${kw}
    <link rel="canonical" href="${esc(canonical)}" />
    <link rel="image_src" href="${esc(image)}" />
    <meta itemprop="image" content="${esc(image)}" />
    <meta property="og:type" content="${esc(type)}" />
    ${productMeta}
    <meta property="og:site_name" content="چرم کارن" />
    <meta property="og:locale" content="fa_IR" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:image" content="${esc(image)}" />
    <meta property="og:image:url" content="${esc(image)}" />
    <meta property="og:image:secure_url" content="${esc(image)}" />
    <meta property="og:image:alt" content="${esc(alt)}" />
    <meta property="og:image:type" content="${mime}" />
    ${dim}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${esc(image)}" />
    <meta name="twitter:image:alt" content="${esc(alt)}" />
  </head>
  <body>
    <img src="${esc(image)}" alt="${esc(alt)}" width="${width || 1200}" height="${height || 630}" />
    <h1>${esc(title)}</h1>
    <p>${esc(desc)}</p>
  </body>
</html>`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const target = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, "dist");
  generateSeoFiles(target);
}
