const CACHE_NAME = 'pokeguesser-cache-1.1';
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
const MAX_CACHE_AGE = 14 * 24 * 60 * 60 * 1000; // 2 weeks in ms

// Install: cache core files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Deleting old cache:', key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

// Fetch: smart caching strategy
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  const isHTML = url.pathname.endsWith('.html');
  const isCSS = url.pathname.endsWith('.css');
  const isJS = url.pathname.endsWith('.js');

  // Network-first strategy for HTML/CSS/JS
  if (isHTML || isCSS || isJS) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first with expiration for all other requests
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        const cachedDateHeader = cachedResponse.headers.get('sw-cache-date');
        if (cachedDateHeader) {
          const cachedTime = new Date(cachedDateHeader).getTime();
          const age = Date.now() - cachedTime;
          if (age < MAX_CACHE_AGE) {
            return cachedResponse;
          } else {
            console.log('[Service Worker] Cached file expired, reloading:', request.url);
          }
        } else {
          console.log('[Service Worker] No cache date, treating as stale:', request.url);
        }
      }

      // Fetch a fresh version
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok && request.method === 'GET' && url.origin === self.location.origin) {
          // Clone response and attach a date header for cache expiry tracking
          const cloned = networkResponse.clone();
          const modified = new Response(cloned.body, {
            headers: new Headers(cloned.headers)
          });
          modified.headers.set('sw-cache-date', new Date().toISOString());
          cache.put(request, modified.clone());
          return modified;
        }
        return networkResponse;
      } catch (err) {
        console.error('[Service Worker] Fetch failed; returning cache/fallback:', err);
        if (cachedResponse) return cachedResponse;
        if (request.destination === 'image') {
          const fallback = await cache.match(FALLBACK_IMAGE);
          if (fallback) return fallback;
        }
        return new Response('Resource not found or offline', { status: 404 });
      }
    })
  );
});
