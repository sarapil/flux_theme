// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme — Interactive Skyline
 * Adds click/hover interactivity to the modern city skyline buildings
 * Shows info tooltips about city landmarks when buildings are clicked
 *
 * @module flux.interactiveSkyline
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.interactiveSkyline = {
        _tooltip: null,
        _initialized: false,

        /**
         * Landmark data keyed by approximate x-position ranges in the SVG viewport
         */
        LANDMARKS: [
            {
                name: 'Startup Hub',
                nameAr: 'مركز الشركات الناشئة',
                xMin: 140, xMax: 225,
                height: '45 floors',
                year: 'Est. 2019',
                fact: 'A vibrant innovation center housing hundreds of startups and co-working spaces across multiple floors.',
                icon: '🚀'
            },
            {
                name: 'City Gateway',
                nameAr: 'بوابة المدينة',
                xMin: 290, xMax: 375,
                height: '150m',
                year: 'Est. 2018',
                fact: 'The iconic gateway arch — a striking modern landmark connecting old and new districts of the city.',
                icon: '🏛️'
            },
            {
                name: 'Innovation Hub',
                nameAr: 'مركز الابتكار',
                xMin: 645, xMax: 770,
                height: '50 floors',
                year: 'Est. 2020',
                fact: 'A state-of-the-art facility with collaborative workspaces, labs, and a rooftop garden for creative minds.',
                icon: '💡'
            },
            {
                name: 'Central Tower',
                nameAr: 'البرج المركزي',
                xMin: 920, xMax: 1000,
                height: '80 floors',
                year: 'Est. 2015',
                fact: 'The tallest building in the business district. Home to leading tech companies and co-working spaces.',
                icon: '🏢'
            },
            {
                name: 'Creative Quarter',
                nameAr: 'الحي الإبداعي',
                xMin: 1080, xMax: 1140,
                height: '35 floors',
                year: 'Est. 2021',
                fact: 'A uniquely designed twisted tower featuring art studios, maker spaces, and flexible offices for freelancers.',
                icon: '🎨'
            }
        ],

        /**
         * Initialize interactivity on the skyline SVG
         */
        init: function() {
            if (this._initialized) return;

            var self = this;

            // Wait for skyline SVG to be present
            var check = setInterval(function() {
                var svg = document.querySelector('.flux-skyline svg, #flux-skyline svg');
                if (!svg) return;
                clearInterval(check);

                self._initialized = true;
                self._attachHandlers(svg);
            }, 2000);

            // Also try on page changes
            if (typeof frappe !== 'undefined' && frappe.router) {
                frappe.router.on('change', function() {
                    if (self._initialized) return;
                    setTimeout(function() {
                        var svg = document.querySelector('.flux-skyline svg, #flux-skyline svg');
                        if (svg) {
                            self._initialized = true;
                            self._attachHandlers(svg);
                        }
                    }, 1000);
                });
            }
        },

        /**
         * Attach click/hover handlers to the SVG
         */
        _attachHandlers: function(svg) {
            var self = this;

            // Create invisible clickable zones over landmark areas
            var svgNS = 'http://www.w3.org/2000/svg';
            var viewBox = svg.getAttribute('viewBox');
            if (!viewBox) return;

            var parts = viewBox.split(/\s+/);
            var vbHeight = parseFloat(parts[3]) || 300;

            this.LANDMARKS.forEach(function(landmark) {
                var rect = document.createElementNS(svgNS, 'rect');
                rect.setAttribute('x', landmark.xMin);
                rect.setAttribute('y', '0');
                rect.setAttribute('width', landmark.xMax - landmark.xMin);
                rect.setAttribute('height', vbHeight);
                rect.setAttribute('fill', 'transparent');
                rect.setAttribute('class', 'flux-skyline-hotspot');
                rect.style.cursor = 'pointer';

                rect.addEventListener('click', function(e) {
                    e.stopPropagation();
                    self._showTooltip(landmark, e);
                });

                rect.addEventListener('mouseenter', function() {
                    rect.setAttribute('fill', 'rgba(9,180,116,0.05)');
                });

                rect.addEventListener('mouseleave', function() {
                    rect.setAttribute('fill', 'transparent');
                });

                svg.appendChild(rect);
            });

            // Close tooltip on body click
            document.addEventListener('click', function(e) {
                if (self._tooltip && !self._tooltip.contains(e.target)) {
                    self._hideTooltip();
                }
            });
        },

        /**
         * Show landmark info tooltip
         */
        _showTooltip: function(landmark, event) {
            this._hideTooltip();

            var tip = document.createElement('div');
            tip.className = 'flux-skyline-tooltip';

            tip.innerHTML =
                '<div class="flux-skyline-tooltip-header">' +
                '  <span class="flux-skyline-tooltip-icon">' + landmark.icon + '</span>' +
                '  <div>' +
                '    <div class="flux-skyline-tooltip-name">' + landmark.name + '</div>' +
                '    <div class="flux-skyline-tooltip-name-ar">' + landmark.nameAr + '</div>' +
                '  </div>' +
                '</div>' +
                '<div class="flux-skyline-tooltip-bar"></div>' +
                '<div class="flux-skyline-tooltip-stats">' +
                '  <span>📏 ' + landmark.height + '</span>' +
                '  <span>📅 ' + landmark.year + '</span>' +
                '</div>' +
                '<p class="flux-skyline-tooltip-fact">' + landmark.fact + '</p>';

            document.body.appendChild(tip);
            this._tooltip = tip;

            // Position near click
            var tipRect = tip.getBoundingClientRect();
            var x = event.clientX - tipRect.width / 2;
            var y = event.clientY - tipRect.height - 16;

            // Clamp to viewport
            x = Math.max(12, Math.min(x, window.innerWidth - tipRect.width - 12));
            if (y < 12) y = event.clientY + 16;

            tip.style.left = x + 'px';
            tip.style.top = y + 'px';
            tip.classList.add('visible');
        },

        /**
         * Hide tooltip
         */
        _hideTooltip: function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        }
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.interactiveSkyline.init(); });
    } else {
        flux.interactiveSkyline.init();
    }
})();
