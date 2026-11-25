import type { Locale } from "@/i18n/config";
import { buildLocaleCookie } from "@/i18n/locale-cookie";

export function saveLocaleCookie(locale: Locale): void {
  document.cookie = buildLocaleCookie(locale);
}
