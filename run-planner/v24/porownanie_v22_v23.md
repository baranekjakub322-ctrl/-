# Uczciwe porównanie V22/V23

Każde wejście, data, dystans, cel i wartość domyślna są identyczne dla obu wersji. Każda wersja jest przeliczona starym score(), scoreV21, zachowanym miernikiem V22 i nowym V23.0.0. Pełne składowe nowego miernika i uzasadnienia dla 28 wariantów oraz szczegółowych profili są zapisane w JSON. Miernik SHA-256: `a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71`. Reguły i wagi: [system oceniania](SYSTEM_OCENIANIA_V23.md).

## 28 wariantów — dystans

| Grupa | N | Stary V22 → V23 | Nowy V23.0.0: V22 → V23 | Historyczny miernik V22: V22 → V23 |
|---|---:|---:|---:|---:|
| 5k | 7 | 9.571 → 9.357 | 8.389 → 8.953 | 10.000 → 10.000 |
| 10k | 7 | 9.571 → 9.357 | 8.485 → 8.876 | 10.000 → 10.000 |
| half | 7 | 9.357 → 9.143 | 7.997 → 8.423 | 10.000 → 10.000 |
| marathon | 7 | 8.286 → 7.643 | 6.519 → 6.999 | 10.000 → 10.000 |

## 28 wariantów — częstotliwość

| Grupa | N | Stary V22 → V23 | Nowy V23.0.0: V22 → V23 | Historyczny miernik V22: V22 → V23 |
|---|---:|---:|---:|---:|
| 1 | 4 | 6.625 → 5.500 | 5.086 → 5.323 | 10.000 → 10.000 |
| 2 | 4 | 8.500 → 8.500 | 7.100 → 7.393 | 10.000 → 10.000 |
| 3 | 4 | 9.625 → 9.625 | 8.078 → 8.914 | 10.000 → 10.000 |
| 4 | 4 | 9.625 → 9.625 | 8.178 → 9.012 | 10.000 → 10.000 |
| 5 | 4 | 10.000 → 9.625 | 8.631 → 9.182 | 10.000 → 10.000 |
| 6 | 4 | 10.000 → 9.625 | 8.929 → 9.182 | 10.000 → 10.000 |
| 7 | 4 | 10.000 → 9.625 | 8.929 → 9.182 | 10.000 → 10.000 |

## Rozszerzona siatka 1008 — dystans

| Grupa | N | Stary V22 → V23 | Nowy V23.0.0: V22 → V23 | Historyczny miernik V22: V22 → V23 |
|---|---:|---:|---:|---:|
| 5k | 252 | 9.571 → 9.357 | 8.074 → 8.158 | 10.000 → 10.000 |
| 10k | 252 | 9.500 → 9.357 | 8.121 → 8.009 | 10.000 → 10.000 |
| half | 252 | 8.429 → 8.190 | 6.641 → 6.657 | 10.000 → 10.000 |
| marathon | 252 | 7.476 → 7.458 | 6.047 → 6.069 | 10.000 → 10.000 |

## Rozszerzona siatka 1008 — częstotliwość

| Grupa | N | Stary V22 → V23 | Nowy V23.0.0: V22 → V23 | Historyczny miernik V22: V22 → V23 |
|---|---:|---:|---:|---:|
| 1 | 144 | 6.375 → 5.500 | 4.484 → 4.024 | 10.000 → 10.000 |
| 2 | 144 | 8.250 → 8.083 | 6.843 → 6.882 | 10.000 → 10.000 |
| 3 | 144 | 9.250 → 9.250 | 7.641 → 7.857 | 10.000 → 10.000 |
| 4 | 144 | 9.292 → 9.302 | 7.704 → 7.892 | 10.000 → 10.000 |
| 5 | 144 | 9.417 → 9.396 | 7.930 → 7.992 | 10.000 → 10.000 |
| 6 | 144 | 9.313 → 9.302 | 7.968 → 7.956 | 10.000 → 10.000 |
| 7 | 144 | 9.313 → 9.302 | 7.972 → 7.960 | 10.000 → 10.000 |

Liczba wykrytych nowych krytycznych regresji/braków planu w porównaniu: 0. Porównanie nie wymaga, aby V23 miała wyższy wynik: niższe wartości, ostrzeżenia i ograniczenia są zachowane. Nie porównujemy liczby z jednej skali z liczbą z innej. Sama zgodność techniczna nie oznacza idealnego treningu.

Nie było osobnego benchmark_v22.mjs; zachowano dostępne benchmarki porownanie28/sweep i ich mierniki, a rygorystyczną alternatywę stanowią niezależne ręczne wzorce opisane w [kalibracji](benchmark_v23.md). Nie kalibrowano do pożądanego wyniku V23 ani do nieodtwarzalnej subiektywnej oceny 7,6.
