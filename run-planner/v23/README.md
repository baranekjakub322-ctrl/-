# Run Planner V23

Silnik JavaScript/ESM rozwinięty z V22. Bez UI, strony WWW i zależności zewnętrznych. Wymagany Node.js ≥18; wykonane uruchomienia w tej sesji używały Node v24.19.0. Priorytet: odpowiedni bodziec, uczciwa ocena ograniczeń i bezpieczne reagowanie na dane z realizacji.

## Uruchomienie

Po rozpakowaniu ZIP przejdź do `v23/`. W repozytorium ten sam projekt znajduje się w `run-planner/v23/`.

```sh
npm test                  # wszystkie zestawy, pełny sweep, porównania historyczne i V22/V23
npm run test:v23          # nowe testy V23
npm run benchmark         # kontrolowane przykłady nowego miernika
npm run compare           # 28 wariantów + 1008 profili porównawczych + plany szczegółowe
npm run report            # raporty z aktualnie zapisanych, kompletnych wyników
```

Nie wykonuj `npm install` — nie ma pakietów do pobrania. Wyniki: `wyniki_v23/*.json` i logi. `WYNIKI=/inna/sciezka npm test` wybiera katalog wyników. `STOP_ON_FAIL=1` przerywa po awarii, `TESTS_ONLY_LIGHT=1` uruchamia tylko podstawowe testy; `EXTRA_TEST=/sciezka/test.mjs` służy m.in. testowi propagacji błędów. Wszystkie procesy muszą zakończyć się kodem 0; błędy, brak pliku, zmiana źródeł podczas uruchomienia lub EPERM środowiska nie są zaliczeniem. Świeże wyniki V22 i historia są oddzielone od wyników V23.

## Generowanie planu

```js
import { generatePlan } from './planGenerator_v23.js';
const input = {
  today: '2026-11-02', age: 35, level: 'intermediate',
  currentWeeklyKm: 35, longestRecentRun: 14,
  bestResult: { distanceKm: 10, timeSec: 3120, date: '2026-10-18' },
  goal: { type: '10k', raceDate: '2027-03-28', targetTimeSec: 3214 },
  availableDays: [0,1,2,3,4,5,6], daysPerWeek: 3,
  experienceMonths: 24, recentWeeklyKm: [31,33,35,35],
};
const plan = generatePlan(input);
if (!plan.ok) console.error(plan.bledy);
else console.log(plan.plan.intencjaTreningowa, plan.wykonalnosc, plan.treningi);
```

Zachowano wszystkie eksporty V22. Dodano `updatePlan` i `scoreV23`. Stare `replan`, `generateFromData`, `buildInput`, `auditPlan`, `repairPlan`, funkcje historii i fizjologii nadal istnieją. Nowe pola są opcjonalne. Wyjście zachowuje istniejącą strukturę, a `wersja` wynosi `23.0`.

### Jednostki i podstawowe dane

Daty są obliczane w UTC i mają format istniejącej daty `YYYY-MM-DD`. Dni: 0=niedziela … 6=sobota. Kilometry są w km, czas jednostki w minutach, wyniki i cel w sekundach. Poziomy: `beginner`, `intermediate`, `advanced`. Cele: `5k`, `10k`, `half`, `marathon`, `health`. Bez daty zawodów: całkowite `weeks` 4–52; z datą: do 730 dni. Wiek 14–90 lat jest obsługiwanym zakresem wejścia; automatyczny model nie kwalifikuje niepełnoletnich do HM/maratonu.

`ok:true` oznacza wygenerowanie planu, nie gotowość do zawodów. Czytaj `wykonalnosc`, `gotowosc`, `ocenaCelu`, `ostrzezenia`. W trybie zwykłym cel niewykonalny otrzymuje bezpieczniejszą alternatywę; `trybScisly:true` odmawia takiego celu. Aktywny uraz lub ból ≥4/10 blokuje generowanie także bez trybu ścisłego. Ból 3/10 wyłącza jakość i ogranicza wykonalność celu.

### Opcjonalna indywidualizacja

