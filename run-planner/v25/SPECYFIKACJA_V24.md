# RUN PLANNER V24 — KOMPLETNY PROMPT KORYGUJĄCO-ROZWOJOWY DLA CODEX

## 1. ROLA I GŁÓWNY CEL

Jesteś doświadczonym programistą JavaScript, architektem algorytmów oraz specjalistą od modelowania treningu biegowego.

Twoim zadaniem jest stworzenie **Run Planner V24 na podstawie istniejącej V23**.

Nie twórz nowego projektu. Nie buduj strony internetowej ani interfejsu. Pracuj nad generatorem planów biegowych, modułami treningowymi, testami, dokumentacją i systemem oceniania.

### Główne cele V24

1. Usunąć przyczyny regresji jakościowych V23 względem V22.
2. Poprawić jakość planów dla 5 km, 10 km, półmaratonu i maratonu.
3. Szczególnie poprawić plany na 1–2 treningi tygodniowo.
4. Dopracować progresję treningów jakościowych.
5. Rozwinąć rzeczywistą indywidualizację zawodników.
6. Poprawić przygotowanie maratońskie.
7. Udoskonalić adaptację planu do wykonanych treningów.
8. Zachować bezpieczeństwo, stabilność i zgodność wsteczną.
9. Wprowadzić bardziej rygorystyczne, niezależne testy jakości.
10. Dostarczyć kompletny, działający i przetestowany pakiet V24.

**Najważniejsza zasada: jakość treningowa ma pierwszeństwo przed oceną punktową.**

Nie wolno manipulować scoringiem, zmieniać wag ani osłabiać testów tylko po to, aby V24 wyglądała lepiej.

---

# CZĘŚĆ I — DIAGNOZA V23

## 2. ZABEZPIECZENIE WERSJI BAZOWEJ

Przed jakimikolwiek zmianami:

1. Przeczytaj `AGENTS.md`, `README.md` i raporty V23.
2. Zidentyfikuj rzeczywiste pliki produkcyjne i ich zależności.
3. Sprawdź główny generator oraz moduły:
   - `model/training.mjs`
   - `model/policy_v23.mjs`
   - `model/quality_v23.mjs`
   - `model/adaptation_v23.mjs`
4. Przeczytaj istniejące testy, szczególnie `testy/benchmark_v23.mjs`, `testy/porownanie_v22_v23.mjs` i `testy/regresje_v22_v23.mjs`.
5. Zachowaj niezmienioną V23 jako bazę.
6. Uruchom testy bazowe i zapisz wyniki.
7. Przygotuj gałąź roboczą V24.
8. Nie nadpisuj historycznych wyników ani implementacji miernika V23.

Wszystkie zmiany muszą być możliwe do odtworzenia i porównania.

## 3. ZNANE WYNIKI V23

Dotychczasowe wyniki porównania V22 i V23 przy użyciu tego samego miernika:

### Podstawowa macierz 28 kombinacji

- V22: 7,85/10.
- V23: 8,31/10.
- Poprawa: +0,46.

### Rozszerzona macierz 1008 scenariuszy

- V22: 7,220/10.
- V23: 7,223/10.
- Poprawa: tylko +0,003.

Rozkład scenariuszy:

- 420 przypadków: V23 lepsza.
- 258 przypadków: wynik identyczny.
- 330 przypadków: V23 gorsza.

### Średnie z 1008 scenariuszy według dystansu

| Dystans | V22 | V23 |
|---|---:|---:|
| 5 km | 8,074 | 8,158 |
| 10 km | 8,121 | 8,009 |
| Półmaraton | 6,641 | 6,657 |
| Maraton | 6,047 | 6,069 |

**Nie traktuj tych liczb jako gwarantowanych wyników obecnego repozytorium. Zweryfikuj je przez ponowne uruchomienie istniejących testów.**

## 4. OBOWIĄZKOWA ANALIZA 330 REGRESJI

To pierwszy i najważniejszy etap.

### Co zrobić

1. Uruchom porównanie V22/V23 na identycznych danych.
2. Wyodrębnij wszystkie przypadki, w których V23 otrzymała niższą ocenę.
3. Zapisz pełne parametry każdego scenariusza.
4. Ustal, które kategorie scoringu odpowiadają za spadek.
5. Przeanalizuj rzeczywistą zawartość wygenerowanych planów.
6. Pogrupuj regresje według wspólnej przyczyny.
7. Oddziel rzeczywiste pogorszenie planu od niedoskonałości miernika.
8. Przygotuj raport `DIAGNOZA_REGRESJI_V23.md`.

