const C="icons-v1";
const own=u=>/^(www\.google\.com\/s2\/favicons|ssl\.gstatic\.com\/|calendar\.google\.com\/googlecalendar\/images\/favicons)/.test(u.host+u.pathname);
self.oninstall=()=>self.skipWaiting();
self.onactivate=e=>e.waitUntil(clients.claim());
self.onfetch=e=>{
  const r=e.request;
  if(r.method!=="GET"||!own(new URL(r.url)))return;
  // cache d'abord, rafraichi en arriere-plan
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{if(res.ok||res.type==="opaque")c.put(r,res.clone());return res},()=>hit||Response.error());
    return hit||net;
  }));
};
