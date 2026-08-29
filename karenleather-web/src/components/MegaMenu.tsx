import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { megaMenuColumns, quickShopLinks } from "../content/menu";
import { SmartImage } from "./SmartImage";

interface Props {
  onNavigate?: () => void;
  /** When true, renders accordion-style for mobile drawer */
  mobile?: boolean;
}

export function MegaMenu({ onNavigate, mobile }: Props) {
  const [open, setOpen] = useState(false);
  const [activeCol, setActiveCol] = useState(megaMenuColumns[0]?.id ?? "");
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 140);
  }, [cancelClose]);

  const openMenu = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  useEffect(() => {
    if (!open || mobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, mobile, close]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    if (open) document.body.classList.add("mega-open");
    else document.body.classList.remove("mega-open");
    return () => document.body.classList.remove("mega-open");
  }, [open]);

  const handleNavigate = () => {
    close();
    onNavigate?.();
  };

  if (mobile) {
    return (
      <div className="mega-mobile">
        <Link to="/shop" className="mobile-nav-link mobile-nav-shop" onClick={handleNavigate}>
          همه محصولات
        </Link>
        {megaMenuColumns.map((col) => (
          <details key={col.id} className="mega-mobile-col">
            <summary>{col.title}</summary>
            <div className="mega-mobile-body">
              {col.sections.map((sec) => (
                <div key={sec.href} className="mega-mobile-section">
                  <Link to={sec.href} className="mega-mobile-sec-title" onClick={handleNavigate}>
                    {sec.title}
                  </Link>
                  <ul>
                    {sec.items.map((item) => (
                      <li key={item.id}>
                        <Link to={item.href} onClick={handleNavigate}>
                          {item.name}
                          <span>{item.count.toLocaleString("fa-IR")}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link to={col.href} className="mega-mobile-all" onClick={handleNavigate}>
                همه {col.title}
              </Link>
            </div>
          </details>
        ))}
      </div>
    );
  }

  const column = megaMenuColumns.find((c) => c.id === activeCol) ?? megaMenuColumns[0];

  const panel = (
    <>
      {open && <div className="mega-backdrop" aria-hidden onClick={close} />}
      <div
        ref={panelRef}
        id={panelId}
        className={`mega-panel ${open ? "is-visible" : ""}`}
        role="region"
        aria-label="منوی فروشگاه"
        aria-hidden={!open}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <div className="mega-panel-inner container">
          <aside className="mega-tabs" role="tablist" aria-label="دسته‌های اصلی">
            {megaMenuColumns.map((col) => (
              <button
                key={col.id}
                type="button"
                role="tab"
                aria-selected={activeCol === col.id}
                className={`mega-tab ${activeCol === col.id ? "active" : ""}`}
                onMouseEnter={() => setActiveCol(col.id)}
                onFocus={() => setActiveCol(col.id)}
                onClick={() => setActiveCol(col.id)}
              >
                {col.banner && (
                  <SmartImage src={col.banner} alt={col.title} className="mega-tab-img" loading="lazy" sizes="72px" />
                )}
                <span className="mega-tab-text">
                  <strong>{col.title}</strong>
                  <small>{col.totalProducts.toLocaleString("fa-IR")} محصول</small>
                </span>
              </button>
            ))}
          </aside>

          <div className="mega-content">
            {column && (
              <div className="mega-content-main">
                <header className="mega-content-head">
                  <div>
                    <h3>{column.title}</h3>
                    <p>انتخاب از بین {column.totalProducts.toLocaleString("fa-IR")} محصول</p>
                  </div>
                  <Link to={column.href} className="mega-view-all" onClick={handleNavigate}>
                    مشاهده همه {column.title}
                    <span aria-hidden>←</span>
                  </Link>
                </header>

                <div className="mega-sections">
                  {column.sections.map((sec) => (
                    <div key={sec.href} className="mega-section">
                      <Link to={sec.href} className="mega-section-title" onClick={handleNavigate}>
                        {sec.title}
                      </Link>
                      <ul className="mega-links">
                        {sec.items.map((item) => (
                          <li key={item.id}>
                            <Link to={item.href} className="mega-link" onClick={handleNavigate}>
                              <span className="mega-link-label">{item.name}</span>
                              <span className="mega-link-count">
                                {item.count.toLocaleString("fa-IR")}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {column?.promo && (
              <aside className="mega-promo">
                <Link to={column.promo.cta} className="mega-promo-hit" onClick={handleNavigate}>
                  <span
                    className="mega-promo-media"
                    style={
                      {
                        "--shot-w": column.promo.width,
                        "--shot-h": column.promo.height,
                      } as CSSProperties
                    }
                  >
                    <SmartImage src={column.promo} className="mega-promo-img" loading="lazy" sizes="280px" />
                  </span>
                  <span className="mega-promo-body">
                    <span className="mega-promo-tag">پیشنهاد ویژه</span>
                    <h4>{column.promo.title}</h4>
                    <p>{column.promo.subtitle}</p>
                    <span className="mega-promo-go">مشاهده ←</span>
                  </span>
                </Link>
              </aside>
            )}
          </div>

          <footer className="mega-footer">
            <Link to="/shop" className="mega-footer-all" onClick={handleNavigate}>
              مشاهده همه محصولات
            </Link>
            <div className="mega-quick">
              <span>پرطرفدار:</span>
              {quickShopLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={handleNavigate}>
                  {link.name}
                </Link>
              ))}
            </div>
          </footer>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className={`mega-wrap ${open ? "is-open" : ""}`}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <div className={`mega-trigger nav-link ${open ? "active" : ""}`}>
          <Link to="/shop" onClick={handleNavigate}>
            فروشگاه
          </Link>
          <button
            type="button"
            className="mega-chevron-btn"
            aria-expanded={open}
            aria-haspopup="true"
            aria-controls={panelId}
            aria-label={open ? "بستن منوی فروشگاه" : "باز کردن منوی فروشگاه"}
            onClick={(e) => {
              e.preventDefault();
              cancelClose();
              setOpen((v) => !v);
            }}
          >
            <span aria-hidden>▾</span>
          </button>
        </div>
      </div>

      {createPortal(panel, document.body)}
    </>
  );
}
