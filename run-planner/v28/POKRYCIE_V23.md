# Pokrycie zadania V23

| Wymagania | Realizacja i dowód |
|---|---|
| 1–3, analiza i baza | Zachowany pełny ZIP V22; 14 zestawów uruchomionych przed zmianami; wyniki w `wyniki_bazowe_v22`; hipotezy sprawdzone na rzeczywistym profilu 10 km / 3 dni. |
| 4, 1–2 treningi | Własna spokojna recepta jednego biegu, rotacja dwóch, udział długiego po korektach, statusy ograniczonej/niewykonalnej gotowości; macierz 28 i pełny sweep. |
| 5, maraton | Zachowana i rozwinięta periodyzacja V22, progresja MP, historia i doświadczenie, spokojny długi z limitem czasu, żywienie i taper. Profile pełnej i ograniczonej bazy. |
| 6, progresja jakości | `model/quality_v23.mjs`, liczniki zachowanych jednostek, stabilizacja, stała aktualna prędkość; testy recept i rzeczywiste tabele interwałów/progu. |
| 7, indywidualizacja | Historia 2–12 tygodni, staż, wiek, km, wynik, preferencje, tolerancja, przerwa/uraz; metamorfczne sprawdzenie historii oraz tolerancji. |
| 8, intensywności | Aktualna forma, brak przyspieszania na kredyt, oddzielenie celu fizjologicznego/RPE/tempa/źródła HR; test źródła HR i aktualizacji tempa. |
| 9, adaptacja | `updatePlan` i `model/adaptation_v23.mjs`; realne korekty po wykonaniu, pominięciu, skróceniu, RPE/zmęczeniu, teście, zmianie dni i bólu; dziennik, brak nadrabiania, testy błędnych danych. |
| 10, fazy | Jawne `periodyzacja`, krótsza neutralna baza dla przygotowanego, ostrożny start u początkujących, specyfika i taper; regeneracja po zawodach jako osobne zalecenia. |
| 11, tydzień startowy | Start w liczbie jednostek, km i szacowanym obciążeniu; brak wymuszonego rozruchu; testy wszystkich dni zawodów i sum. |
| 12, bezpieczeństwo | Zachowane ograniczenia V22, kontekst tolerancji i odstępów, rzeczywisty udział długiego, rozpoznanie dolegliwości, ograniczenia wieku, celu i czasu. |
| 13, nowy miernik | `scoring/v23.mjs`: sześć wag, kryteria pozytywne, brak sufitu liczby kar, jawna adekwatność celu i oddzielna ocena bezpieczeństwa. Wzorce poza generatorem i testy kontrfaktyczne. |
| 14, historia mierników | `score`, `scoreV21`, `miernik_v22` zachowane; brak osobnego benchmark_v22 jawnie zgłoszony; dodano odtwarzalny ręczny benchmark V23. |
| 15–16, porównanie i 28 | Obie wersje liczone starymi i nowym miernikiem na tych samych wejściach. Dwie tabele 28 oraz tabela różnic, wszystkie wymagane statystyki w JSON/Markdown. |
| 17, profile | 18 szczegółowych par planów i osobny przykład adaptacji; poziomy, wiek, staż, historia, tolerancja, przerwa, cele, dostępność i 52 tygodnie. |
| 18, testy | Wszystkie dotychczasowe zestawy, migracja kontroli V22 na V23, nowe przypadki, pełny sweep 9408 i kontrola procesów/hashy. Uruchomienia przerwane i historyczne są oddzielone. |
| 19, analiza 10 km / 3 dni | Pełne wejście i oba plany, pierwsze cztery tygodnie, konkretne interwały/progi, długi, taper i ostatnie dni w `analiza_10k_3dni_v23.md` i JSON. |
| 20–21, architektura/API | Istniejący silnik rozwinięty; wydzielone polityki, recepty, adaptacja i scoring; zachowane eksporty, opcjonalne nowe pola, udokumentowana semantyka obciążenia zawodów. |
| 22–25, dokumentacja/dostawa | README, metodyka, ograniczenia/V24, changelog, raporty, źródła/testy/wyniki, ZIP i gałąź GitHub. ZIP jest testowany po spakowaniu. |

Granice walidacji: nie przeprowadzono badań sportowych ani klinicznych na rzeczywistych biegaczach. Pełny model zmęczenia, pomiar tolerancji indywidualnej oraz całościowa przebudowa historycznego API nie są deklarowane jako wykonane. Działającym modułem adaptacyjnym tej wersji jest `updatePlan`.
