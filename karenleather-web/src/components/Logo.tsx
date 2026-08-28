import { logoAsset, type LogoVariant } from "../content/brandLogos";
import { SmartImage } from "./SmartImage";

interface LogoProps {
  /** نسخه لوگو — header | hero | footer | mark | text | loader | classic */
  variant?: LogoVariant;
  /** @deprecated از variant="mark" استفاده کنید */
  compact?: boolean;
}

/** لوگوی رسمی برند — هر variant فایل جداگانه، داخل کادر بدون برش */
export function Logo({ variant, compact = false }: LogoProps) {
  const resolved: LogoVariant = variant ?? (compact ? "mark" : "header");
  const asset = logoAsset(resolved);

  return (
    <div className={`logo-frame logo-frame--${resolved}`}>
      <SmartImage
        src={asset.src}
        fallbacks={asset.fallbacks}
        alt={asset.alt}
        className="logo-frame__img"
        loading="eager"
        decoding="async"
        width={resolved === "mark" ? 48 : 220}
        height={resolved === "mark" ? 48 : 72}
      />
    </div>
  );
}
