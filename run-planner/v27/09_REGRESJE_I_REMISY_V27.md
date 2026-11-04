# Regresje i remisy V27

Baza V26: 7bf1f87aca375baeac3869dfaccf6817ce782a22; v24.19.0, Linux-6.18.57-x86_64-with-glibc2.41. Wejścia frozen-1008-v24, SHA-256 00ab459021dbf3100e0cc08a1b4472f7cbafa09a5425033307cdb79656ed008d. Oba historyczne mierniki pozostają bajtowo niezmienione: 23.0.0 a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71, 25.0.0 09dfeeb6b6ab25bdbae4065b5d2166b75f9d1c7f286408337fa8c912f65332b2. Audyt 27.0.0 jest osobny, nie służy wyborowi kandydatów i nie zastępuje historii.

1008 / 23.0.0: **7.446663 → 7.492178**, poprawy/remisy/obniżenia **532/226/250**.

1008 / 25.0.0: **9.190389 → 9.315776**, +/=/- 667/256/85.

1008 / audyt 27.0.0: 7.363991 → 7.419161, +/=/- 409/362/237. To wewnętrzne heurystyki, bez walidacji efektów sportowych lub klinicznej.

Wcześniejsze zbiory: 88 V26 poniżej V23 i 49 V25 poniżej V24; nie sumujemy ich. Teraz poniżej V23 pozostaje 120. Listy ID wszystkich zbiorów i pełne klasyfikacje w wyniki_v27/regressions-classification.json.

Brak nowych krytycznych naruszeń według niezależnych testów: 0. Pozostałe obniżenia nie są automatycznie uznawane za błędy miernika. Usunięcie maksymalnego testu może zmieniać iloraz różnych rodzin; taka kwalifikacja pozostaje wewnętrzną oceną celu jednostki. Gdy oba mierniki i audyt spadają, pozostawiamy nierozstrzygnięcie oraz pełne dane do oceny trenera.

