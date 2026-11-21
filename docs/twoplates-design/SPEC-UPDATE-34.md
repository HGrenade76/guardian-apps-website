# Spec update 34 — First full workout: fixes (21 Nov)

From Hein's first full real workout (Leg day, about 50 min) on build 20261120. Priority order: data first, then flow, then look.
Mockups: `mockups/36-st-today.png`, `36-st-strength.png`, `36-st-cardio.png`, `36-st-body.png` (together `36-stats-compare.png`).

## A. Data (must fix first)
1. **Session summary counts are wrong.** Leg day showed "7 sets · 6 min" (done screen and Progress), while the session detail shows 6 sets on Leg Press alone and Garmin recorded 50 min. Totals, time and load must be computed from every logged set of the session. Session time = Start to Finish, including rests and time away from the screen. Health gets the same numbers. Repair today's Leg day from its stored sets.
2. **Sessions never closed.** Core (Thu) shows "1 set · 150 min". After about 20 min with no logged set, ask "Still training?"; with no answer, end the session at the last set + 5 min.
3. **Empty sessions.** "Push day · Mon · 0 sets · 1 min" was saved. Finish with nothing logged asks "Nothing logged. Discard this session?"; never save empty sessions.
4. **"Last time" shows today.** Session detail "Last time: … (Nov 20)" listed today's own sets. Last time = the previous session with that exercise.
5. **Load sanity check** (Spec 27): a weight far from history (Machine Crunch 305 lb × 30) asks "305 lb? Your last set was 50 lb" before saving; PRs only from confirmed sets.
6. **Machine defaults:** with no history, a machine exercise never prefills 5 lb (Standing Calf Raise). Empty weight with a hint, or a sensible machine starting load.
7. **Progression when the range is beaten:** target 5 × 5–8, done 12 reps at 360 and 450 → next time a clear load increase, not a repeat.

## B. Flow
8. **Edit and undo a logged set.** Tap any logged set to edit reps and weight or delete it (Save / Delete set). After Log set, a 5 s "Undo" toast. Edits update totals, PRs, next prefill and Health.
9. **Back from a workout.** A workout-in-progress bar above the tab bar on every tab ("Leg day · 34:12 · Set 2 of 3 · Rest 0:45 ›"), one tap back. Home hero shows the running workout with Carry on. Back arrow reads "‹ Home" or minimises into the bar. The Live Activity opens the set screen. Coming back always continues the same session.
10. **Every start asks who you train with:** Home Start, Train Start, day preview Start workout, Pick a day, Quick start, Surprise me all go through "Who are you training with?" (pre-filled per weekday, one tap). "Add a buddy to this session" in the set screen ⋯ menu.
11. **Swipe hint:** page dots or ‹ › next to "5 of 8 · Legs" (tap = swipe), and a one-time nudge animation with "Swipe for the next exercise" for the first two sessions. Swipe = exercises; tap a pill = switch lifter.

## C. Look
12. **Session overview** (tap a finished day; mockup `36-session-overview.png`): top line (date, time, sets, load, effort, with whom); highlights (PRs, vs last time); muscles worked with sets per muscle; exercises one line each ("Leg Press · 6 sets · best 460 × 10 · ↑"), tap to expand sets (editable); Health status, note, Share.
13. **Progress list:** a green ✓ on done sessions (PR beside it); "with Landi" in the text instead of an unexplained initial circle; remove "Next week"; replace "Earlier sessions" with "All sessions ›"; the calendar button never overlaps the list.
14. **My stats as tabs** (mockups 36): Today (readiness with one plain sentence; muscles green Ready / amber Recovering / red Needs rest, with hours; this week), Training (load, intensity minutes, status), Strength (six muscle groups with best lift, lifts, sets, trend; tap for chart and lifts; personal bests live here; search), Cardio (three numbers, one chart with Weeks/Months, records, shoes), Body (weight with a line chart 4 wk/12 wk/6 mo/1 yr, readings; adults only, absent for teens). Sections separated by hairlines and space.
15. **Copy:** "Unproductive" → "Load rising faster than fitness: keep this week steady"; "You're 2 behind this week" → "2 sessions to go this week"; "about a loaded lorry" → "about a loaded pickup truck".

## D. Later (Garmin)
16. When Garmin syncs a workout overlapping a TwoPlates session, Health must not double-count; note for the Garmin connection work.
