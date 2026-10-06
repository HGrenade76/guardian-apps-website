# Garmin Integration Guide — fenix 8 + Index S2

**Date:** 6 October 2026. **Status of the Garmin Connect Developer Program: paused for new applicants** (since spring 2026, no reopening date announced as of September 2026). This guide records what we can do today, and the exact application steps to run the day the programme reopens.

---

## 1. What Garmin data reaches us today, without any Garmin approval

Garmin Connect (the phone app) writes to Apple Health when the user enables it in Garmin Connect → Settings → Connected Apps → Apple Health:

| Data | Reaches Apple Health | Notes |
|---|---|---|
| Workouts (activities), active and resting energy | Yes | fenix 8 strength activities arrive as workouts with HR and calories; set/rep detail does **not** come through |
| Steps, distance, flights | Yes | |
| Heart rate (continuous), sleep analysis | Yes | |
| Weight | Yes | from Index S2 via Garmin Connect |
| Body fat %, BMI | Yes, intermittently | users have reported body-fat sync dropping out for months at a time; treat as unreliable and allow manual entry |
| Body water %, skeletal muscle mass, bone mass | **No** | Index S2 measures them, Garmin Connect shows them, Apple Health has no matching types Garmin writes to. Manual entry or photo-of-readout in v1 |
| HRV status, body battery, stress, training readiness | **No** | Not exported to Apple Health |

**Decision for v1:** Apple Health is the Garmin bridge. The app is the system of record for lifting (sets, reps, load). Garmin is the cardio, sleep and daily-activity source. Body water and muscle mass from the Index S2 are entered by hand (two taps from the Garmin Connect readout) until an API route exists.

---

## 2. Route for recovery signals while the programme is paused: Connect IQ

Connect IQ (Garmin's on-watch app platform) is **not** paused. A small Connect IQ app or data field on the fenix 8 can read recent body battery, stress and heart-rate history through the watch SDK's sensor-history APIs and hand them to our iPhone app through the Connect IQ Mobile SDK for iOS. This gives the periodisation engine its deload triggers (spec §6) without server-side Garmin access.

Steps:
1. Create a Garmin developer account at developer.garmin.com (free) and download the Connect IQ SDK.
2. Build a minimal Connect IQ "widget" or "device app" for fenix 8 that reads body battery and stress history and exposes them over the phone link.
3. Integrate the Connect IQ Mobile SDK (iOS) into the app; pair, request the data on app open, store locally.
4. Publish the Connect IQ app to the Connect IQ Store (review is typically days).

Confirm the exact sensor-history calls and permissions in the current SDK documentation before Phase 0 estimates. HRV status is not guaranteed to be readable from Connect IQ; body battery and stress are the dependable pair.

---

## 3. Fallback if we need server-side Garmin data before the programme reopens

Wearable aggregators already hold Garmin Health API partner access and resell it: Terra, Rook, Sahha, Fitrockr, Open Wearables. Typical model is a monthly platform fee plus per-connected-user pricing. Trade-offs: cost, a third party in the data path (conflicts with our "Guardian Apps holds no copy" promise unless the vendor acts strictly as a pass-through under contract), and vendor lock-in. Use only if Connect IQ cannot deliver the recovery signals.

---

## 4. How to apply for the Garmin Connect Developer Program (when it reopens)

Eligibility and shape of the programme as last published:
- Applicant must be a **legal entity** (company, university, hospital, research institution). Guardian Apps LLC qualifies. Personal-use applications are rejected.
- The programme bundles the Health API (daily summaries, sleep, stress, body battery, HRV, body composition, respiration), Activity API (activity summaries and details, FIT files), Training API (push structured workouts to the watch) and Courses API.
- Approval is per application, historically days to weeks. Some tiers have carried a one-time administrative fee (reported at USD 5,000 for production Health API access) or minimum device commitments. Verify current terms on the application page.
- Garmin Connect Developer Program Agreement governs data use: user consent per data type, no resale, deletion on user request, security requirements.

Step-by-step, to run on the day the form returns at developer.garmin.com/gc-developer-program:

1. **Prepare the company facts.** Legal name (Guardian Apps LLC), state of formation, address, website (guardian-apps.com), primary contact, technical contact, Apple Developer Team ID.
2. **Prepare the product description** (one page). Name: TwoPlates. Category: consumer health and fitness. Platform: iOS. User base: households of two to six people training together. Purpose of Garmin data: display and trend the user's own activity, sleep, recovery and body-composition data inside their programme; drive deload and load adjustments. State clearly that data stays on the user's device and iCloud, Guardian Apps runs no analytics on health data, and nothing is shared with third parties.
3. **List the APIs and data types requested**, narrowly: Health API (dailies, sleep, stress, body battery, HRV, body composition), Activity API (summaries and details for strength and cardio). Do not request Training API in the first application unless we plan to push workouts to the watch in v1.
4. **Attach the privacy policy** (guardian-apps.com/privacy, extended with a Garmin data section: what we collect, why, retention, deletion, no sale, contact).
5. **Describe security**: on-device storage, CloudKit encryption, OAuth tokens stored in Keychain, no server-side health store, incident contact.
6. **Describe the user consent flow**: in-app explanation per data type, OAuth to Garmin Connect, user can disconnect and purge Garmin data in Settings.
7. **Submit**, note the ticket or reference number, and expect follow-up questions on data use. Answer within a day; slow responses go to the back of the queue.
8. **On approval**: receive consumer key and secret, set up the OAuth flow and the webhook (push) endpoints Garmin requires for daily summaries, pass Garmin's integration verification, then switch body-composition input from manual to API and add HRV status to the deload triggers.

Keep a dated copy of the submitted answers in `docs/` for the privacy policy and App Store review.

---

## 5. Open items
- Confirm whether Garmin Connect currently syncs body-fat % to Apple Health on the founder's phone (test in Phase 0, week 1).
- Verify Connect IQ sensor-history availability for body battery and stress on fenix 8 against the current SDK.
- Watch developer.garmin.com for the programme reopening; the5krunner and Sahha blogs have tracked status.
