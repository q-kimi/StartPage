/* favoris */
const recSave=(n,u,d,c)=>{
  const a=load("spr",[]).filter(x=>Array.isArray(x)&&!(x[0]===n&&x[1]===u));
  a.unshift([n,u,d,c?1:0]);store("spr",a.slice(0,5));
};
function recAdd(n,u,d,c){recSave(n,u,d,c);recRender()}
function recRender(){
  const a=load("spr",[]).filter(x=>Array.isArray(x)&&ok(x[1])&&x[2]).slice(0,5),T=S.tab?' target="_blank" rel="noopener"':"";
  $("#rec").hidden=!a.length;
  $("#rec").innerHTML=a.length?"<span>Recherche récente :</span>"+a.map(x=>`<a class="rc" href="${esc(x[1])}"${T} data-n="${esc(x[0])}" data-d="${esc(x[2])}" data-c="${x[3]?1:0}"><img src="${fd(x[2])}" alt="" width="14" height="14"><b>${esc(x[0])}</b></a>`).join("")+`<button class="rcx" aria-label="Effacer les recherches récentes">${X}</button>`:"";
}
$("#rec").onclick=e=>{
  if(e.target.closest(".rcx")){out($("#rec"),()=>{store("spr",[]);recRender();$("#rec").classList.remove("out")});return}
  const a=e.target.closest("a");if(!a)return;
  if(a.dataset.c==="1")navigator.clipboard?.writeText(a.dataset.n).catch(()=>{});
  recSave(a.dataset.n,a.href,a.dataset.d,a.dataset.c==="1");
};
const gk=(()=>{const m=new WeakMap();let n=0;return g=>m.get(g)||(m.set(g,++n),n)})();
// FLIP: les groupes qui changent de place glissent vers leur nouvelle position
function flip(pos){
  if(!S.anim||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  document.querySelectorAll("#list section").forEach(s=>{
    const o=pos.get(s.dataset.k);if(!o)return;
    const b=s.getBoundingClientRect(),dx=o.left-b.left,dy=o.top-b.top;
    if(Math.abs(dx)<1&&Math.abs(dy)<1)return;
    s.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:"none"}],{duration:450,easing:"cubic-bezier(.16,1,.3,1)"});
  });
}
const LINE=ic("M4 11h16v2H4z");
const spH=(i,j)=>'<div class="sp" draggable="'+edit+'" data-i="'+i+'" data-j="'+j+'"><i></i><button class="ib" data-dl="'+i+':'+j+'" aria-label="Supprimer la séparation">'+X+'</button></div>';
const ugH=(l,i,j)=>`<button class="ug" style="--j:${j}" data-ul="${i}:${j}">${UNDO}<span>Annuler : ${esc(l[0])}</span></button>`;
const lkH=(l,i,j)=>`<a class="r" style="--j:${j}" href="${esc(l[1])}"${S.tab?' target="_blank" rel="noopener"':""} draggable="${edit}" data-i="${i}" data-j="${j}" data-s="${esc((l[0]+" "+l[1]).toLowerCase())}"><img ${ia(l)} data-d="${new URL(l[1]).hostname}" width="16" height="16" alt="" decoding="async"><b>${esc(l[0])}</b><small>${esc(host(l[1]))}</small><button class="ib" data-dl="${i}:${j}" aria-label="Supprimer">${X}</button></a>`;
// suppression / annulation d'un favori sur place: pas de re-rendu complet, pas de saut de mise en page
function swapLink(el,html,g){
  const t=document.createElement("template");t.innerHTML=html;
  const n=t.content.firstElementChild;el.replaceWith(n);
  const s=n.closest("section"),full=nl(D[g])>=MAX,b=s.querySelector(".add");
  s.querySelector("h2 em").textContent=nl(D[g])+"/"+MAX;
  b.disabled=full;b.innerHTML=PLUS+(full?"Groupe complet":"Ajouter un lien");
  if(S.anim)n.animate([{opacity:0,transform:"translateX(-6px)"},{opacity:1,transform:"none"}],{duration:280,easing:"cubic-bezier(.16,1,.3,1)"});
  filter();
}
function render(){
  const pos=new Map();
  document.querySelectorAll("#list section").forEach(s=>pos.set(s.dataset.k,s.getBoundingClientRect()));
  $("#list").innerHTML=D.map((g,i)=>g.z?`<section class="gz" style="--i:${i}" data-g="${i}" data-k="${gk(g)}"><button class="ug" data-ug="${i}">${UNDO}<span>Annuler : ${esc(g.n)}</span></button></section>`:`<section class="${g.c?"col":""}" style="--i:${i}" data-g="${i}" data-k="${gk(g)}"><h2 data-t="${i}" draggable="${edit}" role="button" tabindex="0" aria-expanded="${!g.c}">${CH}<i class="gic${g.i?" has":""}">${g.i?ic(ICONS[g.i]):PLUS}</i><span>${esc(g.n)}</span><em>${nl(g)}/${MAX}</em><button class="ib" data-dg="${i}" aria-label="Supprimer le groupe">${X}</button></h2><div class="gb"><div class="gi">`+
    g.l.map((l,j)=>l[1]==="---"?spH(i,j):l[2]?ugH(l,i,j):lkH(l,i,j)).join("")+
    `<button class="add" data-a="${i}" tabindex="${edit?0:-1}"${nl(g)>=MAX?" disabled":""}>${PLUS}${nl(g)>=MAX?"Groupe complet":"Ajouter un lien"}</button><button class="add" data-sp="${i}" tabindex="${edit?0:-1}"${g.l.length>=MAX*2?" disabled":""}>${LINE}Ajouter une séparation</button></div></div></section>`).join("");
  filter();recRender();flip(pos);warm();
}
document.addEventListener("error",e=>{
  const i=e.target;if(i.tagName!=="IMG")return;
  const h=i.closest("[data-d]"),d=i.dataset.d||(h&&h.dataset.d);
  if(d&&got(d)&&i.getAttribute("src")===got(d)&&!FI[d]){delete IC[d];delete MEM[d];store("spi",IC);store("spm",MEM);i.classList.add("ld");i.src=PH;probe(d);return}
  if(d){const c=chain(d),n=(+i.dataset.n||0)+1;if(n<c.length){i.dataset.n=n;i.src=c[n];return}}
  i.style.visibility="hidden";
},true);

