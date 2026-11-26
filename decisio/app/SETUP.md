# DECISIO on the web: setup

Lives at gap-apps.com/decisio/app/. It reads each person's own private iCloud database (container `iCloud.com.decisio.app`) in their browser with CloudKit JS. Nothing goes through a Guardian Apps server.

## Before it goes live

1. **API token.** In the CloudKit Console, open `iCloud.com.decisio.app`, choose Production, then Tokens & Keys and create a new API token:
   - Name: `decisio-web`
   - Sign in callback: **postMessage**
   - Allowed origins: `https://gap-apps.com`

   Paste the token into `config.js` as `apiToken`.
2. **Schema.** Check that the development schema has been deployed to Production (Schema → Deploy Schema Changes). The site reads `CD_SessionModel`, `CD_ActionModel`, `CD_DecisionModel` and `CD_RiskModel`. These are already in Production if the App Store build syncs, but redeploy if you've added fields since.
3. **Test** with your own Apple ID at gap-apps.com/decisio/app/. To check the walkthrough, turn off "Access iCloud Data on the Web" on your iPhone, sign in, and confirm the help card opens.
4. **Link it.** Add a "DECISIO on the web" link to decisio.html once you're happy with it.

## What it does

- **Today:** open, overdue and due-this-week counts, items that need attention, recent meetings and latest decisions
- **Actions:** filters, search, owner filter and CSV export. Users can mark an action done, or change its status, priority or due date, and the change syncs back to the phone. Changing a due date sets `originalDueDate` and increments `rescheduleCount`, the same way the app does.
- **Meetings:** summary, decisions, actions, risks, open questions and transcript (focused or full), with find-in-transcript
- **Decisions:** log filtered by status
- **Demo:** sample data at `?demo`

## Known limits

- **Recordings.** Audio files sit in iCloud Drive, which the web can't reach. Supporting playback means the app also has to upload a compressed copy of each recording as a CloudKit asset.
- **Stale phone edits.** `DataManager.updateSession` writes every action field back from the in-memory session. If the phone saves a session before it has pulled a web edit, the web change gets overwritten. The app does reload on remote change, so this is rare. Fix in the next app build: refetch the session before saving.
- **Clearing a due date.** This sends a null TIMESTAMP. Check it once against real data.
- **Pro gating.** There isn't any yet. If web access should be Pro-only, copy MileGuard's `WebAccess` record approach.
