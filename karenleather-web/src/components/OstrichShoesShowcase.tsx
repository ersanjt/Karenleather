import { Link } from "react-router-dom";
import { ostrichShoes } from "../content/media";
import { homeCopy } from "../content/siteCopy";
import { SmartImage } from "./SmartImage";

interface OstrichShoesShowcaseProps {
  variant?: "home" | "shop";
}

/** نمایش کلکسیون کفش چرم شترمرغ */
export function OstrichShoesShowcase({ variant = "home" }: OstrichShoesShowcaseProps) {
  const copy = homeCopy.ostrichShoes;

  if (variant === "shop") {
    return (
      <section className="kl-ostrich kl-ostrich--compact" aria-label={copy.title}>
        <div className="kl-ostrich__compact-grid">
          <div className="kl-ostrich__compact-visual">
            <SmartImage src={ostrichShoes.cognac} alt="" loading="lazy" />
            <SmartImage src={ostrichShoes.brown} alt="" loading="lazy" />
          </div>
          <div className="kl-ostrich__compact-copy">
            <span className="kl-section-label">{copy.subtitle}</span>
            <h2>{copy.title}</h2>
            <p>{copy.lead}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="kl-ostrich" aria-label={copy.title}>
      <div className="container kl-ostrich__grid">
        <div className="kl-ostrich__visual">
          <figure className="kl-ostrich__shot kl-ostrich__shot--main">
            <SmartImage src={ostrichShoes.cognac} alt="" loading="lazy" />
            <figcaption>{copy.models[1].name}</figcaption>
          </figure>
          <figure className="kl-ostrich__shot kl-ostrich__shot--alt">
            <SmartImage src={ostrichShoes.brown} alt="" loading="lazy" />
            <figcaption>{copy.models[0].name}</figcaption>
          </figure>
        </div>
        <div className="kl-ostrich__copy">
          <span className="kl-section-label">کلکسیون کفش</span>
          <h2 className="section-title">{copy.title}</h2>
          <p className="kl-ostrich__lead">{copy.lead}</p>
          <ul className="kl-ostrich__models">
            {copy.models.map((m) => (
              <li key={m.name}>
                <strong>{m.name}</strong>
                <span>{m.tone}</span>
              </li>
            ))}
          </ul>
          <Link to={copy.shopLink} className="btn btn-gold">
            {copy.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
