# Run Planner V27 — start tutaj

Rozwinięcie istniejącego silnika V26, bez UI i zależności npm. Node ≥18 oraz Bash do historycznego testu skryptu. Python ≥3.8 jest potrzebny do pakowania. Wykonano na v24.19.0.

## Uruchomienie

```sh
node --version
npm test
npm run test:v27
npm run test:adaptation
npm run benchmark
npm run compare
npm run profile
npm run report
python3 testy/pakuj_v27.py /wybrana/sciezka/RunPlanner_V27.zip
```
Nie potrzeba npm install. WYNIKI=/inna/sciezka zmienia katalog wyników; używaj tej samej wartości dla testów i raportu. npm test uruchamia wszystkie etapy, także profilowanie. Raporty odmawiają działania po niepełnym przebiegu lub zmianie testowanych źródeł.

## API

```js
import {generatePlan,updatePlan,scoreV23,scoreV25} from './planGenerator_v27.js';
import {auditPlan} from './scoring/v27.mjs';
const input={today:'2026-11-02',age:35,level:'intermediate',currentWeeklyKm:35,longestRecentRun:14,bestResult:{distanceKm:10,timeSec:3120},goal:{type:'10k',targetTimeSec:3214,raceDate:'2027-03-28'},daysPerWeek:3,availableDays:[0,1,2,3,4,5,6]};
const plan=generatePlan(input);
console.log(plan.ok,plan.seasonState,plan.stimulusLedger,plan.intensityEvidence);
console.log(scoreV23(input,plan),scoreV25(input,plan),auditPlan(input,plan));
```
Eksporty i formaty wejścia/wyjścia V26 zachowano. Daty YYYY-MM-DD, dni 0=niedziela..6=sobota, dystanse km, wynik/tempo referencyjne w sekundach, trening w minutach. Dokumentacja starszych pól: README_V26.md.

Nowe opcje: controlTests submaximal (domyślnie), maximal (najwyżej jeden) lub none. seasonContext.originStart jest używany przez updatePlan do zachowania osi sezonu; nie jest dowodem gotowości. Wykonanie ma opcjonalne sleepHours 0–24, wellbeing 1–5, workMinutes 0–durationMin i sessionType specific. Przy braku efektywnej dawki nie wnioskuje się jej z całego czasu. Korekty/cancel/restore, kwarantanna partialImport i strefy pozostają.

seasonState, stimulusLedger/plannedWorkouts, completedHistory, adaptationDecisions i readinessEvidence oznaczają odrębne rzeczy. W przyszłych receptach warunki progresji wymagają rzeczywistego wykonania; plan nie zmienia sam PB ani gotowości. PB bez daty ma jawne źródło declared_undated, a szacowane HR nigdy nie jest zmierzonym progiem.

## Dane i reprodukcja

Pełne pary 28/1008/64/224: wyniki_v27/full-plans.jsonl.br. Brotli jest obsługiwane przez standardowe node:zlib.

```sh
node narzedzia/read_plans_v27.mjs wyniki_v27/full-plans.jsonl.br frozen1008 887 > plan887.json
node narzedzia/create_holdout_v27.mjs /tmp/holdout-reproduction
cmp dane/holdout224.json /tmp/holdout-reproduction/holdout224.json
```
JSON/CSV każdej pary są w 03_BENCHMARK_1008_V26_V27.*, pełne metryki w benchmark_v27.json, profile w przyklady_v27. Nie ma wielkich kopii dawnych ZIP-ów; są wszystkie potrzebne historyczne źródła i wejścia, referencja czystego V26 7bf1f87aca375baeac3869dfaccf6817ce782a22, jego hashe i świeży baseline. SHA256SUMS weryfikuje zawartość paczki przed uruchomieniem testów zapisujących nowe wyniki.

## Wynik i granice

1796 PASS / 0 FAIL, sweep 9408 scenariuszy, 0 krytycznych naruszeń. 1008 / 23.0.0: **7.446663 → 7.492178**, poprawy/remisy/obniżenia **532/226/250**.

1008 / 25.0.0: **9.190389 → 9.315776**, +/=/- 667/256/85.

1008 / audyt 27.0.0: 7.363991 → 7.419161, +/=/- 409/362/237. To wewnętrzne heurystyki, bez walidacji efektów sportowych lub klinicznej.

Nie osiągnięto średniej 7,70 ani aspiracyjnej 7,90. Końcowy wynik to 7.492178. Historyczny wynik nie jest miarą efektu sportowego.

Wewnętrzne kryterium rzeczywistych zmian (zmiana jednostek, wyższy audyt i poprawa jakości/specyfiki/periodyzacji/regeneracji bez krytycznych błędów) wskazało 233/1008, a cel wynosił 300. Nie utożsamiamy 532 wyższych ocen historycznych z tyloma udowodnionymi poprawami treningowymi.

Na starszym holdoucie 64 wynik V23: 7.296547 → 7.280078; nie ukrywamy spadku. Nowy 224: 7.125232 → 7.172696. Historycznych obniżeń względem V23 pozostało 120, w V26 było 88. Wszystkie niższe oceny i nierozstrzygnięte przypadki są zapisane.

Nie przeprowadzono zewnętrznej oceny trenerów, badań wyników ani pomiaru urazowości. Audyt 27 jest wewnętrzną, niezależną implementacją, a nie zewnętrzną walidacją. Progi dawki, snu, odciążeń i gotowości są heurystyczne; żadna reguła procentowa nie gwarantuje bezpieczeństwa.

Przy 1–2 dniach i krótkim przygotowaniu maraton może być niewykonalny. Poprawny plan alternatywny nie potwierdza ukończenia ani czasu. Deklarowany PB i zaplanowany kilometraż nie są świeżym pomiarem ani wykonaniem.

Nowy rdzeń projektuje fazy i trajektorie przed tygodniami, ale zachowuje sprawdzony alokator, limity i mechanizmy naprawcze V26. To ograniczony planer, nie globalne optimum sezonu; cele jakości są wskazówką ograniczoną receptą i budżetem, a nie wymuszoną dawką. Wiele elementów monolitu pozostało dla zgodności. Dane sezonowe i warunkowe kolejne kroki zwiększają rozmiar wyniku.
