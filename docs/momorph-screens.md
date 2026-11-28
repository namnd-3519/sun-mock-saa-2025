# Link màn hình spec trên MoMorph

Project MoMorph: "SAA 2025 - Internal Live Coding" (`7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc`).

Link đầy đủ có dạng:

```
https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/<screen-id>
```

Chỉ liệt kê màn web (bỏ các frame `[iOS]`) và màn đã có spec (số item > 0). Tình trạng code ghi theo repo tại 2026-11-28 (28/28 task trong `.taskmaster/tasks/tasks.json` đã `done`).

## Theo hạng mục (feature list)

| Hạng mục | Giờ | Màn hình | Screen ID | Link | Code |
|---|---|---|---|---|---|
| Login | 3 | Login | `GzbNeVGJHz` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/GzbNeVGJHz | xong (`/login`, Google OAuth qua Supabase Auth, callback `/auth/callback`) |
| Homepage SAA | 3 | Homepage SAA | `i87tDx10uM` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/i87tDx10uM | xong (`/`, header/footer dùng chung) |
| Homepage SAA | 3 | Floating Action Button - phim nổi chức năng | `_hphd32jN2` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/_hphd32jN2 | xong (widget nổi trên `/`, thu gọn) |
| Homepage SAA | 3 | Floating Action Button - phim nổi chức năng 2 | `Sv7DFwBw1h` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/Sv7DFwBw1h | xong (mở rộng: `/rules`, `/kudos/new`, hủy) |
| Hệ thống giải | 3 | Hệ thống giải | `zFYDgyj_pD` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/zFYDgyj_pD | xong (`/awards`, anchor `#<slug>` từ thẻ giải ở homepage) |
| Countdown Prelaunch | 3 | Countdown - Prelaunch page | `8PJQswPZmU` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/8PJQswPZmU | xong (trước giờ `SAA_LAUNCH_AT` layout gốc hiện countdown cho mọi route; sau giờ đó `/countdown` chuyển về `/`) |
| Đa ngôn ngữ (VN/EN) | 3 | Dropdown-ngôn ngữ | `hUyaaugye2` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/hUyaaugye2 | xong (`LanguageSwitcher` ở header chung và header Login, cookie `NEXT_LOCALE`) |
| Sun* Kudos | 16 | Sun* Kudos - Live board | `MaZUn5xHXZ` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/MaZUn5xHXZ | xong (`/kudos`: feed realtime + infinite scroll, highlight, spotlight tĩnh, sidebar, like, bộ lọc, hover avatar, mở secret box) |
| Sun* Kudos | 16 | Profile bản thân | `3FoIx6ALVb` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/3FoIx6ALVb | xong (`/profile`: thông tin, bộ sưu tập icon, thống kê, Kudos đã nhận/đã gửi `?box=`; `/profile/{id}` của mình chuyển về `/profile`, người khác 404; nút mở hộp quà ở thẻ thống kê) |
| Sun* Kudos | 16 | Dropdown Hashtag filter | `JWpsISMAaM` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/JWpsISMAaM | xong (`/kudos`, `?hashtag=`, `FilterDropdown`) |
| Sun* Kudos | 16 | Dropdown Phòng ban | `WXK5AYB_rG` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/WXK5AYB_rG | xong (`/kudos`, `?department=`, `FilterDropdown`) |
| Sun* Kudos | 16 | Hover Avatar info user | `Bf5XiTE7AO` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/Bf5XiTE7AO | xong (preview profile khi hover/focus/tap avatar hoặc tên trên thẻ Kudos ở `/kudos` và `/profile`: avatar viền #FFEA9E, tên, phòng ban, hoa thị, số Kudos nhận; người gửi ẩn danh không có preview; link `/profile` chỉ cho chính mình) |
| Sun* Kudos | 16 | Open secret box - chưa mở | `J3-4YFIpMM` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/J3-4YFIpMM | xong (`OpenSecretBoxDialog`, mở từ sidebar `/kudos` và thẻ thống kê `/profile`) |
| Viết Kudos | 3 | Viết Kudo | `ihQ26W78P2` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/ihQ26W78P2 | xong (`/kudos/new`: người nhận, nội dung, hashtag, ảnh, ẩn danh; gửi qua RPC `create_kudos`) |
| Viết Kudos | 3 | Addlink Box | `OyDLDuSGEa` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/OyDLDuSGEa | xong (`AddLinkDialog` trong trình soạn nội dung của `/kudos/new`) |
| Viết Kudos | 3 | Dropdown list hashtag | `p9zO-c4a4x` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/p9zO-c4a4x | xong (`HashtagDropdown`, chọn nhiều, trong `/kudos/new`) |
| Like Kudos | 6 | (nằm trong Sun* Kudos - Live board) | `MaZUn5xHXZ` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/MaZUn5xHXZ | xong (`KudosHearts` trên `/kudos` và `/profile`: mỗi người một like, không tự like, ngày đặc biệt tính 2 tim, số like cập nhật realtime) |

## Màn phụ (ngoài feature list, có spec)

| Màn hình | Screen ID | Link | Code |
|---|---|---|---|
| Dropdown-profile | `z4sCl3_Qtk` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/z4sCl3_Qtk | xong (`ProfileMenu` ở header: Profile, Đăng xuất) |
| Dropdown-profile Admin | `54rekaCHG1` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/54rekaCHG1 | xong (thêm mục Dashboard `/admin` cho admin; trang `/admin` chưa có) |
| Thể lệ UPDATE | `b1Filzi9i6` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/b1Filzi9i6 | xong (`/rules`) |
| C_Filter | `7zur22HAsh` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/7zur22HAsh | xong (xem ghi chú bên dưới) |
| Tất cả thông báo | `6-1LRz3vqr` | https://app.momorph.ai/p/7e7f6eb3-f873-523b-9b5f-7ce50dc41fbc/screens/6-1LRz3vqr | xong (`/notifications` và panel thông báo ở header) |

C_Filter (`7zur22HAsh`) là thanh bộ lọc của Live board (nút Hashtag + Phòng ban), không phải bộ lọc riêng: dùng chung `KudosFilterButtons` → `HashtagFilter` / `DepartmentFilter` → `FilterDropdown` (`web/src/components/kudos/`). Frame không có design data trên MoMorph; giá trị hiển thị lấy theo JWpsISMAaM và WXK5AYB_rG. Không dùng cho form Viết Kudo (`HashtagDropdown`, chọn nhiều).

Cập nhật danh sách bằng MCP `list_screens` khi MoMorph có màn mới.
