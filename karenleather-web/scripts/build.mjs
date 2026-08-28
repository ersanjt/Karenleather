import esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");
const assetsDir = path.join(outDir, "assets");
const uploadsRoot = path.resolve(root, "../wp-content/uploads");

fs.mkdirSync(assetsDir, { recursive: true });

/** CSS را جدا می‌سازیم — روی cPanel تزریق CSS داخل JS گاهی اعمال نمی‌شود */
await esbuild.build({
  entryPoints: [path.join(root, "src/index.css")],
  outfile: path.join(assetsDir, "bundle.css"),
  bundle: true,
  minify: true,
  loader: { ".css": "css" },
});

await esbuild.build({
  entryPoints: [path.join(root, "src/admin/admin.css")],
  outfile: path.join(assetsDir, "admin.css"),
  bundle: true,
  minify: true,
  loader: { ".css": "css" },
});

const ignoreCssPlugin = {
  name: "ignore-css",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, () => ({
      contents: "export default {};",
      loader: "js",
    }));
  },
};

await esbuild.build({
  entryPoints: [path.join(root, "src/main.tsx")],
  outfile: path.join(assetsDir, "bundle.js"),
  bundle: true,
  format: "esm",
  minify: true,
  sourcemap: true,
  loader: { ".json": "json" },
  alias: {
    "@content": path.resolve(root, "../_content"),
  },
  plugins: [ignoreCssPlugin],
});

const indexHtml = fs
  .readFileSync(path.join(root, "index.html"), "utf8")
  .replace(
    '<script type="module" src="/src/main.tsx"></script>',
    `<link rel="stylesheet" href="/assets/bundle.css" />
    <script type="module" src="/assets/bundle.js"></script>`,
  );

fs.writeFileSync(path.join(outDir, "index.html"), indexHtml);

function copyUploads(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyUploads(from, to);
    else fs.copyFileSync(from, to);
  }
}

console.log("Copying uploads (this may take a moment)...");
copyUploads(uploadsRoot, path.join(outDir, "uploads"));

const { generateSeoFiles } = await import(pathToFileURL(path.join(__dirname, "generate-seo.mjs")).href);
generateSeoFiles(outDir);

console.log("Build complete:", outDir);
