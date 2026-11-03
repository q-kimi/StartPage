const q=$("#q"),eng=$("#eng");
let sel=-1,edit=false,tt,toastT;
const rows=()=>[...document.querySelectorAll("#list section:not(.col) .r:not(.dim)")];
const go=u=>S.tab?window.open(u,"_blank","noopener"):(location.href=u);
const hr=r=>r.querySelector("a").href;
const nl=g=>g.l.filter(l=>!l.x&&!l.sep).length;
const live=()=>D.filter(g=>!g.z).map(g=>({n:g.n,c:g.c,i:g.i,l:g.l.filter(l=>!l.x)}));
const persist=()=>{if(!store("sp",live()))toast(FULL)};
// historique: instantanes de D (50 max), Ctrl+Z / Ctrl+Maj+Z
const H={u:[],r:[]};let snap=JSON.stringify(D);
const saveD=()=>{const n=JSON.stringify(D);if(n!==snap){H.u.push(snap);if(H.u.length>50)H.u.shift();H.r=[];snap=n}persist();render()};
const hist=(from,to,none,ok)=>{if(!from.length)return toast(none);to.push(snap);snap=from.pop();D=JSON.parse(snap);persist();render();toast(ok)};
const undo=()=>hist(H.u,H.r,"Rien à annuler","Annulé");
const redo=()=>hist(H.r,H.u,"Rien à rétablir","Rétabli");

function toast(m){
  const t=$("#toast");t.textContent=m;t.classList.add("show");
  clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),2400);
}

let busy=0;
function out(el,fn){
  if(busy)return;
  if(!S.anim||!el)return fn();
  busy=1;el.classList.add("out");
  setTimeout(()=>{busy=0;fn()},340);
}

