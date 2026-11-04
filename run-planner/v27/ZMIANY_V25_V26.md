# Zmiany V25 → V26

Rozwinięto istniejący silnik. Nie powstał UI ani generator zastępczy.

- Model ograniczeń i 2–4 deterministyczne warianty tygodnia, z zachowaniem celu jednostki przed dopasowaniem km.
- Niezależne inwarianty bez oceny 0–10, wielowymiarowy budżet, jawne etapy i przyczyny.
- Rotacja dwóch kolejnych dni, umiarkowany fragment zamiast przebieżek przy jednym dniu u przygotowanych, jawne activity/maintain obok finish/time.
- Ciągłe ekspozycje progu HM oraz spójność km/min/tempa przerw. Rejestr ma oprawę, poprzednią porównywalną ekspozycję, decyzję i sygnał przeglądu stagnacji; nie uznaje planu za wykonanie.
- Sekwencyjne bramki maratońskie, oddzielna gotowość tygodnia, opisowa niepewność. Możliwość siódmego dnia jest oparta na pełnych wykonanych tygodniach.
- Walidacja splitu testowego, kwarantanna częściowo błędnych importów, idempotencja, buforowane formatowanie stref i jawna pewność adaptacji.
- 1008 pełnych par, 150 sześciotygodniowych historii, 42 profile, testy własnego selektora, zachowanie obu mierników i historii.

1008 według 23.0.0: **7.444 → 7.447**, poprawy/remisy/obniżenia **40/968/0**.

1008 według 25.0.0: **9.187 → 9.190**. Skale porównujemy osobno. Względem V23 pozostaje 88 niższych wyników (V25: 88). Nie utożsamiamy tego z regresjami V26/V25 ani dawnymi 49 obniżeniami V25/V24.

Wydajność: średni czas generowania w tym pomiarze wzrósł z 14.146 do 26.442 ms (1.869×), przy wyborze maksymalnie 2–4 wariantów. Koszt jest ograniczony, ale V26 nie poprawiła wydajności V25; dalsze profilowanie jest zadaniem V27.

Nie osiągnięto zakładanej znacznej poprawy średnich i większości 1008 profili. Raport pokazuje rzeczywiste różnice, również niższe oceny i remisy. W 418 z 1008 przypadków zmieniły się rzeczywiste jednostki; sama zmiana nie dowodzi poprawy treningowej. Zmiany walidacji, importu, danych i gotowości nie muszą zmieniać statycznej punktacji; nie tworzymy sztucznych zmian dla wyniku.

Brak zewnętrznej oceny trenerów i badań prospektywnych tolerancji, wyników oraz urazów. 42 przeglądy są wewnętrzne, 150 historii to symulacje. Progi regularności, dawki i tempa są heurystyczne. Brakujące czasy pozostają w kwarantannie, bez zgadywania wykonania.

Model ograniczeń otacza starszy silnik i ograniczone warianty tygodnia; nie jest globalnym optymalizatorem całego sezonu. Część monolitu pozostaje. Warunkowa progresja jest scenariuszem planowanym, nie dowodem adaptacji. Osobna ocena gotowości tygodnia nie stanowi kwalifikacji medycznej.

1–2 dni ograniczają długie dystanse. Siódmy dzień wymaga deklaracji oraz rzeczywistej kompletnej historii; nawet wtedy nie jest obowiązkowy. Żywienie i warunki są ostrożnym kontekstem; nie ma precyzyjnego modelu strat potu czy wpływu trasy.

Historyczny miernik V25 ma skupienie wyników 9–10. Zachowano go zamiast poprawiać ocenę własnej wersji; oba mierniki wymagają kalibracji na danych zewnętrznych.
