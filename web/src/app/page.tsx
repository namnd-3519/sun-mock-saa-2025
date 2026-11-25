import { cookies } from "next/headers";
import { connection } from "next/server";
import { AwardsSection } from "@/components/home/awards-section";
import { HomeHero } from "@/components/home/home-hero";
import { HomeKeyVisual } from "@/components/home/home-key-visual";
import { KudosPromo } from "@/components/home/kudos-promo";
import { RootFurtherStory } from "@/components/home/root-further-story";
import { SiteShell } from "@/components/layout/site-shell";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getEventAt } from "@/lib/home/event-time";

export const instant = false;

// Homepage SAA (MoMorph i87tDx10uM). Signed-out visitors are sent to /login by the proxy.
export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const messages = getMessages(locale);
  await connection();
  return (
    <SiteShell locale={locale} messages={messages} background={<HomeKeyVisual />}>
      <main className="mx-auto flex w-full max-w-[1512px] flex-1 flex-col gap-24 px-4 pt-16 pb-24 md:px-10 lg:gap-[120px] lg:px-36 lg:pt-[104px]">
        <HomeHero now={new Date()} eventAt={getEventAt()} messages={messages.home} />
        <RootFurtherStory messages={messages.home} />
        <AwardsSection messages={messages.home} />
        <KudosPromo messages={messages.home} />
        {/* Slot: the floating action button (MoMorph 6) comes with task "Floating Action Buttons". */}
      </main>
    </SiteShell>
  );
}
