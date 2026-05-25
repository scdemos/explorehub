# Screenshots manifest

Capture a single hero screenshot per top playbook for use as the OpenGraph card image. Filenames match the playbook slug — drop the `.png` into this folder and the chapter's `og:image` resolves automatically.

## Required screenshots (top 5 playbooks)

| File | Source URL (capture this) | Recommended viewport | Notes |
|---|---|---|---|
| `gated-content.png` | `https://main--demo--scdemos.aem.live/learn/premium/intro` | 1280×720 | Capture the locked overlay state; ensure the auth toggle floats in view. |
| `worker-backed-forms.png` | `https://main--demo--scdemos.aem.live/contact-us` | 1280×720 | Form filled with sample data; submit button highlighted. |
| `json2html-dynamic-pages.png` | `https://main--demo--scdemos.aem.live/events/sample-event` | 1280×720 | Detail page rendered from event JSON; show the Mustache-driven layout. |
| `search-and-discovery.png` | `https://main--demo--scdemos.aem.live/search?q=fire` | 1280×720 | Faceted results with at least one filter active and recommendations panel. |
| `experimentation-and-personalization.png` | `https://main--demo--scdemos.aem.live/?audience=mobile` | 1280×720 | Capture both control and variant if possible (split image). |

## Capture procedure

```bash
# Using Playwright (already a dev dep of scdemos/demo)
npx playwright screenshot \
  --viewport-size=1280,720 \
  --full-page \
  https://main--demo--scdemos.aem.live/learn/premium/intro \
  ./gated-content.png
```

Or use Chrome DevTools' `Capture full size screenshot` (Ctrl+Shift+P → type "screenshot").

## Constraints

- **PNG, ≤200 KB after optimization.** Run through `pngquant --quality=70-85`.
- **Square or 16:9.** Twitter / Slack / LinkedIn cards crop differently — center the important content.
- **No personal data.** Forms should use synthetic data only. Search queries should be generic ("fire", "tabs") — no user emails / names.
- **Light mode default.** Capture in default theme; dark-mode screenshots can be added as `*-dark.png` later.

## Wiring into chapters

Once captured, add this line under the existing `og:` meta tags in each playbook's `<head>`:

```html
<meta property="og:image" content="../assets/screenshots/gated-content.png">
<meta name="twitter:image" content="../assets/screenshots/gated-content.png">
```

The card style metadata (`twitter:card`) should also bump from `summary` to `summary_large_image` for chapters that have screenshots.

## When to reshoot

- Major UI redesigns of the demo
- Block changes that affect the captured viewport
- Anytime an existing screenshot looks out-of-date relative to the live demo

A semiannual sweep is usually enough.
