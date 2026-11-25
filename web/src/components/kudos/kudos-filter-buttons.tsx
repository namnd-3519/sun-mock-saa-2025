import Link from "next/link";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { Hashtag, KudosFilters } from "@/lib/kudos/kudos-types";
import { hasActiveFilters } from "@/lib/kudos-live/kudos-filters";
import { KUDOS_PATH } from "@/lib/navigation/site-nav";
import { IconChevronDown } from "@/components/icons/icon-chevron-down";
import { HashtagFilter } from "./hashtag-filter";

const buttonClass =
  "flex items-center gap-2 rounded border border-brand-border bg-brand-accent/10 p-4 text-base leading-6 font-bold tracking-[0.15px] text-white hover:bg-brand-accent/40 aria-pressed:border-brand-accent";

type KudosFilterButtonsProps = { filters: KudosFilters; hashtags: Hashtag[]; messages: KudosMessages };

/**
 * B.1.1 Hashtag (dropdown, #13) / B.1.2 Phòng ban. The department dropdown belongs to task #14:
 * it pushes `?department=` (lib/kudos-live/kudos-filters); until then its button only shows
 * whether that filter is active.
 */
export function KudosFilterButtons({ filters, hashtags, messages }: KudosFilterButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <HashtagFilter
        hashtags={hashtags}
        selectedId={filters.hashtagId}
        label={messages.filterHashtag}
        emptyLabel={messages.filterEmpty}
      />
      <button type="button" aria-pressed={Boolean(filters.departmentId)} className={buttonClass}>
        {messages.filterDepartment}
        <IconChevronDown />
      </button>
      {hasActiveFilters(filters) ? (
        <Link href={KUDOS_PATH} scroll={false} className="p-2 text-base font-bold text-brand-accent underline">
          {messages.clearFilters}
        </Link>
      ) : null}
    </div>
  );
}
