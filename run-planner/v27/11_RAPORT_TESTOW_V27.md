# Raport testów V27

Przebieg 2026-11-04T14:22:14.104Z, v24.19.0, 429.778000 s. 11/11 etapów, 38 zestawów/programów. **1796 PASS / 0 FAIL zarejestrowanych kontroli**; programów porównawczych i profilowania bez liczników nie dopisuje się jako fikcyjnych PASS.

| Zestaw | Status procesu | PASS | FAIL | Czas s |
|---|---|---|---|---|
| podstawowe | 0 | 107 | 0 | 0.218000 |
| trudne | 0 | 93 | 0 | 0.751000 |
| czulosc | 0 | 28 | 0 | 0.399000 |
| regresje | 0 | 17 | 0 | 11.894000 |
| czulosc_v21 | 0 | 38 | 0 | 0.667000 |
| jakosciowe | 0 | 35 | 0 | 5.492000 |
| dostepnosc | 0 | 9 | 0 | 6.709000 |
| porownanie28 | 0 | 31 | 0 | 0.678000 |
| porownanie_v19_v20 | 0 | 12 | 0 | 16.027000 |
| porownanie_v20_v21 | 0 | 32 | 0 | 14.636000 |
| sweep | 0 | 21 | 0 | 97.043000 |
| skrypt_bledy | 0 | 4 | 0 | 0.717000 |
| v22 | 0 | 73 | 0 | 1.623000 |
| porownanie_v21_v22 | 0 | — | — | 26.475000 |
| regresje_v22_v23 | 0 | 73 | 0 | 1.700000 |
| kalibracja_v23 | 0 | 16 | 0 | 0.090000 |
| v23 | 0 | 82 | 0 | 1.474000 |
| porownanie_v22_v23 | 0 | — | — | 30.203000 |
| v24_inherited | 0 | 82 | 0 | 1.541000 |
| v24 | 0 | 227 | 0 | 6.450000 |
| porownanie_v23_v24 | 0 | — | — | 32.999000 |
| regresje_v25 | 0 | 8 | 0 | 0.209000 |
| v25_inherited | 0 | 82 | 0 | 1.795000 |
| adaptacja_v25 | 0 | 140 | 0 | 4.015000 |
| v25 | 0 | 121 | 0 | 1.833000 |
| kalibracja_v25 | 0 | 24 | 0 | 0.077000 |
| porownanie_v24_v25 | 0 | — | — | 33.560000 |
| wydajnosc_v25 | 0 | 1 | 0 | 2.814000 |
| regresje_v27 | 0 | 5 | 0 | 0.133000 |
| adaptacja_compat_v27 | 0 | 140 | 0 | 4.088000 |
| kalibracja_v27 | 0 | 16 | 0 | 0.072000 |
| v27 | 0 | 119 | 0 | 2.389000 |
| historie_v27 | 0 | 151 | 0 | 36.183000 |
| chronologia_v27 | 0 | 8 | 0 | 1.861000 |
| profiles_v27 | 0 | — | — | 2.299000 |
| benchmark_v27 | 0 | — | — | 75.152000 |
| wydajnosc_v27 | 0 | 1 | 0 | 4.639000 |
| profiling_v27 | 0 | — | — | 0.809000 |

## Baza wykonana teraz

Czysty V26: 8 etapów, 35 zestawów, 1824 PASS / 0 FAIL, 2026-11-04T13:33:11.643Z, 582.291000 s. Następnie osobny forensic 1008 odtworzył każdą ocenę archiwalną (23.0.0 średnio 7.446662698412691, 25.0.0 9.190388888888913). Nowe porównanie jeszcze raz asercjami wymaga zgodności każdej pary ocen V26. Stare raporty są kontekstem, nie zastępują uruchomień.

## Zakres

Sweep 9408/9408 unikalnych, krytyczne 0, ostrzeżenia 156. 28+1008+64+224 porównań, 150 wielotygodniowych historii, 4 sekwencje 16-tygodniowe, 24 plany 6–24 tygodnie i zawody każdego dnia tygodnia. Zbiory częściowo się nakładają; nie są liczbą rzeczywistych biegaczy.

## Próby FAIL i niekompletne

Pięć nowych reprodukcji na V26: 0/5 przed naprawą. Iteracja 1: 288 krytycznych braków odciążenia przy niskiej początkowej bazie; naprawiono prognozowanie odciążeń. Kontrole ujawniły też odniesienie taperu do teoretycznego długiego biegu i kaskadę przycinania po alokacji; granice przeniesiono przed alokator i odniesiono do zachowanych jednostek. Guard dawki specyficznej mógł utknąć na dwóch km: naprawiono liczbę/blok zamiast dodawania intensywności. Wszystkie próby iteracyjne są zachowane w diagnostyce.

Pierwszy pełny przebieg nie został zaliczony: historyczny czulosc 27/28 wykrył brak reakcji na historię przeciążeń. Ponadto wykryto zmianę źródeł podczas naprawy wyjątku braku daty z seasonContext; odrzucono wynik, nie zmieniono kryterium. Zachowano diagnostyka_v27/przebieg1. Naprawiono kod i wykonano pełny przebieg ponownie. Po ujawnieniu holdoutu nie dostrajano recept do jego wyników; naprawy dotyczyły walidacji i wymaganej czułości bezpieczeństwa.

Jedyna retargetowana historyczna asercja: oczekiwana wersja 26→27 w kopii podstawowe.mjs. Oryginał V26 i wszystkie kryteria treningowe są zachowane. 140 asercji adaptacji przeniesiono bez zmian warunków. Nowy pruning ma osobny kontrakt; nie osłabia testów V26, które odnoszą się do niezmienionego V26.

## Rozmiar

| Plik produkcyjny | Linie | Bajty |
|---|---|---|
| planGenerator_v27.js | 2671 | 255003 |
| model/training.mjs | 69 | 4220 |
| model/activity_v27.mjs | 109 | 9982 |
| model/adaptation_v27.mjs | 81 | 11838 |
| model/constraints_v27.mjs | 76 | 7242 |
| model/frequency_v27.mjs | 56 | 6052 |
| model/ledger_v27.mjs | 14 | 2706 |
| model/policy_v27.mjs | 103 | 8980 |
| model/profile_v27.mjs | 12 | 1625 |
| model/quality_v27.mjs | 30 | 2503 |
| model/readiness_v27.mjs | 28 | 5106 |
| model/season_v27.mjs | 41 | 5104 |
| scoring/v23.mjs | 134 | 15652 |
| scoring/v25.mjs | 166 | 21643 |
| scoring/v27.mjs | 57 | 14093 |

Główny generator 2671 linii; cała bieżąca produkcja z trzema udostępnionymi miernikami 3647 linii / 371749 bajtów. Stare generatory, testy i JSON nie są liczone.

1008 / 23.0.0: **7.446663 → 7.492178**, poprawy/remisy/obniżenia **532/226/250**.

1008 / 25.0.0: **9.190389 → 9.315776**, +/=/- 667/256/85.

1008 / audyt 27.0.0: 7.363991 → 7.419161, +/=/- 409/362/237. To wewnętrzne heurystyki, bez walidacji efektów sportowych lub klinicznej.

Szczegóły wydajności w 12_WYDAJNOSC_V27.md. Nie ma nieuruchomionego testu oznaczonego PASS. Ocena techniczna nie stanowi dowodu skuteczności klinicznej.
