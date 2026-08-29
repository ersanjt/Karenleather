import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ProductCard } from "../components/ProductCard";
import { OstrichShoesShowcase } from "../components/OstrichShoesShowcase";
import { MensLookbook } from "../components/MensLookbook";
import { ShopCatalogBar } from "../components/ShopCatalogBar";
import { ShopSidebar } from "../components/ShopSidebar";
import { SmartImage } from "../components/SmartImage";
import { campaign } from "../content/media";
import { breadcrumbJsonLd, canonicalPath, collectionPageJsonLd, shopFilterCopy, shopPageSeo } from "../content/seo";
import { categorySeoDescription, categorySeoTitle } from "../content/taxonomy";
import { siteBrand } from "../content/siteCopy";
import { usePageSeo } from "../context/SeoContext";
import { getCategoryBySlug } from "../data";
import { shopCatHref } from "../lib/utils";
import {
  buildShopCategoryTree,
  filterFromSlug,
  filterProducts,
  type ShopFilter,
  type ShopSort,
} from "../lib/shop";

const URL_FILTERS = new Set<ShopFilter>([
  "new",
  "all",
  "sale",
  "footwear",
  "women",
  "men",
  "accessories",
]);

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const catSlug = params.get("cat") ?? "";
  const urlFilter = params.get("filter") as ShopFilter | null;
  const sort = (params.get("sort") as ShopSort) || "newest";
  const dense = params.get("view") === "dense";
  const q = params.get("q") ?? "";

  const [filter, setFilter] = useState<ShopFilter>(() => {
    if (urlFilter && URL_FILTERS.has(urlFilter)) return urlFilter;
    return "new";
  });
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const categoryTree = useMemo(() => buildShopCategoryTree(), []);
  const activeCat = catSlug ? getCategoryBySlug(catSlug) : undefined;

  const filtered = useMemo(
    () => filterProducts(filter, catSlug, q, sort),
    [filter, catSlug, q, sort],
  );

  const catalogIds = useMemo(() => filtered.map((p) => p.id), [filtered]);

  const seo = useMemo(
    () => shopPageSeo(activeCat, filter, q),
    [activeCat, filter, q],
  );

  const jsonLd = useMemo(() => {
    const path = canonicalPath("/shop", params);
    const crumbs = breadcrumbJsonLd([
      { name: "خانه", path: "/" },
      { name: "فروشگاه", path: "/shop" },
      ...(activeCat ? [{ name: activeCat.name, path: shopCatHref(activeCat.slug) }] : []),
    ]);
    return [crumbs, collectionPageJsonLd(seo.title, path, seo.description, seo.keywords)];
  }, [activeCat, params, seo.title, seo.description, seo.keywords]);

  usePageSeo(seo, jsonLd);

  useEffect(() => {
    if (catSlug) setFilter(filterFromSlug(catSlug));
    else if (urlFilter && URL_FILTERS.has(urlFilter)) setFilter(urlFilter);
    else setFilter((prev) => (prev === "sale" ? "sale" : "new"));
  }, [catSlug, urlFilter]);

  useEffect(() => {
    document.body.classList.add("shop-catalog-mode");
    return () => document.body.classList.remove("shop-catalog-mode");
  }, []);

  useEffect(() => {
    document.body.style.overflow = categoriesOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [categoriesOpen]);

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    setParams(next, { replace: true });
  };

  const setCategory = (slug: string | null) => {
    updateParams({ cat: slug });
    if (slug) setFilter(filterFromSlug(slug));
    else setFilter("new");
    setCategoriesOpen(false);
  };

  const setFilterPill = (id: ShopFilter) => {
    setFilter(id);
    if (id === "women" || id === "men" || id === "accessories") {
      const slugMap: Record<string, string> = {
        women: decodeURIComponent("%d8%b2%d9%86%d8%a7%d9%86%d9%87"),
        men: "men",
        accessories: "aksesori",
      };
      updateParams({ cat: slugMap[id] ?? null, filter: null });
    } else if (id === "footwear" || id === "sale") {
      updateParams({ cat: null, filter: id });
    } else {
      updateParams({ cat: null, filter: null });
    }
  };

  const toggleDense = () => {
    updateParams({ view: dense ? null : "dense" });
  };

  const setQuery = (value: string) => {
    updateParams({ q: value || null });
  };

  const pageTitle = activeCat
    ? `${categorySeoTitle(activeCat)} — ${siteBrand.name}`
    : q.trim()
      ? `جستجو: ${q.trim()}`
      : `فروشگاه ${siteBrand.name}`;

  const pageLead = activeCat
    ? `${categorySeoDescription(activeCat)} ${filtered.length.toLocaleString("fa-IR")} محصول در این دسته.`
    : q.trim()
      ? `نتایج جستجو برای «${q.trim()}» — ${filtered.length.toLocaleString("fa-IR")} محصول.`
      : shopFilterCopy(filter)?.description ??
        `کلکسیون ${siteBrand.productCount.toLocaleString("fa-IR")}+ مدل کیف، کفش و اکسسوری چرم طبیعی — ${filtered.length.toLocaleString("fa-IR")} نتیجه`;

  return (
    <div className="shop-catalog">
      {!catSlug && !q.trim() && (
        <section className="shop-hero" aria-label="کمپین فروشگاه">
          <SmartImage
            src={campaign.yellowSet}
            className="shop-hero-bg"
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="shop-hero-overlay" />
          <div className="container shop-hero-content">
            <p className="kl-eyebrow">کمپین</p>
            <p className="shop-hero-tag">کارن تبریز</p>
          </div>
        </section>
      )}

      <ShopCatalogBar
        filter={filter}
        catSlug={catSlug}
        dense={dense}
        resultCount={filtered.length}
        query={q}
        activeCategoryLabel={activeCat?.name}
        onFilter={setFilterPill}
        onToggleDense={toggleDense}
        onOpenCategories={() => setCategoriesOpen(true)}
        onQueryChange={setQuery}
        onClearCategory={() => setCategory(null)}
      />

      <div className="catalog-intro container">
        <Breadcrumbs
          items={[
            { label: "خانه", to: "/" },
            { label: "فروشگاه", to: "/shop" },
            ...(activeCat ? [{ label: activeCat.name }] : []),
          ]}
        />
        <h1 className="catalog-intro-title">{pageTitle}</h1>
        <p className="catalog-intro-lead">{pageLead}</p>
      </div>

      {(filter === "footwear" || filter === "men") && !q && <MensLookbook variant="shop" />}
      {filter === "footwear" && !q && <OstrichShoesShowcase variant="shop" />}

      {filtered.length > 0 ? (
        <section
          className={`catalog-grid ${dense ? "dense" : ""}`}
          aria-live="polite"
          aria-label="کاتالوگ محصولات"
        >
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} catalog catalogIds={catalogIds} />
          ))}
        </section>
      ) : (
        <div className="shop-empty catalog-empty">
          <h2>محصولی پیدا نشد</h2>
          <p>فیلتر دیگری امتحان کنید یا عبارت جستجو را تغییر دهید.</p>
          <button
            type="button"
            className="btn btn-gold"
            onClick={() => {
              setQuery("");
              setCategory(null);
              setFilter("new");
            }}
          >
            مشاهده جدیدترین
          </button>
        </div>
      )}

      {categoriesOpen && (
        <>
          <button
            type="button"
            className="shop-filter-backdrop"
            aria-label="بستن"
            onClick={() => setCategoriesOpen(false)}
          />
          <div className="shop-filter-drawer" role="dialog" aria-label="دسته‌بندی">
            <div className="shop-filter-drawer-head">
              <h3>دسته‌بندی</h3>
              <button type="button" onClick={() => setCategoriesOpen(false)} aria-label="بستن">
                ×
              </button>
            </div>
            <ShopSidebar
              groups={categoryTree}
              activeSlug={catSlug}
              onSelect={setCategory}
              compact
            />
          </div>
        </>
      )}
    </div>
  );
}
