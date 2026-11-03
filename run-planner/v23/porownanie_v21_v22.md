# Porównanie V21 / V22

1008 identycznych wejść: 4 dystanse × 7 deklarowanych częstotliwości × 3 poziomy × 3 pary km/długi × 4 dni zawodów. Dzień początku rotuje przez wszystkie 7 dni. Pełne dane każdej wersji i obu mierników w `wyniki_v22/porownanie_v21_v22.json`. Dodatkowo sweep każdej wersji obejmuje wszystkie 7 dni zawodów.

| Dystans | scoreV21 V21 → V22 | Nowy miernik V21 → V22 | Krytyczne stare V21 → V22 | Ostrzeżenia stare V21 → V22 | Ostrzeżenia nowe V21 → V22 |
|---|---:|---:|---:|---:|---:|
| 5k | 9.857 → 9.857 | 10.000 → 10.000 | 0 → 0 | 0 → 0 | 0 → 0 |
| 10k | 9.786 → 9.786 | 10.000 → 10.000 | 0 → 0 | 0 → 0 | 0 → 0 |
| half | 9.709 → 9.710 | 10.000 → 10.000 | 0 → 0 | 1 → 0 | 1 → 0 |
| marathon | 8.998 → 8.995 | 9.983 → 10.000 | 0 → 0 | 1 → 0 | 119 → 0 |

W obu wersjach użyto dokładnie tego samego kodu każdego miernika. Nowy miernik ma osiem jawnych składowych i nie korzysta z audytu wewnętrznego; pełne składowe oraz listy problemów są w JSON. Jego kod SHA-256: `477aa66b72f5612bb3cd4f50b39c91303ac393eb8bcb22e112965dc1e9e24774`.

Małe różnice średnich nie stanowią dowodu skuteczności sportowej. Brak wzrostu wyniku jest prawidłowym rezultatem, jeśli poprawka dotyczy zachowania poza rozdzielczością testów. Nie dostrajano progu gotowości ani kar do wyniku V22. Wysokie oceny oznaczają spełnienie ograniczonego zbioru reguł, a nie pełną jakość lub gwarancję ukończenia.

Rzeczywista częstotliwość, suma km, typy jednostek i wykonalność każdego wejścia znajdują się w polach `rows[].v21/v22`. Oddzielono sumę treningów bez zawodów od tygodniowego kilometrażu z zawodami.
