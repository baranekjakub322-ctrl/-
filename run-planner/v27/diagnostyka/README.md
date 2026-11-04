# Próby diagnostyczne — nie są wynikami dostarczonej wersji

- `sweep_przed_poprawkami.json`: wczesny przebieg po zmianie jakości i małej częstotliwości. 9408 scenariuszy; 20 zbiorczych asercji PASS, 1 FAIL; 118 planów z naruszeniem krytycznym, 130 naruszeń. Powodem był udział długiego po korektach/odciążeniu. Naprawiono generator i ponowiono pełny sweep.
- `taper_przed_poprawka.json`: 18 ostrzeżeń o płytkim taperze z późniejszej próby. Diagnoza: niepełny pierwszy tydzień błędnie wpływał na częstotliwość i bazę kolejnych pełnych tygodni. Dodano regresję i poprawkę propagacji danych.
- Pierwsze testy jednostkowe ujawniły także za krótkie biegi jednego dnia w taperze oraz przypadek wyższej objętości przy niskiej tolerancji; poprawiono reguły, a nie asercje.
- Pierwsza kalibracja miernika nie odróżniła dostatecznie zmiany celu 10 km → maraton. Kontrola realnego tempa/horyzontu oraz jawna adekwatność celu usunęły fałszywe pozytywy. Obie wersje przeliczono następnie tą samą końcową metryką.
- Jeden z procesów końcowych został przerwany przez restart środowiska. Zestawy bez ukończenia nie są zaliczeniem ani wynikiem końcowym. Kolejne kompletne uruchomienie zapisano osobno.

Nie zachowano pełnych źródeł każdego stanu pośredniego. Te dane służą przejrzystości diagnozy, nie są zamiennikiem aktualnego `wyniki_v23/run.json` i nie należy ich porównywać punktowo z końcowym miernikiem po zmianie definicji. Reguły historycznych mierników pozostały niezmienione.
