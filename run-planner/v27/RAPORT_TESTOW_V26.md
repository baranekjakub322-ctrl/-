# Raport testów V26

Przebieg 2026-11-04T09:59:13.042Z, v24.19.0, 494.057 s. Zakończono 8/8 etapów; historyczny etap ma 28 zestawów, łącznie 35 zestawów/programów. **1824 PASS / 0 FAIL rejestrowanych kontroli.** Programy porównawcze bez liczników nie są dopisywane jako fikcyjne testy.

| Zestaw | Kod wyjścia | PASS | FAIL | Sekundy |
|---|---|---|---|---|
| history/podstawowe | 0 | 107 | 0 | 0.275 |
| history/trudne | 0 | 93 | 0 | 1.140 |
| history/czulosc | 0 | 28 | 0 | 0.568 |
| history/regresje | 0 | 17 | 0 | 17.050 |
| history/czulosc_v21 | 0 | 38 | 0 | 0.891 |
| history/jakosciowe | 0 | 35 | 0 | 7.373 |
| history/dostepnosc | 0 | 9 | 0 | 9.606 |
| history/porownanie28 | 0 | 31 | 0 | 0.915 |
| history/porownanie_v19_v20 | 0 | 12 | 0 | 13.523 |
| history/porownanie_v20_v21 | 0 | 32 | 0 | 15.735 |
| history/sweep | 0 | 21 | 0 | 172.236 |
| history/skrypt_bledy | 0 | 4 | 0 | 1.193 |
| history/v22 | 0 | 73 | 0 | 2.434 |
| history/porownanie_v21_v22 | 0 | — | — | 25.701 |
| history/regresje_v22_v23 | 0 | 73 | 0 | 1.422 |
| history/kalibracja_v23 | 0 | 16 | 0 | 0.062 |
| history/v23 | 0 | 82 | 0 | 1.463 |
| history/porownanie_v22_v23 | 0 | — | — | 29.362 |
| history/v24_inherited | 0 | 82 | 0 | 1.449 |
| history/v24 | 0 | 227 | 0 | 6.841 |
| history/porownanie_v23_v24 | 0 | — | — | 29.994 |
| history/regresje_v25 | 0 | 8 | 0 | 0.177 |
| history/v25_inherited | 0 | 82 | 0 | 1.576 |
| history/adaptacja_v25 | 0 | 140 | 0 | 3.763 |
| history/v25 | 0 | 121 | 0 | 1.673 |
| history/kalibracja_v25 | 0 | 24 | 0 | 0.070 |
| history/porownanie_v24_v25 | 0 | — | — | 31.775 |
| history/wydajnosc_v25 | 0 | 1 | 0 | 2.701 |
| regresje_v26 | 0 | 6 | 0 | 0.201 |
| adaptacja_compat_v26 | 0 | 140 | 0 | 5.999 |
| v26 | 0 | 170 | 0 | 8.688 |
| historie_v26 | 0 | 151 | 0 | 39.028 |
| porownanie_v25_v26 | 0 | — | — | 52.598 |
| profiles_v26 | 0 | — | — | 2.546 |
| wydajnosc_v26 | 0 | 1 | 0 | 3.958 |

## Wyniki bazowe wykonane teraz

28 zestawów V25, 1356 PASS / 0 FAIL, Node v24.19.0. Plik wyniki_bazowe_v25/run.json zawiera komendy, statusy, czasy i SHA. Ponowny audyt pełnych 1008 V24/V25 odtworzył wszystkie oceny archiwalne. Poprzednie raporty V25 są kontekstem historycznym, nie zastępują tych uruchomień.

## Próby niezaliczone i przerwane

Nowe 6 reprodukcji na V25: 0/6, oczekiwane FAIL przed naprawą. Rozwój historii miał 140 FAIL wskutek błędnej deklaracji pełnego 13-dniowego okna w samym teście: poprawiono datę deklaracji na ≥14 dni bez zmiany kryterium. Kontrole ogólne ujawniły brak rotacji przy granicy niedziela/poniedziałek i brak walidacji nowych trybów activity/maintain; poprawiono kod. Test syntetyczny ujawnił utratę progu przy uzupełnianiu kilometrów; poprawiono kolejność decyzji. Niespójne minuty przerwy również odtworzono przed naprawą. Trzy przebiegi rozwojowe zatrzymano przed końcem i jawnie oznaczono. Żaden nie jest zaliczony w powyższym wyniku końcowym.

