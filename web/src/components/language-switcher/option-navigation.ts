export type OptionAction =
  | { type: "focus"; index: number }
  | { type: "select"; index: number }
  | { type: "close" }
  | { type: "dismiss" };

/** Maps a key pressed on a listbox option to what the dropdown should do. */
export function getOptionAction(
  key: string,
  index: number,
  count: number,
): OptionAction | null {
  const last = count - 1;
  const focus = (next: number): OptionAction => ({
    type: "focus",
    index: Math.min(Math.max(next, 0), last),
  });
  switch (key) {
    case "ArrowDown":
      return focus(index + 1);
    case "ArrowUp":
      return focus(index - 1);
    case "Home":
      return focus(0);
    case "End":
      return focus(last);
    case "Enter":
    case " ":
      return { type: "select", index };
    case "Escape":
      return { type: "close" };
    case "Tab":
      return { type: "dismiss" };
    default:
      return null;
  }
}
