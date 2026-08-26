import { useState } from "react";
import type { AdminProduct } from "../../lib/adminApi";

interface Props {
  product: AdminProduct;
  onClose: () => void;
  onSave: (patch: Record<string, unknown>) => Promise<void>;
}

export function AdminProductModal({ product, onClose, onSave }: Props) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price || product.regular_price);
  const [regularPrice, setRegularPrice] = useState(product.regular_price);
  const [salePrice, setSalePrice] = useState(product.sale_price);
  const [stock, setStock] = useState(product.stock === "instock" ? "instock" : "outofstock");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        title,
        price,
        regular_price: regularPrice,
        sale_price: salePrice,
        stock,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="productModalTitle">
      <button type="button" className="admin-modal-backdrop" onClick={onClose} aria-label="بستن" />
      <div className="admin-modal-dialog">
        <div className="admin-modal-head">
          <h2 id="productModalTitle">ویرایش محصول</h2>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="بستن">
            ×
          </button>
        </div>
        <form className="admin-form" onSubmit={submit}>
          <label className="admin-field">
            <span>نام محصول</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <div className="admin-form-grid">
            <label className="admin-field">
              <span>قیمت (تومان)</span>
              <input value={price} onChange={(e) => setPrice(e.target.value)} dir="ltr" />
            </label>
            <label className="admin-field">
              <span>قیمت اصلی</span>
              <input value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)} dir="ltr" />
            </label>
            <label className="admin-field">
              <span>قیمت حراج</span>
              <input value={salePrice} onChange={(e) => setSalePrice(e.target.value)} dir="ltr" />
            </label>
            <label className="admin-field">
              <span>موجودی</span>
              <select value={stock} onChange={(e) => setStock(e.target.value)}>
                <option value="instock">موجود</option>
                <option value="outofstock">ناموجود</option>
              </select>
            </label>
          </div>
          <div className="admin-modal-foot">
            <button type="button" className="admin-btn admin-btn-ghost" onClick={onClose}>
              انصراف
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? "…" : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
