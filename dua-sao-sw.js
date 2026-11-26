/* Ưu tiên mạng; mất mạng thì dùng bản đã lưu để màn hình nghỉ vẫn mở được */
const CACHE='dua-sao-v1';
const FILES=['dua-sao.html','dua-sao.webmanifest','dua-sao-192.png','dua-sao-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
