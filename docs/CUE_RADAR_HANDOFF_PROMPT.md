# Cue Radar — Handoff prompt for a new Claude chat

Paste this whole file as the first message of a new chat. Then paste the link to whatever PR or question you have.

---

## Who I am and how to work with me

אני רועי (roipadan1-design), הבעלים של Cue Radar. אני לא מתכנת. אני עובד עם **Jules** (הסוכן של גוגל) שמבצע משימות קוד ופותח PRs, ואיתך (Claude) כמנהל הפרויקט וכמבקר הקוד.

איך לענות לי:
- עברית, פשוט וברור, בלי ז'רגון. אם צריך פקודות — שורה שורה.
- **כל תשובה מסתיימת ב"מה עכשיו"** — רשימה ממוספרת של הפעולות הבאות לפי סדר.
- כשאני שולח לינק ל-PR: תשכפל את הענף (`git clone --branch ...`), תריץ את בדיקות ה-grep של המשימה, תקרא את הקוד, ותחזיר: מה חוסם / מה סוטה מהמפרט / מה בסדר, ואז **פרומפט מוכן להדבקה לג'ולס** כתגובה ב-PR. הדף של GitHub דרך fetch לפעמים מוצג מהמטמון — הענף ב-git הוא האמת.
- אני מעדיף שג'ולס יעשה עבודה, לא אני. תכתוב לי פרומפטים ומשימות מלאות, לא רשימות "תעשה את זה ואת זה".
- כשאני לא מבין משהו — תסביר מחדש, פשוט יותר.

## The product (one paragraph)

Cue Radar: a mobile-first feed of verified open calls, residencies and grants for independent dance / performance / sound artists in Europe and the Mediterranean. Register: a museum wall label — precise, quiet, curated. Dark. No yellow (hard rule). Later phases: profiles, a pipeline for applications, Trip Radar (events by city and dates), an agent that proposes rows to a staging sheet, Connect.

## Repo and where the truth lives

`https://github.com/roipadan1-design/Cue-Radar` — Next.js 15 App Router, Tailwind v4, Supabase (not wired yet), Python sync script from a Google Sheet.

| File | What |
|---|---|
| `AGENTS.md` | rules for every coding agent (no fabricated data, no silent fallbacks, colors only via CSS vars, no new deps, no deferred features, **rule 10: no yellow**) |
| `docs/HANDOFF_V3.md` | architecture, routes, schema, "never" list |
| `docs/CUE_RADAR_Product_Plan_v2.md` | vision and phases P1–P7 (Hebrew) |
| `docs/ROADMAP.md` | index of all phases and tasks 01–18, status table, what was reconstructed |
| `docs/tasks/TASK_01_*.md`, `TASK_02_*.md` | the task specs |
| `docs/DECISIONS.md`, `docs/OWNER_TASKS.md` | agent judgment calls; things only I can do |
| `data/seed/*.csv` | vocab, markets, sources, opportunities_staging (16 draft rows) |

Rule: **no task goes to Jules before its task file is committed to `docs/tasks/`.** The chat is not a source of truth (I lost a whole plan once because of incognito).

## Working method

One task file → one Jules task → one PR titled `Task NN: <name>` → Claude reviews → I paste Claude's fix comment on the PR → Jules pushes commits to the same branch → CI green → I click Merge. `main` is protected; everything goes through a PR. Jules sometimes fails with "error when preparing the virtual machine" — retry, or paste the comment on the PR in GitHub instead of the Jules chat; small fixes I can do myself in the GitHub web editor.

## What happened so far (chronological)

