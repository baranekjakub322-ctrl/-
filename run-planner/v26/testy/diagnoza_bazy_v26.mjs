import fs from 'node:fs';import {gzipSync} from 'node:zlib';import crypto from 'node:crypto';
import * as A from '../planGenerator_v24.js';import * as B from '../planGenerator_v25.js';import {evaluatePlan as s23} from '../scoring/v23.mjs';import {evaluatePlan as s25} from '../scoring/v25.mjs';
const root='.',out='diagnostyka_v26/baseline';fs.mkdirSync(out,{recursive:true});
const frozen=JSON.parse(fs.readFileSync(root+'/wyniki_bazowe_v24/porownanie_v23_v24.json')),old=JSON.parse(fs.readFileSync(root+'/wyniki_bazowe_v25/porownanie_v24_v25.json'));
const start=Date.now(),rows=[],file=fs.openSync(out+'/full-v24-v25.ndjson.gz','w');
for(let id=0;id<1008;id++){
 const input=frozen.extended[id].input,a=A.generatePlan(input),b=B.generatePlan(input),a23=s23(input,a),b23=s23(input,b),a25=s25(input,a),b25=s25(input,b);
 const delta=b23.total-a23.total,delta25=b25.total-a25.total,deltas=Object.fromEntries(Object.keys(a23.components).map(k=>[k,b23.components[k].score-a23.components[k].score]));
 const issues=b25.issues.filter(x=>!a25.issues.some(y=>y.code===x.code&&y.date===x.date));
 const category=b.wykonalnosc.poziom==='niewykonalna'?'cel_niewykonalny':delta<0?(delta25>=0?'pozorny_spadek_miernika':'nierozstrzygniete'):delta>0?'realna_poprawa_wewnetrzna':a.treningi.length===b.treningi.length&&JSON.stringify(a.treningi)===JSON.stringify(b.treningi)?'uzasadniony_remis':'mozliwa_poprawa';
 const hypothesis=deltas.bezpieczenstwo<0?'czas_HM_lub_koncentracja':input.goal.type==='marathon'&&deltas.progresja<0?'rotacja_rodzin_MP_prog_taper':delta<0?'zaokraglenie_dawki_lub_wczesny_prog':'kontrola_budzetu_i_skutecznosci';
 const row={id,input,score23:{v24:a23.total,v25:b23.total},score25:{v24:a25.total,v25:b25.total},delta,delta25,deltas,newIssues:issues,category,priority:issues.some(x=>/BEZ|SKOK|LIMIT/.test(x.code))?'wysoki':'sredni',hypothesis,historicalBelowV23:b23.total<frozen.extended[id].v23.scoreV23,decision:'Wewnętrzna kwalifikacja; różnica punktów nie dowodzi różnicy fizjologicznej.',reproduced:Math.abs(b23.total-old.extended[id].v25.scoreV23)<1e-9};
 rows.push(row);fs.writeSync(file,gzipSync(JSON.stringify({id,input,v24:{plan:a,score23:a23,score25:a25},v25:{plan:b,score23:b23,score25:b25},diagnosis:row})+'\n'));
}
fs.closeSync(file);const mean=(v,s)=>rows.reduce((n,r)=>n+r[s][v],0)/rows.length;
const summary={started:new Date(start).toISOString(),elapsedMs:Date.now()-start,inputSha256:crypto.createHash('sha256').update(JSON.stringify(rows.map(r=>r.input))).digest('hex'),scenarios:rows.length,distribution:{better:rows.filter(r=>r.delta>0).length,same:rows.filter(r=>r.delta===0).length,worse:rows.filter(r=>r.delta<0).length},means:{score23:{v24:mean('v24','score23'),v25:mean('v25','score23')},score25:{v24:mean('v24','score25'),v25:mean('v25','score25')}},allArchivedValuesReproduced:rows.every(r=>r.reproduced),rows};
fs.writeFileSync(out+'/diagnosis.json',JSON.stringify(summary,null,2));fs.writeFileSync(out+'/regressions49.json',JSON.stringify(rows.filter(r=>r.delta<0),null,2));fs.writeFileSync(out+'/historical-below-v23.json',JSON.stringify(rows.filter(r=>r.historicalBelowV23),null,2));
if(summary.distribution.worse!==49||!summary.allArchivedValuesReproduced)throw Error('Baseline mismatch');console.log({...summary,rows:undefined});
