# Fellow. — Path to Pilot (v1)

Written 2026-09-16. This is the single plan for getting from today's state to a closed pilot with real users. It supersedes `docs/ROADMAP.md` for sequencing purposes until the pilot ships; `ROADMAP.md` remains the historical task ledger.

**Partially unblocked (2026-09-17):** the artist-to-artist connection/collab layer ("Connect", `docs/ROADMAP.md` Phase P6) was parked pending dedicated research. The owner has now explicitly unblocked one narrow slice of it ahead of that research — opt-in discoverable public profiles, a search/filter directory screen, and a private one-directional follow — via `AGENTS.md` rule 10 (amended by Task 06, Task 10) and `docs/tasks/TASK_10_discover_connect_backend.md` / `TASK_11_discover_connect_frontend.md`. See `docs/DECISIONS.md` for the exact scope and its boundaries. **Everything else in Connect stays parked**: messaging/DM, a public follower count, an activity feed, algorithmic match recommendations, peer calls, intros/say-hi, and digest. No agent should start design or implementation work on any of those until a research task file exists and is approved, or a task explicitly names the addition.

**Pivoted to Israel-only, mobile-first (2026-09-18):** after discovering [ArtConnect](https://www.artconnect.com) is a large, established competitor running a very similar "opportunities + profile + discover" product at global scale, the owner narrowed this pilot's geography to **Israel only** (Tel Aviv, Haifa, Jerusalem, plus any additional Israeli cities the Researcher confirms have real, verifiable art/culture activity) and broadened the content the app surfaces beyond open-calls into "what's happening in the city" (workshops, lectures, masterclasses, courses, performances, theatre, dance, layered onto the minimal events UI Task 06 already unblocked). Differentiation is on curation quality and Israel-specific depth, not breadth. **Mobile (~375–390px) is the primary target for every screen, not a secondary check.** English-only UI is now a decided, permanent choice despite the Israel-only geography. ArtConnect is authorized as a UI/interaction-structure reference only (tabs, filters, search-then-detail flow) — never its copy, brand mark, or colors; Fellow.'s locked accent (`#B39DFF`), typography, and copy voice stay as-is. Full detail in `docs/DECISIONS.md`, "Task 12 — Israel-only pilot pivot and content-scope broadening." This **supersedes** the five-city selection (Tel Aviv, Tokyo, Berlin, Vienna, Brussels) referenced in Phase 2 below and in `docs/HANDOFF_V3.md` Part G step 5. Two new task files came out of this pivot: `docs/tasks/TASK_13_event_type_vocab_gap_check.md` (Backend/Data Engineer) and `docs/tasks/TASK_14_sources_directory.md` (Frontend Engineer, depends on Task 09 and a ux-ui-designer spec).

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

- Grow verified `opportunities` (status `live`) from 13 toward the ≥60 target, focused on **Israel only** as of 2026-09-18 (Tel Aviv, Haifa, Jerusalem, plus any additional Israeli cities the Researcher confirms — see the pivot note above and `docs/DECISIONS.md`, "Task 12"). This supersedes the prior 5-city selection (Tel Aviv, Tokyo, Berlin, Vienna, Brussels, chosen 2026-09-17 for deepest cross-validated research per `docs/RESEARCH_source_aggregators.md`/`docs/RESEARCH_trip_radar_sources.md`) — existing non-Israel rows are not deleted (`AGENTS.md` rule 6), sourcing effort simply redirects. Also grow verified `events` content beyond opportunities per the broadened content scope, pending Task 13's vocab gap check landing in the Sheet. `docs/OWNER_TASKS.md` steps 4e/4f/5.
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
- **Source recurrence + directory** (`docs/tasks/TASK_08_source_recurrence_migration.md`, `TASK_09_source_detail_page.md`, `TASK_14_sources_directory.md`) — not started. Additive schema + a new `/sources/[id]` page + a new `/sources` search directory (added 2026-09-18, modeled structurally on ArtConnect's institution-search pattern per the pivot above); low risk, doesn't touch pilot-critical paths. Task 14 depends on Task 09 and a ux-ui-designer spec.
- **Discover/Connect v1** (`docs/tasks/TASK_10_discover_connect_backend.md`, `TASK_11_discover_connect_frontend.md`) — not started, owner-authorized ahead of the broader Connect research (see the note at the top of this file and `docs/DECISIONS.md`). Task 11 additionally depends on a ux-ui-designer screen spec landing first, and its city filter's end-to-end verification depends on the Researcher's confirmed Israel city list.
- **Event-type vocab gap check** (`docs/tasks/TASK_13_event_type_vocab_gap_check.md`) — not started. Confirms which of the owner's broadened content categories (workshops, lectures, masterclasses, courses, performances, theatre, dance) are already covered by the live `event_type` vocab and documents the Sheet rows needed for any genuinely missing ones. Data-only, no frontend change needed once landed.
