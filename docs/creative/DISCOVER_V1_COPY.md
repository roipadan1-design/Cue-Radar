# Discover v1 — UI copy

Status: proposal, ready to implement as-is. Written for Task 11 (`docs/tasks/TASK_11_discover_connect_frontend.md`) by the Creative Director role, 2026-09-17. Nothing in `app/discover/`, `components/profile/`, or anywhere else has been edited by this document — the frontend engineer wires these strings in.

Register check against existing copy actually in the product (not invented for this doc): `components/hub/FilterBar.tsx` ("Search title, institution, city"), `components/hub/EmptyState.tsx` call sites ("Nothing here yet.", "No open calls match these filters.", "The feed is being curated — check back soon."), `components/hub/SaveOpportunityButton.tsx` ("Save" / "Saved"), `components/profile/ShareLink.tsx` ("Share" / "Copied"). All of it: short declarative sentences, sentence case, no exclamation marks, no emoji, states a fact rather than an instruction where possible ("Nothing here yet," not "You have nothing saved!").

---

## 1. Search placeholder text

### Ranked options

**1. "Search name" — top pick.**
The Hub's placeholder ("Search title, institution, city") names the exact fields the query matches, not a vaguer description of what you're looking for — that's the house pattern, and it only works if every field named is actually queried. Task 11 §2 already gives discipline and city their own dedicated filter controls, so repeating them in the search placeholder would overstate what free-text search does and risks the "no invented claims" rule if the actual query only matches `full_name`. "Search name" is true regardless of exactly how the frontend engineer implements the query, and doesn't compete with the filter controls for the same job.
*Flag for whoever builds this:* if the query also matches `role_label`, change this to option 2 below — but confirm the actual matched column(s) first rather than defaulting to the more impressive-sounding phrase.

**2. "Search name or role"**
Use only if the implementation genuinely queries both `full_name` and `role_label`. Same register as option 1, just naming a second real field.

**3. "Search artists"**
Rejected as the default: it describes the goal, not the fields, breaking the Hub's own established placeholder pattern for no real gain — and "artists" is a slight overreach for a directory that will, in practice, also list anyone with a public profile who filled in a discipline, not only people who'd call themselves "artists."

---

## 2. Empty states

Two distinct states, per Task 11 §2 ("no public profiles yet" vs. "no match on filters"), mirroring the Hub's own two-state pattern in `components/hub/HubFeedView.tsx` exactly.

### 2a. No public profiles exist yet (no filters active)

**1. "No public profiles yet." — top pick.**
Matches the exact sentence shape already used twice in this codebase — `SavedPipelineView.tsx`'s "Nothing here yet." and `HubFeedView.tsx`'s "The feed is being curated — check back soon." Both state a plain fact and stop; neither apologizes or invites action that doesn't exist yet. No action button — there's nothing to reset and nothing to browse instead, so per `EmptyState`'s existing `action` prop being optional, omit it here.

**2. "Nobody has opted in to Discover yet."**
More specific about the actual mechanism (`is_public`), but "opted in" reads slightly more technical/product-team than the plain factual register elsewhere — usable, not the first choice.

**3. "No one is listed here yet."**
Close to option 1 but slightly softer/vaguer; ranked below it only because "public profiles" is the more precise noun (matches what the screen is actually querying) than "listed here."

### 2b. Filters applied, no matches

**1. "No profiles match these filters." + action "Reset" — top pick.**
Directly mirrors `HubFeedView.tsx`'s existing "No open calls match these filters." + `{ label: 'Reset', href: '/hub' }` pattern, down to the exact word "Reset" for the action — same component (`components/hub/EmptyState.tsx`), same interaction, same word, so a user who has already learned this pattern on the Hub doesn't have to relearn it on Discover. The reset target should be `/discover` (no query params), the same shape as the Hub's own reset link.

No second- or third-ranked option here — this one is a direct reuse of an existing, working pattern in the same codebase, not a fresh copy decision, so there's nothing meaningful to rank it against.

---

## 3. Follow / Following button

### Ranked options

**1. "Follow" / "Following" — top pick.**
Mirrors `SaveOpportunityButton.tsx`'s exact tense pattern (`Save` → `Saved` on toggle) applied to the new verb — present-tense imperative when inactive, present participle when active. This is the only option that stays consistent with a pattern that already exists twice in this exact codebase (Save/Saved, and implicitly Share/Copied as a related toggle-label idiom), so a returning user doesn't encounter a second, different toggle grammar for a conceptually identical action.

**2. "Follow" / "Unfollow"**
A common convention elsewhere on the web, but rejected here specifically because it breaks from this codebase's own established pattern — `Save` does not become `Unsave` on toggle, it becomes `Saved`. Introducing a different toggle grammar for Follow only, when Save already set the house convention, would be an inconsistency to flag, not an improvement.

**3. Any icon-decorated variant (e.g. a plus or check glyph next to the word)**
Rejected outright — no icons on text-only actions is not this doc's rule to relitigate; it follows directly from the existing house style already used on `Save`/`Share`, neither of which carries an icon.

**Styling note (not copy, but adjacent):** Task 11 §3 specifies "ghost style, same weight as the existing Share action." `ShareLink.tsx`'s actual classes are `t-meta text-muted hover:text-fg` with no border/background — match that exactly for visual consistency, and reuse its "no count, ever" discipline: the button text is only ever the word "Follow" or "Following," never "Follow" with a number anywhere near it, per Task 11 §1 and §3's explicit rule.

---

## What this document does not do

- Does not implement any of these strings in `app/discover/`, `components/profile/PublicProfileView.tsx`, or any other file.
- Does not invent a search field the frontend engineer hasn't confirmed is actually queried — see the flag under §1.
- Does not propose a visual layout for the Discover screen — that remains blocked on the ux-ui-designer's spec per Task 11 §5.1, unchanged by this document.
- Does not add a follower/following count anywhere, in any copy, aria-label, or tooltip — consistent with Task 10/11's explicit rule.
