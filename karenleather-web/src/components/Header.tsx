import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { navLinks, siteBrand, siteContact } from "../content/siteCopy";
import { useCart } from "../lib/cart";
import { useCartUI } from "../context/CartUI";
import { WHATSAPP_LINK } from "../lib/utils";
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

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const [homeLink, ...otherLinks] = navLinks.primary;

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`} role="banner">
      <div className="header-top header-desktop-only">
        <div className="container header-top-inner">
          <p className="header-tagline">
            <span className="header-tagline-dot" aria-hidden="true" />
            {siteBrand.tagline} · گارانتی ۲ ساله
          </p>
          <div className="header-top-links">
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
              واتساپ
            </a>
            <span className="header-top-sep" aria-hidden="true">
              |
            </span>
            <a href={siteContact.instagram} target="_blank" rel="noopener noreferrer">
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

          <nav className="main-nav main-nav--desktop" aria-label="ناوبری اصلی">
            <NavLink
              to={homeLink.to}
              end={homeLink.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {homeLink.label}
            </NavLink>

            <div className="mega-desktop">
              <MegaMenu />
            </div>

            {otherLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <a
              href={`tel:${siteContact.phoneTel}`}
              className="header-call header-mobile-only"
              aria-label="تماس تلفنی"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 3.5h3.2l1.1 3.2-2 1.6a12.5 12.5 0 0 0 6.4 6.4l1.6-2 3.2 1.1V18a1.5 1.5 0 0 1-1.5 1.5A15.5 15.5 0 0 1 5.5 5 1.5 1.5 0 0 1 7 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <Link to={navLinks.cta.to} className="header-cta header-desktop-only" onClick={closeMobile}>
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

      <div className={`mobile-sheet ${mobileOpen ? "is-open" : ""}`} id="mobile-nav">
        <div className="mobile-sheet__brand">
          <Logo variant="header" />
        </div>
        <nav className="mobile-sheet__nav" aria-label="منوی موبایل">
          <NavLink
            to={homeLink.to}
            end={homeLink.end}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={closeMobile}
          >
            {homeLink.label}
          </NavLink>
          <MegaMenu mobile onNavigate={closeMobile} />
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
        <div className="mobile-sheet__cta">
          <Link to="/shop" className="btn btn-gold" onClick={closeMobile}>
            {navLinks.cta.label}
          </Link>
          <a href={`tel:${siteContact.phoneTel}`} className="btn btn-ghost">
            {siteContact.phoneDisplay}
          </a>
          <a href={WHATSAPP_LINK} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
            واتساپ
          </a>
        </div>
      </div>

      {mobileOpen && (
        <button type="button" className="nav-backdrop" aria-label="بستن منو" onClick={closeMobile} />
      )}
    </header>
  );
}
