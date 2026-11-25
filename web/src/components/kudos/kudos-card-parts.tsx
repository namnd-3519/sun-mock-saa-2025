import type { KudosMessages } from "@/i18n/kudos-messages";
import type { KudosCard } from "@/lib/kudos/kudos-types";
import { KudosPerson } from "./kudos-person";
import { IconSend } from "./kudos-icons";

/** Shared props of the Highlight (B.3) and All Kudos (C.3) cards. */
export type KudosCardSlots = {
  /** Like toggle (KudosLikesProvider); hearts are read-only without it. */
  onToggleLike?: (card: KudosCard) => void;
  /** A toggle of this kudos is in flight: the heart is temporarily disabled (C.4). */
  likePending?: boolean;
};

/** Sender → recipient row (B.3.1–B.3.6, C.3.1–C.3.3). */
export function KudosPeopleRow({ card, messages }: { card: KudosCard; messages: KudosMessages }) {
  return (
    <div className="flex w-full items-start justify-between gap-6">
      <KudosPerson person={card.sender} anonymousName={card.anonymousName} messages={messages} />
      <div className="py-4 text-brand-bg">
        <IconSend size={32} />
        <span className="sr-only">{messages.sentTo}</span>
      </div>
      <KudosPerson person={card.recipient} messages={messages} />
    </div>
  );
}

export function KudosCardDivider() {
  return <hr className="w-full border-0 border-t border-brand-accent" />;
}
