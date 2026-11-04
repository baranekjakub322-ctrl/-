# V22 → V23

Baza: niezmieniony ZIP V22 i jego ponownie wykonany komplet testów. W repozytorium V22 była zapisana jako ZIP na gałęzi pobierania; V23 zapisuje również źródła w `run-planner/v23`. Gałąź robocza: `runplanner-v23`.

## Rzeczywiste zmiany

1. Własna spokojna recepta jednego biegu oraz rotacja dwóch biegów, z kontrolowanym udziałem długiego po końcowych korektach. Nie wymusza się tygodniowego budżetu przez nadmierne wydłużanie rozgrzewki i schłodzenia.
2. Łagodny próg w drugim tygodniu u przygotowanego zawodnika; zachowana ostrożna baza dla niskiej gotowości. Wyraźniej wydzielona faza specyficzna.
3. Progresja interwałów/progu/MP i okresy stabilizacji, przy stałych tempach aktualnej formy. Liczniki postępu wynikają z zachowanych jednostek. Brak intensywnych końcówek długiego przy trzech dniach i utrzymywaniu wyniku.
4. Jawna intencja utrzymania/poprawy/ukończenia, preferencje dni, tolerancja obciążeń, dłuższy odstęp regeneracji oraz kontekst doświadczenia maratońskiego.
5. Zawody liczą się do liczby jednostek; rozruch nie jest obowiązkowy. Kilometry i szacowane obciążenie zawodów są uwzględniane raz, z jawnym źródłem szacunku.
6. Czytelne ograniczenia częstotliwości. Naprawiono wcześniejszą flagę, która nazywała ograniczenie poziomem brakiem dostępności mimo dostępnych siedmiu dni.
7. `updatePlan`: wykonane/pominięte/skrócone jednostki, RPE, zmęczenie, przerwa, dostępność, test formy i dolegliwości. Bez nadrabiania, z dziennikiem rewizji i ograniczeniem pojedynczej poprawy intensywności. Brak danych nie odbudowuje dawnej bazy; uraz nie wygasa bez nowszego zgłoszenia.
8. Rozróżnienie źródła HRmax, tempa, RPE i celu fizjologicznego. Ból 3/10 prowadzi do spokojnej bazy/ograniczonej wykonalności; aktywny uraz i silniejszy ból do odmowy.
9. Niezależny miernik V23 z sześcioma ważonymi kategoriami, kryteriami pozytywnymi, każdą karą i kontrolowanym benchmarkiem. Bez bonusu za samą nową etykietę, bez usuwania starych mierników.

## Zachowanie testów i metodologia

Oryginalne testy V22 są zachowane w `baseline/RunPlanner_V22.zip` i uruchomione przed modyfikacją; wyniki w `wyniki_bazowe_v22`. W aktywnej kopii `testy/lib.mjs` wskazuje domyślnie V23, a `podstawowe.mjs` oczekuje wersji 23. Nie zmieniono zasad `score`, `scoreV21`, `independentChecks` ani miernika V22. `v22.mjs` nadal uruchamia V22; jego kopia `regresje_v22_v23.mjs` przenosi te same asercje na nowy generator z techniczną zmianą wersji/importów. Jedna kontrola historycznego pomocnika nadal dotyczy zachowanego modułu V22 — raport nie przedstawia jej jako nowego kryterium modelu.

Nowy miernik ma inną skalę i nie zastępuje historii. W porównaniu obie wersje są przeliczane każdą z tych samych metryk, na identycznych danych. Kontrolowane pogorszenia są ręcznie skonstruowane poza generatorem. Dane historyczne, powtórzona baza, próby diagnostyczne i końcowy przebieg są oddzielone. Awaria testu lub zmiana źródeł w czasie uruchomienia nie daje zielonego raportu.

Podczas rozwoju naprawiono wykryte regresje: zbyt krótki bieg jednego dnia w taperze, nadmierny udział długiego po odciążeniu częściowego pierwszego tygodnia, niespójność niskiej tolerancji oraz niewystarczającą interpretację tempa/horyzontu przez miernik. Progi starych testów nie zostały osłabione.

Końcowa diagnoza ostrzeżeń taperu ujawniła błąd propagacji niepełnego pierwszego tygodnia do zwyczajowej częstotliwości. Naprawiono przyczynę w generatorze i dodano regresję dla profili HM/maraton, bez zmiany kryteriów starego miernika. Kalibracja miernika dodatkowo rozdziela bezpieczny plan od adekwatnego przygotowania: jawny współczynnik celu obniża ocenę niewykonalnych planów także wtedy, gdy są technicznie bezpieczne. Referencja taperu pochodzi sprzed taperu, nie z zawyżonego ostatniego tygodnia.
