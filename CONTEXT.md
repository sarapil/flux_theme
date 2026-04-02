# FLUX Theme — Technical Context for AI Models

> **Purpose:** This file provides comprehensive technical context so that any AI model
> (GitHub Copilot, ChatGPT, Claude, etc.) can fully understand the codebase, make
> accurate modifications, and generate correct code within this project.

---

## 1. Project Identity

| Field | Value |
|-------|-------|
| **Name** | FLUX Theme (`flux_theme`) |
| **Type** | Frappe App (pure frontend theme — no DocTypes, no server models) |
| **Framework** | Frappe v16 / ERPNext v16 |
| **Language** | JavaScript (ES5-compatible IIFEs) + SCSS (compiled to CSS) + Python (hooks/boot only) |
| **License** | MIT |
| **Publisher** | Arkan Labs (info@arkanlabs.com) |
| **Version** | 16.0.0 |
| **Build** | `pyproject.toml` with `flit_core` (no setup.py) |
| **Python** | >=3.14 |
| **Node** | >=24 |
| **Total Lines** | ~7,676 across 22 source files |

---

## 2. What This App Does

FLUX Theme is a **client-side-only branding layer** for ERPNext. It:

1. Injects CSS that overrides Frappe's default styles with modern co-working space aesthetics
2. Injects JavaScript that adds visual features (skyline, splash, particles, search overlay)
3. Provides boot session data (version, brand name, logo URLs) via Python

It does **NOT**:
- Create any DocTypes or database tables
- Define any REST API endpoints
- Modify any Frappe or ERPNext core files
- Run any background jobs or scheduled tasks

---

## 3. How Frappe Apps Work (Essential Context)

### 3.1 Hook System

Every Frappe app has a `hooks.py` file that tells Frappe what to load. Key hooks used by this app:

```python
app_include_css = [...]   # CSS files loaded on every desk (app) page
app_include_js = [...]    # JS files loaded on every desk (app) page
web_include_css = [...]   # CSS files loaded on website/portal/login pages
web_include_js = [...]    # JS files loaded on website/portal/login pages
boot_session = "..."      # Python function called during session boot
```

### 3.2 Asset Loading

- Files in `flux_theme/public/` are symlinked to `sites/assets/flux_theme/`
- URLs use the pattern `/assets/flux_theme/<path>`
- `bench build --app flux_theme` copies assets and creates bundles
- `bench --site <site> clear-cache` clears server-side caches

### 3.3 Frappe JS Globals (Available at Runtime)

```javascript
frappe.boot          // Boot data (user, site, all boot_session data)
frappe.session       // Current session info
frappe.router        // SPA router — frappe.router.on('change', fn)
frappe.dom.freeze()  // Show loading overlay (overridden by flux_loading.js)
frappe.dom.unfreeze()// Hide loading overlay (overridden by flux_loading.js)
frappe.after_ajax()  // Run callback after current AJAX requests complete
frappe.call()        // Make API call to server
frappe.ready(fn)     // Execute when Frappe framework is ready
frappe.realtime      // Real-time event system
```

### 3.4 Critical Frappe 16 Limitation

**`frappe.request` is a plain object, NOT an event emitter.** Unlike some documentation suggests:
- `frappe.request.on('before', fn)` → **DOES NOTHING** (silently fails)
- `frappe.request.on('after', fn)` → **DOES NOTHING** (silently fails)

For AJAX lifecycle, use:
- `$(document).ajaxSend(fn)` — fires on every jQuery AJAX request (including heartbeat/polling)
- `$(document).ajaxComplete(fn)` — fires after every jQuery AJAX completes
- `frappe.after_ajax(fn)` — fires once when current pending requests complete

---

## 3.5 Frappe v16 Frontend Architecture (Critical)

Frappe v16 introduced radical frontend changes that affect how theme apps inject UI controls:

