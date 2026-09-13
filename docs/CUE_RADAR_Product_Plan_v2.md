# CUE RADAR — תוכנית מוצר, UX ועיצוב טכני (v2)
נכתב 2026-09-12 · מבוסס על HANDOFF_V3, ה-README של ה-Master Database ומחקר שוק בפלטפורמות מקבילות.
מיועד לשמש בריף למתכנת/ת ולמעצב/ת. מונחים טכניים ושמות שדות באנגלית בכוונה.

---

## 0. התזה במשפט אחד

**Cue Radar הוא לא רשת חברתית ולא לוח מודעות. הוא "מערכת הפעלה לקריירה" שמסתובבת סביב שלוש שאלות שאמן עצמאי שואל כל שבוע:**
1. **למה כדאי לי להגיש עכשיו?** → ה-Hub
2. **מה קורה איפה שאני אהיה?** → Trip Radar
3. **מי אני, ואיך מוצאים אותי?** → דף אמן

כל פיצ'ר חדש צריך לעבור מבחן פשוט: האם הוא עוזר לענות על אחת משלוש השאלות האלה? אם לא – הוא לא נכנס ל-v1.

---

## 1. מה קיים בשוק (ומה החור שאנחנו ממלאים)

| פלטפורמה | מה היא עושה טוב | מה חסר (ההזדמנות שלנו) |
|---|---|---|
| **ArtConnect** | האגרגטור הגדול לאמנות חזותית: open calls, רזידנסי, מענקים; פילטר לפי דדליין, התראות; "Assistant" שמתאים הזדמנויות לפי מטרות ותחום ומיקום | מוטה אמנות חזותית; מודל pay-to-post; אין ממד גיאוגרפי/זמני של "אני בעיר X"; אין מחול/סאונד כקטגוריה ראשית |
| **TransArtists / Res Artis** | מאגרי רזידנסי ענקיים (1,700+ / 700 חברים) | דירקטורי, לא פיד; אין פרסונליזציה; UX של שנות ה-2010; רזידנסי בלבד |
| **On the Move** | מוביליות תרבותית, עמוד דדליינים, ניוזלטר חודשי, מדריכי מימון לפי מדינה | לא מוצר – מגזין/ניוזלטר; אין פרופיל, אין שמירה, אין סנכרון ליומן |
| **Dancing Opportunities** | סדנאות/אודישנים למחול, בלוג-סטייל | רשימה שטוחה, בלי פילטרים אמיתיים, בלי דדליין-מרכזיות |
| **Resident Advisor** | הרפרנס העיצובי שלנו: עיר-קודם, פילטר לפי תאריך/ז'אנר/סוג, "פיד אישי" של venues/promoters/artists שעוקבים אחריהם, דפי אירוע עשירים עם embeds | מוזיקה אלקטרונית בלבד; אין קולות קוראים; אין פרופיל מקצועי לאמן עצמאי |
| **ImPulsTanz / פסטיבלים** | תוכניות סדנאות ענקיות (250+ סדנאות, 130 מורים) | סגור בתוך אתר הפסטיבל – אף אחד לא מאחד את זה לרוחב ערים |
| **CoCreatea / KollabMe / Vampr** | "מצא שותפים ליצירה" – swipe, match, צ'אט | בדיוק מה ש**לא** רוצים: דמוי טינדר, ללא הקשר, איכות נמוכה, מוטה מוזיקה מסחרית |
| **touring-artists / IETM** | מידע מקצועי (ויזות, מיסים, רשתות) | ידע סטטי, לא הזדמנויות |

**החור:** אין מוצר אחד שמשלב (א) פיד הזדמנויות מאומת ומסונן לפי דדליין, (ב) שכבת זמן-ומקום ("מה קורה כשאני שם"), ו-(ג) זהות מקצועית עריכתית – **עבור אמני מחול, פרפורמנס וסאונד ניסיוני** בסצנות אירופה/ים-תיכון/מזרח-אסיה. RA עשתה את זה למוזיקה אלקטרונית; אנחנו עושים את זה לסצנה העצמאית הבין-תחומית.

