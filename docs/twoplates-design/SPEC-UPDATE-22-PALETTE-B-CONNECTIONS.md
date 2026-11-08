# SPEC UPDATE 22 — Gold as an edge, not a fill (Hein chose B); tidier onboarding; Connections

Pictures: `mockups/24b-onboarding-B.png` (the rule, on onboarding card 2), `mockups/24-palette-compare.png` (A, B, C; B wins), `mockups/25-connections.png`. Pictures win. Hein, 8 Nov: gold fills everywhere are overwhelming.

## 1. Palette rule B, app-wide
- **Selected state** (chips, segmented choices, day dots, picker ticks, period switches, filter chips, selected cards): white fill, 1.5 pt `#F2B232` border, label in accent text `#8F6100` semibold. Never a gold fill.
- **Gold fill is allowed in exactly one place per screen: the primary action** (the gloss button or bar: Start workout, Next, Log set, Build my program, Send to Reminders). Everything else that was gold-filled becomes outline or text.
- Tab bar: active tab is accent text icon and label with no pill fill (or a 1 pt gold outline pill); inactive muted.
- Progress bars and step bars stay gold (they are data, not choices). Ticks for done stay green.
- Icon chips on tiles stay as line icons in accent text, no filled chip.
- Dark: same rule; selected = dark glass with the gold border and `#FFD98A` label.
- Contrast test: accent text on white and on glass ≥ 4.5:1 (it is about 5.2:1). Source test: no gold fill outside the primary-action style (a single `PrimaryActionStyle` owns the gold gradient).

## 2. Onboarding tidy (24b)
- Chips 40 pt high, 15 pt regular (selected semibold), 8 pt gaps; equal-width rows for Level and Where.
- Section labels in sentence case, 13 pt semibold muted ("Level", "Where", "What you have", "Training days"); no all-caps labels inside cards.
- Training days are seven round 42 pt day dots (M T W T F S S); "4 days a week" is derived from the dots, so the separate "Days a week" row is gone.
- One short helper line under "What you have": "Fine-tune later in Me › My gym."
- The "Wear anything?" screen is removed from onboarding. Card 2 gets one more row, "Wear anything?": Apple Watch · Strap · Just my phone. Pairing happens later in Connections (a strap choice shows a "Pair in Me › Connections" line, no sheet during onboarding).

## 3. Connections (25)
Me › Connections, three groups:
- **On this iPhone:** Apple Health (connected state), Apple Watch, Heart-rate sensor (the existing BLE pairing sheet).
- **Apps and devices:** Strava (send runs and lifts; OAuth, public API), Polar Flow (AccessLink API), WHOOP (developer API), Oura (API), Withings (scale weigh-ins, API), Garmin Connect, Coros, Suunto. Garmin, Coros and Suunto need a partner agreement Hein applies for; until approved their rows show "Soon" and no button.
- **Files:** import a workout file (FIT, GPX, TCX) and import lifts from another app (Strong, Hevy, Fitbod CSV; the existing "Bring your lifts" import).
- Each row: brand-coloured square (use each brand's approved logo once the agreements allow; letters until then), name, one-line what it does, a status chip (Connected green outline, Connect gold outline, Soon grey outline).
- Data rules: anything imported lands in the same history as native sessions and feeds My stats; duplicates (same start time and type from two sources) keep one, preferring the richer record. Teen rules apply to imported data the same way (no energy, no e1RM shown).
- Build order: the page and Apple Health/Watch/strap rows first (already working), then Strava (most asked), then file import, then Polar, WHOOP, Oura, Withings. Each third-party connection is its own small round with its own tests.

## 4. Teen rules sign-off (process note)
Hein signs off, 8 Nov, the teen-rule changes made in Updates 12, 14, 18 and Update 13 item 2: fat-loss goals hidden for teens; HIIT rests 40/40 with no "all out" prompts; calibration asks a recent working set, never a max; no "new best" prompt before a set ("Best set yet ✓" after). Record this in docs/periodisation-engine-spec.md §4/§8/§9 with the date, and keep the guardian-apps-website copy in sync when that repo is next touched.

## 5. Program first (principle)
The in-use program is always the default next step; Build my own, Surprise me and Pick a day stay one tap away and never replace or reorder the program. No copy invites skipping the plan.

## 6. Process
After the current rounds (supersets, Update 21). Palette and onboarding as one round (capture Home, Train, onboarding cards 1 to 4, a picker, My stats, in Light; set fields in Dark). Connections page as a second round with Strava first. STOP after each.
