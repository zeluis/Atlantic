#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
D=Path(__file__).resolve().parents[1]/'data'; C=D/'chunks'; C.mkdir(exist_ok=True)
for p in C.glob('voyages-*.json'): p.unlink()
rows=json.loads((D/'voyages.json').read_text()); size=1000; chunks=[]
for i in range(0,len(rows),size):
    part=rows[i:i+size]; name=f'voyages-{i//size:04d}.json'; p=C/name
    p.write_text(json.dumps(part,separators=(',',':'),ensure_ascii=False))
    chunks.append({'file':f'chunks/{name}','records':len(part),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
m=json.loads((D/'manifest.json').read_text())
m['delivery']={'format':'chunked-json','chunk_size':size,'chunk_count':len(chunks),'chunks':chunks}
m['record_count']=len(rows)
m['artifacts']={}
for p in sorted(D.glob('*.json')):
    if p.name=='manifest.json': continue
    m['artifacts'][p.name]={'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
m['dataset_version']=hashlib.sha256(json.dumps(chunks,sort_keys=True).encode()).hexdigest()
m['delivery_ready']=True
(D/'manifest.json').write_text(json.dumps(m,indent=2,ensure_ascii=False))
print(f'Built {len(chunks)} chunks / {len(rows):,} records')
