# Task 19 — Visual identity refresh, Option B (bolder alternative)

Status: spec only. No application code changed by this document. Written for the owner to
compare against Option A (`docs/design/TASK_19_VISUAL_REFRESH_SPEC.md`, already implemented and
verified working — `--accent: #AA80FF`, `.t-title` uppercase removed).

Read before writing this: `docs/design/TASK_19_VISUAL_REFRESH_SPEC.md` (Option A, in full —
this document treats its two shipped changes as the baseline, not as something to re-litigate),
`AGENTS.md`, `docs/HANDOFF_V3.md`, `docs/design/DESIGN_BRIEF.md`, `docs/DECISIONS.md`'s "Task 07
— accent rule, final" and "Task 12 — Israel-only pilot pivot" §4, and `app/globals.css` for
current live token values.

**Why this document exists, stated plainly**: the owner reviewed Option A and said "I expected to
see a different, new look and I'm disappointed because everything looks the same." Option A was a
considered, disciplined choice — but a considered choice presented as the only reasonable answer
isn't a real choice for the owner to make. This document takes the five specific areas the owner
named (spacing/density, radius, type scale, accent usage, card/surface treatment) and pushes each
one as far as I can defend it, not as far as it can go. Where I conclude the honest answer is
still "no, don't do this," I say so with the same directness as where I conclude "yes, do this" —
this is not a sales pitch for change.

**Baseline this document builds on** (both already shipped, not reopened here): `--accent:
#AA80FF`; `.t-title` sets no `text-transform` (mixed case); `.t-display` stays uppercase. Every
proposal below is additive to or in tension with that baseline, never a reversion of it.

---

## 0. How to read this document

Five sections, one per axis the owner named. Each ends with a **verdict**: adopt, adopt with a
caveat, or don't. Section 6 is the combined per-screen effect. Section 7 is contrast/verification
data. Section 8 is the honest summary — which of these five I'd actually ship if it were my call,
and which I wouldn't.

Every proposal below stays inside the same hard constraints as Option A: resolves to
`app/globals.css` CSS variables or existing named style rules only, no hex/`rgb()`/font name in
any `.tsx` file, no new npm dependency, no new font family. Two proposals below (§3, optionally)
touch a `next/font` **weight** array — an additional static cut of a typeface Fellow. already
loads, not a new family and not a new dependency — flagged explicitly where that applies, the same
way Option A flagged its own tooling gap rather than glossing over it.

---

## 1. Spacing / density — verdict: adopt, one notch, not a redesign

**The question as posed**: is Fellow.'s generous whitespace right for a pilot that wants to feel
alive, or would a denser, editorial-magazine layout read as more "happening now"?

**What "editorial magazine" would actually require, and why I'm not proposing it**: a real
magazine-density read — multiple columns, image bleed, mixed type sizes competing for attention on
one spread — depends on photography and a richer card anatomy Fellow. does not have (`AGENTS.md`
rule 1 forbids stock imagery; there is no image pipeline for `opportunities` today, confirmed in
Option A §4 and unchanged since). Without images, "denser" on a single-column mobile list can only
mean tighter numbers on the same scale — it can't mean an actual magazine grid. Proposing the grid
anyway would be inventing new component/layout work this token-and-style-rule task isn't scoped
for, exactly the boundary Option A already drew for card anatomy (§3.4) and that I'm not
reopening.

**What tighter numbers, on the existing scale, actually deliver — measured, not guessed**:

Current live values (confirmed in `components/hub/HubFeedView.tsx` and
`components/hub/OpportunityRow.tsx`):
- Inter-card gap: `gap-4` (16px)
- Card internal padding: `p-4` (16px)
- Section header bottom margin: `mb-6` (24px)

**Proposed**: inter-card gap `gap-4` → `gap-2` (8px); section header margin `mb-6` → `mb-4`
(16px). **Card internal padding stays at `p-4` (16px), unchanged** — this is the one number I'm
not touching, because it's what keeps the title, source link, tags, and figures legible and the
tap targets comfortable; tightening padding saves far less vertical space than tightening the gaps
between cards and costs real legibility.

