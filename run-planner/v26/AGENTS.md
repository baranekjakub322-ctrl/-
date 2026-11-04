# Run Planner V26 — dalszy rozwój

Przeczytaj README_V26.md, DIAGNOZA_V25_V26.md, OGRANICZENIA_V26.md i REKOMENDACJE_V27.md. V26 rozwija V25, nie tworzy UI.

- Baza V25: PROVENANCE_V26.json i niezmieniony commit 39d8466e25a35c7ef65e1ca4294decf057d7b8d0.
- Nie zmieniaj scoring/v23.mjs ani scoring/v25.mjs i historycznych wejść 28/1008. Raportuj obie skale oddzielnie.
- Najpierw uruchom bazę, zachowaj logi, odtwórz problem, dopiero popraw kod. Nie osłabiaj kryteriów.
- Kandydaci tygodnia nie używają historycznej oceny jako celu; ograniczenia i cel jednostki mają pierwszeństwo przed kilometrażem.
- Plan nie jest wykonaniem; zachowuj audyt, tożsamość i idempotencję. Brak danych w niepełnym oknie nie oznacza pominięcia.
- Krytyczne naruszenia pokazuj osobno; żaden wskaźnik ani test nie gwarantuje klinicznego bezpieczeństwa.
- npm test to historyczne testy + V26, 150 wielotygodniowych historii, porównanie i wydajność. Niekompletnego przebiegu nie zaliczaj.
- Dokumentacja i ZIP wymagają kompletnych wyników i zgodnych hashy. Wewnętrzna ocena nie jest zewnętrzną walidacją.
