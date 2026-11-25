import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getMessages } from "@/i18n/messages";
import { ProfileMenu } from "./profile-menu";
import { getProfileMenuItems } from "./profile-menu-items";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

const messages = getMessages("en").profileMenu;

function renderMenu(admin: boolean, path = "/") {
  pathname = path;
  render(<ProfileMenu label="Account" items={getProfileMenuItems(messages, admin)} />);
  return screen.getByRole("button", { name: "Account" });
}

describe("ProfileMenu", () => {
  it("is closed until the button is clicked, then focuses the first item", async () => {
    const button = renderMenu(false);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const items = within(screen.getByRole("menu", { name: "Account" })).getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([messages.profile, messages.logout]);
    expect(items[0]).toHaveFocus();
  });

  it("shows Dashboard to admins and logs out through a POST form", async () => {
    await userEvent.click(renderMenu(true));
    expect(screen.getByRole("menuitem", { name: messages.dashboard })).toHaveAttribute("href", "/admin");
    const logout = screen.getByRole("menuitem", { name: messages.logout });
    expect(logout).toHaveAttribute("type", "submit");
    expect(logout.closest("form")).toHaveAttribute("method", "post");
    expect(logout.closest("form")?.getAttribute("action")).toBe("/auth/sign-out");
  });

  it("marks the item of the current route", async () => {
    await userEvent.click(renderMenu(false, "/profile/abc"));
    expect(screen.getByRole("menuitem", { name: messages.profile })).toHaveAttribute("aria-current", "page");
  });

  it("moves with arrow keys and closes on Escape", async () => {
    const button = renderMenu(true);
    button.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: messages.profile })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: messages.dashboard })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it("closes on outside click and after following a link", async () => {
    const button = renderMenu(false);
    await userEvent.click(button);
    await userEvent.click(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await userEvent.click(button);
    await userEvent.click(screen.getByRole("menuitem", { name: messages.profile }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
