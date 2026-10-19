const CACHE_NAME = 'baby-game-v3';
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

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

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
