// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme - Theme Initializer & Coordinator
 * Modern Co-Working Space Theme for Frappe 16
 * 
 * This is the main entry point that coordinates all theme modules.
 */

(function() {
    'use strict';

    // FLUX Theme Namespace
    window.flux = window.flux || {};

    // Theme Configuration
    flux.config = {
        version: '16.0.0',
        brandName: 'FLUX',
        paths: {
            logo: '/assets/flux_theme/images/logo.png',
            logoHeader: '/assets/flux_theme/images/logo-header.png',
            logoLogin: '/assets/flux_theme/images/logo-login.png',
            logoIcon: '/assets/flux_theme/images/logo-icon.png',
            splash: '/assets/flux_theme/images/splash.png',
            skyline: '/assets/flux_theme/svg/city_skyline.svg',
            pattern: '/assets/flux_theme/svg/brand-pattern.svg'
        },
        colors: {
            green: '#09B474',
            greenLight: '#3DD99A',
            greenDark: '#067A4E',
            navy: '#2D3436',
            navyLight: '#3D4F51',
            navyDeep: '#1A2526',
            cream: '#F0F5F3',
            creamWarm: '#E0EDE7'
        },
        animations: {
            enabled: true,
            reducedMotion: false
        }
    };

    /**
     * Initialize the FLUX theme
     */
    flux.init = function() {
        // Merge settings from boot session (FLUX Settings DocType)
        flux.mergeBootSettings();

        // Check for reduced motion preference
        flux.config.animations.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Initialize components
        flux.initFavicon();
        flux.initMetaTags();
        flux.initAccessibility();
        flux.initEventListeners();
        flux.applyColorOverrides();
        flux.applyCustomCode();
        
        // Log initialization (dev mode only)
        if (frappe && frappe.boot && frappe.boot.developer_mode) {
            console.log('%c🏙️ FLUX Theme v' + flux.config.version + ' initialized', 
                'color: #09B474; font-weight: bold; font-size: 14px;');
        }

        // Easter egg: Konami code
        flux.initEasterEgg();
    };

    /**
     * Merge settings from boot session (FLUX Settings DocType)
     */
    flux.mergeBootSettings = function() {
        if (!frappe || !frappe.boot || !frappe.boot.flux_theme) return;

        var s = frappe.boot.flux_theme;

        // Store full settings reference
        flux.settings = s;

        // Merge into config
        if (s.brand_name) flux.config.brandName = s.brand_name;
        if (s.logo_url) flux.config.paths.logoHeader = s.logo_url;
        if (s.favicon_url) flux.config.paths.favicon = s.favicon_url;
        if (s.primary_color) flux.config.colors.green = s.primary_color;
        if (s.secondary_color) flux.config.colors.navy = s.secondary_color;
        if (s.accent_color) flux.config.colors.cream = s.accent_color;

        // Feature toggles
        flux.config.features = {
            splash: !!s.enable_splash_screen,
            skyline: !!s.enable_skyline,
            particles: !!s.enable_particles,
            sounds: !!s.enable_sounds,
            searchOverlay: !!s.enable_search_overlay,
            defaultDark: !!s.default_dark_mode
        };

        flux.config.splashDuration = s.splash_duration || 2800;
        if (s.splash_logo_url) flux.config.paths.splash = s.splash_logo_url;
    };

    /**
     * Apply color overrides as CSS custom properties
     */
    flux.applyColorOverrides = function() {
        if (!flux.settings) return;
        var root = document.documentElement;
        var s = flux.settings;

        if (s.primary_color && s.primary_color !== '#09B474') {
            root.style.setProperty('--flux-green', s.primary_color);
        }
        if (s.secondary_color && s.secondary_color !== '#2D3436') {
            root.style.setProperty('--flux-dark', s.secondary_color);
        }
        if (s.accent_color && s.accent_color !== '#F0F5F3') {
            root.style.setProperty('--flux-light', s.accent_color);
        }
    };

    /**
     * Inject custom CSS/JS from FLUX Settings
     */
    flux.applyCustomCode = function() {
        if (!flux.settings) return;

        // Custom CSS
        if (flux.settings.custom_css) {
            var style = document.createElement('style');
            style.id = 'flux-custom-css';
            style.textContent = flux.settings.custom_css;
            // Remove previous injection if any
            var old = document.getElementById('flux-custom-css');
            if (old) old.remove();
            document.head.appendChild(style);
        }

        // Custom JS
        if (flux.settings.custom_js) {
            try {
                var fn = new Function(flux.settings.custom_js);
                fn();
            } catch (e) {
                console.warn('[FLUX] Custom JS error:', e);
            }
        }
    };

    /**
     * Set favicon dynamically
     */
    flux.initFavicon = function() {
        // Remove existing favicons
        const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
        existingFavicons.forEach(el => el.remove());

        // Add FLUX favicons
        const favicons = [
            { rel: 'icon', type: 'image/x-icon', href: '/assets/flux_theme/images/favicon.ico' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/flux_theme/images/favicon-16x16.png' },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/flux_theme/images/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/assets/flux_theme/images/favicon-48x48.png' },
            { rel: 'apple-touch-icon', sizes: '192x192', href: '/assets/flux_theme/images/favicon-192.png' }
        ];

        favicons.forEach(function(favicon) {
            const link = document.createElement('link');
            Object.keys(favicon).forEach(function(key) {
                link.setAttribute(key, favicon[key]);
            });
            document.head.appendChild(link);
        });
    };

    /**
     * Set meta tags for branding
     */
    flux.initMetaTags = function() {
        // Update page title format
        const updateTitle = function() {
            if (!document.title.includes('FLUX')) {
                const originalTitle = document.title.replace(/\s*-\s*(ERPNext|Frappe).*$/i, '');
                document.title = originalTitle + ' | FLUX';
            }
        };

        updateTitle();

        // Observe title changes
        const titleObserver = new MutationObserver(updateTitle);
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
        }

        // Set theme color meta tag
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.content = flux.config.colors.navy;
    };

    /**
     * Initialize accessibility features
     */
    flux.initAccessibility = function() {
        // Add skip link if not present
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Add main content landmark if not present
        const mainContent = document.querySelector('.layout-main-section, .page-container');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('role', 'main');
        }
    };

    /**
     * Set up event listeners
     */
    flux.initEventListeners = function() {
        // Listen for page changes (SPA navigation)
        if (frappe && frappe.router) {
            frappe.router.on('change', function() {
                flux.onPageChange();
            });
        }

        // Listen for reduced motion preference changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
            flux.config.animations.reducedMotion = e.matches;
            document.body.classList.toggle('reduced-motion', e.matches);
        });

        // Add time-aware theme class
        flux.updateTimeAwareTheme();
        setInterval(flux.updateTimeAwareTheme, 60000); // Update every minute
    };

    /**
     * Handle page changes — apply transition animations
     */
    flux.onPageChange = function() {
        if (flux.config.animations.reducedMotion) return;

        requestAnimationFrame(function() {
            var pageContent = document.querySelector('.page-container, .layout-main-section');
            if (!pageContent) return;

            // Determine transition type based on navigation
            var route = frappe.get_route_str ? frappe.get_route_str() : '';
            var prevRoute = flux._prevRoute || '';
            flux._prevRoute = route;

            // Choose animation
            var animClass = 'page-content-enter';
            if (prevRoute && route) {
                var prevParts = prevRoute.split('/');
                var currParts = route.split('/');
                // Deeper navigation = slide left, going back = slide right
                if (currParts.length > prevParts.length) {
                    animClass = 'page-slide-left';
                } else if (currParts.length < prevParts.length) {
                    animClass = 'page-slide-right';
                }
            }

            // Remove all transition classes
            pageContent.classList.remove('page-content-enter', 'page-slide-left',
                'page-slide-right', 'page-fade-scale');
            void pageContent.offsetWidth; // Trigger reflow
            pageContent.classList.add(animClass);

            // Stagger list rows if on list view
            flux._staggerListRows();

            // Stagger workspace widgets
            flux._staggerWidgets();
        });
    };

    /**
     * Stagger list view rows
     */
    flux._staggerListRows = function() {
        var rows = document.querySelectorAll('.list-row-container:not(.head), .frappe-list .list-row:not(.list-row--head)');
        for (var i = 0; i < Math.min(rows.length, 30); i++) {
            (function(el, idx) {
                el.classList.remove('flux-stagger-in');
                el.style.animationDelay = (idx * 0.03) + 's';
                void el.offsetWidth;
                el.classList.add('flux-stagger-in');
            })(rows[i], i);
        }
    };

    /**
     * Stagger workspace widgets
     */
    flux._staggerWidgets = function() {
        var widgets = document.querySelectorAll('.widget:not(.flux-stagger-done)');
        for (var i = 0; i < widgets.length; i++) {
            (function(el, idx) {
                el.classList.add('flux-stagger-done');
                el.style.animationDelay = (idx * 0.05) + 's';
                el.classList.add('flux-stagger-in');
            })(widgets[i], i);
        }
    };

    /**
     * Update theme based on time of day
     */
    flux.updateTimeAwareTheme = function() {
        const hour = new Date().getHours();
        const isNight = hour < 6 || hour >= 18;
        document.body.classList.toggle('flux-night', isNight);
        document.body.classList.toggle('flux-day', !isNight);
    };

    /**
     * Show success flash on element
     */
    flux.showSuccessFlash = function(element) {
        if (!element || flux.config.animations.reducedMotion) return;
        
        element.classList.add('flux-success-flash');
        setTimeout(function() {
            element.classList.remove('flux-success-flash');
        }, 500);
    };

    /**
     * Initialize Konami code easter egg
     */
    flux.initEasterEgg = function() {
        const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        let konamiIndex = 0;

        document.addEventListener('keydown', function(e) {
            if (e.keyCode === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    console.log('%c🏗️ Built by Arkan Labs', 
                        'color: #09B474; font-weight: bold; font-size: 16px; ' +
                        'background: #2D3436; padding: 10px 20px; border-radius: 4px;');
                    console.log('%c© 2026 Flux. All rights reserved. ✨', 
                        'color: #3DD99A; font-style: italic;');
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    };

    /**
     * Utility: Detect if on login page
     */
    flux.isLoginPage = function() {
        return document.body.classList.contains('frappe-login') ||
               window.location.pathname.includes('/login') ||
               document.querySelector('.page-card-container') !== null;
    };

    /**
     * Utility: Detect if reduced motion is preferred
     */
    flux.prefersReducedMotion = function() {
        return flux.config.animations.reducedMotion;
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', flux.init);
    } else {
        flux.init();
    }

    // Also initialize when Frappe is ready (for SPA pages)
    if (typeof frappe !== 'undefined' && frappe.ready) {
        frappe.ready(function() {
            // Re-run initialization for any Frappe-specific setup
            if (!window.flux._initialized) {
                flux.init();
                window.flux._initialized = true;
            }
        });
    }

})();
