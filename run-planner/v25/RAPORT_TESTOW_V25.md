# Raport testów V25

Przebieg 2026-11-04T08:48:51.412Z, Node v24.19.0, 298.4 s. **28/28 zestawów**, **1356 PASS / 0 FAIL** zarejestrowanych kontroli. Liczba zawiera opisane kontrole historyczne; programy porównawcze nie są dopisywane jako fikcyjne testy jednostkowe.

| Zestaw | PASS | FAIL | Zakres |
|---|---:|---:|---|
| podstawowe | 107 | 0 | V25 / niezależna kalibracja |
| trudne | 93 | 0 | V25 / niezależna kalibracja |
| czulosc | 28 | 0 | V25 / niezależna kalibracja |
| regresje | 17 | 0 | V25 / niezależna kalibracja |
| czulosc_v21 | 38 | 0 | V25 / niezależna kalibracja |
| jakosciowe | 35 | 0 | V25 / niezależna kalibracja |
| dostepnosc | 9 | 0 | V25 / niezależna kalibracja |
| porownanie28 | 31 | 0 | V25 / niezależna kalibracja |
| porownanie_v19_v20 | 12 | 0 | historia, zachowane zasady |
| porownanie_v20_v21 | 32 | 0 | historia, zachowane zasady |
| sweep | 21 | 0 | V25 / niezależna kalibracja |
| skrypt_bledy | 4 | 0 | V25 / niezależna kalibracja |
| v22 | 73 | 0 | historia, zachowane zasady |
| porownanie_v21_v22 | — | — | porównanie, kod 0 |
| regresje_v22_v23 | 73 | 0 | historia, zachowane zasady |
| kalibracja_v23 | 16 | 0 | V25 / niezależna kalibracja |
| v23 | 82 | 0 | historia, zachowane zasady |
| porownanie_v22_v23 | — | — | porównanie, kod 0 |
| v24_inherited | 82 | 0 | historia, zachowane zasady |
| v24 | 227 | 0 | historia, zachowane zasady |
| porownanie_v23_v24 | — | — | porównanie, kod 0 |
| regresje_v25 | 8 | 0 | V25 / niezależna kalibracja |
| v25_inherited | 82 | 0 | V25 / niezależna kalibracja |
| adaptacja_v25 | 140 | 0 | V25 / niezależna kalibracja |
| v25 | 121 | 0 | V25 / niezależna kalibracja |
| kalibracja_v25 | 24 | 0 | V25 / niezależna kalibracja |
| porownanie_v24_v25 | — | — | porównanie, kod 0 |
| wydajnosc_v25 | 1 | 0 | V25 / niezależna kalibracja |

## Baza, testy rzeczywiste i niezaliczone próby

Baza V24: commit 91949a0e96ee83fdde8e540865b8579c8baff4d5; świeży przebieg 2026-11-03T22:28:52.460Z, 21/21 zestawów, 980 PASS, 0 FAIL przed zmianami. Rozkład 540/379/89 i średnie odtworzono. Wyniki historyczne pozostają w osobnych katalogach. Nowe testy reprodukujące uruchomiono najpierw na V24 (diagnostyka_v25/regresje_v25_na_v24.json), potem na V25.

Próby rozwojowe wykryły brak idempotencji przy klonowaniu pól undefined, niezgodność starego pola historii i kompensację kilometrażem po wyłączeniu jakości przy krótkim stażu. Naprawiono kod, nie osłabiono asercji. Pierwszy pełny przebieg miał 37/38 w czulosc_v21: historyczne pole wykonalności zostało mylnie połączone z potwierdzeniem gotowości; przywrócono właściwe rozdzielenie. Zachowano diagnostyka_v25/pierwszy_run_v25.json i pierwszy_czulosc_v21.json. Dodatkowe pełne przebiegi przed poprawkami historii/objawów i celu są zachowane w diagnostyce; przerwane lub z innym hashem źródeł nie są traktowane jako PASS końcowej wersji. Nowy miernik ujawnił też błąd czytania pierwszego krańca zakresu tempa zamiast środka; poprawiono parser i powtórzono kalibrację. Końcowy pełny przebieg wykonano ponownie na ustalonych źródłach; hashe sprawdzono przed i po. Nie ma nieuruchomionego testu oznaczonego PASS.

## Zakres

- Sweep: 9408 / 9408 unikalnych, 0 krytycznych, 0 ostrzeżeń.
- Dokładnie 28 + 1008 porównań, wszystkie poziomy, dystanse i częstości.
- 128 dodatkowych scenariuszy adaptacji, 140 kontroli PASS.
- 24 plany długoterminowe (4 dystanse × 6/8/12/16/20/24 tygodnie).
- 30 pełnych par planów, wewnętrzny przegląd treningowy każdego.
- 13 ręcznych wzorców nowego miernika; 24 PASS / 0 FAIL. Historyczna kalibracja V23 również uruchomiona bez zmian.

Grupy częściowo się nakładają; nie sumujemy ich jako globalnie unikalnych biegaczy. Brak zewnętrznej oceny trenerów, badań wyników sportowych i urazowości.

## Porównania

Miernik historyczny 23.0.0, SHA-256 `a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71`, pozostał niezmieniony. Dokładna lista wejść: `00ab459021dbf3100e0cc08a1b4472f7cbafa09a5425033307cdb79656ed008d`. Miernik diagnostyczny 25.0.0 oddziela jakość algorytmu od wykonalności i niepewności; nie porównujemy punktów pomiędzy skalami.

