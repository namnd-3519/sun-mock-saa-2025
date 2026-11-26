// Demo data for the SAA 2025 walkthrough, LOCAL Supabase only.
// Run from web/: node scripts/demo/seed-demo-data.mts [--reset | --send-live | --session]
//   (no flag)   wipe demo data, then seed users, kudos, likes and secret boxes
//   --reset     wipe demo data only
//   --send-live one new kudos from a colleague to the presenter (realtime step)
//   --session   print the presenter's session cookies as JSON (for the browser)
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "saa-demo-2025";
const DOMAIN = "demo.example.test";

const USERS = [
  ["presenter", "Nguyễn Minh Anh", "CTO"],
  ["huong", "Trần Thu Hương", "SPD"],
  ["khoa", "Lê Đăng Khoa", "CEVC1"],
  ["linh", "Phạm Thùy Linh", "CEVC1 - DSV - UI/UX 1"],
  ["tuan", "Võ Quốc Tuấn", "STVC - R&D"],
  ["mai", "Đỗ Phương Mai", "OPDC - HRF"],
  ["bao", "Hoàng Gia Bảo", "CEVC2"],
  ["thao", "Bùi Thanh Thảo", "FCOV"],
] as const;
type UserKey = (typeof USERS)[number][0];

type KudosSeed = [from: UserKey, to: UserKey, hoursAgo: number, tags: string[], title: string, content: string, anon?: string];

const KUDOS: KudosSeed[] = [
  ["huong", "presenter", 2, ["GO FAST", "Dedicated"], "Cứu cả sprint", "Cảm ơn Minh Anh đã thức khuya fix bug thanh toán trước giờ release. Không có bạn chắc team phải lùi lịch!"],
  ["khoa", "linh", 5, ["Inspiring", "THINK OUTSIDE THE BOX"], "Design quá đỉnh", "Bộ design system mới của Linh giúp team dev code nhanh gấp đôi. Màu đẹp, spacing chuẩn chỉnh."],
  ["mai", "tuan", 9, ["Be A Team"], "Người anh tận tâm", "Anh Tuấn luôn sẵn sàng pair với các bạn mới, giải thích kiên nhẫn từng dòng code."],
  ["tuan", "presenter", 14, ["High-performing"], "Review code tận tình", "Mỗi PR Minh Anh review đều có góp ý rất chi tiết, học được nhiều thứ."],
  ["linh", "bao", 20, ["BE OPTIMISTIC", "WASSHOI"], "Năng lượng tích cực", "Bảo lúc nào cũng vui vẻ, cả team đang mệt cũng thấy có động lực hơn."],
  ["thao", "mai", 26, ["BE PROFESSIONAL"], "Onboarding siêu mượt", "Cảm ơn chị Mai đã chuẩn bị quy trình onboarding rõ ràng cho 5 bạn mới tháng này."],
  ["bao", "khoa", 31, ["GET RISKY", "GO FAST"], "Dám thử công nghệ mới", "Khoa mạnh dạn đề xuất chuyển sang Next 16 và làm POC chỉ trong 2 ngày."],
  ["presenter", "huong", 38, ["Dedicated"], "PM có tâm", "Hương luôn bảo vệ team trước các yêu cầu gấp, sắp xếp scope rất hợp lý."],
  ["khoa", "presenter", 47, ["Be A Team", "Inspiring"], "Mentor tuyệt vời", "Cảm ơn Minh Anh đã hướng dẫn mình setup Supabase local, giờ đã tự tin hơn nhiều.", "Một người bạn"],
  ["huong", "thao", 55, ["BE PROFESSIONAL", "Dedicated"], "Số liệu luôn chính xác", "Báo cáo tài chính quý của Thảo rõ ràng, đúng hạn, không sai một con số."],
  ["linh", "presenter", 66, ["THINK OUTSIDE THE BOX"], "Ý tưởng sáng tạo", "Ý tưởng làm Secret Box cho SAA của Minh Anh khiến cả công ty háo hức."],
  ["tuan", "khoa", 74, ["High-performing"], "Hiệu năng tăng vọt", "Khoa tối ưu query giảm thời gian tải trang từ 3s xuống 400ms."],
  ["mai", "linh", 83, ["WASSHOI", "BE OPTIMISTIC"], "Linh hồn của team", "Linh tổ chức buổi team building cuối tuần vui hết nấc."],
  ["bao", "tuan", 95, ["GO FAST"], "Hỗ trợ thần tốc", "Anh Tuấn xử lý sự cố production lúc 2h sáng chỉ trong 15 phút."],
  ["thao", "bao", 108, ["Be A Team"], "Luôn sẵn lòng giúp đỡ", "Bảo giúp phòng tài chính tự động hóa file Excel, tiết kiệm cả ngày công mỗi tháng."],
];

const LIVE_KUDOS: KudosSeed = ["mai", "presenter", 0, ["WASSHOI", "Inspiring"], "Demo SAA quá xuất sắc", "Vừa xem demo Sun* Kudos của Minh Anh, giao diện đẹp và mượt quá!"];

const emailOf = (key: UserKey) => `${key}@${DOMAIN}`;

