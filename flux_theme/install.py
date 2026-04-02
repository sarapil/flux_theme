"""
Flux Theme — Post-Install Setup
Runs after `bench install-app flux_theme`.
"""

import frappe
from frappe import _


def after_install():
    """Post-installation setup for Flux Theme."""
    inject_desktop_icon()
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
