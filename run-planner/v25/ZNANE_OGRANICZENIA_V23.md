# Znane ograniczenia i kierunek V24

- Brak prospektywnej walidacji na biegaczach, danych o urazach oraz skuteczności uzyskanych wyników. Żadna punktacja nie stanowi takiego dowodu.
- Reguły rampy, 180/195 min długiego biegu, min×RPE i limit 2% jednorazowej poprawy VDOT są konserwatywnymi heurystykami. Model nie zna indywidualnej tolerancji tkanek, diety, terenu, snu ani obciążeń innych sportów w pełnym zakresie.
- Przy 1–2 biegach nie uzyskuje się kompletnego przygotowania do długich dystansów. Model świadomie ogranicza ambicje zamiast dopinać km. Domyślne ograniczenie do maksymalnie 6 biegów pozostaje; dla części profili limit wynosi 5.
- Adaptacja jest działającym, lokalnym mechanizmem korekt, a nie modelem fizjologicznego zmęczenia. Wymaga jawnej daty i rzetelnych obserwacji; brak obserwacji nie dowodzi wykonania ani opuszczenia. Potwierdzone pełne okno jest konieczne do uwzględniania zerowych dni w bazie. Historia zapisuje harmonogram i obserwacje osobno.
- Przy adaptacji obciążenie i intensywność zmieniają się ostrożnie; nie przewiduje się automatycznie, czy jeden dobry test był anomalią. Limit zmiany wymaga kolejnej obserwacji i ponownej oceny, nie zastępuje oceny trenera.
- Stare `buildInput`, `replan` i `generateFromData` zachowują kompatybilność oraz własne historyczne heurystyki. Nowy, przetestowany dziennik adaptacji jest w `updatePlan`; nie należy zakładać, że wszystkie stare ścieżki mają identyczną semantykę.
- Zalecenia regeneracji po zawodach są osobnym obiektem, nie automatycznym dopisywaniem treningów po dacie celu. Po zawodach potrzebny jest nowy cel i ocena powrotu.
- Miernik ocenia określone zachowania i nie obserwuje wykonania planu. Niedostateczna historia obniża pewność, a nie dowodzi złego treningu. Testy kontrfaktyczne i siatki nie pokrywają wszystkich możliwych interakcji danych.
- Główny plik nadal zawiera dużo historycznej logiki. Wydzielono polityki, recepty jakościowe, adaptację i scoring; pełne przenoszenie pozostałych konstruktorów do modułów bez korzyści nie było celem tej wersji.

V24: najpierw zbiór danych realizacji i konsultacja treningowa, kalibracja reakcji na RPE/zmęczenie, trwałe śledzenie tolerancji, większe testy właściwości starego API historii, następnie ewentualny dalszy podział głównego pliku. Nie zaczynać od arbitralnego zwiększania punktacji.
