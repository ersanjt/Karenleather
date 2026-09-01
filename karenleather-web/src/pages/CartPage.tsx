import { Link } from "react-router-dom";
import { useShowPrices } from "../context/StoreSettings";
import { getProduct } from "../data";
import { useCart } from "../lib/cart";
import { buildCartWhatsAppMessage } from "../lib/cartMessage";
import { submitStoreOrder } from "../lib/storeOrder";
import { productImageAlt, cleanProductTitle, staticPageSeo } from "../content/seo";
import { SmartImage } from "../components/SmartImage";
import { usePageSeo } from "../context/SeoContext";
import { formatPrice, productPath, WHATSAPP_LINK } from "../lib/utils";

export function CartPage() {
  const showPrices = useShowPrices();
  const { items, setQty, remove, clear, count } = useCart();
  usePageSeo(staticPageSeo["/cart"]);

  const lines = items
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      const price = Number(product.price || product.regular_price) || 0;
      return { item, product, lineTotal: price * item.qty };
    })
    .filter(Boolean) as {
    item: { productId: number; qty: number };
    product: NonNullable<ReturnType<typeof getProduct>>;
    lineTotal: number;
  }[];

  const total = lines.reduce((s, l) => s + l.lineTotal, 0);

  const waMessage = encodeURIComponent(
    buildCartWhatsAppMessage(
      lines.map((l) => ({ title: cleanProductTitle(l.product.title), qty: l.item.qty, lineTotal: l.lineTotal })),
      total,
    ),
  );

  return (
    <div className="container section">
      <h1 className="section-title">سبد خرید</h1>

      {!count ? (
        <div className="cart-page-empty">
          <p>سبد خرید شما خالی است.</p>
          <Link to="/shop" className="btn btn-primary">
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-page-lines">
            {lines.map(({ item, product, lineTotal }) => (
              <div
                key={item.productId}
                className={`cart-page-line${showPrices ? "" : " cart-page-line--noprice"}`}
              >
                <Link to={productPath(product)}>
                  <SmartImage
                    src={product.images[0]?.file ?? ""}
                    alt={productImageAlt(product)}
                    sizes="80px"
                    className="cart-page-line__thumb"
                  />
                </Link>
                <div>
                  <Link to={productPath(product)} className="cart-page-line__title">
                    {cleanProductTitle(product.title)}
                  </Link>
                  {showPrices && (
                    <div className="cart-page-line__meta">
                      {formatPrice(product.price || product.regular_price)}
                    </div>
                  )}
                  <div className="cart-page-line__qty">
                    <label htmlFor={`cart-qty-${item.productId}`}>تعداد</label>
                    <input
                      id={`cart-qty-${item.productId}`}
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => setQty(item.productId, Number(e.target.value) || 0)}
                    />
                    <button type="button" className="btn btn-outline" onClick={() => remove(item.productId)}>
                      حذف
                    </button>
                  </div>
                </div>
                {showPrices && (
                  <div className="cart-page-line__total">{formatPrice(lineTotal)}</div>
                )}
              </div>
            ))}
          </div>

          <div className="cart-page-summary">
            <div>
              <div className="cart-page-line__meta">
                {count.toLocaleString("fa-IR")} قلم در سبد
              </div>
              {showPrices && (
                <>
                  <div className="cart-page-line__total" style={{ fontSize: "1.5rem" }}>
                    {formatPrice(total)}
                  </div>
                  {total >= 1_000_000 && (
                    <div className="badge" style={{ marginTop: "0.5rem" }}>
                      ارسال رایگان
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="cart-page-summary__actions">
              <button type="button" className="btn btn-outline" onClick={clear}>
                خالی کردن سبد
              </button>
              <a
                href={`${WHATSAPP_LINK}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                onClick={() => {
                  submitStoreOrder({
                    customer: { name: "مهمان" },
                    items: lines.map((l) => ({
                      productId: l.product.id,
                      title: l.product.title,
                      qty: l.item.qty,
                      price: l.lineTotal / l.item.qty,
                    })),
                    total,
                    note: "سفارش از واتساپ",
                  });
                }}
              >
                ثبت سفارش در واتساپ
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
