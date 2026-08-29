import { AdminApp } from "./admin/AdminApp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartUIProvider } from "./context/CartUI";
import { StoreSettingsProvider } from "./context/StoreSettings";
import { ProductPreviewProvider } from "./context/ProductPreview";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { CartPage } from "./pages/CartPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductPage } from "./pages/ProductPage";
import { RepresentationPage } from "./pages/RepresentationPage";
import { WholesalePage } from "./pages/WholesalePage";
import { ShopPage } from "./pages/ShopPage";

export default function App() {
  return (
    <BrowserRouter>
      <StoreSettingsProvider>
        <CartUIProvider>
          <ProductPreviewProvider>
            <Routes>
              <Route path="/admin/*" element={<AdminApp />} />
              <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="shop" element={<ShopPage />} />
                <Route path="product/:id/:slug?" element={<ProductPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="representation" element={<RepresentationPage />} />
                <Route path="wholesale" element={<WholesalePage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </ProductPreviewProvider>
        </CartUIProvider>
      </StoreSettingsProvider>
    </BrowserRouter>
  );
}
