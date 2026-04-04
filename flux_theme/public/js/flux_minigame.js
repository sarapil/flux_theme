// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme — Loading Screen Mini-Game
 * Simple "Catch the Gold Coins" game during long operations
 *
 * @module flux.miniGame
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.miniGame = {
        _canvas: null,
        _ctx: null,
        _running: false,
        _score: 0,
        _coins: [],
        _basket: { x: 0, w: 60, h: 20 },
        _raf: null,
        _containerEl: null,

        init: function() {
            // Feature gate
            if (typeof flux.config !== 'undefined' &&
                typeof flux.config.features !== 'undefined' &&
                flux.config.features.miniGame === false) {
                return;
            }

            // Hook into frappe.show_progress if available
            var self = this;
            if (typeof frappe !== 'undefined') {
                var origShow = frappe.show_progress;
                if (origShow) {
                    frappe.show_progress = function() {
                        origShow.apply(this, arguments);
                        if (!self._running) self._maybeShow();
                    };
                }
            }
        },

        /**
         * Possibly show the mini-game overlay if a long operation is detected
         */
        _maybeShow: function() {
            // Only show if progress bar is visible
            var progressBar = document.querySelector('.progress-chart, .frappe-control[data-fieldtype="Progress"]');
            if (!progressBar) return;
            this.show();
        },

        /**
         * Show the mini-game
         */
        show: function() {
            if (this._running) return;

            var container = document.createElement('div');
            container.className = 'flux-minigame-container';
            container.innerHTML =
                '<div class="flux-minigame-header">' +
                '  <span class="flux-minigame-score">🪙 0</span>' +
                '  <span class="flux-minigame-hint">Move mouse to catch green coins!</span>' +
                '  <button class="flux-minigame-close">&times;</button>' +
                '</div>' +
                '<canvas class="flux-minigame-canvas"></canvas>';

            document.body.appendChild(container);
            this._containerEl = container;

            var canvas = container.querySelector('canvas');
            var cw = Math.min(400, window.innerWidth - 40);
            var ch = 250;
            canvas.width = cw;
            canvas.height = ch;
            this._canvas = canvas;
            this._ctx = canvas.getContext('2d');

            this._score = 0;
            this._coins = [];
            this._basket.x = cw / 2 - 30;
            this._running = true;

            var self = this;

            canvas.addEventListener('mousemove', function(e) {
                var rect = canvas.getBoundingClientRect();
                self._basket.x = e.clientX - rect.left - self._basket.w / 2;
            });

            canvas.addEventListener('touchmove', function(e) {
                e.preventDefault();
                var rect = canvas.getBoundingClientRect();
                var touch = e.touches[0];
                self._basket.x = touch.clientX - rect.left - self._basket.w / 2;
            }, { passive: false });

            container.querySelector('.flux-minigame-close').onclick = function() {
                self.hide();
            };

            requestAnimationFrame(function() { container.classList.add('visible'); });
            this._spawnInterval = setInterval(function() { self._spawnCoin(); }, 700);
            this._gameLoop();
        },

        /**
         * Hide / stop the mini-game
         */
        hide: function() {
            this._running = false;
            if (this._raf) cancelAnimationFrame(this._raf);
            if (this._spawnInterval) clearInterval(this._spawnInterval);
            if (this._containerEl) {
                this._containerEl.remove();
                this._containerEl = null;
            }
        },

        /**
         * Spawn a falling coin
         */
        _spawnCoin: function() {
            if (!this._canvas) return;
            this._coins.push({
                x: Math.random() * (this._canvas.width - 20),
                y: -20,
                r: 10,
                speed: 1.5 + Math.random() * 2,
                rotation: Math.random() * Math.PI * 2
            });
        },

        /**
         * Main game loop
         */
        _gameLoop: function() {
            if (!this._running) return;

            var ctx = this._ctx;
            var cw = this._canvas.width;
            var ch = this._canvas.height;
            var self = this;

            ctx.clearRect(0, 0, cw, ch);

            // Draw dark background
            ctx.fillStyle = 'rgba(45,52,54,0.9)';
            ctx.fillRect(0, 0, cw, ch);

            // Draw green skyline silhouette at bottom
            ctx.fillStyle = 'rgba(9,180,116,0.1)';
            ctx.beginPath();
            ctx.moveTo(0, ch);
            for (var sx = 0; sx < cw; sx += 30) {
                var bh = 20 + Math.sin(sx * 0.05) * 15 + Math.random() * 5;
                ctx.lineTo(sx, ch - bh);
                ctx.lineTo(sx + 15, ch - bh - 5);
                ctx.lineTo(sx + 30, ch - bh);
            }
            ctx.lineTo(cw, ch);
            ctx.fill();

            // Update and draw coins
            var basket = this._basket;
            var alive = [];
            for (var i = 0; i < this._coins.length; i++) {
                var c = this._coins[i];
                c.y += c.speed;
                c.rotation += 0.05;

                // Check if caught
                if (c.y + c.r >= ch - basket.h - 5 &&
                    c.x >= basket.x && c.x <= basket.x + basket.w) {
                    this._score++;
                    this._updateScore();
                    continue;
                }

                // Remove if off screen
                if (c.y > ch + 20) continue;

                alive.push(c);

                // Draw coin
                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate(c.rotation);

                // Gold circle
                ctx.beginPath();
                ctx.arc(0, 0, c.r, 0, Math.PI * 2);
                ctx.fillStyle = '#09B474';
                ctx.fill();
                ctx.strokeStyle = '#B8842F';
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Inner detail
                ctx.beginPath();
                ctx.arc(0, 0, c.r * 0.6, 0, Math.PI * 2);
                ctx.strokeStyle = '#B8842F';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.restore();
            }
            this._coins = alive;

            // Draw basket
            ctx.fillStyle = '#09B474';
            var bx = basket.x;
            var by = ch - basket.h - 5;
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(bx + basket.w, by);
            ctx.lineTo(bx + basket.w - 8, by + basket.h);
            ctx.lineTo(bx + 8, by + basket.h);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#B8842F';
            ctx.lineWidth = 2;
            ctx.stroke();

            this._raf = requestAnimationFrame(function() { self._gameLoop(); });
        },

        /**
         * Update score display
         */
        _updateScore: function() {
            if (!this._containerEl) return;
            var scoreEl = this._containerEl.querySelector('.flux-minigame-score');
            if (scoreEl) scoreEl.textContent = '🪙 ' + this._score;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.miniGame.init(); });
    } else {
        flux.miniGame.init();
    }
})();
