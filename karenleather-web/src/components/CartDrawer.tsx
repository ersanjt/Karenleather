import { Link } from "react-router-dom";
import { useShowPrices } from "../context/StoreSettings";
import { getProduct } from "../data";
import { useCart } from "../lib/cart";
import { buildCartWhatsAppMessage } from "../lib/cartMessage";
import { useCartUI } from "../context/CartUI";
import { formatPrice, productPath, WHATSAPP_LINK } from "../lib/utils";
import { productImageAlt, cleanProductTitle } from "../content/seo";
import { SmartImage } from "./SmartImage";

export function CartDrawer() {
  const showPrices = useShowPrices();
  const { drawerOpen, closeDrawer } = useCartUI();
  const { items, setQty, remove, clear, count } = useCart();

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
    <>
      <div
        className={`cart-overlay ${drawerOpen ? "visible" : ""}`}
        onClick={closeDrawer}
        aria-hidden={!drawerOpen}
      />
      <aside
        className={`cart-drawer ${drawerOpen ? "open" : ""}`}
        aria-hidden={!drawerOpen}
        aria-label="سبد خرید"
      >
        <div className="cart-drawer-head">
          <h2>خلاصه سفارش</h2>
          <button type="button" className="cart-drawer-close" onClick={closeDrawer} aria-label="بستن">
            ×
          </button>
        </div>

        <div className="cart-drawer-body">
          {!count ? (
            <p className="cart-empty-msg">سبد خرید شما خالی است</p>
          ) : (
            <div className="cart-lines">
              {lines.map(({ item, product, lineTotal }) => (
                <article key={item.productId} className="cart-line">
                  <Link to={productPath(product)} onClick={closeDrawer} className="cart-line-thumb">
                    <SmartImage src={product.images[0]?.file ?? ""} alt={productImageAlt(product)} sizes="72px" />
                  </Link>
                  <div className="cart-line-info">
                    <Link to={productPath(product)} onClick={closeDrawer} className="cart-line-title">
                      {cleanProductTitle(product.title)}
                    </Link>
                    {showPrices && <div className="cart-line-price">{formatPrice(lineTotal)}</div>}
                    <div className="cart-line-actions">
                      <input
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => setQty(item.productId, Number(e.target.value) || 0)}
                        aria-label="تعداد"
                      />
                      <button type="button" onClick={() => remove(item.productId)}>
                        حذف
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {count > 0 && (
          <div className="cart-drawer-foot">
            <div className="cart-total-row">
              <span>{count.toLocaleString("fa-IR")} قلم در سبد</span>
              {showPrices && <strong>{formatPrice(total)}</strong>}
            </div>
            {showPrices && total >= 1_000_000 && <span className="badge">ارسال رایگان</span>}
            <a
              href={`${WHATSAPP_LINK}?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold cart-checkout-btn"
              onClick={closeDrawer}
            >
              ثبت سفارش در واتساپ
            </a>
            <Link to="/cart" className="cart-full-link" onClick={closeDrawer}>
              مشاهده سبد کامل
            </Link>
            <button type="button" className="cart-clear-btn" onClick={clear}>
              خالی کردن سبد
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
