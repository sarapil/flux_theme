/**
 * FLUX Theme - Mobile Bottom Navigation
 * Injects a bottom nav bar on mobile devices with Home, Search, Notifications, User.
 * Auto-hides on scroll down, reveals on scroll up.
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    flux.mobileNav = {
        _el: null,
        _lastScroll: 0,
        _initialized: false,

        init: function() {
            if (this._initialized) return;
            this._initialized = true;

            // Only on mobile
            if (window.innerWidth > 767) return;

            this._inject();
            this._bindScroll();
            this._bindRouteChange();
        },

        /** Inject bottom nav HTML */
        _inject: function() {
            if (document.querySelector('.flux-mobile-nav')) return;

            var nav = document.createElement('nav');
            nav.className = 'flux-mobile-nav';
            nav.setAttribute('aria-label', 'Mobile navigation');

            nav.innerHTML = ''
                + '<ul class="flux-mobile-nav-items">'
                + '  <li class="flux-mobile-nav-item">'
                + '    <a href="/desk" data-route="Workspaces" aria-label="Home">'
                + '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">'
                + '        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'
                + '        <polyline points="9 22 9 12 15 12 15 22"/>'
                + '      </svg>'
                + '      <span class="flux-mobile-nav-label">' + __('Home') + '</span>'
                + '    </a>'
                + '  </li>'
                + '  <li class="flux-mobile-nav-item">'
                + '    <button data-action="search" aria-label="Search">'
                + '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">'
                + '        <circle cx="11" cy="11" r="8"/>'
                + '        <line x1="21" y1="21" x2="16.65" y2="16.65"/>'
                + '      </svg>'
                + '      <span class="flux-mobile-nav-label">' + __('Search') + '</span>'
                + '    </button>'
                + '  </li>'
                + '  <li class="flux-mobile-nav-item" style="position:relative;">'
                + '    <a href="/desk/notifications" data-route="notifications" aria-label="Notifications">'
                + '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">'
                + '        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>'
                + '        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>'
                + '      </svg>'
                + '      <span class="flux-mobile-nav-label">' + __('Alerts') + '</span>'
                + '    </a>'
                + '  </li>'
                + '  <li class="flux-mobile-nav-item">'
                + '    <a href="/desk/user-settings" data-route="user-settings" aria-label="Profile">'
                + '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">'
                + '        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>'
                + '        <circle cx="12" cy="7" r="4"/>'
                + '      </svg>'
                + '      <span class="flux-mobile-nav-label">' + __('Profile') + '</span>'
                + '    </a>'
                + '  </li>'
                + '</ul>';

            document.body.appendChild(nav);
            this._el = nav;

            // Bind search action
            var searchBtn = nav.querySelector('[data-action="search"]');
            if (searchBtn) {
                searchBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Trigger FLUX search overlay or Frappe's search
                    var searchTrigger = document.querySelector('.flux-search-trigger a, .search-bar input');
                    if (searchTrigger) {
                        searchTrigger.click();
                    } else if (frappe.searchdialog) {
                        frappe.searchdialog.show();
                    }
                });
            }

            // Update active state
            this._updateActive();
        },

        /** Auto-hide on scroll down, show on scroll up */
        _bindScroll: function() {
            var self = this;
            var threshold = 10;

            window.addEventListener('scroll', function() {
                if (!self._el) return;

                var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                if (currentScroll <= 0) {
                    self._el.classList.remove('flux-nav-hidden');
                    return;
                }

                if (currentScroll > self._lastScroll + threshold) {
                    // Scrolling down
                    self._el.classList.add('flux-nav-hidden');
                } else if (currentScroll < self._lastScroll - threshold) {
                    // Scrolling up
                    self._el.classList.remove('flux-nav-hidden');
                }

                self._lastScroll = currentScroll;
            }, { passive: true });
        },

        /** Update active item on route change */
        _bindRouteChange: function() {
            var self = this;

            if (frappe && frappe.router) {
                frappe.router.on('change', function() {
                    self._updateActive();
                });
            }
        },

        /** Set active class on current route link */
        _updateActive: function() {
            if (!this._el) return;

            var links = this._el.querySelectorAll('a[data-route]');
            var currentRoute = frappe.get_route_str ? frappe.get_route_str() : '';

            for (var i = 0; i < links.length; i++) {
                var route = links[i].getAttribute('data-route');
                var isActive = currentRoute.indexOf(route) !== -1 ||
                    (route === 'Workspaces' && (currentRoute === '' || currentRoute === 'Workspaces'));

                links[i].classList.toggle('active', isActive);
            }
        }
    };

    // Bootstrap — only on mobile
    if (window.innerWidth <= 767) {
        var poll = setInterval(function() {
            if (typeof frappe !== 'undefined' && frappe.router) {
                clearInterval(poll);
                flux.mobileNav.init();
            }
        }, 300);
        setTimeout(function() { clearInterval(poll); }, 15000);
    }

    // Also init on resize to mobile
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 767 && !flux.mobileNav._initialized) {
            flux.mobileNav.init();
        }
    });

})();
