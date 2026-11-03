# Miernik V23.0.0

Niezależna implementacja: `scoring/v23.mjs`. Nie importuje generatora, jego audytu, oceny gotowości ani wewnętrznej punktacji. Rozróżnia brak technicznych naruszeń od wystarczającego przygotowania. Wynik jest heurystyczny, bez walidacji klinicznej i bez kalibracji na rzeczywistych rezultatów biegaczy.

| Kategoria | Waga | Przykładowe oceniane zachowania |
|---|---:|---|
| Bezpieczeństwo i regeneracja | 25% | Skoki względem efektywnej bazy, ograniczenia czasu, odstępy, odciążenia, udział intensywnej pracy i dominacja długiego. |
| Indywidualizacja | 20% | Dopasowanie startu do historii/przerwy, dostępność, niepewność danych, staż/historia, kontekst celu. |
| Progresja | 15% | Objętość w kontekście utrzymania/poprawy, ewolucja dawki jakości i stabilizacja. |
| Dopasowanie do dystansu | 15% | Realna częstotliwość, km i długość jednostki, horyzont, specyfika oraz zgodność tempa odcinków z celem. |
| Jakość treningów | 15% | Oprawa jakości, celowa różnorodność części głównej, odpowiednia dawka i wczesny łagodny bodziec dla przygotowanych. |
| Kalendarz i taper | 10% | Liczenie zawodów jako jednostki, redukcja treningów, kolizje dni, intensywność przed startem. |

Każda kategoria zawiera jawne kryteria pozytywne: wartości 0–1, wagi wewnętrzne oraz uzasadnienia w `components.*.criteria`. Ich średnia ważona ×10 jest bazą kategorii. Naruszenia są osobnymi zdarzeniami z kodem, datą i ciężarem w `issues`. Wynik kategorii = baza × exp(−suma ciężarów / sqrt(liczba tygodni)). Ocena procesu `weightedTotal` = suma wyników kategorii × powyższe wagi. Ocena końcowa `total` = ocena procesu × `goalFactor`, gdzie `goalFactor = sqrt(adequacy)`, a `adequacy` jest najmniejszą z ograniczonych do 1 relacji: rzeczywista częstotliwość / minimum dystansu, maksymalna objętość / minimum dystansu, najdłuższy bieg / minimum dystansu. To jawna ciągła korekta przydatności do celu, nie ograniczenie liczby kar ani kliniczna prognoza. Wartości są zwracane oddzielnie: bezpieczny, ale niewystarczający plan może mieć wysoką ocenę bezpieczeństwa i niską ocenę końcową. Nie ma limitu liczby kar; 11., 20. i kolejne naruszenia nadal wpływają na wynik. Naturalna granica skali to 0–10.

Brak krytycznych błędów nie wystarcza do 10: nieznana historia, brak bodźca specyficznego, monotonia, opóźnione wejście w jakość lub brak realnej bazy obniżają kryteria pozytywne. Brak jakości nie jest karą bezpieczeństwa u początkującego, chorego, wracającego po przerwie lub osoby biegającej raz w tygodniu; ograniczenia przygotowania do wybranego dystansu są oceniane osobno. Nie nagradza się km ani intensywności bez ograniczeń: dawka ma skończony cel, a nadmiar jest osobną karą.

Utrzymanie formy jest wywnioskowane z wejścia i bieżącego wyniku; stabilny kilometraż nie jest wtedy wadą. Przy poprawie/ukończeniu analizuje się rozwój bazy i dawki jakości. Różnorodność dotyczy rzeczywistych recept części głównej: długości, powtórzeń i odpoczynków, nie nazw, rozgrzewek ani etykiet. Sama nowa etykieta intencji nie daje punktów. Test kontrfaktyczny potwierdza odporność na zmianę etykiety i sfabrykowanie audytu.

Miernik kontroluje każdy tydzień i pojedyncze zdarzenia, a kryteria pozytywne oceniają cały proces. Surowe `tygodnie`, listy jednostek i datowane problemy pozwalają odtworzyć ocenę. Suma km z zawodami jest oddzielona od objętości treningów przy ocenie taperu. Tempo odcinka startowego musi być zgodne z podanym celem, sama nazwa `tempo_startowe` nie wystarcza.

## Kalibracja i uczciwość porównania

`testy/benchmark_v23.mjs` zawiera ręcznie skonstruowany plan referencyjny oraz osiem jawnych pogorszeń: nadmierny kilometraż, brak progresji, monotonia, nadmiar intensywności, zły taper, zły dystans, niewykonalna częstotliwość i niebezpieczny powrót. Żaden z generatorów nie tworzy tych wzorców. Testy `kalibracja_v23.mjs` wymagają niższej oceny każdego pogorszenia i reakcji na kolejne liczne naruszenia.

Podczas kalibracji wykryto fałszywy pozytyw: sama etykieta tempa startowego dawała kredyt przy zmianie celu z 10 km na maraton. Naprawiono interpretację faktycznego tempa i horyzontu, nie dostosowywano wyniku V23 do pożądanej przewagi. Usunięto także bonus za samą etykietę intencji. Obie wersje zostały następnie przeliczone końcową implementacją miernika; raport przechowuje jego wersję i SHA-256.

W pakiecie V22 nie było osobnego `benchmark_v22.mjs`. Zachowano istniejące `porownanie28`, pełny sweep, `independentChecks`, `score`, `scoreV21`, miernik V22 i wcześniejsze porównania. Powyższe ręczne wzorce są odtwarzalnym uzupełnieniem, nie zamianą historycznych kryteriów.

## Granice interpretacji

Wagi, minima dystansowe, udział intensywności i definicje progresji są heurystykami. Indywidualizacja oceniona z pojedynczego planu ma ograniczenia; dlatego są też testy metamorfczne między profilami. To nie jest laboratoryjna kwalifikacja do startu ani prognoza prawdopodobieństwa urazu. Nie zmniejszamy wyniku referencji do arbitralnego 7,6 ani nie wymuszamy wyniku V23 powyżej V22.

Dodatkowe kontrole kalibracji wymagają, aby niewykonalny maraton przy jednym biegu miał ocenę końcową poniżej 7 mimo zachowanego bezpieczeństwa, oraz aby taper był oceniany względem szczytu przed taperem, nigdy względem własnego zawyżonego kilometrażu. Gorsze plany nie mogą podnosić sobie punktów przez zawyżenie referencji.
