// Progress one dose dimension at a time, with consolidation; no automatic pace gain.
export function intervalRecipe(I,k,qMax,warm,cool,easyMid) {
  const target=I.goal.type;
  const rows=target==='5k'?[[6,400,90],[7,400,90],[5,600,90],[6,600,90],[4,800,120],[5,800,120],[4,1000,150],[5,1000,150]]:
    target==='10k'?[[5,600,90],[4,800,120],[4,800,120],[4,1000,150],[5,1000,150],[4,1200,150],[3,1600,180],[4,1600,180]]:
    [[4,800,120],[5,800,120],[4,1000,150],[5,1000,150],[4,1200,150],[3,1600,180]];
  const index=Math.min(rows.length-1,k);
  let [reps,metres,rest]=rows[index];
  if((I.qualityLevel || I.level)==='beginner' || I.intensityTolerance==='low')reps=Math.max(3,reps-1);
  const available=Math.max(0,(qMax || Infinity)-warm-cool);
  // Keep total fast distance within the real session budget. Use a shorter repetition
  // rather than repeating three oversized reps for the entire preparation.
  while(reps>3 && reps*metres/1000+reps*rest/easyMid>available)reps--;
  while(metres>400 && reps*metres/1000+reps*rest/easyMid>available)metres-=200;
  return {reps,metres,rest,stage:index};
}
export function thresholdMinutes(I,k) {
  const level=I.qualityLevel || I.level;
  const base=level==='advanced'?20:level==='beginner'?10:14;
  const ceiling=I.daysPerWeek<=2?20:level==='advanced'?36:28;
  // Each third exposure consolidates; pace and recovery do not get faster.
  const dose=Math.min(ceiling,base+(level==='beginner'?2:3)*(k-Math.floor(k/3)));
  return I.intensityTolerance==='low'?Math.max(10,Math.round(dose*.75)):dose;
}
export function specificRecipe(I,k) {
  const n=k-Math.floor(k/3), time=I.goal.targetTimeSec && I.trainingIntent==='poprawa';
  const tables={marathon:[[2,2],[2,3],[2,4],[3,3],[2,5],[3,4]],half:[[2,2],[2,2.5],[2,3],[3,2.5],[2,4]],'10k':[[3,1],[4,1],[3,1.5],[4,1.5],[3,2]]};
  const rows=tables[I.goal.type] || tables['10k'];
  return rows[Math.min(rows.length-1,n+(time?1:0))];
}

// Context is explicit: retained planned exposures never certify completion.
export function exposureDecision(previous,current,context={}) {
  const delta=previous?current.minutes-previous.minutes:0;
  const changed=previous?.recipe!==current.recipe;
  return {status:context.taper||context.recovery?'reduction':!previous?'introduction':delta>1?'dose_progression':changed?'stimulus_change':'consolidation',
    predecessorStatus:previous?'planned':null,conditionalOnExecution:true,
    reason:context.taper?'Redukcja przed startem.':context.recovery?'Odciążenie po wcześniejszych tygodniach.':!previous?'Pierwsza porównywalna ekspozycja.':delta>1?'Rozwinięcie dawki w dostępnym budżecie, bez automatycznego przyspieszania.':changed?'Zmiana długości lub struktury przy kontrolowanej dawce.':'Celowe powtórzenie dla utrwalenia; tolerancja wymaga wykonania.',
    stagnationReview:!!previous&&!changed&&context.sameRecipeCount>=3&&!context.maintenance&&!context.taper&&!context.recovery};
}
