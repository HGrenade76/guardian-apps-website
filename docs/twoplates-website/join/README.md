# TwoPlates invite links on gap-apps.com

Invite links look like `https://gap-apps.com/twoplates/join?s=<iCloud share URL, URL-encoded>`.
- If TwoPlates is installed, iOS opens the app directly (universal link) and the app accepts the invite from `s`.
- If not, this page explains how to install, and its button opens the iCloud share link (only `https://www.icloud.com/share/...` is accepted, so the page can't be misused as a redirect).

## Files to publish
| From | To on the site | Notes |
|---|---|---|
| `well-known/apple-app-site-association` | `/.well-known/apple-app-site-association` | No file extension, no redirect, served over HTTPS. Team KFK8WZ5447, bundle com.guardianapps.twoplates. |
| `twoplates-join/index.html` | `/twoplates/join/index.html` | Not in the sitemap; `noindex`. Uses `/assets/twoplates/tp-icon-512.webp` from the coming-soon work. |

## GitHub Pages notes
- Jekyll skips folders starting with a dot. Add an empty `.nojekyll` file at the site root (or `include: [".well-known"]` in `_config.yml`) so `/.well-known/` is published.
- Check after publishing:
  - `https://gap-apps.com/.well-known/apple-app-site-association` returns the JSON (status 200, no redirect).
  - Apple's copy: `https://app-site-association.cdn-apple.com/a/v1/gap-apps.com` shows the same JSON. It can take up to a day to refresh.
  - `https://gap-apps.com/twoplates/join` shows the invite page.
