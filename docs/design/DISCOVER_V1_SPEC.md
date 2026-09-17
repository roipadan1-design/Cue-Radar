# Discover v1 — screen spec (Task 11)

Status: spec only. No application code changed by this document.
Audience: written for a Frontend Engineer agent to implement `app/discover/page.tsx` and the Follow button on `/a/[handle]` without guessing.
Reads against: `docs/design/DESIGN_BRIEF.md`, `app/globals.css`, `docs/tasks/TASK_11_discover_connect_frontend.md`, and the current code in `components/hub/FilterBar.tsx`, `components/ui/{Sheet,Chip,Button}.tsx`, `components/profile/{PublicProfileView,ShareLink}.tsx`. Reuses these components; introduces no new ones.
Date: 2026-09-17.

---

## 1. What this reuses, exactly

No new interaction pattern anywhere on this screen. Every piece below is an existing component or an existing layout convention applied to a new data shape:

- **Search input**: identical markup/styling to `FilterBar.tsx`'s search box (`h-10 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-sm text-fg`), mirrored to `?q=`.
- **Filters panel**: identical `Sheet`-based pattern to `FilterBar.tsx`'s "Filters" button + panel — City (search + region-grouped list, same grouping logic) and Discipline (chip grid, `deprecated` vocab rows excluded, single-select). No Type section (profiles have no `type`). Badge count on the trigger (`Filters` / `Filters · N`) exactly as Hub does.
- **Result card**: same bordered-card anatomy as `OpportunityRow` (`border border-line rounded-[var(--radius)] bg-bg p-4`, `--space-4` gap between cards) — a card, not a divided list row, matching the Hub card pass.
- **Chips on the card**: `Chip` component, neutral tone, text-only — same six rules as `DESIGN_BRIEF.md` §4.1 (no icons, outline not fill, one treatment per kind of fact, capped at 2–3, consistent height/gap, no hover-lift/shadow).
- **Empty states**: same two-variant convention as Hub (no rows at all vs. no match on filters + reset).

## 2. `app/discover/page.tsx`

### 2.1 Header

```
<h1 className="t-title text-fg">Discover</h1>
<p className="t-body text-muted mt-1">Artists who've made their profile public.</p>
```

Sentence case, factual, no marketing adjective — matches the register of `Circuit`'s subline (`What's on where you'll be.`) and `Hub`'s plain page titles. `.t-title` renders uppercase automatically (existing CSS behavior, not a new casing decision).

Spacing: title → `--space-2` → subline → `--space-5` (24px) → search input. This screen has less inherent density than Hub (no deadline/funding facts to show up front), so don't compress the header-to-content gap just because there's "less" on the page — reach for the Ma principle here, same as Circuit's own form page.

### 2.2 Search + filters row

Directly under the header, in this order, matching Hub's stacking order exactly:

1. Search input, full width, placeholder `Search name or role`. Mirrors to `?q=`.
2. `Filters` trigger button, same visual spec as the fixed Hub bug below — build this one correctly from the start:
   - `min-h-[44px] px-3 border border-line-strong rounded-[var(--radius)] t-meta text-fg hover:border-fg transition-colors` (note: **not** `h-9` — see `docs/design/TASK_07_UX_AUDIT.md` §1 for why the Hub version of this exact button needs a fix; Discover should ship the corrected height directly).
   - Label: `Filters` / `Filters · N` where N = how many of city/discipline are set.
3. `Reset all` text link, right-aligned, shown only when search or a filter is active — same as Hub.

### 2.3 Filters panel (`Sheet title="Filters"`)

Two sections only (no Type):

- **City**: search input (`bg-bg` inside the `bg-surface` sheet, same depth relationship already used in `FilterBar.tsx` and `RADAR_REDESIGN.md` §3.2) + region-grouped list, identical interaction to Hub's city picker. Rows `min-h-[44px]`, selected row `bg-fg text-bg`. Filters `profiles.current_city`.
- **Discipline**: wrapped `Chip` grid, single-select, `vocab` rows where `category = 'discipline' AND deprecated = false` only — zero hard-coded list, per rule 4. Filters `profiles.disciplines` (array-contains).

Footer: `Reset filters` / `Done`, same as Hub's panel.

### 2.4 Result list

