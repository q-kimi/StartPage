// favori: {n,u,k?} (k = icone perso), separateur: {sep:1}, x = annulation en attente (memoire seulement)
// accepte aussi l'ancien format tableau [nom,url,0,icone] et ["","---"]
const cl=l=>{
  if(Array.isArray(l))l=l[1]==="---"?{sep:1}:{n:l[0],u:l[1],k:l[3]};
  if(!l||typeof l!=="object")return null;
  if(l.sep)return{sep:1};
  if(typeof l.n!=="string"||!ok(l.u))return null;
  return ok(l.k)?{n:l.n,u:l.u,k:l.k}:{n:l.n,u:l.u};
};
const clean=d=>Array.isArray(d)?d.filter(g=>g&&typeof g.n==="string"&&Array.isArray(g.l)).map(g=>({n:g.n,c:!!g.c,i:typeof g.i==="string"&&ICONS[g.i]?g.i:"",l:g.l.map(cl).filter(Boolean).slice(0,MAX*2)})):null;

// reglages importes ou lus du localStorage: seules les cles connues, avec le bon type
const pickS=r=>{
  const o={};
  if(!r||typeof r!=="object")return o;
  for(const k in r){
    const v=r[k];
    const good=k==="eng"?(typeof v==="number"||typeof v==="string"):(k==="v"||k==="nb")?Number.isInteger(v):Object.hasOwn(SD,k)&&(Array.isArray(SD[k])?Array.isArray(v):typeof v===typeof SD[k]);
    if(good)o[k]=v;
  }
  if(typeof o.name==="string")o.name=o.name.slice(0,30);
  return o;
};

// identifiant stable d'un moteur: hote pour les integres (ne pas le renommer), "c:"+url pour les perso
const eid=i=>i<NB?E[i][2]:"c:"+E[i][1];
const cleanCe=a=>{
  const seen=new Set();
  return(Array.isArray(a)?a:[]).filter(c=>Array.isArray(c)&&c.length>=5&&c.slice(0,5).every(x=>typeof x==="string")&&ok(c[1])&&!seen.has(c[1])&&seen.add(c[1])).slice(0,12).map(c=>[c[0].slice(0,20),c[1],host(c[1]),c[3],c[4]]);
};
const NB0=8; // ancien format: nombre de moteurs integres avant l'ajout des moteurs desactives par defaut
// format stocke (v2): ord, hid, eng en identifiants. En memoire: index dans E. thaw convertit (et migre l'ancien format par index)
function thaw(s){
  s.ce=cleanCe(s.ce);E.length=NB;E.push(...s.ce);
  const a=x=>Array.isArray(x)?x:[];
  if(s.v===2){
    const ix=id=>E.findIndex((_,i)=>eid(i)===id),m=x=>a(x).map(ix).filter(i=>i>=0);
    s.ord=m(s.ord);s.hid=m(s.hid);s.eng=ix(s.eng);
    // moteur integre inconnu du profil (ajoute depuis): masque par defaut
    for(let i=0;i<NB;i++)if(!s.ord.includes(i)){s.ord.push(i);s.hid.push(i)}
  }else{
    // Startpage (13) et Yahoo (14) retires, on decale les index suivants
    if(s.nb===17){const f=i=>i>14?i-2:i,g=x=>a(x).filter(i=>i!==13&&i!==14).map(f);s.ord=g(s.ord);s.hid=g(s.hid);s.eng=s.eng===13||s.eng===14?0:f(s.eng);s.nb=15}
    const o=Number.isInteger(s.nb)?s.nb:NB0;
    if(o<NB){
      const f=i=>i>=o?i+NB-o:i;
      s.ord=a(s.ord).map(f);s.hid=a(s.hid).map(f);if(Number.isInteger(s.eng))s.eng=f(s.eng);
      for(let i=o;i<NB;i++)s.hid.push(i);
    }
  }
  s.v=2;delete s.nb;
  return s;
}

let D=clean(load("sp",null))||clean(DEF);
let S={...SD,...pickS(load("sps",{}))};
try{if(!localStorage.sps){const e=parseInt(localStorage.spe);if(e>=0)S.eng=e}}catch{}
S=thaw(S);
const vis=()=>S.ord.filter(i=>!S.hid.includes(i));
function engInit(){
  S.ce=cleanCe(S.ce);E.length=NB;E.push(...S.ce);
  const n=E.length,v=a=>(Array.isArray(a)?a:[]).filter((i,k,l)=>Number.isInteger(i)&&i>=0&&i<n&&l.indexOf(i)===k);
  S.ord=v(S.ord);for(let i=0;i<n;i++)if(!S.ord.includes(i))S.ord.push(i);
  S.hid=v(S.hid);if(S.hid.length>=n)S.hid=[];
  if(!(S.eng>=0&&S.eng<n)||S.hid.includes(S.eng))S.eng=vis()[0];
}
engInit();
const ser=()=>({...S,v:2,ord:S.ord.map(eid),hid:S.hid.map(eid),eng:eid(S.eng)});
const saveS=()=>{if(!store("sps",ser()))toast(FULL)};
