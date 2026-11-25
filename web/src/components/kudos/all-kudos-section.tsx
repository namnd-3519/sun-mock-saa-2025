import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosFilters } from "@/lib/kudos/kudos-types";
import { kudosFiltersKey } from "@/lib/kudos-live/kudos-filters";
import type { LiveBoardData } from "@/lib/kudos-live/load-live-board";
import { KudosFeed } from "./kudos-feed";
import { KudosSectionHeader } from "./kudos-section-header";
import { KudosSidebar } from "./kudos-sidebar";

type AllKudosSectionProps = { data: LiveBoardData; filters: KudosFilters; messages: KudosMessages };

/** C All Kudos: live feed (C.2) beside the stats sidebar (D). */
export function AllKudosSection({ data, filters, messages }: AllKudosSectionProps) {
  return (
    <section aria-labelledby="all-kudos" className="mx-auto flex w-full max-w-[1152px] flex-col gap-10 px-4 md:px-10 lg:px-0">
      <KudosSectionHeader id="all-kudos" caption={messages.sectionCaption} title={messages.allTitle} />
      <div className="flex w-full flex-col-reverse gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
        <div className="w-full lg:max-w-[680px]">
          <KudosFeed key={kudosFiltersKey(filters)} initial={data.feed} filters={filters} messages={messages} />
        </div>
        <KudosSidebar stats={data.stats} giftReceivers={data.giftReceivers} messages={messages} />
      </div>
    </section>
  );
}