**Before this chat**
- Phase 1 scaffold (Next.js, migrations `supabase/migrations/0001_core.sql`, seed CSVs, sync script) — merged.
- Task 01 (cleanup and foundation, PR #3) — merged. Tokens named, neutral shell, CI workflow.
- v0 prototype in `new design_ux_ui/` (deleted in Task 01) had the brand lockup `[間 CUE RADAR]` and my own profile content. Recoverable via `git show 80791f6:"new design_ux_ui/app/page.tsx"`.

**This chat (15 Sep 2026)**
1. Claude reviewed PR #6 (Task 02: structure and typography). Found blocking issues: `/hub` rendered staging CSV as live data; literal counts "Saved · 3"; invented notes in preview; silent `return []` in `lib/seed.ts`; no screenshots; plus ~15 spec deviations (GroupHeader not `<h2>`, Button inside Link, Sheet radius/transition, MobileNav tap targets, Field label association, etc.).
2. Jules fixed everything across three commits (`7636628`, `6d7de82`, `0fb32ef`). Claude verified on the branch: all greps empty, all items done.
3. **PR #6 merged into main** (`7783077`). Task 02 is complete.
4. Found that two old PRs of mine were still open: #5 (AGENTS.md rule 10 "No yellow") → to be merged; #4 (CI yellow check + stale globals.css edit) → to be closed, the CI step gets re-added in a later task.
5. Claude wrote `docs/ROADMAP.md` (all phases, tasks 01–18, what was lost). I committed it to branch `roipadan1-design-patch-4` — a PR still needs to be opened and merged from it.
6. `docs/tasks/TASK_02_structure_and_typography.md` still needs to be added to the repo (I have the text).
7. Local dev works: `C:\Users\ROI\Cue-Radar`, `git pull` then `npm run dev`, http://localhost:3000. Phone view: F12 → Ctrl+Shift+M → 390px, or open the Network URL on my phone.
8. My verdict after seeing the app: **too basic.** No mark, no color, no imagery, everything the same weight. The "N" circle at the bottom is Next.js dev tools, not our app.
9. Decisions I made: bring back the `間` mark; the name may still change (keep `Cue Radar` in one file `lib/brand.ts`); auth = Google + Apple + email/password with a sign-up page (Apple needs a $99/yr developer account — owner task); use my own real profile from the v0 prototype as the demo profile.
10. Claude wrote **`docs/tasks/TASK_03_brand_profile_and_depth.md`** (saved separately — must be committed). Scope: `lib/brand.ts`, `Mark`/`Wordmark` components with `間` (Noto Sans JP subset), `app/icon.svg`, landing mark fade, accent switcher in `/dev/preview` with candidates A `#5EC8FF` sky / B `#3DDC97` mint / C `#B39DFF` lavender (Jules asks on the PR, I answer one letter, Jules sets `--accent`), `data/seed/profile_demo.json` with my profile, `/dev/preview/profile` with profile layout v2 (big name 36/48px, status lines, facts grid, selected works, 2×2 image slots), Hub hero (`{n} open deadlines`), detail trust line, `/signin` + `/signup` UI only (disabled), `lib/schemas/auth.ts`.

## Current status

| Task | Status |
|---|---|
| 01 Cleanup and foundation | merged (#3) |
| 02 Structure and typography | merged (#6) |
| 03 Brand, profile and depth | spec written, not yet in repo, not yet sent to Jules |
| 05 Seed and sync alignment | draft scope in ROADMAP §3, task file not written |
| 04 Supabase + auth (Google, Apple, email) | after 03 and 05; I must first create the Supabase project per OWNER_TASKS |
| 06+ | see ROADMAP |

Open housekeeping: merge PR #5, close PR #4, open+merge the ROADMAP PR from `roipadan1-design-patch-4`, add TASK_02 and TASK_03 files to `docs/tasks/`.

## Design decisions that supersede HANDOFF_V3 (from Task 02 — keep enforcing)

Fonts Archivo 800 (display, uppercase) + Manrope (body); no monospace. Tokens `#0A0A0A / #111111 / line #1F1F1F / line-strong #2E2E2E / fg #F2F2F2 / muted #8C8C8C / urgent #E5484D`; accent = fg until Task 03 picks one; radius 2px. Dividers, not boxes. One accent element per screen. Routes: `/` landing, `/hub` feed, `/saved` pipeline, `/signin`, `/profile/edit`, `/a/[handle]`, `/opportunities/[slug]`, `/dev/preview`. Row: title → source · city → funding → deadline text (red only under 7 days). Groups: Closing this week / This month / Later / Rolling. Motion: none except row hover 120ms and sheet 200ms (Task 03 adds one mark fade). Tap targets ≥ 44px, group headers `<h2>`, row titles `<h3>`.

## Open questions I still owe

- New product name (3–5 directions I like → Claude analyzes).
- Accent A / B / C after Task 03 preview.
- Detailed design notes on the profile page after seeing `/dev/preview/profile` on my phone (image position, name size, block order) → becomes Task 03b.
- Product plan §8: English-only v1? peer-call moderation? say-hi quota? trip visibility default?

## What now (when I return)

1. Finish housekeeping: merge #5, close #4, PR+merge ROADMAP, add `TASK_02` and `TASK_03` to `docs/tasks/`.
2. Send Task 03 to Jules (paste the whole task file as a new task).
3. Answer Jules's accent question on the PR.
4. Send Claude the PR link for review.
5. Meanwhile: pick name directions; open the Supabase project (OWNER_TASKS).
6. Then Task 05 (Claude writes the file), then Task 04.
