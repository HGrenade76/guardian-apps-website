# SPEC UPDATE 27 — Set screen: compact sticky header, warm-ups, loads, progression, timer

Picture: `mockups/29-set-sticky.png` (HTML `html/29-set-sticky.html`). Picture wins. Hein's iPhone session, 11 Nov.

## 1. Weight pre-fill regression (bug, first)
After sets at 135 lb, the next set and the planned rows showed 5 lb, and Set 4 was logged at 5 lb × 7. Pre-fill order within a session: the previous logged working set of the same exercise, else the planned load, else last session, else the smallest increment. Planned rows below the current set show the same load. Core test reproducing 135, 135, 135 → next is 135.
- Sanity check: logging a working set under half the previous working set's load asks "5 lb? Your last set was 135 lb" (Log 5 lb / Use 135 lb).
- Logged sets are editable: tap a ticked row to change reps or load (fixes Hein's Set 4).

## 2. Warm-ups
- Loads ramp to the working weight: about 50 % × 5 then 75 % × 3 (a third at 90 % × 1 when the working load is over 80 % of the exercise's best), rounded to the bar, plates or machine stack. Never below the empty bar or the lightest stack plate; never 5.5 lb before 135 lb.
- Each warm-up row has an ×: one tap removes it. A "Skip warm-ups" link removes all warm-ups for that exercise. Me › Training › Warm-up sets: Auto (default) / First exercise of each muscle only / Off.
- Warm-ups never count toward volume, records or progression.

## 3. Progression cue
- When a working set's reps beat the top of the target range with the reserve rule met, show under the fields: "Above target. Try 145 lb" (adults) and pre-fill that load for the next set if two sets beat the target. Teens: the same cue in words ("Ready to go a little heavier next time") and the next session's load rises per the teen rule; never mid-session jumps over 5 %.
- The next session's planned load rises per the existing progression rule.

## 4. Compact sticky header (picture 29)
- First set of an exercise: the full hero (230 pt) as now.
- After the first logged working set (or when the user scrolls), the hero collapses into a glass header pinned under the top bar: 84 pt figure (clip keeps playing), "2 OF 5 · BACK", name (two lines max), target line, "How to ›". Tap the figure: full-size overlay. Collapse animates with the scroll.
- Finished sets fold into one line: "✓ 2 warm-ups · 2 sets · 135 lb × 11, 12" with Show ▾ to expand.
- The rest row, current set fields, cue and the next planned set are always visible above the Log set bar without scrolling on a 6.1" phone.

## 5. Timer pill and keypad
- Elapsed time in its own pill beside ⋯ (36 pt high, 12 pt side padding, tabular digits, accent-tinted outline), turning amber past the planned session length.
- With the number keypad open, the Log set bar sits above the keyboard (keyboard toolbar: "Done" and "Log set"); nothing is ever hidden behind the keypad.

## 6. Tests and process
Core tests for 1 to 3. UI tests: pre-fill after three sets, sanity prompt, warm-up × and Skip, header collapses after Set 1 and stays pinned, keypad shows Log set. Capture Set 1 (full hero), Set 3 (compact header), keypad open, and the progression cue on the iPhone in Graphite. STOP.
