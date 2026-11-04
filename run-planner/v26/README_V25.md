# Run Planner V25

Generator JavaScript/ESM rozwinięty z V24. Bez UI i zależności npm. Node.js ≥18; wykonane uruchomienia: Node v24.19.0. Kod nie kwalifikuje medycznie do zawodów i nie traktuje planu jako wykonanego treningu.

## Uruchomienie

Po rozpakowaniu ZIP przejdź do `RunPlanner_V25/`. W repozytorium: `run-planner/v25/`.

```sh
node --version
npm test                 # pełne 28 zestawów, historia, sweep, oba mierniki, adaptacja
npm run test:v25         # nowe testy ogólne i metamorfczne
npm run test:adaptation  # 128 scenariuszy adaptacji oraz kontrole dziennika/trendu
npm run compare          # dokładnie 28 i 1008 bazowych wejść, 30 pełnych profili
npm run benchmark        # osobna kalibracja V25
npm run diagnosis        # odtwarza wszystkie 89 obniżeń V24/V23
npm run report           # raporty tylko po kompletnym zaliczonym npm test
python3 testy/pakuj_v25.py /wybrana/sciezka/RunPlanner_V25.zip
```

Nie potrzeba `npm install`. Pakowanie wymaga Python 3. Wyniki: `wyniki_v25/`; `WYNIKI=/inna/sciezka` zmienia katalog. `TESTS_ONLY_LIGHT=1 npm test` uruchamia tylko test podstawowy i nie zastępuje pełnej walidacji. W chmurze ograniczenia tworzenia procesów mogą wymagać dostępnego trybu wykonania z procesami potomnymi Node; EPERM nie jest wynikiem PASS.

## Podstawowe API

```js
import { generatePlan, updatePlan, scoreV23, scoreV25 } from './planGenerator_v25.js';
const input = {
  today: '2026-11-02', age: 35, level: 'intermediate',
  currentWeeklyKm: 35, longestRecentRun: 14,
  bestResult: { distanceKm: 10, timeSec: 3120 },
  goal: { type: '10k', targetTimeSec: 3214, raceDate: '2027-03-28' },
  daysPerWeek: 3, availableDays: [0,1,2,3,4,5,6],
  experienceMonths: 24,
};
const plan = generatePlan(input);
if (!plan.ok) console.error(plan.bledy);
else {
  console.log(plan.plan, plan.wykonalnosc, plan.readinessEvidence);
  console.log(scoreV23(input, plan), scoreV25(input, plan));
}
```

Zachowano eksporty i dotychczasowe dane wejściowe V24. `wersja` wynosi `25.0`. Daty są kalendarzowe `YYYY-MM-DD`, dni 0=niedziela … 6=sobota, km w kilometrach, wyniki i cel w sekundach, czas treningu w minutach. Cel `5k/10k/half/marathon/health`; poziom `beginner/intermediate/advanced`. Bez zawodów można podać `weeks` 4–52. Dotychczasowe pola opisują zachowane `README_V24.md` i `README_V23.md`.

## Plan, wykonanie i dowody

| Pole wyjścia | Znaczenie |
|---|---|
| `treningi`, `plannedWorkouts` | ten sam harmonogram planowanych jednostek; status planned |
| `completedHistory` | aktywne wykonane/skrócone obserwacje, nigdy kilometraż skopiowany z harmonogramu |
| `observedActivities` | wszystkie aktywne obserwacje, także pominięcia i komunikaty o objawach |
| `adaptationDecisions` | decyzje i powody kolejnych rewizji |
| `readinessEvidence` | wykonane tygodnie, regularność, najdłuższy bieg, bramki, pewność i status danych |
| `rejestrJakosci` | dawka, odcinki, przerwy, cel, obciążenie, faza, powód i status planned |
| `ocenaWykonalnosci` | możliwość/warunkowość celu, oddzielona od jakości algorytmu |
| `adaptacja.activityStore` | oryginał i aktywna wersja wpisu, status anulowania, wersja |
| `adaptacja.activityAudit` | operacje z before/after, kolejnością i powodem; oryginały nie są nadpisywane |
| `adaptacja.pastPlan` | dawny zaplanowany harmonogram, nie dowód wykonania |

