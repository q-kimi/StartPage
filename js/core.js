const q=$("#q"),eng=$("#eng");
let sel=-1,edit=false,tt,toastT;
const rows=()=>[...document.querySelectorAll("#list section:not(.col) .r:not(.dim)")];
const go=u=>S.tab?window.open(u,"_blank","noopener"):(location.href=u);
const nl=g=>g.l.filter(l=>!l[2]&&l[1]!=="---").length;
const live=()=>D.filter(g=>!g.z).map(g=>({...g,l:g.l.filter(l=>!l[2])}));
const persist=()=>store("sp",live());
const saveD=()=>{persist();render()};

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

