import { Outlet } from "react-router-dom";
import { usePageTransition } from "../hooks/usePageTransition";
import { SeoProvider } from "../context/SeoContext";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PageLoader } from "./PageLoader";
import { ProductPreview } from "./ProductPreview";
import { SiteMeta } from "./SiteMeta";
import { WhatsAppButton } from "./WhatsAppButton";

export function Layout() {
  const { visible, leaving } = usePageTransition();

  return (
    <SeoProvider>
      <PageLoader visible={visible} leaving={leaving} />
      <SiteMeta />
      <a className="skip-link" href="#page">
        رفتن به محتوای اصلی
      </a>
      <Header />
      <main id="page" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ProductPreview />
      <WhatsAppButton />
    </SeoProvider>
  );
}
