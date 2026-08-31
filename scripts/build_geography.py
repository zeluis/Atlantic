#!/usr/bin/env python3
import argparse,csv,json,re
from pathlib import Path
PAT=re.compile(r'^\\d{5}$')
def main():
    p=argparse.ArgumentParser()
    p.add_argument('--csv',required=True); p.add_argument('--out',default='data/geography/codes.json')
    a=p.parse_args(); out=Path(a.out); out.parent.mkdir(parents=True,exist_ok=True)
    codes=set()
    with open(a.csv,encoding='utf-8-sig',newline='') as f:
        r=csv.DictReader(f)
        fields=[x for x in (r.fieldnames or []) if any(t in x.lower() for t in ('port','place','reg','majby','mjby','mjsel'))]
        for row in r:
            for k in fields:
                v=str(row.get(k,'')).strip()
                if PAT.fullmatch(v): codes.add(v)
    records={c:{'code':c,'broad_region_code':c[0],'specific_region_code':c[:3],
                 'place_code':c[3:],'source':'SlaveVoyages geographic coding system'} for c in sorted(codes)}
    out.write_text(json.dumps({'schema_version':'1.2.0','records':records},indent=2),encoding='utf-8')
if __name__=='__main__': main()
