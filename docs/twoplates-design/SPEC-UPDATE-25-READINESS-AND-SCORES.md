# SPEC UPDATE 25 — Readiness, recovery, scores; charts with real axes

Picture: `mockups/27-stats-readiness.png` (HTML `html/27-stats-readiness.html`). Palette B. Picture wins. Numbers in the picture are samples. Hein, 9 Nov: add Recovery, Endurance score, Intensity minutes, Weight, Training readiness and status, Last activity, Training load and Fitness age to My stats; the pace and heart-rate chart has no axes.

## 1. Charts get real axes (all charts, starting with the run detail)
- Pace and heart rate: x axis is distance (mi or km per units) with 4 to 5 labels; left y axis pace in min/mi (faster at the top), right y axis heart rate in bpm in red; a dashed average-pace line labelled "avg 8:54". Pace smoothed over a 30 s rolling window (raw spikes from GPS removed); standing-still stretches at start and end left out. Heart rate drawn only when samples exist; otherwise its axis is hidden.
- Every chart in the app gets labelled axes or a stated scale, units on the axis, and a legend; Core/UI test that each chart view has axis labels.

## 2. My stats opens on readiness (27)
The analysis page from Update 21 keeps its cards; this adds a readiness block on top and a score grid under it.
- **Headline** from readiness: "Ready to train" / "Take it easy today" / "Rest day recommended", with one line ("Recovered from Saturday's run. A good day for Push.") naming the next program day.
- **Training readiness 0 to 100** ring with a word (Low, Moderate, High, Prime) and factor chips: sleep vs need, HRV vs 30-day baseline, resting HR vs baseline, recovery time left, recent load (acute vs chronic). Sleep, HRV and resting HR come from Apple Health (Watch); without them readiness uses recovery and load only and says "Add Apple Watch sleep and HRV for a fuller read".
- **Training status**: Detraining, Recovery, Maintaining, Productive, Peaking, Overreaching, Unproductive, from the 4-week load trend and the fitness trend (VO₂ max for cardio, strength curve for lifting), with a five-step scale bar.
- **Recovery time**: hours until recovered, from the last sessions' load, type and muscle groups (heavy lower-body or long hard cardio longest), shown as "Ready now" or "Ready in 18 h", plus the estimate after the next planned session.
- **Intensity minutes**: weekly moderate plus 2× vigorous against 150 (adults, WHO). Teens: 60 a day (420 a week). Moderate = heart-rate zones 2 and 3 or effort "Moderate"; vigorous = zones 4 and 5 or "Hard"; working sets count as moderate.
- **Training load**: the Update 21 number in a tile (tap opens the full chart).
- **Endurance score**: from VO₂ max, the 4-week aerobic minutes and long-session duration, with a level (Recreational, Intermediate, Trained, Well-trained, Expert) and the 4-week change. Name stays generic; no third-party branding.
- **Fitness age**: from VO₂ max against age and sex norms, adjusted for resting HR and weekly activity; "You're 49" uses the profile's year of birth. Adults only.
- **VO₂ max** with its 8-week change and band (Apple Health).
- **Weight**: latest weigh-in and 12-week change; tap opens Me › Weigh-in. Adults only.
- **Last activity** card: type, distance or sets, time, pace or load, zone; tap opens its detail.
- Teens: readiness, status, recovery, intensity minutes, load, endurance and last activity shown; fitness age, weight and energy never.

## 3. Tests and process
Core tests for each score with fixed inputs (readiness with and without HRV and sleep, status transitions, recovery hours, intensity minutes adult and teen, endurance level, fitness age), and the teen rules. Build after Update 24. Capture My stats (adult, real data) and the run detail chart on the iPhone in Light. STOP.

## 4. Addendum (Hein, 9 Nov): heart-rate recovery
- **What:** how far heart rate drops in the first minute after a hard effort stops (bpm). A faster drop means better cardio fitness and recovery.
- **Source:** Apple Health "Cardio Recovery" (one-minute heart-rate recovery the Apple Watch records after workouts) when present. Otherwise TwoPlates measures it itself: after Finish on a cardio session (or a hard conditioning block), keep reading heart rate (Watch or paired strap) for 2 minutes with a "Cooling down… 0:47" bar, and take peak HR minus HR at 60 s. Only counted when the effort reached zone 3 or higher; otherwise not recorded.
- **Bands:** under 12 bpm Low, 12 to 20 Fair, 21 to 30 Good, 31 to 40 Very good, over 40 Excellent. Shown as a band word, never a medical claim; a persistently Low value shows "Worth mentioning to your doctor" once, in the info sheet only.
- **Where:** a "HR RECOVERY" tile beside VO₂ max on My stats (latest value, band, 8-week change, a small trend line); a line on each run's detail ("HR recovery 32 bpm · Very good"); and it feeds readiness (a drop of 5+ bpm against the 30-day baseline lowers readiness) and fitness age.
- **Teens:** shown (no energy or weight involved).
- **Tests:** Core tests for the 60 s calculation (peak vs 60 s), the zone-3 rule, the bands, baseline drop affecting readiness; UI test for the cool-down bar.
