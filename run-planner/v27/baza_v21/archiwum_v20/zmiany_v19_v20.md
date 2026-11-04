# Zmiany V19 → V20

Podstawa: wyłącznie `planGenerator_v19.js` (kopia w `baza/`) i opis zadania. Pozostałe materiały V19 (folder `testy/` z `sweep.mjs`, `uruchom_wszystko.sh`, `ocena_jakosci_v19.md`) **nie były dostępne**; `raport_testow_v19.md` potraktowano jako materiał pomocniczy. Zestaw testów, skrypt uruchamiający i raporty napisano od zera.

## Zmiany w generatorze

| ID | Zmiana | Uzasadnienie | Test regresyjny |
|---|---|---|---|
| D1 | Wynik `trimWeekRuns()` jest sprawdzany w obu miejscach wywołania. Nieosiągnięty limit trafia do `limityNieosiagniete`, ostrzeżeń i `kontrola.problemy`, a `kontrola.zgodny=false`. Funkcja jest eksportowana (zmiana addytywna). | W V19 oba wywołania ignorowały zwracane `true/false`, więc limit mógł być po cichu przekroczony. W siatce 1344 planów V20 zgłasza taki przypadek w 57 planach (4,2%); V19 nie zgłaszałaby żadnego. | R1a–R1c |
| D2 | Tydzień odciążający od 8 km (V19: od 14 km); przy wieku 50+ co 3. tydzień. Próg 8 km w progu `trimWeekRuns` dla tygodnia odciążającego. | W V19 plany o objętości <14 km nigdy nie dostawały odciążenia. Niezależny miernik: 260 planów V19 z krytyczną serią >7 tygodni bez odciążenia (np. 1 bieg/tydz., 40 km/16 km) → 0 w V20. | R2a–R2d |
| D3 | `capLongNearRace()`: długi bieg tuż przed startem ma pułap zależny od dystansu i liczby dni do startu (maraton ≤10 km do 6 dni, ≤18 km do 13 dni; półmaraton ≤8/≤12 km do 4/9 dni; 10 km ≤6/≤8 do 3/5 dni; 5 km ≤4/≤5 do 2/3 dni). Skrócenie jest raportowane w ostrzeżeniach i w `dlugieSkroconePrzedStartem`. | V19 w krótkich planach dawała np. 26 km na 9 dni przed maratonem (12 krytycznych w sweepie V19). | R3 |
| E1 | Wiek 50+: wolniejsza rampa (×0,85; 60+ ×0,7) i częstsze odciążenia + ostrzeżenie. | W V19 wiek nie zmieniał planu. Wolniejsza regeneracja tkanek to uzasadnienie treningowe. Skala efektu (np. szczyt −3 km) jest umowna, nie z badań. | R4a–b, czulosc |
| F1 | Gotowość do WYNIKU wymaga progów wyższych niż do ukończenia (5 km: 7 km/18 km; 10 km: 11/26; półmaraton: 17/32; maraton: 30/50 oraz ≥4 biegi). | V19 używała 1,05× progu ukończenia (maraton ok. 47 km/tydz.). | R5b–c |
| F2 | Nowe pole `gotowosc.rozdzielenie` (`bazaBezpieczna`, `mozliwoscUkonczenia`, `ukonczenieBezLimituCzasu`, `doKonkretnegoWyniku`, `etykieta`, `wynikBrakuje`) i ostrzeżenie „Brak bezpiecznej bazy”. Minimalna baza: 10 km: 8 km/tydz. i 4 km; półmaraton: 14/7; maraton: 24/12. | Rozdzielenie czterech stanów wymagane w zadaniu; pole `status` bez zmian nazw. Progi bazy są heurystyką. | R5a |
| F3 | Ulga ×0,85 progów dla początkujących bez wyniku nie dotyczy maratonu. | V19 mogła deklarować ukończenie maratonu przy najdłuższym biegu ok. 24 km. **Może zmienić status dla początkujących maratończyków (zmiana zachowania).** | R5d |

Kompatybilność API: wszystkie eksporty V19 zachowane (test `podstawowe`); dodano pola wyniku `limityNieosiagniete`, `dlugieSkroconePrzedStartem`, `gotowosc.rozdzielenie` i eksport `trimWeekRuns`. `VERSION` = "20.0".

## Wyniki w liczbach (ten sam niezależny miernik, zob. raport_testow_v20.md)

- Sweep 9408 scenariuszy: V19 — 272 plany z krytycznym naruszeniem (260 brak odciążeń, 12 długi bieg przed startem); V20 — 0.
- 1008 scenariuszy porównawczych V19 vs V20: średnie oceny heurystyczne różnią się o ≤0,06 pkt na dystans; poprawa dotyczy przypadków brzegowych, nie typowego planu.
- Ostrzeżenia miernika: V19 21976 → V20 21378 (−2,7%); większość to wady niezmienione (niżej).

