# FLUX Theme — Copilot Instructions

> Context file for GitHub Copilot and other AI assistants working in this codebase.

## Project Overview

**FLUX Theme** is a pure frontend branding theme for Frappe v15 / ERPNext v15. It injects CSS overrides and standalone JavaScript to transform ERPNext into a modern co-working space experience. There are no DocTypes, no database models, no REST APIs — only hooks.py, boot.py, SCSS, JavaScript, and images.

## Architecture

- **Framework:** Frappe v15 (NOT Frappe v14 or earlier)
- **App Type:** Theme-only (no DocTypes, no server-side logic beyond hooks/boot)
- **JavaScript:** ES5 IIFEs wrapping `flux.*` namespace methods
- **Styles:** SCSS compiled to CSS, using `$flux-*` variables and `var(--flux-*)` custom properties
- **Python:** Only `hooks.py` (asset registration) and `boot.py` (session data)

## File Locations

- **App root:** `frappe-bench/apps/flux_theme/`
- **Python module:** `flux_theme/flux_theme/`
- **Public assets:** `flux_theme/flux_theme/public/`
- **JavaScript:** `public/js/flux_*.js` (7 files)
- **SCSS source:** `public/scss/*.scss` (12 partials + 1 master)
- **Compiled CSS:** `public/css/flux.css` (auto-generated, do not edit)
- **Images:** `public/images/`
- **SVGs:** `public/svg/`

## Coding Conventions

### JavaScript
- Use IIFE pattern: `(function() { 'use strict'; /* ... */ })();`
- Attach all exports to `window.flux.*` namespace
- Prefer ES5 syntax (`var`, `function()`, `.forEach()`) — no arrow functions or template literals in critical code paths
- Always check `typeof frappe !== 'undefined'` before using Frappe globals
- Add safety timers on any DOM overlay (setTimeout to auto-remove)
- Respect `prefers-reduced-motion` via `flux.prefersReducedMotion()`
- Prefix private methods with `_` (e.g., `_cleanupFrappeFreeze`)

### SCSS
- Use `$flux-*` SCSS variables for all colors, transitions, shadows
- Use `var(--flux-*)` CSS custom properties for runtime-dynamic values
- Use provided mixins: `flux-glass`, `flux-card-elevated`, `flux-gold-glow`, `flux-focus-ring`
- Max nesting depth: 3 levels
- Section comments: `// ─── Section Name ───`
- Import new partials in `flux.scss` in dependency order

### Naming
- JS files: `flux_<module>.js`
- SCSS partials: `_<feature>.scss`
- DOM IDs: `flux-<feature>-<element>` (e.g., `#flux-search-overlay`)
- CSS classes: `flux-<feature>-<modifier>` (e.g., `.flux-loading-visible`)
- Body classes: `flux-<state>` (e.g., `.flux-day`, `.flux-night`)

## Critical Knowledge

### DO
- Use `frappe.router.on('change', fn)` for SPA navigation events
- Use `frappe.after_ajax(fn)` to run code after pending requests complete
- Use `frappe.boot.flux_theme` to access boot session data
- Use `frappe.dom.freeze/unfreeze` (overridden by our loading module)
- Always add `onerror` handlers on `<img>` elements (fallback if images missing)
- Test with `prefers-reduced-motion: reduce` enabled

### DO NOT
- **Never** use `frappe.request.on('before'/'after')` — it doesn't exist in Frappe 15
- **Never** modify Frappe or ERPNext core files
- **Never** create DocTypes in this app (it's theme-only)
- **Never** use jQuery `ajaxSend/ajaxComplete` for loading overlays (fires on heartbeat/polling, never disappears)
- **Never** use MutationObserver on Awesomplete results (causes infinite loops)
- **Never** edit `public/css/flux.css` directly — it's compiled from SCSS
- **Never** use ES6 `import/export` syntax — Frappe's `app_include_js` doesn't support it

## Color Tokens

```
Gold:       #DDA46F  (--flux-gold)
Gold Light: #E8BE94  (--flux-gold-light)
Gold Dark:  #A56D29  (--flux-gold-dark)
Navy:       #1D2939  (--flux-navy)
Navy Light: #2A3A4D  (--flux-navy-light)
Navy Deep:  #111827  (--flux-navy-deep)
Cream:      #FFF1E7  (--flux-cream)
Cream Warm: #FDE8D6  (--flux-cream-warm)
Cream Cool: #FAF5F0  (--flux-cream-cool)
```

## Build Commands

```bash
# SCSS compile
cd apps/flux_theme/flux_theme/public
npx sass scss/flux.scss css/flux.css --style compressed --source-map

# Frappe build
bench build --app flux_theme

# Clear cache
bench --site dev.localhost clear-cache
```

## Module Dependency Order

```
flux_theme.js     → Must be FIRST (sets up namespace)
flux_skyline.js   → Before splash and login (they use skyline.create)
flux_effects.js   → Independent
flux_splash.js    → After skyline
flux_loading.js   → After theme (uses namespace)
flux_navbar.js    → After theme (uses namespace)
flux_login.js     → After skyline (web_include_js, separate from desk)
```

## Key Frappe 15 APIs Used

```javascript
frappe.router.on('change', fn)      // SPA navigation
frappe.after_ajax(fn)                // After AJAX completion
frappe.dom.freeze(msg)               // Loading overlay (we override this)
frappe.dom.unfreeze()                // Remove loading (we override this)
frappe.boot                          // Boot session data
frappe.ready(fn)                     // Framework ready callback
frappe.call({method, args, callback}) // API call
$(document).on('toolbar_setup', fn)  // Toolbar rendered event
```

## Documentation Files

- `README.md` — User-facing documentation with features, installation, customization
- `CONTEXT.md` — Comprehensive AI-readable technical context (file-by-file)
- `DEVELOPMENT.md` — Developer guide with workflow, patterns, debugging
- `ROADMAP.md` — Feature proposals and completed items tracking
- `CHANGELOG.md` — Version history
- `.github/copilot-instructions.md` — This file
