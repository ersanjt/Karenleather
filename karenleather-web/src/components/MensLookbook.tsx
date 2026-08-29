import { Link } from "react-router-dom";
import { lookbookMen } from "../content/media";
import { SmartImage } from "./SmartImage";

interface MensLookbookProps {
  variant?: "home" | "shop";
}

export function MensLookbook({ variant = "home" }: MensLookbookProps) {
  const shots = variant === "shop" ? lookbookMen.slice(5) : lookbookMen.slice(0, 5);

  return (
    <section
      className={`kl-mens${variant === "shop" ? " kl-mens--shop" : ""}`}
      aria-label="لایف‌استایل کفش مردانه کارن"
    >
      <div className="container">
        <div className="kl-section-head">
          <div>
            <span className="kl-section-label">مردانه</span>
            <h2 className="section-title">کفش چرم مردانه</h2>
            <p className="section-sub">لوفر، مانک‌استرپ و اسنیکر — لایف‌استایل کارن لدر</p>
          </div>
          <Link to="/shop?filter=men" className="link-more">
            کلکسیون مردانه
          </Link>
        </div>
        <div className="kl-mens__grid">
          {shots.map((item) => (
            <Link
              key={item.src}
              to={item.href ?? "/shop"}
              className={`kl-mens__shot${item.wide ? " kl-mens__shot--wide" : ""}`}
            >
              <SmartImage src={item} loading="lazy" sizes="(max-width: 768px) 100vw, 25vw" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
