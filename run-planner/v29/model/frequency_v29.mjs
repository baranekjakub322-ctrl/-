import {nativeStep} from './dose_v29.mjs';
// Dedicated low-frequency allocation. No deletion from a five-day template.
export function lowFrequencyWeek(c,dates,V,h) {
  const {I,state}=c, out=[];
  const emit=(x,s)=>{h.push(x.date,s);out.push(x.date);};
  const easy=(x,km,long=false)=>({typ:long?'Długi bieg':'Bieg spokojny Z2',podtyp:long?'dlugi':'latwy',dist:km,min:km*(long?c.longMid:c.easyMid)/60,strefa:'Z2',tempo:h.range(long?c.P.long:c.P.easy),kroki:h.easy(km,I.daysPerWeek===1 && I.currentWeeklyKm>=20 && I.longestRecentRun>=8 && I.level!=='beginner' && (I.experienceMonths==null||I.experienceMonths>=12) && !I.injuries && I.intensityTolerance!=='low' && !c.taper && !c.recovery && ['build','peak'].includes(c.phase) && c.weekIdx%3===2),});
  if(I.daysPerWeek===1){
    const x=dates[0],km=h.one(I,c.weekIdx,V,c.easyMid,h.limit(x.date),c.taper,c.recovery);
    const session=easy(x,km);
    const controlled=km>=6 && ['5k','10k','half'].includes(I.goal.type) && I.trainingIntent!=='utrzymanie' && I.trainingIntent!=='aktywnosc' && I.currentWeeklyKm>=20 && I.longestRecentRun>=8 && I.level!=='beginner' && (I.experienceMonths==null||I.experienceMonths>=12) && !I.injuries && I.loadTolerance!=='low' && I.intensityTolerance!=='low' && !c.taper && !c.recovery && ['build','peak'].includes(c.phase) && c.weekIdx%3===1;
    if(controlled){
      const middle=(c.P.moderate.fast+c.P.moderate.slow)/2,first=Math.floor((km-1)*.6*2)/2;
      session.kroki=[{etap:'Wprowadzenie spokojne',dystans_km:first,tempo:h.range(c.P.easy),uwagi:'Swobodna rozmowa; zrezygnuj z szybszego fragmentu przy zmęczeniu.'},{etap:'Umiarkowany fragment',dystans_km:1,tempo:h.range(c.P.moderate),uwagi:'RPE 4–5, bez ścigania; zamiast przebieżek, nie dodatkowo.'},{etap:'Zakończenie spokojne',dystans_km:km-first-1,tempo:h.range(c.P.easy)}];
      session.min=((km-1)*c.easyMid+middle)/60;
      session.typ='Bieg spokojny z umiarkowanym fragmentem';
    }
    emit(x,session);
  }else{
    const span=dates.length===2?Math.abs(Date.parse(dates[0].date)-Date.parse(dates[1].date))/86400000:7;
    const adjacent=dates.length===2 && Math.min(span,7-span)<I.recoveryDays;
    const developmentWeek=adjacent && I.goal.type!=='marathon' && I.currentWeeklyKm>=20 && I.longestRecentRun>=8 && (I.experienceMonths==null||I.experienceMonths>=12) && !I.injuries && I.loadTolerance!=='low' && I.intensityTolerance!=='low' && !c.noQuality && !c.recovery && !c.taper && !c.raceWeek && ['build','peak'].includes(c.phase) && c.weekIdx%3===1;
    const longItem=!developmentWeek&&!c.noLong&&!c.raceWeek&&!c.taper?dates.find(x=>x.dow===c.longDow):null;
    const other=developmentWeek&&span>3?dates.at(-1):dates.find(x=>x!==longItem);
    const budget=Math.min(V,c.budget ?? V),floor=3;
    let L=longItem?Math.max(floor,Math.min(Math.round(c.longKm),Math.floor(budget*h.share(I.goal.type,2)),h.fit(longItem.date,c.longMid),Math.floor(c.longMin*60/c.longMid))):0;
    // The last HM long run can fall inside 14 days even when its Monday is outside taper.
    if(longItem && I.goal.type==='half' && c.raceDate && (Date.parse(c.raceDate)-Date.parse(longItem.date))/86400000<=14)L=Math.max(3,Math.floor(L*.85));
    let development=other?Math.max(floor,Math.min(Math.floor((budget-L)/(longItem?1:dates.length)),c.easyCapKm,h.fit(other.date,c.easyMid))):0;
    if(longItem&&other)L=Math.min(L,Math.floor(development*h.share(I.goal.type,2)/(1-h.share(I.goal.type,2))));
    if(longItem){const long=easy(longItem,L,true);long.kroki[0]=nativeStep('easy',{...long.kroki[0],tempo:h.range(c.P.long)},[c.P.long.fast,c.P.long.slow]);emit(longItem,long);if(!c.recovery){state.lastLong=Math.max(state.lastLong,L);state.plannedLong=Math.max(state.plannedLong,L);}}
    if(other){
      const distance=longItem?Math.abs(Date.parse(other.date)-Date.parse(longItem.date))/86400000:7;
      let kind=developmentWeek?'tempo':h.policy(I,c.phase,c.kQuality,c.recovery,c.raceWeek,c.lateBase)[0];
      const prepared=I.currentWeeklyKm>=20&&I.longestRecentRun>=8&&I.level!=='beginner'&&(I.experienceMonths==null||I.experienceMonths>=12)&&I.intensityTolerance!=='low'&&!I.injuries;
      if(kind&&prepared&&!developmentWeek&&['5k','10k'].includes(I.goal.type)&&['build','peak'].includes(c.phase)){
        const f=state.familyRecipes||{},count=Object.values(f).reduce((n,p)=>n+(p.exposures||0),0);
        if(c.phase==='peak')kind=I.goal.type==='10k'?(state.lastQualityFamily==='specific'?'tempo':'racepace'):count%3===0?'racepace':state.lastQualityFamily==='interval'?'tempo':'interval';
        else kind=I.goal.type==='5k'?(state.lastQualityFamily==='threshold'?'interval':'tempo'):(f.threshold?.exposures>=2&&count%3===2?'interval':'tempo');
      }
      const safe=distance>=I.recoveryDays && !c.noQuality && c.weekIdx>=(I.currentWeeklyKm>=20&&I.longestRecentRun>=8&&(I.experienceMonths==null||I.experienceMonths>=6)&&I.level!=='beginner'?1:3) && !c.taper && (!I.qualityNotBefore || other.date>=I.qualityNotBefore) && !state.hardDates.some(d=>d<other.date&&(Date.parse(other.date)-Date.parse(d))/86400000<I.recoveryDays);
      let s=easy(other,development);
      if(kind&&safe){
        c.qMax=Math.min(development,h.fit(other.date,c.easyMid));
        const q=kind==='interval'?h.interval(state.intervalK):kind==='racepace'?h.specific(state.raceK):h.threshold(state.tempoK);
        if(q.dist<=c.qMax+.1 && q.min<=h.limit(other.date)){
          s=q;if(developmentWeek)s.kroki[0].uwagi='Tydzień rozwojowy zamiast długiego biegu; jutro tylko krótko i spokojnie.';if(kind==='interval')state.intervalK++;else if(kind==='racepace')state.raceK++;else state.tempoK++;
          // Additional easy running is explicit, limited, and never replaces warm-up/cool-down.
          const extra=Math.max(0,Math.min(3,Math.floor(development-s.dist),Math.floor((h.limit(other.date)-s.min)*60/c.easyMid)));
          if(extra>=1){s.kroki.splice(s.kroki.length-1,0,nativeStep('easy',{etap:'Uzupełnienie tlenowe',dystans_km:extra,tempo:h.range(c.P.easy),uwagi:'Spokojny odcinek po akcencie; pomiń przy zmęczeniu.'},[c.P.easy.fast,c.P.easy.slow]));s.dist+=extra;s.min+=extra*c.easyMid/60;}
        }
      }
      emit(other,s);
    }
    // A partial race week may contain two easy runs; the outer race gate reserves a slot for the race.
    for(const x of dates.filter(x=>!out.includes(x.date)))emit(x,easy(x,Math.max(3,Math.min(5,Math.floor(V/dates.length),h.fit(x.date,c.easyMid)))));
  }
  // Existing optional strength/cross functionality remains available, with conservative placement.
  if(!c.raceWeek)for(let n=0;n<c.silaN+(c.crossN||0);n++){
    const x=Array.from({length:7},(_,i)=>h.add(c.weekStart,i)).find(d=>d>=c.startDate&&(!c.raceDate||d<h.add(c.raceDate,-3))&&I.availableDays.includes(h.dow(d))&&!out.includes(d)&&!out.some(t=>Math.abs(Date.parse(t)-Date.parse(d))/86400000<=1));
    if(!x){state.timeNotes.auxPominiety++;break;}
    const s=n<c.silaN?h.strength():h.cross();if(s.min<=h.limit(x)){h.push(x,s);out.push(x);}else state.timeNotes.auxPominiety++;
  }
}
