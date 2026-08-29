import type { Category, Product } from "../types";
import { absoluteUrl, siteBrand, siteContact, wholesaleCopy, representationCopy } from "./siteCopy";
import { brandLogos } from "./brandLogos";
import { ogShare, type MediaShot } from "./media";
import { primaryImage, productPath } from "../lib/utils";
import seoPages from "./seoPages.json";
import {
  categoryKeywords,
  categorySeoDescription,
  categorySeoTitle,
  productFacts,
  productKeywords,
  productSeoDescription as buildProductDescription,
} from "./taxonomy";

export {
  categoryKeywords,
  categorySeoDescription,
  categorySeoTitle,
  cleanProductTitle,
  detectMaterial,
  productBodyHtml,
  productDisplayTags,
  productKeywords,
  productSeoDescription,
} from "./taxonomy";

/** تصویر اجتماعی — ۱۲۰۰×۶۳۰ برای پیش‌نمایش لینک در واتساپ، تلگرام، فیسبوک */
export const defaultOgImage = absoluteUrl(ogShare.home.src);
export const defaultOgImageAlt = ogShare.home.alt;
export const defaultOgImageWidth = ogShare.home.width;
export const defaultOgImageHeight = ogShare.home.height;

function withOg(seo: Omit<PageSeo, "ogImage" | "ogImageAlt" | "ogImageWidth" | "ogImageHeight">, shot: MediaShot): PageSeo {
  return {
    ...seo,
    ogImage: absoluteUrl(shot.src),
    ogImageAlt: shot.alt,
    ogImageWidth: shot.width,
    ogImageHeight: shot.height,
  };
}

const INDEXABLE_SHOP_FILTERS = new Set(["new", "sale", "footwear", "women", "men", "accessories"]);

export interface PageSeo {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogType?: "website" | "product";
  robots?: string;
}