1008 według 23.0.0: **7.417 → 7.444**. Poprawy/remisy/obniżenia V25 względem V24: **179/780/49**.

1008 według 25.0.0: **9.160 → 9.187**. Stary score(): 8.621 → 8.638.

Z pierwotnych 89 obniżeń: 18 poprawiono względem V24, 9 osiąga co najmniej V23; 80 nadal poniżej V23. W całej siatce względem V23 jest 88 niższych ocen (w V24 było 89), w tym 8 nowych spoza pierwotnej grupy. Nie utożsamiamy 49 obniżeń V25/V24 z usunięciem 89 obniżeń V24/V23 — to różne porównania. Cel znacznego ograniczenia liczby historycznych regresji nie został osiągnięty. To nie oznacza usunięcia wszystkich ograniczeń fizjologicznych. Wiele różnic wynika z uwzględniania taperu i różnych rodzin jakości przez historyczny miernik. Nie dokłada się intensywności, aby ukryć te różnice. Nowe krytyczne regresje: 0.

| Grupa | N | V24 / 23.0.0 | V25 / 23.0.0 | Δ23 | V24 / 25.0.0 | V25 / 25.0.0 | Δ25 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 5k | 252 | 8.264 | 8.307 | 0.042 | 9.119 | 9.161 | 0.042 |
| 10k | 252 | 8.231 | 8.229 | -0.002 | 9.107 | 9.107 | 0.000 |
| half | 252 | 6.846 | 6.868 | 0.022 | 9.243 | 9.272 | 0.029 |
| marathon | 252 | 6.329 | 6.371 | 0.042 | 9.172 | 9.210 | 0.038 |

| Grupa | N | V24 / 23.0.0 | V25 / 23.0.0 | Δ23 | V24 / 25.0.0 | V25 / 25.0.0 | Δ25 |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | 144 | 4.510 | 4.510 | 0.000 | 8.935 | 8.935 | 0.000 |
| 2 | 144 | 7.001 | 7.101 | 0.100 | 8.944 | 9.067 | 0.122 |
| 3 | 144 | 7.954 | 7.961 | 0.007 | 9.194 | 9.197 | 0.003 |
| 4 | 144 | 8.024 | 8.075 | 0.051 | 9.235 | 9.249 | 0.015 |
| 5 | 144 | 8.167 | 8.172 | 0.004 | 9.274 | 9.289 | 0.015 |
| 6 | 144 | 8.133 | 8.143 | 0.010 | 9.269 | 9.287 | 0.018 |
| 7 | 144 | 8.134 | 8.144 | 0.011 | 9.269 | 9.288 | 0.018 |

| Grupa | N | V24 / 23.0.0 | V25 / 23.0.0 | Δ23 | V24 / 25.0.0 | V25 / 25.0.0 | Δ25 |
|---|---:|---:|---:|---:|---:|---:|---:|
| beginner | 336 | 7.355 | 7.385 | 0.030 | 9.113 | 9.132 | 0.019 |
| intermediate | 336 | 7.528 | 7.549 | 0.021 | 9.213 | 9.236 | 0.023 |
| advanced | 336 | 7.369 | 7.397 | 0.028 | 9.155 | 9.195 | 0.040 |

## Rozmiar

| Plik produkcyjny | Linie fizyczne | Bajty |
|---|---:|---:|
| planGenerator_v25.js | 2650 | 251251 |
| model/training.mjs | 69 | 4220 |
| model/policy_v25.mjs | 84 | 6894 |
| model/quality_v25.mjs | 30 | 1925 |
| model/frequency_v25.mjs | 45 | 4126 |
| model/ledger_v25.mjs | 10 | 1693 |
| model/activity_v25.mjs | 80 | 7454 |
| model/adaptation_v25.mjs | 77 | 10785 |
| model/readiness_v25.mjs | 28 | 4950 |
| scoring/v23.mjs | 134 | 15652 |
| scoring/v25.mjs | 166 | 21643 |

Główny generator 2650 linii; razem produkcja **3373 linii / 330593 bajtów**. Nie liczymy testów, starych generatorów ani JSON. Wspólny trening i oba udostępniane mierniki są liczone. Liczba linii nie mierzy jakości.

## Wydajność w tym samym środowisku

| Wersja | N | Średnia ms | Mediana ms | P95 ms | Maksimum RSS MiB |
|---|---:|---:|---:|---:|---:|
| v24 | 84 | 12.46 | 9.39 | 29.90 | 133.0 |
| v25 | 84 | 13.41 | 9.76 | 32.64 | 142.4 |

Identyczne wejścia i osobne świeże procesy z GC przed pomiarem. Stosunek średniego czasu V25/V24: 1.076. RSS obejmuje proces/JIT, nie tylko plan; pomiar nie jest gwarancją SLA.

## Pozostałe ograniczenia

Nie wszystkie obniżenia historycznej punktacji usunięto; celu znacznego ograniczenia wszystkich 89 punktowych obniżeń nie osiągnięto. To jawne ograniczenie rezultatu, a nie powód do dokładania intensywności. Poprawiony miernik nie zastępuje starego w porównaniu. Gotowość bez wykonania pozostaje warunkowa, szczególnie na maraton. Dane użytkownika nie są automatycznie medycznie ani sensorowo zweryfikowane. Szczegóły: OGRANICZENIA_V25.md i REKOMENDACJE_V26.md.
