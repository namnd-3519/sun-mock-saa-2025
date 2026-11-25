import { cookies } from "next/headers";
import { connection } from "next/server";
import { AwardCategoryMenu } from "@/components/awards/award-category-menu";
import { AwardDetailSection } from "@/components/awards/award-detail-section";
import { AwardsKeyVisual } from "@/components/awards/awards-key-visual";
import { AwardsTitle } from "@/components/awards/awards-title";
import { KudosPromo } from "@/components/home/kudos-promo";
import { SiteShell } from "@/components/layout/site-shell";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { AWARD_CATEGORIES } from "@/lib/home/award-categories";

export const instant = false;

// Menu labels as drawn in the design (C.5 without the dash, C.6 without the long form).
const MENU_LABELS: Record<string, string> = {
  "signature-2025-creator": "Signature 2025 Creator",
  mvp: "MVP",
};

// Hệ thống giải / Awards Information (MoMorph zFYDgyj_pD). Homepage cards link to /awards#<slug>.
export default async function AwardsPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const messages = getMessages(locale);
  const page = messages.awardsPage;
  await connection();
  return (
    <SiteShell locale={locale} messages={messages} background={<AwardsKeyVisual />}>
      <main className="mx-auto flex w-full max-w-[1512px] flex-1 flex-col gap-16 px-4 pt-16 pb-24 md:px-10 lg:gap-[120px] lg:px-36 lg:pt-24">
        <AwardsTitle messages={page} />
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          <AwardCategoryMenu
            ariaLabel={page.categoriesLabel}
            items={AWARD_CATEGORIES.map((award) => ({
              slug: award.slug,
              label: MENU_LABELS[award.slug] ?? award.title,
            }))}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-20 lg:max-w-[853px]">
            {AWARD_CATEGORIES.map((award, index) => (
              <AwardDetailSection
                key={award.slug}
                award={award}
                detail={page.details[award.descriptionKey]}
                labels={page}
                pictureRight={index % 2 === 1}
                isLast={index === AWARD_CATEGORIES.length - 1}
              />
            ))}
          </div>
        </div>
        <KudosPromo messages={messages.home} />
      </main>
    </SiteShell>
  );
}
