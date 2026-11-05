// Parameterized prescriptions. Indexes alone never select a final workout or confirm adaptation.
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),day=(a,b)=>(Date.parse(b)-Date.parse(a))/86400000;
export function comparableExposureState(history=[],today,family){
 const rows=history.filter(o=>o.status==='done'&&o.sessionType===family&&o.workMinutes>0&&o.date<=today&&day(o.date,today)<=56).sort((a,b)=>a.date.localeCompare(b.date)),latest=rows.at(-1),shape=latest?.stimulus;
 const known=s=>!!s&&s.repetitions>0&&(s.intervalMeters>0||s.intervalSeconds>0)&&s.restSeconds!=null&&['jog','walk','passive','none'].includes(s.restType);
 const comparable=known(shape)?rows.filter(o=>{
  const s=o.stimulus;if(!known(s)||s.restType!==shape.restType)return false;
  if(Math.abs(o.workMinutes/latest.workMinutes-1)>.20)return false;
  for(const k of ['repetitions','intervalMeters','intervalSeconds'])if(shape[k]!=null&&(!(s[k]>0)||Math.abs(s[k]/shape[k]-1)>.20))return false;
  if(Math.abs((s.restSeconds||0)-(shape.restSeconds||0))>Math.max(15,(shape.restSeconds||0)*.2))return false;
  if(s.targetDistance&&shape.targetDistance&&s.targetDistance!==shape.targetDistance)return false;
  const a=s.conditions||{},b=shape.conditions||{};if(!!a.surface!==!!b.surface||(a.temperatureC!=null)!==(b.temperatureC!=null))return false;if(a.surface&&b.surface&&a.surface!==b.surface)return false;if(a.temperatureC!=null&&b.temperatureC!=null&&Math.abs(a.temperatureC-b.temperatureC)>5)return false;
  return true;
 }):[];
 const good=comparable.filter(o=>o.rpe!=null&&o.fatigue!=null&&o.rpe<=8&&o.fatigue<=3&&!(o.pain>=3)&&!o.activeInjury&&!o.illness&&(o.sleepHours==null||o.sleepHours>=6)&&(o.wellbeing==null||o.wellbeing>=3));
 const days=[...new Set(good.map(o=>o.date))],span=days.length?day(days[0],days.at(-1)):0,fatigued=!!latest&&(latest.rpe>=9||latest.fatigue>=4||latest.pain>=3||latest.activeInjury||latest.illness),canProgress=days.length>=2&&span>=7&&!fatigued;
 return {family,status:fatigued?'fatigue':canProgress?'progression_consideration':'insufficient_evidence',observed:rows.length,comparable:days.length,spanDays:span,canProgress,introductoryStep:canProgress?1:0,
  retainedDoseMinutes:latest?latest.workMinutes*(fatigued?.8:1):null,executedDose:latest?{workMin:latest.workMinutes,structure:latest.stimulus||null,date:latest.date}:null,
  predecessor:latest?{id:latest.id,date:latest.date,workMinutes:latest.workMinutes,status:'completed'}:null,evidenceIds:good.map(o=>o.id),structureKnown:known(shape),
  confidence:canProgress?'limited':'low',plannedExposuresAreEvidence:false,reason:'Porównujemy wykonaną rodzinę, strukturę, przerwy, dawkę i RPE/zmęczenie; brak danych nie potwierdza tolerancji.'};
}
const goals={threshold:'wytrzymałość progowa',interval:'wydolność tlenowa i ekonomia',specific:'wytrzymałość w intensywności docelowego dystansu'};
export function prescribeQuality(c,family){
 const I=c.I,phase=c.phase||I.seasonWeek?.phase||'build',level=I.qualityLevel||I.level,observed=comparableExposureState(I.completedHistory||[],I.today,family),adaptive=I.__fromAdaptation===true;
 const previous=c.state?.familyRecipes?.[family],mode=adaptive?'adaptive':'initial_conditional',maintenance=['utrzymanie','aktywnosc'].includes(I.trainingIntent)&&['5k','10k'].includes(I.goal.type);
 const pace=family==='threshold'?(c.P.tempo.fast+c.P.tempo.slow)/2:family==='interval'?(c.P.interval.fast+c.P.interval.slow)/2:c.specificPace||c.goalPace;
 const weeklyMinutes=Math.max(0,(c.vol??I.currentWeeklyKm)*c.easyMid/60),slots=Math.max(1,c.qualitySlots||1),phaseDose=(c.seasonWeek||I.seasonWeek)?.targets?.qualityMinutes;
 const levelIndex=level==='advanced'?2:level==='beginner'?0:1;
 const specificCaps={'5k':[8,16,20],'10k':[12,24,30],half:[14,32,40],marathon:[16,40,50]};
 const levelCap=family==='specific'?(specificCaps[I.goal.type]||[10,24,30])[levelIndex]:(family==='threshold'?[14,28,36]:[10,24,28])[levelIndex];
 const capacity=Math.max(6,Math.min(levelCap,weeklyMinutes*(phase==='base'?.075:.13)/slots,phaseDose>0?phaseDose/slots:levelCap));
 const tolerance=I.intensityTolerance==='low'||I.loadTolerance==='low'||I.fatigue>=4?.75:1;
 const budget=Math.max(0,Math.min(c.qMax??12,Number.isFinite(c.dayMinutes)?c.dayMinutes*60/c.easyMid:Infinity)-c.warm-c.cool);
 let reps=family==='threshold'?1:family==='interval'?I.goal.type==='5k'?6:4:['5k','10k'].includes(I.goal.type)?3:2;
 let metres=family==='threshold'?Math.round((level==='advanced'?16:12)*60/pace*1000/100)*100:family==='interval'?I.goal.type==='5k'?(I.currentWeeklyKm>=35?400:300):800:['half','marathon'].includes(I.goal.type)?2000:I.goal.type==='5k'?600:1000;
 let rest=family==='threshold'?0:family==='specific'?(['half','marathon'].includes(I.goal.type)?120:90):Math.round(clamp(metres/1000*pace*.5,60,150)/15)*15;
 if(family==='specific'&&!previous&&!(adaptive&&observed.structureKnown)){
  const desired=capacity*(phase==='peak'?.85:.70)*tolerance,maxBout={'5k':1000,'10k':2000,half:6000,marathon:8000}[I.goal.type]||2000;
  metres=Math.max(300,Math.min(maxBout,Math.floor(desired*60/pace/reps*10)*100));
 }
 if(previous){reps=previous.reps;metres=previous.metres;rest=previous.rest;}
 else if(adaptive&&observed.executedDose?.structure){const s=observed.executedDose.structure;reps=s.repetitions||1;metres=s.intervalMeters||Math.round(observed.executedDose.workMin*60/pace/reps*10)*100;rest=s.restSeconds||0;}
 let action=previous?'consolidation':'introduction',axis=null;
 const exposure=previous?.exposures||0,canPropose=!maintenance&&phase!=='base'&&!c.recovery&&!c.taper&&tolerance===1;
 const progress=canPropose&&(adaptive?observed.canProgress&&!c.state?.executedProgressions?.[family]:exposure>0&&exposure%2===0);
 if(progress){
  if(family==='threshold'){metres+=Math.round(2*60/pace*10)*100;axis='work_duration';}
  else if(phase==='peak'&&exposure%4===0){const next=Math.min(family==='interval'?(I.goal.type==='5k'?1000:1600):I.goal.type==='5k'?1000:I.goal.type==='10k'?2000:6000,metres+(family==='specific'?500:200));if(next>metres){const work=reps*metres;metres=next;reps=Math.max(2,Math.round(work/metres));axis='interval_length_at_stable_work';}else{reps++;axis='repetitions';}}
  else{reps++;axis='repetitions';}
  action='conditional_progression';if(adaptive)action='progression';
 }
 if(c.taper||phase==='taper'||c.recovery||observed.status==='fatigue'||tolerance<1){if(family==='threshold')metres=Math.max(800,Math.floor(metres*(c.taper?.6:.8)/100)*100);else reps=Math.max(2,Math.floor(reps*(c.taper?.6:.8)));action='reduction';axis='work_duration';}
 let cap=capacity*tolerance;
 if(adaptive&&!observed.structureKnown&&previous==null)cap=Math.min(cap,12);
 if(adaptive&&observed.retainedDoseMinutes){const executed=observed.retainedDoseMinutes;cap=Math.min(cap,progress?executed+Math.min(2,executed*.12):executed);}
 if(previous)cap=Math.min(cap,Math.max(previous.workMin*1.18,previous.workMin+2));
 if(previous&&progress&&axis==='repetitions'&&reps*metres/1000*pace/60>cap){reps=previous.reps;metres=previous.metres+100;axis='interval_length';}
 const boutLimitSeconds=family==='interval'?(I.goal.type==='5k'?300:360):null;
 if(boutLimitSeconds)metres=Math.min(metres,Math.max(200,Math.floor(boutLimitSeconds/pace*10)*100));
 const total=()=>reps*metres/1000+(reps-1)*rest/c.easyMid,minutes=()=>reps*metres/1000*pace/60;
 while((total()>budget+.01||minutes()>cap+.01)&&reps>Math.min(2,reps))reps--;
 while((total()>budget+.01||minutes()>cap+.01)&&metres> (family==='threshold'?600:200))metres-=100;
 if(previous&&minutes()<=previous.workMin+.5&&action.includes('progression')){if(axis==='interval_length_at_stable_work'){action='redistribution';}else{action='consolidation';axis=null;}}
 if(adaptive&&action==='progression'&&observed.executedDose&&minutes()<=observed.executedDose.workMin+.5){action='consolidation';axis=null;}
 const workKm=reps*metres/1000,workMin=workKm*pace/60,feasible=total()<=budget+.05&&workMin<=cap+.1&&workMin>= (family==='threshold'?4:3);
 const reason=action==='redistribution'?'Dłuższy odcinek przy podobnej lub niższej dawce; nie jest to potwierdzona adaptacja.':action==='consolidation'?(adaptive&&!observed.canProgress?'Brak porównywalnego wykonania: utrzymaj bezpieczną dawkę.':maintenance?'Podtrzymanie formy: konsolidacja zamiast obowiązkowego wzrostu.':'Konsolidacja dawki lub ograniczenie budżetu, bez przypadkowej rotacji.'):action==='reduction'?'Redukcja pracy dla regeneracji, taperu lub niższej tolerancji.':action.includes('progression')?`Mały krok jednej osi (${axis}); tempo i przerwy pozostają bez zaostrzenia.`:'Pierwsza dawka dobrana do fazy, bazy i dostępnego czasu.';
 return {family,phase,mode,action,axis,reps,metres,rest,boutLimitSeconds,restType:'jog',workKm,workMin,paceSecPerKm:pace,feasible,
  plannedDose:{workKm,workMin,repetitions:reps,intervalMeters:metres,restSeconds:rest},executedDose:observed.executedDose,decisionEvidence:observed,confidence:observed.confidence,
  physiologicalGoal:goals[family],reason:`${goals[family]} / ${phase}: ${reason}`,conditionalOnExecution:!adaptive||!observed.canProgress,
  alternative:{missed:'Nie nadrabiaj; utrzymaj lub wróć do poprzedniej dawki.',highRpe:'Skróć pracę lub zamień na spokojny bieg; potwierdź regenerację.',pain:'Przerwij obciążenie; nie jest to diagnoza.'},estimatedCost:workMin*(family==='interval'?7.5:family==='threshold'?6.5:5.5)};
}
// Compatible module exports; final constructors pass the full context.
export function intervalRecipe(I,k,qMax,warm,cool,easyMid,c){if(c){const r=prescribeQuality(c,'interval');return {...r,reps:r.reps,metres:r.metres,rest:r.rest};}return {reps:4,metres:I.goal.type==='5k'?400:800,rest:90,stage:0};}
export function thresholdMinutes(I,k,c){return c?prescribeQuality(c,'threshold').workMin:12;}
export function specificRecipe(I,k,c){const r=c?prescribeQuality(c,'specific'):null;return r?[r.reps,r.metres/1000]:[2,1];}
export function exposureDecision(previous,current,context={}){return {status:context.taper||context.recovery?'reduction':!previous?'introduction':current.minutes>previous.minutes+.5?'conditional_progression':'consolidation',predecessorStatus:previous?'planned':null,conditionalOnExecution:true,reason:'Porównano planowane dawki; wykonanie i tolerancja są osobnymi dowodami.',stagnationReview:false};}
