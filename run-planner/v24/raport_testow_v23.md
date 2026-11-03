# Raport testów Run Planner V23

Końcowy przebieg: 2026-11-03T20:23:16.411Z, Node v24.19.0, 204.4 s. **18/18 zestawów zaliczonych**, 0 niezaliczonych. Wszystkie wyniki w `wyniki_v23` należą do tego przebiegu; hashe źródeł sprawdzono przed/po.

| Zestaw | Ponowiona baza V22 PASS/FAIL | Końcowe PASS/FAIL | Faktyczny zakres |
|---|---:|---:|---|
| podstawowe | 107/0 | 107/0 | V23 |
| trudne | 93/0 | 93/0 | V23 |
| czulosc | 28/0 | 28/0 | V23 |
| regresje | 17/0 | 17/0 | V23 |
| czulosc_v21 | 38/0 | 38/0 | V23 |
| jakosciowe | 35/0 | 35/0 | V23 |
| dostepnosc | 9/0 | 9/0 | V23 |
| porownanie28 | 31/0 | 31/0 | V23 |
| porownanie_v19_v20 | 12/0 | 12/0 | wersje historyczne |
| porownanie_v20_v21 | 32/0 | 32/0 | wersje historyczne |
| sweep | 21/0 | 21/0 | V23 |
| skrypt_bledy | 4/0 | 4/0 | V23 |
| v22 | 73/0 | 73/0 | niezmieniony V22 |
| regresje_v22_v23 | — | 73/0 | techniczna migracja asercji na V23; jedna kontrola wspólnego pomocnika V22 |
| v23 | — | 82/0 | nowe zachowania V23 |
| kalibracja_v23 | — | 16/0 | nowy miernik, 9 ręcznych wzorców |

**Asercje: 671 PASS, 0 FAIL.** Liczba zawiera 117 kontroli historycznych (stary V22 i porównania V19/V20/V21), co jest jawnie oddzielone powyżej. Dodatkowe programy porównawcze nie są doliczane jako fikcyjne testy jednostkowe. Baza V22 przed zmianami: 500 PASS w 14 zestawach.

## Scenariusze i pokrycie

- Pełny sweep V23: **9408 wykonanych, 9408 unikalnych**, 0 naruszeń krytycznych, 0 ostrzeżeń zachowanego miernika.
- Ponowiony sweep V22: 9408 scenariuszy, 0 krytycznych, 0 ostrzeżeń.
- Obowiązkowa macierz: 28 identycznych wejść dla obu wersji.
- Rozszerzone porównanie: 1008 wejść, 1008 unikalnych.
- Szczegółowe profile: 18 pełnych par planów oraz osobny przykład adaptacji.
- Benchmark: 9 kontrolowanych wzorców; 16 kontroli miernika.
- Dodatkowe siatki istniejących testów (np. dostępność 127 podzbiorów dni) są w ich JSON; nie sumujemy ich jako jednego globalnie unikalnego zbioru, bo częściowo się nakładają.

Sweep sprawdził wszystkie 49 par dnia początku i zawodów, siedem dni w każdej komórce dystans/poziom i powtarzalność. Dni początku: {"0":1344,"1":1344,"2":1344,"3":1344,"4":1344,"5":1344,"6":1344}. Dni zawodów: {"0":1344,"1":1344,"2":1344,"3":1344,"4":1344,"5":1344,"6":1344}. Kody problemów: {}. Pełne ostrzeżenia, także niekrytyczne, pozostają w JSON.

## Wyniki 28 wariantów

Pełne tabele V22, V23 i różnice: [macierz 28](macierz_28_v22_v23.md). Średnie według dystansu:

