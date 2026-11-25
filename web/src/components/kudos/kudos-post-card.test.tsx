import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { kudosEn } from "@/i18n/kudos-messages";
import { makeCard } from "@/test/kudos-fixtures";
import { KudosPostCard } from "./kudos-post-card";

const hashtags = Array.from({ length: 6 }, (_, n) => ({ id: `h${n}`, name: `tag${n}` }));

function renderCard(overrides = {}, onToggleLike?: () => void) {
  render(<KudosPostCard card={makeCard(overrides)} filters={{ departmentId: "d1" }} messages={kudosEn} onToggleLike={onToggleLike} />);
}

describe("KudosPostCard", () => {
  afterEach(() => vi.useRealTimers());

  it("shows sender, recipient, title, content and at most 5 images and hashtags", () => {
    renderCard({
      title: "Great teammate",
      hashtags,
      imageUrls: ["1", "2", "3", "4", "5", "6"].map((n) => `https://img/${n}.png`),
    });
    expect(screen.getAllByRole("link", { name: "Nguyen Van A" })[0]).toHaveAttribute("href", "/profile/user-sender");
    expect(screen.getAllByRole("link", { name: "Tran Thi B" })[0]).toHaveAttribute("href", "/profile/user-recipient");
    expect(screen.getByText("Great teammate")).toBeInTheDocument();
    expect(screen.getByText("Thanks for the help!")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(5);
    const tagLinks = screen.getAllByRole("link", { name: /^#tag/ });
    expect(tagLinks).toHaveLength(5);
    expect(tagLinks[0]).toHaveAttribute("href", "/kudos?hashtag=h0&department=d1");
    expect(screen.getByText("…")).toBeInTheDocument();
  });

  it("hides an anonymous sender behind the alias", () => {
    renderCard({ isAnonymous: true, anonymousName: "Secret Santa", sender: null });
    expect(screen.getByText("Secret Santa")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Nguyen Van A" })).not.toBeInTheDocument();
  });

  it("toggles the like through the heart button", async () => {
    const toggle = vi.fn();
    renderCard({ likedByMe: true, likeCount: 4 }, toggle);
    const heart = screen.getByRole("button", { name: `4 ${kudosEn.hearts}` });
    expect(heart).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(heart);
    expect(toggle).toHaveBeenCalledWith(expect.objectContaining({ id: "kudos-1" }));
  });

  it("copies the kudos link and shows a confirmation that fades out", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderCard();
    await user.click(screen.getByRole("button", { name: kudosEn.copyLink }));
    await expect(navigator.clipboard.readText()).resolves.toBe(`${window.location.origin}/kudos#kudos-kudos-1`);
    expect(screen.getByRole("status")).toHaveTextContent(kudosEn.copied);
    act(() => vi.advanceTimersByTime(2500));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows no confirmation when the clipboard is unavailable", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(new Error("denied"));
    renderCard();
    await user.click(screen.getByRole("button", { name: kudosEn.copyLink }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