This is a **component-level Tailwind class choice, not a new token value** — both `gap-2` and
`gap-4` already exist as steps on the same scale (`--space-2`/`--space-4`); I'm choosing a
different already-existing rung for this one relationship, the same category of edit Option A made
to `.t-title`'s `text-transform`, not a new number added to `app/globals.css`.

**Effect, arithmetically**: on a 375×812 viewport, saving 8px per card gap and 8px on the section
header recovers roughly 40–60px of vertical space across a typical 5–6-card first screen — enough
to bring part of one additional card into view without hiding any information already on a card
face. That is a real, checkable "more happening at once" effect, achieved without adding a single
new fact to any card — so it doesn't reopen `DESIGN_BRIEF.md` §2's "precision over coverage" rule,
which governs what's *on* a card, not the gap *between* cards.

**Verdict: adopt.** This is the lowest-risk, most directly responsive answer to "feels the same" —
it changes what the owner sees the instant he opens the Hub on his phone, costs two Tailwind class
edits, and doesn't touch card content, card anatomy, or a single token value.

---

## 2. Radius — verdict: adopt, push to 0px

**The question as posed**: 2px was kept as "sharp" — is there a case for a different corner
treatment that still avoids ArtConnect's rounded-pill trap?

**Honest read of 2px today**: 2px is close enough to a right angle that it reads as "square" in
practice on-screen at normal viewing distance — but it is not committed. It's a hedge between
"technically has a radius" and "technically doesn't." A genuinely bolder, more architectural
statement is to remove the hedge entirely.

**Proposed**: `--radius: 2px` → `--radius: 0px`. One value, one place (`app/globals.css`'s `:root`
block) — the same "one token, everywhere" mechanism Option A used for `--accent`, so it cascades
to every card, chip, button, sheet, and input with zero component-level changes anywhere.

**Why this is a real bolder move, not a cosmetic nudge**: 0px is maximally distinct from every
generic SaaS default (typically 6–16px) and from ArtConnect's own ~8px-cards/near-full-round-pills
register (Option A §1.3, §3.5) — more distinct than 2px, which still occupies the same "slightly
rounded" family as a much softer product, just at the low end of it. A hard, right-angled system
reads as a considered, architectural choice — closer to the "museum wall label" register (a printed
placard has square corners, not 2px-rounded ones) than a value chosen to split the difference.

**Trade-off, stated plainly**: 0px can read as more severe/cold than 2px in isolation. I don't
think that's a real cost here — Fellow.'s register is already deliberately unadorned (no shadow,
no gradient, dark base), and a perfectly square corner is consistent with that starkness rather
than working against it. No accessibility impact: the focus ring (`2px solid var(--fg)`,
`outline-offset: 2px`) sits outside the border box regardless of corner radius and is unaffected.

**Verdict: adopt.** Of the five levers in this document, this is the cheapest (one hex-adjacent
number, already a token, already wired everywhere) and the one I'm most confident reads as
"different" to the owner within five seconds of opening the app, without inviting any of the
generic-SaaS or ArtConnect associations Option A's §3.5 already ruled out.

---

## 3. Typography scale / weight — verdict: adopt the size increase; weight change is optional and flagged

**The question as posed**: beyond dropping uppercase (already shipped), is there a bolder
type-scale contrast that reads as more confident/editorial?

**Current scale** (`app/globals.css`, unchanged by Option A): `t-display` 36px/64px (mobile/desktop),
weight 800; `t-title` 22px/28px, weight 800; `t-row` 17px/18px, weight 600; `t-body` 15px/16px,
weight 400; `t-meta` 11px/12px, weight 500. Font loading (`app/layout.tsx`): Archivo loaded at a
single static weight, `800`; Manrope loaded at `400`/`500`/`600`.

**Proposed, primary — size only, zero font-loading change**:
- `t-display`: 36px → 40px (mobile), 64px → 72px (desktop)
- `t-title`: 22px → 24px (mobile), 28px → 32px (desktop)
- `t-row`, `t-body`, `t-meta`, `t-num` — **unchanged**.

