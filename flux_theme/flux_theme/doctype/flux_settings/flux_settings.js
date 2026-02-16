// Copyright (c) 2026, Arkan Labs and contributors
// For license information, please see license.txt

frappe.ui.form.on("FLUX Settings", {
	refresh: function(frm) {
		// Add branded header
		frm.set_intro(
			'<div style="display:flex;align-items:center;gap:12px;padding:4px 0;">' +
			'<span style="font-size:28px;">🏙️</span>' +
			'<div>' +
			'<strong style="color:#09B474;font-size:15px;">FLUX Theme Settings</strong><br>' +
			'<span style="color:#888;font-size:12px;">Configure your modern theme experience</span>' +
			'</div></div>',
			'blue'
		);

		// Preview button
		frm.add_custom_button(__('Preview Theme'), function() {
			frappe.msgprint({
				title: __('Theme Preview'),
				indicator: 'blue',
				message: __(
					'<div style="text-align:center;padding:20px;">' +
					'<div style="width:60px;height:60px;border-radius:50%;margin:0 auto 12px;' +
					'background:' + (frm.doc.primary_color || '#09B474') + ';' +
					'display:flex;align-items:center;justify-content:center;font-size:24px;">🏙️</div>' +
					'<h4 style="color:' + (frm.doc.primary_color || '#09B474') + ';">' +
					(frm.doc.brand_name || 'FLUX') + '</h4>' +
					'<div style="display:flex;gap:8px;justify-content:center;margin-top:16px;">' +
					'<div style="width:48px;height:48px;border-radius:8px;background:' +
					(frm.doc.primary_color || '#09B474') + ';" title="Primary"></div>' +
					'<div style="width:48px;height:48px;border-radius:8px;background:' +
					(frm.doc.secondary_color || '#2D3436') + ';" title="Secondary"></div>' +
					'<div style="width:48px;height:48px;border-radius:8px;background:' +
					(frm.doc.accent_color || '#F0F5F3') + ';border:1px solid #ddd;" title="Accent"></div>' +
					'</div>' +
					'<p style="margin-top:12px;color:#888;font-size:12px;">Save settings and reload to apply changes</p>' +
					'</div>'
				)
			});
		}, __('Actions'));

		// Reset to defaults button
		frm.add_custom_button(__('Reset Defaults'), function() {
			frappe.confirm(
				__('Reset all FLUX settings to defaults? This cannot be undone.'),
				function() {
					frm.set_value('brand_name', 'FLUX');
					frm.set_value('primary_color', '#09B474');
					frm.set_value('secondary_color', '#2D3436');
					frm.set_value('accent_color', '#F0F5F3');
					frm.set_value('enable_splash_screen', 1);
					frm.set_value('enable_skyline', 1);
					frm.set_value('enable_particles', 1);
					frm.set_value('enable_sounds', 0);
					frm.set_value('enable_search_overlay', 1);
					frm.set_value('default_dark_mode', 0);
					frm.set_value('splash_duration', 2800);
					frm.set_value('custom_css', '');
					frm.set_value('custom_js', '');
					frm.dirty();
					frappe.show_alert({
						message: __('Defaults restored — save to apply'),
						indicator: 'green'
					});
				}
			);
		}, __('Actions'));
	},

	primary_color: function(frm) {
		frm.dashboard.set_headline(
			'<span style="color:' + frm.doc.primary_color + ';">● Primary: ' +
			frm.doc.primary_color + '</span>'
		);
	}
});
