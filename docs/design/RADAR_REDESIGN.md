# Circuit redesign — spec and research

Status: research and specification only. No application code changed by this document.
Audience: written for a Frontend Engineer agent to implement without guessing, and for the owner to react to before anyone builds it — same workflow as the Hub card pass (`docs/design/DESIGN_BRIEF.md` §4.1, §6.3) and the profile portrait/gallery pass.
Scope: `app/radar/page.tsx` (the city + date form) and `app/radar/[city]/page.tsx` + `components/radar/EventRow.tsx` (the three-section results page). Does not touch the Circuit *concept* — city, date window, three sections — only its visual execution.
Reads against: `docs/design/DESIGN_BRIEF.md`, `docs/design/AESTHETIC_REFERENCES.md` (both assumed read; this document does not repeat their general principles, only applies them).
Date: 2026-09-17.

---

## 1. What's weak about the current execution

This section is tied to exact files and lines, not impressions.

### 1.1 `/radar` — the form (`app/radar/page.tsx`, `app/radar/RadarForm.tsx`)

1. **The city picker is a bare native `<select>`.** `RadarForm.tsx` lines 44–58: `<select className="h-11 px-3 bg-surface border border-line ...">`. The border, background and label are styled, but the moment a real user taps it, the browser takes over completely — an OS-native list with OS-native type, OS-native row height, none of it under Fellow.'s control. This is the single biggest visual break in the whole app: every other interactive surface (chips, buttons, cards) is drawn by the design system; this one hands off to the operating system. It is also the *primary* input on Circuit's front door — unlike Hub, where a native `<select>` only exists inside a secondary filter sheet (`components/hub/FilterBar.tsx` line 193), here it's one of two things on the entire page.
2. **The date range is two native `<input type="date">` fields** (`RadarForm.tsx` lines 64–79). Same problem, doubled: on iOS this renders a spinning wheel, on Android a system dialog, on desktop Chrome a small calendar glyph — none resembling Archivo/Manrope, none respecting `--radius: 2px`, none matching the app's own dark surfaces. A date range is Circuit's second core input (after city) and currently gets zero custom design.
3. **The page title is mis-rendering relative to the rest of the app.** `page.tsx` line 41: `<h1 className="t-title text-fg text-2xl font-semibold">`. `.t-title` (`app/globals.css` lines 97–109) already sets `font-size: 22px` and `font-weight: 800`. Tailwind v4's layer order is `base → components → utilities`; `.t-title` lives in `@layer components` (globals.css line 82), while `text-2xl` and `font-semibold` are utilities — utilities win. The header is therefore actually rendering at **24px / weight 600**, not the 22px/800 every other `t-title` header in the app uses (compare `components/hub/HubFeedView.tsx` line 64: `<h1 className="t-title text-fg">Opportunities</h1>`, no overrides). This is a real, checkable bug, not a style preference — it makes "Circuit" quietly lighter and slightly bigger than "Opportunities" a tab away. `app/radar/[city]/page.tsx` line 126 has the identical bug.
4. **The page reads as a stub, not a front door.** After the title and one muted line, the entire remaining page is two form controls and a button inside `max-w-[400px]` — on a 720px container (`page.tsx` line 39) that leaves roughly half the desktop viewport as dead space, and on mobile it's just... a form. Compare to Hub's header, which layers three tiers of information (date / title / live counts, `HubFeedView.tsx` lines 62–66) before any interaction is asked of the user. Circuit asks for input immediately with no sense of what's on the other side of it.
5. **No hierarchy between "where" and "when."** Nothing on the page signals that city is the primary decision and date is a refinement of it — both fields look identical (same height, same border, same label style), competing equally for a first-time user's attention.

### 1.2 `/radar/[city]` — the results page (`app/radar/[city]/page.tsx`, `components/radar/EventRow.tsx`)

