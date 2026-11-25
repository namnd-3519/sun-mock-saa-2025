import { cookies } from "next/headers";
import { LoginView } from "@/components/login/login-view";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export const instant = false;

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const params = await searchParams;
  return (
    <LoginView
      locale={locale}
      messages={getMessages(locale)}
      hasAuthError={firstValue(params.error) !== undefined}
      next={firstValue(params.next)}
    />
  );
}
