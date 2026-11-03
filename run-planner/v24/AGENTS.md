# Run Planner V24 — zasady dalszego rozwoju

Przeczytaj README_V24.md, DIAGNOZA_REGRESJI_V23.md, porównania i ograniczenia. Projekt rozwija istniejący silnik, bez UI i z zachowaniem publicznego API.

- Baza V23 to commit 97f40a2e9ad936682011f5585f3967d56f1b3934, niezmienione pliki *_v23 oraz baseline/RunPlanner_V23.zip.
- Nie zmieniaj historycznego scoring/v23.mjs, wag, kar, kalibracji ani wejść 1008 w celu uzyskania lepszego wyniku.
- Najpierw uruchom testy i zachowaj bazę. Naprawiaj błędy kodu zamiast osłabiać testy. Nie oznaczaj przerwanych i nieuruchomionych prób jako zaliczone.
- Kontroluj rzeczywiste km, czas, jakość, granice tygodni, taper i liczenie zawodów jako jednostki. Nie obiecuj gotowości z samego wygenerowania planu.
- Sprawdzaj brak mutacji, powtarzalność i trwałość historii wykonania; brak wpisu w niepełnym oknie nie oznacza zera.
- npm test uruchamia 21 zestawów. npm run report wymaga kompletnego zaliczonego przebiegu i sprawdza hashe. testy/pakuj_v24.py tworzy manifest i zweryfikowany ZIP.
- Raportuj wszystkie niższe wyniki i pozostałe ograniczenia. Oceny są heurystyczne, nie kliniczne.
- Pracuj na osobnej gałęzi kolejnej wersji; zachowuj archiwum i faktycznie działający link do pobrania.
