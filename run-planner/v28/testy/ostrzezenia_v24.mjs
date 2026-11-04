// Reproduce warning cases from the low-frequency cells of the unchanged historical sweep.
import fs from 'node:fs';import {generatePlan} from '../planGenerator_v24.js';import {mkInput,independentChecks,addD} from './lib.mjs';
const cases=[];let k=0,executed=0;
for(const level of ['beginner','intermediate','advanced'])for(const type of ['5k','10k','half','marathon'])for(const days of [1,2,3,4,5,6,7])for(const [km,longest]of [[6,3],[20,8],[40,16],[65,26]])for(const weeks of [5,9,14,22]){
 const raceDow=k++%7;if(days>2)continue;
 for(let off=0;off<7;off++){
  const input=mkInput({level,type,days,km,longest,weeks,raceDow,today:addD('2026-11-02',off),result:{distanceKm:10,timeSec:3300}}),p=generatePlan(input),c=independentChecks(input,p);executed++;
  if(c.problemy.length)cases.push({input,problems:c.problemy,weeks:p.tygodnie.map(w=>({od:w.od,km:w.km,start:w.start,faza:w.faza})),oneDay:days===1});
 }
}
const counts={};for(const c of cases)for(const p of c.problems)counts[p.kod]=(counts[p.kod]||0)+1;
const out=process.env.WYNIKI || 'wyniki_v24';fs.mkdirSync(out,{recursive:true});fs.writeFileSync(`${out}/ostrzezenia_taperu.json`,JSON.stringify({executed,counts,cases},null,2));console.log({executed,counts,cases:cases.length});
