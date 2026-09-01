import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ProductCard } from "../components/ProductCard";
import { OstrichShoesShowcase } from "../components/OstrichShoesShowcase";
import { OstrichWholesaleSection } from "../components/OstrichWholesaleSection";
import { MensLookbook } from "../components/MensLookbook";
import {
  aboutMedia,
  banners,
  campaign,
  campaignBanners,
  campaignHeels,
  campaignStudio,
  lookbookMen,
  shotVars,
  storeHotel,
} from "../content/media";
import {
  homeCopy,
  siteBrand,
  statsTicker,
  storeCopy,
  trustPillars,
} from "../content/siteCopy";
import { breadcrumbJsonLd, cleanProductTitle, itemListJsonLd, staticPageSeo } from "../content/seo";
import { usePageSeo } from "../context/SeoContext";
import { quickShopLinks } from "../content/menu";
import { featuredProducts } from "../data";
import { productPath } from "../lib/utils";
import { SmartImage } from "../components/SmartImage";

const slides = [
  campaign.yellowSet,
  lookbookMen[0],
  campaign.yellowBagDome,
  campaign.redBagDome,
];

const lookbook = [
  { ...campaignHeels, kicker: "کمپین" },
  { ...lookbookMen[5], kicker: "لایف‌استایل" },
  { ...lookbookMen[9], kicker: "استودیو" },
];

