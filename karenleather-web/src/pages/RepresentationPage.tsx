import { Link } from "react-router-dom";
import { representationCopy } from "../content/siteCopy";

export function RepresentationPage() {
  return (
    <>
      <section className="kl-page-hero kl-page-hero--short kl-page-hero--plain">
        <div className="kl-page-hero__veil" />
        <div className="container kl-page-hero__content">
          <p className="kl-eyebrow">{representationCopy.subtitle}</p>
          <h1>{representationCopy.title}</h1>
        </div>
      </section>

      <div className="container section">
        <div className="prose page-prose">
          <p className="page-prose__lead">{representationCopy.intro}</p>

          <h2>{representationCopy.benefitsTitle}</h2>
          <ul>
            {representationCopy.benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>{representationCopy.requirementsTitle}</h2>
          <ul>
            {representationCopy.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p className="page-prose__sign">
            <strong>{representationCopy.signatoryRole}</strong>
            <br />
            {representationCopy.signatory}
          </p>
        </div>

        <div className="kl-about-cta">
          <Link to="/contact" className="btn btn-gold">
            درخواست نمایندگی
          </Link>
          <Link to="/wholesale" className="btn btn-outline">
            فروش عمده چرم
          </Link>
        </div>
      </div>
    </>
  );
}
