# Task 23: home page copy

Creative Director proposal, 2026-10-19. Nothing here is wired into `app/page.tsx` yet. The owner
approves, then an engineer pulls the strings in. Register unchanged: museum wall label, sentence
case, no exclamation marks, no emoji, no marketing adjectives. No city names (the page renders
cities from `markets` below the hero). English only.

## Headline (H1)

1. **"Where to be tonight, who to know, what comes next." (recommended)**
2. "The scene, the people and the support behind the work."
3. "A home for the work, and everything around it."

## Sub-line

1. **"For independent artists outside the mainstream: this week's shows, classes and openings,
   the people and spaces behind them, and the open calls and grants that carry the work further."
   (recommended)**
2. "Dance, music, performance and exhibitions off the main stage. What's on this week, who makes
   it, and the calls and funding that come next, all checked by people."
3. "Open calls, funding, the people who make the scene, and a guide to its week, in one place."

## Four pillars

Shown in this order: the live pillar first, so the row matches the primary CTA. If the owner
prefers the definition's order (open calls, funding, people, city), the lines work in that order too.

| Label | Line |
|---|---|
| What's on | Shows, classes, jams, parties and openings, today and this week. |
| People | Artists, curators, collectives and spaces, and a page that introduces you. |
| Open calls | Residencies, commissions and calls for work, with the deadline up front. |
| Funding | Grants and support for independent work, checked before they're listed. |

**Truth flag:** the open calls feed (`/hub`) is still paused. Until it reopens, the Open calls and
Funding tiles should carry the UI's existing "coming soon" marker (the same treatment as the
current footer line). Leaving it off would claim something that isn't live.

## CTAs

- **Primary (to Explore, `/circuit`): "Explore the city"**. This is already the live label. It is
  plain and accurate, and it names no city.
- **Secondary: "Create your profile"** when signed out, **"Your profile"** when signed in. Check
  that `/signin` really creates new accounts. If it only signs people in, use "Sign in".

## Rationale

The headline covers all four pillars in three short phrases, without listing them as features.
"Where to be tonight" is the city guide. "Who to know" is the connections side. "What comes next"
covers open calls and funding, which are about the next piece of work. Then the sub-line names
each thing plainly, so the poetry never has to carry the facts alone. I left out the familiar
startup words ("discover", "unlock", "community", "all-in-one", "platform") and any number, user
count or partner. I also left out "underground" from the H1, because a product that calls itself
underground stops sounding underground; "outside the mainstream" in the sub-line says the same
thing more quietly. "Checked" appears once, in the Funding tile, because person-checked listings are
the one claim the product can back today.
