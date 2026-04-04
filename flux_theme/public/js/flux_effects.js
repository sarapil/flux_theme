// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme - Visual Effects
 * Stars twinkle, water waves, window lights, ambient particles
 */

(function() {
    'use strict';

    window.flux = window.flux || {};

    /**
     * Visual Effects Manager
     */
    flux.effects = {
        config: {
            stars: {
                count: 80,
                tabletCount: 50,
                mobileCount: 25,
                minSize: 0.3,
                maxSize: 2.0,
                colors: ['#FFFFFF', '#09B474', '#3DD99A'],
                twinkleSpeed: { min: 6000, max: 16000 },
                shimmerChance: 0.4 // only 40% of canvas stars shimmer
            },
            particles: {
                count: 20,
                color: '#09B474',
                maxSize: 3
            },
            windows: {
                count: 30,
                color: '#09B474',
                minDuration: 2000,
                maxDuration: 8000
            }
        },
        
        activeAnimations: [],
        canvas: null,
        ctx: null,

        /**
         * Initialize all effects
         */
        init: function(container) {
            if (flux.prefersReducedMotion && flux.prefersReducedMotion()) {
                return;
            }

            this.container = container || document.getElementById('flux-skyline-container');
            if (!this.container) return;

            this.createCanvas();
            this.initStars();
            this.startAnimation();
        },

        /**
         * Create canvas for effects
         */
        createCanvas: function() {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'flux-effects-canvas';
            this.canvas.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;';
            this.container.appendChild(this.canvas);
            
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            
            window.addEventListener('resize', this.resizeCanvas.bind(this));
        },

        /**
         * Resize canvas to container size
         */
        resizeCanvas: function() {
            if (!this.canvas) return;
            
            const rect = this.container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            
            // Reinitialize stars on resize
            this.initStars();
        },

        /**
         * Initialize stars
         */
        initStars: function() {
            const vw = window.innerWidth;
            const count = vw < 480 ? this.config.stars.mobileCount :
                          vw < 1024 ? this.config.stars.tabletCount :
                          this.config.stars.count;
            
            this.stars = [];
            
            // Only create stars in the sky area (top 60% of canvas)
            const skyHeight = this.canvas.height * 0.6;
            
            for (let i = 0; i < count; i++) {
                const doesShimmer = Math.random() < this.config.stars.shimmerChance;
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * skyHeight,
                    size: this.config.stars.minSize + Math.random() * (this.config.stars.maxSize - this.config.stars.minSize),
                    color: this.config.stars.colors[Math.floor(Math.random() * this.config.stars.colors.length)],
                    opacity: 0.15 + Math.random() * 0.6,
                    twinkleSpeed: this.config.stars.twinkleSpeed.min + Math.random() * (this.config.stars.twinkleSpeed.max - this.config.stars.twinkleSpeed.min),
                    twinklePhase: Math.random() * Math.PI * 2,
                    doesShimmer: doesShimmer // only some stars shimmer
                });
            }
        },

        /**
         * Initialize floating particles (for login page)
         */
        initParticles: function() {
            this.particles = [];
            
            for (let i = 0; i < this.config.particles.count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: 1 + Math.random() * this.config.particles.maxSize,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: -0.1 - Math.random() * 0.2,
                    opacity: 0.1 + Math.random() * 0.3
                });
            }
        },

        /**
         * Start animation loop
         */
        startAnimation: function() {
            const self = this;
            let lastTime = 0;
            
            function animate(timestamp) {
                const deltaTime = timestamp - lastTime;
                lastTime = timestamp;
                
                self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
                
                // Draw stars
                self.drawStars(timestamp);
                
                // Draw particles if initialized
                if (self.particles && self.particles.length > 0) {
                    self.drawParticles(deltaTime);
                }
                
                // Occasional shooting star
                if (Math.random() < 0.0002) { // ~5-8 per minute at 60fps
                    self.createShootingStar();
                }
                
                // Draw shooting stars
                self.drawShootingStars(deltaTime);
                
                self.animationFrame = requestAnimationFrame(animate);
            }
            
            this.animationFrame = requestAnimationFrame(animate);
        },

        /**
         * Draw stars with twinkling effect
         */
        drawStars: function(timestamp) {
            const ctx = this.ctx;
            
            this.stars.forEach(function(star) {
                var opacity;
                if (star.doesShimmer) {
                    // Realistic slow shimmer — gentle opacity variation only
                    const twinkle = Math.sin((timestamp / star.twinkleSpeed) + star.twinklePhase);
                    opacity = star.opacity * (0.5 + (twinkle + 1) * 0.25);
                } else {
                    // Static star — constant brightness
                    opacity = star.opacity;
                }
                
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = star.color;
                ctx.globalAlpha = opacity;
                ctx.fill();
            });
            
            ctx.globalAlpha = 1;
        },

        /**
         * Draw floating green particles
         */
        drawParticles: function(deltaTime) {
            const ctx = this.ctx;
            const self = this;
            
            this.particles.forEach(function(particle) {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Wrap around
                if (particle.y < 0) {
                    particle.y = self.canvas.height;
                    particle.x = Math.random() * self.canvas.width;
                }
                if (particle.x < 0) particle.x = self.canvas.width;
                if (particle.x > self.canvas.width) particle.x = 0;
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = self.config.particles.color;
                ctx.globalAlpha = particle.opacity;
                ctx.fill();
            });
            
            ctx.globalAlpha = 1;
        },

        /**
         * Shooting stars array
         */
        shootingStars: [],

        /**
         * Create a shooting star
         */
        createShootingStar: function() {
            const startX = Math.random() * this.canvas.width * 0.7;
            const startY = Math.random() * this.canvas.height * 0.3;
            
            this.shootingStars.push({
                x: startX,
                y: startY,
                length: 50 + Math.random() * 100,
                speed: 8 + Math.random() * 4,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
                opacity: 1,
                trail: []
            });
        },

        /**
         * Draw shooting stars
         */
        drawShootingStars: function(deltaTime) {
            const ctx = this.ctx;
            const self = this;
            
            this.shootingStars = this.shootingStars.filter(function(star) {
                // Update position
                star.x += Math.cos(star.angle) * star.speed;
                star.y += Math.sin(star.angle) * star.speed;
                star.opacity -= 0.02;
                
                // Draw
                if (star.opacity > 0) {
                    const gradient = ctx.createLinearGradient(
                        star.x, star.y,
                        star.x - Math.cos(star.angle) * star.length,
                        star.y - Math.sin(star.angle) * star.length
                    );
                    gradient.addColorStop(0, 'rgba(255, 255, 255, ' + star.opacity + ')');
                    gradient.addColorStop(0.3, 'rgba(9, 180, 116, ' + (star.opacity * 0.5) + ')');
                    gradient.addColorStop(1, 'rgba(9, 180, 116, 0)');
                    
                    ctx.beginPath();
                    ctx.moveTo(star.x, star.y);
                    ctx.lineTo(
                        star.x - Math.cos(star.angle) * star.length,
                        star.y - Math.sin(star.angle) * star.length
                    );
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    return true;
                }
                return false;
            });
        },

        /**
         * Create window light effects on buildings
         * Called with a reference to building positions
         */
        initWindowLights: function(buildingPositions) {
            this.windowLights = [];
            const self = this;
            
            // Create initial window lights
            for (let i = 0; i < this.config.windows.count; i++) {
                this.addWindowLight(buildingPositions);
            }
            
            // Periodically add/remove lights
            setInterval(function() {
                if (self.windowLights.length < self.config.windows.count) {
                    self.addWindowLight(buildingPositions);
                }
            }, 500);
        },

        /**
         * Add a window light
         */
        addWindowLight: function(buildingPositions) {
            if (!buildingPositions || buildingPositions.length === 0) return;
            
            const building = buildingPositions[Math.floor(Math.random() * buildingPositions.length)];
            
            this.windowLights.push({
                x: building.x + Math.random() * building.width,
                y: building.y + Math.random() * building.height,
                size: 2 + Math.random() * 2,
                opacity: 0,
                targetOpacity: 0.08 + Math.random() * 0.07,
                phase: 'fadeIn',
                duration: this.config.windows.minDuration + Math.random() * (this.config.windows.maxDuration - this.config.windows.minDuration),
                elapsed: 0
            });
        },

        /**
         * Stop all effects
         */
        stop: function() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
            }
            
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            
            this.stars = [];
            this.particles = [];
            this.shootingStars = [];
        },

        /**
         * Enable green particle effect (for login page)
         */
        enableGoldDust: function() {
            this.initParticles();
        }
    };

    // Initialize effects when skyline is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Feature gate: check if particles are disabled in FLUX Settings
        if (flux.config && flux.config.features && !flux.config.features.particles) {
            return;
        }
        // Only initialize on login pages or when explicitly called
        if (flux.isLoginPage && flux.isLoginPage()) {
            setTimeout(function() {
                const container = document.getElementById('flux-skyline-container');
                if (container) {
                    flux.effects.init(container);
                    flux.effects.enableGoldDust();
                }
            }, 100);
        }
    });

})();
