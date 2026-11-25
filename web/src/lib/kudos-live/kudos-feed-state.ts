import type { KudosCardView } from "./kudos-card-view";

/** Adds the next infinite-scroll page, skipping kudos already on screen. */
export function appendPage(items: KudosCardView[], page: KudosCardView[]): KudosCardView[] {
  const seen = new Set(items.map((item) => item.id));
  return [...items, ...page.filter((item) => !seen.has(item.id))];
}

/** Puts a freshly published kudos on top; unchanged list if it is already shown. */
export function prependKudos(items: KudosCardView[], card: KudosCardView): KudosCardView[] {
  return items.some((item) => item.id === card.id) ? items : [card, ...items];
}

/**
 * After (re)subscribing, the first page is refetched so kudos published while the channel was
 * down appear on top; kudos already shown keep their place.
 */
export function mergeFreshHead(items: KudosCardView[], head: KudosCardView[]): KudosCardView[] {
  const seen = new Set(items.map((item) => item.id));
  const fresh = head.filter((item) => !seen.has(item.id));
  return fresh.length ? [...fresh, ...items] : items;
}