Nowy runner wymagał poprawy przekazywania TESTS_ONLY_LIGHT/EXTRA_TEST; niezmieniony test skrypt_bledy wykrył tę usterkę. Dodano przekazanie do lekkiego runnera zamiast osłabienia asercji.

Jedyna zmiana historycznej asercji w kopii V26: oczekiwana wersja w podstawowe.mjs z /^25\./ na /^26\./. Wszystkie kryteria treningowe i mierniki zachowano. Oryginalny test jest nienaruszony w V25.

## Rozmiar produkcji

| Plik | Linie fizyczne | Bajty |
|---|---|---|
| planGenerator_v26.js | 2668 | 253663 |
| model/training.mjs | 69 | 4220 |
| model/activity_v26.mjs | 108 | 9770 |
| model/adaptation_v26.mjs | 78 | 11415 |
| model/constraints_v26.mjs | 72 | 6830 |
| model/frequency_v26.mjs | 56 | 5930 |
| model/ledger_v26.mjs | 14 | 2613 |
| model/policy_v26.mjs | 90 | 7988 |
| model/quality_v26.mjs | 40 | 2924 |
| model/readiness_v26.mjs | 28 | 5106 |
| scoring/v23.mjs | 134 | 15652 |
| scoring/v25.mjs | 166 | 21643 |

Generator 2668 linii; razem 3523 linii / 347754 bajtów. Nie liczymy testów, danych ani starych wersji.

## Wydajność

| Wersja | N | Średnia ms | Mediana ms | P95 ms | Maks. RSS MiB |
|---|---|---|---|---|---|
| v25 | 84 | 14.146 | 10.545 | 33.278 | 145.008 |
| v26 | 84 | 26.442 | 20.276 | 56.506 | 178.238 |

Identyczne wejścia, osobne procesy z GC; stosunek średnich 1.869. Benchmark 1008 i pełnych par trwał 51.913 s; adaptacja 150 historii 37.631 s. Jedno środowisko, RSS obejmuje proces/JIT i przechowywane wyniki, brak gwarancji SLA.

### Osobny pomiar importu i aktualizacji

Pomiar uzupełniający wykonano osobno poleceniem node narzedzia/profiling_v26.mjs; nie doliczamy go jako fikcyjnego dodatkowego PASS. Dane performance-operations.json obejmują także RSS/heap przed i po. To kolejne zimne/ciepłe wywołania w jednym procesie, nie izolowany rozmiar obiektu. Aby odtworzyć pomiar po npm test, uruchom npm run profile przed npm run report.

| Operacja | Liczba | Ms | RSS przed MiB | RSS po MiB |
|---|---|---|---|---|
| v25 strict 100 | 100 | 38.340 | 32.801 | 44.426 |
| v26 strict 100 | 100 | 5.762 | 44.426 | 46.176 |
| v26 quarantine 100 | 101 | 5.767 | 46.176 | 46.176 |
| v25 strict 1000 | 1000 | 145.781 | 46.176 | 94.551 |
| v26 strict 1000 | 1000 | 27.305 | 94.551 | 96.301 |
| v26 quarantine 1000 | 1001 | 52.212 | 96.301 | 106.125 |
| v25 strict 3000 | 3000 | 426.317 | 106.125 | 237.000 |
| v26 strict 3000 | 3000 | 137.124 | 237.000 | 243.867 |
| v26 quarantine 3000 | 3001 | 140.818 | 243.867 | 257.402 |
| v25 update 12 | 12 | 12.722 | 259.902 | 262.902 |
| v26 update 12 | 12 | 18.341 | 271.152 | 275.402 |
| v25 update 60 | 60 | 12.002 | 279.527 | 279.672 |
| v26 update 60 | 60 | 15.105 | 279.672 | 280.922 |
| v25 update 180 | 180 | 24.660 | 281.172 | 281.422 |
| v26 update 180 | 180 | 27.019 | 281.422 | 281.422 |


## Porównanie

1008 według 23.0.0: **7.444 → 7.447**, poprawy/remisy/obniżenia **40/968/0**.

1008 według 25.0.0: **9.187 → 9.190**. Skale porównujemy osobno. Względem V23 pozostaje 88 niższych wyników (V25: 88). Nie utożsamiamy tego z regresjami V26/V25 ani dawnymi 49 obniżeniami V25/V24.

24 plany długości 6/8/12/16/20/24 tygodni, daty startów w każdy dzień, testy metamorfczne i property-based, 42 przeglądów wewnętrznych (41 pełnych planów), 150 osobnych historii adaptacji. Zbiory częściowo się nakładają; nie są liczbą rzeczywistych biegaczy.
