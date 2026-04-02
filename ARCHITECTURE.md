# 🏗️ FLUX Theme — Architecture Guide

> Technical architecture reference for developers and AI models.
> Covers file structure, dependency map, data flow, and build pipeline.

---

## 📁 Directory Structure

```
flux_theme/                          # App root (in frappe-bench/apps/)
├── .github/
│   └── copilot-instructions.md      # 🤖 AI assistant instructions
├── .gitignore                       # 🚫 Git ignore rules
├── ARCHITECTURE.md                  # 🏗️ This file
├── CHANGELOG.md                     # 📋 Version history
├── CONTEXT.md                       # 🤖 AI-friendly technical context
├── DEVELOPMENT.md                   # 🔧 Developer guide
├── DEVELOPMENT_LOG.md               # 📋 Chat/session development log
├── FEATURES_AR.md                   # 📖 Features in Arabic
├── FEATURES_EN.md                   # 📖 Features in English
├── AI_SUMMARY.md                    # 🤖 Quick AI reference card
├── README.md                        # 📖 Main documentation
├── ROADMAP.md                       # 🗺️ Feature proposals & roadmap
├── license.txt                      # 📝 MIT License
├── requirements.txt                 # 🐍 Python dependencies
├── pyproject.toml                    # 📦 Build config (flit_core, v16)
├── .gitignore                        # 🚫 Git ignore rules
│
└── flux_theme/                      # Python module root
    ├── __init__.py                  # Module init
    ├── hooks.py                     # ⚙️ Frappe hook registration
    ├── boot.py                      # 🚀 Boot session data provider
    ├── modules.txt                  # 📋 Module: "FLUX Theme"
    ├── config/
    │   ├── __init__.py
    │   └── desktop.py               # Desktop icon config
    │
    ├── flux_theme/                   # DocType module
    │   ├── __init__.py
    │   ├── doctype/
    │   │   ├── __init__.py
    │   │   └── flux_settings/       # ⚙️ FLUX Settings Single DocType
    │   │       ├── __init__.py
    │   │       ├── flux_settings.json   # Field definitions
    │   │       ├── flux_settings.py     # Controller (empty)
    │   │       └── flux_settings.js     # Client script (empty)
    │   └── workspace/
    │       └── flux_co_working_space/
    │           └── flux_co_working_space.json  # Workspace definition
    │
    ├── public/                       # 📂 Static assets (symlinked to sites/assets/)
    │   ├── manifest.json             # PWA manifest
    │   ├── sw.js                     # Service Worker
    │   ├── css/
    │   │   └── flux.css              # 🎨 Compiled CSS (DO NOT EDIT)
    │   │   └── flux.css.map          # Source map
    │   ├── js/                       # 📜 24 JavaScript modules
    │   │   ├── flux_theme.js         # 🎯 Main entry point & coordinator
    │   │   ├── flux_darkmode.js      # 🌓 Dark mode toggle
    │   │   ├── flux_skyline.js       # 🌃 City skyline SVG generator
    │   │   ├── flux_effects.js       # ✨ Canvas visual effects
    │   │   ├── flux_splash.js        # 💫 Splash screen
    │   │   ├── flux_loading.js       # ⏳ Loading indicator
    │   │   ├── flux_navbar.js        # 🔍 Search overlay
    │   │   ├── flux_forms.js         # 📝 Form enhancements
    │   │   ├── flux_mobile.js        # 📱 Mobile bottom nav
    │   │   ├── flux_shortcuts.js     # ⌨️ Keyboard shortcuts
    │   │   ├── flux_seasons.js       # 🌙 Seasonal variants
    │   │   ├── flux_ambient.js       # 🎵 Ambient sounds
    │   │   ├── flux_cursor.js        # ✨ Cursor trail
    │   │   ├── flux_interactive_skyline.js  # 🏙️ Clickable landmarks
    │   │   ├── flux_tour.js          # 🎓 Onboarding tour
    │   │   ├── flux_presets.js       # 🎨 Color presets
    │   │   ├── flux_print_headers.js # 🖨️ Print headers
    │   │   ├── flux_minigame.js      # 🎮 Loading mini-game
    │   │   ├── flux_animated_favicon.js  # ✨ Animated favicon
    │   │   ├── flux_pwa.js           # 📲 PWA support
    │   │   ├── flux_welcome_msg.js   # 👋 Welcome messages
    │   │   ├── flux_login.js         # 🔐 Login page
    │   │   ├── flux_sounds.js        # 🔊 Sound effects
    │   │   └── flux_workspace.js     # 🏢 Workspace widgets
    │   ├── scss/                     # 🎨 29 SCSS source files
    │   │   ├── flux.scss             # Master file (imports all)
    │   │   ├── _variables.scss       # Design tokens & CSS custom props
    │   │   ├── _typography.scss      # Font definitions
    │   │   ├── _animations.scss      # Keyframe animations
    │   │   ├── _buttons.scss         # Button styles
    │   │   ├── _forms.scss           # Form input styles
    │   │   ├── _layout.scss          # 🏗️ Navbar, sidebar, page-head, body
    │   │   ├── _tables.scss          # Table & list view styles
    │   │   ├── _cards.scss           # Card component styles
    │   │   ├── _modals.scss          # Modal/dialog styles
    │   │   ├── _login.scss           # Login page styles
    │   │   ├── _splash.scss          # Splash screen styles
    │   │   ├── _darkmode.scss        # Dark mode overrides
    │   │   ├── _rtl.scss             # RTL layout overrides
    │   │   ├── _form-enhancements.scss  # Form view enhancements
    │   │   ├── _reports.scss         # Report view theming
    │   │   ├── _mobile-nav.scss      # Mobile bottom nav
    │   │   ├── _transitions.scss     # Page transition animations
    │   │   ├── _charts.scss          # Chart color overrides
    │   │   ├── _shortcuts.scss       # Keyboard shortcuts panel
    │   │   ├── _seasons.scss         # Seasonal theme variants
    │   │   ├── _avatars.scss         # Avatar enhancements
    │   │   ├── _print.scss           # Print styles
    │   │   ├── _ambient.scss         # Ambient sound panel
    │   │   ├── _interactive-skyline.scss  # Skyline hotspots
    │   │   ├── _tour.scss            # Onboarding tour
    │   │   ├── _presets.scss         # Color preset picker
    │   │   ├── _minigame.scss        # Loading mini-game
    │   │   └── _welcome-msg.scss     # Welcome message overlay
    │   ├── images/                   # Logo, favicon, splash images
    │   └── svg/                      # SVG assets (skyline, patterns)
    │
    ├── templates/
    │   ├── emails/
    │   │   ├── flux_email_template.html   # Jinja email macro template
    │   │   └── flux_notification.html     # Notification email template
    │   └── includes/
    │       └── splash_screen.html         # Splash screen HTML
    │
    └── www/                          # Website override pages
        ├── 403.html                  # Custom 403 page
        ├── 404.html                  # Custom 404 page
        └── error.html                # Custom 500 page
```

