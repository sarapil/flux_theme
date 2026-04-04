app_name = "flux_theme"
app_title = "FLUX Theme"
app_publisher = "Arkan Labs"
app_description = "Modern co-working space theme for FLUX Co-Working Space — Frappe 16"
app_email = "info@arkanlabs.com"
app_license = "MIT"
source_link = "https://github.com/ArkAnLabs/flux_theme"
app_home = "/desk"

# ─── v16 App Launcher ───
add_to_apps_screen = [
	{
		"name": "flux_theme",
		"logo": "/assets/flux_theme/images/logo-header.png",
		"title": "FLUX Theme",
		"route": "/desk/flux-settings",
	}
]

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
    "/assets/flux_theme/js/flux_topbar.js",
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
    "/assets/flux_theme/js/flux_desktop.js",
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

# ─── Post-Migration Seed ───
after_migrate = ["flux_theme.seed.seed_data"]

required_apps = ["frappe", "frappe_visual", "arkan_help"]

# CAPS Integration — Capability-Based Access Control
# ------------------------------------------------------------
caps_capabilities = [
    {"name": "FT_manage_theme", "category": "Module", "description": "Configure Flux Theme settings"},
    {"name": "FT_customize_design", "category": "Action", "description": "Customize design tokens and styles"},
    {"name": "FT_manage_assets", "category": "Action", "description": "Upload and manage theme assets"},
]

# Fixtures
# --------------------------------------------------------
fixtures = [
    {"dt": "Custom Field", "filters": [["module", "=", "FLUX Theme"]]},
    {"dt": "Desktop Icon", "filters": [["app", "=", "flux_theme"]]},
    {"dt": "Workspace", "filters": [["module", "like", "FLUX Theme%"]]},
]

app_icon = "/assets/flux_theme/images/flux_theme-logo.svg"
app_color = "#7C3AED"
app_logo_url = "/assets/flux_theme/images/flux_theme-logo.svg"

after_install = "flux_theme.install.after_install"

# Website Route Rules
# --------------------------------------------------------
website_route_rules = [
    {"from_route": "/flux-theme/<path:app_path>", "to_route": "flux-theme/<app_path>"},
]
