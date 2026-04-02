# FLUX Theme — Developer Guide

> Complete development guide for contributing to and customizing the FLUX theme.

---

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Project Structure](#project-structure)
3. [SCSS Development](#scss-development)
4. [JavaScript Development](#javascript-development)
5. [Adding New Features](#adding-new-features)
6. [Debugging](#debugging)
7. [Code Style Guide](#code-style-guide)
8. [Testing Checklist](#testing-checklist)
9. [Deployment](#deployment)
10. [Architecture Decisions](#architecture-decisions)

---

## Environment Setup

### Prerequisites

- Frappe Bench with Frappe v16+ installed
- Python 3.14+ / Node.js 24+
- A running Frappe site in developer mode (`developer_mode: 1`)

### First-Time Setup

```bash
# 1. Navigate to bench
cd ~/frappe-bench

# 2. Get the app (if not already present)
bench get-app flux_theme <git-url>

# 3. Install on your site
bench --site dev.localhost install-app flux_theme

# 4. Install Node dependencies for SCSS
cd apps/flux_theme/flux_theme/public
npm install sass  # or: npm install -g sass

# 5. Initial build
npx sass scss/flux.scss css/flux.css --style compressed --source-map
cd /path/to/frappe-bench
bench build --app flux_theme
bench --site dev.localhost clear-cache
```

### Development Workflow

```
Edit SCSS/JS → Compile SCSS → bench build → clear-cache → Hard refresh
```

Quick one-liner for full rebuild:

```bash
cd apps/flux_theme/flux_theme/public && \
npx sass scss/flux.scss css/flux.css --style compressed --source-map && \
cd /workspace/development/frappe-bench && \
bench build --app flux_theme && \
bench --site dev.localhost clear-cache
```

### Watch Mode (SCSS Auto-Compile)

```bash
cd apps/flux_theme/flux_theme/public
npx sass --watch scss/flux.scss:css/flux.css --style compressed
```

> **Note:** You still need to run `bench build` after SCSS changes for them to be served. For JS-only changes, `bench build` alone suffices.

---

## Project Structure

```
flux_theme/
├── hooks.py                    # Frappe hooks — registers all assets
├── boot.py                     # Boot session — theme data to JS
│
└── public/                     # All client-side assets
    ├── css/                    # Compiled output (DO NOT EDIT)
    │   ├── flux.css
    │   └── flux.css.map
    │
    ├── scss/                   # Source styles (EDIT THESE)
    │   ├── flux.scss         # Master import file
    │   ├── _variables.scss     # Colors, tokens, mixins
    │   ├── _typography.scss    # Fonts and text
    │   ├── _animations.scss    # @keyframes
    │   ├── _buttons.scss       # Button styles
    │   ├── _forms.scss         # Input/form styles
    │   ├── _layout.scss        # Navbar, sidebar, page structure
    │   ├── _tables.scss        # List views, data tables
    │   ├── _cards.scss         # Widgets, cards
    │   ├── _modals.scss        # Dialogs, tooltips
    │   ├── _login.scss         # Login page
    │   ├── _splash.scss        # Splash + loading overlay
    │   └── _print.scss         # Print styles
    │
    ├── js/                     # JavaScript modules
    │   ├── flux_theme.js     # Main coordinator
    │   ├── flux_skyline.js   # SVG skyline renderer
    │   ├── flux_effects.js   # Canvas effects
    │   ├── flux_splash.js    # Splash screen
    │   ├── flux_loading.js   # Loading indicator
    │   ├── flux_navbar.js    # Navbar enhancements
    │   └── flux_login.js     # Login enhancements
    │
    ├── images/                 # Raster images
    └── svg/                    # Vector graphics
```

---

## SCSS Development

### Import Order

The import order in `flux.scss` matters for cascading:

```scss
@import 'variables';    // 1. Must be first — defines all tokens
@import 'typography';   // 2. Font imports and base text
@import 'animations';   // 3. Keyframes (referenced by later files)
@import 'buttons';      // 4. Button components
@import 'forms';        // 5. Form controls
@import 'layout';       // 6. Page structure (depends on variables + animations)
@import 'tables';       // 7. Data display
@import 'cards';        // 8. Widget cards
@import 'modals';       // 9. Overlays and dialogs
@import 'login';        // 10. Login page (depends on animations)
@import 'splash';       // 11. Splash + loading (depends on animations)
@import 'print';        // 12. Last — print overrides everything
```

### Using Variables

Always use SCSS variables for values and CSS custom properties for runtime theming:

```scss
// ✅ Correct — uses SCSS variable (compiled) + CSS custom property (runtime)
.my-element {
    background: $flux-navy;           // Compiled to #1D2939
    color: var(--flux-cream);          // Resolved at runtime
    transition: $flux-transition-base;  // Compiled to "250ms ease"
}

// ❌ Wrong — hardcoded values
.my-element {
    background: #1D2939;
    color: #FFF1E7;
}
```

### Using Mixins

Four utility mixins are available:

```scss
.glassmorphism-panel {
    @include flux-glass;           // Glass background + blur
}

.elevated-card {
    @include flux-card-elevated;   // Cream bg + shadow + radius
}

.highlighted-element {
    @include flux-gold-glow;       // Gold box-shadow glow
}

input:focus {
    @include flux-focus-ring;      // Gold focus ring (accessibility)
}
```

### Selector Strategy

Override Frappe styles using **equal or higher specificity**, never `!important` unless absolutely necessary:

```scss
// ✅ Good — matches Frappe's specificity
.page-container .layout-main-section {
    background: var(--flux-cream);
}

// ✅ OK — Frappe uses body-level classes
body .navbar {
    @include flux-glass;
}

// ❌ Avoid — too broad
div {
    color: var(--flux-text) !important;
}
```

### Responsive Breakpoints

```scss
// Mobile-first approach
.my-component {
    padding: 8px;

    @media (min-width: 768px) {
        padding: 16px;  // Tablet+
    }

    @media (min-width: 1200px) {
        padding: 24px;  // Desktop
    }
}
```

---

## JavaScript Development

### Module Pattern

All JS files follow this pattern:

```javascript
/**
 * FLUX Theme - Module Name
 * Brief description
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    flux.myModule = {
        config: { /* module config */ },

        init: function() {
            // Initialize module
        },

        // Public methods
        doSomething: function() { /* ... */ },

        // Private methods (convention: prefix with _)
        _helperMethod: function() { /* ... */ }
    };

    // Boot logic — wait for dependencies
    (function boot() {
        if (typeof frappe !== 'undefined' && frappe.dom) {
            flux.myModule.init();
        } else {
            setTimeout(boot, 200);
        }
    })();

})();
```

### Key Rules

1. **Always use ES5 syntax** — Frappe's build system expects ES5 for `app_include_js`
   ```javascript
   // ✅ ES5
   var self = this;
   items.forEach(function(item) { /* ... */ });

   // ❌ ES6+ (may break in some environments)
   const self = this;
   items.forEach(item => { /* ... */ });
   ```

   > **Exception:** `flux_skyline.js` and `flux_effects.js` use some ES6 (`const`, `let`, arrow functions in non-critical paths). These work in modern browsers but consider keeping new code ES5 for maximum compatibility.

2. **Always check for Frappe globals** before using them:
   ```javascript
   if (typeof frappe !== 'undefined' && frappe.router && frappe.router.on) {
       frappe.router.on('change', handler);
   }
   ```

3. **Always add safety timers** for overlays:
   ```javascript
   this._safetyTimer = setTimeout(function() { self.remove(); }, 3000);
   ```

4. **Always respect reduced motion**:
   ```javascript
   if (flux.prefersReducedMotion && flux.prefersReducedMotion()) return;
   ```

5. **Never use `frappe.request.on()`** — it doesn't exist in Frappe.

### Available Frappe APIs

```javascript
// ─── Navigation ───
frappe.router.on('change', fn)     // SPA page change
frappe.set_route('path')           // Navigate programmatically

// ─── AJAX ───
frappe.call({method, args, callback})  // API call
frappe.after_ajax(fn)                   // After current requests complete
frappe.xcall(method, args)              // Promise-based API call

// ─── DOM ───
frappe.dom.freeze(msg)    // Show loading (overridden by us)
frappe.dom.unfreeze()     // Hide loading (overridden by us)

// ─── Events ───
frappe.realtime.on(event, fn)  // Real-time WebSocket events
$(document).on('toolbar_setup', fn)  // Toolbar ready

// ─── Session ───
frappe.boot              // All boot data including flux_theme
frappe.session.user      // Current user
frappe.boot.developer_mode  // Dev mode flag (1 or 0)
```

### Load Order

Scripts load in the order specified in `hooks.py`:

1. `flux_theme.js` — Sets up `window.flux` namespace and config
2. `flux_skyline.js` — SVG renderer (defines fallback helpers)
3. `flux_effects.js` — Canvas effects
4. `flux_splash.js` — Splash screen (uses `flux.skyline.create()`)
5. `flux_loading.js` — Loading overlay (overrides `frappe.dom.freeze`)
6. `flux_navbar.js` — Search overlay

> **Important:** `flux_skyline.js` must load before `flux_splash.js` and `flux_login.js` because they call `flux.skyline.create()`.

---

## Adding New Features

### New JavaScript Module

1. Create `public/js/flux_<name>.js` following the module pattern above
2. Add to `hooks.py` `app_include_js` (or `web_include_js` for login/web pages)
3. Run `bench build --app flux_theme`

### New SCSS Partial

1. Create `public/scss/_<name>.scss`
2. Add `@import '<name>';` to `flux.scss` in the correct position
3. Run `npx sass scss/flux.scss css/flux.css --style compressed --source-map`
4. Run `bench build --app flux_theme`

### New Image/SVG

1. Place in `public/images/` or `public/svg/`
2. Reference as `/assets/flux_theme/images/<file>` or `/assets/flux_theme/svg/<file>`
3. Run `bench build --app flux_theme`

### Adding Boot Data

Edit `boot.py` to add data accessible via `frappe.boot.flux_theme`:

```python
def boot_session(bootinfo):
    bootinfo.flux_theme = {
        "version": "16.0.0",
        "my_new_field": "value"
    }
```

---

## Debugging

### Browser Console

```javascript
// Check if theme loaded
flux.config                    // Should show config object

// Check loading module
flux.loading                   // Should show init, show, remove methods

// Force show splash
flux.splash.forceShow()

// Check body classes
document.body.classList.toString()  // Should include flux-day or flux-night

// Check for stuck freeze elements
document.getElementById('freeze')               // Should be null
document.querySelectorAll('.modal-backdrop')      // Should be 0 if no modals open

// Manually clean up
flux.loading._cleanupFrappeFreeze()
```

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Styles not applying | CSS not compiled or cache not cleared | Recompile SCSS + `bench build` + clear cache |
| JS module undefined | `hooks.py` missing entry or load order wrong | Check `hooks.py`, ensure dependencies load first |
| Dark overlay stuck | Frappe `#freeze` not cleaned up | `flux.loading._cleanupFrappeFreeze()` or hard refresh |
| Splash shows every time | `sessionStorage` cleared or different tab | Expected behavior — once per tab |
| Search overlay empty | Awesomplete not initialized | Wait for toolbar_setup, check `.search-bar` exists |
| Animation not working | `prefers-reduced-motion` enabled | Check OS accessibility settings |
| Fonts not loading | Google Fonts blocked | Check network / CSP headers |

### DevTools Tips

1. **CSS debugging:** Use Elements panel → filter by `flux` to find all custom styles
2. **JS debugging:** Type `flux.` in Console to explore the namespace
3. **Network:** Filter by `flux` to see all theme asset requests
4. **Performance:** Check if canvas effects cause frame drops on low-end devices

---

## Code Style Guide

### JavaScript

- **Pattern:** IIFE with `'use strict'`
- **Syntax:** ES5 preferred (no arrow functions, template literals, or destructuring in critical paths)
- **Naming:** `camelCase` for functions/variables, `UPPER_SNAKE` for constants
- **Namespace:** Always under `flux.*`
- **Comments:** JSDoc-style for public methods
- **Error handling:** `try/catch` around DOM operations, `console.warn` for non-critical errors
- **No external dependencies** — only Frappe globals and browser APIs

### SCSS

- **Variables:** Use `$flux-*` for compile-time, `var(--flux-*)` for runtime
- **Nesting:** Max 3 levels deep
- **Specificity:** Match or slightly exceed Frappe's selectors
- **`!important`:** Only for overriding Frappe `!important` rules or for critical fixes (e.g., `#freeze`)
- **Comments:** Section headers with `// ─── Section Name ───`
- **Responsive:** Mobile-first with `min-width` breakpoints

### File Naming

- JS: `flux_<module>.js`
- SCSS: `_<feature>.scss` (partials) or `flux.scss` (master)
- Images: Lowercase with hyphens: `logo-header.png`
- SVGs: Lowercase with hyphens: `brand-pattern.svg`

---

## Testing Checklist

Before merging any changes, verify:

### Visual
- [ ] Navbar displays correctly (glass effect, logo, search icon)
- [ ] Sidebar renders with correct colors and hover states
- [ ] Page head has glassmorphism effect
- [ ] Workspace page shows skyline background
- [ ] Login page has skyline, particles, and branded card
- [ ] Splash screen plays once per session
- [ ] Loading indicator shows on navigation and disappears
- [ ] Print preview has clean branded output

### Functional
- [ ] Ctrl+G opens search overlay
- [ ] Search results appear and are clickable
- [ ] ESC closes search overlay
- [ ] Notification bell animates when unseen notifications exist
- [ ] Time-aware theme switches (check `flux-day`/`flux-night` class)
- [ ] Favicons display correctly (check all sizes)

### Responsive
- [ ] Mobile (<768px): sidebar collapses, navbar adapts
- [ ] Tablet (768–1199px): layout adjusts properly
- [ ] Desktop (1200px+): full layout with sidebar

### Accessibility
- [ ] Skip link appears on Tab
- [ ] All interactive elements have focus indicators
- [ ] `prefers-reduced-motion: reduce` disables all animations
- [ ] Screen reader landmarks present (role="main")

### Performance
- [ ] Canvas effects don't cause frame drops
- [ ] No memory leaks (overlays removed from DOM)
- [ ] No console errors on page load

---

## Deployment

### Production Build

```bash
# 1. Compile SCSS with compression
cd apps/flux_theme/flux_theme/public
npx sass scss/flux.scss css/flux.css --style compressed --no-source-map

# 2. Build Frappe assets
cd ~/frappe-bench
bench build --app flux_theme --production

# 3. Clear all caches
bench --site your-site.local clear-cache

# 4. Restart
bench restart
```

### Version Bump

Update version in two places:
1. `boot.py` → `bootinfo.flux_theme.version`
2. `flux_theme.js` → `flux.config.version`

---

## Architecture Decisions

### Why IIFEs instead of ES Modules?

Frappe's `app_include_js` concatenates and serves files as-is. ES modules would require import/export support which Frappe's build system doesn't handle for included JS files. IIFEs provide isolation without build tool dependency.

### Why override `frappe.dom.freeze()` instead of CSS-only?

CSS alone (`#freeze { display: none }`) hides the overlay but doesn't prevent the freeze counter from incrementing. Overriding the JS function ensures our branded overlay replaces it entirely and the counter stays in sync.

### Why periodic cleanup instead of one-time?

Frappe's `#freeze` can be created at any time — during boot, API calls, or page transitions. Some of these happen before our JS loads. The 2-second interval catches any `#freeze` elements created between our module loading and when `frappe.dom.freeze` gets overridden.

### Why poll Awesomplete instead of MutationObserver?

MutationObserver on the Awesomplete results caused infinite loops — cloning results into our panel triggered new mutations, which triggered more cloning. Polling every 200ms with a signature check avoids this.

### Why `sessionStorage` for splash instead of `localStorage`?

`sessionStorage` is per-tab and cleared on tab close. This means the splash shows once when opening a new tab — a premium experience without being annoying on every page load. `localStorage` would show it only once ever, which loses the branding benefit.

### Why Dual-Target Injection (v16)?

Frappe v16 gutted the navbar on desktop (it only renders an announcement widget). All UI controls — search trigger, dark mode, ambient sounds, PWA install — previously injected into `.navbar-collapse .navbar-nav` which no longer exists on desktop.

The solution is **sidebar-first injection**: each control tries `.body-sidebar-bottom` first, creating sidebar-style markup with `.flux-sidebar-action` class. If the sidebar isn't found (e.g., during early boot or on mobile), it falls back to the navbar.

This dual-target approach ensures:
1. Controls appear in the v16 sidebar on desktop
2. Controls still work on mobile where navbar is full
3. Backward compatibility if running on v15

### Why `.page-main-content` + `#page-Workspaces` Dual Selectors?

Frappe v16 removed `#page-Workspaces` — workspace content now uses `.page-main-content`. All SCSS rules use both selectors (`comma-separated`) for backward compatibility. This costs nothing in CSS (dead selectors are ignored) but ensures the theme works on both v15 and v16.

### Why `.active-sidebar` Alongside `.selected`?

Frappe v16 uses `.active-sidebar` for the selected navigation item, while v15 used `.selected`. Both are styled to ensure the accent bar appears regardless of version.

---

*Last updated: 2025 — v16 compatible*
