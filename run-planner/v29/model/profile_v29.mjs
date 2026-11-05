// Descriptive provenance; no fabricated measurement confidence or success probability.
export function intensityEvidence(input,observed=[]){
 const result=input.bestResult,age=result?.date?(Date.parse(input.today)-Date.parse(result.date))/86400000:null;
 const executed=result&&observed.some(o=>o.status!=='missed'&&o.testResult?.distanceKm===result.distanceKm&&o.testResult?.timeSec===result.timeSec);
 return {pace:{source:executed?'reported_executed_test':result?.date?'declared_dated':result?'declared_undated':'estimated',ageDays:age,confidence:executed?'moderate':age!=null&&age<=180?'limited':'low',clinicalValidation:false,reason:result&&!result.date?'PB bez daty pozostaje deklaracją; RPE i test rozmowy mają pierwszeństwo.':'Źródło i aktualność danych są jawne; nie weryfikujemy sensora.'},heartRate:{source:input.tetnoProgowe?'reported_threshold':input.hrMax&&!['estimated','unknown'].includes(input.hrMaxSource)?'reported_maximum':'estimated',confidence:input.tetnoProgowe?'limited':'low',shortIntervals:'Tętno narasta z opóźnieniem; nie jest celem krótkiego odcinka.'},notSuccessProbability:true};
}
export function recoveryTrend(observations,today){
 const recent=observations.filter(o=>(Date.parse(today)-Date.parse(o.date))/86400000<=21);
 const poorSleep=new Set(recent.filter(o=>o.sleepHours!=null&&o.sleepHours<6).map(o=>o.date)).size;
 const lowWellbeing=new Set(recent.filter(o=>o.wellbeing!=null&&o.wellbeing<=2).map(o=>o.date)).size;
 return {poorSleepDays:poorSleep,lowWellbeingDays:lowWellbeing,reduce:poorSleep>=3||lowWellbeing>=3,reason:'Powtarzane zgłoszenia snu/samopoczucia są kontekstem tolerancji, nie rozpoznaniem medycznym.'};
}

