// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme — Print Header Customization
 * Multiple print header designs for professional documents
 *
 * @module flux.printHeaders
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.printHeaders = {
        STYLES: {
            'classic': {
                name: 'Classic Gold',
                description: 'Traditional header with green underline',
                css: '.print-format .flux-print-header{border-bottom:3px solid #09B474;padding:20px 0 16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end}' +
                     '.print-format .flux-print-header .company-name{font-family:'Open Sans',sans-serif;font-size:22px;font-weight:700;color:#2D3436}' +
                     '.print-format .flux-print-header .company-details{font-size:10px;color:#666;text-align:right}'
            },
            'modern': {
                name: 'Modern Minimal',
                description: 'Clean minimal header with accent bar',
                css: '.print-format .flux-print-header{padding:16px 0;margin-bottom:20px;position:relative}' +
                     '.print-format .flux-print-header::before{content:"";position:absolute;left:0;top:0;width:4px;height:100%;background:#09B474;border-radius:2px}' +
                     '.print-format .flux-print-header{padding-left:20px}' +
                     '.print-format .flux-print-header .company-name{font-family:'Open Sans',sans-serif;font-size:20px;font-weight:600;color:#2D3436;margin-bottom:4px}' +
                     '.print-format .flux-print-header .company-details{font-size:9px;color:#888;letter-spacing:0.5px}'
            },
            'modern': {
                name: 'modern Banner',
                description: 'Full-width navy banner with green text',
                css: '.print-format .flux-print-header{background:#2D3436;color:#fff;padding:20px 28px;margin:-20px -20px 24px;border-radius:0;display:flex;justify-content:space-between;align-items:center}' +
                     '.print-format .flux-print-header .company-name{font-family:'Open Sans',sans-serif;font-size:22px;font-weight:700;color:#09B474}' +
                     '.print-format .flux-print-header .company-details{font-size:10px;color:rgba(255,255,255,0.7);text-align:right}'
            },
            'bilingual': {
                name: 'Bilingual AR/EN',
                description: 'Dual-language header for Arabic/English',
                css: '.print-format .flux-print-header{border-bottom:2px solid #09B474;padding:16px 0 12px;margin-bottom:20px;display:flex;justify-content:space-between}' +
                     '.print-format .flux-print-header .company-name{font-family:'Open Sans',sans-serif;font-size:20px;font-weight:700;color:#2D3436}' +
                     '.print-format .flux-print-header .company-name-ar{font-family:'Open Sans',sans-serif;font-size:18px;font-weight:600;color:#2D3436;direction:rtl;text-align:right}' +
                     '.print-format .flux-print-header .company-details{font-size:9px;color:#666;text-align:center}'
            }
        },

        init: function() {
            var saved = localStorage.getItem('flux_print_header_style');
            if (saved && this.STYLES[saved]) {
                this._injectCSS(saved);
            } else {
                this._injectCSS('classic');
            }
        },

        setStyle: function(styleId) {
            if (!this.STYLES[styleId]) return;
            localStorage.setItem('flux_print_header_style', styleId);
            this._injectCSS(styleId);
        },

        _injectCSS: function(styleId) {
            var existing = document.getElementById('flux-print-header-css');
            if (existing) existing.remove();

            var style = document.createElement('style');
            style.id = 'flux-print-header-css';
            style.textContent = this.STYLES[styleId].css;
            document.head.appendChild(style);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.printHeaders.init(); });
    } else {
        flux.printHeaders.init();
    }
})();
