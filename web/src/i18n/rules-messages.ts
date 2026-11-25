// Rules ("Thể lệ") copy (MoMorph screen b1Filzi9i6). Hero tier and badge names are brand names
// and stay in English; they live in components/rules/rules-badge-names.ts.
export const rulesVi = {
  title: "Thể lệ",
  receiverHeading: "NGƯỜI NHẬN KUDOS: HUY HIỆU HERO CHO NHỮNG ẢNH HƯỞNG TÍCH CỰC",
  receiverBody:
    "Dựa trên số lượng đồng đội gửi trao Kudos, bạn sẽ sở hữu Huy hiệu Hero tương ứng, được hiển thị trực tiếp cạnh tên profile",
  tiers: [
    {
      range: "Có 1-4 người gửi Kudos cho bạn",
      body: "Hành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.",
    },
    {
      range: "Có 5-9 người gửi Kudos cho bạn",
      body: "Hình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.",
    },
    {
      range: "Có 10–20 người gửi Kudos cho bạn",
      body: "Bạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến.",
    },
    {
      range: "Có hơn 20 người gửi Kudos cho bạn",
      body: "Bạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình.",
    },
  ],
  senderHeading: "NGƯỜI GỬI KUDOS: SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN",
  senderBody:
    "Mỗi lời Kudos bạn gửi sẽ được đăng tải trên hệ thống và nhận về những lượt ❤️ từ cộng đồng Sunner. Cứ mỗi 5 lượt ❤️, bạn sẽ được mở 1 Secret Box, với cơ hội nhận về một trong 6 icon độc quyền của SAA.",
  badgesLabel: "6 icon độc quyền của SAA",
  collectNote: "Những Sunner thu thập trọn bộ 6 icon sẽ nhận về một phần quà bí ẩn từ SAA 2025.",
  nationalHeading: "KUDOS QUỐC DÂN",
  nationalBody:
    "5 Kudos nhận về nhiều ❤️ nhất toàn Sun* sẽ chính thức trở thành Kudos Quốc Dân và được trao phần quà đặc biệt từ SAA 2025: Root Further.",
  close: "Đóng",
  writeKudos: "Viết KUDOS",
};

export type RulesMessages = typeof rulesVi;

export const rulesEn: RulesMessages = {
  title: "Rules",
  receiverHeading: "KUDOS RECEIVERS: HERO BADGES FOR POSITIVE IMPACT",
  receiverBody:
    "Based on how many teammates send you Kudos, you earn the matching Hero badge, shown right next to your profile name",
  tiers: [
    {
      range: "1-4 people sent you Kudos",
      body: "Your journey of spreading good things begins – the first thanks and recognition have found their way to you.",
    },
    {
      range: "5-9 people sent you Kudos",
      body: "Your image keeps growing in your teammates' hearts through your kindness and dedication.",
    },
    {
      range: "10–20 people sent you Kudos",
      body: "You have become a trusted and beloved figure, always ready to help and remembered by many teammates.",
    },
    {
      range: "More than 20 people sent you Kudos",
      body: "You have become a legend – someone who leaves an unforgettable mark on the team with heart and action.",
    },
  ],
  senderHeading: "KUDOS SENDERS: COLLECT ALL 6 ICONS, GET A MYSTERY GIFT",
  senderBody:
    "Every Kudos you send is posted on the system and collects ❤️ from the Sunner community. Every 5 ❤️ opens 1 Secret Box, with a chance to get one of 6 exclusive SAA icons.",
  badgesLabel: "6 exclusive SAA icons",
  collectNote: "Sunners who collect all 6 icons will receive a mystery gift from SAA 2025.",
  nationalHeading: "NATIONAL KUDOS",
  nationalBody:
    "The 5 Kudos with the most ❤️ across Sun* officially become National Kudos and receive a special gift from SAA 2025: Root Further.",
  close: "Close",
  writeKudos: "Write KUDOS",
};
