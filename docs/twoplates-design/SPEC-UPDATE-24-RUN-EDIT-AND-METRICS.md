# SPEC UPDATE 24 — Edit a run; auto-stop; more running statistics

Picture: `mockups/26-run-trim.png` (HTML `html/26-run-trim.html`). Palette B. Picture wins. Hein, 9 Nov: his Nov 8 run saved as 34 min / 3.28 mi because he stopped the app late; it was 28:29 / 3.15 mi.

## 1. Edit a run (26)
- Run detail (Update 21) ⋯ › **Edit run**, also from Train › Log.
- **Trim**: a speed-over-time chart with two handles (start and end). Dragging trims the GPS track; distance, time, pace, splits, elevation and heart-rate averages are recalculated from the kept samples, and the route map shows the trimmed part dashed grey. Before/after table.
- **Suggested trim**: if speed stays under 1 mph (1.6 km/h) for 2+ minutes at the end (or start), a banner offers "Looks like you stopped at 28:29. Trim there?" One tap applies it.
- **Type it in**: time and distance fields for runs with no GPS (treadmill, indoor) or when GPS was poor. A typed distance scales splits proportionally and marks the run "edited distance".
- **Save** updates the session, rewrites the Apple Health workout (delete and re-save the HKWorkout with the trimmed route, distance and samples) and re-uploads to Strava when connected. **Undo trim** restores the original, kept for 30 days.
- History marks edited runs with a small "Edited" tag. Records (fastest mile, 5 km) only count trimmed GPS data, never typed distances.

## 2. Don't need trimming in the first place
- **Auto-pause** during outdoor runs: pauses when speed drops under 1 mph for 10 s, resumes on movement; moving time is what counts. On by default, setting in the run screen ⋯.
- **Forgot to stop**: if no movement for 5 minutes during a run, a notification "Still running? Tap to finish at 28:29" with Finish and Keep going; Finish ends the run at the last moving moment, not now.
- The Live Activity shows the same prompt.

## 3. More running statistics (added to the run detail and My stats › Cardio)
Per run: moving time and elapsed time; average and best pace; best mile and best km within the run; splits per mile/km with heart rate and elevation; cadence and stride length; elevation gain and loss; heart-rate zones vs target; running power, vertical oscillation and ground contact time when the Apple Watch provides them (hide otherwise); weather at start (temperature, humidity, wind) from the run's location; effort rating; shoes (optional, counts miles per pair, reminder at 400 mi).
Across runs (My stats › Cardio, "All runs"): weekly and monthly distance, long-run trend, pace at a given heart rate (aerobic fitness trend), VO₂ max (Apple Health), personal records (fastest mile, 5 km, 10 km, longest run) with dates, and race-time predictions (5 km, 10 km, half) from recent efforts. Teens: no energy; everything else allowed.

## 4. Tests and process
Core tests: trimming recomputes distance and pace from samples; suggested-trim detection; typed distance scaling; records ignore typed distances; auto-pause moving time. UI test: edit Hein's Nov 8 run to 28:29 and 3.15 mi and see it in run detail and Health. Build after Update 21 (it depends on the run detail page). Capture Edit run with the suggestion, and the run detail after saving, on the iPhone in Light. STOP.
