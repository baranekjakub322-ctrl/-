# Testy V28

Przebieg 2026-11-04T18:52:54.974Z, v24.19.0, 471.414000 s. 17/17 etapów, 44 zestawów/programów, **2144 PASS / 0 FAIL**. Benchmarki bez liczników nie są dopisywane jako fikcyjne PASS.

| Zestaw | Kod | PASS | FAIL | Sekundy |
|---|---|---|---|---|
| podstawowe_v28 | 0 | 107 | 0 | 0.316000 |
| trudne | 0 | 93 | 0 | 1.263000 |
| czulosc | 0 | 28 | 0 | 0.397000 |
| regresje | 0 | 17 | 0 | 11.745000 |
| czulosc_v21 | 0 | 38 | 0 | 0.754000 |
| jakosciowe | 0 | 35 | 0 | 4.903000 |
| dostepnosc | 0 | 9 | 0 | 7.375000 |
| porownanie28 | 0 | 31 | 0 | 0.749000 |
| porownanie_v19_v20 | 0 | 12 | 0 | 14.142000 |
| porownanie_v20_v21 | 0 | 32 | 0 | 14.658000 |
| sweep | 0 | 21 | 0 | 107.811000 |
| skrypt_bledy | 0 | 4 | 0 | 0.790000 |
| v22 | 0 | 73 | 0 | 1.498000 |
| porownanie_v21_v22 | 0 | — | — | 26.430000 |
| regresje_v22_v23 | 0 | 73 | 0 | 1.464000 |
| kalibracja_v23 | 0 | 16 | 0 | 0.067000 |
| v23 | 0 | 82 | 0 | 1.445000 |
| porownanie_v22_v23 | 0 | — | — | 29.329000 |
| v24_inherited | 0 | 82 | 0 | 1.699000 |
| v24 | 0 | 227 | 0 | 7.196000 |
| porownanie_v23_v24 | 0 | — | — | 30.446000 |
| regresje_v25 | 0 | 8 | 0 | 0.181000 |
| v25_inherited | 0 | 82 | 0 | 1.670000 |
| adaptacja_v25 | 0 | 140 | 0 | 4.282000 |
| v25 | 0 | 121 | 0 | 1.762000 |
| kalibracja_v25 | 0 | 24 | 0 | 0.080000 |
| porownanie_v24_v25 | 0 | — | — | 37.618000 |
| wydajnosc_v25 | 0 | 1 | 0 | 2.718000 |
| v27 | 0 | 119 | 0 | 1.960000 |
| kalibracja_v27 | 0 | 16 | 0 | 0.059000 |
| regresje_v28_inherited | 0 | 5 | 0 | 0.141000 |
| v28_inherited | 0 | 119 | 0 | 2.248000 |
| adaptacja_compat_v28 | 0 | 140 | 0 | 4.239000 |
| chronologia_v28 | 0 | 8 | 0 | 2.113000 |
| historie_v28 | 0 | 151 | 0 | 55.511000 |
| v28 | 0 | 215 | 0 | 4.404000 |
| kalibracja_v28 | 0 | 14 | 0 | 0.074000 |
| benchmark_v28 | 0 | — | — | 63.428000 |
| profiles_v28 | 0 | — | — | 2.910000 |
| triage_v28 | 0 | — | — | 14.358000 |
| blind_review_v28 | 0 | — | — | 1.205000 |
| trace_baseline_v28 | 0 | — | — | 1.316000 |
| wydajnosc_v28 | 0 | 1 | 0 | 3.811000 |
| profiling_v28 | 0 | — | — | 0.726000 |

## Baza rzeczywiście wykonana przed zmianami

V27: 11/11 etapów, 0 FAIL procesów; 465.559000 s. Wykonano cały pierwotny zestaw, łącznie z 1008, 28, 64, 224, historiami i kalibracją. Każdą parę porównano z poprzednio opublikowanym raportem. Baza zachowana w wyniki_bazowe_v27 i identyfikatorze commita.

## Pokrycie

