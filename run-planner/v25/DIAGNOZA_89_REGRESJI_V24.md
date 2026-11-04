# Diagnoza 89 obniżeń V24 względem V23

Baza: 91949a0e96ee83fdde8e540865b8579c8baff4d5. Odtworzono pełne testy V24 i 1008 par przed zmianami. Rozkład 540/379/89. Miernik 23.0.0, SHA-256 a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71. Wejścia 00ab459021dbf3100e0cc08a1b4472f7cbafa09a5425033307cdb79656ed008d. Każdy przypadek ma pełne wejście, tygodnie, recepty, oceny cząstkowe i korekty w diagnostyka_v25/regresje_v24.json.

| Przyczyna pierwotna | Liczba |
|---|---:|
| dwa_dni_alokacja_i_konsolidacja | 14 |
| porownanie_roznych_bodzcow_i_taperu | 56 |
| domyslny_limit_miernika_120_min | 12 |
| maraton_rotacja_progu_w_fazie_specyficznej | 7 |

## Priorytety

1. Maraton / 4 / 60 km (id 887): wynik 9,195 → 8,614, Δ −0,581; szczyt 60 → 56 km, najdłuższy 27 → 25 km. Rotacja w peak co drugi tydzień zastępuje MP progiem, a limit spokojnego biegu utrudnia zachowanie tolerowanej objętości. Minimalna poprawka: odpowiednia przewaga MP w fazie specyficznej, jawny budżet spokojnych jednostek w granicach historii/czasu. Nie zwiększać wszystkich parametrów.
2. HM / 2–3 dni: kary za niepodany limit 120 min nie są dowodem błędu generatora. Jawne limity użytkownika pozostają obowiązujące. Nie zmieniać historycznego miernika i nie dopasowywać limitu do jego kary.
3. Dwa dni: przeanalizować zwłaszcza połączenie akcentu i długiego biegu, a taper zachować. Cel długodystansowy nadal może być niewykonalny.
4. 5 km i inne rodziny: większa dawka wcześniejszego progu nie oznacza braku późniejszej progresji. Nowy miernik powinien porównywać podobne bodźce bez taperu. Nie dokładać intensywności dla punktów.

Klasyfikacja jest wewnętrznym audytem algorytmicznym; każdy niższy wynik pozostaje w raporcie. Planowana adaptacja nie jest wykonaniem. Macierz statyczna nie dowodzi poprawności updatePlan — temu służy osobna siatka adaptacyjna.
