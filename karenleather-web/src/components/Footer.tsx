import { Link } from "react-router-dom";
import {
  contactCopy,
  footerContent,
  siteBrand,
  siteContact,
  siteCredit,
} from "../content/siteCopy";
import { WHATSAPP_LINK } from "../lib/utils";
import { Logo } from "./Logo";

const mobileLinks = [
  ...footerContent.serviceLinks,
  ...footerContent.companyLinks.filter((l) => !footerContent.serviceLinks.some((s) => s.to === l.to)),
];

export function Footer() {
  return (
    <footer className="site-footer kl-footer">
      <div className="container section footer-grid footer-desktop">
        <div className="kl-footer__brand">
          <Logo variant="footer" />
          <p>
            {siteBrand.legalName} — تولید و عرضه کیف، کفش و اکسسوری از چرم طبیعی و شترمرغ
            (از سال {siteBrand.since})
          </p>
          <p className="kl-footer__tagline">{siteBrand.tagline}</p>
          <a href={siteBrand.url} className="kl-footer__domain">
            {siteBrand.domain}
          </a>
          <a href={`tel:${siteContact.phoneTel}`} className="kl-footer__phone">
            {siteContact.phoneDisplay}
          </a>
        </div>

        <div>
          <h4>{footerContent.serviceTitle}</h4>
          <ul>
            {footerContent.serviceLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
            <li>
              <a href="/sitemap.html">نقشه سایت</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>{footerContent.storesTitle}</h4>
          <ul>
            {contactCopy.offices.map((office) => (
              <li key={office.id}>
                <Link to="/contact">
                  <strong>{office.kind}</strong>
                  <span>{office.address}</span>
                </Link>
              </li>
            ))}
            <li>
              <span>کارگاه و خط تولید — {siteContact.city}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4>{footerContent.companyTitle}</h4>
          <ul>
            {footerContent.companyLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-mobile">
        <Logo variant="footer" />
        <p className="footer-mobile__name">{siteBrand.legalName}</p>
        <p className="footer-mobile__tag">{siteBrand.tagline}</p>
        <div className="footer-mobile__actions">
          <a href={`tel:${siteContact.phoneTel}`}>تماس</a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            واتساپ
          </a>
          <a href={siteContact.instagram} target="_blank" rel="noopener noreferrer">
            اینستاگرام
          </a>
        </div>
        <nav className="footer-mobile__nav" aria-label="لینک‌های فوتر">
          {mobileLinks.map((l) => (
            <Link key={`${l.to}-${l.label}`} to={l.to}>
              {l.label}
            </Link>
          ))}
          <a href="/sitemap.html">نقشه سایت</a>
        </nav>
        <p className="footer-mobile__address">{contactCopy.offices[0]?.address}</p>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {siteBrand.name} — {siteBrand.legalName}
        </span>
        <span className="footer-social footer-desktop">
          <a href={siteContact.instagram} target="_blank" rel="noopener noreferrer">
            اینستاگرام
          </a>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
            واتساپ
          </a>
        </span>
      </div>

      <div className="container footer-credit">
        <span>{siteCredit.label}</span>
        <a href={siteCredit.url} target="_blank" rel="noopener noreferrer">
          {siteCredit.name}
        </a>
      </div>
    </footer>
  );
}
