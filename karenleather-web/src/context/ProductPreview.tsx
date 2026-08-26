import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "../types";
import { getProduct } from "../data";

interface ProductPreviewContextValue {
  product: Product | null;
  catalogIds: number[];
  hasPrev: boolean;
  hasNext: boolean;
  openPreview: (productId: number, catalogIds?: number[]) => void;
  closePreview: () => void;
  goPrev: () => void;
  goNext: () => void;
}

const ProductPreviewContext = createContext<ProductPreviewContextValue | null>(null);

export function ProductPreviewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [catalogIds, setCatalogIds] = useState<number[]>([]);

  const currentIndex = product ? catalogIds.indexOf(product.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < catalogIds.length - 1;

  const openPreview = useCallback((productId: number, catalog?: number[]) => {
    const p = getProduct(productId);
    if (!p) return;
    setProduct(p);
    setCatalogIds(catalog?.length ? catalog : [productId]);
  }, []);

  const closePreview = useCallback(() => {
    setProduct(null);
    setCatalogIds([]);
  }, []);

  const goPrev = useCallback(() => {
    if (currentIndex <= 0) return;
    const prev = getProduct(catalogIds[currentIndex - 1]);
    if (prev) setProduct(prev);
  }, [catalogIds, currentIndex]);

  const goNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= catalogIds.length - 1) return;
    const next = getProduct(catalogIds[currentIndex + 1]);
    if (next) setProduct(next);
  }, [catalogIds, currentIndex]);

  const value = useMemo(
    () => ({
      product,
      catalogIds,
      hasPrev,
      hasNext,
      openPreview,
      closePreview,
      goPrev,
      goNext,
    }),
    [product, catalogIds, hasPrev, hasNext, openPreview, closePreview, goPrev, goNext],
  );

  return (
    <ProductPreviewContext.Provider value={value}>{children}</ProductPreviewContext.Provider>
  );
}

export function useProductPreview() {
  const ctx = useContext(ProductPreviewContext);
  if (!ctx) throw new Error("useProductPreview must be used within ProductPreviewProvider");
  return ctx;
}
