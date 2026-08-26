import { Link } from "react-router-dom";
import { aboutMedia, storeHotel } from "../content/media";
import { aboutCopy, storeCopy, wholesaleCopy } from "../content/siteCopy";
import { Logo } from "../components/Logo";
import { SmartImage } from "../components/SmartImage";

export function AboutPage() {
  return (
    <>
      <section className="kl-page-hero">
        <SmartImage src={aboutMedia.hero} alt="" className="kl-page-hero__bg" />
        <div className="kl-page-hero__veil" />
        <div className="container kl-page-hero__content">
          <Logo variant="classic" />
          <p className="kl-eyebrow">{aboutCopy.subtitle}</p>
          <h1>{aboutCopy.title}</h1>
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
        <div className="kl-about-intro">
          <p className="kl-about-intro__lead">{aboutCopy.intro}</p>
        </div>

        <div className="kl-about-story">
          {aboutCopy.sections.map((block, i) => (
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
                <SmartImage
                  src={
                    i === 0
                      ? aboutMedia.portrait
                      : i === 1
                        ? aboutMedia.detail
                        : aboutMedia.workshop
                  }
                  alt=""
                  loading="lazy"
                />
              </div>
            </article>
          ))}
        </div>

        <section className="kl-about-store">
          <div className="kl-about-store__media">
            <SmartImage src={storeHotel.wide} alt="" loading="lazy" />
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
