let records=[];
const num=(v)=>{const n=Number(v);return Number.isFinite(n)?n:0};
const value=(r,a,b)=>r[a]??r[b]??null;
function match(r,f){
  const y=num(value(r,'yearaf','yearam')??r.yeardep); if(f.from!==''&&y<num(f.from))return false;if(f.to!==''&&y>num(f.to))return false;
  if(f.origin&&String(value(r,'majbyimp','mjbyptimp'))!==String(f.origin))return false;
  if(f.destination&&String(value(r,'mjselimp1','mjselimp'))!==String(f.destination))return false;
  if(f.carrier&&String(value(r,'natinimp','national'))!==String(f.carrier))return false;
  if(f.evidence==='observed'&&(r.slaximp!=null||r.slamimp!=null))return false;
  if(f.evidence==='imputed'&&(r.slaximp==null&&r.slamimp==null))return false;
  return true;
}
function rank(rows,key){const m=new Map();for(const r of rows){const v=value(r,key[0],key[1]);if(v!=null&&v!=='')m.set(v,(m.get(v)||0)+1)}return [...m].map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value).slice(0,15)}
function query(f){const rows=records.filter(r=>match(r,f||{}));const years=new Map();let embarked=0,disembarked=0,loss=0,denom=0;for(const r of rows){const y=value(r,'yearaf','yearam')??r.yeardep;if(y!=null)years.set(y,(years.get(y)||0)+1);const e=value(r,'slaximp','tslavesd');const a=value(r,'slamimp','slaarriv');embarked+=num(e);disembarked+=num(a);if(e!=null&&a!=null&&num(e)>0){loss+=Math.max(0,num(e)-num(a));denom+=num(e)}}return{total:rows.length,embarked,disembarked,averageMortalityRate:denom?loss/denom*100:null,years:[...years].map(([year,value])=>({year,value})).sort((a,b)=>a.year-b.year),origins:rank(rows,['majbyimp','mjbyptimp']),destinations:rank(rows,['mjselimp1','mjselimp']),carriers:rank(rows,['natinimp','national']),rows:rows.slice(0,5000)}}
self.onmessage=e=>{try{if(e.data.type==='load'){records=e.data.rows||[];postMessage({type:'ready',count:records.length})}if(e.data.type==='query')postMessage({type:'result',result:query(e.data.filters||{})})}catch(err){postMessage({type:'error',message:err.message})}};
