import assert from 'node:assert/strict';import fs from 'node:fs';import crypto from 'node:crypto';
import * as V from '../planGenerator_v26.js';import * as B from '../planGenerator_v25.js';
import {mkInput,addD,weeksOf,independentChecks} from './lib.mjs';import {workDose,constrainedWeek} from '../model/constraints_v26.mjs';
const out=process.env.WYNIKI||'wyniki_v26';fs.mkdirSync(out,{recursive:true});const tests=[],test=(name,fn)=>{try{fn();tests.push({name,ok:true});}catch(e){tests.push({name,ok:false,error:e.stack});}};
const i=mkInput({type:'10k',days:3,km:35,longest:14,weeks:20,result:{distanceKm:10,timeSec:3120},extra:{experienceMonths:24}}),q=t=>['tempo','tempo_startowe','interwaly','podbiegi','test'].includes(t.podtyp),sum=p=>p.treningi.reduce((n,t)=>n+t.czas_min*(t.intensywnosc?.rpeOrientacyjne||3),0);
test('public API retained and version changed',()=>{assert.equal(V.VERSION,'26.0');for(const [name,v]of Object.entries(B))assert.equal(typeof V[name],typeof v,name);});
test('frozen sources and input corpus preserved byte for byte',()=>{const p=JSON.parse(fs.readFileSync('PROVENANCE_V26.json'));for(const f of ['scoring/v23.mjs','scoring/v25.mjs','planGenerator_v25.js'])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),p.baseSourceHashes[f]);});
for(const type of ['5k','10k','half','marathon'])for(const weeks of [6,8,12,16,20,24])test(`actual quality progression ${type}/${weeks}`,()=>{
 const input=mkInput({type,days:4,weeks,km:35,longest:14,result:{distanceKm:10,timeSec:3120},extra:{experienceMonths:24}}),p=V.generatePlan(input);assert(p.ok);assert.equal(p.safetyValidation.critical,0);assert.equal(independentChecks(input,p).krytyczne,0);
 assert(p.treningi.every(t=>Number.isFinite(t.czas_min)&&t.data>=input.today&&t.data<input.goal.raceDate));assert(p.tygodnie.some(w=>w.faza.includes('zwolnienie')));if(weeks>=12)assert(p.treningi.some(t=>t.odciazenie));
 for(const row of p.rejestrJakosci){assert(row.preparation.warmup.length);assert(row.preparation.cooldown.length);assert(row.doseDecision.conditionalOnExecution);assert(row.pracaMin>0);assert(row.pracaMin<=p.treningi.find(t=>t.data===row.data).czas_min+2);if(row.predecessor)assert(row.predecessor.date<row.data);}
 const work=p.rejestrJakosci.filter(r=>r.faza!=='taper'&&['tempo','interwaly','tempo_startowe'].includes(r.rodzaj));if(weeks>=16)assert(work.length>=4);
 assert.deepEqual(p,V.generatePlan(input));
});
for(const type of ['5k','10k','half','marathon'])for(const days of [1,2])for(const level of ['beginner','intermediate','advanced'])test(`dedicated policy ${type}/${days}/${level}`,()=>{const input=mkInput({type,days,level,km:level==='beginner'?8:35,longest:level==='beginner'?4:14,weeks:20,result:{distanceKm:10,timeSec:3120}}),p=V.generatePlan(input);assert(p.ok);assert.equal(p.safetyValidation.critical,0);assert(p.tygodnie.every(w=>w.biegi<=days));if(type==='marathon')assert.notEqual(p.wykonalnosc.poziom,'pelna');if(days===1){assert(!p.treningi.some(q));assert(p.treningi.every(t=>t.czas_min<=90));}});
for(const availableDays of [[0,6],[1,2],[2,6],[0,1]])test(`two available days ${availableDays}`,()=>{const input={...i,daysPerWeek:2,availableDays},p=V.generatePlan(input);assert(p.ok);assert.equal(p.safetyValidation.critical,0);assert(p.treningi.some(t=>t.podtyp==='tempo'));assert(p.treningi.every(t=>availableDays.includes(new Date(t.data).getUTCDay())));});
test('one-day purposeful moderate fragment replaces strides and stays within existing distance',()=>{const input={...i,daysPerWeek:1},p=V.generatePlan(input),b=B.generatePlan(input),units=p.treningi.filter(t=>t.kroki.some(k=>k.etap==='Umiarkowany fragment'));assert(units.length);for(const t of units){assert(!t.kroki.some(k=>k.etap==='Przebieżki'));assert.equal(t.dystans_km,b.treningi.find(x=>x.data===t.data).dystans_km);}});
test('maintenance and activity explicitly avoid forced moderate work',()=>{for(const mode of ['maintain','activity']){const p=V.generatePlan({...i,daysPerWeek:1,goal:{...i.goal,mode}});assert(p.ok);assert(!p.treningi.some(t=>t.kroki.some(k=>k.etap==='Umiarkowany fragment')));}});
for(let dow=0;dow<7;dow++)for(const type of ['5k','10k','half','marathon'])test(`race weekday ${dow}/${type}`,()=>{const input=mkInput({type,days:3,weeks:16,raceDow:dow,km:35,longest:14,result:{distanceKm:10,timeSec:3120}}),p=V.generatePlan(input);assert(p.ok);assert.equal(p.safetyValidation.critical,0);assert(p.tygodnie.every(w=>w.biegi<=3));const w=p.tygodnie.find(w=>w.start);assert(w.start.uwzglednionyWKilometrazu);});
for(const o of [{fatigue:5},{intensityTolerance:'low'},{volumeTolerance:'low'},{experienceMonths:2},{breakDays:30},{pain:3}])test(`metamorphic less aggression ${JSON.stringify(o)}`,()=>{const p=V.generatePlan(i),j={...i,...o},a=V.generatePlan(j);assert(a.ok);assert(sum(a)<=sum(p)+1);assert(a.treningi.filter(q).length<=p.treningi.filter(q).length);});
test('ambitious target does not speed threshold or intervals',()=>{const a=V.generatePlan(i),b=V.generatePlan({...i,goal:{...i.goal,targetTimeSec:2300}});assert.equal(a.tempa.progowe,b.tempa.progowe);assert.equal(a.tempa.interwal,b.tempa.interwal);});
for(const n of [2,3,4])test(`bounded candidates ${n}`,()=>{const p=V.generatePlan({...i,planningCandidates:n});assert(p.ok);assert(p.decyzjePlanera.wariantyTygodni.every(w=>w.candidates.length>=2&&w.candidates.length<=n));assert(p.planningStages.every(s=>s.validated));assert.equal(p.safetyValidation.critical,0);});
test('a declared seven-day schedule is conditional on actual frequency evidence',()=>{
 const input={...i,level:'advanced',daysPerWeek:7,currentWeeklyKm:84,longestRecentRun:24,experienceMonths:72},history=[];
 for(let n=1;n<=28;n++)history.push({id:'f'+n,date:addD(input.today,-n),status:'done',distanceKm:n%7===0?24:10,durationMin:n%7===0?145:60,rpe:4,fatigue:2});
 const a=V.generatePlan(input),b=V.generatePlan({...input,completedHistory:history,executionCoverage:{completeWindow:true,coverageFrom:addD(input.today,-35)}});assert(a.ok&&b.ok);assert.equal(a.plan.czestotliwosc.limitWybranychDni,6);assert.equal(b.plan.czestotliwosc.limitWybranychDni,7);assert.equal(b.safetyValidation.critical,0);
});
test('candidate selection preserves the prescribed stimulus before filling kilometres',()=>{
 const I={planningCandidates:3,availableDays:[2,6],maxMinutesWd:120,maxMinutesWe:120,recoveryDays:2},state={hardDates:[]},c={I,state,chosen:[2,6],longDow:6,weekStart:'2026-11-02',vol:18,budget:18};
 const unit=(data,kind,km)=>({data,podtyp:kind,dystans_km:km,czas_min:km*6,kroki:[]});
 const units=constrainedWeek(c,ctx=>ctx.noQuality?[unit('2026-11-03','latwy',13),unit('2026-11-07','latwy',5)]:[unit('2026-11-03','tempo',7),unit('2026-11-07','latwy',5)]);
 assert(units.some(t=>t.podtyp==='tempo'));
});
test('prepared half marathon develops sustained threshold as well as cruise blocks',()=>{
 const input={...i,daysPerWeek:4,currentWeeklyKm:40,longestRecentRun:16,goal:{type:'half',raceDate:'2027-04-18'}},p=V.generatePlan(input);
 assert(p.treningi.some(t=>t.podtyp==='tempo'&&t.faza_planu==='build'&&t.kroki.some(k=>k.etap==='Część główna'&&k.dystans_km>=4)));
 assert.equal(p.safetyValidation.critical,0);
});
test('threshold recovery has consistent distance, time and prescribed pace',()=>{
 const p=V.generatePlan({...i,daysPerWeek:4,currentWeeklyKm:40,longestRecentRun:16,goal:{type:'half',raceDate:'2027-04-18'}});
 for(const t of p.treningi.filter(t=>t.podtyp==='tempo'))for(const k of t.kroki.filter(k=>k.etap==='Przerwa')){const m=[...k.tempo.matchAll(/(\d+):(\d{2})/g)].map(x=>+x[1]*60 + +x[2]);assert(k.czas_min>=k.dystans_km*Math.min(...m)/60-.05);assert(k.czas_min<=k.dystans_km*Math.max(...m)/60+.05);}
});
// Fixed seed property cases, independent of historical grid. Their construction is fixed before results.
let seed=260004;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};const blind=[];
for(let n=0;n<64;n++)test(`blind property ${n}`,()=>{const type=['5k','10k','half','marathon'][Math.floor(rand()*4)],km=8+Math.floor(rand()*57),days=1+Math.floor(rand()*6),input=mkInput({type,days,weeks:6+Math.floor(rand()*20),age:18+Math.floor(rand()*58),km,longest:Math.min(3+Math.floor(rand()*19),km*.55),result:{distanceKm:10,timeSec:2700+Math.floor(rand()*1500)},extra:{experienceMonths:6+Math.floor(rand()*65),planningCandidates:2+Math.floor(rand()*3)}}),a=B.generatePlan(input),p=V.generatePlan(input);assert(p.ok,JSON.stringify(p.bledy));assert.equal(p.safetyValidation.critical,0,JSON.stringify(p.safetyValidation.issues));assert.equal(independentChecks(input,p).krytyczne,0);assert.deepEqual(p,V.generatePlan(input));blind.push({id:n,input,v25:a,v26:p});});
for(const patch of [{planningCandidates:0},{planningCandidates:Infinity},{maxMinutes:NaN},{today:'2026-02-30'},{currentWeeklyKm:-1},{daysPerWeek:8},{activeInjury:true},{goal:{...i.goal,raceDate:'2026-11-01'}}])test(`invalid edge ${JSON.stringify(patch)}`,()=>assert.equal(V.generatePlan({...i,...patch}).ok,false));
const failed=tests.filter(t=>!t.ok).length;fs.writeFileSync(`${out}/v26.json`,JSON.stringify({passed:tests.length-failed,failed,longTerm:24,blindScenarios:blind.length,tests},null,2));
fs.writeFileSync(`${out}/blind-inputs.json`,JSON.stringify(blind.map(r=>({id:r.id,input:r.input})),null,2));
const {gzipSync}=await import('node:zlib');const fd=fs.openSync(`${out}/blind-plans.ndjson.gz`,'w');for(const r of blind)fs.writeSync(fd,gzipSync(JSON.stringify(r)+'\n'));fs.closeSync(fd);
console.log(`V26 ${tests.length-failed}/${tests.length}`);for(const t of tests.filter(t=>!t.ok))console.error(t.name,t.error);if(failed)process.exitCode=1;
