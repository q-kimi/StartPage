/* dialog ajout */
let tgt=null,el=-1;
let pick="",egi=-1;
const markPick=()=>{buildPick();$("#ip").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.ic===pick))};
const buildPick=()=>{
  if($("#ip").firstChild)return;
  $("#ip").innerHTML=`<button type="button" data-ic="" aria-label="Aucun">${X}</button>`+Object.keys(ICONS).map(k=>`<button type="button" data-ic="${k}" aria-label="${k}">${ic(ICONS[k])}</button>`).join("");
};
$("#ip").onclick=e=>{const b=e.target.closest("button");if(b){pick=b.dataset.ic;markPick()}};
function openGrp(i){
  egi=i;tgt=null;el=-1;pick=D[i].i||"";markPick();
  $("#dt").textContent="Modifier le groupe";
  $("#du").hidden=$("#dki").hidden=true;$("#dv").required=false;$("#dn").required=true;$("#dnf").hidden=true;$("#di").hidden=false;
  $("#df").reset();$("#dn").value=D[i].n;$("#dlg").showModal();$("#dn").focus();
}
function openLnk(i,j){
  tgt=i;egi=-1;el=j;pick="";
  $("#dt").textContent="Modifier le lien";
  $("#di").hidden=true;$("#du").hidden=$("#dki").hidden=false;$("#dv").required=true;$("#dn").required=false;$("#dnf").hidden=false;
  $("#df").reset();$("#dp").hidden=true;
  $("#dn").value=D[i].l[j][0];$("#dv").value=D[i].l[j][1];$("#dk").value=D[i].l[j][3]||"";prev();
  $("#dlg").showModal();$("#dn").focus();
}
function openDlg(g){
  if(g!==null&&nl(D[g])>=MAX)return toast("Groupe complet ("+MAX+" liens max)");
  tgt=g;egi=-1;el=-1;pick="";markPick();const isG=g===null;$("#di").hidden=!isG;
  $("#dt").textContent=isG?"Nouveau groupe":"Nouveau lien - "+D[g].n;
  $("#du").hidden=$("#dki").hidden=isG;$("#dv").required=!isG;$("#dn").required=isG;$("#dnf").hidden=isG;
  $("#df").reset();$("#dp").hidden=true;$("#dlg").showModal();$("#dn").focus();
}
let pt;
const norm=v=>{v=v.trim();return /^https?:\/\//i.test(v)?v:"https://"+v.replace(/^\/+/,"")};
const okUrl=v=>{try{return new URL(v).hostname.includes(".")}catch{return false}};
const nameOf=v=>{const h=new URL(v).hostname.replace(/^www\./,"").split("."),w=h[h.length-2]||h[0];return w[0].toUpperCase()+w.slice(1)};
let autoN="";
$("#df").addEventListener("reset",()=>autoN="");
const prev=()=>{
  const p=$("#dp"),v=norm($("#dv").value);p.hidden=true;
  if(okUrl(v)){
    // nom auto, modifiable: remplace seulement un champ vide ou encore egal au dernier nom auto
    const n=$("#dn");if(!n.value.trim()||n.value===autoN)n.value=autoN=nameOf(v);const k=norm($("#dk").value);const cu=$("#dk").value.trim()&&ok(k);p.style.visibility="";const d=new URL(v).hostname;HU[d]=v;p.dataset.n=cu?-1:0;p.dataset.d=d;p.classList.remove("ld");
    if(cu)p.src=k;else if(got(d))p.src=got(d);else{p.classList.add("ld");p.src=PH;probe(d)}}
};
$("#dp").onload=e=>e.target.hidden=false;
$("#dv").oninput=()=>{clearTimeout(pt);pt=setTimeout(prev,500)};
$("#dv").onchange=()=>{clearTimeout(pt);prev()};
$("#dk").oninput=()=>{clearTimeout(pt);pt=setTimeout(prev,500)};
$("#dc").onclick=()=>$("#dlg").close();
$("#df").onsubmit=e=>{
  let n=$("#dn").value.trim();const v=norm($("#dv").value);
  if(egi<0&&tgt!==null){
    if(!okUrl(v)){e.preventDefault();return toast("URL invalide")}
    if(!n)n=nameOf(v);
  }
  if(egi>=0){D[egi].n=n;D[egi].i=pick}
  else if(tgt===null)D.push({n,i:pick,l:[]});else{const k=norm($("#dk").value),l=$("#dk").value.trim()&&ok(k)?[n,v,0,k]:[n,v];if(el>=0)D[tgt].l[el]=l;else D[tgt].l.push(l)}
  saveD();
};
// ferme seulement si le clic commence ET finit sur le fond (une selection de texte relachee dehors ne ferme plus)
for(const d of document.querySelectorAll("dialog")){
  let dn=false;
  d.onpointerdown=e=>{dn=e.target===d};
  d.onclick=e=>{if(dn&&e.target===d)d.close();dn=false};
}

