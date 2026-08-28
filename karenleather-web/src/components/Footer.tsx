import { Link } from "react-router-dom";
import {
  contactCopy,
  footerContent,
  siteBrand,
  siteContact,
  siteCredit,
} from "../content/siteCopy";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer kl-footer">
      <div className="container section footer-grid">
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

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {siteBrand.name} — {siteBrand.legalName}
        </span>
        <span className="footer-social">
          <a href={siteContact.instagram} target="_blank" rel="noreferrer">
            اینستاگرام
          </a>
          <a
            href={`https://wa.me/98${siteContact.phone.slice(1)}`}
            target="_blank"
            rel="noreferrer"
          >
            واتساپ
          </a>
        </span>
      </div>

      <div className="container footer-credit">
        <span>{siteCredit.label}</span>
        <a href={siteCredit.url} target="_blank" rel="noreferrer noopener">
          {siteCredit.name}
        </a>
      </div>
    </footer>
  );
}