### Navbar is Gutted
- The `<header.navbar>` is now **almost empty on desktop** — only renders an announcement widget
- `.navbar-collapse`, `.navbar-nav`, `.standard-navbar-items`, `#navbar-breadcrumbs` are **GONE from desktop**
- The navbar still renders fully on **mobile** as a hamburger menu

### Sidebar is Primary Navigation
- New left sidebar: `.body-sidebar-container` → `.body-sidebar` → `.body-sidebar-top` + `.body-sidebar-bottom`
- Sidebar width: `50px` collapsed (icon rail), `220px` expanded (`var(--sidebar-width)`)
- Expanded state: `.body-sidebar-container.expanded` class
- The old `.desk-sidebar` / `.main-sidebar` classes are **GONE** — replaced by `.body-sidebar`
- Active sidebar items use `.active-sidebar` class (not `.selected` like v15)

### Workspace Pages
- `#page-Workspaces` is **GONE** — workspace pages use `.page-main-content` with dynamic IDs
- `.desk-page` only exists on EditorJS containers (`#editorjs.desk-page.page-main-content`)
- Widget content is inside `.main-section` or `.layout-main-section`

### Search
- Search is now a **modal dialog** (`frappe.get_modal()`), with `#navbar-search` input inside the modal
- The `.search-bar` element is a trigger that opens the modal

### URL Routing
- Desk URL prefix is `/desk/` (not `/app/`)
- Router handles backward compat by stripping both "desk" and "app" prefixes

### Dual-Target Injection Strategy
This theme uses a **sidebar-first, navbar-fallback** pattern:
- All theme controls (search trigger, dark mode, ambient sounds, PWA install) try to inject into `.body-sidebar-bottom` first
- If sidebar not found, falls back to `.navbar-collapse .navbar-nav` for mobile/legacy
- Sidebar-injected items use `.flux-sidebar-action` class with `.item-anchor` + `.sidebar-item-icon` + `.sidebar-item-label` structure
- When sidebar is collapsed, labels are hidden and icons are centered

### Key CSS Variables (v16)
```
--navbar-height: 48px          (unchanged from v15)
--page-head-height: 45px       (new in v16)
--sidebar-width: 220px         (new in v16)
--sidebar-hover-color: #f3f3f3
--sidebar-active-color: rgba(255,255,255,1)
--sidebar-border-color: #ededed
```

---

## 4. File-by-File Reference

### 4.1 Python Files

#### `hooks.py` (47 lines)
```
Purpose: Registers all CSS/JS assets with Frappe's hook system
Key Config:
  - app_include_js: 6 files (theme, skyline, effects, splash, loading, navbar)
  - app_include_css: 1 file (flux.css)
  - web_include_js: 2 files (login, skyline)
  - web_include_css: 1 file (flux.css)
  - boot_session: points to boot.boot_session
  - website_context: brand_name + favicon
  - required_apps: ["frappe"]
```

#### `boot.py` (10 lines)
```
Purpose: Adds flux_theme data to frappe.boot during session initialization
Exports: bootinfo.flux_theme = { version, brand_name, logo_url, favicon_url }
Access: frappe.boot.flux_theme in browser JavaScript
```

### 4.2 JavaScript Files

All JS files use **IIFE pattern** (Immediately Invoked Function Expression) with `'use strict'`.
All modules attach to the `window.flux` namespace.

#### `flux_theme.js` (263 lines) — ENTRY POINT
```
Namespace: window.flux (root)
Initialization: DOMContentLoaded + frappe.ready()
Exports:
  flux.config           — { version, brandName, paths{}, colors{}, animations{} }
  flux.init()           — Main initialization
  flux.initFavicon()    — Replace browser favicons (5 sizes: 16/32/48/ico/192)
  flux.initMetaTags()   — Title observer ("| FLUX") + theme-color meta
  flux.initAccessibility() — Skip link + ARIA role="main"
  flux.initEventListeners() — Router change + reduced-motion + time updater
  flux.onPageChange()   — page-content-enter CSS animation trigger
  flux.updateTimeAwareTheme() — flux-day/flux-night body classes (6am–6pm)
  flux.showSuccessFlash(el) — Flash animation utility
  flux.initEasterEgg()  — Konami code → console log
  flux.isLoginPage()    — Boolean: checks body class + URL
  flux.prefersReducedMotion() — Boolean: checks config flag
Dependencies: frappe.router, frappe.boot, frappe.ready
```

