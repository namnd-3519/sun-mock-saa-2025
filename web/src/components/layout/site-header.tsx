import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";
import { IconBell } from "@/components/icons/icon-bell";
import { IconUser } from "@/components/icons/icon-user";
import { ACCOUNT_PLACEHOLDER_PATH } from "@/lib/auth/auth-paths";
import { getHeaderNavItems } from "@/lib/navigation/site-nav";
import { SiteLogo } from "./site-logo";
import { SiteNav } from "./site-nav";

type SiteHeaderProps = { locale: Locale; messages: Messages };

const ICON_BUTTON =
  "flex size-10 cursor-pointer items-center justify-center rounded p-2.5 text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent";

/** Shared sticky header (MoMorph A1) for every signed-in screen. */
export function SiteHeader({ locale, messages }: SiteHeaderProps) {
  const { nav } = messages;
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
        {/* Slot: task "Dropdown-profile" replaces this link with the account menu. */}
        <Link
          href={ACCOUNT_PLACEHOLDER_PATH}
          aria-label={nav.account}
          className={`${ICON_BUTTON} border border-brand-border`}
        >
          <IconUser />
        </Link>
      </div>
    </header>
  );
}