---

## 2. ה-HUB — פיצ'רים חדשים

הבסיס (מ-HANDOFF_V3) נשאר: רשימה צפופה, ממוינת לפי דדליין, צ'יפ דחיפות, בלי תיאורים בכרטיס, פילטרים ב-URL. על זה מוסיפים – **בסדר עדיפות:**

### 2.1 "מתאים לי" (Fit) — הפיצ'ר החשוב ביותר
הפרופיל כבר יודע: תחומים, מדינת דרכון/תושבות, שלב קריירה, עיר בסיס. ההזדמנות יודעת: `discipline_flags`, `eligibility_geo`, `career_stage`.
- כל כרטיס מקבל תג שקט: **Eligible / Check / Not eligible** (מונו, בלי צבע רועש).
- מתג ראשי בפילטרים: **"Show only what I'm eligible for"** – ברירת מחדל דלוקה למשתמש מחובר.
- דף ההזדמנות מסביר *למה*: "Open to EU residents · you're based in Berlin ✓ · emerging ✓".
- טכנית: פונקציית `fit_score(profile, opportunity)` → `eligible | check | ineligible` + רשימת סיבות. אין ML, רק כללים. אפשר לחשב ב-SQL view או בקליינט.

### 2.2 מד מאמץ (Effort)
`materials_required` כבר קיים. ממפים לשלוש רמות:
- **Light** – CV + לינק לשואוריל
- **Medium** – + מכתב מוטיבציה / הצעת פרויקט קצרה
- **Heavy** – הצעה מלאה + תקציב + לוח זמנים + המלצות
מוצג כאייקון קטן בשורה 1 של הכרטיס. אמן שיש לו 3 ימים לדדליין מסנן "Light only".

### 2.3 מתגים כספיים
- **No fee** (`application_fee = 0`)
- **Funded** (`funding_type != none`)
- **Covers housing / travel** (`covers`)
טכנית: שלושה בוליאנים ב-URL. חשוב במיוחד לאמנים ישראלים/גאורגים/ים-תיכוניים שעלות הנסיעה מכרעת.

### 2.4 תצוגת יומן
מעבר בין **List** ↔ **Calendar** (חודש). הדדליינים כנקודות בתאריכים. שמורים בולטים. הזדמנויות rolling בפס עליון "Rolling".
+ **ICS subscription**: `/saved/calendar.ics?token=...` – כל מה ששמרת מסתנכרן ליומן גוגל/אפל אוטומטית. הרבה יותר שימושי מ-ICS פר-הזדמנות.

### 2.5 דפי מקור (Source pages) + "קצב" של קולות קוראים
`/sources/[id]` – דף לכל אחד מ-268 המוסדות: מה הם, עיר, תחומים, קולות קוראים פעילים, **וארכיון של קולות קוראים קודמים**.
מהארכיון נגזר הפיצ'ר המבדל: **"Usually opens in March · Expected next: ~Mar 2027"**. אף פלטפורמה לא עושה את זה. אמן יכול ללחוץ **"Remind me when this reopens"**.
טכנית: `opportunities.recurrence` (`annual | biennial | rolling | one_off`) + `expected_next_open` שמחושב מ-`created_at`/`deadline` של המופע הקודם. שמירה של הזדמנות שפגה = "watch source".

### 2.6 חותמות אמון
בכל דף הזדמנות: `Verified {date} by Cue Radar · Last checked {date} · Source: {institution}`. זה ההבדל בין אגרגטור לבין מוצר עם אחריות עריכתית. אם `last_checked` > 30 יום – תג "Re-verify" פנימי לצוות.

