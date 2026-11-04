# Ocena jakości planów V20

**Oceny 1–10 są heurystyczne (autorskie kryteria), a nie wynikami badań naukowych.** Wynikają z funkcji `score()` w `testy/lib.mjs`:

- start 10 pkt;
- −2,0 za każde krytyczne naruszenie niezależnych niezmienników (maks. −6);
- −0,4 za każde ostrzeżenie (maks. −2);
- −1,0 za każdy niespełniony warunek dopasowania do dystansu (liczba biegów, najdłuższy bieg, szczyt tygodniowy; maks. −4), z sufitem oceny 10 − 1,5 × liczba braków.

Niezmienniki: udział długiego biegu, progresja km i długiego biegu, liczba akcentów wg poziomu, brak dwóch mocnych dni pod rząd, skuteczność odciążeń, tapering i długi bieg przed startem, limity czasu, realność deklarowanej gotowości.

## 28 planów (profil stały: intermediate, 35 lat, 35 km/tydz., najdłuższy 14 km, 10 km w 52:00, start 2027-03-28, dostępne 7 dni)

Zmieniają się tylko dystans i deklarowana liczba dni. Czas docelowy skaluje się z dystansem (ta sama prognoza z VDOT × 1,03).

| Dystans | Dekl. | Rzecz. | Szczyt km (bez startu) | Najdł. | Jakościowe | Ostrz. | Gotowość | Problemy miernika | Ocena |
|---|---|---|---|---|---|---|---|---|---|
| 5k | 1 | 1 | 10 | 10 | 0 | 3 | niewystarczajace_przygotowanie | - | 7 |
| 5k | 2 | 2 | 24 | 14 | 13 | 3 | przygotowanie_do_ukonczenia | - | 10 |
| 5k | 3 | 3 | 34 | 14 | 13 | 2 | przygotowanie_do_wyniku | - | 10 |
| 5k | 4 | 4 | 37 | 14 | 13 | 2 | przygotowanie_do_wyniku | - | 10 |
| 5k | 5 | 5 | 37 | 13 | 13 | 3 | przygotowanie_do_wyniku | - | 10 |
| 5k | 6 | 5 | 37 | 13 | 13 | 3 | przygotowanie_do_wyniku | - | 10 |
| 5k | 7 | 5 | 37 | 13 | 13 | 3 | przygotowanie_do_wyniku | - | 10 |
| 10k | 1 | 1 | 12 | 12 | 0 | 3 | niewystarczajace_przygotowanie | - | 7 |
| 10k | 2 | 2 | 25 | 14 | 12 | 4 | przygotowanie_czesciowe | - | 10 |
| 10k | 3 | 3 | 36 | 14 | 13 | 2 | przygotowanie_do_wyniku | - | 10 |
| 10k | 4 | 4 | 42 | 14 | 13 | 2 | przygotowanie_do_wyniku | - | 10 |
| 10k | 5 | 5 | 44 | 14 | 13 | 3 | przygotowanie_do_wyniku | - | 10 |
| 10k | 6 | 5 | 44 | 14 | 13 | 3 | przygotowanie_do_wyniku | - | 10 |
| 10k | 7 | 5 | 44 | 14 | 13 | 3 | przygotowanie_do_wyniku | - | 10 |
| half | 1 | 1 | 14 | 14 | 0 | 3 | niewystarczajace_przygotowanie | - | 7 |
| half | 2 | 2 | 30 | 18 | 12 | 5 | przygotowanie_czesciowe | - | 8.5 |
| half | 3 | 3 | 40 | 18 | 13 | 3 | przygotowanie_do_wyniku | - | 10 |
| half | 4 | 4 | 49 | 18 | 13 | 3 | przygotowanie_do_wyniku | REGENERACJA_ZA_DLUGA | 8 |
| half | 5 | 5 | 54 | 18 | 13 | 4 | przygotowanie_do_wyniku | - | 10 |
| half | 6 | 5 | 54 | 18 | 13 | 4 | przygotowanie_do_wyniku | - | 10 |
| half | 7 | 5 | 54 | 18 | 13 | 4 | przygotowanie_do_wyniku | - | 10 |
| marathon | 1 | 1 | 16 | 16 | 0 | 4 | niewystarczajace_przygotowanie | - | 5.5 |
| marathon | 2 | 2 | 37 | 25 | 11 | 6 | przygotowanie_czesciowe | UDZIAL_DLUGIEGO | 5.5 |
| marathon | 3 | 3 | 48 | 26 | 13 | 4 | przygotowanie_czesciowe | UDZIAL_DLUGIEGO | 8.5 |
| marathon | 4 | 4 | 62 | 29 | 13 | 4 | przygotowanie_czesciowe | REGENERACJA_ZA_DLUGA | 8 |
| marathon | 5 | 5 | 59 | 26 | 13 | 5 | przygotowanie_czesciowe | UDZIAL_DLUGIEGO | 8.5 |
| marathon | 6 | 5 | 59 | 26 | 13 | 5 | przygotowanie_czesciowe | UDZIAL_DLUGIEGO | 8.5 |
| marathon | 7 | 5 | 59 | 26 | 13 | 5 | przygotowanie_czesciowe | UDZIAL_DLUGIEGO | 8.5 |

### Średnie

- Dla dystansów: 5k: **9.57**, 10k: **9.57**, half: **9.07**, marathon: **7.57**
- Dla częstotliwości (deklarowanej): 1: **6.63**, 2: **8.5**, 3: **9.63**, 4: **9**, 5: **9.63**, 6: **9.63**, 7: **9.63**
- Wszystkie 28 planów: **8.95**

Uwagi do tabeli: przy deklaracji 6 i 7 dni plan ma 5 biegów (limit poziomu średniozaawansowanego bez podniesienia dowodem), więc plany 5/6/7 dni są identyczne — to zamierzone ograniczenie generatora, nie błąd raportu. Szczyt km liczony bez dystansu zawodów (zawody nie są w liście treningów).

## Jak czytać ocenę

Wysoka ocena oznacza: brak naruszeń zdefiniowanych niezmienników i dopasowanie do minimów dystansu. Nie oznacza, że plan jest idealny: nie mierzymy np. jakości doboru akcentów (zob. znane problemy), indywidualnej tolerancji obciążeń ani dopasowania temp do formy.
