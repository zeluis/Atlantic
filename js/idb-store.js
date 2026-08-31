(()=>{const DB='slavevoyages-atlas',VER=4;let opening;
function open(){if(opening)return opening;opening=new Promise((ok,no)=>{const r=indexedDB.open(DB,VER);
r.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains('metadata'))d.createObjectStore('metadata',{keyPath:'key'});
if(!d.objectStoreNames.contains('voyages')){const s=d.createObjectStore('voyages',{keyPath:'voyageid'});['yearaf','yearam','yeardep'].forEach(k=>s.createIndex(k,k))}
if(!d.objectStoreNames.contains('aggregates'))d.createObjectStore('aggregates',{keyPath:'key'})};
r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)});return opening}
async function metadata(k,v){const d=await open();return new Promise((ok,no)=>{const t=d.transaction('metadata',v===undefined?'readonly':'readwrite'),s=t.objectStore('metadata');
if(v===undefined){const r=s.get(k);r.onsuccess=()=>ok(r.result?.value??null);r.onerror=()=>no(r.error)}else{s.put({key:k,value:v});t.oncomplete=ok;t.onerror=()=>no(t.error)}})}
async function replaceRecords(a){const d=await open();return new Promise((ok,no)=>{const t=d.transaction('voyages','readwrite'),s=t.objectStore('voyages');s.clear();for(const r of a)if(r?.voyageid!=null)s.put(r);t.oncomplete=ok;t.onerror=()=>no(t.error)})}
async function records(){const d=await open();return new Promise((ok,no)=>{const r=d.transaction('voyages').objectStore('voyages').getAll();r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
window.SVStore={open,metadata,replaceRecords,records}})();
