# Run Planner V28

Przeczytaj START_TUTAJ_V28.md, SPECYFIKACJA_V28.txt, DIAGNOZA_PRZYCZYN_V27.md i OGRANICZENIA_V28.md.

- Zachowaj źródła V27/V26, dane frozen-1008 i oba holdouty oraz historyczne scorery 23.0.0 i 25.0.0. Ich hashe są w PROVENANCE_V28.json.
- Najpierw odtwórz bazę i reproduktor. Nie dodawaj km ani intensywności dla samej oceny.
- Intencja prędkości i wytrzymałość dystansu są odrębne. FeasibleEnvelope.minimum nie uprawnia do wymuszania obciążenia.
- Kandidatów wybiera porządek leksykograficzny bez historycznego scorera. debugTrace pokazuje rzeczywiste etapy i redukcje; domyślnie jest wyłączony.
- seasonState.allocatedWeeks i historyczne realized są PLANEM, nigdy potwierdzeniem wykonania.
- completedHistory, korekty i readinessEvidence zachowują pochodzenie. Nie nadrabiaj pominięć.
- Nie zmieniaj historycznych testów; kopie zgodności zmieniają tylko import wersji i asercję numeru wersji.
- Raportuj FAIL, nierozstrzygnięcia i wyniki wszystkich profili. Adaptacja statyczna ma status NOT_ASSESSABLE.
- Przed pakowaniem npm test musi zaliczyć wszystkie 17 etapów, bez zmiany źródeł w trakcie. Nie dodawaj UI ani zależności bez uzasadnienia.
