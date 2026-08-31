/* Zero-runtime-dependency local data store. */
window.SVDB=(()=>{
  const NAME='slavevoyages-atlas', VERSION=4;
  const STORES={meta:'meta', voyages:'voyages', aggregates:'aggregates'};
  let opening;
  function open(){if(opening)return opening;opening=new Promise((resolve,reject)=>{const r=indexedDB.open(NAME,VERSION);r.onupgradeneeded=e=>{const db=e.target.result;if(!db.objectStoreNames.contains(STORES.meta))db.createObjectStore(STORES.meta,{keyPath:'key'});if(!db.objectStoreNames.contains(STORES.voyages)){const s=db.createObjectStore(STORES.voyages,{keyPath:'voyageid'});for(const k of ['yearaf','yearam','yeardep','majbyimp','mjbyptimp','mjselimp','mjselimp1','natinimp','national'])s.createIndex(k,k);}if(!db.objectStoreNames.contains(STORES.aggregates))db.createObjectStore(STORES.aggregates,{keyPath:'key'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return opening}
  async function tx(store,mode,fn){const db=await open();return new Promise((resolve,reject)=>{const t=db.transaction(store,mode);let value;try{value=fn(t.objectStore(store))}catch(e){reject(e);return}t.oncomplete=()=>resolve(value);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||new Error('IndexedDB transaction aborted'))})}
  async function get(key){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction(STORES.meta).objectStore(STORES.meta).get(key);r.onsuccess=()=>resolve(r.result?.value);r.onerror=()=>reject(r.error)})}
  async function put(key,value){return tx(STORES.meta,'readwrite',s=>s.put({key,value}))}
  async function clear(){return tx(STORES.voyages,'readwrite',s=>s.clear())}
  async function putRecords(rows){return tx(STORES.voyages,'readwrite',s=>{for(const r of rows)if(r?.voyageid!=null)s.put(r)})}
  async function allRecords(){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction(STORES.voyages).objectStore(STORES.voyages).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
  return {open,get,put,clear,putRecords,allRecords};
})();
