import fs from 'node:fs';
import crypto from 'node:crypto';
import {generatePlan as v21} from '../planGenerator_v21.js';
import {generatePlan as v22} from '../planGenerator_v22.js';
import { mkInput, independentChecks, scoreV21, weeksOf, addD } from './lib.mjs';
import { evaluate } from './miernik_v22.mjs';
const out=process.env.WYNIKI || 'wyniki_v22';fs.mkdirSync(out,{recursive:true});fs.mkdirSync('przyklady',{recursive:true});
const rows=[], examples=[], seen=new Set(); const began=Date.now();
function measure(gen,input) {
  const r=gen(input), independent=evaluate(input,r);
  const checks=r.ok?independentChecks(input,r):null;
  const oldScore=checks?scoreV21(input,r,checks):null;
  return { ok:r.ok, independent, scoreV21:oldScore, criticalLegacy:checks?.krytyczne ?? null, warningsLegacy:checks?.ostrzezenia ?? null, codesLegacy:checks?.problemy.map(p=>p.kod), feasibility:r.wykonalnosc?.poziom, actualFrequency:Math.max(0,...weeksOf(r).map(w=>w.n)), km:r.treningi?.reduce((s,t)=>s+t.dystans_km,0) ?? 0, peak:Math.max(0,...weeksOf(r).map(w=>w.km)), types:r.treningi?.reduce((m,t)=>(m[t.podtyp]=(m[t.podtyp]||0)+1,m),{}) };
}
let n=0;
for(const type of ['5k','10k','half','marathon']) for(let days=1;days<=7;days++) for(const level of ['beginner','intermediate','advanced']) for(const [km,longest] of [[12,6],[35,14],[60,24]]) for(let raceDow=0;raceDow<4;raceDow++) {
 const input=mkInput({type,days,level,km,longest,weeks:type==='marathon'?22:16,raceDow,today:addD('2026-11-02',n++%7),result:{distanceKm:10,timeSec:3300}});
 const key=JSON.stringify(input);if(seen.has(key))throw Error('duplicate scenario');seen.add(key);
 rows.push({input,v21:measure(v21,input),v22:measure(v22,input)});
}
if(rows.length!==1008)throw Error('wrong comparison size');
const profiles=[
 ['5k_beginner', {type:'5k',days:3,km:8,longest:3,level:'beginner',result:false}],
 ['5k_one', {type:'5k',days:1,km:12,longest:6}],
 ['10k_two', {type:'10k',days:2,km:20,longest:8}],
 ['5k_advanced_six', {type:'5k',days:6,km:60,longest:18,level:'advanced',result:{distanceKm:5,timeSec:1100}}],
 ['half_four', {type:'half',days:4,km:35,longest:14}],
 ['half_two', {type:'half',days:2,km:30,longest:12}],
 ['marathon_finish', {type:'marathon',days:5,km:60,longest:24,weeks:22,level:'advanced',result:{distanceKm:10,timeSec:2700},extra:{goal:{type:'marathon',raceDate:'2027-04-04',mode:'finish'}}}],
 ['marathon_time', {type:'marathon',days:5,km:60,longest:24,weeks:22,level:'advanced',result:{distanceKm:10,timeSec:2700},targetTimeSec:14400}],
 ['marathon_two', {type:'marathon',days:2,km:35,longest:14,weeks:22}],
 ['marathon_short_unrealistic', {type:'marathon',days:4,km:12,longest:6,weeks:6,targetTimeSec:10800}],
 ['return_after_break', {type:'10k',days:3,km:30,longest:12,breakDays:60}],
 ['missing_result', {type:'half',days:4,km:20,longest:8,result:false}],
 ['older_runner', {type:'10k',days:4,km:30,longest:12,age:65}],
 ['declining_history', {type:'half',days:4,km:35,longest:14,extra:{recentWeeklyKm:[35,30,12,5]}}]
];
for(const [name,profile] of profiles){const input=mkInput(profile), r=v22(input);if(!r.ok)throw Error(`example failed ${name}`);fs.writeFileSync(`przyklady/${name}.json`,JSON.stringify({input,plan:r},null,2));const w=r.tygodnie;examples.push({name,input,v21:measure(v21,input),v22:measure(v22,input),sampleWeeks:[w[0],w[Math.floor(w.length/2)],w.at(-2),w.at(-1)]});}
function summary(version,type) {const a=rows.filter(r=>r.input.goal.type===type).map(r=>r[version]);const sum=f=>a.reduce((s,r)=>s+f(r),0);return {n:a.length,scoreIndependent:sum(r=>r.independent.score)/a.length,components:Object.fromEntries(Object.keys(a[0].independent.components).map(k=>[k,sum(r=>r.independent.components[k])/a.length])),criticalIndependent:sum(r=>r.independent.critical),warningsIndependent:sum(r=>r.independent.warnings),scoreLegacy:sum(r=>r.scoreV21?.ogolna || 0)/a.length,criticalLegacy:sum(r=>r.criticalLegacy || 0),warningsLegacy:sum(r=>r.warningsLegacy || 0),notOk:sum(r=>!r.ok),feasibility:a.reduce((s,r)=>(s[r.feasibility]=(s[r.feasibility]||0)+1,s),{})};}
const report={node:process.version,elapsedMs:Date.now()-began,executed:rows.length,unique:seen.size,meterHash:crypto.createHash('sha256').update(fs.readFileSync('testy/miernik_v22.mjs')).digest('hex'),byDistance:Object.fromEntries(['5k','10k','half','marathon'].map(type=>[type,{v21:summary('v21',type),v22:summary('v22',type)}])),examples,rows};
fs.writeFileSync(`${out}/porownanie_v21_v22.json`,JSON.stringify(report,null,2));console.log('Comparison V21/V22:',rows.length,'unique cases,',examples.length,'examples');
if(rows.some(r=>!r.v22.ok || r.v22.criticalLegacy>r.v21.criticalLegacy || r.v22.independent.critical>r.v21.independent.critical)) { console.error('New critical regression or generator failure');process.exitCode=1; }
