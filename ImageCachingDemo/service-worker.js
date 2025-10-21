const CACHE_NAME = 'pokemon-cache-v1.1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/main.js'
];

// Install: cache main files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching main files...');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Deleting old cache:', key);
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim(); // Take control immediately
});

// Fetch: serve cached files first, fallback to network, and dynamically cache new requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith('http')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse); // fallback to cached response on network fail
        return cachedResponse || fetchPromise;
      })
    )
  );
});
