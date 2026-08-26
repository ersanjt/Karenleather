import { useEffect, useMemo, useState } from "react";
import { adminApi, type AdminOrder } from "../../lib/adminApi";
import { formatPrice } from "../../lib/utils";
import { useAdminToast } from "../components/AdminToast";

const STATUSES = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

export function AdminOrdersPage() {
  const { show } = useAdminToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  const load = () => {
    adminApi
      .orders()
      .then((d) => setOrders(d.orders))
      .catch((e) => show(e.message));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    const term = q.trim();
    if (term) {
      list = list.filter(
        (o) =>
          o.id.includes(term) ||
          o.customer?.name?.includes(term) ||
          o.customer?.phone?.includes(term),
      );
    }
    return list;
  }, [orders, q, statusFilter]);

  const updateStatus = async (order: AdminOrder, status: string) => {
    await adminApi.updateOrder(order.id, { status });
    show("وضعیت به‌روز شد");
    setSelected(null);
    load();
  };

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-row">
          <div className="admin-topbar-title">
            <h1>سفارش‌ها</h1>
            <p>{orders.length.toLocaleString("fa-IR")} سفارش ثبت‌شده</p>
          </div>
        </div>
      </header>

      <div className="admin-content-inner">
        <div className="admin-card">
          <div className="admin-card-head admin-card-head-stack">
            <div>
              <h2>لیست سفارش‌ها</h2>
            </div>
            <div className="admin-card-actions">
              <input
                type="search"
                className="admin-search"
                placeholder="جستجو شماره، نام…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="admin-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">همه وضعیت‌ها</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>شماره</th>
                    <th>مشتری</th>
                    <th>اقلام</th>
                    <th>مجموع</th>
                    <th>پرداخت</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id}>
                      <td dir="ltr">{o.id}</td>
                      <td>{o.customer?.name ?? "مهمان"}</td>
                      <td>{o.items?.length ?? 0}</td>
                      <td>{formatPrice(String(o.total ?? 0))}</td>
                      <td>{o.payment}</td>
                      <td>
                        <span className="admin-badge">{o.status}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          onClick={() => setSelected(o)}
                        >
                          جزئیات
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">
              <strong>هنوز سفارشی نیست</strong>
              <span>وقتی مشتری از واتساپ سفارش دهد، اینجا نمایش داده می‌شود.</span>
            </p>
          )}
        </div>
      </div>

      {selected && (
        <div className="admin-modal" role="dialog" aria-modal="true">
          <button
            type="button"
            className="admin-modal-backdrop"
            onClick={() => setSelected(null)}
            aria-label="بستن"
          />
          <div className="admin-modal-dialog admin-modal-dialog-wide">
            <div className="admin-modal-head">
              <h2>سفارش {selected.id}</h2>
              <button type="button" className="admin-modal-close" onClick={() => setSelected(null)}>
                ×
              </button>
            </div>
            <div className="admin-order-detail">
              <p>
                <strong>مشتری:</strong> {selected.customer?.name}
              </p>
              <p>
                <strong>تاریخ:</strong> {new Date(selected.createdAt).toLocaleString("fa-IR")}
              </p>
              <ul>
                {selected.items?.map((item, i) => (
                  <li key={i}>
                    {item.title} × {item.qty.toLocaleString("fa-IR")}
                  </li>
                ))}
              </ul>
              <p>
                <strong>مجموع:</strong> {formatPrice(String(selected.total))}
              </p>
              <label className="admin-field">
                <span>وضعیت</span>
                <select
                  defaultValue={selected.status}
                  onChange={(e) => updateStatus(selected, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
