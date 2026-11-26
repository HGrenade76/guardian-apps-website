# TwoPlates — prompt queue (in order)

Kept by the designer. Send one prompt at a time, only when the agent has stopped. Tick it off when the agent reports it done. Updated 26 Nov 2026.

**Footer used on every item** (already included below):
> One item only. Work in this chat, no helper agents. Run only this area's tests, commit, back up. Don't install on my iPhone. STOP and report.

---

## ☐ 0 · Archive (only if the onboarding build isn't uploaded yet)
```
Archive the next build from the latest commit (Review scheme, both containers). Before archiving: full Core and app unit suites, and the full UI suite once on the simulator; fix real failures and report counts. Release check: no review tools and no Replay onboarding in the App Store build. Open the archive in Organizer and STOP with the build number. Don't install on my iPhone.
```

## ☐ 1 · Muscle-group alignment (all 582 exercises)
```
One item: muscle-group alignment for the exercise library (all 582).
Problem: lists show every exercise that touches a muscle. Example on Glutes: Dumbbell Back Extension, Dumbbell Cross Body Romanian Deadlift, Deficit Deadlift appear as glute exercises.
Rule: every exercise has exactly one primary group (where it's listed) and secondary groups. Each area list shows primary exercises first; secondary ones go in a section at the end, "Also works your <area>". Search, generator, swaps and the muscle-worked colours use primary for slot choice and both for weekly volume (secondary counts half).
Assign by movement pattern:
- Hip thrust, glute bridge, kickback, abduction, frog pump → Glutes (secondary hamstrings)
- RDL, deadlift variants, good morning, leg curl, Nordic → Legs/hamstrings (secondary glutes, lower back)
- Squat, lunge, split squat, leg press, step-up, leg extension, sissy squat → Legs/quads (secondary glutes)
- Back extension, hyperextension, reverse hyper → Back/lower back (secondary glutes, hamstrings)
- Calf raises → Legs/calves
- Horizontal press and fly → Chest (secondary triceps, front delts); incline press → Chest; overhead press, lateral/front/rear raise → Shoulders
- Rows, pulldowns, pull-ups, pullovers → Back (secondary biceps, rear delts)
- Curls → Arms/biceps; pushdowns, skull crushers, extensions, kickbacks (triceps) → Arms/triceps
- Crunch, plank, rotation, anti-rotation, leg raise → Core
1. Apply these rules to all 582, keeping existing teen flags and equipment. Write docs/EXERCISE-GROUPS-AUDIT.md: a summary of moves per area, then a table of every exercise whose primary group changed (name, old → new, secondary), then a short list of exercises the rules don't cover clearly for me to decide.
2. Core tests: the examples above land where listed; no exercise has zero or two primaries; Glutes primary list contains no deadlift, RDL or back extension.
One item only. Work in this chat, no helper agents. Run only this area's tests, commit, back up. Don't install on my iPhone. STOP and report, and send me the unclear list.
```
*After: send the unclear list to the designer for rulings.*

## ☐ 2 · Add exercise: all group tabs visible, and cardio mid-workout
```
One item: Add exercise during a workout, the group tabs.
1. The tab row is scrolled so "Cardio" is cut off on the left ("…ardio"). Tabs start at the left with All first, in this order: All, Chest, Back, Shoulders, Arms, Legs, Glutes, Core, Cardio. The selected tab always scrolls into view. Same order everywhere the library shows areas.
2. Adding a cardio item mid-workout (treadmill, bike, rower, stairs, elliptical, jump rope): the row logs minutes, plus distance, level/incline and heart rate where they apply; never reps × weight. A quick start of 5, 10 or 15 min. It counts in the session's time and totals and is written to Health as a segment of the same workout. Teen rules unchanged.
UI tests: Cardio visible without scrolling the tab row back; add a 10 min treadmill to a strength session, log it, and it appears in the done screen and overview.
One item only. Work in this chat, no helper agents. Run only this area's tests, commit, back up. Don't install on my iPhone. STOP and report.
```

## ☐ 3 · Back button shows "Tr…"
```
One item: the back button on the set screen shows "Tr…" squeezed inside the round glass button. On every screen, the back button is the chevron only (no title text) in the round glass button, accessibility label "Back to <previous screen>". Check all pushed screens and the set screen. UI test on the set screen: back button has no truncated text and returns to the previous screen (workout keeps running, workout bar shows).
One item only. Work in this chat, no helper agents. Run only this area's tests, commit, back up. Don't install on my iPhone. STOP and report.
```

## ☐ 4 · No brand names in exercise names
```
One item: remove brand names from the exercise library (all 582), without inventing names.
- Find every exercise name containing a brand or trademark (e.g. Hammer Strength, Life Fitness, Nautilus, Cybex, Technogym, Precor, Matrix, Concept2, SkiErg, Assault, StairMaster, TRX, BOSU, VersaClimber, Peloton, Jacobs Ladder, Smith only if paired with a brand).
- Rename to the established gym name without the brand: keep the rest of the name and add the equipment in brackets where needed (e.g. "Hammer Strength Iso-Lateral Row" → "Iso-Lateral Row (Machine)"). Where a brand became the common word, use the standard generic term: Assault Bike → Air Bike, StairMaster → Stair Climber, TRX → Suspension Trainer, Concept2 rower → Rowing Machine, SkiErg → Ski Machine, BOSU → Balance Ball. "Smith machine" is a generic term and stays.
- Never invent a new name. If no established generic name exists, keep it unchanged and list it for me.
- The old brand name stays as a hidden search alias, so searching "Hammer" or "TRX" still finds the exercise; it's never displayed.
- Logged history, PRs and programs keep pointing at the same exercise (rename only, same ID).
Write docs/EXERCISE-BRAND-NAMES.md: old name → new name, and the undecided list. Core test: no displayed exercise name contains a brand from the list; search by old name finds the renamed exercise.
One item only. Work in this chat, no helper agents. Run only this area's tests, commit, back up. Don't install on my iPhone. STOP and report, and send me the undecided list.
```

## ☐ 5 · Plate-loaded machines say "Add plates"
```
One item: the weight hint for machines. Plate-loaded machines (no weight stack) show "Set the stack" today. Use the equipment data: selectorized/stack machines → "Set the stack"; plate-loaded machines → "Add plates" (load = plates added, not counting the sled or arm unless the machine's starting resistance is known); cable stacks → "Set the stack". With no history, the weight field stays empty with that hint. Core test for one of each type.
One item only. Work in this chat, no helper agents. Run only this area's tests, commit, back up. Don't install on my iPhone. STOP and report.
```

## ☐ 6 · Archive (after items 1–5)
```
Archive the next build from the latest commit (Review scheme, both containers). Before archiving: full Core and app unit suites, and the full UI suite once on the simulator; fix real failures and report counts. Release check: no review tools and no Replay onboarding in the App Store build. Open the archive in Organizer and STOP with the build number. Don't install on my iPhone.
```

---

## Waiting on something
- **Merge the two earlier profiles (Hein, Lenaigh):** waiting on Copy check from a TestFlight build ("Earlier household" block). The designer writes the approval prompt from those counts.

## Later (not queued yet)
- Garmin double-counting in Health (when Garmin is built).
- Dark-mode versions of the exercise pictures (no pale squares).

## Hein's own tasks
- Two-phone join test with your wife or Lenaigh.
- Website agent prompts (coming-soon page, icon update, invite links).
- App Store Connect: paid apps agreement, tax, banking, then subscription products.
- Does support@guardian-apps.com reach you?
- Review panel sign-off on the teen rules (Spec 31 and later notes).
- Time Machine backup of the Mac.
