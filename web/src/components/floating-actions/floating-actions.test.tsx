import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { getMessages } from "@/i18n/messages";
import { FloatingActions } from "./floating-actions";

const messages = getMessages("en").fab;

function renderFab() {
  render(<FloatingActions messages={messages} />);
  return screen.getByRole("button", { name: messages.open });
}

describe("FloatingActions", () => {
  it("expands into Rules and Write Kudos links, focusing the first", async () => {
    const trigger = renderFab();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    await userEvent.click(trigger);
    expect(screen.getByRole("group", { name: messages.actions })).toBeInTheDocument();
    const rules = screen.getByRole("link", { name: messages.rules });
    expect(rules).toHaveAttribute("href", "/rules");
    expect(rules).toHaveFocus();
    expect(screen.getByRole("link", { name: messages.writeKudos })).toHaveAttribute("href", "/kudos/new");
  });

  it("collapses on cancel and returns focus to the pill", async () => {
    await userEvent.click(renderFab());
    await userEvent.click(screen.getByRole("button", { name: messages.close }));
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: messages.open })).toHaveFocus();
  });

  it("collapses on Escape and on outside click", async () => {
    await userEvent.click(renderFab());
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: messages.open })).toHaveFocus();
    await userEvent.click(screen.getByRole("button", { name: messages.open }));
    await userEvent.click(document.body);
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("collapses after an action link is followed", async () => {
    await userEvent.click(renderFab());
    await userEvent.click(screen.getByRole("link", { name: messages.writeKudos }));
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });
});
