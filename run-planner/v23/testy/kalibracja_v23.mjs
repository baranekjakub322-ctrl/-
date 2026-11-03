import fs from 'node:fs';import assert from 'node:assert/strict';
import {evaluatePlan,WEIGHTS,METER_VERSION} from '../scoring/v23.mjs';import {fixtures} from './benchmark_v23.mjs';
const cases=fixtures().map(r=>({...r,evaluation:evaluatePlan(r.input,r.plan)})),good=cases[0].evaluation;
const tests=[];function test(name,fn){try{fn();tests.push({name,ok:true});}catch(e){tests.push({name,ok:false,error:e.message});}}
test('six fixed weights sum to 100',()=>assert.equal(Object.values(WEIGHTS).reduce((a,x)=>a+x,0),100));
test('rubric versioned independently',()=>assert.equal(METER_VERSION,'23.0.0'));
for(const c of cases.slice(1))test(`${c.name} scores below valid fixture`,()=>assert(c.evaluation.total<good.total,`${c.evaluation.total} vs ${good.total}`));
test('return after break detected by independent raw rule',()=>assert(cases.at(-1).evaluation.issues.some(p=>p.code==='ZA_WYSOKI_START')));
test('monotony cannot be hidden by changing labels or self-audit',()=>{const c=structuredClone(cases.find(x=>x.name==='monotonny'));for(const t of c.plan.treningi)t.typ='Fancy label';c.plan.kontrola={zgodny:true};c.plan.ocena=10;assert.equal(evaluatePlan(c.input,c.plan).total,c.evaluation.total);});
test('many violations continue to affect score beyond first ten',()=>{const c=cases.find(x=>x.name==='nadmierna_intensywnosc');const a=structuredClone(c.plan),b=structuredClone(c.plan);for(const t of a.treningi.slice(0,12))t.czas_min=300;for(const t of b.treningi.slice(0,24))t.czas_min=300;assert(evaluatePlan(c.input,b).components.bezpieczenstwo.score<evaluatePlan(c.input,a).components.bezpieczenstwo.score);});
test('missing evidence does not automatically produce 10',()=>assert(good.total<10));
test('infeasible marathon can be safe but cannot receive a high efficacy total',()=>{const r=cases.find(x=>x.name==='niewykonalna_czestotliwosc').evaluation;assert(r.components.bezpieczenstwo.score>=8);assert(r.total<7);assert(r.goalFactor<1);});
test('bad taper is detected against pre-taper peak, never its own inflated volume',()=>assert(cases.find(x=>x.name==='nieprawidlowy_taper').evaluation.issues.some(p=>p.code==='BRAK_TAPERU')));
const out=process.env.WYNIKI || 'wyniki_v23';fs.mkdirSync(out,{recursive:true});const failed=tests.filter(t=>!t.ok).length;fs.writeFileSync(`${out}/kalibracja_v23.json`,JSON.stringify({passed:tests.length-failed,failed,tests,cases},null,2));console.log(`Kalibracja: ${tests.length-failed}/${tests.length}; reference ${good.total}`);for(const t of tests.filter(t=>!t.ok))console.error(t);if(failed)process.exitCode=1;
