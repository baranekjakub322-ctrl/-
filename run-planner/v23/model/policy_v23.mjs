// V23 athlete and low-frequency policies; historical V22 policy remains unchanged.
import {evidenceInput as evidenceV22, qualityPolicy as oldQuality, marathonModel as oldMarathon, effortFor, sessionLoad} from './training.mjs';
export {effortFor,sessionLoad};
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
  I.trainingIntent=athleteMode(I);
  if(Number(I.pain)>=3){I.injuries=true;evidence.notes.push('Zgłoszony ból 3/10: wyłączono jakość, plan jest ostrożną bazą; obserwuj objawy i skonsultuj utrzymujący się ból.');}
  I.recoveryDays=Number(I.recoveryDays || 2);
  if(I.preferredDays?.length) {
    I.dayReliability={...I.dayReliability};
    for(const d of I.preferredDays)I.dayReliability[d]=Math.max(I.dayReliability[d] || .7,.95);
  }
  return evidence;
}
export function readyForEarlyQuality(I) {
  return I.daysPerWeek>=3 && I.level!=='beginner' && I.currentWeeklyKm>=25 && I.longestRecentRun>=8 && !I.injuries && !(Number(I.breakDays ?? I.przerwaDni)>=14) && (I.experienceMonths==null || I.experienceMonths>=6) && I.loadTolerance!=='low';
}
export function qualityPolicy(I,phase,k,recovery,raceWeek,lateBase) {
  const conservative=I.daysPerWeek<=1 || I.injuries || I.currentWeeklyKm<12 || I.experienceMonths!=null && I.experienceMonths<3;
  if(conservative || recovery)return [];
  if(I.daysPerWeek===2) {
    if(raceWeek || phase==='base' || phase==='taper' || I.goal.type==='marathon')return [];
    if(k%2!==0)return [];
    if(I.goal.type==='half')return k%4===2?['tempo']:[];
    return I.goal.type==='5k' && I.trainingIntent==='poprawa' && I.level!=='beginner' && k%4===0?['interval']:['tempo'];
  }
  if(phase==='base' && readyForEarlyQuality(I))return lateBase?['tempo']:[];
  if(phase==='taper')return raceWeek?[]:['tempo'];
  if(Number(I.breakDays ?? I.przerwaDni)>=28 && k<4)return [];
  return oldQuality(I,phase,k,recovery,raceWeek,lateBase);
}
export function marathonModel(I) {
  const m=oldMarathon(I);if(!m)return null;
  const history=I.recentWeeklyKm?.map(Number);
  return {...m,gotowoscHistorii:history?.length>=4?'udokumentowana':'deklarowana',doswiadczenieDystansowe:I.longDistanceRaces ?? null,
    ograniczenia:[!m.bazaPotwierdzona&&'Najpierw etap bazowy: maraton nie jest aktualnie potwierdzonym celem.', I.longDistanceRaces===0&&'Brak doświadczenia startowego na długim dystansie: przećwicz żywienie i wysiłek w krótszym starcie.'].filter(Boolean),
    celFizjologiczny:'Wytrzymałość tlenowa, ekonomia tempa maratońskiego i tolerancja żywienia; długi bieg pozostaje spokojny.'};
}
export function oneRunPrescription(I,week,km,pace,limit,taper,recovery) {
  const habitual=I.longestRecentRun>0?I.longestRecentRun:4;
  const cap=Math.min(limit,75, I.level==='beginner'?50:75)*60/pace;
  const stabilised=Math.min(habitual*1.15,12,cap);
  return Math.max(3,Math.floor(Math.min(km || habitual,stabilised)*(taper?.7:recovery?.8:1)));
}
export function qualityBudget(c,oldCap) {
  if(c.I.daysPerWeek<=2)return oldCap;
  const ratio=c.I.trainingIntent==='poprawa'?.34:.30;
  const base=Math.min(c.vol*ratio, c.I.goal.type==='marathon'?16:c.I.goal.type==='half'?13:12);
  return Math.max(oldCap,Math.min(base,c.vol-c.longKm-c.minEasy));
}
