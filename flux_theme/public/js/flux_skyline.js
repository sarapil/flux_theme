// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme - modern city skyline SVG Renderer
 * Programmatic modern city skyline background with landmarks
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    // Ensure helpers exist (flux_theme.js may not be loaded on login/web pages)
    if (!flux.isLoginPage) {
        flux.isLoginPage = function() {
            return document.body.getAttribute('data-path') === 'login' ||
                   window.location.pathname.indexOf('/login') !== -1;
        };
    }
    if (!flux.prefersReducedMotion) {
        flux.prefersReducedMotion = function() {
            return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        };
    }

    /**
     * modern city skyline Generator
     */
    flux.skyline = {
        config: {
            viewBox: { width: 1920, height: 600 },
            skyHeight: 350,
            waterHeight: 150,
            buildingColor: '#0D1117',
            waterColor: '#2D3436'
        },

        /**
         * Create the complete skyline scene
         * @param {HTMLElement} container - Container element
         * @param {Object} options - Configuration options
         */
        create: function(container, options) {
            if (!container) return null;

            options = Object.assign({
                fullScene: true,
                showStars: true,
                showWater: true,
                showReflections: true,
                animated: true
            }, options);

            const svg = this.createSVG();
            
            // Add gradient definitions
            this.addDefs(svg);
            
            // Add sky background
            this.addSky(svg);
            
            // Add buildings
            this.addBuildings(svg);
            
            // Add water if enabled
            if (options.showWater) {
                this.addWater(svg, options.animated);
            }
            
            // Add reflections if enabled
            if (options.showReflections && options.showWater) {
                this.addReflections(svg);
            }

            container.appendChild(svg);
            
            return svg;
        },

        /**
         * Create base SVG element
         */
        createSVG: function() {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 ' + this.config.viewBox.width + ' ' + this.config.viewBox.height);
            // xMidYMid slice = center scene in both axes, scale to FILL container (cover),
            // excess width gets cropped on left+right sides
            svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            svg.setAttribute('class', 'flux-skyline-svg');
            svg.style.cssText = 'position: absolute; z-index: 0;';
            return svg;
        },

        /**
         * Add SVG definitions (gradients, filters)
         */
        addDefs: function(svg) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            
            // Sky gradient
            const skyGradient = this.createLinearGradient('skyGradient', [
                { offset: '0%', color: '#1A2526' },
                { offset: '50%', color: '#2D3436' },
                { offset: '100%', color: '#3D4F51' }
            ], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
            defs.appendChild(skyGradient);
            
            // Water gradient
            const waterGradient = this.createLinearGradient('waterGradient', [
                { offset: '0%', color: '#2D3436' },
                { offset: '100%', color: '#1A2526' }
            ], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
            defs.appendChild(waterGradient);
            
            // Moon glow filter
            const moonGlow = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            moonGlow.setAttribute('id', 'moonGlow');
            moonGlow.innerHTML = '<feGaussianBlur stdDeviation="3" result="coloredBlur"/>' +
                '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>';
            defs.appendChild(moonGlow);

            // Glass facade gradients — vertical (sky reflection at top)
            var self = this;
            // Dark blue-gray glass (most common)
            defs.appendChild(self.createLinearGradient('glass1', [
                {offset:'0%',color:'#2a3d55'},{offset:'15%',color:'#1e2d40'},
                {offset:'85%',color:'#141e2b'},{offset:'100%',color:'#0e1620'}
            ], {x1:'0%',y1:'0%',x2:'0%',y2:'100%'}));
            // Teal-tinted glass
            defs.appendChild(self.createLinearGradient('glass2', [
                {offset:'0%',color:'#243848'},{offset:'20%',color:'#1a2c3a'},
                {offset:'80%',color:'#111f2a'},{offset:'100%',color:'#0c161e'}
            ], {x1:'0%',y1:'0%',x2:'0%',y2:'100%'}));
            // Warm dark glass
            defs.appendChild(self.createLinearGradient('glass3', [
                {offset:'0%',color:'#2e3a48'},{offset:'15%',color:'#222e3a'},
                {offset:'85%',color:'#161e28'},{offset:'100%',color:'#0d1318'}
            ], {x1:'0%',y1:'0%',x2:'0%',y2:'100%'}));
            // Background layer glass (lighter, for atmospheric depth)
            defs.appendChild(self.createLinearGradient('glassBg', [
                {offset:'0%',color:'#324860'},{offset:'50%',color:'#283a4e'},
                {offset:'100%',color:'#1e2e3e'}
            ], {x1:'0%',y1:'0%',x2:'0%',y2:'100%'}));
            // Horizontal sheen (light reflection band)
            defs.appendChild(self.createLinearGradient('glassSheen', [
                {offset:'0%',color:'rgba(255,255,255,0)'},{offset:'30%',color:'rgba(255,255,255,0.03)'},
                {offset:'50%',color:'rgba(255,255,255,0.07)'},{offset:'70%',color:'rgba(255,255,255,0.03)'},
                {offset:'100%',color:'rgba(255,255,255,0)'}
            ], {x1:'0%',y1:'0%',x2:'100%',y2:'0%'}));
            // Edge highlight gradient (left-to-right)
            defs.appendChild(self.createLinearGradient('edgeHL', [
                {offset:'0%',color:'rgba(255,255,255,0.12)'},{offset:'5%',color:'rgba(255,255,255,0)'},
                {offset:'95%',color:'rgba(255,255,255,0)'},{offset:'100%',color:'rgba(255,255,255,0.06)'}
            ], {x1:'0%',y1:'0%',x2:'100%',y2:'0%'}));

            svg.appendChild(defs);
        },

        /**
         * Create a linear gradient
         */
        createLinearGradient: function(id, stops, coords) {
            const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            gradient.setAttribute('id', id);
            Object.keys(coords).forEach(function(key) {
                gradient.setAttribute(key, coords[key]);
            });
            
            stops.forEach(function(stop) {
                const stopEl = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stopEl.setAttribute('offset', stop.offset);
                stopEl.setAttribute('style', 'stop-color:' + stop.color);
                gradient.appendChild(stopEl);
            });
            
            return gradient;
        },

        /**
         * Add sky background with twinkling stars
         */
        addSky: function(svg) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('width', this.config.viewBox.width);
            rect.setAttribute('height', this.config.viewBox.height);
            rect.setAttribute('fill', 'url(#skyGradient)');
            svg.appendChild(rect);

            // Add twinkling stars
            this.addStars(svg);
            
            // Add crescent moon
            this.addMoon(svg);
        },

        /**
         * Add animated twinkling stars
         */
        addStars: function(svg) {
            const starsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            starsGroup.setAttribute('id', 'skyline-stars');

            // Responsive star count — more on desktop, fewer on mobile
            const vw = window.innerWidth;
            var starCount = vw < 480 ? 25 : vw < 768 ? 40 : vw < 1024 ? 55 : 75;

            const random = function(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
            const starConfigs = [];

            for (let i = 0; i < starCount; i++) {
                var r = Math.random();
                var size, opacity, hasShimmer, speed;

                if (r < 0.45) {
                    // 45% — distant tiny stars (static, faint)
                    size = (Math.random() * 0.4 + 0.2).toFixed(2);
                    opacity = (Math.random() * 0.3 + 0.2).toFixed(2);
                    hasShimmer = false;
                } else if (r < 0.75) {
                    // 30% — medium stars (some with slow shimmer)
                    size = (Math.random() * 0.8 + 0.5).toFixed(2);
                    opacity = (Math.random() * 0.4 + 0.3).toFixed(2);
                    hasShimmer = Math.random() < 0.5; // only half shimmer
                } else {
                    // 25% — brighter, closer stars (gentle shimmer)
                    size = (Math.random() * 1.2 + 0.8).toFixed(2);
                    opacity = (Math.random() * 0.4 + 0.45).toFixed(2);
                    hasShimmer = Math.random() < 0.7; // most shimmer gently
                }

                // Slow shimmer only — 8 to 16 seconds, purely opacity based
                speed = hasShimmer ? (Math.random() * 8 + 8).toFixed(1) : 0;

                starConfigs.push({
                    x: random(10, 1910),
                    y: random(8, 330),
                    r: size,
                    opacity: opacity,
                    delay: (Math.random() * 10).toFixed(1),
                    speed: speed,
                    hasShimmer: hasShimmer
                });
            }

            starConfigs.forEach(function(s) {
                const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                star.setAttribute('cx', s.x);
                star.setAttribute('cy', s.y);
                star.setAttribute('r', s.r);
                star.setAttribute('fill', '#F0F5F3');
                star.setAttribute('opacity', s.opacity);
                if (s.hasShimmer) {
                    // Realistic slow shimmer — opacity only, no size change
                    star.style.cssText = 'animation: starShimmer ' + s.speed + 's ease-in-out ' + s.delay + 's infinite;';
                }
                starsGroup.appendChild(star);
            });

            svg.appendChild(starsGroup);
        },

        /**
         * Add crescent moon
         */
        addMoon: function(svg) {
            const moonGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            moonGroup.setAttribute('filter', 'url(#moonGlow)');
            
            // Crescent moon path
            const moon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            moon.setAttribute('d', 'M1750,80 a30,30 0 1,1 0,60 a24,24 0 1,0 0,-60');
            moon.setAttribute('fill', '#F0F5F3');
            moon.setAttribute('opacity', '0.9');
            moonGroup.appendChild(moon);
            
            svg.appendChild(moonGroup);
        },

        /**
         * Add modern city skyline buildings
         */
        addBuildings: function(svg) {
            var NS = 'http://www.w3.org/2000/svg';
            var buildingsGroup = document.createElementNS(NS, 'g');
            buildingsGroup.setAttribute('id', 'skyline-buildings');
            var baseY = this.config.skyHeight;
            var bc = this.config.buildingColor;

            // ══════════════════════════════════════════════
            //  REUSABLE TOWER BUILDER (realistic version)
            // ══════════════════════════════════════════════
            function tower(x, topY, w, opts) {
                opts = opts || {};
                var g = document.createElementNS(NS, 'g');
                var fill = opts.fill || 'url(#glass1)';
                var h = baseY - topY;

                // ── Body Shape ──
                if (opts.shape === 'cylinder') {
                    var rx = w / 2, ry = Math.min(10, w / 3);
                    var body = document.createElementNS(NS, 'rect');
                    body.setAttribute('x', x); body.setAttribute('y', topY + ry);
                    body.setAttribute('width', w); body.setAttribute('height', h - ry);
                    body.setAttribute('fill', fill); body.setAttribute('rx', w * 0.08);
                    g.appendChild(body);
                    var cap = document.createElementNS(NS, 'ellipse');
                    cap.setAttribute('cx', x + rx); cap.setAttribute('cy', topY + ry);
                    cap.setAttribute('rx', rx); cap.setAttribute('ry', ry);
                    cap.setAttribute('fill', fill);
                    g.appendChild(cap);
                } else if (opts.shape === 'tapered') {
                    var t = opts.taper || 0.6;
                    var tw = w * t, ox = (w - tw) / 2;
                    var p = document.createElementNS(NS, 'path');
                    p.setAttribute('d','M'+x+','+baseY+' L'+(x+ox)+','+topY+' L'+(x+ox+tw)+','+topY+' L'+(x+w)+','+baseY+' Z');
                    p.setAttribute('fill', fill);
                    g.appendChild(p);
                } else if (opts.shape === 'setback') {
                    var steps = opts.steps || 3;
                    var sH = h / steps, cW = w, cX = x;
                    for (var s = 0; s < steps; s++) {
                        var sY = baseY - (s + 1) * sH;
                        var r = document.createElementNS(NS, 'rect');
                        r.setAttribute('x', cX); r.setAttribute('y', sY);
                        r.setAttribute('width', cW); r.setAttribute('height', sH + 0.5);
                        r.setAttribute('fill', fill);
                        g.appendChild(r);
                        // Setback ledge line
                        var ledge = document.createElementNS(NS, 'line');
                        ledge.setAttribute('x1', cX); ledge.setAttribute('y1', sY);
                        ledge.setAttribute('x2', cX + cW); ledge.setAttribute('y2', sY);
                        ledge.setAttribute('stroke', 'rgba(255,255,255,0.1)');
                        ledge.setAttribute('stroke-width', '0.8');
                        g.appendChild(ledge);
                        var shrink = cW * 0.14;
                        cX += shrink / 2; cW -= shrink;
                    }
                } else if (opts.shape === 'crown') {
                    // Tower with decorative crown top
                    var crownH = Math.min(20, h * 0.08);
                    var bodyRect = document.createElementNS(NS, 'rect');
                    bodyRect.setAttribute('x', x); bodyRect.setAttribute('y', topY + crownH);
                    bodyRect.setAttribute('width', w); bodyRect.setAttribute('height', h - crownH);
                    bodyRect.setAttribute('fill', fill);
                    g.appendChild(bodyRect);
                    // Crown — trapezoidal top
                    var crP = document.createElementNS(NS, 'path');
                    var indent = w * 0.08;
                    crP.setAttribute('d','M'+x+','+(topY+crownH)+' L'+(x+indent)+','+topY+' L'+(x+w-indent)+','+topY+' L'+(x+w)+','+(topY+crownH)+' Z');
                    crP.setAttribute('fill', fill);
                    g.appendChild(crP);
                    // Crown accent line
                    var crl = document.createElementNS(NS, 'line');
                    crl.setAttribute('x1', x); crl.setAttribute('y1', topY + crownH);
                    crl.setAttribute('x2', x + w); crl.setAttribute('y2', topY + crownH);
                    crl.setAttribute('stroke', 'rgba(9,180,116,0.15)');
                    crl.setAttribute('stroke-width', '1');
                    g.appendChild(crl);
                } else {
                    // Standard rectangular
                    var rect = document.createElementNS(NS, 'rect');
                    rect.setAttribute('x', x); rect.setAttribute('y', topY);
                    rect.setAttribute('width', w); rect.setAttribute('height', h);
                    rect.setAttribute('fill', fill);
                    g.appendChild(rect);
                }

                // ── Podium / base (wider lower floors) ──
                if (opts.podium) {
                    var pH = opts.podiumH || Math.min(25, h * 0.12);
                    var pW = w + (opts.podiumExtra || 8);
                    var pX = x - (pW - w) / 2;
                    var pod = document.createElementNS(NS, 'rect');
                    pod.setAttribute('x', pX); pod.setAttribute('y', baseY - pH);
                    pod.setAttribute('width', pW); pod.setAttribute('height', pH);
                    pod.setAttribute('fill', opts.fill || 'url(#glass1)');
                    pod.setAttribute('opacity', '0.85');
                    g.appendChild(pod);
                }

                // ── Window Grid (realistic: rows × cols) ──
                var floorH = opts.floorH || 7;
                var winMargin = opts.winMargin || 1.5;
                var panels = opts.panels || Math.max(2, Math.floor(w / 10));
                var panelW = (w - winMargin * 2) / panels;
                var effectiveTop = topY + (opts.shape === 'crown' ? 20 : 3);
                
                for (var fy = effectiveTop; fy < baseY - 2; fy += floorH) {
                    // Floor separator line
                    var fl = document.createElementNS(NS, 'line');
                    fl.setAttribute('x1', x); fl.setAttribute('y1', fy);
                    fl.setAttribute('x2', x + w); fl.setAttribute('y2', fy);
                    fl.setAttribute('stroke', 'rgba(0,0,0,0.25)');
                    fl.setAttribute('stroke-width', '0.4');
                    g.appendChild(fl);

                    // Window panes per floor
                    for (var pi = 0; pi < panels; pi++) {
                        var wx = x + winMargin + pi * panelW + 0.5;
                        var wy = fy + 0.8;
                        var ww = panelW - 1;
                        var wh = floorH - 1.5;
                        if (ww < 1 || wh < 1) continue;
                        var wp = document.createElementNS(NS, 'rect');
                        wp.setAttribute('x', wx); wp.setAttribute('y', wy);
                        wp.setAttribute('width', ww); wp.setAttribute('height', wh);
                        // Slight color variation per window
                        var shade = Math.random();
                        if (shade > 0.85) {
                            // Lit window (warm)
                            wp.setAttribute('fill', '#09B474');
                            wp.setAttribute('opacity', (0.08 + Math.random() * 0.18).toFixed(2));
                        } else if (shade > 0.6) {
                            // Slightly lighter glass
                            wp.setAttribute('fill', 'rgba(180,210,240,0.06)');
                        } else {
                            // Dark glass (most windows)
                            wp.setAttribute('fill', 'rgba(120,160,200,0.03)');
                        }
                        g.appendChild(wp);
                    }
                }

                // ── Vertical mullion lines ──
                for (var vi = 1; vi < panels; vi++) {
                    var vx = x + winMargin + vi * panelW;
                    var vl = document.createElementNS(NS, 'line');
                    vl.setAttribute('x1', vx); vl.setAttribute('y1', effectiveTop);
                    vl.setAttribute('x2', vx); vl.setAttribute('y2', baseY);
                    vl.setAttribute('stroke', 'rgba(0,0,0,0.2)');
                    vl.setAttribute('stroke-width', '0.3');
                    g.appendChild(vl);
                }

                // ── Edge highlight (left edge catch-light) ──
                var edge = document.createElementNS(NS, 'rect');
                edge.setAttribute('x', x); edge.setAttribute('y', topY);
                edge.setAttribute('width', w); edge.setAttribute('height', h);
                edge.setAttribute('fill', 'url(#edgeHL)');
                g.appendChild(edge);

                // ── Glass sheen band ──
                if (!opts.noSheen) {
                    var sheenY = topY + h * 0.15;
                    var sheenH = h * 0.12;
                    var sheen = document.createElementNS(NS, 'rect');
                    sheen.setAttribute('x', x); sheen.setAttribute('y', sheenY);
                    sheen.setAttribute('width', w); sheen.setAttribute('height', sheenH);
                    sheen.setAttribute('fill', 'rgba(180,220,255,0.04)');
                    g.appendChild(sheen);
                }

                // ── Mechanical floor (dark band) ──
                if (h > 120 && !opts.noMech) {
                    var mechY = topY + h * 0.4;
                    var mech = document.createElementNS(NS, 'rect');
                    mech.setAttribute('x', x); mech.setAttribute('y', mechY);
                    mech.setAttribute('width', w); mech.setAttribute('height', '4');
                    mech.setAttribute('fill', 'rgba(0,0,0,0.35)');
                    g.appendChild(mech);
                }

                // ── Roof details ──
                if (opts.antenna) {
                    var ax = x + w / 2;
                    var ah = opts.antennaH || 18;
                    var ant = document.createElementNS(NS, 'line');
                    ant.setAttribute('x1', ax); ant.setAttribute('y1', topY - ah);
                    ant.setAttribute('x2', ax); ant.setAttribute('y2', topY);
                    ant.setAttribute('stroke', '#3D4F51');
                    ant.setAttribute('stroke-width', '1.2');
                    g.appendChild(ant);
                    // Blinking light
                    var bl = document.createElementNS(NS, 'circle');
                    bl.setAttribute('cx', ax); bl.setAttribute('cy', topY - ah);
                    bl.setAttribute('r', '1.5');
                    bl.setAttribute('fill', '#ff3333');
                    bl.setAttribute('opacity', '0.6');
                    g.appendChild(bl);
                }

                return g;
            }

            // ══════════════════════════════════════════════
            //  BACKGROUND LAYER (atmospheric perspective)
            // ══════════════════════════════════════════════
            var bgLayer = document.createElementNS(NS, 'g');
            bgLayer.setAttribute('opacity', '0.3');
            var bgTowers = [
                [20,215,22],[50,190,18],[100,200,24],[160,185,20],[220,205,16],
                [310,195,22],[370,210,18],[440,188,20],[530,202,16],[600,195,24],
                [690,208,18],[760,192,20],[840,205,22],[920,185,16],[1020,198,20],
                [1100,210,18],[1200,192,22],[1300,205,16],[1380,195,20],[1480,208,18],
                [1560,198,22],[1650,210,16],[1740,195,20],[1820,205,18],[1890,215,16]
            ];
            bgTowers.forEach(function(t) {
                bgLayer.appendChild(tower(t[0], t[1], t[2], {fill:'url(#glassBg)',floorH:5,panels:2,noSheen:true,noMech:true}));
            });
            buildingsGroup.appendChild(bgLayer);

            // ══════════════════════════════════════════════
            //  MAIN SKYLINE (foreground)
            // ══════════════════════════════════════════════

            // ── Far Left: low-rise waterfront cluster ──
            buildingsGroup.appendChild(tower(5, 260, 30, {fill:'url(#glass2)',floorH:8,panels:3,podium:true}));
            buildingsGroup.appendChild(tower(40, 230, 25, {fill:'url(#glass1)',shape:'cylinder',floorH:7}));
            buildingsGroup.appendChild(tower(70, 200, 35, {fill:'url(#glass2)',shape:'crown',floorH:6,panels:3}));
            buildingsGroup.appendChild(tower(112, 180, 28, {fill:'url(#glass1)',floorH:6,antenna:true}));

            // ── Emirates Towers (twin tapered) ──
            buildingsGroup.appendChild(tower(152, 70, 32, {fill:'url(#glass3)',shape:'tapered',taper:0.5,floorH:4,panels:3,antenna:true,antennaH:15}));
            buildingsGroup.appendChild(tower(192, 95, 28, {fill:'url(#glass3)',shape:'tapered',taper:0.55,floorH:4,panels:3,antenna:true,antennaH:10}));

            // ── Cluster near City Gateway ──
            buildingsGroup.appendChild(tower(228, 155, 30, {fill:'url(#glass1)',shape:'cylinder',floorH:6,podium:true}));
            buildingsGroup.appendChild(tower(265, 190, 22, {fill:'url(#glass2)',floorH:7}));

            // ── City Gateway ──
            (function() {
                var fg = document.createElementNS(NS, 'g');
                // Pillars with window grids
                fg.appendChild(tower(300, 95, 16, {fill:'url(#glass2)',floorH:5,panels:2,noSheen:true,noMech:true}));
                fg.appendChild(tower(352, 95, 16, {fill:'url(#glass2)',floorH:5,panels:2,noSheen:true,noMech:true}));
                // Top beam with green accent
                var beam = document.createElementNS(NS, 'rect');
                beam.setAttribute('x','298'); beam.setAttribute('y','93');
                beam.setAttribute('width','72'); beam.setAttribute('height','12');
                beam.setAttribute('fill','url(#glass2)');
                fg.appendChild(beam);
                var greenLine = document.createElementNS(NS, 'line');
                greenLine.setAttribute('x1','298'); greenLine.setAttribute('y1','93');
                greenLine.setAttribute('x2','370'); greenLine.setAttribute('y2','93');
                greenLine.setAttribute('stroke','rgba(9,180,116,0.2)');
                greenLine.setAttribute('stroke-width','1.5');
                fg.appendChild(greenLine);
                buildingsGroup.appendChild(fg);
            })();

            // ── Mid cluster ──
            buildingsGroup.appendChild(tower(385, 185, 32, {fill:'url(#glass1)',floorH:7,panels:3}));
            buildingsGroup.appendChild(tower(422, 145, 36, {fill:'url(#glass3)',shape:'cylinder',floorH:5,antenna:true,podium:true}));
            buildingsGroup.appendChild(tower(465, 165, 28, {fill:'url(#glass2)',shape:'setback',steps:3,floorH:6}));
            buildingsGroup.appendChild(tower(500, 195, 35, {fill:'url(#glass1)',shape:'crown',floorH:7,panels:4}));
            buildingsGroup.appendChild(tower(542, 210, 40, {fill:'url(#glass2)',floorH:8,panels:4,podium:true,podiumExtra:12}));

            // ── Cluster near Innovation Hub ──
            buildingsGroup.appendChild(tower(590, 175, 25, {fill:'url(#glass3)',shape:'cylinder',floorH:6}));
            buildingsGroup.appendChild(tower(620, 200, 22, {fill:'url(#glass1)',floorH:7}));

            // ── Innovation Hub (sail) ──
            (function() {
                var bag = document.createElementNS(NS, 'g');
                // Main sail shape
                var sail = document.createElementNS(NS, 'path');
                sail.setAttribute('d','M655,'+baseY+' L670,90 Q700,55 738,82 L760,'+baseY+' Q710,'+(baseY-20)+' 655,'+baseY);
                sail.setAttribute('fill','url(#glass3)');
                bag.appendChild(sail);
                // Floor lines following sail curve
                for (var fy = 100; fy < baseY; fy += 5) {
                    var progress = (fy - 90) / (baseY - 90);
                    var fw = 14 + progress * 75;
                    var fx = 707 - fw / 2;
                    var fl = document.createElementNS(NS, 'line');
                    fl.setAttribute('x1', fx); fl.setAttribute('y1', fy);
                    fl.setAttribute('x2', fx + fw); fl.setAttribute('y2', fy);
                    fl.setAttribute('stroke', 'rgba(0,0,0,0.2)');
                    fl.setAttribute('stroke-width', '0.4');
                    bag.appendChild(fl);
                    // Window panes along floor
                    if (fw > 10) {
                        var panes = Math.floor(fw / 8);
                        for (var p = 0; p < panes; p++) {
                            var pw = document.createElementNS(NS, 'rect');
                            pw.setAttribute('x', fx + 2 + p * (fw / panes));
                            pw.setAttribute('y', fy + 0.5);
                            pw.setAttribute('width', (fw / panes) - 1.5);
                            pw.setAttribute('height', '3.5');
                            var lit = Math.random() > 0.82;
                            pw.setAttribute('fill', lit ? '#09B474' : 'rgba(140,180,220,0.04)');
                            pw.setAttribute('opacity', lit ? '0.12' : '1');
                            bag.appendChild(pw);
                        }
                    }
                }
                // Helipad platform
                var hp = document.createElementNS(NS, 'ellipse');
                hp.setAttribute('cx','700'); hp.setAttribute('cy','60');
                hp.setAttribute('rx','9'); hp.setAttribute('ry','3.5');
                hp.setAttribute('fill','none');hp.setAttribute('stroke','rgba(255,255,255,0.12)');
                hp.setAttribute('stroke-width','0.6');
                bag.appendChild(hp);
                // Left edge highlight
                var sailEdge = document.createElementNS(NS, 'path');
                sailEdge.setAttribute('d','M655,'+baseY+' L670,90');
                sailEdge.setAttribute('stroke','rgba(255,255,255,0.1)');
                sailEdge.setAttribute('stroke-width','0.8');sailEdge.setAttribute('fill','none');
                bag.appendChild(sailEdge);
                buildingsGroup.appendChild(bag);
            })();

            // ── Pre-Khalifa cluster ──
            buildingsGroup.appendChild(tower(780, 165, 28, {fill:'url(#glass2)',shape:'cylinder',floorH:6}));
            buildingsGroup.appendChild(tower(815, 125, 35, {fill:'url(#glass1)',shape:'tapered',taper:0.6,floorH:5,antenna:true}));
            buildingsGroup.appendChild(tower(857, 175, 25, {fill:'url(#glass3)',shape:'crown',floorH:6}));
            buildingsGroup.appendChild(tower(888, 155, 30, {fill:'url(#glass2)',floorH:6,podium:true}));

            // ── Central Tower (centrepiece) ──
            (function() {
                var bk = document.createElementNS(NS, 'g');
                var cx = 960;
                // Y-plan: three wings creating setback profile
                var wings = [
                    {topY:50, w:52, bottom:baseY},
                    {topY:38, w:38, bottom:210},
                    {topY:25, w:24, bottom:130},
                    {topY:15, w:14, bottom:70}
                ];
                wings.forEach(function(wing) {
                    var sx = cx - wing.w / 2;
                    var r = document.createElementNS(NS, 'rect');
                    r.setAttribute('x', sx); r.setAttribute('y', wing.topY);
                    r.setAttribute('width', wing.w); r.setAttribute('height', wing.bottom - wing.topY);
                    r.setAttribute('fill', 'url(#glass3)');
                    bk.appendChild(r);
                    // Window grid on each section
                    var pCount = Math.max(2, Math.floor(wing.w / 8));
                    var pW = wing.w / pCount;
                    for (var fy = wing.topY + 3; fy < wing.bottom; fy += 3.5) {
                        // Floor line
                        var fl = document.createElementNS(NS, 'line');
                        fl.setAttribute('x1', sx); fl.setAttribute('y1', fy);
                        fl.setAttribute('x2', sx + wing.w); fl.setAttribute('y2', fy);
                        fl.setAttribute('stroke', 'rgba(0,0,0,0.2)');
                        fl.setAttribute('stroke-width', '0.3');
                        bk.appendChild(fl);
                        // Window panes
                        for (var p = 0; p < pCount; p++) {
                            var wp = document.createElementNS(NS, 'rect');
                            wp.setAttribute('x', sx + p * pW + 0.3);
                            wp.setAttribute('y', fy + 0.3);
                            wp.setAttribute('width', (pW - 0.6).toFixed(1));
                            wp.setAttribute('height', '2.5');
                            var lit = Math.random() > 0.88;
                            wp.setAttribute('fill', lit ? '#09B474' : 'rgba(120,160,200,0.025)');
                            wp.setAttribute('opacity', lit ? (0.08 + Math.random() * 0.15).toFixed(2) : '1');
                            bk.appendChild(wp);
                        }
                    }
                    // Setback ledge
                    var ledge = document.createElementNS(NS, 'line');
                    ledge.setAttribute('x1', sx); ledge.setAttribute('y1', wing.topY);
                    ledge.setAttribute('x2', sx + wing.w); ledge.setAttribute('y2', wing.topY);
                    ledge.setAttribute('stroke', 'rgba(255,255,255,0.08)');
                    ledge.setAttribute('stroke-width', '0.6');
                    bk.appendChild(ledge);
                    // Left edge
                    var le = document.createElementNS(NS, 'line');
                    le.setAttribute('x1', sx); le.setAttribute('y1', wing.topY);
                    le.setAttribute('x2', sx); le.setAttribute('y2', wing.bottom);
                    le.setAttribute('stroke', 'rgba(255,255,255,0.08)');
                    le.setAttribute('stroke-width', '0.4');
                    bk.appendChild(le);
                });
                // Spire
                var spire = document.createElementNS(NS, 'line');
                spire.setAttribute('x1', cx); spire.setAttribute('y1', 0);
                spire.setAttribute('x2', cx); spire.setAttribute('y2', 15);
                spire.setAttribute('stroke', '#3D4F51');
                spire.setAttribute('stroke-width', '1.8');
                bk.appendChild(spire);
                // Spire tip light
                var tip = document.createElementNS(NS, 'circle');
                tip.setAttribute('cx', cx); tip.setAttribute('cy', 0);
                tip.setAttribute('r', '1.5'); tip.setAttribute('fill', '#ff3333');
                tip.setAttribute('opacity', '0.5');
                bk.appendChild(tip);
                buildingsGroup.appendChild(bk);
            })();

            // ── Post-Khalifa cluster ──
            buildingsGroup.appendChild(tower(998, 140, 30, {fill:'url(#glass2)',shape:'cylinder',floorH:5,antenna:true}));
            buildingsGroup.appendChild(tower(1035, 175, 26, {fill:'url(#glass1)',floorH:7,podium:true}));
            buildingsGroup.appendChild(tower(1068, 195, 22, {fill:'url(#glass3)',floorH:7}));

            // ── Cayan Tower (twisted) ──
            (function() {
                var cg = document.createElementNS(NS, 'g');
                var slices = 12;
                var towerH = baseY - 85;
                var sliceH = towerH / slices;
                var tw = 28;
                var baseX = 1100;
                for (var s = 0; s < slices; s++) {
                    var sy = 85 + s * sliceH;
                    var twist = Math.sin(s * 0.35) * 5;
                    var sr = document.createElementNS(NS, 'rect');
                    sr.setAttribute('x', baseX + twist); sr.setAttribute('y', sy);
                    sr.setAttribute('width', tw); sr.setAttribute('height', sliceH + 0.5);
                    sr.setAttribute('fill', s % 2 === 0 ? 'url(#glass1)' : 'url(#glass3)');
                    cg.appendChild(sr);
                    // Floor line
                    var fl = document.createElementNS(NS, 'line');
                    fl.setAttribute('x1', baseX + twist); fl.setAttribute('y1', sy);
                    fl.setAttribute('x2', baseX + twist + tw); fl.setAttribute('y2', sy);
                    fl.setAttribute('stroke', 'rgba(0,0,0,0.25)');
                    fl.setAttribute('stroke-width', '0.4');
                    cg.appendChild(fl);
                    // Window panes on each slice
                    var panes = 3;
                    for (var p = 0; p < panes; p++) {
                        var wp = document.createElementNS(NS, 'rect');
                        wp.setAttribute('x', baseX + twist + 1 + p * (tw / panes));
                        wp.setAttribute('y', sy + 1);
                        wp.setAttribute('width', (tw / panes - 1.5).toFixed(1));
                        wp.setAttribute('height', (sliceH - 2).toFixed(1));
                        var lit = Math.random() > 0.85;
                        wp.setAttribute('fill', lit ? '#09B474' : 'rgba(120,160,200,0.03)');
                        wp.setAttribute('opacity', lit ? '0.1' : '1');
                        cg.appendChild(wp);
                    }
                    // Left edge highlight (shifting with twist)
                    var le = document.createElementNS(NS, 'line');
                    le.setAttribute('x1', baseX + twist); le.setAttribute('y1', sy);
                    le.setAttribute('x2', baseX + twist); le.setAttribute('y2', sy + sliceH);
                    le.setAttribute('stroke', 'rgba(255,255,255,0.1)');
                    le.setAttribute('stroke-width', '0.4');
                    cg.appendChild(le);
                }
                buildingsGroup.appendChild(cg);
            })();

            // ── Tall cylindrical tower ──
            buildingsGroup.appendChild(tower(1142, 90, 28, {fill:'url(#glass2)',shape:'cylinder',floorH:4,antenna:true,antennaH:12}));

            // ── Wide commercial block ──
            buildingsGroup.appendChild(tower(1178, 195, 50, {fill:'url(#glass1)',floorH:8,panels:5,podium:true,podiumExtra:14}));

            // ── Princess Tower (tall with crown) ──
            buildingsGroup.appendChild(tower(1240, 52, 32, {fill:'url(#glass3)',shape:'crown',floorH:4,panels:3,antenna:true,antennaH:12}));

            // ── Right cluster ──
            buildingsGroup.appendChild(tower(1282, 160, 28, {fill:'url(#glass1)',shape:'cylinder',floorH:6}));
            buildingsGroup.appendChild(tower(1318, 125, 36, {fill:'url(#glass2)',shape:'setback',steps:4,floorH:5}));
            buildingsGroup.appendChild(tower(1362, 180, 25, {fill:'url(#glass3)',shape:'tapered',taper:0.65,floorH:6}));
            buildingsGroup.appendChild(tower(1395, 200, 32, {fill:'url(#glass1)',floorH:7,podium:true}));
            buildingsGroup.appendChild(tower(1435, 145, 30, {fill:'url(#glass2)',shape:'cylinder',floorH:5,antenna:true}));
            buildingsGroup.appendChild(tower(1472, 170, 28, {fill:'url(#glass3)',shape:'crown',floorH:6}));

            // ── Wide glass block ──
            buildingsGroup.appendChild(tower(1508, 190, 50, {fill:'url(#glass1)',floorH:8,panels:5,podium:true,podiumExtra:10}));

            // ── Ferris Wheel ──
            (function() {
                var ag = document.createElementNS(NS, 'g');
                var wcx = 1620, wcy = 215, wr = 68;
                // Outer rim
                var wheel = document.createElementNS(NS, 'circle');
                wheel.setAttribute('cx', wcx); wheel.setAttribute('cy', wcy);
                wheel.setAttribute('r', wr);
                wheel.setAttribute('fill','none'); wheel.setAttribute('stroke','#1a2535');
                wheel.setAttribute('stroke-width', '4');
                ag.appendChild(wheel);
                // Inner rim
                var inner = document.createElementNS(NS, 'circle');
                inner.setAttribute('cx', wcx); inner.setAttribute('cy', wcy);
                inner.setAttribute('r', wr - 8);
                inner.setAttribute('fill','none'); inner.setAttribute('stroke','#1a2535');
                inner.setAttribute('stroke-width','1');
                ag.appendChild(inner);
                // Hub
                var hub = document.createElementNS(NS, 'circle');
                hub.setAttribute('cx', wcx); hub.setAttribute('cy', wcy);
                hub.setAttribute('r', '5'); hub.setAttribute('fill','#1a2535');
                ag.appendChild(hub);
                // Spokes
                for (var i = 0; i < 16; i++) {
                    var a = (i * 22.5) * Math.PI / 180;
                    var sp = document.createElementNS(NS, 'line');
                    sp.setAttribute('x1', wcx + Math.cos(a) * 6);
                    sp.setAttribute('y1', wcy + Math.sin(a) * 6);
                    sp.setAttribute('x2', wcx + Math.cos(a) * (wr - 2));
                    sp.setAttribute('y2', wcy + Math.sin(a) * (wr - 2));
                    sp.setAttribute('stroke','#1a2535'); sp.setAttribute('stroke-width','0.8');
                    ag.appendChild(sp);
                    // Capsules on rim
                    var cap = document.createElementNS(NS, 'circle');
                    cap.setAttribute('cx', wcx + Math.cos(a) * wr);
                    cap.setAttribute('cy', wcy + Math.sin(a) * wr);
                    cap.setAttribute('r', '2.5');
                    cap.setAttribute('fill','#1e2d3d');
                    cap.setAttribute('stroke','rgba(255,255,255,0.06)');
                    cap.setAttribute('stroke-width','0.3');
                    ag.appendChild(cap);
                }
                // A-frame support legs
                ['M'+(wcx-8)+','+(wcy+wr-5)+' L'+(wcx-30)+','+baseY,
                 'M'+(wcx+8)+','+(wcy+wr-5)+' L'+(wcx+30)+','+baseY,
                 'M'+wcx+','+(wcy+wr)+' L'+wcx+','+baseY
                ].forEach(function(d) {
                    var leg = document.createElementNS(NS, 'path');
                    leg.setAttribute('d', d);
                    leg.setAttribute('stroke','#1a2535');leg.setAttribute('stroke-width','3.5');leg.setAttribute('fill','none');
                    ag.appendChild(leg);
                });
                buildingsGroup.appendChild(ag);
            })();

            // ── Far right towers ──
            buildingsGroup.appendChild(tower(1690, 175, 28, {fill:'url(#glass2)',shape:'cylinder',floorH:6}));
            buildingsGroup.appendChild(tower(1725, 140, 35, {fill:'url(#glass1)',shape:'tapered',taper:0.6,floorH:5,antenna:true}));
            buildingsGroup.appendChild(tower(1768, 195, 26, {fill:'url(#glass3)',shape:'setback',steps:3,floorH:7}));
            buildingsGroup.appendChild(tower(1802, 165, 30, {fill:'url(#glass2)',shape:'crown',floorH:6}));
            buildingsGroup.appendChild(tower(1840, 200, 24, {fill:'url(#glass1)',shape:'cylinder',floorH:7}));
            buildingsGroup.appendChild(tower(1870, 220, 30, {fill:'url(#glass3)',floorH:8,panels:3,podium:true}));
            buildingsGroup.appendChild(tower(1905, 240, 18, {fill:'url(#glass2)',floorH:7}));

            // ── Shoreline ──
            var ground = document.createElementNS(NS, 'rect');
            ground.setAttribute('x','0'); ground.setAttribute('y', baseY - 1);
            ground.setAttribute('width', this.config.viewBox.width);
            ground.setAttribute('height','2');
            ground.setAttribute('fill','#080d14');
            buildingsGroup.appendChild(ground);

            svg.appendChild(buildingsGroup);
        },

        /**
         * Add animated water
         */
        addWater: function(svg, animated) {
            const waterGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            waterGroup.setAttribute('id', 'water');
            
            const waterY = this.config.skyHeight;
            const waterHeight = this.config.viewBox.height - waterY;
            
            // Base water
            const waterRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            waterRect.setAttribute('x', '0');
            waterRect.setAttribute('y', waterY);
            waterRect.setAttribute('width', this.config.viewBox.width);
            waterRect.setAttribute('height', waterHeight);
            waterRect.setAttribute('fill', 'url(#waterGradient)');
            waterGroup.appendChild(waterRect);
            
            // Wave layers
            if (animated && !flux.prefersReducedMotion()) {
                const waves = this.createWaves(waterY);
                waves.forEach(function(wave) {
                    waterGroup.appendChild(wave);
                });
            }
            
            svg.appendChild(waterGroup);
        },

        /**
         * Create animated wave paths
         */
        createWaves: function(baseY) {
            const waves = [];
            // Slow, fluid but clearly visible wave motion
            const waveConfigs = [
                { offset: 10, amplitude: 8, speed: 20, opacity: 0.7, color: '#3D4F51' },
                { offset: 50, amplitude: 6, speed: 28, opacity: 0.55, color: '#2D3436' },
                { offset: 90, amplitude: 4, speed: 38, opacity: 0.4, color: '#1A2526' }
            ];
            
            waveConfigs.forEach(function(config, index) {
                const wave = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const y = baseY + config.offset;
                
                // Wide smooth cubic bezier curves for natural water feel
                let d = 'M-600,' + y + ' ';
                for (let x = -600; x <= 2520; x += 160) {
                    const phaseShift = index * 0.8;
                    const cy = y + (Math.sin(x * 0.005 + phaseShift) * config.amplitude);
                    d += 'C' + (x + 53) + ',' + (cy - config.amplitude * 0.6) + ' ' +
                         (x + 107) + ',' + (cy + config.amplitude * 0.6) + ' ' +
                         (x + 160) + ',' + y + ' ';
                }
                d += 'L2520,600 L-600,600 Z';
                
                wave.setAttribute('d', d);
                wave.setAttribute('fill', config.color);
                wave.setAttribute('opacity', config.opacity);
                wave.style.cssText = 'animation: waveMotion ' + config.speed + 's ease-in-out infinite;';
                
                waves.push(wave);
            });
            
            return waves;
        },

        /**
         * Add building reflections in water
         */
        addReflections: function(svg) {
            const buildings = svg.querySelector('#skyline-buildings');
            if (!buildings) return;
            
            const reflection = buildings.cloneNode(true);
            reflection.setAttribute('id', 'building-reflections');
            reflection.setAttribute('transform', 
                'translate(0, ' + (this.config.skyHeight * 2 + this.config.waterHeight) + ') scale(1, -1)');
            reflection.setAttribute('opacity', '0.08');
            
            svg.appendChild(reflection);
        },

        /**
         * Helper: Create SVG path
         */
        createPath: function(d) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', d);
            return path;
        },

        /**
         * Helper: Create SVG rect
         */
        createRect: function(x, y, width, height) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', width);
            rect.setAttribute('height', height);
            return rect;
        },

        /**
         * Inject skyline into login page
         */
        injectIntoLogin: function() {
            // Avoid double-inject (flux_login.js may have already created #flux-login-skyline)
            if (document.getElementById('flux-login-skyline') || 
                document.getElementById('flux-skyline-container')) return;

            // Create container for skyline
            let skylineContainer = document.createElement('div');
            skylineContainer.id = 'flux-login-skyline';
            skylineContainer.style.cssText = 'position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;';
            document.body.insertBefore(skylineContainer, document.body.firstChild);
            
            this.create(skylineContainer, {
                fullScene: true,
                showStars: true,
                showWater: true,
                showReflections: true,
                animated: true
            });
        },

        /**
         * Inject skyline into Workspace main content area
         */
        injectIntoWorkspaces: function() {
            // Avoid double-inject
            if (document.querySelector('.flux-workspace-skyline')) return;

            // Create a FIXED full-viewport skyline layer so it never scrolls away
            var skyContainer = document.createElement('div');
            skyContainer.className = 'flux-workspace-skyline';
            skyContainer.style.cssText =
                'position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100vh;' +
                'z-index:0;pointer-events:none;overflow:hidden;';
            document.body.appendChild(skyContainer);

            // Ensure the page content floats above
            // v16: #page-Workspaces is gone; target the main-section or layout container
            var mainContent = document.querySelector('.main-section') ||
                             document.querySelector('.layout-main-section');
            if (mainContent) {
                mainContent.style.position = 'relative';
                mainContent.style.zIndex = '1';
            }

            this.create(skyContainer, {
                fullScene: true,
                showStars: true,
                showWater: true,
                showReflections: true,
                animated: true
            });
        }
    };

    // Auto-inject on login pages
    document.addEventListener('DOMContentLoaded', function() {
        if (flux.isLoginPage && flux.isLoginPage()) {
            flux.skyline.injectIntoLogin();
        }
    });

    /**
     * Detect whether the Workspaces page is actually the VISIBLE page.
     * v16: #page-Workspaces no longer exists. Use route detection and
     * check for workspace-specific DOM markers.
     */
    function isWorkspaceVisible() {
        // Method 1: Check the current route
        if (typeof frappe !== 'undefined' && frappe.get_route) {
            var route = frappe.get_route();
            if (route && route[0] === 'Workspaces') return true;
        }
        // Method 2: Check for workspace page markers (v16 EditorJS container)
        var wsContent = document.querySelector('.page-main-content[id="editorjs"]');
        if (wsContent) {
            var rect = wsContent.getBoundingClientRect();
            return rect.height > 0;
        }
        return false;
    }

    // Auto-inject on Workspace pages (desk), remove when navigating away
    if (typeof frappe !== 'undefined' && typeof frappe.router !== 'undefined') {
        frappe.router.on('change', function() {
            setTimeout(function() {
                // Feature gate: check if skyline is disabled in FLUX Settings
                if (flux.config && flux.config.features && !flux.config.features.skyline) {
                    var leftover = document.querySelector('.flux-workspace-skyline');
                    if (leftover) leftover.remove();
                    return;
                }

                var onWorkspaces = isWorkspaceVisible();
                var existing = document.querySelector('.flux-workspace-skyline');

                if (onWorkspaces && !existing) {
                    flux.skyline.injectIntoWorkspaces();
                } else if (!onWorkspaces && existing) {
                    // Remove skyline when leaving Workspaces
                    existing.remove();
                }
            }, 300);
        });
    }
    // Also try on DOMContentLoaded for direct /app visits
    document.addEventListener('DOMContentLoaded', function() {
        // Feature gate: check if skyline is disabled in FLUX Settings
        if (flux.config && flux.config.features && !flux.config.features.skyline) {
            return;
        }
        if (!flux.isLoginPage || !flux.isLoginPage()) {
            // Give Frappe time to render
            setTimeout(function() {
                if (isWorkspaceVisible()) {
                    flux.skyline.injectIntoWorkspaces();
                }
            }, 800);
        }
    });

})();
