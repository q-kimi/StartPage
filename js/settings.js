/* settings */
function apply(){
  const r=document.documentElement.style,b=document.body.classList;
  r.setProperty("--ring","#e4e4e7");r.setProperty("--ring-fg","#000");
  b.toggle("noanim",!S.anim);b.toggle("dense",S.dense);b.toggle("nofav",!S.favs);
  $("#greet").hidden=!S.greet;
}
function set(k,v){
  S[k]=v;store("sps",S);apply();
  if(k==="name")tick();
  if(k==="tab")render();
  if(k==="eng"){place();ping()}
}

const sw=(k,l,d)=>`<div class="row"><div><div class="l">${l}</div>${d?`<div class="d">${d}</div>`:""}</div><button class="sw" role="switch" aria-checked="${S[k]}" data-sw="${k}" aria-label="${l}"></button></div>`;
const seg=(k,o)=>`<div class="seg${o.length>3?" wrap":""}">${o.map(([v,t,x])=>`<button aria-pressed="${S[k]===v}" data-seg="${k}" data-v="${v}"${x?" disabled":""}>${t}</button>`).join("")}</div>`;
function sheet(){
  $("#sbody").innerHTML=`
  <h4>Profil</h4>
  <div class="row col"><label class="l" for="sn">Prénom</label><input class="inp" id="sn" value="${esc(S.name)}" maxlength="30" autocomplete="off"></div>
  ${sw("greet","Salutation")}
  <h4>Recherche</h4>
  <div class="row col"><div class="l">Moteur par défaut</div>${seg("eng",S.ord.map(i=>[i,E[i][0],S.hid.includes(i)]))}</div>
  <h4>Moteurs et IA</h4>
  <p class="note">Glisse les moteurs sous la barre de recherche pour les réordonner.</p>
  ${S.ord.map(i=>`<div class="row"><div class="eg"><img src="${fd(E[i][2])}" data-d="${E[i][2]}" width="18" height="18" alt=""><span class="l">${esc(E[i][0])}</span></div><div class="eg">${i>=NB?`<button class="mini" data-del="${i}">Supprimer</button>`:""}<button class="sw" role="switch" aria-checked="${!S.hid.includes(i)}" data-hid="${i}" aria-label="${esc(E[i][0])}"></button></div></div>`).join("")}
  <div class="row col"><div class="l">Ajouter un moteur</div><input class="inp" id="en" placeholder="Nom" maxlength="20" autocomplete="off"><input class="inp" id="eu" placeholder="https://exemple.com/search?q=%s" autocomplete="off"><button class="btn" id="ea">Ajouter</button></div>
  ${sw("tab","Nouvel onglet","Ouvre les favoris et les recherches dans un nouvel onglet.")}
  <h4>Apparence</h4>
  <div class="row col"><div class="l">Densité des favoris</div>${seg("dense",[[false,"Confort"],[true,"Compact"]])}</div>
  ${sw("favs","Icônes des sites")}${sw("anim","Animations")}
  <h4>Données</h4>
  <div class="btns"><button class="btn" id="ex">Exporter</button><button class="btn" id="im">Importer</button><button class="btn" id="ri">Recharger les icônes</button><button class="btn" id="rd">Favoris par défaut</button><button class="btn danger" id="rs">Réinitialiser</button></div>
  <input type="file" id="fi" accept="application/json" hidden>
  <p class="note">Tout reste sur cet appareil, dans ce navigateur.</p>`;
}
$("#sbody").onclick=e=>{
  const t=e.target.closest("button");if(!t)return;
  const d=t.dataset,pr=()=>t.parentNode.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b===t));
  if(d.sw){const v=t.getAttribute("aria-checked")!=="true";t.setAttribute("aria-checked",v);set(d.sw,v)}
  else if(d.seg){pr();set(d.seg,JSON.parse(d.v))}
  else if(d.hid){
    const i=+d.hid,h=t.getAttribute("aria-checked")==="true";
    if(h&&vis().length<2)return toast("Garde au moins un moteur");
    S.hid=h?S.hid.concat(i):S.hid.filter(x=>x!==i);engSave();
  }
  else if(d.del)out(t.closest(".row"),()=>{
    const i=+d.del;
    S.ce.splice(i-NB,1);E.splice(i,1);
    const f=x=>x>i?x-1:x;
    S.ord=S.ord.filter(x=>x!==i).map(f);S.hid=S.hid.filter(x=>x!==i).map(f);
    S.eng=S.eng===i?0:f(S.eng);engSave();
  })
  else if(t.id==="ea"){
    const n=$("#en").value.trim().slice(0,20),u=$("#eu").value.trim();
    if(!n||!ok(u))return toast("Nom et URL https requis");
    if(S.ce.length>=12)return toast("12 moteurs perso max");
    let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%360;
    const c=[n,u,host(u),"Rechercher avec "+n,"hsl("+h+" 70% 60%)"];
    S.ce.push(c);E.push(c);engSave();toast("Moteur ajouté");
  }
  else if(t.id==="ex"){
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([JSON.stringify({favoris:live(),reglages:S},null,2)],{type:"application/json"}));
    a.download="start-page.json";a.click();URL.revokeObjectURL(a.href);toast("Export terminé");
  }
  else if(t.id==="im")$("#fi").click();
  else if(t.id==="ri"){
    bust="&r="+Date.now();IC={};MEM={};store("spi",IC);store("spm",MEM);
    (window.caches?caches.delete("icons-v1"):Promise.resolve()).catch(()=>{}).then(()=>{render();recRender();chips();sheet();toast("Icônes rechargées")});
  }
  else if(t.id==="rd"){
    JSON.parse(JSON.stringify(DEF)).forEach(dg=>{
      const g=D.find(x=>!x.z&&x.n===dg.n);
      if(!g)return D.push(dg);
      dg.l.forEach(l=>{if(nl(g)<MAX&&!g.l.some(x=>!x[2]&&x[1]===l[1]))g.l.push(l)});
    });
    saveD();toast("Favoris par défaut restaurés");
  }
  else if(t.id==="rs"){
    if(!t.classList.contains("armed")){
      t.classList.add("armed");t.textContent="Confirmer ?";
      setTimeout(()=>{t.classList.remove("armed");t.textContent="Réinitialiser"},3000);
    }else{try{localStorage.removeItem("sp");localStorage.removeItem("sps");localStorage.removeItem("spe");localStorage.removeItem("spr")}catch{}location.reload()}
  }
};
$("#sbody").oninput=e=>{if(e.target.id==="sn")set("name",e.target.value.trim())};
$("#sbody").onchange=async e=>{
  if(e.target.id!=="fi"||!e.target.files[0])return;
  try{
    const j=JSON.parse(await e.target.files[0].text()),d=clean(j.favoris);
    if(!d)throw 0;
    D=d;if(j.reglages&&typeof j.reglages==="object")S={...SD,...j.reglages};
    engInit();chips();
    persist();store("sps",S);apply();place();tick();render();sheet();toast("Import terminé");
  }catch{toast("Fichier invalide")}
};
$("#st").innerHTML=GEAR;
$("#sx").innerHTML=X;
$("#st").onclick=()=>{sheet();$("#sheet").showModal()};
$("#sx").onclick=()=>$("#sheet").close();