6. **City and date range are squeezed into one line of heavy display type**, `page.tsx` lines 126–128: `{market.display_name} · {formatHeaderDate(from)} – {formatHeaderDate(to)}` set entirely in `.t-title` (Archivo 800, uppercase, tight tracking). Two different kinds of fact — a place and a time window — get identical visual weight, and digits (`17 Sep – 1 Oct`) render in an uppercase display face with no `t-num` tabular treatment, which is the wrong typographic tool for numerals (the design brief reserves `t-num` for exactly this, §3).
7. **Section headers are hand-rolled instead of reusing `GroupHeader`.** `page.tsx` lines 140, 153, 166 each write `<h2 className="t-meta text-muted mb-1 pb-2 border-b border-line">{label} · {count}</h2>` directly, when `components/hub/GroupHeader.tsx` already exists, is already used for the structurally identical job on Hub (sticky, backdrop-blur, `t-num` count), and is literally imported one line away (`OpportunityRow` is imported from `hub`, `GroupHeader` isn't). Result: Circuit's section headers don't stick on scroll, and the counts aren't set in tabular numerals — a small but real inconsistency between two screens that should feel like the same product.
8. **The page mixes two different row anatomies in three adjacent sections.** Section 1 ("Closing while you're there") renders `OpportunityRow`, which — as of the Hub card pass — is a bordered card (`border border-line rounded-[var(--radius)] bg-bg`, `components/hub/OpportunityRow.tsx` line 91) with an outlined tag row. Sections 2 and 3 render `EventRow`, which is still the *pre-card* anatomy: a bottom-divided row (`py-4 border-b border-line`, `components/radar/EventRow.tsx` line 48) with no card boundary at all. Scrolling from section 1 to section 2 on this single page is scrolling from the new design language straight back into the old one — this is the clearest, most literal evidence that Circuit "looks basic": it isn't that the whole page uses an outdated pattern, it's that half of it visibly does, right next to the half that doesn't.
9. **`EventRow`'s meta line repeats the exact anti-pattern the Hub card pass just fixed.** `EventRow.tsx` lines 38–45 joins type, date/time, price and the demo flag into one `.t-meta` string with `' · '` (`typeLabel · date/time · price · Demo`) — the same "second summary crammed into one run-on line" problem `docs/design/DESIGN_BRIEF.md` §4.1 and §6.3 rule 4 already diagnosed and fixed for `OpportunityRow`'s old tag line. Worse here: date/time is the single most decision-relevant fact on a *Circuit* row (the whole feature is "what's on while I'm in this window") and it's buried mid-string in muted 11px type, same visual weight as the venue's ticket price.
10. **No differentiator tag for events**, unlike opportunities. `OpportunityRow` surfaces one decision-relevant fact per card (funded / no-fee, `getDifferentiatorTag`, lines 57–65). Events have an equally clear analog — free vs. paid entry — but it's currently just folded into the same run-on meta string as everything else, not given its own visual position.

---

## 2. Reference research (visited live at 375px)

`docs/design/AESTHETIC_REFERENCES.md` and `DESIGN_BRIEF.md` already cover the general Japanese-minimalist references and the owner's two card references (Perform Europe, Backstage) — those still apply to Circuit's cards and aren't repeated here. This section is scoped to what's specific to city/date/mixed-event discovery, visited live rather than judged by name.

### 2.1 Resident Advisor — `ra.co/events/de/berlin` (primary reference)

RA is already Fellow.'s own named precedent (`HANDOFF_V3.md` Part C) and turns out to be the single most directly transferable reference for Circuit specifically — it is, structurally, the same product: pick a city, see a date-ordered mix of things happening there, on a dark canvas.

**What to borrow, concretely:**
- **Date as the structural axis, not a field.** Below RA's filter row, every event is grouped under a bold date heading (`THU, 17 SEP`, set in the same weight class as a section title, accompanied by a single diagonal accent mark and a hairline rule) before any event content appears. Time/date is never buried inside a row — it *is* the row's context. For Circuit, where city is already fixed by the URL, date is the only remaining axis of variation within a section — the redesign should make date the loudest fact on an event row (§4.3 below), the same job RA gives it at the section level.
- **The city picker is a full-text-search sheet, not a native `<select>`.** Tapping the city name opens a dedicated overlay: a large `t-display`-scale "Type here" input at the top, a "Near you" quick option, then a plain list of place names (no chrome beyond a hairline separator per row). This is the direct precedent for replacing Circuit's `<select>` with a searchable sheet (§3.1).
- **Date range as quick presets plus a calendar, not two raw inputs.** RA's "Date" filter opens a sheet with a single preset chip (`This weekend`) above a real inline month calendar, and a `Reset` / `Show N results` action pair at the bottom. The presets are the fast path; the calendar is the fallback for anything unusual. Circuit doesn't need a full custom calendar grid (see §3.2 for why), but the two-tier idea — fast preset first, precise control second — is the exact fix for Circuit's two bare date inputs.
- **Event rows stay quiet and text-only below the "Popular" carousel** — pin-icon-and-venue-name, a small organizer tag, an attendee count, nothing else — reinforcing that a dense date-grouped list doesn't need imagery or color to feel considered once the date hierarchy and spacing are right.

**What not to borrow:** RA's location pin icons, its red/urgent accent used decoratively across several unrelated elements (event highlight color, "RA Pick" badge, calendar's selected-day color, brand mark) is not a one-signal system the way `docs/design/AESTHETIC_REFERENCES.md` §3.9 asks Fellow. to hold itself to — don't import multiple decorative uses of a single accent color; Fellow.'s own `--urgent`/`--accent` discipline is stricter than RA's and should stay that way.

