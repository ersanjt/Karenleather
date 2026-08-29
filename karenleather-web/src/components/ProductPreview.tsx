import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductPreview } from "../context/ProductPreview";
import { useCart } from "../lib/cart";
import { useCartUI } from "../context/CartUI";
import { productImageAlt, cleanProductTitle } from "../content/seo";
import { SmartImage } from "./SmartImage";
import { useShowPrices } from "../context/StoreSettings";
import { formatPrice, productPath, uniqueProductImages } from "../lib/utils";

export function ProductPreview() {
  const showPrices = useShowPrices();
  const { product, closePreview, goPrev, goNext, hasPrev, hasNext } = useProductPreview();
  const { add } = useCart();
  const { openDrawer } = useCartUI();
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!product) return;
    setImgIdx(0);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePreview();
      if (e.key === "ArrowRight" && hasPrev) goPrev();
      if (e.key === "ArrowLeft" && hasNext) goNext();
      const shotCount = uniqueProductImages(product).length;
      if (e.key === "ArrowUp") setImgIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setImgIdx((i) => Math.min(shotCount - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [product, closePreview, goNext, goPrev, hasNext, hasPrev, imgIdx]);

  if (!product) return null;

  const gallery = uniqueProductImages(product);
  const images = gallery.map((g) => g.file);
  const safeIdx = Math.min(imgIdx, Math.max(0, images.length - 1));

  const handleAdd = () => {
    add(product.id, 1);
    openDrawer();
  };

  return (
    <div className="preview-stage" role="dialog" aria-modal="true" aria-label="پیش‌نمایش محصول">
      <button type="button" className="preview-stage-backdrop" onClick={closePreview} aria-label="بستن" />

      {hasPrev && (
        <button type="button" className="preview-nav preview-nav-prev" onClick={goPrev} aria-label="محصول قبلی">
          <svg viewBox="0 0 24 24" aria-hidden width="20" height="20">
            <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>
      )}
      {hasNext && (
        <button type="button" className="preview-nav preview-nav-next" onClick={goNext} aria-label="محصول بعدی">
          <svg viewBox="0 0 24 24" aria-hidden width="20" height="20">
            <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>
      )}

      <div className="preview-stack">
        <div className="preview-visual-shell">
          <div className="preview-main-square">
            <SmartImage
              src={images[safeIdx] ?? ""}
              alt={productImageAlt(product, gallery[safeIdx]?.index ?? 0)}
              sizes="(max-width: 768px) 92vw, 640px"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="preview-shot-nav preview-shot-prev"
                  onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                  aria-label="تصویر قبلی"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="preview-shot-nav preview-shot-next"
                  onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                  aria-label="تصویر بعدی"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="preview-thumbs" role="tablist" aria-label="گالری تصاویر محصول">
              {gallery.map((shot, i) => (
                <button
                  key={`${shot.file}-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === safeIdx}
                  className={i === safeIdx ? "active" : ""}
                  onClick={() => setImgIdx(i)}
                  aria-label={`تصویر ${(i + 1).toLocaleString("fa-IR")}`}
                >
                  <SmartImage src={shot.file} alt={productImageAlt(product, shot.index)} sizes="72px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="preview-dock">
          <div className="preview-dock-info">
            <span className="preview-dock-cat">{product.categories[0]?.name}</span>
            <span className="preview-dock-name">{cleanProductTitle(product.title)}</span>
            {showPrices && (
              <span className="preview-dock-price">
                {formatPrice(product.price || product.regular_price)}
              </span>
            )}
          </div>
          <div className="preview-dock-actions">
            <button type="button" className="preview-add-btn" onClick={handleAdd} aria-label="افزودن به سبد">
              +
            </button>
            <Link to={productPath(product)} className="preview-detail-btn" onClick={closePreview}>
              جزئیات
            </Link>
          </div>
        </div>
      </div>

      <button type="button" className="preview-close-fab" onClick={closePreview} aria-label="بستن">
        ×
      </button>
    </div>
  );
}
