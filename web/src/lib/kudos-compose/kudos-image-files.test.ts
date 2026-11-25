import { describe, expect, it } from "vitest";
import { pickImageFiles } from "./kudos-image-files";

const file = (name: string, type = "image/png", size = 1000) => ({ name, type, size });

describe("pickImageFiles", () => {
  it("accepts allowed image types", () => {
    const files = [file("a.png"), file("b.jpg", "image/jpeg"), file("c.webp", "image/webp"), file("d.gif", "image/gif")];
    expect(pickImageFiles(0, files)).toEqual({ accepted: files, rejected: null });
  });

  it("rejects non-image and oversized files", () => {
    expect(pickImageFiles(0, [file("a.pdf", "application/pdf")])).toEqual({ accepted: [], rejected: "type" });
    expect(pickImageFiles(0, [file("a.png", "image/png", 5 * 1024 * 1024 + 1)])).toEqual({ accepted: [], rejected: "size" });
  });

  it("caps the total at 5 images", () => {
    const files = [file("a.png"), file("b.png"), file("c.png")];
    expect(pickImageFiles(3, files)).toEqual({ accepted: files.slice(0, 2), rejected: "count" });
    expect(pickImageFiles(5, [file("a.png")])).toEqual({ accepted: [], rejected: "count" });
  });

  it("keeps valid files while reporting the first rejection", () => {
    const good = file("a.png");
    expect(pickImageFiles(0, [file("x.txt", "text/plain"), good])).toEqual({ accepted: [good], rejected: "type" });
  });
});
