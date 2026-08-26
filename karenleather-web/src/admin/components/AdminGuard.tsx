import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminApi, clearAdminToken, getAdminToken } from "../../lib/adminApi";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const location = useLocation();

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setState("denied");
      return;
    }
    adminApi
      .session()
      .then(() => setState("ok"))
      .catch(() => {
        clearAdminToken();
        setState("denied");
      });
  }, []);

  if (state === "loading") {
    return (
      <div className="admin-loading">
        <p>در حال بارگذاری…</p>
      </div>
    );
  }

  if (state === "denied") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