function localEnv() {
  if (existsSync(".env.local")) process.loadEnvFile(".env.local");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
  if (!["localhost", "127.0.0.1"].includes(new URL(url).hostname)) {
    throw new Error(`Demo seed refuses non-local Supabase URL: ${url}`);
  }
  const status = execFileSync("supabase", ["status", "-o", "env"], { cwd: "../backend", encoding: "utf8" });
  const serviceRoleKey = status.match(/^SERVICE_ROLE_KEY="?([^"\n]+)"?$/m)?.[1] ?? "";
  if (!serviceRoleKey) throw new Error("No service role key: run `supabase start` in backend/");
  return { url, publishableKey, serviceRoleKey };
}

const env = localEnv();
const admin = createClient(env.url, env.serviceRoleKey, { auth: { persistSession: false } });

function check<T>(what: string, res: { data: T | null; error: { message: string } | null }): NonNullable<T> {
  if (res.error) throw new Error(`${what}: ${res.error.message}`);
  return res.data as NonNullable<T>;
}

async function demoUserIds(): Promise<Map<UserKey, string>> {
  const { users } = check<{ users: { id: string; email?: string }[] }>("listUsers", await admin.auth.admin.listUsers({ perPage: 1000 }));
  const ids = new Map<UserKey, string>();
  for (const [key] of USERS) {
    const id = users.find((u) => u.email === emailOf(key))?.id;
    if (id) ids.set(key, id);
  }
  return ids;
}

async function upsertUsers(): Promise<Map<UserKey, string>> {
  const existing = await demoUserIds();
  const depts = check("departments", await admin.from("departments").select("id, code"));
  for (const [key, fullName, dept] of USERS) {
    const attrs = { password: PASSWORD, email_confirm: true, user_metadata: { full_name: fullName } };
    let id = existing.get(key);
    if (id) check<unknown>(`update ${key}`, await admin.auth.admin.updateUserById(id, attrs));
    else id = check<{ user: { id: string } | null }>(`create ${key}`, await admin.auth.admin.createUser({ email: emailOf(key), ...attrs })).user!.id;
    existing.set(key, id);
    const department_id = depts.find((d) => d.code === dept)?.id ?? null;
    check(`profile ${key}`, await admin.from("profiles").upsert({ id, email: emailOf(key), full_name: fullName, department_id }));
  }
  return existing;
}

async function wipe(ids: Map<UserKey, string>): Promise<void> {
  const list = [...ids.values()];
  if (list.length === 0) return;
  const inList = `(${list.join(",")})`;
  check("kudos", await admin.from("kudos").delete().or(`sender_id.in.${inList},recipient_id.in.${inList}`));
  check("likes", await admin.from("kudos_likes").delete().in("user_id", list));
  check("notifications", await admin.from("notifications").delete().in("recipient_id", list));
  check("secret boxes", await admin.from("secret_boxes").delete().in("owner_id", list));
}

async function insertKudos(ids: Map<UserKey, string>, seed: KudosSeed): Promise<string> {
  const [from, to, hoursAgo, tags, title, content, anon] = seed;
  const created_at = new Date(Date.now() - hoursAgo * 3_600_000).toISOString();
  const row = {
    sender_id: ids.get(from)!, recipient_id: ids.get(to)!, title, content, created_at,
    is_anonymous: Boolean(anon), anonymous_name: anon ?? null,
  };
  const { id } = check("kudos", await admin.from("kudos").insert(row).select("id").single());
  const hashtags = check("hashtags", await admin.from("hashtags").select("id, name").in("name", tags));
  check("kudos_hashtags", await admin.from("kudos_hashtags").insert(hashtags.map((h) => ({ kudos_id: id, hashtag_id: h.id }))));
  return id;
}

async function seed(): Promise<void> {
  const ids = await upsertUsers();
  await wipe(ids);
  const keys = USERS.map(([k]) => k);
  for (const [i, k] of [...KUDOS].reverse().entries()) {
    const kudosId = await insertKudos(ids, k);
    const likers = keys.filter((u) => u !== k[0] && u !== "presenter").slice(0, (i * 3) % 7);
    if (likers.length) {
      check("likes", await admin.from("kudos_likes").insert(likers.map((u) => ({ kudos_id: kudosId, user_id: ids.get(u)! }))));
    }
  }
  const owner_id = ids.get("presenter")!;
  check("secret boxes", await admin.from("secret_boxes").insert([
    { owner_id, badge: "stay_gold", opened_at: new Date(Date.now() - 86_400_000).toISOString() },
    { owner_id }, { owner_id },
  ]));
  console.log(`Seeded ${USERS.length} users, ${KUDOS.length} kudos, 3 secret boxes (2 unopened). Presenter: ${emailOf("presenter")}`);
}

async function sessionCookies(): Promise<void> {
  const jar = new Map<string, string>();
  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: (cookies) => cookies.forEach(({ name, value }) => (value ? jar.set(name, value) : jar.delete(name))),
    },
  });
  const { error } = await supabase.auth.signInWithPassword({ email: emailOf("presenter"), password: PASSWORD });
  if (error) throw new Error(`sign-in: ${error.message}`);
  console.log(JSON.stringify([...jar].map(([name, value]) => ({ name, value, domain: "localhost", path: "/" }))));
}

const flag = process.argv[2];
if (flag === "--reset") await wipe(await demoUserIds());
else if (flag === "--send-live") await insertKudos(await demoUserIds(), LIVE_KUDOS);
else if (flag === "--session") await sessionCookies();
else await seed();
