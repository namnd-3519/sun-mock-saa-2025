import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { profileEn as m } from "@/i18n/profile-messages";
import { ProfileBoxMenu } from "./profile-box-menu";

function renderMenu(counts: { received: number | null; sent: number | null } = { received: 4, sent: 2 }) {
  render(<ProfileBoxMenu box="received" counts={counts} messages={m} />);
  return screen.getByRole("button", { name: `${m.boxLabel}: Received (${counts.received ?? "—"})` });
}

describe("ProfileBoxMenu", () => {
  it("switches between the received and sent lists", async () => {
    const button = renderMenu();
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Received (4)" })).toHaveAttribute("aria-current", "true");
    const sent = screen.getByRole("link", { name: "Sent (2)" });
    expect(sent).toHaveAttribute("href", "/profile?box=sent");
    await userEvent.click(sent);
    expect(screen.queryByRole("link", { name: "Sent (2)" })).not.toBeInTheDocument();
  });

  it("shows a dash for an unknown count", () => {
    expect(renderMenu({ received: null, sent: null })).toHaveTextContent("Received (—)");
  });

  it("closes on Escape and on outside click", async () => {
    const button = renderMenu();
    await userEvent.click(button);
    await userEvent.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(button);
    await userEvent.click(document.body);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
