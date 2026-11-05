// Purposeful families; progress dose/length, never pace merely because a week passed.
export function intervalRecipe(I,k,qMax,warm,cool,easyMid){
 const rows=I.goal.type==='5k'?[[6,300,75],[6,400,75],[5,500,90],[5,600,90],[4,800,120],[4,1000,120],[5,1000,120]]:[[5,600,90],[4,800,120],[4,1000,120],[5,1000,120],[4,1200,150],[3,1600,150],[4,1600,150]];
 const stage=Math.min(rows.length-1,k),row=rows[stage];let [reps,metres,rest]=row;
 if((I.qualityLevel||I.level)==='beginner'||I.intensityTolerance==='low')reps=Math.max(3,reps-1);
 const budget=Math.max(0,(qMax??Infinity)-warm-cool);
 while(reps>3&&reps*metres/1000+(reps-1)*rest/easyMid>budget)reps--;
 while(metres>300&&reps*metres/1000+(reps-1)*rest/easyMid>budget)metres-=100;
 return {reps,metres,rest,stage};
}
export function thresholdMinutes(I,k){
 const level=I.qualityLevel||I.level,start=level==='advanced'?18:level==='beginner'?10:12;
 const ceiling=I.daysPerWeek<=2?20:I.goal.type==='half'?level==='advanced'?36:30:I.goal.type==='marathon'?32:level==='advanced'?36:28;
 const stage=k-Math.floor(k/3),target=Math.min(ceiling,start+2*stage);
 return I.intensityTolerance==='low'?Math.max(8,Math.round(target*.75)):target;
}
export function specificRecipe(I,k){
 const tables={
  '5k':[[4,.6],[4,.8],[3,1],[4,1]],
  '10k':[[3,.8],[3,1],[4,1],[3,1.5],[4,1.2],[3,1.6]],
  half:[[2,1.5],[2,2],[3,1.5],[2,2.5],[2,3],[1,6],[2,3.5],[1,7]],
  marathon:[[2,2],[2,2.5],[2,3],[3,2],[2,3.5],[2,4],[3,3],[2,5],[2,6]],
 };
 const rows=tables[I.goal.type]||tables['10k'],stage=k-Math.floor(k/4);
 return rows[Math.min(rows.length-1,stage)];
}
export function exposureDecision(previous,current,context={}){
 const delta=previous?current.minutes-previous.minutes:0,changed=previous?.recipe!==current.recipe;
 return {status:context.taper||context.recovery?'reduction':!previous?'introduction':delta>1?'dose_progression':changed?'stimulus_change':'consolidation',predecessorStatus:previous?'planned':null,conditionalOnExecution:true,reason:context.taper?'Podtrzymanie rytmu z redukcją zmęczenia.':context.recovery?'Odciążenie po bloku sezonu.':!previous?'Pierwsza porównywalna ekspozycja w dostępnym budżecie.':delta>1?'Rozwój dawki tej rodziny; tempo i koszt odpoczynku nie rosną równocześnie.':changed?'Inny odcinek lub struktura przy kontrolowanej dawce.':'Konsolidacja; potwierdzenie tolerancji wymaga wykonania.',stagnationReview:!!previous&&!changed&&context.sameRecipeCount>=3&&!context.maintenance&&!context.taper&&!context.recovery};
}

/** Executed work is comparable only within the same physiological family and dose. */
export function comparableExposureState(history=[],today,family) {
  const rows=history.filter(o=>o.status!=='missed'&&o.sessionType===family&&o.workMinutes>0&&o.date<=today&&(Date.parse(today)-Date.parse(o.date))/86400000<=42).sort((a,b)=>a.date.localeCompare(b.date));
  const latest=rows.at(-1),similar=latest?rows.filter(o=>Math.abs(o.workMinutes/latest.workMinutes-1)<=.20):[];
  const tolerable=similar.filter(o=>o.rpe!=null&&o.rpe<=8&&!(o.fatigue>=4)&&!(o.pain>=3)&&!o.activeInjury&&(o.sleepHours==null||o.sleepHours>=6)&&(o.wellbeing==null||o.wellbeing>=3));
  const days=[...new Set(tolerable.map(o=>o.date))],span=days.length?(Date.parse(days.at(-1))-Date.parse(days[0]))/86400000:0;
  const fatigued=!!latest&&(latest.rpe>=9||latest.fatigue>=4||latest.pain>=3||latest.activeInjury);
  const canProgress=days.length>=2&&span>=7&&!fatigued;
  return {family,status:fatigued?'fatigue':canProgress?'progression_consideration':'insufficient_evidence',observed:rows.length,comparable:days.length,spanDays:span,canProgress,
    introductoryStep:canProgress?Math.min(6,Math.floor(days.length/2)):0,
    retainedDoseMinutes:latest?latest.workMinutes*(fatigued?.8:1):null,
    predecessor:latest?{id:latest.id,date:latest.date,workMinutes:latest.workMinutes,status:'completed'}:null,
    plannedExposuresAreEvidence:false,reason:'Dwa–trzy porównywalne wykonania mogą uzasadnić mały krok; brak RPE lub dawki nie jest sukcesem.'};
}
