# TwoPlates — Competitive watch (October 2026)

**Date:** 2026-10-07
**Scope:** how the apps we are measured against actually work today: session logging, plan generation and split choice, naming and muscle-group selection, exercise visuals, social/buddy features, teen or family handling, nutrition, watch support, pricing, and what users praise or complain about.
**Method and confidence.** Researched 6–7 October 2026 with web search and page reads. Most vendor and review sites were unreachable from the research sandbox (network egress blocked), so figures below come from search summaries of the cited pages rather than full page reads. Prices are US App Store unless noted and move often. Anything resting on a single source or with conflicting sources is marked *(unverified)* or *(sources conflict)*. Re-check prices and free-tier limits before quoting them in marketing or a paywall.

Companion docs: `family-fitness-buddy-app-product-brief.md`, `periodisation-engine-spec.md`, and in the app repo `docs/ROADMAP.md` and `Design/DESIGN.md` (batch letters below refer to that roadmap).

---

## 1. Summary table

| App | Price (US) | Plan generation | Session flow | Visuals | Social | Family / teen | Nutrition | Watch |
|---|---|---|---|---|---|---|---|---|
| **Hevy** | Free (4 routines, 7 custom exercises, 3-month history); Pro $2.99/mo, $23.99/yr, $74.99 lifetime | Hevy Trainer (Feb 2026, Pro): algorithmic programme from goal, 1–6 days, equipment, injuries; HevyGPT for drafts | List of exercises; tap sets; supersets colour-coded; auto rest timer | Hundreds of exercise videos | Full feed: follow, like, comment, leaderboards; feed cannot be turned off | None (4+ rating) | None | Apple Watch + Wear OS, live sync, set types |
| **Strong** | Free (unlimited logs, 3 templates); PRO $4.99/mo, $29.99/yr, $99.99 lifetime *(sources conflict: $3.99–4.99 / $23.99–29.99 / $79.99–99.99)* | None (templates only) | List; "two taps per set"; plate calculator; Live Activity / Dynamic Island rest timer | Animated exercise videos | None (deliberately) | None | None | Mature standalone Apple Watch app |
| **Fitbod** | $15.99/mo, $95.99/yr; 3 free workouts. Duo $159.99/yr (2), Family $359.99/yr (5), annual only | Generates a fresh session each open from muscle-recovery map, equipment profile, goal; adjusts difficulty | Full session with sets/reps/weight targets, video, rest timer | 1,000+ studio video demos | None | Duo/Family plans = separate profiles, nothing shared, no teen mode | None | Apple Watch |
| **Ladder** | $29.99/mo, $179.99/yr; top tier $479.99/yr; 7-day trial, no free tier | Human coaches write a new 7-day plan for each of 23 "teams"; not adaptive to the individual | Guided, play-button: looping video per movement, in-ear cues, pacing, rest timers, logging | Coach-shot video loops | Teams (group accountability), community | None | None | Apple Watch; iOS only, no Android (Apr 2026) |
| **Caliber** | Free (unlimited workouts, 800+ exercises, groups); Plus (plans, nutrition targets); human coaching ≈ $50–$300+/mo | Coach-designed plans (Plus) or human coach | List logging; Strength Balance Score | Step-by-step coach videos | Private workout groups with chat; PRs shared to group | None | Macro targets (paid); syncs steps/body data | Apple Watch (integration complaints) |
| **Future** | $199/mo ($50 first month) or $149/mo prepaid yearly (Sept 2026) | One certified human coach writes and adjusts weekly; AI coach product cancelled June 2026 | Coach-built workouts, Watch-tracked | Coach videos | 1:1 messaging | None | Guidance from coach; DEXA/labs at higher tiers | Apple Watch central |
| **JuggernautAI** | $34.99/mo, $349.99/yr | Powerlifting / Powerbuilding / PowerCombo; RPE, MEV/MRV, block periodisation, peaking; daily readiness adjusts | Prescribed sets with RPE targets; log and rate | 300+ video demos with cues | None | None | None | Not a focus *(unverified)* |
| **Boostcamp** | Free (11,000+ programs, 99 of 132 coach programs, RPE/RIR, plate calc, Sunday reports, builder); Pro $59.99/yr or $14.99/mo | Follow a named coach programme (5/3/1, GZCLP, nSuns…) or build your own | List logging inside the programme | Video demos | Community feed; share programmes by link | None | None | **No Apple Watch app** |
| **Alpha Progression** | 2-week trial; $12.99/mo, $79.99/yr; generator and recommendations are Pro | Plan generator: goal, days, session length, muscle priorities, equipment → split, exercises, sets, rep ranges; set-level load/rep recommendations; deloads | List logging with per-set recommendation | 795 exercise videos | None notable | None | None | **No Apple/Google Watch app** |
| **Setgraph** | Free limited; Pro $4.99/mo, $29.99/yr, $199.99 lifetime (Jul 2026) | Goals (aesthetic "grow/define" muscles or performance), no full generator *(unverified)* | Fastest logging; auto rest timer on Lock Screen / Dynamic Island; Smart Plates; live graphs | Minimal | None | None | None | Apple Watch |
| **Apple Fitness+ / Fitness app** | $9.99/mo, $79.99/yr; Family Sharing up to 6; in Apple One Premier | Custom Plans (pick activity types incl. strength, trainers, durations); 2026 programmes e.g. "Strength basics in three weeks" | Video classes; no set/rep/weight logging. watchOS 26 Workout Buddy speaks encouragement during Traditional/Functional Strength | Trainer video | Share custom workouts with friends/family; Activity sharing | Family Sharing; Apple Watch For Your Kids with under-13 vs 13+ fitness experience | None | Native |
| **Garmin Connect / Connect+** | Connect free; Connect+ $6.99/mo, $69.99/yr | Garmin Coach Strength (late 2025): progressive plans with accumulation, intensification, deload phases on fenix 8, FR 970, recent Venu/Vivoactive | Watch counts reps (≥4), edit reps/weight per set on watch; Connect+ mirrors live to phone for editing | Exercise animations, muscle targets | Connections, challenges | None | None | Native; Health API closed to new developers |
| **Centr** | $29.99/mo, $59.97/qtr, $119.99/yr | Static coach programmes | Follow video; Weights Tracker/Logbook on self-guided workouts (defaults to last weight, last 3 sessions) | Produced video | Community | None | Calorie-coded meal plans | Apple Health sync |
| **Peloton Strength+** | $9.99/mo (CAD 12.99); $1/mo first 6 months intro; free for All-Access/App+ | Workout Generator: muscle focus, length, equipment, experience; coach programmes (Endurance, Hypertrophy, Max Strength, S&C) | Guided with in-ear coaching, instructional clips, log weights and reps | Short video clips | Peloton community | None | None | Apple Watch: HR, cues, log from wrist; Android Aug 2026 |
| **MacroFactor** (+ Workouts) | $11.99/mo, $47.99/6 mo, $71.99/yr each app; bundle $89.99/yr | Workouts (Jan 2026): plan built from goals, level, equipment; progressive overload auto-adjust | Workouts app logs sets; Nutrition app adapts targets weekly from weight trend | Jeff Nippard technique videos | None | App Store 9+; no family plan | Core product: adaptive expenditure, barcode, text "AI describe"; no photo or voice logging | Apple Watch (watchOS 11+) |
| **MyFitnessPal** | Free; Premium $79.99/yr or $19.99/mo; Premium+ $99.99/yr or $24.99/mo (meal plans) | n/a | n/a | n/a | Friends feed | **18+ only**, blocks under-18 accounts | Logging, barcode (Premium only), meal plans (Premium+) | Apple Health |
| **Lose It** | Free (barcode included); Premium $9.99/mo, ≈ $39.99/yr *(sources conflict: $79.99/yr after a 2026 rise)* | n/a | n/a | n/a | Challenges | None known | Logging, Snap It photo (Premium), meal planning (Premium) | Apple Health, Garmin, Fitbit, Oura |

