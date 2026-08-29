import { Link } from "react-router-dom";
import { useShowPrices } from "../context/StoreSettings";
import { getProduct } from "../data";
import { useCart } from "../lib/cart";
import { buildCartWhatsAppMessage } from "../lib/cartMessage";
import { productImageAlt, cleanProductTitle } from "../content/seo";
import { SmartImage } from "../components/SmartImage";
import { formatPrice, productPath, WHATSAPP_LINK } from "../lib/utils";

export function CartPage() {
  const showPrices = useShowPrices();
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
    <div className="container section">
      <h1 className="section-title">سبد خرید</h1>

      {!count ? (
        <div>
          <p style={{ color: "var(--muted)" }}>سبد خرید شما خالی است.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            رفتن به فروشگاه
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: "1rem" }}>
            {lines.map(({ item, product, lineTotal }) => (
              <div
                key={item.productId}
                className="cart-page-line"
                style={{
                  display: "grid",
                  gridTemplateColumns: showPrices ? "80px 1fr auto" : "80px 1fr",
                  gap: "1rem",
                  alignItems: "center",
                  padding: "1rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              >
                <Link to={productPath(product)}>
                  <SmartImage
                    src={product.images[0]?.file ?? ""}
                    alt={productImageAlt(product)}
                    sizes="80px"
                    style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
                  />
                </Link>
                <div>
                  <Link to={productPath(product)} style={{ fontWeight: 700 }}>
                    {cleanProductTitle(product.title)}
                  </Link>
                  {showPrices && (
                    <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                      {formatPrice(product.price || product.regular_price)}
                    </div>
                  )}
                  <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => setQty(item.productId, Number(e.target.value) || 0)}
                      style={{ width: 56, padding: "0.25rem", borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                    <button type="button" className="btn btn-outline" onClick={() => remove(item.productId)}>
                      حذف
                    </button>
                  </div>
                </div>
                {showPrices && (
                  <div style={{ fontWeight: 800 }}>{formatPrice(lineTotal)}</div>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "var(--surface)",
              borderRadius: "var(--radius)",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ color: "var(--muted)" }}>
                {count.toLocaleString("fa-IR")} قلم در سبد
              </div>
              {showPrices && (
                <>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--navy)" }}>
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
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-outline" onClick={clear}>
                خالی کردن سبد
              </button>
              <a
                href={`${WHATSAPP_LINK}?text=${waMessage}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
                onClick={() => {
                  fetch("/api/store/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      customer: { name: "مهمان" },
                      items: lines.map((l) => ({
                        title: l.product.title,
                        qty: l.item.qty,
                        price: l.lineTotal / l.item.qty,
                      })),
                      total,
                      note: "سفارش از واتساپ",
                    }),
                  }).catch(() => {});
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
