import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { writeKudosEn as m } from "@/i18n/write-kudos-messages";
import { MessageEditor } from "./message-editor";

function Editor({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <MessageEditor id="msg" errorId="msg-error" value={value} invalid={false} maxLength={5000} messages={m} onChange={setValue} onBlur={() => undefined} />
  );
}

function renderEditor(initial: string) {
  render(<Editor initial={initial} />);
  return screen.getByRole("textbox", { name: m.messageLabel }) as HTMLTextAreaElement;
}

describe("MessageEditor", () => {
  it("wraps the selection in bold markers", async () => {
    const area = renderEditor("hello world");
    area.setSelectionRange(6, 11);
    await userEvent.click(screen.getByRole("button", { name: m.toolbar.bold }));
    expect(area).toHaveValue("hello **world**");
  });

  it("inserts a validated link from the Add link dialog", async () => {
    const area = renderEditor("see docs");
    area.setSelectionRange(4, 8);
    await userEvent.click(screen.getByRole("button", { name: m.toolbar.link }));
    const dialog = screen.getByRole("dialog", { name: m.addLink.heading });
    expect(screen.getByLabelText(m.addLink.text)).toHaveValue("docs");
    await userEvent.click(screen.getByRole("button", { name: m.addLink.save }));
    expect(dialog).toHaveTextContent(m.addLink.urlErrors.required);
    await userEvent.type(screen.getByLabelText(m.addLink.link), "ftp://x.io");
    await userEvent.click(screen.getByRole("button", { name: m.addLink.save }));
    expect(dialog).toHaveTextContent(m.addLink.urlErrors.invalid);
    await userEvent.clear(screen.getByLabelText(m.addLink.link));
    await userEvent.type(screen.getByLabelText(m.addLink.link), "https://x.io");
    await userEvent.click(screen.getByRole("button", { name: m.addLink.save }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(area).toHaveValue("see [docs](https://x.io)");
  });

  it("closes the Add link dialog on Cancel and Escape without changes", async () => {
    const area = renderEditor("text");
    await userEvent.click(screen.getByRole("button", { name: m.toolbar.link }));
    await userEvent.click(screen.getByRole("button", { name: m.addLink.cancel }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: m.toolbar.link }));
    const dialog = screen.getByRole("dialog");
    act(() => void dialog.dispatchEvent(new Event("cancel", { cancelable: true })));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(area).toHaveValue("text");
  });
});
