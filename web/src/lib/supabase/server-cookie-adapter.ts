import type { CookieMethodsServer, CookieOptions } from "@supabase/ssr";

export type WritableCookieStore = {
  getAll(): { name: string; value: string }[];
  set(name: string, value: string, options: CookieOptions): void;
};

export function createServerCookieAdapter(
  store: WritableCookieStore,
): Required<Pick<CookieMethodsServer, "getAll" | "setAll">> {
  return {
    getAll: () => store.getAll(),
    setAll: (cookies) => {
      try {
        for (const { name, value, options } of cookies) {
          store.set(name, value, options);
        }
      } catch {
        // Server Components cannot write cookies (Next.js throws); the session
        // refresh is then persisted by a Route Handler, Server Action or proxy.
      }
    },
  };
}
