import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { navLinks, siteBrand, siteContact } from "../content/siteCopy";
import { useCart } from "../lib/cart";
import { useCartUI } from "../context/CartUI";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";

export function Header() {
  const { count } = useCart();
  const { openDrawer } = useCartUI();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const [homeLink, ...otherLinks] = navLinks.primary;

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} role="banner">
      <div className="header-top">
        <div className="container header-top-inner">
          <p className="header-tagline">
            <span className="header-tagline-dot" aria-hidden="true" />
            {siteBrand.tagline} · گارانتی ۲ ساله
          </p>
          <div className="header-top-links">
            <a
              href={`https://wa.me/98${siteContact.phone.slice(1)}`}
              target="_blank"
              rel="noreferrer"
            >
              واتساپ
            </a>
            <span className="header-top-sep" aria-hidden="true">
              |
            </span>
            <a href={siteContact.instagram} target="_blank" rel="noreferrer">
              اینستاگرام
            </a>
            <span className="header-top-sep" aria-hidden="true">
              |
            </span>
            <a href={`tel:${siteContact.phoneTel}`} className="header-phone">
              {siteContact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-inner">
          <Link
            to="/"
            className="brand-link"
            aria-label={`صفحه اصلی ${siteBrand.name}`}
            onClick={closeMobile}
          >
            <Logo />
          </Link>

          <nav className={`main-nav ${mobileOpen ? "open" : ""}`} aria-label="ناوبری اصلی">
            <NavLink
              to={homeLink.to}
              end={homeLink.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={closeMobile}
            >
              {homeLink.label}
            </NavLink>

            <div className="mega-desktop">
              <MegaMenu onNavigate={closeMobile} />
            </div>
            <div className="mega-mobile-only">
              <MegaMenu mobile onNavigate={closeMobile} />
            </div>

            {otherLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                onClick={closeMobile}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Link to={navLinks.cta.to} className="header-cta" onClick={closeMobile}>
              {navLinks.cta.label}
            </Link>
            <button type="button" className="cart-icon-btn" onClick={openDrawer} aria-label="سبد خرید">
              <svg className="cart-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
                <path
                  d="M9 7V7C9 5.34315 10.3431 4 12 4V4C13.6569 4 15 5.34315 15 7V7"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
              {count > 0 && <span className="cart-count">{count.toLocaleString("fa-IR")}</span>}
            </button>
            <button
              type="button"
              className={`menu-toggle ${mobileOpen ? "open" : ""}`}
              aria-label={mobileOpen ? "بستن منو" : "باز کردن منو"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <button type="button" className="nav-backdrop" aria-label="بستن منو" onClick={closeMobile} />
      )}
    </header>
  );
}
