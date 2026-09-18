# ArtConnect standard — per-screen implementation spec (Task 21)

Written by ux-ui-designer. Scope: `docs/design/**` only — no application code touched here.
Reads against `docs/tasks/TASK_21_artconnect_standard.md` (the gap table), `app/globals.css`
(the token contract, already rewritten — not reopened here), `docs/HANDOFF_V3.md`,
`docs/ROADMAP.md` §Task 02, and the live code in `components/hub/OpportunityRow.tsx`,
`components/hub/OpportunityDetailView.tsx`, `components/discover/{ProfileCard,DiscoverFilterBar}.tsx`,
`components/layout/{TopBar,TopBarNav,MobileNav}.tsx`, `components/ui/{Chip,Button,Sheet}.tsx`,
`app/{hub,discover,sources}/page.tsx`, `lib/types.ts`. Also reads the "Task 21" entries already
in `docs/DECISIONS.md` (design-tokens-as-contract note, the Chip/Badge split, the "what was
deliberately not built" list) and does not re-decide anything already decided there — this
document is the concrete build spec for what those entries name.

Browsed live 2026-09-18: `artconnect.com/opportunities`, `artconnect.com/discover` (all three
tabs), one opportunity detail page (`/opportunity/gDFrGwEPkRebMXBamyz-s`, desktop + 375px), and
our own `/hub`, `/discover`, `/sources` on the Vercel deployment.

Every class name below already exists in `app/globals.css` or Tailwind's default utility set. No
hex values, no new font names, no new CSS variables. Where a new *component* is named (`Badge`),
it is a plain composition of existing tokens/classes, not a token change.

---

## 0. Shared building blocks referenced throughout this spec

- **New primitive: `components/ui/Badge.tsx`** (owner: frontend-engineer A, `components/ui/**`).
  Splits the static-tag half of what `Chip.tsx` currently does. `Chip` stays exactly what it is
  today — an *interactive* control (`href`/`onClick`, `active` state, `cursor-pointer`,
  `min-h-[44px]`, hover state) — used only for filters and toggles. `Badge` is a *read-only* tag:
  no `href`, no `onClick`, no hover state, no `cursor-pointer`, no forced `min-h-[44px]` (it never
  needs a tap target because it does nothing on tap). Visual family identical to `Chip`'s neutral
  state so the two don't look like different systems:
  ```tsx
  interface BadgeProps {
    tone?: 'neutral' | 'accent'   // accent = the one differentiator per the closed accent list, rule 2
    children: React.ReactNode
    className?: string
  }
  // neutral: inline-flex items-center px-2 py-1 t-meta text-[11px] border border-line-strong
  //          text-muted rounded-[var(--radius-sm)] font-medium
  // accent:  same, border-accent text-accent (only ever one per card — enforced by the
  //          caller, same as today's getDifferentiatorTag() cap of one, not by the component)
  ```
  Do not add a `urgent` or `positive` tone to `Badge`. Urgency is text-only (§4). `--positive`
  stays unused by this pass — nothing in the closed accent-color list (`docs/DECISIONS.md`,
  "Task 07 — accent rule, final") authorizes a new color meaning, and `Badge` doesn't need one:
  type/fee/discipline/city tags all render in the neutral tone; only the one differentiator
  (`Funded` / `No fee`) gets `tone="accent"`, exactly as `Chip tone="accent"` does today.
- **Containers.** Every full-width directory screen (Hub, Discover, Sources) switches its
  hand-rolled `max-w-[...] mx-auto px-4 md:px-6` wrapper to the shared `.container-page` class
  (1200px, defined in `app/globals.css`). Single-record reading screens that stay one column
  (the public profile `/a/[handle]`) keep `.container-reading` (760px). The opportunity detail
  page is the one exception — it needs the wide measure because it becomes two columns (§2) —
  it also switches to `.container-page`.
- **Cards.** Every bordered block that is currently hand-rolled as `border border-line
  rounded-[var(--radius)] bg-bg` (or `bg-surface`) switches to the shared `.card` class
  (`app/globals.css`), and adds `.card-interactive` when the whole block is a click target
  (`OpportunityRow`, `ProfileCard`, `SourceRow`). This is what actually delivers the "7px radius,
  hairline border, finished" read the gap table asks for — it was already encoded in the CSS,
  most screens just weren't calling it.

---

## 1. Top nav / shell

Files: `components/layout/TopBar.tsx`, `components/layout/TopBarNav.tsx`,
`components/layout/MobileNav.tsx`, `components/brand/Wordmark.tsx`. Owner: frontend-engineer A.

### 1.1 What goes in it, and the grouping

ArtConnect's bar: wordmark (far left) · **Opportunities · Discover · Artworks · Magazine** (left,
next to the mark) · **Sign in / Sign up** or an avatar (far right). Two clear groups: identity +
primary IA on the left, account state on the right. Ours currently has the wordmark on the far
left and *everything else* — nav links and the sign-in control — crammed into one right-hand
group. Fix the grouping to match:

