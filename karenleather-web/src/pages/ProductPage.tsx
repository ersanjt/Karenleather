import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { SmartImage } from "../components/SmartImage";
import {
  breadcrumbJsonLd,
  cleanProductTitle,
  productBodyHtml,
  productDisplayTags,
  productImageAlt,
  productJsonLd,
  productPageSeo,
} from "../content/seo";
import { siteBrand } from "../content/siteCopy";
import { usePageSeo } from "../context/SeoContext";
import { getProduct } from "../data";
import { useCart } from "../lib/cart";
import { useShowPrices } from "../context/StoreSettings";
import { formatPrice, shopCatHref, uniqueProductImages, WHATSAPP_LINK } from "../lib/utils";
import { NotFoundView } from "./NotFoundPage";

export function ProductPage() {
  const showPrices = useShowPrices();
  const { id } = useParams();
  const product = getProduct(Number(id));
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

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
      { name: cleanProductTitle(product.title), path: `/product/${product.id}/${product.slug}` },
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
  const displayName = cleanProductTitle(product.title);
  const waText = encodeURIComponent(`سلام، درباره محصول «${displayName}» سوال دارم.`);
  const bodyHtml = productBodyHtml(product);
  const tags = productDisplayTags(product);

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
            <div className="product-thumbs">
              {gallery.map((shot, i) => (
                <button
                  key={`${shot.file}-${i}`}
                  type="button"
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

          <div className="product-qty-row">
            <label>
              تعداد
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
          </div>

          <div className="product-actions">
            <button type="button" className="btn btn-primary" onClick={() => add(product.id, qty)}>
              افزودن به سبد
            </button>
            <a href={`${WHATSAPP_LINK}?text=${waText}`} target="_blank" rel="noreferrer" className="btn btn-gold">
              سفارش در واتساپ
            </a>
          </div>

          <div className="prose product-desc" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </div>
      </div>
    </div>
  );
}