---

## 2. Per-app notes

### Hevy
- **Logging flow.** Classic list: pick a routine (templates organised in folders), tick sets, supersets each get a colour, automatic rest timer per exercise. Set types warm-up / normal / drop / failure, also on the Watch.
- **Plan generation.** *Hevy Trainer* launched 18 Feb 2026, bundled with Pro: goal (strength, muscle, fat loss), 1–6 days per week, equipment, injuries; progressive-overload suggestions week to week. Hevy is explicit that "our programs are generated using an algorithm and do not rely on AI". *HevyGPT* is a ChatGPT integration for drafting routines, not context-aware of training state.
- **Naming / muscle selection.** Routines are user-named; no muscle-pair picker surfaced in the sources.
- **Visuals.** "Hundreds of exercises with free high-quality videos".
- **Social.** Follow, feed, likes, comments, leaderboards, discover community routines. The feed cannot be switched off (a recurring complaint).
- **Family / teen.** Nothing. App Store rating 4+.
- **Nutrition.** None. **Watch.** Apple Watch and Wear OS with live sync.
- **Pricing.** Free: unlimited workouts, 4 routines, 7 custom exercises, 3-month stats. Pro $2.99/mo, $23.99/yr, $74.99 lifetime. Hevy Coach for trainers from $25/mo (10 clients) to $700/mo.
- **Praise / complaints.** 4.9 from ≈94k US App Store and ≈268k Google Play ratings; "best value tracker". Complaints: feed can't be disabled, many features need internet (bad in basement gyms), occasional sync issues, busier UI than minimalist apps, no way to save and update a routine after swapping an exercise mid-workout.
- Sources: [sensai.fit Hevy review 2026](https://www.sensai.fit/blog/hevy-review-2026) · [Hevy Trainer announcement](https://www.hevyapp.com/announcing-hevy-trainer/) · [Hevy routines](https://www.hevyapp.com/features/gym-routines/) · [Hevy supersets](https://www.hevyapp.com/features/what-are-supersets/) · [RepReturn Hevy review](https://repreturn.com/hevy-app-review/) · [prpath Hevy review](https://prpath.app/blog/hevy-app-review-2026.html) · [Hevy Coach pricing](https://coachway.io/articles/hevy-coach-pricing/) · [App Store listing (4+)](https://apple.co/2VvCsFt)

### Strong
- **Logging flow.** The reference for "two taps to record a set". Templates, plate calculator, rest timer; 2026 updates added Live Activity and Dynamic Island rest timers, a calendar home-screen widget, activity widgets, and a Watch button-repeat toggle.
- **Plan generation.** None. **Visuals.** "Detailed exercise instructions with animated videos."
- **Social.** None by design, no ads. **Family / teen / nutrition.** None.
- **Watch.** Standalone Apple Watch app, real-time sync, rest timers on the wrist; frequently cited as the best Watch logging experience.
- **Pricing.** Free: unlimited workouts, 3 templates. PRO about $4.99/mo, $29.99/yr, $99.99 lifetime *(sources conflict on exact tiers)*.
- **Praise / complaints.** 4.9 from ≈108–109k US ratings. Praised for speed and privacy; the trade-off is that it plans nothing and has no social layer.
- Sources: [aitoolsbakery Strong review](https://aitoolsbakery.com/?p=18425) · [sensai Hevy vs Strong](https://www.sensai.fit/blog/hevy-vs-strong-2026) · [App Store listing](https://apps.apple.com/us/app/strong-workout-tracker-gym-log/id464254577) · [findyouredge Watch apps 2026](https://www.findyouredge.app/news/best-strength-training-apps-apple-watch-2026) · [prpath Strong vs Hevy](https://prpath.app/blog/strong-vs-hevy-2026.html)

### Fitbod
- **Plan generation.** Generates a fresh session each time you open it from a muscle-recovery map, your equipment profile (gym / home / hotel), goal and experience; raises or lowers load, reps and exercise selection when sessions read easy or hard. 2026 emphasis: recovery-aware programming, volume/fatigue management, better substitutions when kit or time is short.
- **Session flow.** A built session with set/rep/weight targets per exercise, video demos and rest timer; exercises are swapped per movement.
- **Naming / muscle selection.** Sessions are named by the body focus the algorithm picks; users can steer with muscle-group focus and equipment toggles *(exact UI unverified)*.
- **Visuals.** 1,000+ studio-shot video demos with real people.
- **Social.** None. **Family.** *Fitbod Duo* $159.99/yr for 2 and *Family* $359.99/yr for 5: one payer invites by email, each member gets a separate profile and "their own AI coach". Nothing is shared between members, no teen rules.
- **Nutrition.** None. **Watch.** Apple Watch.
- **Pricing.** $15.99/mo, $95.99/yr, 3 free workouts.
- **Praise / complaints.** 4.8 from 250k+ App Store ratings; 15M downloads, ≈2.5M active. Complaints: ≈10% say it repeats the same exercises or feels random, "the algorithm is broken"; ≈15% subscription-management trouble (unexpected charges, hard to cancel); 3 free workouts too few to judge; cardio thin.
- Sources: [sensai Fitbod review](https://www.sensai.fit/blog/fitbod-review-2026) · [Fitbod Family plan post](https://fitbod.me/blog/fitbods-new-family-plan-offering/) · [Fitbod Family help](https://help.fitbod.me/hc/en-us/articles/42280653162519-Fitbod-Family-Plan) · [thepricer Fitbod cost](https://www.thepricer.org/how-much-does-fitbod-cost/) · [Kimola Fitbod review analysis](https://kimola.com/reports/comprehensive-fitbod-feedback-analysis-report-available-now-app-store-us-141682) · [hotelgyms Fitbod review](https://www.hotelgyms.com/blog/review-of-fitbod-how-to-take-your-fitness-with-you) · [fitnessdrum Fitbod review](https://fitnessdrum.com/fitbod-review/)

### Ladder
- **Model.** Quiz → join one of 23 coach-led teams → a new seven-day plan every week, written by a human coach for the whole team. Not adaptive to the individual's recovery or biometrics.
- **Session flow.** Press play. The video of each exercise loops while you do it, the coach gives a short cue before each set, pacing and rest timers are built in, voiceovers can be toggled, music via Spotify / Apple Music. Logging is present but secondary.
- **Visuals.** Coach-shot video loops (the production quality is the product).
- **Social.** Team as accountability layer; community.
- **Pricing.** PRO $29.99/mo or $179.99/yr; top tier $479.99/yr; 7-day trial; no free features. iOS only (iOS 17.6+), Apple Watch, limited web; no Android as of April 2026.
- **Praise / complaints.** 4.9 with 128k–200k+ ratings; Apple 2025 App of the Year finalist and Editors' Choice; CNET 2026 Best Strength Training App. Complaints: recurring cost, aggressive advertising, higher skill floor than beginners expect, favourite workouts can be repeated only three more times before they disappear, fixed programming.
- Sources: [sensai Ladder review](https://www.sensai.fit/blog/ladder-app-review-2026) · [GGR Ladder review](https://www.garagegymreviews.com/ladder-app-review) · [Ladder pricing](https://www.joinladder.com/pricing) · [outdoorsynomad Ladder review](https://www.outdoorsynomad.com/ladder-fitness-app-review/) · [gifit Ladder Reddit roundup](https://gifit.io/blog/ladder-workout-app-reddit/) · [corahealth Ladder](https://www.corahealth.app/compare/ladder)

### Caliber
- **Tiers.** Free forever: unlimited workouts, 600–800+ exercises with step-by-step coach videos and pro tips, train solo or with friends. Caliber Plus: coach-designed plans, progress tracking, nutrition targets. Premium human coaching ≈ $50 (Standard) to $300+/mo (frequent contact, video calls); one source cites $200/mo. GGR also mentions a $19/mo group "Pro" option *(unverified)*.
- **Group feature.** Private workout groups with chat; a personal best is posted to the group automatically. Caliber also lets you sync training data to ChatGPT and Claude for analysis.
- **Metrics.** Strength Balance Score comparing major muscle groups.
- **Family / teen.** None. **Watch.** Apple Watch; integration complaints.
- **Praise / complaints.** 4.8 from ≈5.9k iOS ratings; Men's Journal 2026 best free workout app; GGR "best overall" (4.6). Complaints: useful features behind paywall, Apple Watch issues, macro goals paid only, coaching price.
- Sources: [App Store listing (appfollow)](https://apps.appfollow.io/ios/caliber-strength-training/1482405410?country=us) · [GGR Caliber review](https://www.garagegymreviews.com/caliber-app-review) · [BarBend Caliber review](https://barbend.com/caliber-fitness-app-review/) · [Forbes Health Caliber](https://www.forbes.com/health/weight-loss/caliber-app-review/) · [AOL free-app piece](https://www.aol.com/articles/why-people-switching-free-workout-143000340.html)

### Future
- **Model.** One certified human coach writes the programme, adjusts weekly, messages in-app; Apple Watch data is how the coach sees your work. Feb 2026: split into Future Pro (human) and a free AI beta; **June 2026: cancelled the AI product** and told the waitlist it would "double down" on human coaches, adding DEXA-informed protocols, lab testing and nutrition guidance at higher tiers.
- **Pricing.** $199/mo, $50 first month, or $149/mo prepaid yearly (Sept 2026). US only, iPhone and Android, 30-day refund. 4.9 from ≈10.7k ratings.
- **Context.** Les Mills 2026 Global Fitness Report: only 10% of consumers prefer AI workout guidance over a human coach; 11% of 16–27-year-olds favour AI coaching.
- Sources: [Athletech: Future pulls the plug on AI](https://athletechnews.com/future-pulls-the-plug-on-ai-personal-training-commits-to-human-coaches/) · [sensai Future review](https://www.sensai.fit/blog/future-app-review-2026) · [Fitt Insider June 2026](https://insider.fitt.co/future-expands-into-health-coaching/)

### JuggernautAI
- **Plan generation.** Questionnaire → individualised Powerlifting, Powerbuilding or PowerCombo programme: RPE-based, MEV/MRV volume landmarks, block periodisation (hypertrophy → strength → peaking), competition peaking; real-time adjustments from daily readiness and set feedback.
- **Session flow.** Prescribed sets with RPE targets; you log load/reps and rate the set. 300+ exercise videos with coaching cues.
- **Pricing.** $34.99/mo, $349.99/yr. 4.8 from ≈5.6k ratings; last update 26 July 2026. GGR 4/5.
- **Fit.** Intermediate–advanced barbell lifters; squat/bench/deadlift centric. No social, nutrition or family features.
- Sources: [aitoolsbakery JuggernautAI review](https://aitoolsbakery.com/?p=5896) · [GGR JuggernautAI](https://www.garagegymreviews.com/equipment/juggernautai-training-program) · [appfollow listing](https://apps.appfollow.io/ios/juggernautai/1515756471?country=us)

### Boostcamp
- **Model.** Programme library (11,000+ community, 132 coach-designed of which 99 free: 5/3/1, GZCLP, nSuns…) plus a custom programme builder; weekly Sunday reports; RPE/RIR, supersets, drop sets, plate calculator, PRs.
- **Pro** $59.99/yr ($4.99/mo billed annually, 7-day trial) or $14.99/mo: Strength Score, per-muscle weekly volume heatmap, 20+ exclusive programmes.
- **Social.** New Community feed (follow friends, share completed workouts); share custom programmes by link or publish them.
- **Visuals.** Video demos. **Watch.** No Apple Watch app (iPhone, iPad, Vision, Android).
- **Praise.** 4.8 with ≈9.4k US ratings; "most generous free tier in the category".
- Sources: [sensai Boostcamp vs Hevy vs Liftosaur](https://www.sensai.fit/blog/boostcamp-vs-hevy-vs-liftosaur-2026) · [Boostcamp best free](https://www.boostcamp.app/best/free) · [Boostcamp comparisons](https://www.boostcamp.app/best/workout-apps) · [Fortune Boostcamp review](https://www.fortune.com/article/boostcamp-review/)

### Alpha Progression
- **Plan generation.** The closest benchmark for our Batch C2 plan settings: pick goal, training days, session length and muscles to prioritise; the generator picks split, exercises, sets and rep ranges around the equipment in your gym, with per-set weight/rep recommendations, periodisation and automatic deloads.
- **Visuals.** 795 exercises, all with videos. **Social.** None notable. **Watch.** No Apple or Google Watch app.
- **Pricing.** Two-week trial, then $12.99/mo or $79.99/yr; generator, recommendations and advanced charts are Pro. 4.9 from 40k+; ranked "best overall" by some 2026 lists.
- **Complaints.** Swapping is clunky when you lack the suggested equipment; plans feel like "the same few exercises rearranged"; deloads recommended earlier than expected without explanation; no cardio/mobility; key features paid. One aggregator shows 2.3/5 from 34 reviews (small sample).
- Sources: [App Store listing](https://apps.apple.com/us/app/gym-workout-alpha-progression/id1462277793) · [fitnessdrum review](https://fitnessdrum.com/alpha-progression-app-review/) · [hotelgyms review](https://www.hotelgyms.com/blog/alpha-progression-the-gym-logger-app-from-germany) · [fitnessdrum 4-way comparison](https://fitnessdrum.com/alpha-progression-vs-fitbod-vs-hevy-vs-boostcamp/) · [Alpha vs Caliber](https://alphaprogression.com/en/blog/alpha-progression-vs-caliber)

### Setgraph
- **Flow.** Built around logging speed: minimal taps per set, supersets/circuits grouped, rest timer starts automatically and lives on the Lock Screen / Dynamic Island, Smart Plates totals, real-time graphs. Goals: aesthetic (pick muscles to "grow" or "define") or performance.
- **Platforms.** iOS, Android, Apple Watch; 67k+ lifters, 50M sets, 4.7–4.8.
- **Pricing.** Pro $4.99/mo, $29.99/yr, $199.99 lifetime (checked 1 Jul 2026). No social, no nutrition.
- Sources: [appfollow listing](https://apps.appfollow.io/ios/setgraph-gym-workout-tracker/1209781676?country=us) · [apppricinglab IAPs](https://apppricinglab.com/iap/apple/1209781676) · [setgraph.app llms.txt](https://setgraph.app/llms.txt)

### Apple Fitness+ and the iOS 26 Fitness app
- **Strength.** Video classes; 2026 programmes "Strength basics in three weeks" (12 Jan 2026), "Make your fitness comeback", "Back-to-back strength and HIIT". Custom Plans pick activity types (including strength), trainers and durations; prebuilt plans ("Get Started", "Stay Consistent", "Push Further"). No set/rep/weight logging anywhere in Apple's stack.
- **watchOS 26.** Workout Buddy: Apple Intelligence generates spoken encouragement from heart rate, pace, rings and history in Fitness+ trainer voices; supports Traditional and Functional Strength Training, needs Bluetooth headphones and an Apple Intelligence iPhone nearby. Redesigned Workout app with corner buttons. iOS 26 lets you build custom workouts on the iPhone and share them with friends and family.
- **Family / teen.** Fitness+ shares with up to six via Family Sharing; Apple Watch For Your Kids lets a parent switch a child between the under-13 and 13+ fitness experience.
- **Pricing.** $9.99/mo, $79.99/yr, included in Apple One Premier.
- Sources: [TechRepublic Fitness+ 2026](https://www.techrepublic.com/article/news-apple-fitness-plus-new-features-2026/) · [DC Rainmaker watchOS 26](https://dcrainmaker.com/2025/06/apple-watchos-26-announced-workout-buddy-and-more-explained.html) · [DC Rainmaker beta real-world](https://www.dcrainmaker.com/2025/07/apple-watchos-26-workout-beta-real-world.html) · [Apple support: Custom Plan](https://support.apple.com/en-am/guide/watch-ultra/apd07cef67fc/watchos) · [BGR iOS 26 custom workouts](https://www.bgr.com/2003927/ios-26-fitness-hidden-apple-watch-feature) · [Apple: Watch for a family member](https://support.apple.com/en-in/HT211768)

### Garmin Connect, Connect+ and Garmin Coach Strength
- **On the watch.** Strength activity counts reps (shows after four), lets you edit reps and weight per set, moves to the next exercise with a button; structured workouts sent from Connect show exercise animations and target muscles.
- **Plans.** Garmin Coach Strength Training arrived late 2025: progressive plans with accumulation, intensification and deload phases on fenix 8, Forerunner 970 and recent Venu/Vivoactive; rolling to Forerunner 265/965 in beta. Muscle Map shows recently worked groups.
- **Connect+** $6.99/mo or $69.99/yr, 30-day trial: Active Intelligence (AI insights, beta), live mirroring of a strength session to the phone with on-phone editing of auto-detected reps, extra coach videos. Reviewers call it "still not worth it" except for live strength. An April 2026 Garmin survey floated Neuromuscular Readiness Score, Neuromuscular Training Effect, Acute Strength Load, Muscle Map for Recovery and Strength Balance Score, so expect more strength analytics on-device.
- **For us.** Garmin stays watch-first with no nutrition or two-person features, and its Health API is closed to new developers (see `garmin-integration-guide.md`).
- Sources: [Garmin manual: strength activity](https://www8.garmin.com/manuals/webhelp/GUID-3A4F9C4A-8735-46C0-8DA9-65F11400B150/EN-US/GUID-573EC4B6-D45B-46E7-BE37-FB542CBB4FC1.html) · [Android Authority: Garmin Coach Strength](https://www.androidauthority.com/garmin-coach-strength-training-springboarded-me-back-into-shape-3530263) · [Advnture: Strength Coach on Forerunner](https://advnture.com/news/garmin-forerunner-watches-to-be-upgraded-with-strength-coach) · [the5krunner: Connect+ one year on](https://the5krunner.com/2026/04/20/garmin-connect-plus-review/) · [the5krunner: strength survey](https://the5krunner.com/2026/04/02/garmin-strength-training-features-survey/) · [Tom's Guide Connect+](https://www.tomsguide.com/wellness/smartwatches/i-tried-garmin-connect-for-a-week-heres-3-things-i-like-and-3-i-dislike) · [DC Rainmaker Connect+ walkthrough](https://dcrainmaker.com/2025/03/garmin-connect-plus-subscription-walkthrough.html)

### Centr
- Video-first subscription (on-demand, live classes, TV apps) with coach-built but static programmes, calorie-coded meal plans and mindfulness. The Weights Tracker / Logbook logs weights, reps and timed moves on self-guided workouts, defaults to the last weight, shows the last three performances, kg or lb. $29.99/mo, $59.97/quarter, $119.99/yr. Logging is basic by lifter standards.
- Sources: [Centr help: log weights and reps](https://help.centr.com/en-US/how-do-i-log-weights-and-reps-3233624) · [Centr weights tracker announcement](https://centr.com/blogs/centr/weights-tracker-announcement) · [subger Centr pricing](https://subger.com/en/service/centr-fitness) · [corahealth Centr](https://www.corahealth.app/compare/centr)

### Peloton Strength+
- Workout Generator from muscle focus, length, equipment and experience; multi-week coach programmes (Endurance, Hypertrophy, Maximal Strength, Strength & Conditioning); in-ear coaching with short instructional clips; log weights and reps, also from the Apple Watch with HR. iOS and, since Aug 2026, Android (US and Canada). $9.99/mo, $1/mo for six months intro, free for All-Access/App+ members. 4.8 from ≈16k ratings. Peloton-wide complaints in 2026 centre on Apple Watch bugs (including a crash on watchOS 8 / Series 3), subscription changes and support.
- Sources: [Peloton Strength+ blog](https://www.onepeloton.com/en-CA/blog/peloton-strength-plus-app) · [9to5Google Android launch](https://9to5google.com/2026/08/20/peloton-strength-plus-android-app-release/) · [Pelobuddy pricing](https://www.pelobuddy.com/strength-plus-available-cost) · [App Store listing](https://apps.apple.com/app/id6476712925) · [Pelobuddy Apple Watch bug](https://www.pelobuddy.com/apple-watch-bug-peloton/) · [Kimola Peloton complaints](https://kimola.com/reports/peloton-app-feedback-analysis-key-insights-for-improvement-app-store-us-144602)

### MacroFactor (Nutrition) and MacroFactor Workouts
- **Nutrition.** Adaptive expenditure algorithm compares logged intake with the weight trend and adjusts calories/macros weekly; verified database, barcode and label scanning, text "AI describe" logging, Apple Watch. Prices unchanged since launch: $11.99/mo, $47.99/6 mo, $71.99/yr. Complaints: price, learning curve, no photo or voice logging, no social or gamification, no real free tier.
- **Workouts** launched January 2026 as a separate app: builds a plan from goals, level and equipment, auto-adjusts loads via progressive overload, hundreds of exercises with Jeff Nippard technique videos, PR and progress charts; shares body metrics, photos, habits with the Nutrition app. Same price per app; bundle $89.99/yr; existing subscribers got the first year free.
- **Family / teen.** App Store 9+; no family plan or age policy found *(unverified)*.
- Sources: [MacroFactor Jan 2026 update](https://macrofactor.com/mm-jan-2026/) · [MacroFactor Workouts](https://macrofactor.com/workouts/) · [Workouts price](https://macrofactor.com/workouts/price/) · [Bundles help article](https://help.macrofactorapp.com/en/articles/393-how-macrofactor-subscriptions-and-bundles-work) · [nutrola MacroFactor 2026](https://nutrola.app/en/blog/is-macrofactor-worth-it-2026) · [Outlift MacroFactor review](https://outlift.com/macrofactor-review/)

### MyFitnessPal
- Free; Premium $79.99/yr or $19.99/mo; Premium+ $99.99/yr or $24.99/mo adds meal planning. The barcode scanner moved behind Premium and is the most cited complaint; the 2026 redesign "added taps to the one task people open the app for"; paying users report the same logouts and crashes. Recent review samples: 202 of 300 Google Play and 35 of 49 newest App Store reviews at 1–3 stars. **Policy: 18+**, with technical measures to block under-18 accounts, so there is no teen path at all.
- Sources: [unstar MFP paywall review](https://unstar.app/blog/is-myfitnesspal-premium-worth-it-paywall-app-reviews-2026) · [nutrola MFP price 2026](https://nutrola.app/en/blog/how-much-does-myfitnesspal-cost-now-2026) · [MFP privacy policy](https://www.myfitnesspal.com/privacy-policy) · [ConductAtlas MFP 18+ provision](https://conductatlas.com/platform/myfitnesspal/myfitnesspal-privacy-policy/provision/CA-P-028847/minimum-age-requirement-18-years/)

### Lose It
- Free tier keeps barcode scanning, unlimited logging, macros and a 27M-item database. Premium $9.99/mo, ≈ $39.99/yr *(one source says $79.99/yr after a 2026 increase)*: Snap It photo logging (≈70% category accuracy, weak portions), meal planning, nutrient timing. Integrations: Apple Health, Garmin, Fitbit, Samsung, Oura. 4.7 across 700k+ ratings. Complaints: ads, upsells, Snap It paywall, slow updates, "paywall creep", database errors.
- Sources: [nutrola Lose It 2026](https://nutrola.app/en/blog/lose-it-review-2026) · [nutrola why is Lose It so bad now](https://nutrola.app/en/blog/why-is-lose-it-so-bad-now) · [nutrola Lose It price](https://nutrola.app/en/blog/why-did-lose-it-increase-their-price) · [calorie-trackers Lose It](https://calorie-trackers.com/reviews/lose-it/)

### 2025–2026 newcomers and moves worth tracking
- **Hevy Trainer** (Feb 2026) and **MacroFactor Workouts** (Jan 2026): the two biggest trackers each added algorithmic programme generation; generation is now table stakes, not a differentiator.
- **Gravl**: e1RM-driven planner, adds reps then load, 3 free workouts, $14.99/mo or $59.99–89.99/yr, standalone Apple Watch, 4.9 from 5.5k, claims 1M+ users. [sensai Gravl review](https://www.sensai.fit/blog/gravl-app-review-2026)
- **Zing Coach**: AI plans from ≈500 exercises, muscle-fatigue tracking, camera form feedback ("Zing Vision", accuracy inconsistent). [techpoint Zing review](https://techpoint.africa/guide/zing-coach-ai-review/)
- **Whoop Strength Trainer**: AI builder turns a text prompt or a screenshot of a programme into a structured routine and de-loads it when recovery is poor. [Wareable](https://www.wareable.com/fitness-trackers/whoop-coach-ai-strength-trainer-workout-builder-update)
- **Fitbit Personal Health Coach (Gemini)**: public preview from 28 Oct 2025 (US, Android), iOS and five more countries Feb 2026; "Ask Coach" builds workouts from equipment and time; needs Fitbit Premium ($10/mo, $80/yr). [TechRepublic](https://www.techrepublic.com/article/news-fitbit-ai-coach-expands-ios-five-markets/)
- **Amp "Workout Together"**: the only mainstream "two people, one session" flow found. One guest (no account needed), you take turns per set, traditional strength only, tied to Amp's wall-mounted cable machine. [Amp support](https://support.joinamp.com/en/articles/12343615-workout-together-train-with-a-partner)
- **Edge** (UK): each partner gets a personalised plan across running/strength/HIIT and can share sessions to train side by side. [findyouredge couples](https://www.findyouredge.app/news/best-fitness-app-for-couples-uk-2026)
- **Couple Glow / Sweatmates**: couples accountability apps (shared workouts, hydration, mood check-ins, photo check-ins); no programming. [Couple Glow](https://apps.apple.com/app/id6768482914) · [Sweatmates](https://apps.apple.com/us/app/-/id6756000479)
- **Kid Strength: Youth Training**: one family account, parent-supervised athletes, no ads, no social, syncs by family code. **Athletics Crew** (13–18, pose detection) and **KidWorkout 360** (13–24, parent progress view) are small teen-first entrants. [Kid Strength](https://apps.apple.com/app/id6759792508) · [Athletics Crew](https://athletics-crew.lovable.app/) · [KidWorkout 360](https://apps.apple.com/vn/app/id6748430341)
- **Future** dropped AI coaching (June 2026) to sell human coaches; **Caliber** exports training data to ChatGPT/Claude; **Strava** bought Runna and The Breakaway and now sells a joint subscription. [Athletech](https://athletechnews.com/future-pulls-the-plug-on-ai-personal-training-commits-to-human-coaches/) · [T3 Strava 2026](https://www.t3.com/active/strava-2026-future-and-challenges)

---

## 3. Where TwoPlates is already ahead

1. **Two individual programmes on one shared skeleton.** Nobody in the set does this. Fitbod Duo/Family sells separate profiles that never meet; Ladder's teams follow one identical plan; Amp's Workout Together is one guest taking turns on a home machine; the couples apps share streaks, not programming. Our joint session with per-member slots, shared rest and station rotation (engine `rotated(by:)` done) is unoccupied ground.
2. **Teen rules at the data layer.** MyFitnessPal is 18+, MacroFactor and the trackers have no age handling, Apple only toggles an under-13 ring. Teen-first apps are tiny and have no adult programme beside them. A parent and a 13–17-year-old on one plan, with calories and body data structurally absent for the teen, is unique in this list.
3. **Privacy architecture.** CloudKit private DB per member, body data never in the shared zone, no vendor server. Every competitor with social features (Hevy, Caliber, Boostcamp) runs a feed on their servers; Hevy's cannot even be switched off.
4. **Engine-owned numbers, honestly described.** Hevy earned praise for saying its Trainer is an algorithm, not AI; Future abandoned AI coaching; only ≈10% of consumers prefer AI guidance. Our rules-based periodisation engine with coach's notes that "end with the number, never with motivation" is on the right side of that sentiment.
5. **Training plus nutrition plus body trends in one subscription.** The market stack is Fitbod ($95.99) + MacroFactor bundle ($89.99) + a scale app; Centr has meal plans but basic logging; Peloton/Ladder have no nutrition. Our Household plan hypothesis ($99.99/yr for six) undercuts Fitbod Duo alone ($159.99 for two).
6. **Guided focus mode that still logs.** Ladder guides but barely logs and does not adapt; Strong/Hevy log but show a long list. One exercise at a time with SetRows, last-time recall, a rest bar that never hides the next set, and the whole session in one thumb is a combination none of them ship.
7. **Plan control the generator apps lack.** Alpha Progression's generator is the benchmark and users still complain about clunky swaps and repetitive plans; Fitbod users call its selection random. Our swap groups, My gym, exclusions, flexible week (add / skip / modify a day with reasons) and the Batch C2 split and muscle-pair sheet with live coverage address exactly those complaints.
8. **Household weekly review with no weight on it.** Boostcamp's Sunday report and MacroFactor's weekly check-in are single-person; ours covers two people and respects the privacy rule.
9. **Garmin plus Apple Health as inputs, phone as the record.** Garmin's own strength coach is watch-first and cannot accept third-party strength sessions; we match imported HR to the logged session and fill fitness days automatically.

---

## 4. One ahead: moves to make

Prioritised. Each line: the move, why (what the market showed), and the roadmap batch it belongs to.

1. **Make "Start together" the hero and ship it before polish.** Live buddy strip, shared rest, station rotation for 3+, join from Today. Reason: it is the only feature in this document no competitor offers; Amp's one-guest turn-taking proves demand but is tied to hardware. Everything else below is catch-up or defence. **Batch C.**
2. **Price and present the Household plan as the anti-stack.** $99.99/yr for up to six, Family Sharing, flat price, 14-day full trial, no intro-price bait, a "what you'll pay and when" screen and an in-app cancel link. Reason: Fitbod Duo $159.99 for two, Family $359.99 for five, MacroFactor bundle $89.99 each person, MFP Premium+ $99.99 per person; ≈15% of Fitbod complaints are subscription confusion and Ladder/Fitbod trials (none / 3 workouts) are a sore point. **Batch F.**
3. **Rest timer that survives everything: Live Activity, Dynamic Island, Lock Screen, Watch.** Reason: Strong and Setgraph ship it; "timer dies when I switch apps" is a standing complaint across trackers. Our sticky RestBar must also exist outside the app. **Batch B (RestBar) + Batch A (Watch).**
4. **Offline-first logging with a quiet sync indicator.** Never block a set on the network; queue CloudKit writes; show "Saved on this phone, will sync" only when relevant. Reason: Hevy's most repeated complaint is needing internet in the gym. **Batch C (while building sync).**
5. **Ship Plan settings (days, split, muscle pairs, live coverage, Fix for me) and make every swap explain itself.** When the engine changes an exercise, show one line of why ("hamstrings under target this week"). Keep swaps persistent with a "Keep this swap for future weeks?" prompt. Reason: Alpha Progression users call swaps clunky and plans repetitive; Fitbod users call selection random; Hevy users cannot save a mid-workout exercise change back to the routine. **Batch C2.**
6. **Muscle map with a recovery tint, not just coverage.** Shade each region by days since last worked and sets this week against range; show it on the session card and weekly review. Reason: Fitbod's recovery heatmap is its most praised screen; Boostcamp charges Pro for a volume heatmap; Garmin is adding "Muscle Map for Recovery". We already have the coverage model, so this is cheap. **Batch B2.**
7. **One-tap readiness before a session and after it, feeding deloads.** "How are you today?" (3 chips) pre-session; crushed / fine / rough post-session already specified; both plus Garmin body battery and sleep drive the deload monitor and are shown with their effect ("Lighter day: two rough sessions and low body battery"). Reason: JuggernautAI's daily readiness is its most valued feature; Whoop de-loads from recovery; Alpha Progression is criticised for unexplained early deloads. **Batch D (Garmin data) with the check-in UI in Batch B.**
8. **Finish the illustration audit, then commission a consistent 3-pose set for the ~120 staples; show a photo when the illustration is weak rather than a bad drawing.** Reason: every serious competitor uses video (Fitbod 1,000+, Alpha 795, Ladder loops, MacroFactor/Nippard, Caliber, Peloton). Our moving line art is distinctive and lighter, but Hein's "some are not great" is the same first impression a reviewer will have. Quality beats quantity here; do not chase video. **Batch C2.**
9. **Weekly household review as the Sunday ritual, with a push for both people.** Sessions, PRs celebrated, hydration days, meal-plan days, next week's plan, "we both trained" streak; no weight. Reason: Boostcamp's Sunday report and MacroFactor's weekly check-in are the retention hooks reviewers praise, and neither covers two people. **Batch A (screen) + Batch C (push, streak).**
10. **Garmin and Apple Watch strength activities auto-attach to the logged session, and fitness days fill themselves.** Match by time, attach HR and duration, surface unmatched workouts as "tag this". Reason: Garmin Coach Strength and Workout Buddy are pulling people to log on the wrist; we must never ask them to log twice. **Batch B2 (fitness days) + Batch D (Garmin verification).**
11. **Lead the App Store listing and onboarding with the parent-and-teen story and the privacy rule.** Screenshots: two phones, one session; the teen screen with no numbers; the "parent cannot unlock" sentence. Reason: no competitor in the list can say it; MFP is 18+; teen-first apps have no adult side. It is also our review-panel story for App Store 5.1.4. **Batch F.**
12. **Build-your-own with household sharing by link.** A custom session or programme can be shared to the household and becomes a skeleton for station rotation. Reason: Boostcamp's share-by-link and 11,000-programme library show people want to bring their own programmes; Whoop and Hevy parse pasted programmes. Keep it secondary to the coach plan. **Batch D.**
13. **"Paste a programme" into the builder using the on-device model.** Parse text (or a screenshot via Vision) into sessions, exercises, sets and rep ranges, then validate against the engine's bounds (teen caps included). Reason: Whoop's screenshot-to-plan and HevyGPT exist; ours stays on-device and safe for teens. **Batch D, after 12.**
14. **Nutrition that sits beside training in the same app, not a second subscription.** Meal planner first (per-person portions from one dish), barcode via Open Food Facts, text-describe logging later. Reason: MacroFactor now sells two apps for $89.99; MFP charges $99.99 for meal plans; Lose It and MFP are both criticised for paywall creep. Our edge is one price and the teen plate model. **Batch E.**
15. **Keep the free trial honest and the paywall boring.** No countdown timers, no "limited offer", no feature removed after shipping. Reason: MFP's barcode move, Lose It's Snap It paywall and Ladder's expiring favourites are the three most quoted betrayals in 2026 reviews. **Batch F (and a product rule from now).**

---

## 5. Watch-outs: patterns users hate that we must avoid

- **A social feed you cannot turn off** (Hevy). Buddy-only visibility, no public feed, nothing posts automatically except what the member chose to share.
- **Moving a shipped free feature behind pay** (MyFitnessPal barcode scanner, Lose It Snap It). Decide the free/paid line before launch and never move it backwards.
- **Trials too short to judge the programme** (Fitbod's 3 workouts) and **no free path at all** (Ladder). Fourteen days, full features.
- **Subscription confusion and hard cancellation** (≈15% of Fitbod complaints, Peloton subscription changes). Show the renewal date, link to Manage Subscriptions, confirm cancellations.
- **Redesigns that add taps to the daily task** (MFP 2026). Our daily paths are Start session, tick a set, log water, log a meal; count the taps before and after every redesign.
- **Generated plans that feel random or repetitive** (Fitbod, Alpha Progression). Explain every change, keep swaps sticky, rotate within swap groups deliberately.
- **Deloads and back-offs without a reason** (Alpha Progression). The coach note names the signals.
- **Clunky substitution when the gym lacks the kit** (Alpha Progression). My gym and exclusions must be in onboarding, not buried.
- **Rest timers that die on app switch** and **logging that needs signal** (Hevy, several trackers). See moves 3 and 4.
- **Taking away something the user saved** (Ladder favourites expire after three repeats). History and saved sessions are permanent.
- **Apple Watch integrations that crash or drift** (Peloton on watchOS 8/Series 3, Caliber). Our Watch app targets watchOS 10+; the phone-only path must be flawless and the Series 3 case handled by Apple Health import, never a crash.
- **Overclaiming AI** (Future's reversal, 10% preference for AI guidance). Say "coach" and "plan", describe the rules, never a chat persona for teens.
- **Busy interfaces** (Hevy "busier than minimalist apps"). One job per screen, four tabs, plain words first.
- **Ads and upsells inside a paid product** (Lose It, Ladder's marketing). None, ever.
- **Photo food logging that guesses portions badly** (Lose It Snap It ≈70% category accuracy, poor portions). Do not ship photo logging until it is better than typing; text-describe first.
- **Calorie-centric framing anywhere a teen can see it.** No competitor is tested on this because none let teens in; we are, so the rule is enforced in the data layer and checked in every screen review.
