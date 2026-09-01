import { handleAdminApi } from "./admin-api.mjs";
import esbuild from "esbuild";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const uploadsRoot = path.resolve(root, "../wp-content/uploads");
const outFile = path.join(root, "dist-dev", "bundle.js");
const port = Number(process.env.PORT || 5173);
const clients = new Set();

fs.mkdirSync(path.dirname(outFile), { recursive: true });

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".ico": "image/x-icon",
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const cache =
    ext === ".js" || ext === ".css" ? "no-store" : "public, max-age=86400";
  res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream", "Cache-Control": cache });
  fs.createReadStream(filePath).pipe(res);
}

function resolveUpload(relPath) {
  const direct = path.join(uploadsRoot, relPath);
  if (direct.startsWith(uploadsRoot) && fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return direct;
  }

  const dir = path.join(uploadsRoot, path.dirname(relPath));
  const base = path.basename(relPath);
  if (!dir.startsWith(uploadsRoot) || !fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir);
  const norm = (s) => s.toLowerCase().replace(/-scaled/g, "").replace(/-\d+x\d+(?=\.)/gi, "");
  const target = norm(base);

  for (const f of files) {
    if (f.toLowerCase() === base.toLowerCase()) return path.join(dir, f);
  }
  for (const f of files) {
    if (norm(f) === target) return path.join(dir, f);
  }
  return null;
}

const ignoreCssPlugin = {
  name: "ignore-css",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, () => ({
      contents: "export default {};",
      loader: "js",
    }));
  },
};

const ctx = await esbuild.context({
  entryPoints: [path.join(root, "src/main.tsx")],
  outfile: outFile,
  bundle: true,
  format: "esm",
  sourcemap: true,
  treeShaking: false,
  loader: { ".json": "json" },
  alias: {
    "@content": path.resolve(root, "../_content"),
  },
  plugins: [
    ignoreCssPlugin,
    {
      name: "live-reload",
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length) return;
          for (const res of clients) res.write("data: reload\n\n");
        });
      },
    },
  ],
});

await ctx.watch();
const first = await ctx.rebuild();
if (first.errors.length) {
  console.error(first.errors);
  process.exit(1);
}

const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8").replace(
  '<script type="module" src="/src/main.tsx"></script>',
  `<link rel="stylesheet" href="/src/index.css" />
    <script type="module" src="/dist-dev/bundle.js" onerror="window.__klBundleFailed&&window.__klBundleFailed()"></script>
    <script>
      window.__klBundleFailed = function () {
        var el = document.getElementById("initial-loader");
        if (el) {
          el.innerHTML = '<p style="color:#fff;font-family:Tahoma,sans-serif;text-align:center;padding:1rem">بارگذاری ناموفق شد. Ctrl+Shift+R را بزنید.</p>';
        }
      };
      var reloadTimer;
      new EventSource("/esbuild-events").addEventListener("message", function () {
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(function () { location.reload(); }, 400);
      });
    </script>`,
);

function renderIndex(pathname = "/") {
  const bust = fs.existsSync(outFile) ? fs.statSync(outFile).mtimeMs : Date.now();
  const cssFile = path.join(root, "src/index.css");
  const cssBust = fs.existsSync(cssFile) ? fs.statSync(cssFile).mtimeMs : Date.now();
  let html = indexHtml
    .replace("/dist-dev/bundle.js", `/dist-dev/bundle.js?v=${bust}`)
    .replace("/src/index.css", `/src/index.css?v=${cssBust}`);
  if (pathname.startsWith("/admin")) {
    html = html.replace("</head>", '    <link rel="stylesheet" href="/src/admin/admin.css" />\n  </head>');
  }
  return html;
}

const devOut = path.join(root, "dist-dev");
const { generateSeoFiles, isShareCrawler, lookupSharePage, renderShareHtml, isKnownSpaPath, applySpaHtml, notFoundSharePage } = await import(pathToFileURL(path.join(__dirname, "generate-seo.mjs")).href);
generateSeoFiles(devOut);
const shareData = JSON.parse(fs.readFileSync(path.join(devOut, "share-pages.json"), "utf8"));

function sendSpa(res, pathname) {
  const known = isKnownSpaPath(pathname, shareData);
  const html = applySpaHtml(renderIndex(pathname), { pathname, known });
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  };
  if (!known || pathname === "/cart" || pathname.startsWith("/admin")) {
    headers["X-Robots-Tag"] = "noindex, nofollow";
  }
  res.writeHead(known ? 200 : 404, headers);
  res.end(html);
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/api/")) {
      const handled = await handleAdminApi(req, res, pathname);
      if (handled !== false) return;
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    if (pathname === "/esbuild-events") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }

    if (pathname === "/robots.txt" || pathname === "/sitemap.html") {
      const filePath = path.join(devOut, pathname.slice(1));
      if (fs.existsSync(filePath)) {
        sendFile(res, filePath);
        return;
      }
    }

    if (pathname === "/sitemap.xml" || pathname === "/sitemap.php") {
      const dataPath = path.join(devOut, "sitemap-data.xml");
      if (fs.existsSync(dataPath)) {
        res.writeHead(200, {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        });
        fs.createReadStream(dataPath).pipe(res);
        return;
      }
    }

    if (pathname.startsWith("/uploads/")) {
      const rel = pathname.slice("/uploads/".length);
      const filePath = resolveUpload(rel);
      if (filePath) {
        sendFile(res, filePath);
        return;
      }
    }

    const ua = req.headers["user-agent"] ?? "";
    if (
      !pathname.startsWith("/src/") &&
      !pathname.startsWith("/dist-dev/") &&
      (isShareCrawler(ua) || url.searchParams.has("ogpreview"))
    ) {
      const page = lookupSharePage(shareData, pathname, url.searchParams);
      const known = isKnownSpaPath(pathname, shareData);
      let canonical = page?.url || `https://karenleather.com${pathname === "/" ? "/" : pathname}`;
      if (!page?.url && pathname === "/shop") {
        const cat = url.searchParams.get("cat");
        const filter = url.searchParams.get("filter");
        if (cat) canonical += `?cat=${encodeURIComponent(cat)}`;
        else if (filter) canonical += `?filter=${encodeURIComponent(filter)}`;
      }
      const payload = page || (known ? null : notFoundSharePage(canonical));
      if (!payload) {
        sendSpa(res, pathname);
        return;
      }
      const status = page ? 200 : 404;
      const headers = { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" };
      if (String(payload.robots || "").includes("noindex")) {
        headers["X-Robots-Tag"] = payload.robots;
      }
      res.writeHead(status, headers);
      res.end(renderShareHtml(payload, payload.url || canonical));
      return;
    }

    if (pathname === "/assets/admin.css") {
      sendFile(res, path.join(root, "src/admin/admin.css"));
      return;
    }

    if (pathname === "/" || pathname === "/index.html") {
      sendSpa(res, "/");
      return;
    }

    const staticPath = path.join(root, pathname);
    if (staticPath.startsWith(root) && fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
      sendFile(res, staticPath);
      return;
    }

    sendSpa(res, pathname);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Karen Leather dev server: http://127.0.0.1:${port}`);
  });