### Wymagane kategorie diagnozy

- Zbyt duża lub zbyt mała objętość.
- Niewłaściwa częstotliwość.
- Zbyt duży udział długiego biegu.
- Nadmiar intensywności.
- Brak wystarczającego bodźca.
- Nieprawidłowa progresja.
- Nadmierna monotonia.
- Nieprawidłowy taper.
- Nieodpowiednia specyfika dystansu.
- Niewystarczająca indywidualizacja.
- Błędy adaptacji.
- Problemy z wykonalnością celu.
- Fałszywe kary miernika jakości.

### Jak poprawić

Nie stosuj jednej globalnej zmiany parametrów dla wszystkich przypadków.

Dla każdej grupy regresji:

1. Ustal konkretną przyczynę w kodzie.
2. Zaprojektuj najmniejszą skuteczną zmianę.
3. Dodaj test odtwarzający problem.
4. Wprowadź poprawkę.
5. Uruchom test regresyjny.
6. Sprawdź, czy poprawka nie pogarsza innych dystansów lub profili.

### Kryterium

Celem jest znaczące ograniczenie liczby rzeczywistych regresji i zwiększenie średniej jakości w szerokiej siatce.

Nie wolno usuwać scenariuszy z testów ani obniżać kar scoringu, aby uzyskać lepszy wynik.

---

# CZĘŚĆ II — KONKRETNE POPRAWKI TRENINGOWE

## 5. PLANY NA JEDEN TRENING TYGODNIOWO

### Problem

Plany jednodniowe mają niskie oceny i ograniczone możliwości przygotowania do zawodów.

### Wymagane zmiany

1. Stwórz osobną politykę planowania dla jednego treningu.
2. Rozróżniaj:
   - utrzymanie aktywności;
   - utrzymanie aktualnej formy;
   - ukończenie krótkich zawodów;
   - poprawę wyniku;
   - przygotowanie do długiego dystansu.
3. Nie obiecuj ambitnej poprawy wyników, gdy częstotliwość jest niewystarczająca.
4. Nie łącz automatycznie długiego biegu, interwałów i tempa w jednej jednostce.
5. Dobieraj pojedynczy główny bodziec do aktualnego etapu przygotowania.
6. Zachowuj ciągłość i rozsądne obciążenie.
7. Dla półmaratonu i maratonu stosuj szczególnie rygorystyczną ocenę wykonalności.
8. Rozróżniaj bezpieczny plan podtrzymujący od pełnego przygotowania startowego.
9. Informuj o ograniczeniach w danych wyjściowych.
10. Nie podnoś sztucznie kilometrażu pojedynczego biegu.

### Implementacja

Wprowadź osobny mechanizm doboru bodźców dla niskiej częstotliwości, zamiast stosować wyłącznie przycinanie planu wielodniowego.

### Testy

- Początkujący 5 km / 1 dzień.
- Średniozaawansowany 10 km / 1 dzień.
- Zaawansowany 10 km / 1 dzień.
- Półmaraton / 1 dzień.
- Maraton / 1 dzień.
- Cel nierealny.
- Cel podtrzymaniowy.
- Powrót po przerwie.

---

## 6. PLANY NA DWA TRENINGI TYGODNIOWO

### Problem

Dwa treningi często wymagają kompromisu między objętością, długim biegiem i intensywnością.

### Wymagane zmiany

1. Projektuj plan od podstaw dla dwóch jednostek.
2. Ustal główny cel każdej jednostki.
3. Nie wymuszaj treningu jakościowego w każdym tygodniu.
4. Nie planuj dwóch bardzo wymagających treningów bez uzasadnienia.
5. Rozróżniaj długi spokojny bieg od jednostki specyficznej.
6. Kontroluj udział długiego biegu w kilometrażu.
7. Uwzględniaj przerwy między treningami.
8. Dostosuj plan do dostępnych dni.
9. Stosuj periodyzację również przy dwóch treningach.
10. Wyraźnie informuj, kiedy częstotliwość ogranicza realność celu.

### Proponowany model

Dla przygotowanego biegacza na 5–10 km można rozważyć:

- Jednostkę rozwojową: tempo, próg, interwały albo spokojny bieg zależnie od fazy.
- Jednostkę wytrzymałościową: bieg spokojny lub dłuższy.

Nie traktuj tego jako sztywnego szablonu. Dobór musi zależeć od poziomu, historii i zmęczenia.

### Testy

Sprawdź wszystkie cztery dystanse, różne poziomy i dostępność dni.

---

## 7. POPRAWA PLANÓW NA 10 KM

