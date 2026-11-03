# Diagnoza regresji V23

Ponowiona baza: 2026-11-03T21:23:24.732Z. Zachowany miernik 23.0.0, SHA-256 a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71. Dokładnie 1008 wejść; V22 7.220360, V23 7.223414. Lepsze/remisy/gorsze: 420/258/330. Pełne parametry każdego gorszego przypadku, daty/recepty jakości, tygodnie, kategorie i przyczyny: diagnostyka_v24/regresje_v23.json.

## Pierwotne grupy przyczyn

| Grupa | Przypadki |
|---|---:|
| jeden_dzien_staly_limit | 99 |
| roznica_struktury_i_oceny | 2 |
| dawka_progu_wedlug_etykiety | 71 |
| zbyt_powolna_ewolucja_recept | 153 |
| maraton_statyczna_baza | 3 |
| utrata_objetosci_przez_alokacje | 2 |

## Kategorie diagnozy (nakładają się)

- objetosc: 252
- czestotliwosc: 0
- udzial_dlugiego: 51
- intensywnosc: 0
- brak_bodzca: 173
- progresja: 326
- monotonia: 227
- taper: 25
- specyfika: 112
- indywidualizacja: 101
- adaptacja: nie wykonywana przez statyczną macierz
- wykonalnosc: 109
- falszywa_kara: 67

Wynik nie oznacza, że każda z 330 różnic jest pogorszeniem fizjologicznym. Stały mały bodziec i brak specyfiki po długiej bazie są realnymi ograniczeniami. Redukcja nadmiaru intensywności i zachowawczy limit czasu mogą być uzasadnione, nawet jeśli miernik preferuje większą objętość. Dwa rozpoznane ograniczenia miernika: progresja jakości liczona wraz z taperem oraz procentowy taper przy bardzo małej dawce jednej jednostki. Historyczny kod nie został zmieniony; ewentualne V24 pozostające pod tymi karami będą pokazane jawnie.

Macierz statyczna nie testuje updatePlan. Błędy adaptacji wymagają oddzielnych scenariuszy (data startu, zmniejszona intensywność, trwała historia, przerwy), a nie deklaracji braku błędów na podstawie tej siatki.

## Miejsca w kodzie i kierunek najmniejszych poprawek

- policy_v23.oneRunPrescription: stały limit i zaokrąglenie w dół zamrażają mały bodziec. Nowa polityka ma dopuszczać ostrożne etapy podtrzymania/wejścia, bez obietnicy pełnej gotowości.
- quality_v23.thresholdMinutes: poziom deklarowany i podwójne spowolnienie licznika nie odpowiadają efektywnemu poziomowi z historii i wyniku. Poprawka dawki musi nadal respektować tolerancję, staż i czas.
- policy_v23.qualityPolicy: początkowa baza maratońska jest stała przez cały plan. Krótkie bloki specyficzne można wprowadzać warunkowo po etapie bazowym bez uznawania planowanej adaptacji za obserwację.
- quality_v23.specificRecipe: powtórzenia co dwa zachowane akcenty mogą oznaczać wiele tygodni identycznej recepty; rozdzielenie utrwalenia od progresji wymaga jawnego rejestru dawki.
- buildWeek/trim: przy 1–2 dniach budżet wielodniowego szablonu nie jest dobrą polityką podstawową; potrzebne są jawne cele dwóch jednostek, nie arbitralne dokładanie km.

Każda poprawka V24 jest porównywana na wszystkich identycznych wejściach. Nie usuwa się przypadków i nie zmienia wag/kar V23.
