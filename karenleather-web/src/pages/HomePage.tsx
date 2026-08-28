import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { OstrichShoesShowcase } from "../components/OstrichShoesShowcase";
import { OstrichWholesaleSection } from "../components/OstrichWholesaleSection";
import { Logo } from "../components/Logo";
import { aboutMedia, banners, gallery, hero, ostrichShoes, storeHotel } from "../content/media";
import {
  homeCopy,
  siteBrand,
  statsTicker,
  storeCopy,
  trustPillars,
} from "../content/siteCopy";
import { quickShopLinks } from "../content/menu";
import { featuredProducts } from "../data";
import { SmartImage } from "../components/SmartImage";

const slides = [
  { src: storeHotel.hero, alt: "فروشگاه چرم کارن — شعبه هتل شهریار تبریز" },
  { src: ostrichShoes.hero, alt: "کفش چرم شترمرغ — کلکسیون چرم کارن" },
  { src: hero.main, alt: "کیف و کفش چرم طبیعی — چرم کارن" },
  { src: hero.slide2, alt: "محصولات چرم دست‌ساز — کارگاه چرم کارن تبریز" },
];

export function HomePage() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <section className="kl-hero" aria-label="صفحه اصلی">
        <div className="kl-hero__stage">
          {slides.map((item, i) => (
            <SmartImage
              key={item.src}
              src={item.src}
              alt={item.alt}
              className={`kl-hero__slide${i === slide ? " is-active" : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding={i === 0 ? "sync" : "async"}
            />
          ))}
          <div className="kl-hero__veil" />
        </div>

        <div className="container kl-hero__grid">
          <div className="kl-hero__copy">
            <div className="kl-hero__logo">
              <Logo variant="hero" />
            </div>
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

      <section className="kl-manifesto">
        <div className="container kl-manifesto__grid">
          <div className="kl-manifesto__quote">
            <span className="kl-section-label">۰۱ — فلسفه برند</span>
            <blockquote>{homeCopy.manifesto}</blockquote>
            <Link to="/about" className="kl-text-link">
              بیشتر درباره کارن ←
            </Link>
          </div>
          <div className="kl-manifesto__visual">
            <SmartImage src={aboutMedia.workshop} alt="کارگاه تولید چرم کارن — دوخت دست‌ساز تبریز" loading="lazy" />
            <div className="kl-manifesto__badge">
              <strong>{siteBrand.tagline}</strong>
            </div>
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
                  <SmartImage src={cat.image} alt={`${cat.name} — چرم کارن`} loading="lazy" />
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
            <SmartImage src={banners.shop} alt="فروشگاه آنلاین چرم کارن — کیف و کفش چرم" loading="lazy" />
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
            <SmartImage src={banners.craft} alt="هنر چرم‌سازی در کارگاه چرم کارن" loading="lazy" />
            <div>
              <span className="kl-section-label">کارگاه</span>
              <h3>هنر چرم‌سازی</h3>
              <p>از برش تا دوخت — تبریز</p>
            </div>
          </Link>
          <Link to={homeCopy.ostrichShoes.shopLink} className="kl-craft__tile">
            <SmartImage src={ostrichShoes.brown} alt="کفش چرم شترمرغ قهوه‌ای — چرم کارن" loading="lazy" />
            <div>
              <span className="kl-section-label">جدید</span>
              <h3>کلکسیون شترمرغ</h3>
              <p>کفش و اکسسوری بافت‌دار</p>
            </div>
          </Link>
        </div>
      </section>

      <OstrichShoesShowcase />

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
              <SmartImage src={storeHotel.wide} alt="نمای داخلی فروشگاه چرم کارن — هتل شهریار" loading="lazy" />
            </figure>
            <figure className="kl-store__figure">
              <SmartImage src={storeHotel.shelves} alt="قفسه کیف و اکسسوری چرم — فروشگاه کارن" loading="lazy" />
            </figure>
            <figure className="kl-store__figure">
              <SmartImage src={storeHotel.consultation} alt="میز مشاوره خرید — فروشگاه چرم کارن" loading="lazy" />
            </figure>
            <figure className="kl-store__figure">
              <SmartImage src={storeHotel.hero} alt="نمای فروشگاه چرم کارن — تبریز" loading="lazy" />
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
            {gallery.map((src, i) => (
              <figure
                key={src}
                className={
                  i === 0 ? "kl-atelier__cell kl-atelier__cell--hero" : "kl-atelier__cell"
                }
              >
                <SmartImage src={src} alt={`گالری چرم کارن — تصویر ${(i + 1).toLocaleString("fa-IR")}`} loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="kl-dual-cta">
        <div className="container kl-dual-cta__grid">
          <Link to={homeCopy.ostrichShoes.shopLink} className="kl-dual-cta__card kl-dual-cta__card--shop">
            <SmartImage src={ostrichShoes.cognac} alt="کفش چرم شترمرغ کهنه‌ای — چرم کارن" loading="lazy" />
            <div>
              <span className="kl-section-label">خرید</span>
              <h3>فروشگاه آنلاین چرم کارن</h3>
              <span className="kl-dual-cta__go">ورود ←</span>
            </div>
          </Link>
          <Link to="/representation" className="kl-dual-cta__card kl-dual-cta__card--partner">
            <div>
              <span className="kl-section-label">همکاری</span>
              <h3>اخذ نمایندگی فروش</h3>
              <p>شبکه فروشگاهی با برندینگ یکپارچه و پشتیبانی شرکت</p>
              <span className="kl-dual-cta__go">شرایط نمایندگی ←</span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