### Problem

W szerokim porównaniu 1008 scenariuszy średnia dla 10 km spadła z 8,121 do 8,009.

### Wymagane działania

1. Wyodrębnij wszystkie regresje dotyczące 10 km.
2. Ustal, czy wynikają z objętości, intensywności, taperu, periodyzacji czy scoringu.
3. Sprawdź osobno częstotliwości 1–7 dni.
4. Zbadaj wpływ poziomu zaawansowania.
5. Zbadaj wpływ aktualnego kilometrażu.
6. Sprawdź, czy aktualny rekord ma większe znaczenie niż ambitny cel.
7. Udoskonal proporcje treningu spokojnego, progowego i specyficznego.
8. Wprowadź bardziej logiczną progresję odcinków.
9. Unikaj przypadkowego zastępowania treningów jakościowych innymi bodźcami.
10. Popraw fazę specyficzną przed zawodami.

### Szczególnie sprawdź

- Interwały krótkie i długie.
- Trening progowy.
- Ciągłe tempo.
- Odcinki w tempie docelowego biegu.
- Długie biegi.
- Tygodnie odciążające.
- Ostatnie 14 dni przed startem.

### Oczekiwany efekt

Plan powinien budować wytrzymałość i zdolność utrzymania tempa na 10 km, a nie tylko zwiększać liczbę szybkich odcinków.

---

## 8. POPRAWA PRZYGOTOWANIA MARATOŃSKIEGO

### Problem

Maraton pozostaje najsłabszym dystansem.

Średnia V23 w szerokiej macierzy wynosi około 6,07/10.

### Wymagane zmiany

#### A. Ocena gotowości

Uwzględnij:

1. Staż biegowy.
2. Historię kilometrażu.
3. Najdłuższe ostatnie biegi.
4. Doświadczenie półmaratońskie i maratońskie.
5. Liczbę dostępnych treningów.
6. Czas do zawodów.
7. Aktualne ograniczenia zdrowotne.
8. Cel: ukończenie lub wynik czasowy.

Nie generuj ambitnego planu maratońskiego bez odpowiedniej podstawy.

#### B. Progresja długich biegów

1. Planuj wzrost obciążenia stopniowo.
2. Kontroluj zarówno kilometry, jak i czas trwania.
3. Uwzględniaj tempo biegacza.
4. Nie wymuszaj długich biegów ponad rozsądny czas.
5. Uwzględniaj tygodnie regeneracyjne.
6. Unikaj nadmiernego udziału długiego biegu.
7. Rozróżniaj początkujących i zaawansowanych.

#### C. Trening specyficzny

Dodaj lub popraw:

1. Bloki w tempie maratońskim.
2. Długie biegi z kontrolowanymi fragmentami specyficznymi.
3. Jednostki progowe odpowiednie dla maratończyka.
4. Progresję objętości pracy specyficznej.
5. Ograniczenia intensywności.
6. Wskazówki dotyczące ćwiczenia odżywiania podczas długich biegów.

#### D. Taper

1. Dostosuj długość taperu do obciążeń.
2. Redukuj objętość bez całkowitego usuwania bodźców.
3. Ogranicz zmęczenie przed zawodami.
4. Uwzględnij datę i dzień tygodnia startu.

#### E. Wykonalność

Dla 1–2 treningów tygodniowo nie zakładaj automatycznie pełnej gotowości maratońskiej.

Zwracaj czytelny status oraz uzasadnienie.

### Testy

Przetestuj maraton przy wszystkich częstotliwościach 1–7 oraz różnych poziomach i historiach kilometrażu.

---

## 9. POPRAWA PÓŁMARATONU

### Wymagane zmiany

1. Sprawdź, czy długie biegi są wystarczające, ale nie dominują planu.
2. Rozwijaj wytrzymałość progową.
3. Wprowadzaj treningi specyficzne pod półmaraton.
4. Dopasuj długość bloków tempa do zaawansowania.
5. Kontroluj regenerację po długich jednostkach.
6. Nie stosuj mechanicznie modelu 10 km z dłuższym biegiem.
7. Dostosuj taper do dystansu.
8. Rozróżniaj ukończenie i ambitny wynik czasowy.

---

## 10. POPRAWA 5 KM

### Wymagane zmiany

1. Zadbaj o rozwój wytrzymałości tlenowej.
2. Rozwijaj tolerancję wysiłku specyficznego dla 5 km.
3. Dobieraj krótsze i dłuższe interwały do poziomu.
4. Nie zastępuj całego treningu jakościowego bardzo szybkimi odcinkami.
5. Zachowuj odpowiedni udział treningu spokojnego.
6. Popraw progresję czasu pracy.
7. Nie stosuj identycznej periodyzacji jak dla półmaratonu.
8. Uwzględniaj krótki taper.

