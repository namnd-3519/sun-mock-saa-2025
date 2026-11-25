import type { ComponentType, SVGProps } from "react";
import type { Locale } from "@/i18n/config";
import type { NotificationsMessages } from "@/i18n/notifications-messages";
import { IconGift } from "@/components/icons/icon-gift";
import { IconHeart } from "@/components/icons/icon-heart";
import { IconSparkles } from "@/components/icons/icon-sparkles";
import { formatNotificationMessage } from "@/lib/notifications/notification-message";
import { formatRelativeTime } from "@/lib/notifications/format-relative-time";
import type { AppNotification } from "@/lib/notifications/notification-types";

type TypeStyle = { Icon: ComponentType<SVGProps<SVGSVGElement>>; tint: string };

// Spec 3.1: kudos = blue sparkles, heart = pink heart, secret box = gold gift.
const TYPE_STYLES: Record<AppNotification["type"], TypeStyle> = {
  kudos_received: { Icon: IconSparkles, tint: "bg-sky-400/15 text-sky-300" },
  heart_received: { Icon: IconHeart, tint: "bg-rose-500/15 text-rose-400" },
  secret_box_available: { Icon: IconGift, tint: "bg-brand-accent/15 text-brand-accent" },
};

type NotificationItemProps = {
  item: AppNotification;
  locale: Locale;
  now: Date;
  messages: NotificationsMessages;
  onSelect: (item: AppNotification) => void;
};

/** One notification row (spec 3): icon, bold message, relative time, unread dot. */
export function NotificationItem({ item, locale, now, messages, onSelect }: NotificationItemProps) {
  const { Icon, tint } = TYPE_STYLES[item.type];
  const message = formatNotificationMessage(item, messages);
  return (
    <li>
      <button
        type="button"
        data-testid="notification-item"
        data-read={item.isRead}
        onClick={() => onSelect(item)}
        className="flex w-full cursor-pointer items-start gap-4 rounded-lg px-4 py-4 text-left transition-colors duration-200 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent md:px-6"
      >
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tint}`}>
          <Icon className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-base leading-6 font-bold text-white">
            {message.strong ? <span className="text-brand-accent">{message.strong} </span> : null}
            {message.text}
          </span>
          <time dateTime={item.createdAt} className="text-sm leading-5 text-white/60">
            {formatRelativeTime(item.createdAt, locale, now, messages.justNow)}
          </time>
        </span>
        {item.isRead ? null : (
          <span
            role="img"
            aria-label={messages.unread}
            className="mt-2 size-2.5 shrink-0 rounded-full bg-red-500"
          />
        )}
      </button>
    </li>
  );
}
