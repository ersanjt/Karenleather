import { brandLogos, type LogoVariant } from "../content/brandLogos";
import { siteBrand } from "../content/siteCopy";
import { SmartImage } from "./SmartImage";

interface LogoProps {
  /** نسخه لوگو — header | hero | footer | mark | text | loader | classic */
  variant?: LogoVariant;
  /** @deprecated از variant="mark" استفاده کنید */
  compact?: boolean;
}

/**
 * لوگوی هدر/هیرو/فوتر: نشان دایره‌ای KL + متن CSS
 * فایل‌های wordmark پس‌زمینهٔ تیره/اشتباه دارند و داخل کادر سفید خوانا نیستند.
 */
export function Logo({ variant, compact = false }: LogoProps) {
  const resolved: LogoVariant = variant ?? (compact ? "mark" : "header");
  const mark = brandLogos.mark;

  if (resolved === "mark") {
    return (
      <span className="logo-lockup logo-lockup--mark">
        <SmartImage
          src={mark.src}
          fallbacks={mark.fallbacks}
          alt={mark.alt}
          className="logo-lockup__mark"
          loading="eager"
          decoding="async"
          width={48}
          height={48}
        />
      </span>
    );
  }

  if (resolved === "footer") {
    return (
      <span className="logo-lockup logo-lockup--footer">
        <SmartImage
          src={mark.src}
          fallbacks={mark.fallbacks}
          alt={siteBrand.name}
          className="logo-lockup__mark"
          loading="eager"
          decoding="async"
          width={96}
          height={96}
        />
        <span className="logo-lockup__text">{siteBrand.name}</span>
      </span>
    );
  }

  return (
    <span className={`logo-lockup logo-lockup--${resolved}`}>
      <SmartImage
        src={mark.src}
        fallbacks={mark.fallbacks}
        alt=""
        className="logo-lockup__mark"
        loading="eager"
        decoding="async"
        width={48}
        height={48}
      />
      <span className="logo-lockup__text">{siteBrand.name}</span>
    </span>
  );
}
