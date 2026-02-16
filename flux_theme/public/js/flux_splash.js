/**
 * FLUX Theme - Splash Screen Controller
 * Shows a brief branded splash on first desk load, then auto-removes.
 *
 * SAFETY: The splash will ALWAYS disappear, even if JS errors occur,
 * thanks to a hard safety timeout that removes it no matter what.
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    flux.splash = {
        config: {
            sessionKey: 'flux_splash_shown',
            displayTime: 2800,
            fadeOutTime: 500,
            maxTimeout: 5000
        },

        init: function() {
            // Feature gate: check if splash is disabled in FLUX Settings
            if (flux.config && flux.config.features && !flux.config.features.splash) {
                return;
            }

            // Merge splash duration from settings
            if (flux.config && flux.config.splashDuration) {
                this.config.displayTime = flux.config.splashDuration;
            }

            // Only show once per browser session
            if (sessionStorage.getItem(this.config.sessionKey)) {
                return;
            }

            // Don't show on login page
            if (document.body.getAttribute('data-path') === 'login' ||
                window.location.pathname.indexOf('/login') !== -1) {
                return;
            }

            // Don't show on non-desk pages (website, portal)
            if (!document.querySelector('.desk-page') && 
                !document.querySelector('#page-Workspaces') &&
                !window.location.pathname.match(/^\/app\//)) {
                return;
            }

            // Respect reduced motion
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                sessionStorage.setItem(this.config.sessionKey, '1');
                return;
            }

            // Mark shown FIRST — so even if we crash below, it won't retry
            sessionStorage.setItem(this.config.sessionKey, '1');

            try {
                this.create();
                this.startSafetyTimer();
                this.animate();
            } catch (e) {
                console.warn('[FLUX] splash error, removing overlay:', e);
                this.remove();
            }
        },

        create: function() {
            this.overlay = document.createElement('div');
            this.overlay.id = 'flux-splash-overlay';
            this.overlay.setAttribute('role', 'status');
            this.overlay.setAttribute('aria-label', 'Loading FLUX');

            this.overlay.innerHTML =
                '<div style="text-align:center;display:flex;flex-direction:column;align-items:center;">' +
                    '<div style="position:relative;width:200px;height:200px;margin-bottom:24px;">' +
                        '<img src="/assets/flux_theme/images/splash.png" ' +
                            'alt="FLUX" ' +
                            'style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);' +
                            'max-width:160px;max-height:160px;opacity:0;transition:opacity 0.4s ease;" ' +
                            'onerror="this.style.display=\'none\'" ' +
                            'class="flux-splash-logo-img">' +
                    '</div>' +
                    '<div class="flux-splash-underline" style="width:0;height:2px;' +
                        'background:linear-gradient(90deg,transparent,#3DD99A,#09B474,#3DD99A,transparent);' +
                        'margin:16px auto;opacity:0;transition:width 0.6s ease,opacity 0.3s ease;"></div>' +
                    '<p class="flux-splash-tagline" style="font-family:'Open Sans',sans-serif;font-size:16px;' +
                        'font-weight:300;color:#F0F5F3;letter-spacing:0.1em;text-transform:uppercase;' +
                        'margin:0;opacity:0;transform:translateY(10px);' +
                        'transition:opacity 0.5s ease,transform 0.5s ease;"></p>' +
                '</div>';

            // CRITICAL: position:fixed ensures it doesn't affect page flow
            this.overlay.style.cssText =
                'position:fixed !important;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;' +
                'background:#2D3436;z-index:99999;' +
                'display:flex;align-items:center;justify-content:center;' +
                'opacity:1;transition:opacity 0.5s ease;' +
                'margin:0;padding:0;border:none;overflow:hidden;';

            document.body.appendChild(this.overlay);

            // Inject modern city skyline as splash background
            this._injectSkyline();
        },

        animate: function() {
            var self = this;

            setTimeout(function() {
                if (!self.overlay) return;

                // Show logo
                var logo = self.overlay.querySelector('.flux-splash-logo-img');
                if (logo) logo.style.opacity = '1';

                // Show underline
                setTimeout(function() {
                    if (!self.overlay) return;
                    var underline = self.overlay.querySelector('.flux-splash-underline');
                    if (underline) {
                        underline.style.width = '200px';
                        underline.style.opacity = '1';
                    }
                }, 600);

                // Show tagline
                setTimeout(function() {
                    if (!self.overlay) return;
                    var tagline = self.overlay.querySelector('.flux-splash-tagline');
                    if (tagline) {
                        tagline.textContent = '© 2026 Flux. All rights reserved.';
                        tagline.style.opacity = '0.8';
                        tagline.style.transform = 'translateY(0)';
                    }
                }, 1000);

                // Fade out
                setTimeout(function() {
                    self.fadeOut();
                }, self.config.displayTime);
            }, 100);
        },

        fadeOut: function() {
            if (!this.overlay) return;
            var self = this;
            this.overlay.style.opacity = '0';
            this.overlay.style.pointerEvents = 'none';
            setTimeout(function() {
                self.remove();
            }, self.config.fadeOutTime);
        },

        remove: function() {
            if (this.overlay && this.overlay.parentNode) {
                this.overlay.parentNode.removeChild(this.overlay);
            }
            this.overlay = null;
            if (this._safetyTimer) {
                clearTimeout(this._safetyTimer);
                this._safetyTimer = null;
            }
        },

        /** Guarantees overlay removal even if everything else fails */
        startSafetyTimer: function() {
            var self = this;
            this._safetyTimer = setTimeout(function() {
                console.warn('[FLUX] splash safety timeout — force removing');
                self.remove();
            }, self.config.maxTimeout);
        },

        /** Inject modern city skyline scene into the splash overlay */
        _injectSkyline: function() {
            if (!this.overlay) return;
            if (typeof flux.skyline !== 'undefined' && flux.skyline.create) {
                var skyContainer = document.createElement('div');
                skyContainer.style.cssText =
                    'position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden;';
                this.overlay.insertBefore(skyContainer, this.overlay.firstChild);
                flux.skyline.create(skyContainer, {
                    fullScene: true, showStars: true,
                    showWater: true, showReflections: true, animated: true
                });
                // Ensure content sits above skyline
                var content = this.overlay.querySelector('div[style*="text-align"]');
                if (content) content.style.position = 'relative';
                if (content) content.style.zIndex = '1';
            }
        },

        /** For testing: show splash again */
        forceShow: function() {
            sessionStorage.removeItem(this.config.sessionKey);
            this.init();
        },

        /** For testing: clear session flag */
        reset: function() {
            sessionStorage.removeItem(this.config.sessionKey);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            flux.splash.init();
        });
    } else {
        flux.splash.init();
    }

})();
