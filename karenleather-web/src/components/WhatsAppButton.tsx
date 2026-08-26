import { WHATSAPP_LINK } from "../lib/utils";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="واتساپ"
      className="whatsapp-fab"
    >
      سوالی ندارید؟
    </a>
  );
}
