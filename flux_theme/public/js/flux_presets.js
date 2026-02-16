/**
 * FLUX Theme — Theme Presets
 * Pre-built color schemes: Flux Green (default), Silver Cloud, Sunset Coral, Ocean Blue
 *
 * @module flux.presets
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.presets = {
        _panelEl: null,
        _current: 'flux-green',

        PRESETS: {
            'flux-green': {
                name: 'Flux Green',
                nameAr: 'فلكس أخضر',
                icon: '🌿',
                colors: {
                    '--flux-green': '#09B474',
                    '--flux-dark': '#2D3436',
                    '--flux-light': '#F0F5F3',
                    '--flux-bg-primary': '#F0F5F3',
                    '--flux-text-primary': '#2D3436',
                    '--flux-accent': '#09B474'
                }
            },
            'abu-dhabi-pearl': {
                name: 'Silver Cloud',
                nameAr: 'سحابة فضية',
                icon: '☁️',
                colors: {
                    '--flux-green': '#B8A088',
                    '--flux-dark': '#2C3340',
                    '--flux-light': '#F5F0EB',
                    '--flux-bg-primary': '#F5F0EB',
                    '--flux-text-primary': '#2C3340',
                    '--flux-accent': '#B8A088'
                }
            },
            'desert-rose': {
                name: 'Sunset Coral',
                nameAr: 'مرجان الغروب',
                icon: '🌅',
                colors: {
                    '--flux-green': '#C97B7B',
                    '--flux-dark': '#3D2029',
                    '--flux-light': '#FFF0F0',
                    '--flux-bg-primary': '#FFF0F0',
                    '--flux-text-primary': '#3D2029',
                    '--flux-accent': '#C97B7B'
                }
            },
            'ocean-blue': {
                name: 'Ocean Blue',
                nameAr: 'أزرق المحيط',
                icon: '🌊',
                colors: {
                    '--flux-green': '#5B9BD5',
                    '--flux-dark': '#1A2A3E',
                    '--flux-light': '#EDF4FB',
                    '--flux-bg-primary': '#EDF4FB',
                    '--flux-text-primary': '#1A2A3E',
                    '--flux-accent': '#5B9BD5'
                }
            },
            'emerald-oasis': {
                name: 'Emerald Focus',
                nameAr: 'تركيز زمردي',
                icon: '💚',
                colors: {
                    '--flux-green': '#6BAF7C',
                    '--flux-dark': '#1D3328',
                    '--flux-light': '#F0F7F2',
                    '--flux-bg-primary': '#F0F7F2',
                    '--flux-text-primary': '#1D3328',
                    '--flux-accent': '#6BAF7C'
                }
            }
        },

        /**
         * Initialize presets
         */
        init: function() {
            // Feature gate
            if (typeof flux.config !== 'undefined' &&
                typeof flux.config.features !== 'undefined' &&
                flux.config.features.themePresets === false) {
                return;
            }

            // Load saved preset
            var saved = localStorage.getItem('flux_preset');
            if (saved && this.PRESETS[saved]) {
                this._current = saved;
                this._applyPreset(saved, false);
            }
        },

        /**
         * Apply a preset's colors
         */
        _applyPreset: function(presetId, animate) {
            var preset = this.PRESETS[presetId];
            if (!preset) return;

            this._current = presetId;
            localStorage.setItem('flux_preset', presetId);

            var root = document.documentElement;
            if (animate) root.style.transition = 'all 0.5s ease';

            var colors = preset.colors;
            Object.keys(colors).forEach(function(key) {
                root.style.setProperty(key, colors[key]);
            });

            if (animate) {
                setTimeout(function() { root.style.transition = ''; }, 600);
            }

            // Update panel active state
            if (this._panelEl) {
                var items = this._panelEl.querySelectorAll('.flux-preset-item');
                for (var i = 0; i < items.length; i++) {
                    items[i].classList.toggle('active', items[i].dataset.preset === presetId);
                }
            }
        },

        /**
         * Show preset picker panel
         */
        showPicker: function() {
            if (this._panelEl) { this.hidePicker(); return; }

            var self = this;
            var panel = document.createElement('div');
            panel.className = 'flux-preset-panel';

            var html = '<div class="flux-preset-header">' +
                       '  <h4>🎨 Theme Presets</h4>' +
                       '  <button class="flux-preset-close">&times;</button>' +
                       '</div>' +
                       '<div class="flux-preset-grid">';

            Object.keys(this.PRESETS).forEach(function(id) {
                var p = self.PRESETS[id];
                var green = p.colors['--flux-green'];
                var navy = p.colors['--flux-dark'];
                var cream = p.colors['--flux-light'];
                var isActive = id === self._current;

                html += '<div class="flux-preset-item' + (isActive ? ' active' : '') + '" data-preset="' + id + '">' +
                    '<div class="flux-preset-swatch">' +
                    '  <span style="background:' + navy + '"></span>' +
                    '  <span style="background:' + green + '"></span>' +
                    '  <span style="background:' + cream + '"></span>' +
                    '</div>' +
                    '<div class="flux-preset-label">' +
                    '  <span class="flux-preset-icon">' + p.icon + '</span>' +
                    '  <span>' + p.name + '</span>' +
                    '</div>' +
                    '<div class="flux-preset-label-ar">' + p.nameAr + '</div>' +
                    '</div>';
            });

            html += '</div>' +
                    '<div class="flux-preset-footer">' +
                    '  <button class="flux-preset-reset">↩ Reset to Default</button>' +
                    '</div>';

            panel.innerHTML = html;
            document.body.appendChild(panel);
            this._panelEl = panel;

            // Animate in
            requestAnimationFrame(function() { panel.classList.add('visible'); });

            // Event handlers
            panel.querySelector('.flux-preset-close').onclick = function() { self.hidePicker(); };
            panel.querySelector('.flux-preset-reset').onclick = function() {
                self._applyPreset('flux-green', true);
            };

            panel.querySelectorAll('.flux-preset-item').forEach(function(item) {
                item.onclick = function() {
                    self._applyPreset(item.dataset.preset, true);
                };
            });

            // Close on outside click
            setTimeout(function() {
                document.addEventListener('click', self._outsideClickHandler = function(e) {
                    if (!panel.contains(e.target)) self.hidePicker();
                });
            }, 100);
        },

        /**
         * Hide preset picker
         */
        hidePicker: function() {
            if (this._panelEl) {
                this._panelEl.remove();
                this._panelEl = null;
            }
            if (this._outsideClickHandler) {
                document.removeEventListener('click', this._outsideClickHandler);
                this._outsideClickHandler = null;
            }
        }
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { flux.presets.init(); });
    } else {
        flux.presets.init();
    }
})();
