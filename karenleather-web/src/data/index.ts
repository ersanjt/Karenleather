import products from "@content/products.json";
import categories from "@content/categories.json";
import summary from "@content/summary.json";
import type { Category, Product } from "../types";

export let allProducts = products as Product[];

export function syncCatalog(next: Product[]) {
  allProducts = next;
}

export const allCategories = (categories as Category[]).filter(
  (c) => c.count > 0,
);

export const site = summary.site;

export function getProduct(id: number): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const decoded = decodeURIComponent(slug);
  return (categories as Category[]).find(
    (c) => c.slug === slug || c.slug === decoded || decodeURIComponent(c.slug) === decoded,
  );
}

export function productsByCategory(slug?: string): Product[] {
  if (!slug) return allProducts;
  const decoded = decodeURIComponent(slug);
  const cat = getCategoryBySlug(slug);
  if (!cat) {
    return allProducts.filter((p) =>
      p.categories.some((c) => c.slug === slug || c.slug === decoded || decodeURIComponent(c.slug) === decoded),
    );
  }

  const ids = new Set<number>([cat.term_id]);
  const allCats = categories as Category[];
  const collect = (parentId: number) => {
    for (const c of allCats) {
      if (c.parent === parentId) {
        ids.add(c.term_id);
        collect(c.term_id);
      }
    }
  };
  collect(cat.term_id);

  return allProducts.filter((p) => p.categories.some((c) => ids.has(c.id)));
}

export const topCategories = [...allCategories]
  .sort((a, b) => b.count - a.count)
  .slice(0, 8);

export const featuredProducts = allProducts.filter((p) => p.images.length).slice(0, 8);

/** محصولات هم‌دسته برای لینک داخلی صفحه محصول */
export function relatedProducts(product: Product, limit = 4): Product[] {
  const catIds = new Set(product.categories.map((c) => c.id));
  const colorHint = product.title.match(/قهوه|مشکی|عسلی|زرشکی|طوسی|سرمه‌ای|کرم|قرمز|آبی|یشمی|بنفش|خردلی|فیروزه|کاربنی|کهنه|سفید|زرد/);
  const scored = allProducts
    .filter((p) => p.id !== product.id && p.images.length)
    .map((p) => {
      let score = 0;
      if (p.categories.some((c) => catIds.has(c.id))) score += 20;
      if (colorHint && colorHint[0] && p.title.includes(colorHint[0])) score += 4;
      return { p, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.p.id - b.p.id);

  const picked = scored.map((row) => row.p);
  if (picked.length >= limit) return picked.slice(0, limit);

  const extra = featuredProducts.filter(
    (p) => p.id !== product.id && !picked.some((r) => r.id === p.id),
  );
  return [...picked, ...extra].slice(0, limit);
}
