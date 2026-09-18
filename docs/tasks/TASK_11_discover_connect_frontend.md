# Task 11 — Discover/Connect v1: frontend (directory screen and Follow button)

Repository: `roipadan1-design/Cue-Radar`, base branch `main`. Owner department: **Frontend Engineer**. Read `AGENTS.md` (rule 10, amended by Task 06 and this initiative's Task 10), `docs/HANDOFF_V3.md`, `docs/CUE_RADAR_Product_Plan_v2.md` §5, `docs/tasks/TASK_10_discover_connect_backend.md`, `docs/DECISIONS.md` first.

**This task is authorized by the same AGENTS.md rule-10 amendment as Task 10** — do not re-litigate the scope decision here; if it seems too narrow or too wide, that's a `docs/DECISIONS.md` note under this task's number, not a silent change.

**Hard dependencies, both required before this can be verified end to end:**
1. Task 10's migration (`supabase/migrations/0006_follows.sql`) merged and applied to the live database.
2. A ux-ui-designer screen spec for the Discover directory layout. If no such spec exists in `docs/design/` (or wherever it's published) when this task starts, **stop and report** rather than inventing a layout — reuse the Hub's existing filter-panel and row patterns as a structural placeholder only if explicitly told to proceed without the spec.

**Third dependency, added by Task 12 (2026-09-18 Israel-only pilot pivot — see `docs/DECISIONS.md`):** the pilot's geographic scope narrowed from the prior multi-city list to Israel only. This does **not** change this task's code — the city filter already reads its options only from the `markets` table (zero hardcoded lists, per `AGENTS.md` rule 4), so no code edit is needed here. It **does** mean end-to-end verification against real Israeli cities is blocked until the Researcher confirms which Israeli cities (beyond Tel Aviv) have real, verifiable art/culture activity and the owner adds them to the Google Sheet's `markets` tab for the sync pipeline to pick up. If that hasn't landed yet when this task is built, verify the city filter mechanism against whatever `markets` rows exist live (it will still work correctly — the filter is data-driven, not city-specific) and say so explicitly in the PR rather than blocking on it.

Work on branch `task/discover-connect-frontend`, open **one PR** titled `Task 11: Discover/Connect v1 frontend` against `main`.

---

## 1. Scope, exactly (no more)

- A **Discover** screen: search + discipline/city filters over `profiles` where `is_public = true`.
- A **Follow / Following** button on `/a/[handle]`, signed-in only, never shown on the viewer's own profile.
- **No follower counts anywhere in the UI** — not on Discover, not on the profile page, not as a tooltip, not as an aria-label that leaks the number.
- No messaging, no activity feed, no match recommendations. If you find yourself building any of these to "complete" the feature, stop — they are still blocked.

## 2. Route

`app/discover/page.tsx` (server component for the initial fetch; client component for interactive filtering, following the same split already used in `app/hub/page.tsx` + `components/hub/FilterBar.tsx`).

- Query: `profiles` where `is_public = true`, optionally filtered by `discipline` (array-contains) and `current_city`. Reuse the Hub's filter-panel interaction pattern (`components/hub/FilterBar.tsx` / `components/ui/Sheet.tsx`) for the discipline/city controls, mirrored to URL params (`?discipline=&city=`), unless the ux-ui-designer spec says otherwise.
- Filter options come only from `vocab` (discipline) and `markets` (city) — zero hard-coded lists, per rule 4.
- Each result row: avatar/initials, `full_name`, `role_label`, `current_city` (if set) — reuse existing profile-row conventions from `PublicProfileView.tsx` where sensible. No bio excerpt, no follower count, no "N works" count unless the spec calls for it.
- Empty state: no public profiles yet → a quiet message, not an error. No match on filters → reset affordance, matching the Hub's existing empty-state pattern.
- Guests (signed out) can browse Discover (it's public data, same visibility rule as `/a/[handle]` itself) but see no Follow buttons — following requires an account.

## 3. Follow button on `/a/[handle]`

In `app/a/[handle]/page.tsx` / `components/profile/PublicProfileView.tsx`:
- Signed-in, viewing someone else's public profile: show a `Follow` / `Following` toggle button (ghost style, same weight as the existing `Share` action).
- Signed-in, viewing your own profile: do not show it (existing `isOwner` check already available on this page).
- Signed out: do not show it (no "sign in to follow" prompt needed for v1 — just omit it, matching how `Share` behaves for everyone regardless of auth state, but Follow specifically requires auth so it's owner-or-guest-omitted, not shown-disabled).
- Toggle behavior: a server action (or client call to Supabase using the already-established `@supabase/ssr` client pattern) that inserts/deletes the `follows` row for `(auth.uid(), profile.id)`. On follow: button flips to `Following`. On unfollow: flips back to `Follow`. No optimistic-UI trickery beyond what the existing `Save` button on opportunities already does — mirror that pattern for consistency.
- No count is fetched or displayed alongside this button, ever.

## 4. What this task does not do

- Does not build an "also applying" feature, alumni discovery, or co-presence discovery (`docs/CUE_RADAR_Product_Plan_v2.md` §5.1's other three contexts) — those remain separate, unscoped, still-blocked ideas.
- Does not add a "Followers"/"Following" list page for a user to browse who they follow or who follows them. (The plan doc's §5.4 describes a private connections list — that is not in this unblock; if the owner wants it, it needs its own task, since it's a new screen with its own privacy questions.)
- Does not touch `radar_preferences`, digest emails, or notifications of any kind. A follow does not notify the followee in this version.

---

## 5. Order of work

1. Confirm both dependencies (Task 10 migration applied; ux-ui-designer spec available). If either is missing, stop and report exactly what's missing rather than guessing.
2. Build `app/discover/page.tsx` and its filter component.
3. Add the Follow/Following button to `/a/[handle]`.
4. Verification (§6).

---

## 6. Verification (paste raw output in the PR — prose is not proof)

```bash
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts
ls app/discover/page.tsx
grep -rn "is_public" app/discover
grep -rniE "follower.*count|count.*follower" app components || echo OK_no_follower_count
grep -rn "localStorage\|FALLBACK_\|: any" app/discover components/profile || echo OK_no_client_persistence
grep -rnE "#[0-9A-Fa-f]{6}" app/discover components/profile --include=*.tsx || echo OK_no_hex
grep -rn "peer_call\|intros\|activity_feed" app/discover components/profile || echo OK_no_scope_creep
```

Manual checklist at 390px (attach screenshots): `/discover` with no filters (a grid/list of public profiles, no counts anywhere), `/discover?discipline=sound&city=berlin` filtered correctly, a signed-in user's own profile (no Follow button), another user's public profile signed in (Follow button, toggles to Following and back), signed-out view of `/discover` and of another profile (no Follow button, everything else renders).

---

## 7. Do not

- Do not display a follower or following count anywhere, in any form.
- Do not build messaging, an activity feed, or match recommendations.
- Do not build a followers/following list page.
- Do not invent the Discover screen's visual layout ahead of the ux-ui-designer's spec — reuse existing Hub patterns structurally only, and flag in the PR if no spec existed when this was built.
- Do not touch `supabase/migrations/` — that's Task 10's scope, already merged.
- Do not add new npm dependencies.