#### `flux_skyline.js` (1,023 lines) — LARGEST MODULE
```
Namespace: flux.skyline
Exports:
  flux.skyline.create(container, options) — Build full skyline SVG
    Options: { fullScene, showStars, showWater, showReflections, animated }
  flux.skyline.config — { viewBox, skyHeight, waterHeight, buildingColor, waterColor }
Internal Methods:
  createSVG()          — Base SVG element with viewBox="0 0 1920 600"
  addDefs(svg)         — Gradient definitions (sky, water, gold glow)
  addSky(svg)          — Sky background rectangle
  addBuildings(svg)    — All building silhouettes
  addBurjKhalifa(g)    — Needle at y=30, detailed spire
  addBurjAlArab(g)     — Sail-shaped silhouette with helipad
  addDubaiFrame(g)     — Rectangular frame with viewing deck
  addCayanTower(g)     — Twisted tower silhouette
  addGenericTowers(g)  — 15+ varied rectangular buildings
  addBuildingWindows(g) — Gold window dots with <animate> opacity
  addWater(svg, animated) — Water gradient + animated reflections
  addReflections(svg)  — Building reflections in water
  createLinearGradient() — Helper for SVG gradient creation
  createRect() / createPath() — SVG shape helpers
Used by: flux_splash.js, flux_login.js, _layout.scss (workspace background)
Note: Defines flux.isLoginPage and flux.prefersReducedMotion fallbacks
      for contexts where flux_theme.js hasn't loaded (login/web pages)
```

#### `flux_effects.js` (371 lines)
```
Namespace: flux.effects
Exports:
  flux.effects.init(container)    — Start canvas effects
  flux.effects.stop()             — Stop all animations, remove canvas
  flux.effects.enableGoldDust()   — Enable floating gold particles
  flux.effects.initWindowLights() — Building window glow effect
Internal:
  createCanvas()       — Canvas element with absolute positioning
  resizeCanvas()       — Window resize handler
  initStars()          — 80/50/25 stars (desktop/tablet/mobile)
  initParticles()      — 20 floating particles
  drawStars(timestamp) — Render with sine-wave shimmer (40% chance)
  drawParticles(dt)    — Upward floating particles with wrap-around
  createShootingStar() — Random spawn, gradient trail
  drawShootingStars(dt) — Render with opacity fade
  startAnimation()     — requestAnimationFrame loop
Config: flux.effects.config.stars.{count, tabletCount, mobileCount, ...}
Auto-init: Only on login pages (checks flux.isLoginPage())
```

#### `flux_splash.js` (207 lines)
```
Namespace: flux.splash
Exports:
  flux.splash.init()       — Show splash (if conditions met)
  flux.splash.forceShow()  — Dev: bypass session check
  flux.splash.reset()      — Dev: clear session flag
Internal:
  create()            — Build overlay DOM (#flux-splash-overlay)
  animate()           — Sequenced animation (logo → underline → tagline)
  fadeOut()            — Opacity transition + pointer-events: none
  remove()            — Remove from DOM + clear safety timer
  startSafetyTimer()  — 5s hard timeout (guaranteed removal)
  _injectSkyline()    — Embed flux.skyline.create() as background
Config: flux.splash.config.{sessionKey, displayTime:2800, fadeOutTime:500, maxTimeout:5000}
Session Key: 'flux_splash_shown' in sessionStorage
Skip Conditions: sessionStorage set, login page, non-desk page, reduced-motion
Safety: Flag set BEFORE animation; try/catch around create/animate; 5s timeout
```

