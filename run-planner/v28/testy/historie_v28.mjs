import assert from 'node:assert/strict';import fs from 'node:fs';import {gzipSync} from 'node:zlib';import {performance} from 'node:perf_hooks';
import {generatePlan,updatePlan,importActivities,vdotFrom} from '../planGenerator_v28.js';import {addD,mkInput,independentChecks} from './lib.mjs';
const out=process.env.WYNIKI||'wyniki_v28';fs.mkdirSync(out,{recursive:true});const start=performance.now(),tests=[],histories=[];
const test=(name,fn)=>{try{fn();tests.push({name,ok:true});}catch(e){tests.push({name,ok:false,error:e.stack});}};
const types=['5k','10k','half','marathon'];
const summary=p=>({ok:p.ok,planned:p.treningi?.length||0,base:p.indywidualizacja?.bazaKm,completed:p.completedHistory?.length||0,readiness:p.readinessEvidence,status:p.adaptacja?.wstrzymana?'paused':'scheduled',decision:p.adaptacja?.history?.at(-1),safety:p.safetyValidation,errors:p.bledy});
for(let k=0;k<10;k++)for(let mode=0;mode<15;mode++)test(`multiweek history ${k}/${mode}`,()=>{
 const input=mkInput({type:types[k%4],days:[2,3,4,5,6][k%5],age:[25,35,55,67][k%4],level:['beginner','intermediate','advanced'][k%3],km:[20,35,60][k%3],longest:[8,14,24][k%3],weeks:24,result:{distanceKm:10,timeSec:[3600,3120,2700][k%3]},extra:{experienceMonths:[8,24,60][k%3]}});
 let plan=generatePlan(input);assert(plan.ok);const records=[],allEvents=[];let referenceId=null,referenceEvent=null;
 for(let week=0;week<(mode%2?12:8);week++){
  const from=addD(input.today,7*week),today=addD(from,6),old=plan,oldPast=structuredClone(plan.adaptacja?.pastPlan||[]),source=plan.ok?plan:plan.adaptacja.lastValidPlan;
  let events=source.treningi.filter(t=>t.data>=from&&t.data<=today&&!['sila','cross'].includes(t.podtyp)).map((t,n)=>({id:`h${k}-${mode}-w${week}-${n}`,date:t.data,status:'done',distanceKm:t.dystans_km,durationMin:t.czas_min,rpe:['tempo','interwaly','tempo_startowe','test'].includes(t.podtyp)?7:4,fatigue:2,workMinutes:['tempo','interwaly','tempo_startowe'].includes(t.podtyp)?Math.min(t.czas_min,Math.max(5,t.czas_min*.35)):undefined,sessionType:t.podtyp==='dlugi'?'long':t.podtyp==='tempo_startowe'?'specific':t.podtyp==='tempo'?'threshold':t.podtyp==='interwaly'?'interval':'easy'}));
  const opts={today};if(week>=2&&mode!==14){opts.completeWindow=true;opts.coverageFrom=input.today;}
  if(mode===1&&week===2&&events[0])events[0]={id:events[0].id,date:events[0].date,status:'missed'};
  if(mode===2&&week===2)events=events.map(e=>({...e,status:'shortened',distanceKm:e.distanceKm*.65,durationMin:e.durationMin*.75,rpe:8}));
  if(mode===3&&(week===2||week===3))events=events.map(e=>({...e,rpe:9,fatigue:4}));
  if(mode===4&&(week===2||week===3)){events=[];opts.missedDays=week===3?14:7;}
  if((mode===5&&week===2||mode===6&&(week===2||week===4))&&events[0]){const e=events[0],d=Math.min(3,e.distanceKm);e.testResult={distanceKm:d,timeSec:Math.round(d*285)};e.durationMin=Math.max(e.durationMin,e.testResult.timeSec/60);e.rpe=8;}
  if(mode===7&&week===2)events.push({id:`symptom-${k}`,date:today,status:'missed',pain:5});
  if(mode===7&&week===3)events.push({id:`clear-${k}`,date:today,status:'missed',pain:0,activeInjury:false});
  if(week===0&&events[0]){referenceId=events[0].id;referenceEvent=structuredClone(events[0]);}
  if(mode===8&&week===3&&referenceId)events.push({id:referenceId,op:'correct',changes:{distanceKm:referenceEvent.distanceKm*.9,durationMin:referenceEvent.durationMin,rpe:5},reason:'Corrected distance from source'});
  if(mode===9&&week===2&&referenceId)events.push({id:referenceId,op:'cancel'});
  if(mode===9&&week===3&&referenceId)events.push({id:referenceId,op:'restore'});
  if(mode===10)events=events.map(e=>({...e,startedAt:e.date+'T18:00:00+01:00',timeZone:'Europe/Warsaw',source:'simulation',externalId:e.id}));
  if(mode===11&&week===2&&events[0]){const a=events[0];events[0]={...a,distanceKm:a.distanceKm*.6,durationMin:a.durationMin*.6};events.push({...a,id:a.id+'-second',distanceKm:a.distanceKm*.4,durationMin:a.durationMin*.4});}
  if(mode===12&&week===3){opts.availableDays=[2,6];opts.daysPerWeek=2;}
  if(mode===13&&week===3)opts.raceDate='2027-03-14';
  if(mode===14){opts.partialImport=true;events.push({id:`bad-${week}`,date:today,status:'done',distanceKm:5});}
  const before=JSON.stringify(old);plan=updatePlan(input,old,events,opts);assert.equal(JSON.stringify(old),before,'previous plan mutated');
  if(mode===7&&week===2){assert(!plan.ok);assert(plan.adaptacja.wstrzymana);assert(!plan.treningi?.length);}
  else{
   assert(plan.ok,JSON.stringify(plan.bledy));assert.equal(plan.safetyValidation.critical,0,JSON.stringify(plan.safetyValidation.issues));assert.equal(independentChecks(plan.adaptacja.inputUsed,plan).krytyczne,0);
   assert(plan.treningi.every(t=>t.data>=plan.adaptacja.inputUsed.today));assert(plan.adaptacja.noCatchUp);assert(plan.adaptationConfidence.notProbability);
   for(const t of oldPast)assert.deepEqual(plan.adaptacja.pastPlan.find(x=>x.data===t.data&&x.podtyp===t.podtyp),t,'past planned prescription changed');
   assert.deepEqual(updatePlan(input,plan,events,opts),plan,'repeat update changed state');
   if(mode===14){assert.equal(plan.importReport.rejected.length,1);assert(!plan.completedHistory.some(e=>e.id.startsWith('bad-')));}
   if(mode===8&&week===3&&referenceId)assert.equal(plan.adaptacja.activityStore.find(x=>x.id===referenceId).original.distanceKm,referenceEvent.distanceKm);
  }
  records.push({week,today,events,options:opts,result:summary(plan)});allEvents.push(...events);
 }
 assert.equal(records.length,(mode%2?12:8));assert.equal(plan.readinessEvidence.plannedStagesAreCompleted,false);
 histories.push({id:`${k}/${mode}`,input,mode,records,finalPlan:plan});
});
// Bulk import includes duplicates, missing durations and corrected records. No fabricated execution.
test('bulk import 3000 observations is idempotent and quarantines invalid data',()=>{
 const rows=Array.from({length:3000},(_,n)=>({source:'bulk',externalId:String(n),startedAt:addD('2020-01-01',Math.floor(n/2))+(n%2?'T18:00:00Z':'T06:00:00Z'),timeZone:n%2?'Europe/Warsaw':'UTC',status:'done',distanceKm:5,durationMin:30}));
 const a=importActivities({},[...rows,...rows.slice(0,20),{id:'incomplete',date:'2026-11-01',status:'done',distanceKm:5}], '2026-11-02');assert(a.ok);assert.equal(a.completedHistory.length,3000);assert.equal(a.importReport.rejected.length,1);assert.equal(a.importReport.deduplicated,20);
 const b=importActivities(a,rows,'2026-11-02');assert(b.ok);assert.equal(b.activityAudit.length,a.activityAudit.length);assert.deepEqual(a.completedHistory,b.completedHistory);
});
const failed=tests.filter(t=>!t.ok).length,result={scenarios:150,weeksPerHistory:[8,12],completedHistories:histories.length,elapsedMs:performance.now()-start,peakRssBytes:process.resourceUsage().maxRSS*1024,passed:tests.length-failed,failed,tests};
fs.writeFileSync(`${out}/historie_v28.json`,JSON.stringify(result,null,2));const fd=fs.openSync(`${out}/histories_v28.ndjson.gz`,'w');for(const row of histories)fs.writeSync(fd,gzipSync(JSON.stringify(row)+'\n'));fs.closeSync(fd);
console.log(JSON.stringify({...result,tests:undefined}));for(const t of tests.filter(t=>!t.ok).slice(0,8))console.error(t.name,t.error);if(failed)process.exitCode=1;
