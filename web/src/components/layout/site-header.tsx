import { Suspense } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";
import { IconBell } from "@/components/icons/icon-bell";
import { ProfileMenu } from "@/components/profile-menu/profile-menu";
import { AccountMenu } from "@/components/profile-menu/account-menu";
import { getProfileMenuItems } from "@/components/profile-menu/profile-menu-items";
import { getHeaderNavItems } from "@/lib/navigation/site-nav";
import { SiteLogo } from "./site-logo";
import { SiteNav } from "./site-nav";

type SiteHeaderProps = { locale: Locale; messages: Messages };

const ICON_BUTTON =
  "flex size-10 cursor-pointer items-center justify-center rounded p-2.5 text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent";

/** Shared sticky header (MoMorph A1) for every signed-in screen. */
export function SiteHeader({ locale, messages }: SiteHeaderProps) {
  const { nav, profileMenu } = messages;
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 bg-[rgb(16_20_23/0.8)] px-4 py-3 backdrop-blur-sm md:px-10 lg:px-36">
      <div className="flex items-center gap-6 xl:gap-16">
        <SiteLogo label={nav.home} size="header" />
        <div className="hidden lg:block">
          <SiteNav items={getHeaderNavItems(nav)} variant="header" ariaLabel={nav.main} />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {/* Slot: the notification panel and unread badge come with task "Tất cả thông báo". */}
        <button type="button" aria-label={nav.notifications} className={ICON_BUTTON}>
          <IconBell />
        </button>
        <LanguageSwitcher locale={locale} messages={messages.language} />
        {/* Until the role is read, the menu shows the items every user has. */}
        <Suspense
          fallback={
            <ProfileMenu label={nav.account} items={getProfileMenuItems(profileMenu, false)} />
          }
        >
          <AccountMenu label={nav.account} messages={profileMenu} />
        </Suspense>
      </div>
    </header>
  );
}
