"use client";

import { useMemo, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { NotificationsMessages } from "@/i18n/notifications-messages";
import { IconListCheck } from "@/components/icons/icon-list-check";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/notifications/notification-queries";
import { announceNotificationsChanged } from "@/lib/notifications/notifications-changed-event";
import type { AppNotification, NotificationPage } from "@/lib/notifications/notification-types";
import { createSupabaseBrowserClient } from "@/lib/supabase/create-supabase-browser-client";
import { NotificationItem } from "./notification-item";

type NotificationsPanelProps = {
  initial: NotificationPage;
  /** Server render time, so relative times match between server and client. */
  now: string;
  locale: Locale;
  messages: NotificationsMessages;
};

const ACTION =
  "flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm font-bold text-brand-accent transition-colors duration-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent disabled:cursor-not-allowed disabled:opacity-50";

/** "Tất cả thông báo": the signed-in user's notifications, newest first. */
export function NotificationsPanel({ initial, now, locale, messages }: NotificationsPanelProps) {
  const client = useMemo(() => createSupabaseBrowserClient(), []);
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);
  const renderedAt = useMemo(() => new Date(now), [now]);
  const hasUnread = items.some((item) => !item.isRead);

  async function run(task: () => Promise<void>) {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError(false);
    try {
      await task();
    } catch {
      setError(true);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  const loadMore = () =>
    run(async () => {
      const page = await listNotifications(client, { cursor });
      setItems((current) => [...current, ...page.items]);
      setCursor(page.nextCursor);
    });

  const markAll = () =>
    run(async () => {
      await markAllNotificationsRead(client);
      setItems((current) => current.map((item) => ({ ...item, isRead: true })));
      announceNotificationsChanged();
    });

  // Spec 3: a click only marks the item read; there is no navigation.
  const select = (target: AppNotification) => {
    if (target.isRead) return;
    void run(async () => {
      await markNotificationRead(client, target.id);
      setItems((current) =>
        current.map((item) => (item.id === target.id ? { ...item, isRead: true } : item)),
      );
      announceNotificationsChanged();
    });
  };

  return (
    <section
      aria-labelledby="notifications-title"
      className="flex w-full max-w-[800px] flex-col gap-4 rounded-2xl border border-brand-divider bg-brand-container-2/80 p-4 md:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-divider pb-4">
        <h1 id="notifications-title" className="text-2xl leading-8 font-bold text-white md:text-[32px] md:leading-10">
          {messages.title}
        </h1>
        <button
          type="button"
          data-testid="mark-all-read"
          onClick={markAll}
          disabled={loading || !hasUnread}
          className={ACTION}
        >
          <IconListCheck className="size-5" />
          {messages.markAllRead}
        </button>
      </div>
      {items.length === 0 ? (
        <p data-testid="notifications-empty" className="py-12 text-center text-base text-white/70">
          {messages.empty}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-brand-divider">
          {items.map((item) => (
            <NotificationItem
              key={item.id}
              item={item}
              locale={locale}
              now={renderedAt}
              messages={messages}
              onSelect={select}
            />
          ))}
        </ul>
      )}
      {error ? (
        <p role="alert" className="text-center text-sm text-brand-error">
          {messages.error}
        </p>
      ) : null}
      {cursor ? (
        <button
          type="button"
          data-testid="notifications-load-more"
          onClick={loadMore}
          disabled={loading}
          className={`${ACTION} self-center border border-brand-border px-6`}
        >
          {messages.loadMore}
        </button>
      ) : null}
    </section>
  );
}
