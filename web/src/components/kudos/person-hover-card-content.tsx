import Link from "next/link";
import type { KudosMessages } from "@/i18n/kudos-messages";
import { PROFILE_PATH } from "@/lib/auth/auth-paths";
import type { PersonSummary } from "@/lib/kudos/kudos-types";
import { KudosAvatar } from "./kudos-avatar";
import { KudosPersonStars } from "./kudos-person-stars";

type PersonHoverCardContentProps = {
  person: PersonSummary;
  /** The signed-in user: only their own profile page exists, so only they get a link. */
  isSelf: boolean;
  messages: KudosMessages;
};

/**
 * Profile preview shown over an avatar (Bf5XiTE7AO): avatar, name, department, stars and
 * kudos received. It only reads `PersonSummary`, which never carries an email.
 */
export function PersonHoverCardContent({ person, isSelf, messages }: PersonHoverCardContentProps) {
  const name = person.fullName ?? "—";
  return (
    <div className="flex w-[280px] flex-col items-center gap-3 rounded-lg border border-brand-border bg-brand-container-2 p-4 text-center shadow-lg">
      <KudosAvatar src={person.avatarUrl} name={name} highlighted />
      <div className="flex w-full flex-col gap-1">
        <p className="truncate text-base leading-6 font-bold tracking-[0.15px] text-white">{name}</p>
        <div className="flex h-5 items-center justify-center gap-2.5 text-sm leading-5 font-bold tracking-[0.1px] text-[#999]">
          {person.departmentCode ? <span>{person.departmentCode}</span> : null}
          <KudosPersonStars receivedCount={person.kudosReceivedCount} hints={messages.starsHint} />
        </div>
      </div>
      <p className="text-sm leading-5 font-bold text-white">
        {messages.hoverCard.received} <span className="text-brand-accent">{person.kudosReceivedCount}</span>
      </p>
      {isSelf ? (
        <Link
          href={PROFILE_PATH}
          className="text-sm leading-5 font-bold text-brand-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-brand-accent"
        >
          {messages.hoverCard.viewProfile}
        </Link>
      ) : null}
    </div>
  );
}
