# Periodisation Engine — Rules Specification v0.1 (for S&C review)

**Purpose.** The deterministic engine owns every number the app prescribes: sets, reps, load, progression, deloads, weekly volume, and the hard limits for teens. The AI layer may choose exercises within a slot, write cues and reorder accessories; it may never change a number outside these bounds. A certified strength and conditioning reviewer signs this document before the founder trial.

**Conventions.** RIR = reps in reserve. RPE = rate of perceived exertion (10 − RIR). "Hard set" = a working set at RIR ≤ 3. Volume counted as hard sets per muscle group per week. Load steps are the smallest practical increment for the implement (machine pin, 2.5 lb/1.25 kg dumbbell, 5 lb/2.5 kg barbell).

---

## 1. Inputs

| Input | Values | Source |
|---|---|---|
| Role | adult (18+), teen (13–17) | Birth date, locked by household owner |
| Goal | `recomp` (muscle + fat loss), `lean` (tone / lean out), `gain` (muscle), `strength`, `general` | Onboarding |
| Training age | `novice` (< 6 months consistent), `intermediate` (6–36 months), `advanced` (> 36 months, plateaued on linear progress) | Onboarding + first 2 weeks of logs |
| Equipment profile | `commercial` (machines + free weights + cables), `dumbbell` (dumbbells + bench), `barbell` (rack + bar), `bodyweight`, `home-mixed` | Onboarding, editable per session |
| Days available | 2, 3, 4, 5 | Onboarding; joint-session days pinned |
| Session length | 30, 45, 60, 75 min | Onboarding |
| Limits | injury flags by joint/region, exercise exclusions | Onboarding; always honoured |
| Recovery signal | sleep hours, self-report 1–5, optional Garmin HRV status / body battery, Apple Health resting HR | Daily, optional |

---

## 2. Template selection

| Days | Template | Slot structure per session |
|---|---|---|
| 2 | Full body A/B | Squat · Hinge · H-push · H-pull · V-push or V-pull (alternate) · Core/carry |
| 3 | Full body A/B/C | As above, rotating emphasis (A lower-bias, B upper-bias, C balanced) |
| 4 | Upper/Lower × 2 | Upper: H-push · H-pull · V-push · V-pull · Arms pair · Delts. Lower: Squat · Hinge · Unilateral · Hip/ham · Calves · Core |
| 5 | Upper/Lower/Push/Pull/Legs | 4-day structure plus a dedicated accessory/hypertrophy day on the lagging region |

**Joint sessions.** Both buddies receive the same template skeleton on shared days. Each slot resolves independently per member (exercise, load, reps). Rest periods are synchronised to the longer of the two prescriptions.

---

## 3. Weekly volume, intensity and rep ranges (adults)

| Goal | Training age | Hard sets / muscle / week | Main lifts | Accessories | Target RIR | Cardio |
|---|---|---|---|---|---|---|
| `recomp` | novice | 8–10 | 3×8–10 | 2×10–15 | 2–3 | 2× 20–30 min Z2 + 7–8k steps |
| `recomp` | intermediate | 10–16 | 3–4×6–10 | 2–3×10–15 | 1–3 | 2–3× 20–30 min Z2 + 8–10k steps |
| `recomp` | advanced | 12–18 | 4×5–8 | 3×10–15 | 1–2 | as intermediate, optional 1 interval session |
| `lean` | novice | 8–10 | 3×10–12 | 2×12–15 | 2–3 | 2× 20–30 min Z2 + 8k steps |
| `lean` | intermediate | 10–16 | 3×8–12 | 3×12–20 | 1–3 | 2–3× 25–35 min Z2 or 1× intervals |
| `gain` | novice | 10–12 | 3×6–10 | 2×10–12 | 2–3 | 1–2× 20 min Z2 |
| `gain` | intermediate | 12–18 | 3–4×6–10 | 3×10–15 | 1–2 | 1–2× 20 min Z2 |
| `strength` | intermediate+ | 8–12 (main lifts weighted) | 4–5×3–6 | 2×8–12 | 1–3 | 1–2× 20 min Z2 |
| `general` | any | 8–12 | 3×8–12 | 2×12–15 | 2–3 | 150 min/week moderate |