#### `flux_loading.js` (145 lines)
```
Namespace: flux.loading
Exports:
  flux.loading.init()    — Override freeze/unfreeze, start cleanup
  flux.loading.show()    — Create and show loading overlay
  flux.loading.remove()  — Fade out and remove overlay
Internal:
  _cleanupFrappeFreeze()  — Remove stuck #freeze + orphaned .modal-backdrop
  _safetyTimer             — 3s auto-remove timeout
Boot: Polls for frappe.dom and frappe.after_ajax every 200ms
Overrides:
  frappe.dom.freeze(msg) → self.show()
  frappe.dom.unfreeze()  → self.remove()
Router: frappe.router.on('change') → show() + frappe.after_ajax → remove()
Cleanup: setInterval(2000) removes stuck #freeze and excess .modal-backdrop
CSS Dependency: #freeze { display: none !important } in _splash.scss
DOM ID: #flux-loading-overlay
```

#### `flux_navbar.js` (341 lines)
```
Namespace: flux.navbar
Exports:
  flux.navbar.init()        — Bootstrap navbar enhancements
  flux.navbar.openSearch()  — Open/toggle search overlay
  flux.navbar.closeSearch() — Close search overlay
Internal:
  wrapSearchBar()      — Hide .search-bar, inject SVG search icon
  hideHelp()           — display:none on .dropdown-help
  patchNotifications() — Add has-unseen class, poll every 3s
  patchChat()          — Add flux-chat class
  _repositionDropdown() — Poll Awesomplete results every 200ms
Boot: DOMContentLoaded + toolbar_setup event
Keyboard: Ctrl+G (capture phase) opens search, ESC closes
DOM IDs: #flux-search-overlay, #flux-search-input
Proxy: Mirrors typing to #navbar-search (Frappe's hidden AwesomeBar)
```

#### `flux_login.js` (261 lines)
```
Namespace: flux.login
Exports:
  flux.login.init()       — Initialize login page enhancements
Internal:
  isLoginPage()        — Check body data-path + URL
  injectSkyline()      — flux.skyline.create() or fallback SVG
  createFallbackSkyline() — Inline SVG with landmarks
  createWindowLights() — Random gold dots on building silhouettes
  injectParticles()    — Canvas particle system (35 particles)
  injectBrandFooter()  — "© 2026 Flux. All rights reserved."
  enhanceLogo()        — Replace login logo src + heading text
DOM IDs: #flux-login-skyline, #flux-login-particles, #flux-login-brand
```

### 4.3 SCSS Files

All SCSS files use `$flux-*` variables and `var(--flux-*)` custom properties.
Import order matters — defined in `flux.scss`.

#### `_variables.scss` (125 lines)
```
Defines:
  SCSS Variables: $flux-gold, $flux-navy, $flux-cream + variants
  Semantic: $flux-success (#2D6A4F), $flux-danger (#9B1B30)
  Transitions: $flux-transition-fast (150ms), -base (250ms), -slow (400ms)
  Shadows: $flux-shadow-sm/md/lg
  Radii: $flux-radius-sm (3px) / md (4px) / lg (6px) / full (9999px)
  CSS Custom Properties: All above exposed as --flux-* on :root
  Component tokens: --navbar-height (48px), --sidebar-width (220px)
Mixins:
  @include flux-glass     → rgba(29,41,57,0.8) + blur(20px)
  @include flux-card-elevated → cream bg + shadow + radius
  @include flux-gold-glow → box-shadow gold 0.3 opacity
  @include flux-focus-ring → gold border + 3px ring
Media Query: prefers-reduced-motion: reduce → disables all animations
```

