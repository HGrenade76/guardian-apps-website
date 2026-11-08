# SPEC UPDATE 26 — Accent colour themes (user's choice)

Picture: `mockups/28-appearance-compare.png` (Graphite, Gold, Ocean, Teal, Coral, Plum) and `html/28-appearance-*.html`. Palette rule B unchanged: the accent is an edge and text colour for selected states, and a fill only on the one primary action per screen.

## 1. Themes
| Theme | Fill top | Fill | Fill bottom | Accent text (Light) | Label on fill | Dark-mode accent text |
|---|---|---|---|---|---|---|
| Gold | #FFD36A | #F2B232 | #D4931A | #8F6100 | #1E1714 | #FFD98A |
| Graphite | #5A5D66 | #2F3238 | #1B1D21 | #2F3238 | #FFFFFF | #E6E7EA (in Dark the fill becomes Silver #D9DBE0 with #121216 label) |
| Ocean | #7FB2E5 | #3B7CC4 | #2A62A3 | #245B97 | #FFFFFF | #9CC6F0 |
| Teal | #5FD3C4 | #1FA896 | #14857A | #0F6F66 | #FFFFFF | #7FE0D3 |
| Coral | #FF9A7E | #F0674A | #D14F33 | #B5412A | #FFFFFF | #FFB4A1 |
| Plum | #B391E8 | #7D55C7 | #6340A8 | #5E3AA3 | #FFFFFF | #C9AEF2 |
- Each theme is one set of named tokens in Glass.swift (accentFillTop, accentFill, accentFillBottom, accentText, onAccent, accentTextDark). Every screen already reads tokens; no screen code changes per theme.
- Contrast test per theme and mode: accent text on page and on glass ≥ 4.5:1; label on fill ≥ 4.5:1. Any theme that fails is adjusted, not shipped.
- Fixed colours never change with the theme: done green, warning salmon, heart-rate red, zone colours, the muscle highlights in figures, chart series that mean something.

## 2. Where the user picks it
- Me › Appearance: Accent colour (six swatches in a 3 × 2 grid, the chosen one outlined), Mode (Light / Dark), a live Preview card (chips, a tile icon, a progress bar, the primary button), and App icon.
- Onboarding does not ask; default theme is set below. The choice syncs with the user's other devices (iCloud key-value) and is per person, not per household.
- **Default:** Gold, unless Hein picks another default.

## 3. App icon follows the theme
The bumper-plate icon (Update 23) gets one alternate icon per theme: the hub disc in the theme's fill (Graphite uses brushed steel). Switching the theme offers "Change the app icon too?" (iOS shows its own confirmation). Live Activity and widget accents follow the theme.

## 4. Tests and process
Core tests: every theme defines every token; contrast per theme and mode. UI test: switching theme recolours Home, the set screen and onboarding chips without relaunch. Capture Home, Train, the set screen and Appearance in two themes (Graphite and Ocean), Light and Dark. Build with or after Update 22 round 1 (palette rule B), before the release clean-up.
