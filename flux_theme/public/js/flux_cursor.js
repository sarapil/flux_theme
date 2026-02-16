/**
 * FLUX Theme — Cursor Trail Effect
 * Subtle green particle trail following the mouse cursor
 * Disabled by default — enable via FLUX Settings or localStorage
 *
 * @module flux.cursorTrail
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.cursorTrail = {
        _canvas: null,
        _ctx: null,
        _particles: [],
        _animId: null,
        _mouseX: 0,
        _mouseY: 0,
        _enabled: false,

        MAX_PARTICLES: 12,
        PARTICLE_LIFE: 600, // ms

        /**
         * Initialize — check if enabled
         */
        init: function() {
            // Disabled by default — opt-in via settings
            var enabled = localStorage.getItem('flux-cursor-trail') === '1';
            if (flux.config && flux.config.features &&
                flux.config.features.cursor_trail) {
                enabled = true;
            }

            // Skip on mobile / touch
            if ('ontouchstart' in window) return;

            // Skip if reduced motion
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            if (enabled) {
                this.enable();
            }
        },

        /**
         * Enable the cursor trail
         */
        enable: function() {
            if (this._enabled) return;
            this._enabled = true;

            // Create canvas
            this._canvas = document.createElement('canvas');
            this._canvas.className = 'flux-cursor-canvas';
            this._canvas.style.cssText =
                'position:fixed;top:0;left:0;width:100%;height:100%;' +
                'pointer-events:none;z-index:99999;';
            document.body.appendChild(this._canvas);
            this._ctx = this._canvas.getContext('2d');

            this._resize();
            this._bindEvents();
            this._animate();

            localStorage.setItem('flux-cursor-trail', '1');
        },

        /**
         * Disable the cursor trail
         */
        disable: function() {
            this._enabled = false;
            if (this._animId) {
                cancelAnimationFrame(this._animId);
                this._animId = null;
            }
            if (this._canvas) {
                this._canvas.remove();
                this._canvas = null;
                this._ctx = null;
            }
            this._particles = [];
            localStorage.setItem('flux-cursor-trail', '0');
        },

        /**
         * Toggle on/off
         */
        toggle: function() {
            if (this._enabled) {
                this.disable();
            } else {
                this.enable();
            }
            return this._enabled;
        },

        /**
         * Resize canvas to window
         */
        _resize: function() {
            if (!this._canvas) return;
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
        },

        /**
         * Bind mouse + resize events
         */
        _bindEvents: function() {
            var self = this;

            this._mouseMoveHandler = function(e) {
                self._mouseX = e.clientX;
                self._mouseY = e.clientY;
                self._spawn(e.clientX, e.clientY);
            };

            this._resizeHandler = function() {
                self._resize();
            };

            document.addEventListener('mousemove', this._mouseMoveHandler);
            window.addEventListener('resize', this._resizeHandler);
        },

        /**
         * Spawn a new particle at (x, y)
         */
        _spawn: function(x, y) {
            if (this._particles.length >= this.MAX_PARTICLES) return;

            this._particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5 - 0.5,
                size: 2 + Math.random() * 3,
                born: Date.now(),
                life: this.PARTICLE_LIFE,
                hue: 35 + Math.random() * 15 // green hue range
            });
        },

        /**
         * Animation loop
         */
        _animate: function() {
            if (!this._enabled || !this._ctx) return;

            var self = this;
            var ctx = this._ctx;
            var now = Date.now();

            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            // Update & draw particles
            for (var i = this._particles.length - 1; i >= 0; i--) {
                var p = this._particles[i];
                var age = now - p.born;
                var t = age / p.life;

                if (t >= 1) {
                    this._particles.splice(i, 1);
                    continue;
                }

                // Physics
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02; // slight gravity

                // Fade out
                var alpha = 1 - t;
                alpha = alpha * alpha; // ease-out quad
                var size = p.size * (1 - t * 0.5);

                // Draw green particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                ctx.fillStyle = 'hsla(' + p.hue + ', 60%, 65%, ' + (alpha * 0.7) + ')';
                ctx.fill();

                // Glow
                if (alpha > 0.3) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'hsla(' + p.hue + ', 60%, 65%, ' + (alpha * 0.15) + ')';
                    ctx.fill();
                }
            }

            this._animId = requestAnimationFrame(function() {
                self._animate();
            });
        }
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.cursorTrail.init(); });
    } else {
        flux.cursorTrail.init();
    }
})();
