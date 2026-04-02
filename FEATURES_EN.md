# 🎨 FLUX Theme — Complete Feature Guide

> A modern co-working space theme for Frappe 16 / ERPNext 16
> Version: **16.0.0** | Publisher: **Arkan Labs** | License: **MIT**

---

## 📋 Feature Index

| # | Feature | Status | Primary File |
|---|---------|--------|-------------|
| 1 | 🌃 [Animated City Skyline](#-1-animated-city-skyline) | ✅ | `flux_skyline.js` |
| 2 | 🌓 [Dark Mode Toggle](#-2-dark-mode-toggle) | ✅ | `flux_darkmode.js` |
| 3 | 🔍 [Glassmorphism Search Panel](#-3-glassmorphism-search-panel) | ✅ | `flux_navbar.js` |
| 4 | 💫 [Branded Splash Screen](#-4-branded-splash-screen) | ✅ | `flux_splash.js` |
| 5 | ⏳ [Custom Loading Indicator](#-5-custom-loading-indicator) | ✅ | `flux_loading.js` |
| 6 | ✨ [Canvas Visual Effects](#-6-canvas-visual-effects) | ✅ | `flux_effects.js` |
| 7 | 🎨 [Modern Color System](#-7-modern-color-system) | ✅ | `_variables.scss` |
| 8 | 🕐 [Time-Aware Theme](#-8-time-aware-theme) | ✅ | `flux_theme.js` |
| 9 | ♿ [Accessibility Features](#-9-accessibility-features) | ✅ | `flux_theme.js` |
| 10 | 🖨️ [Print Styles](#-10-print-styles) | ✅ | `_print.scss` |
| 11 | 📝 [Form View Enhancements](#-11-form-view-enhancements) | ✅ | `_form-enhancements.scss` |
| 12 | 📊 [Report View Theming](#-12-report-view-theming) | ✅ | `_reports.scss` |
| 13 | 📧 [Email Template Branding](#-13-email-template-branding) | ✅ | `templates/emails/` |
| 14 | 📱 [Mobile Bottom Navigation](#-14-mobile-bottom-navigation) | ✅ | `flux_mobile.js` |
| 15 | 🎬 [Page Transition Animations](#-15-page-transition-animations) | ✅ | `_transitions.scss` |
| 16 | 🚫 [Custom Error Pages](#-16-custom-error-pages) | ✅ | `www/404.html` |
| 17 | ⌨️ [Keyboard Shortcuts Panel](#-17-keyboard-shortcuts-panel) | ✅ | `flux_shortcuts.js` |
| 18 | 📈 [Dashboard Charts Colors](#-18-dashboard-charts-colors) | ✅ | `_charts.scss` |
| 19 | 🌙 [Seasonal Theme Variants](#-19-seasonal-theme-variants) | ✅ | `flux_seasons.js` |
| 20 | 👤 [User Avatar Enhancements](#-20-user-avatar-enhancements) | ✅ | `_avatars.scss` |
| 21 | 🎵 [Ambient Sound Mode](#-21-ambient-sound-mode) | ✅ | `flux_ambient.js` |
| 22 | ✨ [Cursor Trail Effect](#-22-cursor-trail-effect) | ✅ | `flux_cursor.js` |
| 23 | 🏙️ [Interactive Skyline](#-23-interactive-skyline) | ✅ | `flux_interactive_skyline.js` |
| 24 | 🎓 [Welcome Tour / Onboarding](#-24-welcome-tour--onboarding) | ✅ | `flux_tour.js` |
| 25 | 🎨 [Theme Presets](#-25-theme-presets) | ✅ | `flux_presets.js` |
| 26 | 🖨️ [Print Header Customization](#-26-print-header-customization) | ✅ | `flux_print_headers.js` |
| 27 | 🎮 [Loading Screen Mini-Game](#-27-loading-screen-mini-game) | ✅ | `flux_minigame.js` |
| 28 | ✨ [Animated Favicon](#-28-animated-favicon) | ✅ | `flux_animated_favicon.js` |
| 29 | 📲 [Progressive Web App (PWA)](#-29-progressive-web-app-pwa) | ✅ | `flux_pwa.js` |
| 30 | 👋 [Multi-Language Welcome Messages](#-30-multi-language-welcome-messages) | ✅ | `flux_welcome_msg.js` |
| 31 | 🔐 [Enhanced Login Page](#-31-enhanced-login-page) | ✅ | `flux_login.js` |
| 32 | ⚙️ [FLUX Settings DocType](#-32-flux-settings-doctype) | ✅ | `FLUX Settings` |
| 33 | 🔄 [RTL (Right-to-Left) Support](#-33-rtl-right-to-left-support) | ✅ | `_rtl.scss` |
| 34 | 🏢 [Custom Workspace](#-34-custom-workspace) | ✅ | `flux_workspace.js` |

---

## Feature Details

---

### 🌃 1. Animated City Skyline
**File:** `flux_skyline.js` (1,058 lines)

A runtime SVG generator that draws a modern city skyline at the bottom of the page:
- 🏗️ **5 iconic landmarks**: Emirates Towers, Burj Khalifa, Burj Al Arab, Dubai Frame, Cayan Tower
- 🏢 **15+ randomized buildings** with varying shapes and sizes
- 🌊 **Animated water reflections** with wave effect
- 💡 **Twinkling window lights** with random timing
- 🌅 Color changes based on time of day (day/night)

---

### 🌓 2. Dark Mode Toggle
**Files:** `flux_darkmode.js` (238 lines) + `_darkmode.scss` (446 lines)

Full dark mode with one-click toggle:
- 🌙 Toggle button in navbar (moon/sun icon)
- 💾 Persists preference in `localStorage`
- 🖥️ Respects system `prefers-color-scheme: dark`
- 🎨 Complete override of all colors, shadows, and backgrounds
- 📊 Full support for charts, tables, and forms

---

### 🔍 3. Glassmorphism Search Panel
**File:** `flux_navbar.js` (341 lines)

A frosted-glass search overlay replacing the default search bar:
- ⌨️ Opens with `Ctrl+G`, closes with `Escape`
- 🔮 Frosted transparent backdrop
- 🔄 Clones Awesomebar results into styled panel
- 🎯 Acts as input proxy — forwards keystrokes to hidden input

---

### 💫 4. Branded Splash Screen
**Files:** `flux_splash.js` (217 lines) + `_splash.scss` (188 lines)

A one-time per session branded splash screen:
- 🖼️ Logo with fade-in animation
- ✨ Animated green underline sweep
- 📝 Tagline gradual reveal
- ⏱️ Safety timer guarantees removal (2.8s default)
- 🏙️ City skyline as backdrop

---

### ⏳ 5. Custom Loading Indicator
**File:** `flux_loading.js` (145 lines)

Branded loading overlay replacing Frappe's default:
- 🔄 Spinning green ring with logo
- 🔧 Overrides `frappe.dom.freeze/unfreeze`
- 🧹 Periodically cleans stuck `#freeze` elements
- 🛡️ CSS hides native `#freeze` with `display: none !important`

---

### ✨ 6. Canvas Visual Effects
**File:** `flux_effects.js` (375 lines)

Canvas-drawn visual effects:
- ⭐ Twinkling stars (80/50/25 by viewport size)
- 🌠 Random shooting stars
- 🫧 Floating particles
- 💡 Animated window lights
- ♿ Respects `prefers-reduced-motion`

---

### 🎨 7. Modern Color System
**File:** `_variables.scss` (138 lines)

Complete design token system for co-working spaces:

| Color | Hex | Usage |
|-------|-----|-------|
| 🟢 Primary Green | `#09B474` | Primary buttons and key UI |
| 🔴 Accent Red | `#EA2424` | Navigation links and hover states |
| ⬛ Dark | `#2D3436` | Page-head and deep backgrounds |
| 🔵 Info Blue | `#0074A2` | Information and secondary links |
| ⬜ Light Gray | `#F4F5F6` | Body background |
| ⬜ White | `#FFFFFF` | Navbar and card backgrounds |

- SCSS variables: `$flux-green`, `$flux-red`, `$flux-dark`, etc.
- CSS custom properties: `--flux-green`, `--flux-accent`, `--flux-dark`, etc.
- 4 utility mixins: `flux-glass`, `flux-card-elevated`, `flux-green-glow`, `flux-focus-ring`

---

### 🕐 8. Time-Aware Theme
**File:** `flux_theme.js` (403 lines)

Automatic appearance changes based on time:
- ☀️ `flux-day` class from 6 AM to 6 PM
- 🌙 `flux-night` class from 6 PM to 6 AM
- 🔄 Updates every 60 seconds
- 🎨 Applied as body class

---

### ♿ 9. Accessibility Features
**Files:** `flux_theme.js` + `_variables.scss`

- ⏭️ Hidden "Skip to content" link visible on Tab focus
- 🏷️ `role="main"` ARIA landmark on content area
- 🟢 Green focus rings on all focusable elements
- 🔇 `prefers-reduced-motion` disables all animations
- 🔲 `prefers-contrast: high` increases contrast

---

### 🖨️ 10. Print Styles
**File:** `_print.scss` (242 lines)

Clean print output:
- 🏢 Branded header with FLUX logo
- 🚫 Hidden navbar and sidebar
- 📖 Readable, clean typography
- 📄 Proper page breaks

---

### 📝 11. Form View Enhancements
**Files:** `_form-enhancements.scss` (380 lines) + `flux_forms.js` (83 lines)

- 🟢 Green accent bar on section headers
- 🎬 Smooth collapse/expand animations
- 🎨 Gradient background on form sidebar
- 📜 Green timeline with staggered slide-in (IntersectionObserver)
- 💬 Green focus ring on comment box
- 💊 Pill-shaped workflow buttons
- 🔴 Pulsing "unsaved" indicator

---

### 📊 12. Report View Theming
**File:** `_reports.scss` (271 lines)

- 🎯 Filter bar with cream background and green border
- 📊 Dark-background DataTable headers
- 🔄 Alternating row colors
- 📈 Styled report summary cards
- 🎨 Custom 8-color chart palette
- 🌙 Full dark mode support

---

### 📧 13. Email Template Branding
**Files:** `flux_email_template.html` + `flux_notification.html`

- 🏢 Dark header with green gradient bar
- 🔗 Green gradient CTA button
- 📋 Info box with green left border
- 📊 FLUX-styled tables
- 📱 Responsive design for all email clients

---

### 📱 14. Mobile Bottom Navigation
**Files:** `_mobile-nav.scss` (193 lines) + `flux_mobile.js` (171 lines)

Fixed bottom navigation for mobile (≤767px):
- 🏠 4 buttons: Home, Search, Alerts, Profile (SVG icons)
- ✨ Green shimmer effect
- 🟢 Active state with green dot indicator
- 📜 Hide/show on scroll with threshold
- 🔴 Notification badge
- 📱 iPhone Safe Area support

---

### 🎬 15. Page Transition Animations
**Files:** `_transitions.scss` (133 lines) + `flux_theme.js`

SPA page transitions:
- 🎬 7 keyframe effects (fade, slide-left/right, scale)
- 📋 Staggered list rows (30 max, 30ms delay)
- 🖼️ Staggered workspace widgets (50ms delay)
- 🧭 Navigation direction detection (deeper/shallower)
- ♿ Full `prefers-reduced-motion` support

---

### 🚫 16. Custom Error Pages
**Files:** `www/404.html`, `www/403.html`, `www/error.html`

- 🏙️ Dark gradient background with animated stars
- 🌃 City skyline SVG silhouette
- 🔮 Glassmorphism error card
- 🔢 Green gradient error code text
- 📱 Responsive design

| Page | Message |
|------|---------|
| 404 | "This page seems to have vanished" |
| 403 | Lock icon with login/home actions |
| 500 | Warning triangle with error detail toggle |

---

### ⌨️ 17. Keyboard Shortcuts Panel
**Files:** `flux_shortcuts.js` (279 lines) + `_shortcuts.scss` (317 lines)

- ❓ Opens on `?` key press
- 🔮 Glassmorphism card with tabbed categories
- ⌨️ Styled `kbd` badges for shortcuts
- 🍎 Auto-detect Mac/Windows (⌘/Ctrl)
- 🌙 Dark mode + RTL support

---

### 📈 18. Dashboard Charts Colors
**File:** `_charts.scss` (264 lines)

- 🎨 10 FLUX-branded chart colors
- 📊 Frappe Charts overrides (bars, dots, lines, pie)
- 💬 Dark-background tooltips
- 🔥 Green-scale heatmap
- 🌙 Full dark mode support

---

### 🌙 19. Seasonal Theme Variants
**Files:** `flux_seasons.js` (297 lines) + `_seasons.scss` (205 lines)

5 auto-detected seasons:

| Season | Effect |
|--------|--------|
| 🌙 Ramadan | Green-gold navbar stripe + crescent badge |
| 🎉 Eid al-Fitr | Gold shimmer navbar stripe |
| 🇦🇪 UAE National Day | 4-color flag stripe at page top |
| ❄️ Winter | Cool silver-blue tones |
| 🌸 Spring | Warm golden surfaces |

- 📅 Approximate Hijri calendar mapping (2025–2030)
- 🔧 Feature toggle via FLUX Settings

---

### 👤 20. User Avatar Enhancements
**File:** `_avatars.scss` (347 lines)

- 💚 Green ring border on all avatars
- ✨ Hover scale with green glow
- 🟢 Status indicator dots (online/away/offline/busy)
- 📋 Hover card (dark card with name/role info)
- 🏷️ "+N" count badge with green background

---

### 🎵 21. Ambient Sound Mode
**Files:** `flux_ambient.js` (491 lines) + `_ambient.scss` (220 lines)

Procedurally generated ambient sounds via Web Audio API:

| Environment | Description |
|-------------|-------------|
| 🏢 Office | Quiet office ambiance |
| 🌧️ Rain | Relaxing rain sounds |
| 🌆 City | Distant city sounds |
| 🌿 Nature | Peaceful nature sounds |

- 🔊 Volume slider in navbar dropdown
- 💾 Preferences saved in `localStorage`
- 🚫 No external audio files needed

---

### ✨ 22. Cursor Trail Effect
**File:** `flux_cursor.js` (207 lines)

- 🟡 Gold particles following mouse movement
- 🎨 8-10 particles with fade/shrink animation
- 🖥️ Desktop only (>768px viewport)
- 🔇 Disabled by default (enable via Settings)
- ♿ Respects `prefers-reduced-motion`

---

### 🏙️ 23. Interactive Skyline
**Files:** `flux_interactive_skyline.js` (207 lines) + `_interactive-skyline.scss` (96 lines)

Click/hover interactivity on the city skyline:
- 🎯 5 interactive hotspots on landmarks
- 💬 Animated tooltips with name (EN/AR), height, year, fun fact
- ✨ Green hover highlight glow
- 🌙 Dark mode + RTL support

---

### 🎓 24. Welcome Tour / Onboarding
**Files:** `flux_tour.js` (285 lines) + `_tour.scss` (208 lines)

6-step guided tour for new users:
- 🔦 Spotlight cutout highlighting target elements
- 📋 Animated cards with title/description (EN/AR)
- 🔘 Dot navigation + Next/Skip buttons
- 🔄 Restartable: `flux.welcomeTour.restart()`
- 💾 Persisted in `localStorage`

---

### 🎨 25. Theme Presets
**Files:** `flux_presets.js` (224 lines) + `_presets.scss` (167 lines)

5 pre-built color schemes:

| Preset | Description |
|--------|-------------|
| 🌟 Dubai Gold | Default — green and dark |
| 🦪 Abu Dhabi Pearl | Warm neutrals |
| 🌹 Desert Rose | Pink/sand tones |
| 🌊 Ocean Blue | Teal/navy palette |
| 💎 Emerald Oasis | Green emerald |

- 🔄 Animated transitions between presets
- 🌐 Bilingual labels (AR/EN)
- 💾 Saved in `localStorage`

---

### 🖨️ 26. Print Header Customization
**File:** `flux_print_headers.js` (78 lines)

4 print header styles:
- 📋 **Classic Gold** — Underline with flex layout
- ✏️ **Modern Minimal** — Left accent bar
- 🏢 **Corporate Banner** — Full-width dark background
- 🌐 **Bilingual AR/EN** — Dual-language layout

---

### 🎮 27. Loading Screen Mini-Game
**Files:** `flux_minigame.js` (245 lines) + `_minigame.scss` (81 lines)

"Catch the Gold Coins" canvas game during long operations:
- 🪙 Falling gold coins with rotation animation
- 🧺 Mouse/touch controlled basket
- 🏙️ City skyline background
- 🔢 Score counter
- ❌ Dismiss button

---

### ✨ 28. Animated Favicon
**File:** `flux_animated_favicon.js` (200 lines)

Canvas-generated animated favicon:
- 💚 Pulsing green "F" on dark circle during loads
- 🔴 Notification badge with red circle and count
- 🔄 Auto-restores original favicon when idle
- 🔧 Feature gate via FLUX Settings

---

### 📲 29. Progressive Web App (PWA)
**Files:** `flux_pwa.js` (148 lines) + `manifest.json` + `sw.js`

- 📋 PWA manifest with FLUX branding
- ⚙️ Service Worker with network-first caching
- 📱 Meta tags for iOS/Android/Windows
- 📥 Install prompt capture
- 🔧 Feature gate via FLUX Settings

---

### 👋 30. Multi-Language Welcome Messages
**Files:** `flux_welcome_msg.js` (132 lines) + `_welcome-msg.scss` (112 lines)

Time-aware trilingual welcome overlay:

| Time | Arabic | English | French |
|------|--------|---------|--------|
| Morning | صباح الخير | Good Morning | Bonjour |
| Afternoon | مساء الخير | Good Afternoon | Bon après-midi |
| Evening | مساء الخير | Good Evening | Bonsoir |

- 🎨 Calligraphic Arabic text with gold text-shadow
- ✨ Green gradient divider
- ⏱️ Auto-dismiss after 4 seconds
- 💾 Once per session (`sessionStorage`)

---

### 🔐 31. Enhanced Login Page
**Files:** `flux_login.js` (261 lines) + `_login.scss` (522 lines)

- 🏙️ City skyline background
- 🫧 Floating green particles
- 🔮 Glassmorphism login card
- ✨ Button shimmer effect
- 🏢 Branded FLUX footer

---

### ⚙️ 32. FLUX Settings DocType
**File:** `FLUX Settings` (Single DocType)

No-code customization panel:

| Section | Fields |
|---------|--------|
| 🏷️ Branding | Brand name, header logo, favicon |
| 🎨 Colors | Primary, secondary, accent colors |
| 🔧 Features | Splash, skyline, particles, sounds, search, dark mode |
| 💫 Splash | Duration, custom logo |
| ⚙️ Advanced | Custom CSS, custom JS |

---

### 🔄 33. RTL (Right-to-Left) Support
**File:** `_rtl.scss` (421 lines)

Full support for Arabic and Hebrew interfaces:
- 🔄 Mirrored layouts and margins
- 📐 Sidebar on the right
- 🏙️ Skyline remains LTR (not mirrored)
- 📱 Mobile + RTL support

---

### 🏢 34. Custom Workspace
**File:** `flux_workspace.js` (376 lines)

- 👋 Welcome banner: "Good morning, {User Name}" with date
- ⚡ Quick actions with FLUX styling
- 🎨 Green hover effects on workspace widgets

---

## 📊 Project Statistics

| Item | Value |
|------|-------|
| 📁 JavaScript Files | 24 files (6,779 lines) |
| 🎨 SCSS Files | 29 files (9,015 lines) |
| 🐍 Python Files | 3 files (~120 lines) |
| 📄 HTML Files | 6 files |
| 📦 Total Lines | ~16,000+ lines |
| 🔧 Framework | Frappe v16 / ERPNext v16 |
| 📝 License | MIT |
| 🏢 Publisher | Arkan Labs |

---

## 🔗 Related Files

- 📖 [Features in Arabic](FEATURES_AR.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🤖 [AI Context](CONTEXT.md)
- 🗺️ [Roadmap](ROADMAP.md)
- 📋 [Development Log](DEVELOPMENT_LOG.md)
- 🤖 [Copilot Instructions](.github/copilot-instructions.md)

---

> 📅 Last updated: February 2026
> 🏗️ Built by **Arkan Labs** | info@arkanlabs.com
