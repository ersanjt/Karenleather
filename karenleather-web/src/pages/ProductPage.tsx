import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ProductCard } from "../components/ProductCard";
import { SmartImage } from "../components/SmartImage";
import {
  breadcrumbJsonLd,
  productBodyHtml,
  productDisplayTags,
  productHeading,
  productImageAlt,
  productJsonLd,
  productPageSeo,
} from "../content/seo";
import { siteBrand } from "../content/siteCopy";
import { usePageSeo } from "../context/SeoContext";
import { getProduct, relatedProducts } from "../data";
import { useCart } from "../lib/cart";
import { useShowPrices } from "../context/StoreSettings";
import { sanitizeHtml } from "../lib/sanitizeHtml";
import { formatPrice, isProductInStock, productPath, shopCatHref, uniqueProductImages, WHATSAPP_LINK } from "../lib/utils";
import { NotFoundView } from "./NotFoundPage";

export function ProductPage() {
  const showPrices = useShowPrices();
  const { id } = useParams();
  const product = getProduct(Number(id));
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setQty(1);
    setImgIdx(0);
  }, [product?.id]);

  const seo = useMemo(
    () =>
      product
        ? productPageSeo(product)
        : {
            title: `محصول یافت نشد — ${siteBrand.name}`,
            description: "این محصول در فروشگاه چرم کارن موجود نیست.",
            robots: "noindex, nofollow",
          },
    [product],
  );

  const jsonLd = useMemo(() => {
    if (!product) return null;
    const crumbs = breadcrumbJsonLd([
      { name: "خانه", path: "/" },
      { name: "فروشگاه", path: "/shop" },
      ...(product.categories[0]
        ? [{ name: product.categories[0].name, path: shopCatHref(product.categories[0].slug) }]
        : []),
      { name: productHeading(product), path: productPath(product) },
    ]);
    return [productJsonLd(product, { includePrice: showPrices }), crumbs];
  }, [product, showPrices]);

  usePageSeo(seo, jsonLd);

  if (!product) {
    return (
      <NotFoundView
        title="محصول یافت نشد"
        description="این محصول در فروشگاه چرم کارن موجود نیست یا از کاتالوگ حذف شده است."
      />
    );
  }

  const gallery = uniqueProductImages(product);
  const images = gallery.map((g) => g.file);
  const safeIdx = Math.min(imgIdx, Math.max(0, images.length - 1));
  const displayName = productHeading(product);
  const inStock = isProductInStock(product);
  const waText = encodeURIComponent(
    inStock
      ? `سلام، درباره محصول «${displayName}» سوال دارم.`
      : `سلام، موجودی محصول «${displayName}» را می‌خواستم بپرسم.`,
  );
  const bodyHtml = sanitizeHtml(productBodyHtml(product));
  const tags = productDisplayTags(product);
  const similar = relatedProducts(product, 4);

  return (
    <div className="container section product-page">
      <Breadcrumbs
        items={[
          { label: "خانه", to: "/" },
          { label: "فروشگاه", to: "/shop" },
          ...(product.categories[0]
            ? [{ label: product.categories[0].name, to: shopCatHref(product.categories[0].slug) }]
            : []),
          { label: displayName },
        ]}
      />

      <div className="product-layout">
        <div>
          <div className="product-gallery-main">
            <SmartImage src={images[safeIdx] ?? images[0] ?? ""} alt={productImageAlt(product, gallery[safeIdx]?.index ?? 0)} sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          {images.length > 1 && (
            <div
              className="product-thumbs"
              role="tablist"
              aria-label="گالری محصول"
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setImgIdx((i) => Math.min(images.length - 1, i + 1));
                if (e.key === "ArrowRight") setImgIdx((i) => Math.max(0, i - 1));
              }}
            >
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
                  <SmartImage src={shot.file} alt={productImageAlt(product, shot.index)} sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1>{displayName}</h1>
          {tags.length > 0 && (
            <ul className="product-tags" aria-label="برچسب‌های محصول">
              {tags.map((tag) => (
                <li key={tag.label}>
                  {tag.href ? (
                    <Link to={tag.href}>{tag.label}</Link>
                  ) : (
                    <span>{tag.label}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {showPrices && (
            <div className="product-price-lg">{formatPrice(product.price || product.regular_price)}</div>
          )}
          <p className={`product-stock${inStock ? "" : " product-stock--out"}`}>
            {inStock ? "موجود در انبار — ارسال سراسری" : "فعلاً ناموجود — برای موجودی پیام بدهید"}
          </p>

          <div className="product-buy">
            <div className="product-qty-row">
              <label htmlFor="product-qty">تعداد</label>
              <input
                id="product-qty"
                name="qty"
                type="number"
                min={1}
                inputMode="numeric"
                value={qty}
                disabled={!inStock}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
            <div className="product-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={!inStock}
                onClick={() => add(product.id, qty)}
              >
                {inStock ? "افزودن به سبد" : "ناموجود"}
              </button>
              <a
                href={`${WHATSAPP_LINK}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
              >
                {inStock ? "سفارش در واتساپ" : "پرسش موجودی"}
              </a>
            </div>
          </div>

          <div className="prose product-desc" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>
      </div>

      {similar.length > 0 && (
        <section className="product-related" aria-labelledby="related-heading">
          <div className="product-related__head">
            <h2 id="related-heading">محصولات مرتبط</h2>
            {product.categories[0] ? (
              <Link to={shopCatHref(product.categories[0].slug)} className="link-more">
                همه {product.categories[0].name}
              </Link>
            ) : (
              <Link to="/shop" className="link-more">
                فروشگاه
              </Link>
            )}
          </div>
          <div className="product-related__grid">
            {similar.map((item) => (
              <ProductCard key={item.id} product={item} previewOnClick={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
