import { useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { getCategoryBySlug } from "../data";
import { brandFavicon, brandIcon } from "../content/brandLogos";
import {
  canonicalUrl,
  defaultOgImage,
  defaultOgImageAlt,
  defaultOgImageHeight,
  defaultOgImageWidth,
  notFoundSeo,
  shopPageSeo,
  staticPageSeo,
  type PageSeo,
} from "../content/seo";
import { siteBrand } from "../content/siteCopy";
import { useSeo } from "../context/SeoContext";
import { type ShopFilter } from "../lib/shop";

const URL_FILTERS = new Set<ShopFilter>([
  "new",
  "all",
  "sale",
  "footwear",
  "women",
  "men",
  "accessories",
]);

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(attr: "name" | "property", key: string) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertItemprop(key: string, content: string) {
  let el = document.querySelector(`meta[itemprop="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("itemprop", key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const extraSel = extra
    ? Object.entries(extra)
        .map(([k, v]) => `[${k}="${v}"]`)
        .join("")
    : "";
  let el = document.querySelector(`link[rel="${rel}"]${extraSel}`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
  }
}

function removeJsonLdScript(id: string) {
  document.getElementById(id)?.remove();
}

function injectJsonLd(id: string, data: object | object[]) {
  removeJsonLdScript(id);
  const script = document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(Array.isArray(data) ? data : data);
  document.head.appendChild(script);
}

function resolveStaticSeo(pathname: string, params: URLSearchParams): PageSeo {
  if (pathname === "/shop") {
    const catSlug = params.get("cat") ?? "";
    const filter = params.get("filter") as ShopFilter | null;
    const query = params.get("q") ?? "";
    const cat = catSlug ? getCategoryBySlug(catSlug) : undefined;
    const validFilter = filter && URL_FILTERS.has(filter) ? filter : undefined;
    return shopPageSeo(cat, validFilter, query);
  }

  if (pathname.startsWith("/admin")) {
    return {
      title: `مدیریت — ${siteBrand.name}`,
      description: "پنل مدیریت چرم کارن.",
      robots: "noindex, nofollow",
    };
  }

  if (staticPageSeo[pathname]) return staticPageSeo[pathname];

  if (pathname.startsWith("/product/")) {
    return {
      title: siteBrand.name,
      description: staticPageSeo["/shop"].description,
    };
  }

  return notFoundSeo;
}

/** meta tags، canonical، Open Graph و JSON-LD */
export function SiteMeta() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const { override, jsonLd } = useSeo();

  useEffect(() => {
    const base = resolveStaticSeo(pathname, params);
    const seo: PageSeo = override ?? base;
    const canonical = seo.canonicalPath ? `${siteBrand.url}${seo.canonicalPath}` : canonicalUrl(pathname, params);
    const ogImage = seo.ogImage ?? defaultOgImage;
    const ogAlt = seo.ogImageAlt ?? defaultOgImageAlt;
    const robots = seo.robots ?? "index, follow, max-image-preview:large";

    document.title = seo.title;
    upsertLink("canonical", canonical);
    upsertLink("alternate", canonical, { hreflang: "fa-IR" });
    upsertLink("alternate", canonical, { hreflang: "x-default" });
    upsertLink("icon", brandFavicon);
    upsertLink("apple-touch-icon", brandIcon);

    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "geo.region", "IR-EA");
    upsertMeta("name", "geo.placename", "تبریز");
    if (seo.keywords && !robots.includes("noindex")) {
      upsertMeta("name", "keywords", seo.keywords);
    } else {
      removeMeta("name", "keywords");
    }

    upsertMeta("property", "og:type", seo.ogType ?? "website");
    upsertMeta("property", "og:site_name", siteBrand.name);
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", ogImage);
    upsertMeta("property", "og:image:url", ogImage);
    upsertMeta("property", "og:image:secure_url", ogImage);
    upsertMeta("property", "og:image:alt", ogAlt);
    upsertItemprop("image", ogImage);
    upsertLink("image_src", ogImage);
    const ogW = seo.ogImageWidth ?? (ogImage === defaultOgImage ? defaultOgImageWidth : undefined);
    const ogH = seo.ogImageHeight ?? (ogImage === defaultOgImage ? defaultOgImageHeight : undefined);
    if (ogW && ogH) {
      upsertMeta("property", "og:image:width", String(ogW));
      upsertMeta("property", "og:image:height", String(ogH));
      upsertMeta("property", "og:image:type", "image/jpeg");
    } else {
      upsertMeta("property", "og:image:type", ogImage.toLowerCase().includes(".png") ? "image/png" : "image/jpeg");
      removeMeta("property", "og:image:width");
      removeMeta("property", "og:image:height");
    }
    upsertMeta("property", "og:locale", "fa_IR");

    if (seo.ogType === "product") {
      upsertMeta("property", "product:brand", siteBrand.name);
      upsertMeta("property", "product:condition", "new");
    } else {
      removeMeta("property", "product:brand");
      removeMeta("property", "product:condition");
    }

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertMeta("name", "twitter:image", ogImage);
    upsertMeta("name", "twitter:image:alt", ogAlt);

    if (jsonLd) {
      injectJsonLd("page-jsonld", jsonLd);
    } else {
      removeJsonLdScript("page-jsonld");
    }
  }, [pathname, params, override, jsonLd]);

  return null;
}
