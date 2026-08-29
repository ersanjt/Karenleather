import categories from "@content/categories.json";
import { navLinks } from "./siteCopy";
import { allProducts } from "../data";
import { primaryUpload } from "../lib/images";
import { shopCatHref } from "../lib/utils";
import type { Category } from "../types";
import { campaign, lookbookMen, type MediaShot } from "./media";

export interface MenuLink {
  id: number;
  name: string;
  slug: string;
  count: number;
  href: string;
}

export interface MegaSection {
  title: string;
  href: string;
  items: MenuLink[];
}

export interface MegaColumn {
  id: string;
  title: string;
  href: string;
  banner?: string;
  promo?: MediaShot & { subtitle: string; cta: string };
  sections: MegaSection[];
  totalProducts: number;
}

const allCats = categories as Category[];

function catHref(slug: string) {
  return shopCatHref(slug);
}

function categoryImage(termId: number): string | undefined {
  const product = allProducts.find(
    (p) => p.images.length && p.categories.some((c) => c.id === termId),
  );
  return product?.images[0] ? primaryUpload(product.images[0].file) : undefined;
}

function linksUnder(parentId: number): MenuLink[] {
  return allCats
    .filter((c) => c.parent === parentId && c.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((c) => ({
      id: c.term_id,
      name: c.name,
      slug: c.slug,
      count: c.count,
      href: catHref(c.slug),
    }));
}

function countUnder(rootId: number): number {
  const ids = new Set<number>([rootId]);
  const walk = (pid: number) => {
    for (const c of allCats) {
      if (c.parent === pid) {
        ids.add(c.term_id);
        walk(c.term_id);
      }
    }
  };
  walk(rootId);
  return allProducts.filter((p) => p.categories.some((c) => ids.has(c.id))).length;
}

function buildGenderColumn(genderId: number): MegaColumn | null {
  const gender = allCats.find((c) => c.term_id === genderId);
  if (!gender) return null;

  const sections: MegaSection[] = allCats
    .filter((c) => c.parent === genderId)
    .map((sub) => ({
      title: sub.name,
      href: catHref(sub.slug),
      items: linksUnder(sub.term_id),
    }))
    .filter((s) => s.items.length > 0);

  if (!sections.length) return null;

  const firstItemId = sections[0]?.items[0]?.id;

  return {
    id: String(genderId),
    title: gender.name,
    href: catHref(gender.slug),
    banner: categoryImage(firstItemId ?? genderId),
    sections,
    totalProducts: countUnder(genderId),
  };
}

function buildAccessoriesColumn(): MegaColumn | null {
  const cat = allCats.find((c) => c.term_id === 40);
  if (!cat?.count) return null;

  const childLinks = linksUnder(40);
  const items: MenuLink[] = childLinks.length
    ? childLinks
    : [
        {
          id: cat.term_id,
          name: "همه محصولات اکسسوری",
          slug: cat.slug,
          count: cat.count,
          href: catHref(cat.slug),
        },
      ];

  return {
    id: "accessories",
    title: cat.name,
    href: catHref(cat.slug),
    banner: categoryImage(cat.term_id),
    sections: [{ title: "دسته‌ها", href: catHref(cat.slug), items }],
    totalProducts: cat.count,
  };
}

function withPromo(
  col: MegaColumn | null,
  shot: MediaShot,
  subtitle: string,
): MegaColumn | null {
  if (!col) return null;
  return {
    ...col,
    banner: shot.src,
    promo: { ...shot, subtitle, cta: col.href },
  };
}

export const megaMenuColumns: MegaColumn[] = [
  withPromo(buildGenderColumn(18), campaign.yellowSet, "کمپین کارن تبریز · چرم طبیعی"),
  withPromo(buildGenderColumn(19), lookbookMen[0], "لوفر، مانک‌استرپ و اسنیکر"),
  withPromo(buildAccessoriesColumn(), campaign.burgundyCircle, "کیف و چرم کارن تبریز"),
].filter((c): c is MegaColumn => c !== null);

export const quickShopLinks = allCats
  .filter((c) => c.count > 0)
  .sort((a, b) => b.count - a.count)
  .slice(0, 8)
  .map((c) => ({
    name: c.name,
    href: catHref(c.slug),
    count: c.count,
    image: categoryImage(c.term_id),
  }));

export const headerLinks = navLinks.primary;

export type MenuChild = MenuLink & { image?: string };

export interface MenuGroup {
  id: number;
  title: string;
  slug: string;
  href: string;
  image?: string;
  children: MenuChild[];
}

/** Legacy flat groups — kept for mobile nav if needed */
export const megaMenuGroups: MenuGroup[] = megaMenuColumns.flatMap((col) =>
  col.sections.map((sec, idx) => ({
    id: sec.items[0]?.id ?? idx,
    title: `${sec.title} · ${col.title}`,
    slug: "",
    href: sec.href,
    image: col.banner,
    children: sec.items.map((i) => ({ ...i, image: categoryImage(i.id) })),
  })),
);
