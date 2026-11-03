# Zmiany V20 → V21

Baza: wyłącznie pakiet V20 (kopia w `baza/planGenerator_v20.js`). Interfejs i format danych bez zmian; dodane pola: `wykonalnosc`, nowe liczniki w `decyzjePlanera`, opcja wejściowa `trybScisly`. Wszystkie eksporty V20 zachowane (test regresji eksportów).

## Zmiany w generatorze

| # | Problem w V20 | Zmiana w V21 |
|---|---|---|
| 1 | `REGENERACJA_ZA_DLUGA` (16 473 w sweepie): każdy bieg po jakimkolwiek biegu (poza zaawansowanymi) był „regeneracją", do 9 km i ponad 60 min | Regeneracja tylko po mocnej jednostce (długi, akcent, test, start). Limit czasu wg deklarowanego poziomu: 30 / 40 / 50 (55 przy ≥75 km tyg.) min, nigdy >60. Inne dodatkowe biegi to bieg spokojny Z2. Nadwyżkę km przejmują inne biegi spokojne; jeśli się nie mieści, tydzień jest krótszy (`kmPonadLimityBiegowSpokojnych`) |
| 2 | `DLUGA_PRZERWA` | Wybór dni biegów spokojnych minimalizuje największą przerwę w tygodniu (kara za dzień przed długim/akcentem) |
| 3 | `BIEG_ZA_KROTKI` (biegi 2 km w ostatnim tygodniu) | Minimum w tygodniu startowym 3 km, liczba biegów dopasowana do budżetu |
| 4 | `UDZIAL_DLUGIEGO` | Udział liczony z faktycznego tygodnia (pełne tygodnie, także odciążające); limity udziału wg dystansu bez zmian; drugi bieg przy ≤2 dniach ma limit +3 km (było +1) |
| 5 | `limityNieosiagniete` (powrót po odciążeniu) | Budżet tygodnia po odciążeniu od razu w limicie powrotu; `trimWeekRuns` ma opcję `minRuns` i zdejmuje wyłącznie bieg dodany w tym tygodniu |
| 6 | 5/10 km przy 5 dniach: 1 akcent + 3 „regeneracje" | Dwa akcenty w szczycie dla poziomu ≥ średniozaawansowany, 5+ faktycznych biegów, bez kontuzji, z dopuszczonymi interwałami |
| 7 | Akcent w poniedziałek po niedzielnym długim biegu (przy dostępności tylko nd+pn) | Sprawdzanie sąsiedztwa także między tygodniami |
| 8 | Rozruch przed startem zwiększał liczbę biegów ponad deklarację | Rozruch tylko, gdy tydzień ma mniej biegów niż deklarowano |
| 9 | Start w pn/wt: pusty tydzień startowy liczony jako tydzień taperingu | `taperEdge`: dodatkowy tydzień taperingu (dla planów ≥6 tyg.) |
| 10 | Brak jawnej oceny wykonalności | `wykonalnosc` (pełna / ograniczona / niewykonalna), konflikty, zalecenia, alternatywa „zmień na półmaraton"; `trybScisly: true` zwraca `ok:false` dla niewykonalnego celu |
| 11 | Audyt wewnętrzny nie widział regeneracji i przerw | Kody `REGENERACJA_ZA_DLUGA`, `DLUGA_PRZERWA` (ostrzeżenie od 6 dni przerwy z dostępnym dniem), `DLUGA_PRZERWA_DOSTEPNOSC` (sugestia) |

## Ocena (testy/lib.mjs)

`score()` z V20 zostaje bez zmian (porównywalność). Nowe `scoreV21`: 7 kategorii (bezpieczeństwo, harmonogram, dopasowanie do biegacza, progresja, jakość treningów, specyfika dystansu, regeneracja). Wynik kategorii = 10·exp(−3·gęstość), gęstość = (krytyczne + 0,25·ostrzeżenia)/max(4, tygodnie); brak sufitu kary; krytyczne ograniczają kategorię (bezpieczeństwo ≤4, inne ≤6); ogólna ≤ bezpieczeństwo+2 i ≤ najsłabsza kategoria+2. Dodano kontrole `REGENERACJA_POZIOM` i `REGENERACJA_BEZ_MOCNEGO`.

## Nowe testy

`czulosc_v21` (38), `jakosciowe` (siatka 168 planów + testy oceny i `trimWeekRuns`), `dostepnosc` (127 podzbiorów dni × 2 dystanse × 3 deklaracje + 196 par start/zawody/dystans), `porownanie_v20_v21`. Sweep V20 rozszerzony o tabele wg dystansu i częstotliwości (siatka 9408 bez zmian).

## Zmiany w istniejących testach (jawnie)

- Asercja wersji: „21.".
- Żaden test V20 nie został usunięty ani osłabiony; progi regresji bez zmian.
- Nowe testy: tolerancja 5% dla szczytu przy kontuzjach (zaokrąglenia).

## Świadome decyzje i ograniczenia

- Płeć nie wpływa na plan (brak uzasadnienia treningowego); zabezpiecza to test czułości.
- Poziom z limitami regeneracji to poziom deklarowany (ostrożniej niż efektywny z wyniku).
- Maraton: poprawiono uczciwość oceny wykonalności i tapering; progresja i treningi specyficzne maratonu nie zostały przeprojektowane. Przy 3 biegach tygodniowo plan jest „ograniczony", przy ≤2 „niewykonalny".
- Struktura planów 2-dniowych: limity i udział długiego biegu dostosowane, ale struktura nie jest jeszcze zróżnicowana wg dystansu.
- `capLongNearRace()` działa jak w V20; nie był osobno przeprojektowywany.
- Miernik i ocena są heurystyczne, nie dowodzą jakości treningowej.