---

## 🔄 Data Flow

### Boot Sequence
```
1. User navigates to site
2. Frappe loads desk.html
3. hooks.py registers CSS/JS files
4. boot.py → boot_session() called
   ├── Reads "FLUX Settings" DocType
   └── Returns settings to bootinfo.flux_theme
5. Browser loads flux.css (compiled SCSS)
6. Browser loads JS files in order:
   ├── flux_theme.js (main coordinator)
   │   ├── flux.init() called
   │   ├── Reads frappe.boot.flux_theme
   │   ├── Merges into flux.config
   │   └── Initializes components
   ├── flux_darkmode.js
   ├── flux_skyline.js
   ├── flux_effects.js
   ├── flux_splash.js (once per session)
   ├── flux_loading.js (overrides freeze/unfreeze)
   ├── flux_navbar.js (search overlay)
   └── ... (remaining modules)
```

### CSS Cascade
```
Frappe default CSS → Bootstrap → ERPNext → flux.css (wins via specificity + !important)
```

### JS Module Loading
```
All JS files are IIFEs that attach to window.flux namespace:
  window.flux = {
    config: { ... },
    settings: { ... },       // from boot session
    init: fn,
    darkmode: { ... },       // from flux_darkmode.js
    skyline: { ... },        // from flux_skyline.js
    search: { ... },         // from flux_navbar.js
    splash: { ... },         // from flux_splash.js
    sounds: { ... },         // from flux_sounds.js
    ambient: { ... },        // from flux_ambient.js
    presets: { ... },        // from flux_presets.js
    welcomeTour: { ... },    // from flux_tour.js
    printHeaders: { ... },   // from flux_print_headers.js
    ...
  }
```

