import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { setShowPrices as setGlobalShowPrices } from "../config/commerce";
import { syncCatalog } from "../data";
import type { Product } from "../types";

interface StoreSettingsContextValue {
  showPrices: boolean;
  refreshCatalog: () => Promise<void>;
}

const StoreSettingsContext = createContext<StoreSettingsContextValue>({
  showPrices: false,
  refreshCatalog: async () => {},
});

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [showPrices, setShowPricesState] = useState(false);

  const refreshCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/store/catalog");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.products)) syncCatalog(data.products as Product[]);
      if (typeof data.settings?.showPrices === "boolean") {
        setShowPricesState(data.settings.showPrices);
        setGlobalShowPrices(data.settings.showPrices);
      }
    } catch {
      /* static fallback */
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  return (
    <StoreSettingsContext.Provider value={{ showPrices, refreshCatalog }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useShowPrices() {
  return useContext(StoreSettingsContext).showPrices;
}
