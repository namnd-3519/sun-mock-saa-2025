import type { Messages } from "@/i18n/messages";
import { getFooterNavItems } from "@/lib/navigation/site-nav";
import { SiteLogo } from "./site-logo";
import { SiteNav } from "./site-nav";

type SiteFooterProps = { messages: Messages };

/** Shared footer (MoMorph 7): logo, nav links and copyright. */
export function SiteFooter({ messages }: SiteFooterProps) {
  const { nav } = messages;
  return (
    <footer className="flex flex-col items-start gap-6 border-t border-brand-divider px-4 py-10 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-[90px]">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center lg:gap-20">
        <SiteLogo label={nav.home} size="footer" />
        <SiteNav items={getFooterNavItems(nav)} variant="footer" ariaLabel={nav.footer} />
      </div>
      <p className="font-alt text-base leading-6 font-bold text-white">
        {messages.footer.copyright}
      </p>
    </footer>
  );
}
