/**
 * FLUX Theme — Multi-Language Welcome Messages
 * Arabic/English/French calligraphic welcome with time-aware greetings
 *
 * @module flux.welcomeMsg
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.welcomeMsg = {
        _shown: false,

        GREETINGS: {
            morning: {
                ar: 'صباح الخير',
                en: 'Good Morning',
                fr: 'Bonjour'
            },
            afternoon: {
                ar: 'مساء الخير',
                en: 'Good Afternoon',
                fr: 'Bon Après-midi'
            },
            evening: {
                ar: 'مساء النور',
                en: 'Good Evening',
                fr: 'Bonsoir'
            }
        },

        WELCOME_PHRASES: {
            ar: 'مرحباً بعودتك',
            en: 'Welcome back',
            fr: 'Bon retour'
        },

        init: function() {
            // Feature gate
            if (typeof flux.config !== 'undefined' &&
                typeof flux.config.features !== 'undefined' &&
                flux.config.features.welcomeMessages === false) {
                return;
            }

            var self = this;

            // Show once per session on first meaningful page
            if (sessionStorage.getItem('flux_welcome_shown')) return;

            setTimeout(function() {
                if (typeof frappe !== 'undefined' && frappe.session && frappe.session.user !== 'Guest') {
                    self._show();
                }
            }, 2500);
        },

        /**
         * Determine time of day
         */
        _getTimeOfDay: function() {
            var h = new Date().getHours();
            if (h < 12) return 'morning';
            if (h < 17) return 'afternoon';
            return 'evening';
        },

        /**
         * Get user's first name
         */
        _getFirstName: function() {
            if (typeof frappe !== 'undefined' && frappe.session) {
                var full = frappe.session.user_fullname || frappe.session.user || '';
                return full.split(' ')[0] || 'User';
            }
            return 'User';
        },

        /**
         * Show the welcome message
         */
        _show: function() {
            if (this._shown) return;
            this._shown = true;
            sessionStorage.setItem('flux_welcome_shown', '1');

            var tod = this._getTimeOfDay();
            var greeting = this.GREETINGS[tod];
            var welcome = this.WELCOME_PHRASES;
            var name = this._getFirstName();

            var el = document.createElement('div');
            el.className = 'flux-welcome-msg';

            el.innerHTML =
                '<div class="flux-welcome-content">' +
                '  <div class="flux-welcome-greeting-ar">' + greeting.ar + '</div>' +
                '  <div class="flux-welcome-greeting-en">' + greeting.en + ', <strong>' + name + '</strong></div>' +
                '  <div class="flux-welcome-greeting-fr">' + greeting.fr + '</div>' +
                '  <div class="flux-welcome-divider"></div>' +
                '  <div class="flux-welcome-phrase-ar">' + welcome.ar + '</div>' +
                '  <div class="flux-welcome-phrase-en">' + welcome.en + '</div>' +
                '</div>';

            document.body.appendChild(el);

            // Animate in
            requestAnimationFrame(function() {
                el.classList.add('visible');
            });

            // Auto dismiss after 4 seconds
            setTimeout(function() {
                el.classList.add('dismissing');
                setTimeout(function() { el.remove(); }, 800);
            }, 4000);

            // Click to dismiss
            el.addEventListener('click', function() {
                el.classList.add('dismissing');
                setTimeout(function() { el.remove(); }, 800);
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.welcomeMsg.init(); });
    } else {
        setTimeout(function() { flux.welcomeMsg.init(); }, 500);
    }
})();
