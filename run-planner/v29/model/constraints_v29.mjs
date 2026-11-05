import {measureWorkout,retainFamilyRecipes} from './dose_v29.mjs';
// Bounded deterministic planning. This module never imports any quality scorer.
const DAY = 86400000;
const hard = t => ['tempo','interwaly','tempo_startowe','podbiegi','test','dlugi'].includes(t.podtyp);
const aux = t => ['sila','cross','mobilnosc'].includes(t.podtyp);
const gap = (a,b) => Math.abs((Date.parse(a)-Date.parse(b))/DAY);
const day = d => new Date(d+'T00:00:00Z').getUTCDay();
const mon = d => new Date(Date.parse(d)-((day(d)+6)%7)*DAY).toISOString().slice(0,10);
const validDate = s => typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
export {workDose} from './dose_v29.mjs';
export function weekBudget(units) {
 const runs=units.filter(t=>!aux(t)),families={};let qualityMinutes=0,load=0;
 for(const t of runs){const d=measureWorkout(t);load+=d.load.estimate;for(const[f,v]of Object.entries(d.families)){families[f]=(families[f]||0)+(v.workMin||0);if(f!=='strides')qualityMinutes+=v.workMin||0;}}
 return {longKm:Math.max(0,...runs.filter(t=>t.podtyp==='dlugi').map(t=>t.dystans_km)),workMinutes:families,days:runs.map(t=>t.data),hardSessions:runs.filter(hard).length,km:runs.reduce((n,t)=>n+t.dystans_km,0),minutes:runs.reduce((n,t)=>n+t.czas_min,0),sessions:runs.length,qualityMinutes,longMinutes:Math.max(0,...runs.filter(t=>t.podtyp==='dlugi').map(t=>t.czas_min)),estimatedLoad:load};
}
function candidateIssues(c,units) {
  const errors=[];
  for(const t of units){const limit=[0,6].includes(day(t.data))?c.I.maxMinutesWe:c.I.maxMinutesWd;
    if(!validDate(t.data)||!c.I.availableDays.includes(day(t.data)))errors.push('availability');
    if(!Number.isFinite(t.czas_min)||!Number.isFinite(t.dystans_km)||t.czas_min<0||t.dystans_km<0||t.czas_min>limit)errors.push('time_or_numbers');
  }
  const demanding=units.filter(hard);
  for(let n=0;n<demanding.length;n++)for(let j=n+1;j<demanding.length;j++)if(gap(demanding[n].data,demanding[j].data)<c.I.recoveryDays)errors.push('recovery');
  for(const t of demanding)if(c.state.hardDates.some(d=>d<t.data&&gap(d,t.data)<c.I.recoveryDays))errors.push('previous_week_recovery');
  return errors;
}
const compareRank=(a,b)=>{for(let n=0;n<Math.max(a.length,b.length);n++)if((a[n]||0)!==(b[n]||0))return (a[n]||0)-(b[n]||0);return 0;};
// Generic bounded beam, exercised separately with a case whose local winner is globally worse.
export function boundedLookahead(roots,expand,rank,{depth=3,width=2,maxNodes=24}={}){
 let nodes=roots.length,beam=roots.map(root=>({root,path:[root]})).sort((a,b)=>compareRank(rank(a.path),rank(b.path))).slice(0,width);
 for(let d=1;d<depth;d++){
  const next=[];for(const b of beam){for(const child of expand(b.path.at(-1),d,b.path)){if(nodes>=maxNodes)break;nodes++;next.push({root:b.root,path:[...b.path,child]});}if(nodes>=maxNodes)break;}
  if(!next.length)break;beam=next.sort((a,b)=>compareRank(rank(a.path),rank(b.path))).slice(0,width);
 }
 return {best:beam[0],finalists:beam,nodes};
}
function variantsFor(c){
 const variants=[{label:'preferowany',patch:{}}],alt=c.chosen.filter(d=>d!==c.longDow).sort((a,b)=>(a+6)%7-(b+6)%7);
 if(!c.recovery&&!c.taper&&!c.raceWeek&&!c.rw)for(const d of alt)if(Math.min((d-c.longDow+7)%7,(c.longDow-d+7)%7)>=c.I.recoveryDays)variants.push({label:'akcent_dzien_'+d,patch:{qualityDow:d}});
 if(c.I.longRunDow==null&&!c.taper&&!c.raceWeek&&!c.rw)for(const d of [...alt].sort((a,b)=>Number([0,6].includes(b))-Number([0,6].includes(a))||a-b))variants.push({label:'dlugi_dzien_'+d,patch:{longDow:d}});
 variants.push({label:'konsolidacja_bez_dodatkowego_akcentu',patch:{noQuality:true}});return variants;
}
export function constrainedWeek(c,build){
 const endurance=['half','marathon'].includes(c.I.goal?.type)&&c.I.daysPerWeek>=3,cap=Math.max(3,Math.min(6,c.I.planningCandidates||4)),variants=variantsFor(c),evaluated=[];
 const evaluate=(ctx,v,index)=>{
  const {constraintDecisions,...mutable}=ctx.state,state=structuredClone(mutable),context={...ctx,...v.patch,state};
  const units=build(context),errors=candidateIssues(context,units),budget=weekBudget(units),baseline=evaluated[0]?.budget;
  const longTarget=!ctx.noLong&&!ctx.raceWeek&&!ctx.taper&&!ctx.rw?(ctx.envelope?.longKm.recommended??ctx.longKm):0;
  const expectedQuality=!ctx.noQuality&&!ctx.recovery&&!ctx.taper&&!ctx.rw&&ctx.weekIdx>=3&&ctx.vol>=15&&ctx.I.daysPerWeek>=2?1:0;
  const missingQuality=Math.max(0,expectedQuality-units.filter(t=>hard(t)&&t.podtyp!=='dlugi').length),missingLong=Math.max(0,longTarget-budget.longKm),lostStimulus=baseline?Object.keys(baseline.workMinutes).filter(f=>f!=='strides'&&!(budget.workMinutes[f]>0)).length:0;
  const rank=[errors.length,...(endurance?[Math.round(missingLong*10),missingQuality]:[missingQuality,lostStimulus]),Math.round(Math.abs((ctx.budget??ctx.vol)-budget.km)*10),index];
  return {index,label:v.label,units,state,context,errors,budget,missingQuality,missingLong,lostStimulus,rank};
 };
 evaluated.push(evaluate(c,variants[0],0));const first=evaluated[0],conflict=first.errors.length>0||endurance&&(first.budget.km<(c.budget??c.vol)-2||first.missingLong>=1),blockBoundary=c.seasonWeek?.blockRole==='introduction'||c.seasonWeek?.ordinal%4===0||c.weekIdx%4===0;
 const horizon=(c.futureWeeks||[]).filter(w=>w.phase!=='taper').slice(0,2),search=horizon.length>0&&!c.rw&&!c.taper&&!c.raceWeek&&(blockBoundary||conflict);
 const explicit=c.I.planningCandidates>2||c.I.longRunDow!=null||c.I.maxMinutesWd!==c.I.maxMinutesWe;
 if(search||explicit||conflict)for(let n=1;n<Math.min(cap,variants.length);n++)evaluated.push(evaluate(c,variants[n],n));
 const horizonRank=path=>{
  const errors=path.reduce((n,x)=>n+x.errors.length,0),longLoss=path.reduce((n,x)=>n+Math.round(x.missingLong*10),0),qualityLoss=path.reduce((n,x)=>n+x.missingQuality,0),volumeLoss=path.reduce((n,x)=>n+Math.round(Math.abs((x.context.budget??x.context.vol)-x.budget.km)*10),0);
  const families=new Set(path.flatMap(x=>Object.keys(x.budget.workMinutes).filter(f=>f!=='strides'))),prior=Object.keys(c.state.familyRecipes||{}),continuity=prior.length&&!prior.some(f=>families.has(f))?1:0;
  return [errors,...(endurance?[longLoss,qualityLoss]:[qualityLoss,continuity]),volumeLoss,path[0].lostStimulus,path[0].index];
 };
 let lookahead=null,selected;
 if(search){
  lookahead=boundedLookahead(evaluated,(previous,depth)=>{
   const future=horizon[depth-1];if(!future)return [];
   const state=structuredClone(previous.state);state.hardDates=[...state.hardDates,...previous.units.filter(hard).map(t=>t.data)].slice(-6);retainFamilyRecipes(state,previous.units);
   const recovery=future.recovery,limit=recovery?previous.budget.km*.82:previous.context.recovery?Math.max(Math.floor(previous.budget.km*1.06)+1,Math.ceil(previous.budget.km)+2):Math.max(previous.budget.km*1.12,previous.budget.km+3);
   const budget=Math.max(0,Math.min(future.targets.km,limit)),context={...c,I:{...c.I,seasonWeek:future},seasonWeek:future,state,weekStart:future.from,weekIdx:c.weekIdx+depth,kQuality:c.kQuality+depth,vol:budget,budget,longKm:Math.min(future.targets.longKm,recovery?Math.max(3,previous.budget.longKm*.75):Math.max(previous.budget.longKm+2,previous.budget.longKm*1.15)),phase:future.phase,recovery,taper:false,raceWeek:false,isTestWeek:false,envelope:null,prevRuns:previous.budget.sessions};
   return variantsFor(context).slice(0,3).map((v,n)=>evaluate(context,v,n));
  },horizonRank,{depth:horizon.length+1,width:2,maxNodes:24});selected=lookahead.best.root;
 }else{evaluated.sort((a,b)=>compareRank(a.rank,b.rank));selected=evaluated[0];}
 const previousDecisions=c.state.constraintDecisions||[];Object.assign(c.state,selected.state);c.state.constraintDecisions=previousDecisions;c.selectedAllocation=selected.context.beforeShareBudget||selected.budget;
 c.state.constraintDecisions.push({week:c.weekStart,phase:c.phase,conditional:true,pruned:variants.length-evaluated.length,chosen:selected.label,
  horizonWeeks:lookahead?.best.path.length||1,evaluatedNodes:lookahead?.nodes||evaluated.length,searchLimit:24,
  forecast:lookahead?.best.path.map(x=>({week:x.context.weekStart,label:x.label,violations:x.errors,budget:x.budget,notCompleted:true})),
  preservedFamilies:Object.keys(selected.budget.workMinutes),candidates:evaluated.map(v=>({label:v.label,violations:v.errors,budget:v.budget,lostStimulus:v.lostStimulus,rank:v.rank,rejected:v!==selected,reason:v===selected?'zachowany bodziec i wykonalna trajektoria':v.errors.length?'twarde ograniczenie':'gorszy porządek ograniczeń, rytmu lub budżetu',cost:null})),
  reason:lookahead?'Ograniczony beam 2–3 tygodni: bezpieczeństwo, ciągłość bodźców i regeneracja przed kilometrami; prognoza nie jest wykonaniem.':'Bezpieczny lokalny wariant; przeszukiwanie uruchamiane na granicy bloku lub przy konflikcie, bez scorera.'});
 return selected.units;
}
export function validateSafety(input,plan) {
  const issues=[],units=plan.treningi||[],seen=new Set(),weeks=new Map();
  const issue=(code,t,detail)=>issues.push({severity:'critical',code,date:t?.data||null,detail});
  for(const t of units){
    if(!validDate(t.data)){issue('INVALID_DATE',t,'Niepoprawna data.');continue;}
    if(seen.has(t.data))issue('DUPLICATE_DATE',t,'Konflikt jednostek.');seen.add(t.data);
    if(t.data<input.today)issue('PAST_PLANNING',t,'Nowa recepta w przeszłości.');
    if(!(input.availableDays||[]).map(Number).includes(day(t.data)))issue('UNAVAILABLE_DAY',t,'Dzień poza dostępnością.');
    if(!Number.isFinite(t.dystans_km)||!Number.isFinite(t.czas_min)||t.dystans_km<0||t.czas_min<=0)issue('INVALID_NUMBERS',t,'Niepoprawne km lub minuty.');
    const lim=Number([0,6].includes(day(t.data))?input.maxMinutesWeekend??input.maxMinutes:input.maxMinutesWeekday??input.maxMinutes);
    if(lim>0&&t.czas_min>lim)issue('TIME_LIMIT',t,'Przekroczono jawny limit dnia.');
    if(t.podtyp==='dlugi'&&Number(input.maxLongMinutes)>0&&t.czas_min>input.maxLongMinutes)issue('LONG_TIME_LIMIT',t,'Przekroczono jawny limit długiego biegu.');
    if(!aux(t)){const key=mon(t.data),w=weeks.get(key)||[];w.push(t);weeks.set(key,w);}
  }
  for(const [date,rows]of weeks){const race=input.goal?.raceDate&&mon(input.goal.raceDate)===date?1:0;if(rows.length+race>Number(input.daysPerWeek||3))issue('FREQUENCY',{data:date},'Start wlicza się do częstotliwości.');}
  const demanding=units.filter(hard).sort((a,b)=>a.data.localeCompare(b.data)),rest=Number(input.recoveryDays||2);
  for(let n=1;n<demanding.length;n++)if(gap(demanding[n-1].data,demanding[n].data)<rest)issue('HARD_DENSITY',demanding[n],'Zbyt krótki odstęp między wymagającymi jednostkami.');
  if((input.activeInjury||Number(input.pain)>=4)&&units.length)issue('ACTIVE_SYMPTOMS',units[0],'Harmonogram przy zgłoszonych objawach.');
  return {version:'26.0.0',independentOfScoring:true,clinicalPrediction:false,critical:issues.length,issues,weekly:[...weeks].map(([from,rows])=>({from,...weekBudget(rows)}))};
}