Gotowość: `potwierdzona_danymi`, `szacowana`, `niepotwierdzona`, `cel_niewykonalny`. Potwierdzenie dotyczy orientacyjnych kryteriów treningowych na podstawie dostarczonych danych, nie dopuszczenia medycznego. Maraton ma etapy od oceny początkowej i regularności po specyfikę, taper oraz regenerację. Planowana faza nie jest oznaczana jako osiągnięta.

Opcjonalne `completedHistory` na wejściu generatora może zawierać wykonanie. `executionObservations` przenosi pełną listę stanów wykonania, także missed i komunikaty o objawach. Jeśli podasz obie listy, wykonane aktywności muszą być spójne. Bezpośrednie generatePlan respektuje ból/uraz z tej historii tak samo jak updatePlan; pełne okno ogranicza początkową bazę rzeczywistym wykonaniem. `executionCoverage: {completeWindow:true, coverageFrom:'2026-12-01'}` oznacza jawnie kompletny zakres wykonania. Sam brak wpisu w niepełnej historii nie oznacza zera. Do potwierdzenia bramek maratońskich potrzebne jest pełne okno co najmniej 28 dni i rzeczywiste kryteria regularności/objętości/długiego biegu. Dane `recentWeeklyKm` pozostają deklarowaną historią tygodniową; nie są automatycznie wykonanymi jednostkami.

## Aktywności, korekty i strefy czasowe

```js
const updated = updatePlan(input, plan, [{
  id: 'run-001', date: '2027-01-06', status: 'done',
  distanceKm: 7, durationMin: 45, rpe: 6, fatigue: 2,
  sessionType: 'easy',
}], { today: '2027-01-10', availableDays: [1,3,6] });
const corrected = updatePlan(input, updated, [{
  id: 'run-001', op: 'correct', changes: { distanceKm: 6.8, rpe: 5 },
  reason: 'Korekta błędnego zapisu zegarka',
}], { today: '2027-01-10' });
const cancelled = updatePlan(input, corrected, [{
  id: 'run-001', op: 'cancel', reason: 'Duplikat aktywności',
}], { today: '2027-01-10' });
```

Dostępne operacje: domyślne `add`, `correct` z `changes`, `cancel`, `restore`. Korekta nie zmienia `id`. W jednej partii id występuje raz; kolejne operacje na tym samym id wykonuj osobnymi wywołaniami. changes zastępuje wskazane pola; obiekt testResult podaj w całości. Zwykły import istniejącego identycznego wpisu jest idempotentny; konflikt wymaga jawnej korekty. Import anulowanego wpisu nie przywraca go samoczynnie. Dwa biegi jednego dnia wymagają różnych id lub odrębnych identyfikatorów importu.

Tożsamość: jawne `id`; inaczej para `source/externalId`; inaczej `source/startedAt` jako moment UTC. Stary wpis bez tych danych ma klucz `legacy:data` i zachowuje ograniczenie jednej nieoznaczonej obserwacji na dzień. Do niezawodnego importu i korekt używaj id lub externalId. Odcisk fingerprint jest diagnostyczny, nie jedyną podstawą deduplikacji.

```js
const activity = {
  source: 'watch', externalId: 'session-42',
  startedAt: '2027-01-06T23:30:00Z', timeZone: 'Europe/Warsaw',
  status: 'done', distanceKm: 7, durationMin: 45,
};
```

`startedAt` wymaga offsetu albo Z. Data lokalna powyższego wpisu to 2027-01-07. IANA timeZone jest walidowana. Ponowny import tego samego momentu/identyfikatora w innym zapisie strefowym nie tworzy nowej aktywności ani nie przesuwa cicho zapisanej daty. Zmianę lokalnego dnia wykonaj jawnie przez korektę startedAt/timeZone; przy wpisie wyłącznie kalendarzowym koryguj date. Surowy oryginał pozostaje w audycie. Sprzeczne objawy tego samego dnia bez godzin są traktowane ostrożnie, niezależnie od kolejności id. Znany czas pozwala ustalić kolejność; korekta błędnego wpisu jest zawsze jawna.

