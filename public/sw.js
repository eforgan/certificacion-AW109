const CACHE = 'fstd-cert-v2';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.add('/')).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      fetch(e.request)
        .then(res => { cache.put(e.request, res.clone()); return res; })
        .catch(() => cache.match(e.request))
    )
  );
});
