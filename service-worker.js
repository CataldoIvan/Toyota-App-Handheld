const CACHE_NAME = 'handheld-toyota-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './check-tags.html',
  './log.html',
  './validate-change-tag.html',
  './toyotaicon.svg',
  './toyota.ico'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forzar que el nuevo SW se active inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Eliminar los cachés antiguos
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Tomar control inmediatamente
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
