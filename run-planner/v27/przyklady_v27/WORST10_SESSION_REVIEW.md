# Wewnętrzny przegląd 10 najsłabszych profili

To przegląd tego samego systemu; nie jest zewnętrzną oceną trenera ani badaniem efektów. Każdą sesję sprawdzono regułami dawki, czasu, kalendarza i intencji. Poniżej wszystkie jednostki tych profili.

## maraton_krotki

Wejście: {"today":"2026-11-02","age":35,"level":"beginner","availableDays":[0,1,2,3,4,5,6],"daysPerWeek":4,"currentWeeklyKm":12,"longestRecentRun":6,"goal":{"type":"marathon","raceDate":"2026-12-20","targetTimeSec":10800}}

Audyt V26/V27: 6.609999999999999/6.51. Decyzja: Powtórzenia/remis lub pogorszenie wymagają odrębnej interpretacji; zachować bezpieczeństwo.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":7.6,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":4,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"taper","score":7,"missing":["Nie zmierzono spadku zmęczenia przed zawodami."],"fix":"model/season_v27.mjs: taper zależny od dystansu, obciążenia i dnia zawodów."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."},{"dimension":"feasibility","score":3,"missing":["Prawdopodobieństwo wyniku i kliniczna gotowość nie są znane."],"fix":"model/readiness_v27.mjs: oddzielić warunkowy harmonogram i dowody celu."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-03 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-06 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2026-11-08 | dlugi | 5 | 43 | recepta_w_ramach_budzetu; [] |
| 2026-11-10 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2026-11-11 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-13 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-15 | dlugi | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-17 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-18 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-20 | latwy | 5 | 43 | recepta_w_ramach_budzetu; [] |
| 2026-11-22 | dlugi | 5 | 43 | recepta_w_ramach_budzetu; [] |
| 2026-11-24 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-25 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-27 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2026-11-29 | dlugi | 4 | 35 | recepta_w_ramach_budzetu; [] |
| 2026-12-01 | latwy | 5 | 43 | recepta_w_ramach_budzetu; [] |
| 2026-12-02 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-12-04 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-12-06 | dlugi | 7 | 61 | recepta_w_ramach_budzetu; [] |
| 2026-12-08 | tempo | 5 | 40 | recepta_w_ramach_budzetu; [] |
| 2026-12-09 | regeneracja | 3 | 29 | recepta_w_ramach_budzetu; [] |
| 2026-12-11 | latwy | 5 | 43 | recepta_w_ramach_budzetu; [] |
| 2026-12-13 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-12-15 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-12-16 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2026-12-18 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |

## jeden_powrot

Wejście: {"today":"2026-11-02","age":35,"level":"intermediate","availableDays":[0,1,2,3,4,5,6],"daysPerWeek":1,"currentWeeklyKm":30,"longestRecentRun":12,"goal":{"type":"10k","raceDate":"2027-02-28"},"breakDays":45}