/** Speed maintenance does not establish endurance for a longer target distance. */
export function enduranceIntent(I) {
 const type=I.goal?.type,longDistance=['half','marathon'].includes(type),explicitMaintenance=['maintain','activity'].includes(I.goal?.mode),needs=type==='marathon'?{km:45,longKm:28}:type==='half'?{km:30,longKm:16}:type==='10k'?{km:26,longKm:11}:{km:18,longKm:7};
 const actual=(I.completedHistory||[]).filter(o=>o.status==='done'&&o.distanceKm>0&&o.date<=I.today&&(Date.parse(I.today)-Date.parse(o.date))/86400000<56);
 const covered=I.executionCoverage?.completeWindow===true&&I.executionCoverage.coverageFrom&&I.executionCoverage.coverageTo>=I.today;
 const span=covered?Math.min(56,(Date.parse(I.today)-Date.parse(I.executionCoverage.coverageFrom))/86400000):0;
 const weeks=Array.from({length:8},(_,k)=>actual.filter(o=>{const d=(Date.parse(I.today)-Date.parse(o.date))/86400000;return d>=k*7&&d<(k+1)*7;}));
 const useActual=span>=42,windowActual=useActual?actual.filter(o=>(Date.parse(I.today)-Date.parse(o.date))/86400000<span):actual;
 const mean=windowActual.reduce((n,o)=>n+o.distanceKm,0)/Math.max(1,span/7),longest=Math.max(0,...windowActual.map(o=>o.distanceKm));
 const volume=useActual?mean:I.currentWeeklyKm,longKm=useActual?longest:I.longestRecentRun;
 const volumeGap=Math.max(0,1-volume/needs.km),longGap=Math.max(0,1-longKm/needs.longKm),regularityGap=useActual?weeks.slice(0,6).filter(w=>new Set(w.map(o=>o.date)).size<Math.min(3,I.daysPerWeek)).length/6:null;
 const gap=Math.min(1,.45*volumeGap+.45*longGap+.1*(regularityGap??.5));
 const weeksLeft=I.goal?.raceDate?Math.max(0,(Date.parse(I.goal.raceDate)-Date.parse(I.today))/604800000):12;
 const time=I.maxMinutesWe??I.maxMinutesWeekend??I.maxMinutes??120,frequency=Math.min(1,I.daysPerWeek/(longDistance?4:3));
 const ability=explicitMaintenance?0:Math.min(1,frequency*Math.min(1,weeksLeft/(type==='marathon'?18:12))*Math.min(1,time/(type==='marathon'?150:90))*(I.loadTolerance==='low'?.65:1));
 return {speed:I.trainingIntent,endurance:longDistance&&!explicitMaintenance?'conditional_distance_development':explicitMaintenance?'explicit_maintenance':'preserve_or_develop',develop:longDistance&&!explicitMaintenance&&ability>0&&gap>.02,conditional:true,completionEvidence:false,
  enduranceGap:{value:gap,volume:volumeGap,longRun:longGap,regularity:regularityGap,range:[Math.max(0,gap-(useActual?.08:.2)),Math.min(1,gap+(useActual?.08:.2))],scale:'heuristic_shortfall_not_probability'},
  feasibleDevelopment:{capacity:ability,status:explicitMaintenance?'maintenance_requested':I.daysPerWeek<=2&&longDistance?'limited_frequency':weeksLeft<8?'longer_preparation_advised':'conditional',gapNotDisabledByLowFrequency:true},
  readinessEvidence:{source:useActual?'completed_6_to_8_weeks':'declaration',observed:actual.length,coveredDays:span,confirmed:false,reason:'Luka opisuje braki, nie potwierdza gotowości ani medycznego bezpieczeństwa.'},
  reason:'Intencja prędkości, ciągła luka wytrzymałościowa, możliwość rozwoju i dowody wykonania są oceniane osobno.'};
}
export function athleteEvidence(I,observed=[],raw=I) {
  const recent=observed.filter(o=>o.status!=='missed'&&o.distanceKm>0&&o.durationMin>0&&o.date<=I.today&&(Date.parse(I.today)-Date.parse(o.date))/86400000<56);
  const weeks=Array.from({length:8},(_,k)=>{const rows=recent.filter(o=>{const age=(Date.parse(I.today)-Date.parse(o.date))/86400000;return age>=k*7&&age<(k+1)*7;});return {weeksAgo:k,km:rows.reduce((n,o)=>n+o.distanceKm,0),minutes:rows.reduce((n,o)=>n+o.durationMin,0),days:new Set(rows.map(o=>o.date)).size};});
  return {observed:{source:'completed_history',count:recent.length,weeks,longestKm:Math.max(0,...recent.map(o=>o.distanceKm)),coverage:I.executionCoverage||{completeWindow:false},confidence:recent.length>=12?'limited':'low'},
    effective:{weeklyKm:I.currentWeeklyKm,longestKm:I.longestRecentRun,source:'normalized_conservative_input'},
    declared:{weeklyKm:raw.currentWeeklyKm,longestKm:raw.longestRecentRun,bestResult:raw.bestResult||null,weeklyHistory:raw.recentWeeklyKm||null,source:'athlete_declaration',notVerifiedCompletion:true},
    inferred:{...intensityEvidence(I,recent),tolerance:I.loadTolerance||'normal',confidence:'heuristic'},
    goal:{...I.goal,enduranceIntent:enduranceIntent(I)},
    constraints:{days:I.daysPerWeek,availableDays:I.availableDays,preferredDays:I.preferredDays||[],maxMinutesWeekday:I.maxMinutesWd??I.maxMinutesWeekday??I.maxMinutes??120,maxMinutesWeekend:I.maxMinutesWe??I.maxMinutesWeekend??I.maxMinutes??null,breakDays:I.breakDays??I.przerwaDni??0,experienceMonths:I.experienceMonths??null},notSuccessProbability:true};
}
