// ISO-8601 datetime that ends in Z or an explicit offset (e.g. +07:00), so the
// instant never depends on the server's timezone.
const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

/** Parses the launch time; missing or invalid values disable the prelaunch gate. */
export function parseLaunchAt(raw: string | undefined): Date | null {
  const value = raw?.trim() ?? "";
  if (!ISO_WITH_OFFSET.test(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Launch time of SAA 2025 (Asia/Ho_Chi_Minh), from the server-only SAA_LAUNCH_AT env var. */
export function getLaunchAt(): Date | null {
  return parseLaunchAt(process.env.SAA_LAUNCH_AT);
}
