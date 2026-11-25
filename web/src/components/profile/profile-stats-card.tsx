import { KudosStatsList } from "@/components/kudos/kudos-stats-list";
import { OpenGiftButton } from "@/components/kudos/open-gift-button";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosStats } from "@/lib/kudos/kudos-types";

type ProfileStatsCardProps = { stats: KudosStats | null; label: string; messages: KudosMessages };

/** B Thống kê: B.1–B.5 counters and B.6 "Mở Secret Box" (dialog is task #18). */
export function ProfileStatsCard({ stats, label, messages }: ProfileStatsCardProps) {
  return (
    <div className="flex w-full max-w-[680px] flex-col gap-4 rounded-[17px] border border-brand-border bg-brand-container-2 p-6 md:p-10">
      <KudosStatsList stats={stats} labels={messages.stats} />
      <OpenGiftButton label={label} disabled={!stats || stats.boxesUnopened === 0} />
    </div>
  );
}
