var staticCacheName = 'restaurant-static';

let urlToCache = [
               "./",
                './index.html',
                './restaurant.html',
                './css/styles.css',
                './data/restaurants.json',
                './img/1.jpg',
                './img/2.jpg',
                './img/3.jpg',
                './img/4.jpg',
                './img/5.jpg',
                './img/6.jpg',
                './img/7.jpg',
                './img/8.jpg',
                './img/9.jpg',
                './img/10.jpg',
                './img/12.jpg',
                './img/17.jpg',
                './img/22.jpg',
                './img/logo.png',
                './js/main.js',
                './js/restaurant_info.js',
                './js/dbhelper.js',
];
self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            console.log(cache);
            return cache.addAll(urlToCache);

        }).catch(erroe => {
            console.log(erroe);
        })
    );
});
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('restaurant-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(caches.open(staticCacheName).then(function(cache) {
        return cache.match(event.request).then(function(response) {
            //console.log("cache request: " + event.request.url);
            var fetchPromise = fetch(event.request).then(function(networkResponse) {
                // if we got a response from the cache, update the cache
                //console.log("fetch completed: " + event.request.url, networkResponse);
                if (networkResponse) {
                    //console.debug("updated cached page: " + event.request.url, networkResponse);
                    cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            }, function (e) {
                // rejected promise - just ignore it, we're offline
                //console.log("Error in fetch()", e);
                ;
            });

            // respond from the cache, or the network
            return response || fetchPromise;
        });
    }));
});