```
[ Wordmark ]        Hub   Discover   Currently   Saved        [ Profile/avatar ]  [ Sign in / Sign up ]
 ^ left                    ^ left-center nav group                    ^ right group
```

- **Desktop (`TopBarNav.tsx`, `md:flex` already):** five items, in this order:
  `Hub` (`/hub`) · `Discover` (`/discover`) · `Currently` (`/circuit`) · `Saved` (`/saved`) ·
  `Profile` (`/profile/edit` signed-in / `/signin?next=...` signed-out). This is the fix for the
  gap table's flagged bug — **Discover is currently linked from no nav at all** — inserted as the
  second item, mirroring ArtConnect's own placement (second of four). Same active-state treatment
  as today (`bg-fg text-bg` on the matched route, `text-muted hover:text-fg` otherwise,
  `flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius)]`), same `lucide-react` icons
  plus one more: `Compass` (already exported by `lucide-react`, no new dependency) for Discover.
- **Right side (`TopBar.tsx`):** guest — two controls, not one: `Sign in` (existing ghost/outline
  treatment, unchanged) **and** `Sign up` as `<Button variant="primary" href="/signup">Sign up
  </Button>` (`h-10`, `bg-accent text-bg`). This is the missing primary CTA the gap table asks
  for — today there is no signed-out call to action beyond a plain outline "Sign in," which is
  exactly why the bar reads unfinished next to ArtConnect's black "Sign up" button. Signed-in:
  keep the existing `SignOutButton` as-is (this pass doesn't touch account-menu scope).
- **Height:** `h-[64px]` (up from `h-[52px]`) using `--space-*` values already in the token set —
  `52px` was cramped once the CTA button (`h-10` = 40px) has to sit inside it with breathing room;
  `64px` gives it `12px` of clearance top and bottom, matching ArtConnect's roomier bar. Background,
  border, sticky behavior unchanged (`bg-surface border-b border-line sticky top-0 z-40`).
- **Horizontal padding:** switch from the bar's own `px-4 md:px-6` to `.container-page`'s
  built-in padding-inline (16px mobile / 32px desktop) so the bar's content aligns with every
  page's content edge instead of drifting independently — currently the two are hand-maintained
  separately and can drift.

### 1.2 Mobile (`MobileNav.tsx`, bottom tab bar, unchanged pattern, one item added)

Same five items as desktop nav, same order, same `flex-1 h-full min-h-[44px]` per-item tap target
(this already satisfies the 44px rule — don't shrink it to fit five items). At 375px, five equal
flex items land at ~75px each, comfortably above the 44px minimum width as well as height. Icons:
`LayoutList, Compass, Route, Bookmark, User` (add `Compass` for Discover in position 2, same as
desktop). Do not add a sixth item or an overflow menu — this is the one entry point mobile needs
and it fits without compromise.

### 1.3 Signed-in vs guest, summarized

| | Guest | Signed in |
|---|---|---|
| Nav links | Hub, Discover, Currently, Saved, Profile (Profile → `/signin?next=/profile/edit`) | same five, Profile → `/profile/edit` |
| Right-side controls | `Sign in` (outline) + `Sign up` (`Button variant="primary"`) | `Sign out` (unchanged) |

---

## 2. Opportunity card (`components/hub/OpportunityRow.tsx`)

### 2.1 ArtConnect's anatomy vs. what `HubFeedRow` (`lib/types.ts`) can actually populate

| ArtConnect element | Source in `HubFeedRow` | Verdict |
|---|---|---|
| Title | `row.title` | populate |
| Coloured type badge | `row.type` (label via `vocab`) | populate, **not coloured** — see §2.3, no new accent use |
| Location link | `row.city_name ?? row.city` | populate, **not a link** — see §2.3 |
| Reward icon row | `row.covers[]`, `row.funding_type` | populate — see §2.3 (icons, not ArtConnect's exact glyphs) |
| Fee badge (FREE) | `row.application_fee === 0` | populate — this is the existing "No fee" differentiator, already accent-eligible |
| Deadline | `row.deadline`, `row.days_left`, `row.is_rolling` | populate (existing `formatDeadline`, unchanged logic) |
| Org logo | — no `logo_url` on `Source` (`lib/types.ts`) | **omit the image.** Do not fabricate a placeholder graphic. Render an initials monogram instead (2 letters of `source_name`, same fallback pattern `ProfileCard.tsx` already uses for missing avatars) — that's real data (the institution's real name), not invented content. |
| Org name (right side) | `row.source_name` | populate, kept as its own nested link to `/sources/{source_id}` (already implemented) |
| Save | `SaveOpportunityButton` | **currently missing from the card entirely** — add it, see §2.4 |
| "See more →" | — | add as a visible affordance, see §2.4 |
| Sponsored tag | — no sponsorship concept in this product | omit entirely, never fabricate |

### 2.2 Exact element order (top to bottom, `.card .card-interactive p-4` wrapper)

```
1. Title                                    .t-row, 2-line clamp
2. Type badge  ·  City                      Badge(neutral) + plain t-meta text (not Badge, not link)
3. Reward icon row  +  fee badge            small lucide icons, muted, + Badge(neutral or accent)
4. Deadline                                 t-meta, text-urgent only when <7 days (§4)
5. Source: [monogram] Source name           right-aligned on desktop, own row on mobile
6. Save  ·  See more →                      bottom row, right-aligned
```

This keeps the Task 02 decision that **title is the largest, first element on the card** (already
correct, don't change) while adding the two rows ArtConnect uses to carry hierarchy: a badge/meta
row directly under the title, and an explicit action row at the bottom instead of an invisible
full-card link only.

### 2.3 Row-by-row detail

**Row 2 — type + city.** `<Badge tone="neutral">{typeLabel}</Badge>` then a plain
`<span className="t-meta text-muted">{cityLabel}</span>` separated by a `·`. Not a link — per
`docs/design/DISCOVER_V1_SPEC.md`'s own precedent, a card is one click target; a second nested
link here (on top of the source-name link already present) starts stacking tap targets on a
375px card. City filtering already exists via the Hub's own chip row and `Filter` sheet — this
label doesn't need to duplicate that as a second navigation path.

**Row 3 — reward icon row + fee badge.** For each value present in `row.covers` (in this fixed
order so the row doesn't reflow between cards: `housing, travel, studio, tech, per_diem,
mentorship, presentation`), render one `lucide-react` icon at `size={14}` `className="text-muted"`
with `aria-label`/`title` set to the vocab label (icons are supplementary, not a replacement for
the accessible name): `Home` (housing), `Plane` (travel), `Building2` (studio), `Wrench` (tech),
`Utensils` (per_diem), `GraduationCap` (mentorship), `Presentation` (presentation). If `covers` is
empty, render nothing (no empty icon placeholders). Immediately after: the fee badge —
`row.application_fee === 0` → `<Badge tone="accent">No fee</Badge>` (this **is** the existing
`getDifferentiatorTag()` value, just moved from the old tags row into this row and rendered as
`Badge` instead of `Chip`); a nonzero fee renders nothing here (per Task 06's existing rule, don't
show a "Fee" badge for the common case, only flag the differentiator case). `Funded` (the other
half of `getDifferentiatorTag()`) renders in the same slot, mutually exclusive with `No fee` —
unchanged logic, just relocated and re-skinned as `Badge`.

**Row 4 — deadline.** Unchanged `formatDeadline()` output and unchanged urgency rule (§4) —
`t-meta`, `text-urgent` only when `isUrgent`, otherwise `text-muted`. This is its own row now
(not crammed into a `justify-between` row with funding) because funding moved into row 3's fee
badge and row 6 no longer needs to share space with it either.

**Row 5 — org identity.** `<div className="w-[24px] h-[24px] rounded-[var(--radius-sm)]
bg-surface-2 border border-line flex items-center justify-center flex-shrink-0"><span
className="t-meta text-[10px] text-muted">{initials}</span></div>` next to the existing
`source_name` link (unchanged href/z-10 pattern). On mobile this row can wrap under row 4; on
`md:` it right-aligns opposite the deadline per the original ArtConnect layout (org block sits to
the right of the reward/fee row in the reference).

**Row 6 — actions.** `SaveOpportunityButton` (existing component, already handles guest redirect
to `/signin?next=...` and the accent-outline "Saved" state per the closed accent list) at compact
size, plus a plain text affordance `See more →` (`t-meta text-fg`, arrow is the literal character
`→`, not an icon — consistent with the rest of the product's text-based directional cues, e.g.
`Chip`'s existing arrows). Both sit at `relative z-10` above the existing stretched `<Link>` so the
whole-card click still works everywhere else on the card. **Tap target fix required as part of
this pass:** `SaveOpportunityButton`'s underlying `Button`/raw-button markup is `h-10` (40px) —
below the 44px hard rule. On the card (not the detail page, where it already sits inside a `gap-3`
row with other 44px-plus elements and has more breathing room) wrap it so the clickable area is
`min-h-[44px]` regardless of the button's own height — e.g. a `min-h-[44px] inline-flex
items-center` wrapper, same fix pattern already used for `Chip`. Do not shrink `See more →`'s tap
target below 44px either (it's the second click target on the card besides the stretched link and
Save — give it real padding, not a bare text node).

### 2.4 What was deliberately not attempted

No sponsored slot, no view count, no organization logo image. All three are real ArtConnect
elements with zero backing data in this schema — inventing them is a rule-1 violation, not a
design gap. Documented once here rather than re-litigated per element.

---

## 3. Opportunity detail (`components/hub/OpportunityDetailView.tsx`, `app/opportunities/[slug]/page.tsx`)

### 3.1 Layout: two column with a sticky right rail

Wrapper switches from `max-w-[720px] mx-auto px-4 md:px-6 py-6` to `.container-page`, containing:

```
<div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8 md:gap-12">
  <div>  ...left column, §3.2...  </div>
  <aside className="md:sticky md:top-[80px] md:self-start"> ...right rail, §3.3... </aside>
</div>
```

- **Breakpoint:** `md:` (768px), same breakpoint used everywhere else in this codebase — no new
  breakpoint introduced. Below `md:`, the grid collapses to a single column and the `<aside>`
  renders inline, in document order, **directly after the fact block** (not at the very top and
  not at the very bottom) — this matches what ArtConnect itself does at 375px (verified live):
  deadline + calendar button render first among the "decision" content, immediately followed by
  the Save/Apply box, then the collapsible detail sections. Concretely on mobile: back link → meta
  line → title → **deadline + Add to calendar** → **Save + Apply buttons** → fact block (type,
  funding, discipline, covers, eligibility, career stage, fee) → summary → materials required.
- `md:top-[80px]` accounts for the new `64px` nav bar height plus `16px` clearance (`--space-4`).
- **Mobile sticky bottom bar stays.** The existing `fixed bottom-[56px]` Apply/Save bar
  (`OpportunityDetailView.tsx`'s current mobile block) is not removed — it's a persistent
  action affordance while scrolling the accordions, independent of the inline Save/Apply buttons
  that now also appear higher up per the bullet above. Both existing today in different form; keep
  the pattern, just make sure the inline one appears at the position described above instead of
  buried after the full fact block as it is now.

### 3.2 Left column content (order, using existing sections, mostly unchanged)

Back link · meta line (`type · source_name · city_name`, existing) · trust line (existing,
verified-date/staleness) · title (`.t-title normal-case`, existing) · `Demo` badge if `is_demo`
(now `Badge`, not `Chip`, since it's read-only) · eligibility line (existing) · summary
(`row.summary`, moved directly under the title block, ahead of the fact grid — this is the one
genuinely descriptive sentence a reader wants before the fact grid, matching ArtConnect's
"Overview" placement immediately under its own fact strip) · fact block (existing grid, unchanged
field set) · materials required (existing).

### 3.3 Right rail content (desktop) / inline block (mobile)

In this exact order, each an accordion **except** the first two which stay always-open (ArtConnect
keeps Deadline and the Save/Apply box open; only Cost / Required Documents / Contact / Selection
Date collapse):

1. **Deadline** — `t-meta text-muted` label "Deadline", value in `t-num`, `text-urgent` only if
   `deadlineInfo.isUrgent` (unchanged rule, §4). "Add to calendar" button directly below
   (`row.deadline` present → functional `.ics` link, existing `app/opportunities/[slug]/ics/route.ts`;
   `null` → disabled `Button variant="ghost"` "Add to calendar (Rolling)", existing text unchanged).
2. **Save / Apply box** — `SaveOpportunityButton` + `<a href={row.apply_url}>` `Button
   variant="primary"` "Apply on {hostname}" (existing logic, existing demo-row hostname handling —
   unchanged), stacked full-width inside the rail card.
3. **Cost** (accordion, closed by default) — `row.application_fee` (feeText, existing formatting)
   plus `row.funding_type`/`funding_min`/`funding_max` (fundingText, existing formatting). This
   consolidates two rows that are currently separate lines in the flat fact block into one
   labelled, collapsible section, matching ArtConnect's own "Cost" accordion.
4. **Required Documents** (accordion, closed) — `row.materials_required[]`, same list rendering
   already in `OpportunityDetailView.tsx`, just relocated into the rail instead of a bottom section
   with its own `<h2>`.
5. **Contact** (accordion, closed) — this schema has no dedicated contact field. **Do not
   fabricate one.** Render the existing `apply_url` hostname line ("Apply via {hostname}") as the
   entire content of this section, or omit the accordion header entirely if there is nothing to
   show beyond what's already in the Save/Apply box — omitting is correct per rule 1, don't pad it
   with an invented email or contact name.
6. **Selection Date** (accordion, closed) — no `selection_date` column exists on `opportunities`.
   **Omit this accordion entirely.** Do not render a "Selection Date" header with placeholder or
   invented content; ArtConnect has this field because its schema has it, ours doesn't. If a future
   task adds the column, this section slots back in unchanged.

All accordions use the same disclosure pattern already established elsewhere (`Sheet`-adjacent
chevron affordance) — `<button className="w-full flex items-center justify-between py-3 border-t
border-line t-row text-fg">{label}<ChevronDown size={18} className="text-muted" /></button>`
toggling a `max-h-0`/`max-h-[...]` or conditional-render body. No new interaction pattern —
implementers should reuse whatever disclosure mechanic already exists in `Sheet.tsx` if it's
reusable, rather than hand-rolling a second one.

---

## 4. Discover (`app/discover/page.tsx`, `components/discover/{ProfileCard,DiscoverFilterBar}.tsx`)

### 4.1 Sub-tabs: what we can honestly build

ArtConnect: Artists · Curators · Organizations, three real, independently-populated directories.
Ours has **one** `profiles` table with a free-text `role_label` (not a controlled vocab — checked
`lib/types.ts` and `supabase/migrations/*`: no `role`/`profile_type` category exists anywhere) and
a **separate, already-built** institutions directory at `/sources` (`docs/design/
SOURCES_DIRECTORY_SPEC.md`, 343 rows live). That gives two tabs real content and zero tabs a
"Curators" concept:

| Tab | Backing data | Behavior |
|---|---|---|
| **Artists** | `profiles` where `is_public = true` | full directory, existing `DiscoverFilterBar`/`ProfileCard` query, unchanged filtering logic |
| **Organizations** | `sources` where `market.is_active = true` (existing `/sources` query) | same row anatomy as `/sources` today, reusing the existing `components/sources/SourceCard.tsx` and `components/sources/SourcesFilterBar.tsx` directly — **do not build a second, divergent Organizations directory; this tab renders the same data/components the `/sources` route already uses**, just presented under the Discover tab strip so it reads as one directory family. Same query, same components. |
| **Curators** | — none. `role_label` is freeform text a profile owner typed themselves; there is no reliable way to know which profiles are "curators" versus any other self-described role. | **Omit the tab's content, not the tab.** Render the tab (so the three-way switcher itself matches the reference and the IA reads honest about what exists vs. doesn't), but its panel is a single empty-state: `.t-body text-muted`, centered — "Curator profiles aren't a separate category yet — browse Artists or search by role." No fake rows, no filtered-guess at "profiles whose role_label contains 'curator'" (a substring match is not the same as a real taxonomy and will misfile people — don't do it). |

Tab strip: plain text tabs, underline on active (`border-b-2 border-fg` active / `border-b-2
border-transparent text-muted hover:text-fg` inactive), `t-row`, `min-h-[44px]` per tab, matching
the reference's understated treatment (not `Chip`/`Badge` styled — a fourth control family isn't
needed for three top-level destinations).

### 4.2 Two search inputs

Replace the current single `Search name or role` input in `DiscoverFilterBar.tsx` with two
side-by-side fields (stack vertically below `md:` — `flex flex-col md:flex-row gap-3`), matching
the reference exactly:

```
<input placeholder="Search by name" ... />       → ?q=      (existing full_name/role_label ilike, unchanged)
<input placeholder="Search by city or country" .. /> → ?city_q=  (new: ilike against markets.display_name,
                                                                     resolved to the matching market slug(s)
                                                                     server-side before filtering profiles —
                                                                     do not hardcode a country/city list, rule 4)
```

Both use the existing `.input-shell` class (already defined in `app/globals.css` — don't hand-roll
new input styling for these two fields). The existing `Filters` sheet (city-region-grouped list +
discipline chips) stays as-is underneath this row for the cases these two free-text inputs don't
cover well (browsing by region, multi-select discipline) — this is additive, not a replacement.

### 4.3 Row anatomy

Confirmed live against the reference (`Discover Artists`, both desktop and 375px): avatar, name,
one role/location fact line, a trailing action, and — only when the profile actually has content
for it — a recent-work strip. Ours:

```
[avatar 44px]  Full Name                                    [View Profile →]
               Role label · City, Country
```

- Avatar block: unchanged from today's `ProfileCard.tsx` (`44×44`, `rounded-[var(--radius)]`,
  initials fallback).
- Combine what are currently two separate lines (`role_label` and the city `Chip`) into one fact
  line: `<span className="t-meta text-muted">{role_label}{role_label && cityLabel && ' · '}
  {cityLabel}</span>` — omit either half cleanly if absent, never render a dangling `·`.
- Discipline `Chip`s (existing, capped at 2) move to their own line below the fact line, unchanged
  otherwise — these become `Badge`, not `Chip` (§0 — they're read-only tags, not filters, on this
  card, same reasoning as the Hub card).
- **`View Profile →` as an explicit trailing element**, not just an implicit whole-card click:
  render it as `t-meta text-fg` plain text (not a `Button`, matching the reference's understated
  weight) at the card's right edge on `md:`, stacked below the identity block on mobile. The card
  stays a single stretched-link click target underneath it (same z-10 pattern as everywhere else in
  this codebase) — this is a visible affordance for an already-existing click target, not a second
  navigation path.
- **Recent-work strip: omit.** This product has no artwork/portfolio-image model (`ProfileWork` in
  `lib/types.ts` has no image field, and `profiles.gallery` — landed this same task cycle per
  `docs/DECISIONS.md` — is the closest concept but is a private-form-only field with no public
  rendering spec yet). Do not build a placeholder strip with grey boxes; that reads as more broken
  than not having the feature. `profiles.gallery`, when it has a public-facing treatment (a
  separate task), is the natural future home for this row — flag it there, don't half-build it here.

### 4.4 Organizations tab reuses `/sources`, doesn't fork it

Per §4.1's table — the Organizations tab is not a new screen. It renders the same query and the
same `SourceCard`/`SourcesFilterBar` components `/sources` already uses (per `docs/design/
SOURCES_DIRECTORY_SPEC.md`), just inside the Discover shell/tab strip. Two implementations of the
same list is itself a form of the inconsistency this task exists to remove.

---

## 5. Density and restraint — what urgency looks like

The gap table's clearest single fix: **ArtConnect never puts a colored border around a whole
card.** Urgency is carried by text color alone, in one place — the deadline value.

- **Remove** `OpportunityRow.tsx`'s current `deadlineInfo.isUrgent ? 'border-2 border-urgent' :
  'border border-line'` conditional entirely. Every card gets the same `.card` treatment
  regardless of urgency — `1px solid var(--line)`, `.card-interactive:hover` for the
  `border-line-strong`/`bg-surface-2` hover state, no exceptions.
- **Keep** `text-urgent` on the deadline value only (`< 7 days`, existing threshold, unchanged) —
  this is already correct and already restrained; it just needs to stop being reinforced by a
  heavy border on the same row.
- Don't introduce a second urgency signal (a dot, an icon, a background tint) to compensate for
  removing the border — one quiet text-color change is the whole treatment, on the card and on the
  detail page's rail. Adding a second cue would just relocate the shouting instead of removing it.
- This same rule applies everywhere `deadlineInfo.isUrgent`/`eligibility.isEligible` currently
  render — `OpportunityDetailView.tsx`'s fact block and rail, and any future urgency display —
  text-only, one location, no card-level chrome change.

General density rule for this pass, stated once: **a fact earns a `Badge`; a feeling does not.**
Type, fee-free, discipline, city, "Demo" are facts — they get badges. "This is closing soon" and
"you're eligible" are feelings derived from facts — they get a text color, never a badge, never a
border, never a background fill. This is why ArtConnect's cards feel calm at high density: color
is reserved for the rare cases that need it, and reserved as text, not chrome.

---

## 6. Do not do this (for the three implementing engineers)

1. **Do not add a new CSS variable, a new font, or a hex/`rgb()` literal anywhere in `.tsx`.**
   `app/globals.css` is the closed contract for this task — extend usage of what's there, don't
   reopen it. If a value genuinely doesn't exist (a sixth accent use, a new color for "positive"),
   that's a flag back to this document / `docs/DECISIONS.md`, not a local hex value.
2. **Do not invent an organization logo, a sponsored slot, a view/follower count, a selection
   date, a curator taxonomy, or a recent-work image strip.** Every one of these is a real
   ArtConnect element this spec explicitly evaluated and rejected for lack of real data (§2, §3,
   §4). Omitting is correct. A grey placeholder box, a fake count, or a substring-matched fake
   category is not "filling in slowly" — it's fabrication, rule 1.
3. **Do not put a `Chip` where a `Badge` belongs, or vice versa.** If it has `href`/`onClick` and
   changes what the user sees when pressed, it's a `Chip`. If it's a static fact printed on a card
   it's a `Badge`. Mixing them back together is exactly the "four identical grey buttons" problem
   this pass exists to fix.
4. **Do not add a border-weight or background-fill urgency treatment anywhere.** Re-read §5 before
   touching any file that renders `deadlineInfo.isUrgent`.
5. **Do not give the "coloured type badge" an actual distinct color per type.** There is no token
   budget for ten hues (one per `type` vocab value) and the closed accent-color list doesn't
   include it. Every type badge is the same neutral `Badge` — the color you're picturing from the
   reference doesn't exist in our token set and isn't this task's subject to add.
6. **Do not shrink a tap target below 44px to make a denser card fit.** If the new row anatomy in
   §2/§4 feels tight at 375px, add vertical space (`--space-*` tokens) before shrinking a control —
   restraint means editing content, not editing minimum hit areas.
7. **Do not build the Organizations tab as a second, parallel directory.** It renders `/sources`'s
   existing data and row component. Two implementations of the same list is itself a form of the
   inconsistency this task is trying to remove.
8. **Do not touch `app/globals.css`.** Not the radius, not the container widths, not the type
   scale. If a screen genuinely doesn't fit the existing scale, that's a new design-system task,
   not a quiet edit inside this one.