export const staticPageSeo: Record<string, PageSeo> = {
  "/": withOg(
    {
      title: seoPages.home.title,
      description: seoPages.home.description,
      keywords: seoPages.home.keywords,
    },
    ogShare.home,
  ),
  "/shop": withOg(
    {
      title: seoPages.shop.title,
      description: seoPages.shop.description,
      keywords: seoPages.shop.keywords,
    },
    ogShare.shop,
  ),
  "/about": withOg(
    {
      title: seoPages.about.title,
      description: seoPages.about.description,
      keywords: seoPages.about.keywords,
    },
    ogShare.about,
  ),
  "/contact": withOg(
    {
      title: seoPages.contact.title,
      description: seoPages.contact.description,
      keywords: seoPages.contact.keywords,
    },
    ogShare.contact,
  ),
  "/wholesale": withOg(
    {
      title: seoPages.wholesale.title,
      description: seoPages.wholesale.description,
      keywords: seoPages.wholesale.keywords,
    },
    ogShare.wholesale,
  ),
  "/representation": withOg(
    {
      title: seoPages.representation.title,
      description: seoPages.representation.description,
      keywords: seoPages.representation.keywords,
    },
    ogShare.home,
  ),
  "/cart": {
    title: seoPages.cart.title,
    description: seoPages.cart.description,
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

const FILTER_SEO: Record<string, { title: string; description: string; keywords: string; og: MediaShot }> = {
  new: { ...seoPages.filters.new, og: ogShare.shop },
  footwear: { ...seoPages.filters.footwear, og: ogShare.men },
  women: { ...seoPages.filters.women, og: ogShare.home },
  men: { ...seoPages.filters.men, og: ogShare.men },
  accessories: { ...seoPages.filters.accessories, og: ogShare.shop },
  sale: { ...seoPages.filters.sale, og: ogShare.shop },
};

export function shopPageSeo(cat?: Category | null, filter?: string, query?: string): PageSeo {
  if (query?.trim()) {
    const q = query.trim();
    return {
      title: `جستجو «${q}» — فروشگاه ${siteBrand.name}`,
      description: `نتایج جستجو برای «${q}» در فروشگاه آنلاین چرم کارن — کیف، کفش و اکسسوری چرم طبیعی.`,
      robots: "noindex, follow",
    };
  }
  if (cat) {
    return withOg(
      {
        title: `${categorySeoTitle(cat)} — خرید آنلاین | ${siteBrand.name}`,
        description: categorySeoDescription(cat),
        keywords: categoryKeywords(cat),
      },
      /کفش|لوفر|بوت|اسنیکر|footwear|men|مردانه/i.test(`${cat.name} ${cat.slug}`) ? ogShare.men : ogShare.shop,
    );
  }
  if (filter && FILTER_SEO[filter]) {
    const f = FILTER_SEO[filter];
    return withOg(
      { title: `${f.title} — ${siteBrand.name}`, description: f.description, keywords: f.keywords },
      f.og,
    );
  }
  return staticPageSeo["/shop"];
}

export function shopFilterCopy(filter?: string): { title: string; description: string } | undefined {
  if (filter && FILTER_SEO[filter]) return FILTER_SEO[filter];
  return undefined;
}

export function productPageSeo(product: Product): PageSeo {
  const facts = productFacts(product);
  const catLabel = facts.leafCategory?.name ?? facts.type;
  return {
    title: `${facts.name} | ${catLabel} — ${siteBrand.name}`,
    description: buildProductDescription(product),
    keywords: productKeywords(product),
    ogImage: product.images[0]
      ? absoluteUrl(`/uploads/${product.images[0].file.split("?")[0]}`)
      : defaultOgImage,
    ogImageAlt: productImageAlt(product),
    ogType: "product",
  };
}

export function productJsonLd(product: Product, opts?: { includePrice?: boolean }) {
  const url = absoluteUrl(productPath(product));
  const img = primaryImage(product.images);
  const imgUrl = img ? absoluteUrl(img) : defaultOgImage;
  const facts = productFacts(product);
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

  const extra: Record<string, unknown> = {};
  extra.material = facts.material;
  extra.keywords = productKeywords(product);
  extra.category = facts.leafCategory?.name ?? facts.type;
  extra.additionalProperty = [
    { "@type": "PropertyValue", name: "جنس", value: facts.material },
    ...(facts.colors.length
      ? [{ "@type": "PropertyValue", name: "رنگ", value: facts.colors.join("، ") }]
      : []),
    ...(facts.gender
      ? [{ "@type": "PropertyValue", name: "کلکسیون", value: facts.gender }]
      : []),
  ];
  if (facts.colors[0]) extra.color = facts.colors.join(" / ");
  if (facts.gender === "زنانه" || facts.gender === "مردانه") {
    extra.audience = {
      "@type": "PeopleAudience",
      suggestedGender: facts.gender === "زنانه" ? "female" : "male",
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: facts.name,
    description: buildProductDescription(product),
    image: imgUrl
      ? {
          "@type": "ImageObject",
          url: imgUrl,
          caption: productImageAlt(product),
        }
      : defaultOgImage,
    sku: product.sku || String(product.id),
    brand: {
      "@type": "Brand",
      name: siteBrand.name,
    },
    offers,
    ...extra,
  };
}

export function collectionPageJsonLd(name: string, path: string, description: string, keywords?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    ...(keywords ? { keywords } : {}),
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
    image: {
      "@type": "ImageObject",
      url: defaultOgImage,
      width: defaultOgImageWidth,
      height: defaultOgImageHeight,
      caption: defaultOgImageAlt,
    },
    telephone: siteContact.phoneTel,
    email: "admin@karenleather.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteContact.streetAddress,
      addressLocality: siteContact.city,
      addressRegion: "آذربایجان شرقی",
      addressCountry: "IR",
    },
    sameAs: [siteContact.instagram],
    keywords: seoPages.home.keywords,
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
  const facts = productFacts(product);
  const cats = facts.leafCategory?.name ?? facts.type;
  const base = `${facts.name} — ${cats} — ${siteBrand.name}`;
  if (index > 0) return `${base} — نمای ${(index + 1).toLocaleString("fa-IR")}`;
  return base;
}

export function decodeProductSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
