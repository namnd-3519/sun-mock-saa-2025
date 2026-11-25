// Display formats of the Live board cards (MoMorph C.3.4 "HH:mm - MM/DD/YYYY", hearts "1.000").
const TIME_ZONE = "Asia/Ho_Chi_Minh";

const timeParts = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hourCycle: "h23",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
});

export function formatKudosTime(iso: string): string {
  if (Number.isNaN(Date.parse(iso))) return "";
  const parts = Object.fromEntries(
    timeParts.formatToParts(new Date(iso)).map((part) => [part.type, part.value]),
  );
  return `${parts.hour}:${parts.minute} - ${parts.month}/${parts.day}/${parts.year}`;
}

const heartCount = new Intl.NumberFormat("vi-VN");

export function formatHeartCount(count: number): string {
  return heartCount.format(count);
}

/** Secret box badge enum ("stay_gold") as its display name ("Stay Gold"). */
export function badgeLabel(badge: string): string {
  return badge
    .split("_")
    .filter(Boolean)
    .map((word) => (word === "to" || word === "the" || word === "of" ? word : word[0].toUpperCase() + word.slice(1)))
    .join(" ")
    .replace(/^./, (first) => first.toUpperCase());
}