## Czego NIE zweryfikowano / uczciwe zastrzeżenia

1. **Stary `sweep.mjs` i skrypty `.sh` V19 nie były dostępne.** Zarzuty z pkt B/C (indeksowanie wielokrotnością, `|| true`) nie zostały potwierdzone na oryginale. Nowy `sweep.mjs` wykonuje pełną siatkę bez próbkowania i ma asercje, że liczba deklarowana = wykonana = unikalna oraz że każdy z 7 dni startu planu i 7 dni zawodów występuje w każdej komórce (typ × poziom). `uruchom_wszystko.sh` nie zawiera `|| true`, ma `set -uo pipefail`, a `skrypt_bledy.mjs` sprawdza propagację kodów wyjścia.
2. **Miernik korygowałem po pierwszym przebiegu na V19**, usuwając fałszywe alarmy: pomijanie niepełnego pierwszego tygodnia w kontroli udziału długiego, definicja „dużego” długiego biegu przed startem (ułamek dystansu zawodów), liczenie serii obciążenia tylko dla tygodni ≥10 km, zwolnienie tygodni odciążających z kontroli przerw, próg regeneracji 60 min, progi minimów dystansu (5 km: 12 km/tydz., najdłuższy 5 km; 10 km: 8 km; półmaraton: 14 km) oraz tolerancja 5% na zaokrąglenia. V19 i V20 oceniane są końcową wersją miernika. Progi to heurystyki autora, nie normy.
3. Oceny 1–10 są heurystyczne; różnice rzędu 0,1 nie są istotne.
4. Progi „wyniku” (F1) i „bazy” (F2) w generatorze oraz w mierniku zapisano zgodnie z tą samą zasadą, więc test gotowości nie jest w pełni niezależny co do samych progów (niezależne jest liczenie z listy treningów).

## Problemy nierozwiązane (jawnie)

1. **Dodatkowe dni biegowe to „regeneracja” Z1 po 5–9 km.** 16473 ostrzeżeń `REGENERACJA_ZA_DLUGA` w sweepie (bieg >60 min nie jest regeneracyjny); w planach 5k/10k z 5 biegami są 3 dni takich biegów pod rząd i tylko ~1 akcent tygodniowo. Wymaga przeprojektowania doboru jednostek (nie robiłem tego bez możliwości walidacji treningowej).
2. **Udział długiego biegu:** 2326 ostrzeżeń (nie krytycznych). Głównie 2 biegi/tydz. przy wysokiej bazie (62% vs limit 60%) i maraton 2–3 biegi (np. 25 km w tygodniu 37 km). Limitów nie obniżałem; maraton z 1–2 biegów jest zgłaszany jako niewystarczający.
3. **Odstępy:** przy 2 biegach tygodniowo bywa 5 dni przerwy (1392 ostrzeżeń `DLUGA_PRZERWA`). Biegi poniżej 2,5 km poza tygodniem startowym: 1158 ostrzeżeń.
4. **Limit poziomu:** deklaracja 6 i 7 dni daje 5 biegów dla poziomu średniozaawansowanego (plany 5/6/7 dni identyczne), z komunikatem. Decyzja projektowa V19, niezmieniona.
5. **Gotowość maratońska jest konserwatywna:** ukończenie wymaga bazy 38 km/22 km (średniozaawansowany), więc plan dochodzący do 62 km i 29 km dostaje „przygotowanie częściowe”. Może zaniżać ocenę; nie luzowałem z powodów bezpieczeństwa.
6. **Nieosiągnięte limity po `trimWeekRuns()`** są teraz zgłaszane (57/1344 planów w siatce), ale **nie naprawiane**: algorytm nadal nie umie ich zbić bez usuwania biegów.
7. Parametr „najdłuższy bieg” wpływa na pierwsze tygodnie tylko powyżej dolnego progu ok. 30% objętości startowej oraz jest ograniczany limitem udziału długiego biegu (przy 25 km/tydz. historia 16 km nie przekłada się na 16 km w planie).
8. Płeć nie wpływa na plan (świadomie), a HRmax tylko na strefy tętna. Wpływ wyniku odniesienia dotyczy temp, nie kilometrażu.

## Znane ograniczenia generatora

Brak walidacji treningowej przez trenera; tempa z formuły VDOT; brak uwzględnienia nawierzchni, wysokości, snu, stresu; heurystyczne progi gotowości; plan nie jest poradą medyczną.
