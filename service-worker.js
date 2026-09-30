const CACHE = 'electronic-circuits-notes-v4';
const ASSETS = [
  './', './index.html', './style.css', './enhancements.css', './app.js',
  './mos-model.js', './mos-lab.js', './manifest.webmanifest',
  './icon-192.png', './icon-512.png',
  './vendor/katex/katex.min.css', './vendor/katex/katex.min.js',
  './vendor/katex/LICENSE.txt', './assets/LICENSE-schemdraw.txt',
  './assets/diagrams/cmos-inverter.svg', './assets/diagrams/divider-bias.svg',
  './assets/diagrams/current-mirror.svg', './assets/diagrams/led-switch.svg',
];
const FONT_NAMES = [
  'AMS-Regular', 'Caligraphic-Bold', 'Caligraphic-Regular',
  'Fraktur-Bold', 'Fraktur-Regular', 'Main-Bold', 'Main-BoldItalic',
  'Main-Italic', 'Main-Regular', 'Math-BoldItalic', 'Math-Italic',
  'SansSerif-Bold', 'SansSerif-Italic', 'SansSerif-Regular',
  'Script-Regular', 'Size1-Regular', 'Size2-Regular', 'Size3-Regular',
  'Size4-Regular', 'Typewriter-Regular',
];
const FONTS = FONT_NAMES.map(name => `./vendor/katex/fonts/KaTeX_${name}.woff2`);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll([...ASSETS, ...FONTS])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(() => caches.match(event.request)));
});
