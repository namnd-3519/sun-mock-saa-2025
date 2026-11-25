import { describe, expect, it } from "vitest";
import { parseProfileBox, profileBoxHref } from "./parse-profile-box";
import { badgeCollection } from "./profile-badge-collection";

describe("parseProfileBox", () => {
  it("defaults to received and accepts sent", () => {
    expect(parseProfileBox({})).toBe("received");
    expect(parseProfileBox({ box: "sent" })).toBe("sent");
    expect(parseProfileBox({ box: ["sent", "received"] })).toBe("sent");
    expect(parseProfileBox({ box: "other" })).toBe("received");
  });

  it("builds the dropdown links", () => {
    expect(profileBoxHref("received")).toBe("/profile");
    expect(profileBoxHref("sent")).toBe("/profile?box=sent");
  });
});

describe("badgeCollection", () => {
  it("lists all six badges in enum order, gray until opened", () => {
    const slots = badgeCollection(["revival", "stay_gold", "stay_gold"]);
    expect(slots).toHaveLength(6);
    expect(slots.map((slot) => slot.badge)).toEqual([
      "stay_gold",
      "flow_to_horizon",
      "beyond_the_boundary",
      "root_further",
      "touch_of_light",
      "revival",
    ]);
    expect(slots.filter((slot) => slot.collected).map((slot) => slot.badge)).toEqual(["stay_gold", "revival"]);
  });

  it("is all gray without opened boxes", () => {
    expect(badgeCollection([]).every((slot) => !slot.collected)).toBe(true);
  });
});
