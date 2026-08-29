import { useMemo, useState, type ImgHTMLAttributes } from "react";
import type { MediaShot } from "../content/media";
import { uploadCandidates } from "../lib/images";

type ShotLike = Pick<MediaShot, "src"> & Partial<Pick<MediaShot, "alt" | "width" | "height">>;

type CommonProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  fallback?: string;
  fallbacks?: string[];
};

export type SmartImageProps = CommonProps &
  ({ src: string; alt: string } | { src: ShotLike; alt?: string });

function isShot(src: string | ShotLike): src is ShotLike {
  return typeof src === "object" && src !== null && "src" in src;
}

/** تصویر با مسیر جایگزین، alt اجباری، و width/height برای CLS و سئو */
export function SmartImage({
  src,
  fallback,
  fallbacks,
  onError,
  loading = "lazy",
  decoding = "async",
  alt,
  width,
  height,
  sizes,
  ...props
}: SmartImageProps) {
  const shot = isShot(src) ? src : null;
  const resolvedSrc = shot ? shot.src : (src as string);
  const resolvedAlt = alt ?? shot?.alt ?? "";
  const resolvedWidth = width ?? shot?.width;
  const resolvedHeight = height ?? shot?.height;
  const resolvedSizes = sizes ?? "(max-width: 768px) 100vw, 50vw";

  const candidates = useMemo(() => {
    const list = uploadCandidates(resolvedSrc);
    if (fallback) list.push(...uploadCandidates(fallback));
    for (const fb of fallbacks ?? []) list.push(...uploadCandidates(fb));
    list.push(uploadCandidates("")[0]);
    return [...new Set(list)];
  }, [resolvedSrc, fallback, fallbacks]);

  const [idx, setIdx] = useState(0);

  return (
    <img
      {...props}
      src={candidates[Math.min(idx, candidates.length - 1)]}
      alt={resolvedAlt}
      width={resolvedWidth}
      height={resolvedHeight}
      sizes={resolvedSizes}
      loading={loading}
      decoding={decoding}
      onError={(e) => {
        if (idx < candidates.length - 1) setIdx((i) => i + 1);
        onError?.(e);
      }}
    />
  );
}
