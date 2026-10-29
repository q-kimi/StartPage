/* horloge: une mise a jour par minute */
let typing=S.anim&&S.greet;
const hello=()=>(new Date().getHours()<5||new Date().getHours()>=18?"Bonsoir":"Bonjour")+", ";
function paint(){
  $("#gt").textContent=hello();
  const n=$("#gn");n.textContent=S.name||"User";n.classList.toggle("empty",!S.name);
}
function typeIn(){
  const a=hello(),f=a+(S.name||"User"),gt=$("#gt"),gn=$("#gn");
  gn.classList.toggle("empty",!S.name);
  let i=0;
  (function step(){
    i++;
    gt.textContent=f.slice(0,Math.min(i,a.length));gn.textContent=f.slice(a.length,i);
    if(i<f.length)return setTimeout(step,70);
    typing=false;gn.classList.add("hl");
  })();
}
$("#gn").onclick=()=>{
  if(S.name)return;
  const b=$("#gn"),i=document.createElement("input");
  let done=0;
  i.className="ni";i.value=S.name;i.maxLength=30;i.placeholder="User";i.autocomplete="off";
  const fit=()=>i.style.width=Math.max(i.value.length,6)+"ch";fit();
  const end=ok=>{if(done)return;done=1;if(ok)set("name",i.value.trim());i.replaceWith(b);paint()};
  i.oninput=fit;
  i.onkeydown=e=>{if(e.key==="Enter")end(1);else if(e.key==="Escape"){e.stopPropagation();end(0)}};
  i.onblur=()=>end(1);
  b.replaceWith(i);i.focus();i.select();
};
function tick(){
  const d=new Date();
  if(!typing)paint();
  clearTimeout(tt);tt=setTimeout(tick,(60-d.getSeconds())*1000-d.getMilliseconds()+50);
}
document.addEventListener("visibilitychange",()=>{if(!document.hidden)tick()});

