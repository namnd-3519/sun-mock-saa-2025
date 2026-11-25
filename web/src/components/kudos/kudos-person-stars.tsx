import type { KudosMessages } from "@/i18n/kudos-messages";
import { starsForReceivedCount } from "@/lib/kudos/kudos-stars";
import { IconStar } from "./kudos-icons";

type KudosPersonStarsProps = { receivedCount: number; hints: KudosMessages["starsHint"] };

/** Stars (hoa thị) earned from received kudos; nothing below the first threshold. */
export function KudosPersonStars({ receivedCount, hints }: KudosPersonStarsProps) {
  const stars = starsForReceivedCount(receivedCount);
  if (stars === 0) return null;
  const hint = hints[stars];
  return (
    <span className="flex items-center text-[#d4271d]" title={hint}>
      {Array.from({ length: stars }, (_, index) => (
        <IconStar key={index} size={14} />
      ))}
      <span className="sr-only">{hint}</span>
    </span>
  );
}
