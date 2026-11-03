import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
const start=Date.now(), out=path.resolve(process.env.WYNIKI || 'wyniki_v23');fs.mkdirSync(out,{recursive:true});
const names=process.env.TESTS_ONLY_LIGHT==='1'?['podstawowe']:['podstawowe','trudne','czulosc','regresje','czulosc_v21','jakosciowe','dostepnosc','porownanie28','porownanie_v19_v20','porownanie_v20_v21','sweep','skrypt_bledy','v22','porownanie_v21_v22','regresje_v22_v23','kalibracja_v23','v23','porownanie_v22_v23'];
if(process.env.EXTRA_TEST)names.push(process.env.EXTRA_TEST);
const hashes=Object.fromEntries(['planGenerator_v23.js','planGenerator_v22.js','model/training.mjs','model/policy_v23.mjs','model/quality_v23.mjs','model/adaptation_v23.mjs','scoring/v23.mjs','testy/lib.mjs','testy/miernik_v22.mjs','testy/v23.mjs','testy/benchmark_v23.mjs','testy/porownanie_v22_v23.mjs'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
const results=[];
for(const name of names){const file=name.endsWith('.mjs')?name:`testy/${name}.mjs`;console.log(`=== ${name}`);if(!fs.existsSync(file)){console.error(`brak pliku ${file}`);results.push({name,status:2});continue;}
const now=Date.now(),r=spawnSync(process.execPath,[file],{cwd:process.cwd(),env:{...process.env,GEN:process.env.GEN || 'planGenerator_v23.js',WYNIKI:out},encoding:'utf8',maxBuffer:10*1024*1024});
fs.writeFileSync(path.join(out,`log_${path.basename(name)}.txt`),(r.stdout||'')+(r.stderr||'')+(r.error?.message||''));process.stdout.write(r.stdout||'');process.stderr.write(r.stderr||'');results.push({name,status:r.status??2,signal:r.signal,error:r.error?.message,elapsedMs:Date.now()-now});if(r.status!==0&&process.env.STOP_ON_FAIL==='1')break;
}

for(const [file,hash] of Object.entries(hashes)) if(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==hash)results.push({name:`SOURCE_CHANGED:${file}`,status:2});
const summary={node:process.version,started:new Date(start).toISOString(),elapsedMs:Date.now()-start,hashes,results,passed:results.filter(r=>r.status===0).length,failed:results.filter(r=>r.status!==0).length};fs.writeFileSync(path.join(out,'run.json'),JSON.stringify(summary,null,2));
const failed=results.filter(r=>r.status!==0);console.log(failed.length?`NIEPOWODZENIE: ${failed.map(r=>r.name).join(', ')}`:`WYNIK: wszystkie ${results.length} zestawy testów zaliczone`);process.exitCode=failed.length?1:0;
