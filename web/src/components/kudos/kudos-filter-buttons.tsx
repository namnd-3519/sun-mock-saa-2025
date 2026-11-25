import Link from "next/link";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosFilters } from "@/lib/kudos/kudos-types";
import { hasActiveFilters } from "@/lib/kudos-live/kudos-filters";
import { KUDOS_PATH } from "@/lib/navigation/site-nav";
import { IconChevronDown } from "@/components/icons/icon-chevron-down";

const buttonClass =
  "flex items-center gap-2 rounded border border-brand-border bg-brand-accent/10 p-4 text-base leading-6 font-bold tracking-[0.15px] text-white hover:bg-brand-accent/40 aria-pressed:border-brand-accent";

/**
 * B.1.1 Hashtag / B.1.2 Phòng ban. The dropdown menus belong to tasks #13 and #14: they push
 * `?hashtag=` / `?department=` (lib/kudos-live/kudos-filters). Until then the buttons only show
 * whether a filter is active.
 */
export function KudosFilterButtons({ filters, messages }: { filters: KudosFilters; messages: KudosMessages }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" aria-pressed={Boolean(filters.hashtagId)} className={buttonClass}>
        {messages.filterHashtag}
        <IconChevronDown />
      </button>
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
