import { showPrices } from "../config/commerce";
import { formatPrice } from "../lib/utils";

export function buildCartWhatsAppMessage(
  lines: { title: string; qty: number; lineTotal?: number }[],
  total?: number,
): string {
  const rows = lines.map((l) => {
    if (showPrices && l.lineTotal) {
      return `• ${l.title} × ${l.qty} — ${formatPrice(l.lineTotal)}`;
    }
    return `• ${l.title} × ${l.qty.toLocaleString("fa-IR")}`;
  });
  const parts = ["سلام، سفارش از سایت چرم کارن:", ...rows];
  if (showPrices && total) {
    parts.push(`جمع کل: ${formatPrice(total)}`);
  }
  return parts.join("\n");
}
