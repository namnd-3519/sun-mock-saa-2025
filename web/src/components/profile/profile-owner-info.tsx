import { IconStar } from "@/components/kudos/kudos-icons";
import type { KudosMessages } from "@/i18n/kudos-messages";
import type { ProfileMessages } from "@/i18n/profile-messages";
import { starsForReceivedCount } from "@/lib/kudos/kudos-stars";
import type { ProfileSummary } from "@/lib/kudos/profile-queries";

type ProfileOwnerInfoProps = {
  profile: ProfileSummary;
  kudosReceived: number;
  messages: ProfileMessages;
  kudosMessages: KudosMessages;
};

function initial(name: string | null): string {
  return (name ?? "").trim().split(/\s+/).at(-1)?.[0]?.toUpperCase() || "?";
}

/** A.1 avatar (200px, 4px white ring) and A.2 name, department code and stars (hoa thị). */
export function ProfileOwnerInfo({ profile, kudosReceived, messages, kudosMessages }: ProfileOwnerInfoProps) {
  const name = profile.fullName ?? "—";
  const stars = starsForReceivedCount(kudosReceived);
  const starsHint = stars === 0 ? null : kudosMessages.starsHint[stars];
  const ring = "size-[160px] shrink-0 rounded-full border-4 border-white bg-[#eee] object-cover md:size-[200px]";
  return (
    <div className="flex flex-col items-center gap-8">
      {profile.avatarUrl ? (
        // Google / Supabase avatar hosts are not configured for next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={profile.avatarUrl} alt={messages.avatarAlt.replace("{name}", name)} className={ring} referrerPolicy="no-referrer" />
      ) : (
        <span role="img" aria-label={messages.avatarAlt.replace("{name}", name)} className={`${ring} flex items-center justify-center text-6xl font-bold text-brand-bg`}>
          {initial(profile.fullName)}
        </span>
      )}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-[28px] leading-9 font-bold text-brand-accent md:text-4xl md:leading-[44px]">{name}</h1>
        <div className="flex items-center justify-center gap-2.5 text-lg leading-7 font-bold text-white md:text-[22px]">
          {profile.departmentCode ? <span>{profile.departmentCode}</span> : null}
          {profile.departmentCode && starsHint ? (
            <span aria-hidden="true" className="size-1 rounded-full bg-[#999] opacity-40" />
          ) : null}
          {starsHint ? (
            <span className="flex items-center text-brand-accent" title={starsHint}>
              {Array.from({ length: stars }, (_, index) => (
                <IconStar key={index} size={20} />
              ))}
              <span className="sr-only">{starsHint}</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
