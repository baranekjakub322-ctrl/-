# V21 → V22

V22 rozwija rzeczywisty plik V21; eksporty i dotychczasowy format są zachowane. Wydzielono zasady dowodów treningowych, model maratonu, niską częstotliwość i szacowanie obciążenia do `model/training.mjs`.

1. Rzeczywista historia 2–12 tygodni i staż ograniczają bazę/objętość/jakość. Zera nie znikają ze średniej.
2. Wyniki z przyszłości/błędnymi datami są odrzucane. Wynik starszy niż rok przestaje wyznaczać intensywność.
3. Tempa nie przyspieszają na podstawie samej prognozy poprawy formy. Zachowano progresję długości bodźca; nowy wynik aktualizuje tempa.
4. Osobna rotacja dwóch biegów, bez intensywnych końcówek długiego biegu. Przy jednym biegu brak jakości; ocena dotyczy faktycznej dostępności, a nie tylko deklaracji.
5. Osobna periodyzacja maratonu, wprowadzenie MP po bazie również przy celu ukończenia, rezygnacja z progowych końcówek długich biegów i ostrożny limit czasu. `goal.mode` jawnie odróżnia ukończenie i wynik.
6. Kontrola rzeczywistych km po złożeniu tygodnia oraz kontrola min×RPE przy dokładaniu jakości. Korekty są zwracane, nie ukrywane. Rozgrzewka/schłodzenie jakości mają niższą wagę niż część główna.
7. Aktywny uraz lub istotny ból blokuje plan. Niepełnoletni na HM/maraton wymagają oceny poza automatycznym modelem. Tryb ścisły odmawia też nierealnego czasu i braku czasu na adaptację.
8. Jawne RPE, niepewność tempa, dane indywidualizacji, efektywna częstotliwość i sumy uwzględniające start.
9. Nowy runner rejestruje status każdego procesu i skróty źródeł. Błędy procesu/brak pliku/nieudana asercja są błędami, nigdy sukcesem.

## Metodologia testów — jawne zmiany

Oryginały wszystkich testów są zachowane w `baza_v21/testy`. W roboczej kopii testów zmieniono jedynie domyślny plik w `lib.mjs` na V22, asercję wersji 21→22 w `podstawowe.mjs` i usunięto zakodowany na sztywno import V21 z `jakosciowe.mjs` na rzecz `G` wybranego przez `GEN`. Kryteria i progi dotychczasowych testów/miernika `independentChecks`/`scoreV21` nie zostały osłabione.

Nowy miernik `miernik_v22.mjs` dodaje niezależne kategorie i reguły; jest oddzielną metryką, nie zamiennikiem starego wyniku. Obie wersje są przeliczane nim od nowa na tych samych 1008 wejściach. Wynik kategorii = 10·exp(−3·(krytyczne + 0.25·ostrzeżenia)/liczba tygodni), wynik łączny = średnia ośmiu kategorii; brak limitu liczby kar. Raport ujawnia krytyczne/ostrzeżenia osobno. To prosty wskaźnik porównawczy, nie certyfikat bezpieczeństwa. Nie wolno porównywać jego wartości bezpośrednio z historycznym scoreV21 jako jednej skali.

Pierwsze próby wykazały kolizję rotacji jakości z tygodniami odciążenia oraz niepożądany wzrost objętości przy usunięciu jakości u profilu z ograniczeniami. Poprawiono generator, nie progi testów. Dodatkowa kontrola wykryła nadmierny wzrost trudności przy dwóch biegach; dodano kontrolę obciążenia i osobny test regresyjny. Wyniki końcowe po wszystkich poprawkach są w `wyniki_v22`, wcześniejsze próby nie są zaliczeniami wersji dostarczonej.

Końcowe poprawki regresyjne: po zmianie akcentu przeliczana jest klasyfikacja następnego dnia regeneracji; limit czasu długiego używa rzeczywistego tempa long, a odbudowa dystansu odnosi się do rzeczywiście skróconego biegu, nie starej recepty. Oryginalny ZIP V21 zachowano i sprawdzono jego dostarczony SHA-256.
