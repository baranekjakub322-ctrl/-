# Pobierz Run Planner V28

[**Pobierz RunPlanner_V28.zip (30.9 MB)**](https://github.com/baranekjakub322-ctrl/-/raw/refs/heads/runplanner-v28/RunPlanner_V28.zip)

Jeśli przeglądarka nie rozpocznie pobierania, otwórz `RunPlanner_V28.zip` w gałęzi `runplanner-v28` i wybierz **Download raw file**.

Po rozpakowaniu przeczytaj `RunPlanner_V28/START_TUTAJ_V28.md`. Uruchom `npm test` w katalogu paczki (Node ≥18 i Bash, bez instalowania zależności).

SHA-256: `c5b1f203829b315fe35a7b7f29a4d26fb72b31312bc82f1e91a7e7ec8ad01dea`. Archiwum ma 858 plików, w tym manifest `SHA256SUMS`; sprawdź go przed uruchomieniem testów zapisujących nowe wyniki.

Wyniki: 2144 PASS / 0 FAIL; 17 etapów, 9408 scenariuszy bezpieczeństwa bez krytycznych naruszeń. Porównania V27/V28: 28 + 1008 + 64 + 224 = 1324 wejścia. Weryfikacja paczki jest opisana w `WERYFIKACJA_RUN_PLANNER_V28.json`.

Miernik historyczny 23.0.0 / 1008: 7,492178 → 7,547016, poprawy/remisy/spadki: 117/882/9. Celu 7,70 nie osiągnięto, 223 oceny nadal są niższe niż V26. Najgorszy decyl nie poprawił się. Wyniki są heurystyczne; nie ma zewnętrznej walidacji trenerskiej lub medycznej. Pełne ograniczenia i niższe wyniki obu holdoutów są w paczce.

Kod: 2697 linii głównego generatora, 3847 linii bieżących modułów wraz z miernikami.
