import type { Product } from "../types";
import { absoluteUrl, siteBrand, siteContact, wholesaleCopy, representationCopy } from "./siteCopy";
import { brandLogos } from "./brandLogos";
import { primaryImage, productPath } from "../lib/utils";

/** تصویر اجتماعی — ویترین واقعی، نه لوگوی کوچک */
export const defaultOgImage = absoluteUrl("/uploads/2026/07/store-hotel/01-showroom-wide.jpg");
export const defaultOgImageAlt = "فروشگاه چرم کارن — شعبه هتل شهریار تبریز";

const INDEXABLE_SHOP_FILTERS = new Set(["new", "sale", "footwear", "women", "men", "accessories"]);

export interface PageSeo {
  title: string;
  description: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "product";
  robots?: string;
}

export const staticPageSeo: Record<string, PageSeo> = {
  "/": {
    title: `چرم کارن | فروشگاه کیف و کفش چرم طبیعی — تبریز`,
    description:
      "فروشگاه آنلاین چرم کارن — تولیدکننده کیف، کفش، کمربند و اکسسوری از چرم طبیعی و شترمرغ. ۱۱۶+ مدل، گارانتی ۲ ساله، ارسال سراسری. تبریز.",
    ogImage: defaultOgImage,
  },
  "/shop": {
    title: `فروشگاه آنلاین — ${siteBrand.name} | کیف و کفش چرم`,
    description:
      "خرید آنلاین کیف، کفش و اکسسوری چرم طبیعی — کلکسیون زنانه، مردانه، کفش مجلسی، بوت و چرم شترمرغ. فیلتر دسته‌بندی و جستجو.",
  },
  "/about": {
    title: `درباره چرم کارن — تولیدکننده چرم طبیعی از ${siteBrand.since}`,
    description:
      "شرکت صنایع چرم کارن افق نو — تولید کیف، کفش و اکسسوری چرم طبیعی و شترمرغ در تبریز از سال ۱۳۹۴. گارانتی ۲ ساله و خدمات پس از فروش.",
  },
  "/contact": {
    title: `تماس با چرم کارن — دفتر مرکزی و فروشگاه تبریز`,
    description:
      `تماس با چرم کارن: ${siteContact.phoneDisplay} — دفتر مرکزی باغمیشه و فروشگاه هتل شهریار تبریز. مشاوره خرید و خدمات پس از فروش.`,
  },
  "/wholesale": {
    title: `فروش عمده چرم شترمرغ — تنه و ساق | ${siteBrand.name}`,
    description:
      "فروش عمده چرم شترمرغ تنه و ساق برای کارگاه‌ها و برندها — طیف رنگ‌بندی اختصاصی، بافت نقاط و پوست‌مار. استعلام از چرم کارن.",
  },
  "/representation": {
    title: `اخذ نمایندگی چرم کارن — شبکه فروشگاهی`,
    description:
      "شرایط اخذ نمایندگی فروش چرم کارن — برندینگ یکپارچه، نرم‌افزار فروش، پشتیبانی شرکت. درخواست نمایندگی در شهرهای مختلف.",
  },
  "/cart": {
    title: `سبد خرید — ${siteBrand.name}`,
    description: "سبد خرید فروشگاه چرم کارن.",
    robots: "noindex, nofollow",
  },
};

export const notFoundSeo: PageSeo = {
  title: `صفحه یافت نشد — ${siteBrand.name}`,
  description: "این صفحه در فروشگاه چرم کارن وجود ندارد. به فروشگاه یا صفحه اصلی برگردید.",
  robots: "noindex, follow",
};

/** مسیر کنونیکال: queryهای مرتب‌سازی/نمایش/جستجو ایندکس نشوند */
export function canonicalPath(pathname: string, searchParams: URLSearchParams): string {
  const clean = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname || "/";

  if (clean === "/shop") {
    if (searchParams.get("q")?.trim()) return "/shop";
    const cat = searchParams.get("cat");
    if (cat) return `/shop?cat=${encodeURIComponent(cat)}`;
    const filter = searchParams.get("filter");
    if (filter && INDEXABLE_SHOP_FILTERS.has(filter)) return `/shop?filter=${encodeURIComponent(filter)}`;
    return "/shop";
  }

  return clean;
}

