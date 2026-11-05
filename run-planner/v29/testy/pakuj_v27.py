#!/usr/bin/env python3
"""Reproducible ZIP metadata; content must come from a completed matching test run."""
import hashlib,json,pathlib,sys,zipfile
root=pathlib.Path(__file__).resolve().parent.parent
run=json.loads((root/'wyniki_v27/run_v27.json').read_text());summary=json.loads((root/'wyniki_v27/podsumowanie_v27.json').read_text())
assert run['passed']==11 and run['failed']==0 and len(run['results'])==11
assert summary['failed']==0
for name,digest in run['hashes'].items():assert hashlib.sha256((root/name).read_bytes()).hexdigest()==digest,name
required=['01_START_TUTAJ_V27.md','02_ARCHITEKTURA_V27.md','03_BENCHMARK_1008_V26_V27.md','03_BENCHMARK_1008_V26_V27.json','03_BENCHMARK_1008_V26_V27.csv','04_BENCHMARK_28_V26_V27.md','05_AUDYT_10_KRYTERIOW_V27.md','06_ANALIZA_10KM_3DNI_V26_V27.md','07_ANALIZA_MARATON_V26_V27.md','08_ANALIZA_40_PROFILI.md','09_REGRESJE_I_REMISY_V27.md','09_REGRESJE_I_REMY_V27.md','10_ADAPTACJA_V27.md','11_RAPORT_TESTOW_V27.md','12_WYDAJNOSC_V27.md','13_OGRANICZENIA_V27.md','14_REKOMENDACJE_V28.md','15_CHANGELOG_V27.md','PROVENANCE_V27.json','wyniki_v27/full-plans.jsonl.br','planGenerator_v26.js','planGenerator_v27.js','dane/holdout224.json']
for name in required:assert(root/name).is_file(),name
archive=pathlib.Path(sys.argv[1]if len(sys.argv)>1 else root.parent/'RunPlanner_V27.zip').resolve();archive.parent.mkdir(parents=True,exist_ok=True)
skip={'__pycache__','node_modules','.git','przyklady','przyklady_v23','przyklady_v24','przyklady_v25','przyklady_v26'}
obsolete={'SHA256SUMS','manifest_v24.sha256','manifest_v25.sha256','manifest_v26.sha256'}
files=sorted(p for p in root.rglob('*')if p.is_file()and p.resolve()!=archive and p.name not in obsolete and p.suffix not in {'.zip','.pyc'}and not any(part in skip for part in p.relative_to(root).parts))
manifest=''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(root).as_posix()+'\n'for p in files);(root/'SHA256SUMS').write_text(manifest);files.append(root/'SHA256SUMS')
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9)as z:
 for p in sorted(files):
  info=zipfile.ZipInfo('RunPlanner_V27/'+p.relative_to(root).as_posix(),date_time=(2026,11,4,0,0,0));info.external_attr=(0o100755 if p.suffix in {'.sh','.py'}else 0o100644)<<16;info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,p.read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
with zipfile.ZipFile(archive)as z:
 assert z.testzip()is None
 for line in manifest.splitlines():
  digest,name=line.split('  ',1);assert hashlib.sha256(z.read('RunPlanner_V27/'+name)).hexdigest()==digest,name
result={'file':archive.name,'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'files':len(files),'manifestFilesVerified':len(files)-1,'integrity':'PASS'}
archive.with_suffix('.zip.sha256').write_text(result['sha256']+'  '+archive.name+'\n');print(json.dumps(result,indent=2))
