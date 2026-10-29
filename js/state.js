const clean=d=>Array.isArray(d)?d.filter(g=>g&&typeof g.n==="string"&&Array.isArray(g.l)).map(g=>({n:g.n,c:!!g.c,i:typeof g.i==="string"&&ICONS[g.i]?g.i:"",l:g.l.filter(l=>Array.isArray(l)&&typeof l[0]==="string"&&(ok(l[1])||l[1]==="---")).slice(0,MAX*2).map(l=>l[3]&&ok(l[3])?[l[0],l[1],0,l[3]]:[l[0],l[1]])})):null;

let D=clean(load("sp",null))||DEF;
let S={...SD,...load("sps",{})};
try{if(!localStorage.sps){const e=parseInt(localStorage.spe);if(e>=0)S.eng=e}}catch{}
const vis=()=>S.ord.filter(i=>!S.hid.includes(i));
const NB0=8; // nombre de moteurs integres avant l'ajout des moteurs desactives par defaut
function engInit(){
  E.length=NB;
  // migration: Startpage (13) et Yahoo (14) retires, on decale les index suivants
  if(S.nb===17){const f=i=>i>14?i-2:i,g=x=>(Array.isArray(x)?x:[]).filter(i=>i!==13&&i!==14).map(f);S.ord=g(S.ord);S.hid=g(S.hid);S.eng=S.eng===13||S.eng===14?0:f(S.eng);S.nb=15}
  // migration: les nouveaux moteurs integres s'inserent avant les moteurs perso, desactives par defaut
  const o=Number.isInteger(S.nb)?S.nb:NB0;
  if(o<NB){
    const f=i=>i>=o?i+NB-o:i,a=x=>Array.isArray(x)?x:[];
    S.ord=a(S.ord).map(f);S.hid=a(S.hid).map(f);if(Number.isInteger(S.eng))S.eng=f(S.eng);
    for(let i=o;i<NB;i++)S.hid.push(i);
  }
  S.nb=NB;
  S.ce=(Array.isArray(S.ce)?S.ce:[]).filter(c=>Array.isArray(c)&&c.slice(0,5).every(x=>typeof x==="string")&&ok(c[1])).slice(0,12).map(c=>c.slice(0,5));
  E.push(...S.ce);
  const n=E.length,v=(a,u)=>(Array.isArray(a)?a:[]).filter((i,k,l)=>Number.isInteger(i)&&i>=0&&i<n&&l.indexOf(i)===k);
  S.ord=v(S.ord);for(let i=0;i<n;i++)if(!S.ord.includes(i))S.ord.push(i);
  S.hid=v(S.hid);if(S.hid.length>=n)S.hid=[];
  if(!(S.eng>=0&&S.eng<n)||S.hid.includes(S.eng))S.eng=vis()[0];
}
engInit();

