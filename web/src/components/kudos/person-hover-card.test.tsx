import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { kudosEn } from "@/i18n/kudos-messages";
import { makePerson } from "@/test/kudos-fixtures";
import { KudosPerson } from "./kudos-person";

const person = makePerson({ fullName: "Tran Thi B", kudosReceivedCount: 12 });

function renderPerson(isSelf = false) {
  render(<KudosPerson person={person} isSelf={isSelf} messages={kudosEn} />);
  const [avatar] = screen.getAllByRole("link", { name: "Tran Thi B" });
  return { avatar, root: avatar.closest("[data-open]") as HTMLElement };
}

const card = () => screen.queryByTestId("person-hover-card");

describe("PersonHoverCard", () => {
  it("opens on mouse hover and closes when the pointer leaves", () => {
    const { root } = renderPerson();
    fireEvent.pointerEnter(root, { pointerType: "mouse" });
    expect(card()).toHaveTextContent(`${kudosEn.hoverCard.received} 12`);
    expect(root).toHaveAttribute("data-open", "true");
    fireEvent.pointerLeave(root, { pointerType: "mouse" });
    expect(card()).not.toBeInTheDocument();
  });

  it("opens on keyboard focus and closes on Escape", async () => {
    renderPerson();
    await userEvent.tab();
    expect(card()).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(card()).not.toBeInTheDocument();
  });

  it("closes when focus leaves the person", async () => {
    renderPerson();
    render(<button type="button">after</button>);
    await userEvent.tab();
    await userEvent.tab();
    expect(card()).toBeInTheDocument();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "after" })).toHaveFocus();
    expect(card()).not.toBeInTheDocument();
  });

  it("toggles on touch taps on the avatar instead of following the link", () => {
    const { avatar, root } = renderPerson();
    fireEvent.pointerDown(root, { pointerType: "touch" });
    fireEvent.focus(avatar);
    expect(card()).not.toBeInTheDocument();
    fireEvent.click(avatar, { detail: 1 });
    expect(card()).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(card()).not.toBeInTheDocument();
  });

  it("links to the own profile only for the signed-in user", () => {
    const { root } = renderPerson(true);
    fireEvent.pointerEnter(root, { pointerType: "mouse" });
    expect(screen.getByRole("link", { name: kudosEn.hoverCard.viewProfile })).toHaveAttribute("href", "/profile");
  });
});