### 2.7 Pipeline משופר (`/saved`)
קיים: `saved → drafting → submitted → accepted → rejected`. מוסיפים:
- תזכורות: **7 ימים** ו-**48 שעות** לפני דדליין למה ש-`drafting` (מייל/פוש).
- שדה `outcome_note` – למה התקבלת/נדחית. עם הזמן זה הופך לנתון היקר ביותר במערכת (ראה §4.4).
- **Materials vault** – האמן מעלה פעם אחת: CV (PDF), ביו קצר/ארוך, שואוריל, 5 תמונות. דף הזדמנות מציג "You have 3 of 4 required materials".

### 2.8 Peer Calls (קולות קוראים בין אמנים)
סוג הזדמנות חדש: `type = peer_call`, שמפרסם **אמן** ולא מוסד. "Looking for: sound designer · Brussels · Nov 3–20 · paid (€800)".
מופיע ב-Hub עם תג ויזואלי שונה (מסגרת מקווקוות). זה הגשר הטבעי בין ה-Hub לבין השאלה "איך אמנים מוצאים אחד את השני" (§5). דורש אישור (moderation queue) לפני פרסום.

### 2.9 Digest שבועי
`radar_preferences.alert_frequency` כבר קיים – רק צריך לממש. מייל יום ראשון בבוקר: "5 new · 3 closing this week · 1 source you follow reopened". טקסט בלבד, מונו, בלי תמונות. RA-style.

### 2.10 פיצ'רים ל-v2 (לא עכשיו)
חיפוש בשפה טבעית ("residencies for sound artists in Japan with housing"), המלצות מבוססות התנהגות, סטטיסטיקות מקור ("acceptance rate ~4%" מתוך `outcome_note`).

---

## 3. TRIP RADAR — דיוק הקונספט

### 3.1 מה זה בעצם
Trip Radar עונה על שאלה אחת: **"אני בעיר X בין תאריך A ל-B – מה כדאי לי לעשות שם מקצועית?"**
יש לו שני צדדים שחייבים לחיות ביחד:

**צד A – "אני נוסע/ת" (הצהרה)**
האמן מוסיף Trip: עיר, from/to, מטרה (`residency | touring | research | teaching | personal`), הערה חופשית ("premiering at Kaaitheater 14/11"), ונראות (`public | connections | private`).
→ מסתנכרן אוטומטית לדף האמן: **"Currently in Brussels · until 20 Nov"** ו-**"Next: Tokyo, Jan 2027"**.
→ מזין את "Artists in town" של אחרים (§3.4).

**צד B – "מה קורה" (גילוי)**
לפי העיר והתאריכים, שש שכבות תוכן, כל אחת בלשונית/סקשן:
1. **Closing while you're there** – דדליינים של הזדמנויות בעיר (מה-Hub, כבר קיים בספק)
2. **Workshops & classes** – סדנאות, כיתות אמן, drop-in classes, ריטריטים
3. **On stage** – הופעות מחול/פרפורמנס/קונצרטים ניסיוניים
4. **Exhibitions & museums** – תערוכות רלוונטיות, sound installations
5. **Festivals** – מה חופף לתאריכים
6. **Artists in town** – אמנים אחרים עם Trip ציבורי חופף (§5)

### 3.2 מודל נתונים
```
trips(trip_id PK, user_id→profiles, market→markets, date_from, date_to,
      purpose, note, visibility public|connections|private, created_at)

events (קיים – מרחיבים):
      event_id, market, venue_name, source_id→sources (nullable), title,
      event_type ∈ {workshop, masterclass, retreat, drop_in_class, performance,
                    concert, exhibition, festival, talk, open_studio, jam},
      disciplines[], date_start, date_end (NULL = single day), time,
      price_min, currency, level ∈ {open, intermediate, professional, any},
      teacher_or_artist, registration_url, registration_deadline (nullable),
      lat, lng, status draft|live|expired, confidence numeric, first_seen, last_checked

event_sources(esrc_id PK, market, name, url, kind ∈ {venue_program, festival,
      studio_schedule, city_aggregator, museum, ticketing, newsletter, instagram},
      scan_frequency_days int DEFAULT 1, parser_hint text, status)

trip_items(user_id, trip_id, event_id | opp_id, added_at)   -- "add to my trip"
```

