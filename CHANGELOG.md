# FLUX Theme — Changelog

All notable changes to this project are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.0.0] — 2025

### 🎉 Initial Release

The first public release of FLUX Theme — a modern co-working space theme for Frappe 15 / Frappe 15.

### Added

#### Core Theme
- **modern color system** with 9 core tokens (Gold, Navy, Cream + variants) and 4 semantic colors
- **CSS custom properties** (`--flux-*`) for runtime theming
- **4 SCSS mixins**: `flux-glass`, `flux-card-elevated`, `flux-gold-glow`, `flux-focus-ring`
- **Rubik + Poppins** font system (Google Fonts)
- **Time-aware theme** — automatic `flux-day`/`flux-night` body classes (6am–6pm boundary)

#### Visual Features
- **Animated modern city skyline** — Runtime SVG with Burj Khalifa, Burj Al Arab, Dubai Frame, Cayan Tower, and 15+ buildings
- **Water reflections** with animated `<animateTransform>` SVG elements
- **Twinkling window lights** on building silhouettes
- **Canvas effects** — Stars (80/50/25 by viewport), shooting stars (~5–8/min), floating particles
- **Branded splash screen** — One-time per session with logo animation sequence (2.8s display)
- **Branded loading indicator** — Gold spinning ring overlay replacing Frappe's `#freeze`

#### UI Components
- **Glassmorphism navbar** — `rgba(17,24,39,0.8)` + `backdrop-filter: blur(20px)`
- **Custom search overlay** — Replaces inline awesomebar with glassmorphism panel (Ctrl+G)
- **Dark sidebar** — Gradient from navy-deep to navy-light with gold hover accents
- **Glassmorphism page-head** — `.82` opacity with subtle border
- **Styled notifications** — Bell swing animation for unseen notifications
- **Login page** — Skyline background, floating gold particles, glassmorphism card

#### SCSS Styling (12 partials)
- Typography, buttons, forms, layout, tables, cards, modals, login, splash, print, animations, variables

#### Accessibility
- Skip-to-content link
- ARIA `role="main"` landmark
- Gold focus rings on interactive elements
- `prefers-reduced-motion: reduce` disables ALL animations and transitions

#### Developer Experience
- **Dynamic favicons** — 5 sizes (16/32/48/ico/192) set programmatically
- **Title observer** — Appends "| FLUX" to page title via MutationObserver
- **Theme color meta tag** — Sets `<meta name="theme-color">` to navy
- **Boot session data** — `frappe.boot.flux_theme` with version, brand, logos
- **Konami code** easter egg — Logs "Built by Arkan Labs" to console

#### Print
- Clean print stylesheet with branded header
- Hidden navbar, sidebar, and UI chrome
- Readable typography with proper page breaks

### Fixed
- **Loading overlay persistence** — Resolved through 7 iterations:
  - Discovered `frappe.request.on()` doesn't exist in Frappe 15 (silent failure)
  - Discovered jQuery `ajaxSend/ajaxComplete` fire for heartbeat/polling (never disappears)
  - Final solution: CSS `#freeze { display: none !important }` + periodic cleanup of stuck `#freeze` elements + 3s safety timer

### Technical Notes
- **Zero core modifications** — No Frappe or ERPNext files modified
- **ES5 compatible** — All JavaScript uses IIFE pattern for broad compatibility
- **7,676 total lines** of source code across 22 files
- **SCSS compilation** required: `npx sass scss/flux.scss css/flux.css`

---

## [Unreleased]

### Planned
- Dark mode toggle (see ROADMAP.md)
- RTL comprehensive audit
- Theme customization DocType

---

*Maintained by Arkan Labs — info@arkanlabs.com*
