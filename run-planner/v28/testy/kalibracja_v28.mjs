import assert from'node:assert/strict';import fs from'node:fs';import{fixtures}from'./benchmark_v23.mjs';import{auditPlan,AUDIT_VERSION}from'../scoring/v28.mjs';
const tests=[],test=(name,f)=>{try{f();tests.push({name,ok:true});}catch(e){tests.push({name,ok:false,error:e.stack});}},rows=fixtures().map(r=>{
 // Historical handcrafted fixtures omitted their stated inter-repetition jog distances.
 // Add explicit n-1 rests for this NEW calibration only; frozen fixtures/scorers are unchanged.
 for(const t of r.plan.treningi)for(const k of t.kroki||[])if(k.powtorzenia&&k.dystans_m&&k.przerwa&&k.przerwa_km==null){k.przerwa_km=.3;k.liczba_przerw=k.powtorzenia-1;}
 return {...r,audit:auditPlan(r.input,r.plan)};}),good=rows[0];
test('versioned diagnostic independent of historical meters',()=>{assert.equal(AUDIT_VERSION,'28.0.0');assert.equal(Object.keys(good.audit.dimensions).length,10);assert.equal(good.audit.dimensions.adaptation.status,'NOT_ASSESSABLE');assert.equal(good.audit.dimensions.adaptation.score,null);assert(good.audit.total<10);});
for(const r of rows.slice(1))test('corruption '+r.name,()=>{if(r.name==='niewykonalna_czestotliwosc'){assert(r.audit.goalFeasibility.score<good.audit.goalFeasibility.score);return;}assert(r.audit.total<good.audit.total,`${r.audit.total} vs ${good.audit.total}`);});
test('fake metadata and version cannot earn credit',()=>{const p=structuredClone(good.plan);p.wersja='28-perfect';p.seasonState={score:10};p.familyProgression={complete:true};p.kontrola={score:10};assert.deepEqual(auditPlan(good.input,p),good.audit);});
test('feasibility is separate from planning algorithm',()=>{assert(good.audit.goalFeasibility.notAlgorithmQuality);assert(good.audit.methodology.goalFeasibilityExcludedFromAlgorithmTotal);});
for(const value of [NaN,Infinity])test('nonfinite values '+value,()=>{const p=structuredClone(good.plan);p.treningi[0].dystans_km=value;assert.equal(auditPlan(good.input,p).total,0);});
test('broken step sum reduces safety',()=>{const p=structuredClone(good.plan);p.treningi[0].kroki[0].dystans_km+=5;assert(auditPlan(good.input,p).total<good.audit.total);});
const failed=tests.filter(t=>!t.ok).length,out=process.env.WYNIKI||'wyniki_v28';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/kalibracja_v28.json',JSON.stringify({passed:tests.length-failed,failed,tests,cases:rows},null,2));console.log('Audit28',tests.length-failed,'/',tests.length);for(const t of tests.filter(t=>!t.ok))console.error(t.name,t.error);if(failed)process.exitCode=1;
