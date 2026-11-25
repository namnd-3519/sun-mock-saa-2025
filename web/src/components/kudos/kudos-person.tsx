import Link from "next/link";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { PersonSummary } from "@/lib/kudos/kudos-types";
import { starsForReceivedCount } from "@/lib/kudos/kudos-stars";
import { profileHref } from "@/lib/kudos-live/kudos-links";
import { KudosAvatar } from "./kudos-avatar";
import { IconStar } from "./kudos-icons";

type KudosPersonProps = {
  /** Null for an anonymous sender the viewer may not see. */
  person: PersonSummary | null;
  anonymousName?: string | null;
  messages: KudosMessages;
};

/**
 * B.3.1/B.3.2, C.3.1/C.3.3: avatar, name, department code and stars (hoa thị).
 * Avatar hover card (#15) wraps this block; the badge pill has no data yet.
 */
export function KudosPerson({ person, anonymousName, messages }: KudosPersonProps) {
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
  const stars = starsForReceivedCount(person.kudosReceivedCount);
  const starsHint = stars === 0 ? null : messages.starsHint[stars];
  return (
    <div className="flex w-full max-w-[235px] flex-col items-center gap-[13px]" data-person-id={person.id}>
      <Link href={profileHref(person.id)} className="rounded-full focus-visible:outline-2 focus-visible:outline-brand-bg">
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
          {starsHint ? (
            <span className="flex items-center text-[#d4271d]" title={starsHint}>
              {Array.from({ length: stars }, (_, index) => (
                <IconStar key={index} size={14} />
              ))}
              <span className="sr-only">{starsHint}</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
