import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { kudosEn } from "@/i18n/kudos-messages";
import { getKudosById, listKudosFeed } from "@/lib/kudos/kudos-queries";
import { createFakeRealtime, makeCard } from "@/test/kudos-fixtures";
import { KudosFeed } from "./kudos-feed";

vi.mock("@/lib/supabase/create-supabase-browser-client", () => ({ createSupabaseBrowserClient: () => ({}) }));
vi.mock("@/lib/kudos/kudos-queries", () => ({ listKudosFeed: vi.fn(), getKudosById: vi.fn() }));
vi.mock("@/lib/kudos/kudos-images", () => ({
  createKudosImageUrls: async (_client: unknown, paths: string[]) => paths.map((path) => `https://img/${path}`),
}));
let fake = createFakeRealtime();
vi.mock("@/lib/kudos-live/supabase-realtime-adapter", () => ({
  realtimeOf: () => fake.realtime,
  authorizeRealtime: async () => undefined,
}));

const listFeed = vi.mocked(listKudosFeed);
const getById = vi.mocked(getKudosById);
let intersect: () => void = () => undefined;

class FakeIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    intersect = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
  }
  observe() {}
  disconnect() {}
}

const first = makeCard({ id: "k1", content: "First kudos" });
const cursor = { createdAt: first.createdAt, id: first.id };

function renderFeed(items = [first], nextCursor: typeof cursor | null = cursor) {
  render(<KudosFeed initial={{ items, nextCursor }} filters={{}} messages={kudosEn} />);
}

const cardTexts = () => screen.getAllByRole("article").map((article) => within(article).getByText(/kudos/i).textContent);

describe("KudosFeed", () => {
  beforeEach(() => {
    fake = createFakeRealtime();
    listFeed.mockReset();
    getById.mockReset();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  });

  it("shows the empty state when there is no kudos", () => {
    renderFeed([], null);
    expect(screen.getByText(kudosEn.empty)).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("loads the next page when the sentinel scrolls into view", async () => {
    let resolve: (page: Awaited<ReturnType<typeof listKudosFeed>>) => void = () => undefined;
    listFeed.mockReturnValueOnce(new Promise((r) => (resolve = r)));
    renderFeed();
    act(() => intersect());
    expect(screen.getByRole("status")).toHaveTextContent(kudosEn.loadingMore);
    expect(listFeed).toHaveBeenCalledWith(expect.anything(), { filters: {}, cursor, limit: 10 });
    await act(async () => resolve({ items: [makeCard({ id: "k2", content: "Second kudos", imagePaths: ["a.png"] })], nextCursor: null }));
    expect(cardTexts()).toEqual(["First kudos", "Second kudos"]);
    expect(screen.getByRole("img", { name: "1" })).toHaveAttribute("src", "https://img/a.png");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an error with a retry that loads the page again", async () => {
    listFeed.mockRejectedValueOnce(new Error("offline"));
    listFeed.mockResolvedValueOnce({ items: [makeCard({ id: "k2", content: "Second kudos" })], nextCursor: null });
    renderFeed();
    await act(async () => intersect());
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(kudosEn.loadError);
    await userEvent.click(within(alert).getByRole("button", { name: kudosEn.retry }));
    expect(cardTexts()).toEqual(["First kudos", "Second kudos"]);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("puts a kudos inserted live on top of the feed", async () => {
    getById.mockResolvedValueOnce(makeCard({ id: "k9", content: "Live kudos" }));
    renderFeed([first], null);
    await act(async () => undefined);
    await act(async () => fake.emit("kudos-live", { new: { id: "k9" } }));
    expect(getById).toHaveBeenCalledWith(expect.anything(), "k9", {});
    expect(cardTexts()).toEqual(["Live kudos", "First kudos"]);
  });

  it("catches up on kudos missed while the channel was joining", async () => {
    listFeed.mockResolvedValueOnce({ items: [makeCard({ id: "k0", content: "Missed kudos" }), first], nextCursor: null });
    renderFeed([first], null);
    await act(async () => undefined);
    await act(async () => fake.join("kudos-live"));
    expect(cardTexts()).toEqual(["Missed kudos", "First kudos"]);
  });
});
