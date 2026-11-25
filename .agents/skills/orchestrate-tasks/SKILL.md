---
name: orchestrate-tasks
description: >-
  Drain the Task Master backlog with up to 3 parallel Orca workers (Codex Opus 5.5, medium effort),
  each in its own worktree running one task through the Takumi flow that fits it (simple
  /tkm:takumi, complex /tkm:create-plan then /tkm:takumi plan, ui-only
  /tkm:momorph-implement-design, bug-fix /tkm:fix-bug) and fast-forwarding master when green.
  Picks ready tasks by priority, then by how many tasks they unblock; parks human-in-the-loop tasks
  as blocked and moves on. Use when the user says "orchestrate tasks", "run the backlog",
  "work through the remaining tasks in parallel" or invokes /orchestrate-tasks.
---

# Orchestrate tasks

You are the coordinator. You never implement a task yourself: you pick tasks, start Orca workers,
keep `tasks.json` status honest on `master`, and report. Talk to the user in Vietnamese; worker
specs stay in English.

Arguments (optional): `--slots N` (default 3), `--only 4,5` (restrict to these task ids),
`--dry-run` (print the pick and stop).

## 0. Preflight (stop and tell the user if any fails)

1. Load the Orca guide once: run `orca skills get orchestration` (resolve the executable as the
   `orchestration` skill says) and follow it for every Orca command below.
2. Run from the main checkout on `master` with a clean tree (`git status --porcelain` empty).
   The main checkout must stay clean for the whole run: workers fast-forward into it.
3. `orca status --json` shows the app running; `orca repo list --json` contains this repo.
4. Task Master MCP tools respond (`get_tasks`). If not, edit `tasks.json` directly.
5. If `.git/orchestrate-merge.lock` exists and no worker of this run is alive, remove it.

## 1. Pick

```sh
node .Codex/skills/orchestrate-tasks/scripts/pick-ready-tasks.cjs --slots <N>
```

The script reads `.taskmaster/tasks/tasks.json` and returns `picked`: `pending` tasks whose
dependencies are all `done`, ranked by priority (high > medium > low), then by how many open tasks
depend on them transitively, then by id. It counts `in-progress` tasks against the slots and lets at
most one backend-touching task (Supabase, OAuth, data model, API, deploy) run at a time because the
local Supabase instance is shared. Apply `--only` on top of its output. Do not override its ranking
by feel; if you think it is wrong, tell the user.

`picked` empty and nothing in flight → go to step 5.

## 2. Mark in-progress (under the merge lock)

For each picked task, under the same lock the workers use:

```sh
LOCK="$(git rev-parse --git-common-dir)/orchestrate-merge.lock"
until mkdir "$LOCK" 2>/dev/null; do sleep 10; done
# set_task_status <id> in-progress (or edit tasks.json), then:
git add .taskmaster/tasks/tasks.json && git commit -m "chore(tasks): start #<id> <short title>"
rmdir "$LOCK"
```

Batch all tasks of one pick into one commit. Never leave edits uncommitted in the main checkout.

## 3. Classify, then start workers

Read `get_task <id>` and put each picked task in exactly one flow. Record the flow and a one-line
reason in the run report.

| Flow | When | Worker runs |
|---|---|---|
| `simple` | Clear scope, minutes to 1–2 days, no plan review needed; UI plus light logic on existing infra | `/tkm:takumi <prompt> <Screen URLs>` |
| `complex` | New subsystem, several interacting screens, or logic touching core infrastructure (auth, data model, shared API, realtime, deploy); multi-day | `/tkm:create-plan <prompt> <Screen URLs>` → plan review by you → `/tkm:takumi <plan-dir>/plan.md` |
| `ui-only` | Pure presentation from the design: no backend, no business logic, mock data from the design | `/tkm:momorph-implement-design <prompt> <Screen URLs>` |
| `bug-fix` | Existing screen code is wrong: UI, logic, validation, or drifted from an updated spec/design | `/tkm:fix-bug <bug description> <Screen URL>` |

