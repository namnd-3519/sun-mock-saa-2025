import { cookies } from "next/headers";
import { connection } from "next/server";
import { SiteShell } from "@/components/layout/site-shell";
import { NotificationsPanel } from "@/components/notifications/notifications-panel";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { listNotifications } from "@/lib/notifications/notification-queries";
import { createSupabaseServerClient } from "@/lib/supabase/create-supabase-server-client";

export const instant = false;

// Tất cả thông báo (MoMorph 6-1LRz3vqr). Signed-out visitors are sent to /login by the proxy.
export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const messages = getMessages(locale);
  await connection();
  const initial = await listNotifications(await createSupabaseServerClient());
  return (
    <SiteShell locale={locale} messages={messages}>
      <main className="flex w-full flex-1 justify-center px-4 pt-10 pb-24 md:px-10 md:pt-16">
        <NotificationsPanel
          initial={initial}
          now={new Date().toISOString()}
          locale={locale}
          messages={messages.notifications}
        />
      </main>
    </SiteShell>
  );
}
