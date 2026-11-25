// UI strings of the own profile page (MoMorph 3FoIx6ALVb, vi authoritative).
export const profileVi = {
  avatarAlt: "Ảnh đại diện của {name}",
  badgesTitle: "Bộ sưu tập icon của tôi",
  badgeLocked: "Chưa mở được",
  openSecretBox: "Mở Secret Box",
  kudosTitle: "KUDOS",
  boxLabel: "Lọc Kudos",
  boxes: { received: "Đã nhận ({count})", sent: "Đã gửi ({count})" },
  empty: { received: "Bạn chưa nhận được Kudos nào.", sent: "Bạn chưa gửi Kudos nào." },
};

export type ProfileMessages = typeof profileVi;

export const profileEn: ProfileMessages = {
  avatarAlt: "{name}'s avatar",
  badgesTitle: "My icon collection",
  badgeLocked: "Not unlocked yet",
  openSecretBox: "Open Secret Box",
  kudosTitle: "KUDOS",
  boxLabel: "Filter Kudos",
  boxes: { received: "Received ({count})", sent: "Sent ({count})" },
  empty: { received: "You have not received any Kudos yet.", sent: "You have not sent any Kudos yet." },
};
