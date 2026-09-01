/** مسیرهای تصویر — لوگوها در brandLogos.ts */
export { brand, brandFavicon, brandLogos } from "./brandLogos";

/** تصویر سایت با alt و ابعاد واقعی — برای سئو و جلوگیری از CLS */
export type MediaShot = {
  src: string;
  alt: string;
  title?: string;
  href?: string;
  wide?: boolean;
  width: number;
  height: number;
};

/** نسبت واقعی عکس برای قاب contain — بدون برش */
export function shotVars(shot: Pick<MediaShot, "width" | "height">): {
  "--shot-w": number;
  "--shot-h": number;
} {
  return {
    "--shot-w": shot.width,
    "--shot-h": shot.height,
  };
}

const TABRIZ = "/uploads/campaign/karen-tabriz";
const MEN = "/uploads/campaign/lookbook-men";

export const campaign = {
  yellowSet: {
    src: `${TABRIZ}/01-yellow-set-street.jpg`,
    alt: "ست کیف و بوت چرم زرد کارن تبریز روی سنگفرش",
    title: "ست کیف و بوت زرد",
    href: "/shop?filter=women",
    wide: true,
    width: 1024,
    height: 499,
  },
  yellowBagDome: {
    src: `${TABRIZ}/02-yellow-bag-tabriz-dome.jpg`,
    alt: "کیف چرم زرد کارن در برابر معماری تاریخی تبریز",
    title: "کارن تبریز",
    href: "/about",
    width: 1024,
    height: 571,
  },
  redBagDome: {
    src: `${TABRIZ}/04-red-bag-tabriz-dome.jpg`,
    alt: "کیف چرم قرمز کارن تبریز روی گنبد سنگی",
    title: "کیف چرم قرمز",
    href: "/shop?filter=women",
    width: 1024,
    height: 576,
  },
  blackBag: {
    src: `${TABRIZ}/05-black-bag-studio.jpg`,
    alt: "کیف چرم مشکی فلوتر کارن تبریز روی پس‌زمینه برند",
    title: "کیف مشکی فلوتر",
    href: "/shop?filter=women",
    width: 1019,
    height: 1024,
  },
  blackOxford: {
    src: `${TABRIZ}/06-black-oxford-studio.jpg`,
    alt: "کفش آکسفورد چرم مشکی مردانه کارن تبریز",
    title: "کفش مردانه",
    href: "/shop?filter=footwear",
    width: 1019,
    height: 1024,
  },
  burgundyCircle: {
    src: `${TABRIZ}/07-burgundy-circle-studio.jpg`,
    alt: "کیف چرم زرشکی بافت کروکو با دسته‌گرد کارن تبریز",
    title: "کیف کروکو",
    href: "/shop?filter=women",
    width: 1019,
    height: 1024,
  },
} satisfies Record<string, MediaShot>;

export const campaignBanners: MediaShot[] = [
  campaign.yellowSet,
  campaign.yellowBagDome,
  campaign.redBagDome,
];

export const campaignStudio: MediaShot[] = [
  campaign.blackBag,
  campaign.blackOxford,
  campaign.burgundyCircle,
];

export const campaignHeels: MediaShot = {
  src: `${MEN}/womens-cream-pumps-tabriz.jpg`,
  alt: "کفش پاشنه‌بلند چرم کرم بافت‌دار کارن تبریز روی سنگفرش",
  title: "کفش مجلسی زنانه",
  href: "/shop?filter=footwear",
  width: 1024,
  height: 1024,
};

export const banners = {
  shop: campaign.yellowSet,
  craft: campaign.yellowBagDome,
  collection: campaign.redBagDome,
  about: campaign.yellowBagDome,
};