### 3.3 מאיפה מגיע התוכן — שכבת מקורות שנייה
ה-268 המקורות הקיימים הם **מוסדות** (מי מפרסם קולות קוראים). ל-Trip Radar צריך **שכבת אירועים** – חלקית חופפת, חלקית שונה:
- **Venue programs** – רוב ה-268 מפרסמים גם תוכנית (HAU, Kaaitheater, Radialsystem, Tanzhaus...). אותו מוסד, עמוד אחר.
- **Studio schedules** – מרכזי אימון עם לוח שבועי: Marameo/Tanzfabrik (ברלין), Danscentrum Jette/P.A.R.T.S. summer (בריסל), ImPulsTanz (וינה), Deltebre Dansa, b12, Tanzwerkstatt Europa...
- **City aggregators** – tanzraumberlin.de, Berlin Bühnen, RA (לסאונד), Agenda.brussels, Tokyo Art Beat, "Digital in Berlin"...
- **Festival calendars** – EDN (רשימת פלטפורמות ופסטיבלים שנתית), Aerowaves, CTM, Atonal, Rewire, Intonal, Terraforma...
- **Museums / sound art** – ZKM, Museum of Contemporary Art per city, Lydgalleriet-style galleries
- **Retreats** – מקורות מפוזרים, יחסית קשה לסרוק; מתחילים ידנית.

**המלצה:** לא לנסות 23 ערים ביום הראשון. **פיילוט של 6 ערים** (ברלין, קלן, בריסל, תל אביב, וינה, אמסטרדם – אותן ערים שכבר בחרת ל-Hub), **~15 event_sources לעיר**, ידני. רק אחרי שרואים שהמבנה עובד – סוכן.

### 3.4 הסוכן (Trip Agent) — איך הוא עובד
```
כל יום 05:00 UTC (GitHub Action / Supabase cron):
  for each event_source where status=active and due today:
      fetch(url) → HTML/RSS/ICS/JSON
      extract(LLM, schema=events, context=market+source kind)   ← Claude API, structured output
      normalize(dates, currency, vocab)
      dedupe(fuzzy: venue + date_start + title similarity > 0.85)
      score confidence (0–1): has date? has venue? has url? matches discipline vocab?
      confidence ≥ 0.8 → events_staging (status=draft, auto_approve_candidate=true)
      confidence < 0.8 → events_staging (needs human)
  expire: events where date_end < today → status=expired
  write run_log(esrc_id, fetched_at, new, updated, errors)
```
- הפלט **תמיד** נכנס לטאב `events_staging` בגיליון (או טבלה) – **לא ישירות לאתר**. אתה מאשר בקליק, הסנכרון הקיים מעלה.
- אחרי חודש של אישורים, מקורות עם דיוק >95% עוברים ל-auto-approve.
- אותו מנוע, עם schema שונה ותדירות של 3 ימים, מייצר `opportunities_staging` מה-268 המוסדות. **מנוע אחד, שני schemas.**
- כל שורה שומרת `source_url`, `first_seen`, `raw_excerpt` – כדי שתמיד אפשר לאמת.