This widens the gap between "the one loud headline element" and everything else, which is a
direct reinforcement of `DESIGN_BRIEF.md` §2's own "one thing is allowed to be loud per screen"
doctrine — the loud thing gets louder, nothing else moves, so no new competing signal is
introduced. Because `t-display` and `t-title` already carry Archivo weight 800 (already loaded,
already used everywhere they appear), this proposal is two pairs of pixel numbers changed inside
existing named style rules in `app/globals.css` — the same category of edit as Option A's
`.t-title` uppercase removal. No new token, no new font-loading weight, no new file.

**Proposed, secondary and optional — a genuine weight jump, flagged as unverified**: `t-row`
(card/row titles — the Hub card title, the opportunity detail title) currently sits at Manrope 600,
two steps below Archivo's 800. Bumping `t-row` to Manrope 700 would sharpen the weight
relationship between a card's title and its body/meta text (still both well below the 800 used for
actual headlines, so the hierarchy stays: display/title loudest, row second, body/meta quietest).
This requires adding `'700'` to the `weight` array already passed to `Manrope(...)` in
`app/layout.tsx` — an additional static cut of a typeface Fellow. already loads, not a new font
family and not a new npm dependency, but it is a real font-loading config edit, not a pure CSS
number change, so I'm flagging it as optional rather than folding it into the primary
recommendation. **Stating a gap plainly rather than guessing past it**: I have not verified in this
session whether Google Fonts' Archivo has a static 900 cut available via `next/font` (this
session's tooling has no way to query the Google Fonts API or run `next/font`'s own build-time
weight validation) — so I am **not** proposing an 800→900 bump on `t-display`/`t-title` the way
Option A's own §0 declined to guess past a similar verification gap. If the owner wants that
explored, it's a five-minute check for whoever implements this (attempt `weight: ['800', '900']` in
the `Archivo(...)` call and see if the build accepts it), not something to spec blind here.

**Verdict: adopt the primary (size) change. The secondary (weight) change is a genuine "worth
trying" flagged as optional, not a firm recommendation** — it's a slightly bigger code touch for a
subtler visual effect than the size change delivers, and I'd want to see it live before committing
either way.

---

## 4. Accent usage — verdict: don't fill the chip; do add a bolder non-chip treatment instead

**The question as posed**: is there a case for the accent appearing as a bolder background-fill
treatment in 1–2 of its existing five approved uses, rather than only ever outline/text?

**Correcting a premise first**: the accent is not *only* ever outline/text today. Task 07's rule 1
(primary action fill — `bg-accent text-bg`) is already a solid fill, and it's the single most
visible accent use in the product (every primary button). Rules 2–5 (the differentiator chip,
eligibility confirmation, Follow/Following, the recurrence month) are the ones that are outline/
text-only. So the live question is narrower and sharper than the prompt implies: **should the
differentiator chip (`Funded` / `No fee` — rule 2, the one that appears on the Hub, the densest and
most-viewed screen) become a filled pill instead of an outline one?**

**Honest answer: no — and here's why, grounded, not asserted.** `docs/design/DESIGN_BRIEF.md` §6
names "filled or shadowed pill chips" as an explicit anti-goal, and Option A's own live research
(§1.1, §1.3 of `TASK_19_VISUAL_REFRESH_SPEC.md`) found that ArtConnect's busiest, most
generic-reading card mechanism is *exactly* this — a saturated, filled pill per fact
(`OPEN CALL`, `RESIDENCY`, `FREE`). Filling Fellow.'s differentiator chip would be adopting the one
specific pattern already identified, on the record, as the thing that makes a competitor's card
read as generic SaaS rather than curated. That's not a marginal aesthetic call — it's reversing a
already-reasoned decision without new evidence, which the department's own standard rules against.

**What I'm proposing instead — genuinely bolder, still inside the anti-goal**: give the
differentiator fact a **second, coordinated representation at the card-frame level**, not by
filling the chip but by putting a solid accent edge on the card that carries it. Concretely: when
`getDifferentiatorTag()` returns non-null (Funded/No fee — already capped at one per card, per the
existing rule), the card's left border renders as `border-l-[3px] border-l-accent` instead of the
default 1px `border-line` on that edge (top/right/bottom stay `border-line` as normal). The chip
itself is untouched — still `border-accent text-accent`, outline, per Task 07's rule 2 exactly as
written.