---

## 🔗 Dependency Map

### Internal Dependencies
```
_variables.scss ──→ ALL other SCSS files (imports first)
flux.scss ──→ imports all 28 partials in order
flux_theme.js ──→ flux.config used by all other JS modules
boot.py ──→ reads "FLUX Settings" DocType → feeds flux_theme.js
hooks.py ──→ registers everything with Frappe
```

### External Dependencies
```
Frappe v16 (required_apps = ["frappe"])
├── frappe.boot (boot session data)
├── frappe.router (SPA navigation events)
├── frappe.dom.freeze/unfreeze (overridden)
├── frappe.after_ajax() (AJAX lifecycle)
├── jQuery (loaded by Frappe)
├── Awesomplete (search autocomplete)
└── Bootstrap 5 (grid, utilities)
```

### No Dependencies On
```
✗ ERPNext (works without it)
✗ Any npm packages (no node_modules)
✗ Any external CDN or API
✗ Any database models (except FLUX Settings)
```

---

## 🏭 Build Pipeline

### SCSS → CSS Compilation
```bash
cd apps/flux_theme/flux_theme/public
npx sass scss/flux.scss css/flux.css --style compressed --source-map
```

**Flow:**
```
scss/flux.scss
  ├── @import '_variables'     (tokens)
  ├── @import '_typography'    (fonts)
  ├── @import '_animations'    (keyframes)
  ├── @import '_buttons'
  ├── @import '_forms'
  ├── @import '_layout'        (navbar, sidebar, page-head)
  ├── @import '_tables'
  ├── @import '_cards'
  ├── @import '_modals'
  ├── @import '_login'
  ├── @import '_splash'
  ├── @import '_darkmode'      (dark mode overrides)
  ├── @import '_rtl'           (RTL overrides)
  ├── ... (14 more partials)
  └── Global overrides (indicator pills, timeline, tags, etc.)
       ↓
css/flux.css (compressed, ~9000+ lines minified)
```

### Asset Deployment
```bash
bench build --app flux_theme
# Copies public/* → sites/assets/flux_theme/*
# Creates JS bundles

bench --site dev.localhost clear-cache
# Clears server-side Redis cache
```

### Full Rebuild
```bash
cd /workspace/development/frappe-bench
cd apps/flux_theme/flux_theme/public
npx sass scss/flux.scss css/flux.css --style compressed --source-map
cd /workspace/development/frappe-bench
bench build --app flux_theme
bench --site dev.localhost clear-cache
```

---

## 🎨 CSS Architecture

### Specificity Strategy
```
Level 1: CSS Custom Properties (:root { --flux-* })
Level 2: Class selectors (.navbar, .sidebar, .page-head)
Level 3: !important on critical overrides (navbar bg, body bg)
Level 4: Dark mode via [data-theme="flux-dark"] attribute
Level 5: RTL via [dir="rtl"] attribute
Level 6: Seasonal via body.flux-season-* classes
Level 7: Presets via runtime CSS custom property overrides
```

