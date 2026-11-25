import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { WriteKudosForm } from "@/components/kudos-compose/write-kudos-form";
import { KudosKeyVisual } from "@/components/kudos/kudos-key-visual";
import { SiteShell } from "@/components/layout/site-shell";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { LOGIN_PATH } from "@/lib/auth/auth-paths";
import { listHashtags } from "@/lib/kudos/reference-data";
import { createSupabaseServerClient } from "@/lib/supabase/create-supabase-server-client";

export const instant = false;

// Viết Kudo (MoMorph ihQ26W78P2): the compose modal over the Kudos key visual and its 80% mask.
export default async function WriteKudosPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const messages = getMessages(locale);
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect(LOGIN_PATH);
  const hashtags = await listHashtags(supabase);

  return (
    <SiteShell locale={locale} messages={messages} background={<KudosKeyVisual />}>
      <main className="relative flex w-full flex-1 justify-center px-4 py-10 sm:py-16">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-brand-bg/80" />
        <WriteKudosForm senderId={data.user.id} hashtags={hashtags} messages={messages.writeKudos} />
      </main>
    </SiteShell>
  );
}
