import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { OstrichShoesShowcase } from "../components/OstrichShoesShowcase";
import { ShopCatalogBar } from "../components/ShopCatalogBar";
import { ShopSidebar } from "../components/ShopSidebar";
import { getCategoryBySlug } from "../data";
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

  const [filter, setFilter] = useState<ShopFilter>(() => {
    if (urlFilter && URL_FILTERS.has(urlFilter)) return urlFilter;
    return "new";
  });
  const [q, setQ] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const categoryTree = useMemo(() => buildShopCategoryTree(), []);
  const activeCat = catSlug ? getCategoryBySlug(catSlug) : undefined;

  const filtered = useMemo(
    () => filterProducts(filter, catSlug, q, sort),
    [filter, catSlug, q, sort],
  );

  const catalogIds = useMemo(() => filtered.map((p) => p.id), [filtered]);

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

  return (
    <div className="shop-catalog">
      <ShopCatalogBar
        filter={filter}
        catSlug={catSlug}
        dense={dense}
        resultCount={filtered.length}
        onFilter={setFilterPill}
        onToggleDense={toggleDense}
        onOpenCategories={() => setCategoriesOpen(true)}
      />

      <div className="catalog-toolbar-minimal">
        <input
          type="search"
          placeholder="جستجو..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="catalog-search"
          aria-label="جستجوی محصول"
        />
        {activeCat && (
          <button type="button" className="catalog-active-cat" onClick={() => setCategory(null)}>
            {activeCat.name} ×
          </button>
        )}
      </div>

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
          <h3>محصولی پیدا نشد</h3>
          <p>فیلتر دیگری امتحان کنید.</p>
          <button
            type="button"
            className="btn btn-gold"
            onClick={() => {
              setQ("");
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

      <h1 className="visually-hidden">
        فروشگاه چرم کارن — {filtered.length.toLocaleString("fa-IR")} محصول
      </h1>
    </div>
  );
}