---

# CZĘŚĆ III — PROGRESJA I INDYWIDUALIZACJA

## 11. NOWY SYSTEM PROGRESJI TRENINGÓW JAKOŚCIOWYCH

### Problem

V23 nadal powtarza część jednostek bez wystarczającego uzasadnienia.

### Wymagane zmiany

Dla każdego treningu jakościowego przechowuj i analizuj:

1. Typ bodźca.
2. Liczbę powtórzeń.
3. Długość odcinków.
4. Łączny czas intensywnej pracy.
5. Tempo lub RPE.
6. Czas odpoczynku.
7. Rodzaj odpoczynku.
8. Poprzednie podobne treningi.
9. Fazę przygotowania.
10. Poziom zmęczenia i gotowości.

### Jak ma działać progresja

- Zwiększaj trudność tylko wtedy, gdy istnieje uzasadnienie.
- Nie zwiększaj jednocześnie liczby powtórzeń, tempa i długości odcinków.
- Dopuszczaj tygodnie stabilizacyjne.
- Dopuszczaj powtórzenie jednostki w celu utrwalenia adaptacji.
- Zmieniaj bodziec, gdy jest to uzasadnione fazą przygotowania.
- Nie stosuj losowej różnorodności.
- Nie wymuszaj progresji przy zmęczeniu.

### Przykładowa progresja

Dla przygotowanego biegacza na 10 km możliwa jest progresja:

- 5 × 600 m.
- 4 × 800 m.
- 4 × 800 m z krótszą przerwą.
- 3 × 1000 m.
- 4 × 1000 m.

To tylko ilustracja. Nie koduj jej jako uniwersalnego szablonu.

### Testy

Sprawdź, czy:

- Trudność nie rośnie nadmiernie.
- Całkowita praca jakościowa jest kontrolowana.
- Regeneracja pozostaje wystarczająca.
- Powtórzenia treningów mają uzasadnienie.
- Bodźce odpowiadają dystansowi.

---

## 12. INTELIGENTNA PROGRESJA KILOMETRAŻU

### Problem

Stała objętość przez wiele tygodni może ograniczać rozwój, ale mechaniczne zwiększanie kilometrażu również jest błędem.

### Wymagane zmiany

1. Uwzględniaj historię obciążeń.
2. Rozróżniaj stabilizację, rozwój i regenerację.
3. Uwzględniaj tolerancję objętości.
4. Oceniaj obciążenie w kontekście częstotliwości.
5. Kontroluj największy pojedynczy bieg.
6. Nie zwiększaj objętości tylko dlatego, że minął tydzień.
7. Nie wymuszaj osiągnięcia docelowego kilometrażu.
8. Zachowuj odpowiednie odciążenia.
9. Rozróżniaj kilometraż od całkowitego stresu treningowego.
10. Sprawdzaj przejścia między tygodniami.

Nie traktuj reguły 10% jako uniwersalnej gwarancji bezpieczeństwa.

---

## 13. INDYWIDUALIZACJA ZAWODNIKA

### Problem

Różne profile mogą nadal otrzymywać zbyt podobne plany.

### Wymagane zmiany

Generator powinien uwzględniać:

1. Wiek.
2. Staż biegowy.
3. Poziom zaawansowania.
4. Aktualne wyniki.
5. Kilometraż.
6. Historię ostatnich tygodni.
7. Najdłuższy ostatni bieg.
8. Tolerancję intensywności.
9. Tolerancję objętości.
10. Dostępność dni.
11. Cel treningowy.
12. Termin zawodów.
13. Wcześniejsze przeciążenia.
14. Aktualne ograniczenia.
15. Zmęczenie.
16. Preferencje dotyczące treningów.

### Jak poprawić

Wprowadź jawny model profilu zawodnika i politykę doboru obciążeń.

Nie wystarczy dopisać pola do wejścia. Dane muszą wpływać na konkretne decyzje generatora tam, gdzie ma to sens.

### Testy czułości

Porównuj pary profili różniące się jednym parametrem.

Sprawdzaj:

- Czy plan zmienia się we właściwym kierunku.
- Czy zmiana jest proporcjonalna.
- Czy nie pojawiają się niebezpieczne skutki uboczne.
- Czy generator potrafi uzasadnić różnice.

Nie wymagaj, by każda drobna zmiana danych zawsze zmieniała plan.

---

