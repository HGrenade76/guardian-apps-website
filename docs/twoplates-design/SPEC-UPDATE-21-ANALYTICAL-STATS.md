# SPEC UPDATE 21 — My stats becomes analysis; every run gets a detail page

Pictures: `mockups/23a-stats-analysis.png` (My stats) and `mockups/23b-run-detail.png` (one run). Light, gold on grey. Pictures win. Hein, 8 Nov: his first outdoor run saved but its statistics are nowhere to be found; My stats is "not WOW, it needs to be analytical". This replaces the Update 19 §5 layout (keep its Core numbers and teen rules; change what is shown and how).

## 0. Bug first: a finished run must be findable
A saved run has a detail page (picture 23b), reached from: the cardio done sheet ("See your run"), Train › Log (each session row), My stats › Cardio › "All runs", and the Calendar day. Core/UI test: finish a run, then each of those four paths opens its detail.

## 1. My stats (23a): a headline, then analysis
- **Headline written from the data**, not a fixed title: "You're building" / "Holding steady" / "Time to back off" / "Coming back", with one line why ("Load up 12 % this block, recovery keeping pace"). Rule in Core from the training-load ratio and the trend.
- **Period switch** 4 wk / 8 wk / 12 wk / Year drives every card.
- **Training load**: weekly load (sets × reps × load share for lifting, plus minutes × effort for cardio; one number, documented in "How it works ⓘ") against the 4-week average (dashed), with the productive band 0.8 to 1.3× shaded green. Shows the ratio and a one-line recommendation ("Next week: hold or +5 %"). Ratio above 1.5 reads "Spike: take an easier week".
- **Coach's read**: up to three generated insights, each one sentence with a bold lead, ranked by importance: a lift moving or stalling (3+ weeks flat), a muscle group under half its target for 2+ weeks, recovery (resting HR or HRV trend and sleep from Apple Health, when available), a consistency streak or a drop. Never more than three; never generic praise.
- **Muscle heat**: a 5 × 2 grid of the ten groups (Chest, Back, Shoulders, Biceps, Triceps, Core, Glutes, Quads, Hams, Calves), each tile coloured grey → gold → deep orange by sets vs target, with "n/target".
- **Strength curve**: the three most-trained main lifts as % change lines over the period (adults: e1RM; teens: best-set weight × reps score, never e1RM), headline % per lift above. Tap a line → that exercise's Progress tab.
- **Consistency**: a calendar heat grid (weeks across, days down): planned and done gold, extra pale gold, missed salmon, rest grey, future dashed. Percent of planned days done.
- **Cardio**: minutes this week, zone-2 minutes, VO₂ max (from Apple Health when present); weekly bars of minutes with the zone-2 part in green. "All runs ›" lists runs, newest first.
- The Body card moves under Me › Weigh-in (adults only), off this page.

## 2. Run detail (23b)
- Header: type, date and start time, distance and time large, "Zone 2 run · felt Easy · on plan".
- Route map card (MapKit, gold line, start dot); no map for treadmill or indoor runs.
- Six-stat card: average pace, average HR, elevation gain, cadence, max HR, energy (energy adults only; teens see the other five).
- Pace and heart rate on one chart, with a one-line read (e.g. cardiac drift).
- Splits per km (or mile per units) with bars and HR per split, plus a one-line read (negative split, fade).
- Heart-rate zones bar against the session's target zone, with the share in target and one line of advice.
- "Vs your last" the same distance: time, HR at the same pace, cadence.
- Data comes from the session's own GPS and from Apple Health (heart rate, cadence, energy, VO₂ max). Missing data hides its row; never "–".

## 3. Tests and process
Core tests for the headline rule, training-load ratio and band, each insight rule, heat colours, consistency grid, and teen rules (no e1RM, no energy, no Body card). UI tests for the four paths to a run and the period switch. Capture My stats and the run detail of Hein's real run on the iPhone in Light. Show Hein, STOP.
