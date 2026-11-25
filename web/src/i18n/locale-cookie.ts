import { LOCALE_COOKIE, type Locale } from "./config";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function buildLocaleCookie(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
}
