// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme — PWA Support
 * Service worker registration and install prompt
 *
 * @module flux.pwa
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.pwa = {
        _deferredPrompt: null,
        _installBtn: null,

        init: function() {
            // Feature gate
            if (typeof flux.config !== 'undefined' &&
                typeof flux.config.features !== 'undefined' &&
                flux.config.features.pwa === false) {
                return;
            }

            this._registerManifest();
            this._registerServiceWorker();
            this._handleInstallPrompt();
        },

        /**
         * Inject manifest link tag
         */
        _registerManifest: function() {
            if (document.querySelector('link[rel="manifest"]')) return;

            var link = document.createElement('link');
            link.rel = 'manifest';
            link.href = '/assets/flux_theme/manifest.json';
            document.head.appendChild(link);

            // Theme color meta
            var meta = document.querySelector('meta[name="theme-color"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'theme-color';
                document.head.appendChild(meta);
            }
            meta.content = '#09B474';

            // Apple touch icon
            var apple = document.querySelector('link[rel="apple-touch-icon"]');
            if (!apple) {
                apple = document.createElement('link');
                apple.rel = 'apple-touch-icon';
                apple.href = '/assets/flux_theme/images/flux-icon-192.png';
                document.head.appendChild(apple);
            }
        },

        /**
         * Register service worker (if available)
         */
        _registerServiceWorker: function() {
            if (!('serviceWorker' in navigator)) return;

            navigator.serviceWorker.register('/assets/flux_theme/sw.js', {
                scope: '/desk'
            }).then(function(reg) {
                console.log('[FLUX] Service worker registered:', reg.scope);
            }).catch(function(err) {
                // Silent fail — SW is optional
                console.log('[FLUX] SW registration skipped:', err.message);
            });
        },

        /**
         * Handle beforeinstallprompt for A2HS (Add to Home Screen)
         */
        _handleInstallPrompt: function() {
            var self = this;

            window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                self._deferredPrompt = e;
                self._showInstallButton();
            });

            window.addEventListener('appinstalled', function() {
                self._hideInstallButton();
                self._deferredPrompt = null;
            });
        },

        /**
         * Show install button in navbar
         */
        _showInstallButton: function() {
            if (this._installBtn) return;

            var btn = document.createElement('button');
            btn.className = 'flux-pwa-install-btn';
            btn.innerHTML = '📲';
            btn.title = 'Install FLUX App';

            var self = this;
            btn.onclick = function() { self.promptInstall(); };

            // v16: navbar is minimal — try sidebar first, then navbar as fallback
            var sidebarBottom = document.querySelector('.body-sidebar-bottom');
            var navbar = document.querySelector('.navbar .navbar-nav:last-child') ||
                         document.querySelector('.navbar-right');

            if (sidebarBottom) {
                var div = document.createElement('div');
                div.className = 'flux-pwa-install-btn flux-sidebar-action';
                div.innerHTML =
                    '<a class="item-anchor" role="button" title="Install FLUX App">' +
                    '<span class="sidebar-item-icon">📲</span>' +
                    '<span class="sidebar-item-label">Install App</span></a>';
                div.querySelector('a').onclick = function() { self.promptInstall(); };
                sidebarBottom.insertBefore(div, sidebarBottom.firstChild);
                this._installBtn = div;
            } else if (navbar) {
                var li = document.createElement('li');
                li.className = 'nav-item';
                li.appendChild(btn);
                navbar.prepend(li);
                this._installBtn = li;
            }
        },

        /**
         * Hide install button
         */
        _hideInstallButton: function() {
            if (this._installBtn) {
                this._installBtn.remove();
                this._installBtn = null;
            }
        },

        /**
         * Trigger install prompt
         */
        promptInstall: function() {
            if (!this._deferredPrompt) return;

            this._deferredPrompt.prompt();
            this._deferredPrompt.userChoice.then(function(result) {
                if (result.outcome === 'accepted') {
                    console.log('[FLUX] PWA installed');
                }
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.pwa.init(); });
    } else {
        flux.pwa.init();
    }
})();
