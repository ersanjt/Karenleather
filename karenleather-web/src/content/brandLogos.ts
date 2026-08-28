/**
 * نسخه‌های رسمی لوگوی چرم کارن — هر کدام برای یک بافت/جایگاه UI
 * فایل‌ها در /uploads/brand/ با نام ASCII نگهداری می‌شوند.
 */

export type LogoVariant = "header" | "hero" | "footer" | "mark" | "text" | "loader" | "classic";

export interface LogoAsset {
  src: string;
  fallbacks?: string[];
  /** برای دسترس‌پذیری */
  alt: string;
}

/** مسیر پایه نسخه‌های برند */
const B = "/uploads/brand";

export const brandLogos: Record<LogoVariant, LogoAsset> = {
  /** لوگوی اصلی ۲۰۲۵ — هدر سایت */
  header: {
    src: `${B}/01-primary-full.png`,
    fallbacks: ["/uploads/2025/03/logo-pnz.png", `${B}/06-classic-v2.png`],
    alt: "چرم کارن — لوگوی اصلی",
  },
  /** وردمارک — هیرو صفحه اصلی (آیکون + متن) */
  hero: {
    src: `${B}/05-wordmark-alt.png`,
    fallbacks: [`${B}/01-primary-full.png`, `${B}/06-classic-v2.png`],
    alt: "چرم کارن — وردمارک",
  },
  /** نسخه کلاسیک — فوتر تیره */
  footer: {
    src: `${B}/06-classic-v2.png`,
    fallbacks: [`${B}/03-classic-demo.png`, `${B}/05-wordmark-alt.png`],
    alt: "چرم کارن — لوگوی کلاسیک",
  },
  /** نشان دایره‌ای KL — favicon، ادمین و آیکون سایت */
  mark: {
    src: `${B}/02-mark-icon.png`,
    fallbacks: [`${B}/04-wordmark-cropped.png`, "/uploads/2025/03/logo-pnz-150x150.png"],
    alt: "چرم کارن — نشان برند",
  },
  /** لوگوی متنی فارسی — تک‌تک (legacy) */
  text: {
    src: `${B}/07-text-fa.png`,
    fallbacks: [`${B}/05-wordmark-alt.png`, `${B}/01-primary-full.png`],
    alt: "چرم کارن — لوگوی متنی",
  },
  /** آیکون + متن — preloader و splash */
  loader: {
    src: `${B}/05-wordmark-alt.png`,
    fallbacks: [`${B}/01-primary-full.png`, `${B}/02-mark-icon.png`, `${B}/07-text-fa.png`],
    alt: "چرم کارن — Karen Leather",
  },
  /** نسخه قدیمی — درباره ما و صفحات محتوا */
  classic: {
    src: `${B}/06-classic-v2.png`,
    fallbacks: [`${B}/03-classic-demo.png`, `${B}/01-primary-full.png`],
    alt: "چرم کارن — لوگوی کلاسیک",
  },
};

export const brandFavicon = brandLogos.mark.src;
export const brandIcon = brandLogos.mark.src;

/** @deprecated از brandLogos استفاده کنید */
export const brand = {
  logo: brandLogos.header.src,
  logoAlt: brandLogos.classic.src,
  favicon: brandFavicon,
};

export function logoAsset(variant: LogoVariant): LogoAsset {
  return brandLogos[variant];
}
