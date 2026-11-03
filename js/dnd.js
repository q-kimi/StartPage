/* glisser-deposer (mode edition): deplacer un favori entre groupes ou le reordonner */
let drag=null,drop=null;
function dClear(){
  document.querySelectorAll("#list .over,#list .full,#list .before,#list .after,#list .sl,#list .sr,#list .st,#list .sb").forEach(n=>n.classList.remove("over","full","before","after","sl","sr","st","sb"));
}
$("#list").ondragstart=e=>{
  const h=e.target.closest("h2");
  if(h){
    const s=h.parentNode,b=s.getBoundingClientRect();
    drag={g:+h.dataset.t};e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain","");
    e.dataTransfer.setDragImage(s,e.clientX-b.left,e.clientY-b.top);
    requestAnimationFrame(()=>h.parentNode.classList.add("gdrag"));return;
  }
  const r=e.target.closest(".r,.sp");
  if(!edit||!r)return e.preventDefault();
  drag={i:+r.dataset.i,j:+r.dataset.j};
  e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",r.querySelector("a")?hr(r):"");
  requestAnimationFrame(()=>r.classList.add("drag"));
};
// defilement automatique pres des bords de la fenetre pendant un glisser
const edge=e=>{const m=90,y=e.clientY;if(y<m)scrollBy(0,-Math.ceil((m-y)/6));else if(y>innerHeight-m)scrollBy(0,Math.ceil((y-(innerHeight-m))/6))};
// section la plus proche du curseur (les ecarts entre groupes ne sont plus des zones mortes)
const nearest=e=>{let best=null,bd=1/0;document.querySelectorAll("#list section").forEach(s=>{const b=s.getBoundingClientRect(),dx=Math.max(b.left-e.clientX,0,e.clientX-b.right),dy=Math.max(b.top-e.clientY,0,e.clientY-b.bottom),d=dx*dx+dy*dy;if(d<bd){bd=d;best=s}});return best};
$("#list").ondragover=e=>{
  edge(e);
  if(drag&&drag.g!==undefined){
    const sec=e.target.closest("section")||nearest(e);if(!sec)return;
    e.preventDefault();dClear();
    const k=+sec.dataset.g;if(k===drag.g){drop=null;return}
    const b=sec.getBoundingClientRect(),a=e.clientY>b.top+b.height/2;
    sec.classList.add(a?"sb":"st");drop={k,a};return;
  }
  const sec=e.target.closest("section");
  if(!drag||!sec)return;
  const ti=+sec.dataset.g,r=e.target.closest(".r,.sp");
  dClear();
  if(ti!==drag.i&&(D[ti].l.length>=MAX*2||(nl(D[ti])>=MAX&&!D[drag.i].l[drag.j].sep))){drop=null;sec.classList.add("full");e.dataTransfer.dropEffect="none";return}
  e.preventDefault();e.dataTransfer.dropEffect="move";
  sec.classList.add("over");
  let idx=D[ti].l.length;
  if(r){
    const b=r.getBoundingClientRect(),after=e.clientY>b.top+b.height/2;
    idx=+r.dataset.j+(after?1:0);r.classList.add(after?"after":"before");
  }
  drop={ti,idx};
};
$("#list").ondragleave=e=>{if(!e.relatedTarget||!$("#list").contains(e.relatedTarget)){dClear();drop=null}};
$("#list").ondrop=e=>{
  e.preventDefault();
  if(drag&&drag.g!==undefined){
    const g=drag.g,d=drop;dEnd();
    if(d){const[x]=D.splice(g,1);let n=d.k+(d.a?1:0);if(g<n)n--;D.splice(n,0,x);saveD()}
    return;
  }
  if(!drag||!drop)return dEnd();
  const{i,j}=drag,{ti}=drop;let idx=drop.idx;
  const[item]=D[i].l.splice(j,1);
  if(ti===i&&j<idx)idx--;
  D[ti].l.splice(idx,0,item);
  dEnd();saveD();
  if(ti!==i)toast("Déplacé vers "+D[ti].n);
};
function dEnd(){dClear();document.querySelectorAll("#list .drag,#list .gdrag").forEach(n=>n.classList.remove("drag","gdrag"));drag=drop=null}
$("#list").ondragend=dEnd;

$("#ed").innerHTML=PEN+"<span>Modifier</span>";
$("#ed").onclick=()=>{
  edit=document.body.classList.toggle("edit");
  document.querySelectorAll("#list .r,#list .sp").forEach(r=>r.draggable=edit);
  $("#ed").classList.toggle("on",edit);
  if(!edit){D=D.filter(g=>!g.z);D.forEach(g=>g.l=g.l.filter(l=>!l.x));persist();render()}
  $("#ed").innerHTML=(edit?OK:PEN)+`<span>${edit?"Terminer":"Modifier"}</span>`;
  document.querySelectorAll(".add").forEach(b=>b.tabIndex=edit?0:-1);
};
$("#ng").innerHTML=PLUS+"Ajouter un groupe";
$("#ng").onclick=()=>openDlg(null);

