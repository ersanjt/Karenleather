import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentRoot = path.resolve(root, "../_content");
export function generateSeoFiles(outDir) {

const SITE = "https://karenleather.com";

const products = JSON.parse(fs.readFileSync(path.join(contentRoot, "products.json"), "utf8"));
const categories = JSON.parse(fs.readFileSync(path.join(contentRoot, "categories.json"), "utf8"));

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function productLoc(p) {
  const slug = encodeURIComponent(decodeURIComponent(p.slug));
  return `${SITE}/product/${p.id}/${slug}`;
}

const urls = [];

const staticRoutes = [
  { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE}/shop`, priority: "0.95", changefreq: "daily" },
  { loc: `${SITE}/about`, priority: "0.8", changefreq: "monthly" },
  { loc: `${SITE}/contact`, priority: "0.8", changefreq: "monthly" },
  { loc: `${SITE}/wholesale`, priority: "0.85", changefreq: "monthly" },
  { loc: `${SITE}/representation`, priority: "0.75", changefreq: "monthly" },
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
  if (!c.count || c.count <= 0) continue;
  urls.push({
    loc: `${SITE}/shop?cat=${encodeURIComponent(c.slug)}`,
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
fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);

const publicDir = path.join(root, "public");
if (fs.existsSync(publicDir)) {
  for (const name of fs.readdirSync(publicDir)) {
    const from = path.join(publicDir, name);
    if (fs.statSync(from).isFile()) {
      fs.copyFileSync(from, path.join(outDir, name));
    }
  }
}

console.log(`SEO files: ${urls.length} URLs → ${path.join(outDir, "sitemap.xml")}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const target = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, "dist");
  generateSeoFiles(target);
}
