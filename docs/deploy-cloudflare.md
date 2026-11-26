# Deploy web lên Cloudflare Workers (OpenNext)

App `web/` (Next 16) được build bằng [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare)
thành một Worker. Repo chỉ chứa cấu hình; **không** commit `account_id`, URL hay key nào.
Mọi lệnh dưới đây chạy từ `web/`.

## File liên quan

| File | Vai trò |
|---|---|
| `wrangler.jsonc` | Tên worker `saa-2025-web`, `nodejs_compat`, assets, self-reference service, binding `IMAGES` |
| `open-next.config.ts` | Incremental cache = static assets (read-only, không cần R2/KV) |
| `.dev.vars.example` | Mẫu biến runtime cho preview local; copy thành `.dev.vars` (git-ignored) |
| `package.json` | `cf:build`, `cf:preview`, `cf:deploy`, `cf-typegen` |

Dùng `pnpm cf:deploy`, **không** dùng `pnpm deploy` (đó là lệnh có sẵn của pnpm, làm việc khác).

## Biến môi trường

| Biến | Khi nào được đọc | Đặt ở đâu khi deploy |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Inline lúc **build** (client + server + proxy) | Env của shell build hoặc `web/.env.production.local` (git-ignored) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Inline lúc **build** | Như trên. Key này public theo thiết kế; dữ liệu được RLS bảo vệ |
| `SAA_LAUNCH_AT` | Runtime, mỗi request (`process.env`) | Wrangler **var** (dashboard hoặc `--var`), không phải secret |
| `SAA_EVENT_AT` | Runtime, mỗi request | Wrangler var |

`SAA_*` là ISO-8601 có offset, ví dụ `2025-12-26T18:30:00+07:00`. Thiếu hoặc sai định dạng thì
`SAA_LAUNCH_AT` tắt cổng countdown; `SAA_EVENT_AT` lấy theo `SAA_LAUNCH_AT`, thiếu nốt thì dùng mặc định 26/12/2025 18:30 (+07:00). Ngày hiển thị cạnh "Thời gian" trên trang chủ lấy từ chính mốc này.
Đổi giá trị var có hiệu lực ngay ở request kế tiếp, không cần build lại (đã kiểm tra trên preview).

> **Cảnh báo:** Next đọc `.env.local` khi build. Nếu `web/.env.local` trỏ về Supabase local
> (`http://localhost:54321`) thì URL đó bị inline vào bundle. **Không bao giờ deploy bản build đó.**
> Khi build để deploy, đặt giá trị hosted trong `web/.env.production.local` (file này được ưu tiên
> hơn `.env.local` khi build production) hoặc export trong shell, rồi kiểm tra lại trước khi deploy.

## Các bước một người phải làm (một lần)

1. **Supabase hosted.** Tạo project trên supabase.com. Từ `backend/`:
   `supabase link --project-ref <project-ref>` rồi `supabase db push` để đẩy migrations.
   Lấy Project URL và publishable key trong Settings → API.
2. **Google OAuth.** Trong Google Cloud Console (OAuth client loại Web application) thêm
   authorized redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`.
   Trong Supabase → Authentication → Providers → Google: bật, điền client id/secret.
3. **Supabase Auth URL.** Authentication → URL Configuration:
   - Site URL: `https://saa-2025-web.<subdomain>.workers.dev` (hoặc custom domain).
   - Additional redirect URLs: `https://saa-2025-web.<subdomain>.workers.dev/**`
     (app quay về `/auth/callback` trên domain của worker).
4. **Cloudflare.** `pnpm wrangler login` (hoặc `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
   trong env của shell/CI, không ghi vào repo). Bật Cloudflare Images cho account để
   `next/image` được tối ưu qua binding `IMAGES`. Không muốn dùng Images: xoá khối `images` trong
   `wrangler.jsonc` và đặt `images: { unoptimized: true }` trong `next.config.ts`.
5. **Env build.** Tạo `web/.env.production.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key>
   ```

## Deploy

```sh
pnpm install --frozen-lockfile
pnpm cf:deploy                      # opennextjs-cloudflare build && deploy
```

Đặt var runtime (không lưu trong repo): Cloudflare dashboard → Workers → `saa-2025-web` →
Settings → Variables (kiểu Text), hoặc truyền khi deploy:
`pnpm exec opennextjs-cloudflare deploy -- --var SAA_LAUNCH_AT:2025-12-20T09:00:00+07:00`.
Lưu ý: var đặt trên dashboard có thể bị ghi đè ở lần `wrangler deploy` sau nếu không có
`--keep-vars`; dùng `--keep-vars` hoặc luôn truyền `--var` khi deploy.

Smoke test trên URL đã deploy:
- `/login` trả 200, nút đăng nhập Google chuyển sang `<project-ref>.supabase.co`.
- Chưa đăng nhập: `/` và `/kudos` chuyển 307 về `/login` (`/login?next=%2Fkudos`).
- Đăng nhập Google xong quay về Homepage.

Rollback: `pnpm wrangler rollback` (chọn version trước), hoặc `pnpm wrangler deployments list`.

## Preview local (workerd, không cần tài khoản Cloudflare)

```sh
cp .dev.vars.example .dev.vars      # chỉnh SAA_* nếu cần
pnpm cf:preview                     # build + wrangler dev tại http://localhost:8787
```

Preview dùng `.env.local` (Supabase local) cho biến build-time. Wrangler không tự nạp lại
`.dev.vars`: sửa xong thì dừng và chạy lại `pnpm exec opennextjs-cloudflare preview` (không cần build lại).
`pnpm cf-typegen` sinh `cloudflare-env.d.ts` (git-ignored) khi code cần đọc binding Cloudflare.

## Giới hạn đã biết

- OpenNext báo Node.js proxy (`src/proxy.ts`) trên Cloudflare là "experimental"; trên preview
  proxy chạy đúng (redirect đăng nhập, `/auth/callback?error=x` → `/login?error=oauth`).
- OpenNext báo Cache Components "chưa hỗ trợ đầy đủ". Vì vậy **không** bật
  `enableCacheInterception` trong `open-next.config.ts`: khi bật, worker trả shell PPR rỗng
  (200, body trống) thay vì render trang.
- `redirect()` trong trang dynamic (ví dụ `/countdown` sau giờ launch) được stream thành redirect
  phía client với HTTP 200, giống `next start`.
