# Ograniczenia V25

1. Nie wykonano badań na biegaczach, pomiaru urazowości ani zewnętrznego przeglądu trenerów. Przegląd 30 planów jest wewnętrzną oceną tego samego systemu. Testy heurystyczne nie dowodzą skuteczności ani optymalności fizjologicznej.
2. Nie wszystkie z 89 obniżeń historycznej oceny usunięto; celu znacznego ograniczenia tej liczby nie osiągnięto. Dokładne liczby porównań z V24 i z V23 są raportowane osobno. Część odzwierciedla niedoskonałość zamrożonego miernika, część bezpieczne ograniczenia, a część pozostaje kompromisem treningowym. Wszystkie wejścia, wyniki i niższe oceny zachowano w JSON/Markdown.
3. V25.0.0 jest nową skalą i nie zastępuje V23.0.0 w głównym porównaniu. Dobry wynik jakości algorytmu przy jednym dniu nie oznacza dobrego przygotowania do maratonu; wykonalność jest osobna.
4. Gotowość potwierdzona danymi oznacza spełnienie orientacyjnych kryteriów na podstawie dostarczonego wykonania, nie weryfikację sensorową, prawdopodobieństwo sukcesu ani kwalifikację medyczną. Planowane fazy pozostają warunkowe.
5. Jedna–dwie sesje mocno ograniczają rozwój na długich dystansach. Nie wymusza się kilometrażu ani intensywności, by ukryć ten brak. Limit minut nie jest pełną miarą ryzyka.
6. Trend VDOT i RPE jest heurystyczny. Temperatury, przewyższenia, zmęczenie i jakość pomiaru mogą zaburzyć porównywalność. Sam szybszy bieg łatwy nie jest automatycznie nowym wynikiem wyścigowym.
7. Identyfikatory importu wymagają konsekwencji klienta. Stary wpis date-only ma jeden klucz na dzień; kilku aktywności nie da się niezawodnie rozpoznać bez id, externalId lub czasu. Import tego samego momentu w innym widoku strefowym jest idempotentny; zmiana dnia wymaga jawnej korekty.
8. Różne aktywności tego samego dnia nie powodują automatycznego dodawania dwóch planowanych biegów. Przeszłość planowana i rzeczywiste wykonanie są odrębne; korekty zmieniają aktywny zapis wykonania, zachowując oryginał i audyt.
9. Kompletność historii jest deklarowana, a brak wpisu nie jest sukcesem ani zerem w niepełnym oknie. Nie ma automatycznego medycznego dopuszczenia po urazie. Ustąpienie objawów zgłasza użytkownik.
10. Warunki i żywienie są opcjonalne. Brak modelu laboratoryjnego podaży energii, strat potu i tolerancji GI. Nie wyznacza się dokładnej poprawki tempa z niepełnej pogody/profilu trasy.
11. Zachowano starsze funkcje historii/dodatkowych startów dla zgodności. Zalecane nowe zdarzenia aktywności i updatePlan nie zmieniają automatycznie wszystkich dawnych protokołów importu.
12. Wydajność porównano na jednym środowisku Node. RSS obejmuje proces/JIT; wynik nie jest gwarancją SLA. Scenariusze częściowo się nakładają i nie są liczbą unikalnych rzeczywistych biegaczy.
