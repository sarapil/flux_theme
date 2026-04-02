/**
 * FLUX Theme — LCD Desktop
 *
 * Wraps the Workspace page content in a beautifully animated LCD monitor
 * with SVG bezel, ambient particles, scanline texture, and power LED.
 *
 * Dark / Green / Red — Open Sans font.
 */
(function () {
	"use strict";

	window.flux = window.flux || {};

	var BEZEL = 18, RADIUS = 18, PARTICLE_N = 28;

	flux.desktop = {
		_active   : false,
		_injected : false,
		_raf      : null,
		_ready    : false,
		_canvas   : null,
		_ctx      : null,
		_particles: [],

		/* ══ Boot ══ */
		init: function () {
			if (this._ready) return;
			this._ready = true;
			var self = this;
			console.log("[FLUX-LCD] init");

			try {
				if (frappe.router && typeof frappe.router.on === "function") {
					frappe.router.on("change", function () { self._check(); });
				}
			} catch (_) {}

			$(document).on("page-change", function () { self._check(); });
			self._check();
		},

		_check: function () {
			var self = this;
			clearTimeout(self._timer);
			self._timer = setTimeout(function () {
				if (self._isWS()) { self._inject(); }
				else              { self._hide();   }
			}, 400);
		},

		_isWS: function () {
			try {
				var r = frappe.get_route();
				if (r && r[0] === "Workspaces") return true;
				// /desk landing → route is [""] (empty) before redirect
				if (r && (!r[0] || r[0] === "")) return true;
				// workspace slug (e.g. /desk/home) resolves via frappe.workspaces
				if (r && r[0] && frappe.workspaces && frappe.workspaces[r[0]]) return true;
			} catch (_) {}
			// fallback: check body data-route or DOM visibility
			var dr = document.body.getAttribute("data-route") || "";
			if (dr === "Workspaces" || dr.indexOf("Workspaces/") === 0) return true;
			var el = document.querySelector('[data-page-route="Workspaces"]');
			return el && el.offsetParent !== null;
		},

		/* ══ Inject ══ */
		_inject: function () {
			if (this._injected) {
				document.body.classList.add("flux-lcd-active");
				this._active = true;
				this._startParticles();
				return;
			}

			var self = this;
			var pb = document.querySelector('[data-page-route="Workspaces"] .page-body')
			      || document.querySelector('#page-Workspaces .page-body');
			if (!pb) { setTimeout(function () { self._inject(); }, 400); return; }

			var pw = pb.querySelector(".page-wrapper");
			if (!pw) { setTimeout(function () { self._inject(); }, 400); return; }

			if (pb.querySelector(".flux-lcd-wrap")) {
				this._injected = true; this._active = true;
				document.body.classList.add("flux-lcd-active");
				return;
			}

			console.log("[FLUX-LCD] injecting frame");
			this._injected = true;
			this._active   = true;
			document.body.classList.add("flux-lcd-active");
			this._build(pb, pw);
		},

		_hide: function () {
			if (!this._active) return;
			this._active = false;
			document.body.classList.remove("flux-lcd-active");
			if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
		},

		/* ══ Build DOM ══ */
		_build: function (pb, pw) {
			var wrap = document.createElement("div");
			wrap.className = "flux-lcd-wrap";

			var cv = document.createElement("canvas");
			cv.className = "flux-lcd-particles";
			wrap.appendChild(cv);
			this._canvas = cv;
			this._ctx    = cv.getContext("2d");
			this._seedParticles();

			var mon = document.createElement("div");
			mon.className = "flux-lcd-monitor";

			var scr = document.createElement("div");
			scr.className = "flux-lcd-screen";
			scr.appendChild(pw);

			scr.insertAdjacentHTML("beforeend",
				'<div class="flux-lcd-scanline"></div>' +
				'<div class="flux-lcd-glare"></div>' +
				'<div class="flux-lcd-vignette"></div>'
			);

			mon.appendChild(scr);

			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.setAttribute("class", "flux-lcd-bezel-svg");
			svg.setAttribute("preserveAspectRatio", "none");
			svg.setAttribute("viewBox", "0 0 1000 600");
			svg.innerHTML = this._svgBezel();
			mon.appendChild(svg);

			mon.insertAdjacentHTML("beforeend",
				'<div class="flux-lcd-led" title="System Online"></div>' +
				'<div class="flux-lcd-chin-brand"><span>FLUX</span></div>'
			);

			wrap.appendChild(mon);

			wrap.insertAdjacentHTML("beforeend",
				'<div class="flux-lcd-stand">' +
				'  <div class="flux-lcd-neck"></div>' +
				'  <div class="flux-lcd-base"></div>' +
				'</div>'
			);

			pb.appendChild(wrap);

			var glare = scr.querySelector(".flux-lcd-glare");
			scr.addEventListener("mousemove", function (e) {
				var r = scr.getBoundingClientRect();
				var x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
				var y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
				glare.style.background = "radial-gradient(ellipse at " + x + "% " + y +
					"%, rgba(9,180,116,0.04) 0%, transparent 60%)";
			});
			scr.addEventListener("mouseleave", function () { glare.style.background = ""; });

			this._startParticles();
		},

		/* ══ SVG Bezel ══ */
		_svgBezel: function () {
			var B = BEZEL, R = RADIUS;
			return '<defs>' +
				'<linearGradient id="flx-bg" x1="0" y1="0" x2="0" y2="1">' +
				'  <stop offset="0%" stop-color="#3a4245"/><stop offset="100%" stop-color="#141a1c"/>' +
				'</linearGradient>' +
				'<linearGradient id="flx-sh" x1="0" y1="0" x2="1" y2=".3">' +
				'  <stop offset="0%" stop-color="rgba(9,180,116,.06)"/>' +
				'  <stop offset="100%" stop-color="rgba(9,180,116,.03)"/>' +
				'</linearGradient>' +
				'<filter id="flx-ds"><feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,.45)"/></filter>' +
				'<linearGradient id="flx-sm" x1="0" y1="0" x2="1" y2="0">' +
				'  <stop offset="0%" stop-color="rgba(9,180,116,0)"/>' +
				'  <stop offset="50%" stop-color="rgba(9,180,116,.08)"/>' +
				'  <stop offset="100%" stop-color="rgba(9,180,116,0)"/>' +
				'  <animateTransform attributeName="gradientTransform" type="translate" values="-1 0;2 0" dur="4s" repeatCount="indefinite"/>' +
				'</linearGradient>' +
				'</defs>' +
				'<rect x="2" y="2" width="996" height="596" rx="'+R+'" fill="url(#flx-bg)" filter="url(#flx-ds)"/>' +
				'<rect x="2" y="2" width="996" height="596" rx="'+R+'" fill="url(#flx-sh)"/>' +
				'<rect x="'+B+'" y="'+B+'" width="'+(1000-B*2)+'" height="'+(600-B*2-16)+'" rx="8" fill="none"/>' +
				'<rect x="2" y="2" width="996" height="596" rx="'+R+'" fill="url(#flx-sm)"/>' +
				'<rect x="'+(B-1)+'" y="'+(B-1)+'" width="'+(1000-B*2+2)+'" height="'+(600-B*2-14)+'" rx="9" fill="none" stroke="rgba(9,180,116,.12)" stroke-width="1"/>' +
				'<circle cx="'+(B+10)+'" cy="'+(B+10)+'" r="2" fill="rgba(9,180,116,.2)"><animate attributeName="opacity" values=".2;.6;.2" dur="3s" repeatCount="indefinite"/></circle>' +
				'<circle cx="'+(1000-B-10)+'" cy="'+(B+10)+'" r="2" fill="rgba(9,180,116,.2)"><animate attributeName="opacity" values=".2;.6;.2" dur="3s" begin="1.5s" repeatCount="indefinite"/></circle>';
		},

		/* ══ Particles ══ */
		_seedParticles: function () {
			this._particles = [];
			for (var i = 0; i < PARTICLE_N; i++) {
				this._particles.push({
					x: Math.random() * 800, y: Math.random() * 500,
					r: Math.random() * 2 + .5,
					dx: (Math.random() - .5) * .3, dy: (Math.random() - .5) * .2,
					o: Math.random() * .3 + .1, ph: Math.random() * Math.PI * 2
				});
			}
		},

		_startParticles: function () {
			if (this._raf) return;
			var self = this, t = 0;
			(function tick() {
				if (!self._active) { self._raf = null; return; }
				self._raf = requestAnimationFrame(tick);
				var cv = self._canvas, ctx = self._ctx;
				if (!cv || !ctx) return;
				var w = cv.parentElement ? cv.parentElement.offsetWidth  : 800;
				var h = cv.parentElement ? cv.parentElement.offsetHeight : 500;
				if (cv.width !== w) cv.width = w;
				if (cv.height !== h) cv.height = h;
				ctx.clearRect(0, 0, w, h);
				t += .008;
				for (var i = 0; i < self._particles.length; i++) {
					var p = self._particles[i];
					p.x += p.dx; p.y += p.dy;
					if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
					if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
					var a = Math.max(0, p.o + Math.sin(t * 2 + p.ph) * .12);
					ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
					ctx.fillStyle = "rgba(9,180,116," + a.toFixed(3) + ")"; ctx.fill();
					for (var j = i + 1; j < self._particles.length; j++) {
						var q = self._particles[j], d = Math.hypot(p.x - q.x, p.y - q.y);
						if (d < 120) {
							ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
							ctx.strokeStyle = "rgba(9,180,116," + ((1 - d / 120) * .06).toFixed(3) + ")";
							ctx.lineWidth = .5; ctx.stroke();
						}
					}
				}
			})();
		}
	};

	/* ── Boot ── */
	function boot() {
		if (typeof frappe === "undefined" || !frappe.get_route) {
			setTimeout(boot, 400); return;
		}
		flux.desktop.init();
	}
	if (document.readyState === "loading")
		document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 1000); });
	else
		setTimeout(boot, 1000);

	$(document).on("toolbar_setup", function () { setTimeout(boot, 500); });
	$(document).on("page-change",   function () {
		if (flux.desktop._ready) flux.desktop._check();
	});
})();
