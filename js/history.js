/* historique: instantanes de D (50 max), Ctrl+Z / Ctrl+Maj+Z. Garde en sessionStorage pour survivre a un rechargement */
const H={u:[],r:[]};let snap=JSON.stringify(D);
const hsave=()=>{try{sessionStorage.sph=JSON.stringify({s:snap,u:H.u,r:H.r})}catch{}};
try{const o=JSON.parse(sessionStorage.sph);if(o&&o.s===snap&&Array.isArray(o.u)&&Array.isArray(o.r)){H.u=o.u;H.r=o.r}}catch{}
// enregistre l'etat courant comme une etape annulable (sans sauvegarde ni rendu)
const chk=()=>{const n=JSON.stringify(D);if(n!==snap){H.u.push(snap);if(H.u.length>50)H.u.shift();H.r=[];snap=n;hsave()}};
// etat modifie sans etre une action (nettoyage des annulations en attente)
const resnap=()=>{snap=JSON.stringify(D);hsave()};
const saveD=()=>{chk();persist();render()};
const hist=(from,to,none,ok)=>{if(!from.length)return toast(none);to.push(snap);snap=from.pop();D=JSON.parse(snap);hsave();persist();render();toast(ok)};
const undo=()=>hist(H.u,H.r,"Rien à annuler","Annulé");
const redo=()=>hist(H.r,H.u,"Rien à rétablir","Rétabli");
