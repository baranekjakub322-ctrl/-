"""Reproducible content manifest and ZIP. Run after npm test && npm run report."""
from pathlib import Path
import hashlib,json,zipfile,sys
root=Path(__file__).resolve().parent.parent
summary=json.loads((root/'wyniki_v24/podsumowanie_v24.json').read_text())
run=json.loads((root/'wyniki_v24/run.json').read_text())
assert not summary['failed'] and not run['failed'] and summary['suites']==21
for file,digest in run['hashes'].items():
    assert hashlib.sha256((root/file).read_bytes()).hexdigest()==digest, file
required=['README_V24.md','RAPORT_TESTOW_V24.md','POROWNANIE_V23_V24.md','DIAGNOZA_REGRESJI_V23.md','BENCHMARK_28_V23_V24.md','BENCHMARK_1008_V23_V24.md','ANALIZA_10KM_3DNI.md','ZMIANY_ALGORYTMU_V24.md','OGRANICZENIA_V24.md','REKOMENDACJE_V25.md','baseline/RunPlanner_V23.zip']
assert all((root/f).is_file() for f in required)
exclude={'manifest_v24.sha256'}
files=sorted(p for p in root.rglob('*') if p.is_file() and p.name not in exclude and '__pycache__' not in p.parts and '.git' not in p.parts)
manifest=''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(root))+'\n' for p in files)
(root/'manifest_v24.sha256').write_text(manifest)
files.append(root/'manifest_v24.sha256')
output=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root.parents[1]/'RunPlanner_V24.zip'
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in files:
        info=zipfile.ZipInfo('RunPlanner_V24/'+str(p.relative_to(root)),date_time=(2026,11,3,0,0,0))
        info.external_attr=(0o100755 if p.name.endswith('.sh') else 0o100644)<<16
        info.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(info,p.read_bytes(),compresslevel=9)
with zipfile.ZipFile(output) as z:
    assert z.testzip() is None
    for line in manifest.splitlines():
        digest,file=line.split('  ',1)
        assert hashlib.sha256(z.read('RunPlanner_V24/'+file)).hexdigest()==digest, file
sha=hashlib.sha256(output.read_bytes()).hexdigest()
output.with_suffix('.zip.sha256').write_text(sha+'  '+output.name+'\n')
print(json.dumps({'path':str(output),'files':len(files),'bytes':output.stat().st_size,'sha256':sha},indent=2))