### 3.5 UX של מסך ה-Trip
```
┌ Brussels · 3–20 Nov 2026 · residency @ Kaaitheater          [Edit] [Share]
│ ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮  ← רצועת ימים; לחיצה על יום מסננת
├ Closing while you're there (4)
├ Workshops & classes (11)        [level ▾] [discipline ▾]
├ On stage (23)
├ Exhibitions (6)
├ Festivals overlapping (1)
└ Artists in town (3)  → פרופילים ציבוריים עם Trip חופף
```
- כל שורה: `date · time · title · venue · price` – אותה אנטומיה כמו ה-Hub, מונו, צפוף.
- **"+ Add to trip"** על כל פריט → itinerary אישי, ניתן לייצוא ICS, ניתן לשיתוף כלינק.
- **Trip brief** – 7 ימים לפני הנסיעה נשלח מייל: "Your Brussels brief: 4 deadlines, 11 workshops, 3 artists you might know".
- מפה – **לא** ב-v1. רשימה לפי יום עדיפה על מפה לקהל הזה.
- `/radar/[city]` נשאר גם בלי Trip: "What's on in Berlin this month" – דף ציבורי, SEO, נקודת כניסה לאנשים בלי חשבון.

---

## 4. דף אמן — בריף עיצובי UX/UI

### 4.1 עקרון
**דף אמן הוא CV חי, לא פיד.** אין פוסטים, אין לייקים, אין "פעילות אחרונה". הוא צריך להיראות טוב כשמפיק/ה פותח/ת אותו מהטלפון 30 שניות לפני פגישה. רפרנסים: דפי אמן ב-RA, Are.na, Cargo, וה"אסתטיקה של קורות-חיים מינימליים" (read.cv-style).

### 4.2 מבנה (מלמעלה למטה, עמודה אחת, max-width 720px)
```
01  [avatar 96px עגול]   ← שמאל
    NAME                  ← display face, 40px mobile / 56px desktop, משקל 600. הדבר היחיד הגדול בעמוד.
    Choreographer · Sound artist          ← role_label, מונו 13px, muted
    Berlin · Tel Aviv                     ← locations, מונו
    ● Currently in Brussels · until 20 Nov ← מה-trips; נקודה ירוקה קטנה; מוסתר אם אין trip ציבורי

02  [IG] [Vimeo] [Bandcamp] [Website] [Mail]   ← שורת אייקונים 20px, monochrome, בלי טקסט

03  DISCIPLINES   dance · choreography · live electronics        ← צ'יפים 1px border
    MEDIUMS       body · modular synth · field recording · light  ← חופשי, עד 8

04  INSPIRED BY   Meg Stuart, Ryoji Ikeda, Pauline Oliveros, the Wadden Sea   ← שורת טקסט אחת, מונו, עד ~120 תווים. שדה חדש profiles.inspired_by text[]

05  BIO           עד 3 פסקאות. 15px, line-height 1.6. "Read more" אחרי 500 תווים.

06  SHOWREEL      Vimeo/YouTube 16:9, privacy-enhanced, thumbnail עד לחיצה.

07  GALLERY       2 עמודות במובייל / 3 בדסקטופ, עד 12 תמונות, 4px radius, ללא כותרות – lightbox בלחיצה.
                  bucket חדש: gallery/{uid}/{n}.webp, קליינט מקטין ל-1600px.

08  SELECTED WORKS  רשימה, לא כרטיסים:
                  2025  Fault Lines · solo · Radialsystem Berlin · ↗
                  2024  Quiet Machines · sound design for Cie. XYZ · Kaaitheater · ↗
                  טבלה חדשה profile_works(id, user_id, year, title, role, venue, url, sort)

09  [Open for collab]  [Available from Jan 2027]   ← badges מ-open_for_collab / available_from

10  ── Say hi ──   כפתור ראשי אחד. ראה §5.3.
    Share ↗        מעתיק URL. לבעל הפרופיל: Edit.
```

