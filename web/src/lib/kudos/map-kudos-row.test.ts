import { describe, expect, it } from "vitest";
import { mapKudosRow, type KudosFeedRow } from "./map-kudos-row";

const baseRow: KudosFeedRow = {
  id: "k1",
  created_at: "2026-10-30T03:00:00Z",
  content: "Thanks",
  title: null,
  is_anonymous: false,
  anonymous_name: null,
  is_mine: false,
  sender_id: "s1",
  sender: { id: "s1", full_name: "Alice", avatar_url: "a.png", department_code: "CEVC2", kudos_received_count: 12 },
  recipient_id: "r1",
  recipient: { id: "r1", full_name: "Bob", avatar_url: null, department_code: null, kudos_received_count: 3 },
  recipient_department_id: null,
  hashtags: [{ id: "h1", name: "GO FAST" }, { bad: true }],
  hashtag_ids: ["h1"],
  image_paths: ["s1/a.png"],
  like_count: 4,
  liked_by_me: true,
};

describe("mapKudosRow", () => {
  it("maps a named kudos", () => {
    const card = mapKudosRow(baseRow);
    expect(card.sender).toEqual({
      id: "s1",
      fullName: "Alice",
      avatarUrl: "a.png",
      departmentCode: "CEVC2",
      kudosReceivedCount: 12,
    });
    expect(card.recipient.fullName).toBe("Bob");
    expect(card.hashtags).toEqual([{ id: "h1", name: "GO FAST" }]);
    expect(card.imagePaths).toEqual(["s1/a.png"]);
    expect(card.likeCount).toBe(4);
    expect(card.likedByMe).toBe(true);
    expect(card.isMine).toBe(false);
  });

  it("keeps the sender hidden for a masked anonymous kudos", () => {
    const card = mapKudosRow({
      ...baseRow,
      is_anonymous: true,
      anonymous_name: "A fan",
      sender_id: null,
      sender: null,
    });
    expect(card.sender).toBeNull();
    expect(card.anonymousName).toBe("A fan");
  });

  it("falls back to safe defaults for null aggregates", () => {
    const card = mapKudosRow({
      ...baseRow,
      recipient: null,
      hashtags: null,
      image_paths: null,
      like_count: null,
      liked_by_me: null,
      is_mine: null,
    });
    expect(card.recipient).toEqual({
      id: "r1",
      fullName: null,
      avatarUrl: null,
      departmentCode: null,
      kudosReceivedCount: 0,
    });
    expect(card.hashtags).toEqual([]);
    expect(card.imagePaths).toEqual([]);
    expect(card.likeCount).toBe(0);
    expect(card.likedByMe).toBe(false);
    expect(card.isMine).toBe(false);
  });
});
