import frappe

def boot_session(bootinfo):
    """Add FLUX theme settings to boot session for JS consumption."""
    settings = _get_settings()
    settings["version"] = "16.0.0"
    bootinfo.flux_theme = settings


def _get_settings():
    """Read FLUX Settings DocType, with safe fallback defaults."""
    defaults = {
        "brand_name": "FLUX",
        "logo_url": "/assets/flux_theme/images/logo-header.png",
        "favicon_url": "/assets/flux_theme/images/favicon.ico",
        "primary_color": "#09B474",
        "secondary_color": "#2D3436",
        "accent_color": "#F0F5F3",
        "enable_splash_screen": 1,
        "enable_skyline": 1,
        "enable_particles": 1,
        "enable_sounds": 0,
        "enable_search_overlay": 1,
        "default_dark_mode": 0,
        "splash_duration": 2800,
        "splash_logo_url": "",
        "custom_css": "",
        "custom_js": "",
    }
    try:
        doc = frappe.get_single("FLUX Settings")
        return {
            "brand_name": doc.brand_name or defaults["brand_name"],
            "logo_url": doc.logo_url or defaults["logo_url"],
            "favicon_url": doc.favicon_url or defaults["favicon_url"],
            "primary_color": doc.primary_color or defaults["primary_color"],
            "secondary_color": doc.secondary_color or defaults["secondary_color"],
            "accent_color": doc.accent_color or defaults["accent_color"],
            "enable_splash_screen": doc.enable_splash_screen,
            "enable_skyline": doc.enable_skyline,
            "enable_particles": doc.enable_particles,
            "enable_sounds": doc.enable_sounds,
            "enable_search_overlay": doc.enable_search_overlay,
            "default_dark_mode": doc.default_dark_mode,
            "splash_duration": doc.splash_duration or defaults["splash_duration"],
            "splash_logo_url": doc.splash_logo_url or "",
            "custom_css": doc.custom_css or "",
            "custom_js": doc.custom_js or "",
        }
    except Exception:
        return defaults
