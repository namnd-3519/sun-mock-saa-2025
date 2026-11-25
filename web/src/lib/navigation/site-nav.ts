import type { Messages } from "@/i18n/messages";

export const HOME_PATH = "/";
export const AWARDS_PATH = "/awards";
export const KUDOS_PATH = "/kudos";
// "Tiêu chuẩn chung" (footer only) points at the rules page (task "Thể lệ").
export const STANDARDS_PATH = "/rules";

export type NavItem = { href: string; label: string };

/** Header links (A1.2–A1.5): About SAA 2025 is the homepage itself. */
export function getHeaderNavItems(nav: Messages["nav"]): NavItem[] {
  return [
    { href: HOME_PATH, label: nav.about },
    { href: AWARDS_PATH, label: nav.awards },
    { href: KUDOS_PATH, label: nav.kudos },
  ];
}

/** Footer links (7.2–7.5): the header links plus "Tiêu chuẩn chung". */
export function getFooterNavItems(nav: Messages["nav"]): NavItem[] {
  return [...getHeaderNavItems(nav), { href: STANDARDS_PATH, label: nav.standards }];
}

/** A link is selected on its own path and on any sub-path (e.g. /kudos/123). */
export function isActivePath(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === HOME_PATH) return pathname === HOME_PATH;
  return pathname === href || pathname.startsWith(`${href}/`);
}
