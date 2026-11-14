# Spec update 30 (revised 14 Nov) — Flat, modern pages

Supersedes the first version of this spec and mockups 32-calm-*. Hein, after reviewing 18 screens of build 3: "the cards and round edges look 1960s, not modern, and make the app look so busy." Only actions get a button shape; everything else sits flat on the page.
Mockups: `mockups/33-flat-a-train.png`, `33-flat-b-surprise.png`, `33-flat-c-meals.png`, `33-flat-d-recipe.png` (together: `33-flat-compare.png`).

## 1. The look (app-wide)
1. **Page:** one flat background (#F5F5F2 light). No glass, no blurred gradient blobs, no shadows on content.
2. **Content is never in a card.** Lists, meals, exercises, days, people, settings, ingredients, method, status, explanations: plain rows or text on the page, separated by spacing, small caps section labels (12 pt, 0.7 tracking, grey) and 1 px hairlines (9 % ink).
3. **Only actions are button-shaped:** the one primary button (ink #15181D, white text, **14 pt corner radius, not a pill**, 52 pt tall), and small controls you tap (chips, steppers, segmented choices: **8 pt radius**, flat fill, no shadow). Secondary actions are text in gold-ink (#8F6100) or a plain icon (swap ⇄, ↻, ♡, ⋯) with no circle around it.
4. **Allowed containers, only these:** number tiles in a grid (My stats, Your week): 12 pt radius, white, no shadow; media (photo header, map, exercise picture): edge to edge or 8 pt radius.
5. **Thumbnails** 52 pt square, 8 pt radius.
6. **Tab bar:** flat bar with a top hairline; selected tab = filled symbol + ink label. No floating capsule, no outline circle.
7. **Type:** large title 32 pt bold; row title 16 pt semibold; grey line 13–14 pt.
8. Teen rules unchanged.

## 2. Screen by screen (Hein's review, numbers as he sent them)
1 & 11 **Home:** keep Start/Carry on, Quick start, Pick a day, Surprise me (as compact flat buttons). Photo tiles → number tiles without photos (Your week, Habits, Tonight, Buddies); My program and My stats move to Train. While a session runs, hide Quick start, Pick a day and Surprise me.
2 **iCloud sync:** "✓ Synced 2 min ago" + two small buttons (Try again now, Copy details); technical lines under a "Details" disclosure, plain text.
3 **Meals home (mockup c):** photo header; Plan / Shop / Prep / Eat as a plain step list with a connecting line, ticks for done, grey for not yet; one primary for the next step.
4 **Plan:** day chips stay; meal cards → plain rows (meal, dish, time · serves) with a plain swap icon; macro numbers as small number tiles (adults only).
5 **Recipe (mockup d):** Cooking for as a plain row with a flat stepper; Ingredients and Method as plain sections; add primary **Start cooking · step by step**.
6 **Train / Your program (mockup a):** chips → one meta line; days → plain rows with thumbnail, weekday and status; "+ Add a session" as a text link; primary Start <today's session>.
7 **Cardio day:** Outdoors / At the gym / No equipment → plain rows; Repeat stays a button.
8 **Outdoors list:** already right; the model for every list.
9 **Run pre-start:** fill the empty page with plain lines: what the effort means, last long run, shoes, audio cues. Keep Start and "Done without the phone? Enter it".
10 **Live run:** map edge to edge; Discard moves into ⋯ with a confirm.
12 **How did it go?:** label "Time · 1 min"; one 5-step effort selector, no duplicate labels.
13 **Run done:** remove the repeat "How did it go?"; See your run as a secondary text button; Done the only primary.
14 **Quick start:** preview as a plain list, one exercise per line.
15/16 **Pick a day:** Program as one line "Push, pull, legs · Change"; days as plain rows with the tick circle.
17 **Surprise me (mockup b):** exercises as plain rows with a plain swap icon; time as flat segmented choice.
18 **Exercise detail:** How to as plain numbered steps.

## 3. Bugs and coaching fixes seen in the review (hotfix, not build 4)
- Run screens titled "Walk" when Run was picked (pre-start and live).
- "Push, pull, legs, 3× a week" shows only Push day and Long run; Pull and Leg days missing; Day 1 Wed / Day 2 Mon order.
- Isolation moves got 4 sets (Machine Lat Pullover 4 × 10–15); rule is 3 × 10–15.
- Surprise me opened with an isolation move (Reverse Pec Deck) and gave 5 × 5–8 rows in a 45 min session; main lifts first, 3–4 working sets.
