# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Sun* internal "Agentic Coding Hands-on" exercise (template: `sun-asterisk-internal/agentic-coding-hands-on`): build the system for the **SAA 2025** event by generating code from the design on **MoMorph v2 + Claude Code + Takumi**. Design project: "SAA 2025 - Internal Live Coding" on MoMorph. Screen specs for every screen are already prepared on MoMorph (https://app.momorph.ai); do not recreate them. Screen spec on MoMorph is the source of truth for generated code. **Design comes from MoMorph only; Figma is not used and no Figma MCP is configured.**

Scope (feature list, estimate in hours): Login 3, Homepage SAA 3, Hệ thống giải 3, Countdown Prelaunch 3, Đa ngôn ngữ (VN/EN) 3, Sun* Kudos 16, Viết Kudos 3, Like Kudos 6 (total 40). Platform: **web** (the web/desktop frames on MoMorph, not the `[iOS]` ones).

No git commits yet (branch `master`; PR target branch is `main`). The only app is `web/` (Next.js 16 App Router + React 19 + TypeScript + Tailwind 4, pnpm, i18n by hand in `web/src/i18n/`, locale cookie `NEXT_LOCALE`). Run from `web/`: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (vitest, unit only; there is no `@playwright/test` runner). Next 16 has breaking changes: read `web/node_modules/next/dist/docs/` before writing Next code. No backend yet.

