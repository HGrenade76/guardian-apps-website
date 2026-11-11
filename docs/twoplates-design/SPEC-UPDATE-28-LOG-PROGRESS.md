# SPEC UPDATE 28 — Train › Log redesigned (Hein chose A, "Progress")

Picture: `mockups/30d-log-progress-heat.png` (HTML `html/30d-log-progress-heat.html`), Hein's final choice: A with the 30-day heat map. `30a-log-progress.png` is A without it; the three options compared in `mockups/30-log-compare.png`. Picture wins. Palette rule B and the fixed data colours (Update 22, the data-colour round) apply.

## 1. Header card
- Title "Your week" in the top bar, a calendar button on the right (opens the month view, kept as is).
- A glass hero card: a progress ring "1/3 THIS WEEK" (done / planned training days, green data colour), eyebrow "WEEK 2 OF 6 · <PROGRAM>", a personal line written from the data ("Good start, Hein" / "Halfway there" / "Week done" / "Quiet week so far"), and one line naming what is left ("Two to go: Long run today, Press day B Fri.").
- Three chips: streak with the flame (weeks in a row with every planned day done), total sessions, PRs this week (only if > 0).

## 1b. Last 30 days heat map
A slim glass card between the hero and the day tiles: "Last 30 days" with a legend (Strength, Run, Light), and a 15 × 2 grid of rounded squares, oldest top-left, today bottom-right with an outline. Colours (fixed data colours): strength dark green #2F7A4C, run orange #F28C28, light session (mobility, walk, short cardio) light green #9FD3A8, rest or nothing logged neutral grey. A day with both strength and a run shows strength. Tap a square: the list scrolls to that day. VoiceOver reads each square ("Tue 10 Nov, strength").

## 2. Day tiles
Seven day tiles (S M T W T F S, the phone's week start): weekday, date, and a status mark: green tick = done, dashed ring = planned, grey dot = rest, a small orange dot when a run was done. Today has the outlined border. Tap a day: the list scrolls to it.

## 3. Sessions list
- Sections "Today", "This week", "Last week", then by week.
- Each session is a glass card: an icon tile (dumbbell for strength on neutral, runner for cardio on the orange data tint), name, one line of facts (sets · minutes · areas, or distance · time), a PR outline badge when the session set a record, chevron. Planned sessions show a Start button instead of the chevron.
- Long-press: Edit (runs open Edit run; strength opens the logged sets), Delete with confirm.
- The old three-figure header (1 of 3 / 16 sessions / 0 wk streak) is replaced by the hero card.

## 4. Tests and process
UI test: Log shows the hero, the 30-day heat map with correct colours for a seeded month, seven day tiles with correct marks for a seeded week, Start on a planned session, PR badge. Capture on the iPhone in Graphite with Hein's real data. Build after Update 27.
