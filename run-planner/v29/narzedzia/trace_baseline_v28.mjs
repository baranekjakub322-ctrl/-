import fs from 'node:fs';import path from 'node:path';import{pathToFileURL}from'node:url';
const root=path.resolve(process.argv[2]||path.join(path.dirname(new URL(import.meta.url).pathname),'..')),out=path.resolve(process.env.WYNIKI||'wyniki_v28','trace-baseline');fs.mkdirSync(out,{recursive:true});
const corpus=JSON.parse(fs.readFileSync(root+'/dane/frozen1008.json'));
const cases=corpus.matrix28.filter(r=>['half','marathon'].includes(r.input.goal.type)&&[4,5].includes(r.input.daysPerWeek)).map(r=>({id:r.id,input:r.input}));cases.push({id:'887-reference',input:{today:'2026-11-07',age:35,level:'intermediate',availableDays:[0,1,2,3,4,5,6],daysPerWeek:4,currentWeeklyKm:60,longestRecentRun:24,goal:{type:'marathon',raceDate:'2027-04-14'},bestResult:{distanceKm:10,timeSec:3300}}});
for(const version of ['v26','v27']){
 let s=fs.readFileSync(root+'/planGenerator_'+version+'.js','utf8').replaceAll('"./model/','"'+pathToFileURL(root+'/model/').href).replaceAll('"./scoring/','"'+pathToFileURL(root+'/scoring/').href).replaceAll("'./model/","'"+pathToFileURL(root+'/model/').href).replaceAll("'./scoring/","'"+pathToFileURL(root+'/scoring/').href);
 const put=(marker,extra)=>{if(!s.includes(marker))throw Error(version+' missing '+marker);s=s.replace(marker,extra+'\n'+marker);};
 const emit=(stage,units='wk')=>`globalThis.__trace28?.({auxiliary:!!I.__noAlt,week:weekStart,stage:'${stage}',phase,recovery,vol,budget,longKm,prevKm,previousLoadV22,previousLongV22,desired:typeof seasonWeek==='undefined'?{km:vol,longKm}:seasonWeek.targets,units:${units}});`;
 put('    let wk = constrainedWeek(ctxW,buildWeek);',emit('feasible_envelope','[]'));
 put('    // v19-C4:',emit('allocated_after_long_share'));
 put('    if (!rw && phase !== "taper" && !recovery && raceKmWeek === 0 && previousLoadV22',emit('recovery_trim'));
 put('    if (!rw && !recovery && phase !== "taper" && previousEffortV22',emit('volume_guard'));
 put('    if (phase !== "taper" && !raceWeek && weekStart>=startDate)',emit('effort_guard'));
 put('    if (!recovery && phase !== "taper") {',emit('actual_long_share_guard'));
 put('    treningi.push(...wk);',emit('before_plan_rounding'));
 put('  // v21-B:',"globalThis.__trace28?.({auxiliary:!!c.I.__noAlt,week:c.weekStart,stage:'allocated_before_long_share',phase:c.phase,recovery:c.recovery,vol:c.vol,budget:c.budget,longKm:c.longKm,units:out});");
 const file=out+'/instrumented_'+version+'.mjs';fs.writeFileSync(file,s);const G=await import(pathToFileURL(file)),physics=await import(pathToFileURL(root+'/model/policy_'+version+'.mjs'));const canonical=await import(pathToFileURL(root+'/planGenerator_'+version+'.js'));
 for(const r of cases){const trace=[];globalThis.__trace28=x=>{if(x.auxiliary)return;const units=x.units.filter(t=>!['sila','cross','mobilnosc'].includes(t.podtyp));const dose=t=>{let m=0;for(const k of t.kroki||[]){if(!/Część główna|^Blok|^Test|Końcówka|Podbiegi/.test(k.etap||''))continue;const times=[...String(k.tempo||t.tempo_zakres).matchAll(/(\d+):(\d{2})/g)].slice(0,2).map(a=>+a[1]*60 + +a[2]);m+=Number(k.czas_min||Number(k.dystans_km||k.powtorzenia*k.dystans_m/1000||0)*(times.reduce((a,b)=>a+b,0)/Math.max(times.length,1)||360)/60);}return m;};const work={};for(const t of units)if(['tempo','interwaly','tempo_startowe','podbiegi','test'].includes(t.podtyp))work[t.podtyp]=(work[t.podtyp]||0)+dose(t);trace.push({...x,units:units.map(t=>({date:t.data,type:t.podtyp,km:t.dystans_km,minutes:t.czas_min})),km:units.reduce((n,t)=>n+t.dystans_km,0),minutes:units.reduce((n,t)=>n+t.czas_min,0),longActual:Math.max(0,...units.filter(t=>t.podtyp==='dlugi').map(t=>t.dystans_km)),workMinutes:work,longMinutes:Math.max(0,...units.filter(t=>t.podtyp==='dlugi').map(t=>t.czas_min)),sessions:units.length,hardSessions:units.filter(t=>['dlugi','tempo','interwaly','tempo_startowe','podbiegi','test'].includes(t.podtyp)).length,hardLoad:units.reduce((n,t)=>n+physics.sessionLoad(t,r.input.goal.type),0)});};
 const p=G.generatePlan(r.input);delete globalThis.__trace28;if(JSON.stringify(p)!==JSON.stringify(canonical.generatePlan(r.input)))throw Error('Instrumentation changed output');fs.writeFileSync(out+'/'+r.id+'-'+version+'.json',JSON.stringify({...r,instrumentationOnly:true,trace,plan:p},null,2));
 const groups=[...new Set(trace.map(t=>t.week))].slice(0,8);console.log(version,r.id,groups.map(w=>{const rows=trace.filter(t=>t.week===w);return {week:w,desired:rows[0].desired,stages:rows.map(t=>[t.stage,t.km,t.longActual])};}));
 }
}
delete globalThis.__trace28;for(const v of ['v26','v27'])fs.unlinkSync(out+'/instrumented_'+v+'.mjs');
