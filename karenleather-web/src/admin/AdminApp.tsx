import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminGuard } from "./components/AdminGuard";
import { AdminLayout } from "./components/AdminLayout";
import { AdminToastProvider } from "./components/AdminToast";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminOrdersPage } from "./pages/AdminOrdersPage";
import { AdminProductsPage } from "./pages/AdminProductsPage";
import { AdminSettingsPage } from "./pages/AdminSettingsPage";

export function AdminApp() {
  useEffect(() => {
    const id = "admin-css";
    const isDev = Boolean(document.querySelector('script[src*="dist-dev"]'));
    const href = isDev ? "/src/admin/admin.css" : "/assets/admin.css";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;
  }, []);

  return (
    <AdminToastProvider>
      <Routes>
        <Route path="login" element={<AdminLoginPage />} />
        <Route
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminToastProvider>
  );
}
