import {exposureDecision,comparableExposureState} from './quality_v29.mjs';
import {workDose,measureWorkout,familyOf} from './dose_v29.mjs';
// Retained prescriptions, not performed exposures. Legacy fields remain an output adapter.
export function qualityLedger(I,units){
 const previous=new Map();
 return units.filter(t=>familyOf(t)||t.progresywny).map(t=>{
  const d=measureWorkout(t),w=workDose(t),family=familyOf(t)||Object.keys(d.families)[0],old=previous.get(family),p=t.prescription;
  const observed=comparableExposureState(I.completedHistory||[],I.today,family),main=d.segments.filter(s=>s.role==='work');
  const recipe=JSON.stringify(main.map(s=>[s.family,s.workKm,s.workMin,s.repetitions,s.rest]));
  const decision=p?{status:p.action,axis:p.axis,reason:p.reason,predecessorStatus:old?'planned':null,conditionalOnExecution:p.conditionalOnExecution,reasonCode:p.action}:exposureDecision(old?{minutes:old.pracaMin}:null,w,{taper:t.faza_planu==='taper',recovery:t.odciazenie});
  const row={data:t.data,rodzaj:t.podtyp,faza:t.faza_planu,status:'planned',plannedDose:{...p?.plannedDose,workKm:w.km,workMin:w.known?w.minutes:null},executedDose:observed.executedDose,decisionEvidence:observed,confidence:observed.confidence,
   observedEvidence:observed,doseDecision:decision,predecessor:old?{date:old.data,workMinutes:old.pracaMin,workKm:old.pracaKm,status:'planned',notCompletionEvidence:true}:null,
   preparation:{warmup:d.segments.filter(s=>s.role==='warmup'),cooldown:d.segments.filter(s=>s.role==='cooldown')},
   celTreningowy:p?.physiologicalGoal||t.cel,obciazenieCalejJednostki:d.load,powodZastosowania:p?.reason||'Bodziec fazy z zachowaniem regeneracji; wykonanie wymaga potwierdzenia.',
   odpoczynekMiedzyBlokami:main.map(s=>s.rest),zmeczenieWyjsciowe:I.fatigue??null,tolerancja:I.intensityTolerance||'normal',
   odcinki:main.map(s=>({powtorzenia:s.repetitions,dystansKm:s.workKm,czasMin:s.workMin,odpoczynek:s.rest})),pracaMin:w.minutes,pracaKm:w.km,rpe:t.intensywnosc?.rpeOrientacyjne,poziom:I.qualityLevel||I.level,
   poprzedniaData:old?.data||null,zmiana:decision.status,gotowosc:'plan warunkowy; zaplanowana dawka nie potwierdza tolerancji',recipe,
   repeatCount:old?.recipe===recipe?(old.repeatCount||1)+1:1,conditions:['Bez bólu, nadmiernego RPE i zmęczenia; pominięcia nie są nadrabiane.'],alternatives:p?.alternative||{missed:'Nie nadrabiaj.',highRpe:'Biegnij spokojnie lub skróć.',pain:'Przerwij obciążenie.'},uncertainty:d.uncertainty};
  previous.set(family,row);return row;
 });
}
