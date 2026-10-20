// Service worker: aplikasi tetap bisa dibuka tanpa internet.
// Naikkan VERSION setiap kali file aplikasi diubah agar HP mengambil versi terbaru.
const VERSION = 'ruma-shalat-v10';
const SHELL = [
  './', 'css/app.css', 'manifest.webmanifest',
  'js/app.js', 'js/content.js', 'js/quran.js', 'js/figure.js', 'js/praytimes.js', 'js/store.js', 'js/audio.js', 'js/zip.js', 'js/naskah.js',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'audio/daftar.json',
];

self.addEventListener('install', e => {
  // cache: 'reload' agar tidak terambil dari cache HTTP lama
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, {cache: 'reload'})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'ruma-fonts').map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: simpan sekali, pakai terus
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open('ruma-fonts').then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }));
    return;
  }

  if (url.origin !== location.origin) return; // murattal dll. langsung dari jaringan
  if (req.headers.has('range')) return;       // permintaan media sebagian: biarkan browser yang menangani

  // suara rekaman: ambil dari cache bila sudah pernah diunduh
  if (/\/audio\/[^/]+\.(mp3|m4a)$/.test(url.pathname)) {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    }));
    return;
  }

  // file aplikasi: tampilkan dari cache, perbarui di belakang layar
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req, {ignoreSearch: true});
    const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || (req.mode === 'navigate' ? c.match('./') : Response.error());
  }));
});
