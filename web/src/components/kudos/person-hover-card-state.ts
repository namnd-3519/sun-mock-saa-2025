// Open/close rules of the avatar hover card (MoMorph Bf5XiTE7AO, Live board "Hover: mở preview profile").

/** Marks the element whose tap toggles the card on touch screens (the avatar link). */
export const HOVER_CARD_TRIGGER_ATTR = "data-hover-card-trigger";

export type HoverCardEvent =
  | "pointer-enter"
  | "pointer-leave"
  | "focus"
  | "blur"
  | "escape"
  | "tap"
  | "outside-press";

/** Next open state of the card after one user event. */
export function nextHoverCardOpen(open: boolean, event: HoverCardEvent): boolean {
  switch (event) {
    case "pointer-enter":
    case "focus":
      return true;
    case "tap":
      return !open;
    case "pointer-leave":
    case "blur":
    case "escape":
    case "outside-press":
      return false;
  }
}

/** Mouse hover opens the card; touch has no hover, so a tap on the avatar toggles it instead. */
export function isHoverPointer(pointerType: string): boolean {
  return pointerType === "mouse" || pointerType === "pen";
}