Obserwacje done/shortened wymagają distanceKm i durationMin. Opcjonalnie rpe 1–10, fatigue 1–5, pain 0–10, activeInjury, reducedIntensity, testResult `{distanceKm,timeSec}`, sessionType `easy/long/threshold/interval/race/test/recovery`. Trend RPE jest porównywany w podobnych wykonanych sesjach, nie między dowolnym biegiem łatwym a interwałem.

## Reguły adaptacji

Opcje: today, availableDays, daysPerWeek, raceDate, missedDays, reducedIntensity, timeZone, completeWindow, coverageFrom. Kolejne wywołanie może używać pierwotnego wejścia lub ostatniego inputUsed; dziennik zachowuje bazę i ostatni kalendarz. Identyczne dane tego samego dnia nie tworzą nowej rewizji. Nowy dzień może zmieniać plan z powodu terminu startu i starzenia się obserwacji.

- Brak nadrabiania pominiętych jednostek.
- Zmęczenie, rosnące RPE i skracanie ograniczają jakość/objętość.
- Jeden dobry test: najwyżej +0,5% bazowego VDOT; kilka zgodnych porównywalnych ekspozycji z regularnością, regeneracją i odstępem ≥7 dni: do +2%. Brak automatycznego przyspieszania z tygodnia na tydzień.
- Pogorszenie formy jest uwzględniane od razu. Korekta/anulowanie testu ponownie przelicza trend z aktywnych danych.
- Pełne okno nie przedłuża się automatycznie na dni bez nowej deklaracji kompletności. Przy niepełnej historii nie wraca się automatycznie do dawnego wysokiego kilometrażu.
- Ból/uraz wstrzymuje harmonogram; zapis jest zachowany. Jawne ustąpienie objawów lub korekta błędnego zgłoszenia pozwala przeliczyć ostrożną przyszłość, bez stwierdzania gotowości medycznej.
- Wykonany dzisiejszy trening nie jest planowany ponownie. Zmiana daty zawodów przebudowuje przyszły taper, a dostępności usuwa stare niedostępne preferencje.

## Żywienie i warunki

Opcjonalne `nutrition: {giTolerance:'unknown/good/sensitive', practicedRuns:3, carbsGramsPerHour:45}` zmienia ostrożne wskazówki na długie wysiłki. `conditions: {temperatureC:28, humidityPct:60, elevationGainM:500, terrain:'flat/rolling/hilly/trail'}` pozwala uwzględnić kontekst w zaleceniach. Nie pobieramy pogody i nie wymyślamy jej dla przyszłych tygodni.

`zaleceniaZywieniowe` oraz `warunki` są oddzielone od recepty treningowej. Bez danych indywidualnych `paceCorrectionSeconds` pozostaje null. Upał/przewyższenia oznaczają kontrolę RPE i możliwość skrócenia/przełożenia, a nie fałszywie dokładną korektę sekund/km. Parametry warunków są kontekstem dostarczonym przez użytkownika, nie prognozą na cały sezon.

## Raporty i archiwum

Wyniki i 12 wymaganych raportów są w katalogu głównym:

- README_V25.md, ZMIANY_V24_V25.md i DIAGNOZA_89_REGRESJI_V24.md;
- BENCHMARK_28_V24_V25.md i BENCHMARK_1008_V24_V25.md;
- ANALIZA_10KM_3DNI_V25.md i ANALIZA_MARATON_V25.md;
- RAPORT_ADAPTACJI_V25.md i SYSTEM_OCENIANIA_V25.md;
- RAPORT_TESTOW_V25.md, OGRANICZENIA_V25.md i REKOMENDACJE_V26.md.

Pełne plany i dane są w przyklady_v25 oraz wyniki_v25; pełne plany w przyklady_v25. `przyklady_v25/OCENA_WEWNETRZNA_30_PLANOW.md` jest przeglądem tego samego systemu, nie zewnętrznym audytem trenerskim.

Baza V24: commit `91949a0e96ee83fdde8e540865b8579c8baff4d5`, baseline/RunPlanner_V24.zip, baseline/v24-source.sha256 i wyniki_bazowe_v24. Pliki *_v24 i scoring/v23.mjs pozostały niezmienione. Bieżący manifest to manifest_v25.sha256; historyczne manifesty dotyczą odpowiednich archiwów. Starsze raporty i wyniki mają nazwy historycznych wersji i nie zastępują aktualnego RAPORT_TESTOW_V25.md.