#### `_layout.scss` (~1,450 lines) — LARGEST SCSS
```
Sections:
  Navbar:              rgba(17,24,39,0.8) + backdrop-filter blur(20px) (mobile only in v16)
  Sidebar (v15):       .layout-side-section — Linear gradient dark to darker (form/list sidebars)
  Sidebar (v16):       .body-sidebar-container — Primary nav sidebar with red/green accents, .active-sidebar states
  Sidebar Actions:     .flux-sidebar-action — Theme controls (search, darkmode, ambient, PWA) in sidebar bottom
  Page Head:           Dark #333333 with border-bottom
  Workspace:           .page-main-content + #page-Workspaces (dual selector for v15/v16 compat)
  Layout Main:         Dark background
  Search Overlay:      Glassmorphism panel styling for flux_navbar.js
  Notifications:       Bell swing animation, unseen indicator
  Mobile (<768px):     Responsive sidebar, collapsed navbar
  Sidebar Toggle:      Custom button with accent hover
Important Rules:
  .navbar { position: sticky; top: 0; z-index: 1030; }
  .body-sidebar { v16 primary nav with dark gradient + red accents }
  .page-head { position: sticky; top: var(--navbar-height); }
```

#### `_splash.scss` (188 lines)
```
Contains:
  #flux-splash-overlay — Full-screen fixed overlay z-index: 99999
  .flux-loading-overlay — Loading indicator z-index: 99998
  .flux-loading-ring — Gold spinning ring animation
  .flux-loading-visible — Opacity transition
  .flux-loading-fadeout — Exit animation
  #freeze { display: none !important } — CRITICAL: hides Frappe's native freeze
  .modal-backdrop orphan protection
```

---

## 5. Module Interaction Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Frappe 16 Core                     │
│  frappe.router.on('change')  frappe.dom.freeze()     │
│  frappe.after_ajax()         frappe.ready()           │
│  frappe.boot                 $(document).ajaxSend()   │
└──────────┬───────────────────────────┬───────────────┘
           │                           │
     ┌─────▼─────┐              ┌─────▼─────┐
     │  hooks.py  │              │  boot.py   │
     │ (includes) │              │ (session)  │
     └─────┬──────┘              └────────────┘
           │
    ┌──────┴──────────────────────────────────────┐
    │           Desk Pages (app_include_*)         │
    ├─────────────────────────────────────────────┤
    │                                              │
    │  flux_theme.js ◄── ENTRY POINT             │
    │       │  Sets up namespace, config            │
    │       │  Initializes favicon, meta, a11y      │
    │       │                                       │
    │       ├── flux_skyline.js                    │
    │       │     Creates SVG skyline (used by       │
    │       │     splash, login, and workspace)      │
    │       │                                        │
    │       ├── flux_effects.js                    │
    │       │     Canvas stars & particles            │
    │       │     (auto-init on login only)           │
    │       │                                        │
    │       ├── flux_splash.js                     │
    │       │     One-time branded splash             │
    │       │     Uses flux.skyline.create()        │
    │       │                                        │
    │       ├── flux_loading.js                    │
    │       │     Overrides frappe.dom.freeze/unfreeze│
    │       │     Cleans up stuck #freeze elements    │
    │       │                                        │
    │       └── flux_navbar.js                     │
    │             Custom search overlay               │
    │             Proxies to Frappe AwesomeBar        │
    │                                                │
    ├─────────────────────────────────────────────┤
    │           Web/Login (web_include_*)           │
    │                                                │
    │  flux_login.js                               │
    │       Uses flux.skyline.create()             │
    │       Has its own fallback SVG                 │
    │                                                │
    │  flux_skyline.js                             │
    │       Loaded on web pages too for login use    │
    ├─────────────────────────────────────────────┤
    │                                                │
    │  flux.css  (compiled from flux.scss)        │
    │       All 12 SCSS partials merged               │
    │       Loaded on ALL pages (desk + web)          │
    └─────────────────────────────────────────────┘
