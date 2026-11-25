import { LOGIN_PATH, sanitizeNextPath } from "./auth-paths";

export const LOGIN_ERROR_PATH = `${LOGIN_PATH}?error=oauth`;

export type ExchangeCode = (code: string) => Promise<{ error: unknown }>;

// Decides where the OAuth callback sends the browser. A provider error
// (including a cancelled consent), a missing code or a failed exchange all
// return to Login with the error flag.
export async function handleOAuthCallback(
  url: URL,
  exchange: ExchangeCode,
): Promise<string> {
  const code = url.searchParams.get("code");
  if (url.searchParams.has("error") || !code) return LOGIN_ERROR_PATH;
  try {
    const { error } = await exchange(code);
    if (error) return LOGIN_ERROR_PATH;
  } catch {
    return LOGIN_ERROR_PATH;
  }
  return sanitizeNextPath(url.searchParams.get("next"));
}
