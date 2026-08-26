import { Link } from "react-router-dom";
import { storeHotel } from "../content/media";
import { contactCopy, siteContact, storeCopy } from "../content/siteCopy";
import { INSTAGRAM, WHATSAPP_LINK } from "../lib/utils";
import { SmartImage } from "../components/SmartImage";

export function ContactPage() {
  return (
    <>
      <section className="kl-page-hero">
        <SmartImage src={storeHotel.hero} alt="" className="kl-page-hero__bg" />
        <div className="kl-page-hero__veil" />
        <div className="container kl-page-hero__content">
          <p className="kl-eyebrow">{contactCopy.subtitle}</p>
          <h1>{contactCopy.title}</h1>
        </div>
      </section>

      <div className="container section">
        <div className="kl-contact-grid">
          {contactCopy.offices.map((office) => (
            <article
              key={office.id}
              className={`kl-contact-card${
                office.id === "store" ? " kl-contact-card--store" : ""
              }`}
            >
              <span className="kl-contact-card__kind">{office.kind}</span>
              <h3>{office.address}</h3>
              {office.id === "store" && (
                <p className="kl-contact-card__note">{storeCopy.lead}</p>
              )}
            </article>
          ))}
          <article className="kl-contact-card kl-contact-card--accent">
            <span className="kl-contact-card__kind">شماره تماس</span>
            <h3 dir="ltr">{contactCopy.phone}</h3>
            <p>پاسخگویی از طریق تماس، واتساپ و اینستاگرام</p>
          </article>
        </div>

        <section className="kl-store-showcase">
          <div className="kl-section-head">
            <div>
              <span className="kl-section-label">فروشگاه حضوری</span>
              <h2 className="section-title">{storeCopy.title}</h2>
            </div>
            <Link to="/shop" className="link-more">
              فروشگاه آنلاین
            </Link>
          </div>
          <div className="kl-store-showcase__grid">
            {storeHotel.gallery.map((src, i) => (
              <figure
                key={src}
                className={
                  i === 0
                    ? "kl-store-showcase__cell kl-store-showcase__cell--wide"
                    : "kl-store-showcase__cell"
                }
              >
                <SmartImage src={src} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        <div className="kl-contact-actions">
          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn btn-gold">
            ارتباط با واتساپ
          </a>
          <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="btn btn-primary">
            اینستاگرام چرم کارن
          </a>
          <a href={`tel:${siteContact.phoneTel}`} className="btn btn-outline">
            تماس تلفنی
          </a>
        </div>
      </div>
    </>
  );
}
