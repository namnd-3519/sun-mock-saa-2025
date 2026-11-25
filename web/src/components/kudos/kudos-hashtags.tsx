import Link from "next/link";
import type { Hashtag, KudosFilters } from "@/lib/kudos/kudos-types";
import { kudosFiltersToSearch, withHashtagFilter } from "@/lib/kudos-live/kudos-filters";
import { KUDOS_PATH } from "@/lib/navigation/site-nav";

const MAX_TAGS = 5;

/** B.4.3 / C.3.7: up to 5 hashtags on one line; a click filters the board by that tag. */
export function KudosHashtags({ hashtags, filters }: { hashtags: Hashtag[]; filters: KudosFilters }) {
  if (hashtags.length === 0) return null;
  return (
    <p className="w-full truncate text-base leading-6 font-bold tracking-[0.5px] text-[#d4271d]">
      {hashtags.slice(0, MAX_TAGS).map((tag, index) => (
        <span key={tag.id}>
          {index > 0 ? " " : null}
          <Link
            href={`${KUDOS_PATH}${kudosFiltersToSearch(withHashtagFilter(filters, tag.id))}`}
            scroll={false}
            className="hover:underline"
          >
            #{tag.name}
          </Link>
        </span>
      ))}
      {hashtags.length > MAX_TAGS ? "…" : null}
    </p>
  );
}
