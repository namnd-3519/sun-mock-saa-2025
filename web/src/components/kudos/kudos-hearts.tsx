import { formatHeartCount } from "@/lib/kudos-live/kudos-format";
import { IconHeart } from "./kudos-icons";

type KudosHeartsProps = {
  count: number;
  liked: boolean;
  /** The sender cannot like their own kudos (C.4.1). */
  disabled: boolean;
  label: string;
  /** Like toggle; read-only without it. */
  onToggle?: () => void;
};

/** C.4.1 Hearts: count + heart, grey when not liked, red when liked. */
export function KudosHearts({ count, liked, disabled, label, onToggle }: KudosHeartsProps) {
  const content = (
    <>
      <span className="text-2xl leading-8 font-bold text-brand-bg">{formatHeartCount(count)}</span>
      <IconHeart size={32} filled={liked} className={liked ? "text-[#d4271d]" : "text-[#999]"} />
    </>
  );
  if (!onToggle) {
    return (
      <span className="flex items-center gap-1" aria-label={`${formatHeartCount(count)} ${label}`}>
        {content}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={liked}
      aria-label={`${formatHeartCount(count)} ${label}`}
      className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {content}
    </button>
  );
}
