import { ADMIN_DASHBOARD_PATH, PROFILE_PATH, SIGN_OUT_PATH } from "@/lib/auth/auth-paths";
import type { Messages } from "@/i18n/messages";

export type ProfileMenuIcon = "user" | "grid" | "chevron-right";

export type ProfileMenuItem =
  | { kind: "link"; id: string; label: string; href: string; icon: ProfileMenuIcon }
  | { kind: "sign-out"; id: string; label: string; action: string; icon: ProfileMenuIcon };

/** Items of the header account menu (MoMorph z4sCl3_Qtk, admin variant 54rekaCHG1). */
export function getProfileMenuItems(
  messages: Messages["profileMenu"],
  admin: boolean,
): ProfileMenuItem[] {
  const items: ProfileMenuItem[] = [
    { kind: "link", id: "profile", label: messages.profile, href: PROFILE_PATH, icon: "user" },
  ];
  if (admin) {
    items.push({
      kind: "link",
      id: "dashboard",
      label: messages.dashboard,
      href: ADMIN_DASHBOARD_PATH,
      icon: "grid",
    });
  }
  items.push({
    kind: "sign-out",
    id: "logout",
    label: messages.logout,
    action: SIGN_OUT_PATH,
    icon: "chevron-right",
  });
  return items;
}

/** A link item is active on its own route and any sub-route. */
export function isActiveItem(item: ProfileMenuItem, pathname: string): boolean {
  if (item.kind !== "link") return false;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
