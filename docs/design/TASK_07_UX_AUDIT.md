# Task 07 UX audit — filter density, accent presence, "Currently" nav check

Status: audit + spec. No application code changed by this document.
Scope: three items from the ux-ui-designer brief for Task 07 — (1) Hub filter-chip default density, (2) `--accent` additional placements, (5) a plain go/no-go on "Currently" in nav context. Items 3 and 4 (Discover v1, Source detail) are separate documents: `docs/design/DISCOVER_V1_SPEC.md`, `docs/design/SOURCE_DETAIL_SPEC.md`.
Read against: `docs/design/DESIGN_BRIEF.md`, `app/globals.css`, and the current code in `components/hub/FilterBar.tsx`, `components/hub/OpportunityRow.tsx`, `components/hub/OpportunityDetailView.tsx`, `components/hub/SaveOpportunityButton.tsx`, `components/ui/{Chip,Button}.tsx`, `app/page.tsx`, `components/layout/{MobileNav,TopBarNav}.tsx`.
Date: 2026-09-17.

---

## 1. Filter-chip default density — already resolved, one real bug found

**Verdict: already resolved. No redesign needed.** `components/hub/FilterBar.tsx` (redesigned 2026-09-17, see `docs/DECISIONS.md` "Hub filter bar UX cleanup") shows exactly 5 always-visible quick-toggle chips (`No fee`, `Funded`, `Housing`, `Travel`, `Light application`) in a wrapping `flex flex-wrap` row — no horizontal scroll — plus a single `Filters` button opening a `Sheet` panel for City / Type / Discipline. This is the "few highest-value chips + one entry point for the rest" shape the original ~17-chip complaint was asking to fix. I checked it live in code, not from the ticket description; the ~17-chip row it describes does not exist anymore.

I'm not trimming 5 down to "3–4" per the original brief's example count. `No fee`, `Funded`, `Housing`, `Travel`, `Light application` are five independently useful pre-application signals (cost, money, two different in-kind covers, and effort) — dropping one to hit an arbitrary number would remove real capability for no design gain, and the row already doesn't scroll or crowd at 375px (verified: five chips at `min-h-[44px]` in a wrapping row fit in two short lines at 375px width, no overflow).

**One real accessibility bug found, needs a fix:**

- `FilterBar.tsx`'s `Filters` trigger button is `h-9` (36px tall) — below the 44px minimum tap target. Every chip in the row above it correctly uses `min-h-[44px]` (inherited from `Chip.tsx`), but the custom `<button>` for the panel trigger does not.
  - **Fix**: change `h-9` → `min-h-[44px]` (drop the fixed height, use min-height so the existing `px-3` padding still applies). No other styling changes.
- Secondary, lower-priority note: the search input (`h-10`, 40px) and the "Reset all" text link (no explicit height) are also under 44px. Text inputs and inline text links are commonly exempted from the strict tap-target rule (the interactive surface is the visible text/field itself, not a padded button), so I'm not requiring a change here — flagging only so it's a deliberate call, not an oversight, if a future pass wants to tighten it further.

No other change to `FilterBar.tsx`.

---

## 2. Accent presence — current state is already past "one per screen," and inconsistent

**Verdict: not resolved as stated.** The brief describes the standing rule as "one accent use per screen." Reading the actual shipped code, that is not what exists today — `--accent` already appears more than once, simultaneously, on at least three screens:

| Screen | Simultaneous accent uses today |
|---|---|
| Landing (`app/page.tsx`) | `Browse open calls` button (`Button variant="primary"` → `bg-accent`) **and** the `+N more` cities link (`text-accent`, line 73) |
| Hub row (`components/hub/OpportunityRow.tsx`) | `Funded`/`No fee` differentiator chip (`Chip tone="accent"`, line 102) **and**, for a signed-in eligible user, the `Eligible ✓` label (`text-accent`, line 117) — both can render on the same row |
| Opportunity detail (`components/hub/OpportunityDetailView.tsx`) | `Apply on {host}` button (`bg-accent`), `Eligible ✓` label (`text-accent`, line 110), **and** — once saved — the Save button itself (`SaveOpportunityButton.tsx` switches to `variant="primary"` when `isSaved`, line 64, which is also `bg-accent`) — on the mobile sticky bar this puts two solid accent-filled buttons side by side |

