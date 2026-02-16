/**
 * FLUX Theme — Keyboard Shortcuts Panel
 * Branded shortcut help overlay triggered by "?" key
 * 
 * @module flux.shortcuts
 */
(function() {
    'use strict';

    if (typeof window.flux === 'undefined') window.flux = {};

    flux.shortcuts = {
        _overlay: null,
        _isOpen: false,

        /**
         * Initialize keyboard shortcut listener
         */
        init: function() {
            var self = this;

            document.addEventListener('keydown', function(e) {
                // Close on Escape
                if (e.key === 'Escape' && self._isOpen) {
                    self.close();
                    return;
                }

                // Open on "?" — but not when typing in inputs
                if (e.key === '?' && !self._isInputFocused()) {
                    e.preventDefault();
                    self.toggle();
                }
            });
        },

        /**
         * Check if user is typing in an input field
         */
        _isInputFocused: function() {
            var el = document.activeElement;
            if (!el) return false;
            var tag = el.tagName.toLowerCase();
            return (tag === 'input' || tag === 'textarea' || tag === 'select' ||
                    el.contentEditable === 'true' ||
                    el.classList.contains('ql-editor') ||
                    el.closest('.modal.show'));
        },

        /**
         * Toggle the shortcuts panel
         */
        toggle: function() {
            if (this._isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        /**
         * Open the shortcuts panel
         */
        open: function() {
            if (this._isOpen) return;

            if (!this._overlay) {
                this._createOverlay();
            }

            this._overlay.classList.add('flux-shortcuts-visible');
            this._isOpen = true;
            document.body.style.overflow = 'hidden';
        },

        /**
         * Close the shortcuts panel
         */
        close: function() {
            if (!this._isOpen || !this._overlay) return;

            this._overlay.classList.remove('flux-shortcuts-visible');
            this._isOpen = false;
            document.body.style.overflow = '';
        },

        /**
         * Build the shortcuts overlay DOM
         */
        _createOverlay: function() {
            var self = this;

            var overlay = document.createElement('div');
            overlay.className = 'flux-shortcuts-overlay';
            overlay.innerHTML = this._buildHTML();
            document.body.appendChild(overlay);
            this._overlay = overlay;

            // Close on backdrop click
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    self.close();
                }
            });

            // Close button
            var closeBtn = overlay.querySelector('.flux-shortcuts-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    self.close();
                });
            }

            // Tab switching
            var tabs = overlay.querySelectorAll('.flux-shortcuts-tab');
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].addEventListener('click', function() {
                    self._switchTab(this.dataset.tab, overlay);
                });
            }
        },

        /**
         * Switch between shortcut category tabs
         */
        _switchTab: function(tabId, overlay) {
            // Update tab active state
            var tabs = overlay.querySelectorAll('.flux-shortcuts-tab');
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].classList.toggle('active', tabs[i].dataset.tab === tabId);
            }

            // Show/hide panels
            var panels = overlay.querySelectorAll('.flux-shortcuts-panel');
            for (var j = 0; j < panels.length; j++) {
                panels[j].classList.toggle('active', panels[j].dataset.panel === tabId);
            }
        },

        /**
         * Build the HTML structure
         */
        _buildHTML: function() {
            var shortcuts = this._getShortcuts();

            var html = '';
            html += '<div class="flux-shortcuts-card">';
            
            // Header
            html += '<div class="flux-shortcuts-header">';
            html += '  <div class="flux-shortcuts-title-row">';
            html += '    <div>';
            html += '      <h2 class="flux-shortcuts-title">' + __('Keyboard Shortcuts') + '</h2>';
            html += '      <p class="flux-shortcuts-subtitle">FLUX &mdash; ' + __('Quick Reference') + '</p>';
            html += '    </div>';
            html += '    <button class="flux-shortcuts-close" aria-label="Close">';
            html += '      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
            html += '    </button>';
            html += '  </div>';
            html += '  <div class="flux-shortcuts-green-bar"></div>';

            // Tabs
            html += '  <div class="flux-shortcuts-tabs">';
            var categories = Object.keys(shortcuts);
            for (var i = 0; i < categories.length; i++) {
                var isActive = i === 0 ? ' active' : '';
                html += '<button class="flux-shortcuts-tab' + isActive + '" data-tab="' + categories[i] + '">';
                html += shortcuts[categories[i]].icon + ' ' + shortcuts[categories[i]].label;
                html += '</button>';
            }
            html += '  </div>';
            html += '</div>';

            // Panels
            html += '<div class="flux-shortcuts-body">';
            for (var k = 0; k < categories.length; k++) {
                var cat = categories[k];
                var isActivePanel = k === 0 ? ' active' : '';
                html += '<div class="flux-shortcuts-panel' + isActivePanel + '" data-panel="' + cat + '">';
                var items = shortcuts[cat].items;
                for (var m = 0; m < items.length; m++) {
                    html += '<div class="flux-shortcut-row">';
                    html += '  <span class="flux-shortcut-desc">' + items[m].desc + '</span>';
                    html += '  <span class="flux-shortcut-keys">' + this._renderKeys(items[m].keys) + '</span>';
                    html += '</div>';
                }
                html += '</div>';
            }
            html += '</div>';

            // Footer
            html += '<div class="flux-shortcuts-footer">';
            html += '  <span>' + __('Press') + ' <kbd>?</kbd> ' + __('to toggle this panel') + '</span>';
            html += '  <span>' + __('Press') + ' <kbd>Esc</kbd> ' + __('to close') + '</span>';
            html += '</div>';

            html += '</div>';
            return html;
        },

        /**
         * Render key badges
         */
        _renderKeys: function(keys) {
            var parts = keys.split('+');
            var html = '';
            for (var i = 0; i < parts.length; i++) {
                if (i > 0) html += '<span class="flux-shortcut-plus">+</span>';
                html += '<kbd class="flux-shortcut-key">' + parts[i].trim() + '</kbd>';
            }
            return html;
        },

        /**
         * Get categorized shortcuts list
         */
        _getShortcuts: function() {
            var isMac = navigator.platform.indexOf('Mac') > -1;
            var mod = isMac ? '⌘' : 'Ctrl';
            var alt = isMac ? '⌥' : 'Alt';

            return {
                navigation: {
                    label: __('Navigation'),
                    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
                    items: [
                        { keys: mod + ' + G', desc: __('Open Search / Go To') },
                        { keys: alt + ' + S', desc: __('Open Sidebar') },
                        { keys: 'Home', desc: __('Go to Home') },
                        { keys: 'Shift + ' + mod + ' + H', desc: __('Toggle Help Menu') },
                        { keys: '?', desc: __('Show Keyboard Shortcuts') }
                    ]
                },
                forms: {
                    label: __('Forms'),
                    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
                    items: [
                        { keys: mod + ' + S', desc: __('Save Document') },
                        { keys: mod + ' + Enter', desc: __('Submit Document') },
                        { keys: mod + ' + B', desc: __('Bold (in text editor)') },
                        { keys: mod + ' + I', desc: __('Italic (in text editor)') },
                        { keys: 'Escape', desc: __('Close Dialog / Cancel') },
                        { keys: mod + ' + Z', desc: __('Undo') },
                        { keys: mod + ' + Shift + Z', desc: __('Redo') }
                    ]
                },
                lists: {
                    label: __('List View'),
                    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
                    items: [
                        { keys: '↑ / ↓', desc: __('Navigate between rows') },
                        { keys: 'Enter', desc: __('Open selected row') },
                        { keys: 'Space', desc: __('Select / Deselect row') },
                        { keys: mod + ' + Shift + R', desc: __('Refresh List') }
                    ]
                },
                flux: {
                    label: 'FLUX',
                    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
                    items: [
                        { keys: mod + ' + G', desc: __('FLUX Search Overlay') },
                        { keys: mod + ' + D', desc: __('Toggle Dark Mode') },
                        { keys: mod + ' + M', desc: __('Toggle Sound Effects') },
                        { keys: '↑↑↓↓←→←→BA', desc: __('Konami Code — Gold Mode ✨') }
                    ]
                }
            };
        }
    };

    // ─── Auto-initialize ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            flux.shortcuts.init();
        });
    } else {
        flux.shortcuts.init();
    }
})();
