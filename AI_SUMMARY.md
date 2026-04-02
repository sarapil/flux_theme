# 🤖 FLUX Theme — AI Quick Reference Card

> **Purpose:** This file is a compact, machine-readable summary for any AI model
> (GitHub Copilot, ChatGPT, Claude, Gemini, etc.) to understand the ENTIRE app
> without reading every source file. Read this FIRST, then CONTEXT.md for deeper detail.

---

## ⚡ 30-Second Summary

**FLUX Theme** is a **Frappe v16 app** that transforms ERPNext into a modern co-working space experience. It injects **24 JavaScript modules** (6,779 lines) and **29 SCSS partials** compiled into a single CSS file (9,015 lines). It has ONE DocType (`FLUX Settings`) for no-code customization. The app is theme-only — no REST APIs, no background jobs, no data models beyond settings.

---

## 🎯 Identity

| Key | Value |
|-----|-------|
| Name | `flux_theme` |
| Framework | Frappe v16 / ERPNext v16 |
| Type | Frontend theme app (CSS + JS + Python hooks) |
| JS Pattern | ES5 IIFEs on `window.flux` namespace |
| CSS | SCSS → compiled CSS via `npx sass` |
| Python | hooks.py + boot.py only |
| Build | `pyproject.toml` with `flit_core` (no setup.py) |
| DocType | `FLUX Settings` (Single) |
| Site | `dev.localhost` at port 8001 |
| External URL | https://dev.tavira-group.com/desk |
| Publisher | Arkan Labs |
| Origin | Forked from tavira_theme, rebranded for co-working |

---

## 🎨 Color Palette (CRITICAL)

```
Primary Green:    #09B474  ($flux-green)    — buttons, focus rings, primary brand
Accent Red:       #EA2424  ($flux-accent)   — hover states, navigation links
Dark:             #2D3436  ($flux-dark)     — page-head background
Dark Text:        #333333  ($flux-text)     — navbar icons, body text
Body Background:  #F4F5F6  (--bg-color)    — neutral gray (not white)
Navbar Background:#FFFFFF  (--navbar-bg)   — clean white
Card Background:  #FFFFFF  (--card-bg)     — white cards on gray body
Info Blue:        #0074A2  ($flux-blue)     — info states
Success:          #09B474  ($flux-success)  — same as primary
Danger:           #EA2424  ($flux-danger)   — same as accent
```

---

## 📁 File Map (Key Files Only)

```
hooks.py          → Registers CSS/JS with Frappe
boot.py           → Provides settings to frontend via frappe.boot.flux_theme
_variables.scss   → ALL color tokens and CSS custom properties
_layout.scss      → Navbar (white), sidebar, page-head (dark), body (gray)
_darkmode.scss    → [data-theme="flux-dark"] overrides
_rtl.scss         → [dir="rtl"] overrides
flux.scss         → Master file that imports all 28 partials
flux_theme.js     → Main coordinator — flux.init(), flux.config
flux_darkmode.js  → Dark mode toggle
flux_skyline.js   → City skyline SVG generator (largest JS file, 1058 lines)
flux_navbar.js    → Glassmorphism search overlay
```

---

## ⚠️ Critical Rules

### DO
- Use `frappe.router.on('change', fn)` for SPA events
- Use `frappe.boot.flux_theme` for boot settings
- Use ES5 syntax (var, function, no arrow functions)
- Add safety timers on all DOM overlays
- Check `typeof frappe !== 'undefined'` before use
- Compile SCSS before `bench build`
- Flush Redis cache after structural changes

### DO NOT
- ❌ Use `frappe.request.on()` — doesn't exist in Frappe
- ❌ Use jQuery `ajaxSend/ajaxComplete` for loading — fires on heartbeat
- ❌ Edit `css/flux.css` directly — compiled from SCSS
- ❌ Use `import/export` — Frappe doesn't support ES modules in app_include_js
- ❌ Use `MutationObserver` on Awesomplete — infinite loops
- ❌ Add `while true` loops in Procfile — honcho handles restarts
- ❌ Duplicate entries in apps.txt — causes module mapping errors
- ❌ Use `setup.py` — v16 uses `pyproject.toml` with `flit_core`
- ❌ Use `/app` URLs — v16 uses `/desk`
- ❌ Call `frappe.db.commit()` from document hooks (blocked in v16)

---

## 🔧 Build Commands

```bash
# SCSS compile
cd apps/flux_theme/flux_theme/public
npx sass scss/flux.scss css/flux.css --style compressed --source-map

# Deploy
bench build --app flux_theme
bench --site dev.localhost clear-cache

# Start server
bench start
```

---

## 🗂️ For Deeper Understanding

| File | What It Covers |
|------|---------------|
| [CONTEXT.md](CONTEXT.md) | Full technical context, file-by-file reference |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Directory tree, data flow, dependency map |
| [FEATURES_EN.md](FEATURES_EN.md) | All 34 features with details |
| [FEATURES_AR.md](FEATURES_AR.md) | Same in Arabic |
| [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md) | Bug history, decisions, lessons learned |
| [ROADMAP.md](ROADMAP.md) | Future proposals and suggestions |
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | Coding conventions |

---

> 📅 Last updated: February 2026
