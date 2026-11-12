# TwoPlates: terms and privacy plan

Recommendation from the design and planning assistant. **Not legal advice.** TwoPlates handles health and fitness data and accounts for teens (13–17), so have a lawyer review the final texts before the App Store launch.

## Earlier draft in the app repo

`twoplates-ios/docs/TWOPLATES-LEGAL-ADDITIONS.md` (October) has plain-language TwoPlates text for the terms and privacy pages, written as sections to add to the existing pages. **Reuse that text as the body of the new TwoPlates pages below.** The difference is only where it lives: separate TwoPlates pages, so the App Store privacy URL describes only TwoPlates. Update it on three points:
- It says Health data "stays on your device and in your iCloud". Change this once the Xcode agent confirms what syncs (App Review Guideline 5.1.3: no personal health information in iCloud).
- It mentions a 14-day full-access period and a "Buddy plan". Keep that in sync with App Store Connect.
- It says no TwoPlates server. The Strava relay is a server; describe it (passes tokens, stores nothing).

## Short answer

**Keep one company-wide Terms and Privacy, and add TwoPlates-specific pages linked from them.** Don't fold TwoPlates into the DECISIO wording, and don't make a fully separate legal set either.

| Page | What it covers | Status |
|---|---|---|
| `terms.html` (existing) | Guardian Apps master terms: liability, IP, subscriptions, governing law (Texas), acceptable use. | Keep. Label the AI/meeting sections "DECISIO.ai" so they read as app-specific. Add a link: "TwoPlates additional terms". |
| `twoplates-terms.html` (new) | Fitness and health disclaimer, assumption of risk, teen accounts in a parent's household, circles and shared content, household subscription. | New |
| `privacy.html` (existing) | Company, website, newsletter and DECISIO.ai. | Keep. Several statements are DECISIO-only ("we don't collect location", "recording runs on your device"); label them DECISIO.ai and link to the TwoPlates policy. |
| `twoplates-privacy.html` (new) | Everything TwoPlates collects: workouts, body metrics, meals, location for runs, Apple Health, WeatherKit, Strava (later Garmin), iCloud/CloudKit sync and sharing, teens. | New. This is the URL for App Store Connect's privacy policy field for TwoPlates. |
| `consumer-health-data.html` (new) | Consumer Health Data Privacy Policy (Washington My Health My Data Act; Nevada and Connecticut have similar rules). Washington requires it as its own policy, linked from the homepage. | New. Link it in the site footer. |

## Why not just add to the existing pages?

- The current policy makes promises that are true for DECISIO but false for TwoPlates (no location; audio stays on device). Mixing both apps in one text makes it wrong for one of them, or hard to read for both.
- Apple asks for a privacy policy that accurately describes **that app's** data. HealthKit apps get extra scrutiny.
- Separate TwoPlates pages can change on their own schedule (each new integration) without touching DECISIO's.

## What the TwoPlates pages must say (checklist for the lawyer and the drafter)

**Terms**
- Not medical advice; check with a doctor before starting, especially with health conditions, injury or pregnancy; stop if you feel pain or dizziness; you train at your own risk.
- Nutrition targets are general guidance, not a diet prescription; support resources for disordered eating.
- Teens 13–17 only through a parent's household; the parent accepts the terms for the teen; under-13 not allowed.
- Circles: what you share with buddies, conduct rules, removing someone, leaving a circle.
- Household subscription, Family Sharing, auto-renew (master terms cover the mechanics).

**Privacy**
- Data categories: profile, goals, workouts, sets and loads, body metrics (adults only), meals and habits, run routes and location (only during a run, with permission), photos if any, device data.
- Where it lives: on the device and in the user's own iCloud (CloudKit, private database). Shared circle data is in CloudKit shared zones, visible to the people you invite.
- Apple Health: what is read and written, only with permission. **HealthKit data is never used for advertising or marketing and never sold.**
- Third parties: Apple (iCloud, HealthKit, WeatherKit), Strava through our relay (what passes through the relay, that it stores nothing, how to disconnect). Add Garmin and others when they ship.
- Teens: what is collected, what the parent can and can't see, no body metrics, no targeted ads, how a parent deletes a teen's data.
- Rights and deletion: delete in-app, data export, contact. Retention.
- No ads, no data sale, no AI training on user data (same commitments as the company page).

## Items to check with the lawyer

1. **Washington MHMDA and similar state laws**: fitness and body data likely counts as "consumer health data"; consent and a separate policy are needed.
2. **Texas**: the Texas Data Privacy and Security Act treats health data as sensitive (consent needed). The SCOPE Act may apply because teens can share in circles. Check the current status of the Texas App Store Accountability Act and whether to use Apple's Declared Age Range API.
3. **COPPA**: stays out of scope only if under-13s are blocked; confirm the age gate.
4. **Strava API agreement and brand rules**: the privacy policy must disclose Strava data use; show "Connect with Strava" and "Powered by Strava" per their guidelines.
5. **WeatherKit**: the app must show Apple Weather attribution and a link to the data sources wherever weather appears.

## One technical check for the Xcode agent (App Review risk)

Apple's App Review Guideline 5.1.3 says apps may not store users' personal health information in iCloud. TwoPlates syncs its own logs via CloudKit. Ask the agent to confirm that **nothing read from HealthKit** (heart rate, weight, body fat, workouts from other apps) is copied into CloudKit, only data the user entered in TwoPlates. If something is, it must stay on the device or be re-read from HealthKit on each device.

## Timing

- **Coming-soon page:** no new legal pages needed. The waitlist uses the existing newsletter consent in `privacy.html`.
- **Before external TestFlight or the App Store:** `twoplates-privacy.html` must be live (App Store Connect requires the URL), along with `twoplates-terms.html` and `consumer-health-data.html`.
- The site footer shows `support@guardian-apps.com` while the domain is gap-apps.com. Confirm that mailbox works, or switch it to a gap-apps.com address on all legal pages.
