// Reviewer receives only anonymous inputs/recipes. It cannot read the version key or generator.
import fs from'node:fs';
const data=JSON.parse(fs.readFileSync(process.argv[2])),reviews=[];
for(const r of data.plans){const units=r.units.slice().sort((a,b)=>a.date.localeCompare(b.date)),hard=units.filter(t=>['dlugi','tempo','interwaly','tempo_startowe','podbiegi','test'].includes(t.type)),quality=hard.filter(t=>t.type!=='dlugi'),warnings=[];
 for(let n=1;n<hard.length;n++){const gap=(Date.parse(hard[n].date)-Date.parse(hard[n-1].date))/86400000;if(gap<2)warnings.push({date:hard[n].date,reason:'Mniej niż dwa dni między trudnymi jednostkami.',previous:hard[n-1].date});}
 const longs=units.filter(t=>t.type==='dlugi'),longest=Math.max(0,...longs.map(t=>t.km)),minutes=Math.max(0,...longs.map(t=>t.minutes));
 if(r.input.goal.type==='marathon'&&r.input.daysPerWeek<=2)warnings.push({reason:'Dostępność nie zapewnia pełnego przygotowania maratońskiego, niezależnie od jakości jednej jednostki.'});
 if(r.input.currentWeeklyKm>=45&&r.input.longestRecentRun>=20&&longest<r.input.longestRecentRun*.8)warnings.push({reason:'Długi bieg znacznie krótszy od deklarowanego: wymaga konkretnego uzasadnienia czasem, objawami lub tolerancją.'});
 if(minutes>200)warnings.push({reason:'Ponad 200 min długiego wysiłku: sprawdź historię tolerancji i regenerację, sam dystans nie wystarcza.'});
 const race=r.input.goal.raceDate,last=units.filter(t=>race&&(Date.parse(race)-Date.parse(t.date))/86400000<=7);if(last.some(t=>t.type==='dlugi'&&t.minutes>60))warnings.push({reason:'Długi wysiłek w ostatnim tygodniu przed startem.'});
 const work=quality.map(t=>({date:t.date,type:t.type,main:t.steps.filter(k=>/Część główna|^Blok|^Test/.test(k.etap||''))}));
 reviews.push({id:r.id,strengths:[`Plan zawiera ${units.length} sesji, ${quality.length} wyodrębnionych akcentów i ${longs.length} długich biegów.`,`Najdłuższy zachowany bieg ${longest} km / ${minutes} min; odstępy oceniono na rzeczywistych datach.`],weaknesses:warnings,progression:work,firstFour:units.filter(t=>t.date<new Date(Date.parse(r.input.today)+28*86400000).toISOString().slice(0,10)),taper:last,feasibility:r.input.daysPerWeek<=2&&r.input.goal.type==='marathon'?'Cel wymaga zmiany dostępności/dystansu lub dłuższego etapu bazowego.':'Wykonalność sportowa pozostaje warunkowa bez dziennika wykonania.',verdict:warnings.length?'Wymaga przeglądu wskazanych ograniczeń.':'Nie wykryto tych prostych wad; skuteczność treningowa nie została potwierdzona.',externalCoach:false});
}
fs.writeFileSync(process.argv[3],JSON.stringify({reviewer:'internal_rule_based_version_hidden',versionKeyRead:false,clinicalValidation:false,reviews},null,2));console.log({anonymousPlans:reviews.length});
