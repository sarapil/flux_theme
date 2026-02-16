/**
 * FLUX Theme - Login Page Enhancement
 * Injects animated modern city skyline, floating green particles,
 * and brand elements into the Frappe login page.
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    flux.login = {
        /**
         * Initialize login page enhancements
         */
        init: function() {
            // Only run on login page
            if (!this.isLoginPage()) return;

            try {
                this.injectSkyline();
                this.injectParticles();
                this.injectBrandFooter();
                this.enhanceLogo();

                if (window.flux.config && frappe && frappe.boot && frappe.boot.developer_mode) {
                    console.log('%c🏙️ FLUX Login page enhanced', 'color: #09B474; font-weight: bold;');
                }
            } catch (e) {
                console.warn('[FLUX] Login enhancement error:', e);
            }
        },

        /**
         * Check if current page is login
         */
        isLoginPage: function() {
            return document.body.getAttribute('data-path') === 'login' ||
                   window.location.pathname.includes('/login');
        },

        /**
         * Inject modern city skyline SVG at the bottom
         */
        injectSkyline: function() {
            if (document.getElementById('flux-login-skyline')) return;

            var container = document.createElement('div');
            container.id = 'flux-login-skyline';

            // Use the skyline module if available, otherwise create a simple one
            if (window.flux.skyline && window.flux.skyline.create) {
                flux.skyline.create(container, {
                    fullScene: true,
                    showStars: false,
                    showWater: true,
                    showReflections: true,
                    animated: true
                });
            } else {
                // Fallback: simple CSS skyline
                container.innerHTML = this.createFallbackSkyline();
            }

            document.body.appendChild(container);
        },

        /**
         * Create fallback skyline SVG if module not loaded
         */
        createFallbackSkyline: function() {
            return '<svg viewBox="0 0 1920 400" preserveAspectRatio="xMidYMax slice" ' +
                'style="position:absolute;bottom:0;left:0;width:100%;height:100%;">' +
                '<defs>' +
                    '<linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                        '<stop offset="0%" style="stop-color:#1A2526;stop-opacity:0"/>' +
                        '<stop offset="100%" style="stop-color:#0a0f1a"/>' +
                    '</linearGradient>' +
                '</defs>' +
                '<rect width="1920" height="400" fill="url(#skyGrad)"/>' +
                // Central Tower
                '<path d="M960,400 L960,50 L965,30 L970,50 L970,400 Z" fill="#0D1117" opacity="0.8"/>' +
                '<rect x="962" y="15" width="6" height="20" fill="#0D1117" opacity="0.8"/>' +
                // Emirates Towers
                '<path d="M400,400 L415,120 L430,120 L445,400 Z" fill="#0D1117" opacity="0.7"/>' +
                '<path d="M460,400 L472,140 L484,140 L496,400 Z" fill="#0D1117" opacity="0.7"/>' +
                // Innovation Hub
                '<path d="M1300,400 L1330,100 Q1365,80 1400,100 L1430,400 Q1365,380 1300,400" fill="#0D1117" opacity="0.7"/>' +
                // City Gateway
                '<path d="M700,400 L700,160 L720,160 L720,180 L760,180 L760,160 L780,160 L780,400 L760,400 L760,200 L720,200 L720,400 Z" fill="#0D1117" opacity="0.65"/>' +
                // Generic buildings
                '<rect x="100" y="260" width="60" height="140" fill="#0D1117" opacity="0.5"/>' +
                '<rect x="180" y="220" width="45" height="180" fill="#0D1117" opacity="0.5"/>' +
                '<rect x="240" y="280" width="50" height="120" fill="#0D1117" opacity="0.5"/>' +
                '<rect x="520" y="240" width="55" height="160" fill="#0D1117" opacity="0.55"/>' +
                '<rect x="590" y="200" width="40" height="200" fill="#0D1117" opacity="0.55"/>' +
                '<rect x="820" y="250" width="50" height="150" fill="#0D1117" opacity="0.6"/>' +
                '<rect x="880" y="280" width="40" height="120" fill="#0D1117" opacity="0.6"/>' +
                '<rect x="1000" y="230" width="55" height="170" fill="#0D1117" opacity="0.6"/>' +
                '<rect x="1070" y="260" width="45" height="140" fill="#0D1117" opacity="0.55"/>' +
                '<rect x="1130" y="220" width="50" height="180" fill="#0D1117" opacity="0.55"/>' +
                '<rect x="1200" y="270" width="40" height="130" fill="#0D1117" opacity="0.5"/>' +
                '<rect x="1480" y="240" width="55" height="160" fill="#0D1117" opacity="0.5"/>' +
                '<rect x="1550" y="280" width="45" height="120" fill="#0D1117" opacity="0.5"/>' +
                '<rect x="1620" y="250" width="60" height="150" fill="#0D1117" opacity="0.45"/>' +
                '<rect x="1700" y="290" width="50" height="110" fill="#0D1117" opacity="0.45"/>' +
                '<rect x="1770" y="260" width="40" height="140" fill="#0D1117" opacity="0.4"/>' +
                // Building windows (green dots)
                this.createWindowLights() +
                // Water reflection line
                '<line x1="0" y1="398" x2="1920" y2="398" stroke="#09B474" stroke-width="1" opacity="0.15"/>' +
            '</svg>';
        },

        /**
         * Generate random green window lights for buildings
         */
        createWindowLights: function() {
            var lights = '';
            var buildings = [
                {x: 110, y: 280, w: 40, h: 100},
                {x: 190, y: 240, w: 25, h: 140},
                {x: 530, y: 260, w: 35, h: 120},
                {x: 960, y: 80, w: 8, h: 300},
                {x: 1010, y: 250, w: 35, h: 130},
                {x: 1140, y: 240, w: 30, h: 140},
                {x: 1490, y: 260, w: 35, h: 120}
            ];

            for (var b = 0; b < buildings.length; b++) {
                var bld = buildings[b];
                for (var i = 0; i < 5; i++) {
                    var wx = bld.x + Math.floor(Math.random() * bld.w);
                    var wy = bld.y + Math.floor(Math.random() * bld.h);
                    var opacity = (0.2 + Math.random() * 0.5).toFixed(2);
                    lights += '<rect x="' + wx + '" y="' + wy + '" width="3" height="4" fill="#09B474" opacity="' + opacity + '"/>';
                }
            }
            return lights;
        },

        /**
         * Inject floating green particles canvas
         */
        injectParticles: function() {
            if (document.getElementById('flux-login-particles')) return;
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            var canvas = document.createElement('canvas');
            canvas.id = 'flux-login-particles';
            document.body.appendChild(canvas);

            var ctx = canvas.getContext('2d');
            var particles = [];
            var particleCount = 35;

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            // Create particles
            for (var i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: 0.5 + Math.random() * 2,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: -0.15 - Math.random() * 0.3,
                    opacity: 0.05 + Math.random() * 0.2,
                    phase: Math.random() * Math.PI * 2
                });
            }

            function animate(timestamp) {
                if (!document.getElementById('flux-login-particles')) return;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (var i = 0; i < particles.length; i++) {
                    var p = particles[i];
                    
                    // Update position
                    p.x += p.speedX + Math.sin(timestamp / 3000 + p.phase) * 0.1;
                    p.y += p.speedY;

                    // Wrap around
                    if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
                    if (p.x < -10) p.x = canvas.width + 10;
                    if (p.x > canvas.width + 10) p.x = -10;

                    // Gentle pulse
                    var pulse = 0.5 + 0.5 * Math.sin(timestamp / 2000 + p.phase);
                    var alpha = p.opacity * (0.6 + 0.4 * pulse);

                    // Draw green particle with glow
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(9, 180, 116, ' + alpha + ')';
                    ctx.fill();

                    // Subtle glow
                    if (p.size > 1.2) {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(9, 180, 116, ' + (alpha * 0.15) + ')';
                        ctx.fill();
                    }
                }

                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        },

        /**
         * Inject FLUX brand footer
         */
        injectBrandFooter: function() {
            if (document.getElementById('flux-login-brand')) return;

            var brand = document.createElement('div');
            brand.id = 'flux-login-brand';
            brand.innerHTML = '<div class="brand-text">© 2026 Flux. All rights reserved.</div>';
            document.body.appendChild(brand);
        },

        /**
         * Enhance the login logo with FLUX branding
         */
        enhanceLogo: function() {
            var logo = document.querySelector('.page-card-head .app-logo');
            if (logo) {
                logo.src = '/assets/flux_theme/images/logo-login.png';
                logo.alt = 'FLUX';
                logo.style.maxHeight = '72px';
            }

            // Update page title
            var title = document.querySelector('.page-card-head h4');
            if (title) {
                title.textContent = 'Welcome to FLUX';
            }
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            flux.login.init();
        });
    } else {
        // Small delay to ensure Frappe has rendered
        setTimeout(function() {
            flux.login.init();
        }, 100);
    }

})();
