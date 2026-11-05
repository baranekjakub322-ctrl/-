import fs from 'node:fs';import crypto from 'node:crypto';
const out=process.argv[2]||'holdout-reproduction';fs.mkdirSync(out,{recursive:true});let state=270041;const rand=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/2**32;},add=(d,n)=>new Date(Date.parse(d)+n*86400000).toISOString().slice(0,10);
const rows=[];
for(let id=0;id<224;id++){
 const type=['5k','10k','half','marathon'][id%4],days=1+Math.floor(id/4)%7,km=8+Math.floor(rand()*68),weeks=[6,8,12,16,20,24][Math.floor(rand()*6)],today=add('2026-11-02',Math.floor(rand()*7)),level=['beginner','intermediate','advanced'][Math.floor(rand()*3)];
 const input={today,age:18+Math.floor(rand()*57),level,currentWeeklyKm:km,longestRecentRun:Math.max(3,Math.min(km*.45,5+Math.floor(rand()*20))),daysPerWeek:days,availableDays:[0,1,2,3,4,5,6],experienceMonths:3+Math.floor(rand()*117),goal:{type,raceDate:add(today,weeks*7)}};
 if(id%5!==0)input.bestResult={distanceKm:10,timeSec:2700+Math.floor(rand()*1800),...(id%4===0?{}:{date:add(today,-Math.floor(rand()*500))})};
 if(id%3===0&&input.bestResult){const d={ '5k':5,'10k':10,half:21.0975,marathon:42.195}[type];input.goal.targetTimeSec=Math.round(input.bestResult.timeSec*(d/10)**1.06*(id%2?.95:1.05));}
 if(id%7===0)input.recentWeeklyKm=[km*.9,km,km*.8,km*.95].map(x=>Math.round(x));
 if(id%11===0)input.fatigue=4;if(id%13===0)input.intensityTolerance='low';if(id%17===0)input.breakDays=28;
 if(days<=3&&id%6===0)input.availableDays=days===1?[6]:days===2?[0,6]:[0,2,5];
 rows.push({id,input});
}
const json=JSON.stringify({seed:270041,createdBeforeOptimization:true,unblinding:'final evaluation only; safety defects may be fixed with disclosure',count:rows.length,rows},null,2)+'\n';
fs.writeFileSync(out+'/holdout224.json',json);fs.writeFileSync(out+'/holdout224.sha256',crypto.createHash('sha256').update(json).digest('hex')+'  holdout224.json\n');
const hypotheses=[
 ['H1','sezon','Brak wspólnej trajektorii daje nieuzasadnione plateaux i restart faz przy updatePlan.','Jawny seasonState z zakotwiczeniem i planem mezocykli; rzeczywiste jednostki mają używać trajektorii.','Przejście base→build→specific także przy cotygodniowych aktualizacjach; brak nadrabiania.'],
 ['H2','jakosc','Stałe recepty obcinane budżetem i przeskoki między rodzinami.','Biblioteka progresji powiązana z planem sezonu, dziennik poprzedniej i kolejnej dawki.','Kontrolowane dawki, jedna zmienna, rzeczywista rozgrzewka/schłodzenie; brak automatycznych temp.'],
 ['H3','testy','Powtarzane maksymalne 3 km są słabym kontrolnym bodźcem dla utrzymania i maratonu.','Submaksymalny trening kontrolny; maksymalny test wyłącznie przy świadomej potrzebie.','Brak serii maksymalnych testów u utrzymującego; forma zmienia się tylko po wykonaniu.'],
 ['H4','dlugie','Odciążenia i powroty blokują długi bieg/objętość; minima celu nie są dowodem gotowości.','Planowanie makrotrajektorii i osobne bramki wykonania.','Wolny biegacz respektuje minuty; 1–2 dni nie udają maratonu; 60/4 bez wymuszania.'],
 ['H5','wydajnosc','Klony historii kandydatów i duplikacja identycznych wariantów.','Kopiowanie tylko stanu mutowanego; pruning identycznych kontekstów, jedna budowa zwykłego tygodnia.','Identyczny wynik, izolacja kandydatów i średni czas zmierzony bez zmiany scoringu.'],
 ['H6','dowody','PB bez daty jest deklaracją, nie świeżym testem; słabe dane nie uzasadniają precyzji.','Pochodzenie intensywności i niepewność; 2–6 tygodni trendów RPE/snu, bez sukcesu z braku wpisu.','Testy czułości i symulacje wielotygodniowe; korekty/audyt/idempotencja bez zmian.']
];
fs.writeFileSync(out+'/hypotheses.json',JSON.stringify({iterations:6,hypotheses,holdoutSeed:270041,rule:'No historical scorer is an optimization objective. Benchmark gains never override safety.'},null,2));
console.log('Frozen',rows.length,'holdout profiles before code changes');
