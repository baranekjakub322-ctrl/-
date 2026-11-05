# Walidacja V29

Stan gotowości technicznej: PASS. Node v24.19.0. Bazowy commit V28: 5ca57498a462007f46655982e2aaebdf5bcdc84c.

Pełny przebieg: 11/11 etapów, 0 FAIL. Jawnie policzone sprawdzenia: 4011 PASS / 0 FAIL (wykonania testów; powtarzane historyczne zestawy nie są unikalnymi nowymi testami). Benchmark 1324 par; 0 krytycznych przypadków. Pełne 17 etapów V28 wykonano rzeczywiście w tej sesji przed ostatnią poprawką wyłącznie V29; wynik dla niezmienionych źródeł/danych może być jawnie ponownie zweryfikowany przez cache-scope.json (tryb w tabeli). Kontrakty ogólne uruchomiono także z GEN=planGenerator_v29.js.

| Etap | Kod wyjścia | Sekundy | Tryb |
| :--- | :--- | :--- | :--- |
| historical_v28 | 0 | 0.000 | verified_reuse_of_completed_17_stage_V28_run |
| contracts_v29 | 0 | 621.500 | wykonany w bieżącym przebiegu |
| stage_a_v29 | 0 | 2.784 | wykonany w bieżącym przebiegu |
| stage_b_v29 | 0 | 7.053 | wykonany w bieżącym przebiegu |
| stage_c_v29 | 0 | 3.401 | wykonany w bieżącym przebiegu |
| adaptacja_v29 | 0 | 14.090 | wykonany w bieżącym przebiegu |
| chronologia_v29 | 0 | 5.662 | wykonany w bieżącym przebiegu |
| historie_v29 | 0 | 125.713 | wykonany w bieżącym przebiegu |
| benchmark_v29 | 0 | 109.628 | wykonany w bieżącym przebiegu |
| audit18_v29 | 0 | 2.312 | wykonany w bieżącym przebiegu |
| wydajnosc_v29 | 0 | 7.039 | wykonany w bieżącym przebiegu |


Główny generator: 2651 linii. Wszystkie moduły produkcyjne V29 z używanym wspólnym training.mjs: 3862 linii, 397312 bajtów. Historyczne silniki, testy, dane i audyty benchmarkowe nie są w tym liczone; eksportowane w API scorery 23/25 są wliczone.

| Moduł | Linie | Bajty |
| :--- | :--- | :--- |
| planGenerator_v29.js | 2651 | 258216 |
| model/training.mjs | 69 | 4220 |
| model/activity_v29.mjs | 123 | 12024 |
| model/adaptation_v29.mjs | 82 | 12301 |
| model/constraints_v29.mjs | 103 | 11650 |
| model/dose_v29.mjs | 60 | 6155 |
| model/frequency_v29.mjs | 63 | 7117 |
| model/ledger_v29.mjs | 21 | 2526 |
| model/planning_v29.mjs | 53 | 5470 |
| model/policy_v29.mjs | 106 | 9338 |
| model/profile_v29.mjs | 44 | 6344 |
| model/quality_v29.mjs | 76 | 10308 |
| model/readiness_v29.mjs | 28 | 5299 |
| model/season_v29.mjs | 58 | 6797 |
| model/units_v29.mjs | 25 | 2252 |
| scoring/v23.mjs | 134 | 15652 |
| scoring/v25.mjs | 166 | 21643 |


Odtwarzanie: npm test, następnie npm run report. Pełne dane i hashe: wyniki_v29/run_v29.json, podsumowanie_v29.json oraz benchmark_v29.json. Źródła i wejścia były haszowane przed/po ukończonym przebiegu; nieedytowane w trakcie. Wcześniejszy przebieg przerwano po odtworzeniu dwóch dodatkowych błędów struktury/czasu odcinka; nie jest liczony jako PASS. Drugi roboczy przebieg wykazał brak dwóch historycznych plików SHA; uzupełniono oryginały V28 i powtórzono pełne testy (PRZEBIEG_PRZERWANY.json).

W nowej kopii 140 testów adaptacji dobra realizacja ma jawne fatigue:2. Oryginalne testy pozostały bez zmian i działają na V28. Brak fatigue/RPE/struktury testowany oddzielnie jako brak dowodu, a nie potwierdzenie poprawy. Nie osłabiono historycznych scorerów. Zmiana wymogu dowodowego obniża dopuszczalny wzrost VDOT po jednym teście z 0,5% do 0%; pogorszenie uwzględniane od razu.

Rozwojowy FAIL niezmienionego testu czułości zachowano w development_failures; powiązanie ciągłej luki z fazą bazową naprawiło przyczynę, a ten sam zestaw ponownie przeszedł 28/28. Pierwszy pełny benchmark V29 wykazał dwa krytyczne zawyżenia gotowości oraz niższe średnie; zapisano je w development_failures/benchmark_before_readiness_specific.json. Poprawiono komunikat gotowości bez dokładania km oraz parametryzację początkowej pracy specyficznej według treści planów, nie punktacji. Niedokończoną część V29 przerwano również po odtworzeniu błędu odpoczynku po wykonanym akcencie; po poprawce testy V29 ponowiono.

Wynik techniczny nie jest oceną skuteczności fizjologicznej ani kliniczną walidacją. Audyt treści jest wewnętrzny, wykonany przez ten sam system.

## Wydajność

| Silnik | Generacje | Średnia ms | Mediana ms | p95 ms | Maks RSS MiB |
| :--- | :--- | :--- | :--- | :--- | :--- |
| v28 | 84 | 20.487 | 14.260 | 55.954 | 186.176 |
| v29 | 84 | 55.304 | 37.511 | 149.845 | 313.852 |

Stosunek średnich V29/V28: 2.700. Osobne świeże procesy, identyczne wejścia, jedno środowisko; RSS obejmuje Node/JIT/dane. To pomiar, nie obietnica czasu dla każdego profilu.

## Kontrola szerokiej macierzy i interpretacja

Macierz GEN=V29: 9408 scenariuszy, 0 FAIL, 0 krytycznych naruszeń, 112 ostrzeżeń heurystycznych. To odrębne liczby od sprawdzeń PASS i 1324 par benchmarku. Pełny zapis: wyniki_v29/contracts_v29/sweep.json.

Wynik techniczny jest dodatni, ale nie potwierdzono ogólnej przewagi treningowej nad V28. W score23 średnia zmienia się z 7.547 do 7.135; 585 z 1008 ocen jest niższych. Score25: 9.326 → 9.269. Audyt28: 7.884 → 7.905; różnica jest heurystyczna i nie dowodzi skuteczności. Nie zmieniono żadnego scorera.

Źródła V29 odpowiadają commitowi 20de645; szczegółową tożsamość wszystkich plików testowych/produkcyjnych podaje run_v29.json i manifest_produkcji_v29.sha256. Artefakt ma dodatkową kontrolę aktualności źródeł przed pakowaniem.
