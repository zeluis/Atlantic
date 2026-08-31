#!/usr/bin/env python3
import json
from pathlib import Path
D=Path(__file__).resolve().parents[1]/'data'; rows=json.loads((D/'voyages.json').read_text())
indexes={k:{} for k in ('yearaf','yearam','yeardep','national','majbyimp','mjselimp1')}
for i,r in enumerate(rows):
    for k in indexes:
        v=r.get(k)
        if v is None: continue
        key=str(v); indexes[k].setdefault(key,[]).append(i)
(D/'indexes.json').write_text(json.dumps(indexes,separators=(',',':')))
print('Indexes built:', ', '.join(f'{k}={len(v)}' for k,v in indexes.items()))
