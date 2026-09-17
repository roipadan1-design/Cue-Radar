# Profile completion prompts — spec

Owner: ux-ui-designer role. Status: proposed, not built. No code changes in this pass.

## Principle: context over generic nagging

`docs/VISION.md` (Pillar 3, point 2) is explicit about why this matters: Polywork raised
$40M+ to build a "portfolio, not job titles" identity network for the same psychographic
Fellow. targets, and shut down in January 2025 after a standalone profile-building pivot
gave people no reason to come back. The vision document's own conclusion: *"profile
completeness should be nudged from Hub/Trip Radar moments... rather than a standalone
'complete your profile' campaign."*

The rule this spec follows: **every prompt asks for exactly one field, at the moment that
field would change what the user is looking at right now.** Never ask because the profile
is incomplete in the abstract. Ask because a specific screen would work better with a
specific fact and the user is on that screen this second. If a prompt would still make
sense on a day the user opened nothing but their profile, it isn't tied to a moment and
doesn't belong here.

There is already one working example of this pattern in the product, and the prompts below
are designed to sit next to it, not duplicate it.

---

## Existing prompt (do not redesign) — first sign-in welcome banner

**Where:** `app/profile/edit/page.tsx`, shown when the auth callback (`app/auth/callback/route.ts`)
detects an empty `role_label`/`disciplines` and redirects to `/profile/edit?welcome=1`.
**Copy (as implemented):** "Add your disciplines so we can show what you're eligible for."
**Shape:** inline block, sentence case, no dismiss needed since it only renders once (the
`welcome=1` query param is only ever set by the redirect, and it's gone on the next
navigation). Not a banner that returns.

This is the one moment where "complete your profile" is acceptable, because it's the
literal first thing after sign-up, and it's already tied to a reason ("so we can show what
you're eligible for") rather than being generic. Listed here for completeness only.

---

## New prompt 1 — Trip Radar with no current city set

