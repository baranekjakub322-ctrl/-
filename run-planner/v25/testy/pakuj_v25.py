"""Reproducible content manifest and ZIP. Run after npm test && npm run report."""
from pathlib import Path
import hashlib,json,zipfile,sys
root=Path(__file__).resolve().parent.parent
summary=json.loads((root/'wyniki_v25/podsumowanie_v25.json').read_text())
run=json.loads((root/'wyniki_v25/run.json').read_text())
assert not summary['failed'] and not run['failed'] and summary['suites']==28
for file,digest in run['hashes'].items():
    assert hashlib.sha256((root/file).read_bytes()).hexdigest()==digest, file
required=['README_V25.md','ZMIANY_V24_V25.md','DIAGNOZA_89_REGRESJI_V24.md','BENCHMARK_28_V24_V25.md','BENCHMARK_1008_V24_V25.md','ANALIZA_10KM_3DNI_V25.md','ANALIZA_MARATON_V25.md','RAPORT_ADAPTACJI_V25.md','SYSTEM_OCENIANIA_V25.md','RAPORT_TESTOW_V25.md','OGRANICZENIA_V25.md','REKOMENDACJE_V26.md','baseline/RunPlanner_V24.zip']
assert all((root/f).is_file() for f in required)
output=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root.parents[1]/'RunPlanner_V25.zip'
exclude={'manifest_v25.sha256'}
files=sorted(p for p in root.rglob('*') if p.is_file() and p.resolve() not in {output,output.with_suffix('.zip.sha256')} and p.name not in exclude and '__pycache__' not in p.parts and '.git' not in p.parts)
manifest=''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(root))+'\n' for p in files)
(root/'manifest_v25.sha256').write_text(manifest)
files.append(root/'manifest_v25.sha256')
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in files:
        info=zipfile.ZipInfo('RunPlanner_V25/'+str(p.relative_to(root)),date_time=(2026,11,3,0,0,0))
        info.external_attr=(0o100755 if p.name.endswith('.sh') else 0o100644)<<16
        info.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(info,p.read_bytes(),compresslevel=9)
with zipfile.ZipFile(output) as z:
    assert z.testzip() is None
    for line in manifest.splitlines():
        digest,file=line.split('  ',1)
        assert hashlib.sha256(z.read('RunPlanner_V25/'+file)).hexdigest()==digest, file
sha=hashlib.sha256(output.read_bytes()).hexdigest()
output.with_suffix('.zip.sha256').write_text(sha+'  '+output.name+'\n')
print(json.dumps({'path':str(output),'files':len(files),'bytes':output.stat().st_size,'sha256':sha},indent=2))
