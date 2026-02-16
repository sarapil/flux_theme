app_name = "flux_theme"
app_title = "FLUX Theme"
app_publisher = "Arkan Labs"
app_description = "Modern co-working space theme for FLUX — Frappe 15"
app_email = "info@arkanlabs.com"
app_license = "MIT"
app_version = "1.0.0"

# ─── CSS (loads on every desk page) ───
app_include_css = [
    "/assets/flux_theme/css/flux.css"
]

# ─── JS (loads on every desk page) ───
app_include_js = [
    "/assets/flux_theme/js/flux_theme.js",
    "/assets/flux_theme/js/flux_darkmode.js",
    "/assets/flux_theme/js/flux_skyline.js",
    "/assets/flux_theme/js/flux_effects.js",
    "/assets/flux_theme/js/flux_splash.js",
    "/assets/flux_theme/js/flux_loading.js",
    "/assets/flux_theme/js/flux_sounds.js",
    "/assets/flux_theme/js/flux_workspace.js",
    "/assets/flux_theme/js/flux_navbar.js",
    "/assets/flux_theme/js/flux_forms.js",
    "/assets/flux_theme/js/flux_mobile.js",
    "/assets/flux_theme/js/flux_shortcuts.js",
    "/assets/flux_theme/js/flux_seasons.js",
    "/assets/flux_theme/js/flux_ambient.js",
    "/assets/flux_theme/js/flux_cursor.js",
    "/assets/flux_theme/js/flux_interactive_skyline.js",
    "/assets/flux_theme/js/flux_tour.js",
    "/assets/flux_theme/js/flux_presets.js",
    "/assets/flux_theme/js/flux_print_headers.js",
    "/assets/flux_theme/js/flux_minigame.js",
    "/assets/flux_theme/js/flux_animated_favicon.js",
    "/assets/flux_theme/js/flux_pwa.js",
    "/assets/flux_theme/js/flux_welcome_msg.js"
]

# ─── Website / Portal pages (includes login) ───
web_include_css = [
    "/assets/flux_theme/css/flux.css"
]

web_include_js = [
    "/assets/flux_theme/js/flux_login.js",
    "/assets/flux_theme/js/flux_skyline.js"
]

website_context = {
    "brand_name": "FLUX",
    "favicon": "/assets/flux_theme/images/favicon.ico"
}

# ─── Login page styling ───
app_logo_url = "/assets/flux_theme/images/logo-login.png"

# ─── Boot session info ───
boot_session = "flux_theme.boot.boot_session"

# Required for frappe compatibility
required_apps = ["frappe"]
