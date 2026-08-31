#!/usr/bin/env python3
import json,sys
from pathlib import Path
D=Path(__file__).resolve().parents[1]/'data'; rows=json.loads((D/'voyages.json').read_text()); errors=[]; ids=set()
required=['voyageid','yearaf','yearam','yeardep','tslavesd','slaximp','slaarriv','slamimp','majbyimp','mjselimp1']
for i,r in enumerate(rows):
    vid=r.get('voyageid')
    if vid is None: errors.append(f'missing voyageid at row {i}')
    if vid in ids: errors.append(f'duplicate voyageid {vid}')
    ids.add(vid)
    for k in required:
        if k not in r: errors.append(f'missing field {k} at row {i}')
    for k in ('yearaf','yearam','yeardep'):
        if r.get(k) is not None and not 1400<=r[k]<=1900: errors.append(f'invalid {k} at row {i}')
    for k in ('tslavesd','slaximp','slaarriv','slamimp','tonnage','crew'):
        if r.get(k) is not None and r[k]<0: errors.append(f'negative {k} at row {i}')
if errors:
    print('\n'.join(errors[:100]),file=sys.stderr);raise SystemExit(1)
print(f'VALID: {len(rows):,} canonical voyages')
