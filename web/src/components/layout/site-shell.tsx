import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type SiteShellProps = {
  locale: Locale;
  messages: Messages;
  /** Full-bleed art drawn behind the header (e.g. a key visual). */
  background?: ReactNode;
  children: ReactNode;
};

/** Page frame for signed-in screens: shared header, content and footer. */
export function SiteShell({ locale, messages, background, children }: SiteShellProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip bg-brand-bg">
      {background}
      <SiteHeader locale={locale} messages={messages} />
      {children}
      <SiteFooter messages={messages} />
    </div>
  );
}
