import { parseLaunchAt } from "@/lib/prelaunch/launch-time";

// Start of the SAA 2025 ceremony as shown on the design (26/12/2025, 18h30 Asia/Ho_Chi_Minh).
export const DEFAULT_EVENT_AT = "2025-12-26T18:30:00+07:00";

const EVENT_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/**
 * Event start for the homepage countdown: SAA_EVENT_AT, else SAA_LAUNCH_AT (so the prelaunch
 * and homepage countdowns agree), else the design date. Values are ISO-8601 with offset.
 */
export function resolveEventAt(eventRaw: string | undefined, launchRaw: string | undefined): Date {
  return parseLaunchAt(eventRaw) ?? parseLaunchAt(launchRaw) ?? new Date(DEFAULT_EVENT_AT);
}

export function getEventAt(): Date {
  return resolveEventAt(process.env.SAA_EVENT_AT, process.env.SAA_LAUNCH_AT);
}

/** DD/MM/YYYY of the event on the Asia/Ho_Chi_Minh calendar. */
export function formatEventDate(eventAt: Date): string {
  return EVENT_DATE_FORMAT.format(eventAt);
}
