/**
 * FLUX Theme - Form View Enhancements
 * Timeline scroll-reveal animations using IntersectionObserver.
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    flux.forms = {
        _observer: null,
        _initialized: false,

        init: function() {
            if (this._initialized) return;
            this._initialized = true;

            this._createObserver();
            this._observeTimeline();
            this._listenForPageChanges();
        },

        /** Create IntersectionObserver for timeline items */
        _createObserver: function() {
            if (!window.IntersectionObserver) return;

            this._observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('flux-timeline-visible');
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -40px 0px',
                threshold: 0.1
            });
        },

        /** Observe all timeline items on the page */
        _observeTimeline: function() {
            if (!this._observer) return;

            var items = document.querySelectorAll('.timeline .timeline-item:not(.flux-timeline-observed)');
            for (var i = 0; i < items.length; i++) {
                items[i].classList.add('flux-timeline-observed');
                this._observer.observe(items[i]);
            }
        },

        /** Re-observe after SPA navigation */
        _listenForPageChanges: function() {
            var self = this;

            if (frappe && frappe.router) {
                frappe.router.on('change', function() {
                    // Wait for DOM to update
                    setTimeout(function() {
                        self._observeTimeline();
                    }, 600);
                });
            }

            // Also observe when form renders
            $(document).on('form-refresh', function() {
                setTimeout(function() {
                    self._observeTimeline();
                }, 400);
            });
        }
    };

    // Bootstrap
    var poll = setInterval(function() {
        if (typeof frappe !== 'undefined' && frappe.router) {
            clearInterval(poll);
            flux.forms.init();
        }
    }, 300);
    setTimeout(function() { clearInterval(poll); }, 15000);

})();
