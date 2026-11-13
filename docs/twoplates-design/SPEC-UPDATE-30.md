# Spec update 30 — Calm pages (fewer boxes, cleaner, modern)

Tester feedback (13 Nov): "too many button-looking cards", pages feel overwhelming and old; Buddies is bland; Dinner has too many big boxes. The stats tiles are liked.
Mockups: `mockups/32-calm-home.png`, `32-calm-buddies.png`, `32-calm-meals.png` (side by side: `32-calm-compare.png`).

## 1. The rules (app-wide)
1. **Content sits on the page, not in boxes.** Type size, weight and spacing separate sections, not containers.
2. **Boxes only for three things:** the one hero per screen, data tiles in a grid (like My stats and Home "This week"), and media (photos, clips). Nothing else gets a card.
3. **Lists are plain rows** on the page background: avatar or icon, title, one grey line, chevron or tick; hairline dividers (1 px, 8 % ink); no shadow, no glass, no per-row card.
4. **One filled button per screen** (ink #1C1D21, white text). Secondary actions are text links ("+ Add", "Resend", "See all") in ink or gold text, or toolbar icons. Never a card that is really a button.
5. **Section titles** 20 pt bold, 26 pt above, 6 pt below. Large page title 34 pt.
6. **One photo per page at most**, used full-bleed at the top (Meals) or inside the hero; tiles never carry photos.
7. **Choices that switch views** (Today / Week / Groceries) are a text tab row with an underline, not a boxed segmented control.
8. **Tab bar:** soft pill behind the selected tab, filled symbol, no outline (as in build 3 notes).
9. Teen rules unchanged.

## 2. Home (32-calm-home)
- Hero card: today's session with the illustration, "With Lenaigh" when a buddy is set, filled "Start Pull day".
- Quick start · Pick a day · Surprise me become one line of text links with icons under the hero (no cards). Done-today state from Spec 29 keeps "Train again?" as this same link row with a heading.
- "This week": four white data tiles (Training 1 of 3 with bar, Habits 0 of 5 with bar, Tonight's dinner, Buddies latest). No photos on tiles. Tiles open their page.
- Sync line under the grid.

## 3. Buddies (32-calm-buddies)
- Hero without a box: you and your buddy side by side, each in a weekly ring (sessions done of planned), "2 together this month" between them. Filled "Train with Lenaigh".
- Activity: plain rows: who did what, key numbers, time; a 👏 reaction on the right (tap to send, count shown). Pending invites appear here ("Your wife was invited · Not joined yet · Resend").
- People: plain rows (relationship, training days, status); "+ Add" text link in the section title.
- Circles: plain rows below People.
- More than one buddy: the duo hero shows the buddy picked for today (remembered per weekday), swipe for the others.

## 4. Meals (32-calm-meals)
- Full-bleed photo header of tonight's dinner (Moments "dinner" photo until per-dish photos exist), with name, time, and portion chips per person (teen: "plate", no numbers). Filled "Start cooking".
- Text tabs: Today · Week · Groceries · 21.
- Today: plain rows: meal time on the left, dish and one grey line, a tick to mark eaten or cooked. Adults may show kcal in the grey line if they have targets.
- Water: one row: amount, thin bar, "+ 8 oz" pill.
- Log a meal or food: toolbar "+" button, not a card.

## 5. Everywhere else
Apply the rules to every tab and sheet. Keep data tiles where the content is numbers in a grid (My stats, Your week). Report each screen changed with before and after captures.
