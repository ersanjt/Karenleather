export interface StoreOrderPayload {
  customer?: { name?: string; phone?: string; email?: string };
  items: { productId: number; title: string; qty: number; price?: number }[];
  total: number;
  note?: string;
}

/** ثبت سفارش در API محلی — در production استاتیک بی‌صدا شکست می‌خورد. */
export function submitStoreOrder(payload: StoreOrderPayload): void {
  fetch("/api/store/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