## 14. TEMPA, TĘTNO I RPE

### Wymagane zmiany

1. Wyznaczaj tempa przede wszystkim z aktualnej formy.
2. Nie przyspieszaj automatycznie na podstawie samego celu.
3. Oddziel tempo treningowe od tempa startowego.
4. Uwzględniaj niepewność szacunków.
5. Oznaczaj HRmax wyliczony ze wzoru jako szacunkowy.
6. Nie stosuj tętna jako głównego celu krótkich interwałów.
7. Uwzględniaj RPE jako alternatywę.
8. Nie przypisuj zbyt precyzyjnych zakresów bez wystarczających danych.
9. Zapewnij spójność tempa, RPE i celu jednostki.
10. Aktualizuj tempa ostrożnie po nowych wynikach.

### Testy

- Aktualny wynik lepszy niż cel.
- Cel znacznie szybszy niż aktualny wynik.
- Brak danych HR.
- HRmax szacowany.
- HRmax zmierzony.
- Różne wyniki na 5 km i 10 km.
- Nowy wynik testowy.
- Niska gotowość po przerwie.

---

# CZĘŚĆ IV — ADAPTACJA PLANU

## 15. ROZBUDOWA `updatePlan`

Przeanalizuj istniejący moduł `model/adaptation_v23.mjs`.

### Wymagane zmiany

1. Obsługuj pominięte treningi.
2. Obsługuj skrócone treningi.
3. Obsługuj zmniejszoną intensywność.
4. Obsługuj wysokie RPE.
5. Obsługuj zmęczenie.
6. Obsługuj przerwy treningowe.
7. Obsługuj nowy rekord lub test.
8. Obsługuj zmianę dostępnych dni.
9. Obsługuj zgłoszenie bólu.
10. Obsługuj zmianę daty zawodów.
11. Zachowuj historię wykonanych jednostek.
12. Nie modyfikuj wykonanej przeszłości.
13. Nie nadrabiaj automatycznie opuszczonych akcentów.
14. Nie zwiększaj gwałtownie obciążeń po pojedynczym dobrym treningu.
15. Zapewnij deterministyczne działanie dla tych samych danych.

### Jak poprawić

Zastosuj mechanizm:

**Dane wykonania → ocena gotowości → wybór bezpiecznej korekty → ponowne zaplanowanie przyszłości → walidacja → wyjaśnienie zmian.**

### Obowiązkowe testy

- Jeden opuszczony trening.
- Dwa opuszczone treningi.
- Tydzień przerwy.
- Dwa tygodnie przerwy.
- Zmęczenie po długim biegu.
- Zbyt wysoki RPE.
- Nowy rekord.
- Pogorszenie dyspozycji.
- Zmiana dni dostępności.
- Ból lub uraz.
- Zawody za kilka dni.

Zachowaj zgodność wsteczną API.

---

# CZĘŚĆ V — ROZKŁAD TYGODNIA I TAPER

## 16. PLANOWANIE DNI TRENINGOWYCH

### Wymagane zmiany

1. Uwzględniaj wszystkie dostępne dni.
2. Kontroluj odstępy między trudnymi jednostkami.
3. Kontroluj odstęp między długim biegiem i interwałami.
4. Uwzględniaj przejście między tygodniami.
5. Unikaj nieuzasadnionych długich przerw.
6. Nie wymuszaj treningu w niedostępnym dniu.
7. Informuj o ograniczeniu faktycznej częstotliwości.
8. Nie obiecuj 7 treningów, gdy generator planuje 5.
9. Rozróżniaj ograniczenie bezpieczeństwa od błędu planowania.
10. Nie maksymalizuj liczby treningów kosztem regeneracji.

### Szczególny przypadek: 6–7 dni

Sprawdź, dlaczego generator ogranicza częstotliwość dla części profili.

Jeśli ograniczenie jest uzasadnione, zachowaj je i wyjaśnij.

Jeśli wynika z arbitralnego limitu, popraw politykę dla odpowiednio przygotowanych zawodników.

Nie zwiększaj liczby jednostek wyłącznie dla poprawy punktacji.

---

## 17. TAPER I TYDZIEŃ STARTOWY

### Wymagane zmiany

1. Traktuj zawody jako rzeczywiste obciążenie.
2. Wliczaj start do liczby jednostek zgodnie z jednoznaczną konwencją.
3. Dostosuj taper do dystansu.
4. Uwzględnij ostatnie tygodnie obciążenia.
5. Redukuj objętość bez nieuzasadnionego usuwania intensywności.
6. Nie wymuszaj rozruchu dzień przed zawodami.
7. Unikaj niepotrzebnych treningów dzień po dniu.
8. Obsługuj start w dowolnym dniu tygodnia.
9. Kontroluj długi bieg przed zawodami.
10. Sprawdź przejście do regeneracji po starcie.

