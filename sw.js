// Install the ServiceWorker
self.addEventListener('install', function(event) {
  event.waitUntil(

    // Open a cache
    caches.open('v1').then(function(cache) {

      // Define what we want to cache
      return cache.addAll([
        '/',
        'index.html',
        'inline.881bc3092c345eebbaf2.bundle.js',
        'main.bf5920bf637615a444af.bundle.js',
        'polyfills.f20484b2fa4642e0dca8.bundle.js',
        'styles.969523354e51e0f22d6c.bundle.css',
        'MaterialIcons-Regular.012cf6a10129e2275d79.woff',
        'MaterialIcons-Regular.570eb83859dc23dd0eec.woff2',
        'MaterialIcons-Regular.a37b0c01c0baf1888ca8.ttf',
        'MaterialIcons-Regular.e79bfd88537def476913.eot',
        'favicon.ico',
        'manifest.json',
        'assets/icons/icon-72x72.png',
        'assets/icons/icon-128x128.png',
        'assets/icons/icon-152x152.png',
        'assets/icons/icon-512x512.png'
      ]);
    })
  );
});


// Use ServiceWorker (or not) to fetch data
self.addEventListener('fetch', function(event) {

  event.respondWith(

    // Look for something in the cache that matches the request
    caches.match(event.request).then(function(response) {

      // If we find something, return it
      // Otherwise, use the network instead
      return response || fetch(event.request);
    })
  );
});