| Pole | Znaczenie |
|---|---|
| `recentWeeklyKm` | 2–12 ukończonych tygodni od najstarszego; zera są ważne. Baza nie przekracza deklaracji, średniej i średniej ostatnich dwóch tygodni. |
| `experienceMonths` | Staż 0–900 miesięcy. <3: bez jakości; <6: niższy dopuszczalny rozwój objętości. |
| `loadTolerance` | `low`, `normal`, `high`; niska nie oznacza niższego poziomu sportowego. Wysoka nie podnosi rampy bez co najmniej 4 tygodni historii i 12 miesięcy stażu. |
| `recoveryDays` | 2 lub 3 dni odstępu między mocnymi jednostkami, kontrolowane także na granicy tygodni. |
| `preferredDays` | Preferencje będące podzbiorem `availableDays`; wpływają na wybór dni, nie pozwalają wychodzić poza dostępność. |
| `longRunDow` | Dotychczasowa preferencja dnia długiego biegu. |
| `longDistanceRaces` | Liczba wcześniejszych startów długodystansowych 0–1000; deklaracja doświadczenia, nie automatyczny dowód tolerancji. |
| `hrMaxSource` | `measured`, `estimated`, `unknown`. Samo podanie HRmax nie jest deklaracją pomiaru. |
| `goal.mode` | `finish` usuwa presję celu czasowego; `time` lub brak pola zachowuje czas. Utrzymanie/poprawa są dodatkowo wywnioskowane z bieżącego wyniku. |
| `qualityNotBefore` | Najwcześniejsza data jakości, używana m.in. przez adaptację po zmęczeniu. |
| `pain`, `activeInjury`, `injuries`, `historiaKontuzji`, `breakDays` | Dolegliwości, uraz, ograniczenia, historia przeciążeń i przerwa. Zakres bólu 0–10; aktywny uraz nie jest jedynie powodem kosmetycznej zmiany tempa. |
| `maxMinutes`, `maxMinutesWeekday`, `maxMinutesWeekend`, `maxLongMinutes` | Dotychczasowe ograniczenia czasu dnia i długiego biegu. |

Nowe liczby podawaj jako liczby, flagi jako wartości logiczne. `bestResult` i `records` zachowują format V22. Wyniki z przyszłości/błędną datą są błędem, a stare nie wyznaczają agresywnej intensywności. Bez wyniku RPE i test rozmowy mają pierwszeństwo przed orientacyjnymi zakresami tempa.

## Najważniejsze zachowania

Przygotowany biegacz może otrzymać krótki bodziec progowy już w drugim tygodniu. Początkujący, osoba po dłuższej przerwie, z niskim kilometrażem/stażem lub niską tolerancją nadal zaczyna od bazy. Faza specyficzna ma osobny, wyraźny odcinek cyklu. Utrzymanie aktualnej formy nie wymaga sztucznego zwiększania km.

Interwały i tempo mają progresję dawki części głównej, okresy powtórzenia/stabilizacji oraz limity realnego budżetu. Pominięty lub zamieniony akcent nie przesuwa licznika do trudniejszej recepty. Nie przyspiesza się automatycznie temp tylko dlatego, że upłynął tydzień. Przebieżki są swobodne, nie sprintem. Długi bieg nie staje się drugim akcentem dla profilu 10 km / 3 dni z celem utrzymania.

Jeden bieg to własna spokojna recepta podtrzymania; przy dodatkowych ćwiczeniach zachowano wspólny mechanizm planowania uzupełniającego. Dwa biegi to rotacja z ograniczoną jakością, nie zestaw dwóch wymagających jednostek. Przy maratonie 1–2 dni oznaczają alternatywę budowania bazy, nie pełne przygotowanie. Udział długiego jest sprawdzany po wszystkich korektach tygodnia; odciążenie nie wraca do dawnego, większego dystansu po skróceniu rzeczywistego biegu.

Model maratonu rozróżnia bazę deklarowaną/udokumentowaną, ukończenie i wynik. Zachowuje bazę → budowanie → specyfikę → taper, spokojny długi bieg, ostrożny czas 180 min dla początkującego lub 195 min dla pozostałych oraz stopniowe odcinki MP. Na długich biegach ćwiczy się tolerowane żywienie i nawodnienie. Dane o doświadczeniu nie znoszą ograniczeń obciążenia.

Zawody są liczone do limitu jednostek i km tygodnia. Zwykła lista `treningi` nie zawiera drugiej kopii startu docelowego: start jest w `plan.start` i `tygodnie[].start`. `tygodnie[].km` zawiera go raz. `obciazenieTreningow` i `obciazenieZawodowSzacunkowe` są osobne; ich suma to `obciazenieSzacunkowe`. Obciążenie zawodów jest jawnie szacowane z czasu planu i RPE, a nie przedstawiane jako pomiar. Migracja: odpowiednikiem dawnego obciążenia samych treningów jest `obciazenieTreningow`; nowe `obciazenieSzacunkowe` zawiera również jawnie wyodrębniony start. Przy maksymalnie 4 dniach domyślnie nie wymusza się truchtu dzień przed startem; `dzienPrzedStartem:'trucht'` jest obsługiwany w limicie jednostek.

