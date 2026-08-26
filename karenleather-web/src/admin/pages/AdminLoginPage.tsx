import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Logo } from "../../components/Logo";
import { adminApi, setAdminToken } from "../../lib/adminApi";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@karenleather.com");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await adminApi.login(email, password);
      setAdminToken(token);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود ناموفق");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth">
      <header className="admin-auth-top">
        <Link to="/" className="admin-auth-back" aria-label="بازگشت به فروشگاه">
          ‹
        </Link>
        <span className="admin-auth-mark">
          <Logo variant="mark" />
        </span>
        <span className="admin-auth-spacer" aria-hidden />
      </header>

      <main className="admin-auth-main">
        <form className="admin-auth-form" onSubmit={submit}>
          <h1>ورود ادمین</h1>
          <p className="admin-auth-lead">با ایمیل و رمز عبور مدیریت وارد شوید.</p>
          {error && (
            <p className="admin-auth-error" role="alert">
              {error}
            </p>
          )}

          <label className="admin-field">
            <span>ایمیل</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              dir="ltr"
            />
          </label>

          <label className="admin-field">
            <span>رمز عبور</span>
            <div className="admin-pass-row">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                dir="ltr"
              />
              <button
                type="button"
                className="admin-show-pass"
                onClick={() => setShowPass((v) => !v)}
                aria-pressed={showPass}
              >
                {showPass ? "پنهان" : "نمایش"}
              </button>
            </div>
          </label>

          <button type="submit" className="admin-submit" disabled={loading}>
            {loading ? "…" : "ورود"}
          </button>

          <div className="admin-auth-foot">
            <Link to="/" className="admin-store-link">
              ← بازگشت به فروشگاه
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
