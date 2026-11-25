# Worker spec template

Copy this into `<scratchpad>/orchestrate/task-<ID>.md`, fill every `<...>`, and pass it with
`--spec-file`. The spec is the worker's only context: keep it self-contained.

---

You are an Orca worker implementing ONE Task Master task in the SAA 2025 repo, fully autonomously.
Nobody will answer questions except through the HITL exit below.

Task: #<ID> — <TITLE>
Description: <DESCRIPTION>
Details: <DETAILS>
Test strategy: <TEST_STRATEGY>
Flow: <simple | complex | ui-only | bug-fix>
Command(s), run in this order via the Skill tool:
<one of:
  simple:   /tkm:takumi <prompt>: <Screen URLs>
  complex:  /tkm:create-plan <prompt>: 1. <Screen>: <URL> ...   then   /tkm:takumi <plan-dir>/plan.md
  ui-only:  /tkm:momorph-implement-design <prompt>: <Screen URLs>
  bug-fix:  /tkm:fix-bug <bug description>: <Screen URL>>
Note: MoMorph is the only design source; no Figma MCP is configured, skip any Figma step.

Main checkout (holds `master`): <MAIN_REPO_PATH>
Your branch: the branch of your current worktree (based on `master`).
Dev server port for this worker: <PORT> (`pnpm dev --port <PORT>`; never use 3000).
Work context: <your worktree root>
Reports: <your worktree root>/.takumi/outputs/reports/
Plans: <your worktree root>/.takumi/outputs/plans/

## 1. Prepare the worktree

1. Read `CLAUDE.md`. The repo rules there apply to you (MoMorph-only design, 200-line files,
   Conventional Commits, no AI references in commit messages, secret scan before committing).
2. Untracked env files are missing in a new worktree. Symlink each one that exists in the main
   checkout and is missing here: `.env`, `.envrc`, `web/.env.local`
   (`ln -s <MAIN_REPO_PATH>/<file> <file>`). Never copy, print or commit their contents.
3. `cd web && pnpm install --frozen-lockfile`.
4. Supabase local is ONE shared instance (http://localhost:54321). Do not run `supabase stop`,
   `supabase db reset` or anything that wipes data. Apply new migrations with
   `supabase migration up` from `backend/`.

## 2. Implement

Run the command(s) above via the Skill tool, in order, and nothing else as an entry point.

- **complex only — plan review gate:** after `/tkm:create-plan` writes the plan, do not start
  `/tkm:takumi` yet. Send the coordinator an Orca `ask` whose body starts with
  `PLAN_REVIEW: <plan-dir>`, then end your turn. On `APPROVED`, run `/tkm:takumi <plan-dir>/plan.md`
  and let it execute every phase with its checkpoints. On `CHANGES:`, edit the plan files and ask
  again. If told to exit, report `BLOCKED_HITL` with the open points.
- **ui-only:** the skill's visual-contract loop is the test policy; add no backend or logic.
- **bug-fix:** keep the patch minimal; the related tests the skill reruns must be green.
- **Clarification gate / any question to the user:** do NOT stop. Pick the most reasonable option
  from the spec, the design and existing code, and record it in the plan's `clarifications.md` as
  `- Q: ... → A: ... (assumed by worker, not confirmed by user)`. Treat plan-approval prompts as
  approved.
- Do not push, open a PR or deploy.

## 3. HITL exit (only these cases)

Stop and report `BLOCKED_HITL` if, and only if, finishing needs:
- a secret, credential or external account you do not have (e.g. a real Google OAuth client,
  a Cloudflare account/token);
- a decision the spec contradicts itself on and no reasonable default exists;
- a manual action by a person (console setup, approval, physical device).

Before stopping: commit nothing to `master`; leave your branch as-is (commit WIP on it if useful).
Do not edit `tasks.json` status yourself — the orchestrator marks the task `blocked`.

## 4. Finish and merge into master

1. Green checks in `web/`: `pnpm typecheck`, `pnpm lint`, `pnpm test`, plus the test strategy.
   Never weaken an assertion or skip a red test. If you cannot get green, report `FAILED`.
2. Set task #<ID> `"status": "done"` in `.taskmaster/tasks/tasks.json` (edit the file directly;
   keep the schema). Commit the code and that status change in ONE Conventional Commit, staging
   named paths only. End the message with the attribution trailer the session gives you.
3. Take the merge lock (shared by every worker and the orchestrator):
   ```sh
   LOCK="$(git rev-parse --git-common-dir)/orchestrate-merge.lock"
   until mkdir "$LOCK" 2>/dev/null; do sleep 10; done
   ```
   Always remove it (`rmdir "$LOCK"`) when you finish this step, also on failure.
4. Under the lock:
   - `git rebase master`. Resolve conflicts yourself. In `tasks.json`, keep every other task's
     status from `master` and only your task's `done`.
   - If the rebase changed anything, rerun `pnpm typecheck`, `pnpm lint`, `pnpm test`.
   - `git -C <MAIN_REPO_PATH> merge --ff-only <your-branch>`.
     If it refuses because the main checkout is dirty, release the lock, wait one minute and retry
     (at most 5 times); never stash or discard changes in the main checkout.
5. Release the lock.

## 5. Report

Report with `worker_done`. First line exactly one of:
`DONE`, `BLOCKED_HITL: <one-line reason>`, `FAILED: <one-line reason>`.
Then: merged commit SHA (DONE only), checks run with exit codes, assumptions recorded in
`clarifications.md`, follow-ups for other tasks.
