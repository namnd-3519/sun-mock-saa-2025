import { KudosStatsList } from "@/components/kudos/kudos-stats-list";
import { OpenSecretBoxAction } from "@/components/kudos/open-secret-box-action";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosStats } from "@/lib/kudos/kudos-types";

type ProfileStatsCardProps = { stats: KudosStats | null; label: string; messages: KudosMessages };

/** B Thống kê: B.1–B.5 counters and B.6 "Mở Secret Box". */
export function ProfileStatsCard({ stats, label, messages }: ProfileStatsCardProps) {
  return (
    <div className="flex w-full max-w-[680px] flex-col gap-4 rounded-[17px] border border-brand-border bg-brand-container-2 p-6 md:p-10">
      <KudosStatsList stats={stats} labels={messages.stats} />
      <OpenSecretBoxAction label={label} stats={stats} messages={messages.secretBox} />
    </div>
  );
}
