import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMessages } from "@/i18n/messages";
import { LanguageSwitcher } from "./language-switcher";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }));

const messages = getMessages("en").language;

function renderSwitcher() {
  render(<LanguageSwitcher locale="vi" messages={messages} />);
  return screen.getByRole("button", { name: `${messages.label}: VN` });
}

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    refresh.mockReset();
    document.cookie = "NEXT_LOCALE=; max-age=0; path=/";
  });

  it("opens a listbox with the current locale selected and focused", async () => {
    const button = renderSwitcher();
    expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const current = screen.getByRole("option", { name: messages.vi });
    expect(current).toHaveAttribute("aria-selected", "true");
    expect(current).toHaveFocus();
    expect(screen.getByRole("option", { name: messages.en })).toHaveAttribute("aria-selected", "false");
  });

  it("saves the new locale cookie and refreshes the route", async () => {
    await userEvent.click(renderSwitcher());
    await userEvent.click(screen.getByRole("option", { name: messages.en }));
    expect(document.cookie).toContain("NEXT_LOCALE=en");
    expect(refresh).toHaveBeenCalledOnce();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does nothing when the current locale is picked again", async () => {
    await userEvent.click(renderSwitcher());
    await userEvent.click(screen.getByRole("option", { name: messages.vi }));
    expect(refresh).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain("NEXT_LOCALE=");
  });

  it("supports keyboard: arrow opens, arrows move, Enter selects", async () => {
    const button = renderSwitcher();
    button.focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: messages.vi })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: messages.en })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(refresh).toHaveBeenCalledOnce();
    expect(button).toHaveFocus();
  });

  it("closes on Escape with focus back on the button, and on outside click", async () => {
    const button = renderSwitcher();
    await userEvent.click(button);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
    await userEvent.click(button);
    await userEvent.click(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
