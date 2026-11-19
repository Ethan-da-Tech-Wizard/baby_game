// ==============================================================================
// Program: sw.js
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 18, 2026
// Purpose: Progressive Web App (PWA) Service Worker lifecycle controller.
//          Intercepts network fetch events, manages cache storage for zero-dependency
//          offline execution, and coordinates cache version invalidation upon updates.
// ============================================================================== 
// Cache name doubles as the version: bump the suffix whenever any cached asset changes so the
// activate handler discards the old cache and clients re-download everything.
const CACHE_NAME = 'baby-game-v3';
// App shell precached at install so the game works fully offline (code, styles, manifest, icon, the
// Dad-voice manifest and the Pokemon sprites that the key map references).
const ASSETS = [
  './',
  'index.html',
  'studio.html',
  'styles.css',
  'audio.js',
  'anime.js',
  'effects.js',
  'keys.js',
  'manifest.json',
  'icon.svg',
  'audio/dad/manifest.json',
  'images/pokemon/pikachu.png',
  'images/pokemon/charizard.png',
  'images/pokemon/blastoise.png',
  'images/pokemon/venusaur.png',
  'images/pokemon/kangaskhan.png',
  'images/pokemon/nidoking.png',
  'images/pokemon/aerodactyl.png',
  'images/pokemon/togepi.png',
  'images/pokemon/zigzagoon.png',
  'images/pokemon/starly.png'
];

// STEP-BY-STEP EDUCATIONAL GUIDE: SERVICE WORKER LIFECYCLE EVENTS
// 1. Install Event: Pre-caches critical runtime assets into CacheStorage.
// 2. Activate Event: Purges stale cache versions to maintain consistency.
// 3. Fetch Event: Implements Cache-First fallback strategy for instant offline responsiveness.
// Install: open the versioned cache and fetch every ASSET. If any request fails, addAll rejects and
// the worker does not install (the old worker keeps serving). skipWaiting makes the new worker
// activate immediately instead of waiting for all tabs to close.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: delete every cache whose name is not the current CACHE_NAME, then claim() so already-open
// pages are controlled by this worker without a reload.
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first. Serve from cache when present; otherwise go to the network and store a clone of
// successful (HTTP 200) responses for next time. Non-200 responses are passed through uncached.
// The response must be cloned because a body can only be read once.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(e.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });
        return response;
      // Offline and not cached: cachedResponse is undefined here, so the request simply fails.
      }).catch(() => cachedResponse);
    })
  );
});
