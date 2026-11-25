import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { FloatingActions } from "@/components/floating-actions/floating-actions";
import { KudosKeyVisual } from "@/components/kudos/kudos-key-visual";
import { KudosLikesProvider } from "@/components/kudos/kudos-likes-provider";
import { KudosSectionHeader } from "@/components/kudos/kudos-section-header";
import { SiteShell } from "@/components/layout/site-shell";
import { ProfileBadgeCollection } from "@/components/profile/profile-badge-collection";
import { ProfileBoxMenu } from "@/components/profile/profile-box-menu";
import { ProfileKudosList } from "@/components/profile/profile-kudos-list";
import { ProfileOwnerInfo } from "@/components/profile/profile-owner-info";
import { ProfileStatsCard } from "@/components/profile/profile-stats-card";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { loadOwnProfile } from "@/lib/profile/load-own-profile";
import { parseProfileBox } from "@/lib/profile/parse-profile-box";
import { createSupabaseServerClient } from "@/lib/supabase/create-supabase-server-client";

export const instant = false;

// Profile bản thân (MoMorph 3FoIx6ALVb): the signed-in user's info, stats and kudos.
// Signed-out visitors are sent to /login by the proxy.
export default async function OwnProfilePage({ searchParams }: PageProps<"/profile">) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const messages = getMessages(locale);
  const box = parseProfileBox(await searchParams);
  await connection();
  const client = await createSupabaseServerClient();
  const { data: claims } = await client.auth.getClaims();
  const userId = claims?.claims.sub;
  const data = userId ? await loadOwnProfile(client, userId, box) : null;
  if (!userId || !data) notFound();
  const m = messages.profile;
  const k = messages.kudos;
  const counts = { received: data.stats?.kudosReceived ?? null, sent: data.stats?.kudosSent ?? null };
  return (
    <SiteShell locale={locale} messages={messages} background={<KudosKeyVisual />}>
      <main className="flex w-full flex-1 flex-col items-center gap-24 px-4 pt-16 pb-24 md:px-10 lg:gap-[120px] lg:pt-24 lg:pb-[120px]">
        <div className="flex w-full flex-col items-center gap-16">
          <div className="flex flex-col items-center gap-8">
            <ProfileOwnerInfo profile={data.profile} kudosReceived={data.stats?.kudosReceived ?? 0} messages={m} kudosMessages={k} />
            <ProfileBadgeCollection slots={data.badges} messages={m} />
          </div>
          <ProfileStatsCard stats={data.stats} label={m.openSecretBox} messages={k} />
        </div>
        <section aria-labelledby="profile-kudos" className="flex w-full max-w-[680px] flex-col gap-10">
          <KudosSectionHeader id="profile-kudos" caption={k.sectionCaption} title={m.kudosTitle}>
            <ProfileBoxMenu box={box} counts={counts} messages={m} />
          </KudosSectionHeader>
          <KudosLikesProvider errorMessage={k.likeError}>
            <ProfileKudosList
              key={box}
              userId={userId}
              box={box}
              initial={data.kudos}
              emptyMessage={m.empty[box]}
              messages={k}
            />
          </KudosLikesProvider>
        </section>
      </main>
      <FloatingActions messages={messages.fab} />
    </SiteShell>
  );
}
