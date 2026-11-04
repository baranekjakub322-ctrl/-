# Wydajność V27

v24.19.0, Linux-6.18.57-x86_64-with-glibc2.41; identyczne 28 wejść × 3 powtórzenia, osobne świeże procesy i GC. Nie porównujemy archiwalnych 26,442 ms z nowym pomiarem innego uruchomienia.

| Wersja | N | Średnia ms | Mediana ms | P95 ms | Maksimum ms | RSS MiB |
|---|---|---|---|---|---|---|
| v26 | 84 | 29.084573 | 23.005830 | 61.603961 | 66.982524 | 176.066406 |
| v27 | 84 | 19.316267 | 12.972861 | 41.577662 | 49.473545 | 179.785156 |

Stosunek średnich V27/V26 0.664141. Cel ≤20 ms: osiągnięty w tym uruchomieniu. Jedno środowisko; brak gwarancji SLA.

Usunięto głębokie kopie niezmiennej historii kandydatów, pełny snapshot stanu zastąpiono czterema licznikami, stałe tempa policzono raz, odcięto niepotrzebne warianty. Zwykły tydzień buduje się raz; przy rzeczywistym konflikcie dostępne są maksymalnie 2–4 warianty. Nie używa się wyniku historycznego jako funkcji celu. Pozostały koszt obejmuje walidację, alokację, zaokrąglenia i budowę danych sezonu.

Benchmark 74.030000 s; 150 historii 34.902298 s. Strumień Brotli ogranicza koszt przechowywania pełnych planów: w RAM trzymane są bieżąca para i metryki, nie wszystkie sesje 1008 par. Wyniki i JSON są rozbudowane; RSS obejmuje proces/JIT i dane testowe, nie tylko plan. Nie wykonano prospektywnego profilowania obciążenia serwera.

Osobne operacje importu i aktualizacji, zimne/ciepłe wywołania w jednym procesie:

| Operacja | Wersja | N | Ms | RSS przed MiB | RSS po MiB |
|---|---|---|---|---|---|
| v26 strict 100 | v26 | 100 | 21.952635 | 33.257813 | 40.257813 |
| v27 strict 100 | v27 | 100 | 5.809916 | 40.257813 | 41.507813 |
| v27 quarantine 100 | v27 | 101 | 6.222681 | 41.507813 | 41.632813 |
| v26 strict 1000 | v26 | 1000 | 35.092895 | 41.757813 | 51.625000 |
| v27 strict 1000 | v27 | 1000 | 27.919514 | 51.625000 | 54.625000 |
| v27 quarantine 1000 | v27 | 1001 | 54.579994 | 54.625000 | 64.332031 |
| v26 strict 3000 | v26 | 3000 | 72.753055 | 65.082031 | 73.707031 |
| v27 strict 3000 | v27 | 3000 | 100.459903 | 73.707031 | 86.625000 |
| v27 quarantine 3000 | v27 | 3001 | 146.371484 | 86.625000 | 97.128906 |
| v26 update 12 | v26 | 12 | 16.874912 | 106.378906 | 106.378906 |
| v27 update 12 | v27 | 12 | 10.014027 | 107.878906 | 108.003906 |
| v26 update 60 | v26 | 60 | 21.377704 | 114.503906 | 122.253906 |
| v27 update 60 | v27 | 60 | 14.366507 | 126.878906 | 128.128906 |
| v26 update 180 | v26 | 180 | 29.502664 | 128.378906 | 128.503906 |
| v27 update 180 | v27 | 180 | 26.936428 | 128.628906 | 128.628906 |

Heap/RSS przed i po są w performance-operations.json. To pomiar, nie dodatkowy fikcyjny test PASS.
