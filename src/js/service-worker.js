const CACHE_NAME = 'pokeguesser-cache-1.0';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/js/index.js',
  '/guesser.html',
  '/js/guesser.js',
  '/css/variables.css',
  '/css/index.css',
  '/css/guesser.css',
  '/media/404-not-found.jpg'
];

const FALLBACK_IMAGE = '/media/404-not-found.jpg';

// Install: cache main files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
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

// Fetch: try cache first, then network, and cache the new response
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached version immediately
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request).then(networkResponse => {
        // Only cache successful responses (status 200, same-origin)
        if (
          networkResponse && 
          networkResponse.status === 200 && 
          event.request.method === 'GET' && 
          event.request.url.startsWith(self.location.origin)
        ) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(async err => {
        console.error('[Service Worker] Fetch failed; returning offline response:', err);

        // Serve fallback image if this is an image request
        if (event.request.destination === 'image') {
          const cache = await caches.open(CACHE_NAME);
          const fallback = await cache.match(FALLBACK_IMAGE);
          if (fallback) {
            return fallback;
          }
        }

        // Otherwise return a generic 404 text response
        return new Response('Resource not found or offline', { status: 404 });
      });
    })
  );
});
