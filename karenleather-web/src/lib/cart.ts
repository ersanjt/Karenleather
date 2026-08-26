import { useEffect, useState } from "react";
import type { CartItem } from "../types";

const KEY = "karenleather_cart";

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => read());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add = (productId: number, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { productId, qty }];
    });
  };

  const setQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  };

  const remove = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);

  return { items, add, setQty, remove, clear, count };
}
