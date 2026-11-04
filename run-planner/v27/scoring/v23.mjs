// Independent V23.0.0 rubric. Does not import the generator or its audit/score.
// Rubric/weights apply identically to V22 and V23; all efficacy thresholds are heuristic.
export const METER_VERSION='23.0.0';
export const WEIGHTS=Object.freeze({bezpieczenstwo:25,indywidualizacja:20,progresja:15,dystans:15,jakosc:15,kalendarz:10});
const DIST={'5k':5,'10k':10,half:21.0975,marathon:42.195};
const Q=new Set(['tempo','interwaly','tempo_startowe','podbiegi','test','ostrzenie']);
const AUX=new Set(['sila','cross','mobilnosc']);
const DAY=86400000, d=s=>Date.parse(s+'T00:00:00Z');
const diff=(a,b)=>Math.round((d(b)-d(a))/DAY);
const mon=s=>new Date(d(s)-((new Date(d(s)).getUTCDay()+6)%7)*DAY).toISOString().slice(0,10);
const pace=s=>{const m=String(s || '').match(/(\d+):(\d{2})/);return m?+m[1]*60 + +m[2]:null;};
const mean=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;
const clamp=x=>Math.max(0,Math.min(1,x));
const ratio=(a,b)=>b>0?clamp(a/b):1;
const round=x=>Math.round(x*1000)/1000;
export function workOf(t) {
  const main=(t.kroki || []).filter(k=>/Część główna|^Blok|^Test|Podbiegi|Końcówka/.test(k.etap || ''));
  const km=main.reduce((a,k)=>a+Number(k.dystans_km || (k.powtorzenia || 0)*(k.dystans_m || 0)/1000),0);
  const minutes=main.reduce((a,k)=>a+Number(k.czas_min || ((k.dystans_km || (k.powtorzenia || 0)*(k.dystans_m || 0)/1000)*(pace(k.tempo || t.tempo_zakres) || 360)/60)),0);
  const recipe=JSON.stringify([t.podtyp,main.map(k=>[k.powtorzenia || 1,k.dystans_m || k.dystans_km || 0,k.czas_min || 0,k.przerwa || ''])]);
  return {km,minutes,recipe};
}
export function collectMetrics(input,plan) {
  const runs=(plan.treningi || []).filter(t=>!AUX.has(t.podtyp)&&Number(t.dystans_km)>0).slice().sort((a,b)=>a.data.localeCompare(b.data));
  const targetDate=input.goal?.raceDate, type=input.goal?.type;
  const events=runs.slice();
  if(targetDate && DIST[type] && !events.some(t=>t.data===targetDate&&t.podtyp==='start'))events.push({data:targetDate,podtyp:'start',dystans_km:DIST[type],czas_min:input.goal.targetTimeSec/60 || 0});
  const groups=new Map();
  for(const t of events){const key=mon(t.data);if(!groups.has(key))groups.set(key,{od:key,runs:[],all:[],km:0});groups.get(key).all.push(t);}
  for(const t of runs){const w=groups.get(mon(t.data));if(t.podtyp!=='start')w.runs.push(t);}
  const weeks=[...groups.values()].sort((a,b)=>a.od.localeCompare(b.od));
  for(const w of weeks){w.km=w.runs.reduce((s,t)=>s+t.dystans_km,0);w.kmWithRace=w.all.reduce((s,t)=>s+t.dystans_km,0);w.n=w.runs.length;w.nWithRace=w.all.length;w.quality=w.runs.filter(t=>Q.has(t.podtyp));w.long=Math.max(0,...w.runs.filter(t=>t.podtyp==='dlugi').map(t=>t.dystans_km));w.deload=w.runs.some(t=>t.odciazenie);w.taper=!!targetDate && diff(w.od,targetDate)<(type==='marathon'?21:type==='half'||type==='10k'?14:7);w.minutes=w.runs.reduce((s,t)=>s+(t.czas_min || 0),0);w.work=[...w.quality,...w.runs.filter(t=>t.progresywny)].reduce((s,t)=>s+workOf(t).minutes,0);}
  const quality=runs.filter(t=>Q.has(t.podtyp)&&t.podtyp!=='ostrzenie');
  const coreQuality=quality.filter(t=>t.podtyp!=='test');
  const regular=weeks.filter(w=>!w.deload&&!w.taper&&diff(input.today,w.od)>=0);
  const recipes=coreQuality.map(t=>workOf(t).recipe),uniqueRecipes=new Set(recipes);
  const b=input.bestResult, prediction=b && DIST[type]?b.timeSec*(DIST[type]/b.distanceKm)**1.06:null;
  const intent=input.goal?.mode==='finish'?'ukonczenie':input.goal?.targetTimeSec && prediction?(input.goal.targetTimeSec>=prediction*.99?'utrzymanie':'poprawa'):type==='health'?'aktywnosc':'ukonczenie';
  return {runs,events,weeks,regular,quality,coreQuality,intent,prediction,peakKm:Math.max(0,...weeks.map(w=>w.km)),meanKm:mean(weeks.map(w=>w.km)),longest:Math.max(0,...runs.filter(t=>['dlugi','latwy','marszobieg'].includes(t.podtyp)).map(t=>t.dystans_km)),maxTrainingDays:Math.max(0,...weeks.map(w=>w.n)),maxDaysWithRace:Math.max(0,...weeks.map(w=>w.nWithRace)),uniqueRecipes:uniqueRecipes.size,recipeCount:recipes.length,recipeDiversity:recipes.length?uniqueRecipes.size/recipes.length:0,firstQualityDay:quality.length?diff(input.today,quality[0].data):null};
}
export function evaluatePlan(input,plan) {
  const categories=Object.fromEntries(Object.keys(WEIGHTS).map(k=>[k,{weight:WEIGHTS[k],criteria:[],issues:[]}]));
  const credit=(c,code,weight,value,reason)=>categories[c].criteria.push({code,weight,value:round(clamp(value)),reason});
  const issue=(c,code,severity,reason,date=null)=>categories[c].issues.push({code,severity,reason,date});
  if(!plan?.ok || !Array.isArray(plan.treningi) || plan.treningi.some(t=>!Number.isFinite(d(t.data))))return {version:METER_VERSION,total:0,components:{},issues:[{code:'BRAK_POPRAWNEGO_PLANU',severity:1,reason:plan?.komunikat || 'Brak poprawnego planu'}],status:'odmowa_lub_blad',heuristic:true};
  const m=collectMetrics(input,plan),nWeeks=Math.max(1,m.weeks.length),type=input.goal?.type;
  let previousKm=Number(input.currentWeeklyKm || 0),previousLong=Number(input.longestRecentRun || 0);
  const available=(input.availableDays || []).map(Number),declared=Number(input.daysPerWeek || 3),age=Number(input.age || 35);
  const breakDays=Number(input.breakDays ?? input.przerwaDni ?? 0);
  const effectiveBase=Number(input.currentWeeklyKm || 0)*(breakDays>=56?.4:breakDays>=28?.5:breakDays>=14?.65:1);
  let previousHard=null;
  for(const t of m.runs){
    if(!available.includes(new Date(d(t.data)).getUTCDay()))issue('indywidualizacja','NIEDOSTEPNY_DZIEN',.8,'Trening poza dostępnymi dniami.',t.data);
    const lim=Number((new Date(d(t.data)).getUTCDay()%6===0?input.maxMinutesWeekend:input.maxMinutesWeekday) || input.maxMinutes || (new Date(d(t.data)).getUTCDay()%6===0&&type==='marathon'?210:120));
    if(t.czas_min>lim+1)issue('bezpieczenstwo','LIMIT_CZASU',.8,'Czas przekracza limit dnia.',t.data);
    if(Q.has(t.podtyp)||t.podtyp==='dlugi'){
      if(previousHard&&diff(previousHard.data,t.data)<2)issue('bezpieczenstwo','SASIEDNIE_MOCNE',.6,'Dwa mocne bodźce bez pełnego dnia przerwy.',t.data);
      previousHard=t;
    }
    if(Q.has(t.podtyp)&&t.podtyp!=='ostrzenie'&&(!(t.kroki || []).some(k=>k.etap==='Rozgrzewka')||!(t.kroki || []).some(k=>k.etap==='Schłodzenie')))issue('jakosc','BRAK_ROZGRZEWKI_LUB_SCHLODZENIA',.7,'Brak oprawy jakości.',t.data);
    if(input.goal?.raceDate&&Q.has(t.podtyp)&&t.podtyp!=='ostrzenie'&&diff(t.data,input.goal.raceDate)<3)issue('kalendarz','AKCENT_BLISKO_STARTU',.8,'Mocna jednostka w ostatnich dwóch dniach.',t.data);
  }
  const fullStart=m.weeks.find(w=>diff(input.today,w.od)>=0);
  if(fullStart&&effectiveBase>0&&fullStart.km>Math.max(effectiveBase*1.3,effectiveBase+5))issue('bezpieczenstwo','ZA_WYSOKI_START',1,'Pierwszy tydzień przekracza efektywną bazę po przerwie.');
  if(input.activeInjury || Number(input.pain)>=4)issue('bezpieczenstwo','PLAN_PRZY_URAZIE',2,'Plan wygenerowano mimo aktywnego urazu/bólu.');
  const seen=new Set();for(const t of m.runs){if(seen.has(t.data))issue('kalendarz','DUPLIKAT_DNIA',.6,'Więcej niż jeden bieg w dniu.',t.data);seen.add(t.data);}
  for(const w of m.weeks){
    if(w.nWithRace>declared)issue('kalendarz','CZESTOTLIWOSC_ZE_STARTEM',.7,`${w.nWithRace} jednostek ze startem przy deklarowanych ${declared}.`,w.od);
    if(w.n>=7)issue('bezpieczenstwo','BRAK_DNIA_WOLNEGO',.5,'Brak dnia bez biegania.',w.od);
    if(!w.taper&&!w.deload&&diff(input.today,w.od)>=0){
      if(previousKm>0&&w.km>Math.max(previousKm*1.18,previousKm+4))issue('progresja','SKOK_KM',.5,`${round(w.km)} vs ${round(previousKm)} km.`,w.od);
      if(previousLong>0&&w.long>Math.max(previousLong*1.2,previousLong+3))issue('progresja','SKOK_DLUGIEGO',.5,'Za szybki wzrost najdłuższego biegu.',w.od);
      previousKm=w.km || previousKm;previousLong=w.long || previousLong;
    }
    if(w.quality.length>Math.max(0,Math.min(w.n-1,declared>=5?2:1)))issue('bezpieczenstwo','ZA_DUZO_AKCENTOW',.8,'Zbyt wiele akcentów względem częstości.',w.od);
    if(w.minutes>0&&w.work/w.minutes>.32)issue('bezpieczenstwo','UDZIAL_INTENSYWNOSCI',.35,'Część intensywna przekracza 32% czasu.',w.od);
    if(w.n>=2&&w.long>10&&w.long/w.km>({2:.66,3:.54,4:.48,5:.44,6:.40}[w.n] || .4))issue('bezpieczenstwo','KONCENTRACJA_DLUGIEGO',.35,'Długi bieg zbyt dominujący w tygodniu.',w.od);
  }
  credit('bezpieczenstwo','OGLEDNOSC',.4,1,'Brak naruszeń to podstawa bezpieczeństwa, nie dowód skuteczności.');
  credit('bezpieczenstwo','ODCIAZENIA',.3,m.weeks.length<8?1:Math.min(1,m.weeks.filter(w=>w.deload).length/Math.max(1,Math.floor(nWeeks/4))), 'Lżejsze tygodnie w dłuższym planie.');
  credit('bezpieczenstwo','REGENERACJA_POWYSILKOWA',.3,m.runs.length?1:0,'Odstępy między ciężkimi jednostkami sprawdzane osobno.');
  const startMatch=fullStart&&effectiveBase>0?clamp(1-Math.max(0,Math.abs(fullStart.km/effectiveBase-1)-.25)):input.currentWeeklyKm===0?1:.6;
  credit('indywidualizacja','BAZA_REALNA',.25,startMatch,'Porównanie pierwszego pełnego tygodnia z efektywną bazą.');
  credit('indywidualizacja','OGRANICZENIA',.25,available.length&&m.runs.every(t=>available.includes(new Date(d(t.data)).getUTCDay()))?1:0,'Rzeczywista dostępność.');
  credit('indywidualizacja','HISTORIA_I_STAZ',.2,(input.recentWeeklyKm?.length>=2?.6:.25)+(input.experienceMonths!=null?.4:.15),'Nieznana historia/staż zmniejsza pewność oceny, nie udaje personalizacji.');
  credit('indywidualizacja','INTENSYWNOSC_I_NIEPEWNOSC',.2,plan.treningi.every(t=>t.intensywnosc?.priorytet)?1:.4,'Oddzielenie RPE i wiarygodności danych.');
  credit('indywidualizacja','CEL',.1,input.goal?.targetTimeSec?(m.prediction?1:.4):.8,'Ocena kontekstu celu na podstawie wejścia i wyniku; sama etykieta generatora nie daje punktów.');
  const normal=m.regular.map(w=>w.km),early=mean(normal.slice(0,3)),late=mean(normal.slice(-3));
  const growth=m.intent==='utrzymanie'||m.intent==='aktywnosc'?1:early?clamp((late/early-1)/.2):.5;
  credit('progresja','OBJETOSC_W_KONTEKSCIE_CELU',.35,growth,'Utrzymanie formy nie wymaga wzrostu km; poprawa/ukończenie ocenia rozwój odpowiedniej bazy.');
  const work=m.coreQuality.map(t=>workOf(t).minutes),workGrowth=work.length>1?clamp((mean(work.slice(-3))/Math.max(1,mean(work.slice(0,3)))-.8)/.6):m.maxTrainingDays<=1?1:.3;
  credit('progresja','EWOLUCJA_BODZCA',.35,workGrowth,'Zmiana dawki części głównej, bez wymogu ciągłego wzrostu.');
  credit('progresja','STABILIZACJA',.3,m.weeks.some(w=>w.deload)||nWeeks<8?1:.3,'Stabilizacja i odciążenie, zamiast wzrostu wszystkiego naraz.');
  const minimumWeeks={'5k':6,'10k':8,half:12,marathon:16}[type];
  if(input.goal?.raceDate && minimumWeeks && diff(input.today,input.goal.raceDate)/7<minimumWeeks)issue('dystans','ZA_KROTKI_HORYZONT',.5,'Horyzont poniżej orientacyjnego minimum dla dystansu.');
  const targetPace=input.goal?.targetTimeSec && DIST[type]?input.goal.targetTimeSec/DIST[type]:null;
  const matchingSpecific=m.coreQuality.filter(t=>t.podtyp==='tempo_startowe'&&(!targetPace || pace(t.tempo_zakres)&&Math.abs(pace(t.tempo_zakres)/targetPace-1)<=.05));
  for(const t of m.coreQuality.filter(t=>t.podtyp==='tempo_startowe'))if(targetPace && pace(t.tempo_zakres) && Math.abs(pace(t.tempo_zakres)/targetPace-1)>.05)issue('dystans','NIEZGODNE_TEMPO_SPECYFICZNE',.5,'Etykieta startowa nie potwierdza zgodności tempa z celem.',t.data);
  const minima={health:[1,0,0],'5k':[2,12,5],'10k':[2,20,8],half:[3,28,14],marathon:[4,42,28]}[type] || [2,20,8];
  const adequacy=Math.min(ratio(m.maxTrainingDays,minima[0]),ratio(m.peakKm,minima[1]),ratio(m.longest,minima[2]));
  credit('dystans','BAZA_DO_DYSTANSU',.6,adequacy,'Efektywna częstotliwość, objętość i najdłuższa jednostka; progi są heurystyczne.');
  const eligible=m.maxTrainingDays>=2&&effectiveBase>=12&&!input.injuries&&!(Number(input.pain)>=3)&&(input.experienceMonths==null||input.experienceMonths>=3);
  const types=new Set(m.coreQuality.map(t=>t.podtyp));
  let specificity=!eligible?.5:type==='marathon'||type==='half'?(matchingSpecific.length?1:types.has('tempo')?.5:.2):type==='10k'?(types.has('tempo')&&matchingSpecific.length?1:types.has('tempo')?.7:.3):type==='5k'?(types.has('interwaly')?.9:types.has('tempo')?.65:.3):1;
  credit('dystans','SPECYFICZNY_BODZIEC',.4,specificity,'Odcinki właściwe dla dystansu, z ostrożnym ograniczeniem przy niskiej gotowości.');
  if(type==='marathon'&&m.maxTrainingDays<=2)issue('dystans','MARATON_NIEWYKONALNY',.8,'Brak realnego modelu pełnego przygotowania przy 1–2 dniach.');
  const diversity=m.coreQuality.length<=2?(eligible?.4:1):clamp(m.uniqueRecipes/Math.min(8,m.coreQuality.length));
  credit('jakosc','CELOWA_ROZNORODNOSC',.35,diversity,'Różne recepty części głównej; rozgrzewki ani nazwy nie zwiększają różnorodności.');
  const dose=eligible?clamp(m.quality.length/Math.max(1,(nWeeks-3)*.5)):1;
  credit('jakosc','DAWKA_BEZ_NADMIARU',.35,dose,'Oczekiwanie jakości dotyczy przygotowanego biegacza; nadmiar jest karany osobno.');
  const trained=effectiveBase>=25&&input.level!=='beginner'&&!(Number(input.pain)>=3)&&breakDays<14&&m.maxTrainingDays>=3;
  credit('jakosc','WEJSCIE_W_JAKOSC',.3,!trained?1:m.firstQualityDay==null?0:m.firstQualityDay<=14?1:clamp(1-(m.firstQualityDay-14)/35),'Wczesny łagodny bodziec dla przygotowanych; początkujący nie jest karany za bazę.');
  if(m.recipeCount>=5&&m.recipeDiversity<.45)issue('jakosc','MONOTONIA_JAKOSCI',.35,'Dominują te same recepty; zmiany nazw nie liczą się jako progresja.');
  const date=input.goal?.raceDate;
  const pre=date?m.weeks.filter(w=>diff(w.od,date)>0&&diff(w.od,date)<=14):[];
  const preLoad=pre.length?mean(pre.map(w=>w.km)):0;
  const referencePeak=Math.max(0,...m.weeks.filter(w=>!date || diff(w.od,date)>=14).map(w=>w.km)) || m.peakKm;
  credit('kalendarz','TAPER',.5,!date?1:referencePeak>0?clamp((1-preLoad/referencePeak)/.35):.5,'Redukcja objętości treningów przed startem; dystans zawodów raportowany osobno.');
  credit('kalendarz','LIMIT_JEDNOSTEK_Z_ZAWODAMI',.3,m.maxDaysWithRace<=declared?1:0,'Zawody wliczają się do liczby jednostek.');
  credit('kalendarz','ODSTEPY',.2,1,'Każda kolizja i jednostka tuż przed startem jest osobną karą.');
  if(date&&referencePeak>0&&preLoad>.9*referencePeak)issue('kalendarz','BRAK_TAPERU',.8,'Brak redukcji objętości przed startem.');
  const components={},allIssues=[];
  for(const [key,c] of Object.entries(categories)) {
    const positive=10*c.criteria.reduce((s,x)=>s+x.weight*x.value,0)/Math.max(.001,c.criteria.reduce((s,x)=>s+x.weight,0));
    const penalty=c.issues.reduce((s,x)=>s+x.severity,0);
    components[key]={...c,positive:round(positive),score:round(positive*Math.exp(-penalty/Math.sqrt(nWeeks)))};
    allIssues.push(...c.issues.map(x=>({...x,category:key})));
  }
  const weightedTotal=Object.entries(components).reduce((s,[k,c])=>s+c.score*WEIGHTS[k]/100,0);
  const goalFactor=Math.sqrt(adequacy);
  return {version:METER_VERSION,total:round(weightedTotal*goalFactor),weightedTotal:round(weightedTotal),goalFactor:round(goalFactor),components,issues:allIssues,
    metrics:{intent:m.intent,weeks:nWeeks,peakKm:m.peakKm,meanKm:round(m.meanKm),longest:m.longest,maxTrainingDays:m.maxTrainingDays,maxDaysWithRace:m.maxDaysWithRace,quality:m.quality.length,uniqueRecipes:m.uniqueRecipes,recipeDiversity:round(m.recipeDiversity),firstQualityDay:m.firstQualityDay,adequacy:round(adequacy),taperReferenceKm:referencePeak},
    heuristic:true,clinicalValidation:false,limitations:['Punktacja nie dowodzi skuteczności na biegaczach.','Indywidualizacja między profilami wymaga także testów metamorfcznych.','Minima dystansowe, RPE i wagi jakości są heurystykami.']};
}
