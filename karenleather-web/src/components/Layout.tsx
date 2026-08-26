import { Outlet } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProductPreview } from "./ProductPreview";
import { WhatsAppButton } from "./WhatsAppButton";

export function Layout() {
  return (
    <>
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
    </>
  );
}
