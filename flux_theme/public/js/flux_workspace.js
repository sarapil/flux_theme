/**
 * FLUX Theme - Workspace Enhancements
 * Welcome banner, quick actions, enhanced widget styling.
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    flux.workspace = {
        _initialized: false,
        _lastPage: '',

        /** Initialize workspace enhancements */
        init: function() {
            if (this._initialized) return;
            this._initialized = true;

            var self = this;

            // Listen for page changes
            if (frappe.router) {
                frappe.router.on('change', function() {
                    self._onPageChange();
                });
            }

            // Check current page
            this._onPageChange();
        },

        /** Handle page navigation */
        _onPageChange: function() {
            var self = this;

            // Debounce rapid changes
            clearTimeout(this._changeTimer);
            this._changeTimer = setTimeout(function() {
                var route = frappe.get_route();
                if (!route) return;
                var currentPage = route.join('/');
                if (currentPage === self._lastPage) return;
                self._lastPage = currentPage;

                if (self._isWorkspacePage()) {
                    self._enhanceWorkspace();
                }
            }, 400);
        },

        /** Check if on a workspace/home page */
        _isWorkspacePage: function() {
            return !!document.querySelector('#page-Workspaces, .desk-page[data-page-name]');
        },

        /** Apply all workspace enhancements */
        _enhanceWorkspace: function() {
            var self = this;

            // Wait for workspace to render
            setTimeout(function() {
                self._injectWelcomeBanner();
                self._injectQuickActions();
                self._enhanceShortcuts();
            }, 300);
        },

        // ─── Welcome Banner ───

        /** Inject the welcome banner at the top of the workspace */
        _injectWelcomeBanner: function() {
            // Don't inject twice
            if (document.querySelector('.flux-welcome-banner')) return;

            var container = document.querySelector('.workspace-main-section, #page-Workspaces .layout-main-section');
            if (!container) return;

            var greeting = this._getGreeting();
            var userName = this._getUserName();
            var dateStr = this._getFormattedDate();

            var banner = document.createElement('div');
            banner.className = 'flux-welcome-banner';
            banner.innerHTML = ''
                + '<div class="flux-welcome-inner">'
                + '  <div class="flux-welcome-text">'
                + '    <h2 class="flux-welcome-greeting">'
                + '      <span class="flux-welcome-icon">' + this._getTimeIcon() + '</span> '
                + greeting + ', <strong>' + userName + '</strong>'
                + '    </h2>'
                + '    <p class="flux-welcome-date">' + dateStr + '</p>'
                + '  </div>'
                + '  <div class="flux-welcome-brand">'
                + '    <span class="flux-welcome-logo">🏙️</span>'
                + '  </div>'
                + '</div>';

            container.insertBefore(banner, container.firstChild);

            // Animate in
            requestAnimationFrame(function() {
                banner.classList.add('flux-welcome-visible');
            });
        },

        /** Get time-of-day greeting */
        _getGreeting: function() {
            var hour = new Date().getHours();
            if (hour < 6)  return __('Good night');
            if (hour < 12) return __('Good morning');
            if (hour < 17) return __('Good afternoon');
            if (hour < 21) return __('Good evening');
            return __('Good night');
        },

        /** Get time icon emoji */
        _getTimeIcon: function() {
            var hour = new Date().getHours();
            if (hour < 6)  return '🌙';
            if (hour < 12) return '☀️';
            if (hour < 17) return '🌤️';
            if (hour < 21) return '🌅';
            return '🌙';
        },

        /** Get user's first name or full name */
        _getUserName: function() {
            if (frappe.session && frappe.session.user_fullname) {
                var name = frappe.session.user_fullname;
                // Return first name only
                return name.split(' ')[0];
            }
            return __('User');
        },

        /** Get formatted date string */
        _getFormattedDate: function() {
            var now = new Date();
            var options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            try {
                return now.toLocaleDateString(frappe.boot.lang || 'en', options);
            } catch (e) {
                return now.toDateString();
            }
        },

        // ─── Quick Actions ───

        /** Inject quick actions panel */
        _injectQuickActions: function() {
            if (document.querySelector('.flux-quick-actions')) return;

            var container = document.querySelector('.workspace-main-section, #page-Workspaces .layout-main-section');
            if (!container) return;

            var banner = container.querySelector('.flux-welcome-banner');

            var actions = [
                { icon: '📝', label: __('New Task'), action: function() { frappe.new_doc('ToDo'); } },
                { icon: '📊', label: __('Reports'), action: function() { frappe.set_route('query-report'); } },
                { icon: '📋', label: __('Notes'), action: function() { frappe.new_doc('Note'); } },
                { icon: '⚙️', label: __('Settings'), action: function() { frappe.set_route('modules'); } }
            ];

            var panel = document.createElement('div');
            panel.className = 'flux-quick-actions';

            var inner = '<div class="flux-qa-title">' + __('Quick Actions') + '</div>'
                + '<div class="flux-qa-grid">';

            for (var i = 0; i < actions.length; i++) {
                inner += '<button class="flux-qa-btn" data-idx="' + i + '">'
                    + '<span class="flux-qa-icon">' + actions[i].icon + '</span>'
                    + '<span class="flux-qa-label">' + actions[i].label + '</span>'
                    + '</button>';
            }

            inner += '</div>';
            panel.innerHTML = inner;

            // Insert after banner or at top
            var ref = banner ? banner.nextSibling : container.firstChild;
            container.insertBefore(panel, ref);

            // Bind click events
            var buttons = panel.querySelectorAll('.flux-qa-btn');
            for (var j = 0; j < buttons.length; j++) {
                (function(idx) {
                    buttons[idx].addEventListener('click', function() {
                        actions[idx].action();
                    });
                })(j);
            }

            // Animate in
            requestAnimationFrame(function() {
                panel.classList.add('flux-qa-visible');
            });
        },

        // ─── Shortcut Enhancements ───

        /** Enhance existing workspace shortcuts */
        _enhanceShortcuts: function() {
            var shortcuts = document.querySelectorAll('.shortcut-widget-box, .widget.shortcut-widget');

            for (var i = 0; i < shortcuts.length; i++) {
                if (shortcuts[i].classList.contains('flux-enhanced')) continue;
                shortcuts[i].classList.add('flux-enhanced');

                // Add subtle green shimmer on hover
                var shimmer = document.createElement('div');
                shimmer.className = 'flux-shortcut-shimmer';
                shortcuts[i].style.position = 'relative';
                shortcuts[i].style.overflow = 'hidden';
                shortcuts[i].appendChild(shimmer);
            }
        }
    };

    // ─── Workspace Widget Styles ───
    var style = document.createElement('style');
    style.textContent = ''
        // Welcome Banner
        + '.flux-welcome-banner {'
        + '  background: linear-gradient(135deg, var(--flux-dark, #2D3436) 0%, rgba(45,52,54,0.85) 100%);'
        + '  border: 1px solid rgba(9,180,116,0.2);'
        + '  border-radius: 16px;'
        + '  padding: 28px 32px;'
        + '  margin-bottom: 24px;'
        + '  opacity: 0;'
        + '  transform: translateY(-10px);'
        + '  transition: opacity 0.5s ease, transform 0.5s ease;'
        + '  overflow: hidden;'
        + '  position: relative;'
        + '}'
        + '.flux-welcome-banner::before {'
        + '  content: "";'
        + '  position: absolute;'
        + '  top: 0; left: 0; right: 0;'
        + '  height: 3px;'
        + '  background: linear-gradient(90deg, transparent, var(--flux-green, #09B474), transparent);'
        + '}'
        + '.flux-welcome-visible {'
        + '  opacity: 1;'
        + '  transform: translateY(0);'
        + '}'
        + '.flux-welcome-inner {'
        + '  display: flex;'
        + '  align-items: center;'
        + '  justify-content: space-between;'
        + '}'
        + '.flux-welcome-greeting {'
        + '  font-family: var(--flux-font-heading, "Open Sans", sans-serif);'
        + '  font-size: 22px;'
        + '  font-weight: 600;'
        + '  color: var(--flux-light, #F0F5F3);'
        + '  margin: 0 0 4px;'
        + '}'
        + '.flux-welcome-greeting strong {'
        + '  color: var(--flux-green, #09B474);'
        + '}'
        + '.flux-welcome-icon {'
        + '  font-size: 24px;'
        + '}'
        + '.flux-welcome-date {'
        + '  color: rgba(255,241,231,0.6);'
        + '  font-size: 13px;'
        + '  margin: 0;'
        + '}'
        + '.flux-welcome-logo {'
        + '  font-size: 48px;'
        + '  opacity: 0.3;'
        + '}'

        // Quick Actions
        + '.flux-quick-actions {'
        + '  margin-bottom: 24px;'
        + '  opacity: 0;'
        + '  transform: translateY(-8px);'
        + '  transition: opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s;'
        + '}'
        + '.flux-qa-visible {'
        + '  opacity: 1;'
        + '  transform: translateY(0);'
        + '}'
        + '.flux-qa-title {'
        + '  font-family: var(--flux-font-heading, "Open Sans", sans-serif);'
        + '  font-size: 13px;'
        + '  font-weight: 600;'
        + '  color: var(--flux-green, #09B474);'
        + '  text-transform: uppercase;'
        + '  letter-spacing: 0.08em;'
        + '  margin-bottom: 12px;'
        + '}'
        + '.flux-qa-grid {'
        + '  display: grid;'
        + '  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));'
        + '  gap: 12px;'
        + '}'
        + '.flux-qa-btn {'
        + '  display: flex;'
        + '  align-items: center;'
        + '  gap: 10px;'
        + '  padding: 14px 16px;'
        + '  background: var(--card-bg, #fff);'
        + '  border: 1px solid rgba(9,180,116,0.15);'
        + '  border-radius: 12px;'
        + '  cursor: pointer;'
        + '  transition: all 0.25s ease;'
        + '  font-size: 13px;'
        + '  font-weight: 500;'
        + '  color: var(--text-color, #333);'
        + '}'
        + '.flux-qa-btn:hover {'
        + '  border-color: var(--flux-green, #09B474);'
        + '  box-shadow: 0 4px 16px rgba(9,180,116,0.15);'
        + '  transform: translateY(-2px);'
        + '}'
        + '.flux-qa-icon {'
        + '  font-size: 20px;'
        + '}'
        + '.flux-qa-label {'
        + '  white-space: nowrap;'
        + '}'

        // Shortcut shimmer
        + '.flux-shortcut-shimmer {'
        + '  position: absolute;'
        + '  top: 0; left: -100%;'
        + '  width: 100%; height: 100%;'
        + '  background: linear-gradient(90deg, transparent, rgba(9,180,116,0.08), transparent);'
        + '  transition: left 0.6s ease;'
        + '  pointer-events: none;'
        + '}'
        + '.shortcut-widget-box:hover .flux-shortcut-shimmer,'
        + '.shortcut-widget:hover .flux-shortcut-shimmer {'
        + '  left: 100%;'
        + '}'

        // Dark mode adjustments
        + '[data-theme="flux-dark"] .flux-qa-btn {'
        + '  background: rgba(255,241,231,0.04);'
        + '  color: var(--flux-light, #F0F5F3);'
        + '}'
        + '[data-theme="flux-dark"] .flux-qa-btn:hover {'
        + '  background: rgba(9,180,116,0.1);'
        + '}'

        // Mobile responsive
        + '@media (max-width: 768px) {'
        + '  .flux-welcome-banner { padding: 20px; }'
        + '  .flux-welcome-greeting { font-size: 18px; }'
        + '  .flux-welcome-logo { display: none; }'
        + '  .flux-qa-grid { grid-template-columns: repeat(2, 1fr); }'
        + '}';

    document.head.appendChild(style);

    // ─── Bootstrap ───
    var initPoll = setInterval(function() {
        if (typeof frappe !== 'undefined' && frappe.session && frappe.router) {
            clearInterval(initPoll);
            flux.workspace.init();
        }
    }, 300);

    setTimeout(function() { clearInterval(initPoll); }, 15000);

})();
