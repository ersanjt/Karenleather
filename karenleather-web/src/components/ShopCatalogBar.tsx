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
  onFilter: (id: ShopFilter) => void;
  onToggleDense: () => void;
  onOpenCategories: () => void;
}

export function ShopCatalogBar({
  filter,
  catSlug,
  dense,
  resultCount,
  onFilter,
  onToggleDense,
  onOpenCategories,
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
        <button
          type="button"
          className={`grid-toggle ${dense ? "is-dense" : ""}`}
          aria-label={dense ? "گرید بزرگ‌تر" : "گرید فشرده"}
          aria-pressed={dense}
          onClick={onToggleDense}
        >
          <span className="grid-toggle-line">
            <span className="grid-toggle-plus">+</span>
          </span>
          <span className="grid-toggle-line">
            <span className="grid-toggle-minus" />
          </span>
        </button>

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

        <div className="catalog-bar-right">
          <button type="button" className="catalog-cats-btn" onClick={onOpenCategories}>
            دسته‌ها
          </button>
          <span className="catalog-count">{resultCount.toLocaleString("fa-IR")}</span>
        </div>
      </div>
    </div>
  );
}
