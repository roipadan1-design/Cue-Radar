# Mission A: contact routes for the curators we already have

> Attach `00_CONTEXT.md` and `input/curators_current.csv` (+ `input/institutions_existing_japan.csv`
> for Part 2). Read `00_CONTEXT.md` §6 (ground rules, contact rules, Instagram rule) before you start.

## 0. Why

Each of our 26 curators has a page with a **Contact** section, but most have it empty or have a
single link. A page with no way to reach the person is useless to an artist. For every person (and,
in Part 2, every organisation) find the **legitimate public ways to contact them**:

**Instagram, personal website, portfolio, e-mail, and a contact form**, plus the organisation's
official contact route as a fallback. Nothing else is in scope.

**Deadline:** first 12 people within the first hour of work; the rest in the same session.

## 1. Part 1: the 26 people in `curators_current.csv`

For each row (include the `inactive` one; check whether the role is still valid):

1. Open the `evidence_url` and the organisation websites in `affiliation_websites`. Find the person's
   page, credits, or bio.
2. Look for, in this order:
   a. **Personal or professional website / portfolio** (also Linktree-style pages, `note.com`,
      Cargo/Wix/Notion pages, Behance, Vimeo, Bandcamp *only when it is their professional page*).
   b. **Instagram** (apply the rule in `00_CONTEXT.md` §6.2).
   c. **E-mail** (apply §6.1). Check, in order: the person's own site (contact/about), the
      organisation's staff or contact page, the programme or open-call page they run, festival press
      pages, the "contact" line of a recent programme leaflet that is online.
   d. **Contact form** on the person's or organisation's site.
   e. **Organisation contact page / role address** as the fallback route.
3. Re-check the role: does a page from **2025 or 2026** still name them in this role at this
   organisation? Record the page. If they have left or you cannot confirm, say so.
4. Note any **new organisation** they now work with that is not in `affiliations` (do not add it to
   the list; just name it in `new_affiliations_found` with its website).

Search in Japanese too: `<name_ja> 連絡先`, `<name_ja> お問い合わせ`, `<name_ja> ポートフォリオ`,
`<name_ja> Instagram`, `<organisation> スタッフ`, `<organisation> お問い合わせ`.

### Output: `curators_contacts.csv`

UTF-8 CSV, one row per person, **all 26 rows even if you found nothing** (leave cells empty), header
exactly:

```
curator_id,name,website_url,portfolio_url,instagram_url,instagram_evidence,instagram_candidate_url,contact_email,email_type,email_evidence_url,contact_form_url,org_contact_url,other_links,best_contact_route,identity_confidence,role_still_valid,role_evidence_url,new_affiliations_found,contact_notes,checked_at
```

| Column | Rule |
|---|---|
| `curator_id`, `name` | Copy from the input |
| `website_url` | The person's own site. If we already have one, confirm it still works; keep or replace |
| `portfolio_url` | Portfolio or professional page that is not their main site (Behance, Vimeo, Bandcamp, note.com…) |
| `instagram_url` | Confirmed public professional account, as `https://www.instagram.com/<handle>/` |
| `instagram_evidence` | `linked_from_site`, `bio_links_back`, or `credited_by_org`, plus the URL of the page that proves it |
| `instagram_candidate_url` | Plausible but unconfirmed account (then `identity_confidence = low`) |
| `contact_email` | Exactly as published. Empty if none |
| `email_type` | `personal_published` (person's own address, published by them or their org for professional use), `organisation_role` (info@, program@, press@…), or empty |
| `email_evidence_url` | The page where you read the address |
| `contact_form_url` | Contact form on their own or their organisation's site |
| `org_contact_url` | The organisation's official contact/お問い合わせ page |
| `other_links` | Other professional public links, comma-separated (X, Facebook page, LinkedIn, note.com…), only if linked from an official page |
| `best_contact_route` | The single best route to show: `email_personal`, `email_org`, `contact_form`, `website`, `instagram`, `org_page`, or `none` |
| `identity_confidence` | `high` (an official page ties it to this exact person), `medium`, `low` |
| `role_still_valid` | `yes` (2025–26 page found), `unclear`, `no` |
| `role_evidence_url` | Page proving the current role |
| `new_affiliations_found` | Other organisations they now work with: `Name (website)`, separated by ` | ` |
| `contact_notes` | Internal. Anything the team should know: two similar accounts, role confirmed only in Japanese, "no personal route exists, only the festival form" |
| `checked_at` | `YYYY-MM-DD` |

## 2. Part 2: the Japan organisations (`institutions_existing_japan.csv`)

Same exercise, shorter. For every **active** organisation in the file, find: official **contact
e-mail** (usually `info@` or the programme address), **contact form**, **Instagram** (confirm with
§6.2), **calendar URL** if missing, and **venue phone and street address** if published (these are
allowed for organisations). Skip rows with `status = closed`.

### Output: `institutions_contacts.csv`

```
source_id,name,website_url,instagram_url,instagram_evidence,contact_email,email_type,email_evidence_url,contact_form_url,phone_public,address_public,calendar_url,best_contact_route,still_active,activity_evidence_url,contact_notes,checked_at
```

`email_type` is `organisation_role` or `personal_published` (if the page lists a named programmer's
address). `best_contact_route` uses the same values as Part 1. `still_active` is `yes`, `unclear`,
or `closed` with the page that shows it.

## 3. Report: `MISSION_A_report.md` (short, English)

- How many people had at least one **usable route** after your work (and how many before: use
  `curators_current.csv`).
- A table: how many have e-mail / Instagram / website / form / none.
- The people with **no route at all**, and what you tried.
- Roles you could not confirm for 2025–26, and corrections to existing data (closed venues, people
  who left).
- Any case where you deliberately did **not** record something for privacy reasons.

## 4. Self-check before you hand back

- [ ] Every non-empty e-mail has an `email_evidence_url` that you opened and that shows that exact
      address.
- [ ] No e-mail was built from a pattern; no data-broker or e-mail-finder site was used.
- [ ] Every non-empty `instagram_url` has `instagram_evidence`.
- [ ] No personal phone numbers, home addresses, photos or family details anywhere.
- [ ] All 26 people are in the file; empty means "not found", never "guessed".