function fold(h){
  const i=+h.dataset.t,c=!D[i].c;
  D[i].c=c;h.parentNode.classList.toggle("col",c);h.setAttribute("aria-expanded",!c);persist();
}
$("#list").onkeydown=e=>{
  const h=e.target.closest("h2");
  if(h&&e.target===h&&(e.key==="Enter"||e.key===" ")){e.preventDefault();fold(h)}
};
$("#list").onclick=e=>{
  const h=e.target.closest("h2");
  if(h&&!e.target.closest(".ib")){
    if(edit&&e.target.closest(".gic"))return openGrp(+h.dataset.t);
    return fold(h);
  }
  const t=e.target.closest("button,a");if(!t)return;
  const d=t.dataset;
  if(t.tagName==="A"&&edit)e.preventDefault();
  if(d.dg!==undefined){e.preventDefault();out(t.closest("section"),()=>{D[d.dg].z=1;saveD()})}
  else if(d.dl!==undefined&&t.closest(".sp")){const[g,l]=d.dl.split(":");out(t.closest(".sp"),()=>{D[g].l.splice(l,1);saveD()})}
  else if(d.sp!==undefined){D[d.sp].l.push(["","---"]);saveD()}
  else if(d.dl!==undefined){e.preventDefault();const[g,l]=d.dl.split(":");out(t.closest(".r"),()=>{D[g].l[l][2]=1;persist();swapLink(t.closest(".r"),ugH(D[g].l[l],g,l),g)})}
  else if(d.a!==undefined)openDlg(+d.a);
  else if(d.ul!==undefined){
    const[g,l]=d.ul.split(":");
    if(nl(D[g])>=MAX)toast("Groupe complet");else{D[g].l[l].length=2;persist();swapLink(t,lkH(D[g].l[l],g,l),g)}
  }
  else if(d.ug!==undefined){delete D[d.ug].z;saveD()}
  else if(t.tagName==="A"){if(edit)openLnk(+d.i,+d.j);else recAdd(t.querySelector("b").textContent,t.href,host(t.href))}
};
