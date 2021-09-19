const staticCacheName = 'click-counter-v1';
const dynamicCacheName = 'dynamic-cache-v1';
const assets = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/icons/android-chrome-192x192.png',
  '/assets/icons/android-chrome-512x512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/favicon-16x16.png',
  '/assets/icons/favicon-32x32.png',
  '/assets/icons/favicon.png',
  '/assets/js/main.js',
  '/manifest.json',
  '/pages/fallback.html'
];

const limitCacheSize = async (cacheName, size) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > size) {
    await cache.delete(keys[0]);
    limitCacheSize(cacheName, size);
  }

  return;
};

const cacheResources = async () => {
  try {
    const cache = await caches.open(staticCacheName);
    return cache.addAll(assets);
  } catch (error) {
    console.log(error);
  }
};

const refreshCaches = async () => {
  try {
    const keys = await caches.keys();
    const oldKeys = keys.filter(
      key => key !== staticCacheName && key !== dynamicCacheName
    );
    return oldKeys.map(key => caches.delete(key));
  } catch (error) {
    console.log(error);
  }
};

const sendCachedAsset = async request => {
  try {
    const cacheRes = await caches.match(request);
    if (cacheRes) return cacheRes;

    const fetchRes = await fetch(request);
    const cache = await caches.open(dynamicCacheName);
    await cache.put(fetchRes.url, fetchRes.clone());
    limitCacheSize(dynamicCacheName, 15);
    return fetchRes;
  } catch (error) {
    if (request.url.indexOf('.html') > -1) {
      return caches.match('/pages/fallback.html');
    }
  }
};

self.addEventListener('install', evt => {
  evt.waitUntil(cacheResources());
});

self.addEventListener('activate', async evt => {
  evt.waitUntil(refreshCaches());
});

self.addEventListener('fetch', evt => {
  evt.respondWith(sendCachedAsset(evt.request));
});
