import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../data";
import { useCart } from "../lib/cart";
import { SmartImage } from "../components/SmartImage";
import { useShowPrices } from "../context/StoreSettings";
import { formatPrice, WHATSAPP_LINK } from "../lib/utils";

export function ProductPage() {
  const showPrices = useShowPrices();
  const { id } = useParams();
  const product = getProduct(Number(id));
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) {
    return (
      <div className="container section">
        <p>محصول یافت نشد.</p>
        <Link to="/shop">بازگشت به فروشگاه</Link>
      </div>
    );
  }

  const images = product.images.map((img) => img.file);
  const waText = encodeURIComponent(`سلام، درباره محصول «${product.title}» سوال دارم.`);

  return (
    <div className="container section product-page">
      <div className="product-layout">
        <div>
          <div className="product-gallery-main">
            <SmartImage src={images[imgIdx] ?? images[0] ?? ""} alt={product.title} />
          </div>
          {images.length > 1 && (
            <div className="product-thumbs">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={i === imgIdx ? "active" : ""}
                  onClick={() => setImgIdx(i)}
                >
                  <SmartImage src={src} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <Link to="/shop" className="back-link">
            ← بازگشت به فروشگاه
          </Link>
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

          {product.description && (
            <div
              className="prose product-desc"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
