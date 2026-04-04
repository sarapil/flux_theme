# Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
# Developer Website: https://arkan.it.com
# License: MIT
# For license information, please see license.txt

"""
Flux Theme — Post-Install Setup
Runs after `bench install-app flux_theme`.
"""

import frappe
from frappe import _


def after_install():
    """Post-installation setup for Flux Theme."""
    # ── Desktop Icon injection (Frappe v16 /desk) ──
    from flux_theme.desktop_utils import inject_app_desktop_icon
    inject_app_desktop_icon(
        app="flux_theme",
        label="FLUX Theme",
        route="/desk/flux-settings",
        logo_url="/assets/flux_theme/images/flux_theme-logo.svg",
        bg_color="#7C3AED",
    )
    print(f"✅ {_("Flux Theme")}: post-install complete")


def inject_desktop_icon():
    """Create desktop shortcut icon for Flux Theme."""
    if frappe.db.exists("Desktop Icon", {"module_name": "Flux Theme"}):
        return

    try:
        frappe.get_doc({
            "doctype": "Desktop Icon",
            "module_name": "Flux Theme",
            "label": _("Flux Theme"),
            "icon": "octicon octicon-bookmark",
            "color": "#7C3AED",
            "type": "module",
            "standard": 1,
        }).insert(ignore_permissions=True)
    except Exception:
        pass  # May not exist in all Frappe versions
