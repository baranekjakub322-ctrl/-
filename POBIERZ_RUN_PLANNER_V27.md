# Pobierz Run Planner V27

[**Pobierz RunPlanner_V27.zip (28.5 MB)**](https://github.com/baranekjakub322-ctrl/-/raw/refs/heads/runplanner-v27/RunPlanner_V27.zip)

Jeżeli przeglądarka nie rozpocznie pobierania, otwórz plik `RunPlanner_V27.zip` na gałęzi `runplanner-v27` i wybierz **Download raw file**.

Po rozpakowaniu otwórz `RunPlanner_V27/01_START_TUTAJ_V27.md`. W folderze paczki uruchom `npm test` (Node ≥18 i Bash, bez instalowania zależności). Pakowanie wymaga Python ≥3.8.

SHA-256: `46a35877cd9b442cc990d18ca8bf2b9a6e2d40ad9e402f3c0bd9770397c72c51`. Zawartość sprawdza `SHA256SUMS` wewnątrz ZIP-a; sprawdź ją przed ponownym uruchomieniem testów zapisujących wyniki.

Paczka zawiera kod, 15 raportów, wejścia i pełne pary planów 28/1008/64/224, testy oraz źródła bazowego V26. Wynik końcowy: 1796 PASS / 0 FAIL; świeży test ZIP-a opisuje `WERYFIKACJA_RUN_PLANNER_V27.json`.

Nie osiągnięto wszystkich celów jakościowych: historyczny miernik 23.0.0: 7,447 → 7,492, z 250 niższymi ocenami w macierzy 1008. Cel 7,70 oraz 300 udokumentowanych popraw nie został osiągnięty (wewnętrzne kryterium: 233). Starszy holdout 64 ma niewielki spadek. Szczegóły: `13_OGRANICZENIA_V27.md`.
