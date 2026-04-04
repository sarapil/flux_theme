# Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
# Developer Website: https://arkan.it.com
# License: MIT
# For license information, please see license.txt

"""
Flux Theme — Seed Data
Runs on `after_migrate` to ensure reference data exists.
"""

import frappe


def seed_data():
    """Idempotent seed — safe to run multiple times."""
    frappe.logger().info("Flux Theme: seed_data() — no reference data needed for theme app")
