# Task 14 — Sources directory (`/sources` search screen)

Repository: `roipadan1-design/Cue-Radar`, base branch `main`. Owner department: **Frontend Engineer**. Read `AGENTS.md`, `docs/HANDOFF_V3.md`, `docs/tasks/TASK_09_source_detail_page.md`, `docs/design/SOURCE_DETAIL_SPEC.md`, `docs/DECISIONS.md` ("Task 12 — Israel-only pilot pivot and content-scope broadening," §4) first. Work on branch `task/sources-directory`, open **one PR** titled `Task 14: Sources directory` against `main`.

---

## 0. Why this task exists, and why it's new (not folded into Task 09)

The owner's Israel-only pilot pivot (`docs/DECISIONS.md`, Task 12) asks Fellow. to follow [ArtConnect](https://www.artconnect.com)'s "institution search + institution info page" pattern: a searchable directory of institutions, each linking to a page with a few lines about it. Task 09/`docs/design/SOURCE_DETAIL_SPEC.md` already built the **info-page half** of that pattern (`/sources/[id]`) but explicitly does not build a directory — see `docs/design/SOURCE_DETAIL_SPEC.md` §2, line naming the back-link problem: *"No such index page exists (per Task 09, `/sources` is not a route being built)."* Confirmed directly against the codebase before writing this task: there is no `app/sources/` route of any kind yet (`/sources/[id]` from Task 09 is itself still unbuilt), and no directory/search concept for sources exists in any design doc. **This is genuinely new scope**, not an oversight in Task 09 — it is scoped as its own task file, on its own branch, because it is a distinct screen (search + filter + result list) with its own ux-ui-designer dependency, not a small addition to a detail-page task that's already waiting on Task 08.

---

## 1. Hard dependencies — both required before this can be built and verified end to end

1. **Task 09** (`docs/tasks/TASK_09_source_detail_page.md`) merged — this directory's result rows link to `/sources/{source_id}`, which Task 09 builds. If Task 09 hasn't merged when this task starts, build the directory query and layout anyway, but link rows to `/sources/{source_id}` knowing it 404s until Task 09 lands, and say so explicitly in the PR.
2. **A ux-ui-designer screen spec**, specifically studying ArtConnect's institution-search-plus-result-list pattern (tabs, filter placement, card/row anatomy) and adapting it — mobile-first (~375–390px) — for Fellow. If no such spec exists in `docs/design/` when this task starts, **stop and report** rather than inventing a layout, same rule as Task 11 §"Hard dependencies" — reuse the Hub's existing filter-panel and row patterns (`components/hub/FilterBar.tsx`, `components/ui/Sheet.tsx`) as a structural placeholder only if explicitly told to proceed without the spec.

## 2. The structural-copy-vs-brand-copy line (read this before designing or building anything)

Per `docs/DECISIONS.md` Task 12 §4, ArtConnect is authorized as a reference for **UI/interaction structure only** — its tab divisions, its filter mechanics, its search-then-detail flow, its card/list layout. It is **not** authorized as a reference for actual copy/wording, its logo/brand mark, its specific illustrations/icons, or its color palette/fonts. Concretely for this task: a ux-ui-designer may look at how ArtConnect lays out its institution search results (e.g. a filter bar plus a list/grid of result cards, each opening a detail page) and produce a spec Frontend implements with Fellow.'s own accent (`#B39DFF`), typography (Archivo/Manrope per `app/globals.css`), copy voice, and iconography. Do not port ArtConnect's actual field labels, section headers, or marketing language into this screen.

## 3. Scope, exactly (no more)

