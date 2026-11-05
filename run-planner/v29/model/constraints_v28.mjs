// Bounded deterministic planning. This module never imports any quality scorer.
const DAY = 86400000;
const hard = t => ['tempo','interwaly','tempo_startowe','podbiegi','test','dlugi'].includes(t.podtyp);
const aux = t => ['sila','cross','mobilnosc'].includes(t.podtyp);
const gap = (a,b) => Math.abs((Date.parse(a)-Date.parse(b))/DAY);
const day = d => new Date(d+'T00:00:00Z').getUTCDay();
const mon = d => new Date(Date.parse(d)-((day(d)+6)%7)*DAY).toISOString().slice(0,10);
const validDate = s => typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
export function workDose(t) {
  const main=(t.kroki||[]).filter(s=>/Część główna|^Blok|^Test|Podbiegi|Końcówka/.test(s.etap||''));
  let km=0,minutes=0;
  for(const s of main){const d=Number(s.dystans_km??((s.powtorzenia||0)*(s.dystans_m||0)/1000));const p=[...String(s.tempo||t.tempo_zakres||'').matchAll(/(\d+):(\d{2})/g)].slice(0,2).map(m=>+m[1]*60 + +m[2]);km+=d;minutes+=Number(s.praca_min??s.czas_min??(d*(p.length?p.reduce((n,x)=>n+x,0)/p.length:360)/60));}
  return {km,minutes};
}
export function weekBudget(units) {
  const runs=units.filter(t=>!aux(t));
  const families={};for(const t of runs)if(hard(t)&&t.podtyp!=='dlugi')families[t.podtyp]=(families[t.podtyp]||0)+workDose(t).minutes;
  return {longKm:Math.max(0,...runs.filter(t=>t.podtyp==='dlugi').map(t=>t.dystans_km)),workMinutes:families,days:runs.map(t=>t.data),hardSessions:runs.filter(hard).length,km:runs.reduce((n,t)=>n+t.dystans_km,0),minutes:runs.reduce((n,t)=>n+t.czas_min,0),sessions:runs.length,qualityMinutes:runs.filter(t=>hard(t)&&t.podtyp!=='dlugi').reduce((n,t)=>n+workDose(t).minutes,0),longMinutes:Math.max(0,...runs.filter(t=>t.podtyp==='dlugi').map(t=>t.czas_min)),estimatedLoad:runs.reduce((n,t)=>n+(t.intensywnosc?.obciazenieSzacunkowe??t.czas_min*({dlugi:4,tempo:7,interwaly:8,tempo_startowe:5}[t.podtyp]||3)),0)};
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
export function constrainedWeek(c,build) {
  const endurance=['half','marathon'].includes(c.I.goal?.type)&&c.I.daysPerWeek>=3;
  const count=c.I.planningCandidates??(endurance?4:2),variants=[{label:'preferowany',patch:{}}];
  const alternatives=c.chosen.filter(d=>d!==c.longDow).sort((a,b)=>Number([0,6].includes(b))-Number([0,6].includes(a))||a-b);
  // Move quality before sacrificing the important long run or extending a recovery run.
  if(endurance&&!c.recovery&&!c.taper&&!c.raceWeek&&!c.rw){
    for(const d of [...alternatives].sort((a,b)=>(a+6)%7-(b+6)%7))
      if(Math.min((d-c.longDow+7)%7,(c.longDow-d+7)%7)>=c.I.recoveryDays)
        variants.push({label:'akcent_dzien_'+d,patch:{qualityDow:d}});
  }
  if(c.I.longRunDow==null&&!c.taper&&!c.raceWeek&&!c.rw)
    for(const d of alternatives)variants.push({label:'dlugi_dzien_'+d,patch:{longDow:d}});
  variants.push({label:'konsolidacja_bez_dodatkowego_akcentu',patch:{noQuality:true}});
  const evaluated=[];
  const evaluate=(v,index)=>{
    const {constraintDecisions,...mutableState}=c.state,state=structuredClone(mutableState),context={...c,...v.patch,state};
    if(constraintDecisions)state.constraintDecisions=constraintDecisions;
    const units=build(context),errors=candidateIssues(context,units),budget=weekBudget(units);
    const originalQuality=evaluated[0]?.units.filter(t=>hard(t)&&t.podtyp!=='dlugi')||[];
    const lostStimulus=originalQuality.reduce((n,t)=>n+Number(!units.some(x=>x.podtyp===t.podtyp)),0);
    const longTarget=!c.noLong&&!c.raceWeek&&!c.taper&&!c.rw?c.envelope?.longKm.recommended??c.longKm:0;
    const missingLong=Math.max(0,longTarget-budget.longKm);
    const target=c.budget??c.vol;
    // A tuple, never a weighted sum: critical feasibility cannot be bought by km or quality.
    const rank=endurance?[errors.length,Math.round(missingLong*10),Math.round(Math.abs(target-budget.km)*10),lostStimulus,index]:[errors.length,lostStimulus,Math.round(Math.abs(target-budget.km)*10),index];
    const candidate={index,label:v.label,units,state,context,errors,budget,lostStimulus,rank};evaluated.push(candidate);return candidate;
  };
  const first=evaluate(variants[0],0),explicit=c.I.planningCandidates>2||c.I.longRunDow!=null||c.I.availableDays.length<c.I.daysPerWeek||c.I.maxMinutesWd!==c.I.maxMinutesWe&&![0,6].includes(c.longDow);
  const conflict=first.errors.length>0||endurance&&(first.budget.km<(c.budget??c.vol)-2||first.rank[1]>=10);
  if(explicit||conflict)for(let n=1;n<Math.min(count,variants.length);n++){
    const actualQualityDays=first.units.filter(t=>hard(t)&&t.podtyp!=='dlugi').map(t=>day(t.data));
    if(variants[n].patch.qualityDow!=null&&actualQualityDays.length===1&&actualQualityDays[0]===variants[n].patch.qualityDow)continue;
    evaluate(variants[n],n);
  }
  const compare=(a,b)=>{for(let n=0;n<a.rank.length;n++)if(a.rank[n]!==b.rank[n])return a.rank[n]-b.rank[n];return 0;};evaluated.sort(compare);
  const selected=evaluated[0];Object.assign(c.state,selected.state);
  c.selectedAllocation=selected.context.beforeShareBudget||selected.budget;
  c.state.constraintDecisions??=[];c.state.constraintDecisions.push({week:c.weekStart,phase:c.phase,conditional:true,pruned:variants.length-evaluated.length,chosen:selected.label,
    candidates:evaluated.map(v=>({label:v.label,violations:v.errors,budget:v.budget,lostStimulus:v.lostStimulus,rank:v.rank,cost:null})),
    reason:'Porządek leksykograficzny: twarde ograniczenia, zachowanie długiego biegu/specyfiki, bezpieczna objętość, rytm jakości, stabilny kalendarz. Brak historycznego scorera.'});
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
