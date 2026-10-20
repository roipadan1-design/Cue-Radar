# Naming for the city-and-dates area and the people-and-places area (proposal, not a decision)

Creative Director, 2026-10-19, revised after the owner's ban. Nothing here is wired into app code. The owner approves first.

Owner ban: "Explore the city" is out. So are explore, discover, find, browse, see, search and "see what's on" style verbs, and generic app-store vocabulary, in nav labels, titles, subtitles and buttons. Also kept: no "alternative / underground / independent / outside the mainstream", no exclamation marks, no emoji, no dashes as pauses, no "unlock / journey / empower". Buttons use trade phrases or plain verbs of the work (read, ask, meet, set, load in). Subtitles claim only what is live. Artists is Coming soon, so it is not mentioned.

The split to make obvious:
- Area 1 (`/circuit`, `/circuit/[city]`): time-based. A city plus your dates, and what is on.
- Area 2 (`/discover`): people and places. Organizations and curators. Not time-based.

---

## Pair A: The bill / Who's who

| | Area 1 | Area 2 |
|---|---|---|
| Nav label | The bill | Who's who |
| Page title | The bill for your dates | Who's who in each city |
| Subtitle | Shows, classes, openings and jams in the city you're in, on the dates you're there. | The spaces, collectives, festivals and curators behind each city's program. |
| Button | Read the bill | Ask around |

Logic: a bill is the list of what is on; a who's who is the list of who is there. One is about time, the other about people, and both are old print forms. "Ask around" is what a touring artist does in a new city.
Caveats: "bill" can read as an invoice to a non-trade reader, so the subtitle must carry it. "Who's who" puts people before places.
Siblings: "The bill, Who's who, Open calls, Funding" reads well. Two phrases and two plain nouns, with no overlap in meaning.

## Pair B: Circuit / Local knowledge

| | Area 1 | Area 2 |
|---|---|---|
| Nav label | Circuit | Local knowledge |
| Page title | The circuit, by city and date | Local knowledge: the rooms and the people who run them |
| Subtitle | What is on in a city while you're there: shows, classes, openings, jams. | Venues, galleries, collectives and festivals, and the curators who program them. |
| Button | Check the circuit | Ask locally |

Logic: "circuit" is already the route and the round-one pick for this page, and it is the artist's word for the city-to-city path. "Local knowledge" is what the directory holds and what a stranger lacks.
Caveats: "Circuit" strictly means the path across cities, while the page shows one city. "Check" is the weakest verb in the set.
Siblings: "Circuit, Local knowledge, Open calls, Funding" works, but "Local knowledge" is the longest label and may need truncation on mobile.

## Pair C: Your run / The crew

| | Area 1 | Area 2 |
|---|---|---|
| Nav label | Your run | The crew |
| Page title | Your run, city by city | The crew and their rooms |
| Subtitle | Name a city and the dates you'll be there. Shows, classes, openings and jams, in order. | The collectives, curators, spaces and festivals that make each city's program. |
| Button | Set your dates | Meet the crew |

Logic: a run is the span of time you are in a place; a crew is the people you work with. The pair is warm and personal, and the only one that speaks directly to "you".
Caveats: "Crew" under-signals venues and festivals; the title adds "their rooms". "Your run" could be misread as running, though the touring context helps.
Siblings: "Your run, The crew, Open calls, Funding" mixes possessive and article forms, the least tidy set.

---

## Recommendation

Pair A. "The bill" and "Who's who" are two print forms every touring artist knows, and each says which question it answers, time or people. "Read the bill" and "Ask around" are plain verbs of the trade and do not sound like an app.

---

## Review of the three hero options against the same ban

Source: `docs/creative/HERO_COPY_OPTIONS_2026-10-19.md`.

| Where | Current | Verdict | Replacement |
|---|---|---|---|
| Option 1 button | See what's on | Generic | Read the bill |
| Option 2 button | Find the rooms | Generic (banned verb) | Walk in |
| Option 3 button | Plan the stay | Generic app verb | Load in |
| Option 1 sub-line | "Pick a city and your dates to see the shows, rooms and openings..." | "see" | "Name a city and your dates. Shows, rooms and openings, the curators and spaces behind them, and the open calls coming next." |
| Option 2 sub-line | "Find the spaces, curators and makers where you're headed, see what they have on..." | "find", "see" | "Know the spaces, curators and makers where you're headed, what they have on while you're there, and the calls and residencies that follow." |
| Option 3 sub-line | "...see what's on that week..." | "see" | "Before you load in, know what's on that week, who runs the spaces, and which residencies and open calls are worth the trip." |
| Headlines 1, 2, 3 | You just landed. Here is what's on tonight. / Every city has rooms you haven't walked into yet. / Wherever the work takes you, someone is already making something. | Pass. Plain speech, no app vocabulary. | Keep. |

Note: "Read the bill" as the hero button only works if the nav uses Pair A. If another pair is chosen, use that pair's Area 1 button on the hero. "Walk in" matches headline 2 ("haven't walked into yet"); "Load in" matches the first clause of sub-line 3.
Also check: the 404 and Hub pages carry "Explore the city" links, and the nav label, which would change with Area 1.

## Implementation notes

- Route names stay (`/circuit`, `/discover`); this is label and copy only.
- Check nav truncation on mobile for "Who's who" and "Local knowledge".
