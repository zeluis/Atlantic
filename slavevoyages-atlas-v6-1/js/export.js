(()=>{const esc=v=>`"${String(v??'').replaceAll('"','""')}`;
function csv(a){if(!a.length)return'';const c=[...new Set(a.flatMap(x=>Object.keys(x)))];return[c.map(esc).join(','),...a.map(x=>c.map(k=>esc(x[k])).join(','))].join('\r\n')}
function save(b,n){const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function download(rows,query,manifest){if(!rows.length)return;save(new Blob([csv(rows)],{type:'text/csv'}),'slavevoyages-query.csv');save(new Blob([JSON.stringify({query,dataset:manifest,exported_records:rows.length},null,2)],{type:'application/json'}),'slavevoyages-query.provenance.json')}
window.SVExport={download}})();
