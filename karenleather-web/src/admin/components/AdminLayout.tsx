import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../../components/Logo";
import { adminApi, clearAdminToken } from "../../lib/adminApi";
import { useAdminToast } from "./AdminToast";

const NAV = [
  { to: "/admin/dashboard", label: "داشبورد", icon: "◫" },
  { to: "/admin/products", label: "محصولات", icon: "▦" },
  { to: "/admin/orders", label: "سفارش‌ها", icon: "◎" },
  { to: "/admin/settings", label: "تنظیمات", icon: "⚙" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { show } = useAdminToast();

  const logout = async () => {
    try {
      await adminApi.logout();
    } catch {
      /* ignore */
    }
    clearAdminToken();
    show("خارج شدید");
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Logo variant="mark" />
          <small>پنل مدیریت</small>
        </div>
        <nav className="admin-sidebar-nav" aria-label="ناوبری ادمین">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="admin-nav-icon" aria-hidden>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link to="/" className="admin-sidebar-link">
            مشاهده فروشگاه
          </Link>
          <button type="button" className="admin-sidebar-link admin-sidebar-link-btn" onClick={logout}>
            خروج
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
