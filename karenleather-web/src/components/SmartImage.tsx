import { useMemo, useState, type ImgHTMLAttributes } from "react";
import { uploadCandidates } from "../lib/images";

type SmartImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  fallback?: string;
  fallbacks?: string[];
};

export function SmartImage({ src, fallback, fallbacks, onError, loading = "lazy", decoding = "async", ...props }: SmartImageProps) {
  const candidates = useMemo(() => {
    const list = uploadCandidates(src);
    if (fallback) list.push(...uploadCandidates(fallback));
    for (const fb of fallbacks ?? []) list.push(...uploadCandidates(fb));
    list.push(uploadCandidates("")[0]);
    return [...new Set(list)];
  }, [src, fallback, fallbacks]);

  const [idx, setIdx] = useState(0);

  return (
    <img
      {...props}
      src={candidates[Math.min(idx, candidates.length - 1)]}
      loading={loading}
      decoding={decoding}
      onError={(e) => {
        if (idx < candidates.length - 1) setIdx((i) => i + 1);
        onError?.(e);
      }}
    />
  );
}
