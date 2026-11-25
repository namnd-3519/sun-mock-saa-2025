import { cookies } from "next/headers";
import { connection } from "next/server";
import { FloatingActions } from "@/components/floating-actions/floating-actions";
import { AllKudosSection } from "@/components/kudos/all-kudos-section";
import { HighlightSection } from "@/components/kudos/highlight-section";
import { KudosHero } from "@/components/kudos/kudos-hero";
import { KudosLikesProvider } from "@/components/kudos/kudos-likes-provider";
import { KudosKeyVisual } from "@/components/kudos/kudos-key-visual";
import { SpotlightBoard } from "@/components/kudos/spotlight-board";
import { SiteShell } from "@/components/layout/site-shell";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { parseKudosFilters } from "@/lib/kudos-live/kudos-filters";
import { loadLiveBoard } from "@/lib/kudos-live/load-live-board";
import { createSupabaseServerClient } from "@/lib/supabase/create-supabase-server-client";

export const instant = false;

// Sun* Kudos - Live board (MoMorph MaZUn5xHXZ). Signed-out visitors are sent to /login by the proxy.
export default async function KudosLiveBoardPage({ searchParams }: PageProps<"/kudos">) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const messages = getMessages(locale);
  const filters = parseKudosFilters(await searchParams);
  await connection();
  const data = await loadLiveBoard(await createSupabaseServerClient(), filters);
  const m = messages.kudos;
  return (
    <SiteShell locale={locale} messages={messages} background={<KudosKeyVisual />}>
      <main className="flex w-full flex-1 flex-col items-center gap-24 pt-16 pb-24 lg:gap-[120px] lg:pt-24 lg:pb-[120px]">
        <KudosLikesProvider errorMessage={m.likeError}>
          <div className="flex w-full flex-col gap-16">
            <KudosHero messages={m} />
            <HighlightSection cards={data.highlight} filters={filters} messages={m} />
          </div>
          <SpotlightBoard total={data.total} names={data.spotlightNames} messages={m} />
          <AllKudosSection data={data} filters={filters} messages={m} />
        </KudosLikesProvider>
      </main>
      <FloatingActions messages={messages.fab} />
    </SiteShell>
  );
}
