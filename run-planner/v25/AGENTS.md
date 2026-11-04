# Run Planner V25 — dalszy rozwój

Przeczytaj README_V25.md, diagnozę 89 regresji, oba benchmarki, system oceniania i ograniczenia. Nie twórz UI ani nowego silnika od zera.

- Baza V24: commit 91949a0e96ee83fdde8e540865b8579c8baff4d5, baseline/RunPlanner_V24.zip oraz niezmienione pliki *_v24.
- Nie zmieniaj scoring/v23.mjs, jego wag/kar i bazowych 1008 wejść. Nowy miernik wymaga własnej wersji i niezależnej kalibracji.
- Najpierw uruchom bazę, potem test reprodukujący błąd. Nie osłabiaj testów w celu uzyskania PASS.
- Nie uznawaj zaplanowanej objętości za wykonanie. Zachowuj surowe oryginały, audyt korekt, stabilne id i idempotencję.
- Gotowość maratońska, wykonalność harmonogramu i jakość algorytmu to różne pojęcia. Bez danych wykonania nie deklaruj potwierdzonej gotowości.
- Kontroluj km, czas, intensywność, długi bieg, granice tygodni i zawody jako jednostkę. Żaden pojedynczy wskaźnik nie gwarantuje bezpieczeństwa klinicznego.
- npm test uruchamia 28 zestawów. Raporty wymagają pełnego przebiegu i identycznych hashy źródeł. Przerwane/nieuruchomione próby nie są zaliczone.
- Raportuj wszystkie niższe oceny. Wewnętrzny przegląd systemu nie jest zewnętrzną walidacją trenerską lub kliniczną.
- Kolejną wersję zapisuj na osobnej gałęzi i dostarczaj rzeczywiście istniejący, zweryfikowany ZIP oraz działający link pobrania.
