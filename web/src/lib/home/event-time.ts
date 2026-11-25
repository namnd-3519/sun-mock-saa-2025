import { parseLaunchAt } from "@/lib/prelaunch/launch-time";

// Start of the SAA 2025 ceremony as shown on the design (26/12/2025, 18h30 Asia/Ho_Chi_Minh).
export const DEFAULT_EVENT_AT = "2025-12-26T18:30:00+07:00";

/** Event start for the homepage countdown, from SAA_EVENT_AT (ISO-8601 with offset). */
export function resolveEventAt(raw: string | undefined): Date {
  return parseLaunchAt(raw) ?? new Date(DEFAULT_EVENT_AT);
}

export function getEventAt(): Date {
  return resolveEventAt(process.env.SAA_EVENT_AT);
}
