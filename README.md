# Run Planner

**[Pobierz RunPlanner_V29.zip](https://github.com/baranekjakub322-ctrl/-/raw/refs/heads/runplanner-v29/RunPlanner_V29.zip)**

Generator planów biegowych w JavaScript, bez interfejsu WWW.

- [Instrukcja V29](run-planner/v29/README_V29.md)
- [Wyniki testów](run-planner/v29/RAPORT_TESTOW_V29.md)
- [Porównanie V28/V29](run-planner/v29/BENCHMARK_V28_V29.md)
- [Audyt 18 pełnych planów](run-planner/v29/AUDYT_18_PLANOW_V29.md)
- [Ograniczenia](run-planner/v29/OGRANICZENIA_V29.md)
- [SHA-256 ZIP-a](RunPlanner_V29.zip.sha256)
- [Weryfikacja archiwum](RunPlanner_V29.weryfikacja.json)

4011 sprawdzeń PASS / 0 FAIL w końcowym stanie walidacji. Dane porównań są jawne: średnia historycznego score23 spada z 7,547 dla V28 do 7,135 dla V29. Techniczny PASS nie jest dowodem, że każdy plan jest lepszy lub klinicznie bezpieczny. Historyczne silniki, scorery i wcześniejsze wyniki pozostają w repozytorium.

Uruchomienie kodu: `cd run-planner/v29`, następnie `npm test` i `npm run report`. Wymagane Node >=18 i Bash; bez `npm install`.
