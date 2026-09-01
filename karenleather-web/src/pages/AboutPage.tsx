import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { aboutMedia, ostrichLeather, shotVars, storeHotel } from "../content/media";
import { breadcrumbJsonLd, staticPageSeo } from "../content/seo";
import { aboutCopy, storeCopy, wholesaleCopy } from "../content/siteCopy";
import { usePageSeo } from "../context/SeoContext";
import { SmartImage } from "../components/SmartImage";

const storyBlocks = [
  {
    ...aboutCopy.sections[0],
    shot: aboutMedia.iranianCraft,
  },
  {
    ...aboutCopy.sections[1],
    shot: ostrichLeather.bodyLeg,
  },
  {
    ...aboutCopy.sections[2],
    shot: aboutMedia.service,
  },
];

export function AboutPage() {
  const jsonLd = useMemo(
    () =>
      breadcrumbJsonLd([
        { name: "خانه", path: "/" },
        { name: "درباره ما", path: "/about" },
      ]),
    [],
  );
  usePageSeo(staticPageSeo["/about"], jsonLd);

  return (
    <>
      <section className="kl-page-hero">
        <div className="container">
          <div className="kl-page-hero__frame">
            <SmartImage src={aboutMedia.hero} className="kl-page-hero__bg" sizes="100vw" loading="eager" />
            <div className="kl-page-hero__content">
              <p className="kl-eyebrow">{aboutCopy.subtitle}</p>
              <h1>{aboutCopy.title}</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="kl-about-stats">
        <div className="container kl-about-stats__grid">
          {aboutCopy.values.map((v) => (
            <div key={v.label} className="kl-about-stat">
              <span className="kl-about-stat__value">{v.value}</span>
              <span className="kl-about-stat__label">{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="container section">
        <Breadcrumbs items={[{ label: "خانه", to: "/" }, { label: "درباره ما" }]} />
        <div className="kl-about-intro">
          <p className="kl-about-intro__lead">{aboutCopy.intro}</p>
        </div>

        <div className="kl-about-story">
          {storyBlocks.map((block, i) => (
            <article
              key={block.title}
              className={`kl-about-block${i % 2 === 1 ? " kl-about-block--reverse" : ""}`}
            >
              <div className="kl-about-block__text">
                <span className="kl-section-label">
                  {(i + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}
                </span>
                <h2>{block.title}</h2>
                <p>{block.body}</p>
              </div>
              <div className="kl-about-block__media">
                <SmartImage src={block.shot} loading="lazy" sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
            </article>
          ))}
        </div>

        <section className="kl-about-store">
          <div className="kl-about-store__media" style={shotVars(storeHotel.wide) as CSSProperties}>
            <SmartImage src={storeHotel.wide} loading="lazy" sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div className="kl-about-store__text">
            <span className="kl-section-label">فروشگاه حضوری</span>
            <h2>{storeCopy.title}</h2>
            <p>{storeCopy.lead}</p>
            <p className="kl-about-store__address">{storeCopy.address}</p>
            <Link to="/contact" className="btn btn-outline">
              مسیر و تماس
            </Link>
          </div>
        </section>

        <div className="kl-about-cta">
          <Link to="/shop" className="btn btn-gold">
            مشاهده محصولات
          </Link>
          <Link to="/representation" className="btn btn-outline">
            اخذ نمایندگی
          </Link>
          <Link to={wholesaleCopy.pageLink} className="btn btn-outline">
            فروش عمده چرم
          </Link>
        </div>
      </div>
    </>
  );
}
