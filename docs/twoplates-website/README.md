# TwoPlates coming-soon: handoff for the website agent

Design and copy for adding TwoPlates to gap-apps.com as a coming-soon product. Built from the live site (`main`, identical to gap-apps.com on 12 Nov 2026), using its tokens, fonts, nav and footer.

## Files

| Path | What |
|---|---|
| `prototype/twoplates.html` | The full coming-soon page, ready to adapt. Same tokens and structure as `index.html`. Responsive (mobile under 900px). |
| `prototype/index-two-apps.html` | The homepage hero and "Our apps" two-card block. |
| `prototype/assets/twoplates/` | `tp-icon-512.webp` (app icon), `tp-og.png` (1200×630 share image), four app screens (`tp-screen-*.webp`). |
| `mockups/twoplates-coming-soon-overview.png` | First screen, desktop and phone. |
| `mockups/twoplates-coming-soon-desktop.png`, `-mobile.png` | Full page renders. |
| `mockups/homepage-two-apps.png` | Homepage change. |
| `NARRATIVE.md` | Positioning, what we may and may not claim, headlines, launch posts. |
| `LEGAL-PLAN.md` | Terms and privacy plan (no legal page changes needed for the coming-soon page itself). |

## Tasks

1. **Add `twoplates.html`** at the site root from the prototype. Copy `prototype/assets/twoplates/` to `/assets/twoplates/`. Keep the canonical, Open Graph and Twitter tags.
2. **Waitlist:** both forms post to the existing Buttondown list (`MyGuardianApps`) with a hidden `tag=twoplates-waitlist`. Check that Buttondown applies the tag from the embed form (create the tag in Buttondown first if needed). Reuse the success-message script from `index.html` (`newsletterSuccess`) so people see "Thanks! Check your inbox to confirm."
3. **Nav on every page:** add "TwoPlates" with the small "Soon" badge. On `twoplates.html` the gold button says "Join the waitlist" and jumps to the form; elsewhere it stays as it is.
4. **Footer on every page:** add a "TwoPlates" link.
5. **Homepage:** replace "We build one thing…" with the two-app copy and add the "Our apps" block from `index-two-apps.html`. Leave DECISIO's sections as they are. Change the philosophy bullet "Your audio and voice never leave your device" to "Your data stays yours: audio, workouts and body data stay on your device or in your own iCloud." Hero line: **ask Hein** whether to keep "AI that solves real problems" or change it to "Apps that solve real problems".
6. **sitemap.xml:** add `https://gap-apps.com/twoplates.html`.
7. **Accessibility:** keep the alt texts; contrast as on the rest of the site; FAQ uses `<details>` (keyboard friendly).

## Before it goes live (Hein)

- **Founder note:** the quote and paragraph signed by Hein are placeholder wording; Hein writes or approves them.
- **Screens are design previews.** The page says "Design preview. The final app may differ." Swap in real iPhone captures once TestFlight build 2 looks right (same file names, 780×1688).
- Only claim what's built (see NARRATIVE §4). No pricing, no launch date, no Garmin, Strava or Watch promises, no machine brand names (for example Hammer Strength) in screenshots.
- Exercise illustrations from the app aren't used on the site. Before using them, confirm their licence allows marketing use.
