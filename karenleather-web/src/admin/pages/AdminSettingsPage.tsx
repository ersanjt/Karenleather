import { useEffect, useState } from "react";
import { adminApi, type AdminSettings } from "../../lib/adminApi";
import { useAdminToast } from "../components/AdminToast";

export function AdminSettingsPage() {
  const { show } = useAdminToast();
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.settings().then((d) => setSettings(d.settings)).catch((e) => show(e.message));
  }, []);

  if (!settings) {
    return (
      <div className="admin-content-inner">
        <p className="admin-muted">در حال بارگذاری…</p>
      </div>
    );
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApi.saveSettings(settings);
      setSettings(res.settings);
      show("تنظیمات ذخیره شد — صفحه فروشگاه را رفرش کنید");
    } catch (err) {
      show(err instanceof Error ? err.message : "خطا");
    } finally {
      setSaving(false);
    }
  };

  const waTest = settings.whatsappPhone
    ? `https://wa.me/${settings.whatsappPhone.replace(/\D/g, "")}?text=${encodeURIComponent(settings.whatsappMessage)}`
    : "#";

  return (
    <>
      <header className="admin-topbar">
        <div className="admin-topbar-row">
          <div className="admin-topbar-title">
            <h1>تنظیمات</h1>
            <p>برند، قیمت‌ها و پشتیبانی</p>
          </div>
        </div>
      </header>

      <div className="admin-content-inner">
        <form className="admin-settings" onSubmit={save}>
          <div className="admin-card admin-card-highlight">
            <div className="admin-card-head">
              <div>
                <h2>فروشگاه</h2>
                <p className="admin-muted">تنظیمات عمومی نمایش در سایت</p>
              </div>
            </div>
            <label className="admin-field">
              <span>نام فروشگاه</span>
              <input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </label>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={settings.showPrices}
                onChange={(e) => setSettings({ ...settings, showPrices: e.target.checked })}
              />
              <span>نمایش قیمت در فروشگاه</span>
            </label>
            <label className="admin-field">
              <span>ایمیل اعلان‌ها</span>
              <input
                type="email"
                dir="ltr"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              />
            </label>
          </div>

          <div className="admin-card admin-card-highlight">
            <div className="admin-card-head">
              <div>
                <h2>پشتیبانی واتساپ</h2>
                <p className="admin-muted">دکمه واتساپ در سایت و پیام پیش‌فرض</p>
              </div>
            </div>
            <label className="admin-field">
              <span>شماره واتساپ</span>
              <input
                dir="ltr"
                value={settings.whatsappPhone}
                onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                placeholder="989144199935"
              />
            </label>
            <label className="admin-field">
              <span>پیام پیش‌فرض</span>
              <textarea
                rows={3}
                value={settings.whatsappMessage}
                onChange={(e) => setSettings({ ...settings, whatsappMessage: e.target.value })}
              />
            </label>
            <div className="admin-settings-actions">
              <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
                {saving ? "…" : "ذخیره تنظیمات"}
              </button>
              {settings.whatsappPhone && (
                <a
                  href={waTest}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-btn admin-btn-ghost"
                >
                  تست واتساپ
                </a>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
