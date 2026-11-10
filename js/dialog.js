/* dialog ajout */
let tgt=null,el=-1,am=false;
let pick="",egi=-1;
const markPick=()=>{buildPick();$("#ip").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.ic===pick))};
const buildPick=()=>{
  if($("#ip").firstChild)return;
  $("#ip").innerHTML=`<button type="button" data-ic="" aria-label="Aucun">${X}</button>`+Object.keys(ICONS).map(k=>`<button type="button" data-ic="${k}" aria-label="${k}">${ic(ICONS[k])}</button>`).join("");
};
$("#ip").onclick=e=>{const b=e.target.closest("button");if(b){pick=b.dataset.ic;markPick()}};
function openGrp(i){
  am=false;setMode();egi=i;tgt=null;el=-1;pick=D[i].i||"";markPick();
  $("#dt").textContent="Modifier le groupe";
  $("#du").hidden=$("#dki").hidden=$("#dap").hidden=true;$("#dv").required=false;$("#dn").required=true;$("#dnf").hidden=true;$("#di").hidden=false;
  $("#df").reset();$("#dn").value=D[i].n;$("#dlg").showModal();$("#dn").focus();
}
function openLnk(i,j){
  tgt=i;egi=-1;el=j;pick="";am=!!ap(D[i].l[j].u);setMode();
  $("#dt").textContent=am?"Modifier l'app":"Modifier le lien";
  $("#di").hidden=true;$("#du").hidden=false;$("#dki").hidden=false;$("#dap").hidden=!am;$("#dv").required=true;$("#dn").required=false;$("#dnf").hidden=false;
  $("#df").reset();$("#dp").hidden=true;
  $("#dn").value=D[i].l[j].n;$("#dv").value=D[i].l[j].u;$("#dk").value=D[i].l[j].k||"";prev();
  $("#dlg").showModal();$("#dn").focus();
}
function openDlg(g,app){
  if(g!==null&&nl(D[g])>=MAX)return toast("Groupe complet ("+MAX+" liens max)");
  tgt=g;egi=-1;el=-1;pick="";am=!!app;setMode();markPick();const isG=g===null;$("#di").hidden=!isG;
  $("#dt").textContent=isG?"Nouveau groupe":(am?"Nouvelle app - ":"Nouveau lien - ")+D[g].n;
  $("#du").hidden=isG;$("#dki").hidden=isG;$("#dap").hidden=isG||!am;$("#dv").required=!isG;$("#dn").required=isG;$("#dnf").hidden=isG;
  $("#df").reset();$("#dp").hidden=true;markApps();$("#dlg").showModal();(am?$("#da button"):$("#dn")).focus();
}
// mode app: l'URL est un lien de lancement (steam://...), mode lien: URL http(s)
const setMode=()=>{$("#dul").textContent=am?"Lien de lancement":"URL";$("#dv").placeholder=am?"steam://open/main":"youtube.com";$("#dh").hidden=!am};
const markApps=()=>{const a=ap($("#dv").value.trim());$("#da").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",!!a&&APPS.get(b.dataset.p)===a))};
let pt;
const norm=v=>{v=v.trim();return /^https?:\/\//i.test(v)||(am&&ap(v))?v:"https://"+v.replace(/^\/+/,"")};
const okUrl=v=>{try{return am?!!ap(v):new URL(v).hostname.includes(".")}catch{return false}};
const nameOf=v=>{if(ap(v)){const n=new URL(v).searchParams.get("n");return n?n.slice(0,30):ap(v)[1]}const h=new URL(v).hostname.replace(/^www\./,"").split("."),w=h[h.length-2]||h[0];return w[0].toUpperCase()+w.slice(1)};
let autoN="";
$("#df").addEventListener("reset",()=>autoN="");
const prev=()=>{
  const p=$("#dp"),v=norm($("#dv").value);p.hidden=true;markApps();
  if(okUrl(v)){
    // nom auto, modifiable: remplace seulement un champ vide ou encore egal au dernier nom auto
    const n=$("#dn");if(!n.value.trim()||n.value===autoN)n.value=autoN=nameOf(v);const k=norm($("#dk").value);const cu=$("#dk").value.trim()&&ok(k);p.style.visibility="";const d=hn(v);if(!ap(v))HU[d]=v;p.dataset.n=cu?-1:0;p.dataset.d=d;p.classList.remove("ld");
    if(cu)p.src=k;else if(got(d))p.src=got(d);else{p.classList.add("ld");p.src=PH;probe(d)}}
};
$("#dp").onload=e=>e.target.hidden=false;
$("#dv").oninput=()=>{clearTimeout(pt);pt=setTimeout(prev,500)};
$("#dv").onchange=()=>{clearTimeout(pt);prev()};
$("#dk").oninput=()=>{clearTimeout(pt);pt=setTimeout(prev,500)};
$("#da").innerHTML=[...APPS].filter(([k])=>k!=="startpage").map(([k,a])=>`<button type="button" class="chip" aria-pressed="false" data-p="${k}" data-u="${esc(a[2])}"><img src="${esc(fd(a[0]))}" data-d="${a[0]}" alt="" width="16" height="16">${esc(a[1])}</button>`).join("")+'<button type="button" class="chip" data-pick="1">Choisir un .exe...</button>';
// .exe local: le helper Windows (dossier helper/) ouvre l'Explorateur et copie le lien startpage://run/ID dans le presse-papiers
let pickWait=0;
addEventListener("focus",()=>{
  if(Date.now()>pickWait)return;
  // le focus revient aussi apres le prompt du navigateur: on attend le lien du helper jusqu'a 2 min
  navigator.clipboard.readText().then(t=>{t=t.trim();if(t.startsWith("startpage://run/")&&ap(t)){pickWait=0;$("#dv").value=t;$("#dn").value=autoN="";prev();toast("Application ajoutée au lien")}}).catch(()=>{pickWait=0;toast("Colle le lien (Ctrl+V) dans le champ")});
});
$("#da").onclick=e=>{const b=e.target.closest("button");if(!b)return;
  if(b.dataset.pick){pickWait=Date.now()+12e4;toast("Choisis l'exe dans la fenêtre Windows (helper requis, voir README)");location.href="startpage://pick";return}$("#dv").value=b.dataset.u;$("#dn").value=autoN="";prev();$("#dn").focus()};
$("#dc").onclick=()=>$("#dlg").close();
$("#df").onsubmit=e=>{
  let n=$("#dn").value.trim();const v=norm($("#dv").value);
  if(egi<0&&tgt!==null){
    if(!okUrl(v)){e.preventDefault();return toast(am?"Lien d'app invalide (steam://, discord://, spotify:, vscode://)":ap($("#dv").value.trim())?"Pour une app, utilise le bouton App":"URL invalide")}
    if(!n)n=nameOf(v);
  }
  if(egi>=0){D[egi].n=n;D[egi].i=pick}
  else if(tgt===null)D.push({n,i:pick,l:[]});else{const k=norm($("#dk").value),l=$("#dk").value.trim()&&ok(k)?{n,u:v,k}:{n,u:v};if(el>=0)D[tgt].l[el]=l;else D[tgt].l.push(l)}
  saveD();
};
// ferme seulement si le clic commence ET finit sur le fond (une selection de texte relachee dehors ne ferme plus)
for(const d of document.querySelectorAll("dialog")){
  let dn=false;
  d.onpointerdown=e=>{dn=e.target===d};
  d.onclick=e=>{if(dn&&e.target===d)d.close();dn=false};
}

