import { useEffect, useMemo, useState } from "react";
import { adminApi, type AdminProduct } from "../../lib/adminApi";
import { formatPrice } from "../../lib/utils";
import { SmartImage } from "../../components/SmartImage";
import { AdminProductModal } from "../components/AdminProductModal";
import { useAdminToast } from "../components/AdminToast";

type Filter = "all" | "in" | "out" | "sale";

export function AdminProductsPage() {
  const { show } = useAdminToast();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .products()
      .then((d) => setProducts(d.products))
      .catch((e) => show(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = products;
    const term = q.trim();
    if (term) {
      list = list.filter(
        (p) =>
          p.title.includes(term) ||
          p.sku.includes(term) ||
          p.categories.some((c) => c.name.includes(term)),
      );
    }
    if (filter === "in") list = list.filter((p) => p.inStock);
    if (filter === "out") list = list.filter((p) => !p.inStock);
    if (filter === "sale") {
      list = list.filter(
        (p) => p.sale_price && p.regular_price && p.sale_price !== p.regular_price,
      );
    }
    return list;
  }, [products, q, filter]);

  const saveProduct = async (patch: Record<string, unknown>) => {
    if (!editing) return;
    await adminApi.updateProduct(editing.id, patch);
    show("محصول ذخیره شد");
    setEditing(null);
    load();
  };

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-row">
          <div className="admin-topbar-title">
            <h1>محصولات</h1>
            <p>{products.length.toLocaleString("fa-IR")} محصول در کاتالوگ</p>
          </div>
        </div>
      </header>

      <div className="admin-content-inner">
        <div className="admin-card">
          <div className="admin-card-head admin-card-head-stack">
            <div>
              <h2>کاتالوگ محصولات</h2>
              <span className="admin-muted">{filtered.length.toLocaleString("fa-IR")} نتیجه</span>
            </div>
            <div className="admin-card-actions">
              <input
                type="search"
                className="admin-search"
                placeholder="جستجو مدل، دسته…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="admin-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value as Filter)}
              >
                <option value="all">همه</option>
                <option value="in">موجود</option>
                <option value="out">ناموجود</option>
                <option value="sale">حراج</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="admin-empty">در حال بارگذاری…</p>
          ) : filtered.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>تصویر</th>
                    <th>مدل</th>
                    <th>دسته</th>
                    <th>جنسیت</th>
                    <th>قیمت</th>
                    <th>موجودی</th>
                    <th>وضعیت</th>
                    <th>عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const onSale =
                      p.sale_price && p.regular_price && p.sale_price !== p.regular_price;
                    return (
                      <tr key={p.id}>
                        <td>
                          <SmartImage
                            src={p.images[0]?.file ?? ""}
                            alt=""
                            className="admin-thumb"
                          />
                        </td>
                        <td>{p.title}</td>
                        <td>{p.categories[0]?.name ?? "—"}</td>
                        <td>{p.gender}</td>
                        <td>{formatPrice(p.price || p.regular_price)}</td>
                        <td>{p.stock === "instock" ? "موجود" : "ناموجود"}</td>
                        <td>
                          <span className={`admin-badge ${p.inStock ? "ok" : "warn"}`}>
                            {onSale ? "حراج" : p.inStock ? "فعال" : "مخفی"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            onClick={() => setEditing(p)}
                          >
                            ویرایش
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">محصولی یافت نشد.</p>
          )}
        </div>
      </div>

      {editing && (
        <AdminProductModal product={editing} onClose={() => setEditing(null)} onSave={saveProduct} />
      )}
    </>
  );
}
