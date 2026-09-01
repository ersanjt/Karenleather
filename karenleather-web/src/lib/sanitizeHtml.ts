const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "UL",
  "OL",
  "LI",
  "A",
  "H2",
  "H3",
  "H4",
  "SPAN",
  "BLOCKQUOTE",
]);

const SAFE_HREF = /^(https?:\/\/|\/|#|mailto:|tel:)/i;

function sanitizeNode(node: Node): Node[] {
  if (node.nodeType === Node.TEXT_NODE) return [node.cloneNode()];
  if (node.nodeType !== Node.ELEMENT_NODE) return [];

  const el = node as Element;
  const tag = el.tagName;
  if (!ALLOWED_TAGS.has(tag)) {
    return Array.from(el.childNodes).flatMap(sanitizeNode);
  }

  const clean = el.ownerDocument.createElement(tag.toLowerCase());
  if (tag === "A") {
    const href = el.getAttribute("href")?.trim() ?? "";
    if (SAFE_HREF.test(href) && !/javascript:/i.test(href) && !/data:/i.test(href)) {
      clean.setAttribute("href", href);
      clean.setAttribute("rel", "noopener noreferrer");
      if (/^https?:\/\//i.test(href)) clean.setAttribute("target", "_blank");
    }
  }

  for (const child of Array.from(el.childNodes)) {
    for (const next of sanitizeNode(child)) clean.appendChild(next);
  }
  return [clean];
}

/** HTML محصول را با allowlist تگ‌ها پاک می‌کند تا XSS اجرا نشود. */
export function sanitizeHtml(dirty: string): string {
  if (!dirty.trim()) return "";
  if (typeof DOMParser === "undefined") {
    return dirty
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  }

  const doc = new DOMParser().parseFromString(`<div>${dirty}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return "";

  const wrap = doc.createElement("div");
  for (const child of Array.from(root.childNodes)) {
    for (const next of sanitizeNode(child)) wrap.appendChild(next);
  }
  return wrap.innerHTML;
}