### 4.3 טוקנים ומשטר עיצובי (מרחיב את HANDOFF Part E)
- **צבע:** `--bg #0B0B0C`, `--fg #EDEDED`, `--muted #8A8A93`, `--line #26262A`. **צבע accent אחד בלבד** בעמוד (הנקודה הירוקה של "currently in"). בלי גרדיאנטים, בלי צללים.
- **טיפוגרפיה:** Inter Tight 600 לשם ולכותרות יצירות בלבד. JetBrains Mono 400 לכל השאר. **שני פונטים, שני משקלים, סוף.**
- **מרווחים:** רשת 8px. 48px בין סקשנים. 16px בתוך סקשן.
- **מובייל קודם:** 375px. שורת האייקונים נגללת אופקית אם צריך. הגלריה 2 עמודות.
- **תמונת אווטאר:** אופציונלית. בלי תמונה – עיגול עם אות ראשונה במונו. אין תמונות סטוק, אין placeholder "מקצועי".
- **OG image:** שם + role_label + עיר על רקע כהה. נוצר אוטומטית (`opengraph-image.tsx` כבר בתוכנית).
- **RTL:** דף האמן הוא באנגלית תמיד (קהל בין-לאומי). ממשק ההגדרות יכול לתמוך בעברית מאוחר יותר.

### 4.4 מצב עריכה
- עריכה **inline** באותו עמוד (owner רואה עיפרון ליד כל סקשן), לא טופס נפרד ארוך. `/profile/edit` נשאר כ-fallback.
- מד שלמות שקט בפינה: "Profile 70% · add a showreel" – מעלה השלמה בלי להציק.
- `is_public` כבוי כברירת מחדל; בהפעלה – preview של איך זה נראה לזרים.

### 4.5 שדות חדשים ב-`profiles`
`inspired_by text[]`, `mediums text[]`, `pronouns text`, `languages text[]`, `based_since date`, `press_url text`, `cv_url text`. + טבלאות `profile_works`, `profile_images`.

---

## 5. איך אמנים מוצאים אחד את השני — מודל "Connect"

### 5.1 העיקרון: הקשר במקום גרף
פייסבוק/אינסטגרם בנויים על **גרף חברתי + פיד**. לינקדאין בנויה על **זהות מקצועית + פנייה מכוונת**. אנחנו לוקחים את השני ומוסיפים משהו ששניהם לא עושים: **הקשר**. אמנים לא צריכים "לגלוש באמנים". הם צריכים לפגוש את האדם הנכון **בגלל סיבה**. לכן אין דף "Discover artists" גנרי ב-v1. במקום זה, אמנים צצים בארבעה הקשרים:

| הקשר | איפה זה מופיע | הדוגמה |
|---|---|---|
| **Co-presence** | Trip Radar → "Artists in town" | "3 artists with public trips overlap yours in Brussels" |
| **Same opportunity** | דף הזדמנות → "Also applying" (opt-in) | "4 people saved this residency" → אפשר לפנות ולתאם |
| **Same alumni** | דף מקור → "Alumni on Cue Radar" | אמנים שסימנו ב-works שהיו ב-PACT Zollverein |
| **Complementary need** | Peer Calls (§2.8) | "Looking for a lighting designer, Vienna, Feb" |

זה מה שנותן ל-Connect **מטרה** במקום אינסוף גלילה.

### 5.2 מה **אין**
פיד, לייקים, תגובות, סטוריז, ספירת עוקבים ציבורית, "מי צפה בפרופיל שלך", חיפוש חופשי של אנשים (v1), צ'אט פתוח.

### 5.3 "Say hi" — מנגנון הפנייה
- כפתור אחד בדף האמן. פותח **טופס קצר ומובנה**, לא צ'אט:
  - `context` (dropdown): I'm in your city · Same opportunity · Collaboration idea · Just admire your work
  - `message` – עד 400 תווים
  - `my link` – פרופיל השולח מצורף אוטומטית
- הנמען מקבל מייל + התראה. **Accept** → נפתח thread פשוט (או חשיפת אימייל/IG – v1 הכי פשוט: handoff למייל). **Decline** → שקט, בלי הודעה לשולח.
- **מכסה:** 5 פניות בשבוע למשתמש. זה שומר על איכות ומונע ספאם. אפשר להרחיב למי שהפרופיל שלו מלא.
- **Connected** = פנייה שהתקבלה. רשימת Connections פרטית, לא ציבורית.