### Testy

Zawody w każdy dzień tygodnia dla wszystkich czterech dystansów.

---

# CZĘŚĆ VI — SYSTEM OCENIANIA

## 18. ZACHOWANIE MIERNIKA V23

**Nie zmieniaj historycznej implementacji miernika V23.**

Jest ona niezbędna do uczciwego porównania.

W szczególności:

1. Zachowaj oryginalne wagi.
2. Zachowaj oryginalne kary.
3. Zachowaj interpretację kategorii.
4. Zachowaj testy kalibracyjne.
5. Zachowaj wyniki bazowe.
6. Dodaj identyfikator wersji miernika do raportów.

Jeżeli odkryjesz błąd w mierniku V23, nie poprawiaj go po cichu. Udokumentuj problem i przygotuj osobną poprawioną implementację.

## 19. MIERNIK DIAGNOSTYCZNY V24

Możesz stworzyć dodatkowy miernik V24, ale musi być niezależny od historycznego V23.

### Powinien analizować

1. Bezpieczeństwo.
2. Regenerację.
3. Indywidualizację.
4. Progresję objętości.
5. Progresję jakościową.
6. Specyfikę dystansu.
7. Monotonię.
8. Rozkład tygodnia.
9. Taper.
10. Wykonalność celu.
11. Spójność temp.
12. Reakcję na ograniczenia.

### Dodatkowe wymagania

- Podawaj oceny cząstkowe.
- Pokazuj konkretne przyczyny obniżenia oceny.
- Unikaj nadmiernej liczby wyników 10/10.
- Nie karz planów za uzasadnione odciążenie.
- Nie nagradzaj sztucznego zwiększania kilometrażu.
- Rozróżniaj niewykonalny cel od błędu generatora.
- Testuj miernik na celowo pogorszonych planach.
- Sprawdzaj, czy zmiana jednej cechy nie powoduje nielogicznego skoku oceny.

### Najważniejsze

**V23 i V24 muszą być oceniane tym samym miernikiem w każdej tabeli porównawczej.**

---

# CZĘŚĆ VII — TESTY I WALIDACJA

## 20. MACIERZ 28 PODSTAWOWYCH KOMBINACJI

Przetestuj:

- 5 km × 1–7 dni.
- 10 km × 1–7 dni.
- Półmaraton × 1–7 dni.
- Maraton × 1–7 dni.

Dla każdego przypadku zapisz:

1. Ocenę V23.
2. Ocenę V24.
3. Różnicę.
4. Kilometraż.
5. Długi bieg.
6. Liczbę akcentów.
7. Faktyczną liczbę treningów.
8. Ostrzeżenia.
9. Wykonalność.
10. Główne przyczyny punktacji.

## 21. MACIERZ 1008 SCENARIUSZY

Odtwórz dokładnie historyczny zestaw 1008 scenariuszy.

Nie zmieniaj:

- Profilów.
- Dystansów.
- Częstotliwości.
- Dat.
- Celów.
- Parametrów.
- Wersji historycznego scoringu.

### Raport obowiązkowy

- Średnia V23.
- Średnia V24.
- Różnica.
- Liczba poprawionych przypadków.
- Liczba remisów.
- Liczba pogorszonych przypadków.
- Średnie dla dystansów.
- Średnie dla częstotliwości.
- Największe poprawy.
- Największe regresje.
- Rozkład ocen.
- Wyniki bezpieczeństwa.

### Cele jakościowe

Traktuj poniższe wartości jako cele rozwojowe, nie warunki pozwalające manipulować testami:

- Średnia V24 wyższa od V23 w macierzy 1008.
- Mniej rzeczywistych regresji niż 330.
- Poprawa średniej dla 10 km.
- Poprawa planów jednodniowych.
- Poprawa maratonu.
- Brak wzrostu liczby krytycznych naruszeń bezpieczeństwa.

Jeśli nie uda się osiągnąć celu, pokaż prawdziwy wynik i przyczyny.

## 22. DODATKOWA MACIERZ PROFILI

Przetestuj co najmniej 20 zróżnicowanych profili, obejmujących:

