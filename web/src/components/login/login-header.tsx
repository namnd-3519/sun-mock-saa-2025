import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";
import { SunLogo } from "./sun-logo";

type LoginHeaderProps = { locale: Locale; messages: Messages["language"] };

export function LoginHeader({ locale, messages }: LoginHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between bg-brand-header px-4 py-3 md:px-10 lg:px-36">
      <SunLogo />
      <LanguageSwitcher locale={locale} messages={messages} />
    </header>
  );
}