### 5.4 Follow (בלי פיד)
אפשר "לעקוב" אחרי **מקורות** ואחרי **אמנים**. התוצאה היא לא פיד אלא שורה ב-digest השבועי: "Radialsystem opened 2 calls · Maya Cohen is in Berlin next week". RA עושה בדיוק את זה עם venues ו-promoters.

### 5.5 אמון
`verified_email`, אחוז שלמות פרופיל, "connected via 2 people you know", וחותמת "Member since". בלי דירוגים, בלי כוכבים.

### 5.6 Circles (v3)
קבוצות opt-in קטנות: "ImPulsTanz 2026 participants", "Tel Aviv independent dance". ניהול ע"י מוסד או ע"י אמן. זה המקום שבו רשת מתחילה להיות רשת – אבל רק אחרי שהשכבות הקודמות עובדות.

### 5.7 מודל עסקי (רעיונות – לא להחליט עכשיו)
- **Pro** לאמנים: digest יומי, Fit מתקדם, Materials vault, tripo brief, Peer Calls ללא הגבלה. ~€6/חודש.
- **מוסדות:** פרסום מאומת של קול קורא ישירות ל-Hub (במקום שנסרוק), עם דף מקור מעוצב. ~€49/קול קורא או מנוי שנתי.
- **מה לא:** פרסומות, מכירת נתוני אמנים, "featured artists" בתשלום.

---

## 6. עיצוב טכני — מה משתנה ומה נשאר

### 6.1 נשאר כמו ב-HANDOFF_V3
Next.js 15 App Router · Tailwind v4 · Supabase (Postgres, Auth Google, Storage, RLS) · Google Sheet כמקור אמת למידע מקורט · סנכרון Python כל 6 שעות · Vercel.

### 6.2 מתווסף
| שכבה | תוספת |
|---|---|
| **DB** | `trips`, `trip_items`, `event_sources`, `profile_works`, `profile_images`, `peer_calls`, `intros` (say-hi), `connections`, `follows`, `run_log`; הרחבת `events` ו-`opportunities` (recurrence, expected_next_open, last_checked, confidence) ו-`profiles` (§4.5). buckets: `avatars` (קיים), `gallery`, `materials` (private). |
| **Views** | `hub_feed` (קיים) + `trip_feed(market, from, to)` כפונקציית SQL + `fit_score` |
| **Agent** | `scripts/agent/` – Python: `fetch.py`, `extract.py` (Claude API, structured output, schema per table), `dedupe.py`, `write_staging.py`. שני jobs: `scan_events` (יומי) ו-`scan_opportunities` (כל 3 ימים). כותב **רק** ל-staging. |
| **Email** | Resend/Postmark: digest, deadline reminders, trip brief, say-hi. Templates טקסט-מונו. |
| **Routes** | `/trips`, `/trips/[id]`, `/radar/[city]`, `/sources/[id]`, `/a/[handle]` (מורחב), `/calls/new` (peer call), `/inbox` (intros), `/saved/calendar.ics` |
| **Search** | Postgres `tsvector` על opportunities+events+profiles. pgvector רק ב-v2. |

### 6.3 עקרונות שלא מתפשרים עליהם
1. **האפליקציה לא כותבת לטבלאות מקורטות.** הכל עובר staging → אישור אנושי → סנכרון.
2. **הסוכן לא ממציא.** אין `source_url` – אין שורה.
3. **אין רשימות קשיחות.** פילטרים מ-`vocab` ו-`markets` בלבד.
4. **כל מה שנראה למשתמש נטען מ-view, לא מטבלה ישירה.**
5. **מובייל 375px קודם.** דסקטופ הוא הרחבה.

---

## 7. מפת דרכים

