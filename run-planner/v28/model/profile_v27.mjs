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
