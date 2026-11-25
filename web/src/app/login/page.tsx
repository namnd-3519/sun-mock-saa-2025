import { cookies } from "next/headers";
import { LoginView } from "@/components/login/login-view";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export const instant = false;

export default async function LoginPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  return <LoginView locale={locale} messages={getMessages(locale)} />;
}
