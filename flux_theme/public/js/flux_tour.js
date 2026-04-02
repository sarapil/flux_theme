/**
 * FLUX Theme — Welcome Tour / Onboarding
 * First-time user onboarding experience with animated pointers
 *
 * @module flux.welcomeTour
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.welcomeTour = {
        _overlay: null,
        _currentStep: 0,
        _steps: [],

        TOUR_STEPS: [
            {
                selector: '.body-sidebar .sidebar-items, .navbar-brand',
                title: 'Welcome to FLUX',
                titleAr: 'مرحباً بك في تافيرا',
                text: 'Your modern co-working space ERP experience starts here. This guided tour will show you around.',
                position: 'right'
            },
            {
                selector: '.flux-search-trigger, .search-bar',
                title: 'Smart Search',
                titleAr: 'البحث الذكي',
                text: 'Press Ctrl+K to quickly search across documents, pages, and settings.',
                position: 'right'
            },
            {
                selector: '.page-head, #navbar-breadcrumbs',
                title: 'Navigation',
                titleAr: 'التنقل',
                text: 'Breadcrumbs and page headers help you navigate through the system efficiently.',
                position: 'bottom'
            },
            {
                selector: '.body-sidebar-container, .body-sidebar',
                title: 'Sidebar',
                titleAr: 'الشريط الجانبي',
                text: 'Access all modules, shortcuts, and your workspace from the sidebar.',
                position: 'right'
            },
            {
                selector: '.page-container, .layout-main-section',
                title: 'Your Workspace',
                titleAr: 'مساحة العمل',
                text: 'This is your main working area where forms, lists, and dashboards appear.',
                position: 'top'
            },
            {
                selector: null,
                title: 'You\'re All Set!',
                titleAr: 'أنت جاهز!',
                text: 'Explore the system at your pace. You can always restart this tour from the Help menu. Enjoy the FLUX experience! ✨',
                position: 'center'
            }
        ],

        /**
         * Check if tour should auto-start
         */
        init: function() {
            var self = this;

            // Feature gate
            if (typeof flux.config !== 'undefined' &&
                typeof flux.config.features !== 'undefined' &&
                flux.config.features.welcomeTour === false) {
                return;
            }

            // Check if already seen
            if (localStorage.getItem('flux_tour_complete')) return;

            // Wait for DOM to settle, then start
            setTimeout(function() {
                if (typeof frappe !== 'undefined' && frappe.session && frappe.session.user !== 'Guest') {
                    self.start();
                }
            }, 3000);
        },

        /**
         * Start the tour
         */
        start: function() {
            this._currentStep = 0;
            this._createOverlay();
            this._showStep(0);
        },

        /**
         * Create backdrop overlay
         */
        _createOverlay: function() {
            if (this._overlay) this._overlay.remove();

            var ov = document.createElement('div');
            ov.className = 'flux-tour-overlay';
            ov.innerHTML =
                '<div class="flux-tour-backdrop"></div>' +
                '<div class="flux-tour-spotlight"></div>' +
                '<div class="flux-tour-card">' +
                '  <div class="flux-tour-card-header">' +
                '    <span class="flux-tour-step-num"></span>' +
                '    <button class="flux-tour-close" title="Skip Tour">&times;</button>' +
                '  </div>' +
                '  <h3 class="flux-tour-title"></h3>' +
                '  <p class="flux-tour-title-ar"></p>' +
                '  <p class="flux-tour-text"></p>' +
                '  <div class="flux-tour-dots"></div>' +
                '  <div class="flux-tour-actions">' +
                '    <button class="flux-tour-btn flux-tour-btn-skip">Skip</button>' +
                '    <button class="flux-tour-btn flux-tour-btn-next">Next →</button>' +
                '  </div>' +
                '</div>';

            document.body.appendChild(ov);
            this._overlay = ov;

            var self = this;
            ov.querySelector('.flux-tour-close').onclick = function() { self.end(); };
            ov.querySelector('.flux-tour-btn-skip').onclick = function() { self.end(); };
            ov.querySelector('.flux-tour-btn-next').onclick = function() { self._next(); };

            // Build dots
            var dotsEl = ov.querySelector('.flux-tour-dots');
            for (var i = 0; i < this.TOUR_STEPS.length; i++) {
                var dot = document.createElement('span');
                dot.className = 'flux-tour-dot';
                dot.dataset.step = i;
                dotsEl.appendChild(dot);
            }
        },

        /**
         * Show a specific step
         */
        _showStep: function(idx) {
            var step = this.TOUR_STEPS[idx];
            if (!step) { this.end(); return; }

            this._currentStep = idx;
            var ov = this._overlay;
            var card = ov.querySelector('.flux-tour-card');
            var spotlight = ov.querySelector('.flux-tour-spotlight');

            // Update content
            ov.querySelector('.flux-tour-step-num').textContent = (idx + 1) + ' / ' + this.TOUR_STEPS.length;
            ov.querySelector('.flux-tour-title').textContent = step.title;
            ov.querySelector('.flux-tour-title-ar').textContent = step.titleAr;
            ov.querySelector('.flux-tour-text').textContent = step.text;

            // Update dots
            var dots = ov.querySelectorAll('.flux-tour-dot');
            for (var i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('active', i === idx);
            }

            // Button text
            var nextBtn = ov.querySelector('.flux-tour-btn-next');
            nextBtn.textContent = (idx === this.TOUR_STEPS.length - 1) ? 'Finish ✨' : 'Next →';

            // Position card and spotlight
            if (step.selector) {
                var el = document.querySelector(step.selector);
                if (el) {
                    var rect = el.getBoundingClientRect();

                    // Position spotlight
                    spotlight.style.display = 'block';
                    spotlight.style.top = (rect.top - 8) + 'px';
                    spotlight.style.left = (rect.left - 8) + 'px';
                    spotlight.style.width = (rect.width + 16) + 'px';
                    spotlight.style.height = (rect.height + 16) + 'px';

                    // Position card near element
                    card.style.position = 'fixed';
                    this._positionCard(card, rect, step.position);
                } else {
                    // Element not found — center card
                    this._centerCard(card, spotlight);
                }
            } else {
                this._centerCard(card, spotlight);
            }

            // Animate in
            card.classList.remove('visible');
            void card.offsetHeight;
            card.classList.add('visible');
        },

        /**
         * Position card relative to target
         */
        _positionCard: function(card, targetRect, position) {
            var pad = 16;
            var cardW = 380;
            var cardH = 260;

            var x, y;
            switch(position) {
                case 'bottom':
                    x = targetRect.left + targetRect.width / 2 - cardW / 2;
                    y = targetRect.bottom + pad;
                    break;
                case 'top':
                    x = targetRect.left + targetRect.width / 2 - cardW / 2;
                    y = targetRect.top - cardH - pad;
                    break;
                case 'right':
                    x = targetRect.right + pad;
                    y = targetRect.top + targetRect.height / 2 - cardH / 2;
                    break;
                case 'left':
                    x = targetRect.left - cardW - pad;
                    y = targetRect.top + targetRect.height / 2 - cardH / 2;
                    break;
                default:
                    x = window.innerWidth / 2 - cardW / 2;
                    y = window.innerHeight / 2 - cardH / 2;
            }

            x = Math.max(12, Math.min(x, window.innerWidth - cardW - 12));
            y = Math.max(12, Math.min(y, window.innerHeight - cardH - 12));

            card.style.left = x + 'px';
            card.style.top = y + 'px';
        },

        /**
         * Center the card (for final step or missing elements)
         */
        _centerCard: function(card, spotlight) {
            spotlight.style.display = 'none';
            card.style.left = '50%';
            card.style.top = '50%';
            card.style.transform = 'translate(-50%, -50%)';
        },

        /**
         * Go to next step
         */
        _next: function() {
            if (this._currentStep >= this.TOUR_STEPS.length - 1) {
                this.end();
            } else {
                this._showStep(this._currentStep + 1);
            }
        },

        /**
         * End the tour
         */
        end: function() {
            if (this._overlay) {
                this._overlay.classList.add('closing');
                var ov = this._overlay;
                setTimeout(function() { ov.remove(); }, 400);
                this._overlay = null;
            }
            localStorage.setItem('flux_tour_complete', '1');
            this._currentStep = 0;
        },

        /**
         * Restart tour (can be called from menu)
         */
        restart: function() {
            localStorage.removeItem('flux_tour_complete');
            this.start();
        }
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.welcomeTour.init(); });
    } else {
        setTimeout(function() { flux.welcomeTour.init(); }, 500);
    }
})();
