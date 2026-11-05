#!/usr/bin/env python3
"""Pack only a fully executed, source-matching V28 release, then verify every file."""
from pathlib import Path
import json,hashlib,zipfile,sys
root=Path(__file__).resolve().parent.parent
run=json.loads((root/'wyniki_v28/run_v28.json').read_text());summary=json.loads((root/'wyniki_v28/podsumowanie_v28.json').read_text())
assert run['passed']==17 and run['failed']==0 and len(run['results'])==17
assert summary['failed']==0 and summary['started']==run['started'] and summary['version']=='28.0.0'
for f,h in run['hashes'].items():assert hashlib.sha256((root/f).read_bytes()).hexdigest()==h,f
required=['START_TUTAJ_V28.md','DIAGNOZA_PRZYCZYN_V27.md','MARATON_4_5_DNI_PRZED_PO.md','BENCHMARK_28_V27_V28.csv','BENCHMARK_28_V27_V28.md','BENCHMARK_1008_V27_V28.csv','BENCHMARK_1008_V27_V28.json','BENCHMARK_1008_V27_V28.md','HOLDOUT_64_224_V27_V28.md','AUDYT_10_KRYTERIOW_V28.md','ANALIZA_10KM_3DNI_V27_V28.md','ADAPTACJA_V28.md','RAPORT_REGRESJI_V28.md','RAPORT_TESTOW_V28.md','WYDAJNOSC_V28.md','OGRANICZENIA_V28.md','REKOMENDACJE_V29.md','TABELA_DECYZJI_V28.md','PRZEGLAD_47_PROFILI_I_40_ANONIMOWYCH_V28.md','PROVENANCE_V28.json','wyniki_v28/full-plans.jsonl.br','planGenerator_v28.js','planGenerator_v27.js','planGenerator_v26.js','wyniki_bazowe_v27/full-plans.jsonl.br']
for f in required:assert(root/f).is_file(),f
archive=Path(sys.argv[1]if len(sys.argv)>1 else root.parent.parent/'RunPlanner_V28.zip').resolve();archive.parent.mkdir(parents=True,exist_ok=True)
skip={'node_modules','.git','__pycache__','przyklady','przyklady_v23','przyklady_v24','przyklady_v25','przyklady_v26','przyklady_v27'}
obsolete={'SHA256SUMS','manifest_v24.sha256','manifest_v25.sha256','manifest_v26.sha256','manifest_v27.sha256'}
files=sorted(p for p in root.rglob('*')if p.is_file()and p.resolve()!=archive and p.name not in obsolete and p.suffix not in{'.zip','.pyc'}and not any(x in skip for x in p.relative_to(root).parts))
manifest=''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(root).as_posix()+'\n'for p in files);(root/'SHA256SUMS').write_text(manifest);files.append(root/'SHA256SUMS')
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9)as z:
 for p in sorted(files):
  info=zipfile.ZipInfo('RunPlanner_V28/'+p.relative_to(root).as_posix(),date_time=(2026,11,4,0,0,0));info.external_attr=(0o100755 if p.suffix in{'.sh','.py'}else 0o100644)<<16;info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,p.read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
with zipfile.ZipFile(archive)as z:
 assert z.testzip()is None
 for line in manifest.splitlines():
  h,n=line.split('  ',1);assert hashlib.sha256(z.read('RunPlanner_V28/'+n)).hexdigest()==h,n
result={'file':archive.name,'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'files':len(files),'manifestFilesVerified':len(files)-1,'crc':'PASS','integrity':'PASS'}
archive.with_suffix('.zip.sha256').write_text(result['sha256']+'  '+archive.name+'\n');print(json.dumps(result,indent=2))
