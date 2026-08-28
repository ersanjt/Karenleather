import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { PageSeo } from "../content/seo";

interface SeoContextValue {
  override: PageSeo | null;
  jsonLd: object | object[] | null;
  setSeo: (seo: PageSeo | null, jsonLd?: object | object[] | null) => void;
}

const SeoContext = createContext<SeoContextValue>({
  override: null,
  jsonLd: null,
  setSeo: () => {},
});

export function SeoProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<PageSeo | null>(null);
  const [jsonLd, setJsonLd] = useState<object | object[] | null>(null);

  const setSeo = useCallback((seo: PageSeo | null, ld?: object | object[] | null) => {
    setOverride(seo);
    setJsonLd(ld ?? null);
  }, []);

  const value = useMemo(
    () => ({ override, jsonLd, setSeo }),
    [override, jsonLd, setSeo],
  );

  return <SeoContext.Provider value={value}>{children}</SeoContext.Provider>;
}

export function useSeo() {
  return useContext(SeoContext);
}

/** تنظیم SEO صفحه — در unmount پاک می‌شود */
export function usePageSeo(seo: PageSeo | null, jsonLd?: object | object[] | null) {
  const { setSeo } = useSeo();

  useEffect(() => {
    setSeo(seo, jsonLd ?? null);
    return () => setSeo(null, null);
  }, [seo, jsonLd, setSeo]);
}