Audyt V26/V27: 6.05/6.55. Decyzja: Nie zwiększać dawki dla punktów; ograniczenie celu i propozycje zmiany dostępności.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":6,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":7,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu.","Nie ma miejsca na niezależne ekspozycje jakości i wytrzymałości; jest to ograniczenie możliwości, nie zachęta do dokładania akcentów."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."},{"dimension":"feasibility","score":0,"missing":["Prawdopodobieństwo wyniku i kliniczna gotowość nie są znane.","Dostępne 1 dni; zaobserwowana maksymalna częstotliwość 1, szczyt 7 km i długi 0 km."],"fix":"model/readiness_v27.mjs: zachować bezpieczną jednostkę i proponować więcej dni/dłuższy okres lub zmianę celu, bez wymuszania kilometrażu."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-08 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-15 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-22 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-29 | latwy | 3 | 20 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-06 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-13 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-20 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-27 | latwy | 4 | 27 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-03 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-10 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-17 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-24 | latwy | 4 | 27 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-31 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-07 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-14 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-21 | latwy | 3 | 20 | jednostka_w_ograniczonej_czestotliwosci; [] |

## jeden_podtrzymanie

Wejście: {"today":"2026-11-02","age":35,"level":"intermediate","availableDays":[0,1,2,3,4,5,6],"daysPerWeek":1,"currentWeeklyKm":35,"longestRecentRun":14,"goal":{"type":"10k","mode":"maintain","raceDate":"2027-03-28"},"experienceMonths":24}

Audyt V26/V27: 6.573/6.573. Decyzja: Nie zwiększać dawki dla punktów; ograniczenie celu i propozycje zmiany dostępności.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":6.23,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":7,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu.","Nie ma miejsca na niezależne ekspozycje jakości i wytrzymałości; jest to ograniczenie możliwości, nie zachęta do dokładania akcentów."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."},{"dimension":"feasibility","score":0,"missing":["Prawdopodobieństwo wyniku i kliniczna gotowość nie są znane.","Dostępne 1 dni; zaobserwowana maksymalna częstotliwość 1, szczyt 11 km i długi 0 km."],"fix":"model/readiness_v27.mjs: zachować bezpieczną jednostkę i proponować więcej dni/dłuższy okres lub zmianę celu, bez wymuszania kilometrażu."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-08 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-15 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-22 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-29 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-06 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-13 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-20 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-27 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-03 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-10 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-17 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-24 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-31 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-07 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-14 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-21 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-28 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-07 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-14 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-21 | latwy | 4 | 27 | jednostka_w_ograniczonej_czestotliwosci; [] |

## 5k_jeden

Wejście: {"today":"2026-11-02","age":35,"level":"intermediate","availableDays":[0,1,2,3,4,5,6],"daysPerWeek":1,"currentWeeklyKm":12,"longestRecentRun":6,"goal":{"type":"5k","raceDate":"2027-02-28"}}

Audyt V26/V27: 5.91/6.609999999999999. Decyzja: Nie zwiększać dawki dla punktów; ograniczenie celu i propozycje zmiany dostępności.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":6.6,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":7,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu.","Nie ma miejsca na niezależne ekspozycje jakości i wytrzymałości; jest to ograniczenie możliwości, nie zachęta do dokładania akcentów."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."},{"dimension":"feasibility","score":0,"missing":["Prawdopodobieństwo wyniku i kliniczna gotowość nie są znane.","Dostępne 1 dni; zaobserwowana maksymalna częstotliwość 1, szczyt 7 km i długi 0 km."],"fix":"model/readiness_v27.mjs: zachować bezpieczną jednostkę i proponować więcej dni/dłuższy okres lub zmianę celu, bez wymuszania kilometrażu."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-08 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-15 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-22 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-29 | latwy | 3 | 20 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-06 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-13 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-20 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-27 | latwy | 4 | 27 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-03 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-10 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-17 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-24 | latwy | 4 | 27 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-31 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-07 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-14 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-21 | latwy | 4 | 27 | jednostka_w_ograniczonej_czestotliwosci; [] |

## tylko_jeden_dostepny

Wejście: {"today":"2026-11-02","age":35,"level":"intermediate","availableDays":[6],"daysPerWeek":1,"currentWeeklyKm":12,"longestRecentRun":6,"goal":{"type":"5k","raceDate":"2027-02-28"}}

Audyt V26/V27: 6.11/6.609999999999999. Decyzja: Nie zwiększać dawki dla punktów; ograniczenie celu i propozycje zmiany dostępności.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":6.6,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":7,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu.","Nie ma miejsca na niezależne ekspozycje jakości i wytrzymałości; jest to ograniczenie możliwości, nie zachęta do dokładania akcentów."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."},{"dimension":"feasibility","score":0,"missing":["Prawdopodobieństwo wyniku i kliniczna gotowość nie są znane.","Dostępne 1 dni; zaobserwowana maksymalna częstotliwość 1, szczyt 7 km i długi 0 km."],"fix":"model/readiness_v27.mjs: zachować bezpieczną jednostkę i proponować więcej dni/dłuższy okres lub zmianę celu, bez wymuszania kilometrażu."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-07 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-14 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-21 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-28 | latwy | 3 | 20 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-05 | latwy | 6 | 41 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-12 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-19 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-26 | latwy | 4 | 27 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-02 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-09 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-16 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-23 | latwy | 4 | 27 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-30 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-06 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-13 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-20 | latwy | 4 | 27 | jednostka_w_ograniczonej_czestotliwosci; [] |

## maraton_jeden

Wejście: {"today":"2026-11-02","age":35,"level":"intermediate","availableDays":[0,1,2,3,4,5,6],"daysPerWeek":1,"currentWeeklyKm":35,"longestRecentRun":14,"goal":{"type":"marathon","raceDate":"2027-04-11"}}

Audyt V26/V27: 6.673/6.673. Decyzja: Nie zwiększać dawki dla punktów; ograniczenie celu i propozycje zmiany dostępności.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":6.23,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":7,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu.","Nie ma miejsca na niezależne ekspozycje jakości i wytrzymałości; jest to ograniczenie możliwości, nie zachęta do dokładania akcentów."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."},{"dimension":"feasibility","score":1,"missing":["Prawdopodobieństwo wyniku i kliniczna gotowość nie są znane.","Dostępne 1 dni; zaobserwowana maksymalna częstotliwość 1, szczyt 11 km i długi 0 km."],"fix":"model/readiness_v27.mjs: zachować bezpieczną jednostkę i proponować więcej dni/dłuższy okres lub zmianę celu, bez wymuszania kilometrażu."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-08 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-15 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-22 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-29 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-06 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-13 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-20 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-27 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-03 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-10 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-17 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-24 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-31 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-07 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-14 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-21 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-28 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-07 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-14 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-21 | latwy | 7 | 47 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-28 | latwy | 5 | 34 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-04-04 | latwy | 3 | 20 | jednostka_w_ograniczonej_czestotliwosci; [] |

## spadek_historii

Wejście: {"today":"2026-11-02","age":35,"level":"intermediate","availableDays":[0,1,2,3,4,5,6],"daysPerWeek":4,"currentWeeklyKm":35,"longestRecentRun":14,"goal":{"type":"half","raceDate":"2027-02-28"},"recentWeeklyKm":[35,30,12,5],"experienceMonths":18}

Audyt V26/V27: 6.632/6.831999999999999. Decyzja: Wewnętrzny audyt wskazuje poprawę; skuteczność sportowa pozostaje niepotwierdzona.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":6.11,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":4,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."},{"dimension":"feasibility","score":5.71,"missing":["Prawdopodobieństwo wyniku i kliniczna gotowość nie są znane."],"fix":"model/readiness_v27.mjs: oddzielić warunkowy harmonogram i dowody celu."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-03 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-11-06 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-11-08 | dlugi | 3 | 21 | recepta_w_ramach_budzetu; [] |
| 2026-11-10 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-11-13 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-11-15 | dlugi | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-11-17 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-11-20 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-11-22 | dlugi | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-11-24 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-11-27 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-11-29 | dlugi | 3 | 21 | recepta_w_ramach_budzetu; [] |
| 2026-12-01 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-12-04 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-12-06 | dlugi | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-12-08 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-12-09 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-12-11 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-12-13 | dlugi | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-15 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-12-16 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-12-18 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2026-12-20 | dlugi | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-22 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-12-25 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-12-27 | dlugi | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-12-29 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-12-30 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-01 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2027-01-03 | dlugi | 7 | 48 | recepta_w_ramach_budzetu; [] |
| 2027-01-05 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-06 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-08 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2027-01-10 | dlugi | 8 | 55 | recepta_w_ramach_budzetu; [] |
| 2027-01-12 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-01-13 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-15 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-17 | dlugi | 8 | 55 | recepta_w_ramach_budzetu; [] |
| 2027-01-19 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-20 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-22 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2027-01-24 | dlugi | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-26 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-01-27 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-29 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-31 | dlugi | 9 | 62 | recepta_w_ramach_budzetu; [] |
| 2027-02-02 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-02-03 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-02-05 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-02-07 | dlugi | 10 | 69 | recepta_w_ramach_budzetu; [] |
| 2027-02-09 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-02-10 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-02-12 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-02-14 | dlugi | 9 | 62 | recepta_w_ramach_budzetu; [] |
| 2027-02-16 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-02-17 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2027-02-19 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2027-02-21 | dlugi | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-02-23 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-02-26 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |

## 5k_poczatkujacy

Wejście: {"today":"2026-11-02","age":35,"level":"beginner","availableDays":[0,1,2,3,4,5,6],"daysPerWeek":3,"currentWeeklyKm":6,"longestRecentRun":3,"goal":{"type":"5k","raceDate":"2027-02-28"},"experienceMonths":2}

Audyt V26/V27: 7.017/7.017. Decyzja: Powtórzenia/remis lub pogorszenie wymagają odrębnej interpretacji; zachować bezpieczeństwo.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":7.27,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":4,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."},{"dimension":"feasibility","score":6.4,"missing":["Prawdopodobieństwo wyniku i kliniczna gotowość nie są znane."],"fix":"model/readiness_v27.mjs: oddzielić warunkowy harmonogram i dowody celu."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-04 | marszobieg | 2 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-06 | marszobieg | 2 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-08 | marszobieg | 3 | 40 | recepta_w_ramach_budzetu; [] |
| 2026-11-11 | marszobieg | 3 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-13 | marszobieg | 3 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-15 | marszobieg | 4 | 42 | recepta_w_ramach_budzetu; [] |
| 2026-11-18 | marszobieg | 3 | 35 | recepta_w_ramach_budzetu; [] |
| 2026-11-20 | marszobieg | 3 | 35 | recepta_w_ramach_budzetu; [] |
| 2026-11-22 | marszobieg | 4 | 45 | recepta_w_ramach_budzetu; [] |
| 2026-11-25 | marszobieg | 3 | 38 | recepta_w_ramach_budzetu; [] |
| 2026-11-27 | marszobieg | 3 | 38 | recepta_w_ramach_budzetu; [] |
| 2026-11-29 | marszobieg | 5 | 52 | recepta_w_ramach_budzetu; [] |
| 2026-12-02 | marszobieg | 4 | 40 | recepta_w_ramach_budzetu; [] |
| 2026-12-04 | marszobieg | 4 | 40 | recepta_w_ramach_budzetu; [] |
| 2026-12-06 | marszobieg | 6 | 60 | recepta_w_ramach_budzetu; [] |
| 2026-12-09 | marszobieg | 3 | 35 | recepta_w_ramach_budzetu; [] |
| 2026-12-11 | marszobieg | 3 | 35 | recepta_w_ramach_budzetu; [] |
| 2026-12-13 | marszobieg | 3 | 35 | recepta_w_ramach_budzetu; [] |
| 2026-12-16 | latwy | 5 | 43 | recepta_w_ramach_budzetu; [] |
| 2026-12-20 | dlugi | 4 | 35 | recepta_w_ramach_budzetu; [] |
| 2026-12-23 | latwy | 5 | 43 | recepta_w_ramach_budzetu; [] |
| 2026-12-27 | dlugi | 4 | 35 | recepta_w_ramach_budzetu; [] |
| 2026-12-30 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-01-03 | dlugi | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-01-06 | latwy | 5 | 43 | recepta_w_ramach_budzetu; [] |
| 2027-01-10 | dlugi | 4 | 35 | recepta_w_ramach_budzetu; [] |
| 2027-01-13 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-01-15 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-01-17 | dlugi | 4 | 35 | recepta_w_ramach_budzetu; [] |
| 2027-01-20 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-01-24 | dlugi | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-01-27 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-01-29 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-01-31 | dlugi | 4 | 35 | recepta_w_ramach_budzetu; [] |
| 2027-02-03 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-02-05 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-02-07 | dlugi | 4 | 35 | recepta_w_ramach_budzetu; [] |
| 2027-02-10 | latwy | 5 | 43 | recepta_w_ramach_budzetu; [] |
| 2027-02-14 | dlugi | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-02-17 | latwy | 4 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-02-19 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-02-21 | dlugi | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-02-24 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |
| 2027-02-26 | latwy | 3 | 26 | recepta_w_ramach_budzetu; [] |

## maraton_dwa

Wejście: {"today":"2026-11-02","age":35,"level":"intermediate","availableDays":[0,1,2,3,4,5,6],"daysPerWeek":2,"currentWeeklyKm":35,"longestRecentRun":14,"goal":{"type":"marathon","raceDate":"2027-04-11"}}

Audyt V26/V27: 7.164/7.164. Decyzja: Nie zwiększać dawki dla punktów; ograniczenie celu i propozycje zmiany dostępności.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":7.14,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":7,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu.","Nie ma miejsca na niezależne ekspozycje jakości i wytrzymałości; jest to ograniczenie możliwości, nie zachęta do dokładania akcentów."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."},{"dimension":"feasibility","score":5,"missing":["Prawdopodobieństwo wyniku i kliniczna gotowość nie są znane.","Dostępne 2 dni; zaobserwowana maksymalna częstotliwość 2, szczyt 34 km i długi 21 km."],"fix":"model/readiness_v27.mjs: zachować bezpieczną jednostkę i proponować więcej dni/dłuższy okres lub zmianę celu, bez wymuszania kilometrażu."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-05 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-08 | dlugi | 14 | 96 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-12 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-15 | dlugi | 15 | 103 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-19 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-22 | dlugi | 16 | 110 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-26 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-11-29 | dlugi | 12 | 82 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-03 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-06 | dlugi | 16 | 110 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-10 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-13 | dlugi | 17 | 117 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-17 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-20 | dlugi | 18 | 123 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-24 | latwy | 12 | 81 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-27 | dlugi | 13 | 89 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2026-12-31 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-03 | dlugi | 19 | 130 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-07 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-10 | dlugi | 20 | 137 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-14 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-17 | dlugi | 20 | 137 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-21 | latwy | 12 | 81 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-24 | dlugi | 15 | 103 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-28 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-01-31 | dlugi | 21 | 144 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-04 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-07 | dlugi | 21 | 144 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-11 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-14 | dlugi | 21 | 144 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-18 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-21 | dlugi | 16 | 110 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-25 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-02-28 | dlugi | 21 | 144 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-04 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-07 | dlugi | 21 | 144 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-11 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-14 | dlugi | 21 | 144 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-18 | latwy | 11 | 74 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-21 | dlugi | 16 | 110 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-25 | latwy | 13 | 88 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-03-28 | latwy | 5 | 34 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-04-01 | latwy | 8 | 54 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-04-04 | latwy | 5 | 34 | jednostka_w_ograniczonej_czestotliwosci; [] |
| 2027-04-08 | latwy | 5 | 34 | jednostka_w_ograniczonej_czestotliwosci; [] |

## niska_tolerancja

Wejście: {"today":"2026-11-02","age":35,"level":"intermediate","availableDays":[0,1,2,3,4,5,6],"daysPerWeek":4,"currentWeeklyKm":30,"longestRecentRun":12,"goal":{"type":"10k","raceDate":"2027-02-28"},"loadTolerance":"low","recoveryDays":3,"experienceMonths":12}

Audyt V26/V27: 7.003/7.203. Decyzja: Wewnętrzny audyt wskazuje poprawę; skuteczność sportowa pozostaje niepotwierdzona.

Mocne: Jawny cel sezonu i rozdział planu od wykonania. Brak wymuszonych maksymalnych testów.

Braki: [{"dimension":"individualization","score":7.53,"missing":["Brakuje pełnej historii i reakcji na trening; deklaracja PB nie jest świeżym pomiarem."],"fix":"model/profile_v27.mjs: uwzględnić datę, źródło i wiarygodność danych."},{"dimension":"quality","score":4,"missing":["Planowana dawka nie dowodzi adaptacji; powtórzenie wymaga kontekstu."],"fix":"model/quality_v27.mjs: kontrolować porównywalne dawki i następny krok."},{"dimension":"specificity","score":5,"missing":["Nie potwierdzono skuteczności bodźców na docelowym dystansie."],"fix":"model/policy_v27.mjs: powiązać długi/progowy/specyficzny z celem i liczbą dni."},{"dimension":"periodization","score":7,"missing":["Same nazwy faz nie dowodzą prawidłowych przejść."],"fix":"model/season_v27.mjs: cel fazy ma zmieniać rzeczywistą receptę."},{"dimension":"adaptation","score":5,"missing":["Statyczny plan nie pozwala ocenić reakcji na wykonanie.","Obserwacje wykonania dostępne w audycie: 0."],"fix":"model/adaptation_v27.mjs: trend 2–6 tygodni, korekty i dowody."}]

| Data | Typ | Km | Min | Werdykt / dowody |
|---|---|---:|---:|---|
| 2026-11-03 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-11-04 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-11-06 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-11-08 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2026-11-10 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-11-11 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-11-13 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-11-15 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2026-11-17 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-18 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-11-20 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-11-22 | dlugi | 8 | 55 | recepta_w_ramach_budzetu; [] |
| 2026-11-24 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-11-25 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-11-27 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-11-29 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2026-12-01 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-02 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-04 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-06 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2026-12-08 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-12-09 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-12-11 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2026-12-13 | dlugi | 8 | 55 | recepta_w_ramach_budzetu; [] |
| 2026-12-15 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-16 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-18 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-20 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2026-12-22 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-23 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-25 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2026-12-27 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2026-12-29 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2026-12-30 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-01-01 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-03 | dlugi | 8 | 55 | recepta_w_ramach_budzetu; [] |
| 2027-01-05 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-06 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-08 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-10 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2027-01-12 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-13 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-15 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-17 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2027-01-19 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-01-20 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-01-22 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-01-24 | dlugi | 8 | 55 | recepta_w_ramach_budzetu; [] |
| 2027-01-26 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-27 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-29 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-01-31 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2027-02-02 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-02-03 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-02-05 | latwy | 6 | 41 | recepta_w_ramach_budzetu; [] |
| 2027-02-07 | dlugi | 11 | 75 | recepta_w_ramach_budzetu; [] |
| 2027-02-09 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-02-10 | latwy | 5 | 34 | recepta_w_ramach_budzetu; [] |
| 2027-02-12 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-02-14 | dlugi | 8 | 55 | recepta_w_ramach_budzetu; [] |
| 2027-02-16 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-02-17 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-02-19 | latwy | 4 | 27 | recepta_w_ramach_budzetu; [] |
| 2027-02-21 | dlugi | 7 | 48 | recepta_w_ramach_budzetu; [] |
| 2027-02-23 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2027-02-24 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
| 2027-02-26 | latwy | 3 | 20 | recepta_w_ramach_budzetu; [] |
