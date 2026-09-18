# Source detail page — layout spec (Task 09)

Status: spec only. No application code changed by this document.
Audience: written for a Frontend Engineer agent to implement `app/sources/[id]/page.tsx` without guessing.
Reads against: `docs/design/DESIGN_BRIEF.md`, `app/globals.css`, `docs/tasks/TASK_09_source_detail_page.md`, `docs/tasks/TASK_14_sources_directory.md`, `docs/DECISIONS.md` ("Task 12 — Israel-only pilot pivot," §4/§6), and the current code in `components/hub/OpportunityRow.tsx`, `components/hub/OpportunityDetailView.tsx`, `components/ui/Chip.tsx`. Assumes `opportunities.expected_next_open` and the `recurrence` column exist per Task 08 (this spec does not touch the migration).
Structural reference: an ArtConnect institution profile page (e.g. `artconnect.com/district-gallery`) — browsed directly 2026-09-18. See §1a (added 2026-09-18) for what changes because of it.
Date: 2026-09-17, amended 2026-09-18.

Mobile is the primary target throughout: every measurement below is written for ~375–390px first, `md:` values are desktop widenings only.

---

## 1. Overall shape

Same container and rhythm as every other content page in the app: `max-w-[720px] mx-auto px-4 md:px-6 py-6` (matches `OpportunityDetailView`'s own wrapper).

## 1a. What changed 2026-09-18, and why (ArtConnect institution page)

The original 2026-09-17 version of this spec (kept below, §2–§4, otherwise unchanged) was a single uninterrupted scroll: facts → recurrence line → past-calls archive, explicitly "no sidebar, no tabs." Browsing an actual ArtConnect institution profile directly changed one thing:

- **ArtConnect's institution page has a real tab bar**: `Overview | Opportunities | About`. `Overview` shows the name, a type label, a short description paragraph, a location line, and Contact/Website links. `Opportunities` shows that institution's own live calls in the same card list used on their search page. This is a genuine, load-bearing structural choice — it lets someone land on an institution (from a Google search, a shared link) and choose "tell me about this place" vs. "show me what's open here" without scrolling past one to reach the other.
- **What's borrowed**: the two-way split between *facts-about-the-institution* and *what's-currently-open-here*, as a switchable view rather than one unbroken scroll. **What's not borrowed**: a third "About" tab (Fellow. has no separate long-form bio field for a source beyond `notes`, which already lives in §2 point 6 below — a third tab with the same content as the second half of Overview would be an empty distinction), ArtConnect's underline-tab visual treatment, and its copy/labels.
- **The fix, concretely**: this page gets **two tabs**, not three, and they use Fellow.'s own existing "selected" visual language — the same solid `bg-fg text-bg` treatment already used by the Hub/Discover/Circuit nav active-state, active filter chips, and the Filters-panel city-list selected row (`docs/DECISIONS.md`, "Hub filter bar UX cleanup" + "Active-chip text still unreadable" entries) — rather than introducing a second, competing "selected" language (e.g. an underline) for the same concept. This is a direct application of the wayfinding discipline `DESIGN_BRIEF.md` §5's Tokyo Metro reference already asks for: one signal, one meaning, everywhere.
- **Tab markup** (a plain two-button row, no new dependency — segmented control built from existing tokens):
  ```html
  <div class="flex gap-2 border-b border-line mb-6" role="tablist">
    <button role="tab" aria-selected="true"
      class="min-h-[44px] px-3 t-meta rounded-t-[var(--radius)] bg-fg text-bg">
      Overview
    </button>
    <button role="tab" aria-selected="false"
      class="min-h-[44px] px-3 t-meta text-muted hover:text-fg">
      Past &amp; open calls
    </button>
  </div>
  ```
  Tab labels: `Overview` and `Past & open calls` (not ArtConnect's "Opportunities" — that word is already Fellow.'s name for the `opportunities` table/Hub content generally; reusing it as a tab label on a page that shows a *mix* of live and expired calls would misdescribe what's actually in the tab). Sentence case, no icons (consistent with `DESIGN_BRIEF.md`'s no-icons-on-tags rule extended to this new, adjacent case — a tab is naming a view, not decorating a fact, but the same "text alone already says what it needs to" logic applies).
  - `Overview` = Section 2 (institution facts) + Section 3 (recurrence line) from the original spec below.
  - `Past & open calls` = Section 4 (the archive) from the original spec below, unchanged in content and row anatomy.
  - Client-side tab state only (`useState`, no URL param needed — this isn't filterable/shareable state the way Hub's filters are); default tab is `Overview`.
  - Reduced-motion / no-JS consideration: both tab panels can exist in the DOM with the inactive one `hidden` — no animation on switch, consistent with `DESIGN_BRIEF.md` §3's "no shadows, no gradients... discipline applied to spacing and hierarchy," not motion.
- **Back link now has a real destination**: the original spec (§2 point 1 below) explicitly omitted a back link because "no such index page exists (per Task 09, `/sources` is not a route being built)." Task 14 builds exactly that index. Once Task 14 is merged, add:
  ```
  <Link href="/sources" className="t-meta text-muted hover:text-fg transition-colors">
    ← Sources
  </Link>
  ```
  in the same position/weight `OpportunityDetailView` uses for its own `← Opportunities` link. If this page ships before Task 14 merges, keep the original spec's instruction (omit the back link) rather than link to a route that 404s — do not guess at a temporary destination.

---

## 2. Section 1 — institution facts (renders inside the `Overview` tab, §1a)

Top to bottom, mirroring `OpportunityDetailView`'s own header block so the two detail-page types read as the same product:

1. **Back link**: see §1a above — `← Sources` once Task 14 is live, omitted otherwise. (Supersedes the original instruction to omit it unconditionally.)
2. **Meta line**: `.t-meta text-muted`: `{source_type label from vocab} · {city_name}` — e.g. `Institution · Berlin` (or `Tel Aviv`, `Haifa`, `Jerusalem` per the Israel-only pivot, sourced from `markets` as always — no change to this page's own logic, since it already reads `city_name` dynamically). Same position and weight as `OpportunityDetailView`'s meta line.
3. **Title**: `.t-title text-fg`, the source `name`. Sentence case source of truth (the DB value), not forced to any casing — `.t-title`'s CSS renders it uppercase regardless, consistent with every other `.t-title` use in the app.
4. **`Demo` tag**, only when `is_demo`: a single neutral `Chip` (`<Chip>Demo</Chip>`, default tone, no accent) directly under the title, same treatment `OpportunityRow` uses for the same flag. Not part of the tag-row pattern below since there's no discipline/city tag row on this page — it stands alone here.
5. **Links row**: ghost-style links, one per present field among `website_url`, `opencalls_url`, `instagram_url` — omit any that are null, don't render a disabled/greyed placeholder for a missing one. Build as a `flex flex-wrap gap-4` row, `t-body text-fg hover:underline hover:underline-offset-4`, each wrapped so its tap area is `min-h-[44px] inline-flex items-center` (same tap-target discipline as everywhere else — a bare text link with no padding, like the current `ShareLink`, is not an acceptable pattern to copy here). Labels: `Website`, `Open calls`, `Instagram` — plain nouns, not the raw URL.
6. **Notes**: only if `notes` is present and non-empty, `.t-body text-fg`, directly below the links row, `max-w-[60ch]` (matches the bio measure on `PublicProfileView`). This is existing curated DB content, rendered as-is — no truncation, no "read more" collapse; if it's long, let the page be long, consistent with "precision over coverage" being about what the *agent* writes, not about hiding curated editorial content that's already been kept short by whoever wrote it.

Spacing within this section: meta line → `--space-1` → title → `--space-2` → Demo tag (if present) → `--space-4` → links row → `--space-4` → notes (if present).

## 3. Section 2 — "Usually opens in {month}" (renders inside the `Overview` tab, §1a)

- Only rendered when at least one of the source's opportunities has a non-null `expected_next_open`.
- `.t-body`: `Usually opens in {Month}` where the word `{Month}` alone is `text-accent` (per `docs/DECISIONS.md` "Task 07 — accent rule, final," rule 5) and the rest of the sentence (`Usually opens in`) is `text-fg`. Do not make the whole line accent-colored — only the month word carries the signal; the surrounding words are structural, not the fact itself.
- No icon, no border, no card treatment around this line — it's a single sentence sitting in the page's normal flow, `--space-6` below Section 1 and `--space-6` above the archive heading. Treat it exactly the way `PublicProfileView`'s status lines (`Currently in {city} until {date}`, `Open for collaboration`) sit directly in flow with no wrapper.
- Omitted entirely when `expected_next_open` is null everywhere — no placeholder, no "recurrence unknown" text. Silence is the correct empty state here, not a filler sentence.

## 4. Section 3 — past-calls archive (renders inside the `Past & open calls` tab, §1a)

**No in-panel heading.** The original 2026-09-17 spec called for a `.t-meta text-muted: "Past calls"` heading at the top of this section. Now that this content lives inside a tab already labeled `Past & open calls` (§1a), repeating the same fact as a heading directly under it would be the "second summary" pattern `DESIGN_BRIEF.md` §6 rules out — the tab label already told the reader what they're looking at. Drop the heading; go straight from the tab bar into the row list, `--space-4` below the tabs.

Sort: most recent `deadline` (or `created_at` when `deadline` is null) first — newest at the top, same direction as the Hub feed's own deadline-ascending logic reversed for history (this page is looking backward, Hub looks forward).

Two row types, matching Task 09 §3 exactly:

- **Still live/open rows**: render with the existing `OpportunityRow` component, full anatomy, clickable — no changes to that component for this page.
- **`expired`/`archived` rows**: a reduced, non-clickable row — not a card, not a link. Exact anatomy:
  ```
  <div className="flex items-center justify-between gap-4 py-3 border-b border-line">
    <span className="t-body text-muted line-clamp-1">{title}</span>
    <span className="t-meta text-muted shrink-0">Closed {formatted deadline}</span>
  </div>
  ```
  Plain divided rows (not bordered cards) — this deliberately looks like a lower-tier, historical list, visually distinct from the live cards above it, which is the correct signal: "this is over," not "this is worth tapping." No chips, no funding figure, no discipline tag — title and closed-date only, per Task 09 §3's explicit anatomy.
- Between the two row types, if both exist on one source: no extra divider or heading needed beyond the visual difference between bordered cards and plain divided rows — that contrast alone reads as "current" vs. "history" without another label.

**Empty state**: `.t-body text-muted`: `No past calls recorded yet.` — exact copy per Task 09 §3, no action button (nothing to reset).

## 5. `notFound()`

Standard `notFound()` from `next/navigation` when the `source_id` doesn't resolve to a row — same pattern as `app/opportunities/[slug]/page.tsx` and `app/a/[handle]/page.tsx`, no custom empty page for this route.

## 6. Linking in from elsewhere (Task 09 §5)

`source_name` becomes a link to `/sources/{source_id}` on `components/hub/OpportunityRow.tsx` and `app/opportunities/[slug]/page.tsx`. Visual treatment: keep the exact same text styling that's there today (`t-meta text-muted` on the Hub row, `t-meta text-muted` inline in the detail page's meta line) — just wrap it in a `Link`, don't add an underline-on-rest or a color change. It should read as plain text until hovered/focused (`hover:underline hover:underline-offset-4`, `focus-visible` gets the standard `2px solid var(--fg)` ring), consistent with how `OpportunityDetailView` already treats its own back-link. Don't turn the source name into a differently-colored "this is a link" affordance — the app doesn't do that anywhere else for inline text links (compare `PublicProfileView`'s `Website`/`Spotify`/`Vimeo` links, which are plain `text-fg` until interaction).

---

## 7. What doesn't change

No accent use beyond the one recurrence-month word (Section 2) — the differentiator-chip pattern from Hub cards does not appear on this page; a source isn't "funded" or "no fee," so there's no equivalent fact to carry that treatment. No new chip categories, no new type style — everything above resolves to the existing five (`t-title`, `t-body`, `t-meta`, plus `Chip`'s own internal `t-meta`).