### 2.2 Time Out — `timeout.com/berlin/things-to-do` (secondary, smaller borrow)

Visited for one structural idea only: light-mode, red-branded editorial design, **not a visual model for Fellow.** (explicitly noting this so it isn't mistaken for a palette reference the way Backstage was in the Hub research). The one transferable idea: a city switcher (`BERLIN ▾`) sits directly above a row of category tabs (`Things to do / Restaurants / Bars & nightlife / Hotels`) — location and category-of-content are visually stacked, location on top, content type immediately below it. This validates (not introduces) Circuit's own existing top-to-bottom order — city first, then the three content sections — as the right default sequence; no tab pattern is being proposed (see §4.2 for why stacked sections stay, not tabs).

---

## 3. Redesign direction — `/radar` (the form)

Everything below stays inside the existing token system: no new colors, no new radius, no new font, no new dependency. Every interactive pattern reuses a component that already exists in the codebase (`Sheet`, `Chip`, `Button`) rather than inventing a new one.

### 3.1 Header

- Row 1: remove the current single muted subline's isolation — keep it, but promote the title above it. `<h1 className="t-display text-fg">Circuit</h1>` (drop the erroneous `text-2xl font-semibold`, see finding 3). This is the first interior-page use of `.t-display` outside the landing hero and the profile name (`components/profile/PublicProfileView.tsx` line 103) — both existing precedents for "the one identifying headline of a page." Circuit's front door has no urgency color, no dense list, nothing else competing for attention yet, so its title is the legitimate place to spend the "one loud thing per screen" budget (`DESIGN_BRIEF.md` §2.3). Flagged explicitly in §6 for a one-line owner nod, since it's a new structural role for an existing token, not a token change.
- Row 2: keep the existing line, unchanged copy, `t-body text-muted`: `What's on where you'll be.`
- Vertical rhythm: title → `--space-2` (8px) → subline → `--space-6` (32px) → form. Reach for the larger end of the spacing scale here per the Ma principle — this page has almost nothing on it; let that be legible as intentional, not unfinished.

### 3.2 City field

Replace the native `<select>` with a pressable row that opens the existing `Sheet` component.

**Closed state** (sits where the `<select>` sits today):
- Label above, unchanged: `t-meta text-muted`, `City`.
- Row: full width, `h-14` (56px — taller than a standard input, since this is the primary decision on the page), `bg-surface border border-line rounded-[var(--radius)]`, `px-4`, flex row `justify-between items-center`.
- Left: selected city's `display_name` in `t-row text-fg` (e.g. `Berlin`).
- Right: a plain text chevron glyph (`⌄`), `text-muted`, no icon import — it signals "opens something," the same job the native select's own disclosure arrow did, without adding a decorative icon.
- `hover:border-fg`, focus ring per the standard `2px solid var(--fg)`.

**Sheet** (`title="Choose a city"`):
- Search input at top: same visual treatment as the Hub search box (`h-10 bg-bg border border-line rounded-[var(--radius)] t-body text-sm text-fg`) — use `bg-bg`, not `bg-surface`, for controls *inside* the sheet, since the sheet itself already sits on `bg-surface` (`components/ui/Sheet.tsx` line 61); `bg-bg` gives the search field a hairline of depth against its container using only the existing border token, no new value. Filters the already-loaded `markets` list client-side (no new fetch — the full list is already passed into `RadarForm`).
- Below: cities grouped by `region` exactly as today (`optgroup` logic in `RadarForm.tsx` lines 27–32 becomes a plain grouped list), each region label `t-meta text-muted`, `--space-4` above each group.
- Each city is a full-width pressable row, `min-h-[44px]`, `t-body text-fg`, `rounded-[var(--radius)]`. Selected city gets `bg-fg text-bg` — the exact same active-state treatment `Chip.tsx` already uses (line 27) — so "selected" means the same thing everywhere in the app, not a new visual language for this one sheet.
- Tapping a city **selects and closes in one action** — no separate "Done" step. This is a single-value picker, unlike Hub's filter sheet, which genuinely needs an explicit "Done" boundary because several independent toggles are being set at once (`FilterBar.tsx` lines 220–226). Don't copy that footer here; it would add a tap for no reason.

### 3.3 Date range

Replace the two always-visible native date inputs with a preset chip row (reusing `Chip.tsx` exactly as `FilterBar.tsx` already does) plus an optional inline "custom" reveal — not a full custom calendar grid, and not two bare inputs as the default.

- Label above, `t-meta text-muted`: `Dates`.
- A horizontally-laid chip row (wraps on narrow screens rather than scrolling, since there are only five options): `Next 2 weeks` · `This weekend` · `Next 7 days` · `Next 30 days` · `Custom`.
- Exactly one chip is active (`bg-fg text-bg`, same `Chip` active state) at a time, computed client-side by comparing the current `from`/`to` state to each preset's computed range — no chip active only when the state doesn't match any preset (e.g. a signed-in artist's profile dates loaded via `defaultFrom`/`defaultTo`, `page.tsx` lines 29–36).
- Default on load (guest, no profile dates): `Next 2 weeks` active, matching the existing server-computed default (today → +14 days, `page.tsx` lines 27–36) — this requires no new default logic, only reflecting the existing one in a chip instead of two silent date inputs.
- Tapping `Custom` reveals — inline, directly below the chip row, `mt-3`, not in a sheet — the two existing native date inputs side by side (`grid grid-cols-2 gap-3`, same styling as today: `h-11 bg-surface border border-line`). This is the one place native date-picker chrome is still acceptable: it's now an opt-in secondary path for an unusual range, not the first thing a user sees, mirroring RA's own "preset first, calendar second" hierarchy (§2.1) without the cost of building a full custom calendar component — a reasonable, disciplined trade given the no-new-dependency rule and that this is the lower-traffic path.
- Below the chip row (or below the custom fields, when expanded), a one-line factual readback in `t-meta text-muted`, digits in `t-num`: `17 Sep – 1 Oct`. This lets an artist confirm the exact window without opening anything, whichever path set it — the "one or two facts, not a second UI" instinct applied to a date range.

### 3.4 Submit

- `Button variant="primary"` unchanged as a component; override className to `w-full h-12` (up from the current implicit height) — the single terminal action on an otherwise quiet page earns a slightly more confident height than a default `h-10` button, still inside the existing radius/color tokens.
- Copy: change `Explore city` → `See what's on`. Tighter register match with the page's own subline (`What's on where you'll be.`) and with the plainer, more factual verb register already set by `Browse open calls` on the landing page (`docs/tasks/TASK_06_pilot_readiness.md` §3) — "Explore" leans slightly more marketing-adjective than the rest of the app's copy voice.

### 3.5 Desktop

Container stays `max-w-[720px]` (unchanged, matches Hub/Profile). Form column widens slightly from `max-w-[400px]` to `max-w-[440px]` — a small, considered cap, not full-width — so the now-larger `t-display` title has enough measure to breathe above it without the page trying to invent a second column that doesn't exist anywhere else in the app.

---

## 4. Redesign direction — `/radar/[city]` (the results page)

### 4.1 Header

Split the single squeezed line into two tiers, mirroring the hierarchy Hub already establishes between its title and its meta line:

- Breadcrumb, unchanged: `← Circuit`, `t-meta text-muted`.
- Row 2, `t-title text-fg` (drop the erroneous `text-2xl font-semibold`, finding 3): the city name alone, e.g. `BERLIN`. This is the "where," and it's the loud element on this page — the equivalent role Hub's urgency-red plays on a Hub row, except here there's no per-row color competing with it, so the city name can safely be the one loud thing for the whole screen.
- Row 3, `t-body text-muted`, digits wrapped in `t-num`: the date window plus a day count, e.g. `17 Sep – 1 Oct · 15 days` — the "when," quieter and smaller, factual rather than decorative. Mirrors the profile page's own established phrasing pattern for a date-bound window (`Currently in {city} until {date}`, `components/profile/PublicProfileView.tsx` line 120) — Circuit and Profile should sound like the same product when they say similar things.
- Spacing: breadcrumb → `--space-2` → city → `--space-1` → date line → `--space-6` before the first section.

### 4.2 Sections stay stacked, not tabbed

Worth stating explicitly since Time Out (§2.2) uses tabs for its mixed-category content: Circuit's three sections stay as stacked, always-visible sections, not tabs. Reasoning: unlike Time Out's dozens of categories, Circuit has exactly three, empty ones already don't render (existing behavior, `page.tsx` `hasAnyContent` logic), and an artist deciding "what's worth knowing about in this city, right now" benefits from seeing all three kinds of thing in one scroll — that's the whole cross-discipline premise of Circuit per `DESIGN_BRIEF.md` §1. Tabs would hide two-thirds of the answer behind a tap for no real density problem (a city/date window realistically returns a handful of rows per section, not hundreds).

### 4.3 Section headers — reuse `GroupHeader`, don't hand-roll

Replace all three hand-written `<h2>` blocks (`page.tsx` lines 140, 153, 166) with the existing `components/hub/GroupHeader.tsx`, passed the same copy already in use:

```
<GroupHeader label="Closing while you're there" count={closingOpportunities.length} />
<GroupHeader label="Workshops & classes" count={workshopsAndClasses.length} />
<GroupHeader label="On stage & exhibitions" count={stageAndExhibitions.length} />
```

This is a one-line swap per section that fixes the sticky/backdrop-blur behavior and the tabular-numeral count for free — no new component, no new visual language, just using the one that already exists for the identical job.

### 4.4 `EventRow` — bring it up to the same card anatomy as `OpportunityRow`

This is the highest-value single change on this page (finding 8) — it's what makes Circuit stop visually contradicting itself mid-scroll. Same boundary, same tag rules, same "no icons / outline not fill / cap at two–three" discipline `DESIGN_BRIEF.md` §4.1 already specified for opportunities, applied to events:

- **Card boundary:** `border border-line rounded-[var(--radius)] bg-bg p-4` (identical to `OpportunityRow.tsx` line 91), replacing `py-4 border-b border-line`. Section wrapper becomes `flex flex-col gap-4` (16px between cards) instead of the current edge-to-edge divided stack — same gap value `HubFeedView.tsx` line 71 already uses for opportunity cards.
- **Content order, top to bottom:**
  1. `t-row text-fg` title, 2-line clamp — unchanged.
  2. `t-body text-muted` venue name — unchanged, same tier as `OpportunityRow`'s `source_name · city` line.
  3. **New tag row**, replacing the run-on `.t-meta` string (finding 9): one or two outline chips, same `Chip` component, same treatment as `OpportunityRow`'s tag row —
     - `{type label}` (from `vocab`, e.g. `Workshop`), always shown, neutral tone.
     - `Free` chip, `tone="accent"`, shown only when `price_min === 0` — the event-side equivalent of `OpportunityRow`'s funded/no-fee differentiator (finding 10), inheriting whatever `--accent` resolves to once Task 03 sets it, exactly like the Hub's own tag already does. When the event isn't free, no differentiator chip is shown here — the actual price moves to the bottom row instead (below), not duplicated in both places.
     - `Demo` chip, neutral tone, shown only when `event.is_demo` — same dry/descriptive treatment as discipline/city tags, not a stronger color (rule 3, §4.1 of the brief: discipline, type, and demo-status are all the same *kind* of fact).
  4. **Bottom row**, split left/right like `OpportunityRow`'s funding/deadline line (`OpportunityRow.tsx` lines 106–129): date and time on the left in `t-num text-fg font-medium` — e.g. `Sat 20 Sep · 18:00` — this is the loudest fact on the row, deliberately, because date-in-window is the entire premise of this feature (§2.1's borrowed principle, applied at row level instead of RA's section level, since Circuit's per-section volume is too small to warrant a second grouping tier). Price sits right-aligned, `t-meta text-muted`, and is **only rendered here when there's an actual figure to show** (e.g. `From €12`) — when the event is free, that fact already lives in the tag row above and isn't repeated (Muji's "one fact, printed once," `AESTHETIC_REFERENCES.md` §3.1).
  5. Actions row (`Tickets` / `Add to calendar`) — unchanged position, copy, and `min-h-[44px]` tap targets.

### 4.5 What doesn't change

- The three-section split and its underlying query logic (`page.tsx` lines 74–118) — out of scope, this is a visual pass only.
- `EmptyState` usage and the combined `hasAnyContent` check — already correct per the existing "empty groups not rendered" rule.
- `Demo` page-level behavior, ICS download route, ticket links — unchanged.

---

## 5. Implementation notes

- **No new dependency, no new component.** Every pattern above reuses `components/ui/Sheet.tsx`, `components/ui/Chip.tsx`, `components/ui/Button.tsx`, and `components/hub/GroupHeader.tsx` exactly as they already exist elsewhere in the app. The only net-new markup is the city-sheet's grouped list and the event card's tag/bottom-row layout — both assembled from existing primitives (flex/grid + existing classes), not new components.
- **No new color pairing.** Every combination used above already ships elsewhere in the app: `t-meta` muted-on-`bg`, `Chip` active `bg-fg`/`text-bg`, `Chip` accent tone `border-accent`/`text-accent`, `Sheet`'s `bg-surface` container with `bg-bg` interior fields (a depth relationship, not a new pairing — `bg-bg` inside `bg-surface` is the same directional logic the app already uses, just applied to a form field instead of a card). Nothing here requires a new contrast computation for `docs/DECISIONS.md` under the standing rule, since nothing here is a *new* muted-on-surface combination.
- **The two Tailwind-utility bugs in finding 3** (`text-2xl font-semibold` fighting `.t-title` on both `page.tsx` line 41 and `[city]/page.tsx` line 126) should be fixed as part of this pass regardless of anything else here — it's a one-line correction per file, and it's currently making both Circuit headers quietly wrong relative to the rest of the app.

---

## 6. Open questions for the owner

1. **`.t-display` for the `/radar` page title (§3.1).** This would be the third context `.t-display` appears in (landing hero, profile name, now here) — not a token change, but a new structural role for an existing type style, worth a one-line confirmation before it's built, per the brief's own standard for anything that isn't purely mechanical.
2. **The `Free` chip's `tone="accent"`** on event cards (§4.4) inherits whatever `--accent` ends up being from Task 03, same as Hub's own tag already does. No new decision is being made here, just flagging that this pass adds a second live consumer of the still-placeholder accent value.
3. **Button copy: `Explore city` → `See what's on`** (§3.4) — a small copy change, not load-bearing to the redesign, called out separately in case the owner prefers to keep the existing verb.
