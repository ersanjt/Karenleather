import { Link } from "react-router-dom";
import type { MouseEvent } from "react";
import type { Product } from "../types";
import { useShowPrices } from "../context/StoreSettings";
import { useProductPreview } from "../context/ProductPreview";
import { productImageAlt, cleanProductTitle } from "../content/seo";
import { SmartImage } from "./SmartImage";
import { formatPrice, isProductInStock, productPath, uniqueProductImages } from "../lib/utils";

function isPlainLeftClick(e: MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

interface Props {
  product: Product;
  /** MARVISPACE-style minimal catalog tile */
  catalog?: boolean;
  catalogIds?: number[];
  /** اگر false باشد کلیک به صفحه محصول می‌رود، نه پیش‌نمایش */
  previewOnClick?: boolean;
}

export function ProductCard({ product, catalog = false, catalogIds, previewOnClick = true }: Props) {
  const { openPreview } = useProductPreview();
  const showPrices = useShowPrices();
  const onSale =
    showPrices &&
    product.sale_price &&
    product.regular_price &&
    product.sale_price !== product.regular_price;

  const gallery = uniqueProductImages(product);
  const imageSrc = gallery[0]?.file ?? "";
  const hoverSrc = gallery[1]?.file;
  const extraCount = gallery.length;

  const name = cleanProductTitle(product.title);
  const inStock = isProductInStock(product);

  const href = productPath(product);

  const openPreviewOnTile = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!previewOnClick) return;
    if (!isPlainLeftClick(e)) return;
    e.preventDefault();
    openPreview(product.id, catalogIds ?? [product.id]);
  };

  if (catalog) {
    return (
      <article className="catalog-tile">
        <Link to={href} className="catalog-tile-hit" onClick={openPreviewOnTile} aria-label={name}>
          <div className={`catalog-tile-media${hoverSrc ? " has-hover" : ""}`}>
            <SmartImage src={imageSrc} alt={productImageAlt(product)} loading="lazy" sizes="(max-width: 640px) 50vw, 220px" />
            {hoverSrc && (
              <SmartImage
                src={hoverSrc}
                alt={productImageAlt(product, gallery[1].index)}
                className="catalog-tile-hover"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, 220px"
              />
            )}
            {extraCount > 1 && (
              <span className="catalog-tile-shots" aria-label={`${extraCount.toLocaleString("fa-IR")} تصویر`}>
                {extraCount.toLocaleString("fa-IR")}
              </span>
            )}
            {onSale && <span className="catalog-sale">حراج</span>}
            {!inStock && <span className="catalog-oos">ناموجود</span>}
          </div>
          <div className="catalog-tile-meta">
            <span className="catalog-tile-name">{name}</span>
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
        </Link>
      </article>
    );
  }

  return (
    <article className="product-card">
      <Link to={href} className="product-card-hit" onClick={openPreviewOnTile} aria-label={previewOnClick ? `پیش‌نمایش ${name}` : name}>
        <div className="product-card-media">
          <SmartImage src={imageSrc} alt={productImageAlt(product)} loading="lazy" sizes="(max-width: 640px) 50vw, 260px" />
          {onSale && <span className="sale-pill">حراج</span>}
          {!inStock && <span className="oos-pill">ناموجود</span>}
          <span className="product-card-quick">+</span>
        </div>
      </Link>
      <div className="product-card-body">
        <Link to={href} className="product-card-title">
          {name}
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