- One new route: `app/sources/page.tsx` — server component for the initial fetch, client component for interactive filtering, following the same split already used in `app/hub/page.tsx` + `components/hub/FilterBar.tsx`.
- Search: a text input, placeholder `Search institutions`, submitting to `?q=` and filtering server-side against `sources.name` (Supabase `.ilike`), no client-side fuzzy library.
- Filters: **city** (from the `markets` table, mirrored to `?city=`) and **discipline** (from `vocab` where `category = 'discipline'` and `deprecated = false`, array-contains against `sources.discipline_focus`, mirrored to `?discipline=`). Zero hard-coded option lists, per `AGENTS.md` rule 4. Reuse the Hub's filter-panel interaction pattern unless the ux-ui-designer spec says otherwise.
- Each result row/card: source `name` (links to `/sources/{source_id}`), `city_name`, discipline chips resolved from `vocab` labels, `Demo` tag when `is_demo` (same neutral, non-accent chip styling Task 07 §3 uses on Hub rows). Do **not** invent a `source_type` vocab label if the `vocab` table has no `source_type` category live at build time — render the raw `source_type` column value as plain text in that case (this is a pre-existing gap inherited from Task 09/`SOURCE_DETAIL_SPEC.md`'s own assumption that a `source_type` vocab category exists; this task does not attempt to resolve or paper over it, only avoids compounding it with an invented label).
- Only `sources` where `status = 'active'` are shown (matches the existing convention that `dormant`/`closed` sources aren't surfaced as live listings elsewhere in the app — check `app/hub/page.tsx`'s existing query for the exact status filter it already applies via `hub_feed` and mirror the same posture; if `hub_feed` doesn't expose a `sources`-level status filter directly, query `sources` with `status = 'active'` explicitly).
- Empty states: no sources exist at all → a quiet message, not an error, matching the Hub's own "the feed is being curated" tone. No match on filters/search → a reset affordance, matching the Hub's existing empty-state pattern.
- Guests (signed out) can browse this directory — `sources` is already a read-only, publicly-readable curated table per `docs/HANDOFF_V3.md` Part D's RLS description, same visibility posture as the Hub itself.
- Link `/sources` from somewhere reachable (e.g. the Hub's nav or a "Browse institutions" link near the source name on an opportunity row/detail page) — exact placement is the ux-ui-designer spec's call; if the spec is silent on entry points, add a plain text link from `app/opportunities/[slug]/page.tsx`'s existing source-name area as the minimum viable entry point and say so in the PR.

## 4. What this task does not do

- Does not build organization/institution accounts, claiming, or editing — `sources` stays app-read-only per `AGENTS.md` rule 5; nothing here writes to it.
- Does not add a `source_type` vocab category — that gap (if confirmed real) belongs to whoever owns Task 09's spec assumption, not this task.
- Does not change `/sources/[id]` (Task 09's page) beyond what's needed for the directory to link into it correctly.
- Does not touch `supabase/migrations/` — no schema change is needed for this screen.
- Does not build a parallel directory for `profiles` (that's Discover, Task 11 — a different table, already scoped, already unblocked under a separate `AGENTS.md` rule-10 amendment). Do not merge or cross-link the two directories' filter logic beyond what's structurally identical by coincidence (reusing `FilterBar`/`Sheet` components is fine; sharing a route or a combined query is not in scope).

---

## 5. Order of work

1. Confirm both dependencies (§1). If either is missing, stop and report exactly what's missing rather than guessing.
2. Build `app/sources/page.tsx` and its filter/search component (§3).
3. Wire at least one entry point into `/sources` (§3, last bullet).
4. Verification (§6).

---

## 6. Verification (paste raw output in the PR — prose is not proof)

```bash
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts
ls app/sources/page.tsx
grep -n "status" app/sources/page.tsx
grep -rn "localStorage\|FALLBACK_\|: any" app/sources || echo OK_no_client_persistence
grep -rnE "#[0-9A-Fa-f]{6}" app/sources --include=*.tsx || echo OK_no_hex
grep -rn "artconnect\|ArtConnect" app/sources components || echo OK_no_competitor_string_in_code
grep -n "/sources" components/hub/OpportunityDetailView.tsx app/hub/page.tsx components/layout/*.tsx
```

Manual checklist at 390px (attach screenshots): `/sources` with no filters (result list/grid, no fabricated `source_type` labels), `/sources?city=tel_aviv&discipline=dance` filtered correctly, search for a known institution name, no-match empty state with reset, a result linking correctly into `/sources/{id}`, signed-out browsing works identically to signed-in.

---

## 7. Do not

- Do not invent the directory's visual layout ahead of the ux-ui-designer's ArtConnect-pattern spec — reuse existing Hub patterns structurally only, and flag in the PR if no spec existed when this was built.
- Do not port ArtConnect's actual copy, brand mark, icons, or color palette — structure only, per §2.
- Do not add a `source_type` vocab category or otherwise touch `supabase/migrations/`.
- Do not build institution accounts, claiming, or write access to `sources`.
- Do not add new npm dependencies.
