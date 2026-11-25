import Link from "next/link";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { GiftReceiver, KudosStats } from "@/lib/kudos/kudos-types";
import { badgeLabel } from "@/lib/kudos-live/kudos-format";
import { profileHref } from "@/lib/kudos-live/kudos-links";
import { KudosAvatar } from "./kudos-avatar";
import { OpenGiftButton } from "./open-gift-button";

type KudosSidebarProps = { stats: KudosStats | null; giftReceivers: GiftReceiver[]; messages: KudosMessages };

const boxClass = "flex w-full flex-col rounded-[17px] border border-brand-border bg-brand-container-2 p-6";

function StatRow({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-lg leading-7 font-bold text-white md:text-[22px]">{label}</dt>
      <dd className="text-[32px] leading-10 font-bold text-brand-accent">{value ?? "—"}</dd>
    </div>
  );
}

/** D: personal stats (D.1) and the 10 latest gift receivers (D.3). */
export function KudosSidebar({ stats, giftReceivers, messages }: KudosSidebarProps) {
  const s = messages.stats;
  return (
    <aside className="flex w-full flex-col gap-6 lg:sticky lg:top-28 lg:w-[422px] lg:shrink-0">
      <div className={`${boxClass} gap-4`}>
        <dl className="flex flex-col gap-4">
          <StatRow label={s.received} value={stats?.kudosReceived} />
          <StatRow label={s.sent} value={stats?.kudosSent} />
          <StatRow label={s.hearts} value={stats?.heartsReceived} />
          <hr className="border-0 border-t border-brand-divider" />
          <StatRow label={s.boxesOpened} value={stats?.boxesOpened} />
          <StatRow label={s.boxesUnopened} value={stats?.boxesUnopened} />
        </dl>
        <OpenGiftButton label={messages.openGift} disabled={!stats || stats.boxesUnopened === 0} />
      </div>
      <section aria-labelledby="gift-receivers" className={`${boxClass} gap-4 pr-4`}>
        <h2 id="gift-receivers" className="text-center text-[22px] leading-7 font-bold text-brand-accent">
          {messages.giftReceiversTitle}
        </h2>
        {giftReceivers.length === 0 ? (
          <p className="py-6 text-center text-base font-bold text-white">{messages.noData}</p>
        ) : (
          <ul className="flex max-h-[384px] flex-col gap-4 overflow-y-auto">
            {giftReceivers.map((gift) => (
              <li key={gift.boxId} className="flex items-center gap-2">
                <KudosAvatar src={gift.owner?.avatarUrl ?? null} name={gift.owner?.fullName ?? null} />
                <div className="flex min-w-0 flex-col gap-0.5">
                  {gift.owner ? (
                    <Link href={profileHref(gift.owner.id)} className="truncate text-[22px] leading-7 font-bold text-brand-accent hover:underline">
                      {gift.owner.fullName ?? "—"}
                    </Link>
                  ) : null}
                  <p className="text-base text-white">
                    {messages.giftReceived.replace("{badge}", badgeLabel(gift.badge))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
