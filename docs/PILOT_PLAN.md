# Fellow. — Path to Pilot (v1)

Written 2026-09-16. This is the single plan for getting from today's state to a closed pilot with real users. It supersedes `docs/ROADMAP.md` for sequencing purposes until the pilot ships; `ROADMAP.md` remains the historical task ledger.

**Partially unblocked (2026-09-17):** the artist-to-artist connection/collab layer ("Connect", `docs/ROADMAP.md` Phase P6) was parked pending dedicated research. The owner has now explicitly unblocked one narrow slice of it ahead of that research — opt-in discoverable public profiles, a search/filter directory screen, and a private one-directional follow — via `AGENTS.md` rule 10 (amended by Task 06, Task 10) and `docs/tasks/TASK_10_discover_connect_backend.md` / `TASK_11_discover_connect_frontend.md`. See `docs/DECISIONS.md` for the exact scope and its boundaries. **Everything else in Connect stays parked**: messaging/DM, a public follower count, an activity feed, algorithmic match recommendations, peer calls, intros/say-hi, and digest. No agent should start design or implementation work on any of those until a research task file exists and is approved, or a task explicitly names the addition.

---

## Where we are today

- `main` (production, `cue-radar.vercel.app`) already has: real Supabase-backed Hub, auth, saved/pipeline, financial filters, Fit score, trust stamps, OG images (Tasks 01–03 + "Deliverables A–D", see `docs/DECISIONS.md`).
- `task/pilot-readiness` (local only, not pushed) is mid-flight on Task 06 (`docs/tasks/TASK_06_pilot_readiness.md`): auth hardening, demo-content seed, Hub chips/search/effort, nav rename + Trip Radar entry point. Several pieces of Task 06 are still missing (see Phase 1 below).
- Supabase project is fully connected (schema, real + demo data). Database has 314 real sources and 13 real opportunities as of the last sheet export; the rest of the Hub is filled with clearly-labeled demo content per Task 06's rules.

## Phase 1 — Finish Task 06 (current branch)

Goal: land the branch that's already in progress. Owner: Frontend Engineer, reviewed by QA.

- `app/radar/[city]/page.tsx` (the three-section city view — Task 06 §7.2, not yet built; only the `/radar` form page exists).
- `app/demo/page.tsx`, `app/privacy/page.tsx` (missing).
- `app/events/[id]/ics/route.ts` (missing).
- `/saved` page title still says "Pipeline" — must become "Saved calls" per spec (word "pipeline" stays in code only).
- Run the full verification block in Task 06 §10 and the 11-step manual mobile checklist; fix anything that fails.
- Update `docs/DECISIONS.md` / `docs/OWNER_TASKS.md` with anything discovered.
- Open the PR against `main`.

**Note (2026-09-17):** per `docs/DECISIONS.md`, most of the items above have since shipped (the three-section `/circuit` city view, `app/events/[id]/ics/route.ts`, and the "Saved calls" title all exist in code). Two Task 06 §8 items did **not** ship and are picked up by the new **Task 07** (`docs/tasks/TASK_07_brand_and_visual_polish.md`) instead of being re-added here: the footer still links to `docs/HANDOFF_V3.md` on GitHub, and the main-nav Profile link still sends signed-out users to the fictional demo profile instead of `/signin?next=/profile/edit`. Task 07 also covers the missing `Demo` tag on Hub rows and the "Circuit" → "Currently" UI rename, and folds in an end-to-end verification of `/signup` → `/profile/edit` → `is_public` → `/a/[handle]` now that the owner is registering as the first real user.

## Phase 2 — Real content

Goal: the Hub looks true, not just full. Owner: Researcher, with the owner doing final verification (per `AGENTS.md` — only `scripts/sync_sheet_to_supabase.py` writes curated tables, and a human must verify each `apply_url` before a row goes live).

- Grow verified `opportunities` (status `live`) from 13 toward the ≥60 target, focused on the 5 pilot cities the owner selected 2026-09-17: **Tel Aviv, Tokyo, Berlin, Vienna, Brussels** (chosen because these had the deepest cross-validated research — both institutions and event sources — of any candidates checked; see `docs/RESEARCH_source_aggregators.md` and `docs/RESEARCH_trip_radar_sources.md`) — `docs/OWNER_TASKS.md` step 5.
- Confirm the sync workflow (`sync.yml`) is green on a schedule and the sheet stays the single source of truth.
- Once real content is wide enough, plan the `NEXT_PUBLIC_SHOW_DEMO=false` flip (not before the pilot — demo content is what makes the feed look alive on day one).

## Phase 3 — Production settings sanity pass

Goal: nothing blocks a real signup. Owner: Backend/Data Engineer.

- Re-verify every item in `docs/OWNER_TASKS.md` Day-One Checklist is actually done in the Supabase and Vercel dashboards (Google provider, redirect URLs, confirm-email setting, env vars in both Vercel environments).
- `/api/health` returns healthy on production.

## Phase 4 — QA pass before inviting anyone

Goal: an artist on a phone doesn't hit a dead end. Owner: QA/Release.

- Full manual pass at 375–390px: sign up, browse, save, apply, sign out, sign back in with Google, radar, saved-calls status change.
- Accessibility spot check (contrast, tap targets, focus rings) per the numbers already logged in `docs/DECISIONS.md`.
- Confirm the feedback/report-a-problem mailto works and goes somewhere the owner actually reads.

## Phase 5 — Closed pilot launch

Goal: a small number of real artists use it and we learn something. Owner: the owner, supported by QA/Release for monitoring.

- Pick pilot city/cities and a short invite list.
- Decide the feedback loop (the mailto link is the v1 mechanism — good enough for a closed pilot).
- Watch `/api/health`, Supabase logs, and the feedback inbox for the first week.

---

## After the pilot (not scheduled yet)

Anything from `docs/ROADMAP.md` Phase P3 onward (profile v2, Trip Radar beyond v1, the agent-driven scanner, and most of Connect) gets scheduled from pilot feedback, not before.

**Exceptions, already scoped and not blocked on the pilot closing:**
- **Source recurrence** (`docs/tasks/TASK_08_source_recurrence_migration.md`, `TASK_09_source_detail_page.md`) — not started. Additive schema + a new `/sources/[id]` page; low risk, doesn't touch pilot-critical paths.
- **Discover/Connect v1** (`docs/tasks/TASK_10_discover_connect_backend.md`, `TASK_11_discover_connect_frontend.md`) — not started, owner-authorized ahead of the broader Connect research (see the note at the top of this file and `docs/DECISIONS.md`). Task 11 additionally depends on a ux-ui-designer screen spec landing first.
