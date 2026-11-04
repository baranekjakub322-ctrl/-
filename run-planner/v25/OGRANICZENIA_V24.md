# Ograniczenia V24

- Model i oceny są heurystyczne. Brak badań skuteczności, urazowości i walidacji klinicznej; testy kodu nie dowodzą optymalności planu.
- Część scenariuszy nadal ma niższą ocenę od V23 lub V22. Pełna lista i liczby w aktualnym porównaniu JSON/Markdown. Nie odrzucono niewygodnych wejść ani nie zmieniono kar.
- Jeden bieg tygodniowo to ograniczona aktywność/podtrzymanie, nie pełne przygotowanie. Dwa biegi ograniczają rozwój szczególnie na długich dystansach. Sufit czasu nie jest gwarancją bezpieczeństwa pojedynczego biegu.
- Warunkowa specyfika maratońska po bazie nie dowodzi wykonania bazy. Bez obserwacji generator tworzy scenariusz; nie zna realnej adaptacji zawodnika. Nie każdy deklarujący maraton otrzymuje pełną gotowość.
- Dawki jakości mogą pozostać identyczne, gdy ogranicza je dostępność, czas, budżet, regeneracja lub taper. Nie wymusza się różnorodności dla punktów.
- Historyczny miernik V23 może interpretować redukcję pracy w taperze jako słabą progresję; przy jednej krótkiej jednostce procentowa ocena taperu jest mało stabilna. Wagi/implementacja pozostają niezmienione. Nie tworzono dodatkowej skali V24; diagnozę uzupełniają niezależne testy rzeczywistych jednostek.
- Tętno szacowane, tempo i min×RPE mają błąd pomiaru; brak modelu temperatury, przewyższeń, podaży energii, leków i indywidualnego ryzyka medycznego.
- Adaptacja jest modułem korekt przyszłości; nie pełnym systemem ciągłego monitorowania. Zapisana obserwacja jest niemutowalna, pomyłka w niej wymaga jawnej zewnętrznej korekty historii; API nie oferuje jeszcze operacji anulowania obserwacji. Zalecane używanie ostatniego inputUsed.
- Pełne 14-dniowe okno wykonania musi być jawnie zadeklarowane. Pojedynczy zapis nie wystarcza do wnioskowania o zerach w pozostałych dniach. Brak automatycznego powrotu po urazie na podstawie samego upływu czasu.
- `pastPlan` oznacza dawny harmonogram, `completedHistory` wykonane obserwacje. Nie wolno ich utożsamiać. Plan po zawodach zawiera zalecenia regeneracji, nie automatyczną serię wykonanych treningów.
- Zachowano starsze API historii i dodatkowych startów z ich heurystykami. Nowy updatePlan jest rekomendowanym sposobem modułowej adaptacji; wszystkie historyczne funkcje mają regresje techniczne, lecz nie stanowią spersonalizowanej porady klinicznej.
- Pomiar wydajności wykonano na jednym środowisku Node. Nie gwarantuje czasu odpowiedzi na innych urządzeniach. Scenariusze techniczne częściowo się nakładają; nie sumuje się ich jako globalnie unikalnych biegaczy.
