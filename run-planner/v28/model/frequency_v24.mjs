// Dedicated low-frequency allocation. No deletion from a five-day template.
export function lowFrequencyWeek(c,dates,V,h) {
  const {I,state}=c, out=[];
  const emit=(x,s)=>{h.push(x.date,s);out.push(x.date);};
  const easy=(x,km,long=false)=>({typ:long?'Długi bieg':'Bieg spokojny Z2',podtyp:long?'dlugi':'latwy',dist:km,min:km*(long?c.longMid:c.easyMid)/60,strefa:'Z2',tempo:h.range(long?c.P.long:c.P.easy),kroki:h.easy(km),});
  if(I.daysPerWeek===1){
    const x=dates[0],km=h.one(I,c.weekIdx,V,c.easyMid,h.limit(x.date),c.taper,c.recovery);
    emit(x,easy(x,km));
  }else{
    const longItem=!c.noLong&&!c.raceWeek&&!c.taper?dates.find(x=>x.dow===c.longDow):null;
    const other=dates.find(x=>x!==longItem);
    const budget=Math.min(V,c.budget ?? V),floor=3;
    let L=longItem?Math.max(floor,Math.min(Math.round(c.longKm),Math.floor(budget*h.share(I.goal.type,2)),h.fit(longItem.date,c.longMid),Math.floor(c.longMin*60/c.longMid))):0;
    // The last HM long run can fall inside 14 days even when its Monday is outside taper.
    if(longItem && I.goal.type==='half' && c.raceDate && (Date.parse(c.raceDate)-Date.parse(longItem.date))/86400000<=14)L=Math.max(3,Math.floor(L*.85));
    let development=other?Math.max(floor,Math.min(Math.floor((budget-L)/(longItem?1:dates.length)),c.easyCapKm,h.fit(other.date,c.easyMid))):0;
    if(longItem&&other)L=Math.min(L,Math.floor(development*h.share(I.goal.type,2)/(1-h.share(I.goal.type,2))));
    if(longItem){emit(longItem,easy(longItem,L,true));if(!c.recovery){state.lastLong=Math.max(state.lastLong,L);state.plannedLong=Math.max(state.plannedLong,L);}}
    if(other){
      const distance=longItem?Math.abs(Date.parse(other.date)-Date.parse(longItem.date))/86400000:7;
      const kind=h.policy(I,c.phase,c.kQuality,c.recovery,c.raceWeek,c.lateBase)[0];
      const safe=distance>=I.recoveryDays && !c.noQuality && c.weekIdx>=3 && !c.taper && (!I.qualityNotBefore || other.date>=I.qualityNotBefore) && !state.hardDates.some(d=>d<other.date&&(Date.parse(other.date)-Date.parse(d))/86400000<I.recoveryDays);
      let s=easy(other,development);
      if(kind&&safe){
        c.qMax=Math.min(development,h.fit(other.date,c.easyMid));
        const q=kind==='interval'?h.interval(state.intervalK):h.threshold(state.tempoK);
        if(q.dist<=c.qMax+.1 && q.min<=h.limit(other.date)){
          s=q;if(kind==='interval')state.intervalK++;else state.tempoK++;
          // Additional easy running is explicit, limited, and never replaces warm-up/cool-down.
          const extra=Math.max(0,Math.min(3,Math.floor(development-s.dist),Math.floor((h.limit(other.date)-s.min)*60/c.easyMid)));
          if(extra>=1){s.kroki.splice(s.kroki.length-1,0,{etap:'Uzupełnienie tlenowe',dystans_km:extra,tempo:h.range(c.P.easy),uwagi:'Spokojny odcinek po akcencie; pomiń przy zmęczeniu.'});s.dist+=extra;s.min+=extra*c.easyMid/60;}
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
