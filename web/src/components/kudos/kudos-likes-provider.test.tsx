import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { kudosEn } from "@/i18n/kudos-messages";
import { getKudosLikeState } from "@/lib/kudos/kudos-queries";
import { likeKudos } from "@/lib/kudos/kudos-mutations";
import { createFakeRealtime, makeCard } from "@/test/kudos-fixtures";
import { HighlightCarousel } from "./highlight-carousel";
import { KudosLikesProvider } from "./kudos-likes-provider";

vi.mock("@/lib/supabase/create-supabase-browser-client", () => ({ createSupabaseBrowserClient: () => ({}) }));
vi.mock("@/lib/kudos/kudos-queries", () => ({ getKudosLikeState: vi.fn() }));
vi.mock("@/lib/kudos/kudos-mutations", () => ({ likeKudos: vi.fn(), unlikeKudos: vi.fn() }));
let fake = createFakeRealtime();
vi.mock("@/lib/kudos-live/supabase-realtime-adapter", () => ({
  realtimeOf: () => fake.realtime,
  authorizeRealtime: async () => undefined,
}));

const like = vi.mocked(likeKudos);
const likeState = vi.mocked(getKudosLikeState);
const heart = (count: number) => screen.getByRole("button", { name: `${count} ${kudosEn.hearts}` });

function renderBoard(cards = [makeCard({ id: "k1", likeCount: 2 })]) {
  render(
    <KudosLikesProvider errorMessage={kudosEn.likeError}>
      <HighlightCarousel cards={cards} filters={{}} messages={kudosEn} />
    </KudosLikesProvider>,
  );
}

describe("KudosLikesProvider with the highlight cards", () => {
  beforeEach(() => {
    fake = createFakeRealtime();
    like.mockReset();
    likeState.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it("likes optimistically and disables the heart while the write is in flight", async () => {
    let finish: () => void = () => undefined;
    like.mockReturnValueOnce(new Promise<void>((resolve) => (finish = resolve)));
    renderBoard();
    await userEvent.click(heart(2));
    expect(heart(3)).toHaveAttribute("aria-pressed", "true");
    expect(heart(3)).toBeDisabled();
    expect(like).toHaveBeenCalledWith(expect.anything(), "k1");
    await act(async () => finish());
    expect(heart(3)).toBeEnabled();
  });

  it("rolls back and shows a toast that hides after 3 seconds when the like fails", async () => {
    like.mockRejectedValueOnce(new Error("offline"));
    renderBoard();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await userEvent.click(heart(2));
    expect(heart(2)).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("alert")).toHaveTextContent(kudosEn.likeError);
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not let the sender like their own kudos", () => {
    renderBoard([makeCard({ id: "k1", isMine: true })]);
    expect(heart(2)).toBeDisabled();
  });

  it("applies like counts changed by other Sunners live", async () => {
    likeState.mockResolvedValueOnce({ likeCount: 7, likedByMe: false });
    renderBoard();
    await act(async () => undefined);
    await act(async () => fake.emit("kudos-likes-live", { new: { kudos_id: "k1" } }));
    expect(likeState).toHaveBeenCalledWith(expect.anything(), "k1");
    expect(heart(7)).toBeInTheDocument();
  });
});

describe("HighlightCarousel", () => {
  const cards = [1, 2, 3].map((n) => makeCard({ id: `k${n}`, content: `Kudos ${n}` }));

  it("pages through the cards with the arrows, disabled at both ends", async () => {
    renderBoard(cards);
    const [prev] = screen.getAllByRole("button", { name: kudosEn.prev });
    const [next] = screen.getAllByRole("button", { name: kudosEn.next });
    expect(screen.getByText("1/3")).toBeInTheDocument();
    expect(prev).toBeDisabled();
    await userEvent.click(next);
    await userEvent.click(next);
    expect(screen.getByText("3/3")).toBeInTheDocument();
    expect(next).toBeDisabled();
    expect(screen.getByText("Kudos 3").closest("li")).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByText("Kudos 1").closest("li")).toHaveAttribute("aria-hidden", "true");
    await userEvent.click(prev);
    expect(screen.getByText("2/3")).toBeInTheDocument();
  });

  it("shows hearts read-only outside the likes provider", () => {
    render(<HighlightCarousel cards={cards.slice(0, 1)} filters={{}} messages={kudosEn} />);
    expect(screen.queryByRole("button", { name: `2 ${kudosEn.hearts}` })).not.toBeInTheDocument();
    expect(screen.getByLabelText(`2 ${kudosEn.hearts}`)).toBeInTheDocument();
  });
});
