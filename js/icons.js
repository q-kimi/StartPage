const FI={
 "gemini.google.com":"https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg",
 "web.whatsapp.com":"https://www.google.com/s2/favicons?domain=whatsapp.com&sz=64",
 "mail.google.com":"https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
 "drive.google.com":"https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
 "calendar.google.com":"https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_31.ico",
 "docs.google.com":"https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico"
};
let bust="";
const s2=d=>"https://www.google.com/s2/favicons?domain="+encodeURIComponent(d)+"&sz=64"+bust;
// icone du site lui-meme d'abord (une 404 ou du HTML declenche onerror), puis Google en dernier recours
const chain=d=>FI[d]?[FI[d]]:d.split(".").length<3?[s2(d)]:["/favicon.ico","/icon.svg","/favicon.svg","/apple-touch-icon.png"].map(p=>"https://"+d+p+(bust?"?"+bust.slice(1):"")).concat(s2(d),d.split(".").length>2?[s2(d.split(".").slice(-2).join("."))]:[]);
const fd=d=>got(d)||chain(d)[0];
const fav=u=>fd(new URL(u).hostname);
// icones: sonde toutes les sources en parallele, garde la premiere dans l'ordre de priorite, memorise par hote
const PH="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
let IC=load("spi",{}),MEM=load("spm",{});const pend={};
const got=d=>FI[d]||IC[d]||(MEM[d]&&Date.now()-MEM[d][1]<6048e5?MEM[d][0]:"");
const ia=l=>{if(l[3])return`src="${esc(l[3])}" data-n="-1"`;const h=new URL(l[1]).hostname;HU[h]=l[1];const u=got(h);return u?`src="${esc(u)}"`:`src="${PH}" class="ld"`};
const setIc=(d,u)=>document.querySelectorAll('img.ld[data-d="'+CSS.escape(d)+'"]').forEach(i=>{i.classList.remove("ld");i.dataset.n=99;if(u){i.src=u;i.classList.add("ic-in")}else i.style.visibility="hidden"});
const pq=[];let run=0;
const pump=()=>{while(run<6&&pq.length){run++;find(pq.shift()).then(()=>{run--;pump()})}};
function probe(d){if(pend[d])return;pend[d]=1;pq.push(d);pump()}
const HU={};
const lt=(u,ms)=>new Promise(res=>{const m=new Image(),t=setTimeout(()=>res(0),ms);m.onload=()=>{clearTimeout(t);res(1)};m.onerror=()=>{clearTimeout(t);res(0)};m.src=u});
// lit les <link rel=icon> de la page si le site autorise le CORS (sinon echec silencieux)
const hi=u=>fetch(u.split("#")[0],{signal:AbortSignal.timeout(4000)}).then(async r=>{
  const l=[...new DOMParser().parseFromString(await r.text(),"text/html").querySelectorAll('link[rel~="icon"]')];
  const x=l.find(k=>/32/.test(k.getAttribute("sizes")||""))||l[0];
  return x?new URL(x.getAttribute("href"),r.url).href:"";
}).catch(()=>"");
async function find(d){
  const c=chain(d),ps=c.map(u=>lt(u,u.includes("/s2/")?8000:3000).then(o=>o?u:""));
  if(c.length>1&&HU[d])ps.unshift(hi(HU[d]).then(u=>u?lt(u,3000).then(o=>o?u:""):""));
  let w="";for(const p of ps)if(w=await p)break;
  delete pend[d];
  if(!w)return setIc(d,"");
  // Google (generique possible): memorise 7 jours seulement, le site peut ajouter son icone
  if(w.includes("/s2/favicons")){MEM[d]=[w,Date.now()];store("spm",MEM)}else{IC[d]=w;store("spi",IC)}
  setIc(d,w);
}
const warm=()=>document.querySelectorAll("img.ld[data-d]").forEach(i=>probe(i.dataset.d));
