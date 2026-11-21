# Spec update 35 — Onboarding: one question per screen, dark brand (option A, approved 22 Nov)

Mockup: `mockups/37-onboarding-A-dark.png` (screens: intro, a single-choice question, a multi-choice grid). Replaces the four busy set-up cards. Same data as today; nothing new is collected.

## Look
- Background: the splash's dark gradient with a soft gold glow and one faint gold outline shape; same in Light and Dark mode (onboarding only — the app itself stays light).
- Top: 7-segment progress bar (gold = done), back arrow, small gold caps "N OF 7 · SECTION".
- Question 30 pt bold white, one grey helper line.
- Answers: large cards (16 pt padding, 14 pt radius, translucent white fill, hairline border), icon tile, title + one grey line, round tick on the right. Chosen: 1.5 pt gold border, gold-tinted fill, gold tick. Multi-select grids use 2 columns with the equipment illustration.
- One gold primary button at the bottom ("Continue", "Continue · 4 picked"); disabled until a required answer is picked. Single-choice screens may advance on tap after a short delay.
- Contrast 4.5:1 for all text.

## The seven screens
0. **Intro:** logo, "Two people. One plan each. Let's build yours.", "Seven quick questions. About a minute." · Let's start · "I've used TwoPlates before" (restore).
1. **About you:** first name, year of birth, units (lb/kg). Height and weight optional, adults only ("Used for portions. Never shown as a target."). The teen gate runs here as today.
2. **Level:** Just starting (under 6 months) · A while now (6 months–3 years) · Years (3+, I know my lifts).
3. **Where:** Gym · Home · Both.
4. **Equipment:** multi-select grid with pictures (Barbell + rack, Dumbbells, Cables, Machines, Kettlebells, Bands, Pull-up bar, Bench); preset from screen 3; "Change it later in My gym".
5. **Days:** seven day circles (gold when picked), "N days · a good fit for <split>"; below, small row "Wear anything? Apple Watch · Strap · Just my phone".
6. **Goal:** Get stronger · Build muscle · Lose fat, keep muscle · Move better (teens: the teen goal list as today). Small row "Meals too? On/Off".
7. **Food** (only if Meals is on): cooking for, how you eat, allergies; dislikes and weeknight time under "More options". Button "Build my program" + "I'll set this up later".
Then the Health permission (system sheet) and, optionally, "Train with someone?" invite — as today.

## Rules
- Teen rules unchanged: no weight question, no calories, teen goal list.
- Back keeps answers; leaving and returning resumes at the same screen.
- UI tests: complete the flow adult and teen; back keeps answers; multi-select count on the button.
