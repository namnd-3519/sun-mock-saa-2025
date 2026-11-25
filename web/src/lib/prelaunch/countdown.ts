export type RemainingTime = {
  days: number;
  hours: number;
  minutes: number;
  totalMs: number;
};

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
// The design shows two digit boxes per unit (format 00–99).
const MAX_DAYS = 99;

/** True while the launch time is configured and not yet reached. */
export function isPrelaunch(now: Date, launchAt: Date | null): boolean {
  return launchAt !== null && now.getTime() < launchAt.getTime();
}

/** Time left until launch, floored to whole minutes; all zero at or after launch. */
export function getRemainingTime(now: Date, launchAt: Date): RemainingTime {
  const totalMs = Math.max(0, launchAt.getTime() - now.getTime());
  const days = Math.floor(totalMs / DAY_MS);
  if (days > MAX_DAYS) {
    return { days: MAX_DAYS, hours: 23, minutes: 59, totalMs };
  }
  return {
    days,
    hours: Math.floor((totalMs % DAY_MS) / HOUR_MS),
    minutes: Math.floor((totalMs % HOUR_MS) / MINUTE_MS),
    totalMs,
  };
}

export function padTwoDigits(value: number): string {
  return String(value).padStart(2, "0");
}
