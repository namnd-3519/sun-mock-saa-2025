# SAA 2025 – Web

Web app for the **SAA 2025** (Sun* Annual Awards) event, built for the Sun* internal *Agentic Coding Hands-on* exercise: code is generated from the design on **MoMorph** using **Claude Code + Takumi**.

## Status

| Feature | Status |
|---|---|
| Login screen (VN/EN language switcher, Google button) | UI done; Google OAuth not connected yet |
| Homepage SAA, Hệ thống giải, Countdown Prelaunch | Not started |
| Sun* Kudos, Viết Kudos, Like Kudos | Not started |

There is no backend yet. Planned: Supabase (database, auth, realtime) and Cloudflare Workers via OpenNext for deployment.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · pnpm · Vitest. Internationalization (VN/EN) is hand-rolled in `web/src/i18n/`, and the chosen language is stored in the `NEXT_LOCALE` cookie.

## Getting started

Prerequisites: Node.js 20+ and [pnpm](https://pnpm.io/installation).

```bash
cd web
pnpm install
pnpm dev        # http://localhost:3000 (redirects to /login)
```

Other scripts (run from `web/`):

| Command | Purpose |
|---|---|
| `pnpm build` / `pnpm start` | Production build / serve it |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check (`tsc --noEmit`) |
| `pnpm test` | Unit tests (Vitest) |

## Repository layout

```
web/        Next.js app (src/app, src/components, src/i18n)
docs/       Project documentation (placeholder)
.claude/    Claude Code config and Takumi skills/rules
.takumi/    Takumi kit config and agent outputs
.mcp.json   MCP servers: momorph, playwright
```

## Working with the design (MoMorph + Takumi)

Screen specs live on MoMorph and are the source of truth for the UI; the design is not taken from Figma.

1. Create a MoMorph API key (`mka_...`) at [app.momorph.ai](https://app.momorph.ai) and put it in an untracked `.env` as `MOMORPH_API_KEY` (never commit it).
2. Install the Takumi CLI (`tkm auth login`, then `tkm init -g`; version `>= 26.11.1-r.1`).
3. In Claude Code, pass MoMorph screen URLs to a Takumi command, e.g. `/tkm:takumi <screen URL>`. Use `/tkm:help` for the full list.

## Links

- Design project: "SAA 2025 - Internal Live Coding" on [MoMorph](https://app.momorph.ai)
- Exercise template: `sun-asterisk-internal/agentic-coding-hands-on`
- [Next.js docs](https://nextjs.org/docs) · [Tailwind CSS](https://tailwindcss.com/docs) · [Supabase](https://supabase.com/docs) · [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
- `CLAUDE.md` – conventions and agent workflow for this repo
