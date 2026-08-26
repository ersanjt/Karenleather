import { OstrichWholesaleSection } from "../components/OstrichWholesaleSection";
import { ostrichLeather } from "../content/media";
import { wholesaleCopy } from "../content/siteCopy";
import { SmartImage } from "../components/SmartImage";

export function WholesalePage() {
  return (
    <>
      <section className="kl-page-hero">
        <SmartImage src={ostrichLeather.swatchRack} alt="" className="kl-page-hero__bg" />
        <div className="kl-page-hero__veil" />
        <div className="container kl-page-hero__content">
          <p className="kl-eyebrow">{wholesaleCopy.subtitle}</p>
          <h1>{wholesaleCopy.title}</h1>
        </div>
      </section>

      <OstrichWholesaleSection variant="full" />
    </>
  );
}
