import esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist");
const uploadsRoot = path.resolve(root, "../wp-content/uploads");

fs.mkdirSync(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(root, "src/main.tsx")],
  outfile: path.join(outDir, "assets/bundle.js"),
  bundle: true,
  format: "esm",
  minify: true,
  sourcemap: true,
  loader: { ".json": "json", ".css": "css" },
  alias: {
    "@content": path.resolve(root, "../_content"),
  },
});

const indexHtml = fs
  .readFileSync(path.join(root, "index.html"), "utf8")
  .replace('<script type="module" src="/src/main.tsx"></script>', '<script type="module" src="/assets/bundle.js"></script>');

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
console.log("Build complete:", outDir);