So the actual, already-shipped discipline is not "one accent element per screen" — it's closer to "one accent *meaning* per fact, applied consistently wherever that fact appears," and even that has one real inconsistency (the Save button competing with Apply for the accent fill) and one weak case (the landing "+N more" link, which doesn't correspond to any specific fact — it's a plain "see more" affordance, not a signal).

Given the owner wants "a bit more presence, gently," the honest move is not to add more accent on top of an already-loose rule — it's to (a) name the current uses precisely, (b) fix the one place they visibly collide, (c) retire the one use that isn't really a signal, and (d) add exactly two new, well-defined placements on screens that currently have none. Net effect: five named, disciplined meanings instead of four loose ones, and accent now also appears on two screens (`/a/[handle]`'s Follow state, `/sources/[id]`'s recurrence line) that had zero accent before — that is where the "gentle" extra presence actually comes from, not from stacking more onto Hub or the opportunity detail page, which already carry the most.

**The final rule is written into `docs/DECISIONS.md` under this task's entry ("Task 07 — accent rule, final"). It supersedes the "one accent per screen" line in `docs/design/DESIGN_BRIEF.md` §3 and the equivalent line in Task 02/03.** Summary of what changes for the Frontend Engineer, precisely:

1. **No change** — primary action fill, differentiator chip, eligibility label: keep exactly as they are today (`Button variant="primary"`, `Chip tone="accent"`, `text-accent` on `Eligible ✓`).
2. **Fix**: `components/hub/SaveOpportunityButton.tsx` — when `isSaved` is true, stop using `variant="primary"`. Use an outline treatment instead: `border border-accent text-accent bg-transparent` (same visual family as `Chip tone="accent"` — outline, not fill), keeping the button's existing height/padding/copy (`Saved`). This removes the two-accent-fills-side-by-side collision on the opportunity detail page without touching the unsaved state at all.
3. **Fix**: `app/page.tsx` line 73 — change `text-accent` to `text-muted` on the `+N more` cities link. No other change (same border, same `href`, same position). This link doesn't name a specific fact, so it doesn't earn the color.
4. **New** — `Follow`/`Following` toggle on `/a/[handle]` (Task 11, spec in `docs/design/DISCOVER_V1_SPEC.md` §3): the `Following` state (already following this person) renders `border-accent text-accent`, no fill. The default `Follow` state stays plain ghost text, matching `Share`'s current weight. One-sentence justification: accent marks a relationship you've already established, the same job it already does for "you already qualify" and "you already saved this."
5. **New** — the recurrence forecast on `/sources/[id]` (Task 09, spec in `docs/design/SOURCE_DETAIL_SPEC.md` §4): in the line "Usually opens in {month}," the `{month}` word alone renders `text-accent`; the rest of the sentence stays `t-body text-fg`. One-sentence justification: accent marks the one forward-looking, actionable fact on that page (when to check back) — the page has no other accent use, so there's no competition.

I'm not proposing accent anywhere in navigation (the active-tab pill) — it already has a working, consistent "you are here" language (`bg-fg text-bg`, shared identically by chips, city-sheet rows, and nav tabs). Introducing a second color for the same "selected/active" meaning would create two competing wayfinding systems for one concept, which is exactly what the design brief's Tokyo Metro reference (§5) warns against.

---

## 5. "Currently" in nav context — go

Checked `components/layout/MobileNav.tsx` and `components/layout/TopBarNav.tsx` as they'll read once Task 07 lands the `Circuit` → `Currently` label rename (nav items are currently `Hub`, `Circuit` — soon `Currently` —, `Saved`, `Profile`).

**Go.** Read in the actual four-item row — `Hub · Currently · Saved · Profile`, each a one-word noun paired with a `lucide-react` icon (`LayoutList`, `Route`, `Bookmark`, `User`) at 16–20px — "Currently" reads as a peer of the other three, not as a status widget. Two things specifically de-risk the "status widget" tone concern the prior research flagged:

- It keeps the `Route` icon (a path/journey glyph), not a clock, dot, or pulse icon that would read as live-status chrome.
- It sits in the same visual slot and type treatment (`t-meta`, active state = solid `bg-fg text-bg` pill) as `Hub`, `Saved`, `Profile` — nothing about its presentation is different from its neighbors, so nothing marks it out as "a different kind of UI element" the way a status widget would be.

No change needed to nav markup or spacing for this rename. This is a fit check only, per the instruction — not a new research pass, and I found nothing at the nav-context level that contradicts the prior name-collision clearance.
