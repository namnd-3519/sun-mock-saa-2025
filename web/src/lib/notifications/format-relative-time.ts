import type { Locale } from "@/i18n/config";

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const INTL_LOCALE: Record<Locale, string> = { vi: "vi-VN", en: "en-US" };

/** "5 phút trước" / "3 hours ago"; under a minute → `justNow`; older than a week → the date. */
export function formatRelativeTime(
  iso: string,
  locale: Locale,
  now: Date,
  justNow: string,
): string {
  const seconds = Math.floor((now.getTime() - new Date(iso).getTime()) / 1000);
  if (seconds < MINUTE) return justNow;
  const tag = INTL_LOCALE[locale];
  if (seconds >= WEEK) {
    return new Intl.DateTimeFormat(tag, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(new Date(iso));
  }
  const format = new Intl.RelativeTimeFormat(tag, { numeric: "always" });
  if (seconds < HOUR) return format.format(-Math.floor(seconds / MINUTE), "minute");
  if (seconds < DAY) return format.format(-Math.floor(seconds / HOUR), "hour");
  return format.format(-Math.floor(seconds / DAY), "day");
}
