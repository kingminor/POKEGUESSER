const CACHE_NAME = 'pokeguesser-cache-1.2';
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
const MAX_CACHE_AGE = 14 * 24 * 60 * 60 * 1000; // 2 weeks

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

  // Network-first for HTML/CSS/JS
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

  // Cache-first for images/media with expiration
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      let cached = await cache.match(request);

      // Check expiration stored in a custom map (or fallback to stale if none)
      const cacheKey = request.url + '-sw-cache-date';
      const stored = await cache.match(cacheKey);
      let isStale = false;

      if (cached && stored) {
        const storedTime = parseInt(await stored.text(), 10);
        if (Date.now() - storedTime > MAX_CACHE_AGE) {
          isStale = true;
          console.log('[Service Worker] Cached file expired:', request.url);
        }
      }

      if (cached && !isStale) return cached;

      // Fetch fresh version
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok && request.method === 'GET' && url.origin === self.location.origin) {
          cache.put(request, networkResponse.clone());
          cache.put(cacheKey, new Response(Date.now().toString()));
        }
        return networkResponse;
      } catch (err) {
        console.warn('[Service Worker] Fetch failed, using cache/fallback:', err);
        if (cached) return cached;
        if (request.destination === 'image') {
          const fallback = await cache.match(FALLBACK_IMAGE);
          if (fallback) return fallback;
        }
        return new Response('Resource not found or offline', { status: 404 });
      }
    })
  );
});
