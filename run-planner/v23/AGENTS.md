# Run Planner V23 — zasady dalszego rozwoju

Czytaj README, raporty, system oceniania i ograniczenia przed zmianami. Generator V23 rozwija V22, której niezmieniona baza jest zachowana w `baseline/RunPlanner_V22.zip` oraz plikach `planGenerator_v22.js` i `model/training.mjs`.

- Nie twórz UI ani nowego silnika od zera. Zachowuj publiczne API ESM i deterministyczność.
- Najpierw uruchom testy i zachowaj bazę. Nie ukrywaj awarii ani nie osłabiaj progów, aby uzyskać PASS.
- Porównuj obie wersje tym samym miernikiem; nowa metryka wymaga wersji, jawnych reguł i kontrolowanych pogorszeń.
- Nie traktuj oceny syntetycznej jako dowodu skuteczności sportowej lub bezpieczeństwa klinicznego.
- Sprawdzaj rzeczywiste km, czas, intensywność, regenerację, granice tygodni i liczenie zawodów jako jednostki.
- Weryfikuj brak mutacji, powtarzalność, błędy procesu i niezmienność źródeł podczas testu.
- `npm test` uruchamia pełny zestaw; `npm run report` odtwarza raporty z kompletnych wyników. Wyniki historyczne muszą pozostać oddzielone od aktualnych.
- Zapisuj źródła, wyniki i ZIP w repozytorium na gałęzi wersji; nie nadpisuj gałęzi wcześniejszej wersji.