| Grupa | N | Stary V22 → V23 | Nowy V23.0.0: V22 → V23 | Historyczny miernik V22: V22 → V23 |
|---|---:|---:|---:|---:|
| 5k | 7 | 9.571 → 9.357 | 8.389 → 8.953 | 10.000 → 10.000 |
| 10k | 7 | 9.571 → 9.357 | 8.485 → 8.876 | 10.000 → 10.000 |
| half | 7 | 9.357 → 9.143 | 7.997 → 8.423 | 10.000 → 10.000 |
| marathon | 7 | 8.286 → 7.643 | 6.519 → 6.999 | 10.000 → 10.000 |

Średnie według deklarowanej częstotliwości:

| Grupa | N | Stary V22 → V23 | Nowy V23.0.0: V22 → V23 | Historyczny miernik V22: V22 → V23 |
|---|---:|---:|---:|---:|
| 1 | 4 | 6.625 → 5.500 | 5.086 → 5.323 | 10.000 → 10.000 |
| 2 | 4 | 8.500 → 8.500 | 7.100 → 7.393 | 10.000 → 10.000 |
| 3 | 4 | 9.625 → 9.625 | 8.078 → 8.914 | 10.000 → 10.000 |
| 4 | 4 | 9.625 → 9.625 | 8.178 → 9.012 | 10.000 → 10.000 |
| 5 | 4 | 10.000 → 9.625 | 8.631 → 9.182 | 10.000 → 10.000 |
| 6 | 4 | 10.000 → 9.625 | 8.929 → 9.182 | 10.000 → 10.000 |
| 7 | 4 | 10.000 → 9.625 | 8.929 → 9.182 | 10.000 → 10.000 |

## Wyniki rozszerzonego porównania

| Grupa | N | Stary V22 → V23 | Nowy V23.0.0: V22 → V23 | Historyczny miernik V22: V22 → V23 |
|---|---:|---:|---:|---:|
| 5k | 252 | 9.571 → 9.357 | 8.074 → 8.158 | 10.000 → 10.000 |
| 10k | 252 | 9.500 → 9.357 | 8.121 → 8.009 | 10.000 → 10.000 |
| half | 252 | 8.429 → 8.190 | 6.641 → 6.657 | 10.000 → 10.000 |
| marathon | 252 | 7.476 → 7.458 | 6.047 → 6.069 | 10.000 → 10.000 |

## Rozmiar kodu

| Plik produkcyjny | Linie fizyczne | Bajty |
|---|---:|---:|
| planGenerator_v23.js | 2563 | 239906 |
| model/training.mjs | 69 | 4220 |
| model/policy_v23.mjs | 58 | 3702 |
| model/quality_v23.mjs | 27 | 1651 |
| model/adaptation_v23.mjs | 70 | 6650 |
| scoring/v23.mjs | 134 | 15652 |

Główny generator: **2563 linii / 239906 bajtów**. Moduły poza nim: **358 linii / 31875 bajtów**. Cały kod produkcyjny V23: **2921 linii / 271781 bajtów**. Wspólny moduł V22 jest liczony, ponieważ V23 go używa; archiwalne generatory, testy i raporty nie są wliczone.

## Wykonane, historyczne i nieukończone próby

Baza V22 została uruchomiona w tej sesji przed zmianami. Raporty dołączone wcześniej nie zastępują tego uruchomienia. Przebiegi diagnostyczne ujawniły regresje i problemy miernika; poprawiono kod, a starych progów nie osłabiono. Restart środowiska przerwał jeden z końcowych procesów: został odrzucony, a powyższy kompletny przebieg wykonano ponownie od początku. Nie przedstawiamy przerwanej próby jako FAIL algorytmu ani jako PASS. Końcowy raport nie zawiera nieuruchomionych zestawów oznaczonych jako zaliczone.

Nie przeprowadzono badań skuteczności na biegaczach, pomiarów urazowości ani kwalifikacji klinicznej. Istniejące stare API historii ma heurystyczne ograniczenia opisane w README. Znane ograniczenia i rekomendacje V24: [osobny dokument](ZNANE_OGRANICZENIA_V23.md).