Sweep 9408 scenariuszy, 0 krytycznych naruszeń, 181 ostrzeżeń. 28 + 1008 + 64 + 224 = 1324 wejścia porównawcze (nie 1374; wcześniejsze przejęzyczenie w komunikacie skorygowano). 144 planów dwudniowych bez nowych spadków. 47 profili, 40 anonimowych planów, 150 historii 8–12 tygodni i 4 × 16 tygodni. Zbiory częściowo się nakładają; nie są liczbą rzeczywistych biegaczy.

## Zgodność i metodologia

W kopiach testów zgodności zmieniono import V27→V28 i wyłącznie numer wersji oczekiwany przez podstawowe/v28_inherited. Oryginały V27 zachowano i uruchomiono przed zmianami; w pełnym przebiegu także v27 i jego kalibrację. Kryteria treningowe i oba historyczne scorery pozostają bez zmian. Wydłużone historie zachowują oryginalne asercje, dodają 8–12 tygodni i jawny workMinutes.

## Próby niezaliczone

Reprodukcja limitu 110% na V27 celowo RED, na V28 GREEN. Nowa kalibracja początkowo 12/14: dawny pozytywny fixture nie zawierał dystansu opisanych przerw, a test niewykonalności sprawdzał niewłaściwą oś po rozdzieleniu wykonalności. Naprawiono nowy fixture/metodologię jawnie, nie historyczny scorer ani jego testy. Pierwszy pomiar wydajności zakończył się parsowaniem pustego stdout potomka; nie oznaczono go PASS, ponowiono rzeczywiste uruchomienie. Logi zachowano w diagnostyka_v28. Pierwszy pełny przebieg zakończył się 17/17 i 2139 PASS; po nim doprecyzowano trace i etykiety alternatyw. Nowy test początkowo wykrył, że również alternatywa półmaratońska myliła kryteria planu z dowodami wykonania (211/212). Poprawiono komunikat, uzyskano 212/212 i ponownie wykonano wszystkie 17 etapów (2141 PASS). Następnie uzupełniono dawkę podbiegów, zapis rytmów i żywienie bez uniwersalnej dawki. Nowy test rytmów wymagał profilu z co najmniej trzema tygodniami bazy, zamiast gotowego zawodnika z dwoma tygodniami; pierwsze 214/215 zachowano. Kolejny przebieg przerwano po znalezieniu starej, sprzecznej porady picia na każdym punkcie w strategii startu. Usunięto ją, dodano kontrolę całej strategii i wykonano końcowy pełny przebieg. Przerwany przebieg nie jest PASS.

Nie wykonano zewnętrznego testu skuteczności treningowej, medycznej ani niezależnej oceny trenera. Żaden z nich nie jest oznaczony PASS.

## Rozmiar bieżącej produkcji

| Plik | Linie | Bajty |
|---|---|---|
| planGenerator_v28.js | 2697 | 260035 |
| model/training.mjs | 69 | 4220 |
| model/activity_v28.mjs | 109 | 9999 |
| model/adaptation_v28.mjs | 82 | 12123 |
| model/constraints_v28.mjs | 92 | 8432 |
| model/frequency_v28.mjs | 56 | 6052 |
| model/ledger_v28.mjs | 16 | 3183 |
| model/planning_v28.mjs | 53 | 5470 |
| model/policy_v28.mjs | 106 | 9338 |
| model/profile_v28.mjs | 33 | 3961 |
| model/quality_v28.mjs | 45 | 4029 |
| model/readiness_v28.mjs | 28 | 5299 |
| model/season_v28.mjs | 42 | 5205 |
| model/units_v28.mjs | 25 | 2252 |
| scoring/v23.mjs | 134 | 15652 |
| scoring/v25.mjs | 166 | 21643 |
| scoring/v27.mjs | 57 | 14093 |
| scoring/v28.mjs | 37 | 4171 |

Główny generator 2697 linii, wszystkie bieżące moduły wraz z udostępnionymi miernikami 3847 linii / 395157 bajtów. Archiwa, stare generatory, wyniki i testy nie są wliczane.