Plain vertical stack of cards, `flex flex-col gap-4` (16px, matching `HubFeedView`'s own card gap) — not a grid. A grid would imply comparing profiles by a visual/photo dimension the register doesn't support (most won't have a distinctive avatar), and a single column reads better at 375px without a breakpoint-dependent column-count decision. On desktop the column stays `max-w-[720px]` centered, matching every other content page in the app (Hub, Profile, Circuit) — Discover doesn't need its own wider container.

**Card anatomy** (each card links to `/a/{handle}`):

```
┌─────────────────────────────────────────┐
│ [avatar]  Full Name                       │
│           Role label                      │
│                                            │
│  [Berlin]  [Sound]  [Performance]          │
└─────────────────────────────────────────┘
```

- Row 1: avatar/initials block, `44px × 44px`, `rounded-[var(--radius)] bg-surface border border-line`, initials in `t-meta text-fg` when no `avatar_url` — same visual logic as `PublicProfileView`'s avatar block, scaled down from 112–128px to a list-row size. Next to it, a name column: `full_name` in `t-row text-fg`, `role_label` in `t-meta text-muted` directly below (omit the line entirely if `role_label` is null — don't render an empty meta row).
- Row 2 (tag row, only if at least one value exists): `current_city` display name as one `Chip` (resolve the slug to `markets.display_name` — either via a join in the query or a client-side lookup against the already-fetched `markets` list, the same pattern `FilterBar.tsx` already uses for its own city list) + up to two `disciplines` values as `Chip`s (resolve each slug to its `vocab.label`, same lookup pattern `OpportunityRow.tsx` already uses for `discipline_flags`). Cap at 3 chips total (1 city + up to 2 disciplines) — same cap discipline as Hub cards. If a profile has more than 2 disciplines, show the first 2 only; there is no "detail page" to defer the rest to other than `/a/{handle}` itself, which already lists all disciplines in its own facts block.
- **Nothing else on the card.** No bio excerpt, no follower/following count (never, in any form — not a number, not a tooltip, not an aria-label), no "N works" count, no last-active timestamp. This is the same "precision over coverage" instinct as a Hub card: one line to identify, one line to locate/describe, nothing else until the reader commits to opening the profile (the brief's Nendo reference, §5).

### 2.5 Empty states

Two variants, same convention as Hub's `EmptyState`:

- **No public profiles at all**: `.t-body text-muted`, centered: `No public profiles yet — check back soon.` No action button (there's nothing to reset).
- **No match on the current search/filters**: `.t-body text-muted`: `No profiles match these filters.` + a `Reset filters` action, same styling as Hub's empty-state reset button.

### 2.6 Guests (signed out)

Discover renders identically for signed-out visitors — same cards, same filters, same empty states. The only difference is on the profile page they land on after tapping a card (§3 below), not on Discover itself. Do not add a "sign in to see more" banner or any gating language on this screen; per Task 11 §2, this is public data with the same visibility rule as `/a/[handle]` itself.

---

## 3. Follow button on `/a/[handle]`

Placement: in `PublicProfileView.tsx`'s existing "Actions" row (currently `<ShareLink /> {isOwner && <EditProfileButton/>}`), inserted between `Share` and the owner-only `Edit profile` button:

```
<div className="flex items-center gap-3">
  <ShareLink />
  {!isOwner && isSignedIn && <FollowButton .../>}
  {isOwner && <Link href="/profile/edit"><Button variant="secondary">Edit profile</Button></Link>}
</div>
```

- **Not signed in, or viewing your own profile**: omit entirely — no disabled state, no "sign in to follow" prompt. Exactly matches Task 11 §3's instruction and mirrors how `Share` behaves for everyone (present) versus how Follow behaves (present only when it can actually do something).
- **Signed in, not following yet**: plain ghost text, same visual weight as `Share` — `t-meta text-muted hover:text-fg`, label `Follow`. This is deliberately quiet; it's a secondary action next to Share, not a competing call-to-action on a page that has no primary action of its own.
- **Signed in, already following**: label flips to `Following`, styling flips to `border-accent text-accent` — this is the one new accent placement from `docs/DECISIONS.md`'s "Task 07 — accent rule, final" entry (rule 4): accent here means "you already follow this person," parallel to how it already marks "you already saved this" elsewhere in the app.
- **Tap target**: build this as a real `min-h-[44px] inline-flex items-center` control, not a bare text node the way `ShareLink.tsx` is today (that component has no explicit hit area at all). Don't copy `ShareLink`'s markup verbatim — match its *visual* weight (plain text, no border in the default state) while giving `Follow`/`Following` a proper padded tap area. This is a new interactive element, so it should ship compliant from the start rather than repeat an existing gap.
- **No count, ever.** Not next to the button, not in a tooltip, not in an `aria-label` (e.g. don't write `aria-label="Follow, 42 followers"` — the `aria-label`, if any, should just be `Follow {full_name}` / `Unfollow {full_name}`).
- **Toggle behavior**: mirror `SaveOpportunityButton.tsx`'s existing pattern exactly (local optimistic state flip, Supabase insert/delete, `router.refresh()` on settle, revert local state on error) — this is an implementation note for the Frontend Engineer, not a new interaction to design.

---

## 4. What this does not add

No follower/following count anywhere (Discover cards, profile page, tooltip, or accessible name). No messaging affordance. No activity feed. No "N mutual" or similar social-graph hint. No image/photo grid treatment on Discover cards. No nav-bar entry point is specified here — Task 11 doesn't ask for one, and this spec doesn't add a fifth item to the four-item mobile tab bar (`Hub · Currently · Saved · Profile`); how a user reaches `/discover` (a link from `/profile/edit`, from Hub, or elsewhere) is a product/IA decision outside this visual spec's scope — flag it back to the task owner if it's still open when this ships.
