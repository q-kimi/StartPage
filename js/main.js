/* init */
apply();render();tick();chips();place();
// tactile: pas de clavier force au chargement
if(matchMedia("(pointer:coarse)").matches)q.blur();
// "/" place le curseur dans la barre de recherche
document.addEventListener("keydown",e=>{
  if(e.key!=="/"||e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)||document.querySelector("dialog[open]"))return;
  e.preventDefault();q.focus();
});
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
if(!typing)$("#gn").classList.add("hl");
else{$("#gt").textContent="";$("#gn").textContent="";setTimeout(typeIn,450)}
setTimeout(()=>document.body.classList.remove("boot"),1600);
