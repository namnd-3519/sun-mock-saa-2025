import Link from "next/link";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { PersonSummary } from "@/lib/kudos/kudos-types";
import { profileHref } from "@/lib/kudos-live/kudos-links";
import { KudosAvatar } from "./kudos-avatar";
import { KudosPersonStars } from "./kudos-person-stars";
import { PersonHoverCard } from "./person-hover-card";
import { HOVER_CARD_TRIGGER_ATTR } from "./person-hover-card-state";

type KudosPersonProps = {
  /** Null for an anonymous sender the viewer may not see. */
  person: PersonSummary | null;
  anonymousName?: string | null;
  /** False for the sender of an anonymous kudos: a preview would reveal who sent it. */
  withHoverCard?: boolean;
  /** The person is the signed-in user (the preview links to their own profile). */
  isSelf?: boolean;
  /** Side the preview hugs on narrow screens. */
  hoverCardAlign?: "start" | "end";
  messages: KudosMessages;
};

/**
 * B.3.1/B.3.2, C.3.1/C.3.3: avatar, name, department code and stars (hoa thị). Hovering or
 * focusing the avatar or name opens the profile preview (#15, Bf5XiTE7AO).
 */
export function KudosPerson({
  person,
  anonymousName,
  withHoverCard = true,
  isSelf = false,
  hoverCardAlign,
  messages,
}: KudosPersonProps) {
  if (!person) {
    return (
      <div className="flex w-full max-w-[235px] flex-col items-center gap-[13px]">
        <KudosAvatar src={null} name={anonymousName ?? messages.anonymous} />
        <p className="truncate text-center text-base leading-6 font-bold tracking-[0.15px] text-brand-bg">
          {anonymousName || messages.anonymous}
        </p>
      </div>
    );
  }
  const name = person.fullName ?? "—";
  const triggerAttr = withHoverCard ? { [HOVER_CARD_TRIGGER_ATTR]: "" } : {};
  const body = (
    <div className="flex w-full max-w-[235px] flex-col items-center gap-[13px]" data-person-id={person.id}>
      <Link
        href={profileHref(person.id)}
        className="rounded-full focus-visible:outline-2 focus-visible:outline-brand-bg"
        {...triggerAttr}
      >
        <KudosAvatar src={person.avatarUrl} name={name} />
        <span className="sr-only">{name}</span>
      </Link>
      <div className="flex w-full flex-col gap-0.5">
        <Link
          href={profileHref(person.id)}
          className="truncate text-center text-base leading-6 font-bold tracking-[0.15px] text-brand-bg hover:underline"
        >
          {name}
        </Link>
        <div className="flex h-5 items-center justify-center gap-2.5 text-sm leading-5 font-bold tracking-[0.1px] text-[#999]">
          {person.departmentCode ? <span>{person.departmentCode}</span> : null}
          <KudosPersonStars receivedCount={person.kudosReceivedCount} hints={messages.starsHint} />
        </div>
      </div>
    </div>
  );
  if (!withHoverCard) return body;
  return (
    <PersonHoverCard person={person} isSelf={isSelf} messages={messages} align={hoverCardAlign}>
      {body}
    </PersonHoverCard>
  );
}
