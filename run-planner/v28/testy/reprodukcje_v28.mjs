import assert from 'node:assert/strict';import fs from 'node:fs';import * as G from '../planGenerator_v28.js';import * as Old from '../planGenerator_v27.js';import{weeksOf}from'./lib.mjs';
const corpus=JSON.parse(fs.readFileSync('dane/frozen1008.json')),rows=[];const test=(name,f)=>{try{f();rows.push({name,ok:true});}catch(e){rows.push({name,ok:false,error:e.message});}};
for(const V of [Old,G])test(`${V.VERSION} cross-distance endurance is not capped at 110% by speed maintenance`,()=>{const i=corpus.matrix28.find(r=>r.input.goal.type==='marathon'&&r.input.daysPerWeek===5).input,p=V.generatePlan(i);assert(p.ok);assert(Math.max(...p.seasonState.weeks.map(w=>w.targets.km))>i.currentWeeklyKm*1.3,'Unjustified cross-distance maintenance cap');});
const out=process.env.WYNIKI||'wyniki_v28';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/reprodukcje_v28.json',JSON.stringify(rows,null,2));console.log(rows);
// Historical RED is expected and separately identified. The current implementation must pass.
if(rows.filter(r=>r.name.startsWith(G.VERSION)).some(r=>!r.ok))process.exitCode=1;
