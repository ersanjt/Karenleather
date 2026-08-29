import { useEffect } from "react";
import { logoAsset } from "../content/brandLogos";
import { SmartImage } from "./SmartImage";

interface Props {
  visible: boolean;
  leaving?: boolean;
}

/** لوگوی کامل (آیکون + متن) هنگام لود و جابه‌جایی صفحات */
export function PageLoader({ visible, leaving = false }: Props) {
  useEffect(() => {
    document.getElementById("initial-loader")?.remove();
  }, []);

  if (!visible && !leaving) return null;

  const logo = logoAsset("loader");

  return (
    <div
      className={`page-loader ${visible && !leaving ? "is-visible" : ""} ${leaving ? "is-leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="در حال بارگذاری"
    >
      <div className="page-loader-lockup">
        <span className="page-loader-ring" aria-hidden />
        <SmartImage
          src={logo.src}
          fallbacks={logo.fallbacks}
          alt={logo.alt}
          className="page-loader-logo"
          decoding="sync"
          fetchPriority="high"
          width={148}
          height={148}
          sizes="148px"
        />
      </div>
    </div>
  );
}
