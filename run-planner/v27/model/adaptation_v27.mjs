import {recoveryTrend} from './profile_v27.mjs';
import {processActivityLedger,importActivityBatch,clone,stable,isDate,dayDiff,addDate,latestSymptom} from './activity_v27.mjs';
const failure=message=>({ok:false,bledy:[message],komunikat:message});
export function adaptWith(generate,physics,input,previousPlan,events=[],opts={}){
 const paused=previousPlan?.adaptacja?.wstrzymana && previousPlan.adaptacja.lastValidPlan;
 if(!input||(!previousPlan?.ok&&!paused)||!opts||typeof opts!=='object')return failure('Adaptacja wymaga wejścia, poprawnego planu i opcji.');
 const priorSchedule=paused||previousPlan;
 const previous=previousPlan.adaptacja||{},source=previous.inputUsed||input,origin=clone(previous.originInput||input),today=opts.today||previous.date||source.today;
 if(!isDate(today)||today<(previous.date||input.today))return failure('Data aktualizacji nie może cofać historii.');
 for(const key of ['reducedIntensity','completeWindow','partialImport'])if(opts[key]!=null&&typeof opts[key]!=='boolean')return failure(`${key} musi być wartością logiczną.`);
 const raceDate=opts.raceDate??source.goal?.raceDate;if(raceDate&&(!isDate(raceDate)||raceDate<=today))return failure('Nowy termin startu musi być późniejszy od aktualizacji.');
 const gap=Number(opts.missedDays??0);if(!Number.isFinite(gap)||gap<0||gap>3650)return failure('missedDays musi wynosić 0–3650.');
 let initial={activityStore:previous.activityStore,activityAudit:previous.activityAudit};
 if(!initial.activityStore){const seed=processActivityLedger({},previous.observations||input.executionObservations||input.completedHistory||[],today,{timeZone:opts.timeZone||'UTC'});if(!seed.ok)return seed;initial=seed;}
 const ledger=(opts.partialImport===true?importActivityBatch:processActivityLedger)(initial,events,today,{timeZone:opts.timeZone||'UTC'});if(!ledger.ok)return ledger;
 const active=ledger.observations,done=ledger.completedHistory,recent=active.filter(o=>dayDiff(o.date,today)<=14),recentDone=recent.filter(o=>o.status!=='missed');
 const symptom=latestSymptom(active);
 if(symptom&&(symptom.pain>=4||symptom.activeInjury))return {...failure('Ból lub uraz: wstrzymano harmonogram obciążeń; nie jest to diagnoza.'),completedHistory:done,adaptacja:{...clone(previous),...ledger,originInput:origin,inputUsed:source,date:today,wstrzymana:true,powod:'bol_lub_uraz',lastValidPlan:clone(priorSchedule)}};
 const p={...clone(origin),today,seasonContext:{originStart:previous.originInput?.today||input.today},goal:{...clone(source.goal),...(raceDate?{raceDate}:{})}},reasons=[];
 // Start from original measured/declarative base, not a repeatedly discounted prior prescription.
 p.currentWeeklyKm=Math.min(Number(origin.currentWeeklyKm||0),previous.originEffectiveBase??priorSchedule.indywidualizacja?.bazaKm??Number(origin.currentWeeklyKm||0));
 p.longestRecentRun=Math.min(Number(origin.longestRecentRun||0),previous.originEffectiveLong??priorSchedule.indywidualizacja?.najdluzszyKm??Number(origin.longestRecentRun||0));
 // Availability persists; observations never rewrite a completed schedule.
 p.availableDays=clone(opts.availableDays??source.availableDays);p.daysPerWeek=opts.daysPerWeek??source.daysPerWeek;
 if(Array.isArray(p.preferredDays)&&Array.isArray(p.availableDays))p.preferredDays=p.preferredDays.filter(d=>p.availableDays.map(Number).includes(Number(d)));
 if(opts.availableDays)reasons.push('Zmieniono przyszłą dostępność, zachowując dostępne preferencje.');
 if(opts.raceDate&&opts.raceDate!==source.goal?.raceDate)reasons.push('Nowy termin startu przebudowuje przyszłe fazy i taper.');
 const coverage={completeWindow:opts.completeWindow===true || opts.completeWindow==null && previous.coverage?.completeWindow===true && previous.coverage?.coverageTo===today,coverageFrom:opts.coverageFrom??previous.coverage?.coverageFrom,coverageTo:opts.completeWindow===true?today:previous.coverage?.coverageTo};
 if(coverage.completeWindow&&(!isDate(coverage.coverageFrom)||dayDiff(coverage.coverageFrom,today)<14))return failure('Pełne okno wymaga coverageFrom co najmniej 14 dni wcześniej.');
 if(coverage.completeWindow){
  const actual=recentDone.filter(o=>dayDiff(o.date,today)<14),km=actual.reduce((s,o)=>s+o.distanceKm,0)/2;
  p.currentWeeklyKm=km;p.longestRecentRun=Math.min(Math.max(0,...actual.map(o=>o.distanceKm)),Math.max(3,km));delete p.recentWeeklyKm;
  reasons.push('Baza ograniczona rzeczywistym wykonaniem pełnego okna; zaplanowane km nie są wykonaniem.');
 }
 const exposureGroups=new Map();
 for(const o of done.filter(o=>dayDiff(o.date,today)<=42&&o.sessionType&&o.rpe!=null)){
  const group=exposureGroups.get(o.sessionType)||[];group.push(o);exposureGroups.set(o.sessionType,group);
 }
 const exposureTrend=[...exposureGroups].map(([type,rows])=>{const latest=rows.at(-1),similar=rows.filter(o=>o.distanceKm>0&&Math.abs(o.distanceKm/latest.distanceKm-1)<=.15&&Math.abs(o.durationMin/latest.durationMin-1)<=.25);const first=similar.slice(0,2),last=similar.slice(-2),avg=a=>a.reduce((s,o)=>s+o.rpe,0)/Math.max(1,a.length);return {type,exposures:similar.length,rpeDelta:similar.length>=3?avg(last)-avg(first):0};});
 const wellbeing=recoveryTrend(active,today);
 const risingRpe=exposureTrend.some(g=>g.exposures>=3&&g.rpeDelta>=1.5);
 const fatigued=recent.slice(-3).filter(o=>o.fatigue>=4||o.rpe>=9).length,shortened=recent.filter(o=>o.status==='shortened').length,missed=recent.filter(o=>o.status==='missed').length;
 let factor=fatigued>=2?.8:fatigued===1||risingRpe?.9:1;if(shortened>=2||missed>=2||wellbeing.reduce)factor=Math.min(factor,.9);
 if(wellbeing.reduce){p.qualityNotBefore=addDate(today,7);p.intensityTolerance='low';reasons.push('Powtarzane niskie samopoczucie lub krótki sen: ostrożna regresja, bez diagnozowania.');}
 const lastDone=done.at(-1),realGap=Math.max(gap,coverage.completeWindow&&lastDone?dayDiff(lastDone.date,today):0);
 delete p.breakDays;delete p.przerwaDni;
 if(realGap>=14){p.breakDays=realGap;reasons.push(`Przerwa ${realGap} dni: obniżona baza i brak nadrabiania.`);}
 else if(realGap>=7){factor=Math.min(factor,.85);p.qualityNotBefore=addDate(today,7);reasons.push('Tydzień powrotu bez jakości po przerwie.');}
 p.currentWeeklyKm*=factor;
 if(previous.revision && opts.completeWindow!==true && !events.some(e=>['correct','cancel','restore'].includes(e?.op))){p.currentWeeklyKm=Math.min(p.currentWeeklyKm,priorSchedule.indywidualizacja?.bazaKm??p.currentWeeklyKm);p.longestRecentRun=Math.min(p.longestRecentRun,priorSchedule.indywidualizacja?.najdluzszyKm??p.longestRecentRun);}
 if(factor<1){p.longestRecentRun=Math.min(p.longestRecentRun,p.currentWeeklyKm);p.loadTolerance='low';p.volumeTolerance='low';reasons.push(`Zmęczenie/skracanie/pominięcia: redukcja objętości ×${factor}.`);}
 if(fatigued||risingRpe||recent.some(o=>o.pain>=3)||opts.reducedIntensity||recent.some(o=>o.reducedIntensity)){p.qualityNotBefore=addDate(today,7);p.intensityTolerance='low';reasons.push('Niższa tolerancja: pierwszy tydzień bez jakości, bez kompensacji kilometrami.');}
 const originVdot=origin.vdotOverride||(origin.bestResult?physics.vdotFrom(origin.bestResult.distanceKm*1000,origin.bestResult.timeSec):previous.originVdot??priorSchedule.ocena?.vdot);
 const tests=done.filter(o=>o.testResult&&dayDiff(o.date,today)<=42).map(o=>({...o,value:physics.vdotFrom(o.testResult.distanceKm*1000,o.testResult.timeSec)}));
 let trend={status:'brak_potwierdzenia',comparable:0,usedVdot:originVdot,capPct:0};
 if(tests.length){
  const latest=tests.at(-1),comparable=tests.filter(o=>Math.abs(o.testResult.distanceKm/latest.testResult.distanceKm-1)<=.1&&o.rpe!==10&&!(o.fatigue>=4)&&!(o.pain>=3));
  const distinct=new Set(comparable.map(o=>o.date)),spread=comparable.length?(Math.max(...comparable.map(o=>o.value))/Math.min(...comparable.map(o=>o.value))-1):Infinity;
  const observedDays=new Set(recentDone.filter(o=>o.distanceKm>0&&o.durationMin>0).map(o=>o.date)).size;
  const regularEnough=observedDays>=3 && missed<2 && (!coverage.completeWindow||observedDays>=Math.max(3,Math.floor(Number(p.daysPerWeek||3)*1.4)));
  const confirmed=regularEnough&&!risingRpe&&distinct.size>=2&&dayDiff(comparable[0].date,comparable.at(-1).date)>=7&&spread<=.04&&!fatigued;
  const cap=confirmed?.02:.005,observed=confirmed?comparable.reduce((s,o)=>s+o.value,0)/comparable.length:latest.value;
  const value=originVdot?Math.min(observed,originVdot*(1+cap)):observed;
  p.vdotOverride=fatigued||recent.some(o=>o.pain>=3)?Math.min(value,originVdot||value):value;
  p.bestResult={...latest.testResult,date:latest.date};p.vdotSource='wykonane testy: trend, limit zmiany względem bazowego VDOT';
  trend={observedDays,regularEnough,exposureTrend,status:observed<(originVdot||observed)?'pogorszenie':confirmed?'trend_potwierdzony':'pojedynczy_test',comparable:comparable.length,spread,usedVdot:p.vdotOverride,capPct:cap*100};
  reasons.push(confirmed?'Kilka zgodnych ekspozycji potwierdza trend; ograniczono zmianę VDOT do 2%.':'Pojedynczy test nie dowodzi trwałej poprawy; wzrost VDOT najwyżej 0,5%, pogorszenie uwzględniane od razu.');
 }
 if(missed)reasons.push('Pominięte treningi pozostają pominięte, bez nadrabiania.');
 if(ledger.activityAudit.some(a=>['correct','cancel','restore'].includes(a.op)))reasons.push('Przeliczono przyszłość z aktywnych wersji obserwacji; oryginały i korekty zachowano w audycie.');
 p.completedHistory=clone(done);p.executionObservations=clone(active);p.executionCoverage=coverage;p.longestCompletedDurationMin=Math.max(0,...recentDone.map(o=>o.durationMin));
 if(done.some(o=>o.date===today)){p.today=addDate(today,1);if(raceDate&&p.today>=raceDate)return failure('Dzisiejszy trening jest wykonany; do startu nie ma dnia na kolejny plan.');reasons.push('Dzisiejsza aktywność jest wykonana: nowa część zaczyna się jutro.');}
 const signature=stable({today,input:p,active,coverage,gap,reducedIntensity:!!opts.reducedIntensity});
 if(!ledger.changed&&signature===previous.signature)return clone(previousPlan);
 const result=generate(p);if(!result.ok)return {...result,activityLedger:ledger};
 const confidence={level:coverage.completeWindow&&done.length>=6?'umiarkowana':done.length>=3?'ograniczona':'niska',observed:done.length,comparable:trend.comparable,completeWindow:!!coverage.completeWindow,notProbability:true,reasons:[!coverage.completeWindow&&'Niepełna historia: nie wnioskujemy o pominięciu z braku wpisu.',trend.status==='pojedynczy_test'&&'Jedna ekspozycja nie potwierdza trwałej poprawy.'].filter(Boolean)};
 const revision=(previous.revision||0)+1,entry={revision,date:today,reasons:reasons.length?reasons:['Podtrzymano harmonogram po weryfikacji wykonania.'],volumeFactor:factor,missed,shortened,trend,exposureTrend,confidence,events:events.length,wellbeing,seasonOrigin:p.seasonContext.originStart};
 const past=[...new Map([...(previous.pastPlan||[]),...(priorSchedule.treningi||[]).filter(t=>t.data<today)].map(t=>[t.data+':'+t.podtyp,clone(t)])).values()].sort((a,b)=>a.data.localeCompare(b.data));
 result.adaptacja={revision,date:today,originInput:origin,originEffectiveBase:previous.originEffectiveBase??priorSchedule.indywidualizacja?.bazaKm??origin.currentWeeklyKm,originEffectiveLong:previous.originEffectiveLong??priorSchedule.indywidualizacja?.najdluzszyKm??origin.longestRecentRun,originVdot,signature,inputUsed:p,history:[...clone(previous.history||[]),entry],activityStore:ledger.activityStore,activityAudit:ledger.activityAudit,observations:active,completedHistory:done,pastPlan:past,noCatchUp:true,coverage,trend,exposureTrend};
 result.adaptationConfidence=confidence;if(ledger.importReport)result.importReport=ledger.importReport;result.completedHistory=done;result.adaptationDecisions=result.adaptacja.history;result.plan.tryb='adaptacja';result.ostrzezenia.unshift(...entry.reasons);return result;
}
