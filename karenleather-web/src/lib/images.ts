const PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="#f0f2f6" width="400" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="18">چرم کارن</text></svg>`,
  );

function stripWpSizes(name: string): string[] {
  const out = new Set<string>([name]);
  out.add(name.replace(/-scaled(?=\.(jpe?g|png|webp|gif)$)/i, ""));
  out.add(name.replace(/-\d+x\d+(?=\.(jpe?g|png|webp|gif)$)/i, ""));
  out.add(
    name
      .replace(/-scaled(?=\.(jpe?g|png|webp|gif)$)/i, "")
      .replace(/-\d+x\d+(?=\.(jpe?g|png|webp|gif)$)/i, ""),
  );
  const m = name.match(/^(.+?)(\.(jpe?g|png|webp|gif))$/i);
  if (m && !name.includes("-scaled")) {
    out.add(`${m[1]}-scaled${m[2]}`);
  }
  return [...out];
}

export function uploadCandidates(input: string): string[] {
  if (!input) return [PLACEHOLDER];
  if (input.startsWith("data:")) return [input];

  let rel = input;
  if (input.startsWith("/uploads/")) rel = input.slice("/uploads/".length);
  else if (input.includes("/wp-content/uploads/")) {
    rel = input.split("/wp-content/uploads/")[1] ?? input;
  } else if (input.startsWith("http")) {
    try {
      const u = new URL(input);
      const m = u.pathname.indexOf("/wp-content/uploads/");
      if (m >= 0) rel = u.pathname.slice(m + "/wp-content/uploads/".length);
    } catch {
      /* noop */
    }
  }

  rel = rel.split("?")[0];
  const parts = rel.split("/").filter(Boolean);
  const file = parts.pop() ?? rel;
  const dir = parts.join("/");

  const urls: string[] = [];
  for (const f of stripWpSizes(file)) {
    const path = dir ? `${dir}/${f}` : f;
    urls.push(`/uploads/${path}`);
    urls.push(`/uploads/${path.split("/").map((p) => encodeURIComponent(p)).join("/")}`);
  }
  return [...new Set(urls)];
}

export function primaryUpload(input: string): string {
  return uploadCandidates(input)[0];
}

export { PLACEHOLDER };