export function HomePage() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const jsonLd = useMemo(
    () => [
      breadcrumbJsonLd([{ name: "خانه", path: "/" }]),
      itemListJsonLd(
        "محصولات برجسته چرم کارن",
        featuredProducts.map((p) => ({ name: cleanProductTitle(p.title), path: productPath(p) })),
      ),
    ],
    [],
  );
  usePageSeo(staticPageSeo["/"], jsonLd);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <>
      <section
        className="kl-hero"
        aria-label="صفحه اصلی"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
        }}
      >
        <div className="kl-hero__stage">
          {slides.map((item, i) => (
            <SmartImage
              key={item.src}
              src={item}
              className={`kl-hero__slide${i === slide ? " is-active" : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding={i === 0 ? "sync" : "async"}
              sizes="100vw"
            />
          ))}
          <div className="kl-hero__veil" />
        </div>

        <div className="container kl-hero__grid">
          <div className="kl-hero__copy">
            <p className="kl-eyebrow">{homeCopy.hero.eyebrow}</p>
            <h1>{homeCopy.hero.title}</h1>
            <p className="kl-hero__lead">{homeCopy.hero.lead}</p>
            <div className="kl-hero__actions">
              <Link to="/shop" className="btn btn-gold">
                ورود به فروشگاه
              </Link>
              <Link to="/about" className="btn btn-ghost">
                داستان برند
              </Link>
            </div>
            <div className="kl-hero__dots" role="tablist" aria-label="اسلایدها">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === slide}
                  className={i === slide ? "is-active" : ""}
                  aria-label={`اسلاید ${i + 1}`}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
          </div>

          <div className="kl-hero__panel" aria-hidden="true">
            <div className="kl-hero__stat">
              <span className="kl-hero__stat-num">{siteBrand.since}</span>
              <span className="kl-hero__stat-label">سال تأسیس</span>
            </div>
            <div className="kl-hero__stat">
              <span className="kl-hero__stat-num">
                {siteBrand.productCount.toLocaleString("fa-IR")}+
              </span>
              <span className="kl-hero__stat-label">مدل محصول</span>
            </div>
            <div className="kl-hero__stat">
              <span className="kl-hero__stat-num">۲</span>
              <span className="kl-hero__stat-label">سال گارانتی</span>
            </div>
          </div>
        </div>

        <div className="kl-ticker" aria-hidden="true">
          <div className="kl-ticker__track">
            {[...statsTicker, ...statsTicker].map((item, i) => (
              <span key={`${item}-${i}`}>{item}</span>
            ))}
          </div>
        </div>
        <div className="kl-hero__overlap" aria-hidden="true" />
      </section>

      <section className="kl-pillars">
        <div className="container kl-pillars__grid">
          {trustPillars.map((p) => (
            <article key={p.num} className="kl-pillar">
              <span className="kl-pillar__num">{p.num}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kl-campaign" aria-label="کمپین کارن تبریز">
        <div className="container">
          <div className="kl-section-head">
            <div>
              <span className="kl-section-label">کمپین</span>
              <h2 className="section-title">کارن تبریز</h2>
              <p className="section-sub">چرم طبیعی، از خیابان‌های تبریز تا ویترین استودیو</p>
            </div>
            <Link to="/shop" className="link-more">
              خرید کلکسیون
            </Link>
          </div>
          <div className="kl-campaign__banners">
            {campaignBanners.map((item) => (
              <Link
                key={item.src}
                to={item.href ?? "/shop"}
                className="kl-campaign__shot"
              >
                <SmartImage src={item} loading="lazy" sizes="(max-width: 900px) 100vw, 48vw" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
          <div className="kl-campaign__studio">
            {campaignStudio.map((item) => (
              <Link
                key={item.src}
                to={item.href ?? "/shop"}
                className="kl-campaign__shot kl-campaign__shot--studio"
                style={shotVars(item) as CSSProperties}
              >
                <SmartImage src={item} loading="lazy" sizes="(max-width: 900px) 100vw, 33vw" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="kl-manifesto" aria-label={homeCopy.manifesto.label}>
        <div className="container kl-manifesto__grid">
          <div className="kl-manifesto__quote">
            <span className="kl-section-label">{homeCopy.manifesto.label}</span>
            <blockquote>{homeCopy.manifesto.quote}</blockquote>
            <Link to="/about" className="kl-text-link">
              {homeCopy.manifesto.cta}
            </Link>
          </div>
          <div className="kl-manifesto__visual">
            <SmartImage src={aboutMedia.workshop} loading="lazy" sizes="(max-width: 900px) 100vw, 50vw" />
            <p className="kl-manifesto__badge">
              <strong>{homeCopy.manifesto.badge}</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="section kl-categories">
        <div className="container">
          <div className="kl-section-head">
            <div>
              <span className="kl-section-label">۰۲ — دسته‌بندی</span>
              <h2 className="section-title">انتخاب سریع کلکسیون</h2>
            </div>
            <Link to="/shop" className="link-more">
              همه محصولات
            </Link>
          </div>
          <div className="kl-cat-rail">
            {quickShopLinks.slice(0, 8).map((cat, i) => (
              <Link key={cat.href} to={cat.href} className="kl-cat-card">
                <span className="kl-cat-card__index">
                  {(i + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}
                </span>
                {cat.image && (
                  <SmartImage src={cat.image} alt={`${cat.name} چرم کارن`} loading="lazy" sizes="160px" />
                )}
                <div className="kl-cat-card__body">
                  <strong>{cat.name}</strong>
                  <span>{cat.count.toLocaleString("fa-IR")} محصول</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="kl-craft">
        <div className="container kl-craft__grid">
          <Link to="/shop" className="kl-craft__tile kl-craft__tile--wide">
            <SmartImage src={banners.shop} loading="lazy" sizes="(max-width: 900px) 100vw, 60vw" />
            <div>
              <span className="kl-section-label">فروشگاه</span>
              <h3>کلکسیون آنلاین</h3>
              <p>{siteBrand.productCount.toLocaleString("fa-IR")} مدل چرم دست‌ساز</p>
            </div>
          </Link>
          <div className="kl-craft__tile kl-craft__tile--text">
            <span className="kl-section-label">۰۳ — متریال</span>
            <h3>{homeCopy.ostrich.title}</h3>
            <p>{homeCopy.ostrich.body}</p>
            <Link to={homeCopy.ostrichShoes.shopLink} className="btn btn-outline">
              {homeCopy.ostrich.cta}
            </Link>
            <Link to="/wholesale" className="kl-text-link kl-craft__extra-link">
              فروش عمده تنه و ساق ←
            </Link>
          </div>
          <Link to="/about" className="kl-craft__tile">
            <SmartImage src={banners.craft} loading="lazy" sizes="(max-width: 900px) 100vw, 40vw" />
            <div>
              <span className="kl-section-label">کارگاه</span>
              <h3>هنر چرم‌سازی</h3>
              <p>از برش تا دوخت — تبریز</p>
            </div>
          </Link>
          <Link to="/shop?filter=footwear" className="kl-craft__tile">
            <SmartImage src={campaign.blackOxford} loading="lazy" sizes="(max-width: 900px) 100vw, 40vw" />
            <div>
              <span className="kl-section-label">مردانه</span>
              <h3>کفش چرم کلاسیک</h3>
              <p>آکسفورد مشکی کارن تبریز</p>
            </div>
          </Link>
        </div>
      </section>

      <OstrichShoesShowcase />

      <MensLookbook />

      <OstrichWholesaleSection />

      <section className="section kl-lookbook">
        <div className="container">
          <div className="kl-section-head">
            <div>
              <span className="kl-section-label">۰۴ — منتخب</span>
              <h2 className="section-title">محصولات برجسته</h2>
              <p className="section-sub">نمونه‌ای از مجموعه {siteBrand.name}</p>
            </div>
            <Link to="/shop" className="link-more">
              مشاهده همه
            </Link>
          </div>
          <div className="kl-lookbook__rail">
            {featuredProducts.map((p) => (
              <div key={p.id} className="kl-lookbook__item">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section kl-store">
        <div className="container kl-store__grid">
          <div className="kl-store__copy">
            <span className="kl-section-label">۰۵ — فروشگاه حضوری</span>
            <h2 className="section-title">{storeCopy.title}</h2>
            <p className="kl-store__lead">{storeCopy.lead}</p>
            <p className="kl-store__address">{storeCopy.address}</p>
            <ul className="kl-store__highlights">
              {storeCopy.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-primary">
              مسیر و تماس
            </Link>
          </div>
          <div className="kl-store__gallery">
            <figure className="kl-store__figure kl-store__figure--hero">
              <SmartImage src={storeHotel.hero} loading="lazy" sizes="(max-width: 900px) 100vw, 50vw" />
              <figcaption>{storeCopy.subtitle}</figcaption>
            </figure>
            <figure className="kl-store__figure">
              <SmartImage src={storeHotel.wide} loading="lazy" sizes="(max-width: 900px) 50vw, 25vw" />
            </figure>
            <figure className="kl-store__figure">
              <SmartImage src={storeHotel.consultation} loading="lazy" sizes="(max-width: 900px) 50vw, 25vw" />
            </figure>
          </div>
        </div>
      </section>

      <section className="section kl-atelier">
        <div className="container">
          <div className="kl-section-head kl-section-head--center">
            <div>
              <span className="kl-section-label">۰۶ — گالری</span>
              <h2 className="section-title">{homeCopy.atelier.title}</h2>
              <p className="section-sub">
                {homeCopy.atelier.subtitle} — {homeCopy.atelier.caption}
              </p>
            </div>
          </div>
          <div className="kl-atelier__mosaic">
            {lookbook.map((item) => (
              <Link
                key={item.src}
                to={item.href ?? "/shop"}
                className="kl-atelier__cell"
              >
                <SmartImage src={item} loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" />
                <span>
                  <small>{item.kicker}</small>
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="kl-dual-cta">
        <div className="container kl-dual-cta__grid">
          <Link to="/shop?filter=women" className="kl-dual-cta__card kl-dual-cta__card--shop">
            <span className="kl-dual-cta__media">
              <SmartImage src={campaign.burgundyCircle} loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
            </span>
            <div>
              <span className="kl-section-label">خرید</span>
              <h3>کیف‌های کارن تبریز</h3>
              <span className="kl-dual-cta__go">ورود ←</span>
            </div>
          </Link>
          <Link to="/shop?filter=men" className="kl-dual-cta__card kl-dual-cta__card--shop">
            <span className="kl-dual-cta__media">
              <SmartImage src={lookbookMen[1]} loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
            </span>
            <div>
              <span className="kl-section-label">مردانه</span>
              <h3>کفش چرم کارن</h3>
              <span className="kl-dual-cta__go">ورود ←</span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
