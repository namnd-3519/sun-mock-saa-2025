import { describe, expect, it, vi } from "vitest";
import { createServerCookieAdapter } from "./server-cookie-adapter";

function fakeStore(initial: Record<string, string> = {}) {
  const jar = new Map(Object.entries(initial));
  return {
    jar,
    getAll: () => [...jar].map(([name, value]) => ({ name, value })),
    set: vi.fn((name: string, value: string) => {
      jar.set(name, value);
    }),
  };
}

describe("createServerCookieAdapter", () => {
  it("exposes every request cookie", () => {
    const adapter = createServerCookieAdapter(fakeStore({ a: "1", b: "2" }));
    expect(adapter.getAll()).toEqual([
      { name: "a", value: "1" },
      { name: "b", value: "2" },
    ]);
  });

  it("writes each cookie with its options", () => {
    const store = fakeStore();
    const adapter = createServerCookieAdapter(store);
    adapter.setAll(
      [
        { name: "sb-at", value: "x", options: { path: "/", httpOnly: true } },
        { name: "sb-rt", value: "y", options: {} },
      ],
      {},
    );
    expect(store.set).toHaveBeenNthCalledWith(1, "sb-at", "x", {
      path: "/",
      httpOnly: true,
    });
    expect(store.set).toHaveBeenNthCalledWith(2, "sb-rt", "y", {});
    expect(store.jar.get("sb-rt")).toBe("y");
  });

  it("ignores the write error Server Components raise", () => {
    const store = fakeStore();
    store.set.mockImplementation(() => {
      throw new Error("Cookies can only be modified in a Server Action");
    });
    const adapter = createServerCookieAdapter(store);
    expect(() =>
      adapter.setAll([{ name: "sb-at", value: "x", options: {} }], {}),
    ).not.toThrow();
  });

  it("does nothing for an empty batch", () => {
    const store = fakeStore();
    createServerCookieAdapter(store).setAll([], {});
    expect(store.set).not.toHaveBeenCalled();
  });
});
