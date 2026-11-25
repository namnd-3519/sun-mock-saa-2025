import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosStats } from "@/lib/kudos/kudos-types";

function StatRow({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-lg leading-7 font-bold text-white md:text-[22px]">{label}</dt>
      <dd className="text-[32px] leading-10 font-bold text-brand-accent">{value ?? "—"}</dd>
    </div>
  );
}

/** Personal kudos statistics (Live board D.1, Profile B.1–B.5); "—" without stats. */
export function KudosStatsList({ stats, labels }: { stats: KudosStats | null; labels: KudosMessages["stats"] }) {
  return (
    <dl className="flex flex-col gap-4">
      <StatRow label={labels.received} value={stats?.kudosReceived} />
      <StatRow label={labels.sent} value={stats?.kudosSent} />
      <StatRow label={labels.hearts} value={stats?.heartsReceived} />
      <hr className="border-0 border-t border-brand-divider" />
      <StatRow label={labels.boxesOpened} value={stats?.boxesOpened} />
      <StatRow label={labels.boxesUnopened} value={stats?.boxesUnopened} />
    </dl>
  );
}
