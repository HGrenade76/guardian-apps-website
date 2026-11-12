# TwoPlates coming-soon: handoff for the website agent

Design and copy for adding TwoPlates to gap-apps.com as a coming-soon product. Built from the live site (`main`, identical to gap-apps.com on 12 Nov 2026), using its tokens, fonts, nav and footer.

## Files

| Path | What |
|---|---|
| `prototype/twoplates.html` | The full coming-soon page, ready to adapt. Same tokens and structure as `index.html`. Responsive (mobile under 900px). |
| `prototype/index-two-apps.html` | The homepage hero and "Our apps" two-card block. |
| `prototype/assets/twoplates/` | `tp-icon-512.webp` (app icon), `tp-og.png` (1200×630 share image), eight app screens (`tp-screen-*.webp`), including `tp-screen-meals.webp` and `tp-screen-groceries.webp`, and `tp-screen-exercise.webp` and `tp-screen-library.webp` with the real MoveKit exercise illustrations. |
| `mockups/twoplates-coming-soon-overview.png` | First screen, desktop and phone. |
| `mockups/twoplates-coming-soon-desktop.png`, `-mobile.png` | Full page renders. |
| `mockups/homepage-two-apps.png` | Homepage change (new headline). |
| `mockups/twoplates-meals.png` | The "Eat without the fuss" section (meal plan and groceries). |
| `mockups/twoplates-see-every-move.png` | The "See every move" section with real exercise illustrations. |
| `NARRATIVE.md` | Positioning, what we may and may not claim, headlines, launch posts. |
| `LEGAL-PLAN.md` | Terms and privacy plan (no legal page changes needed for the coming-soon page itself). |

## Tasks

1. **Add `twoplates.html`** at the site root from the prototype. Copy `prototype/assets/twoplates/` to `/assets/twoplates/`. Keep the canonical, Open Graph and Twitter tags.
2. **Waitlist:** both forms post to the existing Buttondown list (`MyGuardianApps`) with a hidden `tag=twoplates-waitlist`. Check that Buttondown applies the tag from the embed form (create the tag in Buttondown first if needed). Reuse the success-message script from `index.html` (`newsletterSuccess`) so people see "Thanks! Check your inbox to confirm."
3. **Nav on every page:** add "TwoPlates" with the small "Soon" badge. On `twoplates.html` the gold button says "Join the waitlist" and jumps to the form; elsewhere it stays as it is.
4. **Footer on every page:** add a "TwoPlates" link.
5. **Homepage:** new hero (decided by Hein): eyebrow "Guardian.Apps · iPhone & iPad", headline **"Apps built for real people."** with **"Private by default."** in the gold serif italic on the second line, and the new paragraph from `index-two-apps.html`. Remove "AI that solves real problems. Not new ones." everywhere it appears (hero, page title, meta description, Open Graph). New page title: "Guardian.Apps: iPhone apps built for real people". Add the "Our apps" block. Leave DECISIO's sections as they are. Change the philosophy bullet "Your audio and voice never leave your device" to "Your data stays yours: audio, workouts and body data stay on your device or in your own iCloud." 
6. **sitemap.xml:** add `https://gap-apps.com/twoplates.html`.
7. **Accessibility:** keep the alt texts; contrast as on the rest of the site; FAQ uses `<details>` (keyboard friendly).

## Before it goes live (Hein)

- **Founder note:** the "Why this exists" section has a short quote in quotation marks with Hein's name under it. The designer wrote those words. Publish only once Hein has approved or reworded them (see NARRATIVE §7).
- **Screens are design previews.** The page says "Design preview. The final app may differ." Swap in real iPhone captures once TestFlight build 2 looks right (same file names, 780×1688).
- Only claim what's built (see NARRATIVE §4). No pricing, no launch date, no Garmin, Strava or Watch promises, no machine brand names (for example Hammer Strength) in screenshots.
- **Exercise illustrations: cleared.** MoveKit License Agreement v1.0 (effective 4 Aug 2026; Hein's purchase 10 Oct 2026 falls under it), §2 allows use "in mobile and web applications" and "embedding in … videos, social media, and advertising". Rules to keep: show them only inside app screenshots or app screen recordings; never link or host the raw MoveKit clip or poster files (§3: no raw file URLs or downloads); never run them through AI tools to restyle or generate new art (§5).
- **Screens:** keep the design previews for now; replace them with real iPhone captures once TestFlight build 2 fixes are in (same file names, 780×1688).
