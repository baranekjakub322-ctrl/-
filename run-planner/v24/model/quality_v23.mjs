// Progress one dose dimension at a time, with consolidation; no automatic pace gain.
export function intervalRecipe(I,k,qMax,warm,cool,easyMid) {
  const target=I.goal.type;
  const rows=target==='5k'?[[6,400,90],[7,400,90],[5,600,90],[6,600,90],[4,800,120],[5,800,120],[4,1000,150],[5,1000,150]]:
    target==='10k'?[[5,600,90],[4,800,120],[4,800,120],[4,1000,150],[5,1000,150],[4,1200,150],[3,1600,180],[4,1600,180]]:
    [[4,800,120],[5,800,120],[4,1000,150],[5,1000,150],[4,1200,150],[3,1600,180]];
  const index=Math.min(rows.length-1,k);
  let [reps,metres,rest]=rows[index];
  if(I.level==='beginner')reps=Math.max(3,reps-1);
  const available=Math.max(0,(qMax || Infinity)-warm-cool);
  // Keep total fast distance within the real session budget. Use a shorter repetition
  // rather than repeating three oversized reps for the entire preparation.
  while(reps>3 && reps*metres/1000+reps*rest/easyMid>available)reps--;
  while(metres>400 && reps*metres/1000+reps*rest/easyMid>available)metres-=200;
  return {reps,metres,rest,stage:index};
}
export function thresholdMinutes(I,k) {
  const base=I.level==='advanced'?20:I.level==='beginner'?10:14;
  const ceiling=I.daysPerWeek<=2?18:I.level==='advanced'?36:28;
  return Math.min(ceiling,base+2*Math.floor(k/2));
}
export function specificRecipe(I,k) {
  const n=Math.floor(k/2), time=I.goal.targetTimeSec && I.trainingIntent==='poprawa';
  const tables={marathon:[[2,2],[2,3],[2,4],[3,3],[2,5],[3,4]],half:[[2,2],[2,2.5],[2,3],[3,2.5],[2,4]],'10k':[[3,1],[4,1],[3,1.5],[4,1.5],[3,2]]};
  const rows=tables[I.goal.type] || tables['10k'];
  return rows[Math.min(rows.length-1,n+(time?1:0))];
}
