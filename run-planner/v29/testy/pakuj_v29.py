#!/usr/bin/env python3
import hashlib,json,sys,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
out=Path(sys.argv[1] if len(sys.argv)>1 else '../../RunPlanner_V29.zip').resolve()
summary=json.loads((root/'wyniki_v29/podsumowanie_v29.json').read_text())
if not summary['ready']: raise SystemExit('Nie pakuję wersji jako gotowej: testy FAIL')
run=json.loads((root/'wyniki_v29/run_v29.json').read_text())
if run['failed']:raise SystemExit('Końcowy przebieg ma FAIL')
for name,digest in run['hashes'].items():
 if hashlib.sha256((root/name).read_bytes()).hexdigest()!=digest:raise SystemExit('Źródła zmienione po testach: '+name)
for item in summary['production']:
 if hashlib.sha256((root/item['file']).read_bytes()).hexdigest()!=item['sha256']:raise SystemExit('Raport nie opisuje bieżących źródeł')
if summary['statistics']!=json.loads((root/'wyniki_v29/benchmark_v29.json').read_text())['statistics']:raise SystemExit('Raport benchmarku jest nieaktualny')
files=sorted(p for p in root.rglob('*') if p.is_file() and p!=out and '.git' not in p.parts and '__pycache__' not in p.parts and not any(q.startswith('przyklady') for q in p.relative_to(root).parts) and p.suffix!='.zip')
checks=''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(root))+'\n' for p in files if p.name!='SHA256SUMS')
(root/'SHA256SUMS').write_text(checks)
files=sorted(set(files+[root/'SHA256SUMS']))
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as z:
 for p in files:z.write(p,Path('RunPlanner_V29')/p.relative_to(root))
with zipfile.ZipFile(out) as z:
 if z.testzip() is not None:raise SystemExit('CRC FAIL')
 for line in checks.splitlines():
  digest,name=line.split('  ',1)
  if hashlib.sha256(z.read('RunPlanner_V29/'+name)).hexdigest()!=digest:raise SystemExit('SHA FAIL '+name)
result={'file':str(out),'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'files':len(files),'crc':'PASS','allFilesSha256':'PASS','ready':True}
out.with_suffix('.zip.sha256').write_text(result['sha256']+'  '+out.name+'\n')
print(json.dumps(result,indent=2))
