import { describe, expect, it } from "vitest";
import type { KudosCardView } from "./kudos-card-view";
import { appendPage, mergeFreshHead, prependKudos } from "./kudos-feed-state";

const card = (id: string) => ({ id }) as KudosCardView;
const ids = (items: KudosCardView[]) => items.map((item) => item.id);

describe("appendPage", () => {
  it("appends in order and drops ids already shown", () => {
    expect(ids(appendPage([card("a"), card("b")], [card("b"), card("c")]))).toEqual(["a", "b", "c"]);
  });
});

describe("prependKudos", () => {
  it("puts a new kudos on top", () => {
    expect(ids(prependKudos([card("a")], card("n")))).toEqual(["n", "a"]);
  });

  it("returns the same list when the kudos is already there", () => {
    const items = [card("a")];
    expect(prependKudos(items, card("a"))).toBe(items);
  });
});

describe("mergeFreshHead", () => {
  it("puts kudos missed while disconnected on top, in feed order", () => {
    expect(ids(mergeFreshHead([card("a"), card("b")], [card("y"), card("x"), card("a")]))).toEqual(["y", "x", "a", "b"]);
  });

  it("returns the same list when nothing is new", () => {
    const items = [card("a")];
    expect(mergeFreshHead(items, [card("a")])).toBe(items);
  });
});