export function canonicalUrl(pathname: string, searchParams: URLSearchParams): string {
  return absoluteUrl(canonicalPath(pathname, searchParams));
}

const FILTER_SEO: Record<string, { title: string; description: string }> = {
  new: {
    title: "جدیدترین محصولات",
    description: "جدیدترین کیف، کفش و اکسسوری چرم کارن — چرم طبیعی دست‌ساز با گارانتی ۲ ساله.",
  },
  footwear: {
    title: "کفش چرم",
    description: "خرید کفش چرم مردانه و زنانه — مجلسی، بوت، لوفر، صندل و کفش شترمرغ از چرم کارن.",
  },
  women: {
    title: "محصولات زنانه",
    description: "کلکسیون زنانه چرم کارن — کیف، کفش و اکسسوری چرم طبیعی.",
  },
  men: {
    title: "محصولات مردانه",
    description: "کلکسیون مردانه چرم کارن — کفش، کیف و اکسسوری چرم طبیعی.",
  },
  accessories: {
    title: "اکسسوری چرم",
    description: "اکسسوری چرم طبیعی — کمربند، جاکارتی، پاسپورتی و محصولات چرم شترمرغ.",
  },
  sale: {
    title: "حراج و تخفیف",
    description: "محصولات تخفیف‌دار چرم کارن — فرصت خرید کیف و کفش چرم با قیمت ویژه.",
  },
};

export function shopPageSeo(catName?: string, filter?: string, query?: string): PageSeo {
  if (query?.trim()) {
    const q = query.trim();
    return {
      title: `جستجو «${q}» — فروشگاه ${siteBrand.name}`,
      description: `نتایج جستجو برای «${q}» در فروشگاه آنلاین چرم کارن — کیف، کفش و اکسسوری چرم طبیعی.`,
      robots: "noindex, follow",
    };
  }
  if (catName) {
    return {
      title: `${catName} — خرید آنلاین | ${siteBrand.name}`,
      description: `خرید ${catName} از چرم کارن — چرم طبیعی دست‌ساز، گارانتی ۲ ساله، ارسال سراسری. مشاهده و سفارش آنلاین.`,
    };
  }
  if (filter && FILTER_SEO[filter]) {
    const f = FILTER_SEO[filter];
    return {
      title: `${f.title} — ${siteBrand.name}`,
      description: f.description,
    };
  }
  return staticPageSeo["/shop"];
}

export function productPageSeo(product: Product): PageSeo {
  const cats = product.categories.map((c) => c.name).join("، ");
  const cleanTitle = product.title.replace(/^مدل:\s*/i, "");
  return {
    title: `${cleanTitle}${cats ? ` | ${cats}` : ""} — ${siteBrand.name}`,
    description: productSeoDescription(product),
    ogImage: product.images[0]
      ? absoluteUrl(`/uploads/${product.images[0].file.split("?")[0]}`)
      : defaultOgImage,
    ogImageAlt: productImageAlt(product),
    ogType: "product",
  };
}

export function productSeoDescription(product: Product): string {
  if (product.excerpt?.trim()) return product.excerpt.trim();
  const cats = product.categories.map((c) => c.name).join("، ");
  const cleanTitle = product.title.replace(/^مدل:\s*/i, "");
  return `خرید ${cleanTitle} از فروشگاه ${siteBrand.name}${cats ? ` — دسته ${cats}` : ""}. چرم طبیعی دست‌ساز، گارانتی ۲ ساله، ارسال به سراسر ایران. تولید ${siteContact.city}.`;
}

export function productBodyHtml(product: Product): string {
  if (product.description?.trim()) return product.description;
  const cats = product.categories.map((c) => c.name).join("، ");
  const cleanTitle = product.title.replace(/^مدل:\s*/i, "");
  const material = detectMaterial(cleanTitle);
  return `<p><strong>${cleanTitle}</strong> از مجموعه ${siteBrand.name}${cats ? ` — ${cats}` : ""}.</p>
<p>این محصول با ${material} و دوخت دست‌ساز در کارگاه ${siteContact.city} تولید شده است. تمامی محصولات چرم کارن دارای <strong>گارانتی ۲ ساله</strong> اصالت و کیفیت هستند.</p>
<p>برای مشاوره خرید، سفارش اختصاصی یا اطلاع از موجودی با ${siteContact.phoneDisplay} تماس بگیرید.</p>`;
}

