// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme — Seasonal Theme Variants
 * Auto-detects season and applies subtle color/decoration overrides
 * 
 * Seasons:
 *   - Ramadan:       Gold/green crescent decorations
 *   - UAE National Day (Dec 2): Red/green/white/black flag accents
 *   - Winter:        Cool silver-blue tones
 *   - Spring:        Warm floral green
 *   - Summer:        Bright sandy green (default FLUX)
 * 
 * @module flux.seasons
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.seasons = {
        _currentSeason: null,

        /**
         * Initialize seasonal theming
         */
        init: function() {
            // Check if feature is enabled
            if (flux.config && flux.config.features &&
                flux.config.features.enable_seasonal === false) {
                return;
            }

            this._currentSeason = this.detectSeason();
            this.apply(this._currentSeason);
        },

        /**
         * Detect the current season/event based on date
         * @returns {string} Season identifier
         */
        detectSeason: function() {
            var now = new Date();
            var month = now.getMonth() + 1; // 1-12
            var day = now.getDate();

            // ── UAE National Day: Nov 28 – Dec 5 ──
            if ((month === 11 && day >= 28) || (month === 12 && day <= 5)) {
                return 'national-day';
            }

            // ── Ramadan (approximate — shifts ~11 days/year) ──
            // For 2026: ~Feb 18 - Mar 19 (Hijri 1447)
            // For 2027: ~Feb 7 - Mar 9
            // We use an approximate window; can be refined with Islamic calendar
            if (this._isRamadan(now)) {
                return 'ramadan';
            }

            // ── Eid al-Fitr (3 days after Ramadan ends) ──
            if (this._isEidAlFitr(now)) {
                return 'eid';
            }

            // ── Seasonal fallback ──
            if (month >= 3 && month <= 5) return 'spring';
            if (month >= 6 && month <= 9) return 'summer';
            if (month >= 10 || month <= 2) return 'winter';

            return 'default';
        },

        /**
         * Approximate Ramadan detection
         * This is a simplified check — ideally should use Hijri calendar
         */
        _isRamadan: function(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            // Known approximate Ramadan dates (update yearly)
            var ramadanDates = {
                2025: { startMonth: 3, startDay: 1, endMonth: 3, endDay: 29 },
                2026: { startMonth: 2, startDay: 18, endMonth: 3, endDay: 19 },
                2027: { startMonth: 2, startDay: 7, endMonth: 3, endDay: 9 },
                2028: { startMonth: 1, startDay: 28, endMonth: 2, endDay: 25 },
                2029: { startMonth: 1, startDay: 16, endMonth: 2, endDay: 14 },
                2030: { startMonth: 1, startDay: 6, endMonth: 2, endDay: 3 }
            };

            var r = ramadanDates[year];
            if (!r) return false;

            var start = new Date(year, r.startMonth - 1, r.startDay);
            var end = new Date(year, r.endMonth - 1, r.endDay);
            return date >= start && date <= end;
        },

        /**
         * Approximate Eid al-Fitr (3 days after Ramadan)
         */
        _isEidAlFitr: function(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();

            var eidDates = {
                2025: { month: 3, startDay: 30, endDay: 32 }, // wraps to April
                2026: { month: 3, startDay: 20, endDay: 22 },
                2027: { month: 3, startDay: 10, endDay: 12 },
                2028: { month: 2, startDay: 26, endDay: 28 },
                2029: { month: 2, startDay: 15, endDay: 17 },
                2030: { month: 2, startDay: 4, endDay: 6 }
            };

            var e = eidDates[year];
            if (!e) return false;

            // Simple range check
            var start = new Date(year, e.month - 1, e.startDay);
            var end = new Date(year, e.month - 1, e.endDay + 1);
            return date >= start && date < end;
        },

        /**
         * Apply seasonal theme
         * @param {string} season - Season identifier
         */
        apply: function(season) {
            // Remove any existing season class
            var body = document.body;
            var classes = body.className.split(' ').filter(function(c) {
                return c.indexOf('flux-season-') !== 0;
            });
            body.className = classes.join(' ');

            // Add new season class
            body.classList.add('flux-season-' + season);

            // Apply CSS variable overrides
            var root = document.documentElement;
            var palette = this._getPalette(season);

            if (palette) {
                for (var key in palette) {
                    root.style.setProperty('--flux-season-' + key, palette[key]);
                }
            }

            // Add decorative elements for special events
            if (season === 'ramadan' || season === 'eid') {
                this._addRamadanDecor();
            } else if (season === 'national-day') {
                this._addNationalDayDecor();
            } else if (season === 'winter') {
                this._addWinterDecor();
            }

            // Log in dev mode
            if (typeof frappe !== 'undefined' && frappe.boot && frappe.boot.developer_mode) {
                console.log('[FLUX Seasons] Applied: ' + season);
            }
        },

        /**
         * Get color palette for each season
         */
        _getPalette: function(season) {
            var palettes = {
                'ramadan': {
                    accent: '#09B474',       // Green
                    'accent-light': '#4A9B6F',
                    glow: 'rgba(45, 106, 79, 0.2)',
                    'decor-primary': '#09B474',   // Gold crescent
                    'decor-secondary': '#09B474'  // Green
                },
                'eid': {
                    accent: '#09B474',
                    'accent-light': '#3DD99A',
                    glow: 'rgba(9, 180, 116, 0.3)',
                    'decor-primary': '#09B474',
                    'decor-secondary': '#E0EDE7'
                },
                'national-day': {
                    accent: '#CE1126',       // UAE Red
                    'accent-light': '#E8434C',
                    glow: 'rgba(206, 17, 38, 0.15)',
                    'decor-primary': '#CE1126',   // Red
                    'decor-secondary': '#009739', // Green
                    'decor-tertiary': '#FFFFFF',  // White
                    'decor-quaternary': '#000000'  // Black
                },
                'winter': {
                    accent: '#8BA7C5',       // Cool silver-blue
                    'accent-light': '#A8C4DB',
                    glow: 'rgba(139, 167, 197, 0.15)',
                    'decor-primary': '#C0C0C0',
                    'decor-secondary': '#8BA7C5'
                },
                'spring': {
                    accent: '#D4A857',       // Warm green
                    'accent-light': '#E2C17A',
                    glow: 'rgba(212, 168, 87, 0.15)',
                    'decor-primary': '#D4A857',
                    'decor-secondary': '#7DB87D'
                }
            };

            return palettes[season] || null;
        },

        /**
         * Add subtle Ramadan/Eid decorations
         */
        _addRamadanDecor: function() {
            if (document.getElementById('flux-seasonal-decor')) return;

            var decor = document.createElement('div');
            decor.id = 'flux-seasonal-decor';
            decor.className = 'flux-seasonal-decor flux-decor-ramadan';

            // Crescent + Star in navbar area
            decor.innerHTML =
                '<div class="flux-seasonal-badge">' +
                '  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" opacity="0.6">' +
                '    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.82 0 3.53-.5 5-1.35-2.99-1.73-5-4.95-5-8.65s2.01-6.92 5-8.65C15.53 2.5 13.82 2 12 2z"/>' +
                '  </svg>' +
                '  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">' +
                '    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>' +
                '  </svg>' +
                '</div>';

            document.body.appendChild(decor);
        },

        /**
         * Add UAE National Day decorations
         */
        _addNationalDayDecor: function() {
            if (document.getElementById('flux-seasonal-decor')) return;

            var decor = document.createElement('div');
            decor.id = 'flux-seasonal-decor';
            decor.className = 'flux-seasonal-decor flux-decor-national';

            // Tri-color stripe at top
            decor.innerHTML =
                '<div class="flux-national-stripe">' +
                '  <span style="background:#CE1126"></span>' +
                '  <span style="background:#009739"></span>' +
                '  <span style="background:#FFFFFF"></span>' +
                '  <span style="background:#000000"></span>' +
                '</div>';

            document.body.appendChild(decor);
        },

        /**
         * Add winter decorations (subtle)
         */
        _addWinterDecor: function() {
            // Winter is very subtle — just CSS variable overrides
            // No DOM elements needed
        },

        /**
         * Remove seasonal decorations
         */
        removeDecor: function() {
            var decor = document.getElementById('flux-seasonal-decor');
            if (decor) decor.remove();

            var body = document.body;
            var classes = body.className.split(' ').filter(function(c) {
                return c.indexOf('flux-season-') !== 0;
            });
            body.className = classes.join(' ');
        },

        /**
         * Get current active season
         */
        getCurrentSeason: function() {
            return this._currentSeason;
        }
    };

    // ─── Auto-initialize ───
    var _seasonReady = function() {
        flux.seasons.init();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _seasonReady);
    } else {
        _seasonReady();
    }
})();
