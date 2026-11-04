# Run Planner V26

Silnik JavaScript/ESM rozwinięty z V25, bez interfejsu i zależności npm. Node ≥18; wykonano na v24.19.0.

## Uruchomienie

Po rozpakowaniu przejdź do RunPlanner_V26; w repozytorium run-planner/v26.

```sh
node --version
npm test
npm run test:v26
npm run test:adaptation
npm run compare
npm run diagnosis
npm run benchmark
npm run profile
npm run report
python3 testy/pakuj_v26.py /wybrana/sciezka/RunPlanner_V26.zip
```
Nie potrzeba npm install. Pełny test historycznego skryptu wymaga Bash; pakowanie wymaga Python ≥3.8. WYNIKI=/inna/sciezka wskazuje katalog wyników; raporty wymagają kompletnego przebiegu. Archiwum ma wszystkie źródła historyczne i wejścia potrzebne testom, bez wielkich kopii starych ZIP-ów. Bazowy ZIP V25 identyfikuje PROVENANCE_V26.json i commit 39d8466e25a35c7ef65e1ca4294decf057d7b8d0; źródła V25 są w paczce.

## API

```js
import {generatePlan,updatePlan,importActivities,scoreV23,scoreV25} from './planGenerator_v26.js';
const input={today:'2026-11-02',age:35,level:'intermediate',daysPerWeek:3,availableDays:[0,1,2,3,4,5,6],currentWeeklyKm:35,longestRecentRun:14,bestResult:{distanceKm:10,timeSec:3120},goal:{type:'10k',targetTimeSec:3214,raceDate:'2027-03-28'}};
const plan=generatePlan(input);
console.log(plan.ok,plan.safetyValidation,plan.weekReadiness);
const revised=updatePlan(input,plan,[{id:'run-1',date:'2026-11-08',status:'done',distanceKm:8,durationMin:52,rpe:4}],{today:'2026-11-09'});
```
Eksporty V25 zachowano, wersja 26.0. Parametry V25 nadal działają (README_V25.md). Daty YYYY-MM-DD, dni 0=niedziela..6=sobota, km, czasy wyników w sekundach, treningów w minutach.

Nowe opcjonalne planningCandidates: 2–4 (domyślnie 2). goal.mode: finish/time oraz activity/maintain. Brak wymuszenia rekordu przy podtrzymaniu. safetyValidation: niezależne naruszenia i wielowymiarowe tygodnie; planningStages i decyzjePlanera.wariantyTygodni wyjaśniają wybór. weekReadiness jest odrębna od readinessEvidence oraz celu czasowego.

importActivities(previousLedger,events,today,options) zwraca dziennik i importReport: przyjęte, zdeduplikowane, odrzucone rekordy z oryginałem i powodem. Brak durationMin nie jest zgadywany. updatePlan(..., {partialImport:true}) korzysta z kwarantanny; domyślny stary import transakcyjny pozostaje ścisły. Identyfikatory, correct/cancel/restore, strefy IANA i wiele aktywności dziennie jak w V25. adaptationConfidence jest opisową pewnością, nie prawdopodobieństwem.

plannedWorkouts, completedHistory, adaptationDecisions i readinessEvidence pozostają rozdzielone. Rejestr jakości przechowuje preparation, predecessor i doseDecision; poprzednia jednostka ma status planned, dopóki nie istnieje rzeczywista obserwacja.

## Wyniki i ograniczenia

1824 PASS / 0 FAIL, 28+1008 porównań, 150 historii po 6 tygodni, 42 profile. 1008 według 23.0.0: **7.444 → 7.447**, poprawy/remisy/obniżenia **40/968/0**.

1008 według 25.0.0: **9.187 → 9.190**. Skale porównujemy osobno. Względem V23 pozostaje 88 niższych wyników (V25: 88). Nie utożsamiamy tego z regresjami V26/V25 ani dawnymi 49 obniżeniami V25/V24.

Wydajność: średni czas generowania w tym pomiarze wzrósł z 14.146 do 26.442 ms (1.869×), przy wyborze maksymalnie 2–4 wariantów. Koszt jest ograniczony, ale V26 nie poprawiła wydajności V25; dalsze profilowanie jest zadaniem V27.

Nie osiągnięto zakładanej znacznej poprawy średnich i większości 1008 profili. Raport pokazuje rzeczywiste różnice, również niższe oceny i remisy. W 418 z 1008 przypadków zmieniły się rzeczywiste jednostki; sama zmiana nie dowodzi poprawy treningowej. Zmiany walidacji, importu, danych i gotowości nie muszą zmieniać statycznej punktacji; nie tworzymy sztucznych zmian dla wyniku.

Brak zewnętrznej oceny trenerów i badań prospektywnych tolerancji, wyników oraz urazów. 42 przeglądy są wewnętrzne, 150 historii to symulacje. Progi regularności, dawki i tempa są heurystyczne. Brakujące czasy pozostają w kwarantannie, bez zgadywania wykonania.

Model ograniczeń otacza starszy silnik i ograniczone warianty tygodnia; nie jest globalnym optymalizatorem całego sezonu. Część monolitu pozostaje. Warunkowa progresja jest scenariuszem planowanym, nie dowodem adaptacji. Osobna ocena gotowości tygodnia nie stanowi kwalifikacji medycznej.

1–2 dni ograniczają długie dystanse. Siódmy dzień wymaga deklaracji oraz rzeczywistej kompletnej historii; nawet wtedy nie jest obowiązkowy. Żywienie i warunki są ostrożnym kontekstem; nie ma precyzyjnego modelu strat potu czy wpływu trasy.

Historyczny miernik V25 ma skupienie wyników 9–10. Zachowano go zamiast poprawiać ocenę własnej wersji; oba mierniki wymagają kalibracji na danych zewnętrznych.

Dokumenty obowiązkowe są w katalogu głównym. Surowe JSON w wyniki_v26; pełne pary i historie w gzip JSONL. Każda linia jest niezależnym obiektem; można czytać np. modułem gzip/json w Python. Manifest SHA-256 obejmuje całą zawartość ZIP. Źródła, oba mierniki i wejścia są wersjonowane; raporty nie stanowią klinicznego dowodu bezpieczeństwa.
