import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const port = Number(process.env.PORT || 4173);

if (!fs.existsSync(dist)) {
  console.error("Run npm run build first.");
  process.exit(1);
}

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".php": "text/plain; charset=utf-8",
};

const { isKnownSpaPath, applySpaHtml } = await import(pathToFileURL(path.join(__dirname, "generate-seo.mjs")).href);
const shareFile = path.join(dist, "share-pages.json");
const shareData = fs.existsSync(shareFile) ? JSON.parse(fs.readFileSync(shareFile, "utf8")) : { pages: {}, products: {} };

http
  .createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === "/sitemap.xml" || pathname === "/sitemap.php") {
      const dataPath = path.join(dist, "sitemap-data.xml");
      if (fs.existsSync(dataPath)) {
        res.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" });
        fs.createReadStream(dataPath).pipe(res);
        return;
      }
    }

    const filePath = path.join(dist, pathname === "/" ? "index.html" : pathname);
    if (
      pathname !== "/" &&
      filePath.startsWith(dist) &&
      fs.existsSync(filePath) &&
      fs.statSync(filePath).isFile() &&
      !filePath.endsWith("index.html")
    ) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const known = isKnownSpaPath(pathname, shareData);
    const html = applySpaHtml(fs.readFileSync(path.join(dist, "index.html"), "utf8"), { pathname, known });
    const headers = { "Content-Type": "text/html; charset=utf-8" };
    if (!known || pathname === "/cart" || pathname.startsWith("/admin")) {
      headers["X-Robots-Tag"] = "noindex, nofollow";
    }
    res.writeHead(known ? 200 : 404, headers);
    res.end(html);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Preview: http://127.0.0.1:${port}`);
  });
