// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme — Ambient Sound Mode
 * Optional background ambient sounds for an immersive experience
 * Uses Web Audio API with generated tones (no external audio files needed)
 *
 * Soundscapes:
 *   - rain:    Gentle rain with thunder rumbles
 *   - office:  Soft keyboard taps, muted conversation hum
 *   - city:    modern city ambience — traffic hum, distant urban sounds
 *   - waves:   Ocean waves on the shore
 *
 * @module flux.ambient
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.ambient = {
        _ctx: null,
        _masterGain: null,
        _nodes: [],
        _active: false,
        _currentScene: null,
        _volume: 0.3,
        _panelEl: null,

        SCENES: {
            rain: { label: '🌧️ Rain', desc: 'Gentle rainfall' },
            office: { label: '🏢 Office', desc: 'Soft office ambiance' },
            city: { label: '🌃 City', desc: 'modern city ambience' },
            waves: { label: '🌊 Waves', desc: 'Ocean shoreline' }
        },

        /**
         * Initialize ambient sound system
         */
        init: function() {
            // Check feature toggle
            if (flux.config && flux.config.features &&
                flux.config.features.ambient === false) return;

            // Restore saved preference
            var saved = localStorage.getItem('flux-ambient-scene');
            var savedVol = localStorage.getItem('flux-ambient-volume');
            if (savedVol) this._volume = parseFloat(savedVol);

            // Add control button to settings area
            this._injectToggle();

            // Auto-resume if was active
            if (saved && localStorage.getItem('flux-ambient-active') === '1') {
                // Delay to avoid autoplay restrictions
                var self = this;
                document.addEventListener('click', function resumeAmbient() {
                    document.removeEventListener('click', resumeAmbient);
                    self.play(saved);
                }, { once: true });
            }
        },

        /**
         * Initialize or get AudioContext
         */
        _getCtx: function() {
            if (!this._ctx) {
                this._ctx = new (window.AudioContext || window.webkitAudioContext)();
                this._masterGain = this._ctx.createGain();
                this._masterGain.gain.value = this._volume;
                this._masterGain.connect(this._ctx.destination);
            }
            if (this._ctx.state === 'suspended') {
                this._ctx.resume();
            }
            return this._ctx;
        },

        /**
         * Play a soundscape
         */
        play: function(scene) {
            this.stop();

            if (!this.SCENES[scene]) return;

            var ctx = this._getCtx();
            this._currentScene = scene;
            this._active = true;

            // Generate the soundscape
            switch (scene) {
                case 'rain':    this._genRain(ctx); break;
                case 'office':  this._genOffice(ctx); break;
                case 'city':    this._genCity(ctx); break;
                case 'waves':   this._genWaves(ctx); break;
            }

            // Save state
            localStorage.setItem('flux-ambient-scene', scene);
            localStorage.setItem('flux-ambient-active', '1');
            this._updateUI();
        },

        /**
         * Stop all sounds
         */
        stop: function() {
            for (var i = 0; i < this._nodes.length; i++) {
                try {
                    if (this._nodes[i].stop) this._nodes[i].stop();
                    if (this._nodes[i].disconnect) this._nodes[i].disconnect();
                } catch(e) {}
            }
            this._nodes = [];
            this._active = false;
            this._currentScene = null;
            localStorage.setItem('flux-ambient-active', '0');
            this._updateUI();
        },

        /**
         * Set volume (0-1)
         */
        setVolume: function(v) {
            this._volume = Math.max(0, Math.min(1, v));
            if (this._masterGain) {
                this._masterGain.gain.setTargetAtTime(this._volume, this._ctx.currentTime, 0.1);
            }
            localStorage.setItem('flux-ambient-volume', this._volume);
        },

        // ─── Sound Generators ───

        /**
         * Rain: Brown noise filtered + occasional low rumbles
         */
        _genRain: function(ctx) {
            // Brown noise for rain
            var bufSize = ctx.sampleRate * 4;
            var buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
            for (var ch = 0; ch < 2; ch++) {
                var data = buf.getChannelData(ch);
                var last = 0;
                for (var i = 0; i < bufSize; i++) {
                    var white = Math.random() * 2 - 1;
                    data[i] = (last + (0.02 * white)) / 1.02;
                    last = data[i];
                    data[i] *= 3.5;
                }
            }
            var src = ctx.createBufferSource();
            src.buffer = buf;
            src.loop = true;

            var lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 800;
            lp.Q.value = 0.7;

            var hp = ctx.createBiquadFilter();
            hp.type = 'highpass';
            hp.frequency.value = 100;

            src.connect(lp);
            lp.connect(hp);
            hp.connect(this._masterGain);
            src.start();
            this._nodes.push(src, lp, hp);

            // Occasional low rumbles (thunder)
            this._thunderLoop(ctx);
        },

        _thunderLoop: function(ctx) {
            if (!this._active || this._currentScene !== 'rain') return;

            var self = this;
            var delay = 8000 + Math.random() * 20000;

            setTimeout(function() {
                if (!self._active || self._currentScene !== 'rain') return;

                var osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = 40 + Math.random() * 30;

                var gain = ctx.createGain();
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);

                osc.connect(gain);
                gain.connect(self._masterGain);
                osc.start();
                osc.stop(ctx.currentTime + 3);

                self._thunderLoop(ctx);
            }, delay);
        },

        /**
         * Office: filtered pink noise + subtle periodic tones
         */
        _genOffice: function(ctx) {
            // Pink noise - muted conversation hum
            var bufSize = ctx.sampleRate * 4;
            var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            var data = buf.getChannelData(0);
            var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (var i = 0; i < bufSize; i++) {
                var white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
                b6 = white * 0.115926;
            }
            var src = ctx.createBufferSource();
            src.buffer = buf;
            src.loop = true;

            var bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.value = 300;
            bp.Q.value = 0.5;

            var gain = ctx.createGain();
            gain.gain.value = 0.6;

            src.connect(bp);
            bp.connect(gain);
            gain.connect(this._masterGain);
            src.start();
            this._nodes.push(src, bp, gain);
        },

        /**
         * City: Low rumble + filtered noise
         */
        _genCity: function(ctx) {
            // Traffic rumble - low sine
            var osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 55;
            var oscGain = ctx.createGain();
            oscGain.gain.value = 0.08;
            osc.connect(oscGain);
            oscGain.connect(this._masterGain);
            osc.start();
            this._nodes.push(osc, oscGain);

            // Higher hum
            var osc2 = ctx.createOscillator();
            osc2.type = 'triangle';
            osc2.frequency.value = 110;
            var oscGain2 = ctx.createGain();
            oscGain2.gain.value = 0.04;
            osc2.connect(oscGain2);
            oscGain2.connect(this._masterGain);
            osc2.start();
            this._nodes.push(osc2, oscGain2);

            // White noise for city buzz
            var bufSize = ctx.sampleRate * 2;
            var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            var data = buf.getChannelData(0);
            for (var i = 0; i < bufSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.3;
            }
            var nSrc = ctx.createBufferSource();
            nSrc.buffer = buf;
            nSrc.loop = true;

            var lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 400;

            var nGain = ctx.createGain();
            nGain.gain.value = 0.12;

            nSrc.connect(lp);
            lp.connect(nGain);
            nGain.connect(this._masterGain);
            nSrc.start();
            this._nodes.push(nSrc, lp, nGain);
        },

        /**
         * Waves: Rhythmic volume modulation on filtered noise
         */
        _genWaves: function(ctx) {
            // Base ocean noise
            var bufSize = ctx.sampleRate * 4;
            var buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
            for (var ch = 0; ch < 2; ch++) {
                var data = buf.getChannelData(ch);
                var last = 0;
                for (var i = 0; i < bufSize; i++) {
                    var white = Math.random() * 2 - 1;
                    data[i] = (last + (0.04 * white)) / 1.04;
                    last = data[i];
                    data[i] *= 5;
                }
            }
            var src = ctx.createBufferSource();
            src.buffer = buf;
            src.loop = true;

            var lp = ctx.createBiquadFilter();
            lp.type = 'lowpass';
            lp.frequency.value = 600;

            // LFO for wave rhythm
            var lfo = ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.12; // ~7 sec per wave

            var lfoGain = ctx.createGain();
            lfoGain.gain.value = 0.3;

            var waveGain = ctx.createGain();
            waveGain.gain.value = 0.5;

            lfo.connect(lfoGain);
            lfoGain.connect(waveGain.gain);

            src.connect(lp);
            lp.connect(waveGain);
            waveGain.connect(this._masterGain);
            lfo.start();
            src.start();
            this._nodes.push(src, lp, lfo, lfoGain, waveGain);
        },

        // ─── UI ───

        /**
         * Inject toggle button
         */
        _injectToggle: function() {
            var self = this;

            // v16: try sidebar first, navbar as fallback
            var check = setInterval(function() {
                if (document.querySelector('.flux-ambient-toggle')) {
                    clearInterval(check);
                    return;
                }

                var sidebarBottom = document.querySelector('.body-sidebar-bottom');
                var navRight = document.querySelector('.navbar-right, .navbar-nav:last-child');

                if (sidebarBottom) {
                    clearInterval(check);
                    var div = document.createElement('div');
                    div.className = 'flux-ambient-toggle flux-sidebar-action';
                    div.innerHTML =
                        '<a class="item-anchor" title="' + __('Ambient Sounds') + '" role="button" aria-label="Ambient Sounds">' +
                        '  <span class="sidebar-item-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '    <path d="M9 18V5l12-2v13"/>' +
                        '    <circle cx="6" cy="18" r="3"/>' +
                        '    <circle cx="18" cy="16" r="3"/>' +
                        '  </svg></span>' +
                        '  <span class="sidebar-item-label">' + __('Ambient Sounds') + '</span>' +
                        '</a>';
                    div.querySelector('a').addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._togglePanel();
                    });
                    var collapseLink = sidebarBottom.querySelector('.collapse-sidebar-link');
                    if (collapseLink) {
                        sidebarBottom.insertBefore(div, collapseLink);
                    } else {
                        sidebarBottom.appendChild(div);
                    }
                } else if (navRight) {
                    clearInterval(check);
                    var btn = document.createElement('li');
                    btn.className = 'nav-item flux-ambient-toggle';
                    btn.innerHTML =
                        '<a class="nav-link" title="' + __('Ambient Sounds') + '" aria-label="Ambient Sounds">' +
                        '  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '    <path d="M9 18V5l12-2v13"/>' +
                        '    <circle cx="6" cy="18" r="3"/>' +
                        '    <circle cx="18" cy="16" r="3"/>' +
                        '  </svg>' +
                        '</a>';
                    btn.querySelector('a').addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._togglePanel();
                    });
                    var items = navRight.querySelectorAll('.nav-item');
                    if (items.length > 2) {
                        navRight.insertBefore(btn, items[items.length - 2]);
                    } else {
                        navRight.appendChild(btn);
                    }
                }
            }, 1000);
        },

        /**
         * Toggle the ambient sound picker panel
         */
        _togglePanel: function() {
            if (this._panelEl) {
                this._panelEl.remove();
                this._panelEl = null;
                return;
            }

            var self = this;
            var panel = document.createElement('div');
            panel.className = 'flux-ambient-panel';

            var html = '<div class="flux-ambient-panel-header">';
            html += '<span class="flux-ambient-panel-title">' + __('Ambient Sounds') + '</span>';
            html += '<button class="flux-ambient-panel-close">&times;</button>';
            html += '</div>';
            html += '<div class="flux-ambient-panel-bar"></div>';

            // Scene buttons
            html += '<div class="flux-ambient-scenes">';
            var scenes = Object.keys(this.SCENES);
            for (var i = 0; i < scenes.length; i++) {
                var s = scenes[i];
                var info = this.SCENES[s];
                var activeClass = this._currentScene === s ? ' active' : '';
                html += '<button class="flux-ambient-scene' + activeClass + '" data-scene="' + s + '">';
                html += '<span class="flux-ambient-scene-icon">' + info.label.split(' ')[0] + '</span>';
                html += '<span class="flux-ambient-scene-name">' + info.label.split(' ').slice(1).join(' ') + '</span>';
                html += '</button>';
            }
            html += '</div>';

            // Volume slider
            html += '<div class="flux-ambient-volume">';
            html += '<label>' + __('Volume') + '</label>';
            html += '<input type="range" min="0" max="100" value="' + Math.round(this._volume * 100) + '" class="flux-ambient-slider">';
            html += '</div>';

            // Stop button
            if (this._active) {
                html += '<button class="flux-ambient-stop">' + __('Stop') + '</button>';
            }

            panel.innerHTML = html;
            document.body.appendChild(panel);
            this._panelEl = panel;

            // Bind events
            panel.querySelector('.flux-ambient-panel-close').addEventListener('click', function() {
                self._togglePanel();
            });

            var sceneBtns = panel.querySelectorAll('.flux-ambient-scene');
            for (var j = 0; j < sceneBtns.length; j++) {
                sceneBtns[j].addEventListener('click', function() {
                    var scene = this.dataset.scene;
                    if (self._currentScene === scene) {
                        self.stop();
                    } else {
                        self.play(scene);
                    }
                    self._togglePanel();
                    self._togglePanel(); // Re-open with updated state
                });
            }

            var slider = panel.querySelector('.flux-ambient-slider');
            if (slider) {
                slider.addEventListener('input', function() {
                    self.setVolume(parseInt(this.value) / 100);
                });
            }

            var stopBtn = panel.querySelector('.flux-ambient-stop');
            if (stopBtn) {
                stopBtn.addEventListener('click', function() {
                    self.stop();
                    self._togglePanel();
                });
            }

            // Close on outside click
            setTimeout(function() {
                document.addEventListener('click', function closePanel(e) {
                    if (self._panelEl && !self._panelEl.contains(e.target) &&
                        !e.target.closest('.flux-ambient-toggle')) {
                        self._togglePanel();
                        document.removeEventListener('click', closePanel);
                    }
                });
            }, 100);
        },

        /**
         * Update UI state (toggle button active indicator)
         */
        _updateUI: function() {
            var toggle = document.querySelector('.flux-ambient-toggle a');
            if (toggle) {
                toggle.classList.toggle('active', this._active);
            }
        }
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.ambient.init(); });
    } else {
        flux.ambient.init();
    }
})();
