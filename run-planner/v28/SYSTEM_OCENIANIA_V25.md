# System oceniania V25.0.0

Dwie skale są niezależne. Historyczny `scoring/v23.mjs` pozostaje bajtowo identyczny, wersja 23.0.0, SHA-256 `a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71`. Wszystkie porównania V24/V25 zawierają obie wersje ocenione tą samą skalą. Nie porównuje się wyniku V24/23.0.0 z V25/25.0.0 jako poprawy.

Nowy `scoring/v25.mjs` nie importuje generatora, jego polityk ani audytu. Ocenia rzeczywiste daty, dystanse, kroki, pracę i kontekst wejścia. Własna etykieta, `kontrola.score` i sfabrykowane pole scoreV25 nie podnoszą wyniku. Bezpieczne wykorzystanie jednego dnia nie oznacza pełnej gotowości maratońskiej.

## Rozdzielone wyniki

- `total`, `algorithmQuality`: jakość planowania dostępnych możliwości, 0–10. Przy prawidłowym wstrzymaniu z powodu zgłoszonego urazu/bólu i braku harmonogramu są null, a decisionQuality/status opisują decyzję; nie wymyśla się oceny nieistniejącego planu.
- `goalFeasibility`: orientacyjne spełnienie warunków celu, osobny wynik/status; nie mnoży oceny algorytmu.
- `uncertainty`: kompletność dowodów, osobno od jakości. Nie jest prawdopodobieństwem sukcesu.
- `components`, `issues`: kryteria i jawne powody obniżenia.
- `heuristic:true`, `clinicalValidation:false`: brak walidacji klinicznej.

## Wagi zadeklarowane przed oceną V25

| Kategoria | Waga |
|---|---:|
| Bezpieczeństwo | 25 |
| Indywidualizacja | 15 |
| Progresja | 15 |
| Dopasowanie bodźca do dystansu/możliwości | 15 |
| Jakość jednostek | 15 |
| Rozkład tygodnia i taper | 10 |
| Reakcja na wykonanie | 5 |

Względem V23 wydzielono 5 punktów wagi indywidualizacji na adaptację. Wagi nie były dopasowywane do pożądanego zwycięstwa V25. Kategorie mają jawne kryteria dodatnie. Każda wykryta wada wnosi karę; brak ukrytego limitu liczby naruszeń. W kategorii wynik dodatni jest mnożony przez `exp(-sumaKar/sqrt(liczbaTygodni))`. Wiele błędów nadal obniża wynik.

## Zmiany metodologii

1. Progresja pracy jest porównywana w podobnych rodzinach przed taperem; skrócenie przed zawodami nie jest traktowane jako cofnięcie rozwoju.
2. Utrzymanie formy nie wymaga eskalacji objętości ani dawki. Powtórzenie bezpiecznej jednostki nie jest automatycznie wadą.
3. Taper przy jednej krótkiej jednostce i małej bazie oceniany jest także bezwzględnie; nie opiera się na niestabilnym procencie z 3–4 km.
4. Domyślny limit weekendowy HM odpowiada generatorowi (150 min), zamiast automatycznych 120 min historycznej rubryki. Jawny limit użytkownika ma pierwszeństwo.
5. Przy 1–2 dniach adekwatność wykorzystania możliwości jest oddzielona od minimów pełnego przygotowania do dystansu. Bezpieczna rezygnacja z jakości M przy dwóch dniach nie jest karana jak błąd algorytmu.
6. Ambitny cel czasowy obniża goalFeasibility, nie ocenę tej samej bezpiecznej recepty. Specyfika jest sprawdzana względem aktualnego wiarygodnego wyniku, a zakresy tempa przez ich środek. Tempo ponad aktualną formę pozostaje karane; słabszy/stary wynik oznacza niepewność.
7. Nadmiar intensywności, koncentracja długiego, skoki obciążeń, kolizje dat i brak taperu pozostają karane. Sama różnorodność nie rekompensuje nadmiaru.
8. Niepotwierdzona dodatnia gotowość maratońska i błędna reakcja na ból/zmęczenie są osobnymi wadami. Wykonanie można podać jako niezależny `context.completedHistory`/observations w trzecim argumencie oceny.
9. NaN, Infinity, ujemne dystanse, niepoprawne daty i niepoprawne czasy jednostek nie otrzymują dodatniej oceny poprawnego planu.

## Kalibracja i granice

Ręczne wzorce powstały niezależnie od silnika: dobry plan, nadmierne km, brak progresji, monotonia, nadmiar jakości, zły taper, nieadekwatny cel/częstotliwość, niebezpieczny powrót, niebezpieczny długi, poprawne podtrzymanie, błędna adaptacja i niepotwierdzona gotowość M. Wyniki, parametry i asercje: wyniki_v25/kalibracja_v25.json. Zachowano także oryginalną kalibrację V23.

Wykonalny harmonogram dla niewykonalnego celu może mieć dobry wynik algorithmQuality i słaby goalFeasibility. Nie jest to ocena skuteczności przygotowania do maratonu. Miernik pozostaje heurystyką i nie weryfikuje autentyczności danych sensorowych. Indywidualizacja wymaga dodatkowych testów par profili; sam pojedynczy plan nie dowodzi reakcji na każdy parametr.
