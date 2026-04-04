// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

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
                var currentPage = route ? route.join('/') : null;
                if (!currentPage || currentPage === self._lastPage) return;
                self._lastPage = currentPage;

                if (self._isWorkspacePage()) {
                    self._enhanceWorkspace();
                }
            }, 400);
        },

        /** Check if on a workspace/home page */
        _isWorkspacePage: function() {
            // v16: #page-Workspaces is gone. Use route-based detection
            // and check for the EditorJS workspace container.
            var route = frappe.get_route();
            if (route && route[0] === 'Workspaces') return true;
            return !!document.querySelector('.page-main-content[id="editorjs"], [data-page-name]');
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

            // v16: #page-Workspaces removed; use .main-section or .layout-main-section
            var container = document.querySelector('.workspace-main-section, .main-section, .layout-main-section');
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

            // v16: #page-Workspaces removed; use .main-section or .layout-main-section
            var container = document.querySelector('.workspace-main-section, .main-section, .layout-main-section');
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
            
            // Also enhance empty widget bodies
            this._enhanceEmptyWidgets();
        },

        // ─── Empty Widget Enhancement ───
        
        /** Icon mapping for widget labels */
        _iconMap: {
            // Arabic labels
            'الإعدادات': 'settings',
            'إعدادات': 'settings',
            'المستخدمين': 'users',
            'المستخدمون': 'users',
            'التقارير': 'chart-line',
            'البيانات': 'database',
            'المكالمات': 'phone',
            'الرسائل': 'message-circle',
            'المحادثات': 'message-square',
            'الملفات': 'folder',
            'المهام': 'check-square',
            'العملاء': 'users',
            'المبيعات': 'shopping-cart',
            'المشتريات': 'shopping-bag',
            'المخزون': 'package',
            'الحسابات': 'credit-card',
            'الموارد البشرية': 'user-check',
            'المشاريع': 'briefcase',
            'الدعم': 'headphones',
            'التصنيع': 'tool',
            'الأصول': 'box',
            'الجودة': 'award',
            'إدارة': 'sliders',
            'روابط': 'link',
            'اختصارات': 'zap',
            'أدوات': 'tool',
            'مساعدة': 'help-circle',
            
            // English labels
            'settings': 'settings',
            'setup': 'settings',
            'configuration': 'settings',
            'users': 'users',
            'reports': 'chart-line',
            'analytics': 'bar-chart-2',
            'data': 'database',
            'calls': 'phone',
            'voip': 'phone-call',
            'telephony': 'phone',
            'messages': 'message-circle',
            'chat': 'message-square',
            'files': 'folder',
            'documents': 'file-text',
            'tasks': 'check-square',
            'todos': 'check-circle',
            'customers': 'users',
            'contacts': 'user',
            'sales': 'shopping-cart',
            'selling': 'trending-up',
            'buying': 'shopping-bag',
            'purchasing': 'shopping-bag',
            'stock': 'package',
            'inventory': 'package',
            'accounts': 'credit-card',
            'accounting': 'dollar-sign',
            'hr': 'user-check',
            'human resources': 'user-check',
            'payroll': 'dollar-sign',
            'projects': 'briefcase',
            'project': 'folder',
            'support': 'headphones',
            'help desk': 'headphones',
            'manufacturing': 'tool',
            'production': 'cpu',
            'assets': 'box',
            'quality': 'award',
            'administration': 'sliders',
            'links': 'link',
            'shortcuts': 'zap',
            'tools': 'tool',
            'utilities': 'tool',
            'help': 'help-circle',
            'integrations': 'git-merge',
            'crm': 'target',
            'website': 'globe',
            'email': 'mail',
            'notifications': 'bell',
            'calendar': 'calendar',
            'events': 'calendar',
            'masters': 'database',
            'core': 'cpu',
            'module': 'grid',
            'other': 'more-horizontal'
        },
        
        /** Get icon for a label */
        _getIconForLabel: function(label) {
            if (!label) return 'file';
            
            var lowerLabel = label.toLowerCase().trim();
            
            // Direct match
            if (this._iconMap[lowerLabel]) {
                return this._iconMap[lowerLabel];
            }
            
            // Partial match
            for (var key in this._iconMap) {
                if (lowerLabel.indexOf(key) !== -1 || key.indexOf(lowerLabel) !== -1) {
                    return this._iconMap[key];
                }
            }
            
            // Default icon
            return 'file';
        },
        
        /** Generate SVG icon */
        _getSvgIcon: function(iconName) {
            var icons = {
                'settings': '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
                'users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
                'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                'phone-call': '<path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>',
                'message-circle': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>',
                'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>',
                'folder': '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
                'file': '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline>',
                'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
                'check-square': '<polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>',
                'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
                'user': '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
                'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>',
                'shopping-cart': '<circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>',
                'shopping-bag': '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path>',
                'package': '<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
                'credit-card': '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>',
                'dollar-sign': '<line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>',
                'briefcase': '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
                'headphones': '<path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>',
                'tool': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
                'box': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>',
                'award': '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>',
                'sliders': '<line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>',
                'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>',
                'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
                'help-circle': '<circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line>',
                'chart-line': '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',
                'bar-chart-2': '<line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line>',
                'database': '<ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>',
                'git-merge': '<circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path>',
                'target': '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle>',
                'globe': '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
                'mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
                'bell': '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
                'calendar': '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
                'grid': '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
                'cpu': '<rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>',
                'trending-up': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>',
                'more-horizontal': '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>'
            };
            
            var path = icons[iconName] || icons['file'];
            return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>';
        },
        
        /** Enhance empty widget bodies with icons */
        _enhanceEmptyWidgets: function() {
            var self = this;
            var widgets = document.querySelectorAll('.widget, .links-widget-box');
            
            widgets.forEach(function(widget) {
                var body = widget.querySelector('.widget-body');
                if (!body) return;
                
                // Skip shortcut, number-card, chart, and custom-block widgets
                // These widget types never use .widget-body for content by design
                if (widget.classList.contains('shortcut-widget-box') ||
                    widget.classList.contains('number-widget-box') ||
                    widget.classList.contains('chart-widget-box') ||
                    widget.classList.contains('custom-block-widget-box') ||
                    widget.closest('.shortcut-widget-box') ||
                    widget.closest('.ce-block') && widget.closest('.ce-block').querySelector('.shortcut-widget-box')) {
                    return;
                }
                
                // Check if body is empty (no links or children)
                var hasContent = body.querySelector('a, .link-item, .shortcut-widget-box') || 
                                 body.textContent.trim().length > 0;
                
                // Skip if already enhanced or has content
                if (body.classList.contains('widget-body--empty') || 
                    body.classList.contains('flux-empty-enhanced') || 
                    hasContent) {
                    return;
                }
                
                // Get label from widget-label
                var labelEl = widget.querySelector('.widget-label .widget-title, .widget-title');
                var label = labelEl ? labelEl.textContent.trim() : '';
                
                if (!label) return;
                
                // Mark as enhanced
                body.classList.add('widget-body--empty', 'flux-empty-enhanced');
                
                // Get appropriate icon
                var iconName = self._getIconForLabel(label);
                var iconSvg = self._getSvgIcon(iconName);
                
                // Create placeholder content
                var placeholder = document.createElement('div');
                placeholder.className = 'empty-widget-placeholder';
                placeholder.innerHTML = ''
                    + '<div class="empty-widget-icon">' + iconSvg + '</div>'
                    + '<div class="empty-widget-text">' + __('No items in') + ' ' + label + '</div>';
                
                body.appendChild(placeholder);
            });
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

        // Empty widget placeholder
        + '.widget-body--empty {'
        + '  display: flex !important;'
        + '  flex-direction: column;'
        + '  align-items: center;'
        + '  justify-content: center;'
        + '  padding: 40px 20px !important;'
        + '  min-height: 150px;'
        + '}'
        + '.empty-widget-placeholder {'
        + '  display: flex;'
        + '  flex-direction: column;'
        + '  align-items: center;'
        + '  justify-content: center;'
        + '  text-align: center;'
        + '}'
        + '.empty-widget-icon {'
        + '  width: 72px;'
        + '  height: 72px;'
        + '  border-radius: 50%;'
        + '  background: linear-gradient(135deg, rgba(9,180,116,0.15) 0%, rgba(9,180,116,0.05) 100%);'
        + '  display: flex;'
        + '  align-items: center;'
        + '  justify-content: center;'
        + '  margin-bottom: 16px;'
        + '  color: var(--flux-green, #09B474);'
        + '  transition: all 0.3s ease;'
        + '  box-shadow: 0 4px 20px rgba(9,180,116,0.1);'
        + '}'
        + '.empty-widget-icon svg {'
        + '  width: 32px;'
        + '  height: 32px;'
        + '  opacity: 0.85;'
        + '}'
        + '.widget:hover .empty-widget-icon {'
        + '  background: linear-gradient(135deg, rgba(9,180,116,0.25) 0%, rgba(9,180,116,0.1) 100%);'
        + '  transform: scale(1.08);'
        + '  box-shadow: 0 6px 24px rgba(9,180,116,0.2);'
        + '}'
        + '.empty-widget-text {'
        + '  font-size: 13px;'
        + '  color: var(--text-muted, #6c757d);'
        + '  opacity: 0.7;'
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
