// Copyright (c) 2024, Arkan Lab — https://arkan.it.com
// License: MIT

frappe.pages["flux-theme-about"].on_page_load = function(wrapper) {
    const page = frappe.ui.make_app_page({
        parent: wrapper,
        title: __("About FLUX Theme"),
        single_column: true,
    });

    page.main.addClass("flux-theme-about-page");
    const $container = $('<div class="fv-about-container"></div>').appendTo(page.main);

    // Use frappe.visual.generator for premium rendering
    const renderWithGenerator = async () => {
        try {
            await frappe.visual.generator.aboutPage(
                $container[0],
                "flux_theme",
                {
                    color: "#7C3AED",
                    mainDoctype: null,
                    features: [
        {
                "icon": "building-community",
                "title": "Co-Working Aesthetic",
                "description": "Modern community-focused design with purple gradients and warm tones."
        },
        {
                "icon": "palette",
                "title": "Vibrant Gradients",
                "description": "Dynamic gradient overlays on cards, headers, and workspace tiles."
        },
        {
                "icon": "text-direction-rtl",
                "title": "RTL Support",
                "description": "Full Arabic layout with modern typography and gradient directions."
        },
        {
                "icon": "sparkles",
                "title": "Animated Effects",
                "description": "Hover animations, card transitions, and smooth loading effects."
        }
],
                    roles: null,
                    ctas: [
                        { label: __("Start Onboarding"), route: "flux-theme-onboarding", primary: true },
                        { label: __("Open Settings"), route: "app/flux-settings" },
                    ],
                }
            );
        } catch(e) {
            console.warn("Generator failed, using fallback:", e);
            renderFallback($container);
        }
    };

    const renderFallback = ($el) => {
        $el.html(`
            <div style="text-align:center;padding:60px 20px">
                <h1 style="font-size:2.5rem;font-weight:800;background:linear-gradient(135deg,#7C3AED,#333);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${__("FLUX Theme")}</h1>
                <p style="font-size:1.15rem;color:var(--text-muted);max-width:600px;margin:16px auto">${__("Modern community-focused design with purple gradients and warm tones.")}</p>
                <div style="margin-top:24px">
                    <a href="/app/flux-theme-onboarding" class="btn btn-primary btn-lg">${__("Start Onboarding")}</a>
                </div>
            </div>
        `);
    };

    if (frappe.visual && frappe.visual.generator) {
        renderWithGenerator();
    } else {
        frappe.require("frappe_visual.bundle.js", () => {
            if (frappe.visual && frappe.visual.generator) {
                renderWithGenerator();
            } else {
                renderFallback($container);
            }
        });
    }
};
