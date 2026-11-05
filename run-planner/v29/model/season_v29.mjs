import {enduranceIntent} from './profile_v29.mjs';
/** Season contract: weeks[] is a conditional prescription, never evidence of completion.
 * Allocation may reduce targets, but cannot promote planned adaptation to observed readiness.
 * No quality scorer participates in this module. */
const DAY=86400000,add=(d,n)=>new Date(Date.parse(d)+n*DAY).toISOString().slice(0,10),diff=(a,b)=>Math.round((Date.parse(b)-Date.parse(a))/DAY),dow=d=>new Date(d).getUTCDay(),mon=d=>add(d,-((dow(d)+6)%7)),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const objectives={base:'regularnosc_i_tolerancja',build:'wytrzymalosc_i_prog',peak:'wytrzymalosc_specyficzna',taper:'redukcja_zmeczenia_z_rytmem'};
export function seasonPhases(I,{W,T,rwLen=0,startMon}){
 const anchor=I.seasonContext?.originStart||I.today,originMon=mon(anchor),offset=Math.max(0,Math.floor(diff(originMon,startMon)/7)),total=W+offset,R=total-T;
 const prepared=I.currentWeeklyKm>=25&&I.longestRecentRun>=8&&(I.experienceMonths==null||I.experienceMonths>=6),longReady=I.currentWeeklyKm>=35&&I.longestRecentRun>=16;
 let base=Math.max(rwLen,prepared?2:I.currentWeeklyKm>=12?3:Math.min(6,Math.ceil(R*.35)));
 if(I.goal.type==='marathon')base=Math.max(base,longReady?Math.min(4,Math.max(2,Math.floor(R*.2))):Math.min(6,Math.max(3,Math.floor(R*.3))));
 if(['half','marathon'].includes(I.goal.type))base=Math.max(base,Math.round(2+3*enduranceIntent(I).enduranceGap.value));
 base=Math.min(base,Math.max(0,R-3));
 const specific=Math.min(Math.max(1,R-base-2),Math.max(I.goal.type==='marathon'?4:3,Math.round(R*(I.goal.type==='marathon'?.36:.30))));
 const build=Math.max(0,R-base-specific),returnWeeks=Number(I.breakDays??I.przerwaDni)>=14?Math.min(3,W-T):0;
 return {anchor,originMon,offset,total,R,base,build,specific,phaseOf(w){const ordinal=w+offset;if(w<returnWeeks)return 'base';return ordinal>=R?'taper':ordinal<base?'base':ordinal<base+build?'build':'peak';}};
}
export function buildSeason(I,c){
 const phases=seasonPhases(I,c),risk=I.age>=50||I.experienceMonths!=null&&I.experienceMonths<6||I.loadTolerance==='low'||I.injuries||I.historiaKontuzjiFlag;
 const cycle=I.fatigue>=4?2:risk?3:I.level==='advanced'&&I.currentWeeklyKm>=50&&I.experienceMonths>=24?5:4;
 const intent=enduranceIntent(I),maintenance=['utrzymanie','aktywnosc'].includes(I.trainingIntent)&&!intent.develop,W=c.W,R=W-c.T;
 // Cap comes from the existing athlete/day/time envelope; no global volume multiplier.
 const peak=maintenance?Math.min(c.peak,c.startVol*(I.goal.type==='marathon'||I.goal.type==='half'?1.1:1.05)):c.peak;
 const peakWeek=Math.max(0,Math.min(R-1,...Array.from({length:W},(_,w)=>w).filter(w=>!I.goal.raceDate||diff(add(c.startMon,w*7),I.goal.raceDate)>=21).slice(-1)));
 const recovery=Array.from({length:W},(_,w)=>w>0&&w<R&&(c.startVol>=8||c.peak>=8&&w>=3)&&(w+phases.offset)%cycle===cycle-1);
 let lastRegular=c.startVol,lastLong=c.L0;const weeks=[],blocks=[];
 const actual=(I.completedHistory||[]).filter(o=>o.status!=='missed'&&o.date<=I.today&&diff(o.date,I.today)<14);
 const covered=I.executionCoverage?.completeWindow===true&&I.executionCoverage.coverageTo>=I.today&&diff(I.executionCoverage.coverageFrom,I.today)>=14;
 const taperAnchor=covered?Math.min(c.peak,actual.reduce((n,o)=>n+(o.distanceKm||0),0)/2):null;
 for(let w=0;w<W;w++){
  const phase=phases.phaseOf(w),taper=phase==='taper',deload=recovery[w]&&!taper,ordinal=w+phases.offset,position=ordinal%cycle,block=Math.floor(ordinal/cycle);
  const role=taper?'taper':deload?'deload':w===0?'introduction':position===cycle-2?'consolidation':'development';
  let volume=lastRegular,lr=lastLong;
  if(taper){const idx=Math.max(1,w-R+1),anchor=taperAnchor==null?lastRegular:Math.min(lastRegular,taperAnchor),final=clamp(.49-lastRegular*.001+(I.daysPerWeek<=2?.04:0)-(I.fatigue>=4?.05:0),.32,.52),fraction=Math.exp(Math.log(final)*idx/Math.max(1,c.T));volume=anchor*fraction;lr=lastLong*fraction;}
  else if(deload){volume=lastRegular*(risk?.78:.82);lr=lastLong*.75;}
  else if(role==='development'&&!maintenance){
    const tolerance=(risk?.7:1)*(I.fatigue>=4?.5:1),rate=(I.level==='advanced'?.075:I.level==='beginner'?.04:.06)*tolerance;
    const residual=Math.max(0,peak-lastRegular),absoluteFloor=(I.daysPerWeek<=2?.75:1)*tolerance;
    const step=Math.min(residual,Math.max(0,Math.min(Math.max(1,residual*.22),Math.max(lastRegular*rate,absoluteFloor))));
    volume=Math.min(peak,lastRegular+step);
    const longStep=Math.min(I.goal.type==='marathon'?1.5:1.25,Math.max(0,c.Lpeak-lastLong)*.32)*tolerance;
    lr=w>peakWeek?Math.min(lastLong,c.Lpeak*.88**(w-peakWeek)):Math.min(c.Lpeak,lastLong+longStep);
    lastRegular=volume;lastLong=lr;
  }
  if(w>peakWeek&&!taper){lr=Math.min(lr,c.Lpeak*.88**(w-peakWeek));}
  const longMinutes=Math.min(c.longMin,Math.max(0,lr*c.longPace/60));lr=Math.min(lr,longMinutes*60/c.longPace);
  const qualityMinutes=Math.min(I.level==='advanced'?46:36,volume*c.easyMid/60*(phase==='base'?.075:.13))*(deload?.5:taper?.6:1);
  const reason=taper?`Taper zależny od dystansu/objętości i częstotliwości; baza ${covered?'wykonana w pełnym oknie':'planowana, wymaga potwierdzenia'}.`:deload?`Odciążenie bloku ${block+1}; mniej pracy i krótszy długi bieg.`:role==='consolidation'?'Konsolidacja bez obowiązkowego wzrostu objętości lub długiego biegu.':maintenance?'Utrzymanie możliwości bez wymuszonego wzrostu.':'Warunkowy krok według pozostałej luki i tolerancji; szczyt jest sufitem, nie obowiązkiem.';
  weeks.push({index:w,ordinal,from:add(c.startMon,w*7),phase,block,blockRole:role,recovery:deload,adaptiveGoal:objectives[phase],status:'planned',conditionalOnExecution:true,targets:{km:volume,longKm:lr,longMinutes,qualityMinutes},reason});
  if(!blocks[block])blocks[block]={index:block,length:cycle,from:add(c.startMon,w*7),objective:objectives[phase],conditional:true};
 }

 return {version:'29.0.0',blocks:blocks.filter(Boolean),taperEvidence:{source:covered?'completed_14_days':'planned_conservative',notReadiness:true},intent,originStart:phases.anchor,offsetWeeks:phases.offset,plannedOnly:true,readinessIsNotImplied:true,cycleWeeks:cycle,phaseBoundaries:{base:phases.base,build:phases.build,specific:phases.specific},weeks,realized:[]};
}
export function recordSeasonWeek(season,index,units){
 const t=season.weeks[index],runs=units.filter(x=>!['sila','cross'].includes(x.podtyp)),km=runs.reduce((s,x)=>s+x.dystans_km,0),minutes=runs.reduce((s,x)=>s+x.czas_min,0);
 season.realized.push({index,from:t.from,status:'planned',notCompleted:true,recoveryAllocated:runs.some(t=>t.odciazenie),recoveryTarget:t.recovery,km,minutes,longKm:Math.max(0,...runs.filter(x=>x.podtyp==='dlugi').map(x=>x.dystans_km)),reason:km<t.targets.km-1?'Budżet ograniczony kalendarzem, minutami lub ochroną obciążenia; nie nadrabiaj.':t.reason});
}
