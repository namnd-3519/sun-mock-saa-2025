/** Events that change the floating action button between collapsed and expanded. */
export type FabEvent = "toggle" | "cancel" | "escape" | "outside" | "navigate";

/** Collapsed (false, MoMorph _hphd32jN2) ↔ expanded (true, MoMorph Sv7DFwBw1h). */
export function fabReducer(open: boolean, event: FabEvent): boolean {
  return event === "toggle" ? !open : false;
}
