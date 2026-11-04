# Audyt bezpieczeństwa V26

Sweep: {"scenarios":9408,"unique":9408,"plansWithCritical":0,"critical":0,"warnings":0}. Pełny zapis: wyniki_v26/history/sweep.json. Macierz 28+1008: 0 zgłoszeń nowych naruszeń. Dodatkowe stałe ziarno: 64 profili poza historyczną siatką; to wewnętrzna kontrola, nie zaślepiona walidacja zewnętrzna.

Walidator model/constraints_v26.mjs nie importuje scoringu. Sprawdza daty, skończone liczby, dostępność, jawne minuty, długi bieg, liczbę jednostek wraz ze startem, duplikaty, przeszłość oraz odstępy trudnych dni także przez granicę tygodni. Generator zachowuje wcześniejsze kontrole rampy, intensywności i koncentracji długiego; są też niezależne testy lib.mjs. Twarde limity nie służą funkcji celu punktowego.

Warianty tygodnia mają maksymalnie 2–4 kandydatów, deterministyczny remis i ślad decyzji. Najpierw ograniczenia, potem zachowanie zamierzonego bodźca, następnie bezpieczny budżet i stałość kalendarza. Nie nagradza się samej liczby akcentów.

Gotowość jest warunkowa bez wykonania. Dane o pogodzie/GI pozostają opcjonalne; nie tworzy się precyzyjnych sekund ani strat potu. Minuty × szacowane RPE są wskaźnikiem opisu, nie kliniczną prognozą urazu. Zero wykrytych naruszeń nie gwarantuje bezpieczeństwa każdej rzeczywistej osoby.
