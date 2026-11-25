import { cookies } from "next/headers";
import { SIGN_OUT_PATH } from "@/lib/auth/auth-paths";
import { LOCALE_COOKIE, resolveLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";

export const instant = false;

// Placeholder landing page after sign-in; the Homepage task replaces it.
export default async function TodoPage() {
  const cookieStore = await cookies();
  const messages = getMessages(resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value));
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <p className="text-base">Todo</p>
      <form action={SIGN_OUT_PATH} method="post">
        <button
          type="submit"
          className="cursor-pointer rounded-lg border border-current px-4 py-2 text-base font-bold"
        >
          {messages.auth.signOut}
        </button>
      </form>
    </main>
  );
}