function detectMaterial(title: string): string {
  if (/شترمرغ|ostrich/i.test(title)) return "چرم طبیعی شترمرغ";
  if (/کروکو|croc/i.test(title)) return "چرم کروکودیل";
  if (/پیتون|python/i.test(title)) return "چرم پیتون";
  if (/وجیتال|veg/i.test(title)) return "چرم وجیتال";
  if (/فلوتر|floater/i.test(title)) return "چرم فلوتر";
  if (/نابوک|nubuck/i.test(title)) return "چرم نابوک";
  return "چرم طبیعی گاوی";
}

export function productJsonLd(product: Product, opts?: { includePrice?: boolean }) {
  const url = absoluteUrl(productPath(product));
  const img = primaryImage(product.images);
  const imgUrl = img ? absoluteUrl(img) : defaultOgImage;
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    url,
    availability:
      product.stock === "instock"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@type": "Organization",
      name: siteBrand.legalName,
    },
  };

  if (opts?.includePrice) {
    const raw = product.price || product.regular_price;
    const n = typeof raw === "string" ? Number(raw) : raw;
    if (n && !Number.isNaN(n)) {
      offers.price = String(n);
      offers.priceCurrency = "IRR";
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title.replace(/^مدل:\s*/i, ""),
    description: productSeoDescription(product),
    image: imgUrl,
    sku: product.sku || String(product.id),
    brand: {
      "@type": "Brand",
      name: siteBrand.name,
    },
    offers,
  };
}

export function collectionPageJsonLd(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      "@type": "WebSite",
      name: siteBrand.name,
      url: siteBrand.url,
    },
    inLanguage: "fa-IR",
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export const wholesaleFaq = [
  {
    question: "آیا چرم کارن فروش عمده چرم شترمرغ دارد؟",
    answer: wholesaleCopy.lead,
  },
  {
    question: "تفاوت چرم تنه و ساق شترمرغ چیست؟",
    answer: `${wholesaleCopy.types[0].title}: ${wholesaleCopy.types[0].body} ${wholesaleCopy.types[1].title}: ${wholesaleCopy.types[1].body}`,
  },
  {
    question: "چه رنگ‌هایی از چرم شترمرغ به‌صورت عمده موجود است؟",
    answer: wholesaleCopy.colors.body,
  },
];

export const representationFaq = [
  {
    question: "شرایط اخذ نمایندگی چرم کارن چیست؟",
    answer: `${representationCopy.intro} ${representationCopy.requirements.slice(0, 4).join(" ")}`,
  },
  {
    question: "مزیت نمایندگی فروش چرم کارن چیست؟",
    answer: representationCopy.benefits.join("؛ "),
  },
];

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: siteBrand.name,
    legalName: siteBrand.legalName,
    url: siteBrand.url,
    logo: absoluteUrl(brandLogos.mark.src),
    image: defaultOgImage,
    telephone: siteContact.phoneTel,
    email: "admin@karenleather.com",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "میدان ارغوان، جنب بانک ملی، باغمیشه",
        addressLocality: "تبریز",
        addressRegion: "آذربایجان شرقی",
        addressCountry: "IR",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "اول جاده شاهگلی، لابی هتل شهریار",
        addressLocality: "تبریز",
        addressRegion: "آذربایجان شرقی",
        addressCountry: "IR",
      },
    ],
    sameAs: [siteContact.instagram],
    priceRange: "$$",
    currenciesAccepted: "IRR",
    areaServed: {
      "@type": "Country",
      name: "IR",
    },
    inLanguage: "fa-IR",
  };
}

export function productImageAlt(product: Product, index = 0): string {
  const img = product.images[index];
  if (img?.alt?.trim()) return img.alt.trim();
  const cats = product.categories[0]?.name ?? "چرم";
  return `${product.title.replace(/^مدل:\s*/i, "")} — ${cats} — ${siteBrand.name}`;
}

export function decodeProductSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
