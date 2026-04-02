# 🗺️ FLUX Theme — Roadmap & Feature Proposals

> All original 25 roadmap features are ✅ **COMPLETED**. This file now tracks
> new proposals discovered during development. Completed items remain in the
> [✅ Completed](#-completed-features) section below.

---

## 🆕 New Proposals (Discovered During Development)

> These ideas emerged during the development process and chat sessions.
> They are organized by priority and ready for implementation.

### 🔴 High Priority

#### P1. Theme Selector in Site Settings
**Description:** Currently `site_config.json` has `"theme": "tavira_theme"`. Need a way to switch between tavira_theme and flux_theme from the UI, or auto-detect based on the arkspace/fluxcoworking site being used.
**Status:** 📋 Proposed
**Discovered:** During session debugging when site_config still pointed to tavira_theme

#### P2. Flux-Specific Workspace Widgets
**Description:** Create custom workspace widgets specifically for co-working space management — occupancy display, meeting room availability, member check-in/out status.
**Status:** 📋 Proposed
**Discovered:** Natural evolution of the flux_workspace.js module

#### P3. WhatsApp/Telegram Theme Integration
**Description:** Apply FLUX styling to the arrowz omni-channel chat panels and contact sessions to maintain brand consistency.
**Status:** 📋 Proposed
**Discovered:** Arrowz app is in the same bench and shares the same UI

### 🟠 Medium Priority

#### P4. Custom Notification Sounds for Co-Working
**Description:** Replace generic notification sounds with co-working-specific ones — coffee machine, door chime, meeting start bell.
**Status:** 📋 Proposed
**Discovered:** flux_sounds.js and flux_ambient.js already have the Web Audio infrastructure

#### P5. Member Dashboard Page
**Description:** A branded `/desk/flux-dashboard` page showing member stats, space utilization, booking calendar, and announcements — all styled with FLUX theme.
**Status:** 📋 Proposed
**Discovered:** Natural companion to the arkspace co-working app

#### P6. Booking System Theme Integration
**Description:** Style the meeting room and desk booking interfaces (if arkspace has them) with FLUX branding — calendar views, time slots, availability indicators.
**Status:** 📋 Proposed

#### P7. Multi-Tenancy Theme Switching
**Description:** Support different theme variations per tenant/site in a multi-site Frappe setup. Each co-working location could have slightly different colors.
**Status:** 📋 Proposed

### 🟢 Low Priority

#### P8. Theme Analytics Dashboard
**Description:** Track which features are most used (dark mode, presets, ambient sounds) to guide future development priorities.
**Status:** 📋 Proposed

#### P9. Custom Report Templates
**Description:** Branded report templates for co-working space metrics — occupancy reports, revenue per desk, member engagement.
**Status:** 📋 Proposed

#### P10. Slack/Discord Integration Theme
**Description:** Match FLUX theme colors in Slack/Discord webhook messages sent from the system.
**Status:** 📋 Proposed

#### P11. PDF Export Branding
**Description:** Apply FLUX branding to all PDF exports (invoices, reports, contracts) with consistent headers, footers, and color scheme.
**Status:** 📋 Proposed

#### P12. Custom Onboarding Flow for New Members
**Description:** Extended onboarding beyond the 6-step tour — a multi-page wizard for new co-working space members to set up their profile, preferences, and workspace.
**Status:** 📋 Proposed

---

## 🔴 Critical Priority (ORIGINAL — ALL COMPLETED)

### 1. Dark Mode Toggle
**Description:** Add a user-toggleable dark mode that deepens the navy palette and adjusts cream backgrounds to darker surfaces. Should persist via `localStorage` and respect `prefers-color-scheme: dark`.

**Implementation:**
- Add toggle button in navbar (moon/sun icon)
- Define `[data-theme="dark"]` CSS custom property overrides in `_variables.scss`
- Store preference in `localStorage('flux-theme-mode')`
- Add `flux_darkmode.js` module

**Impact:** High — many users work in low-light environments

---

### 2. RTL Full Audit & Fixes
**Description:** While basic RTL support exists, a comprehensive audit is needed to ensure all components render correctly in Arabic and Hebrew interfaces.

**Implementation:**
- Add `_rtl.scss` partial with `[dir="rtl"]` overrides
- Test all components: navbar, sidebar, forms, tables, modals, search overlay
- Fix any mirroring issues with the skyline (should remain LTR)
- Test with `lang="ar"` site setting

**Impact:** High — essential for Arabic-speaking users

---

## 🟠 High Priority

### 3. Theme Customization Panel (DocType)
**Description:** Create a simple Single DocType "FLUX Settings" that allows non-technical users to customize the theme without editing code — colors, logo URLs, enable/disable features.

**Implementation:**
- Create `FLUX Settings` Single DocType with fields:
  - Primary color (Color field)
  - Logo URL (Attach Image)
  - Enable splash (Check)
  - Enable skyline (Check)
  - Enable particles (Check)
- Read settings via `boot.py` → `frappe.boot.flux_theme`
- Apply as CSS custom property overrides at runtime

**Impact:** High — empowers admins to customize without developer help

---

### 4. Notification Sound Effects
**Description:** Add subtle, luxurious notification sounds for events like new messages, form saves, and errors. Use Web Audio API with a mute toggle.

**Implementation:**
- Add `flux_sounds.js` module
- Create audio sprites (gold chime for success, subtle tone for notification)
- Hook into `frappe.show_alert`, `frappe.msgprint`, form save events
- Store mute preference in `localStorage`
- Respect system mute settings

**Impact:** Medium-high — enhances the premium feel

---

### 5. Workspace Widget Enhancements
**Description:** Add custom workspace widgets: welcome banner with user greeting + time, quick stats dashboard, and recent activity feed with branded styling.

**Implementation:**
- Create `flux_workspace.js` module
- Add welcome banner: "Good morning, {User}" with date
- Style existing workspace shortcuts with gold hover effects
- Add branded "Quick Actions" widget

**Impact:** Medium-high — improves daily workflow experience

---

## 🟡 Medium Priority

> ✅ All Medium priority items completed — moved to [Completed Features](#-completed-features)

---

## 🟢 Low Priority

### 11. Custom Error Pages
**Description:** Branded 404, 403, and 500 error pages with the skyline background and a friendly message.

**Implementation:**
- Create error page templates
- Add skyline background
- Friendly copy: "This page seems to be under construction..."
- Link back to home

---

### 12. Keyboard Shortcuts Panel
**Description:** A styled shortcuts help panel (triggered by `?`) showing all available FLUX shortcuts alongside Frappe defaults.

**Implementation:**
- Add `flux_shortcuts.js` module
- Listen for `?` key (when not in input field)
- Display branded modal with shortcut list
- Include Ctrl+G (search), Konami code, etc.

---

### 13. Dashboard Charts Color Scheme
**Description:** Override ERPNext dashboard chart colors with FLUX gold/navy palette for a cohesive look.

**Implementation:**
- Override Chart.js / Frappe Charts default colors
- Define palette: gold, navy, cream variants, muted tones
- Add `_charts.scss` for chart container styling

---

### 14. Seasonal Theme Variants
**Description:** Subtle seasonal variations — warm gold tones for Ramadan, cool silver for winter, festive accents for National Day.

**Implementation:**
- Define seasonal color overrides
- Auto-detect based on date ranges
- Add subtle decorative elements (crescent, snowflakes, flags)
- Allow disable in settings

---

### 15. User Avatar Enhancements
**Description:** Gold-bordered circular avatar frames with online status indicator and hover card with user details.

**Implementation:**
- Add gold border ring to `.avatar` elements
- Online indicator dot (green with gold glow)
- Hover card with user name, role, last active
- Smooth scale animation on hover

---

## 🔵 Nice-to-Have

> All 10 Nice-to-Have features have been implemented and moved to Completed section below.

---

---

## ✅ Completed Features

> Items moved here when fully implemented and documented.

### ✅ Animated modern city skyline (v1.0.0)
**Completed:** v1.0.0 — Initial release
**File:** `flux_skyline.js` (1,023 lines)
**Description:** Runtime SVG generator creating modern city skyline with Burj Khalifa, Burj Al Arab, Dubai Frame, Cayan Tower, and 15+ generic buildings. Includes animated water reflections and twinkling window lights.
**Documentation:** README.md § JavaScript Modules, CONTEXT.md § 4.2

---

### ✅ Branded Splash Screen (v1.0.0)
**Completed:** v1.0.0 — Initial release
**File:** `flux_splash.js` (207 lines)
**Description:** One-time branded splash screen per browser session with logo fade-in, gold underline sweep, tagline reveal, and skyline background. Safety timer guarantees removal.
**Documentation:** README.md § JavaScript Modules, CONTEXT.md § 4.2

---

### ✅ Custom Loading Indicator (v1.0.0)
**Completed:** v1.0.0 — After 7 iterations of debugging
**Files:** `flux_loading.js` (145 lines), `_splash.scss` (CSS rule)
**Description:** Branded loading overlay with splash logo and spinning gold ring. Overrides `frappe.dom.freeze/unfreeze`. Periodically cleans stuck `#freeze` elements and orphaned modal-backdrops. CSS `#freeze { display: none !important }` prevents Frappe's native freeze from being visible.
**Key Learnings:**
- `frappe.request.on()` does not exist in Frappe
- jQuery `ajaxSend/ajaxComplete` fire for heartbeat/polling — unusable for loading overlay
- Frappe's `#freeze` div can persist if created before our JS loads
**Documentation:** README.md § JavaScript Modules, CONTEXT.md § 4.2, § 8

---

### ✅ Custom Search Overlay (v1.0.0)
**Completed:** v1.0.0 — Initial release
**File:** `flux_navbar.js` (341 lines)
**Description:** Glassmorphism search panel replacing Frappe's inline awesomebar. Ctrl+G to open, ESC to close. Proxies keystrokes to hidden AwesomeBar input. Polls Awesomplete results and clones into custom panel.
**Documentation:** README.md § JavaScript Modules, CONTEXT.md § 4.2

---

### ✅ Login Page Enhancements (v1.0.0)
**Completed:** v1.0.0 — Initial release
**File:** `flux_login.js` (261 lines), `_login.scss` (522 lines)
**Description:** Skyline background, floating gold particles, branded footer, enhanced logo. Glassmorphism login card with animated button shimmer.
**Documentation:** README.md § JavaScript Modules, CONTEXT.md § 4.2

---

### ✅ Canvas Visual Effects (v1.0.0)
**Completed:** v1.0.0 — Initial release
**File:** `flux_effects.js` (371 lines)
**Description:** Stars (80/50/25 by viewport), shooting stars, floating particles, window lights. Respects reduced-motion preference. Auto-initializes on login pages.
**Documentation:** README.md § JavaScript Modules, CONTEXT.md § 4.2

---

### ✅ modern Color System (v1.0.0)
**Completed:** v1.0.0 — Initial release
**File:** `_variables.scss` (125 lines)
**Description:** 9 core color tokens + 4 semantic colors + transitions + shadows + radii. Exposed as both SCSS variables and CSS custom properties. 4 utility mixins.
**Documentation:** README.md § Color Palette, CONTEXT.md § 4.3

---

### ✅ Time-Aware Theme (v1.0.0)
**Completed:** v1.0.0 — Initial release
**File:** `flux_theme.js` (263 lines)
**Description:** Automatic `flux-day`/`flux-night` body classes based on time of day (6am–6pm). Updates every 60 seconds.
**Documentation:** README.md § Key Features, CONTEXT.md § 4.2

---

### ✅ Accessibility Features (v1.0.0)
**Completed:** v1.0.0 — Initial release
**File:** `flux_theme.js` + `_variables.scss`
**Description:** Skip-to-content link, `role="main"` ARIA landmark, gold focus rings, reduced-motion media query disabling all animations.
**Documentation:** README.md § Key Features, CONTEXT.md § 4.2

---

### ✅ Print Styles (v1.0.0)
**Completed:** v1.0.0 — Initial release
**File:** `_print.scss` (242 lines)
**Description:** Clean print output with branded header, hidden navbar/sidebar, readable typography, proper page breaks.
**Documentation:** README.md § SCSS Partials

---

### ✅ Comprehensive Documentation (v1.0.0)
**Completed:** v1.0.0
**Files:** `README.md`, `CONTEXT.md`, `DEVELOPMENT.md`, `.github/copilot-instructions.md`, `ROADMAP.md`, `CHANGELOG.md`
**Description:** Full documentation suite covering user guide, AI context, developer guide, AI assistant instructions, roadmap, and changelog.

---

### ✅ Form View Enhancements (v1.1.0)
**Completed:** v1.1.0
**Files:** `_form-enhancements.scss` (~310 lines), `flux_forms.js` (~85 lines)
**Description:** Enhanced form views with gold accent bars on section headers, smooth collapse/expand animations, branded form sidebar (gradient bg, styled labels/stats/tags), timeline vertical gold line with staggered slide-in entries (IntersectionObserver), comment box gold focus, pill-shaped workflow buttons, unsaved indicator pulse, dark mode support.

---

### ✅ Report View Theming (v1.1.0)
**Completed:** v1.1.0
**File:** `_reports.scss` (~260 lines)
**Description:** Comprehensive report view styling — filter bar with cream bg and gold border, toolbar buttons, DataTable headers (navy bg, gold border-bottom, sort indicators), alternating row colors, report summary cards, chart container with FLUX 8-color palette (CSS custom properties --color-0 through --color-7), pivot table styling, dark mode.

---

### ✅ Email Template Branding (v1.1.0)
**Completed:** v1.1.0
**Files:** `templates/emails/flux_email_template.html` (~165 lines), `templates/emails/flux_notification.html` (~90 lines)
**Description:** Jinja macro-based reusable email template with navy header, 3px gold gradient bar, CTA button with gold gradient, info box with gold left border, styled table with navy headers. Standalone notification template with inline styles for email client compatibility.

---

### ✅ Mobile-Optimized Navbar (v1.1.0)
**Completed:** v1.1.0
**Files:** `_mobile-nav.scss` (~180 lines), `flux_mobile.js` (~160 lines)
**Description:** Fixed bottom navigation bar for mobile (≤767px) with Home, Search, Alerts, and Profile buttons using SVG icons. Gold shimmer effect, active state with gold dot indicator, scroll hide/show with threshold, route-based active state updates, notification badge, dark mode (#0F1419), RTL support, landscape auto-hide, iPhone safe-area-inset-bottom.

---

### ✅ Page Transition Animations (v1.1.0)
**Completed:** v1.1.0
**Files:** `_transitions.scss` (~120 lines), `flux_theme.js` (enhanced `onPageChange`)
**Description:** SPA page transition animations with 7 keyframe effects — fade+translateY enter/exit, directional slide-left/slide-right based on navigation depth, fade-scale with bounce easing, staggered list rows (30 max, 30ms delay), staggered workspace widgets (50ms delay). Enhanced `onPageChange` detects navigation direction. Full `prefers-reduced-motion` support.

---

### ✅ Custom Error Pages (v1.2.0)
**Completed:** v1.2.0
**Files:** `www/404.html`, `www/403.html`, `www/error.html`
**Description:** Branded error pages with navy gradient background, animated gold stars, modern city skyline silhouette SVG, glassmorphism error card, gold gradient error code text. 404: "This page seems to have vanished" with home button. 403: Lock icon, login/home actions, displays permission message. 500: Warning triangle, error detail toggle, reload button, traceback display in dev mode. All pages mobile responsive with reduced-motion support.

---

### ✅ Keyboard Shortcuts Panel (v1.2.0)
**Completed:** v1.2.0
**Files:** `flux_shortcuts.js` (~270 lines), `_shortcuts.scss` (~250 lines)
**Description:** Branded keyboard shortcut help overlay triggered by `?` key. Glassmorphism card with tabbed categories (Navigation, Forms, List View, FLUX). Each shortcut displayed with styled kbd badges. Mac/Windows key detection (⌘/Ctrl). Close on Escape or backdrop click. Dark mode, RTL, mobile responsive. Respects input focus — won't trigger while typing.

---

### ✅ Dashboard Charts Color Scheme (v1.2.0)
**Completed:** v1.2.0
**File:** `_charts.scss` (~230 lines)
**Description:** Complete chart color system — 10 FLUX-branded chart colors as CSS custom properties (--flux-chart-0 through 9). Frappe Charts overrides (bars, dots, lines, pie paths). Styled tooltips with navy background and gold accents. Dashboard chart cards with cream background and hover shadow. Number cards with uppercase titles and hover lift. Heatmap with gold scale (h-0 through h-5). Sparkline styling. Full dark mode support.

---

### ✅ Seasonal Theme Variants (v1.2.0)
**Completed:** v1.2.0
**Files:** `flux_seasons.js` (~270 lines), `_seasons.scss` (~200 lines)
**Description:** Auto-detecting seasonal theming with 5 seasons: Ramadan (green-gold navbar, crescent badge), Eid al-Fitr (gold shimmer navbar stripe), UAE National Day (4-color flag stripe at page top), Winter (cool silver-blue tones), Spring (warm gold surfaces). Approximate Hijri calendar mapping for Ramadan 2025-2030. CSS custom properties for season palette. Feature toggle via FLUX Settings. Dark mode, RTL, mobile, reduced-motion support.

---

### ✅ User Avatar Enhancements (v1.2.0)
**Completed:** v1.2.0
**File:** `_avatars.scss` (~280 lines)
**Description:** Gold ring borders on all avatar contexts (navbar, sidebar, comments, timeline, avatar groups). Hover scale with gold glow box-shadow. Online status indicator dots (online/away/offline/busy) with positioning and pulse animation. Hover card structure (navy card with arrow, name/role/info layout). Avatar group overlap with hover z-index pop. "+N" count badge with gold background. Dark mode (dark borders instead of cream). RTL (flipped margins/status position). Reduced-motion support.

---

*Last updated: 2026 — 25 proposals, 25 completed* 🎉

### ✅ Ambient Sound Mode (v1.3.0)
**Completed:** v1.3.0
**Files:** `flux_ambient.js` (~280 lines), `_ambient.scss` (~160 lines)
**Description:** Procedural ambient sound environments using Web Audio API — 4 environments (office, rain, city, nature) each generated via oscillators and noise buffers (no external audio files). Navbar toggle button with dropdown panel, volume slider, environment cards with active states. localStorage persistence. FLUX Settings feature gate. Dark mode, RTL support.

---

### ✅ Cursor Trail Effect (v1.3.0)
**Completed:** v1.3.0
**File:** `flux_cursor.js` (~200 lines)
**Description:** Canvas-based gold particle cursor trail. 8-10 particles following mouse movement with fade/shrink animation via requestAnimationFrame. Disabled by default (enable via localStorage or FLUX Settings). Respects `prefers-reduced-motion`. Desktop only (>768px viewport).

---

### ✅ Interactive Skyline (v1.3.0)
**Completed:** v1.3.0
**Files:** `flux_interactive_skyline.js` (~180 lines), `_interactive-skyline.scss` (~90 lines)
**Description:** Click/hover interactivity on the modern city skyline SVG. Transparent hotspot rectangles overlay 5 landmarks (Emirates Towers, Dubai Frame, Burj Al Arab, Burj Khalifa, Cayan Tower). Click shows animated tooltip with landmark name (EN/AR), height, year, and fun fact. Subtle gold hover highlight. Dark mode, RTL support.

---

### ✅ Welcome Tour / Onboarding (v1.3.0)
**Completed:** v1.3.0
**Files:** `flux_tour.js` (~240 lines), `_tour.scss` (~170 lines)
**Description:** First-time user onboarding with 6-step guided tour. Backdrop with spotlight cutout highlighting target elements. Animated card with step title (EN/AR), description, dot navigation, and Next/Skip buttons. Positions card relative to target (top/bottom/left/right). Auto-starts for new users, can be restarted via `flux.welcomeTour.restart()`. localStorage persistence. Feature gate via FLUX Settings. Dark mode, RTL, mobile responsive.

---

### ✅ Theme Presets (v1.3.0)
**Completed:** v1.3.0
**Files:** `flux_presets.js` (~180 lines), `_presets.scss` (~150 lines)
**Description:** 5 pre-built color schemes: Dubai Gold (default), Abu Dhabi Pearl (warm neutrals), Desert Rose (pink/sand), Ocean Blue (teal/navy), Emerald Oasis (green). Picker panel with color swatches, bilingual labels (EN/AR), and animated transitions. Reset to default button. localStorage persistence. Accessible via `flux.presets.showPicker()`. Dark mode, RTL, mobile responsive.

---

### ✅ Print Header Customization (v1.3.0)
**Completed:** v1.3.0
**File:** `flux_print_headers.js` (~90 lines)
**Description:** 4 print header styles injected via dynamic CSS: Classic Gold (gold underline, flex layout), Modern Minimal (left accent bar), modern Banner (full-width navy background with gold text), Bilingual AR/EN (dual-language layout). Style selection persisted via localStorage. Accessible via `flux.printHeaders.setStyle(id)`.

---

### ✅ Loading Screen Mini-Games (v1.3.0)
**Completed:** v1.3.0
**Files:** `flux_minigame.js` (~200 lines), `_minigame.scss` (~80 lines)
**Description:** "Catch the Gold Coins" canvas mini-game displayed during long operations. Falling gold coins with rotation animation, trapezoid basket controlled by mouse/touch. Score counter. modern city skyline silhouette background. Hooks into `frappe.show_progress`. Dismiss button. Dark mode, RTL, mobile responsive.

---

### ✅ Animated Favicon (v1.3.0)
**Completed:** v1.3.0
**File:** `flux_animated_favicon.js` (~170 lines)
**Description:** Canvas-generated animated favicon with pulsing gold "T" on navy circle during page loads. Hooks into `frappe.set_route` and jQuery AJAX events. Notification badge method `showBadge(count)` draws red circle with count. Auto-restores original favicon when idle. Feature gate via FLUX Settings.

---

### ✅ Progressive Web App (v1.3.0)
**Completed:** v1.3.0
**Files:** `flux_pwa.js` (~150 lines), `manifest.json`, `sw.js`
**Description:** PWA manifest with FLUX branding (navy background, gold theme color). Service worker with network-first caching strategy (API calls bypass cache). Meta tags for iOS/Android/Windows: apple-mobile-web-app-capable, theme-color, msapplication-TileColor. Install prompt capture. Feature gate via FLUX Settings.

---

### ✅ Multi-Language Welcome Messages (v1.3.0)
**Completed:** v1.3.0
**Files:** `flux_welcome_msg.js` (~130 lines), `_welcome-msg.scss` (~110 lines)
**Description:** Time-aware trilingual welcome overlay (Arabic/English/French). Large calligraphic Arabic greeting with gold text-shadow, English greeting with user's first name, French subtitle. Gold gradient divider. Full-screen backdrop with blur. Auto-dismisses after 4 seconds, click to dismiss. Once per session (sessionStorage). Feature gate via FLUX Settings. Mobile responsive.
