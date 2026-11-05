import {weekBudget} from './constraints_v29.mjs';
const DAY=86400000,add=(d,n)=>new Date(Date.parse(d)+n*DAY).toISOString().slice(0,10);
export const REASON_CODES=['SAFETY_LIMIT','SCHEDULE','RECOVERY','INPUT_UNCERTAINTY','PHASE','ALLOCATOR_CAP','REPAIR','ROUNDING','TAPER','RACE_WEEK'];
/** Minimum is an adequacy signal, never permission to force unsafe kilometres. */
export function feasibleEnvelope(I,c) {
  const maxMinutes=c.chosen.reduce((n,d)=>n+([0,6].includes(d)?I.maxMinutesWe:I.maxMinutesWd),0);
  const durationMax=Math.min(c.longMin,[0,6].includes(c.longDow)?I.maxMinutesWe:I.maxMinutesWd);
  const maxLong=Math.max(0,Math.min(c.longKm,durationMax*60/c.longMid));
  const recommended=Math.min(c.budget,maxMinutes*60/c.easyMid);
  const codes=[c.recovery?'RECOVERY':c.taper?'TAPER':c.raceWeek?'RACE_WEEK':'PHASE'];
  if(c.budget<c.vol-1||maxLong<c.longKm-.5)codes.push('SAFETY_LIMIT');
  if(c.chosen.length<I.daysPerWeek)codes.push('SCHEDULE');
  return {status:'conditional_prescription',notExecution:true,km:{minimum:c.raceWeek||c.recovery||c.taper?0:recommended*.85,recommended,maximum:c.budget},
    minutes:{minimum:0,recommended:recommended*c.easyMid/60,maximum:maxMinutes},
    longKm:{minimum:c.recovery||c.taper||c.raceWeek||c.noLong||I.daysPerWeek<=2?0:maxLong*.9,recommended:maxLong,maximum:maxLong},
    longMinutes:{minimum:0,recommended:maxLong*c.longMid/60,maximum:durationMax},
    sessions:{minimum:0,recommended:c.chosen.length,maximum:I.daysPerWeek},codes,
    confidence:I.completedHistory?.length>=12?'limited':'declaration_requires_confirmation',minimumIsNotSafetyPermission:true};
}
export function verifyWeekIntent(desired,envelope,units,context={}) {
  const actual=weekBudget(units),target=envelope.km.recommended,longTarget=envelope.longKm.recommended;
  const partial=context.partial||context.raceWeek;
  const volumeDeficit=Math.max(0,target-actual.km),longDeficit=Math.max(0,longTarget-actual.longKm);
  return {from:context.from,context:{partial:!!context.partial,raceWeek:!!context.raceWeek,candidates:context.candidates||1},status:!partial&&(volumeDeficit>Math.max(3,target*.15)||longDeficit>Math.max(1,longTarget*.15))?'conditional_goal_degraded':'within_envelope',
    desired:{...desired},envelope,allocatedPlan:actual,notCompleted:true,volumeDeficit,longDeficit,
    codes:partial?['SCHEDULE',...(context.raceWeek?['RACE_WEEK']:[])]:volumeDeficit>2||longDeficit>1?['ALLOCATOR_CAP',...envelope.codes]:envelope.codes,
    alternativeAttempted:context.candidates>1,
    decision:partial?'Niepełny tydzień/start: nie nadrabiaj brakujących dni.':volumeDeficit>2||longDeficit>1?'Nie dopisuj intensywnych kilometrów. Sprawdź ograniczenia i warunkowo zdegraduj cel; wariant bazowy nie dowodzi gotowości.':'Zachowano wykonalną intencję przy wskazanych ograniczeniach; progresja pozostaje warunkowa.'};
}
export function createPlanningTrace(I) {
  const enabled=I.debugTrace===true&&!I.__noAlt,rows=enabled?[]:null;
  const record=(week,stage,value,codes=[])=>{if(!enabled)return;
    let before=null;for(let n=rows.length-1;n>=0;n--)if(rows[n].week===week&&rows[n].budget){before=rows[n];break;}const current=value.budget;
    const delta=current&&before?{km:current.km-before.budget.km,minutes:current.minutes-before.budget.minutes,longKm:current.longKm-before.budget.longKm,sessions:current.sessions-before.budget.sessions,workMinutes:Object.fromEntries([...new Set([...Object.keys(before.budget.workMinutes||{}),...Object.keys(current.workMinutes||{})])].map(k=>[k,(current.workMinutes?.[k]||0)-(before.budget.workMinutes?.[k]||0)]))}:null;
    rows.push({week,stage,codes:codes.filter(c=>REASON_CODES.includes(c)),...value,delta,reduction:!!delta&&(delta.km<-.1||delta.longKm<-.1||Object.values(delta.workMinutes).some(v=>v<-.1))});};
  return {enabled,record,units(week,stage,units,codes=[]){if(enabled)record(week,stage,{budget:weekBudget(units)},codes);},
    finish(units,season,raceKm=0,repairChanges=[]){if(!enabled)return undefined;
      for(const w of season.weeks){const end=add(w.from,7),part=units.filter(t=>t.data>=w.from&&t.data<end);const budget=weekBudget(part);const isRace=I.goal.raceDate>=w.from&&I.goal.raceDate<end;if(isRace){budget.raceKm=raceKm;budget.kmIncludingRace=budget.km+raceKm;budget.sessionsIncludingRace=budget.sessions+1;}const codes=['ROUNDING',...(repairChanges.some(z=>z.data>=w.from&&z.data<end)?['REPAIR']:[]),...(isRace?['RACE_WEEK']:[])];record(w.from,'final_actual_plan',{budget},codes);}
      return {version:'28.0.0',plannedNotCompleted:true,rows};
    }};
}

export function reconcileFinalAllocation(plan,input) {
  const allocated=[];
  for(const w of plan.seasonState.weeks){const end=add(w.from,7),part=plan.treningi.filter(t=>t.data>=w.from&&t.data<end);const actual=weekBudget(part),old=plan.intentVerification.find(r=>r.from===w.from);
    if(old)Object.assign(old,verifyWeekIntent(old.desired,old.envelope,part,{...old.context,from:w.from}));
    const race=input.goal?.raceDate>=w.from&&input.goal?.raceDate<add(w.from,7);
    allocated.push({index:w.index,from:w.from,status:'planned',notCompleted:true,...actual,kmIncludingRace:actual.km+(race?({'5k':5,'10k':10,half:21.0975,marathon:42.195}[input.goal.type]||0):0),recoveryAllocated:part.some(t=>t.odciazenie),recoveryTarget:w.recovery});
  }
  plan.seasonState.allocatedWeeks=allocated;
  // Legacy name retained; explicitly denotes planned allocation, not execution.
  plan.seasonState.realized=allocated;
}
