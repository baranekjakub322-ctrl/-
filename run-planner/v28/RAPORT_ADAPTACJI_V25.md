# Raport adaptacji V25

128 zróżnicowanych scenariuszy, 140 PASS / 0 FAIL rejestrowanych kontroli. Dane: wyniki_v25/adaptacja_v25.json. Osiem profili × 16 rodzajów zdarzeń, plus oddzielne testy trendu, korekt, stref i wznowienia po wstrzymaniu. To kontrola algorytmiczna, nie kliniczna.

Sprawdzono: pominięcie, skrócenie, zmęczenie/RPE, przerwę, nowy test, ból, korektę dystansu/czasu/RPE, anulowanie, przywrócenie, duplikaty, dwa biegi jednego dnia, strefy czasowe, dostępność, termin startu, niepełną historię, sprzeczne dane i ponawianie aktualizacji. Asercje dotyczą rzeczywistej objętości, przyszłych dat, tempa, aktywnej historii, oryginalnego wpisu i audytu — nie tylko braku wyjątku.

Identyczne dane tego samego dnia nie tworzą kolejnej rewizji. Nowy dzień może zmienić plan, nawet bez nowych obserwacji, ponieważ zmienia się termin startu i wiek danych. Pełne okno nie przedłuża się automatycznie na niezaraportowane dni. Obniżona baza nie wraca do dawnej deklaracji bez danych lub jawnej korekty.

Pojedynczy dobry test: limit +0,5% VDOT od bazy. Kilka porównywalnych wyników oddzielonych ≥7 dni, zgodność ≤4%, regularność i brak zmęczenia: do +2%. Pogorszenie uwzględniane od razu. RPE rosnące na podobnych wykonanych sesjach ogranicza jakość/objętość. To jawne heurystyki, nie zweryfikowany model adaptacji fizjologicznej.

| Kontrola | Wynik |
|---|---|
| adapt 0/0 | PASS |
| adapt 0/1 | PASS |
| adapt 0/2 | PASS |
| adapt 0/3 | PASS |
| adapt 0/4 | PASS |
| adapt 0/5 | PASS |
| adapt 0/6 | PASS |
| adapt 0/7 | PASS |
| adapt 0/8 | PASS |
| adapt 0/9 | PASS |
| adapt 0/10 | PASS |
| adapt 0/11 | PASS |
| adapt 0/12 | PASS |
| adapt 0/13 | PASS |
| adapt 0/14 | PASS |
| adapt 0/15 | PASS |
| adapt 1/0 | PASS |
| adapt 1/1 | PASS |
| adapt 1/2 | PASS |
| adapt 1/3 | PASS |
| adapt 1/4 | PASS |
| adapt 1/5 | PASS |
| adapt 1/6 | PASS |
| adapt 1/7 | PASS |
| adapt 1/8 | PASS |
| adapt 1/9 | PASS |
| adapt 1/10 | PASS |
| adapt 1/11 | PASS |
| adapt 1/12 | PASS |
| adapt 1/13 | PASS |
| adapt 1/14 | PASS |
| adapt 1/15 | PASS |
| adapt 2/0 | PASS |
| adapt 2/1 | PASS |
| adapt 2/2 | PASS |
| adapt 2/3 | PASS |
| adapt 2/4 | PASS |
| adapt 2/5 | PASS |
| adapt 2/6 | PASS |
| adapt 2/7 | PASS |
| adapt 2/8 | PASS |
| adapt 2/9 | PASS |
| adapt 2/10 | PASS |
| adapt 2/11 | PASS |
| adapt 2/12 | PASS |
| adapt 2/13 | PASS |
| adapt 2/14 | PASS |
| adapt 2/15 | PASS |
| adapt 3/0 | PASS |
| adapt 3/1 | PASS |
| adapt 3/2 | PASS |
| adapt 3/3 | PASS |
| adapt 3/4 | PASS |
| adapt 3/5 | PASS |
| adapt 3/6 | PASS |
| adapt 3/7 | PASS |
| adapt 3/8 | PASS |
| adapt 3/9 | PASS |
| adapt 3/10 | PASS |
| adapt 3/11 | PASS |
| adapt 3/12 | PASS |
| adapt 3/13 | PASS |
| adapt 3/14 | PASS |
| adapt 3/15 | PASS |
| adapt 4/0 | PASS |
| adapt 4/1 | PASS |
| adapt 4/2 | PASS |
| adapt 4/3 | PASS |
| adapt 4/4 | PASS |
| adapt 4/5 | PASS |
| adapt 4/6 | PASS |
| adapt 4/7 | PASS |
| adapt 4/8 | PASS |
| adapt 4/9 | PASS |
| adapt 4/10 | PASS |
| adapt 4/11 | PASS |
| adapt 4/12 | PASS |
| adapt 4/13 | PASS |
| adapt 4/14 | PASS |
| adapt 4/15 | PASS |
| adapt 5/0 | PASS |
| adapt 5/1 | PASS |
| adapt 5/2 | PASS |
| adapt 5/3 | PASS |
| adapt 5/4 | PASS |
| adapt 5/5 | PASS |
| adapt 5/6 | PASS |
| adapt 5/7 | PASS |
| adapt 5/8 | PASS |
| adapt 5/9 | PASS |
| adapt 5/10 | PASS |
| adapt 5/11 | PASS |
| adapt 5/12 | PASS |
| adapt 5/13 | PASS |
| adapt 5/14 | PASS |
| adapt 5/15 | PASS |
| adapt 6/0 | PASS |
| adapt 6/1 | PASS |
| adapt 6/2 | PASS |
| adapt 6/3 | PASS |
| adapt 6/4 | PASS |
| adapt 6/5 | PASS |
| adapt 6/6 | PASS |
| adapt 6/7 | PASS |
| adapt 6/8 | PASS |
| adapt 6/9 | PASS |
| adapt 6/10 | PASS |
| adapt 6/11 | PASS |
| adapt 6/12 | PASS |
| adapt 6/13 | PASS |
| adapt 6/14 | PASS |
| adapt 6/15 | PASS |
| adapt 7/0 | PASS |
| adapt 7/1 | PASS |
| adapt 7/2 | PASS |
| adapt 7/3 | PASS |
| adapt 7/4 | PASS |
| adapt 7/5 | PASS |
| adapt 7/6 | PASS |
| adapt 7/7 | PASS |
| adapt 7/8 | PASS |
| adapt 7/9 | PASS |
| adapt 7/10 | PASS |
| adapt 7/11 | PASS |
| adapt 7/12 | PASS |
| adapt 7/13 | PASS |
| adapt 7/14 | PASS |
| adapt 7/15 | PASS |
| consistent two-test trend differs from a single good day | PASS |
| RPE correction releases false fatigue while keeping original audit | PASS |
| cancellation, restore and duplicate restore retain stable identity | PASS |
| rising RPE over comparable executed sessions reduces load | PASS |
| missed regularity prevents confirmation by two fast tests alone | PASS |
| paused injury ledger accepts explicit later symptom clearance | PASS |
| raw offset observation stays unchanged in original audit | PASS |
| complete executed window can re-establish base after old break | PASS |
| ambiguous date-only same-day clearance cannot cancel a pain report by ID order | PASS |
| explicit timestamp order allows a later symptom clearance without modifying its original | PASS |
| date-only value pretending to be timestamp is rejected | PASS |
| explicit rest-day symptom clearance remains observed without becoming a completed run | PASS |
