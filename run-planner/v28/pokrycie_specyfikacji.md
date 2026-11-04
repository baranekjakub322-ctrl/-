# Realizacja specyfikacji V22

| Punkty specyfikacji | Implementacja / dowód |
|---|---|
| 1–4, baza i audyt | Niezmieniony V21, komplet ponowionych testów w `wyniki_bazowe_v21`, różnice w changelogu. |
| 5, indywidualizacja | `evidenceInput`, historyczne reguły wieku/km/przerwy/ograniczeń, nowe testy historii, stażu i aktualności. |
| 6, maraton | `marathonModel`, osobne fazy, `qualityPolicy`, MP bez celu czasowego, limity długiego i żywienie; przykłady maratońskie. |
| 7–9, częstotliwość | Model podtrzymania/rotacji, limit poziomu i dostępności, faktyczna liczba w danych, pełna siatka 1–7. |
| 10, tempa | Aktualny wynik, odrzucenie dat przyszłych, brak automatycznej prognozowanej progresji, RPE/niepewność; testy czułości. |
| 11–12, progresja/regeneracja | Rampa V21 + rzeczywisty sufit km + strażnik szacowanego wysiłku; istniejące rozróżnienie Z1/Z2, odciążenia, kontrole granicy tygodni. |
| 13–14, długi i jakość | Udział realnego tygodnia, ograniczenie czasu, rotacja, progresja odcinków V21 i MP V22, zachowane rozgrzewki/schłodzenia. |
| 15, taper/start | Istniejące zabezpieczenia V21, wszystkie dni startu, test sum tygodnia z zawodami raz. |
| 16, wykonalność | Zachowane stany i strict; nowe konflikty braku czasu, wieku, faktycznej częstotliwości i nierealnego czasu; uraz/ból odmowa. |
| 17, architektura/API | Mały moduł zasad, bez zależności, zachowane eksporty, deterministyczność/niemutowanie, błędy runnera propagowane. |
| 18, niezależność | Dotychczasowy miernik bez zmiany progów; nowy osobny miernik dla obu wersji, wyniki kategorii i problemy jawne. |
| 19–20, testy i sweep | Oryginalne zestawy + testy V22; 9408 unikalnych kombinacji, wszystkie 7 dni startu i zawodów, 49 par. Wyniki wyłącznie z wykonanych uruchomień. |
| 21, porównanie | 1008 identycznych wejść, dwie skale liczone dla V21 i V22; profile, km, częstotliwość, typy, wykonalność w JSON. |
| 22, przykłady | 14 pełnych planów i opis kontroli wybranych tygodni. |
| 23–25, dostawa | README/API/ograniczenia, changelog, raport testów, ocena jakości, porównanie, źródła i testy w ZIP. |

Pozostała granica zakresu: nie przeprowadzono badań sportowych/klinicznych ani walidacji na realnych biegaczach. Heurystyki nie są takim badaniem. Zachowano ograniczenia starszego API historii i dostępności; nie wykonano niezwiązanej przebudowy całego silnika od zera.
