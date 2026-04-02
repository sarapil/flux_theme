# 📋 FLUX Theme — Development Log

> Complete history of development decisions, problems solved, and accumulated knowledge.
> This file captures everything from the development chat sessions so work can continue
> without referring back to conversation history.

---

## 🗓️ Session Timeline

### Session 1: Theme Creation (February 2026)

#### 📌 Decision: Create flux_theme as a Separate App
- **Context:** The TAVIRA theme was a luxury real estate theme. The FLUX theme needed to be a separate co-working space theme based on https://fluxcoworking.space/
- **Decision:** Copy tavira_theme → rename everything → rebrand colors/fonts/images
- **Rationale:** Both themes share the same architecture pattern (SCSS + JS modules + hooks) but have completely different branding and target audiences

#### 🔧 Implementation Steps
1. Copied entire `tavira_theme` directory to `flux_theme`
2. Renamed all references: tavira → flux, TAVIRA → FLUX
3. Updated color palette:
   - Gold (#DDA46F) → Green (#09B474)
   - Navy (#1D2939) → Dark (#2D3436)
   - Cream (#FFF1E7) → Light (#F0F5F3)
   - New: Red accent (#EA2424) from fluxcoworking.space
   - New: Blue (#0074A2) for info elements
4. Updated fonts: Playfair Display → Open Sans
5. Updated branding: All logos, splash screen, skyline
6. Updated DocType: TAVIRA Settings → FLUX Settings
7. pip install in development mode
8. Added to apps.txt
9. SCSS compiled, bench built

---

### Session 2: Bug Fixes & Infrastructure

#### 🐛 Bug: 500 Error — boot.py IndentationError
- **Cause:** Duplicate code block in boot.py (copy-paste artifact)
- **Fix:** Removed the duplicate `_get_settings()` function
- **Lesson:** Always verify Python files after mass rename

#### 🐛 Bug: apps.txt Corruption — "insightsflux_theme"
- **Cause:** `insights` and `flux_theme` got merged onto one line
- **Fix:** Manually separated into two lines
- **Lesson:** Be careful with automated text manipulation of apps.txt

#### 🐛 Bug: flux_theme Duplicate in apps.txt
- **Cause:** flux_theme appeared on both line 22 and line 23
- **Fix:** `awk '!seen[$0]++' apps.txt > tmp && mv tmp apps.txt`
- **Lesson:** Always check for duplicates after adding entries

#### 🐛 Bug: "module flux_theme found in apps flux_theme and flux_theme"
- **Cause:** Redis cache had stale data: `flux_theme: ['flux_theme', 'flux_theme']`
- **Fix:** `redis-cli -h redis-cache -p 6379 FLUSHDB`
- **Lesson:** Redis cache can persist invalid state across restarts

#### 🐛 Bug: flux_theme Missing from sites/apps.json
- **Cause:** `pip install -e` doesn't add to sites/apps.json automatically
- **Fix:** Python script to read apps.json, add entry, write back
- **Lesson:** sites/apps.json needs manual updating for new apps

#### 🐛 Bug: tavira_theme Missing from apps.txt
- **Cause:** apps.txt was regenerated/modified and tavira_theme was dropped
- **Fix:** `echo "tavira_theme" >> sites/apps.txt`
- **Lesson:** Multiple apps share apps.txt — verify all entries after changes

---

### Session 3: Styling Changes

#### 🎨 Change: White Navbar
- **Requirement:** Navbar should be white like fluxcoworking.space
- **Implementation:** 
  - `:root { --navbar-bg: #FFFFFF !important; }`
  - `.sticky-top .navbar { background: #FFFFFF !important; }`
  - `--icon-stroke: #333333` for dark icons on white
  - `border-bottom: 1px solid #E8E8E8`

#### 🎨 Change: Dark Page-Head (#333333)
- **Requirement:** Page-head should be dark like fluxcoworking.space
- **Implementation:**
  - `.page-head { background: #333333 !important; color: #FFFFFF; }`
  - All text, breadcrumbs, icons inside page-head → white

#### 🎨 Change: Gray Body Background (#F4F5F6)
- **Requirement:** Page was too white/empty-looking
- **Implementation:**
  - `body { background-color: #F4F5F6 !important; }`
  - `--bg-color: #F4F5F6 !important`
  - Cards remain white for contrast

#### 🎨 Change: Red Accent Links (#EA2424)
- **Requirement:** Sidebar and navbar hover links should be red like fluxcoworking.space
- **Implementation:**
  - Sidebar link hover/active: `color: #EA2424`
  - Navbar item hover backgrounds: `rgba(234, 36, 36, 0.1)`
  - `$flux-accent: #EA2424` in variables
  - Dark mode toggle hover: red border/background

---

### Session 4: Server Crisis — EADDRINUSE

#### 🐛 Critical Bug: Bench Won't Start — Port Conflict
- **Symptom:** `EADDRINUSE: address already in use :::8001` and `:::9001`
- **Duration:** Multiple hours of debugging across sessions
- **Investigation Path:**
  1. Killed all processes → ports showed free → bench start → immediately crashed
  2. Found zombie processes from Feb 4-15 (defunct honcho/bench)
  3. Discovered Redis cache had duplicate module entries → flushed
  4. Found flux_theme missing from sites/apps.json → added
  5. Still crashed → ports showed free but something kept spawning

#### 🔍 Root Cause 1: Procfile Double-Restart Wrappers
- **Problem:** The Procfile had `bash -c "while true; do ...; sleep 2; done"` wrappers around each process
- **Why it matters:** Honcho (used by `bench start`) ALREADY has its own process restart logic. Having BOTH creates a race condition where two copies of each process try to bind the same port simultaneously
- **Before (broken):**
  ```
  web: bash -c "while true; do bench serve --port 8001; echo 'crashed'; sleep 2; done"
  ```
- **After (fixed):**
  ```
  web: bench serve --port 8001
  ```
- **Fix applied to:** web, socketio, schedule, worker processes

#### 🔍 Root Cause 2: Ghost Bench Process
- **Problem:** A previous `bench start` (PID 12046, started at 13:00) was still running in the background, holding both ports 8001 and 9001
- **Fix:** Traced the full process tree: PID 12046 → 12047/12048 → 12049/12053 → 12050/12055/12114 → killed entire tree
- **Process tree:**
  ```
  12046 (honcho master)
  ├── 12047 (forkserver) → 12049 (/bin/sh) → 12050 (bench serve) → 12114 (werkzeug)
  └── 12048 (forkserver) → 12053 (/bin/sh) → 12055 (node socketio.js)
  ```

#### ✅ Resolution
After both fixes (Procfile simplified + ghost processes killed), `bench start` ran cleanly:
- web.1 → Running on http://0.0.0.0:8001 ✅
- socketio.1 → Listening on ws://0.0.0.0:9001 ✅
- watch.1 → esbuild watch mode ✅
- schedule.1 → Running ✅
- worker.1 → Running ✅

---

## 💡 Accumulated Knowledge

### Frappe Gotchas
| Issue | Detail |
|-------|--------|
| `frappe.request.on()` | **Does NOT exist** — silently fails. Use jQuery AJAX events or `frappe.after_ajax()` |
| jQuery `ajaxSend/Complete` | Fires on heartbeat/polling — unusable for loading overlays |
| `MutationObserver` on Awesomplete | Can cause infinite loops — avoid |
| `#freeze` div | Can persist if created before theme JS loads — need CSS `display:none !important` |
| Boot session | `frappe.boot.flux_theme` available after `boot_session` hook runs |
| `bench build` | Only copies public assets. SCSS must be pre-compiled |
| `apps.txt` | Order matters — frappe must be first. No blank lines. No duplicates |
| `sites/apps.json` | Must be updated separately from apps.txt |
| Redis cache | Can persist invalid module mappings across restarts — flush if weird errors |

### Procfile Rules
| Rule | Detail |
|------|--------|
| No `while true` loops | Honcho handles restarts automatically |
| Use explicit paths | `/home/frappe/.nvm/.../node` for node |
| Port config | Reads from `common_site_config.json` (`webserver_port`, `socketio_port`) |
| socketio.js | Is a wrapper that requires `./realtime` → `realtime/index.js` |

### SCSS Build Rules
| Rule | Detail |
|------|--------|
| Import order | Variables first, then typography, then component-specific |
| Compilation | `npx sass scss/flux.scss css/flux.css --style compressed --source-map` |
| DO NOT edit | `css/flux.css` — it's auto-generated |
| Dark mode | Scoped under `[data-theme="flux-dark"]` |
| RTL | Scoped under `[dir="rtl"]` |
| Specificity | Use `!important` on critical layout overrides (navbar, body bg) |

### Color Palette Reference
| Token | Hex | Usage |
|-------|-----|-------|
| `$flux-green` | `#09B474` | Primary brand color, buttons, focus rings |
| `$flux-red` / `$flux-accent` | `#EA2424` | Hover states, interactive links, accent |
| `$flux-dark` | `#2D3436` | Page-head, deep backgrounds |
| `$flux-blue` | `#0074A2` | Info color, secondary links |
| Body background | `#F4F5F6` | Neutral gray to avoid blank-white look |
| Navbar background | `#FFFFFF` | Clean white with subtle border |
| Card background | `#FFFFFF` | White cards for contrast on gray body |

---

## 🔗 Key File Relationships

```
hooks.py ─────────→ Registers all CSS/JS with Frappe
    │
    └──→ boot.py ─→ Reads "FLUX Settings" DocType
         │            │
         └──→ Returns settings to frappe.boot.flux_theme
                       │
flux_theme.js ←────────┘
    │
    ├──→ flux.config (merged with boot settings)
    ├──→ flux.init() → initializes all components
    │
    ├──→ flux_darkmode.js (reads localStorage preference)
    ├──→ flux_skyline.js (draws SVG at page bottom)
    ├──→ flux_splash.js (shows once per sessionStorage)
    ├──→ flux_navbar.js (creates search overlay)
    ├──→ flux_loading.js (overrides frappe.dom.freeze)
    └──→ ... (18 more modules)

_variables.scss ──→ All other SCSS partials
flux.scss ─────────→ Imports all 28 partials → compiles to flux.css
```

---

## 🚨 Troubleshooting Guide

### CSS Changes Not Visible
```bash
# 1. Recompile SCSS
cd apps/flux_theme/flux_theme/public
npx sass scss/flux.scss css/flux.css --style compressed --source-map

# 2. Build and clear cache
cd /workspace/development/frappe-bench
bench build --app flux_theme
bench --site dev.localhost clear-cache

# 3. Hard refresh browser
# Ctrl+Shift+R or Cmd+Shift+R
```

### Server Won't Start (EADDRINUSE)
```bash
# 1. Check what's on the ports
netstat -tlnp | grep -E '8001|9001'

# 2. Kill specific PIDs
kill -9 <PID>

# 3. Kill all bench processes
pkill -9 -f 'bench serve|bench start|bench schedule|bench worker|bench watch'
pkill -9 -f 'node.*socketio'
pkill -9 -f honcho

# 4. Wait and verify
sleep 3
netstat -tlnp | grep -E '8001|9001'

# 5. Check Procfile has no "while true" wrappers
cat Procfile

# 6. Restart
bench start
```

### Module Duplicate Warning
```bash
# Flush Redis cache
---

## 🔄 Session: Frappe v16 Migration (2026)

### Context
The bench was upgraded to Frappe v16.7.0 / ERPNext v16.6.0 (Python 3.14.2, Node v24.12.0). Both tavira_theme and flux_theme needed to be migrated from v15 to v16 compatibility.

### v16 Breaking Changes Addressed

| Change | Before (v15) | After (v16) |
|--------|--------------|-------------|
| Build system | `setup.py` | `pyproject.toml` with `flit_core` |
| Dependencies | `requirements.txt` | `[project.dependencies]` in pyproject.toml |
| Version source | `app_version` in hooks.py | `__version__` in `__init__.py` (dynamic) |
| Python requirement | `>=3.10` | `>=3.14` |
| URL routing | `/app` | `/desk` |
| DocType sort_field | `"modified"` | `"creation"` |
| App launcher | N/A | `add_to_apps_screen` hook |

### Files Changed

#### Deleted
- `setup.py` — replaced by pyproject.toml flit_core
- `requirements.txt` — deps now in pyproject.toml

#### Modified
- `pyproject.toml` — dynamic version, flit_core, bench dependencies, ruff config
- `hooks.py` — removed app_version, added add_to_apps_screen/source_link/app_home
- `__init__.py` — version "1.0.0" → "16.0.0"
- `boot.py` — version "1.0.0" → "16.0.0"
- `flux_settings.json` — sort_field "modified" → "creation"
- `flux_mobile.js` — /app → /desk URLs
- `sw.js` — cache version bump, /app → /desk
- `manifest.json` — start_url /app → /desk
- `flux_theme.js` — header comment v15 → v16
- `flux.scss` — header comment v15 → v16

#### Documentation Updated
- copilot-instructions.md, AI_SUMMARY.md, CONTEXT.md, FEATURES_EN.md, FEATURES_AR.md
- ARCHITECTURE.md, ROADMAP.md, README.md, DEVELOPMENT.md, CHANGELOG.md

### Key Learnings
- HRMS app in same bench served as reference pattern for v16 pyproject.toml structure
- `app_version` in hooks.py is gone — Frappe v16 reads version dynamically from `__init__.py`
- `add_to_apps_screen` hook is required for apps to appear in v16's app launcher
- `sort_field: "creation"` is the v16 standard (was `"modified"`)
- `bench build` shows esbuild errors for theme apps — expected since they use `app_include_js` not `.bundle.js`

---

redis-cli -h redis-cache -p 6379 FLUSHDB

# Verify apps.txt has no duplicates
sort sites/apps.txt | uniq -d

# Restart bench
bench start
```

---

> 📅 Last updated: June 2026
> 🏗️ Built by **Arkan Labs** | info@arkanlabs.com
