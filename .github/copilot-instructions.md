# FLUX Theme — Copilot Instructions

> Context file for GitHub Copilot, Claude, ChatGPT, and other AI assistants.
> Read AI_SUMMARY.md first for a quick overview. This file covers coding conventions.

## Project Overview

**FLUX Theme** is a modern co-working space branding theme for Frappe v16 / ERPNext v16. It injects CSS overrides and standalone JavaScript modules to transform ERPNext into the FLUX brand experience. Based on https://fluxcoworking.space/ design language. It has ONE DocType (`FLUX Settings`) for no-code customization.

## Architecture

- **Framework:** Frappe v16 (Python 3.14+, Node 24+)
- **App Type:** Theme + one Single DocType (FLUX Settings)
- **JavaScript:** ES5 IIFEs wrapping `flux.*` namespace methods (24 files, 6,779 lines)
- **Styles:** SCSS compiled to CSS (29 partials, 9,015 lines)
- **Python:** Only `hooks.py` (asset registration) and `boot.py` (session data)
- **Build:** `pyproject.toml` with `flit_core` (no setup.py)
- **Origin:** Forked from `tavira_theme`, completely rebranded

## File Locations

- **App root:** `frappe-bench/apps/flux_theme/`
- **Python module:** `flux_theme/flux_theme/`
- **Public assets:** `flux_theme/flux_theme/public/`
- **JavaScript:** `public/js/flux_*.js` (24 files)
- **SCSS source:** `public/scss/*.scss` (29 partials + 1 master)
- **Compiled CSS:** `public/css/flux.css` (auto-generated, DO NOT EDIT)
- **Images:** `public/images/`
- **SVGs:** `public/svg/`
- **DocType:** `flux_theme/flux_theme/doctype/flux_settings/`

## Coding Conventions

### JavaScript
- Use IIFE pattern: `(function() { 'use strict'; /* ... */ })();`
- Attach all exports to `window.flux.*` namespace
- Use ES5 syntax: `var`, `function()`, `.forEach()` — NO arrow functions or template literals
- Always check `typeof frappe !== 'undefined'` before using Frappe globals
- Add safety timers on any DOM overlay (`setTimeout` to auto-remove)
- Respect `prefers-reduced-motion` via `flux.prefersReducedMotion()`
- Prefix private methods with `_` (e.g., `_cleanupFrappeFreeze`)

### SCSS
- Use `$flux-*` SCSS variables for all colors, transitions, shadows
- Use `var(--flux-*)` CSS custom properties for runtime-dynamic values
- Use provided mixins: `flux-glass`, `flux-card-elevated`, `flux-green-glow`, `flux-focus-ring`
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
- Always add `onerror` handlers on `<img>` elements
- Test with `prefers-reduced-motion: reduce` enabled
- Compile SCSS before running `bench build`
- Flush Redis cache after structural changes

### DO NOT
- **Never** use `frappe.request.on('before'/'after')` — it doesn't exist in Frappe
- **Never** modify Frappe or ERPNext core files
- **Never** use jQuery `ajaxSend/ajaxComplete` for loading overlays (fires on heartbeat)
- **Never** use `MutationObserver` on Awesomplete results (infinite loops)
- **Never** edit `public/css/flux.css` directly — compiled from SCSS
- **Never** use ES6 `import/export` syntax — Frappe doesn't support ES modules in app_include_js
- **Never** add `while true` loops in Procfile — honcho handles restarts
- **Never** duplicate entries in `apps.txt`
- **Never** use `setup.py` — v16 uses `pyproject.toml` with `flit_core`
- **Never** use `/app` URLs — v16 routes to `/desk`
- **Never** call `frappe.db.commit()` from document hooks (blocked in v16)
- **Never** compare single DocType values as strings — v16 casts them properly

## Color Tokens (CURRENT — February 2026)

### Primary Palette
```
Green:         #09B474  ($flux-green, --flux-green)
Green Light:   #3DD99A  ($flux-green-light)
Green Dark:    #067A4E  ($flux-green-dark)
Dark:          #2D3436  ($flux-dark, --flux-dark)
Dark Light:    #3D4F51  ($flux-dark-light)
Dark Deep:     #1A2526  ($flux-dark-deep)
Light:         #F0F5F3  ($flux-light)
Text:          #333333  ($flux-text)
```

### Accent Colors
```
Red Accent:    #EA2424  ($flux-red, $flux-accent, --flux-accent)
Blue Info:     #0074A2  ($flux-blue, --flux-blue)
```

### Layout Colors
```
Body BG:       #F4F5F6  (--bg-color) — neutral gray, not white
Navbar BG:     #FFFFFF  (--navbar-bg) — white with #E8E8E8 border
Page-head BG:  #333333  — dark with white text/icons
Card BG:       #FFFFFF  (--card-bg) — white for contrast
Icon Stroke:   #333333  — dark on white navbar
```

## Build Commands

```bash
# SCSS compile
cd apps/flux_theme/flux_theme/public
npx sass scss/flux.scss css/flux.css --style compressed --source-map

# Frappe build + clear cache
bench build --app flux_theme
bench --site dev.localhost clear-cache

# Full rebuild (one-liner)
cd apps/flux_theme/flux_theme/public && npx sass scss/flux.scss css/flux.css --style compressed --source-map && cd /workspace/development/frappe-bench && bench build --app flux_theme && bench --site dev.localhost clear-cache
```

## Environment

- **Site:** dev.localhost
- **Web port:** 8001
- **Socket.IO port:** 9001
- **Redis cache:** redis-cache:6379
- **External URL:** https://dev.tavira-group.com/desk
- **Developer mode:** enabled

## Key Frappe 16 APIs Used

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

## v16 Migration Notes

- `/app` URLs now redirect to `/desk` — all mobile nav and PWA links updated
- `setup.py` removed — `pyproject.toml` with `flit_core` is the sole build config
- `requirements.txt` removed — dependencies declared in `pyproject.toml`
- DocType `sort_field` changed from `modified` to `creation` (v16 default)
- `add_to_apps_screen` hook added for v16 app launcher
- `source_link` and `app_home` hooks added
- `app_version` removed from hooks (version read dynamically from `__init__.py`)
- SW and PWA manifest use `/desk` instead of `/app`
- `db.get_value` on single DocTypes now returns properly cast values (not strings)

## Documentation Files

| File | Purpose |
|------|---------|
| `AI_SUMMARY.md` | Quick 1-page reference for AI models |
| `CONTEXT.md` | Deep technical context with file-by-file reference |
| `ARCHITECTURE.md` | Directory tree, data flow, build pipeline |
| `FEATURES_EN.md` | All 34 features in English |
| `FEATURES_AR.md` | All 34 features in Arabic |
| `DEVELOPMENT_LOG.md` | Bug history, decisions, lessons learned |
| `ROADMAP.md` | Future proposals |
| `CHANGELOG.md` | Version history |
| `.github/copilot-instructions.md` | This file |