Suggested (not mandated) next steps: Supabase (database, auth, realtime; runs locally via Docker) as backend for Google OAuth and Kudos; Cloudflare Workers via OpenNext (https://opennext.js.org/cloudflare) for deploy.

Keep everything in a **single git repo**, one folder per part, so the agent sees docs, backend and clients in one session. Only create folders for the platforms actually chosen:

```
docs/  backend/  web/  ios/  android/
```

## MCP servers (`.mcp.json`, mirrored in `.codex/config.toml`)

| Server | Use |
|---|---|
| `momorph` (HTTP, `https://app.momorph.ai/mcp`) | Screen specs, frame/node data, screen items. Auth: `Authorization: Bearer ${MOMORPH_API_KEY}`. |
| `playwright` (`npx @playwright/mcp@latest`) | Browser automation / visual verification. Only the `tkm:ui-verifier` agent should drive it. |
| `task-master-ai` (stdio, `npx -y task-master-ai@0.43.1`) | Task creation and tracking. AI features disabled, see "Task management". |

- `MOMORPH_API_KEY` comes from the untracked `.env` / `.envrc`; never print or commit them.
- Keep `.mcp.json` and `.codex/config.toml` in sync when adding or removing a server.
- Screen ids come from `list_screens` (`screenId`, 10 characters, also accepted as `screen` by the spec and frame tools). Visual values come from MoMorph `list_frame_styles` (CSS per node), `get_frame_overview` and `download_screen_spec`; never guess colors, spacing or typography.
- MoMorph holds no image, icon or media files and frame styles may be a V1 import not re-synced with Figma; rebuild simple icons as SVG, keep a CSS fallback for photos, and leave a slot for the real file.

## Task management (Task Master MCP)

Tasks and progress live in **`.taskmaster/tasks/tasks.json`, committed to git** (one task per MoMorph screen plus remaining work: Supabase, OAuth, Kudos data model, deploy). Use the `task-master-ai` MCP tools to read and change it; do not track work in ad-hoc TODO files.

- **AI features are off.** `.mcp.json` sets `TASK_MASTER_TOOLS` to an explicit allowlist of 22 non-AI tools (`get_tasks`, `next_task`, `get_task`, `set_task_status`, `add_task`, `add_subtask`, `remove_*`, `move_task`, dependency and tag tools, `generate`, `initialize_project`). `parse_prd`, `expand_*`, `update*`, `analyze_project_complexity`, `research`, `scope_*` are not exposed. No provider API keys are configured; do not add them. Keep the allowlist when upgrading the package version.
- Create tasks **manually**: pass `title`, `description`, `details`, `testStrategy`, `priority`, `dependencies` to `add_task`; never pass `prompt` or `research`. To change an existing task's text, edit `tasks.json` directly (keep the schema), then run `generate`.
- Workflow: `next_task` → `set_task_status in-progress` → implement via the matching `/tkm:*` command (each task's `details` names it and the MoMorph URL) → `set_task_status done` **in the same commit** as the code, so the file is the version-controlled progress record.
- Never commit `.taskmaster/state.json` or `.taskmaster/reports/` (git-ignored, per-user). Commit `tasks.json` and `config.json` only. Resolve merge conflicts in `tasks.json` by hand and keep task ids stable; run `validate_dependencies` afterwards.
- New MoMorph screens (`list_screens`) get a new task; keep `docs/momorph-screens.md` in step.

## Takumi (`/tkm`) harness

- `.claude/skills/tkm` and `.claude/rules/tkm` are symlinks into `~/.takumi/installs/...` and are git-ignored (managed block in `.gitignore`); do not edit through them. `.takumi/kit.json` lists installed kits (`core`, `extras`, `sun-extras`; roles analyst/designer/engineer/qa). Reinstall or repair with `tkm install`.
- `.claude/settings.json`, `.codex/hooks.json`, `.claude/skills/tkm-hooks` and `.agents/skills/tkm-hooks` are kit-managed guardrails. The harness blocks agent edits to them; ask the user to change them outside the session.
- Entry points: `/tkm:takumi` (implement), `/tkm:create-plan`, `/tkm:fix-bug`, `/tkm:review-code`, `/tkm:run-tests`, `/tkm:ship`, `/tkm:help` (skill catalog). Prefer these over ad-hoc multi-step work.
- Outputs go under `.takumi/outputs/` (plans, reports, journals, handoffs, artifacts) and are git-ignored; plan folders are named `{YYMMDD-HHmm}-{GH-issue}-{slug}`. Notes later sessions need go in `.takumi/memory/` (committed).
- Do not use the `Workflow` tool unless the user says "workflow"; orchestrate with subagents instead.

## Choosing the entry command

Pass MoMorph Screen URLs (copied from app.momorph.ai) straight into the command. Mention "use Supabase local project" when backend is needed.

| Goal | Command |
|---|---|
| Simple/medium feature, no plan review (one command, one PR) | `/tkm:takumi <screen URLs>` |
| Complex feature (new subsystem, many screens, core infra): plan first, review, then execute per phase | `/tkm:create-plan <screen URLs>` then `/tkm:takumi <plan>/plan.md` |
| UI only, no backend or logic (exact MoMorph frame styles, mock data from design, visual validation loop) | `/tkm:momorph-implement-design <screen URLs>` |
| Bug on an existing screen (diffs code against design + spec, minimal patch, reruns related tests) | `/tkm:fix-bug <description> <screen URL>` |

Setup prerequisites (Takumi CLI `>= 26.11.1-r.1`, check with `tkm --version`; install via `tkm auth login` then `tkm init -g`; MoMorph API key `mka_...` created on app.momorph.ai) are one-time and not repo-specific.

## MoMorph UI tasks

Triggered by a `https://momorph.ai/files/{fileKey}/screens/{screenId}` or `https://app.momorph.ai/p/{project}/page/{page}/node/{node}` URL, explicit `fileKey`/`screenId`, or the word "momorph". The flow (full contract: `.claude/skills/tkm/skills/momorph-implement-design/references/momorph-workflow.md`):

1. Requires the extras kit (`momorph-implement-design` skill + `momorph-ui-implementer` agent). If missing, stop and tell the user to run `tkm install`. Never route this work to the generic `implementer`.
2. **Clarification gate first**: fetch `download_screen_spec(screen, "csv")`, `get_frame_overview` and `list_frame_styles`, read every spec row, list gaps (errors, navigation, loading/empty, validation, responsive, a11y), ask the user, and record answers as `- Q: ... → A: ...` lines in `clarifications.md`. Do not re-ask resolved decisions.
3. Pick exactly one test policy: `visual-contract` (default, static UI, no RED/GREEN claim) or `e2e-red-first` (behavioral screens; needs an existing `@playwright/test` runner, web only; do not scaffold one).
4. Track A (presentational UI, `momorph-ui-implementer`, one per screen) and Track B (behavior/backend, generic `implementer`, RED-first) run in parallel after the gate. `ui-verifier` owns browser evidence and E2E; `tester` owns compile/lint/unit checks.

## Conventions that apply here

- Kebab-case, self-describing file names; keep code files under 200 lines.
- Conventional Commits, no AI references in messages (the session attribution reminder still governs trailers).
- Tests run before push; never skip a red test or weaken an assertion to get green.
- Reply to the user in their language (Vietnamese); code, subagent prompts and agent-only files stay in English.
