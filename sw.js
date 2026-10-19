const CACHE_NAME = "high-table-group-v6";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./assets/css/style.css",
  "./assets/js/i18n.js",
  "./assets/js/main.js",
  "./assets/og-cover.png",
  "./assets/brand/logo-round.png",
  "./assets/brand/research-window.jpg",
  "./assets/brand/favicon-32.png",
  "./assets/brand/favicon-64.png",
  "./assets/brand/apple-touch-icon.png",
  "./assets/brand/icon-192.png",
  "./assets/brand/icon-512.png",
  "./assets/previews/lab.png",
  "./assets/previews/recruitment.png",
  "./assets/previews/grammar.png",
  "./assets/previews/research.png",
  "./assets/previews/lab-portrait.png",
  "./assets/previews/recruitment-portrait.png",
  "./assets/previews/grammar-portrait.png",
  "./assets/previews/research-portrait.png",
  "./assets/fonts/cormorant-garamond-latin-400-normal.woff2",
  "./assets/fonts/cormorant-garamond-latin-400-italic.woff2",
  "./assets/fonts/cormorant-garamond-latin-600-normal.woff2",
  "./assets/fonts/cormorant-garamond-latin-700-normal.woff2",
  "./assets/fonts/noto-serif-sc-subset.woff2",
  "./assets/fonts/noto-sans-sc-subset.woff2",
  "./assets/fonts/inter-latin-400-normal.woff2",
  "./assets/fonts/inter-latin-500-normal.woff2",
  "./assets/fonts/inter-latin-600-normal.woff2",
  "./assets/fonts/ibm-plex-mono-latin-400-normal.woff2",
  "./assets/fonts/ibm-plex-mono-latin-500-normal.woff2",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).then(function (response) {
      if (!response || response.status !== 200 || response.type === "opaque") {
        return response;
      }

      const copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) {
        cache.put(event.request, copy);
      });

      return response;
    }).catch(function () {
      return caches.match(event.request).then(function (cached) {
        if (cached) return cached;
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      });
    })
  );
});
