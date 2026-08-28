import { OstrichWholesaleSection } from "../components/OstrichWholesaleSection";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ostrichLeather } from "../content/media";
import { staticPageSeo } from "../content/seo";
import { wholesaleCopy } from "../content/siteCopy";
import { usePageSeo } from "../context/SeoContext";
import { SmartImage } from "../components/SmartImage";

export function WholesalePage() {
  usePageSeo(staticPageSeo["/wholesale"]);

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
