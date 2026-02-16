/**
 * FLUX Theme - Loading Indicator
 * Branded overlay with splash image + green ring.
 * Also cleans up any stuck Frappe #freeze elements.
 */

(function() {
    'use strict';

    console.log('[FLUX] loading.js executing');

    window.flux = window.flux || {};

    flux.loading = {
        overlay: null,
        _safetyTimer: null,
        _initialized: false,

        init: function() {
            if (this._initialized) return;
            this._initialized = true;

            var self = this;

            // Override freeze/unfreeze with our branded version
            frappe.dom.freeze = function(msg) { self.show(); };
            frappe.dom.unfreeze = function()  { self.remove(); };

            // On page navigation: show, then auto-hide
            if (frappe.router && frappe.router.on) {
                frappe.router.on('change', function() {
                    self.show();
                    frappe.after_ajax(function() {
                        setTimeout(function() { self.remove(); }, 120);
                    });
                });
            }

            // Clean up any existing Frappe #freeze elements that got stuck
            self._cleanupFrappeFreeze();

            // Periodically clean up stuck #freeze elements
            setInterval(function() { self._cleanupFrappeFreeze(); }, 2000);

            console.log('%c🔄 FLUX Loading active', 'color:#09B474;font-weight:bold');
        },

        /**
         * Remove any stuck Frappe freeze elements (#freeze, .modal-backdrop)
         * These can get stuck if our override wasn't active when freeze was called
         */
        _cleanupFrappeFreeze: function() {
            // Remove #freeze element (Frappe's default freeze overlay)
            var freezeEl = document.getElementById('freeze');
            if (freezeEl) {
                freezeEl.parentNode.removeChild(freezeEl);
                frappe.dom.freeze_count = 0;
                console.log('[FLUX] Cleaned up stuck #freeze element');
            }

            // Remove stuck modal-backdrops that aren't from real modals
            var backdrops = document.querySelectorAll('.modal-backdrop');
            var openModals = document.querySelectorAll('.modal.show, .modal.in');
            if (backdrops.length > openModals.length) {
                // More backdrops than open modals = stuck backdrops
                for (var i = openModals.length; i < backdrops.length; i++) {
                    backdrops[i].parentNode.removeChild(backdrops[i]);
                    console.log('[FLUX] Cleaned up stuck modal-backdrop');
                }
            }

            // Remove any stuck flux loading overlays
            var stuckOverlays = document.querySelectorAll('#flux-loading-overlay');
            if (stuckOverlays.length > 0 && !this.overlay) {
                for (var j = 0; j < stuckOverlays.length; j++) {
                    stuckOverlays[j].parentNode.removeChild(stuckOverlays[j]);
                }
            }
        },

        show: function() {
            if (this.overlay) return;

            var el = document.createElement('div');
            el.id = 'flux-loading-overlay';
            el.className = 'flux-loading-overlay';
            el.innerHTML =
                '<div class="flux-loading-content">' +
                    '<div class="flux-loading-logo-wrap">' +
                        '<img src="/assets/flux_theme/images/splash.png" alt="" ' +
                             'class="flux-loading-logo" ' +
                             'onerror="this.style.display=\'none\'">' +
                        '<div class="flux-loading-ring"></div>' +
                    '</div>' +
                '</div>';

            document.body.appendChild(el);
            this.overlay = el;

            requestAnimationFrame(function() {
                if (el.parentNode) el.classList.add('flux-loading-visible');
            });

            // Safety: auto-remove after 3 seconds
            var self = this;
            this._safetyTimer = setTimeout(function() {
                self.remove();
            }, 3000);
        },

        remove: function() {
            if (this._safetyTimer) {
                clearTimeout(this._safetyTimer);
                this._safetyTimer = null;
            }

            // Remove ALL flux loading overlays
            var overlays = document.querySelectorAll('#flux-loading-overlay');
            for (var i = 0; i < overlays.length; i++) {
                overlays[i].classList.add('flux-loading-fadeout');
            }
            var self = this;
            setTimeout(function() {
                var els = document.querySelectorAll('#flux-loading-overlay');
                for (var i = 0; i < els.length; i++) {
                    if (els[i].parentNode) els[i].parentNode.removeChild(els[i]);
                }
                self.overlay = null;
            }, 250);

            // Also clean up any Frappe freeze
            this._cleanupFrappeFreeze();
        }
    };

    // Boot
    (function boot() {
        if (typeof frappe !== 'undefined' && frappe.dom && frappe.after_ajax) {
            flux.loading.init();
        } else {
            setTimeout(boot, 200);
        }
    })();

})();
