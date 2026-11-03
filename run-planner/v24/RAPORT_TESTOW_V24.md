# Raport testów V24

Przebieg 2026-11-03T22:01:54.060Z, Node v24.19.0, 236.2 s. **21/21 zestawów**, **980 PASS / 0 FAIL** zarejestrowanych kontroli. Zawiera także wskazane kontrole historyczne; nie są przedstawiane jako nowe testy V24.

| Zestaw | PASS | FAIL | Zakres |
|---|---:|---:|---|
| podstawowe | 107 | 0 | V24 lub niezależna kalibracja |
| trudne | 93 | 0 | V24 lub niezależna kalibracja |
| czulosc | 28 | 0 | V24 lub niezależna kalibracja |
| regresje | 17 | 0 | V24 lub niezależna kalibracja |
| czulosc_v21 | 38 | 0 | V24 lub niezależna kalibracja |
| jakosciowe | 35 | 0 | V24 lub niezależna kalibracja |
| dostepnosc | 9 | 0 | V24 lub niezależna kalibracja |
| porownanie28 | 31 | 0 | V24 lub niezależna kalibracja |
| porownanie_v19_v20 | 12 | 0 | wersje historyczne |
| porownanie_v20_v21 | 32 | 0 | wersje historyczne |
| sweep | 21 | 0 | V24 lub niezależna kalibracja |
| skrypt_bledy | 4 | 0 | V24 lub niezależna kalibracja |
| v22 | 73 | 0 | wersje historyczne |
| porownanie_v21_v22 | — | — | program porównawczy; kod 0 |
| regresje_v22_v23 | 73 | 0 | wersje historyczne |
| kalibracja_v23 | 16 | 0 | V24 lub niezależna kalibracja |
| v23 | 82 | 0 | wersje historyczne |
| porownanie_v22_v23 | — | — | program porównawczy; kod 0 |
| v24_inherited | 82 | 0 | V24 lub niezależna kalibracja |
| v24 | 227 | 0 | V24 lub niezależna kalibracja |
| porownanie_v23_v24 | — | — | program porównawczy; kod 0 |

## Baza i odtwarzanie problemów

Baza V23 uruchomiona przed modyfikacjami: 18/18 zestawów, 671 historycznych kontroli PASS, 0 FAIL. Wyniki w wyniki_bazowe_v23, źródła zabezpieczone w baseline i niezmienionych plikach v23. Ponowiono wszystkie 1008 par V22/V23. Raport diagnozy zawiera 330 kompletnych przypadków i grupy przyczyn.

Te same nowe testy uruchomiono również na starym V23: 200 PASS, 27 oczekiwanych FAIL (brak poprawionych zachowań/API). To celowe odtworzenie problemów, nie zaliczone testy nowej wersji. Szczegóły: diagnostyka_v24/v24_on_v23_red.json. Wstępne testy V24 wykryły błędy progresji/kompensacji objętości, a pierwszy pełny przebieg wykrył brak redukcji ostatniego długiego biegu HM na granicy taperu (jakosciowe: 34 PASS / 1 FAIL). Wszystkie naprawiono bez osłabiania testów. Zachowano diagnostyka_v24/pierwszy_run_v24.json i pierwszy_jakosciowe.json. Kolejną próbę przerwano przed końcem na czas poprawek adaptacji i startów kontrolnych; jej log jest oznaczony jako przerwany i nie liczy się jako PASS. Kolejny kompletny przebieg był technicznie zaliczony, lecz sweep ujawnił 39 ostrzeżeń TAPER_PLYTKI. Odtworzono wszystkie 39 (24 HM, 15 M; po dwa dni, baza 6 km), wykryto podwójne zużycie budżetu w tygodniu bez długiego biegu i poprawiono alokację. Surowe przypadki: diagnostyka_v24/ostrzezenia_przed_poprawka_taperu.json; manifest tego przebiegu: przebieg_techniczny_z_39_ostrzezeniami.json. Ponowione 2688 scenariuszy niskiej częstotliwości nie wykazało już ostrzeżeń (wyniki_v24/ostrzezenia_taperu.json). Następnie dodano test i poprawkę zmiany dostępności ze starymi preferencjami; pełny przebieg przed tą korektą również zachowano (pelny_run_przed_korekta_preferencji.json). Końcowy pełny przebieg wykonano ponownie od początku na ustalonych źródłach.

## Rzeczywiście uruchomione scenariusze

- Sweep 9408 / 9408 unikalnych; naruszenia krytyczne 0, ostrzeżenia niezależnego historycznego miernika 0. Wszystkie 49 par dni początku i zawodów.
- Porównanie identycznych wejść: 28 oraz 1008 scenariuszy; 0 nowych krytycznych regresji.
- 30 szczegółowych profili, pełne pary planów, osobny przykład adaptacji.
- 128 dodatkowych deterministycznych przypadków stresowych, każdy generowany powtórnie.
- Nowe testy wszystkich dni zawodów dla czterech dystansów; adaptacja, metamorfizm i kalibracja miernika.
- Kalibracja: 16 PASS / 0 FAIL, 9 kontrolowanych wzorców; implementacji/kar nie zmieniono.

Nie sumuje się tych grup do rzekomej liczby globalnie unikalnych profili: częściowo się pokrywają. Szczegóły liczników i czasów każdego zestawu: wyniki_v24/run.json.

## Wyniki porównania

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

## Rozmiar produkcji

| Plik | Fizyczne linie | Bajty |
|---|---:|---:|
| planGenerator_v24.js | 2575 | 243161 |
| model/training.mjs | 69 | 4220 |
| model/policy_v24.mjs | 75 | 5809 |
| model/quality_v24.mjs | 30 | 1925 |
| model/frequency_v24.mjs | 45 | 3767 |
| model/ledger_v24.mjs | 10 | 1488 |
| model/adaptation_v24.mjs | 99 | 10006 |
| scoring/v23.mjs | 134 | 15652 |

Główny generator: **2575 linii**. Wszystkie moduły produkcyjne wraz z nim: **3037 linii / 286028 bajtów**. Bez generatorów historycznych, testów, JSON i dokumentacji. Linie nie są miarą jakości.

## Wydajność i granice walidacji

Testy V24: mediana 14.15 ms na kontrolę, maksimum 265.35 ms, RSS 338 MiB. To pomiar procesu testowego, nie gwarancja SLA; kontrole obejmują również walidację i powtórne generowanie. Pełny benchmark czasów zestawów: run.json.

Nie wykonano badań na biegaczach, oceny klinicznej ani pomiarów urazowości. Nie uruchamiano testów starej strony aplikacji, gdyż nie jest częścią tego silnika i nie była zmieniana. Nie ma nieuruchomionych testów generatora oznaczonych jako PASS. Raporty dostarczone wcześniej są archiwalne i nie zastępują aktualnego przebiegu.

Nierozwiązane ograniczenia i rekomendacje: OGRANICZENIA_V24.md oraz REKOMENDACJE_V25.md.
