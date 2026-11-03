# Run Planner V24

Deterministyczny generator JavaScript/ESM rozwinięty z V23, bez interfejsu i zależności npm. Node.js ≥18; sprawdzony na Node v24.19.0. Generowanie planu nie stanowi kwalifikacji do zawodów: czytaj `wykonalnosc`, `gotowosc`, ostrzeżenia i dane o faktycznej częstotliwości.

## Uruchomienie

Po rozpakowaniu przejdź do `RunPlanner_V24/`. W GitHub: `run-planner/v24/`.

```sh
node --version
npm test             # wszystkie 21 zestawów, 9408 sweep, historia i porównania
npm run test:v24     # nowe zachowania i 128 przypadków stresowych
npm run compare      # dokładnie bazowe 28 + 1008 wejść, szczegółowe profile
npm run benchmark    # niezmieniona kalibracja miernika V23
npm run diagnosis    # odtwarza diagnozę wszystkich 330 regresji V23/V22
npm run report       # wymagane raporty, tylko po pełnym zaliczonym npm test
python3 testy/pakuj_v24.py /wybrana/sciezka/RunPlanner_V24.zip
```

Pakowanie wymaga Python 3 i istniejącego katalogu docelowego; skrypt sprawdza kompletność, hashe, CRC ZIP oraz manifest każdej pozycji. Nie potrzeba `npm install`. `WYNIKI=wyniki_v24` jest domyślnym katalogiem pełnego runnera. `TESTS_ONLY_LIGHT=1 npm test` uruchamia wyłącznie podstawowy zestaw; nie uprawnia do oznaczenia całej wersji jako przetestowanej. Błędy procesu oraz zmiana źródeł w trakcie testu powodują FAIL. Wszystkie polecenia uruchamiaj w katalogu generatora.

## API

```js
import { generatePlan, updatePlan } from './planGenerator_v24.js';
const input = {
  today: '2026-11-02', age: 35, level: 'intermediate',
  currentWeeklyKm: 35, longestRecentRun: 14,
  bestResult: { distanceKm: 10, timeSec: 3120 },
  goal: { type: '10k', raceDate: '2027-03-28', targetTimeSec: 3214 },
  daysPerWeek: 3, availableDays: [0,1,2,3,4,5,6],
};
const plan = generatePlan(input);
if (!plan.ok) console.error(plan.bledy);
else console.log(plan.plan, plan.wykonalnosc, plan.treningi);
const changed = updatePlan(input, plan, [{
  date: '2027-01-06', status: 'shortened', distanceKm: 5, durationMin: 35,
  rpe: 9, fatigue: 4, reducedIntensity: true,
}], { today: '2027-01-10', availableDays: [1,3,6], raceDate: '2027-04-04' });
if (changed.ok) console.log(changed.adaptacja.history);
```

Zachowano wszystkie eksporty V23 i V22, strukturę wejścia i wersjonowanie wyjścia `24.0`. Nie ma migracji obowiązkowych pól. Daty UTC `YYYY-MM-DD`; 0=niedziela, 1=poniedziałek … 6=sobota. Dystanse km, wyniki i cel sekundami, czas treningu minutami. Poziomy `beginner/intermediate/advanced`; cele `5k/10k/half/marathon/health`. Bez daty startu podaj `weeks` 4–52. Dostępność nie oznacza obowiązku biegu każdego dnia. Zawody są osobnym `plan.start` i częścią sum tygodniowych, nie są drugi raz kopiowane do `treningi`.

## Parametry i indywidualizacja

Dotychczasowe pola opisuje zachowany `README_V23.md`. Ważne opcjonalne pola:

| Pole | Znaczenie i wpływ |
|---|---|
| `experienceMonths` | staż 0–900 miesięcy; krótki staż ogranicza szczyt/progresję i jakość |
| `recentWeeklyKm` | 2–12 ukończonych tygodni od najstarszego, w tym zera; baza nie przekracza średniej i ostatnich dwóch tygodni |
| `breakDays` | długość przerwy; redukcja bazy i ostrożny powrót |
| `loadTolerance` | dotychczasowa tolerancja objętości: low/normal/high |
| `volumeTolerance` | opcjonalny jawny odpowiednik loadTolerance; jeśli podany, ma pierwszeństwo |
| `intensityTolerance` | low/normal/high; low zmniejsza dawki/ogranicza częstość jakości i nie kompensuje tego większym szczytem km; high sam nie przyspiesza |
| `fatigue` | 1–5; ≥4 ogranicza objętość i wstrzymuje jakość w pierwszym tygodniu |
| `recoveryDays` | 2 lub 3 dni między trudnymi jednostkami, również przez granicę tygodnia |
| `preferredDays` | preferencje należące do availableDays; zwiększają wiarygodność wyboru dnia |
| `maxMinutesWeekday/Weekend` | rzeczywiste limity czasu; brak miejsca na pełny akcent oznacza jego pominięcie/zamianę |
| `longDistanceRaces` | liczba ukończonych długich startów; brak doświadczenia ogranicza zaufanie do przygotowania M |
| `pain/activeInjury/historiaKontuzji` | reakcja na ból/uraz/obciążenia; ból ≥4 lub aktywny uraz blokuje plan |
| `hrMaxSource` | measured/estimated/unknown; szacowane HR pozostaje pomocnicze |
| `goal.mode` | finish/time; finish usuwa presję tempa docelowego |

