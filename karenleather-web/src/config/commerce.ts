/** تا زمان بروزرسانی قیمت‌ها — از admin یا مقدار پیش‌فرض */
export let showPrices = false;

export function setShowPrices(value: boolean) {
  showPrices = value;
}

/** @deprecated use showPrices */
export const SHOW_PRICES = false;
