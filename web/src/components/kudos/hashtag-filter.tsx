"use client";

import { useRouter } from "next/navigation";
import type { Hashtag } from "@/lib/kudos/kudos-types";
import { HASHTAG_PARAM, withFilterParam } from "@/lib/kudos-live/kudos-filters";
import { KUDOS_PATH } from "@/lib/navigation/site-nav";
import { FilterDropdown } from "./filter-dropdown";

type HashtagFilterProps = { hashtags: Hashtag[]; selectedId?: string; label: string; emptyLabel: string };

/** B.1.1 Hashtag filter: pushes `?hashtag=` (other params kept); the board refetches server-side. */
export function HashtagFilter({ hashtags, selectedId, label, emptyLabel }: HashtagFilterProps) {
  const router = useRouter();
  const options = hashtags.map((tag) => ({ id: tag.id, label: `#${tag.name}` }));

  function handleSelect(id: string | null) {
    router.push(`${KUDOS_PATH}${withFilterParam(window.location.search, HASHTAG_PARAM, id)}`, { scroll: false });
  }

  return (
    <FilterDropdown
      label={label}
      options={options}
      selectedId={selectedId}
      onSelect={handleSelect}
      emptyLabel={emptyLabel}
    />
  );
}
