# Kompletny prompt dla Codex: Run Planner V21 → V22

**Uwaga o pochodzeniu:** Jest to odtworzona, samodzielna specyfikacja zgodna z zakresem wcześniejszego promptu V22 (w tym kontynuacją punktów 18–25), a nie dosłowna kopia wcześniejszego WritingBlock. Nie wymaga znajomości wcześniejszych rozmów.

## 1. Rola i zadanie
Jesteś doświadczonym inżynierem JavaScript/Node.js, architektem systemów planowania treningu i krytycznym recenzentem metodologii biegania. Masz **faktycznie zbudować V22**, a nie tylko zaproponować zmiany. Pracuj wyłącznie na dołączonym kompletnym pakiecie V21 jako źródle bieżącego kodu. Zadbaj o kompatybilność, bezpieczeństwo, testy i niezależną ocenę jakości. Nie pisz projektu od zera.

## 2. Pliki wejściowe i priorytet źródeł
Kod: `projekt/v21/planGenerator_v21.js`. Testy: `projekt/v21/testy/`. Raporty i wyniki: `projekt/v21/raport_testow_v21.md`, `ocena_jakosci_v21.md`, `wyniki/`. Historia: `zmiany_v20_v21.md`, `README.md`, katalogi `baza/`, `archiwum_v20/`. Instrukcje: `AGENTS.md`, `HISTORIA_I_KONTEKST.md`. Faktyczny kod i uruchomione testy mają pierwszeństwo nad historycznymi streszczeniami.

## 3. Inwentaryzacja przed zmianami
Przeczytaj kod, eksporty, API, format wejścia/wyjścia, heurystyki, audyt i scoring. Zidentyfikuj nieosiągalne gałęzie, konflikty reguł, miejsca sztucznego podbijania ocen, założenia niezgodne z treningiem. Uruchom bazowe testy, zanotuj Node, czas, liczbę asercji i awarie. Nie deklaruj uruchomienia testów, których nie wykonałeś.

## 4. Cel jakościowy V22
Wysoka jakość planów w praktyce, szczególnie: indywidualizacja, pełny maraton, 1–2 biegi/tydzień, tempa i intensywność, progresja obciążeń, regeneracja, long run, specyfika dystansu, taper, wykonalność. Nie optymalizuj wyłącznie testowego wyniku 1–10. Gdy dane są niewystarczające, zachowuj ostrożność i wyjaśniaj niepewność.

## 5. Indywidualizacja rzeczywista, a nie pozorna
Dane o poziomie, aktualnym tygodniowym kilometrażu, ostatnich tygodniach, najdłuższym biegu, częstotliwości, wyniku sportowym, doświadczeniu, wieku, ograniczeniach, historii urazów, czasie do startu i celu muszą wpływać w uzasadniony sposób na plan. Ustal, które zmiany wejścia powinny zmieniać strukturę, intensywność, objętość lub komunikat o wykonalności. Nie wymuszaj różnic, gdy nie są merytorycznie potrzebne. Dodaj testy czułości i uzasadnienia.

## 6. Osobny pełny model maratoński
Zaprojektuj odpowiednie do poziomu i historii biegacza: bazę, długie biegi, wytrzymałość specyficzną, trening w tempie maratońskim, redukcję obciążeń, taper i bezpieczny pułap objętości. Odróżnij cel „ukończyć” od ambitnego wyniku czasowego. Nie twórz pozornej gotowości przy zbyt krótkim okresie lub małym kilometrażu. Zadbaj o zróżnicowanie względem półmaratonu. Uzasadnij ograniczenia.

## 7. Jeden bieg tygodniowo
Nie udawaj pełnego przygotowania startowego przy jednej jednostce. Stwórz realistyczny model podtrzymania, stopniowego wejścia w trening lub ograniczonego przygotowania, zależnie od celu. Zadbaj o wykonalność i jasne ostrzeżenia. Nie próbuj upchnąć wszystkich bodźców w jednym biegu.

## 8. Dwa biegi tygodniowo
Zaprojektuj sensowną rotację jednostki spokojnej/dłuższej i jakościowej zależnie od dystansu, poziomu i celu; kontroluj przerwy, kolejność i kumulację zmęczenia. Unikaj stałego, nieadekwatnego udziału długiego biegu w tygodniu. Zróżnicuj 5 km/10 km/HM/maraton, nie łamiąc bezpieczeństwa.

