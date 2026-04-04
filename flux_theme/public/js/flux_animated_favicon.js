// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme — Animated Favicon
 * Pulsing green favicon during page loads, notification badge
 *
 * @module flux.animatedFavicon
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.animatedFavicon = {
        _canvas: null,
        _ctx: null,
        _link: null,
        _animating: false,
        _frame: 0,
        _raf: null,
        _originalHref: '',

        /**
         * Initialize animated favicon
         */
        init: function() {
            // Feature gate
            if (typeof flux.config !== 'undefined' &&
                typeof flux.config.features !== 'undefined' &&
                flux.config.features.animatedFavicon === false) {
                return;
            }

            this._canvas = document.createElement('canvas');
            this._canvas.width = 32;
            this._canvas.height = 32;
            this._ctx = this._canvas.getContext('2d');

            this._link = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
            if (this._link) {
                this._originalHref = this._link.href;
            }

            this._hookIntoNavigation();
        },

        /**
         * Hook into frappe navigation to animate during page loads
         */
        _hookIntoNavigation: function() {
            var self = this;

            // Animate on page change start
            if (typeof frappe !== 'undefined') {
                // Intercept frappe.set_route
                var origSetRoute = frappe.set_route;
                if (origSetRoute) {
                    frappe.set_route = function() {
                        self.startAnimation();
                        var result = origSetRoute.apply(this, arguments);
                        setTimeout(function() { self.stopAnimation(); }, 2000);
                        return result;
                    };
                }

                // Also animate on AJAX
                $(document).ajaxStart(function() {
                    self.startAnimation();
                });
                $(document).ajaxStop(function() {
                    setTimeout(function() { self.stopAnimation(); }, 300);
                });
            }
        },

        /**
         * Start the pulsing animation
         */
        startAnimation: function() {
            if (this._animating) return;
            this._animating = true;
            this._frame = 0;
            this._animate();
        },

        /**
         * Stop animation and restore original favicon
         */
        stopAnimation: function() {
            this._animating = false;
            if (this._raf) cancelAnimationFrame(this._raf);
            this._restoreOriginal();
        },

        /**
         * Animation loop — pulsing green diamond
         */
        _animate: function() {
            if (!this._animating) return;

            var ctx = this._ctx;
            var size = 32;
            var center = size / 2;

            ctx.clearRect(0, 0, size, size);

            this._frame++;
            var pulse = Math.sin(this._frame * 0.1) * 0.15 + 0.85;
            var glow = Math.sin(this._frame * 0.08) * 0.3 + 0.7;

            // Background circle
            ctx.beginPath();
            ctx.arc(center, center, 14 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#2D3436';
            ctx.fill();

            // Gold ring
            ctx.beginPath();
            ctx.arc(center, center, 13 * pulse, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(9,180,116,' + glow + ')';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Gold "T" letter
            ctx.fillStyle = '#09B474';
            ctx.font = 'bold ' + Math.round(16 * pulse) + 'px Open Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('T', center, center + 1);

            // Update favicon
            this._updateFavicon();

            var self = this;
            this._raf = requestAnimationFrame(function() { self._animate(); });
        },

        /**
         * Show notification badge on favicon
         */
        showBadge: function(count) {
            var ctx = this._ctx;
            var size = 32;

            // Draw base favicon first
            ctx.clearRect(0, 0, size, size);
            ctx.beginPath();
            ctx.arc(16, 16, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#2D3436';
            ctx.fill();

            ctx.fillStyle = '#09B474';
            ctx.font = 'bold 16px Open Sans, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('T', 16, 17);

            // Red badge
            if (count > 0) {
                ctx.beginPath();
                ctx.arc(24, 8, 7, 0, Math.PI * 2);
                ctx.fillStyle = '#E74C3C';
                ctx.fill();

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 9px sans-serif';
                ctx.fillText(count > 9 ? '9+' : String(count), 24, 9);
            }

            this._updateFavicon();
        },

        /**
         * Update the page's favicon from canvas
         */
        _updateFavicon: function() {
            if (!this._link) {
                this._link = document.createElement('link');
                this._link.rel = 'icon';
                document.head.appendChild(this._link);
            }
            try {
                this._link.href = this._canvas.toDataURL('image/png');
            } catch(e) {}
        },

        /**
         * Restore original favicon
         */
        _restoreOriginal: function() {
            if (this._link && this._originalHref) {
                this._link.href = this._originalHref;
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.animatedFavicon.init(); });
    } else {
        flux.animatedFavicon.init();
    }
})();