**Trigger:** signed-in user opens `/radar`, `profile.current_city` is null. (Today
`app/radar/page.tsx` silently defaults to Berlin — see `defaultCity = profile?.current_city
|| 'berlin'` — which means a user could read a full page of Berlin listings without
realizing the result set isn't about them at all.)

**Copy:**
> Showing Berlin — add your current city to see what's on where you actually are.

Link text: "Add current city" → `/profile/edit?next=/radar#current_city` (or the nearest
existing pattern for returning to the originating page after a field save; align with
whatever `next=` convention `app/profile/edit/page.tsx` already uses elsewhere).

**Placement:** inline block above the `RadarForm`, same visual register as the existing
Hub guest-mode block (`components/hub/HubFeedView.tsx`, "Sign in to save calls and see
which ones you're eligible for.") — muted background, centered or left-aligned single line
plus one action, no icon, no color beyond the existing `text-fg`/`text-muted` tokens.

**Dismiss/repeat rule:** small close control (×) suppresses it for the session (so someone
deliberately browsing Berlin for a friend isn't nagged twice in five minutes), but it
reappears on the next visit as long as `current_city` is still null. This is not "repeated
nagging" in the sense the anti-pattern list below means — it's a standing factual notice
that the results on screen are a fallback, not a preference reminder. It disappears for
good the moment `current_city` is set.

---

## New prompt 2 — opportunity detail page with eligibility requirements

**Trigger:** signed-in user opens `/opportunities/[slug]` (rendered by
`components/hub/OpportunityDetailView.tsx`), the opportunity has `discipline_flags` and/or
`eligibility_geo` set, and `lib/fit.ts`'s `checkEligibility()` has nothing to compare
because the relevant profile field is empty. Today this falls through to the generic
`"Check eligibility terms"` reason string — that's the string this prompt replaces in the
empty-field case only; a filled-in profile keeps producing its normal
`Discipline match` / `Seeks: ...` / `Location eligible` reasons unchanged.

**Copy (pick by which field is missing, same line as the eligibility badge):**
- Missing disciplines only: "Add your disciplines to see if you're eligible."
- Missing current city (and no `locations` entries) only: "Add your current city to see if you're eligible."
- Both missing: "Add your disciplines and current city to see if you're eligible."

**Placement:** inline text, same line/weight as the eligibility badge in
`OpportunityDetailView.tsx` (the `t-meta text-muted` row directly under the tag block), not
a separate banner. Link goes to `/profile/edit?next=/opportunities/[slug]`.

**Dismiss/repeat rule:** none needed — it isn't a banner that persists across page loads,
it's a computed line that only exists on opportunity pages that actually have eligibility
requirements and only while the relevant field is empty. Filling the field in makes it
vanish everywhere at once, automatically, because it's driven by the same profile read that
already powers `checkEligibility()`. No new dismiss state to build or store.

---

## New prompt 3 — Hub feed, no disciplines set at all

**Trigger:** signed-in user (not guest — guests already get the sign-in prompt from Task 06)
opens `/hub`, `profile.disciplines` is empty. Every row on the feed is currently unable to
show `Eligible ✓` or a discipline-based fit signal for this user, which is the one thing
Hub can offer over a plain list.

**Copy:**
> Add your disciplines to see which calls fit you.

**Placement:** inline block after the first group, same slot and visual treatment as the
existing guest-mode block in `components/hub/HubFeedView.tsx` (`my-6 p-4 bg-surface
border border-line text-center rounded-[var(--radius)]`). The two blocks are mutually
exclusive — a guest never sees this one (they see the sign-in prompt instead); a signed-in
user with disciplines set never sees either.

**Dismiss/repeat rule:** dismissible with a close control, and once dismissed it stays
dismissed (store on the profile row, e.g. a lightweight `hub_discipline_prompt_dismissed`
flag, or client-side if no schema change is wanted for pilot). Unlike prompt 1, this one is
allowed to go away for good on dismissal, because the Hub still fully works without
disciplines set — it's a quality-of-signal nudge, not a notice that the page is currently
showing the wrong thing.

---

## What not to do

- **No modal or popup that blocks the screen.** Every prompt above is inline, in the
  document flow, alongside content the user came for. Nothing should intercept a click or
  require a dismiss before the page underneath is usable.
- **No repeated nagging after a dismissal.** Prompt 3 (Hub) is dismiss-once, gone for good.
  Prompt 1 (Trip Radar) reappears only because the underlying fact it reports — "these
  results are defaulted, not yours" — stays true until the field is filled; that's a status
  notice, not a reminder, and it never fires more than once per session. Prompt 2 has no
  dismiss state because it has no persistence to nag with — it simply stops rendering the
  instant the field is filled.
- **No gamified "profile 40% complete" progress bar**, completeness score, or checklist
  widget anywhere in the product, unless the owner explicitly asks for one later. It's the
  Polywork failure mode in miniature — it turns the profile into a task to finish rather
  than a byproduct of using the Hub and Trip Radar, and it invites exactly the generic,
  standalone-nag register `docs/VISION.md` and the museum-wall-label voice both rule out.
- **No stacking multiple prompts on one screen.** If a future page could trigger two of
  these at once, show at most one — priority order: a prompt tied to why the current
  results are wrong (prompt 1) outranks a prompt tied to a quality-of-signal improvement
  (prompt 3).
- **No copy that names the product's need instead of the user's.** Every line above reads
  "add X to see Y" — the benefit is stated first from the user's side. None of them say
  "your profile is incomplete," "help us help you," or anything with an exclamation mark,
  emoji, or marketing adjective, per the existing copy rules.
- **Don't ask for a field the current screen doesn't use.** Trip Radar only ever asks for
  `current_city`; it should never piggyback a request for `showreel_url` or `bio` just
  because the profile is open to editing anyway.

---

## Open question for the owner

Prompt 1's "reappears every session until fixed" rule is a judgment call — it's the one
prompt in this set that isn't a pure one-and-done, because Trip Radar silently defaulting
to Berlin is arguably a correctness issue, not just a personalization gap. If that read is
too close to nagging in practice, the alternative is to make it dismiss-once like prompt 3,
and rely on the city being visibly labeled "Berlin (default)" in the results instead of a
recurring prompt. Worth a quick call before this gets built.
