"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { NotificationsMessages } from "@/i18n/notifications-messages";
import { IconBell } from "@/components/icons/icon-bell";
import { NOTIFICATIONS_PATH } from "@/lib/auth/auth-paths";
import { formatBellLabel } from "@/lib/notifications/notification-message";
import { countUnreadNotifications } from "@/lib/notifications/notification-queries";
import { NOTIFICATIONS_CHANGED_EVENT } from "@/lib/notifications/notifications-changed-event";
import { createSupabaseBrowserClient } from "@/lib/supabase/create-supabase-browser-client";

type NotificationBellProps = { label: string; messages: NotificationsMessages; className: string };

/**
 * Header bell (spec 1, 1.1): links to the notifications page and shows the unread count.
 * The count always comes from the server: on mount, on focus, after a mark-read on this tab
 * and on any Realtime change to the user's own rows. It is never incremented locally.
 */
export function NotificationBell({ label, messages, className }: NotificationBellProps) {
  const client = useMemo(() => createSupabaseBrowserClient(), []);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    let removeChannel: (() => void) | null = null;

    const refresh = () => {
      countUnreadNotifications(client)
        .then((count) => active && setUnread(count))
        .catch(() => active && setUnread(0));
    };

    refresh();
    void client.auth.getUser().then(({ data }) => {
      const userId = data.user?.id;
      if (!active || !userId) return;
      const channel = client
        .channel(`notifications-${userId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "notifications", filter: `recipient_id=eq.${userId}` },
          refresh,
        )
        .subscribe();
      removeChannel = () => void client.removeChannel(channel);
    });
    window.addEventListener("focus", refresh);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);

    return () => {
      active = false;
      removeChannel?.();
      window.removeEventListener("focus", refresh);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
    };
  }, [client]);

  return (
    <Link
      href={NOTIFICATIONS_PATH}
      data-testid="notification-bell"
      aria-label={formatBellLabel(label, messages, unread)}
      className={`relative ${className}`}
    >
      <IconBell />
      {unread > 0 ? (
        <span
          data-testid="notification-badge"
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] leading-none font-bold text-white"
        >
          {unread > 99 ? "99+" : unread}
        </span>
      ) : null}
    </Link>
  );
}