Efektywny poziom dawki jakości wymaga odpowiedniej bazy i wyniku/historii; nie wynika tylko z etykiety poziomu. Nie nadaje automatycznie gotowości maratońskiej.

## Adaptacja

`updatePlan(input, previousPlan, observations, options)` generuje przyszłą część. Zalecane przy kolejnej aktualizacji: poprzednie `adaptacja.inputUsed` oraz ostatni plan. Obserwacja ma datę, status done/missed/shortened; wykonana/skrócona jednostka wymaga distanceKm i durationMin. Opcjonalnie rpe 1–10, fatigue 1–5, pain 0–10, activeInjury, reducedIntensity i testResult `{distanceKm,timeSec}`. Dane z zegarka są obserwacją, nie dowodem pełnej regeneracji.

Opcje: today, availableDays, daysPerWeek, **raceDate**, **reducedIntensity**, missedDays, completeWindow, coverageFrom. Pełne okno oznacza zadeklarowaną kompletną historię ostatnich 14 dni; brak zapisu w niepełnym oknie nie oznacza zera. Zmiana daty przebudowuje przyszłe fazy/taper, także po starym terminie, jeśli nowy start jest w przyszłości. Ból/uraz wstrzymuje adaptację do jawnego potwierdzenia ustąpienia objawów. Brak nadrabiania pominiętych jednostek.

Historia obserwacji jest trwała, ponowne przesłanie tych samych danych nie podnosi tempa ponownie, a konflikt danych dla zapisanej daty jest odrzucany. `completedHistory` przechowuje wykonanie, `pastPlan` dawny harmonogram — zaplanowany trening nie jest uznawany automatycznie za wykonany. Zmiany mają revision, date i reasons. Trening wykonany dzisiaj nie jest planowany ponownie; nowa część rozpoczyna się jutro. Kolejna aktualizacja przyjmuje najnowsze zapisane parametry również wtedy, gdy klient poda pierwotne wejście. Zmiana dostępności usuwa wyłącznie stare preferencje spoza nowych dostępnych dni i zapisuje powód; nie odrzuca poprawnej zmiany kalendarza. Nowe rekordy korygują używany VDOT najwyżej o 2% na nowy test, bez automatycznego wzrostu za kalendarz.

## Pliki, oceny i archiwum

- Generator: planGenerator_v24.js; nowe polityki w model/*_v24.mjs.
- Rejestr retained jakości po korektach: rejestrJakosci. Nie podnosi oceny za samą obecność metadanych.
- Podstawowy miernik porównania: niezmieniony scoring/v23.mjs, wersja 23.0.0. Wagi/ograniczenia: SYSTEM_OCENIANIA_V23.md.
- Raporty aktualne: RAPORT_TESTOW_V24.md, POROWNANIE_V23_V24.md, BENCHMARK_28_V23_V24.md, BENCHMARK_1008_V23_V24.md.
- Diagnoza: DIAGNOZA_REGRESJI_V23.md i diagnostyka_v24/regresje_v23.json.
- Pełne plany/profil: przyklady_v24; surowe wyniki: wyniki_v24.
- Baza V23: niezmienione pliki *_v23, baseline/RunPlanner_V23.zip, v23-source.sha256; commit 97f40a2e9ad936682011f5585f3967d56f1b3934. Wyniki uruchomione przed zmianami: wyniki_bazowe_v23.
- Pozostałe dokumenty z nazwami v22/v23 są archiwalne. Nie zastępują raportu aktualnej wersji.

Heurystyczna ocena nie jest walidacją naukową lub gwarancją bezpieczeństwa. Technicznie poprawny plan może być niewystarczającym przygotowaniem do celu. Ograniczenia i pozostałe regresje przedstawiono jawnie w OGRANICZENIA_V24.md.
