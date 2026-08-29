import { Link } from "react-router-dom";
import { notFoundSeo } from "../content/seo";
import { usePageSeo } from "../context/SeoContext";

interface NotFoundViewProps {
  title?: string;
  description?: string;
}

export function NotFoundView({
  title = "این صفحه پیدا نشد",
  description = "آدرس واردشده در فروشگاه چرم کارن وجود ندارد. می‌توانید به فروشگاه بروید یا به صفحه اصلی برگردید.",
}: NotFoundViewProps) {
  return (
    <div className="container kl-notfound">
      <p className="kl-eyebrow">۴۰۴</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="kl-notfound__actions">
        <Link to="/shop" className="btn btn-gold">
          ورود به فروشگاه
        </Link>
        <Link to="/" className="btn btn-outline">
          صفحه اصلی
        </Link>
        <Link to="/contact" className="link-more">
          تماس با ما
        </Link>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  usePageSeo(notFoundSeo);
  return <NotFoundView />;
}
