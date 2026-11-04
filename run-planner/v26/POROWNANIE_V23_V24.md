# Porównanie V23 / V24

Oceniono obie wersje tym samym niezmienionym miernikiem V23.0.0. SHA-256: `a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71`. Stary score(), scoreV21 i historyczny miernik V22 również zachowano. Wagi i kary nie były zmieniane. Wynik jest heurystyką, bez walidacji skuteczności na biegaczach.

Dokładnie odtworzono wejścia bazowe zamiast ponownie implementować ich indeksowanie. SHA-256 listy 1008 wejść: `00ab459021dbf3100e0cc08a1b4472f7cbafa09a5425033307cdb79656ed008d`. Macierz 28: stary score 8.875 → 9.036; miernik V23 8.313 → 8.452.

1008: stary score 8.591 → 8.621; miernik V23 **7.223 → 7.417**. Lepsze/remisy/gorsze: **540/379/89**. Brak nowego krytycznego naruszenia w porównaniu: 0 zgłoszeń.

Spośród pierwotnych 330 regresji: 275 ma wyższą ocenę niż V23; 198 osiąga co najmniej V22, a 132 pozostaje poniżej V22. W całej siatce V24 względem V22 ma 637 popraw, 232 remisów i 139 niższych ocen (w tym 7 nowych obniżeń poniżej V22 spoza pierwotnych 330). Nie utożsamiamy 132 pozostałych pierwotnych regresji z całą liczbą obniżeń. Surowe dane: wyniki_v24/v24_vs_v22.json. To miara syntetyczna, nie dowód usunięcia każdego problemu fizjologicznego. Pełne pozostałe przypadki z wejściami są w JSON.

## Według dystansu — 1008

| Grupa | N | V23 stary score | V24 stary score | V23 miernik 23.0.0 | V24 miernik 23.0.0 | Δ |
|---|---:|---:|---:|---:|---:|---:|
| 5k | 252 | 9.357 | 9.381 | 8.158 | 8.264 | 0.106 |
| 10k | 252 | 9.357 | 9.357 | 8.009 | 8.231 | 0.222 |
| half | 252 | 8.190 | 8.286 | 6.657 | 6.846 | 0.188 |
| marathon | 252 | 7.458 | 7.458 | 6.069 | 6.329 | 0.260 |

## Według częstotliwości — 1008

| Grupa | N | V23 stary score | V24 stary score | V23 miernik 23.0.0 | V24 miernik 23.0.0 | Δ |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 144 | 5.500 | 5.542 | 4.024 | 4.510 | 0.486 |
| 2 | 144 | 8.083 | 8.250 | 6.882 | 7.001 | 0.118 |
| 3 | 144 | 9.250 | 9.250 | 7.857 | 7.954 | 0.097 |
| 4 | 144 | 9.302 | 9.260 | 7.892 | 8.024 | 0.131 |
| 5 | 144 | 9.396 | 9.417 | 7.992 | 8.167 | 0.175 |
| 6 | 144 | 9.302 | 9.313 | 7.956 | 8.133 | 0.177 |
| 7 | 144 | 9.302 | 9.313 | 7.960 | 8.134 | 0.173 |

## Według dystansu — 28

| Grupa | N | V23 stary score | V24 stary score | V23 miernik 23.0.0 | V24 miernik 23.0.0 | Δ |
|---|---:|---:|---:|---:|---:|---:|
| 5k | 7 | 9.357 | 9.357 | 8.953 | 8.878 | -0.075 |
| 10k | 7 | 9.357 | 9.357 | 8.876 | 8.928 | 0.052 |
| half | 7 | 9.143 | 9.143 | 8.423 | 8.427 | 0.004 |
| marathon | 7 | 7.643 | 8.286 | 6.999 | 7.575 | 0.576 |

## Według częstotliwości — 28

| Grupa | N | V23 stary score | V24 stary score | V23 miernik 23.0.0 | V24 miernik 23.0.0 | Δ |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 4 | 5.500 | 5.500 | 5.323 | 5.323 | 0.000 |
| 2 | 4 | 8.500 | 8.500 | 7.393 | 7.280 | -0.113 |
| 3 | 4 | 9.625 | 9.625 | 8.914 | 8.937 | 0.023 |
| 4 | 4 | 9.625 | 9.625 | 9.012 | 9.235 | 0.222 |
| 5 | 4 | 9.625 | 10.000 | 9.182 | 9.463 | 0.280 |
| 6 | 4 | 9.625 | 10.000 | 9.182 | 9.463 | 0.280 |
| 7 | 4 | 9.625 | 10.000 | 9.182 | 9.463 | 0.280 |

## Pozostałe regresje

Nie usuwano niższych wyników. Konserwatywne planowanie długich dystansów i małej częstotliwości nadal nie tworzy pełnej gotowości. Miernik może karać uzasadniony taper lub małą dawkę. Regresja punktowa wymaga oceny treści; nie uznano automatycznie każdej za błąd ani każdej za fałszywą karę.
