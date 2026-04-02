/**
 * FLUX Theme - Dark Mode Toggle
 * Adds a moon/sun toggle to the navbar for switching between
 * light and dark modes. Persists choice via localStorage and
 * respects prefers-color-scheme as default.
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    flux.darkmode = {
        STORAGE_KEY: 'flux-theme-mode',
        _initialized: false,

        /**
         * Initialise dark-mode support.
         * Called once when Frappe is ready.
         */
        init: function() {
            if (this._initialized) return;
            this._initialized = true;

            // Apply saved preference (or system default) immediately
            this._applyPreference();

            // Listen for OS-level changes
            var mql = window.matchMedia('(prefers-color-scheme: dark)');
            var self = this;
            mql.addEventListener('change', function() {
                // Only follow system if user hasn't chosen explicitly
                if (!localStorage.getItem(self.STORAGE_KEY)) {
                    self._applyPreference();
                }
            });

            // Inject toggle button into navbar
            this._injectToggle();

            if (frappe && frappe.boot && frappe.boot.developer_mode) {
                var mode = this.isDark() ? 'dark' : 'light';
                console.log('%c🌙 FLUX Dark Mode ready (' + mode + ')',
                    'color:#09B474;font-weight:bold');
            }
        },

        // ─── Public API ───

        /**
         * Is dark mode currently active?
         */
        isDark: function() {
            return document.documentElement.getAttribute('data-theme') === 'flux-dark';
        },

        /**
         * Toggle between light and dark.
         */
        toggle: function() {
            if (this.isDark()) {
                this.setLight();
            } else {
                this.setDark();
            }
        },

        /**
         * Switch to dark mode.
         */
        setDark: function() {
            document.documentElement.setAttribute('data-theme', 'flux-dark');
            localStorage.setItem(this.STORAGE_KEY, 'dark');
            this._updateToggleIcon();
            this._dispatchEvent('dark');
        },

        /**
         * Switch to light mode.
         */
        setLight: function() {
            document.documentElement.setAttribute('data-theme', 'flux-light');
            localStorage.setItem(this.STORAGE_KEY, 'light');
            this._updateToggleIcon();
            this._dispatchEvent('light');
        },

        /**
         * Reset to follow system preference.
         */
        setAuto: function() {
            localStorage.removeItem(this.STORAGE_KEY);
            this._applyPreference();
        },

        // ─── Internal Helpers ───

        /**
         * Apply user preference or system default.
         */
        _applyPreference: function() {
            var saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved === 'dark') {
                document.documentElement.setAttribute('data-theme', 'flux-dark');
            } else if (saved === 'light') {
                document.documentElement.setAttribute('data-theme', 'flux-light');
            } else {
                // Follow OS preference
                var prefersDark = window.matchMedia &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.setAttribute('data-theme', 'flux-dark');
                } else {
                    document.documentElement.setAttribute('data-theme', 'flux-light');
                }
            }
            this._updateToggleIcon();
        },

        /**
         * Inject moon/sun toggle into the navbar.
         */
        _injectToggle: function() {
            // Don't inject twice
            if (document.querySelector('.flux-darkmode-toggle')) return;

            // v16: Primary navigation is in the sidebar (.body-sidebar-bottom).
            // The traditional navbar is minimal/hidden on desktop.
            var sidebarBottom = document.querySelector('.body-sidebar-bottom');
            var navbarNav = document.querySelector('.navbar-collapse .navbar-nav');

            if (sidebarBottom) {
                // v16 sidebar injection
                var div = document.createElement('div');
                div.className = 'flux-darkmode-toggle flux-sidebar-action';

                var btn = document.createElement('a');
                btn.className = 'item-anchor flux-darkmode-btn';
                btn.title = 'Toggle Dark Mode';
                btn.setAttribute('aria-label', 'Toggle dark mode');
                btn.setAttribute('role', 'button');
                btn.innerHTML =
                    '<span class="sidebar-item-icon">' + this._getIcon() + '</span>' +
                    '<span class="sidebar-item-label">' +
                    (this.isDark() ? 'Light Mode' : 'Dark Mode') + '</span>';

                var self = this;
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.toggle();
                    // Update label
                    var label = btn.querySelector('.sidebar-item-label');
                    if (label) label.textContent = self.isDark() ? 'Light Mode' : 'Dark Mode';
                });

                div.appendChild(btn);

                // Insert before collapse link
                var collapseLink = sidebarBottom.querySelector('.collapse-sidebar-link');
                var searchTrigger = sidebarBottom.querySelector('.flux-search-trigger');
                if (searchTrigger) {
                    sidebarBottom.insertBefore(div, searchTrigger.nextSibling);
                } else if (collapseLink) {
                    sidebarBottom.insertBefore(div, collapseLink);
                } else {
                    sidebarBottom.insertBefore(div, sidebarBottom.firstChild);
                }
            } else if (navbarNav) {
                // Fallback: mobile/legacy navbar
                var li = document.createElement('li');
                li.className = 'nav-item flux-darkmode-toggle';

                var btn = document.createElement('button');
                btn.className = 'btn-reset nav-link flux-darkmode-btn';
                btn.title = 'Toggle Dark Mode';
                btn.setAttribute('aria-label', 'Toggle dark mode');
                btn.innerHTML = this._getIcon();

                var self = this;
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.toggle();
                });

                li.appendChild(btn);
                navbarNav.insertBefore(li, navbarNav.firstChild);
            } else {
                // Neither found yet, retry
                var self = this;
                setTimeout(function() { self._injectToggle(); }, 300);
                return;
            }
        },

        /**
         * Update the icon to reflect current state.
         */
        _updateToggleIcon: function() {
            var btn = document.querySelector('.flux-darkmode-btn');
            if (btn) {
                btn.innerHTML = this._getIcon();
                btn.title = this.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode';
            }
        },

        /**
         * Get SVG icon for current state.
         * Moon = currently light (click to go dark)
         * Sun = currently dark (click to go light)
         */
        _getIcon: function() {
            if (this.isDark()) {
                // Sun icon (user is in dark mode — click for light)
                return '<svg class="flux-darkmode-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                    '<circle cx="12" cy="12" r="5" fill="none" stroke-width="1.5"/>' +
                    '<line x1="12" y1="1" x2="12" y2="3" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<line x1="12" y1="21" x2="12" y2="23" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<line x1="1" y1="12" x2="3" y2="12" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<line x1="21" y1="12" x2="23" y2="12" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke-width="1.5" stroke-linecap="round"/>' +
                    '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke-width="1.5" stroke-linecap="round"/>' +
                    '</svg>';
            } else {
                // Moon icon (user is in light mode — click for dark)
                return '<svg class="flux-darkmode-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" ' +
                    'fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '</svg>';
            }
        },

        /**
         * Dispatch a custom event for other modules.
         */
        _dispatchEvent: function(mode) {
            var event;
            try {
                event = new CustomEvent('flux:themechange', { detail: { mode: mode } });
            } catch (e) {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent('flux:themechange', true, true, { mode: mode });
            }
            document.dispatchEvent(event);
        }
    };

    // ─── Boot: apply preference ASAP (before DOMContentLoaded) ───
    // This prevents white flash by setting data-theme early
    (function earlyApply() {
        var saved = localStorage.getItem('flux-theme-mode');
        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'flux-dark');
        } else if (saved === 'light') {
            document.documentElement.setAttribute('data-theme', 'flux-light');
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'flux-dark');
        }
    })();

    // ─── Full init when Frappe is ready ───
    (function boot() {
        if (typeof frappe !== 'undefined' && frappe.dom) {
            flux.darkmode.init();
        } else {
            setTimeout(boot, 200);
        }
    })();

})();
