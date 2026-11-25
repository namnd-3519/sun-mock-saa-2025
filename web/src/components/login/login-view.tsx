import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { LoginFooter } from "./login-footer";
import { LoginHeader } from "./login-header";
import { LoginHeroBackground } from "./login-hero-background";
import { LoginIntro } from "./login-intro";

type LoginViewProps = { locale: Locale; messages: Messages };

export function LoginView({ locale, messages }: LoginViewProps) {
  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip bg-brand-bg">
      <LoginHeroBackground />
      <LoginHeader locale={locale} messages={messages.language} />
      <main className="flex flex-1 flex-col justify-center px-4 py-12 md:px-10 lg:px-36 lg:py-24">
        <LoginIntro messages={messages.login} />
      </main>
      <LoginFooter copyright={messages.footer.copyright} />
    </div>
  );
}
