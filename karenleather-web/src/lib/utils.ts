import type { Product, ProductImage } from "../types";
import { showPrices } from "../config/commerce";
import { siteContact } from "../content/siteCopy";
import { primaryUpload } from "./images";

export function formatPrice(amount: string | number): string {
  if (!showPrices) return "";
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!n || Number.isNaN(n)) return "تماس بگیرید";
  return `${n.toLocaleString("fa-IR")} تومان`;
}

export function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/** اسلاگ دسته‌ها در JSON گاهی از قبل percent-encoded است — دوباره encode نکن */
export function shopCatHref(slug: string): string {
  const raw = /%[0-9A-Fa-f]{2}/.test(slug) ? decodeSlug(slug) : slug;
  return `/shop?cat=${encodeURIComponent(raw)}`;
}

export function productPath(product: Product): string {
  return `/product/${product.id}/${decodeSlug(product.slug)}`;
}

export function primaryImage(images: ProductImage[]): string {
  if (!images.length) return "";
  return primaryUpload(images[0].file);
}

function imageDedupeKey(file: string): string {
  return file
    .split("?")[0]
    .replace(/-scaled(?=\.)/i, "")
    .replace(/-\d+x\d+(?=\.)/i, "")
    .toLowerCase();
}

/** تصاویر یکتا — ووکامرس اغلب یک فایل را چند بار در گالری تکرار می‌کند */
export function uniqueProductImages(product: Product): { file: string; index: number }[] {
  const seen = new Set<string>();
  const out: { file: string; index: number }[] = [];
  product.images.forEach((img, index) => {
    const key = imageDedupeKey(img.file);
    if (!key || seen.has(key)) return;
    seen.add(key);
    out.push({ file: img.file, index });
  });
  return out;
}

export function allImageUrls(images: ProductImage[]): string[] {
  return images.map((img) => primaryUpload(img.file));
}

export const WHATSAPP = siteContact.whatsapp;
export const WHATSAPP_LINK = `https://wa.me/98${siteContact.phone.slice(1)}`;
export const INSTAGRAM = siteContact.instagram;
