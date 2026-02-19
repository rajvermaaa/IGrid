/* global self, caches, fetch, Request */

const APP_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${APP_VERSION}`;
const RUNTIME_CACHE = `runtime-${APP_VERSION}`;
const PRECACHE = [
  '/',                   // for SPA
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png'
];

// Install: pre-cache shell
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => ![STATIC_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Decide if a request is same-origin
const sameOrigin = (reqUrl) => reqUrl.origin === self.location.origin;

// Do not cache mutating requests
const isMutation = (req) => ['POST','PUT','PATCH','DELETE'].includes(req.method);

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (!sameOrigin(url) || isMutation(req)) return; // let network handle

  // Treat navigations/HTML as app shell (network-first, fallback to cache then offline)
  const wantsHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (wantsHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => (await caches.match(req)) || caches.match('/offline.html'))
    );
    return;
  }

  // Cache-first for static assets
  if (['style','script','image','font'].includes(req.destination)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(STATIC_CACHE).then((c) => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  // Network-first for APIs (adjust path to your Go backend)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
