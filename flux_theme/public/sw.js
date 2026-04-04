// Copyright (c) 2024, Moataz M Hassan (Arkan Lab)
// Developer Website: https://arkan.it.com
// License: MIT
// For license information, please see license.txt

/**
 * FLUX Theme — Service Worker
 * Minimal offline caching for PWA support
 */
var CACHE_NAME = 'flux-v3';
var PRECACHE_URLS = [
    '/desk',
    '/assets/flux_theme/css/flux.css'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(PRECACHE_URLS);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== CACHE_NAME; })
                    .map(function(k) { return caches.delete(k); })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function(event) {
    // Skip API calls
    if (event.request.url.includes('/api/')) return;

    // Skip /flux website pages - let them load normally without SW interference
    if (event.request.url.includes('/flux')) return;

    // Skip navigation requests to non-app pages (website/portal pages)
    if (event.request.mode === 'navigate' && !event.request.url.includes('/desk')) return;

    event.respondWith(
        fetch(event.request).then(function(response) {
            // Cache successful GET responses
            if (response.ok && event.request.method === 'GET') {
                var clone = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, clone);
                });
            }
            return response;
        }).catch(function() {
            return caches.match(event.request);
        })
    );
});
