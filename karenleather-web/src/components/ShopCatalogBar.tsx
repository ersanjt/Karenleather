import { useShowPrices } from "../context/StoreSettings";
import {
  SHOP_FILTERS,
  filterFromSlug,
  type ShopFilter,
} from "../lib/shop";

interface Props {
  filter: ShopFilter;
  catSlug: string;
  dense: boolean;
  resultCount: number;
  query: string;
  activeCategoryLabel?: string;
  onFilter: (id: ShopFilter) => void;
  onToggleDense: () => void;
  onOpenCategories: () => void;
  onQueryChange: (value: string) => void;
  onClearCategory?: () => void;
}

function GridIcon({ dense }: { dense: boolean }) {
  if (dense) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor">
        <rect x="3" y="3" width="5" height="5" rx="0.75" />
        <rect x="10" y="3" width="5" height="5" rx="0.75" />
        <rect x="17" y="3" width="4" height="5" rx="0.75" />
        <rect x="3" y="10" width="5" height="5" rx="0.75" />
        <rect x="10" y="10" width="5" height="5" rx="0.75" />
        <rect x="17" y="10" width="4" height="5" rx="0.75" />
        <rect x="3" y="17" width="5" height="4" rx="0.75" />
        <rect x="10" y="17" width="5" height="4" rx="0.75" />
        <rect x="17" y="17" width="4" height="4" rx="0.75" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor">
      <rect x="3" y="3" width="8" height="8" rx="1.25" />
      <rect x="13" y="3" width="8" height="8" rx="1.25" />
      <rect x="3" y="13" width="8" height="8" rx="1.25" />
      <rect x="13" y="13" width="8" height="8" rx="1.25" />
    </svg>
  );
}

export function ShopCatalogBar({
  filter,
  catSlug,
  dense,
  resultCount,
  query,
  activeCategoryLabel,
  onFilter,
  onToggleDense,
  onOpenCategories,
  onQueryChange,
  onClearCategory,
}: Props) {
  const showPrices = useShowPrices();
  const filters = showPrices
    ? [...SHOP_FILTERS, { id: "sale" as ShopFilter, label: "حراج" }]
    : SHOP_FILTERS;

  const pillActive = (id: ShopFilter) => {
    if (catSlug) {
      if (id === "new") return false;
      if (id === "footwear") return false;
      if (id === "sale") return filter === "sale";
      return filter === id || filterFromSlug(catSlug) === id;
    }
    return filter === id;
  };

  return (
    <div className="catalog-bar">
      <div className="catalog-bar-inner">
        <div className="catalog-bar-top">
          <label className="catalog-search-wrap">
            <span className="catalog-search-icon" aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
                <path d="M16 16L20 20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              className="catalog-search"
              placeholder="جستجو در محصولات…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="جستجوی محصول"
            />
          </label>

          <div className="catalog-bar-actions">
            <button
              type="button"
              className={`catalog-view-btn ${dense ? "is-dense" : ""}`}
              aria-label={dense ? "نمایش بزرگ‌تر" : "نمایش فشرده"}
              aria-pressed={dense}
              onClick={onToggleDense}
            >
              <GridIcon dense={dense} />
            </button>

            <button type="button" className="catalog-cats-btn" onClick={onOpenCategories}>
              دسته‌ها
            </button>

            <span className="catalog-count" aria-live="polite">
              {resultCount.toLocaleString("fa-IR")}
            </span>
          </div>
        </div>

        {activeCategoryLabel && onClearCategory && (
          <div className="catalog-bar-tags">
            <button type="button" className="catalog-active-cat" onClick={onClearCategory}>
              {activeCategoryLabel}
              <span aria-hidden>×</span>
            </button>
          </div>
        )}

        <nav className="catalog-filters" aria-label="فیلتر محصولات">
          <div className="catalog-filter-row">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`catalog-f-btn ${pillActive(f.id) ? "active" : ""}`}
                onClick={() => onFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