| ID | Δ23 | Δ25 | Δ audytu | Decyzja | Przyczyna |
|---|---|---|---|---|---|
| 0 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 1 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 2 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 3 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 4 | 0.133000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 5 | 0.549000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 6 | 0.133000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 7 | 0.133000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 8 | 0.132000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 9 | 0.548000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 10 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 11 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 12 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 13 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 14 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 15 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 16 | 0.132000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 17 | 0.548000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 18 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 19 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 20 | 0.132000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 21 | 0.000000 | 0.000000 | 0.000000 | uzasadniony_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 22 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 23 | 0.132000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 24 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 25 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 26 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 27 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 28 | 0.132000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 29 | 0.548000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 30 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 31 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 32 | 0.132000 | 0.187000 | 0.350000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 33 | 0.317000 | 0.187000 | 0.150000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 34 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 35 | 0.121000 | 0.156000 | 0.343000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 36 | 0.188000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 37 | 0.188000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 38 | 0.188000 | 0.188000 | -0.200000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 39 | 0.188000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 40 | -0.142000 | -0.128000 | 0.414000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 41 | 0.057000 | 0.072000 | 0.014000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 42 | -0.167000 | -0.118000 | 0.000000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 43 | 0.160000 | 0.241000 | 0.337000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 44 | 0.401000 | 0.466000 | 0.337000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 45 | 0.139000 | 0.204000 | -0.013000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 46 | 0.289000 | 0.354000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 47 | 0.357000 | 0.362000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 48 | 0.188000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 49 | 0.053000 | 0.054000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 50 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 51 | 0.188000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 52 | 0.243000 | 0.334000 | 0.637000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 53 | 0.173000 | 0.273000 | 0.087000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 54 | 0.139000 | 0.239000 | 0.087000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 55 | 0.249000 | 0.288000 | 0.087000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 56 | 0.345000 | 0.410000 | 0.450000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 57 | 0.139000 | 0.204000 | 0.087000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 58 | 0.139000 | 0.204000 | 0.087000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 59 | 0.204000 | 0.209000 | 0.087000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 60 | 0.188000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 61 | 0.188000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 62 | 0.188000 | 0.188000 | -0.200000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 63 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 64 | 0.253000 | 0.402000 | 0.644000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 65 | 0.277000 | 0.426000 | 0.094000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 66 | 0.243000 | 0.392000 | 0.094000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 67 | 0.305000 | 0.372000 | 0.093000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 68 | 0.300000 | 0.441000 | 0.297000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 69 | 0.257000 | 0.397000 | 0.097000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 70 | 0.033000 | 0.174000 | 0.100000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 71 | 0.321000 | 0.462000 | 0.244000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 72 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 73 | 0.201000 | 0.200000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 74 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 75 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 76 | 0.100000 | 0.272000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 77 | 0.037000 | 0.085000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 78 | 0.037000 | 0.085000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 79 | 0.100000 | 0.272000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 80 | -0.167000 | 0.122000 | 0.170000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 81 | -0.167000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 82 | -0.167000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 83 | -0.198000 | 0.188000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 84 | 0.187000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 85 | 0.201000 | 0.200000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 86 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 87 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 88 | -0.105000 | 0.184000 | -0.037000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 89 | -0.144000 | 0.145000 | -0.037000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 90 | -0.168000 | 0.121000 | -0.037000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 91 | -0.136000 | 0.153000 | 0.120000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 92 | -0.167000 | 0.122000 | 0.170000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 93 | -0.167000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 94 | -0.167000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 95 | -0.198000 | 0.188000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 96 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 97 | 0.201000 | 0.200000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 98 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 99 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 100 | -0.062000 | 0.121000 | -0.036000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 101 | -0.046000 | 0.137000 | -0.036000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 102 | -0.062000 | 0.121000 | -0.036000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 103 | -0.029000 | 0.187000 | -0.036000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 104 | -0.062000 | 0.122000 | 0.170000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 105 | -0.135000 | -0.066000 | -0.060000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 106 | -0.135000 | -0.065000 | -0.060000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 107 | -0.062000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 108 | 0.253000 | 0.252000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 109 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 110 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 111 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 112 | -0.049000 | 0.207000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 113 | 0.046000 | 0.302000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 114 | -0.048000 | 0.207000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 115 | -0.106000 | 0.257000 | -0.180000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 116 | -0.167000 | 0.122000 | 0.170000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 117 | -0.167000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 118 | -0.140000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 119 | -0.168000 | 0.121000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 120 | 0.253000 | 0.252000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 121 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 122 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 123 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 124 | 0.006000 | 0.297000 | -0.037000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 125 | -0.101000 | 0.188000 | -0.037000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 126 | -0.260000 | -0.066000 | -0.060000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 127 | 0.034000 | 0.324000 | 0.113000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 128 | -0.167000 | 0.122000 | 0.170000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 129 | -0.167000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 130 | -0.140000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 131 | -0.198000 | 0.187000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 132 | 0.253000 | 0.252000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 133 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 134 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 135 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 136 | 0.178000 | 0.362000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 137 | -0.034000 | 0.150000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 138 | -0.039000 | 0.121000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 139 | -0.029000 | 0.187000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 140 | -0.062000 | 0.121000 | 0.170000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 141 | -0.062000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 142 | -0.039000 | 0.122000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 143 | -0.028000 | 0.188000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 144 | 0.253000 | 0.252000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 145 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 146 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 147 | 0.187000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 148 | -0.049000 | 0.207000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 149 | 0.046000 | 0.302000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 150 | -0.063000 | 0.192000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 151 | -0.106000 | 0.257000 | -0.180000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 152 | 0.159000 | 0.187000 | 0.170000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 153 | 0.159000 | 0.187000 | -0.180000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 154 | 0.000000 | 0.000000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 155 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 156 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 157 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 158 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 159 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 160 | -0.115000 | 0.285000 | -0.017000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 161 | -0.353000 | -0.037000 | -0.060000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 162 | -0.327000 | -0.011000 | -0.047000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 163 | 0.141000 | 0.541000 | -0.017000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 164 | 0.159000 | 0.187000 | 0.170000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 165 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 166 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 167 | -0.012000 | 0.187000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 168 | 0.187000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 169 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 170 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 171 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 172 | -0.404000 | 0.121000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 173 | -0.398000 | 0.127000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 174 | -0.502000 | 0.023000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 175 | -0.266000 | 0.121000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 176 | 0.067000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 177 | 0.067000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 178 | 0.067000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 179 | -0.180000 | 0.187000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 180 | 0.253000 | 0.252000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 181 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 182 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 183 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 184 | -0.049000 | 0.207000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 185 | 0.031000 | 0.287000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 186 | -0.063000 | 0.192000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 187 | -0.091000 | 0.272000 | -0.180000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 188 | 0.159000 | 0.187000 | 0.170000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 189 | 0.000000 | 0.000000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 190 | 0.000000 | 0.000000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 191 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 192 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 193 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 194 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 195 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 196 | -0.273000 | 0.127000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 197 | -0.182000 | 0.218000 | 0.133000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 198 | -0.195000 | 0.205000 | -0.017000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 199 | -0.206000 | 0.249000 | -0.017000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 200 | 0.159000 | 0.187000 | 0.170000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 201 | 0.144000 | 0.172000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 202 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 203 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 204 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 205 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 206 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 207 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 208 | -0.404000 | 0.121000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 209 | -0.343000 | 0.183000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 210 | -0.558000 | -0.066000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 211 | -0.266000 | 0.121000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 212 | 0.067000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 213 | 0.067000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 214 | 0.067000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 215 | -0.195000 | 0.172000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 216 | 0.253000 | 0.252000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 217 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 218 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 219 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 220 | -0.064000 | 0.191000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 221 | 0.031000 | 0.287000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 222 | -0.048000 | 0.207000 | -0.180000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 223 | -0.091000 | 0.272000 | -0.180000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 224 | 0.159000 | 0.187000 | 0.170000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 225 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 226 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 227 | -0.012000 | 0.187000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 228 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 229 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 230 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 231 | 0.187000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 232 | -0.115000 | 0.285000 | -0.017000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 233 | -0.182000 | 0.218000 | -0.017000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 234 | -0.195000 | 0.205000 | -0.017000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 235 | -0.206000 | 0.249000 | -0.017000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 236 | 0.145000 | 0.173000 | 0.170000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 237 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 238 | 0.000000 | 0.000000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 239 | 0.159000 | 0.187000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 240 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 241 | 0.343000 | 0.343000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 242 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 243 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 244 | -0.404000 | 0.121000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 245 | -0.576000 | -0.084000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 246 | -0.558000 | -0.066000 | -0.037000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 247 | -0.266000 | 0.121000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 248 | 0.067000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 249 | 0.067000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 250 | 0.052000 | 0.172000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 251 | -0.180000 | 0.187000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 252 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 253 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 254 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 255 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 256 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 257 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 258 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 259 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 260 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 261 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 262 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 263 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 264 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 265 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 266 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 267 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 268 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 269 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 270 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 271 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 272 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 273 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 274 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 275 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 276 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 277 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 278 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 279 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 280 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 281 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 282 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 283 | 0.132000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 284 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 285 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 286 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 287 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 288 | 0.268000 | 0.000000 | 0.040000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 289 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 290 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 291 | 0.188000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 292 | 0.130000 | 0.042000 | 0.030000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 293 | 0.176000 | 0.088000 | 0.030000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 294 | 0.030000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 295 | 0.175000 | 0.088000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 296 | 0.520000 | 0.313000 | 0.133000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 297 | 0.268000 | 0.061000 | -0.017000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 298 | 0.339000 | 0.134000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 299 | 0.481000 | 0.276000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 300 | 0.268000 | 0.000000 | 0.040000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 301 | 0.268000 | 0.000000 | 0.040000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 302 | 0.268000 | 0.000000 | 0.040000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 303 | 0.268000 | 0.000000 | 0.040000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 304 | 0.377000 | 0.198000 | 0.230000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 305 | 0.259000 | 0.105000 | 0.080000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 306 | 0.259000 | 0.105000 | 0.080000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 307 | 0.635000 | 0.481000 | 0.080000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 308 | 0.393000 | 0.189000 | 0.250000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 309 | 0.268000 | 0.061000 | 0.083000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 310 | 0.268000 | 0.061000 | 0.083000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 311 | 0.666000 | 0.459000 | 0.233000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 312 | 0.268000 | 0.000000 | 0.040000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 313 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 314 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 315 | 0.268000 | 0.000000 | 0.040000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 316 | 0.184000 | 0.264000 | 0.057000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 317 | 0.173000 | 0.251000 | 0.057000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 318 | 0.173000 | 0.251000 | 0.057000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 319 | 0.461000 | 0.565000 | 0.056000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 320 | 0.296000 | 0.366000 | 0.063000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 321 | 0.164000 | 0.234000 | 0.063000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 322 | 0.224000 | 0.294000 | 0.070000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 323 | 0.225000 | 0.294000 | 0.054000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 324 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 325 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 326 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 327 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 328 | 0.026000 | 0.284000 | 0.290000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 329 | -0.028000 | 0.039000 | -0.200000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 330 | -0.028000 | 0.039000 | -0.200000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 331 | 0.026000 | 0.276000 | -0.200000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 332 | 0.026000 | 0.168000 | 0.019000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 333 | -0.029000 | 0.112000 | 0.019000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 334 | -0.029000 | 0.112000 | 0.019000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 335 | -0.060000 | 0.178000 | 0.049000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 336 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 337 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 338 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 339 | 0.188000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 340 | 0.235000 | 0.376000 | 0.212000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 341 | 0.202000 | 0.344000 | 0.012000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 342 | 0.202000 | 0.344000 | 0.012000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 343 | 0.233000 | 0.318000 | -0.260000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 344 | 0.026000 | 0.168000 | -0.131000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 345 | -0.029000 | 0.112000 | -0.131000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 346 | -0.029000 | 0.112000 | 0.019000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 347 | -0.060000 | 0.178000 | 0.049000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 348 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 349 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 350 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 351 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 352 | 0.074000 | 0.277000 | 0.213000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 353 | 0.011000 | 0.214000 | 0.013000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 354 | 0.011000 | 0.214000 | 0.013000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 355 | 0.065000 | 0.377000 | 0.043000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 356 | 0.130000 | 0.335000 | 0.016000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 357 | 0.046000 | -0.028000 | -0.110000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 358 | 0.144000 | 0.071000 | -0.113000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 359 | 0.130000 | 0.277000 | -0.113000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 360 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 361 | 0.031000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 362 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 363 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 364 | 0.026000 | 0.284000 | 0.340000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 365 | 0.074000 | 0.331000 | 0.090000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 366 | -0.074000 | 0.284000 | -0.060000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 367 | -0.003000 | 0.238000 | 0.053000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 368 | 0.194000 | 0.335000 | 0.019000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 369 | 0.087000 | 0.228000 | 0.019000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 370 | -0.219000 | 0.228000 | 0.019000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 371 | 0.108000 | 0.250000 | 0.169000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 372 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 373 | 0.031000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 374 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 375 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 376 | 0.415000 | 0.556000 | 0.219000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 377 | 0.308000 | 0.449000 | 0.019000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 378 | 0.331000 | 0.358000 | -0.260000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 379 | 0.415000 | 0.556000 | 0.019000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 380 | 0.193000 | 0.335000 | 0.019000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 381 | 0.087000 | 0.228000 | 0.019000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 382 | -0.219000 | 0.228000 | 0.019000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 383 | 0.149000 | 0.322000 | 0.045000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 384 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 385 | 0.031000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 386 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 387 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 388 | 0.261000 | 0.463000 | 0.219000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 389 | 0.113000 | 0.315000 | 0.019000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 390 | -0.068000 | 0.311000 | 0.019000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 391 | 0.285000 | 0.532000 | 0.045000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 392 | -0.019000 | 0.184000 | 0.019000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 393 | -0.019000 | 0.184000 | 0.019000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 394 | -0.195000 | 0.184000 | 0.019000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 395 | 0.090000 | 0.336000 | 0.045000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 396 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 397 | 0.031000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 398 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 399 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 400 | -0.033000 | 0.224000 | 0.340000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 401 | 0.074000 | 0.331000 | -0.060000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 402 | -0.074000 | 0.284000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 403 | -0.003000 | 0.238000 | 0.053000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 404 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 405 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 406 | -0.062000 | -0.054000 | -0.300000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 407 | -0.191000 | 0.126000 | -0.300000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 408 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 409 | 0.096000 | 0.097000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 410 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 411 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 412 | -0.187000 | 0.184000 | 0.208000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 413 | -0.235000 | -0.113000 | -0.260000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 414 | -0.110000 | 0.012000 | -0.260000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 415 | -0.187000 | 0.126000 | -0.260000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 416 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 417 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 418 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 419 | -0.003000 | 0.342000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 420 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 421 | 0.096000 | 0.097000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 422 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 423 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 424 | -0.400000 | 0.183000 | 0.231000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 425 | -0.400000 | 0.184000 | 0.031000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 426 | -0.400000 | 0.184000 | 0.031000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 427 | -0.400000 | 0.126000 | -0.230000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 428 | -0.320000 | 0.184000 | 0.061000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 429 | -0.320000 | 0.184000 | 0.061000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 430 | -0.320000 | 0.184000 | 0.061000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 431 | -0.065000 | 0.393000 | 0.063000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 432 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 433 | 0.031000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 434 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 435 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 436 | -0.033000 | 0.224000 | 0.490000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 437 | 0.074000 | 0.331000 | 0.090000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 438 | -0.074000 | 0.284000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 439 | 0.012000 | 0.253000 | 0.053000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 440 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 441 | -0.062000 | -0.054000 | -0.300000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 442 | -0.062000 | -0.054000 | -0.300000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 443 | -0.191000 | 0.126000 | -0.300000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 444 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 445 | 0.096000 | 0.097000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 446 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 447 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 448 | -0.187000 | 0.184000 | 0.208000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 449 | -0.120000 | 0.251000 | 0.008000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 450 | -0.122000 | 0.249000 | 0.008000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 451 | -0.047000 | 0.342000 | 0.040000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 452 | -0.190000 | 0.183000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 453 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 454 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 455 | -0.191000 | 0.126000 | -0.300000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 456 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 457 | 0.096000 | 0.097000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 458 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 459 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 460 | -0.400000 | 0.184000 | 0.225000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 461 | -0.400000 | 0.184000 | 0.025000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 462 | -0.282000 | -0.054000 | -0.230000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 463 | -0.400000 | 0.126000 | -0.243000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 464 | -0.320000 | 0.184000 | 0.158000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 465 | -0.320000 | 0.184000 | 0.058000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 466 | -0.320000 | 0.184000 | 0.058000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 467 | -0.101000 | 0.357000 | 0.060000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 468 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 469 | 0.031000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 470 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 471 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 472 | -0.033000 | 0.224000 | 0.490000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 473 | 0.074000 | 0.331000 | 0.090000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 474 | -0.074000 | 0.284000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 475 | 0.012000 | 0.253000 | 0.053000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 476 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 477 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 478 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 479 | -0.003000 | 0.342000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 480 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 481 | 0.096000 | 0.097000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 482 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 483 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 484 | -0.187000 | 0.184000 | 0.208000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 485 | -0.120000 | 0.251000 | 0.008000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 486 | -0.122000 | 0.249000 | 0.008000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 487 | -0.062000 | 0.327000 | 0.040000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 488 | -0.190000 | 0.183000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 489 | -0.191000 | 0.184000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 490 | -0.062000 | -0.054000 | -0.300000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 491 | -0.191000 | 0.126000 | -0.300000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 492 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 493 | 0.096000 | 0.097000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 494 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 495 | 0.188000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 496 | -0.400000 | 0.184000 | 0.225000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 497 | -0.282000 | -0.054000 | -0.230000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 498 | -0.282000 | -0.054000 | -0.243000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 499 | -0.400000 | 0.126000 | -0.243000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 500 | -0.320000 | 0.184000 | 0.058000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 501 | -0.320000 | 0.184000 | 0.058000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 502 | -0.320000 | 0.184000 | 0.058000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 503 | -0.086000 | 0.372000 | 0.060000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 504 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 505 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 506 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 507 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 508 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 509 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 510 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 511 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 512 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 513 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 514 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 515 | 0.109000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 516 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 517 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 518 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 519 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 520 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 521 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 522 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 523 | 0.109000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 524 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 525 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 526 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 527 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 528 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 529 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 530 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 531 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 532 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 533 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 534 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 535 | 0.109000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 536 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 537 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 538 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 539 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 540 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 541 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 542 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 543 | 0.153000 | 0.188000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 544 | -0.061000 | -0.075000 | 0.000000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 545 | -0.031000 | -0.038000 | 0.000000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 546 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 547 | -0.087000 | -0.106000 | 0.000000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 548 | 1.140000 | 0.721000 | 0.116000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 549 | 0.997000 | 0.737000 | 0.116000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 550 | 0.496000 | 0.482000 | -0.013000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 551 | 0.532000 | 0.557000 | -0.013000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 552 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 553 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 554 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 555 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 556 | 0.272000 | 0.510000 | 0.074000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 557 | 0.381000 | 0.711000 | 0.073000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 558 | 0.381000 | 0.711000 | 0.073000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 559 | 0.258000 | 0.592000 | 0.073000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 560 | 1.046000 | 0.610000 | 0.250000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 561 | 0.997000 | 0.737000 | 0.216000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 562 | 0.997000 | 0.737000 | 0.216000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 563 | 1.040000 | 0.847000 | 0.216000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 564 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 565 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 566 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 567 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 568 | 0.699000 | 0.216000 | 0.080000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 569 | 0.435000 | 0.342000 | 0.080000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 570 | 0.435000 | 0.342000 | 0.080000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 571 | 0.477000 | 0.451000 | 0.080000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 572 | 0.938000 | 0.232000 | 0.090000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 573 | 0.826000 | 0.322000 | 0.090000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 574 | 1.071000 | 0.234000 | 0.100000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 575 | 1.216000 | 0.409000 | 0.226000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 576 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 577 | 0.027000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 578 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 579 | 0.159000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 580 | -0.184000 | 0.224000 | 0.006000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 581 | -0.106000 | 0.384000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 582 | -0.111000 | 0.378000 | 0.006000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 583 | -0.184000 | 0.374000 | 0.006000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 584 | 0.251000 | 0.109000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 585 | 0.172000 | 0.029000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 586 | 0.184000 | 0.029000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 587 | 0.492000 | 0.121000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 588 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 589 | 0.027000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 590 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 591 | 0.159000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 592 | -0.407000 | 0.000000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 593 | 0.000000 | 0.000000 | -0.036000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 594 | 0.000000 | 0.000000 | -0.036000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 595 | -0.407000 | 0.151000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 596 | 0.263000 | 0.109000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 597 | 0.184000 | 0.029000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 598 | 0.172000 | 0.029000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 599 | 0.447000 | 0.106000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 600 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 601 | 0.027000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 602 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 603 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 604 | 0.131000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 605 | -0.071000 | 0.023000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 606 | -0.071000 | 0.023000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 607 | 0.140000 | 0.187000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 608 | 0.391000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 609 | 0.439000 | 0.151000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 610 | 0.510000 | 0.222000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 611 | 0.391000 | 0.275000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 612 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 613 | 0.025000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 614 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 615 | 0.150000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 616 | 0.519000 | 0.520000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 617 | 0.299000 | 0.299000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 618 | 0.330000 | 0.299000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 619 | 0.272000 | 0.272000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 620 | 0.097000 | 0.055000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 621 | 0.021000 | -0.027000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 622 | 0.008000 | -0.027000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 623 | 0.144000 | 0.096000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 624 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 625 | 0.025000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 626 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 627 | 0.150000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 628 | -0.407000 | 0.000000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 629 | 0.000000 | 0.000000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 630 | -0.442000 | 0.150000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 631 | -0.407000 | 0.000000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 632 | 0.101000 | 0.055000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 633 | 0.017000 | -0.027000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 634 | 0.004000 | -0.027000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 635 | 0.025000 | 0.099000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 636 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 637 | 0.025000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 638 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 639 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 640 | -0.041000 | 0.000000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 641 | -0.077000 | 0.000000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 642 | -0.160000 | 0.000000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 643 | 0.140000 | 0.187000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 644 | 0.257000 | 0.120000 | 0.150000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 645 | 0.174000 | 0.036000 | -0.010000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 646 | 0.103000 | 0.036000 | -0.010000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 647 | 0.296000 | 0.359000 | -0.010000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 648 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 649 | 0.025000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 650 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 651 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 652 | 0.461000 | 0.461000 | 0.206000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 653 | 0.299000 | 0.299000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 654 | 0.330000 | 0.299000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 655 | 0.272000 | 0.272000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 656 | 0.047000 | 0.046000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 657 | 0.000000 | 0.000000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 658 | 0.024000 | 0.150000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 659 | 0.047000 | 0.197000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 660 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 661 | 0.047000 | 0.063000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 662 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 663 | 0.142000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 664 | -0.407000 | 0.000000 | -0.037000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 665 | -0.389000 | 0.150000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 666 | -0.389000 | 0.150000 | -0.037000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 667 | -0.407000 | 0.151000 | -0.037000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 668 | 0.047000 | 0.047000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 669 | 0.000000 | 0.000000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 670 | 0.000000 | 0.000000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 671 | 0.060000 | 0.186000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 672 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 673 | 0.047000 | 0.063000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 674 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 675 | 0.142000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 676 | -0.041000 | 0.000000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 677 | -0.094000 | 0.000000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 678 | -0.094000 | 0.000000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 679 | -0.057000 | 0.151000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 680 | 0.435000 | 0.299000 | -0.006000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 681 | 0.259000 | 0.122000 | 0.094000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 682 | 0.259000 | 0.122000 | -0.006000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 683 | 0.403000 | 0.466000 | -0.006000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 684 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 685 | 0.025000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 686 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 687 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 688 | 0.461000 | 0.461000 | 0.206000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 689 | 0.299000 | 0.299000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 690 | 0.330000 | 0.299000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 691 | 0.287000 | 0.287000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 692 | -0.016000 | -0.016000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 693 | 0.024000 | 0.150000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 694 | 0.024000 | 0.150000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 695 | -0.016000 | 0.134000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 696 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 697 | 0.047000 | 0.063000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 698 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 699 | 0.142000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 700 | -0.407000 | 0.000000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 701 | 0.000000 | 0.000000 | -0.037000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 702 | 0.000000 | 0.000000 | -0.037000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 703 | 0.155000 | 0.187000 | -0.037000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 704 | -0.015000 | -0.016000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 705 | 0.000000 | 0.000000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 706 | 0.000000 | 0.000000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 707 | 0.016000 | 0.166000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 708 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 709 | 0.047000 | 0.063000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 710 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 711 | 0.142000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 712 | 0.132000 | 0.000000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 713 | 0.132000 | 0.000000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 714 | -0.127000 | 0.151000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 715 | 0.132000 | 0.151000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 716 | 0.254000 | 0.119000 | 0.010000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 717 | 0.234000 | 0.098000 | 0.010000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 718 | 0.234000 | 0.098000 | 0.010000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 719 | 0.204000 | 0.266000 | 0.010000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 720 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 721 | 0.025000 | 0.031000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 722 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 723 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 724 | 0.460000 | 0.461000 | 0.206000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 725 | 0.299000 | 0.299000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 726 | 0.330000 | 0.299000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 727 | 0.287000 | 0.287000 | 0.006000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 728 | 0.016000 | 0.016000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 729 | 0.000000 | 0.000000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 730 | 0.000000 | 0.000000 | -0.180000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 731 | 0.040000 | 0.157000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 732 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 733 | 0.047000 | 0.063000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 734 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 735 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 736 | -0.407000 | 0.000000 | -0.037000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 737 | 0.000000 | 0.000000 | -0.037000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 738 | 0.000000 | 0.000000 | -0.037000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 739 | 0.143000 | 0.172000 | -0.037000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 740 | -0.015000 | -0.016000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 741 | 0.000000 | 0.000000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 742 | 0.024000 | 0.150000 | -0.030000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 743 | -0.016000 | 0.134000 | -0.030000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 744 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 745 | 0.047000 | 0.063000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 746 | 0.000000 | 0.000000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 747 | 0.142000 | 0.187000 | 0.200000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 748 | 0.132000 | 0.000000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 749 | -0.127000 | 0.151000 | 0.000000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 750 | -0.127000 | 0.151000 | -0.007000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 751 | 0.132000 | 0.151000 | -0.007000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 752 | 0.255000 | 0.118000 | 0.010000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 753 | 0.234000 | 0.098000 | 0.010000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 754 | 0.234000 | 0.098000 | 0.010000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 755 | 0.210000 | 0.281000 | 0.010000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 756 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 757 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 758 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 759 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 760 | 0.062000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 761 | 0.062000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 762 | 0.051000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 763 | 0.062000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 764 | 0.073000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 765 | 0.073000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 766 | 0.061000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 767 | 0.061000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 768 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 769 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 770 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 771 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 772 | 0.073000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 773 | 0.073000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 774 | 0.061000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 775 | 0.061000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 776 | 0.073000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 777 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 778 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 779 | 0.073000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 780 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 781 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 782 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 783 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 784 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 785 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 786 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 787 | 0.061000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 788 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 789 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 790 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 791 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 792 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 793 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 794 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 795 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 796 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 797 | 0.209000 | 0.294000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 798 | 0.120000 | 0.171000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 799 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 800 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 801 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 802 | 0.062000 | 0.089000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 803 | 0.088000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 804 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 805 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 806 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 807 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 808 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 809 | 0.157000 | 0.223000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 810 | 0.157000 | 0.223000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 811 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 812 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 813 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 814 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 815 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 816 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 817 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 818 | 0.088000 | 0.125000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 819 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 820 | 0.092000 | 0.129000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 821 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 822 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 823 | 0.183000 | 0.259000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 824 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 825 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 826 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 827 | 0.000000 | 0.000000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 828 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 829 | 0.322000 | 0.124000 | 0.029000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 830 | 0.322000 | 0.124000 | 0.029000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 831 | 0.088000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 832 | 0.473000 | 0.436000 | 0.376000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 833 | 0.449000 | 0.348000 | 0.310000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 834 | 0.490000 | 0.397000 | 0.316000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 835 | 0.473000 | 0.463000 | 0.376000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 836 | -0.316000 | -0.168000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 837 | -0.254000 | -0.096000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 838 | -0.247000 | -0.088000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 839 | -0.410000 | -0.277000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 840 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 841 | 0.322000 | 0.124000 | 0.029000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 842 | 0.322000 | 0.124000 | 0.029000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 843 | 0.088000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 844 | 0.010000 | 0.142000 | 0.211000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 845 | 0.014000 | 0.144000 | 0.311000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 846 | 0.014000 | 0.144000 | 0.311000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 847 | 0.010000 | 0.142000 | 0.211000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 848 | -0.307000 | -0.158000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 849 | -0.247000 | -0.088000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 850 | -0.254000 | -0.096000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 851 | -0.417000 | -0.285000 | -0.033000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 852 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 853 | 0.322000 | 0.124000 | 0.029000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 854 | 0.239000 | 0.000000 | 0.029000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 855 | 0.106000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 856 | 0.411000 | 0.500000 | 0.240000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 857 | 0.649000 | 0.774000 | 0.240000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 858 | 0.649000 | 0.774000 | 0.240000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 859 | 0.330000 | 0.406000 | 0.270000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 860 | 0.465000 | 0.564000 | 0.396000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 861 | 0.411000 | 0.499000 | 0.400000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 862 | 0.404000 | 0.493000 | 0.396000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 863 | 0.465000 | 0.564000 | 0.546000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 864 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 865 | 0.085000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 866 | 0.085000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 867 | 0.085000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 868 | -0.989000 | -0.214000 | 0.084000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 869 | -0.916000 | -0.154000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 870 | -0.720000 | -0.234000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 871 | -1.190000 | -0.224000 | 0.032000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 872 | 0.037000 | 0.036000 | 0.327000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 873 | 0.253000 | 0.255000 | 0.327000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 874 | -0.080000 | 0.255000 | 0.327000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 875 | 0.087000 | 0.086000 | 0.330000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 876 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 877 | 0.085000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 878 | 0.085000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 879 | 0.085000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 880 | -0.929000 | -0.289000 | -0.095000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 881 | -0.944000 | -0.312000 | -0.095000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 882 | -0.862000 | -0.312000 | -0.118000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 883 | -0.929000 | -0.289000 | -0.095000 | nierozstrzygniete | Brak wystarczającej zewnętrznej oceny. Niższa ocena pozostaje widoczna; decyzja nie jest automatycznie usprawiedliwiona. |
| 884 | 0.045000 | 0.047000 | 0.327000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 885 | 0.248000 | 0.246000 | 0.327000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 886 | -0.086000 | 0.246000 | 0.327000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 887 | -0.637000 | -0.105000 | 0.325000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 888 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 889 | 0.244000 | 0.000000 | 0.028000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 890 | 0.242000 | 0.000000 | 0.028000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 891 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 892 | -0.231000 | -0.085000 | 0.031000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 893 | 0.179000 | 0.141000 | 0.060000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 894 | 0.143000 | 0.140000 | 0.060000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 895 | -0.407000 | -0.026000 | 0.026000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 896 | 0.115000 | 0.292000 | 0.541000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 897 | -0.107000 | 0.066000 | 0.391000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 898 | -0.107000 | 0.066000 | 0.541000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 899 | 0.205000 | 0.383000 | 0.388000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 900 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 901 | 0.085000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 902 | 0.085000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 903 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 904 | -1.079000 | -0.333000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 905 | -0.916000 | -0.154000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 906 | -0.716000 | -0.243000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 907 | -1.190000 | -0.224000 | 0.032000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 908 | 0.262000 | 0.093000 | 0.358000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 909 | 0.336000 | 0.168000 | 0.358000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 910 | 0.115000 | 0.146000 | 0.511000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 911 | 0.262000 | 0.093000 | 0.361000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 912 | 0.098000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 913 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 914 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 915 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 916 | -0.320000 | -0.289000 | 0.083000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 917 | -0.174000 | -0.312000 | 0.096000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 918 | -0.174000 | -0.312000 | 0.089000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 919 | -0.330000 | -0.300000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 920 | 0.251000 | 0.082000 | 0.358000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 921 | 0.328000 | 0.159000 | 0.358000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 922 | 0.336000 | 0.168000 | 0.358000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 923 | -0.378000 | -0.006000 | 0.358000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 924 | 0.098000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 925 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 926 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 927 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 928 | -0.035000 | -0.085000 | 0.060000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 929 | 0.159000 | -0.085000 | 0.088000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 930 | 0.159000 | -0.085000 | 0.088000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 931 | -0.036000 | -0.084000 | 0.067000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 932 | 0.221000 | 0.399000 | 0.391000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 933 | -0.067000 | 0.107000 | 0.541000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 934 | -0.067000 | 0.107000 | 0.541000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 935 | 0.201000 | 0.380000 | 0.388000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 936 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 937 | 0.085000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 938 | 0.244000 | 0.000000 | 0.028000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 939 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 940 | -1.079000 | -0.333000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 941 | -0.912000 | -0.163000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 942 | -0.716000 | -0.243000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 943 | -1.188000 | -0.205000 | 0.032000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 944 | 0.438000 | 0.289000 | 0.371000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 945 | 0.095000 | 0.130000 | 0.511000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 946 | 0.066000 | 0.100000 | 0.524000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 947 | 0.438000 | 0.289000 | 0.374000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 948 | 0.098000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 949 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 950 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 951 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 952 | -0.320000 | -0.289000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 953 | -0.140000 | -0.312000 | 0.111000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 954 | -0.152000 | -0.321000 | 0.111000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 955 | -0.352000 | -0.321000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 956 | 0.428000 | 0.278000 | 0.371000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 957 | 0.355000 | 0.202000 | 0.371000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 958 | 0.364000 | 0.211000 | 0.371000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 959 | 0.387000 | 0.235000 | 0.361000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 960 | 0.098000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 961 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 962 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 963 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 964 | 0.164000 | -0.085000 | 0.088000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 965 | 0.367000 | -0.085000 | 0.217000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 966 | 0.309000 | -0.150000 | 0.224000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 967 | 0.168000 | -0.084000 | 0.088000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 968 | 0.186000 | 0.365000 | 0.398000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 969 | 0.116000 | 0.293000 | 0.398000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 970 | 0.116000 | 0.293000 | 0.398000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 971 | 0.236000 | 0.415000 | 0.395000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 972 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 973 | 0.244000 | 0.000000 | 0.028000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 974 | 0.242000 | 0.000000 | 0.028000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 975 | 0.102000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 976 | -1.086000 | -0.355000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 977 | -0.912000 | -0.163000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 978 | -0.720000 | -0.234000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 979 | -1.188000 | -0.205000 | 0.032000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 980 | 0.387000 | 0.235000 | 0.358000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 981 | 0.364000 | 0.211000 | 0.521000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 982 | 0.364000 | 0.211000 | 0.521000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 983 | -0.116000 | 0.255000 | 0.371000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 984 | 0.098000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 985 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 986 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 987 | 0.098000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 988 | -0.320000 | -0.289000 | 0.083000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 989 | -0.152000 | -0.321000 | 0.111000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 990 | -0.152000 | -0.321000 | 0.111000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 991 | -0.352000 | -0.321000 | 0.090000 | uzasadniona_zmiana_kontroli_wewnetrzna | Maksymalny krótki test zastąpiono kontrolowaną ekspozycją. To ocena celu jednostki, nie dowód lepszego wyniku. |
| 992 | 0.428000 | 0.278000 | 0.371000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 993 | 0.364000 | 0.211000 | 0.371000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 994 | 0.095000 | 0.130000 | 0.511000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 995 | 0.438000 | 0.289000 | 0.374000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 996 | 0.098000 | 0.150000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 997 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 998 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 999 | 0.082000 | 0.124000 | 0.000000 | zmiana_lub_remis | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 1000 | 0.168000 | -0.084000 | 0.088000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 1001 | 0.309000 | -0.150000 | 0.224000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 1002 | 0.309000 | -0.150000 | 0.217000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 1003 | 0.168000 | -0.084000 | 0.088000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 1004 | 0.186000 | 0.364000 | 0.398000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 1005 | 0.116000 | 0.293000 | 0.398000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 1006 | 0.116000 | 0.293000 | 0.398000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |
| 1007 | 0.244000 | 0.423000 | 0.395000 | poprawa_heurystyczna | Zachowano twarde ograniczenia i odrębne dowody wykonania. |

Każdy remis również zachowano, wraz z wejściem i faktycznymi sesjami w archiwum Brotli.
