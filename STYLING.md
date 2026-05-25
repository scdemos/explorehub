# Explore Hub styling (helix-website alignment)

Explore Hub uses the same global design system as [helix-website](https://www.aem.live): **grayscale chrome** (Spectrum gray scale, Consonant type scale, `light-dark()` theming). Blue appears only on **link hover** and **primary buttons** (like aem.live), not on nav, chips, or cards. **Code blocks** use `--code-bg-color` with theme-aware Prism tokens in `prism-tomorrow.css`.

## Source of truth

| File | Role |
|------|------|
| `styles/helix-tokens.css` | Spectrum colors, spacing, typography tokens (`--type-*`, `--spacing-*`) |
| `styles/fonts.css` | Adobe Clean / Source Code Pro `@font-face` + Trebuchet fallback |
| `styles/styles.css` | Playbook layout, sidebar, cards, hub UI (consumes tokens) |
| `scripts/theme.js` | Theme toggle: system → light → dark → system (`aem-theme-preference`) |

## Legacy variable aliases

Cookbook HTML examples may still reference heritage names (`--color-rust`, `--color-gold`, `--border-heritage`). These are mapped to Helix tokens in `styles.css` `:root` so examples stay valid while the UI matches aem.live.

## Fonts

Copy WOFF2 files from `helix-website/fonts/` into `explorehub/fonts/` (see `fonts/README.md`). Without them, Trebuchet MS and Google Source Code Pro are used.

## Theme toggle

- Sidebar button (next to **Explore Hub** home link)
- Persists preference in `localStorage` key `aem-theme-preference` (same as helix-website)
- Sets `data-theme` on `<html>` for manual light/dark override
- Every page loads `scripts/theme-bootstrap.js` in `<head>` (no flash); `scripts/theme.js` loads with navigation for the toggle UI

## Prose vs component links

Body links inside `main` prose containers (`p`, `li`, `dd`, etc.) are underlined gray with blue hover. Component links (`.btn`, `.pattern-btn`, `.permalink-card-header a`, nav, cards) use their own styles and are excluded from global `main a:any-link` rules.
