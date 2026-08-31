#!/usr/bin/env python3
"""Ingest the official SlaveVoyages expanded Trans-Atlantic CSV.

The official downloads page lists tastdb-exp-2019.csv as the comma-delimited
expanded dataset. The ingestion layer preserves every source column rather
than silently dropping variables that are not yet mapped into the dashboard.
"""
import argparse,csv,hashlib,io,json,os,re,sys,urllib.request
from datetime import datetime,timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]; DATA=ROOT/'data'
DEFAULT_URL='https://legacy.slavevoyages.org/documents/download/tastdb-exp-2019.csv'
SCHEMA=json.loads((DATA/'schema.json').read_text())
MISSING=set(SCHEMA.get('missing_values',[]))

def norm(s): return re.sub(r'[^a-z0-9_]','',str(s).strip().lower())

def getraw(url):
    req=urllib.request.Request(url,headers={'User-Agent':'SlaveVoyages-Atlas/1.1 data-refresh'})
    with urllib.request.urlopen(req,timeout=300) as r:
        raw=r.read()
        ctype=(r.headers.get('Content-Type') or '').lower()
    if raw.lstrip().startswith(b'<'):
        raise RuntimeError('Source returned HTML instead of CSV')
    return raw,ctype

def clean(v,t):
    if v is None:return None
    s=str(v).strip()
    if s in MISSING:return None
    if t=='string':return s
    if t=='integer':
        try:return int(float(s))
        except:return None
    if t=='number':
        try:return float(s.replace(',',''))
        except:return None
    return s

def infer_type(field):
    meta=SCHEMA.get('fields',{}).get(field)
    return meta.get('type','string') if meta else 'string'

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--input')
    ap.add_argument('--url',default=os.getenv('SV_SOURCE_URL') or DEFAULT_URL)
    a=ap.parse_args()
    if a.input:
        raw=Path(a.input).read_bytes(); source={'type':'local','location':str(Path(a.input).resolve())}
    else:
        raw,ctype=getraw(a.url); source={'type':'official-download','location':a.url,'content_type':ctype}

    digest=hashlib.sha256(raw).hexdigest()
    text=raw.decode('utf-8-sig',errors='replace')
    try:dialect=csv.Sniffer().sniff(text[:100000],delimiters=',;\t')
    except csv.Error:dialect=csv.excel
    rows=csv.DictReader(io.StringIO(text),dialect=dialect)
    headers=rows.fieldnames or []
    if len(headers)<20: raise RuntimeError(f'Unexpectedly small source schema: {len(headers)} columns')
    lookup={norm(h):h for h in headers if h}
    if 'voyageid' not in lookup: raise RuntimeError('VOYAGEID is missing from source')

    out=[]; ids=set(); dupes=0
    for row in rows:
        vid=clean(row.get(lookup['voyageid']),'integer')
        if vid is None: continue
        if vid in ids: dupes+=1; continue
        ids.add(vid)
        record={'id':vid}
        # Preserve the complete source schema, while typing known dashboard fields.
        raw_fields={}
        for h in headers:
            if not h: continue
            key=norm(h)
            raw_fields[key]=clean(row.get(h),infer_type(key))
        record['fields']=raw_fields
        for key,meta in SCHEMA.get('fields',{}).items():
            record[key]=raw_fields.get(norm(key))
        record['provenance']={
            'source_sha256':digest,
            'source_row_identity':vid,
            'source_dataset':'tastdb-exp-2019',
            'source_url':source['location']
        }
        out.append(record)

    years=[x.get('yearaf') for x in out if x.get('yearaf') is not None]
    manifest={
      'schema_version':'1.1.0',
      'dataset_version':'candidate',
      'dataset_id':'tastdb-exp-2019',
      'generated':datetime.now(timezone.utc).isoformat(),
      'record_count':len(out),
      'source_row_count':len(out)+dupes,
      'duplicate_ids_skipped':dupes,
      'source':source,
      'source_sha256':digest,
      'source_bytes':len(raw),
      'source_columns':len(headers),
      'source_columns_normalized':[norm(h) for h in headers if h],
      'yearaf_min':min(years) if years else None,
      'yearaf_max':max(years) if years else None,
      'status':'candidate-ingested'
    }
    (DATA/'voyages.json').write_text(json.dumps(out,separators=(',',':'),ensure_ascii=False))
    (DATA/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False))
    print(json.dumps(manifest,indent=2))

if __name__=='__main__': raise SystemExit(main())
