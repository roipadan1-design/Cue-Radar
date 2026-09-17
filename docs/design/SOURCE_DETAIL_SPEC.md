# Source detail page — layout spec (Task 09)

Status: spec only. No application code changed by this document.
Audience: written for a Frontend Engineer agent to implement `app/sources/[id]/page.tsx` without guessing.
Reads against: `docs/design/DESIGN_BRIEF.md`, `app/globals.css`, `docs/tasks/TASK_09_source_detail_page.md`, and the current code in `components/hub/OpportunityRow.tsx`, `components/hub/OpportunityDetailView.tsx`, `components/ui/Chip.tsx`. Assumes `opportunities.expected_next_open` and the `recurrence` column exist per Task 08 (this spec does not touch the migration).
Date: 2026-09-17.

---

## 1. Overall shape

Same container and rhythm as every other content page in the app: `max-w-[720px] mx-auto px-4 md:px-6 py-6` (matches `OpportunityDetailView`'s own wrapper). Four stacked sections, in this order, each separated by `--space-6` (32px): institution facts → recurrence line (conditional) → past-calls archive. No sidebar, no tabs — this is a single scroll, same as every other detail page in the product.

## 2. Section 1 — institution facts

Top to bottom, mirroring `OpportunityDetailView`'s own header block so the two detail-page types read as the same product:

1. **Back link**: `← Opportunities` is wrong here — this page isn't reached only from an opportunity. Use `← Sources`? No such index page exists (per Task 09, `/sources` is not a route being built). Omit the back link entirely rather than invent a destination that doesn't exist; rely on the browser back button and the calling page's own breadcrumb (Hub, the opportunity detail page).
2. **Meta line**: `.t-meta text-muted`: `{source_type label from vocab} · {city_name}` — e.g. `Institution · Berlin`. Same position and weight as `OpportunityDetailView`'s meta line.
3. **Title**: `.t-title text-fg`, the source `name`. Sentence case source of truth (the DB value), not forced to any casing — `.t-title`'s CSS renders it uppercase regardless, consistent with every other `.t-title` use in the app.
4. **`Demo` tag**, only when `is_demo`: a single neutral `Chip` (`<Chip>Demo</Chip>`, default tone, no accent) directly under the title, same treatment `OpportunityRow` uses for the same flag. Not part of the tag-row pattern below since there's no discipline/city tag row on this page — it stands alone here.
5. **Links row**: ghost-style links, one per present field among `website_url`, `opencalls_url`, `instagram_url` — omit any that are null, don't render a disabled/greyed placeholder for a missing one. Build as a `flex flex-wrap gap-4` row, `t-body text-fg hover:underline hover:underline-offset-4`, each wrapped so its tap area is `min-h-[44px] inline-flex items-center` (same tap-target discipline as everywhere else — a bare text link with no padding, like the current `ShareLink`, is not an acceptable pattern to copy here). Labels: `Website`, `Open calls`, `Instagram` — plain nouns, not the raw URL.
6. **Notes**: only if `notes` is present and non-empty, `.t-body text-fg`, directly below the links row, `max-w-[60ch]` (matches the bio measure on `PublicProfileView`). This is existing curated DB content, rendered as-is — no truncation, no "read more" collapse; if it's long, let the page be long, consistent with "precision over coverage" being about what the *agent* writes, not about hiding curated editorial content that's already been kept short by whoever wrote it.

Spacing within this section: meta line → `--space-1` → title → `--space-2` → Demo tag (if present) → `--space-4` → links row → `--space-4` → notes (if present).

## 3. Section 2 — "Usually opens in {month}"

- Only rendered when at least one of the source's opportunities has a non-null `expected_next_open`.
- `.t-body`: `Usually opens in {Month}` where the word `{Month}` alone is `text-accent` (per `docs/DECISIONS.md` "Task 07 — accent rule, final," rule 5) and the rest of the sentence (`Usually opens in`) is `text-fg`. Do not make the whole line accent-colored — only the month word carries the signal; the surrounding words are structural, not the fact itself.
- No icon, no border, no card treatment around this line — it's a single sentence sitting in the page's normal flow, `--space-6` below Section 1 and `--space-6` above the archive heading. Treat it exactly the way `PublicProfileView`'s status lines (`Currently in {city} until {date}`, `Open for collaboration`) sit directly in flow with no wrapper.
- Omitted entirely when `expected_next_open` is null everywhere — no placeholder, no "recurrence unknown" text. Silence is the correct empty state here, not a filler sentence.

## 4. Section 3 — past-calls archive

Heading: `.t-meta text-muted`: `Past calls` (plain label, matching the all-caps-via-CSS convention already used for `SELECTED WORKS` / `GALLERY` on `PublicProfileView`).

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
