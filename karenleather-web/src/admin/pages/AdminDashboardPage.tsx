import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi";
import { formatPrice } from "../../lib/utils";

export function AdminDashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof adminApi.dashboard>> | null>(null);

  useEffect(() => {
    adminApi.dashboard().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="admin-content-inner">
        <p className="admin-muted">در حال بارگذاری…</p>
      </div>
    );
  }

  const { stats, recentOrders, lowStock } = data;

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-row">
          <div className="admin-topbar-title">
            <h1>داشبورد</h1>
            <p>نمای کلی فروشگاه</p>
          </div>
        </div>
      </header>

      <div className="admin-content-inner">
        <div className="admin-stats-grid">
          <article className="admin-stat-card">
            <span>کل محصولات</span>
            <strong>{stats.total.toLocaleString("fa-IR")}</strong>
          </article>
          <article className="admin-stat-card">
            <span>موجود</span>
            <strong className="stat-ok">{stats.inStock.toLocaleString("fa-IR")}</strong>
          </article>
          <article className="admin-stat-card">
            <span>ناموجود</span>
            <strong className="stat-warn">{stats.outStock.toLocaleString("fa-IR")}</strong>
          </article>
          <article className="admin-stat-card">
            <span>سفارش‌ها</span>
            <strong>{stats.orders.toLocaleString("fa-IR")}</strong>
          </article>
          <article className="admin-stat-card admin-stat-wide">
            <span>درآمد ثبت‌شده</span>
            <strong>{formatPrice(String(stats.revenue))}</strong>
          </article>
        </div>

        <div className="admin-dash-grid">
          <div className="admin-card">
            <div className="admin-card-head">
              <h2>سفارش‌های اخیر</h2>
              <Link to="/admin/orders" className="admin-btn admin-btn-ghost admin-btn-sm">
                همه
              </Link>
            </div>
            {recentOrders.length ? (
              <ul className="admin-dash-list">
                {recentOrders.map((o) => (
                  <li key={o.id}>
                    <strong>{o.id}</strong>
                    <span>{o.customer?.name ?? "مهمان"}</span>
                    <span className="admin-badge">{o.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="admin-empty">هنوز سفارشی ثبت نشده.</p>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-card-head">
              <h2>مدیریت محصولات</h2>
              <Link to="/admin/products" className="admin-btn admin-btn-ghost admin-btn-sm">
                کاتالوگ
              </Link>
            </div>
            <p className="admin-muted">
              {lowStock.length
                ? `${lowStock.length} محصول برای بررسی`
                : "همه محصولات فعال هستند."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
