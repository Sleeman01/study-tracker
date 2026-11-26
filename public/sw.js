// The service worker: a small script the browser runs in the background.
// It saves the app's files on the phone, so the app opens without internet.
// Change CACHE_NAME when you want every phone to throw away its old copy.
const CACHE_NAME = 'study-tracker-v1'
const BASIC_FILES = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/fonts/recursive-latin.woff2',
  '/icons/icon-192.png',
]

// 1. Install: download and save the app's files.
// Vite gives the JS and CSS files new names on every build
// (like index-Ck7-AULl.js), so we read their names from the page.
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll(BASIC_FILES)
      const html = await (await fetch('/')).text()
      const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1])
      await cache.addAll(assets)
      await self.skipWaiting() // start working straight away
    })(),
  )
})

// 2. Activate: delete copies saved by older versions of the app.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys()
      await Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      await self.clients.claim()
    })(),
  )
})

// 3. Fetch: every time the app asks for a file.
self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  // Pages: try the internet first (to get updates), use the saved copy when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy))
          return response
        })
        .catch(() => caches.match('/')),
    )
    return
  }

  // Other files: use the saved copy if we have one, otherwise download and save it.
  event.respondWith(
    caches.match(request).then(
      (saved) =>
        saved ||
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        }),
    ),
  )
})
