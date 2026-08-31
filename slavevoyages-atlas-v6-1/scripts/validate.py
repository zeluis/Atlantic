#!/usr/bin/env python3
import json,sys
from pathlib import Path
D=Path(__file__).resolve().parents[1]/'data'
rows=json.loads((D/'voyages.json').read_text())
m=json.loads((D/'manifest.json').read_text())
errors=[]; warnings=[]
ids=[]
for i,r in enumerate(rows):
    if r.get('id') is None: errors.append(f'row {i}: missing id')
    ids.append(r.get('id'))
    if r.get('voyageid') != r.get('id'): errors.append(f'row {i}: identity mismatch')
    for k in ('yearaf','yearam','yeardep'):
        v=r.get(k)
        if v is not None and not (1400 <= v <= 1900): warnings.append(f'row {i}: {k}={v}')
    for k in ('tslavesd','slaximp','slaarriv','slamimp'):
        v=r.get(k)
        if v is not None and v < 0: errors.append(f'row {i}: negative {k}')
if len(ids)!=len(set(ids)): errors.append('duplicate voyage IDs remain')
expected=int(m.get('record_count',-1))
if expected != len(rows): errors.append('manifest record_count mismatch')
if int(m.get('source_columns',0)) < 20: errors.append('source column count implausibly small')

report={'status':'passed' if not errors else 'failed','records':len(rows),'errors':errors,'warnings':warnings[:100],'warning_count':len(warnings)}
(D/'validation.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
if errors: sys.exit(1)