Rules:
- Start every new block at the **bottom** of the set range and add one set per lagging muscle per week until the top of the range or a fatigue flag (§6).
- First week of any block for a new user: RIR 3–4 on all sets to establish loads; no set to failure.
- Each muscle trained ≥ 2×/week when days ≥ 3.
- `lean` differs from `recomp` in exercise selection bias (glute, hamstring, delt, back accessories at higher reps), not in intensity principle. Both are hypertrophy programmes run in a mild deficit or at maintenance (nutrition spec §8).

---

## 4. Teen overrides (13–17) — non-negotiable

| Parameter | Rule |
|---|---|
| Sets × reps | 1–3 sets × 6–15 reps on every exercise; no set below 6 reps |
| Intensity | RIR ≥ 2 on all sets (RPE ≤ 8); no AMRAP, no failure sets, no 1RM or 3RM testing, no estimated 1RM displayed |
| Frequency | 2–3 non-consecutive days/week; joint sessions count |
| Load progression | Master the top of the rep range with clean technique for 2 consecutive sessions before a 5–10% load increase |
| Exercise pool | Machines, dumbbells, cables, bodyweight, light barbell technique work. Excluded: max-effort barbell lifts, Olympic lift derivatives beyond technique with empty bar/dowel, weighted plyometrics, bodybuilding peaking or "shred" blocks |
| Warm-up | 5–10 min dynamic warm-up prescribed every session |
| Supervision | App states the parent/adult buddy supervises technique; cues shown on every exercise |
| Blocks | 4-week blocks, week 4 reduced to 1–2 sets |
| UI | No body-fat, BMI, calories, goal weight or deficit anywhere in the teen profile |

Rationale: NSCA 2009 youth position statement; AAP 2020 clinical report (Stricker et al.); WHO/UK CMO strength on ≥ 3 days/week within 60 min/day activity.

---

## 5. Progression rules

**Adults, double progression (default).**
1. Prescribe a rep range (e.g. 8–10) and a load.
2. If all sets hit the top of the range at target RIR → increase load one step next session.
3. If any set falls below the bottom of the range → hold load; if it happens two sessions running → reduce load 5% and rebuild.
4. Main lifts step 2.5–5%; accessories step one increment.

**Novices, linear phase.** First 8–12 weeks: attempt a load step on main lifts every session while reps stay in range at RIR ≥ 2. Switch to double progression at the first two consecutive misses.

**Advanced.** Wave loading within the block (e.g. 4×8 → 4×6 → 4×5 across weeks 1–3 with load rising) then deload. Optional top set + back-off sets.

**Teens.** Rep-range mastery before load (see §4). No linear load-every-session phase.

**Auto-regulation.** Logged RPE two points above target on the first main lift → engine reduces remaining main-lift loads 5% for that session and marks a fatigue flag.

---

## 6. Deloads and fatigue flags

Deload = 50–60% of the week's sets at the same loads, RIR ≥ 4, or a full week of technique work for teens.

Scheduled: every 4th week (teens, novices), every 5th–6th week (intermediate, advanced).

Triggered early when **two** of the following occur in one week:
- Fatigue flag on two sessions (§5)
- Self-reported recovery ≤ 2/5 on three days
- Sleep < 6 h on three nights
- Garmin HRV status "low"/"unbalanced" or body battery < 25 at session start on two days (when connected)
- Resting HR ≥ 7 bpm above 30-day average for three days
- Missed sessions ≥ 2 in the week

---

## 7. Exercise slots and swap groups

