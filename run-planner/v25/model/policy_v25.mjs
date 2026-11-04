// V23 athlete and low-frequency policies; historical V22 policy remains unchanged.
import {evidenceInput as evidenceV22, qualityPolicy as oldQuality, marathonModel as oldMarathon, effortFor as oldEffort, sessionLoad as oldLoad} from './training.mjs';
export function effortFor(t,type){return type==='marathon' && t.podtyp==='dlugi' && t.progresywny?5:oldEffort(t,type);}
export function sessionLoad(t,type){
 if(type!=='marathon' || t.podtyp!=='dlugi' || !t.progresywny)return oldLoad(t,type);
 const work=(t.kroki||[]).filter(k=>/^Końcówka/.test(k.etap||'')).reduce((n,k)=>{const m=String(k.tempo||'').match(/(\d+):(\d{2})/);return n+(m?k.dystans_km*(+m[1]*60 + +m[2])/60:0);},0);
 return Math.round(t.czas_min*4+work);
}
export function athleteMode(input) {
  if(input.goal?.mode==='finish')return 'ukonczenie';
  if(!input.goal?.targetTimeSec)return input.goal?.type==='health'?'aktywnosc':'ukonczenie';
  const b=input.bestResult, distances={'5k':5,'10k':10,half:21.0975,marathon:42.195};
  if(!b)return 'wynik_niepotwierdzony';
  const predicted=b.timeSec*(distances[input.goal.type]/b.distanceKm)**1.06;
  return input.goal.targetTimeSec>=predicted*.99?'utrzymanie':'poprawa';
}
export function evidenceInput(input) {
  const evidence=evidenceV22(input), I=evidence.input;
  // Explicit complete execution constrains initial load; a schedule never provides evidence.
  const coverage=I.executionCoverage,history=I.executionObservations||I.completedHistory;
  if(coverage?.completeWindow===true && coverage.coverageFrom && (Date.parse(I.today)-Date.parse(coverage.coverageFrom))/86400000>=14 && (!coverage.coverageTo || (Date.parse(I.today)-Date.parse(coverage.coverageTo))/86400000<=1) && Array.isArray(history)){
    const actual=history.filter(o=>o.status!=='missed' && o.distanceKm>0 && o.durationMin>0 && (Date.parse(I.today)-Date.parse(o.date))/86400000>=0 && (Date.parse(I.today)-Date.parse(o.date))/86400000<14);
    const km=actual.reduce((sum,o)=>sum+o.distanceKm,0)/2;
    I.currentWeeklyKm=Math.min(Number(I.currentWeeklyKm||0),km);
    I.longestRecentRun=Math.min(Number(I.longestRecentRun||0),Math.max(0,...actual.map(o=>o.distanceKm)),Math.max(3,km));
    evidence.notes.push('Początkowa baza ograniczona rzeczywistym wykonaniem pełnego okna.');
  }
  I.trainingIntent=athleteMode(I);
  if(I.volumeTolerance!=null)I.loadTolerance=I.volumeTolerance;
  if(Number(I.fatigue)>=4){I.loadTolerance='low';I.qualityNotBefore=new Date(Date.parse(I.today)+7*86400000).toISOString().slice(0,10);evidence.notes.push('Wysokie zmęczenie: obniżona objętość i tydzień bez akcentów.');}
  I.qualityLevel=I.level==='beginner' && I.currentWeeklyKm>=25 && I.longestRecentRun>=10 && (I.bestResult || I.recentWeeklyKm?.length>=4) && (I.experienceMonths==null || I.experienceMonths>=6)?'intermediate':I.level;
  if(I.intensityTolerance==='low')evidence.notes.push('Niska tolerancja intensywności: mniej odcinków i rzadsze akcenty, bez zwiększania kilometrażu w zamian.');
  if(Number(I.pain)>=3){I.injuries=true;evidence.notes.push('Zgłoszony ból 3/10: wyłączono jakość, plan jest ostrożną bazą; obserwuj objawy i skonsultuj utrzymujący się ból.');}
  I.recoveryDays=Number(I.recoveryDays || 2);
  if(I.preferredDays?.length) {
    I.dayReliability={...I.dayReliability};
    for(const d of I.preferredDays)I.dayReliability[d]=Math.max(I.dayReliability[d] || .7,.95);
  }
  return evidence;
}
export function readyForEarlyQuality(I) {
  return I.daysPerWeek>=3 && I.level!=='beginner' && I.currentWeeklyKm>=25 && I.longestRecentRun>=8 && !I.injuries && !(Number(I.breakDays ?? I.przerwaDni)>=14) && (I.experienceMonths==null || I.experienceMonths>=6) && I.loadTolerance!=='low' && I.intensityTolerance!=='low';
}
export function qualityPolicy(I,phase,k,recovery,raceWeek,lateBase) {
  const conservative=I.daysPerWeek<=1 || I.injuries || I.currentWeeklyKm<12 || I.experienceMonths!=null && I.experienceMonths<3;
  if(conservative || recovery || I.intensityTolerance==='low' && k%2!==0)return [];
  if(I.daysPerWeek===2) {
    if(raceWeek || phase==='base' || phase==='taper' || I.goal.type==='marathon')return [];
    if(k%2!==0)return [];
    if(I.goal.type==='half')return k%4===2?[phase==='peak' && I.currentWeeklyKm>=28 && I.longestRecentRun>=12?'racepace':'tempo']:[];
    return I.goal.type==='5k' && I.currentWeeklyKm>=20 && (I.qualityLevel||I.level)!=='beginner' && k%4===0?['interval']:['tempo'];
  }
  if(phase==='base' && readyForEarlyQuality(I))return lateBase?['tempo']:[];
  if(phase==='taper')return raceWeek?[]:['tempo'];
  if(Number(I.breakDays ?? I.przerwaDni)>=28 && k<4)return [];
  if(I.goal.type==='marathon' && phase==='peak' && I.currentWeeklyKm>=25 && I.longestRecentRun>=12 && I.daysPerWeek>=4 && (I.experienceMonths==null || I.experienceMonths>=12) && I.loadTolerance!=='low')return k%3===0?['tempo']:['racepace'];
  return oldQuality(I,phase,k,recovery,raceWeek,lateBase);
}
export function marathonModel(I) {
  const m=oldMarathon(I);if(!m)return null;
  const history=I.recentWeeklyKm?.map(Number);
  return {...m,gotowoscHistorii:history?.length>=4?'udokumentowana':'deklarowana',doswiadczenieDystansowe:I.longDistanceRaces ?? null,
    ograniczenia:[!m.bazaPotwierdzona&&'Najpierw etap bazowy: maraton nie jest aktualnie potwierdzonym celem.', I.longDistanceRaces===0&&'Brak doświadczenia startowego na długim dystansie: przećwicz żywienie i wysiłek w krótszym starcie.'].filter(Boolean),
    specyfikaWarunkowa:'Bloki MP po bazie są warunkowe: tylko po wykonaniu poprzednich tygodni bez bólu i nadmiernego zmęczenia; planowana adaptacja nie jest potwierdzoną gotowością.',
    celFizjologiczny:'Wytrzymałość tlenowa, ekonomia tempa maratońskiego i tolerancja żywienia; długi bieg pozostaje spokojny.'};
}
export function oneRunPrescription(I,week,km,pace,limit,taper,recovery) {
  const habitual=I.longestRecentRun>0?Math.min(I.longestRecentRun,Math.max(3,I.currentWeeklyKm)):4;
  const prepared=I.currentWeeklyKm>=45 && habitual>=16 && I.level==='advanced' && !I.injuries;
  const minutes=Math.min(limit,prepared?90:I.level==='beginner'?50:75);
  const cap=minutes*60/pace;
  // Three weeks establish continuity; every following three-week block adds at most 1 km.
  // A single weekly run is still only a maintenance/base alternative.
  const growth=I.injuries || I.loadTolerance==='low' || I.trainingIntent==='utrzymanie'?0:Math.min(3,Math.floor(Math.max(0,week-2)/3));
  const target=Math.min(km || habitual,habitual+growth,prepared?16:12,cap);
  return Math.max(3,Math.floor(target*(taper?.6:recovery?.8:1)));

}
export function qualityBudget(c,oldCap) {
  if(c.I.daysPerWeek<=2)return oldCap;
  const ratio=c.I.trainingIntent==='poprawa'?.34:.30;
  const base=Math.min(c.vol*ratio, c.I.goal.type==='marathon'?16:c.I.goal.type==='half'?13:12);
  return Math.max(oldCap,Math.min(base,c.vol-c.longKm-c.minEasy));
}
