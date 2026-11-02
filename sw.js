const C="icons-v1",SH="shell-v1",MAXI=300;
const own=u=>/^(www\.google\.com\/s2\/favicons|ssl\.gstatic\.com\/|calendar\.google\.com\/googlecalendar\/images\/favicons)/.test(u.host+u.pathname);
// borne le cache d'icones: on supprime les plus anciennes entrees
const trim=async c=>{const k=await c.keys();await Promise.all(k.slice(0,Math.max(0,k.length-MAXI)).map(r=>c.delete(r)))};
self.oninstall=e=>e.waitUntil(
  caches.open(SH).then(c=>c.addAll(["./","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png"])).catch(()=>{}).then(()=>self.skipWaiting())
);
self.onactivate=e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==SH).map(x=>caches.delete(x)))).then(()=>clients.claim())
);
self.onfetch=e=>{
  const r=e.request;
  if(r.method!=="GET")return;
  // page: reseau d'abord (toujours a jour), copie locale si hors ligne
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(res=>{
      if(res.ok){const k=res.clone();caches.open(SH).then(c=>c.put("./",k))}
      return res;
    },()=>caches.match("./").then(h=>h||Response.error())));
    return;
  }
  if(!own(new URL(r.url)))return;
  // icones: cache d'abord, rafraichi en arriere-plan
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{if(res.ok||res.type==="opaque")c.put(r,res.clone()).then(()=>trim(c));return res},()=>hit||Response.error());
    return hit||net;
  }));
};
