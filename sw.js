const CACHE='slavevoyages-atlas-v12';
const SHELL=['./','./index.html','./manifest.webmanifest','./css/app.css','./js/idb-store.js','./js/sync.js','./js/export.js','./js/methodology.js','./js/query-worker.js','./js/app.js','./js/register-sw.js','./data/manifest.json','./data/schema.json','./data/codebook/variable-registry.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(a=>Promise.all(a.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin)return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok)caches.open(CACHE).then(x=>x.put(e.request,r.clone()));return r}).catch(()=>c)))});
