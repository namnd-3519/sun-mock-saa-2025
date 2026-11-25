// Toolbar C (bold, italic, strike, numbered list, link, quote) for the plain-text kudos message.
// The board renders content as text, so formatting is stored as Markdown-style markers.
export type MessageFormat = "bold" | "italic" | "strike" | "numbered" | "link" | "quote";

export type FormattedText = { value: string; start: number; end: number };

const INLINE_MARKERS: Partial<Record<MessageFormat, string>> = { bold: "**", italic: "_", strike: "~~" };
const LINK_URL = "https://";

function prefixLines(value: string, start: number, end: number, format: MessageFormat): FormattedText {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", end);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  const block = value
    .slice(lineStart, lineEnd)
    .split("\n")
    .map((line, index) => (format === "numbered" ? `${index + 1}. ` : "> ") + line)
    .join("\n");
  return {
    value: value.slice(0, lineStart) + block + value.slice(lineEnd),
    start: lineStart,
    end: lineStart + block.length,
  };
}

/** Applies a toolbar format to the [start, end) selection and returns the new text and selection. */
export function applyMessageFormat(value: string, start: number, end: number, format: MessageFormat): FormattedText {
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);

  const marker = INLINE_MARKERS[format];
  if (marker) {
    return { value: before + marker + selected + marker + after, start: start + marker.length, end: end + marker.length };
  }
  if (format === "link") {
    const urlStart = start + selected.length + 3; // "[" + text + "]("
    return { value: `${before}[${selected}](${LINK_URL})${after}`, start: urlStart, end: urlStart + LINK_URL.length };
  }
  return prefixLines(value, start, end, format);
}
