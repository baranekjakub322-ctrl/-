// Diagnostic 28.0.0: versioned separately. Historical 23/25 and the V27 audit are unchanged.
import {auditPlan as audit27} from './v27.mjs';
import {validateUnitCoherence} from '../model/units_v28.mjs';
export const AUDIT_VERSION='28.0.0';
const avg=a=>a.reduce((n,x)=>n+x,0)/Math.max(1,a.length),clamp=x=>Math.max(0,Math.min(10,x));
export function auditPlan(input,plan,context={}) {
  const old=audit27(input,plan,context),result=structuredClone(old);result.version=AUDIT_VERSION;
  result.methodology={historicalScoresUnchanged:true,staticAdaptation:'NOT_ASSESSABLE',goalFeasibilityExcludedFromAlgorithmTotal:true,equalWeightsForAssessableAlgorithmDimensions:true,heuristic:true,externalTrainer:false};
  const rows=context.observations||context.completedHistory||input.executionObservations||input.completedHistory||[];
  const valid=rows.filter(o=>o.status!=='missed'&&o.date<=input.today&&o.distanceKm>0&&o.durationMin>0);
  const d=result.dimensions.adaptation;
  if(!context.previousPlan||!plan?.adaptacja){d.score=null;d.status='NOT_ASSESSABLE';d.evidence=[{reason:valid.length?'Brak pary przed/po aktualizacji; sam dziennik nie dowodzi poprawnej adaptacji.':'Brak danych wykonania: statycznego planu nie oceniamy jako działającej lub błędnej adaptacji.'}];d.penalties=[];}
  else {
    d.status='ASSESSED_WITH_EXECUTION';let score=8;
    const previous=context.previousPlan,active=plan.adaptacja.observations||[];
    const currentSymptoms=active.slice().sort((a,b)=>a.date.localeCompare(b.date)).filter(o=>o.pain!=null||o.activeInjury!=null).at(-1);
    const issues=[];
    if((currentSymptoms?.pain>=4||currentSymptoms?.activeInjury)&&plan.ok&&plan.treningi?.length)issues.push({code:'SYMPTOMS',severity:8,detail:'Nowy harmonogram mimo aktywnych zgłoszonych objawów.'});
    for(const t of previous.adaptacja?.pastPlan||[])if(JSON.stringify(plan.adaptacja.pastPlan?.find(x=>x.data===t.data&&x.podtyp===t.podtyp))!==JSON.stringify(t))issues.push({code:'PAST_CHANGED',severity:3,date:t.data,detail:'Aktualizacja zmieniła utrwaloną przeszłość.'});
    if(plan.ok&&plan.treningi.some(t=>t.data<plan.adaptacja.inputUsed.today))issues.push({code:'PAST_PLANNED',severity:4,detail:'Nowa recepta w wykonanej przeszłości.'});
    const ids=valid.map(o=>o.id).filter(Boolean);if(new Set(ids).size!==ids.length)issues.push({code:'DUPLICATE',severity:2,detail:'Powielone aktywne identyfikatory wykonania.'});
    if(plan.adaptacja.trend?.status==='pojedynczy_test'&&plan.adaptacja.trend.capPct>.5)issues.push({code:'ONE_RESULT',severity:3,detail:'Za duża aktualizacja tempa po jednym wyniku.'});
    d.penalties=issues;d.score=clamp(score-issues.reduce((n,x)=>n+x.severity,0));d.evidence=issues.length?issues:[{observations:valid.length,revisions:plan.adaptacja.revision,reason:'Porównano rzeczywistą parę aktualizacji i utrwaloną przeszłość; brak danych o efektach sportowych.'}];
  }
  if(plan?.ok){const coherence=validateUnitCoherence(plan.treningi);result.coherence=coherence;
    for(const issue of coherence.issues){result.dimensions.safety.penalties.push({...issue,severity:2,detail:'Niespójna recepta etapów lub wartości liczbowych.'});result.dimensions.safety.score=clamp(result.dimensions.safety.score-2);}
    result.critical+=coherence.critical;
  }
  for(const [key,c]of Object.entries(result.dimensions)){
    c.codeChange=c.codeChange.replaceAll('_v27','_v28');
    c.mechanism=c.penalties.map(p=>p.code).join(', ')||`${key}: ograniczone dowody danych i recept, bez obserwacji efektów.`;
    c.sideEffectRisk=key==='mileage'||key==='specificity'?'Podwyższanie dawki może zwiększyć przeciążenie; minimum nie uprawnia do wymuszania km.':'Zmiana jednego bodźca może naruszyć regenerację lub stabilność kalendarza; sprawdź sąsiednie tygodnie.';
  }
  result.goalFeasibility={score:result.dimensions.feasibility.score,planStatus:plan?.ocenaWykonalnosci?.status||null,notAlgorithmQuality:true};
  result.algorithmTotal=old.total==null?null:old.total===0?0:avg(Object.entries(result.dimensions).filter(([k,d])=>k!=='feasibility'&&d.score!=null).map(([,d])=>d.score));
  result.total=result.algorithmTotal;return result;
}
