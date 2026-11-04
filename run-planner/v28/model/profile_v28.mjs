// Descriptive provenance; no fabricated measurement confidence or success probability.
export function intensityEvidence(input,observed=[]){
 const result=input.bestResult,age=result?.date?(Date.parse(input.today)-Date.parse(result.date))/86400000:null;
 const executed=result&&observed.some(o=>o.status!=='missed'&&o.testResult?.distanceKm===result.distanceKm&&o.testResult?.timeSec===result.timeSec);
 return {pace:{source:executed?'reported_executed_test':result?.date?'declared_dated':result?'declared_undated':'estimated',ageDays:age,confidence:executed?'moderate':age!=null&&age<=180?'limited':'low',clinicalValidation:false,reason:result&&!result.date?'PB bez daty pozostaje deklaracją; RPE i test rozmowy mają pierwszeństwo.':'Źródło i aktualność danych są jawne; nie weryfikujemy sensora.'},heartRate:{source:input.tetnoProgowe?'reported_threshold':input.hrMax?'reported_maximum':'estimated',confidence:input.tetnoProgowe?'limited':'low',shortIntervals:'Tętno narasta z opóźnieniem; nie jest celem krótkiego odcinka.'},notSuccessProbability:true};
}
export function recoveryTrend(observations,today){
 const recent=observations.filter(o=>(Date.parse(today)-Date.parse(o.date))/86400000<=21);
 const poorSleep=new Set(recent.filter(o=>o.sleepHours!=null&&o.sleepHours<6).map(o=>o.date)).size;
 const lowWellbeing=new Set(recent.filter(o=>o.wellbeing!=null&&o.wellbeing<=2).map(o=>o.date)).size;
 return {poorSleepDays:poorSleep,lowWellbeingDays:lowWellbeing,reduce:poorSleep>=3||lowWellbeing>=3,reason:'Powtarzane zgłoszenia snu/samopoczucia są kontekstem tolerancji, nie rozpoznaniem medycznym.'};
}

/** Speed maintenance does not establish endurance for a longer target distance. */
export function enduranceIntent(I) {
  const longDistance=['half','marathon'].includes(I.goal?.type);
  const explicitMaintenance=['maintain','activity'].includes(I.goal?.mode);
  const needs=I.goal?.type==='marathon'?{km:45,longKm:28}:{km:30,longKm:16};
  const develop=longDistance && I.daysPerWeek>=3 && !explicitMaintenance &&
    (I.currentWeeklyKm<needs.km || I.longestRecentRun<needs.longKm);
  return {speed:I.trainingIntent,endurance:develop?'conditional_distance_development':explicitMaintenance?'explicit_maintenance':'preserve_or_develop',
    develop,conditional:true,completionEvidence:false,
    reason:develop?'Podtrzymanie prędkości z krótszego wyniku nie oznacza tolerancji docelowego długiego dystansu.':'Intencja i wymagania dystansu oceniane oddzielnie.'};
}
export function athleteEvidence(I,observed=[]) {
  const recent=observed.filter(o=>o.status!=='missed'&&o.distanceKm>0&&o.durationMin>0&&o.date<=I.today&&(Date.parse(I.today)-Date.parse(o.date))/86400000<56);
  const weeks=Array.from({length:8},(_,k)=>{const rows=recent.filter(o=>{const age=(Date.parse(I.today)-Date.parse(o.date))/86400000;return age>=k*7&&age<(k+1)*7;});return {weeksAgo:k,km:rows.reduce((n,o)=>n+o.distanceKm,0),minutes:rows.reduce((n,o)=>n+o.durationMin,0),days:new Set(rows.map(o=>o.date)).size};});
  return {observed:{source:'completed_history',count:recent.length,weeks,longestKm:Math.max(0,...recent.map(o=>o.distanceKm)),coverage:I.executionCoverage||{completeWindow:false},confidence:recent.length>=12?'limited':'low'},
    declared:{weeklyKm:I.currentWeeklyKm,longestKm:I.longestRecentRun,bestResult:I.bestResult||null,weeklyHistory:I.recentWeeklyKm||null,source:'athlete_declaration',notVerifiedCompletion:true},
    inferred:{...intensityEvidence(I,recent),tolerance:I.loadTolerance||'normal',confidence:'heuristic'},
    goal:{...I.goal,enduranceIntent:enduranceIntent(I)},
    constraints:{days:I.daysPerWeek,availableDays:I.availableDays,preferredDays:I.preferredDays||[],maxMinutesWeekday:I.maxMinutesWd??I.maxMinutesWeekday??I.maxMinutes??120,maxMinutesWeekend:I.maxMinutesWe??I.maxMinutesWeekend??I.maxMinutes??null,breakDays:I.breakDays??I.przerwaDni??0,experienceMonths:I.experienceMonths??null},notSuccessProbability:true};
}
