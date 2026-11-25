import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/messages";
import { getProfileMenuItems, isActiveItem } from "./profile-menu-items";

const messages = getMessages("en").profileMenu;

describe("getProfileMenuItems", () => {
  it("gives a normal user Profile then Logout", () => {
    const items = getProfileMenuItems(messages, false);
    expect(items.map((item) => item.id)).toEqual(["profile", "logout"]);
    expect(items[0]).toMatchObject({ kind: "link", href: "/profile", label: "Profile" });
  });

  it("adds Dashboard between Profile and Logout for an admin", () => {
    const items = getProfileMenuItems(messages, true);
    expect(items.map((item) => item.id)).toEqual(["profile", "dashboard", "logout"]);
    expect(items[1]).toMatchObject({ kind: "link", href: "/admin", label: "Dashboard" });
  });

  it("signs out by posting to the sign-out route", () => {
    const logout = getProfileMenuItems(messages, false).at(-1);
    expect(logout).toMatchObject({ kind: "sign-out", action: "/auth/sign-out", label: "Logout" });
  });

  it("uses the Vietnamese labels for the vi locale", () => {
    const items = getProfileMenuItems(getMessages("vi").profileMenu, true);
    expect(items.map((item) => item.label)).toEqual(["Hồ sơ", "Dashboard", "Đăng xuất"]);
  });
});

describe("isActiveItem", () => {
  const [profile, , logout] = getProfileMenuItems(messages, true);

  it("marks a link active on its route and sub-routes only", () => {
    expect(isActiveItem(profile, "/profile")).toBe(true);
    expect(isActiveItem(profile, "/profile/kudos")).toBe(true);
    expect(isActiveItem(profile, "/profiles")).toBe(false);
    expect(isActiveItem(profile, "/")).toBe(false);
  });

  it("never marks the sign-out item active", () => {
    expect(isActiveItem(logout, "/auth/sign-out")).toBe(false);
  });
});
