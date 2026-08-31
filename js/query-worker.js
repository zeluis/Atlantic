let rows=[];
const n=v=>{const x=Number(v);return Number.isFinite(x)?x:null};
function pass(r,f){const y=n(r.yearaf??r.yearam??r.yeardep),lo=f.yearFrom===''?-Infinity:Number(f.yearFrom),hi=f.yearTo===''?Infinity:Number(f.yearTo);
if(y!=null&&(y<lo||y>hi))return false;
if(f.origin&&String(r.majbyimp??r.majbyptimp??'')!==f.origin)return false;
if(f.destination&&String(r.mjselimp1??r.mjselimp??'')!==f.destination)return false;
if(f.national&&String(r.natinimp??r.national??'')!==f.national)return false;
if(f.evidence==='observed'&&(r.slaximp!=null||r.slamimp!=null))return false;
if(f.evidence==='imputed'&&(r.slaximp==null&&r.slamimp==null))return false;return true}
function aggregate(a){let e=0,d=0,l=0,den=0;for(const r of a){const x=n(r.tslavesd??r.slaximp),y=n(r.slaarriv??r.slamimp);if(x!=null)e+=x;if(y!=null)d+=y;if(x>0&&y!=null){l+=Math.max(0,x-y);den+=x}}
return {count:a.length,embarked:e,arrived:d,lossRate:den?100*l/den:null,rows:a}}
onmessage=e=>{try{if(e.data.type==='load'){rows=e.data.records||[];postMessage({type:'ready',count:rows.length})}
if(e.data.type==='query'){const a=rows.filter(r=>pass(r,e.data.filters||{}));postMessage({type:'result',requestId:e.data.requestId,result:aggregate(a)})}}
catch(x){postMessage({type:'error',message:x.message||String(x)})}};