```

---

## 6. Naming Conventions

| Element | Convention | Examples |
|---------|-----------|----------|
| JS Namespace | `flux.<module>.<method>` | `flux.skyline.create()`, `flux.loading.show()` |
| CSS Custom Properties | `--flux-<token>` | `--flux-gold`, `--flux-navy-deep` |
| SCSS Variables | `$flux-<token>` | `$flux-gold`, `$flux-transition-base` |
| SCSS Mixins | `flux-<name>` | `flux-glass`, `flux-focus-ring` |
| DOM IDs | `flux-<feature>-<element>` | `#flux-splash-overlay`, `#flux-search-input` |
| CSS Classes | `flux-<feature>-<modifier>` | `.flux-loading-visible`, `.flux-search-btn` |
| Body Classes | `flux-<state>` | `.flux-day`, `.flux-night` |
| JS Files | `flux_<module>.js` | `flux_theme.js`, `flux_skyline.js` |
| SCSS Files | `_<feature>.scss` | `_variables.scss`, `_layout.scss` |
| Image Files | Descriptive lowercase | `logo-header.png`, `favicon-32x32.png` |

---

## 7. Common Patterns

### 7.1 Module Registration
```javascript
(function() {
    'use strict';
    window.flux = window.flux || {};
    flux.myModule = {
        init: function() { /* ... */ },
        // ...
    };
    // Boot logic at bottom
})();
```

### 7.2 Frappe API Check Before Use
```javascript
if (typeof frappe !== 'undefined' && frappe.router && frappe.router.on) {
    frappe.router.on('change', function() { /* ... */ });
}
```

### 7.3 Safety Timers
All overlays have hard timeouts to guarantee removal:
```javascript
this._safetyTimer = setTimeout(function() { self.remove(); }, 3000);
```

### 7.4 Reduced Motion Respect
```javascript
if (flux.prefersReducedMotion && flux.prefersReducedMotion()) return;
```
```scss
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

### 7.5 Login Page Detection
```javascript
flux.isLoginPage = function() {
    return document.body.getAttribute('data-path') === 'login' ||
           window.location.pathname.includes('/login');
};
```

### 7.6 SCSS Mixin Usage
```scss
.my-element {
    @include flux-glass;       // Glassmorphism background
    @include flux-gold-glow;   // Gold glow shadow
    @include flux-focus-ring;  // Focus accessibility ring
}
```

---

## 8. Known Gotchas & Critical Knowledge

1. **`frappe.request.on()` DOES NOT WORK** in Frappe. It's a plain object. Use jQuery AJAX hooks or `frappe.after_ajax()` instead.

2. **`#freeze` element** — Frappe creates `<div id="freeze" class="modal-backdrop fade">` when `frappe.dom.freeze()` is called. If our override wasn't loaded yet, this element persists. That's why we have CSS `#freeze { display: none !important }` and periodic cleanup.

3. **jQuery `ajaxSend`/`ajaxComplete`** fire for ALL requests including heartbeat polling and realtime. Using these to show/hide an overlay causes it to never disappear.

4. **Script load order** — `hooks.py` `app_include_js` array determines load order. `flux_theme.js` must be first (sets up namespace). `flux_skyline.js` must load before `flux_splash.js` and `flux_login.js` (they call `flux.skyline.create()`).

5. **SCSS compilation** is NOT automatic. After editing `.scss` files, you must run `npx sass` manually, then `bench build`. The Frappe `bench watch` only watches for JS changes.

6. **Asset symlink** — `bench build` creates symlinks from `sites/assets/flux_theme/` → `apps/flux_theme/flux_theme/public/`. Direct file edits in `public/` are immediately visible without rebuild for JS/CSS (but cache must be cleared).

7. **Awesomplete** — Frappe uses the Awesomplete library for autocomplete. Our search overlay clones its results via polling (not MutationObserver, which caused infinite loops).

8. **`sessionStorage` vs `localStorage`** — Splash uses `sessionStorage` (per-tab, cleared on tab close). This means splash shows once per new tab/window, which is intentional.

---

## 9. How to Add a New Feature

