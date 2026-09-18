# Fellow. brand mark — final geometry spec

Status: **approved concept, final geometry.** The owner picked Concept 1 ("Two marks" / the companion mark) from `docs/design/BRAND_MARK_PROPOSAL.md` §4. This document specifies the exact, implementable SVG for that concept. Nothing in this document changes application code — it is a spec for a separate frontend task to implement mechanically.

Grounded in:
- `docs/design/BRAND_MARK_PROPOSAL.md` (the approved concept, its reasoning, and the chrome/splash two-rendering rule — not re-argued here)
- `docs/DECISIONS.md`, "Task 19, Option B partial — radius + urgent-card border only (2026-09-18)": `--radius` changed from `2px` to `0px` in `app/globals.css`. **This mark uses sharp, 0-radius corners** — the proposal text (written before that decision landed) says `var(--radius)` (then 2px); this spec supersedes that detail with the current token value, not a new judgment call.
- `app/globals.css` current tokens: `--bg: #0A0A0A`, `--fg: #F2F2F2`, `--muted: #8C8C8C`, `--accent: #AA80FF`, `--radius: 0px`.

---

## 1. Geometry, in words

Two solid rectangles, equal width, unequal height, bottom-aligned, separated by a fixed gap, sharp corners. The taller rectangle is on the left (nearer the wordmark's opening bracket `[`, per `Wordmark.tsx`/`IntroSplash.tsx`), the shorter one on the right.

All geometry is defined on a **24×24 viewBox** — a standard icon grid, square, matching the mark's existing square footprint (it currently sits in a `sm`/`md`/`lg` slot sized 20/40/96px, always square). This viewBox is fixed regardless of display size; only the SVG's rendered `width`/`height` (or its CSS box) changes per size.

| Element | x | y | width | height |
|---|---|---|---|---|
| Rect A (tall, left) | 3.5 | 3 | 7 | 18 |
| Rect B (short, right) | 13.5 | 12 | 7 | 9 |

- **Width, both rects: 7 units** — identical. The only difference between them is height. (This is deliberate: the proposal's "unequal, but grounded on the same line" reads only if width stays constant and height is the sole variable.)
- **Height ratio: exactly 2:1** — Rect A is 18 units tall, Rect B is 9. Not an approximate half — precisely half, so the relationship is legible as a ratio, not a random pair of sizes.
- **Bottom alignment:** both rects share the same bottom edge, `y + height = 21` for both (3 + 18 = 21; 12 + 9 = 21). This is the "standing on the same line" detail — must not drift.
- **Gap: 3 units** between the rects (Rect A ends at x = 10.5; Rect B starts at x = 13.5). This is deliberately equal to Rect A's height/6 — not a load-bearing ratio, just confirming it isn't an arbitrary number pulled from nowhere: it is exactly the same value used for the splash notch (§3), so the mark has one repeated unit of measure, not two unrelated ones.
- **Margins:** 3.5 units on the left of Rect A and 3.5 units on the right of Rect B, and 3 units above Rect A and 3 units below the shared baseline — the whole two-rect group sits inset from the 24×24 box with those margins, so it does not touch the edges of its own bounding box (important if this SVG is ever dropped into a container with a visible edge, e.g. a future app-icon treatment).
- **Corners: sharp, 0 units of rounding.** No `rx`/`ry` attribute at all (equivalent to `rx="0"`) — this matches the current `--radius: 0px` token exactly (see decisions log cited above). Do **not** apply `var(--radius)` as a CSS custom property to the SVG shapes; hard-code the absence of rounding, because this is a drawn mark, not a UI chrome element that should track a future radius-token change — if the product's corner radius is ever revisited again, the brand mark should not silently change shape with it. (Flagging this as the one place I am overriding "always use the token" — the mark is a fixed logotype-adjacent asset, not a UI surface.)

## 2. Chrome variant — the everyday rendering

This is the default and only variant used everywhere except the intro splash screen: nav, footer, `Wordmark.tsx`, favicon-equivalent contexts, OG images. `currentColor` only, no accent, functionally identical in spirit to how `間` behaved before (inherits `--fg` in normal chrome, inverts correctly on any dark-on-light or light-on-dark surface already in use, e.g. an active nav pill).

```svg
<svg
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  focusable="false"
>
  <rect x="3.5" y="3" width="7" height="18" fill="currentColor" />
  <rect x="13.5" y="12" width="7" height="9" fill="currentColor" />
</svg>
```

No `width`/`height` attributes are hard-coded on the `<svg>` itself in this snippet — the consuming component (`Mark.tsx`) sets the rendered box size (20 / 40 / 96px) via its own `width`/`height` or a wrapping element, and the `viewBox` scales the two rects proportionally. This preserves the existing `sm`/`md`/`lg` size contract without the SVG needing to know which one it is.

## 3. Splash variant — intro screen only

Used **only** on the intro screen (`components/brand/IntroSplash.tsx`) — the one screen that is a full solid-background frame with nothing else competing for the one-accent-per-screen budget, per the proposal's §2 reasoning. Never used in nav, footer, `Wordmark.tsx`, or OG images.

**The detail:** a single small square notch cut into the top-outer corner of the taller rectangle (Rect A) — "outer" meaning the corner farthest from the gap/the other rectangle, i.e. Rect A's **top-left** corner. The notch is a 3×3 unit square (the same 3-unit measure as the gap — see §1). The missing corner is filled with `var(--accent)`, so the effect reads as a small accent-colored chip sitting exactly in Rect A's top-left corner, not a decorative shape floating separately.

Rect A becomes an L-shaped (hexagonal) path with that corner removed; Rect B is unchanged.

```svg
<svg
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  focusable="false"
>
  <path d="M6.5 3 H10.5 V21 H3.5 V6 H6.5 Z" fill="currentColor" />
  <rect x="3.5" y="3" width="3" height="3" fill="var(--accent)" />
  <rect x="13.5" y="12" width="7" height="9" fill="currentColor" />
</svg>
```

Path walkthrough (so this is checkable, not just trusted): start at (6.5, 3) — the top edge, just past the notch — go right to (10.5, 3) [top-right corner of Rect A], down to (10.5, 21) [bottom-right], left to (3.5, 21) [bottom-left], up to (3.5, 6) [left edge, up to the notch's height], right to (6.5, 6) [the notch's inner corner], and close back to (6.5, 3). That traces Rect A's original rectangle with a 3×3 square bite removed from the top-left. The `<rect x="3.5" y="3" width="3" height="3" fill="var(--accent)">` sits exactly in that removed square, so it reads as a corner filled in a different color, not a gap.

`--accent` is currently `#AA80FF` (`app/globals.css`). No other color appears in this variant — Rect B and the rest of Rect A stay `currentColor`, per the proposal's "one accent, one place" rule.

## 4. Size behavior, 20px to 96px

The mark's three defined sizes are `sm` = 20px, `md` = 40px, `lg` = 96px (per `Mark.tsx`'s existing prop contract).

**Chrome variant (two plain rects, no notch): reads cleanly at all three sizes, no adjustment needed.** At 20px the two rects render at roughly 5.8×15px and 5.8×7.5px with a ~2.5px gap — still two unambiguous, high-contrast solid blocks with a visible gap. This is the simplest possible silhouette; it does not degrade at the small end.

**Splash variant (the notch): needs a floor.** Working the notch through the actual sizes:
- At `lg` (96px): notch renders at 12×12px — a clearly intentional, legible accent-colored square. No issue.
- At `md` (40px): notch renders at 5×5px. This is the size the intro splash actually uses today (`IntroSplash.tsx` calls `<Mark size="md" />`, not `lg` — `lg` is defined in the component but not currently invoked anywhere). At 5×5px the notch still reads as a distinct colored corner chip against the solid black rectangle — small, but not muddy, because it's a hard-edged square against a flat fill, not a shape with internal detail that could blur. Acceptable as-is.
- At `sm` (20px): notch would render at 2.5×2.5px — **this is too small and must not ship.** At that size the "cut corner + accent fill" reads as a stray pixel or a rendering artifact, not a deliberate detail, which fails the proposal's own test ("reads as a deliberate detail rather than decoration").

**Rule for implementation:** the splash variant with notch is only ever rendered at `size="md"` or `size="lg"`. If `variant="splash"` is ever requested with `size="sm"`, the component must silently render the **plain chrome geometry** (§2) instead — same as if no splash were requested — rather than attempting a shrunk notch. In practice this should never come up: splash is only used on the intro screen, which does not currently use `size="sm"` anywhere in the codebase. This is a defensive rule for whoever touches this component next, not a scenario that needs new UI today.

## 5. Where this needs to go in code

Every current reference to the `間` mark, found by searching the repo:

1. **`components/brand/Mark.tsx`** — the component itself. Currently renders `BRAND.mark` as text in `var(--font-mark)`. This is the file that needs the actual rewrite: swap the `<span>{BRAND.mark}</span>` for the inline SVG markup in §2/§3, add a `variant?: 'chrome' | 'splash'` prop (default `'chrome'`), keep the existing `size?: 'sm' | 'md' | 'lg'` prop mapping to 20/40/96px (now driving the SVG's rendered box, not a `font-size`), and apply the §4 floor (no notch below `md`).
2. **`lib/brand.ts`**, line 4 — `mark: '間',`. This property becomes dead once Mark.tsx stops rendering `BRAND.mark` as text; remove the line (there is no string replacement needed — the geometry now lives in `Mark.tsx`, not as brand data).
3. **`app/layout.tsx`** — the `Noto_Sans_JP` font load exists solely to serve the old glyph. Per `docs/tasks/TASK_03_brand_profile_and_depth.md` ("Nothing else uses this font"), once Mark.tsx no longer needs it this whole block is dead and should be removed, not left orphaned:
   - line 2: drop `Noto_Sans_JP` from the `next/font/google` import
   - lines 22–28: remove the `notoSansJP` font instantiation block entirely
   - line 55: remove `${notoSansJP.variable}` from the `<html className>` string
4. **`app/globals.css`**, line 37 — `--font-mark: var(--font-mark);` inside `@theme inline`. Remove once the font load above is gone; nothing else references `--font-mark` (confirmed by search — only `Mark.tsx`'s old `fontFamily: 'var(--font-mark)'` used it, which goes away with the Mark.tsx rewrite).
5. **`app/icon.svg`** — the favicon. Currently hardcoded hex (`#0A0A0A` bg, `#F2F2F2` text) rendering `間` as text, because a standalone favicon file has no DOM/CSS context to inherit `currentColor` from. This is the same class of exception already logged in `docs/DECISIONS.md` (the "OG-Image-Hex-Exception," used by both `opengraph-image.tsx` files below) — not a new judgment call, just the same precedent applied here. Replace with:
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
     <rect width="32" height="32" fill="#0A0A0A"/>
     <g transform="translate(4, 4) scale(1)">
       <rect x="3.5" y="3" width="7" height="18" fill="#F2F2F2"/>
       <rect x="13.5" y="12" width="7" height="9" fill="#F2F2F2"/>
     </g>
   </svg>
   ```
   (The `translate(4,4)` centers the 24-unit mark inside the 32×32 favicon canvas — 32 minus 24 = 8, split 4/4. No accent, no notch: a favicon is chrome, not the splash screen.)
6. **`app/opportunities/[slug]/opengraph-image.tsx`**, line 90 — `間 FELLOW.` inside a single `<span>`. `next/og`'s Satori renderer supports basic SVG primitives (`<svg>`, `<rect>`, `<path>`) inside the JSX tree, so this can carry the real mark rather than dropping it. Replace the single `<span>間 FELLOW.</span>` block with:
   ```tsx
   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <rect x="3.5" y="3" width="7" height="18" fill={C.fg} />
       <rect x="13.5" y="12" width="7" height="9" fill={C.fg} />
     </svg>
     <span
       style={{
         fontSize: '13px',
         fontWeight: 500,
         letterSpacing: '0.12em',
         textTransform: 'uppercase' as const,
         color: C.muted,
       }}
     >
       FELLOW.
     </span>
   </div>
   ```
   Note this uses `C.fg` (already defined in this file's own hardcoded token block, same exception) for the mark fill, not `C.muted` — the mark should be the brighter of the two, matching how the mark sits at full `--fg` brightness next to muted wordmark text elsewhere (`Wordmark.tsx` uses `text-fg` for the mark and a slightly different treatment for the wordmark letters). Chrome-only, no accent — an OG image is not the intro splash.
7. **`app/a/[handle]/opengraph-image.tsx`**, line 83 — identical `間 FELLOW.` span, identical fix as #6 above (this file has its own copy of the same `C` token block).

Two files were found to already be correct and need **no change**: `Wordmark.tsx` and `IntroSplash.tsx` both already call `<Mark size="..." />` rather than referencing `間`/`BRAND.mark` directly — they inherit whatever Mark.tsx renders automatically once #1 above ships. `IntroSplash.tsx` needs one addition only: pass `variant="splash"` to its `<Mark size="md" />` call (currently `<Mark size="md" />`, becomes `<Mark size="md" variant="splash" />`) — everywhere else (`Wordmark.tsx`, `app/page.tsx`'s own `<Mark size="sm" />`) stays on the `variant="chrome"` default and needs no prop added.

## 6. What this document does not do

- Does not touch any of the files listed in §5 — this is a spec only, per the task's instruction.
- Does not re-argue the concept choice — that was decided by the owner from `docs/design/BRAND_MARK_PROPOSAL.md` and is not reopened here.
- Does not specify a new `Mark.tsx` prop-type file/interface beyond the one line in §5.1 — the exact TypeScript shape (e.g. whether `variant` is a union type or a boolean `splash?: boolean`) is a small implementation choice for whoever writes the code, not a design decision; either satisfies this spec as long as the default is chrome-only and the §4 floor is enforced.
