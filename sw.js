const CACHE_VERSION = 9;
const APP = "PokemonOffsetToPointer";
const CACHE_PREFIX = "CACHE_" + APP + "_";

const INMUTABLES = [
  // Lista de recursos inmutables
];

const SHELL = [
  // Lista de recursos shell
    "index.html",
    "images/icons/icon-144x144.png",
    "images/icons/icon-512x512.png",
    "sw.js",
    "pokemonOffsetToPointer.js",
    "manifest.json"
];

self.addEventListener('install', e => {
  console.log("Installing version " + CACHE_VERSION);
  e.waitUntil(Promise.all([
    cacheResources(CACHE_PREFIX + "INMUTABLE", INMUTABLES),
    cacheResources(CACHE_PREFIX + "SHELL", SHELL)
  ]));
});

self.addEventListener('activate', e => {
  console.log("Uninstalling version " + (CACHE_VERSION - 1));
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_PREFIX + "INMUTABLE";
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => {
      return resp || fetchAndUpdateCache(e.request);
    })
  );
});

function cacheResources(cacheName, urls) {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(urls);
  });
}

function fetchAndUpdateCache(request) {
  return fetch(request).then(response => {
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }

    const responseToCache = response.clone();

    caches.open(CACHE_PREFIX + "DINAMICO").then(cache => {
      cache.put(request, responseToCache);
    });

    return response;
  }).catch(error => {
    console.error('Fetch failed:', error);
  });
}
