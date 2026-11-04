import {exposureDecision} from './quality_v26.mjs';
// Records retained doses AFTER all load/time corrections. Informational, never used by scoring.
import {workDose} from './constraints_v26.mjs';
const workOf=t=>({...workDose(t),recipe:JSON.stringify([t.podtyp,(t.kroki||[]).filter(k=>/Część główna|^Blok|^Test|Podbiegi/.test(k.etap||'')).map(k=>[k.powtorzenia||1,k.dystans_m||k.dystans_km||0,k.przerwa||''])])});
export function qualityLedger(I,units){
 const previous=new Map(),counts=new Map();
 return units.filter(t=>['tempo','interwaly','tempo_startowe','podbiegi','test','ostrzenie'].includes(t.podtyp)||t.progresywny).map(t=>{
  const w=workOf(t),old=previous.get(t.podtyp),main=t.kroki.filter(k=>/Część główna|^Blok|^Test|Podbiegi/.test(k.etap||''));
  const rest=t.kroki.filter(k=>k.etap==='Przerwa').map(k=>({czasMin:k.czas_min||null,dystansKm:k.dystans_km||null,tempo:k.tempo,rodzaj:k.uwagi||'trucht'}));
  const count=(counts.get(t.podtyp)===w.recipe?old?.repeatCount||1:0)+1;counts.set(t.podtyp,w.recipe);
  const decision=exposureDecision(old?{minutes:old.pracaMin,recipe:old.recipe}:null,w,{taper:t.faza_planu==='taper',recovery:t.odciazenie,maintenance:['utrzymanie','aktywnosc'].includes(I.trainingIntent),sameRecipeCount:count});
  const row={doseDecision:decision,repeatCount:count,status:'planned',predecessor:old?{date:old.data,workMinutes:old.pracaMin,workKm:old.pracaKm,status:'planned',notCompletionEvidence:true}:null,preparation:{warmup:(t.kroki||[]).filter(k=>k.etap==='Rozgrzewka'),cooldown:(t.kroki||[]).filter(k=>k.etap==='Schłodzenie')},celTreningowy:t.cel,obciazenieCalejJednostki:t.intensywnosc?.obciazenieSzacunkowe,powodZastosowania:t.dlaczego || t.uzasadnienie || 'Faza i tolerowana dawka; wykonanie wymaga obserwacji.',odpoczynekMiedzyBlokami:rest,zmeczenieWyjsciowe:I.fatigue??null,tolerancja:I.intensityTolerance||'normal',data:t.data,rodzaj:t.podtyp,faza:t.faza_planu,odcinki:main.map(k=>({powtorzenia:k.powtorzenia||1,dystansM:k.dystans_m||null,dystansKm:k.dystans_km||null,czasMin:k.czas_min||null,tempo:k.tempo||t.tempo_zakres,odpoczynek:k.przerwa||null,rodzajOdpoczynku:k.przerwa?'trucht':'wedlug_krokow'})),pracaMin:w.minutes,pracaKm:w.km,rpe:t.intensywnosc?.rpeOrientacyjne,poziom:I.qualityLevel||I.level,poprzedniaData:old?.data||null,zmiana:!old?'wprowadzenie':t.odciazenie||t.faza_planu==='taper'?'redukcja':w.minutes>old.pracaMin+1?'progresja_dawki':w.recipe===old.recipe?'utrwalenie':'zmiana_bodzca_lub_budzetu',gotowosc:'wyjsciowa; realizacja poprzednich tygodni wymaga potwierdzenia',recipe:w.recipe};previous.set(t.podtyp,row);return row;
 });
}
