import Link from "next/link";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { Department, Hashtag, KudosFilters } from "@/lib/kudos/kudos-types";
import { hasActiveFilters } from "@/lib/kudos-live/kudos-filters";
import { KUDOS_PATH } from "@/lib/navigation/site-nav";
import { DepartmentFilter } from "./department-filter";
import { HashtagFilter } from "./hashtag-filter";

type KudosFilterButtonsProps = {
  filters: KudosFilters;
  hashtags: Hashtag[];
  departments: Department[];
  messages: KudosMessages;
};

/**
 * C_Filter bar (MoMorph 7zur22HAsh): B.1.1 Hashtag (#13) and B.1.2 Phòng ban (#14) dropdowns, both on the
 * shared `FilterDropdown`; each pushes its own URL param and the two combine (AND) for the whole board.
 */
export function KudosFilterButtons({ filters, hashtags, departments, messages }: KudosFilterButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <HashtagFilter
        hashtags={hashtags}
        selectedId={filters.hashtagId}
        label={messages.filterHashtag}
        emptyLabel={messages.filterEmpty}
      />
      <DepartmentFilter
        departments={departments}
        selectedId={filters.departmentId}
        label={messages.filterDepartment}
        emptyLabel={messages.filterDepartmentEmpty}
      />
      {hasActiveFilters(filters) ? (
        <Link href={KUDOS_PATH} scroll={false} className="p-2 text-base font-bold text-brand-accent underline">
          {messages.clearFilters}
        </Link>
      ) : null}
    </div>
  );
}
