const paceBounds=s=>[...String(s||'').matchAll(/(\d+):(\d{2})/g)].slice(0,2).map(m=>+m[1]*60 + +m[2]);
export function stepDistance(s) {
  return Number(s.dystans_km||0)+(s.powtorzenia&&s.dystans_m?s.powtorzenia*s.dystans_m/1000+(s.liczba_przerw??s.powtorzenia)*Number(s.przerwa_km||0):0);
}
const numericFields=['dystans_km','czas_min','powtorzenia','dystans_m','przerwa_km','liczba_przerw','czas_przerwy_s','czas_odcinka_s','praca_min'];
export function validateUnitCoherence(units=[]) {
  const issues=[],warnings=[],paceCache=new Map();
  const bounds=s=>{if(!paceCache.has(s))paceCache.set(s,paceBounds(s));return paceCache.get(s);};
  for(const t of units){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(t.data)||!Number.isFinite(Date.parse(t.data))||new Date(t.data).toISOString().slice(0,10)!==t.data){issues.push({code:'LOCAL_DATE',date:t.data});continue;}
    if(!Number.isFinite(t.dystans_km)||!Number.isFinite(t.czas_min)){issues.push({code:'NON_FINITE',date:t.data});continue;}
    const sum=(t.kroki||[]).reduce((n,s)=>n+stepDistance(s),0);
    if(sum>0&&t.podtyp!=='marszobieg'&&Math.abs(sum-t.dystans_km)>.151)issues.push({code:'STEP_SUM',date:t.data,stepKm:sum,sessionKm:t.dystans_km});
    let fast=0,slow=0,known=0;
    for(const s of t.kroki||[]){
      for(const k of numericFields)if(s[k]!=null&&(!Number.isFinite(s[k])||s[k]<0))issues.push({code:'STEP_NUMBER',date:t.data,field:k});
      const p=bounds(s.tempo),distance=s.dystans_km||s.powtorzenia*s.dystans_m/1000;
      if(s.czas_min>0){fast+=s.czas_min;slow+=s.czas_min;known++;}
      else if(p.length&&distance>0){fast+=distance*Math.min(...p)/60;slow+=distance*Math.max(...p)/60;known++;}
      if(s.powtorzenia&&s.przerwa_km){const count=s.liczba_przerw??s.powtorzenia;const minutes=s.czas_przerwy_s?count*s.czas_przerwy_s/60:0;fast+=minutes;slow+=minutes;}
    }
    if(known&&fast>0&&(t.czas_min<fast-2||t.czas_min>slow+2))warnings.push({code:'TIME_RANGE',date:t.data,sessionMinutes:t.czas_min,range:[fast,slow],reason:'Sprawdź oprawę i części bez mierzonego tempa; czas jest oszacowaniem.'});
  }
  return {version:'28.0.0',critical:issues.length,issues,warnings,roundTripDates:units.map(t=>t.data).join('|')===JSON.parse(JSON.stringify(units.map(t=>t.data))).join('|')};
}
