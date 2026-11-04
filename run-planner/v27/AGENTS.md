# Run Planner V27

Przeczytaj 01_START_TUTAJ_V27.md, architekturę, ograniczenia, regresje i rekomendacje V28.

- Zachowaj V26 i historyczne mierniki 23.0.0/25.0.0 oraz frozen-1008-v24; hashe w PROVENANCE_V27.json.
- Najpierw odtwórz bazę i dodaj test przyczynowy. Nie osłabiaj kryteriów treningowych ani nie usuwaj trudnych profili.
- seasonState i stimulusLedger są planem. Potwierdzenie gotowości i adaptacji wymaga rzeczywistego wykonania.
- Kandydatów nie wybiera się historycznym scoringiem. Nowy audyt jest niezależnym diagnostycznym modułem, nie zewnętrzną walidacją.
- Zachowaj audyt aktywności, idempotencję, korekty i ochronę przeszłości. Nie nadrabiaj pominięć.
- Raportuj wszystkie wyniki, również niższe oceny, FAIL i cele nieosiągnięte. Przerwane lub zmienione w trakcie źródła nie są PASS.
- Przed ZIP-em npm test musi zakończyć wszystkie 11 etapów. Raporty i pakowanie weryfikują zgodność hashy źródeł.
- Nie dodawaj UI; rozwijaj istniejący silnik. Nowe holdouty zamrażaj przed optymalizacją.
