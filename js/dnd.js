/* glisser-deposer (mode edition): deplacer un favori entre groupes ou le reordonner */
let drag=null,drop=null;
function dClear(){
  document.querySelectorAll("#list .over,#list .full,#list .before,#list .after,#list .sl,#list .sr,#list .st,#list .sb").forEach(n=>n.classList.remove("over","full","before","after","sl","sr","st","sb"));
}
$("#list").ondragstart=e=>{
  const h=e.target.closest("h2");
  if(h&&edit){
    drag={g:+h.dataset.t};e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain","");
    requestAnimationFrame(()=>h.parentNode.classList.add("gdrag"));return;
  }
  const r=e.target.closest(".r,.sp");
  if(!edit||!r)return e.preventDefault();
  drag={i:+r.dataset.i,j:+r.dataset.j};
  e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",r.href||"");
  requestAnimationFrame(()=>r.classList.add("drag"));
};
$("#list").ondragover=e=>{
  if(drag&&drag.g!==undefined){
    const sec=e.target.closest("section");if(!sec)return;
    e.preventDefault();dClear();
    const k=+sec.dataset.g;if(k===drag.g){drop=null;return}
    const b=sec.getBoundingClientRect(),L=getComputedStyle($("#list")).gridTemplateColumns.split(" ").length>1,
      a=L?e.clientX>b.left+b.width/2:e.clientY>b.top+b.height/2;
    sec.classList.add(L?(a?"sr":"sl"):(a?"sb":"st"));drop={k,a};return;
  }
  const sec=e.target.closest("section");
  if(!drag||!sec)return;
  const ti=+sec.dataset.g,r=e.target.closest(".r,.sp");
  dClear();
  if(ti!==drag.i&&nl(D[ti])>=MAX&&D[drag.i].l[drag.j][1]!=="---"){drop=null;sec.classList.add("full");e.dataTransfer.dropEffect="none";return}
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
  document.querySelectorAll("#list .r,#list .sp,#list h2").forEach(r=>r.draggable=edit);
  $("#ed").classList.toggle("on",edit);
  if(!edit){D=D.filter(g=>!g.z);D.forEach(g=>g.l=g.l.filter(l=>!l[2]));persist();render()}
  $("#ed").innerHTML=(edit?OK:PEN)+`<span>${edit?"Terminer":"Modifier"}</span>`;
  document.querySelectorAll(".add").forEach(b=>b.tabIndex=edit?0:-1);
};
$("#ng").innerHTML=PLUS+"Ajouter un groupe";
$("#ng").onclick=()=>openDlg(null);

