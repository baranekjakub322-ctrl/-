const DAY=86400000;
const isDate=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
const days=(a,b)=>Math.round((Date.parse(b)-Date.parse(a))/DAY);
const finiteRange=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
const copy=x=>JSON.parse(JSON.stringify(x));
const canonical=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const failure=message=>({ok:false,bledy:[message],komunikat:message});
export function adaptWith(generate,physics,input,previousPlan,observations=[],opts={}) {
  if(!input||typeof input!=='object'||!previousPlan?.ok||!Array.isArray(observations)||!opts||typeof opts!=='object'||observations.some(o=>!o||typeof o!=='object'))return failure('Adaptacja wymaga poprawnego wejścia, poprzedniego planu i listy obserwacji.');
  const today=opts.today || input.today;
  if(!isDate(today)||today<(previousPlan.adaptacja?.date || input.today))return failure('Data aktualizacji nie może poprzedzać początku poprzedniego planu.');
  const source=previousPlan.adaptacja?.inputUsed || input;
  const raceDate=opts.raceDate ?? source.goal?.raceDate;
  if(raceDate && (!isDate(raceDate)||raceDate<=today))return failure('Nowa data startu musi być poprawna i późniejsza od aktualizacji.');
  if(previousPlan.adaptacja?.date && today<previousPlan.adaptacja.date)return failure('Aktualizacja nie może cofać historii zmian.');
  if(opts.reducedIntensity!=null && typeof opts.reducedIntensity!=='boolean')return failure('reducedIntensity musi być wartością logiczną.');
  let sorted=observations.map(copy);
  const seen=new Set();
  for(const o of sorted){
    if(!isDate(o.date)||o.date>today||!['done','missed','shortened'].includes(o.status))return failure('Obserwacja wymaga daty nie późniejszej niż aktualizacja i statusu done/missed/shortened.');
    if(seen.has(o.date))return failure('Zduplikowana data obserwacji; połącz dane jednej jednostki.');seen.add(o.date);
    for(const [key,a,b]of [['distanceKm',0,100],['durationMin',0,1000],['rpe',1,10],['fatigue',1,5],['pain',0,10]])if(o[key]!=null&&!finiteRange(o[key],a,b))return failure(`Nieprawidłowe pole obserwacji: ${key}.`);
    if(o.status!=='missed' && (o.distanceKm==null||o.durationMin==null))return failure('Wykonany/skrócony bieg wymaga dystansu i czasu; brak danych nie oznacza zera.');
    if(o.distanceKm>0 && o.durationMin===0)return failure('Dodatni dystans wykonania wymaga dodatniego czasu.');
    if(o.reducedIntensity!=null && typeof o.reducedIntensity!=='boolean')return failure('reducedIntensity w obserwacji musi być wartością logiczną.');
    if(o.status==='missed' && o.testResult)return failure('Pominięta jednostka nie może zawierać wykonanego testu.');
    if(o.activeInjury!=null && typeof o.activeInjury!=='boolean')return failure('activeInjury w obserwacji musi być wartością logiczną.');
    if(o.testResult && (!finiteRange(o.testResult.distanceKm,.1,100)||!finiteRange(o.testResult.timeSec,1,86400)))return failure('Wynik testu wymaga dodatniego dystansu i czasu.');
  }
  // Immutable ledger: retransmission is idempotent; changing an existing observation is an error.
  const stored=previousPlan.adaptacja?.observations || [];
  const newObservations=sorted.filter(o=>!stored.some(s=>s.date===o.date));
  for(const o of sorted){const prior=stored.find(s=>s.date===o.date);if(prior && canonical(prior)!==canonical(o))return failure('Nie można nadpisać zapisanej obserwacji; zachowaj historię wykonania.');}
  sorted=[...stored.map(copy),...newObservations];
  sorted.sort((a,b)=>a.date.localeCompare(b.date));
  const recent=sorted.filter(o=>days(o.date,today)<=14),latest=recent.at(-1);
  const lastSymptom=sorted.filter(o=>o.pain!=null || o.activeInjury!=null).at(-1);
  const symptomatic=lastSymptom && (lastSymptom.pain>=4 || lastSymptom.activeInjury) ? lastSymptom : null;
  if(symptomatic)return {...failure('Ból lub aktywny uraz: wstrzymano adaptację obciążeń, potrzebna ocena powrotu.'),adaptacja:{wstrzymana:true,powod:'bol_lub_uraz',obserwacja:symptomatic.date}};
  const p={...copy(source),today,goal:{...copy(source.goal),...(raceDate?{raceDate}:{})}},reasons=[];
  if(opts.raceDate && opts.raceDate!==input.goal?.raceDate)reasons.push('Nowy termin startu: ponownie obliczono fazy i taper wyłącznie przyszłej części.');
  p.currentWeeklyKm=Math.min(Number(source.currentWeeklyKm || 0),previousPlan.indywidualizacja?.bazaKm ?? Number(source.currentWeeklyKm || 0));
  p.longestRecentRun=Math.min(Number(source.longestRecentRun || 0),previousPlan.indywidualizacja?.najdluzszyKm ?? Number(source.longestRecentRun || 0));
  if(opts.availableDays!=null)p.availableDays=copy(opts.availableDays);
  if(opts.daysPerWeek!=null)p.daysPerWeek=opts.daysPerWeek;
  if(Array.isArray(opts.availableDays) && Array.isArray(p.preferredDays)){
    const old=p.preferredDays.length,allowed=opts.availableDays.map(Number);
    p.preferredDays=p.preferredDays.filter(d=>allowed.includes(Number(d)));
    if(p.preferredDays.length<old)reasons.push('Usunięto preferencje dni, które nie są już dostępne; pozostałe preferencje zachowano.');
  }
  if(opts.availableDays)reasons.push('Nowa dostępność obowiązuje wyłącznie przyszłe treningi.');
  const newRecent=newObservations.filter(o=>days(o.date,today)<=14);
  const done=recent.filter(o=>o.status!=='missed'),fatigued=newRecent.slice(-3).filter(o=>o.fatigue>=4||o.rpe>=9).length;
  let volumeFactor=fatigued>=2?.8:fatigued===1?.9:1;
  const shortened=newRecent.filter(o=>o.status==='shortened').length,missed=newRecent.filter(o=>o.status==='missed').length;
  if(shortened>=2||missed>=2)volumeFactor=Math.min(volumeFactor,.9);
  if(opts.completeWindow===true){
    const from=opts.coverageFrom;
    if(!isDate(from)||days(from,today)<14)return failure('Pełne okno wymaga coverageFrom co najmniej 14 dni przed aktualizacją.');
    const kms=done.reduce((s,o)=>s+o.distanceKm,0)/2;
    p.currentWeeklyKm=Math.min(Number(p.currentWeeklyKm || kms),kms);
    p.longestRecentRun=Math.min(Number(p.longestRecentRun || 0),Math.max(0,...done.map(o=>o.distanceKm)));
    delete p.recentWeeklyKm; // input's old window is no longer current
    reasons.push('Baza ograniczona rzeczywiście wykonanymi kilometrami pełnego 14-dniowego okna.');
  }
  const lastDone=sorted.filter(o=>o.status!=='missed').at(-1);
  const explicitGap=Number(opts.missedDays || 0);
  if(!Number.isFinite(explicitGap)||explicitGap<0||explicitGap>3650)return failure('missedDays musi wynosić 0–3650.');
  const gap=Math.max(explicitGap,opts.completeWindow&&lastDone?days(lastDone.date,today):0);
  if(gap>=7 && gap<14){p.currentWeeklyKm*=.85;p.longestRecentRun*=.85;p.qualityNotBefore=new Date(Date.parse(today)+7*DAY).toISOString().slice(0,10);reasons.push('Przerwa 7–13 dni: ostrożny tydzień wejściowy bez nadrabiania.');}
  if(gap>=14){p.breakDays=gap;reasons.push(`Przerwa ${gap} dni: powrót przez obniżoną bazę, bez nadrabiania.`);}
  else {delete p.breakDays;delete p.przerwaDni;}
  if(volumeFactor<1){p.currentWeeklyKm=Number(p.currentWeeklyKm || 0)*volumeFactor;p.longestRecentRun=Math.min(Number(p.longestRecentRun || 0),p.currentWeeklyKm);p.loadTolerance='low';reasons.push(`Zmęczenie/skracanie jednostek: współczynnik objętości ${volumeFactor}.`);}
  if(fatigued||recent.some(o=>o.pain>=3)){p.qualityNotBefore=new Date(Date.parse(today)+7*DAY).toISOString().slice(0,10);reasons.push('Pierwszy tydzień bez jakości z powodu zmęczenia/dolegliwości.');}
  if(opts.reducedIntensity || newRecent.some(o=>o.reducedIntensity)){p.intensityTolerance='low';p.qualityNotBefore=new Date(Date.parse(today)+7*DAY).toISOString().slice(0,10);reasons.push('Zgłoszono ograniczoną tolerancję intensywności: tydzień bez akcentów, dalsze dawki obniżone.');}
  const test=newRecent.filter(o=>o.status!=='missed'&&o.testResult).at(-1);
  if(test){
    const raw=test.testResult,base=p.vdotOverride || previousPlan.adaptacja?.inputUsed?.vdotOverride || (p.bestResult?physics.vdotFrom(p.bestResult.distanceKm*1000,p.bestResult.timeSec):previousPlan.ocena?.vdot);
    const value=physics.vdotFrom(raw.distanceKm*1000,raw.timeSec);
    const used=base?Math.min(value,base*1.02):value;
    p.bestResult={...raw,date:test.date};p.vdotOverride=used;p.vdotSource='aktualizacja: test z limitem jednorazowej poprawy VDOT 2%';
    reasons.push(value>used?'Nowy test jest szybszy: jednorazowa poprawa intensywności ograniczona do 2% VDOT.':'Nowy wynik testowy skorygował intensywność według aktualnej formy.');
  }
  if(missed)reasons.push(`Pominięte jednostki (${missed}) nie są przenoszone ani nadrabiane.`);
  const completedToday=sorted.some(o=>o.date===today && o.status!=='missed');
  if(completedToday){
    p.today=new Date(Date.parse(today)+DAY).toISOString().slice(0,10);
    if(raceDate && p.today>=raceDate)return failure('Wykonany dzisiejszy trening pozostaje w historii; do startu nie ma już pełnego dnia na nowy plan.');
    reasons.push('Dzisiejszy bieg jest już wykonany: nowa część zaczyna się jutro.');
  }
  const result=generate(p);
  const revision=(previousPlan.adaptacja?.revision || 0)+1;
  const entry={revision,date:today,reasons:reasons.length?reasons:['Podtrzymano plan na podstawie dostępnych danych.'],missed,shortened,volumeFactor,observations:sorted.length};
  result.adaptacja={revision,date:today,history:[...(previousPlan.adaptacja?.history || []),entry],inputUsed:p,observations:sorted,
    pastPlan:[...new Map([...(previousPlan.adaptacja?.pastPlan || []),...(previousPlan.treningi || []).filter(t=>t.data<today)].map(t=>[t.data+':'+t.podtyp,copy(t)])).values()].sort((a,b)=>a.data.localeCompare(b.data)),
    completedHistory:sorted.filter(o=>o.status!=='missed').map(copy),noCatchUp:true};
  if(result.ok){result.plan.tryb='adaptacja';result.ostrzezenia.unshift(...entry.reasons);}
  return result;
}
