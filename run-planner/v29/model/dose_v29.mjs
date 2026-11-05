// Structural prescription arithmetic. Text parsing exists only in the legacy adapter.
export const familyOf=t=>({tempo:'threshold',interwaly:'interval',tempo_startowe:'specific',podbiegi:'hill',test:'test',ostrzenie:'specific'}[typeof t==='string'?t:t.podtyp]||null);
const roles=new Set(['warmup','cooldown','work','recovery','easy','economy']);
const means=a=>a.reduce((n,x)=>n+x,0)/Math.max(1,a.length),finite=x=>typeof x==='number'&&Number.isFinite(x),round=x=>Math.round(x*1000)/1000;
const paceCache=new Map();
export function legacyPace(s){if(paceCache.has(s))return paceCache.get(s);const a=[...String(s||'').matchAll(/(\d+):(\d{2})/g)].slice(0,2).map(m=>+m[1]*60 + +m[2]);if(paceCache.size>512)paceCache.clear();paceCache.set(s,a);return a;}
export function nativeStep(role,data,pace=null,family=null){return {...data,role,...(pace?{paceSecPerKm:Array.isArray(pace)?pace:[pace,pace]}:{}),...(family?{family}:{})};}
export function stepKm(s){return Number(s.dystans_km||0)+(s.powtorzenia&&s.dystans_m?s.powtorzenia*s.dystans_m/1000+(s.liczba_przerw??s.powtorzenia)*Number(s.przerwa_km||0):0);}
function adaptStep(s,index,t){
 if(roles.has(s.role))return {step:s,source:'native'};
 const name=s.etap||'',family=familyOf(t);let role;
 if(name==='Rozgrzewka')role='warmup';else if(name==='Schłodzenie')role='cooldown';else if(name==='Przerwa')role='recovery';else if(name==='Przebieżki')role='economy';
 else if(family&&(/Część główna|^Blok|^Test|^Podbiegi|^Końcówka|^Kontrola/.test(name)))role='work';else role='easy';
 return {step:{...s,role,family:role==='work'?family:role==='economy'?'strides':null,paceSecPerKm:legacyPace(s.tempo||t.tempo_zakres)},source:'legacy_adapter'};
}
const rpeFor=(role,family,type)=>role==='warmup'?2.5:role==='cooldown'||role==='recovery'?2:role==='economy'?6:role==='easy'?(type==='dlugi'?3.5:2.5):({threshold:6.5,interval:7.5,specific:type==='dlugi'?4.5:5.5,hill:7,test:8.5}[family]||5);
export function measureWorkout(t){
 const segments=[],families={},unknown=[];let distance=0,elapsed=0,load=0,knownDistance=false,knownTime=false;
 for(const [index,raw]of(t.kroki||[]).entries()){
  const {step:s,source}=adaptStep(raw,index,t),role=s.role,family=s.family||familyOf(t),p=Array.isArray(s.paceSecPerKm)?s.paceSecPerKm.filter(x=>finite(x)&&x>0):[];
  const repeat=s.powtorzenia||1,hasReps=s.powtorzenia&&s.dystans_m,restCount=s.liczba_przerw??(source==='native'?Math.max(0,repeat-1):repeat),embedded=!!s.wliczoneWDystansBiegu||role==='economy';
  let workKm=hasReps?repeat*s.dystans_m/1000:finite(s.dystans_km)?s.dystans_km:null;
  if(family==='hill')workKm=finite(s.workDistanceKm)?s.workDistanceKm:null;
  let minutes=finite(s.praca_min)?s.praca_min:finite(s.czas_min)?s.czas_min:s.czas_odcinka_s>0?repeat*s.czas_odcinka_s/60:workKm!=null&&p.length?workKm*means(p)/60:null;
  const hasRecovery=s.powtorzenia&&(s.czas_przerwy_s!=null||s.przerwa_km!=null);
  const restKm=hasRecovery&&finite(s.przerwa_km)?restCount*s.przerwa_km:0;
  const restMin=hasRecovery&&s.czas_przerwy_s!=null?restCount*s.czas_przerwy_s/60:hasRecovery&&restKm>0?null:0;
  // Hill distance includes the return descent, whereas effective work time is ascent only.
  const hillReturn=0;
  const km=stepKm(s);if(km>0&&!embedded){distance+=km;knownDistance=true;}
  const intensity=finite(s.effortRpe)?Math.max(1,Math.min(10,s.effortRpe)):rpeFor(role,family,t.podtyp),estimated=source!=='native'||p.length>0||role==='easy';
  if(minutes!=null){if(!embedded){elapsed+=minutes;knownTime=true;}load+=minutes*(embedded?Math.max(0,intensity-2.5):intensity);}
  else unknown.push({index,field:'duration',source});
  if(restMin!=null&&!embedded){elapsed+=restMin+hillReturn;load+=(restMin+hillReturn)*2;}else if(restKm>0)unknown.push({index,field:'recovery_duration',source});
  if(role==='work'||role==='economy'){
    const f=role==='economy'?'strides':family||'unknown',v=families[f]||{workKm:0,workMin:0,knownMinutes:true,knownDistance:true};
    if(minutes==null)v.knownMinutes=false;else v.workMin+=minutes;if(workKm==null)v.knownDistance=false;else v.workKm+=workKm;families[f]=v;
  }
  segments.push({role,family:role==='work'||role==='economy'?family:null,workKm,workMin:minutes,repetitions:repeat,rest:{count:restCount,minutes:restMin,distanceKm:restKm,kind:s.recoveryType||'jog'},embedded,source,estimated,intensityRpe:intensity});
 }
 for(const v of Object.values(families)){v.workKm=v.knownDistance?round(v.workKm):null;v.workMin=v.knownMinutes?round(v.workMin):null;}
 return {version:'29.0.0',segments,families,total:{distanceKm:knownDistance?round(distance):null,minutes:knownTime&&unknown.every(x=>x.field!=='duration'&&x.field!=='recovery_duration')?round(elapsed):null},
  load:{estimate:round(load),range:[round(load*.85),round(load*1.15)],kind:'descriptive_segment_minutes_rpe',clinicalPrediction:false},
  uncertainty:{unknown,legacyAdapted:segments.some(s=>s.source==='legacy_adapter'),notMeasurement:true}};
}
export function workDose(t){const d=measureWorkout(t),a=Object.entries(d.families).filter(([f])=>f!=='strides').map(([,v])=>v);return {km:a.reduce((n,v)=>n+(v.workKm||0),0),minutes:a.reduce((n,v)=>n+(v.workMin||0),0),known:a.every(v=>v.knownMinutes),families:d.families,uncertainty:d.uncertainty};}
export function syncStructure(t,{recomputeTime=false}={}){
 if(t.prescription&&familyOf(t)!==t.prescription.family)delete t.prescription;
 const d=measureWorkout(t);t.structuredDose=d;
 if(recomputeTime&&(t.prescription||d.segments.length>0&&d.segments.every(s=>s.source==='native'))&&d.total.minutes!=null)t.czas_min=Math.max(1,Math.round(d.total.minutes));
 return d;
}
export function retainFamilyRecipes(state,units){
 state.familyRecipes??={};state.executedProgressions??={};
 for(const t of units){if(!t.prescription||familyOf(t)!==t.prescription.family)continue;const p=t.prescription,f=p.family,d=workDose(t),prior=state.familyRecipes[f];
  state.lastQualityFamily=f;
  state.familyRecipes[f]={...p,workMin:d.minutes,workKm:d.km,exposures:(prior?.exposures||0)+1,status:'planned',notCompletionEvidence:true};
  if(p.mode==='adaptive'&&p.action==='progression')state.executedProgressions[f]=true;
 }
}
