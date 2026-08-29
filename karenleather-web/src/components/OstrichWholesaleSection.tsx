import { Link } from "react-router-dom";
import { ostrichLeather } from "../content/media";
import { wholesaleCopy } from "../content/siteCopy";
import { WHATSAPP_LINK } from "../lib/utils";
import { SmartImage } from "./SmartImage";

interface OstrichWholesaleSectionProps {
  variant?: "home" | "full";
}

/** فروش عمده چرم شترمرغ — تنه و ساق */
export function OstrichWholesaleSection({ variant = "home" }: OstrichWholesaleSectionProps) {
  const isFull = variant === "full";

  return (
    <section
      className={`kl-wholesale${isFull ? " kl-wholesale--page" : ""}`}
      aria-label={wholesaleCopy.title}
    >
      <div className="container kl-wholesale__grid">
        <div className="kl-wholesale__visual">
          <SmartImage src={ostrichLeather.bodyLeg} loading="lazy" sizes="(max-width: 900px) 100vw, 40vw" />
          {!isFull && (
            <div className="kl-wholesale__badge">
              <strong>تنه + ساق</strong>
              <span>فروش عمده</span>
            </div>
          )}
        </div>

        <div className="kl-wholesale__copy">
          <span className="kl-section-label">
            {isFull ? wholesaleCopy.subtitle : "فروش عمده · همکاری"}
          </span>
          <h2 className={isFull ? "kl-wholesale__title" : "section-title"}>
            {wholesaleCopy.title}
          </h2>
          <p className="kl-wholesale__lead">{wholesaleCopy.lead}</p>

          <div className="kl-wholesale__types">
            {wholesaleCopy.types.map((t) => (
              <article key={t.id} className="kl-wholesale__type">
                <h3>{t.title}</h3>
                <span className="kl-wholesale__type-sub">{t.subtitle}</span>
                <p>{t.body}</p>
              </article>
            ))}
          </div>

          {isFull && (
            <>
              <div className="kl-wholesale__colors">
                <h3>{wholesaleCopy.colors.title}</h3>
                <p>{wholesaleCopy.colors.body}</p>
                <div className="kl-wholesale__tones">
                  {wholesaleCopy.colors.tones.map((tone) => (
                    <span key={tone}>{tone}</span>
                  ))}
                </div>
              </div>

              <div className="kl-wholesale__audience">
                <h3>مخاطب فروش عمده</h3>
                <ul>
                  {wholesaleCopy.audience.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="kl-wholesale__actions">
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn btn-gold">
              {wholesaleCopy.cta}
            </a>
            {!isFull && (
              <Link to={wholesaleCopy.pageLink} className="btn btn-outline kl-wholesale__more">
                جزئیات فروش عمده
              </Link>
            )}
            {isFull && (
              <Link to="/contact" className="btn btn-outline">
                تماس با دفتر مرکزی
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
