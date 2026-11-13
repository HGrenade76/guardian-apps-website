# Spec update 31 — Teen safeguarding in circles, invites and live sessions

Hein, 13 Nov 2026: "I don't want some kid accidentally getting connected to someone unknown." These rules tighten §4, §8 and §9 of the periodisation spec and the product rules for 13–17. They are not settings, nothing loosens an existing teen rule, and the review panel signs this off like any teen rule change.

**The principle:** a teen is never connected to, visible to, or reachable by anyone their guardian hasn't approved.

## 1. Who can connect to a teen
1. A teen account exists only inside a parent or guardian's household; the guardian sets the birth year and the teen can't change it.
2. **Open links never admit a teen.** If a teen opens any circle or invite link, the app shows "Ask your parent or guardian" and sends the guardian a request naming the circle, its owner and its members. The teen joins only after the guardian taps Approve. No reply = no access.
3. **A circle with a teen in it is closed:** its open link is switched off automatically and can't be turned back on while the teen is a member; new people join only by named invite, and each new adult needs the guardian's approval too.
4. A teen can't create a circle or send invites outside the household.
5. Live sessions with a teen: household members, or approved members of the teen's approved circles, only.

## 2. What others can see of a teen
- Outside the household: first name and initial only, session done or not done, session title and streak. Nothing else.
- Never shown outside the household: routes or locations, training days or times (they reveal where and when), photos, body metrics, calories, PRs with loads, notes.
- Inside the household: as today (teen rules unchanged: no calories, body-fat, goal weight, BMI or estimated 1RM, even to parents).

## 3. Contact
- Teens send and receive reactions (👏) and preset nudges only; no custom text, with anyone outside the household.
- Report and Block on every person and circle. A teen's report or block notifies the guardian (without the reporter's text going anywhere else).

## 4. Guardian controls
- Me › Family › <teen> › Connections: every person and circle the teen is connected to, with Remove. Pending requests with Approve or Decline.
- The guardian gets a notice whenever a new person is connected to the teen.

## 5. Tests (must pass before any build with open circles ships)
- An unknown adult with a circle link cannot add or see a teen.
- A teen who opens a link sees "Ask your parent or guardian"; the guardian gets the request; Approve admits, Decline or no answer doesn't.
- Adding a teen to a circle turns its open link off; Reset link and Share link are unavailable while the teen is a member.
- Outside the household, a teen's routes, times, photos and numbers are never in any record sent to that circle (record-level test, not just the screen).
- A teen can't send custom-text nudges outside the household.