Unsure between `simple` and `complex` → `complex`. Unsure whether `ui-only` → `simple`. Write the
prompt as one English sentence naming the feature and route (e.g. "Implement the login page
(/login)"); append ", use Supabase local project" when the task needs the backend. For a
multi-screen `complex` task, list the screens numbered (`1. <name>: <URL>`).

For each picked task write a spec from `references/worker-spec-template.md` to
`<scratchpad>/orchestrate/task-<id>.md` with the flow and exact command(s) filled in. Take the
MoMorph URL(s) from the task's `details`. Give each concurrent worker a distinct dev port: 3001,
3002, 3003 (reuse a port once its worker settles).

Start them in one shell command (the guide's `references/parallel-start.md` form), one per task:

```sh
orca orchestration worker-start --environment local --spec-file <spec> \
  --worktree new-child --name task-<id>-<slug> --base-branch master \
  --agent Codex --model Codex-opus-5-5 --effort medium \
  --task-title "#<id> <title>"
```

Record `task id → dispatch id, worktree, port` in
`.takumi/outputs/reports/orchestrate-tasks-<YYMMDD-HHmm>.md` (create on first start; append after).
Then **end your turn**. Orca wakes you; never poll.

## 4. When a worker reports

Read the first line of its `worker_done`:

- **`DONE`** — verify, do not trust: `git log master --oneline -5` holds its commit and
  `get_task <id>` is `done`. If either is missing, treat as `FAILED`.
- **`BLOCKED_HITL: <reason>`** — under the lock: set the task to `blocked`, append
  `\n\nBLOCKED (HITL, <YYYY-MM-DD>): <reason>. Branch: <worker branch>.` to its `details`
  in `tasks.json`, commit `chore(tasks): block #<id> pending human input`.
  Tell the user right away in one short message (task, reason, what they need to do).
- **`FAILED: <reason>`** or an escalation that ends the worker — first failure: keep the task
  `in-progress` and start one fresh worker for it with `--retry-of` per the Orca guide (same port,
  spec plus a line naming the failure and the old branch). Second failure: mark it `blocked` with
  `BLOCKED (FAILED, <date>): <reason>` and tell the user.
- **`PLAN_REVIEW: <plan-dir>`** (a `question` from a `complex` worker) — read `plan.md` and every
  phase file against the task, its MoMorph spec (`download_screen_spec`) and the task's
  dependencies. Check: every spec item maps to a phase acceptance criterion; scope stays inside the
  task (no work owned by another task id); phases are ordered and testable; backend changes are
  migrations, not manual DB edits. `reply` with `APPROVED` or `CHANGES:` plus a numbered list.
  At most 2 review rounds; still not approvable → tell the worker to exit `BLOCKED_HITL` with the
  open points.
- Any other worker `question`: answer with `reply` when the task, `AGENTS.md` or this skill settles
  it; otherwise tell the worker to exit with `BLOCKED_HITL`.

Append the outcome to the run report, release the finished worker's worktree when Orca's receipt
says it is kept open, then go back to step 1 to fill the freed slot. Settle every wake that
arrives before re-picking.

## 5. Finish

Stop when the picker returns nothing and no worker is in flight. Report to the user in Vietnamese:

- done tasks with their commit SHAs;
- blocked tasks with the HITL reason and the action the user must take;
- pending tasks that cannot start because a dependency is blocked;
- assumptions workers recorded in `clarifications.md` that the user should confirm.

Never push, open a PR or deploy. Never mark a task `done` yourself.

## Rules

- Only the coordinator and workers touch `master`, always under `orchestrate-merge.lock`.
- Never delete a worker branch that has unmerged commits (blocked or failed work lives there).
- Never stash, reset or discard changes in the main checkout or a worker worktree.
- Do not use the `Workflow` tool; Orca workers are the parallelism here.