export const lookbookMen: MediaShot[] = [
  {
    src: `${MEN}/mens-loafers-ostrich-buckle.jpg`,
    alt: "لوفر مردانه چرم شترمرغ کارن با سگک فلزی روی پوست طبیعی",
    title: "لوفر شترمرغ",
    href: "/shop?filter=footwear",
    wide: true,
    width: 1024,
    height: 637,
  },
  {
    src: `${MEN}/mens-black-sneakers-editorial.jpg`,
    alt: "اسنیکر چرم مشکی مردانه کارن — لایف‌استایل ادیتوریال",
    title: "استایل شهری",
    href: "/shop?filter=men",
    width: 576,
    height: 1024,
  },
  {
    src: `${MEN}/mens-monk-strap-atelier.jpg`,
    alt: "ساخت کفش چرم کارن در کارگاه تبریز — مانک‌استرپ و چرم خام روی میز کار",
    title: "مانک‌استرپ",
    href: "/shop?filter=footwear",
    width: 576,
    height: 1024,
  },
  {
    src: `${MEN}/mens-monk-ostrich-hide.jpg`,
    alt: "کفش مردانه کارن روی چرم شترمرغ طبیعی تنه",
    title: "چرم شترمرغ",
    href: "/shop?filter=footwear",
    width: 576,
    height: 1024,
  },
  {
    src: `${MEN}/mens-grey-loafers-plaid.jpg`,
    alt: "لوفر چرم طوسی کارن با شلوار چهارخانه",
    title: "لوفر طوسی",
    href: "/shop?filter=men",
    width: 1024,
    height: 1024,
  },
  {
    src: `${MEN}/mens-burgundy-tassel-loafers-cello.jpg`,
    alt: "لوفر منگوله‌دار چرم زرشکی کروکو کارن — استایل کلاسیک",
    title: "لوفر زرشکی",
    href: "/shop?filter=men",
    width: 1024,
    height: 1024,
  },
  {
    src: `${MEN}/mens-sneakers-pouch-street.jpg`,
    alt: "اسنیکر و کیف دستی چرم مشکی کارن — استایل خیابانی مردانه",
    title: "اسنیکر و کیف دستی",
    href: "/shop?filter=men",
    width: 576,
    height: 1024,
  },
  {
    src: `${MEN}/mens-loafers-editorial-portrait.jpg`,
    alt: "کالج چرم مردانه کارن — پرتره ادیتوریال سیاه‌وسفید",
    title: "کالج مردانه",
    href: "/shop?filter=men",
    width: 684,
    height: 1024,
  },
  {
    src: `${MEN}/mens-woven-tassel-loafers.jpg`,
    alt: "لوفر مردانه چرم بافت قهوه‌ای منگوله‌دار کارن",
    title: "لوفر بافت",
    href: "/shop?filter=footwear",
    width: 1024,
    height: 1024,
  },
  {
    src: `${MEN}/mens-ostrich-loafers-hide.jpg`,
    alt: "لوفر مردانه چرم شترمرغ قهوه‌ای کارن روی پوست طبیعی",
    title: "لوفر شترمرغ قهوه‌ای",
    href: "/shop?filter=footwear",
    width: 1024,
    height: 1024,
  },
  {
    src: `${MEN}/mens-monk-croc-black.jpg`,
    alt: "کفش مانک‌استرپ مشکی بافت کروکو کارن",
    title: "مانک کروکو",
    href: "/shop?filter=men",
    width: 1024,
    height: 1024,
  },
  {
    src: `${MEN}/mens-black-sneakers-white-sole.jpg`,
    alt: "اسنیکر چرم مشکی مردانه کارن با زیره سفید",
    title: "اسنیکر زیره سفید",
    href: "/shop?filter=footwear",
    width: 1024,
    height: 1024,
  },
  {
    src: `${MEN}/mens-lookbook-editorial-square.jpg`,
    alt: "لایف‌استایل کفش چرم مردانه کارن تبریز",
    title: "نگاه کارن",
    href: "/shop?filter=men",
    width: 1024,
    height: 1024,
  },
];

export const storeHotel = {
  hero: {
    src: "/uploads/2026/07/store-hotel/04-storefront.jpg",
    alt: "نمای فروشگاه چرم کارن — شعبه هتل شهریار تبریز",
    width: 1000,
    height: 750,
  },
  wide: {
    src: "/uploads/2026/07/store-hotel/01-showroom-wide.jpg",
    alt: "نمای داخلی فروشگاه چرم کارن — ویترین کیف و کفش",
    width: 1000,
    height: 750,
  },
  shelves: {
    src: "/uploads/2026/07/store-hotel/02-shelves-bags.jpg",
    alt: "قفسه کیف و اکسسوری چرم در فروشگاه کارن تبریز",
    width: 1000,
    height: 750,
  },
  consultation: {
    src: "/uploads/2026/07/store-hotel/03-consultation-area.jpg",
    alt: "فضای مشاوره خرید حضوری فروشگاه چرم کارن",
    width: 960,
    height: 540,
  },
} satisfies Record<string, MediaShot>;

