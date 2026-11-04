import fs from 'node:fs';import crypto from 'node:crypto';
import * as V22 from '../planGenerator_v22.js';import * as V23 from '../planGenerator_v23.js';
import {mkInput,score,scoreV21,independentChecks,weeksOf,addD} from './lib.mjs';
import {evaluate as scoreV22} from './miernik_v22.mjs';
import {evaluatePlan,collectMetrics,workOf} from '../scoring/v23.mjs';
const out=process.env.WYNIKI || 'wyniki_v23';fs.mkdirSync(out,{recursive:true});fs.mkdirSync('przyklady_v23',{recursive:true});
const start=Date.now(),violations=[],seen=new Set();
function measure(input,result,details=false){
 const checks=result.ok?independentChecks(input,result):null,newScore=evaluatePlan(input,result),w=result.ok?weeksOf(result):[];
 return {ok:result.ok,scoreOld:result.ok?score(input,result,checks).ocena:0,scoreV21:result.ok?scoreV21(input,result,checks).ogolna:0,scoreV22:result.ok?scoreV22(input,result).score:0,scoreV23:newScore.total,components:Object.fromEntries(Object.entries(newScore.components).map(([k,v])=>[k,v.score])),
 critical:checks?.krytyczne || 0,warningsIndependent:checks?.ostrzezenia || 0,issuesNew:newScore.issues,declared:input.daysPerWeek,actual:Math.max(0,...w.map(w=>w.n)),actualWithRace:Math.max(0,...result.tygodnie?.map(w=>w.biegi || 0) || []),sessions:result.treningi?.length || 0,meanKm:w.length?w.reduce((s,x)=>s+x.km,0)/w.length:0,peakKm:Math.max(0,...w.map(w=>w.km)),longest:newScore.metrics?.longest || 0,quality:newScore.metrics?.quality || 0,types:result.treningi?.reduce((a,t)=>(a[t.podtyp]=(a[t.podtyp]||0)+1,a),{}),warnings:result.ostrzezenia || result.bledy,feasibility:result.wykonalnosc?.poziom || 'odmowa',...(details?{assessment:newScore}: {})};
}
function pair(input,detail=false){const a=V22.generatePlan(input),b=V23.generatePlan(input),v22=measure(input,a,detail),v23=measure(input,b,detail);if(!b.ok || v23.critical>v22.critical)violations.push({input,errors:b.bledy,newCritical:independentChecks(input,b).problemy.filter(p=>p.ciezar==='krytyczny')});return {input,v22,v23};}
const matrix=[];const vdot=V22.vdotFrom(10000,3120);
for(const [type,metres]of [['5k',5000],['10k',10000],['half',21097.5],['marathon',42195]])for(let days=1;days<=7;days++){
 const target=Math.round(V22.raceTimeFromVdot(metres,vdot)*1.03),i=mkInput({type,days,km:35,longest:14,today:'2026-11-02',raceDate:'2027-03-28',result:{distanceKm:10,timeSec:3120},targetTimeSec:target});matrix.push(pair(i,true));
}
const extended=[];let n=0;
for(const type of ['5k','10k','half','marathon'])for(let days=1;days<=7;days++)for(const level of ['beginner','intermediate','advanced'])for(const [km,longest]of [[6,3],[30,12],[60,24]])for(let raceDow=0;raceDow<4;raceDow++){
 const i=mkInput({type,days,km,longest,level,weeks:type==='marathon'?22:16,raceDow,today:addD('2026-11-02',n++%7),result:{distanceKm:10,timeSec:3300}}),key=JSON.stringify(i);if(seen.has(key))throw Error('duplicate extended input');seen.add(key);extended.push(pair(i));
}
const caseInput={today:'2026-11-02',age:35,level:'intermediate',currentWeeklyKm:35,longestRecentRun:14,bestResult:{distanceKm:10,timeSec:3120},goal:{type:'10k',targetTimeSec:3214,raceDate:'2027-03-28'},daysPerWeek:3,availableDays:[0,1,2,3,4,5,6]};
const profiles=[
 ['10k_3dni_analiza',caseInput],
 ['5k_poczatkujacy',mkInput({type:'5k',days:3,level:'beginner',km:6,longest:3,result:false,extra:{experienceMonths:2}})],
 ['5k_jeden',mkInput({type:'5k',days:1,km:12,longest:6})],
 ['10k_dwa',mkInput({type:'10k',days:2,km:25,longest:10,result:{distanceKm:10,timeSec:3120},targetTimeSec:3000})],
 ['half_dwa',mkInput({type:'half',days:2,km:30,longest:12})],
 ['half_cztery',mkInput({type:'half',days:4,km:35,longest:14,extra:{recentWeeklyKm:[30,32,34,35],experienceMonths:24}})],
 ['maraton_ukonczenie',mkInput({type:'marathon',days:5,level:'advanced',km:60,longest:24,weeks:22,result:{distanceKm:10,timeSec:2700},extra:{recentWeeklyKm:[58,60,57,60],experienceMonths:48,longDistanceRaces:2,goal:{type:'marathon',raceDate:'2027-04-04',mode:'finish'}}})],
 ['maraton_wynik',mkInput({type:'marathon',days:5,level:'advanced',km:60,longest:24,weeks:22,result:{distanceKm:10,timeSec:2700},targetTimeSec:14400,extra:{recentWeeklyKm:[58,60,57,60],experienceMonths:48,longDistanceRaces:2}})],
 ['maraton_dwa',mkInput({type:'marathon',days:2,km:35,longest:14,weeks:22})],
 ['maraton_krotki',mkInput({type:'marathon',days:4,level:'beginner',km:12,longest:6,weeks:6,targetTimeSec:10800})],
 ['powrot_przerwa',mkInput({type:'10k',days:3,km:30,longest:12,breakDays:60})],
 ['starszy_65',mkInput({type:'10k',days:4,age:65,km:30,longest:12})],
 ['mlody_16',mkInput({type:'5k',days:3,age:16,level:'beginner',km:10,longest:4,result:false})],
 ['siedem_deklarowanych',mkInput({type:'10k',days:7,km:35,longest:14})],
 ['spadek_historii',mkInput({type:'half',days:4,km:35,longest:14,extra:{recentWeeklyKm:[35,30,12,5],experienceMonths:18}})],
 ['niska_tolerancja',mkInput({type:'10k',days:4,km:30,longest:12,extra:{loadTolerance:'low',recoveryDays:3,experienceMonths:12}})],
 ['dostepnosc_preferencje',mkInput({type:'10k',days:3,km:30,longest:12,availableDays:[0,2,4,6],extra:{preferredDays:[2,4,6],maxMinutesWeekday:45,maxMinutesWeekend:90}})],
 ['plan_52_tygodnie',mkInput({type:'10k',days:4,km:30,longest:12,weeks:52,noRace:true})]
];
const examples=[];
for(const [name,input]of profiles){const v22=V22.generatePlan(input),v23=V23.generatePlan(input),row={name,input,v22:measure(input,v22,true),v23:measure(input,v23,true)};if(!v23.ok)violations.push({name,errors:v23.bledy});examples.push(row);fs.writeFileSync(`przyklady_v23/${name}.json`,JSON.stringify({input,v22,v23,assessmentV22:evaluatePlan(input,v22),assessmentV23:evaluatePlan(input,v23)},null,2));}
const specific={input:caseInput,v22:V22.generatePlan(caseInput),v23:V23.generatePlan(caseInput)};
const summarize=r=>({firstFourWeeks:r.tygodnie.slice(0,4).map(w=>({...w,units:r.treningi.filter(t=>t.data>=w.od&&t.data<addD(w.od,7))})),intervals:r.treningi.filter(t=>t.podtyp==='interwaly'),threshold:r.treningi.filter(t=>t.podtyp==='tempo'),lastWeek:r.tygodnie.at(-1),lastUnits:r.treningi.filter(t=>t.data>='2027-03-15'),frequency:r.plan.czestotliwosc,intent:r.plan.intencjaTreningowa || 'brak jawnego pola',assessment:evaluatePlan(caseInput,r)});
const caseReport={input:caseInput,defaults:{availableDays:'wszystkie siedem dni',experienceMonths:'niepodany w obu wersjach',recentWeeklyKm:'niepodane w obu wersjach',injuries:'niezgłoszone w obu wersjach'},v22:summarize(specific.v22),v23:summarize(specific.v23)};
fs.writeFileSync(`${out}/analiza_10k_3dni.json`,JSON.stringify(caseReport,null,2));
const adaptive=V23.updatePlan(caseInput,specific.v23,[{date:'2027-01-03',status:'shortened',distanceKm:5,durationMin:35,rpe:9,fatigue:4},{date:'2027-01-06',status:'done',distanceKm:6,durationMin:40,rpe:9,fatigue:4,testResult:{distanceKm:5,timeSec:1400}}],{today:'2027-01-10',availableDays:[1,3,6]});
fs.writeFileSync('przyklady_v23/adaptacja.json',JSON.stringify({input:caseInput,result:adaptive},null,2));if(!adaptive.ok)violations.push({name:'adaptacja',errors:adaptive.bledy});
function group(rows,key){const acc={};for(const r of rows){const k=key(r);const a=acc[k] || (acc[k]={n:0,v22:{old:0,new:0,v22meter:0,components:{}},v23:{old:0,new:0,v22meter:0,components:{}}});a.n++;for(const version of ['v22','v23']){a[version].old+=r[version].scoreOld;a[version].new+=r[version].scoreV23;a[version].v22meter+=r[version].scoreV22;for(const [name,value]of Object.entries(r[version].components))a[version].components[name]=(a[version].components[name]||0)+value;}}
for(const a of Object.values(acc))for(const v of ['v22','v23']){for(const k of ['old','new','v22meter'])a[v][k]/=a.n;for(const key of Object.keys(a[v].components))a[v].components[key]/=a.n;}return acc;}
const result={started:new Date(start).toISOString(),elapsedMs:Date.now()-start,node:process.version,meterVersion:'23.0.0',meterSha256:crypto.createHash('sha256').update(fs.readFileSync('scoring/v23.mjs')).digest('hex'),matrixCount:matrix.length,extendedCount:extended.length,extendedUnique:seen.size,exampleCount:examples.length,violations,matrix28:matrix,extended,examples,byDistance28:group(matrix,r=>r.input.goal.type),byFrequency28:group(matrix,r=>String(r.input.daysPerWeek)),byDistanceExtended:group(extended,r=>r.input.goal.type),byFrequencyExtended:group(extended,r=>String(r.input.daysPerWeek))};
if(matrix.length!==28||extended.length!==1008||seen.size!==1008)throw Error('coverage mismatch');
fs.writeFileSync(`${out}/porownanie_v22_v23.json`,JSON.stringify(result,null,2));console.log(`Comparison: 28 matrix + ${extended.length} extended + ${examples.length} detailed; violations ${violations.length}`);if(violations.length){console.error(JSON.stringify(violations.slice(0,3)));process.exitCode=1;}
