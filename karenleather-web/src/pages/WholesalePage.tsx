import { useMemo } from "react";
import { OstrichWholesaleSection } from "../components/OstrichWholesaleSection";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ostrichLeather } from "../content/media";
import { breadcrumbJsonLd, faqJsonLd, staticPageSeo, wholesaleFaq } from "../content/seo";
import { wholesaleCopy } from "../content/siteCopy";
import { usePageSeo } from "../context/SeoContext";
import { SmartImage } from "../components/SmartImage";

export function WholesalePage() {
  const jsonLd = useMemo(
    () => [
      breadcrumbJsonLd([
        { name: "خانه", path: "/" },
        { name: "فروش عمده", path: "/wholesale" },
      ]),
      faqJsonLd(wholesaleFaq),
    ],
    [],
  );
  usePageSeo(staticPageSeo["/wholesale"], jsonLd);

  return (
    <>
      <section className="kl-page-hero">
        <SmartImage src={ostrichLeather.swatchRack} alt="نمونه رنگ چرم شترمرغ — فروش عمده کارن" className="kl-page-hero__bg" />
        <div className="kl-page-hero__veil" />
        <div className="container kl-page-hero__content">
          <p className="kl-eyebrow">{wholesaleCopy.subtitle}</p>
          <h1>{wholesaleCopy.title}</h1>
        </div>
      </section>

      <div className="container page-breadcrumbs">
        <Breadcrumbs items={[{ label: "خانه", to: "/" }, { label: "فروش عمده" }]} />
      </div>

      <OstrichWholesaleSection variant="full" />
    </>
  );
}