### Naming Conventions
```
SCSS variables:    $flux-green, $flux-dark, $flux-radius-md
CSS custom props:  --flux-green, --flux-dark, --flux-radius-md
CSS classes:       .flux-search-overlay, .flux-loading-visible
Body classes:      .flux-day, .flux-night, .flux-season-ramadan
DOM IDs:           #flux-search-overlay, #flux-splash
```

---

## 📜 JavaScript Architecture

### Module Pattern
Every JS file follows the same IIFE pattern:
```javascript
(function() {
    'use strict';
    window.flux = window.flux || {};
    
    // Module namespace
    flux.moduleName = {};
    
    // Private functions (prefixed with _)
    function _privateHelper() { ... }
    
    // Public API
    flux.moduleName.init = function() { ... };
    flux.moduleName.publicMethod = function() { ... };
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', flux.moduleName.init);
    } else {
        flux.moduleName.init();
    }
})();
```

### ES5 Compatibility
All code uses ES5 syntax for maximum compatibility:
- `var` instead of `let/const`
- `function()` instead of `() =>`
- `'string ' + variable` instead of template literals
- `.forEach()` instead of `for...of`

### Safety Patterns
- All DOM overlays have `setTimeout` safety timers
- All `MutationObserver` instances have disconnect timers
- Image elements have `onerror` fallback handlers
- `typeof frappe !== 'undefined'` checks before using Frappe globals

---

## 🗄️ Database Schema

### FLUX Settings (Single DocType)
```
DocType: FLUX Settings (issingle = 1)
┌─────────────────────┬─────────────┬──────────────────┐
│ Field               │ Type        │ Default          │
├─────────────────────┼─────────────┼──────────────────┤
│ brand_name          │ Data        │ "FLUX"           │
│ logo_url            │ Attach Image│ logo-header.png  │
│ favicon_url         │ Attach Image│ favicon.ico      │
│ primary_color       │ Color       │ #09B474          │
│ secondary_color     │ Color       │ #2D3436          │
│ accent_color        │ Color       │ #F0F5F3          │
│ enable_splash_screen│ Check       │ 1                │
│ enable_skyline      │ Check       │ 1                │
│ enable_particles    │ Check       │ 1                │
│ enable_sounds       │ Check       │ 0                │
│ enable_search_overlay│ Check      │ 1                │
│ default_dark_mode   │ Check       │ 0                │
│ splash_duration     │ Int         │ 2800             │
│ splash_logo_url     │ Attach Image│ (empty)          │
│ custom_css          │ Code        │ (empty)          │
│ custom_js           │ Code        │ (empty)          │
└─────────────────────┴─────────────┴──────────────────┘
```

---

## 🌐 Environment Configuration

### Development
```json
// sites/common_site_config.json
{
  "webserver_port": 8001,
  "socketio_port": 9001,
  "developer_mode": 1
}

// sites/dev.localhost/site_config.json
{
  "host_name": "http://dev.localhost:8001",
  "theme": "tavira_theme"
}
```

### Procfile (bench start)
```
web: bench serve --port 8001
socketio: /home/frappe/.nvm/.../node apps/frappe/socketio.js
watch: bench watch
schedule: bench schedule
worker: bench worker
```

---

## 🔗 Related Documentation

- 📖 [Features (English)](FEATURES_EN.md) | [Features (Arabic)](FEATURES_AR.md)
- 🤖 [AI Context](CONTEXT.md)
- 🗺️ [Roadmap](ROADMAP.md)
- 📋 [Development Log](DEVELOPMENT_LOG.md)
- 🤖 [Copilot Instructions](.github/copilot-instructions.md)

---

> 📅 Last updated: February 2026
> 🏗️ Built by **Arkan Labs** | info@arkanlabs.com
