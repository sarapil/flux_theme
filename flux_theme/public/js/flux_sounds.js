// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme - modern Notification Sounds
 * Uses Web Audio API to generate premium tones — no audio files needed.
 * Hooks into Frappe's alert, msgprint, and form save events.
 *
 * Respects:
 *  - FLUX Settings → enable_sounds toggle
 *  - localStorage → flux-sound-mute (user preference)
 *  - prefers-reduced-motion (system)
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    flux.sounds = {
        /** AudioContext (created on first user gesture) */
        _ctx: null,
        _ready: false,
        _muted: false,
        _initialized: false,

        // ─── Tone Presets ───
        tones: {
            /** Success: ascending green chime (C5 → E5 → G5) */
            success: {
                notes: [523.25, 659.25, 783.99],
                duration: 0.12,
                gap: 0.08,
                type: 'sine',
                gain: 0.15
            },
            /** Notification: two-note bell (E5 → C5) */
            notification: {
                notes: [659.25, 523.25],
                duration: 0.10,
                gap: 0.06,
                type: 'sine',
                gain: 0.12
            },
            /** Error: low descending tone (C4 → G3) */
            error: {
                notes: [261.63, 196.00],
                duration: 0.15,
                gap: 0.05,
                type: 'triangle',
                gain: 0.10
            },
            /** Warning: single attention tone (A4) */
            warning: {
                notes: [440.00],
                duration: 0.20,
                type: 'triangle',
                gain: 0.08
            },
            /** Info: soft ping (E5) */
            info: {
                notes: [659.25],
                duration: 0.08,
                type: 'sine',
                gain: 0.08
            },
            /** Save: satisfying confirmation (G4 → B4 → D5) */
            save: {
                notes: [392.00, 493.88, 587.33],
                duration: 0.10,
                gap: 0.06,
                type: 'sine',
                gain: 0.12
            },
            /** Click: tiny subtle tick */
            click: {
                notes: [1200],
                duration: 0.03,
                type: 'sine',
                gain: 0.04
            }
        },

        // ─── Core Methods ───

        /** Initialize the sound system */
        init: function() {
            if (this._initialized) return;
            this._initialized = true;

            // Read mute preference
            this._muted = localStorage.getItem('flux-sound-mute') === '1';

            // Create AudioContext on first user interaction
            var self = this;
            var startAudio = function() {
                if (self._ctx) return;
                try {
                    var AC = window.AudioContext || window.webkitAudioContext;
                    self._ctx = new AC();
                    self._ready = true;
                } catch (e) {
                    console.warn('[FLUX Sounds] AudioContext not available');
                }
                document.removeEventListener('click', startAudio);
                document.removeEventListener('keydown', startAudio);
            };

            document.addEventListener('click', startAudio, { once: false });
            document.addEventListener('keydown', startAudio, { once: false });

            // Hook into Frappe events
            this._hookAlerts();
            this._hookFormSave();
            this._injectMuteToggle();
        },

        /** Play a tone preset by name */
        play: function(name) {
            // Feature gate
            if (flux.config && flux.config.features && !flux.config.features.sounds) return;
            if (this._muted) return;
            if (!this._ready || !this._ctx) return;
            if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            var tone = this.tones[name];
            if (!tone) return;

            var ctx = this._ctx;
            var now = ctx.currentTime;

            for (var i = 0; i < tone.notes.length; i++) {
                var freq = tone.notes[i];
                var startAt = now + i * (tone.duration + (tone.gap || 0));

                var osc = ctx.createOscillator();
                var gainNode = ctx.createGain();

                osc.type = tone.type || 'sine';
                osc.frequency.setValueAtTime(freq, startAt);

                // Envelope: quick attack, sustain, smooth release
                gainNode.gain.setValueAtTime(0, startAt);
                gainNode.gain.linearRampToValueAtTime(tone.gain, startAt + 0.01);
                gainNode.gain.setValueAtTime(tone.gain, startAt + tone.duration * 0.6);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + tone.duration);

                osc.connect(gainNode);
                gainNode.connect(ctx.destination);

                osc.start(startAt);
                osc.stop(startAt + tone.duration + 0.05);
            }
        },

        /** Toggle mute state */
        toggleMute: function() {
            this._muted = !this._muted;
            localStorage.setItem('flux-sound-mute', this._muted ? '1' : '0');
            this._updateMuteIcon();

            // Play a tiny confirmation if unmuted
            if (!this._muted) {
                this.play('click');
            }
            return this._muted;
        },

        /** Check if muted */
        isMuted: function() {
            return this._muted;
        },

        // ─── Internal Methods ───

        /** Hook into frappe.show_alert to play tones */
        _hookAlerts: function() {
            var self = this;
            var origShowAlert = frappe.show_alert;

            if (!origShowAlert) return;

            frappe.show_alert = function(msg, seconds, actions) {
                // Determine indicator type
                var indicator = '';
                if (typeof msg === 'object' && msg.indicator) {
                    indicator = msg.indicator.toLowerCase();
                } else if (typeof msg === 'string') {
                    // Try to infer from content
                    if (msg.indexOf('success') !== -1 || msg.indexOf('saved') !== -1) {
                        indicator = 'green';
                    }
                }

                // Map indicator to tone
                var toneMap = {
                    'green': 'success',
                    'blue': 'info',
                    'orange': 'warning',
                    'yellow': 'warning',
                    'red': 'error'
                };
                var tone = toneMap[indicator] || 'notification';
                self.play(tone);

                // Call original
                return origShowAlert.apply(frappe, arguments);
            };
        },

        /** Hook into form save for success chime */
        _hookFormSave: function() {
            var self = this;

            // Listen for after-save event
            $(document).on('form-saved', function() {
                self.play('save');
            });

            // Also hook frappe.ui.form save callback
            if (frappe.ui && frappe.ui.form) {
                var origSaveOrUpdate = frappe.ui.form.save;
                if (origSaveOrUpdate) {
                    frappe.ui.form.save = function() {
                        var result = origSaveOrUpdate.apply(this, arguments);
                        // Sound is already handled by form-saved event
                        return result;
                    };
                }
            }
        },

        /** Inject mute toggle button into navbar */
        _injectMuteToggle: function() {
            var self = this;

            var poll = setInterval(function() {
                var container = document.querySelector('.navbar-collapse .navbar-nav');
                if (!container) return;

                // Don't inject twice
                if (document.querySelector('.flux-sound-toggle')) {
                    clearInterval(poll);
                    return;
                }

                var li = document.createElement('li');
                li.className = 'nav-item flux-sound-toggle';

                var btn = document.createElement('a');
                btn.className = 'nav-link flux-sound-btn';
                btn.href = '#';
                btn.title = 'Toggle sound effects';
                btn.setAttribute('aria-label', 'Toggle notification sounds');
                btn.innerHTML = self._getMuteIcon();

                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.toggleMute();
                });

                li.appendChild(btn);

                // Insert after darkmode toggle or search trigger
                var darkToggle = container.querySelector('.flux-darkmode-toggle');
                var searchTrigger = container.querySelector('.flux-search-trigger');
                var ref = darkToggle || searchTrigger;

                if (ref) {
                    ref.parentNode.insertBefore(li, ref.nextSibling);
                } else {
                    container.insertBefore(li, container.firstChild);
                }

                clearInterval(poll);
            }, 300);

            // Safety: stop polling after 10s
            setTimeout(function() { clearInterval(poll); }, 10000);
        },

        /** Update the mute icon */
        _updateMuteIcon: function() {
            var btn = document.querySelector('.flux-sound-btn');
            if (btn) {
                btn.innerHTML = this._getMuteIcon();
            }
        },

        /** Get the appropriate icon SVG */
        _getMuteIcon: function() {
            if (this._muted) {
                // Volume off / muted
                return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
                    + '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>'
                    + '<line x1="23" y1="9" x2="17" y2="15"/>'
                    + '<line x1="17" y1="9" x2="23" y2="15"/>'
                    + '</svg>';
            }
            // Volume on
            return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
                + '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>'
                + '<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>'
                + '</svg>';
        }
    };

    // ─── Bootstrap ───

    // Wait for frappe to be available
    var initPoll = setInterval(function() {
        if (typeof frappe !== 'undefined' && frappe.show_alert) {
            clearInterval(initPoll);
            flux.sounds.init();
        }
    }, 300);

    // Safety timeout
    setTimeout(function() { clearInterval(initPoll); }, 15000);

})();
