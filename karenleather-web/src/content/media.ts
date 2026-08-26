/** مسیرهای تصویر — لوگوها در brandLogos.ts */
export { brand, brandFavicon, brandLogos } from "./brandLogos";

export const hero = {
  main: "/uploads/2023/01/cropped-WhatsApp-Image-2022-09-14-at-2.53.23-PM-1.jpeg",
  slide2: "/uploads/2023/01/WhatsApp-Image-2022-09-14-at-2.53.21-PM.jpeg",
  slide3: "/uploads/2023/01/WhatsApp-Image-2022-09-14-at-2.53.17-PM-1.jpeg",
  background: "/uploads/2023/01/cropped-cropped-WhatsApp-Image-2022-09-14-at-2.53.23-PM-1.jpeg",
};

export const banners = {
  shop: "/uploads/2023/01/cropped-cropped-WhatsApp-Image-2022-09-14-at-2.53.23-PM-1.jpeg",
  craft: "/uploads/2021/02/2-4-scaled.jpg",
  collection: "/uploads/2026/07/ostrich-shoes/02-ostrich-sneaker-cognac.jpg",
  about: "/uploads/2023/01/WhatsApp-Image-2022-09-14-at-2.53.24-PM-1.jpeg",
};

export const aboutMedia = {
  hero: banners.craft,
  workshop: "/uploads/2023/01/WhatsApp-Image-2022-09-14-at-2.53.21-PM.jpeg",
  detail: "/uploads/2023/01/msg59263463-649732.jpg",
  portrait: "/uploads/2023/01/WhatsApp-Image-2022-09-14-at-2.53.17-PM-1.jpeg",
};

/** تصاویر فروشگاه شعبه هتل شهریار — تبریز */
export const storeHotel = {
  hero: "/uploads/2026/07/store-hotel/04-storefront.jpg",
  wide: "/uploads/2026/07/store-hotel/01-showroom-wide.jpg",
  shelves: "/uploads/2026/07/store-hotel/02-shelves-bags.jpg",
  consultation: "/uploads/2026/07/store-hotel/03-consultation-area.jpg",
  gallery: [
    "/uploads/2026/07/store-hotel/04-storefront.jpg",
    "/uploads/2026/07/store-hotel/01-showroom-wide.jpg",
    "/uploads/2026/07/store-hotel/02-shelves-bags.jpg",
    "/uploads/2026/07/store-hotel/03-consultation-area.jpg",
  ],
};

/** کفش چرم شترمرغ — تصاویر محصول واقعی */
export const ostrichShoes = {
  brown: "/uploads/2026/07/ostrich-shoes/01-ostrich-sneaker-brown.jpg",
  cognac: "/uploads/2026/07/ostrich-shoes/02-ostrich-sneaker-cognac.jpg",
  hero: "/uploads/2026/07/ostrich-shoes/02-ostrich-sneaker-cognac.jpg",
  gallery: [
    "/uploads/2026/07/ostrich-shoes/02-ostrich-sneaker-cognac.jpg",
    "/uploads/2026/07/ostrich-shoes/01-ostrich-sneaker-brown.jpg",
  ],
};

export const gallery = [
  "/uploads/2023/01/WhatsApp-Image-2022-09-14-at-2.53.17-PM.jpeg",
  "/uploads/2023/01/WhatsApp-Image-2022-09-14-at-2.53.21-PM.jpeg",
  "/uploads/2023/01/WhatsApp-Image-2022-09-14-at-2.53.24-PM-1.jpeg",
  "/uploads/2023/01/cropped-WhatsApp-Image-2022-09-14-at-2.53.23-PM-1.jpeg",
  "/uploads/2023/01/msg59263463-649732.jpg",
  "/uploads/2021/02/2-4-scaled.jpg",
];

export const megaPromo = {
  image: "/uploads/2026/07/ostrich-shoes/01-ostrich-sneaker-brown.jpg",
  title: "کفش چرم شترمرغ",
  subtitle: "بافت منحصربفرد · طراحی مدرن",
  cta: "/shop?filter=footwear",
};

/** چرم شترمرغ — نمونه رنگ تنه و ساق (فروش عمده) */
export const ostrichLeather = {
  swatchRack: "/uploads/2026/07/ostrich-leather/01-color-swatch-rack.jpg",
};

export function wpUrlToUpload(url: string): string {
  const marker = "/wp-content/uploads/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  return `/uploads/${url.slice(i + marker.length).split("?")[0]}`;
}
