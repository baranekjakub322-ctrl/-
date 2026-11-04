#!/usr/bin/env python3
"""Package only a completed run. Losslessly compact concatenated gzip JSONL first."""
import gzip,hashlib,json,pathlib,sys,tempfile,zipfile
root=pathlib.Path(__file__).resolve().parent.parent
run=json.loads((root/'wyniki_v26/run_v26.json').read_text())
summary=json.loads((root/'wyniki_v26/podsumowanie_v26.json').read_text())
assert run['failed']==0 and run['passed']==8 and len(run['results'])==8
assert summary['failed']==0
for name,digest in run['hashes'].items():
 assert hashlib.sha256((root/name).read_bytes()).hexdigest()==digest,name
required=['README_V26.md','ZMIANY_V25_V26.md','DIAGNOZA_V25_V26.md','BENCHMARK_28_V25_V26.md','BENCHMARK_1008_V25_V26.md','BENCHMARK_1008_V25_V26.json','REGRESJE_V26.json','ANALIZA_10KM_3DNI_V26.md','ANALIZA_MARATON_V26.md','RAPORT_ADAPTACJI_V26.md','RAPORT_TESTOW_V26.md','AUDYT_BEZPIECZENSTWA_V26.md','OGRANICZENIA_V26.md','REKOMENDACJE_V27.md','planGenerator_v26.js','planGenerator_v25.js','scoring/v23.mjs','scoring/v25.mjs']
for name in required:assert (root/name).is_file(),name
# Gzip member boundaries are transport metadata; uncompressed JSONL bytes stay identical.
for p in root.rglob('*.ndjson.gz'):
 before=hashlib.sha256()
 temp=p.with_suffix('.repacked')
 with gzip.open(p,'rb') as source,open(temp,'wb') as raw:
  with gzip.GzipFile(fileobj=raw,mode='wb',compresslevel=9,mtime=0,filename='') as target:
   while chunk:=source.read(1024*1024):before.update(chunk);target.write(chunk)
 after=hashlib.sha256()
 with gzip.open(temp,'rb') as f:
  while chunk:=f.read(1024*1024):after.update(chunk)
 assert before.digest()==after.digest()
 temp.replace(p)
archive=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else root.parent.parent.parent/'RunPlanner_V26.zip').resolve()
archive.parent.mkdir(parents=True,exist_ok=True)
obsolete={'manifest_v24.sha256','manifest_v25.sha256'}
skip_dirs={'__pycache__','node_modules','.git','przyklady','przyklady_v23','przyklady_v24','przyklady_v25'}
files=sorted(p for p in root.rglob('*') if p.is_file() and p.resolve()!=archive and p.name!='SHA256SUMS' and p.name not in obsolete and p.suffix not in {'.zip','.pyc','.repacked'} and not any(part in skip_dirs for part in p.relative_to(root).parts))
manifest=''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(root).as_posix()+'\n' for p in files)
(root/'SHA256SUMS').write_text(manifest)
files.append(root/'SHA256SUMS')
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for p in sorted(files):
  info=zipfile.ZipInfo('RunPlanner_V26/'+p.relative_to(root).as_posix(),date_time=(2026,11,4,0,0,0));info.external_attr=(0o100755 if p.suffix in {".sh",".py"} else 0o100644)<<16;info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,p.read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 for line in manifest.splitlines():
  digest,name=line.split('  ',1);assert hashlib.sha256(z.read('RunPlanner_V26/'+name)).hexdigest()==digest
result={'file':archive.name,'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'files':len(files),'manifestVerified':len(files)-1,'zipIntegrity':'PASS'}
archive.with_suffix('.zip.sha256').write_text(result['sha256']+'  '+archive.name+'\n')
print(json.dumps(result,indent=2))
