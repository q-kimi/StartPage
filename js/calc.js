/* calculatrice de la barre de recherche: + - * / ^ et parentheses, sans eval (CSP). null si ce n'est pas un calcul */
const calc=t=>{
  const s=t.replace(/\s+/g,"").replace(/,/g,".").replace(/[x×]/g,"*").replace(/÷/g,"/");
  if(!/^[\d.+\-*/^()]+$/.test(s)||!/[\d.)][+\-*/^]/.test(s))return null;
  let i=0;
  const prim=()=>{
    if(s[i]==="("){i++;const v=ex();if(s[i++]!==")")throw 0;return v}
    const m=/^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));if(!m)throw 0;i+=m[0].length;return +m[0];
  };
  const un=()=>s[i]==="-"?(i++,-un()):s[i]==="+"?(i++,un()):pw();
  const pw=()=>{const b=prim();return s[i]==="^"?(i++,b**un()):b};
  const tm=()=>{let v=un();while(s[i]==="*"||s[i]==="/")v=s[i++]==="*"?v*un():v/un();return v};
  const ex=()=>{let v=tm();while(s[i]==="+"||s[i]==="-")v=s[i++]==="+"?v+tm():v-tm();return v};
  try{const v=ex();return i===s.length&&Number.isFinite(v)?+v.toPrecision(12):null}catch{return null}
};