1. **New JS module:** Create `flux_<name>.js` in `public/js/`, use IIFE + `flux.<name>` namespace, add to `hooks.py` `app_include_js`
2. **New SCSS partial:** Create `_<name>.scss` in `public/scss/`, add `@import '<name>'` to `flux.scss` in correct dependency order
3. **New image:** Place in `public/images/`, reference via `/assets/flux_theme/images/<file>`
4. **Build:** `npx sass scss/flux.scss css/flux.css --style compressed --source-map && bench build --app flux_theme && bench --site dev.localhost clear-cache`

---

## 10. Build & Test Workflow

```bash
# 1. Edit SCSS/JS files
# 2. Compile SCSS
cd /workspace/development/frappe-bench/apps/flux_theme/flux_theme/public
npx sass scss/flux.scss css/flux.css --style compressed --source-map

# 3. Build Frappe assets
cd /workspace/development/frappe-bench
bench build --app flux_theme

# 4. Clear cache
bench --site dev.localhost clear-cache

# 5. Hard refresh browser (Ctrl+Shift+R)
```

---

*Last updated: February 2026 — Generated for AI model consumption*

## 11. Current Layout Design (February 2026)

### Navbar — White (#FFFFFF)
```scss
.sticky-top .navbar { background: #FFFFFF !important; border-bottom: 1px solid #E8E8E8; }
--icon-stroke: #333333;   // Dark icons on white background
```

### Page-head — Dark (#333333)
```scss
.page-head { background: #333333 !important; color: #FFFFFF; }
// All breadcrumbs, titles, icons → white
```

### Body — Light Gray (#F4F5F6)
```scss
body { background-color: #F4F5F6 !important; }
:root { --bg-color: #F4F5F6; --card-bg: #FFFFFF; }
```

### Accent — Red (#EA2424)
```scss
$flux-accent: #EA2424;
// Sidebar hover, navbar hover, interactive links → red
```

## 12. Complete Color Token Table

| Token | Hex | CSS Variable | SCSS Variable |
|-------|-----|-------------|---------------|
| Primary Green | #09B474 | --flux-green | $flux-green |
| Green Light | #3DD99A | --flux-green-light | $flux-green-light |
| Green Dark | #067A4E | --flux-green-dark | $flux-green-dark |
| Red Accent | #EA2424 | --flux-accent | $flux-accent, $flux-red |
| Dark | #2D3436 | --flux-dark | $flux-dark |
| Dark Text | #333333 | --flux-text | $flux-text |
| Body BG | #F4F5F6 | --bg-color | — |
| Navbar BG | #FFFFFF | --navbar-bg | — |
| Card BG | #FFFFFF | --card-bg | — |
| Blue Info | #0074A2 | --flux-blue | $flux-blue |
| Success | #09B474 | --flux-success | $flux-success |
| Danger | #EA2424 | --flux-danger | $flux-danger |
| Warning | #F0AD4E | --flux-warning | $flux-warning |

## 13. File Statistics (February 2026)

| Category | Files | Lines |
|----------|-------|-------|
| JavaScript (public/js/) | 24 | 6,779 |
| SCSS (public/scss/) | 29 | 9,015 |
| Python | 3 | ~120 |
| HTML Templates | 6 | ~500 |
| Documentation | 10 | ~3,000 |
| **Total** | **72** | **~19,400** |

## 14. Documentation Map

| File | Audience | Purpose |
|------|----------|---------|
| AI_SUMMARY.md | AI Models | Quick 1-page reference card |
| CONTEXT.md | AI Models | This file — deep technical context |
| ARCHITECTURE.md | Developers + AI | Directory tree, data flow, build pipeline |
| FEATURES_EN.md | Users + Developers | All 34 features in English with icons |
| FEATURES_AR.md | Users + Developers | All 34 features in Arabic with icons |
| DEVELOPMENT_LOG.md | Developers + AI | Bug history, decisions, lessons learned |
| ROADMAP.md | Developers | Future proposals and suggestions |
| CHANGELOG.md | All | Version history |
| .github/copilot-instructions.md | AI Assistants | Coding conventions and rules |
| README.md | All | Main documentation |
