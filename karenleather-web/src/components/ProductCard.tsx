import { Link } from "react-router-dom";
import type { Product } from "../types";
import { useShowPrices } from "../context/StoreSettings";
import { useProductPreview } from "../context/ProductPreview";
import { SmartImage } from "./SmartImage";
import { formatPrice, productPath } from "../lib/utils";

interface Props {
  product: Product;
  /** MARVISPACE-style minimal catalog tile */
  catalog?: boolean;
  catalogIds?: number[];
}

export function ProductCard({ product, catalog = false, catalogIds }: Props) {
  const { openPreview } = useProductPreview();
  const showPrices = useShowPrices();
  const onSale =
    showPrices &&
    product.sale_price &&
    product.regular_price &&
    product.sale_price !== product.regular_price;

  const imageSrc = product.images[0]?.file ?? "";

  const handleOpen = () => {
    openPreview(product.id, catalogIds ?? [product.id]);
  };

  if (catalog) {
    return (
      <article className="catalog-tile">
        <button type="button" className="catalog-tile-hit" onClick={handleOpen} aria-label={product.title}>
          <div className="catalog-tile-media">
            <SmartImage src={imageSrc} alt={product.title} loading="lazy" />
            {onSale && <span className="catalog-sale">حراج</span>}
          </div>
          <div className="catalog-tile-meta">
            <span className="catalog-tile-name">{product.title}</span>
            {product.categories[0] && (
              <span className="catalog-tile-cat">{product.categories[0].name}</span>
            )}
            {showPrices && (
              <span className="catalog-tile-price">
                {formatPrice(product.price || product.regular_price)}
              </span>
            )}
            <span className="catalog-tile-add" aria-hidden>
              +
            </span>
          </div>
        </button>
      </article>
    );
  }

  return (
    <article className="product-card">
      <button type="button" className="product-card-hit" onClick={handleOpen} aria-label={`پیش‌نمایش ${product.title}`}>
        <div className="product-card-media">
          <SmartImage src={imageSrc} alt={product.title} loading="lazy" />
          {onSale && <span className="sale-pill">حراج</span>}
          <span className="product-card-quick">+</span>
        </div>
      </button>
      <div className="product-card-body">
        <Link to={productPath(product)} className="product-card-title">
          {product.title}
        </Link>
        {product.categories[0] && <span className="badge">{product.categories[0].name}</span>}
        {showPrices && (
          <div className="product-card-price">
            {onSale && <div className="price-old">{formatPrice(product.regular_price)}</div>}
            <div className="price-current">{formatPrice(product.price || product.regular_price)}</div>
          </div>
        )}
      </div>
    </article>
  );
}