1. Początkującego 5 km.
2. Początkującego 10 km.
3. Średniozaawansowanego 5 km.
4. Średniozaawansowanego 10 km.
5. Zaawansowanego 5 km.
6. Zaawansowanego 10 km.
7. Półmaratończyka z małym kilometrażem.
8. Półmaratończyka z dużym kilometrażem.
9. Początkującego aspirującego do maratonu.
10. Doświadczonego maratończyka.
11. Biegacza 50+.
12. Biegacza 60+.
13. Osobę po przerwie.
14. Osobę z nieregularnym treningiem.
15. Osobę z dwoma dostępnymi dniami.
16. Osobę z jednym dostępnym dniem.
17. Osobę z sześcioma dniami.
18. Osobę z siedmioma dniami.
19. Osobę z ambitnym celem czasowym.
20. Osobę chcącą tylko ukończyć zawody.

Nie twórz sztucznych profili wyłącznie pod korzystne wyniki.

## 23. TESTY METAMORFICZNE

Dodaj testy sprawdzające logiczne zależności.

Przykłady:

- Mniejsza dostępność nie powinna powodować nieuzasadnionego zwiększenia całkowitego obciążenia.
- Większe zmęczenie nie powinno powodować trudniejszego planu.
- Krótszy staż nie powinien prowadzić do agresywniejszej progresji bez uzasadnienia.
- Aktywny uraz nie powinien skutkować zwiększeniem intensywności.
- Bardziej ambitny cel nie powinien automatycznie zmieniać wszystkich treningów na szybsze.
- Dłuższy czas przygotowania nie powinien wymuszać nadmiernej objętości.
- Pominięty trening nie powinien być automatycznie nadrabiany.
- Zmiana daty zawodów powinna poprawnie przebudować taper.

Uwzględniaj wyjątki uzasadnione kontekstem i dokumentuj je.

## 24. TESTY ODPORNOŚCI

Sprawdź:

1. Brakujące dane.
2. Nieprawidłowe wartości.
3. Sprzeczne dane.
4. Bardzo krótki czas do zawodów.
5. Bardzo długi czas do zawodów.
6. Niski kilometraż.
7. Wysoki kilometraż.
8. Nietypowe dni dostępności.
9. Bardzo wolne tempa.
10. Bardzo szybkie tempa.
11. Różne daty i granice tygodni.
12. Wielokrotne aktualizacje planu.
13. Nieprawidłową historię treningową.
14. Niewykonalne cele.

Generator nie powinien generować niepoprawnych wartości liczbowych, nieuzasadnionych ujemnych dystansów ani niespójnych dat.

---

# CZĘŚĆ VIII — KONKRETNY PLAN REFERENCYJNY

## 25. ANALIZA 10 KM / 3 DNI

Odtwórz profil:

- Wiek: 35 lat.
- Poziom: średniozaawansowany.
- Kilometraż: 35 km/tydzień.
- Najdłuższy ostatni bieg: 14 km.
- Aktualny wynik 10 km: 52:00.
- Cel: 53:34.
- Początek: 2 listopada 2026.
- Zawody: 28 marca 2027.
- Treningi: 3 tygodniowo.

### Porównaj V23 i V24

1. Pierwsze cztery tygodnie.
2. Datę pierwszego akcentu.
3. Wszystkie treningi interwałowe.
4. Wszystkie treningi progowe.
5. Progresję czasu intensywnej pracy.
6. Progresję kilometrażu.
7. Tygodnie regeneracyjne.
8. Długie biegi.
9. Ostatnie trzy tygodnie.
10. Tydzień startowy.
11. Dobór tempa.
12. Dopasowanie do celu.
13. Liczbę powtórzonych jednostek.
14. Uzasadnienie zmian.

Przygotuj pełne plany w czytelnym formacie oraz raport porównawczy.

Nie zakładaj, że V24 jest lepsza — wykaż to na podstawie rzeczywistych danych.

---

# CZĘŚĆ IX — ARCHITEKTURA I IMPLEMENTACJA

## 26. UPORZĄDKOWANIE KODU

Nie rozbudowuj bez końca jednego pliku.

W miarę potrzeby wydziel:

- Model profilu biegacza.
- Politykę częstotliwości.
- Model progresji.
- Dobór treningów jakościowych.
- Model maratoński.
- Planowanie taperu.
- Adaptację planu.
- Walidację bezpieczeństwa.
- Scoring.
- Diagnostykę regresji.

Nie twórz zbędnych abstrakcji.

Zachowaj zgodność istniejących interfejsów.

## 27. JAKOŚĆ ZMIAN

Dla każdej istotnej poprawki:

1. Zidentyfikuj problem.
2. Napisz test odtwarzający.
3. Zaimplementuj zmianę.
4. Uruchom test.
5. Uruchom testy regresyjne.
6. Sprawdź wpływ na inne profile.
7. Udokumentuj wynik.