| Slot | Pattern | Commercial gym defaults | Dumbbell-only defaults | Bodyweight defaults | Teen-permitted |
|---|---|---|---|---|---|
| Squat | knee-dominant | Hack squat, leg press, Smith squat, goblet squat, barbell back/front squat | Goblet squat, DB front squat, split squat | Box squat, split squat, step-up | All except max-effort barbell |
| Hinge | hip-dominant | Romanian deadlift, hip thrust, 45° back extension, trap-bar deadlift | DB RDL, DB hip thrust, single-leg RDL | Glute bridge, Nordic curl regression | All except conventional/trap-bar deadlift above RIR 2 |
| Unilateral lower | single-leg | Walking lunge, Bulgarian split squat, leg press single | DB lunge, DB step-up | Reverse lunge, step-up | All |
| H-push | horizontal press | Chest press machine, barbell/DB bench, incline DB press, push-up | DB bench/floor press, push-up | Push-up variants | All; barbell bench with spotter and RIR ≥ 2 |
| V-push | vertical press | Shoulder press machine, DB shoulder press, landmine press | DB shoulder press | Pike push-up | All |
| H-pull | row | Seated row, chest-supported row, single-arm DB row | Single-arm DB row, bent-over row | Inverted row, band row | All |
| V-pull | pull-down/up | Lat pull-down, assisted pull-up, pull-up | Pull-up (if bar), DB pullover | Pull-up, band pull-down | All |
| Hip/ham | isolation | Leg curl, hip abduction, cable kickback | DB leg curl (hamstring on bench), band kickback | Nordic, slider curl | All |
| Quad isolation | isolation | Leg extension, sissy squat | DB-held sissy | Wall sit, sissy | All |
| Delts | isolation | Lateral raise, rear-delt fly, face pull | Lateral raise, rear-delt fly | Band pull-apart | All |
| Arms pair | superset | Cable curl + triceps pushdown, DB curl + overhead extension | DB curl + DB skull-crusher | Chin-up + diamond push-up | All |
| Calves | isolation | Standing/seated calf raise | DB calf raise | Single-leg calf raise | All |
| Core/carry | anti-extension/rotation | Cable crunch, Pallof press, farmer carry | Dead bug, DB carry | Plank, dead bug, side plank | All |
| Finisher | conditioning | Incline walk, bike intervals, rower | Skipping, shadow boxing | Bodyweight circuit | Z2 or short intervals only |

Swap rule: a swap must stay inside the slot and the member's equipment profile, respect injury flags, and keep the rep range. The AI picks the exercise; the engine validates it against this table and the exercise library tags (`slot`, `equipment`, `teenPermitted`, `jointLoad`).

---

## 8. Nutrition bounds the engine enforces (adults only)

| Parameter | Bound |
|---|---|
| Maintenance estimate | Mifflin-St Jeor × activity factor, then corrected weekly from the 7-day weight trend (±100 kcal steps, max ±300/week) |
| `recomp` / `lean` deficit | 10–20% below maintenance; never below 1,500 kcal/day men or 1,200 kcal/day women; never below estimated BMR |
| Rate-of-loss target | 0.5–1.0% body weight/week; if > 1.2% for two weeks, raise calories 150 |
| `gain` surplus | 5–10% above maintenance; rate 0.25–0.5% body weight/week |
| Protein | 1.6–2.2 g/kg body weight (cap at 2.2 g/kg for very high body mass; floor 1.6) |
| Fat | ≥ 0.6 g/kg |
| Carbohydrate | remainder; minimum 2 g/kg on training days |
| Fibre | 14 g per 1,000 kcal |
| Water | EFSA adequate intake baseline (2.5 L men, 2.0 L women total water) + 0.5 L per training hour |
| Teens | No calorie or macro targets. Behaviour goals only: protein source at 3 meals, 5 fruit/veg servings, breakfast, water ≥ 1.6–1.9 L, no energy drinks |

---

## 9. Safety and messaging rules

- Never prescribe a set to failure for anyone in week 1 of a block or for teens ever.
- Never display an estimated 1RM to a teen; adults see e1RM as "estimate".
- Injury flag on a joint removes all exercises tagged high load for that joint and offers the swap group alternative.
- Pain report (not soreness) during a session: stop the slot, substitute or skip, surface the "see a professional if it persists" copy. No medical advice.
- Rapid weight change (> 1.5%/week loss for adults over two weeks, or any loss trend in a `gain` goal) triggers a calorie recheck prompt.
- All copy stays in FDA General Wellness territory: fitness, healthy weight, healthy eating. No disease terms.

---

## 10. Reviewer checklist

- [ ] Volume ranges per goal and training age acceptable
- [ ] Teen overrides complete and conservative enough
- [ ] Progression and auto-regulation rules sensible
- [ ] Deload triggers neither too sensitive nor too lax
- [ ] Slot table covers the founder's gym (machines + dumbbells) and the teen pool
- [ ] Nutrition bounds acceptable for adult recomposition and lean goals
- [ ] Reviewer name, credential, date, signature
