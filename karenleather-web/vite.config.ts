import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const uploadsRoot = path.resolve(__dirname, "../wp-content/uploads");

function serveUploads(): Plugin {
  return {
    name: "serve-uploads",
    configureServer(server) {
      server.middlewares.use("/uploads", (req, res, next) => {
        const rel = decodeURIComponent((req.url ?? "/").replace(/^\//, ""));
        const filePath = path.join(uploadsRoot, rel);
        if (!filePath.startsWith(uploadsRoot) || !fs.existsSync(filePath)) {
          next();
          return;
        }
        res.setHeader("Cache-Control", "public, max-age=86400");
        fs.createReadStream(filePath).pipe(res);
      });
    },
    configurePreviewServer(server) {
      serveUploads().configureServer?.(server);
    },
  };
}

export default defineConfig({
  plugins: [react(), serveUploads()],
  resolve: {
    alias: {
      "@content": path.resolve(__dirname, "../_content"),
    },
  },
  server: {
    fs: { allow: [path.resolve(__dirname, "..")] },
  },
});