Nie zastępuj działających funkcji atrapami.

Nie usuwaj historycznych testów.

Nie poprawiaj wyników przez zmianę definicji sukcesu.

## 28. WYDAJNOŚĆ

Sprawdź, czy nowy system:

- Nie wykonuje zbędnych obliczeń.
- Nie generuje planów wielokrotnie bez potrzeby.
- Nie ma niekontrolowanej rekurencji.
- Nie powoduje istotnego wzrostu zużycia pamięci.
- Potrafi wykonać szeroką macierz testową w rozsądnym czasie.

Jeśli dodajesz optymalizację, zachowaj deterministyczność wyników.

---

# CZĘŚĆ X — RAPORTY I GOTOWY PAKIET

## 29. WYMAGANE RAPORTY

Przygotuj:

1. `README_V24.md`
2. `RAPORT_TESTOW_V24.md`
3. `POROWNANIE_V23_V24.md`
4. `DIAGNOZA_REGRESJI_V23.md`
5. `BENCHMARK_28_V23_V24.md`
6. `BENCHMARK_1008_V23_V24.md`
7. `ANALIZA_10KM_3DNI.md`
8. `ZMIANY_ALGORYTMU_V24.md`
9. `OGRANICZENIA_V24.md`
10. `REKOMENDACJE_V25.md`

Dla wyników liczbowych zapisz również dane JSON, aby umożliwić niezależne przeliczenie średnich.

## 30. KOŃCOWA OCENA V24

Raport końcowy musi podawać:

- Liczbę linii głównego generatora.
- Liczbę linii wszystkich modułów produkcyjnych.
- Rozmiar plików.
- Liczbę testów PASS/FAIL.
- Liczbę przetestowanych scenariuszy.
- Średnią V23 i V24 w tym samym mierniku.
- Wyniki dla każdego dystansu.
- Wyniki dla 1–7 treningów.
- Pełną tabelę 28 kombinacji.
- Wyniki macierzy 1008.
- Liczbę poprawionych i pogorszonych scenariuszy.
- Najważniejsze naprawione błędy.
- Pozostałe ograniczenia.
- Wyniki testów bezpieczeństwa.
- Informację o testach nieuruchomionych.

Nie deklaruj oceny 10/10 bez odpowiedniego uzasadnienia.

## 31. GOTOWY ZIP

Przygotuj:

**RunPlanner_V24.zip**

Pakiet powinien zawierać:

- Pełny kod V24.
- Wszystkie moduły produkcyjne.
- Testy.
- Skrypty uruchomieniowe.
- Raporty.
- Wyniki JSON.
- Dokumentację.
- Porównanie V23/V24.
- Przykładowe plany.
- Niezmienioną bazę V23 lub jednoznaczne odniesienie do niej.
- Instrukcję uruchomienia.

Sprawdź integralność archiwum.

Zapisz zmiany w repozytorium GitHub, aby można było pobrać kompletny projekt.

## 32. WARUNKI ZAKOŃCZENIA

Nie kończ po przygotowaniu planu prac.

Zadanie uznaj za zakończone dopiero po:

1. Diagnozie regresji.
2. Wprowadzeniu rzeczywistych zmian.
3. Dodaniu testów.
4. Uruchomieniu testów.
5. Porównaniu V23/V24.
6. Sprawdzeniu bezpieczeństwa.
7. Przygotowaniu raportów.
8. Wygenerowaniu ZIP.
9. Zweryfikowaniu zawartości ZIP.

Jeśli ograniczenia czasu lub zasobów uniemożliwią ukończenie całości:

- Zachowaj działający kod.
- Zapisz wykonane zmiany.
- Podaj wyniki faktycznie wykonanych testów.
- Wskaż niedokończone zadania.
- Nie oznaczaj częściowej implementacji jako kompletnej V24.

---

# OSTATECZNY PRIORYTET

**V24 ma być rzeczywiście lepszym generatorem treningowym niż V23, szczególnie w szerokiej macierzy 1008 scenariuszy.**

Nie optymalizuj kodu pod wynik testu kosztem jakości.

Nie poprawiaj miernika po to, żeby podnieść ocenę.

Nie zwiększaj objętości ani intensywności tylko po to, żeby plan wyglądał bardziej zaawansowanie.

Nie usuwaj ograniczeń bezpieczeństwa, aby poprawić scoring.

Dostarcz działającą, przetestowaną, udokumentowaną i uczciwie porównaną wersję V24.