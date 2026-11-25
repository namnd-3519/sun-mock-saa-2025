import type { ProfileMessages } from "@/i18n/profile-messages";
import { badgeLabel } from "@/lib/kudos-live/kudos-format";
import type { BadgeSlot } from "@/lib/profile/profile-badge-collection";

function initials(label: string): string {
  return label
    .split(" ")
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0])
    .join("");
}

/**
 * A.3 "Bộ sưu tập icon của tôi" (B2–B7): one 64px icon per Secret Box badge, gray until opened.
 * MoMorph has no badge art: collected icons show the badge initials until the real files exist.
 */
export function ProfileBadgeCollection({ slots, messages }: { slots: BadgeSlot[]; messages: ProfileMessages }) {
  return (
    <section aria-labelledby="profile-badges" className="flex flex-col items-center gap-8">
      <ul className="flex flex-wrap items-center justify-center gap-4">
        {slots.map(({ badge, collected }) => {
          const label = badgeLabel(badge);
          return (
            <li key={badge} className="flex w-20 justify-center" data-collected={collected}>
              <span
                title={collected ? label : `${label} — ${messages.badgeLocked}`}
                className={
                  collected
                    ? "flex size-16 items-center justify-center rounded-full border-2 border-white bg-brand-accent text-lg font-bold text-brand-bg"
                    : "flex size-16 items-center justify-center rounded-full border-2 border-white bg-[#323231] text-lg font-bold text-white/30"
                }
              >
                <span aria-hidden="true">{initials(label)}</span>
                <span className="sr-only">{collected ? label : `${label}: ${messages.badgeLocked}`}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <h2 id="profile-badges" className="text-center text-lg leading-7 font-bold text-white md:text-[22px]">
        {messages.badgesTitle}
      </h2>
    </section>
  );
}
