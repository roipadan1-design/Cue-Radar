# Sources directory — screen spec (Task 14)

Status: spec only. No application code changed by this document.
Audience: written for a Frontend Engineer agent to implement `app/sources/page.tsx` without guessing.
Reads against: `docs/HANDOFF_V3.md`, `docs/design/DESIGN_BRIEF.md`, `app/globals.css`, `docs/tasks/TASK_14_sources_directory.md`, `docs/DECISIONS.md` ("Task 12 — Israel-only pilot pivot," §4), and the current code in `components/hub/FilterBar.tsx`, `components/hub/OpportunityRow.tsx`, `components/ui/{Sheet,Chip,Button}.tsx`. Reuses these components; introduces no new ones.
Structural reference: [artconnect.com/discover/organizations](https://www.artconnect.com/discover/organizations) — browsed directly (mobile 375px and desktop) 2026-09-18 for this spec. Structure adapted; visual treatment (color/font/copy) stays Fellow.'s own — see §0.
Date: 2026-09-18.

---

## 0. What was studied on ArtConnect, and the structural-copy-vs-brand-copy line

ArtConnect's `/discover/organizations` is a searchable directory of institutions (galleries, museums, residencies, foundations) that links out to a per-institution profile page. Its shape, observed directly:

- A page header: one bold title ("Discover Art Organizations") + one factual sub-line describing what the list is for.
- Directly under the header: three filter inputs on desktop (organization-type dropdown, "search by name" text field, "search by city or country" text field), collapsed behind a single filter-icon trigger on narrower widths.
- A vertical list of result rows, each: a logo/avatar circle (blank when no image), the institution name in bold, a small type label (rendered as a filled colored pill — e.g. "GALLERY", "FOUNDATION", "NONPROFIT" — or plain text "Art Organization" when no type is set), the city/country on the same line, and a "View Profile →" action on the trailing edge.
- Result rows are plain bordered/divided list rows, not heavy image-forward cards — there is no photo grid, no stats, no follower count.

**What is borrowed (structure only):** the overall page shape (header → search/filter row → result list, each row linking to a detail page), the row anatomy (identity block on the left, one type-defining label, one location fact, a trailing action), and the pattern of collapsing multi-field filtering behind one control on narrow viewports.

**What is not borrowed, ever:** ArtConnect's actual copy ("Discover Art Organizations", "Explore galleries, museums, and residencies..."), its colored/filled type pills, its logo, its font, or any of its scale claims. Every color and type style below resolves to a token already in `app/globals.css` or a style already in the Fellow. component set.

---

## 1. What this reuses, exactly

No new interaction pattern anywhere on this screen. Every piece below is an existing Fellow. component or an existing layout convention applied to a new data shape (same posture as `docs/design/DISCOVER_V1_SPEC.md` §1 for the parallel Discover/profiles screen):

- **Search input**: identical markup/styling to `FilterBar.tsx`'s search box (`h-10 px-3 bg-surface border border-line rounded-[var(--radius)] t-body text-sm text-fg`), mirrored to `?q=`, placeholder `Search institutions` per Task 14 §3.
- **Filters panel**: identical `Sheet`-based pattern to `FilterBar.tsx`'s "Filters" button + panel. Two sections only: **City** (search input + region-grouped list, same grouping logic, sourced from `markets` — zero hard-coded cities, per `AGENTS.md` rule 4 and the Israel-only pivot's own instruction not to hardcode which cities appear) and **Discipline** (chip grid, `vocab` rows where `category = 'discipline' AND deprecated = false`, single-select, array-contains against `sources.discipline_focus`). No Type section — `source_type` has no live `vocab` category (Task 14 §3 explicitly does not add one), so there is nothing to build a filter chip grid from; see §3 below for how the raw value still appears on the card face.
- **Result card**: same bordered-card anatomy as `OpportunityRow` (`border border-line rounded-[var(--radius)] bg-bg p-4`, `--space-4` gap between cards) — the whole card is the link (`<Link>` wrapping the card, matching `OpportunityRow`'s own pattern), not a separate "View Profile" button. This is a deliberate simplification from ArtConnect's row-plus-trailing-button anatomy: Fellow.'s existing cards (Hub, Discover) never repeat a link affordance as a second element when the whole card already is one — adding a "View profile →" button here would be the exact "icon/affordance repeating what's already interactive" pattern `DESIGN_BRIEF.md` §6 rules out for tags, and the same logic applies to a redundant CTA.
- **Chips on the card**: `Chip` component, neutral tone, text-only — same six rules as `DESIGN_BRIEF.md` §4.1 (no icons, outline not fill, one treatment per kind of fact, capped at 2–3, consistent height/gap, no hover-lift/shadow). This directly replaces ArtConnect's filled colored type pill — Fellow. has exactly one chip visual language, used everywhere, never a second colored-pill system for "type."
- **Empty states**: same two-variant convention as Hub (no rows at all vs. no match on filters/search + reset).

## 2. `app/sources/page.tsx`

### 2.1 Header

```
<h1 className="t-title text-fg">Sources</h1>
<p className="t-body text-muted mt-1">Institutions running opportunities on Fellow.</p>
```

Sentence case, factual, no marketing adjective — same register as `Discover`'s subline (`DISCOVER_V1_SPEC.md` §2.1). Page title is `Sources`, not "Institutions" or "Directory" — matches the route name and the existing internal vocabulary (`sources` table, `source_name` field already shown on every Hub row and opportunity detail page), so a user who has already seen "source" as a word in the product isn't handed a second synonym for the same concept.

Spacing: title → `--space-2` → subline → `--space-5` (24px) → search input, identical rhythm to Discover's header (`DISCOVER_V1_SPEC.md` §2.1) and to the Ma principle in `DESIGN_BRIEF.md` §2.1 — this screen, like Discover, has less inherent per-row density than Hub, so the header shouldn't be compressed just because there's "less" content below it.

### 2.2 Search + filters row

Directly under the header, same stacking order as Hub and Discover:

1. Search input, full width, placeholder `Search institutions` (Task 14 §3's exact copy). Mirrors to `?q=`, filtering server-side against `sources.name` via `.ilike`.
2. `Filters` trigger button — build this with the corrected height from the start (see `docs/design/TASK_07_UX_AUDIT.md` §1 for why the Hub original needs a fix): `min-h-[44px] px-3 border border-line-strong rounded-[var(--radius)] t-meta text-fg hover:border-fg transition-colors`. Label: `Filters` / `Filters · N` where N = how many of city/discipline are set (max 2).
3. `Reset all` text link, right-aligned, shown only when search or a filter is active — same as Hub/Discover.

### 2.3 Filters panel (`Sheet title="Filters"`)

Two sections, per §1 above — City and Discipline, identical footer (`Reset filters` / `Done`) to Hub's and Discover's panels. Do not add a third section for `source_type`; per Task 14 §3/§4, that gap is inherited, not this task's or this spec's to paper over with an invented vocab list.

### 2.4 Result count line

`.t-meta text-muted`: `Showing {filtered} of {all}` — same convention and exact phrasing as Hub's own count line (`AGENTS.md` rule 4: never a hard-coded or static number). Sits directly above the result list, `--space-4` below the search/filters row.

### 2.5 Result list

Plain vertical stack of cards, `flex flex-col gap-4` (16px) — not a grid, for the same reason `DISCOVER_V1_SPEC.md` §2.4 gives for profiles: most sources have no distinctive image (no image pipeline exists for sources any more than it does for opportunities, per `DESIGN_BRIEF.md` §4.1's "on imagery" note), so a single column avoids implying a visual-comparison dimension the data doesn't support. Desktop container stays `max-w-[720px] mx-auto`, matching every other content page.

**Card anatomy** (each card links to `/sources/{source_id}`):

```
┌─────────────────────────────────────────┐
│ Institution name                          │
│ Institution · Tel Aviv                    │
│                                            │
│  [Dance]  [Performance]  [Demo]           │
└─────────────────────────────────────────┘
```

- Row 1: `name` in `t-row text-fg line-clamp-2` — same title treatment as `OpportunityRow`'s title, no avatar/logo circle. This is a deliberate departure from ArtConnect's logo-circle-plus-name row: Fellow. has no logo/image data for `sources` at all (not even an empty-state placeholder concept exists elsewhere in the app for institutions — `PublicProfileView`'s avatar block is person-specific), and per `DESIGN_BRIEF.md` §4.1's anti-goal, an empty circle "to make a card feel complete" is worse than no circle. Type does the work of visual interest here, same principle as Hub cards.
- Row 2 (meta line, always present): `.t-meta text-muted`: `{source_type raw value, title-cased for display only} · {city_name}` — e.g. `Institution · Tel Aviv`. Per Task 14 §3, do not invent a vocab label for `source_type`; render the column's own value as plain text (a simple `.charAt(0).toUpperCase() + .slice(1)` display transform is a presentation nicety, not inventing data — the underlying value is unchanged). If `city_name` is null (a source with no market assigned), show only the type, no dangling separator.
- Row 3 (tag row, only if at least one value exists): up to two `discipline_focus` values resolved to their `vocab.label` (same lookup pattern `OpportunityRow.tsx` already uses), plus a `Demo` chip when `is_demo` is true (neutral tone, same treatment `OpportunityRow` and `SOURCE_DETAIL_SPEC.md` §2 already use for the same flag). Cap at 3 chips total, same discipline as every other card in the app. If a source has more than 2 disciplines, show the first 2 only — the rest are visible on `/sources/{id}` itself.
- **Nothing else on the card.** No opportunity count, no "last verified" date, no notes excerpt. Precision over coverage (`DESIGN_BRIEF.md` §2.4): the directory's job is to help someone decide which institution to open next, not to summarize everything about it here.

### 2.6 Empty states

Two variants, same convention as Hub's `EmptyState`:

- **No sources at all**: `.t-body text-muted`, centered: `Sources are being curated — check back soon.` — same phrasing pattern as Hub's own "no rows at all" state (`docs/design/DESIGN_BRIEF.md` references this convention; matches `HANDOFF_V3.md`'s "the feed is being curated" language). No action button.
- **No match on the current search/filters**: `.t-body text-muted`: `No institutions match these filters.` + a `Reset filters` action, same styling as Hub's/Discover's empty-state reset button.

### 2.7 Guests (signed out)

Renders identically for signed-out visitors — `sources` is a publicly-readable curated table per `HANDOFF_V3.md` Part D, same visibility posture as Hub and Discover. No gating language, no "sign in to see more" banner.

## 3. Entry point

Per Task 14 §3's last bullet, add a plain text link from `app/opportunities/[slug]/page.tsx`'s existing source-name area if no other entry point is specified elsewhere by the time this is implemented. Visual treatment: same as any other inline text link in the app (`hover:underline hover:underline-offset-4`, `focus-visible` gets the standard ring) — do not add a second, competing "browse all sources" button near it. A single small text link (`Browse institutions`, sentence case, `t-meta text-muted`) directly under or beside the existing source-name line is sufficient; do not add a new nav-bar item — the mobile tab bar stays four items (`Hub · Currently · Saved · Profile`), same constraint `DISCOVER_V1_SPEC.md` §4 already applies to `/discover`.

## 4. What this does not add

No image/logo pipeline for institutions. No "N opportunities" count on the card (defer to `/sources/{id}`'s own "Past calls" section, per `SOURCE_DETAIL_SPEC.md`). No sort control (ArtConnect's desktop list has a "Sort: Deadline soonest" dropdown — not applicable here since sources have no deadline; alphabetical-by-name via the default query order is sufficient and needs no UI control). No merge with `/discover`'s filter logic or route, beyond incidentally reusing `FilterBar`/`Sheet`/`Chip` — per Task 14 §4, these stay two separate directories for two separate tables.
