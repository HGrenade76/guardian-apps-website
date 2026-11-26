# Spec update 36 — Show, don't list (visual-first data, 26 Nov)

Hein: "graphics tell a quicker story." App-wide principle for every screen that reports data.

## Rules
1. **Lead with one picture, then the numbers.** Each report screen or section opens with one visual that answers its main question; numbers and lists support it below. Raw tables (set-by-set, all readings) sit one tap away, never first.
2. **One chart type per question, the same everywhere:**
   - Trend over time (a lift, weight, pace) → **line**, today's point highlighted, range 4 wk / 12 wk / 6 mo / 1 yr.
   - Amount per period (volume, distance, sessions per week) → **bars**, current period highlighted.
   - Progress to a target (week sessions, habits, Eat days, program weeks) → **ring or bar** with "N of M".
   - Consistency (days trained) → **heat map** grid.
   - Muscles worked / recovery → **muscle bars or body map**, green / amber / red.
   - Sets per muscle vs target → **bars with a shaded target band**.
3. **Fixed data colours** (strength green #2F7A4C, run orange #F28C28, light green #9FD3A8, heart rate red #D64545, body blue #4A7FB8, gold for PRs and accents). Accent colour only for selection, never for data.
4. **Small and glanceable:** a chart in a list row is a sparkline (no axes); a section chart is ≤ 160 pt tall with at most 3 axis labels; detail charts allow tap-and-hold to read a value.
5. **Every chart has words:** a one-line takeaway above it ("+12 % in 4 weeks", "3 of 4 this week") and a VoiceOver summary.
6. **Empty states teach:** with no data, show the chart's outline and "Log 2 sessions to see your trend", never a blank space.
7. **Teen rules:** no body-weight, body-fat or calorie charts; no estimated-1RM lines (reps or best set instead).

## Where it applies (audit list)
Session overview and done screen (muscle bars, PR badges, per-exercise sparkline) · Progress (week ring, heat map, session rows with sparkline for PR lifts) · My stats Today / Training / Strength / Cardio / Body · Exercise detail › Progress · Program so far (weekly volume bars, week N of M bar) · Week balance (sets per muscle with target band) · Buddies (weekly rings) · Meals home (Eat ring) and Plan (macro rings, adults only) · Habits (7-day dots and streak) · Home tiles (mini ring / bar).