| שלב | מה | הצלחה נמדדת ב- |
|---|---|---|
| **P1 · Foundation** (הושלם חלקית) | סכמה, סנכרון, seed. **חסר:** יישור הגיליון (טאבים `sources/opportunities/events/vocab/markets`) ↔ הסקריפט; 60 הזדמנויות מאומתות ידנית | הסנכרון רץ ירוק; Hub מציג ≥60 שורות live |
| **P2 · Hub v1** | רשימה, פילטרים, דף הזדמנות, שמירה, ICS, auth, Fit, No-fee/Funded, אמון-stamps | אמן זר יכול למצוא ולשמור הזדמנות בתוך 60 שניות במובייל |
| **P3 · Profile v2** | הבריף ב-§4 במלואו + say-hi via email handoff | 20 פרופילים ציבוריים אמיתיים |
| **P4 · Trip Radar pilot** | trips + 6 ערים × ~15 event_sources ידניים + מסך Trip + trip brief | אמן שנוסע לברלין מוצא ≥10 סדנאות/הופעות רלוונטיות לתאריכים שלו |
| **P5 · Agent** | scan_events יומי + scan_opportunities כל 3 ימים → staging → אישור | ≥70% מהשורות שהסוכן מציע מאושרות ללא עריכה |
| **P6 · Connect** | intros in-app, peer calls, follows, digest | 30% מהמשתמשים הפעילים שלחו או קיבלו פנייה בחודש |
| **P7 · Scale** | 23 ערים, Pro, מוסדות, Circles | – |

---

## 8. שאלות פתוחות עבורך (להכריע לפני P2)
1. **שפה:** ממשק באנגלית בלבד? (המלצה: כן ל-v1.)
2. **Peer Calls** – מוודרציה ידנית שלך, או פרסום מיידי עם דיווח? (המלצה: ידני עד 100 משתמשים.)
3. **"Also applying"** – opt-in או opt-out? (המלצה: opt-in. אמנים רגישים לזה.)
4. **מכסת Say-hi** – 5/שבוע נשמע נכון? האם Pro מבטל אותה?
5. **Trip visibility ברירת מחדל** – `connections` או `public`? (המלצה: `connections`, עם עידוד להפוך ל-public.)
6. **מי מאשר את הסוכן** – רק אתה, או צוות קטן של "scene editors" בכל עיר (ראה RA Picks)? זה יכול להיות מנוע קהילה בפני עצמו.
7. **ריטריטים** – להכניס ל-v1 של Trip Radar או לדחות? המקורות מפוזרים והסריקה יקרה.

---

## נספח A — מה לבקש מהמתכנת/ת בשלב הבא
- לקרוא HANDOFF_V3 + מסמך זה.
- להשלים P1: ליישר את הגיליון לטאבים שהסקריפט מצפה להם (או להפך), להריץ סנכרון, לאמת 60 הזדמנויות.
- להתחיל P2 מהכרטיס: `OpportunityRow` + `DeadlineChip` + `FitBadge` לפי האנטומיה ב-HANDOFF Part E + §2.1.
- להקים `scripts/agent/` כשלד (fetch → extract → staging) על **מקור אחד** בלבד, ולהראות שורה אחת שנכנסת ל-staging. לא יותר מזה עד שהמבנה מאושר.

## נספח B — מקורות שנסקרו למחקר זה
ArtConnect (artists / opportunities / assistant), ArtConnect Magazine relaunch notes, TransArtists (residencies, regional platforms, other sources), Res Artis, On the Move (deadlines, newsletter), touring-artists.info (MIPs, networks, funding DB), European Dance Development Network (platforms & festivals lists), ImPulsTanz workshops programme, Dancing Opportunities, Resident Advisor (RA Pro listing features, genre filters, event ranking, RA Guide redesign case studies), CoCreatea / KollabMe / Vampr (collaboration-matching apps), Berlin Atonal / Rewire / Intonal / Terraforma (experimental sound festival landscape).
