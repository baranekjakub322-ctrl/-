import fs from 'node:fs';import crypto from 'node:crypto';import {performance} from 'node:perf_hooks';import {spawnSync} from 'node:child_process';
const input=JSON.parse(fs.readFileSync('wyniki_bazowe_v24/porownanie_v23_v24.json')).matrix28.map(r=>r.input),hash=crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
if(process.argv[2]==='worker'){
 const version=process.argv[3],G=await import(`../planGenerator_${version}.js`);for(const i of input.slice(0,4))G.generatePlan(i);global.gc?.();const startRss=process.memoryUsage().rss,times=[];
 for(let repeat=0;repeat<3;repeat++)for(const i of input){const now=performance.now(),p=G.generatePlan(i);times.push(performance.now()-now);if(!p.ok)throw Error('Plan failed in performance run');}
 times.sort((a,b)=>a-b);console.log(JSON.stringify({version,inputSha256:hash,executed:times.length,meanMs:times.reduce((a,b)=>a+b,0)/times.length,medianMs:times[Math.floor(times.length/2)],p95Ms:times[Math.floor(times.length*.95)],maxMs:times.at(-1),startRss,maxRssBytes:process.resourceUsage().maxRSS*1024,node:process.version}));
}else{
 const results=[];for(const version of ['v26','v27']){const r=spawnSync(process.execPath,['--expose-gc','testy/wydajnosc_v27.mjs','worker',version],{encoding:'utf8',maxBuffer:1024*1024});if(r.status!==0)throw Error(r.stderr||r.error?.message||'Performance subprocess failed');results.push(JSON.parse(r.stdout));}
 const passed=results.every(r=>r.executed===84&&r.inputSha256===hash&&Number.isFinite(r.meanMs)&&r.meanMs>0);const out=process.env.WYNIKI||'wyniki_v26';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(`${out}/wydajnosc_v27.json`,JSON.stringify({passed:passed?1:0,failed:passed?0:1,results,ratioMean:results[1].meanMs/results[0].meanMs,limitations:'Osobne świeże procesy, ten sam zestaw, jedno środowisko; pomiar RSS jest maksimum procesu, nie rozmiar samego planu.'},null,2));console.log(results);if(!passed)process.exitCode=1;
}
