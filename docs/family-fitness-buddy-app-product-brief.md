# TwoPlates — Product Brief (v0.2)

**Prepared for:** Guardian Apps LLC
**Date:** 6 October 2026
**Builds on:** `family-fitness-buddy-app-concept-review.md` (market scan, evidence, compliance)
**Working name:** TwoPlates (chosen 6 Oct 2026; formal trademark and App Store checks pending)
**Platform:** iOS first · US first · subscription · AI-coached · private by default

---

## 1. Mission and one-liner

**Mission.** Get parents into the gym with their kids (13+), and keep any two people training together, by giving each person a real individual programme inside one shared plan. Fitness is the product; the relationship is the outcome.

**Name.** *TwoPlates*: two plates on the bar, two plates on the table, two people. Lifter slang for a 225 lb bench is a bonus.

**One-liner.** *Two people. Two goals. One plan, one gym, one dinner table.*

**Why now.** No app pairs two people with different goals under one roof while also covering nutrition, hydration and body composition (see concept review §2). Users are cancelling stacked subscriptions for cost reasons, and platforms are racing to AI coaching for individuals, not pairs or households. Guardian Apps' private, on-device identity fits a product that holds a family's body data.

---

## 2. Who it is for

| Persona | Situation | Goal | What they need from the app |
|---|---|---|---|
| **The parent (founder persona)** | 40s–50s, trains 3–4×/week, mostly machines and dumbbells, wants to look and feel better | Muscle gain + fat loss (recomposition) | Programme that progresses, honest macros and deficit, scale trends that make sense, a reason to show up when motivation dips |
| **The adult child (first trial user)** | 18, one year of training with parent, machines and dumbbells | "Lean out": tighter, more athletic, visibly stronger | Her own programme (not a copy of dad's), toning-biased volume, nutrition that is sufficient not restrictive, her numbers private |
| **The teen (13–17, later cohort)** | New to the gym, brought by a parent | Confidence, strength, time with parent | Technique-first programme, behaviour dashboard, no calorie or body-fat UI, parent as supervisor not auditor |
| **Any buddy pair** | Couples, siblings, friends, colleagues | Varied | Same mechanics; teen rules switch on by age only |

The first trial is two adults. The teen rules are built into the data model and age gates from day one so the parent–teen cohort can be enabled without redesign.

---

## 3. Core model

### 3.1 Household and buddies
- **Household:** one payer, up to 6 member profiles, roles `adult` or `teen` (13–17). Under-13 is out of scope.
- **Buddy link:** any two members in a household are buddies by default; later, a buddy can be invited from another household (cross-household link, each pays or one household sponsors).
- **Shared plan:** a weekly calendar of *joint sessions* the pair agrees to. Each joint session has one skeleton and two individual workouts.

### 3.2 Privacy by default (decision 3)
- Each member owns their data. Body weight, body composition, calories and macros are **private to the member**.
- What buddies see of each other by default: sessions scheduled, sessions completed, streaks, PRs the member chooses to celebrate, hydration goal met (yes/no), meal plan adherence (yes/no).
- A member may opt to share any metric with a specific buddy. Teens 13–17 cannot share body metrics; their body-metric views are off entirely.
- Household data lives on-device and syncs through the member's own iCloud (CloudKit private database) with a CloudKit share for the buddy-visible slice. Guardian Apps holds no copy. AI calls carry no identifiers (see §6).

### 3.3 Teen rules (13–17), enforced by age at the data layer
- Programme: 1–3 sets × 6–15 reps, 2–3 non-consecutive days/week, 5–10% load steps, technique cues on every exercise, no 1RM/AMRAP-to-failure, no bodybuilding peaking blocks.
- Nutrition: plates and behaviours (protein each meal, fruit/veg, water, breakfast eaten), no calories, no deficit, no goal weight, no BMI, no body-fat %, no weigh-in streaks, no before/after photos.
- Parent sees the teen's sessions and behaviours, never body numbers. Parent cannot unlock teen body metrics; this is a product rule, not a setting.
- Red-flag copy and pathways: if a teen logs skipped meals repeatedly or very low intake patterns, the app shows supportive copy and a resource link, and tells the parent only "check in with X about fuelling," never numbers.

---

## 4. Feature scope

### 4.1 Training (AI-programmed, individual, joint sessions)
**Exercise library and demo content (decision, 6 Oct 2026).** Seed the library from public data and layer our own tags:
- *free-exercise-db* (github.com/yuhonas/free-exercise-db): 800+ exercises with instructions, muscle tags, equipment and step images, released under the Unlicense (public domain, no attribution required). Primary seed.
- *wger* exercise database: additional exercises, images and some videos under Creative Commons licences with per-record `license` and `license_author` fields. Use only records whose licence we can honour; show attribution in-app where required.
- Our own tags added on import: `slot`, `teenPermitted`, `jointLoad`, swap group, coaching cues. Curate down to ~150 v1 movements; keep the rest searchable.
- Novice demo: a first-run "tour" built on a synthetic demo household (two fictional buddies, six weeks of plausible logs, meals and trends) so a new user sees a living app before entering anything. Demo data is clearly labelled and deleted when the real household is created. Public-domain exercise images from the library illustrate the tour; no scraped video.

**Onboarding per member:** goal (gain, recomposition, lean/tone, strength, general), training age, 3–4 recent lifts and loads, equipment profile (commercial gym machines, dumbbells, barbell, cables, bodyweight, home kit), days available, session length, injuries/limits, movement preferences.

**Programme generation.** A rules-based periodisation engine builds a 4–6 week block from templates (upper/lower, full-body, push/pull/legs), then the AI layer personalises exercise selection, order and coaching notes within the rules. The engine, not the model, owns sets, reps, load and progression so programmes stay defensible.

**Joint session skeleton.** Both members train the same movement *slots* in the same order (e.g. warm-up → squat pattern → hinge → horizontal push → row → accessory pair → finisher). Each slot resolves to a different exercise, load and rep target per member:

| Slot | Parent (recomp) | Adult child (lean/tone) |
|---|---|---|
| Squat pattern | Hack squat 4×8 @ RPE 8 | Goblet squat 3×12 @ RPE 7 |
| Hinge | Romanian deadlift 3×8 | Hip thrust 3×12 |
| Horizontal push | Chest press machine 3×8 | Incline DB press 3×10 |
| Row | Seated row 3×10 | Single-arm DB row 3×12 |
| Accessory pair | Lateral raise + triceps pushdown | Lateral raise + cable kickback |
| Finisher | 10 min incline walk | 8 min bike intervals |

Shared rest periods and "spot me" prompts keep the pair moving together.

**Logging.** Set-by-set weight, reps and RPE; rest timer; quick swap when a machine is taken; Apple Watch companion for logging from the wrist and heart rate. Auto-progression: double progression (reps then load) for adults; rep-range mastery before load for teens.

**Adaptation.** Weekly review uses logged RPE, completed volume, body-weight trend and self-reported recovery to adjust next week's loads and volume. Deloads every 4–6 weeks or on fatigue signals.

**Cardio and steps.** Daily step floor and weekly minutes target from Apple Health; not programmed in detail in v1.

### 4.2 Nutrition (full suite, decision 4)
**Targets.** Adults: calories and macros from an evidence-based estimator (Mifflin-St Jeor + activity, adjusted weekly against the weight trend, MacroFactor-style). Recomp default: 10–20% deficit, protein 1.6–2.2 g/kg, 0.5–1.0% body weight/week. Lean/tone default for an adult: small deficit or maintenance with protein ≥1.6 g/kg and strength volume, framed as recomposition. Teens: no targets, behaviours only.

**Household meal planner.** Generates a week of shared meals from household preferences, allergies, budget and cooking time. Portions scale per member to hit each person's targets from the same dishes. One consolidated shopping list with estimated cost; swap suggestions ranked by cost per gram of protein. Teen members get plate-model portions ("half plate veg, palm of protein, fist of carbs") without numbers.

**Food logging.** Barcode scan, search, recent and favourites, meal-plan one-tap logging, photo-assisted logging later. Food database: Open Food Facts (free, barcodes) + USDA FoodData Central (free, generic foods) in v1; a commercial database (e.g. Nutritionix, FatSecret, Edamam) if coverage complaints appear.

**Hydration.** Daily target from EFSA/IOM adequate intake adjusted for body weight and training days; one-tap logging; Apple Health `dietaryWater` read/write; reminder cadence; link to weigh-in validity (§4.3).

### 4.3 Biometrics
- **Founder hardware (confirmed 6 Oct 2026):** Apple Watch Series 3, Garmin fenix 8 and Garmin Index S2 scale.
  - *Apple Watch Series 3* is capped at watchOS 8 and out of security support. It still pairs with iOS 18 and writes workouts, heart rate and steps to Apple Health, but a modern Watch companion app cannot target it. v1 Watch app targets watchOS 10+; the Series 3 contributes through Apple Health only.
  - *Garmin fenix 8* is the primary wrist device. **The Garmin Connect Developer Program is paused for new applicants (since spring 2026, no reopening date), so the Health API is not available to us yet.** v1 routes, in order: (1) Garmin Connect's Apple Health sync for workouts, heart rate, steps, sleep, weight and, intermittently, body-fat %; (2) a small Connect IQ watch app plus the Connect IQ Mobile SDK to pull body battery and stress history into the phone for the deload triggers; (3) a wearable aggregator (Terra, Rook, Sahha, Fitrockr) only if (2) falls short; (4) apply to the Garmin programme the day it reopens, using the prepared application in `garmin-integration-guide.md`. Garmin does not accept strength sessions written back from third parties, so the app is the system of record for lifting.
  - *Garmin Index S2* measures weight, body-fat %, BMI, skeletal muscle, bone mass and body-water %. Weight (reliably) and body-fat % (intermittently) reach Apple Health via Garmin Connect; body water and muscle mass do not. v1 offers a two-field manual entry for those, pre-filled from the last value, until an API route exists.
  - Recovery signals (body battery, stress, sleep; HRV status when the API opens) feed the periodisation engine's deload triggers (see `periodisation-engine-spec.md` §6).
- **Sources v1:** Apple Health as the hub (Apple Watch, Garmin Connect sync, Withings/Renpho/Eufy scales via their own Apple Health writes) plus Connect IQ for Garmin recovery data. Garmin Health API when the programme reopens; Withings and other direct vendor APIs are a v2 item for mainstream launch.
- **Metrics:** weight, body-fat % estimate, lean mass, body-water (computed and labelled), waist, photos (adult, private, optional).
- **Presentation:** 7-day moving averages, weekly change, "estimate" labels on composition, weigh-in protocol prompt (morning, post-void, before food/drink) with off-protocol readings flagged and excluded from the trend.
- **Trend intelligence:** weekly card for adults: "Weight −0.4 kg/wk, lean mass flat, protein 1.9 g/kg: on track." Adjust targets from the trend, not from single readings.

### 4.4 Accountability (the retention mechanic)
- Joint session scheduling with both calendars; nudges only to the person who has not confirmed.
- "We both trained" streak counts only sessions where both logged; solo sessions count toward personal streaks.
- Post-session check-in: one tap (crushed it / fine / rough) plus optional note or photo to the buddy only.
- Weekly household review: sessions, PRs celebrated, hydration days, meal-plan days, next week's plan. No weight on this screen.
- Shared challenges within the household (e.g. 12 joint sessions in 4 weeks) with a stake the pair agrees on.

### 4.5 Explicitly out of v1
Human coaches, public feed, Android, under-13, cross-household buddies, detailed cardio programming, supplements guidance, direct wearable SDKs, meal delivery or grocery ordering, web app.

---

## 5. Subscription (decision 8)

| Plan | Covers | Price hypothesis |
|---|---|---|
| Solo | 1 member | $7.99/mo · $59.99/yr |
| **Household** (hero) | up to 6 members, all features | $12.99/mo · $99.99/yr |

- StoreKit 2 auto-renewable subscriptions; Family Sharing enabled on Household so each member's Apple ID unlocks the app (up to 6, matches household cap).
- 14-day free trial; annual pushed as default (health & fitness converts 68% to annual industry-wide).
- Flat pricing, no intro-price bait; the market's recent price hikes are a trust gap to exploit.
- Benchmarks: Fitbod Duo $159.99/yr for two with no nutrition; stacked Fitbod + MacroFactor + scale app ≈ $250–320/yr.

---

## 6. Architecture and AI (decisions 6, 7)

**Client.** Swift / SwiftUI, iOS 18+, iPhone first, Apple Watch companion app for session logging and heart rate. Local store: SwiftData or GRDB/SQLite. Barcode scanning via VisionKit.

**Sync.** CloudKit private database per member; CloudKit shared zone for the buddy-visible slice. No Guardian Apps server holds body or food data. Household membership and subscription state verified via StoreKit and CloudKit, not a custom account system. Export (CSV/JSON) and full delete in-app.

**AI layers.**
1. **Deterministic engine (owns safety).** Periodisation rules, rep/set/load bounds by age and goal, calorie and macro bounds, hydration targets, red-flag rules. Written and reviewed as code; versioned; unit-tested. **Review panel:** the founder (fitness diploma) plus the founder's reviewers sign off `periodisation-engine-spec.md`; at least one reviewer should hold a youth strength and conditioning credential for the teen section.
2. **On-device model (fast, private).** Apple Foundation Models for exercise substitution, coaching cues, meal swaps, natural-language food logging and tone-adjusted nudges. No data leaves the phone.
3. **Cloud LLM (heavier generation).** Programme block generation and weekly meal-plan generation from a *de-identified* feature vector (goal, training age, equipment, lifts, constraints), returning structured JSON validated against the engine's bounds before anything is shown. No names, no birth dates, no body photos, no free-text teen content.

**Health data.** HealthKit read: bodyMass, bodyFatPercentage, leanBodyMass, waistCircumference, heartRate, stepCount, activeEnergyBurned, workouts, dietaryWater. Write: dietaryWater, dietaryEnergyConsumed, dietaryProtein/Carbohydrates/FatTotal, workouts. Users choose per-type permissions.

**Compliance built in.** Health & Fitness category, 12+ rating; App Store 5.1.3 (no health data for marketing, none exists); 5.1.4 (teen profiles created by the adult account holder, birth date locked); FTC Health Breach Notification Rule readiness (there is no server store, which simplifies it); FDA General Wellness language only (healthy weight, fitness, healthy eating; never a disease). Privacy policy and nutrition label on the App Store listing match the architecture.

---

## 7. Delivery plan (founder + daughter trial)

| Phase | Weeks | Outcome |
|---|---|---|
| 0. Foundations | 1–3 | Household + buddy data model, CloudKit sync, HealthKit read/write, StoreKit sandbox, onboarding for two adults |
| 1. Train together | 4–7 | Programme engine + templates, joint session skeleton, set-by-set logging, Watch logging, auto-progression, weekly review. **Founder and daughter start logging real sessions at end of week 7.** |
| 2. Eat together | 8–11 | Targets estimator, household meal planner with per-person portions and shopping list, barcode logging, hydration with Health sync |
| 3. Measure honestly | 12–13 | Biometric import, moving averages, weigh-in protocol, trend card |
| 4. Accountability polish | 14–15 | Streaks, nudges, check-ins, household challenge, notification tuning |
| 5. Teen mode | 16–17 | Age-gated rules, behaviour dashboard, parent view, red-flag copy. Tested with a 13–17 persona. |
| 6. Trial and TestFlight | 18–24 | 6-week structured trial with the founding pair; fix list; App Store assets; waitlist on guardian-apps.com |

**Trial success criteria (founding pair, 6 weeks):**
- ≥ 15 joint sessions logged (2.5/week), ≥ 85% of planned.
- Each member sees a progression on ≥ 4 key lifts.
- Parent: weight trend −0.5 to −1.0%/week with lean mass flat or up; protein ≥ 1.6 g/kg on ≥ 5 days/week.
- Daughter: strength up, waist trend down or flat, protein ≥ 1.6 g/kg; subjective "I feel stronger / clothes fit better" score.
- Meal planner used ≥ 4 days/week; shopping list exported weekly; estimated grocery cost tracked.
- Hydration goal met ≥ 5 days/week.
- Both report they would pay $99/yr; both name one thing they would miss if the app disappeared.

---

## 8. Name

**TwoPlates** (founder decision, 6 Oct 2026). Quick checks found no iOS app of that name; a Canadian apparel brand (twoplates.ca) and several "Plates" fitness apps exist in adjacent spaces. Formal USPTO and App Store checks and domain registration are the first Phase 0 tasks; see `naming-brief.md` for the procedure. Phase 0 can start.

---

## 9. Risks specific to the decided scope

| Risk | Mitigation |
|---|---|
| Nutrition "do everything" doubles v1 scope | Ship meal planner before food logging; logging rides the same food database; cut photo logging to v2 |
| Garmin scale/body-fat data may not reach Apple Health completely | Confirm with the founder's exact Garmin device in week 1; fall back to manual entry with photo of the scale readout |
| AI programme quality | Engine owns the numbers; a certified S&C reviewer signs off templates before trial; log every generated block for audit |
| Two-adult trial does not exercise teen mode | Phase 5 uses a 13–17 persona walk-through with a checklist; recruit one real parent–teen pair from the waitlist before public launch |
| iOS-only limits households with Android members | Accepted for v1; CloudKit choice means Android later needs a bridge service, note in architecture |
| Day-30 retention cliff | Instrument the first four weeks of the pair's journey; the joint-session streak and the weekly review are the two screens to optimise |

---

## 10. Immediate next steps (updated 6 Oct 2026)

1. ~~Confirm founder's hardware~~ Done: Apple Watch Series 3, Garmin fenix 8, Garmin Index S2.
2. Name: ~~choose~~ TwoPlates chosen. Run the USPTO and App Store checks in `naming-brief.md` §Decision; register twoplates.app / twoplates.fit.
3. Spec review: founder and reviewers work through `periodisation-engine-spec.md` §10 checklist; record names and dates.
4. Exercise library: import free-exercise-db and eligible wger records, tag and curate to ~150 v1 movements. Build the synthetic demo household.
5. Garmin: enable Garmin Connect → Apple Health on the founder's phone and verify what arrives; set up a Garmin developer account for Connect IQ; watch for the Developer Program to reopen (`garmin-integration-guide.md`).
6. Start Phase 0.
