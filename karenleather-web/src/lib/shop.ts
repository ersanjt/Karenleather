import categories from "@content/categories.json";
import { allProducts, getCategoryBySlug, productsByCategory } from "../data";
import { shopCatHref } from "./utils";
import type { Category, Product } from "../types";

const allCats = categories as Category[];

export type ShopFilter = "new" | "women" | "men" | "footwear" | "accessories" | "sale" | "all";
export type ShopSort = "newest" | "name" | "popular";
export type ShopView = "comfort" | "dense";

const FILTER_SLUGS: Record<Exclude<ShopFilter, "all" | "sale" | "new" | "footwear">, string> = {
  women: decodeURIComponent("%d8%b2%d9%86%d8%a7%d9%86%d9%87"),
  men: "men",
  accessories: "aksesori",
};

const FOOTWEAR_ROOTS = [47, 54];

function footwearCategoryIds(): Set<number> {
  const ids = new Set<number>();
  const walk = (parentId: number) => {
    ids.add(parentId);
    for (const c of allCats) {
      if (c.parent === parentId) walk(c.term_id);
    }
  };
  for (const root of FOOTWEAR_ROOTS) walk(root);
  return ids;
}

const footwearIds = footwearCategoryIds();

function isFootwearProduct(product: Product) {
  return product.categories.some((c) => footwearIds.has(c.id));
}

export interface ShopCategoryNode {
  id: number;
  name: string;
  slug: string;
  count: number;
  href: string;
  children: ShopCategoryNode[];
}

export interface ShopCategoryGroup {
  id: number;
  title: string;
  slug: string;
  href: string;
  total: number;
  children: ShopCategoryNode[];
}

function catHref(slug: string) {
  return shopCatHref(slug);
}

function nodeFromCategory(cat: Category): ShopCategoryNode {
  const children = allCats
    .filter((c) => c.parent === cat.term_id && c.count > 0)
    .sort((a, b) => b.count - a.count)
    .map(nodeFromCategory);

  return {
    id: cat.term_id,
    name: cat.name,
    slug: cat.slug,
    count: cat.count,
    href: catHref(cat.slug),
    children,
  };
}

export function buildShopCategoryTree(): ShopCategoryGroup[] {
  const roots = [
    { id: 18, label: "زنانه" },
    { id: 19, label: "مردانه" },
    { id: 40, label: "اکسسوری" },
  ];

  return roots
    .map(({ id, label }) => {
      const root = allCats.find((c) => c.term_id === id);
      if (!root) return null;

      const midLevel = allCats
        .filter((c) => c.parent === id)
        .map((sub) => {
          const leaves = allCats
            .filter((c) => c.parent === sub.term_id && c.count > 0)
            .sort((a, b) => b.count - a.count)
            .map(nodeFromCategory);

          if (leaves.length) {
            return {
              id: sub.term_id,
              name: sub.name,
              slug: sub.slug,
              count: leaves.reduce((n, l) => n + l.count, 0) || sub.count,
              href: catHref(sub.slug),
              children: leaves,
            };
          }

          if (sub.count > 0) {
            return { ...nodeFromCategory(sub), children: [] };
          }
          return null;
        })
        .filter((n): n is ShopCategoryNode => n !== null);

      const directItems =
        id === 40 && !midLevel.length && root.count > 0
          ? [
              {
                id: root.term_id,
                name: "همه اکسسوری",
                slug: root.slug,
                count: root.count,
                href: catHref(root.slug),
                children: [],
              },
            ]
          : midLevel;

      if (!directItems.length && !root.count) return null;

      return {
        id: root.term_id,
        title: label,
        slug: root.slug,
        href: catHref(root.slug),
        total: productsByCategory(root.slug).length,
        children: directItems,
      };
    })
    .filter((g): g is ShopCategoryGroup => g !== null);
}

export function categoryBreadcrumb(slug: string): Category[] {
  const cat = getCategoryBySlug(slug);
  if (!cat) return [];

  const path: Category[] = [cat];
  let current = cat;
  while (current.parent) {
    const parent = allCats.find((c) => c.term_id === current.parent);
    if (!parent) break;
    path.unshift(parent);
    current = parent;
  }
  return path;
}

export function slugMatches(a: string, b: string) {
  if (!a || !b) return false;
  return (
    a === b ||
    decodeURIComponent(a) === decodeURIComponent(b) ||
    decodeURIComponent(a) === b ||
    a === decodeURIComponent(b)
  );
}

export function filterFromSlug(catSlug: string): ShopFilter {
  if (!catSlug) return "all";
  if (slugMatches(catSlug, FILTER_SLUGS.women)) return "women";
  if (slugMatches(catSlug, FILTER_SLUGS.men)) return "men";
  if (slugMatches(catSlug, FILTER_SLUGS.accessories)) return "accessories";
  return "all";
}

export function filterProducts(
  filter: ShopFilter,
  catSlug: string,
  q: string,
  sort: ShopSort,
): Product[] {
  let list: Product[];

  if (catSlug) {
    list = productsByCategory(catSlug);
  } else if (filter === "sale") {
    list = allProducts.filter(
      (p) => p.sale_price && p.regular_price && p.sale_price !== p.regular_price,
    );
  } else if (filter === "footwear") {
    list = allProducts.filter(isFootwearProduct);
  } else if (filter === "new" || filter === "all") {
    list = allProducts;
  } else {
    list = productsByCategory(FILTER_SLUGS[filter]);
  }

  const term = q.trim();
  if (term) {
    list = list.filter(
      (p) =>
        p.title.includes(term) ||
        p.categories.some((c) => c.name.includes(term)) ||
        p.sku.includes(term),
    );
  }

  const sorted = [...list];
  const effectiveSort = filter === "new" && !catSlug ? "newest" : sort;
  if (effectiveSort === "newest") {
    sorted.sort((a, b) => b.modified.localeCompare(a.modified));
  } else if (effectiveSort === "name") {
    sorted.sort((a, b) => a.title.localeCompare(b.title, "fa"));
  } else {
    sorted.sort((a, b) => b.id - a.id);
  }

  return sorted;
}

export const SHOP_FILTERS: { id: ShopFilter; label: string }[] = [
  { id: "new", label: "جدید" },
  { id: "women", label: "زنانه" },
  { id: "men", label: "مردانه" },
  { id: "footwear", label: "کفش" },
  { id: "accessories", label: "اکسسوری" },
];

export const SHOP_SORTS: { id: ShopSort; label: string }[] = [
  { id: "newest", label: "جدیدترین" },
  { id: "popular", label: "پرطرفدار" },
  { id: "name", label: "نام محصول" },
];
