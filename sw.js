const CACHE = 'qr-scanner-v1';
const ASSETS = [
  '/shipment-qr-scanner/',
  '/shipment-qr-scanner/index.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // ZXingライブラリ等の外部リソースはネットワーク優先
  if (!e.request.url.includes('katsulon-yuga.github.io')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
