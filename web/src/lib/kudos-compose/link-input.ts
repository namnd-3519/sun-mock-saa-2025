// Addlink Box (MoMorph OyDLDuSGEa): validation of the link text (B) and URL (C), and insertion of
// the `[text](url)` marker into the kudos message. Rules: clarifications.md of task #20.
import type { FormattedText } from "./message-format";

export const LINK_LIMITS = { textMax: 100, urlMin: 5, urlMax: 2048 } as const;

export type LinkTextError = "required" | "tooLong";
export type LinkUrlError = "required" | "tooShort" | "tooLong" | "invalid";
export type LinkInput = { text: string; url: string };
export type LinkValidation =
  | { ok: true; text: string; url: string }
  | { ok: false; errors: { text?: LinkTextError; url?: LinkUrlError } };

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
// The raw input must itself start with scheme + "//" + host: `URL` would accept "http:///path".
const SCHEME_AND_HOST = /^https?:\/\/[^/?#]/i;

export function validateLinkText(text: string): LinkTextError | undefined {
  const value = text.trim();
  if (!value) return "required";
  if (value.length > LINK_LIMITS.textMax) return "tooLong";
  return undefined;
}

function isHttpUrl(value: string): boolean {
  if (/\s/.test(value) || !SCHEME_AND_HOST.test(value)) return false;
  try {
    const url = new URL(value);
    return ALLOWED_PROTOCOLS.has(url.protocol) && url.hostname.length > 0;
  } catch {
    return false;
  }
}

export function validateLinkUrl(url: string): LinkUrlError | undefined {
  const value = url.trim();
  if (!value) return "required";
  if (value.length < LINK_LIMITS.urlMin) return "tooShort";
  if (value.length > LINK_LIMITS.urlMax) return "tooLong";
  return isHttpUrl(value) ? undefined : "invalid";
}

export function validateLinkInput({ text, url }: LinkInput): LinkValidation {
  const errors = { text: validateLinkText(text), url: validateLinkUrl(url) };
  if (errors.text || errors.url) {
    return { ok: false, errors: Object.fromEntries(Object.entries(errors).filter(([, error]) => error)) };
  }
  return { ok: true, text: text.trim(), url: url.trim() };
}

/** Replaces the [start, end) selection with `[text](url)` and puts the caret after it. */
export function insertLink(value: string, start: number, end: number, text: string, url: string): FormattedText {
  const marker = `[${text}](${url})`;
  const caret = start + marker.length;
  return { value: value.slice(0, start) + marker + value.slice(end), start: caret, end: caret };
}
