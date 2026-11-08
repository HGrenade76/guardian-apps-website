# SPEC UPDATE 23 — New icon and splash: the bumper plate (Hein chose option 1)

Files: `brand/icon-sheet.png` (all variants and the splash), `brand/icon-master.svg` (with rim text), `brand/icon-small.svg` (no rim text, the home-screen icon), `brand/icon-light.svg`, `brand/icon-tint.svg`, and a 1024 px PNG of each. Picture wins.

## 1. The mark
A black rubber competition bumper plate seen face-on: steel rim, inner groove rings, a polished steel collar holding a gold hub with a bold "2". On large sizes the rim carries "TWOPLATES" (gold, top) and "STRONGER TOGETHER" (grey, bottom). Rim text appears only where the icon is shown at 120 pt or larger (App Store, splash, onboarding, About); everywhere smaller uses the no-text version.

## 2. App icon
- iOS app icon = `icon-small` (no rim text). Build the layered iOS 26 icon in Xcode's Icon Composer from the SVG layers: background (dark radial), plate (rubber, rim, rings), hub (steel collar, gold disc), "2". Provide the Default (dark), Dark and Tinted appearances; `icon-light` is the light appearance, `icon-tint` the tinted.
- App Store marketing icon 1024 px from `icon-master` without the rounded corners (Apple applies them) and with no transparency.
- Watch app icon: the hub and "2" only, gold on black, circular.
- Replace every use of the old "2" mark (Live Activity mark in the island and lock screen, notifications, widgets, About) with the hub-and-2 glyph in gold.

## 3. Splash and launch
- Launch screen (static, as Apple requires): the dark radial background only, no logo, so there is no flash.
- Intro (the app's first view, under 1.2 s, skipped on relaunch within 10 minutes and when Reduce Motion is on): the master plate fades and scales in from 90 % with one slow quarter turn, "TwoPlates" in white below and "STRONGER TOGETHER" in gold small caps. Then crossfade to Home. Never shown during UI tests.

## 4. Process
Part of the release clean-up round, before TestFlight. Capture the home screen with the new icon (Light and Dark wallpaper), the Tinted icon, the splash, and the island mark on the iPhone. Show Hein, STOP.
