import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { SmartImage } from "../components/SmartImage";
import {
  breadcrumbJsonLd,
  productBodyHtml,
  productImageAlt,
  productJsonLd,
  productPageSeo,
} from "../content/seo";
import { siteBrand } from "../content/siteCopy";
import { usePageSeo } from "../context/SeoContext";
import { getProduct } from "../data";
import { useCart } from "../lib/cart";
import { useShowPrices } from "../context/StoreSettings";
import { formatPrice, WHATSAPP_LINK } from "../lib/utils";

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
        ? [{ name: product.categories[0].name, path: `/shop?cat=${encodeURIComponent(product.categories[0].slug)}` }]
        : []),
      { name: product.title, path: `/product/${product.id}/${product.slug}` },
    ]);
    return [productJsonLd(product), crumbs];
  }, [product]);

  usePageSeo(seo, jsonLd);

  if (!product) {
    return (
      <div className="container section">
        <Breadcrumbs items={[{ label: "خانه", to: "/" }, { label: "فروشگاه", to: "/shop" }, { label: "محصول یافت نشد" }]} />
        <p>محصول یافت نشد.</p>
        <Link to="/shop">بازگشت به فروشگاه</Link>
      </div>
    );
  }

  const images = product.images.map((img) => img.file);
  const waText = encodeURIComponent(`سلام، درباره محصول «${product.title}» سوال دارم.`);
  const bodyHtml = productBodyHtml(product);

  return (
    <div className="container section product-page">
      <Breadcrumbs
        items={[
          { label: "خانه", to: "/" },
          { label: "فروشگاه", to: "/shop" },
          ...(product.categories[0]
            ? [{ label: product.categories[0].name, to: `/shop?cat=${encodeURIComponent(product.categories[0].slug)}` }]
            : []),
          { label: product.title.replace(/^مدل:\s*/i, "") },
        ]}
      />

      <div className="product-layout">
        <div>
          <div className="product-gallery-main">
            <SmartImage src={images[imgIdx] ?? images[0] ?? ""} alt={productImageAlt(product, imgIdx)} />
          </div>
          {images.length > 1 && (
            <div className="product-thumbs">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={i === imgIdx ? "active" : ""}
                  onClick={() => setImgIdx(i)}
                  aria-label={`تصویر ${(i + 1).toLocaleString("fa-IR")}`}
                >
                  <SmartImage src={src} alt={productImageAlt(product, i)} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1>{product.title}</h1>
          {product.categories.length > 0 && (
            <div className="tag-row">
              {product.categories.map((c) => (
                <Link key={c.id} to={`/shop?cat=${encodeURIComponent(c.slug)}`} className="badge">
                  {c.name}
                </Link>
              ))}
            </div>
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