## 9. Trzy do siedmiu biegów tygodniowo
Dopasuj realną liczbę sesji do zdolności i doświadczenia. Jeśli deklaracja jest ograniczana, zwróć faktyczną częstotliwość, powód i skutki. Kontroluj rozmieszczenie trudnych bodźców, długiego biegu i dni regeneracji, również na granicy tygodni. Nie wstawiaj niepotrzebnych biegów tylko dla liczby.

## 10. System tempa i intensywności
Ujednolić tempo na podstawie wiarygodnych danych wynikowych, z rozsądnymi zakresami i kontrolą jakości. Oddziel bieg spokojny, regeneracyjny, tempo/progowy, interwały, rytmy, long run i odcinki specyficzne. Nie stosuj ślepo jednego przelicznika dla wszystkich dystansów, poziomów i doświadczeń. W razie braku wiarygodnego wyniku stosuj wysiłek/RPE lub ostrożne zakresy, a nie fikcyjną precyzję. Zadbaj o zgodność tempa z celem i wykonalnością.

## 11. Progresja objętości i obciążenia
Kontroluj wzrost km, czasu, trudności i liczby mocnych sesji, uwzględniając historię oraz powrót po przerwie. Unikaj arbitralnego mechanicznego „10% zawsze”. Zaplanuj lżejsze tygodnie, odbudowę po nich, ograniczenia przy ryzyku i krótkim horyzoncie. W szczególności wyeliminuj nieuzasadnione `WZROST_KM` z V21 bez ukrywania problemu.

## 12. Regeneracja
Zachowaj rozróżnienie regeneracja vs spokojny Z2. Nie produkuj długich biegów „regeneracyjnych” dla dopięcia kilometrażu. Dobieraj regenerację po rzeczywistym obciążeniu, nie tylko po etykiecie treningu. Uwzględniaj trudne jednostki, long run i granice tygodni.

## 13. Długie biegi
Ustalaj bezpieczny dystans/czas i udział w tygodniu na podstawie faktycznej, nie deklarowanej objętości. Dla małej częstotliwości rozpoznaj nieuniknione kompromisy. Nie forsuj maratońskich długich biegów u nieprzygotowanych osób. Kontroluj bliskość startu i taper.

## 14. Treningi jakościowe
Zadbaj o progresję bodźców od krótszych do dłuższych odcinków, poprawną rozgrzewkę/schłodzenie, przerwy i sumę obciążenia. Dostosuj strukturę do 5 km, 10 km, HM i maratonu. Unikaj niepotrzebnie trudnych zestawień i powtarzania identycznych sesji przez cały cykl. Dopuszczaj brak jakości przy niskiej gotowości.

## 15. Taper i tydzień startowy
Wspieraj każdy dzień tygodnia startu, zwłaszcza poniedziałek i wtorek. Dopasuj długość taperu do dystansu, poziomu, tygodni treningu i objętości. Ogranicz long run i mocne bodźce przed startem. Uwzględnij dzień zawodów w strukturze i sumach, bez sztucznego podbijania objętości.

## 16. Wykonalność i bezpieczeństwo
Zachowaj `wykonalnosc` (`pelna`, `ograniczona`, `niewykonalna`) i `trybScisly`. Oceń realność celu czasowego, terminu, dystansu, częstości, historii i ograniczeń. W trybie ścisłym zwracaj jawny błąd/odmowę planu, jeśli wymagania są niewykonalne; w zwykłym trybie bezpieczną alternatywę i wyjaśnienie. Nie przedstawiaj algorytmu jako zastępstwa diagnostyki medycznej lub trenera.

## 17. Architektura i jakość kodu
A. Zachowaj publiczne API, ESM i format danych lub dostarcz adapter kompatybilności.
B. Rozdziel obliczenia intensywności, objętości, kalendarza, specyfiki dystansu, wykonalności i audytu tam, gdzie zmniejsza to złożoność; nie mnoż modułów bez potrzeby.
C. Zachowaj deterministyczność, niemutowanie wejścia, walidację typów/zakresów i jasne błędy; brak zbędnych zależności.
D. Unikaj ukrywania błędów, wyjątków i testów. Skrypty muszą zwracać niezerowy kod wyjścia przy awarii. Zachowaj wydajność dla dużych siatek scenariuszy.

