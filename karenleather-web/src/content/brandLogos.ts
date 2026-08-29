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
    src: `${B}/02-mark-icon.png`,
    fallbacks: [`${B}/04-wordmark-cropped.png`],
    alt: "چرم کارن — لوگوی اصلی",
  },
  /** وردمارک هیرو — نشان KL + متن CSS */
  hero: {
    src: `${B}/02-mark-icon.png`,
    fallbacks: [`${B}/04-wordmark-cropped.png`],
    alt: "چرم کارن — وردمارک",
  },
  /** فوتر تیره — فقط نشان KL (فایل‌های classic اشتباه/برند دیگرند) */
  footer: {
    src: `${B}/02-mark-icon.png`,
    fallbacks: [`${B}/04-wordmark-cropped.png`],
    alt: "چرم کارن — نشان برند",
  },
  /** نشان دایره‌ای KL — هدر، فاوآیکون و آیکون سایت */
  mark: {
    src: `${B}/02-mark-icon.png`,
    fallbacks: [`${B}/04-wordmark-cropped.png`],
    alt: "چرم کارن — نشان برند",
  },
  /** لوگوی متنی فارسی — تک‌تک (legacy) */
  text: {
    src: `${B}/07-text-fa.png`,
    fallbacks: [`${B}/05-wordmark-alt.png`, `${B}/01-primary-full.png`],
    alt: "چرم کارن — لوگوی متنی",
  },
  /** آیکون — preloader (wordmark پس‌زمینه تیره دارد) */
  loader: {
    src: `${B}/02-mark-icon.png`,
    fallbacks: [`${B}/04-wordmark-cropped.png`],
    alt: "چرم کارن — Karen Leather",
  },
  /** نسخه کلاسیک — فقط نشان KL */
  classic: {
    src: `${B}/02-mark-icon.png`,
    fallbacks: [`${B}/04-wordmark-cropped.png`],
    alt: "چرم کارن — نشان برند",
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
