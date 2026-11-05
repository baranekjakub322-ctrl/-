# Run Planner V29

Rozwinięcie istniejącego V28 w JavaScript, bez UI, nowych zależności i nowego miernika. Recepty jakościowe są parametryczne, sezon ma bloki, a aktualizacja wymaga dowodów wykonania. Testy heurystyczne nie potwierdzają skuteczności klinicznej.

## Uruchomienie

Wymagane Node ≥18, Bash; Python ≥3.8 do ZIP-a. Sprawdzane na Node 24.19.0. Nie potrzeba `npm install`.

```sh
cd RunPlanner_V29
npm test
npm run report
npm run test:v29
npm run test:adaptation
npm run benchmark
npm run profile
python3 testy/pakuj_v29.py /tmp/RunPlanner_V29.zip
```

`npm test` uruchamia pełną zamrożoną walidację V28, ogólne testy z generatorem V29, etapy A/B/C, adaptację, historie 8–12 tygodni, benchmark 1324 par, audyt 18 planów i wydajność. Zajmuje kilka–kilkanaście minut. `WYNIKI=/inna/sciezka` zmienia katalog wyników; ustaw tę samą wartość dla testów i raportu. Po rzeczywistym ukończeniu 17 etapów V28 można jawnie użyć `REUSE_FROZEN_V28=1 npm test`: wynik jest przyjęty tylko przy identycznym Node i SHA-256 wszystkich zamrożonych zależności, a raport odróżnia ponowną weryfikację od nowego wykonania. Domyślne `npm test` wykonuje całość. `npm run compare` pozostaje aliasem benchmarku. Historyczne scorery/testy i silniki nie zostały zmienione. Bazowy commit oraz punkty cofnięcia etapów A/B/C są w PROVENANCE_V29.json.

## API

```js
import {generatePlan,updatePlan,importActivities} from './planGenerator_v29.js';
const input={today:'2026-11-02',age:35,level:'intermediate',
 experienceMonths:36,currentWeeklyKm:35,longestRecentRun:14,
 availableDays:[0,1,2,3,4,5,6],daysPerWeek:3,
 bestResult:{distanceKm:10,timeSec:3120,date:'2026-10-11'},
 goal:{type:'10k',raceDate:'2027-03-28'}};
const plan=generatePlan(input);
if(!plan.ok) console.log(plan.bledy);
const revised=updatePlan(input,plan,[{id:'watch:123',date:'2027-01-06',
 status:'done',distanceKm:8,durationMin:48,sessionType:'interval',
 workMinutes:16,rpe:7,fatigue:2,
 stimulus:{repetitions:4,intervalMeters:800,restSeconds:90,
 restType:'jog',targetDistance:'10k',conditions:{surface:'road',temperatureC:10}}}],
 {today:'2027-01-10'});
```

Formaty i eksporty V28 pozostają obsługiwane. Dystanse celu: `5k`, `10k`, `half`, `marathon`, `health`; dni 0=niedziela, 1=poniedziałek. Czas wyniku w sekundach, treningu w minutach, dystans jednostki w km. Daty lokalne `YYYY-MM-DD`; import `startedAt` z offsetem/Z i opcjonalnym IANA `timeZone`. Limity czasu: `maxMinutesWeekday`, `maxMinutesWeekend`, `maxLongMinutes`. Cel: `targetTimeSec`, opcjonalnie `mode: maintain/activity/finish`. Regeneracja: `fatigue:1–5`, `pain:0–10`, `activeInjury`, `breakDays`, `volumeTolerance`, `intensityTolerance`, historia i dane snu/samopoczucia jak w V28. `debugTrace:true` pokazuje redukcje oraz rzeczywisty wybór kandydatów.

Nowe opcjonalne dane wykonania: `stimulus` ze strukturą odcinków, `restType: jog/walk/passive/none`, `intervalMeters` lub `intervalSeconds`, opcjonalne warunki. Nie są obowiązkowe do przyjęcia treningu; ich brak ogranicza wniosek o progresji. `illness:true` ogranicza przyszły plan. `rpe:1–10` i `fatigue:1–5` są danymi subiektywnymi, nie pomiarem klinicznym.

Korekta: `{op:'correct',id,changes:{...}}`; anulowanie: `{op:'cancel',id}`; przywrócenie: `{op:'restore',id}`. Oryginał pozostaje w `activityAudit/activityStore`. Kilka aktywności dziennie wymaga osobnych `id` lub `externalId/source` albo czasów `startedAt`. `completeWindow:true,coverageFrom` należy deklarować tylko przy rzeczywiście pełnym imporcie. Brak wpisu w niepełnej historii nie oznacza pominięcia.

## Wyjście i interpretacja

`treningi/plannedWorkouts` to plan; `completedHistory` to wykonanie. `prescription` i `stimulusLedger` rozdzielają `plannedDose`, `executedDose`, `decisionEvidence`, `confidence`. `structuredDose` liczy pracę, przerwy, oprawę, cały czas i dystans; `null` oznacza nieznaną dawkę w adapterze dawnych danych. Obciążenie minuty×orientacyjne RPE ma przedział opisowy, nie prognozuje urazu.

`seasonState.weeks` pokazuje cele bloków; `allocatedWeeks` i historyczne `realized` nadal oznaczają przydzielony PLAN. `enduranceGap` jest ciągłą luką heurystyczną z zakresem niepewności, `feasibleDevelopment` opisuje możliwość rozwoju, a `readinessEvidence` pochodzenie danych. Nie są prawdopodobieństwem ukończenia. W planie początkowym progresja jest warunkowa. W adaptacji brak dowodu nie daje awansu; pojedynczy wynik nie podnosi VDOT.

## Wyniki i plany do przeczytania

- RAPORT_TESTOW_V29.md — faktyczny końcowy przebieg, rozmiar kodu i wydajność.
- BENCHMARK_V28_V29.md — obie wersje według tych samych niezmienionych mierników.
- AUDYT_18_PLANOW_V29.md — 12 podstawowych i 6 dodatkowych pełnych planów, sekwencje tygodni i 3–5 jednostek przed/po.
- OGRANICZENIA_V29.md — także rzeczywiste pogorszenia części planów maratońskich.
- wyniki_v29/plany18/*.json.br — pełne pary, źródła danych i ślad wyboru.

Rozpakowanie pełnej pary bez dodatkowych bibliotek:

```sh
node --input-type=module -e "import fs from 'node:fs';import {brotliDecompressSync} from 'node:zlib';fs.writeFileSync('/tmp/plan.json',brotliDecompressSync(fs.readFileSync('wyniki_v29/plany18/10k-3.json.br')))"
```

`SHA256SUMS` w ZIP-ie pozwala sprawdzić pliki poleceniem `sha256sum -c SHA256SUMS`. Archiwum jest sprawdzane przez CRC i SHA-256 każdego pliku, a ZIP ma osobną sumę `.zip.sha256`.

Manifestem bieżącej wersji jest PROVENANCE_V29.json i hashe z końcowego run_v29.json. Starszy PROVENANCE.json zachowano historycznie; jego hash dawnego testy/lib.mjs był już nieaktualny w V28. Bieżąca odziedziczona biblioteka testów jest identyczna z V28.
