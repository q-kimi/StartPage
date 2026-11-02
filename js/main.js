/* init */
apply();render();tick();chips();place();
// tactile: pas de clavier force au chargement
if(matchMedia("(pointer:coarse)").matches)q.blur();
// autre onglet: les donnees ont change. On recharge, sauf en cours d'edition (sinon on ecraserait ses changements)
addEventListener("storage",e=>{
  if(e.key&&e.key!=="sp"&&e.key!=="sps")return;
  if(edit||document.querySelector("dialog[open]"))toast("Modifié dans un autre onglet : recharge la page");
  else location.reload();
});
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
if(!typing)$("#gn").classList.add("hl");
else{$("#gt").textContent="";$("#gn").textContent="";setTimeout(typeIn,450)}
setTimeout(()=>document.body.classList.remove("boot"),1600);
