(()=>{async function j(u){const r=await fetch(u,{cache:'no-cache'});if(!r.ok)throw Error(`${r.status} ${u}`);return r.json()}
async function sync(){if(!navigator.onLine)throw Error('Offline');const m=await j('./data/manifest.json'),a=[];
if(Array.isArray(m.chunks))for(const c of m.chunks)a.push(...await j('./data/chunks/'+c));
else if(m.dataset_file)a.push(...await j('./data/'+m.dataset_file));else throw Error('No dataset artifact in manifest');
await SVStore.replaceRecords(a);await SVStore.metadata('manifest',m);return a}
async function load(){const a=await SVStore.records();return a.length?a:sync()}window.SVSync={load,sync}})();
