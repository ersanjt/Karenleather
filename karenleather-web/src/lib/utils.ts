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

export function productPath(product: Product): string {
  return `/product/${product.id}/${decodeSlug(product.slug)}`;
}

export function primaryImage(images: ProductImage[]): string {
  if (!images.length) return "";
  return primaryUpload(images[0].file);
}

export function allImageUrls(images: ProductImage[]): string[] {
  return images.map((img) => primaryUpload(img.file));
}

export const WHATSAPP = siteContact.whatsapp;
export const WHATSAPP_LINK = `https://wa.me/98${siteContact.phone.slice(1)}`;
export const INSTAGRAM = siteContact.instagram;
