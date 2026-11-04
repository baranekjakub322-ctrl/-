import {dayDiff,addDate,latestSymptom} from './activity_v28.mjs';
export function readinessEvidence(input,completed=[],coverage={}){
 const today=input.today,done=completed.filter(o=>o.status!=='missed'&&o.distanceKm>0&&o.durationMin>0&&o.date<=today),recent=done.filter(o=>dayDiff(o.date,today)<28),weeks=[];
 for(let k=0;k<4;k++){const end=addDate(today,-7*k),start=addDate(end,-7),rows=recent.filter(o=>o.date>=start&&o.date<end);weeks.unshift({from:start,to:end,km:rows.reduce((s,o)=>s+o.distanceKm,0),days:new Set(rows.map(o=>o.date)).size,minutes:rows.reduce((s,o)=>s+o.durationMin,0)});}
 const windowComplete=coverage.completeWindow===true&&coverage.coverageFrom&&dayDiff(coverage.coverageFrom,today)>=28 && (!coverage.coverageTo || dayDiff(coverage.coverageTo,today)<=1);
 const longest=Math.max(0,...recent.map(o=>o.distanceKm)),regular=weeks.filter(w=>w.days>=3).length>=3,mean=weeks.reduce((s,w)=>s+w.km,0)/4;
 const symptom=latestSymptom(completed),fatigue=recent.slice(-3).some(o=>o.fatigue>=4||o.rpe>=9),blocked=input.activeInjury||Number(input.pain)>=3||symptom&&(symptom.pain>=3||symptom.activeInjury);
 const frequency=Math.min(Number(input.daysPerWeek||3),new Set((input.availableDays||[]).map(Number)).size||3),declaredBase=Number(input.currentWeeklyKm||0),declaredLong=Number(input.longestRecentRun||0);
 const estimated=declaredBase>=35&&declaredLong>=16&&(input.experienceMonths==null||input.experienceMonths>=12)&&!blocked;
 const enough=windowComplete&&regular&&mean>=40&&longest>=28&&frequency>=4&&!fatigue&&!blocked;
 const impossible=input.goal?.type==='marathon'&&(Number(input.age)<18||frequency<=2||blocked||input.goal.raceDate&&dayDiff(today,input.goal.raceDate)<42&&declaredLong<16);
 const status=impossible?'cel_niewykonalny':enough?'potwierdzona_danymi':estimated?'szacowana':'niepotwierdzona';
 const gates={regularity:{passed:windowComplete&&regular,evidence:'wykonane dni w pełnym 28-dniowym oknie'},volume:{passed:windowComplete&&regular&&mean>=35&&!fatigue,evidence:'wykonane km i zmęczenie'},longRun:{passed:windowComplete&&regular&&mean>=35&&longest>=22&&!fatigue&&!blocked,evidence:'najdłuższy wykonany bieg'},specific:{passed:windowComplete&&regular&&mean>=40&&longest>=22&&frequency>=4&&!fatigue&&!blocked,evidence:'regularność, tolerancja i faktyczny długi bieg'}};
 let achievedStage='ocena_poczatkowa';if(gates.regularity.passed)achievedStage='regularnosc';if(gates.volume.passed)achievedStage='tolerancja_objetosci';if(gates.longRun.passed)achievedStage='rozwoj_dlugiego';if(gates.specific.passed)achievedStage='przygotowanie_specyficzne';
 return {status,uncertainty:{coverage:windowComplete?'complete':'incomplete',source:done.length?'execution':'declaration',notProbability:true},completedWorkouts:done.length,observedLast28:recent.length,complete28Days:!!windowComplete,meanObservedWeeklyKm:mean,longestCompletedKm:longest,weeks,gates,achievedStage,plannedStages:['ocena_poczatkowa','regularnosc','tolerancja_objetosci','rozwoj_dlugiego','przygotowanie_specyficzne','taper','start_i_regeneracja'],plannedStagesAreCompleted:false,fatigue,blocked:!!blocked,confidence:enough?'umiarkowana':estimated?'ograniczona':'niska',explanation:enough?'Dane wykonania potwierdzają orientacyjne kryteria treningowe; nie jest to kwalifikacja medyczna.':'Planowany kilometraż nie jest wykonaniem. Dalsze fazy pozostają warunkowe.'};
}
export function longDurationLimit(I,week,absolute,pace){
 if(I.goal.type!=='marathon')return absolute;
 const habitual=Number(I.longestCompletedDurationMin)||Number(I.longestRecentRun||0)*pace/60;
 const ceiling=Math.min(absolute,I.age>=65?165:I.injuries||I.loadTolerance==='low'?165:195);
 return Math.min(ceiling,Math.max(90,habitual+12+Math.max(0,week)*(I.currentWeeklyKm>=25 && I.longestRecentRun>=10 && (I.experienceMonths==null||I.experienceMonths>=6)?6:4)));
}
export function supportGuidance(I,t){
 const n=I.nutrition||{},c=I.conditions||{},minutes=t.czas_min;
 const nutrition=minutes>=75?{plannedDurationMin:minutes,carbohydrates:n.giTolerance==='sensitive'?'Małe przetestowane porcje; zacznij ostrożnie, nie zwiększaj przy dolegliwościach.':n.practicedRuns>=3&&n.carbsGramsPerHour>0?'Utrzymuj wcześniej tolerowany sposób przyjmowania węglowodanów; nie zwiększaj ilości bez kolejnych prób.':'Przećwicz małe tolerowane porcje podczas długiego biegu; ilość zależy od wcześniejszych prób, czasu wysiłku i tolerancji.',hydration:'Pij według pragnienia, warunków i wcześniejszej tolerancji; bez przymusowego picia.',separateFromWorkout:true,carbohydrateDoseGramsPerHour:null,reportedCarbsGramsPerHour:n.carbsGramsPerHour??null,experienceSource:'athlete_declaration',experience:n.practicedRuns??null}:null;
 const conditions={temperatureC:c.temperatureC??null,elevationGainM:c.elevationGainM??null,terrain:c.terrain??null,paceCorrectionSeconds:null,reason:'Bez pomiarów indywidualnych nie wyznaczamy precyzyjnej poprawki tempa.',notes:[c.temperatureC>=24&&'Upał: RPE i rozmowa mają pierwszeństwo; skróć lub przełóż wysiłek przy narastającym zmęczeniu.',c.elevationGainM>=200&&'Przewyższenia: kontroluj wysiłek zamiast tempa z płaskiej trasy.',n.giTolerance==='sensitive'&&'Nie testuj nowych produktów podczas zawodów.'].filter(Boolean)};
 return {nutrition,conditions};
}