This reads as *more* forceful than a filled pill in the way that actually matters for a feed
you're scanning fast: it's visible in peripheral vision before you've read a single word on the
card, the way a printed margin-flag on an editorial page marks "read this one" without recoloring
the whole story. It is not decoration — it's the same one fact (already capped at one per card)
getting a second, coordinated expression, which is tighter wayfinding discipline
(`DESIGN_BRIEF.md` §5's "a signal should mean the same thing everywhere it appears"), not a new
signal competing with the chip.

**Precedence rule, needed because a card can be both funded and urgent**: the urgency signal
(`--urgent` red, §5 below) always wins if a card qualifies for both — `DESIGN_BRIEF.md` §2 item 3
already establishes urgency as "the one thing... that should stay the only thing competing for
attention" on a Hub row. The differentiator flag-bar only renders on a card that is **not** in the
urgent state.

**Verdict: don't fill the chip (real risk, already-identified anti-pattern). Do add the
card-edge flag-bar as the bolder accent treatment (real, new, stays inside every existing rule).**

---

## 5. Card / surface treatment — verdict: adopt, reusing `--urgent`, no new color

**The question as posed**: does every card look identical in weight/hierarchy, and is there a case
for differentiating featured/urgent content via size/weight/border rather than more color?

**Current state, confirmed in `OpportunityRow.tsx`**: every card, regardless of urgency or
funding, renders the identical frame — `border border-line rounded-[var(--radius)] bg-bg`. The
only urgency signal today is the small `t-meta` deadline string in the bottom-right corner turning
`text-urgent`. On a feed of 6–8 cards, an urgent deadline three weeks out and one closing tomorrow
look structurally indistinguishable until you read the corner text.

**Proposed**: when `deadlineInfo.isUrgent` is true (the existing `days_left < 7` condition, no new
logic), the card's full border upgrades from `border border-line` (1px, `#1F1F1F`) to `border-2
border-urgent` (2px, `#E5484D`) — reusing the token that already means exactly this one thing
site-wide, at a heavier weight, applied to the frame instead of one line of text inside it. No new
color is introduced (directly answering the prompt's own constraint), no shadow, no fill — still a
border-only system exactly as `DESIGN_BRIEF.md` §3's "surface logic" section requires.

**Why this earns its place rather than being decoration**: `--urgent` is already named in
`DESIGN_BRIEF.md` §3 as "the single 'must-notice' signal — reserved for <7-days-left, never reused
for anything else." Putting that same signal on the frame isn't a new use of the color — it's the
existing single most time-sensitive fact in the whole product getting a frame instead of a
footnote. This is the most direct, literal answer to "the Hub feels uniformly gray" that stays
inside every rule already on the books: it uses zero new hues, and it only fires on content that
already, unambiguously, deserves the extra weight.

**Verdict: adopt.** Scope this to the Hub row first (the screen actually being reviewed); the
Sources directory and Discover rows don't carry a deadline concept, so this doesn't extend to them
by default — flagging that as expected, not an oversight.

---

## 6. Combined per-screen effect (Option B, on top of the already-shipped Option A baseline)

| Screen | What changes under Option B | Structural change needed? |
|---|---|---|
| `/` landing | `--radius: 0px` (hero CTA, chip corners); `.t-display` size 36→40/64→72 | No |
| `/hub` | `--radius: 0px`; card gap `gap-4`→`gap-2`; header margin `mb-6`→`mb-4`; `.t-title` size 22→24/28→32; funded/no-fee cards get a 3px accent left-edge; urgent cards (<7 days) get a full 2px `--urgent` border | No |
| an opportunity detail page | `--radius: 0px`; `.t-title` size increase if this page uses `t-title` for its header (verify against current code, same caveat Option A flagged) | No |
| `/sources` | `--radius: 0px`; card gap/header spacing tightened if this directory reuses the same card component as Hub; `.t-title` size increase (page header) | No |
| a source detail page | `--radius: 0px`; `.t-title` size increase (institution name) | No |
| `/discover` | `--radius: 0px`; `.t-title` size increase (page header) | No |
| a public profile (`/a/[handle]`) | `--radius: 0px`; `.t-title`/`.t-display` size increase per whichever element the page actually uses | No |

Every row is a token-value substitution (`--radius`) or an existing-style-rule/Tailwind-class value
edit — the same "no layout/component rewrite" property Option A held itself to. The two proposals
I explicitly rejected in §4 (filled chip) stay rejected everywhere, not just on the Hub.

---

## 7. Verification data

- **`--urgent` (`#E5484D`) as a non-text UI border against `--bg` (`#0A0A0A`)**: relative luminance
  of `#E5484D` ≈ 0.218, of `#0A0A0A` ≈ 0.00304 (same method as Option A §3.1 and the Task 02
  precedent). Contrast ratio ≈ **5.06:1** — clears WCAG 1.4.11's 3:1 floor for non-text UI
  components with real margin, and clears the stricter 4.5:1 text floor too, for whenever this
  value sits near text (it already does, as the deadline label itself). This is a **new usage
  context** for an existing color (frame, not text) — logging it here per this department's
  standing rule to compute and log contrast whenever a muted/signal color is applied in a new way,
  even though the pairing itself already existed.
- **`--accent` (`#AA80FF`) as a card-edge border against `--bg`**: reuses the exact contrast figure
  Option A already computed and logged (6.8:1) — no new pairing, just a new location for the same
  color/background pair, so no new number to log.
- `--radius: 0px` has no contrast implication (it's a shape property, not a color).
- Type-size changes have no contrast implication (weight/color unchanged, only `font-size`).
- No new hex/rgb/font-name in any `.tsx` file: `--radius`'s new value lives in `app/globals.css`'s
  `:root` block exactly where `2px` lives today; the differentiator flag-bar and urgent-border
  proposals use Tailwind's existing `border-accent`/`border-urgent` utility classes (already wired
  to the `--accent`/`--urgent` tokens via the `@theme inline` block), not a literal color value.

---

## 8. Summary for the owner — what I'd actually ship, and why

Two of these five I'd ship without hesitation: **§2 radius → 0px** and **§5 the urgent-card
border**. Both are cheap, both use tokens/colors the system already has, and both are the kind of
change that reads as "different" the moment you open the app on your phone rather than something
you have to be told to notice. Radius answers "generic and safe" directly; the urgent border
answers "everything looks uniformly gray" directly, using the exact color the product already
reserves for "look at this one."

One I'd ship with real confidence but slightly less urgency: **§1 the density notch** (tighter card
gap, tighter section margin). It's genuinely low-risk and does make more visible at once, but it's
a smaller perceptual jump than the corner-radius change — worth doing, not the thing that alone
would make the owner say "that's different now."

One I'd ship the primary version of and treat the secondary as a "try it and see": **§3
typography**. The size increase is safe and I'd do it; the Manrope-700 weight bump is a real font-
loading change for a subtler payoff, so I'd want it built and looked at live before committing
either way, not specified blind.

One I would not ship as asked, but did find a real bolder alternative for: **§4 accent fill on the
chip**. Filling the differentiator chip is, on the evidence already gathered for Option A, the
single most concrete "this is what makes a competitor's card look generic" pattern identified in
this whole research effort — doing it anyway would mean reversing that finding without new
evidence. The card-edge flag-bar answers the same underlying ask (accent showing up more
forcefully) without touching the chip or reopening that finding.

Net: **radius and the urgent border are the two moves I'd bet on for "this finally looks
different."** Density and typography are real, worth doing, second-tier. The accent-fill idea, as
literally proposed, I'd decline — but its replacement (the flag-bar) is worth doing alongside the
other four.

Everything above stays inside `app/globals.css`'s variable system and existing Tailwind utility
classes tied to those variables — one token value change (`--radius`), a handful of `font-size`
numbers inside already-existing named style rules, and conditional Tailwind class strings on
already-existing components (`OpportunityRow.tsx`, `HubFeedView.tsx`). No new hex value, no new
font family, no new dependency, no component redesign. Ready for the owner to compare against
Option A and pick a direction — or mix specific items from each, since nothing here is presented as
all-or-nothing.
