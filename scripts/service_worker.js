if('serviceWorker' in navigator) {
 window.addEventListener('load', () => {
  navigator.serviceWorker.register('service_worker.js')
  .then((registration) => {
    console.log("Service Worker registration successful")
   }, (err) => {
    console.log("Registration failed")
   })
  })
}


let cache_name = 'mysite-v1'
let urls_to_cache = [
 'NewsApp.html',
 'main.css',
 'script.js',
 'https://code.jquery.com/jquery-3.4.1.min.js',
 'search.js'
]
self.addEventListener('install', (e) => {
 e.waitUntil(caches.open(cache_name).then((cache) => {
  return cache.addAll(urls_to_cache)
 }) )
})

self.addEventListener('fetch', (e) => {
 e.respondWith(caches.match(e.request).then((response) => {
  if(response)
   return response
  else
   return fetch(e.request)
 }) )
})