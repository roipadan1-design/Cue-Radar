# Research mission 2: the curators and programmers of Kyoto and Tokyo's underground scene

> **How to use this file:** send it in the same session as `FABLE_PROMPT.md` (after Phase 1 of
> that brief), or in a fresh session with `FABLE_CONTEXT.md` attached. If `places.csv` from the
> first mission exists, attach it too. The curators you find here link to those places.

---

## 0. What this is for

Fellow. has a **Curators** directory. Each person gets a page that looks like a professional
profile: name, "Role · City, Country", an **About** section, the organisations they work with,
and public contact links. For the Kyoto/Tokyo pilot, a visiting artist uses it to find out **who
programmes the scene**: who books the improv nights, who curates the artist-run gallery, who runs
the dance festival, and which collective's organiser to say hello to after a show.

**Deadline:** a first batch is needed by **Tuesday 20 October 2026** (tomorrow). Deliver
**15 Tokyo + 8 Kyoto** people first, then continue to the full target.

**Target (full):** **40 Tokyo + 20 Kyoto** people across dance, music and exhibitions.

## 1. Who counts

People who **shape what gets shown** in the underground and alternative scene (see the scoring
rubric in `FABLE_PROMPT.md` §2.3; only scenes scoring 3 or higher):

- curators and directors of artist-run spaces, project spaces, independent galleries
- programmers and bookers of experimental music venues and series
- artistic directors and programmers of dance houses, small theatres, and festivals
- organisers of collectives, recurring parties, improv series, and dance labs
- residency directors, and curators of experimental programmes at institutions
  (role score 3: include, and say so)

Not in scope: commercial gallery sales staff, mainstream promoters, critics who don't programme
anything, artists with no programming role. Artists come later, in a separate directory.

## 2. Privacy and accuracy rules (stricter than the places brief)

These are real people. Follow these rules exactly:

1. **Public professional role only.** Include a person only if a public, official page (their
   organisation's site, a festival credits page, an official programme, a published interview
   or profile in arts media) names them in that role. `evidence_url` must point to that page.
2. **No private data.** No personal phone numbers, personal emails, home addresses, family,
   age, or anything outside their professional work. Contact links are limited to **their own
   public website** and **their own public professional Instagram**, if they have one, or the
   organisation's official contact page.
3. **No photos.** Don't collect or link portrait images. The product shows initials only.
4. **Nothing invented or inferred.** Don't guess a role from a single mention, and don't merge two
   people with similar names. If a role might be out of date (they may have left), check for a
   2025–2026 mention. If you can't find one, leave the person out, or mark `status = inactive`
   with a note in the log.
5. **Your own words.** `about` is a summary you write. Never paste a bio.
6. **Names as they publish them.** Use the romanised name the person or their organisation uses
   in English, and put the Japanese name in `name_ja`.

## 3. How to search

- Start from the places in `places.csv` (or the leads in `FABLE_CONTEXT.md` §7). For each one,
  open the About, staff, or ディレクター / キュレーター / 主宰 / プログラムディレクター pages and the
  credits of recent programmes.
- Festival and programme credits: `キュレーター`, `ディレクター`, `プログラマー`, `主宰`, `企画`,
  `芸術監督`, `ディレクション`, `企画・制作`.
- Arts media interviews (English and Japanese) are good evidence for role and background.
- Follow the network: the people who co-curate, or appear in each other's programmes, lead to
  the next person.

## 4. Deliverable: `curators.csv`

UTF-8 CSV, header exactly:

```
curator_id,name,name_ja,role_label,market,about,disciplines,affiliations,website_url,instagram_url,evidence_url,verified_at,status,underground_score,notes
```

| Column | Rule |
|---|---|
| `curator_id` | `tyo-cur-` / `kyo-cur-` + lowercase slug of the name, e.g. `tyo-cur-yamada-taro`. Unique. |
| `name` | Romanised name as they use it publicly |
| `name_ja` | Japanese name, if published |
| `role_label` | Short and specific, shown on the page: `Curator`, `Programmer`, `Artistic director`, `Festival director`, `Organiser`, `Residency director`, `Booker` |
| `market` | `kyoto` or `tokyo`: the city they mainly work in |
| `about` | **Shown as the "About" section.** 2–3 short paragraphs, 300–900 characters, English, your own words: current role(s), the kind of work they programme, notable recent programmes or series (with years), and what that means for a visiting artist. Professional facts only. Separate paragraphs with a blank line inside the quoted cell. |
| `disciplines` | Comma-separated, from: `dance`, `music`, `sound`, `performance`, `painting`, `sculpture`, `visual_art`, `photography`, `film`, `theatre` |
| `affiliations` | Comma-separated `source_id`s from `places.csv` (e.g. `tyo-forestlimit`) of organisations they currently work with. If the organisation is not in `places.csv`, add it there (it needs a row for the link to work). |
| `website_url` / `instagram_url` | Their **own** public professional pages only. Empty if none. |
| `evidence_url` | The official page that names them in this role |
| `verified_at` | YYYY-MM-DD |
| `status` | `active`, or `inactive` if you couldn't confirm the role for 2025–2026 |
| `underground_score` | 3–5, the score of the scene they programme |
| `notes` | Internal only, not shown: anything the team should know (e.g. "also runs a small label", "role confirmed only in Japanese press") |

Also append to `VERIFICATION_LOG.md`: how many people you checked, who you dropped and why (role
unconfirmed, outside scope, privacy concern), and every `inactive` row.

## 5. Self-check before handing back

- [ ] Every person has an `evidence_url` naming them in that role, from 2025 or 2026.
- [ ] No private contact details and no photos anywhere.
- [ ] Every `affiliations` id exists in `places.csv`.
- [ ] Every `about` is your own words and 900 characters or fewer.
- [ ] There's a balance across dance, music, and exhibitions in both cities.
