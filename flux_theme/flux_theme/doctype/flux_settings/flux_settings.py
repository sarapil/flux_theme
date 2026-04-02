# Copyright (c) 2026, Arkan Labs and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class FLUXSettings(Document):
	"""FLUX Theme Settings - Single DocType for runtime theme customization."""

	def validate(self):
		"""Validate settings before saving."""
		if self.splash_duration and self.splash_duration < 500:
			frappe.throw("Splash duration must be at least 500ms")
		if self.splash_duration and self.splash_duration > 10000:
			frappe.throw("Splash duration must not exceed 10000ms")

	def on_update(self):
		"""Clear cache when settings are updated so changes take effect."""
		frappe.clear_cache()


@frappe.whitelist()
def get_flux_settings():
	"""Return FLUX settings as dict for boot/JS consumption."""
	frappe.only_for(["System Manager"])
	try:
		doc = frappe.get_single("FLUX Settings")
		return {
			"brand_name": doc.brand_name or "FLUX",
			"logo_url": doc.logo_url or "/assets/flux_theme/images/logo-header.png",
			"favicon_url": doc.favicon_url or "/assets/flux_theme/images/favicon.ico",
			"primary_color": doc.primary_color or "#09B474",
			"secondary_color": doc.secondary_color or "#2D3436",
			"accent_color": doc.accent_color or "#F0F5F3",
			"enable_splash_screen": doc.enable_splash_screen,
			"enable_skyline": doc.enable_skyline,
			"enable_particles": doc.enable_particles,
			"enable_sounds": doc.enable_sounds,
			"enable_search_overlay": doc.enable_search_overlay,
			"default_dark_mode": doc.default_dark_mode,
			"splash_duration": doc.splash_duration or 2800,
			"splash_logo_url": doc.splash_logo_url or "",
			"custom_css": doc.custom_css or "",
			"custom_js": doc.custom_js or "",
		}
	except Exception:
		# Fallback defaults if DocType not yet installed
		return {
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
