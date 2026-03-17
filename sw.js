const CACHE_NAME = 'heat-companion-v1.4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './locales/es.js',
  './locales/en.js',
  './js/i18n.js',
  './js/players.js',
  './js/championship.js',
  './js/circuits.js',
  './js/dashboard.js',
  './js/manual.js',
  './js/system.js',
  './data/countries.js',
  './data/meta.js',
  './data/circuits.js',
  './data/weather.js',
  './data/game-basics.js',
  './data/expansions.js',
  './data/upgrades.js',
  './data/sponsors.js',
  './data/points.js',
  './data/events.js',
  './data/championships.js'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