export const storeHotelGallery: MediaShot[] = [
  storeHotel.hero,
  storeHotel.wide,
  storeHotel.shelves,
  storeHotel.consultation,
];

export const aboutMedia = {
  hero: campaign.yellowBagDome,
  iranianCraft: campaign.yellowSet,
  ostrich: {
    src: "/uploads/2026/07/ostrich-leather/01-color-swatch-rack.jpg",
    alt: "نمونه رنگ چرم تنه و ساق شترمرغ در خط تولید کارن",
    width: 540,
    height: 960,
  },
  service: storeHotel.consultation,
  workshop: {
    src: `${MEN}/mens-monk-strap-atelier.jpg`,
    alt: "ساخت کفش چرم کارن در کارگاه تبریز — مانک‌استرپ و چرم خام روی میز کار",
    width: 576,
    height: 1024,
  },
};

export const ostrichShoes = {
  brown: {
    src: "/uploads/2026/07/ostrich-shoes/01-ostrich-sneaker-brown.jpg",
    alt: "اسنیکر چرم شترمرغ قهوه‌ای کارن — بافت نقاط طبیعی",
    width: 723,
    height: 960,
  },
  cognac: {
    src: "/uploads/2026/07/ostrich-shoes/02-ostrich-sneaker-cognac.jpg",
    alt: "اسنیکر چرم شترمرغ کهنه‌ای کارن — کلکسیون کفش",
    width: 723,
    height: 960,
  },
};

const WHOLESALE = "/uploads/campaign/wholesale";

export const ostrichLeather = {
  hero: {
    src: `${WHOLESALE}/01-hides-fan.jpg`,
    alt: "چرم شترمرغ تنه و ساق کارن — رنگ‌بندی شکلاتی، کهنه‌ای، مشکی، خردلی و زرشکی",
    width: 1536,
    height: 1024,
  },
  bodyLeg: {
    src: `${WHOLESALE}/02-body-leg-detail.jpg`,
    alt: "بافت نقاط چرم تنه شترمرغ در کنار فلس پوست‌مار چرم ساق",
    width: 1536,
    height: 1024,
  },
};

export const megaPromo = {
  ...campaign.yellowSet,
  subtitle: "کمپین کارن تبریز · چرم طبیعی",
  cta: "/shop?filter=women",
};

/** تصاویر شاخص اشتراک — ۱۲۰۰×۶۳۰ برای واتساپ، تلگرام، فیسبوک، لینکدین */
export const ogShare = {
  home: {
    src: "/uploads/campaign/og/og-home-1200x630.jpg",
    alt: campaign.yellowSet.alt,
    width: 1200,
    height: 630,
  },
  shop: {
    src: "/uploads/campaign/og/og-shop-1200x630.jpg",
    alt: campaign.burgundyCircle.alt,
    width: 1200,
    height: 630,
  },
  about: {
    src: "/uploads/campaign/og/og-about-1200x630.jpg",
    alt: campaign.yellowBagDome.alt,
    width: 1200,
    height: 630,
  },
  contact: {
    src: "/uploads/campaign/og/og-contact-1200x630.jpg",
    alt: "نمای فروشگاه چرم کارن — شعبه هتل شهریار تبریز",
    width: 1200,
    height: 630,
  },
  men: {
    src: "/uploads/campaign/og/og-men-1200x630.jpg",
    alt: "لوفر مردانه چرم شترمرغ کارن با سگک فلزی روی پوست طبیعی",
    width: 1200,
    height: 630,
  },
  wholesale: {
    src: "/uploads/campaign/og/og-wholesale-1200x630.jpg",
    alt: ostrichShoes.cognac.alt,
    width: 1200,
    height: 630,
  },
} satisfies Record<string, MediaShot>;


export const gallery: MediaShot[] = [
  campaign.yellowSet,
  campaignHeels,
  campaign.burgundyCircle,
  lookbookMen[3],
  campaign.redBagDome,
];

export function wpUrlToUpload(url: string): string {
  const marker = "/wp-content/uploads/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  return `/uploads/${url.slice(i + marker.length).split("?")[0]}`;
}
