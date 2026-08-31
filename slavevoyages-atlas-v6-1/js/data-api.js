/* Client-side API: local IndexedDB first, static GitHub Pages artifacts second. */
window.SVAPI=(()=>{
  const BASE='./data/';
  async function fetchJSON(file,options={}){const r=await fetch(BASE+file,{cache:'no-cache',...options});if(!r.ok)throw new Error(`Unable to load ${file} (${r.status})`);return r.json()}
  async function manifest(){return fetchJSON('manifest.json')}
  async function loadVoyages({onProgress}={}){
    const m=await manifest();
    const version=m.dataset_version||m.source_sha256||m.generated||'unknown';
    const localVersion=await SVDB.get('dataset-version');
    const local=await SVDB.allRecords();
    if(local.length&&localVersion===version){onProgress?.({stage:'indexeddb',current:local.length,total:local.length});return local}
    if(!navigator.onLine){if(local.length)return local;throw new Error('Dataset is not cached and the device is offline.')}
    const chunks=m.delivery?.chunks||[];
    await SVDB.clear();
    let all=[];
    if(chunks.length){for(let i=0;i<chunks.length;i++){const rows=await fetchJSON(chunks[i].file);await SVDB.putRecords(rows);all.push(...rows);onProgress?.({stage:'download',current:i+1,total:chunks.length,records:all.length})}}else{all=await fetchJSON('voyages.json');await SVDB.putRecords(all);onProgress?.({stage:'download',current:1,total:1,records:all.length})}
    await SVDB.put('dataset-version',version);await SVDB.put('manifest',m);return all;
  }
  async function loadStatic(name){const cached=await SVDB.get(`static:${name}`);try{const fresh=await fetchJSON(name);await SVDB.put(`static:${name}`,fresh);return fresh}catch(e){if(cached!==undefined)return cached;throw e}}
  function worker(rows){const w=new Worker('./js/worker.js');w.postMessage({type:'load',rows});return w}
  return {manifest,loadVoyages,loadStatic,worker};
})();
