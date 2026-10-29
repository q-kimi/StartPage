/* composer */
const chips=()=>{eng.innerHTML=vis().map(i=>`<button type="button" class="chip" data-e="${i}" aria-label="${esc(E[i][0])}"><img src="${fd(E[i][2])}" data-d="${E[i][2]}" width="18" height="18" alt="" draggable="false"><span>${esc(E[i][0])}</span></button>`).join("");fit()};
// le libelle du moteur actif elargit la rangee: si le pire cas depasse la largeur, on le masque
const fit=()=>{eng.classList.toggle("cp",eng.children.length*38+101>eng.parentNode.clientWidth-$("#send").offsetWidth-8)};
addEventListener("resize",fit);
function engSave(){
  engInit();store("sps",S);chips();place();
  const b=$("#sbody"),y=b.scrollTop;sheet();b.scrollTop=y;
}
function place(){
  eng.querySelectorAll("[data-e]").forEach(x=>x.setAttribute("aria-pressed",+x.dataset.e===S.eng));
  q.placeholder=E[S.eng][3];
  const e=E[S.eng],c=e[4],R=document.documentElement.style,m=(x,p)=>`color-mix(in srgb,${x} ${p}%,transparent)`,g=e[6]||[c,m(c,0),m(c,65),m(c,0)];
  R.setProperty("--eng",c);g.forEach((x,i)=>R.setProperty("--g"+(i+1),x));
}
function ping(){
  const c=$("#cp");c.classList.remove("ping");void c.offsetWidth;c.classList.add("ping");
}
let moved=false;
eng.onpointerdown=e=>{
  const c=e.target.closest(".chip");if(!c||e.button>0)return;
  const x0=e.clientX,L=()=>eng.getBoundingClientRect().left;
  let on=false,off=0;
  const flip=fn=>{
    const o=[...eng.children].filter(x=>x!==c),p=o.map(x=>x.getBoundingClientRect().left);
    fn();
    o.forEach((x,i)=>{const d=p[i]-x.getBoundingClientRect().left;if(d){x.style.transition="none";x.style.transform=`translateX(${d}px)`}});
    void eng.offsetWidth;
    o.forEach(x=>{x.style.transition="";x.style.transform=""});
  };
  const mv=ev=>{
    if(!on){
      if(Math.abs(ev.clientX-x0)<6)return;
      on=moved=true;off=x0-(L()+c.offsetLeft);c.classList.add("lift");
    }
    const px=ev.clientX;
    for(const s of [...eng.children]){
      if(s===c)continue;
      const m=L()+s.offsetLeft+s.offsetWidth/2,after=c.compareDocumentPosition(s)&4;
      if(after?px>m:px<m)flip(()=>after?s.after(c):s.before(c));
    }
    c.style.transform=`translateX(${px-off-L()-c.offsetLeft}px) scale(1.06)`;
  };
  const up=()=>{
    removeEventListener("pointermove",mv);removeEventListener("pointerup",up);removeEventListener("pointercancel",up);
    if(!on)return;
    c.classList.remove("lift");void c.offsetWidth;c.style.transform="";
    const v=[...eng.children].map(x=>+x.dataset.e);
    S.ord=v.concat(S.ord.filter(i=>!v.includes(i)));store("sps",S);
    setTimeout(()=>moved=false);
  };
  addEventListener("pointermove",mv);addEventListener("pointerup",up);addEventListener("pointercancel",up);
};
eng.onclick=e=>{
  if(moved)return;
  const b=e.target.closest("[data-e]");if(!b)return;
  set("eng",+b.dataset.e);q.focus();
};
$("#send").innerHTML=UP;
$("#cp").onclick=e=>{if(!e.target.closest("button"))q.focus()};

function mark(){
  document.querySelectorAll("#list .r.hit").forEach(r=>r.classList.remove("hit"));
  const r=rows()[sel];if(r){r.classList.add("hit");r.scrollIntoView({block:"nearest"})}
}
function filter(){
  const s=q.value.trim().toLowerCase(),L=$("#list");
  L.classList.toggle("q",!!s);
  L.querySelectorAll(".r").forEach(r=>r.classList.toggle("dim",!!s&&!r.dataset.s.includes(s)));
  sel=-1;mark();
}
function send(){
  const v=q.value.trim();if(!v)return;
  const r=rows()[sel];if(r){recAdd(r.querySelector("b").textContent,r.href,host(r.href));return go(r.href)}
  const gr=u=>{try{recAdd(nameOf(u),u,host(u))}catch{}go(u)};
  if(/^https?:\/\//i.test(v))return ok(v)&&gr(v);
  if(/^[^\s/]+\.[a-z]{2,}(\/\S*)?$/i.test(v))return gr("https://"+v);
  const e=E[S.eng],u=e[5]?e[1]:e[1].includes("%s")?e[1].replace("%s",encodeURIComponent(v)):e[1]+encodeURIComponent(v);
  recAdd(v.slice(0,60),u,e[2],e[5]);
  if(e[5])Promise.resolve(navigator.clipboard?.writeText(v)).catch(()=>{}).finally(()=>go(u));
  else go(u);
}
q.oninput=()=>{
  q.style.height="auto";q.style.height=Math.min(q.scrollHeight,160)+"px";
  $("#send").disabled=!q.value.trim();filter();
};
q.onkeydown=e=>{
  if(e.key==="Escape"){q.value="";q.oninput();q.blur()}
  else if(e.altKey&&(e.key==="ArrowDown"||e.key==="ArrowUp")){e.preventDefault();const v=vis();set("eng",v[(v.indexOf(S.eng)+(e.key==="ArrowDown"?1:-1)+v.length)%v.length])}
  else if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}
  else if((e.key==="ArrowDown"||e.key==="ArrowUp")&&q.value.trim()&&rows().length){
    e.preventDefault();
    sel=Math.max(-1,Math.min(rows().length-1,sel+(e.key==="ArrowDown"?1:-1)));mark();
  }
};
$("#send").onclick=send;
addEventListener("keydown",e=>{
  if(document.querySelector("dialog[open]")||/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
  if(e.key==="/"||(e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();q.focus()}
});

