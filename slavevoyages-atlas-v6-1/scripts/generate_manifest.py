#!/usr/bin/env python3
import hashlib,json
from pathlib import Path
D=Path(__file__).resolve().parents[1]/'data'; m=json.loads((D/'manifest.json').read_text())
m['artifacts']={}
for p in sorted(D.glob('*.json')):
    if p.name=='manifest.json': continue
    m['artifacts'][p.name]={'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
m['validation']=json.loads((D/'validation.json').read_text()) if (D/'validation.json').exists() else None
m['pipeline_version']='1.1.0'; m['runtime_dependencies']=0; m['delivery_ready']=True
(D/'manifest.json').write_text(json.dumps(m,indent=2,ensure_ascii=False))
