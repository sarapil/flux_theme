/**
 * FLUX Theme — Minimal Top Navbar + Sidebar Notification Icon
 *
 * Injects a slim brand-only topbar at the top of the screen,
 * and adds a notification bell icon into the sidebar-bottom action row.
 */

(function () {
	"use strict";

	window.flux = window.flux || {};

	flux.topbar = {
		_initialized: false,

		/* ──────────────── Bootstrap ──────────────── */
		init: function () {
			if (this._initialized) return;

			if (!document.querySelector(".body-sidebar") || !frappe || !frappe.session || !frappe.session.user) {
				setTimeout(function () { flux.topbar.init(); }, 300);
				return;
			}

			this.createTopbar();
			this.injectNotificationIcon();
			this.adjustLayout();
			this._initialized = true;
		},

		/* ══════════════════════════════════════════
		   BUILD the topbar — Brand only
		   ══════════════════════════════════════════ */
		createTopbar: function () {
			if (document.getElementById("flux-topbar")) return;

			var header = document.createElement("header");
			header.id = "flux-topbar";
			header.className = "flux-topbar";
			header.innerHTML =
				'<div class="topbar-container">' +
				'  <div class="topbar-left">' +
				'    <a class="topbar-brand" href="/desk">' +
				'      <img src="/assets/flux_theme/images/logo-header.png" ' +
				'           alt="FLUX" class="topbar-logo" ' +
				'           style="height:28px;max-height:28px;max-width:120px;width:auto;object-fit:contain;" ' +
				'           onerror="this.style.display=\'none\'" />' +
				'      <span class="topbar-brand-text">FLUX</span>' +
				'    </a>' +
				'  </div>' +
				'</div>';

			document.body.insertBefore(header, document.body.firstChild);
		},

		/* ══════════════════════════════════════════
		   INJECT NOTIFICATION ICON into sidebar-bottom
		   ══════════════════════════════════════════ */
		injectNotificationIcon: function () {
			if (document.querySelector(".flux-notif-action")) return;

			var sidebarBottom = document.querySelector(".body-sidebar-bottom");
			if (!sidebarBottom) {
				setTimeout(function () { flux.topbar.injectNotificationIcon(); }, 500);
				return;
			}

			var div = document.createElement("div");
			div.className = "flux-notif-action flux-sidebar-action";
			div.innerHTML =
				'<a class="item-anchor flux-notif-btn" title="Notifications" role="button">' +
				'  <span class="sidebar-item-icon">' +
				'    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
				'         stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">' +
				'      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>' +
				'      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>' +
				'    </svg>' +
				'  </span>' +
				'  <span class="sidebar-item-label">Notifications</span>' +
				'  <span class="flux-notif-dot"></span>' +
				'</a>';

			// Insert before collapse-sidebar-link
			var collapseLink = sidebarBottom.querySelector(".collapse-sidebar-link");
			if (collapseLink) {
				sidebarBottom.insertBefore(div, collapseLink);
			} else {
				sidebarBottom.appendChild(div);
			}

			// Bind click — toggle Frappe's notification panel
			div.querySelector(".flux-notif-btn").addEventListener("click", function (e) {
				e.preventDefault();
				e.stopPropagation();

				var notifPanel = document.querySelector(".dropdown-notifications");
				if (notifPanel) {
					var isVisible = !notifPanel.classList.contains("hidden");
					if (isVisible) {
						notifPanel.classList.add("hidden");
					} else {
						notifPanel.classList.remove("hidden");
						var sidebarBtn = document.querySelector(".body-sidebar .sidebar-notification .item-anchor");
						if (sidebarBtn) sidebarBtn.click();
					}
				}
			});

			// Poll for unseen notifications badge
			this._pollNotifications();
		},

		/* ══════════════════════════════════════════
		   POLL NOTIFICATIONS — show/hide dot
		   ══════════════════════════════════════════ */
		_pollNotifications: function () {
			var dot = document.querySelector(".flux-notif-dot");
			if (!dot) return;

			var check = function () {
				var unseenEl = document.querySelector(".body-sidebar .notifications-unseen");
				if (unseenEl && window.getComputedStyle(unseenEl).display !== "none") {
					dot.classList.add("active");
				} else {
					dot.classList.remove("active");
				}
			};

			check();
			setInterval(check, 3000);
		},

		/* ══════════════════════════════════════════
		   ADJUST LAYOUT
		   ══════════════════════════════════════════ */
		adjustLayout: function () {
			document.body.classList.add("has-flux-topbar");

			// Hide the sidebar-top notification icon (we moved it to bottom)
			var sidebarNotif = document.querySelector(".body-sidebar .sidebar-notification");
			if (sidebarNotif) {
				sidebarNotif.style.display = "none";
			}

			// Clean up Frappe's built-in splash
			var splash = document.querySelector(".centered.splash");
			if (splash) {
				splash.style.opacity = "0";
				splash.style.visibility = "hidden";
				splash.style.pointerEvents = "none";
				splash.style.zIndex = "-1";
				setTimeout(function () {
					if (splash.parentNode) splash.parentNode.removeChild(splash);
				}, 500);
			}

			// Clean up any stuck loading overlays
			var loadingOverlays = document.querySelectorAll("#flux-loading-overlay");
			loadingOverlays.forEach(function (el) {
				if (el.parentNode) el.parentNode.removeChild(el);
			});
		}
	};

	// ── Boot ──
	document.addEventListener("DOMContentLoaded", function () {
		setTimeout(function () { flux.topbar.init(); }, 600);
	});

	if (typeof frappe !== "undefined") {
		$(document).on("toolbar_setup", function () {
			setTimeout(function () { flux.topbar.init(); }, 500);
		});
	}
})();
