# Changelog V27

| Hipoteza | Zmiana kodu | Dowód / ograniczenie |
|---|---|---|
| H1 | buildSeason + seasonPhases, usunięte inline pętle trajektorii | Test resetu faz: FAIL V26, PASS V27; 4 serie 16 tygodni. |
| H2 | Rodziny recept, retained-dose caps i stimulusLedger | Recepty, realna praca i kolejny krok są w planach; guard 2-km naprawiony. |
| H3 | Domyślne kontrole submaksymalne; maximal opt-in | Utrzymanie i M nie mają serii maksymalnych 3 km. |
| H4 | Limity długiego przed alokacją, taper z zachowanej dawki | Usunięte naruszenia wzrostu przy taperze i spadki wywołane opóźnionym przycięciem. |
| H5 | Pruning, stałe tempa, cztery liczniki zamiast głębokiego snapshotu | Pomiar 84 planów na wersję; wynik i RSS bez ukrywania. |
| H6 | seasonContext, provenance PB/HR, sleep/wellbeing, workMinutes | 140 testów zgodności, 150 historii, korekty i jawna niepewność. |

1008 / 23.0.0: **7.446663 → 7.492178**, poprawy/remisy/obniżenia **532/226/250**.

1008 / 25.0.0: **9.190389 → 9.315776**, +/=/- 667/256/85.

1008 / audyt 27.0.0: 7.363991 → 7.419161, +/=/- 409/362/237. To wewnętrzne heurystyki, bez walidacji efektów sportowych lub klinicznej.

Nie osiągnięto średniej 7,70 ani aspiracyjnej 7,90. Końcowy wynik to 7.492178. Historyczny wynik nie jest miarą efektu sportowego.

Wewnętrzne kryterium rzeczywistych zmian (zmiana jednostek, wyższy audyt i poprawa jakości/specyfiki/periodyzacji/regeneracji bez krytycznych błędów) wskazało 233/1008, a cel wynosił 300. Nie utożsamiamy 532 wyższych ocen historycznych z tyloma udowodnionymi poprawami treningowymi.

Na starszym holdoucie 64 wynik V23: 7.296547 → 7.280078; nie ukrywamy spadku. Nowy 224: 7.125232 → 7.172696. Historycznych obniżeń względem V23 pozostało 120, w V26 było 88. Wszystkie niższe oceny i nierozstrzygnięte przypadki są zapisane.

Nie przeprowadzono zewnętrznej oceny trenerów, badań wyników ani pomiaru urazowości. Audyt 27 jest wewnętrzną, niezależną implementacją, a nie zewnętrzną walidacją. Progi dawki, snu, odciążeń i gotowości są heurystyczne; żadna reguła procentowa nie gwarantuje bezpieczeństwa.

Przy 1–2 dniach i krótkim przygotowaniu maraton może być niewykonalny. Poprawny plan alternatywny nie potwierdza ukończenia ani czasu. Deklarowany PB i zaplanowany kilometraż nie są świeżym pomiarem ani wykonaniem.

Nowy rdzeń projektuje fazy i trajektorie przed tygodniami, ale zachowuje sprawdzony alokator, limity i mechanizmy naprawcze V26. To ograniczony planer, nie globalne optimum sezonu; cele jakości są wskazówką ograniczoną receptą i budżetem, a nie wymuszoną dawką. Wiele elementów monolitu pozostało dla zgodności. Dane sezonowe i warunkowe kolejne kroki zwiększają rozmiar wyniku.