`plan.czestotliwosc` zawiera dokładne liczby i `powodyOgraniczenia`. Dostępność, limit poziomu oraz budżet objętości/czasu są rozdzielone; nie nazywa się limitu poziomu brakiem dostępności. Przy 6–7 deklarowanych dniach nadal może być mniej biegów. To jawny wynik modelu, nie obietnica biegania codziennie.

## Działająca adaptacja

```js
import { updatePlan } from './planGenerator_v23.js';
const changed = updatePlan(input, plan, [
  { date:'2027-01-03', status:'shortened', distanceKm:5, durationMin:35, rpe:9, fatigue:4 },
  { date:'2027-01-06', status:'done', distanceKm:6, durationMin:40, rpe:9, fatigue:4 },
], { today:'2027-01-10', availableDays:[1,3,6] });
```

Obserwacje: `date`, `status: done|missed|shortened`, dla wykonanych/skróconych: `distanceKm`, `durationMin`; opcjonalnie `rpe` 1–10, `fatigue` 1–5, `pain` 0–10, `activeInjury` boolean, `testResult:{distanceKm,timeSec}`. Daty nie mogą być przyszłe, duplikaty są odrzucane. Ból/uraz pozostaje blokadą, jeśli brak nowszego zgłoszenia wskazującego jego ustąpienie; nie wygasa automatycznie po 14 dniach.

Opcje: `today`, `availableDays`, `daysPerWeek`, `missedDays`; `completeWindow:true` wymaga `coverageFrom` co najmniej 14 dni wcześniej. Tylko przy potwierdzonym pełnym oknie wolno uznać brak treningu za zero; skąpe obserwacje nie udają kompletnej historii. Baza po przerwie nie wraca do dawnego poziomu bez danych o odbudowie. Zmęczenie, wysoki RPE i powtarzane skracanie/pomijanie obniżają obciążenie. Nie nadrabia się opuszczonych jednostek. Nowy test zmienia intensywność, lecz jednorazowa poprawa jest ograniczona do 2% VDOT; gorszy wynik nie jest ignorowany.

Przyszłe treningi są generowane od daty aktualizacji; `adaptacja.pastPlan` zachowuje wcześniejszy harmonogram, `observations` opisuje realizację, a `history` zawiera kolejne rewizje i przyczyny. Przy kolejnym wywołaniu przekazuj `changed.adaptacja.inputUsed` i `changed`. Brak danych o zdrowiu nie jest diagnostyką. Po zawodach wybierz nowy cel i zastosuj `regeneracjaPoStarcie`; adapter nie rozciąga automatycznie starego celu po jego terminie.

## Oceny i raporty

`scoring/v23.mjs` to niezależny, wersjonowany miernik. Można użyć `scoreV23(input, result)` eksportowanego z generatora albo `evaluatePlan` bezpośrednio z modułu. Generator nie wywołuje miernika, aby sam siebie nagradzać. Stare `score()`, `scoreV21()` i miernik V22 pozostały w `testy/lib.mjs` i `testy/miernik_v22.mjs` z niezmienionymi regułami.

Opis: `SYSTEM_OCENIANIA_V23.md`. Wyniki: `raport_testow_v23.md`, `porownanie_v22_v23.md`, `macierz_28_v22_v23.md`, `analiza_10k_3dni_v23.md`, `benchmark_v23.md`. Pełne plany: `przyklady_v23/*.json`. Przeczytaj `ZNANE_OGRANICZENIA_V23.md` przed interpretowaniem punktacji.

Baza V22: niezmienione `planGenerator_v22.js` i `model/training.mjs`, pełny oryginalny ZIP w `baseline/RunPlanner_V22.zip`, nowe uruchomienie w `wyniki_bazowe_v22`. Raporty V20/V21/V22 oraz `wyniki`, `wyniki_v22` są historyczne i nie są wynikami V23. Repozytorium zawierało V22 jako ZIP na gałęzi `runplanner-v22-download` (commit `79cd501de312251eff97a6a739acf050798385aa`); V23 dodaje także rozpakowane źródła i testy.

Niepełny pierwszy tydzień kalendarzowy nie jest traktowany jako dowód niższej zwyczajowej częstotliwości. Dzięki temu rzeczywista baza i odniesienie taperu nie są zaniżane wyłącznie przez rozpoczęcie planu w sobotę lub niedzielę.
