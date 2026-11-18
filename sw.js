/**
 * Program: baby_game - sw.js
 * Programmer: Ethan-da-Tech-Wizard (written with Claude, an AI assistant)
 * Last Modified: 2026-11-18
 * Purpose: Service worker that pre-caches the game's files and serves them cache-first so the game keeps working offline.
 */

// Cache name; bump the version to force clients to drop the old cache.
const CACHE_NAME = 'baby-game-v3';
// Files pre-cached at install time so the game works with no network.
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

// Install: download and cache every asset, then activate immediately.
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: delete caches from older versions and take control of open pages.
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

// Fetch: answer from the cache first; otherwise go to the network and cache successful responses.
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
      }).catch(() => cachedResponse);
    })
  );
});
