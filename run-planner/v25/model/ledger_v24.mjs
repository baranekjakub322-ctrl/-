// Records retained doses AFTER all load/time corrections. Informational, never used by scoring.
import {workOf} from '../scoring/v23.mjs';
export function qualityLedger(I,units){
 const previous=new Map();
 return units.filter(t=>['tempo','interwaly','tempo_startowe','podbiegi','test','ostrzenie'].includes(t.podtyp)||t.progresywny).map(t=>{
  const w=workOf(t),old=previous.get(t.podtyp),main=t.kroki.filter(k=>/Część główna|^Blok|^Test|Podbiegi/.test(k.etap||''));
  const rest=t.kroki.filter(k=>k.etap==='Przerwa').map(k=>({czasMin:k.czas_min||null,dystansKm:k.dystans_km||null,tempo:k.tempo,rodzaj:k.uwagi||'trucht'}));
  const row={odpoczynekMiedzyBlokami:rest,zmeczenieWyjsciowe:I.fatigue??null,tolerancja:I.intensityTolerance||'normal',data:t.data,rodzaj:t.podtyp,faza:t.faza_planu,odcinki:main.map(k=>({powtorzenia:k.powtorzenia||1,dystansM:k.dystans_m||null,dystansKm:k.dystans_km||null,czasMin:k.czas_min||null,tempo:k.tempo||t.tempo_zakres,odpoczynek:k.przerwa||null,rodzajOdpoczynku:k.przerwa?'trucht':'wedlug_krokow'})),pracaMin:w.minutes,pracaKm:w.km,rpe:t.intensywnosc?.rpeOrientacyjne,poziom:I.qualityLevel||I.level,poprzedniaData:old?.data||null,zmiana:!old?'wprowadzenie':t.odciazenie||t.faza_planu==='taper'?'redukcja':w.minutes>old.pracaMin+1?'progresja_dawki':w.recipe===old.recipe?'utrwalenie':'zmiana_bodzca_lub_budzetu',gotowosc:'wyjsciowa; realizacja poprzednich tygodni wymaga potwierdzenia',recipe:w.recipe};previous.set(t.podtyp,row);return row;
 });
}
