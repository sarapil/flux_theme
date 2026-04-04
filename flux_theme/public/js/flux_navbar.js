// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme — Navbar Enhancements
 *
 * 1. Replaces inline awesomebar with a search-icon that opens a sleek
 *    overlay/modal search (Ctrl+G / ⌘+G still works).
 * 2. Hides .dropdown-help.
 * 3. Animates the notification bell when unseen notifications exist.
 * 4. Restyled chat icon visibility.
 */

(function () {
	"use strict";

	window.flux = window.flux || {};

	flux.navbar = {
		/* ──────────────────────────── bootstrap ─── */
		init: function () {
			// v16: Wait for sidebar or toolbar to render.
			// The navbar is minimal in v16 — sidebar is the primary nav.
			if (!document.querySelector(".body-sidebar") && !document.querySelector("header.navbar")) {
				setTimeout(function () { flux.navbar.init(); }, 200);
				return;
			}

			this.wrapSearchBar();
			this.hideHelp();
			this.patchNotifications();
			this.patchChat();

			// Re-bind Ctrl+G so it opens *our* overlay rather than focusing the
			// hidden input.  We do NOT remove Frappe's shortcut; we simply
			// intercept it earlier via a capture-phase listener.
			document.addEventListener(
				"keydown",
				function (e) {
					if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
						e.preventDefault();
						e.stopImmediatePropagation();
						flux.navbar.openSearch();
					}
				},
				true // capture phase — fires before Frappe's listener
			);
		},

		/* ═══════════════════════════════════════════
		   SEARCH  — hide bar, add icon, modal overlay
		   ═══════════════════════════════════════════ */
		wrapSearchBar: function () {
			var bar = document.querySelector(".search-bar");
			if (bar) {
				// Hide the original search bar (keep it in DOM so Frappe's
				// AwesomeBar instance still works when we focus it).
				bar.style.cssText =
					"position:fixed!important;top:-200px!important;left:50%!important;" +
					"transform:translateX(-50%)!important;width:500px!important;" +
					"opacity:0!important;pointer-events:none!important;z-index:-1!important;";
				bar.classList.remove("hidden");
			}

			// Don't insert if already present
			if (document.querySelector(".flux-search-trigger")) return;

			// v16: Primary navigation is in the sidebar (.body-sidebar-bottom).
			// The traditional navbar is minimal/hidden on desktop.
			// Insert search trigger into sidebar bottom area.
			var sidebarBottom = document.querySelector(".body-sidebar-bottom");
			var navbarNav = document.querySelector(".navbar-collapse .navbar-nav");

			if (sidebarBottom) {
				// v16 sidebar injection
				var searchDiv = document.createElement("div");
				searchDiv.className = "flux-search-trigger flux-sidebar-action";
				searchDiv.innerHTML =
					'<a class="item-anchor flux-search-btn" title="Search (Ctrl+G)" role="button">' +
					'<span class="sidebar-item-icon">' +
					'<svg class="flux-search-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" ' +
					'style="width:16px;height:16px;stroke:var(--text-muted);fill:none;stroke-width:1.5;">' +
					'<path d="M7.389 12.278a4.889 4.889 0 1 0 0-9.778 4.889 4.889 0 0 0 0 9.778z' +
					'M13.5 13.5l-2.658-2.658" stroke-linecap="round" stroke-linejoin="round"/>' +
					'</svg></span>' +
					'<span class="sidebar-item-label">Search</span>' +
					'</a>';
				var collapseLink = sidebarBottom.querySelector(".collapse-sidebar-link");
				if (collapseLink) {
					sidebarBottom.insertBefore(searchDiv, collapseLink);
				} else {
					sidebarBottom.insertBefore(searchDiv, sidebarBottom.firstChild);
				}
				searchDiv.querySelector(".flux-search-btn").addEventListener("click", function (e) {
					e.preventDefault();
					flux.navbar.openSearch();
				});
			} else if (navbarNav) {
				// Fallback: mobile/legacy navbar
				var searchLi = document.createElement("li");
				searchLi.className = "nav-item flux-search-trigger";
				searchLi.innerHTML =
					'<button class="btn-reset nav-link flux-search-btn" title="Search (Ctrl+G)">' +
					'<svg class="flux-search-svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" ' +
					'style="width:18px;height:18px;stroke:#F0F5F3;fill:none;stroke-width:1.5;">' +
					'<path d="M7.389 12.278a4.889 4.889 0 1 0 0-9.778 4.889 4.889 0 0 0 0 9.778z' +
					'M13.5 13.5l-2.658-2.658" stroke-linecap="round" stroke-linejoin="round"/>' +
					'</svg></button>';
				navbarNav.insertBefore(searchLi, navbarNav.firstChild);
				searchLi.querySelector("button").addEventListener("click", function (e) {
					e.preventDefault();
					flux.navbar.openSearch();
				});
			}
		},

		_searchOpen: false,

		openSearch: function () {
			if (this._searchOpen) { this.closeSearch(); return; }

			var existing = document.getElementById("flux-search-overlay");
			if (existing) existing.remove();

			// Build overlay
			var overlay = document.createElement("div");
			overlay.id = "flux-search-overlay";
			overlay.innerHTML =
				'<div class="flux-search-backdrop"></div>' +
				'<div class="flux-search-panel">' +
				'  <div class="flux-search-header">' +
				'    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" ' +
				'         style="width:20px;height:20px;stroke:#09B474;fill:none;stroke-width:1.5;flex-shrink:0;">' +
				'      <path d="M7.389 12.278a4.889 4.889 0 1 0 0-9.778 4.889 4.889 0 0 0 0 9.778z' +
				'M13.5 13.5l-2.658-2.658" stroke-linecap="round" stroke-linejoin="round"/>' +
				'    </svg>' +
				'    <input id="flux-search-input" type="text" autocomplete="off"' +
				'           placeholder="Search or type a command…" />' +
				'    <kbd class="flux-search-kbd">ESC</kbd>' +
				'  </div>' +
				'  <div class="flux-search-results"></div>' +
				'</div>';
			document.body.appendChild(overlay);

			this._searchOpen = true;

			// Animate in
			requestAnimationFrame(function () {
				overlay.classList.add("open");
			});

			// Close on backdrop click
			overlay.querySelector(".flux-search-backdrop")
				.addEventListener("click", function () { flux.navbar.closeSearch(); });

			// ESC to close
			this._escHandler = function (e) {
				if (e.key === "Escape") { flux.navbar.closeSearch(); }
			};
			document.addEventListener("keydown", this._escHandler, true);

			// Mirror typing into Frappe's real #navbar-search input so
			// AwesomeBar autocomplete fires.
			var fakeInput = overlay.querySelector("#flux-search-input");
			var realInput = document.getElementById("navbar-search");

			// Make the real input "visible" off-screen so Awesomplete opens
			var bar = document.querySelector(".search-bar");
			if (bar) {
				bar.style.cssText =
					"position:fixed!important;top:64px!important;left:50%!important;" +
					"transform:translateX(-50%)!important;width:min(560px,90vw)!important;" +
					"opacity:1!important;pointer-events:auto!important;z-index:100001!important;" +
					"background:transparent!important;border:none!important;";
				bar.classList.remove("hidden");
			}
			if (realInput) {
				realInput.style.cssText =
					"opacity:0!important;height:0!important;padding:0!important;" +
					"border:none!important;position:absolute!important;";
			}

			// Focus the fake input
			setTimeout(function () { fakeInput.focus(); }, 60);

			// Proxy keystrokes
			fakeInput.addEventListener("input", function () {
				if (!realInput) return;
				// Set value + dispatch events so Awesomplete sees it
				var nativeSet = Object.getOwnPropertyDescriptor(
					window.HTMLInputElement.prototype, "value").set;
				nativeSet.call(realInput, fakeInput.value);
				realInput.dispatchEvent(new Event("input", { bubbles: true }));
			});

			fakeInput.addEventListener("keydown", function (e) {
				if (!realInput) return;
				if (["ArrowDown", "ArrowUp", "Enter", "Tab"].indexOf(e.key) !== -1) {
					// Forward navigation keys to the real input
					var ev = new KeyboardEvent("keydown", {
						key: e.key, code: e.code, keyCode: e.keyCode,
						bubbles: true, cancelable: true
					});
					realInput.dispatchEvent(ev);
					if (e.key === "Enter") {
						setTimeout(function () { flux.navbar.closeSearch(); }, 150);
					}
				}
			});

			// Listen for Awesomplete selection
			if (realInput) {
				this._selectHandler = function () {
					setTimeout(function () { flux.navbar.closeSearch(); }, 120);
				};
				realInput.addEventListener("awesomplete-selectcomplete", this._selectHandler);
			}

			// Position the Awesomplete dropdown inside our panel
			this._repositionDropdown();
		},

		_repositionDropdown: function () {
			// Poll Awesomplete results on a safe interval instead of
			// MutationObserver (which caused infinite loops because
			// cloning results into our panel triggered new mutations).
			var results = document.querySelector(".flux-search-results");
			if (!results) return;

			var lastSignature = "";

			this._pollTimer = setInterval(function () {
				var ul = document.querySelector(".search-bar .awesomplete > ul");
				if (ul && ul.childNodes.length > 0 && !ul.hasAttribute("hidden")) {
					// Build a lightweight signature to avoid redundant DOM work
					var sig = ul.innerHTML.length + "|" + ul.childNodes.length;
					if (sig === lastSignature) return;
					lastSignature = sig;

					// Clear and re-populate
					while (results.firstChild) results.removeChild(results.firstChild);
					var items = ul.querySelectorAll("li");
					items.forEach(function (li) {
						var clone = li.cloneNode(true);
						clone.addEventListener("click", function () {
							li.click();
							setTimeout(function () { flux.navbar.closeSearch(); }, 80);
						});
						results.appendChild(clone);
					});
					results.style.display = "block";
				} else {
					if (lastSignature !== "") {
						results.style.display = "none";
						lastSignature = "";
					}
				}
			}, 200);
		},

		closeSearch: function () {
			this._searchOpen = false;

			var overlay = document.getElementById("flux-search-overlay");
			if (overlay) {
				overlay.classList.remove("open");
				overlay.classList.add("closing");
				setTimeout(function () { overlay.remove(); }, 250);
			}

			// Hide bar again
			var bar = document.querySelector(".search-bar");
			if (bar) {
				bar.style.cssText =
					"position:fixed!important;top:-200px!important;left:50%!important;" +
					"transform:translateX(-50%)!important;width:500px!important;" +
					"opacity:0!important;pointer-events:none!important;z-index:-1!important;";
			}

			// Clear
			var realInput = document.getElementById("navbar-search");
			if (realInput) {
				realInput.value = "";
				realInput.style.cssText = "";
				if (this._selectHandler) {
					realInput.removeEventListener("awesomplete-selectcomplete", this._selectHandler);
				}
			}

			if (this._escHandler) {
				document.removeEventListener("keydown", this._escHandler, true);
			}
			if (this._pollTimer) {
				clearInterval(this._pollTimer);
				this._pollTimer = null;
			}
		},

		/* ═══════════════════════════════════════════
		   HELP — hide completely
		   ═══════════════════════════════════════════ */
		hideHelp: function () {
			// v16: .dropdown-help may be in sidebar or navbar (mobile)
			var helpItems = document.querySelectorAll(".dropdown-help");
			helpItems.forEach(function (el) {
				el.style.display = "none";
				el.style.visibility = "hidden";
				// Also hide the vertical-bar that sits right before it
				var prev = el.previousElementSibling;
				if (prev && prev.classList.contains("vertical-bar")) {
					prev.style.display = "none";
				}
			});
		},

		/* ═══════════════════════════════════════════
		   NOTIFICATIONS — animate bell
		   ═══════════════════════════════════════════ */
		patchNotifications: function () {
			// v16: notifications are in the sidebar (.body-sidebar .dropdown-notifications)
			var notifLi = document.querySelector(".body-sidebar .dropdown-notifications") ||
			              document.querySelector(".dropdown-notifications");
			if (!notifLi) return;

			// Add FLUX class for styling
			notifLi.classList.add("flux-notifications");

			var check = function () {
				var unseen = notifLi.querySelector(".notifications-unseen");
				if (unseen && window.getComputedStyle(unseen).display !== "none") {
					notifLi.classList.add("has-unseen");
				} else {
					notifLi.classList.remove("has-unseen");
				}
			};

			// Check periodically + on click
			check();
			setInterval(check, 3000);
			notifLi.addEventListener("click", function () {
				setTimeout(check, 500);
			});
		},

		/* ═══════════════════════════════════════════
		   CHAT — restyle icon
		   ═══════════════════════════════════════════ */
		patchChat: function () {
			// v16: chat icon may be in sidebar or absent
			var chatLi = document.querySelector(".dropdown-message");
			if (!chatLi) return;
			chatLi.classList.add("flux-chat");
		}
	};

	// Boot
	document.addEventListener("DOMContentLoaded", function () {
		// Slight delay so Frappe toolbar finishes rendering
		setTimeout(function () { flux.navbar.init(); }, 400);
	});

	// Also hook into page-change in case navbar re-renders
	if (typeof frappe !== "undefined") {
		$(document).on("toolbar_setup", function () {
			setTimeout(function () { flux.navbar.init(); }, 300);
		});
	}
})();
