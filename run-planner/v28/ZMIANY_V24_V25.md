# Zmiany V24 → V25

Baza V24 została uruchomiona przed zmianami: 21 zestawów, 980 PASS / 0 FAIL. Odtworzono 1008 wejść i 89 obniżeń. Pełna diagnoza z rzeczywistymi tygodniami i receptami: DIAGNOZA_89_REGRESJI_V24.md oraz diagnostyka_v25/regresje_v24.json.

- **Maraton:** faza specyficzna daje przewagę MP, nie zastępuje mechanicznie co drugiego MP progiem. Okresowy próg pozostaje. Budżet spokojnej średniej jednostki uwzględnia tolerowaną objętość. Nie zmieniano globalnie wszystkich limitów.
- **Długi bieg:** indywidualny limit czasu zależy od najdłuższej jednostki, wieku, bazy i fazy. Etapy planowane są warunkowe, a przy bólu/małej tolerancji ograniczone. Czas nie stanowi gwarancji bezpieczeństwa.
- **1–2 dni:** osobne modele zachowane i rozwinięte. Przygotowany zawodnik z jednym dniem może mieć swobodne przebieżki w ramach jednej łatwej jednostki. Dwa dni rozdzielają rozwój/łatwy i wytrzymałość; HM może użyć ostrożnego bodźca specyficznego. Kolejne dostępne dni wyłączają nieuzasadniony akcent obok długiego. Maraton pozostaje ograniczony/niewykonalny przy tej częstości.
- **Próg:** nieparzyste półkilometry są dzielone na dwa bloki bez ukrytego dodania 0,5 km. Tempo nie przyspiesza za kalendarz.
- **Krótki staż:** wyłączenie jakości nie jest kompensowane dodatkowym wzrostem km przy już dużej deklarowanej bazie.
- **Wykonanie:** nowe identyfikatory, kilka aktywności dnia, import strefowy, jawne correct/cancel/restore, surowy oryginał i audyt before/after. Brak cichego nadpisania i automatycznego przywrócenia anulowanego duplikatu.
- **Adaptacja:** trend kilku porównywalnych wykonanych ekspozycji, RPE i regularność. Jeden dobry test ma limit 0,5%, potwierdzony trend 2% VDOT względem bazy. Ból wstrzymuje obciążenia; przerwy i zmęczenie obniżają plan. Brak nadrabiania i brak kumulowania tego samego obniżenia przy retransmisji.
- **Wejście wykonania:** wspólny publiczny walidator nowych pól; direct generatePlan i updatePlan respektują objawy z obserwacji. completedHistory to wykonanie, executionObservations/observedActivities obejmują także pominięcia/objawy. Nie rozstrzyga się sprzecznych dat-only zgłoszeń bólu kolejnością id.
- **Gotowość:** plannedWorkouts, completedHistory, adaptationDecisions i readinessEvidence rozdzielone. Brak przejścia do potwierdzonej gotowości M tylko z zaplanowanego szczytu. Stare pole gotowoscHistorii zachowano dla zgodności, nowe źródło dowodów wyraźnie wskazuje deklarację lub wykonanie.
- **Żywienie/warunki:** opcjonalne doświadczenie, GI, czas, temperatura i profil trasy w osobnych wskazówkach; bez fikcyjnej prognozy i dokładnych korekt sekund/km.
- **Ocena:** niezmieniony V23 oraz osobny V25. Oddzielono jakość planowania, wykonalność i niepewność. Rodziny jakości przed taperem, utrzymanie i mała częstość mają właściwy kontekst. Pełna metodologia ujawniona w SYSTEM_OCENIANIA_V25.md.

Dokładne wyniki, niższe oceny i nieosiągnięte cele są w benchmarkach. Poprawa techniczna nie stanowi dowodu skuteczności klinicznej. Nie stworzono UI ani nowego silnika od zera.
