/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { NetworkFirst, NetworkOnly } from 'workbox-strategies'
import { registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope

clientsClaim()

// App shell (HTML, CSS, JS)
registerRoute(
  ({ request }) =>
    request.destination === 'document' ||
    request.destination === 'script' ||
    request.destination === 'style',
  new NetworkFirst({
    cacheName: 'app-shell',
    networkTimeoutSeconds: 10,
  })
)

// API calls
registerRoute(({ url }) => url.pathname.startsWith('/api/'), new NetworkOnly())

// Static assets (images, fonts)
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'font',
  new NetworkFirst({
    cacheName: 'assets',
    networkTimeoutSeconds: 10,
  })
)

// Handle auth redirects
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/') as Promise<Response>
      })
    )
  }
})
