import { cookies } from "next/headers";
import { SiteShell } from "@/components/layout/site-shell";
import { RulesPanel } from "@/components/rules/rules-panel";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

// Rules page (MoMorph b1Filzi9i6): the "Thể lệ" panel docked to the right, like the frame.
export default async function RulesPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const messages = getMessages(locale);
  return (
    <SiteShell locale={locale} messages={messages}>
      <main className="flex w-full flex-1 justify-center md:justify-end">
        <RulesPanel messages={messages.rules} />
      </main>
    </SiteShell>
  );
}