## 18. Niezależny system oceny
Zachowaj wielokryterialną ocenę jakości, ale nie pozwalaj generatorowi oceniać samego siebie bez niezależnych reguł. Zdefiniuj kryteria bezpieczeństwa, wykonalności, progresji, intensywności, kalendarza, specyfiki dystansu, regeneracji i czytelności. Nie ukrywaj wielu ostrzeżeń przez limit kary. Podaj zarówno składowe, jak i wynik łączny. Oddziel jakość algorytmiczną od skuteczności zweryfikowanej u biegaczy.

## 19. Testy regresyjne i brzegowe
Zachowaj wszystkie istniejące testy. Dodaj przypadki: 1–7 dni; 5k/10k/HM/maraton; różne poziomy; skrajne objętości; młodsi/starsi; powrót po przerwie; mało czasu do startu; różne dni startu; brak wyniku; nierealny cel; ograniczenia i kontuzje; krótki i długi plan; plan przekraczający limit. Sprawdzaj invariants niezależnie od funkcji audytu generatora.

## 20. Sweep i pokrycie scenariuszy
Uruchom siatkę co najmniej równoważną V21 (historycznie 9408 scenariuszy), sprawdź unikalność kombinacji, wszystkie dni tygodnia i prawidłową propagację błędów. Pamiętaj o błędzie V19, gdy modulo po wcześniejszym próbkowaniu pokrywało wyłącznie niedziele. Jeśli sweep jest zbyt długi, jasno odróżnij wynik historyczny od własnego i uruchom mniejszy reprezentatywny zestaw z podaniem zakresu.

## 21. Porównanie V21 kontra V22
Na identycznych profilach i niezależnych regułach policz oceny, błędy krytyczne, ostrzeżenia, wykonalność, rzeczywistą częstotliwość, sumy km i typy treningów. Użyj tej samej wersji miernika do obu generatorów; jeśli zmieniasz metrykę, przelicz V21 ponownie. Nie sugeruj poprawy tylko dlatego, że zmieniłeś skalę lub nazwy ostrzeżeń.

## 22. Przykładowe plany
Wygeneruj i skontroluj ręcznie co najmniej 12 profili reprezentujących dystanse, poziomy, 1–2 i 3–6 biegów, ambitny/realistyczny cel, powrót po przerwie i niepełne dane. Pokaż przykładowe tygodnie i uzasadnij dobór bodźców. Zwróć uwagę na maraton i rzadką częstotliwość.

## 23. Raporty i dokumentacja
Przygotuj `README.md`, `zmiany_v21_v22.md`, `raport_testow_v22.md`, `ocena_jakosci_v22.md`, wyniki testów w formacie czytelnym maszynowo, instrukcję uruchomienia, opis API, znane ograniczenia i założenia modelu treningowego. Każda liczba testów musi wynikać z realnego uruchomienia albo być jawnie oznaczona jako historyczna.

## 24. Kryteria odbioru
Brak nowych krytycznych regresji, zachowana zgodność API, testy z poprawnymi exit codes, brak fałszywej wykonalności, spójne tempa i kilometraż, bezpieczne long run, sensowny taper, jasne ograniczenia 1–2 dni, istotna poprawa maratonu i indywidualizacji. Nie wymuszaj arbitralnego wyniku 10/10; pokaż obszary, które nadal wymagają walidacji.

## 25. Dostawa końcowa
Zapisz pełny katalog `v22/` i spakuj go do ZIP. Dołącz wszystkie źródła, testy, skrypty, README, raporty, porównanie z V21, przykłady i bazę porównawczą. Na końcu wypisz: faktycznie wykonane prace, testy uruchomione i nieuruchomione, wyniki, znane ryzyka, liczbę linii i bajtów głównego generatora, rekomendacje V23. Jeśli praca nie zmieści się w jednej sesji, zostaw stan umożliwiający kontynuację i nie twierdź, że V22 jest ukończona.

**Rozpocznij teraz od audytu V21 i testów bazowych, następnie implementuj. Nie kończ na planie działania.**
