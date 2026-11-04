# Decyzje projektowe V28

| Problem | Zmiana kodu | Dowód | Koszt/ryzyko | Nierozwiązane |
|---|---|---|---|---|
| Prędkość utrzymana ≠ tolerancja maratonu | profile_v28.enduranceIntent + season_v28.buildSeason | Macierz maraton 4–7 dni i explicit-maintain test | Rozwój jest warunkowy; deklaracja nie potwierdza tolerancji | Progi gotowości nie są klinicznie zwalidowane |
| Krótki akcent wypiera easy i skraca long | constraints_v28.constrainedWeek + buildWeek.qualityDow | Referencja 60 km: środa zamiast wtorku; trace 8 tygodni | Więcej pracy alokatora; limit 4 kandydatów | Brak globalnego optimum bloku |
| Utrata celu po korekcie | planning_v28.feasibleEnvelope / verifyWeekIntent / reconcileFinalAllocation | Końcowe tygodnie zgadzają się z rzeczywistymi receptami | Minimum miękkie, bez wymuszania km | Fallback może oznaczać niższą skuteczność celu |
| Planowane ekspozycje udają dowód | quality_v28.comparableExposureState + ledger_v28 | Dwie daty / RPE / dawka; brak dowodu przy samym czasie sesji | Konserwatywne ograniczenia bez RPE | Brak prospektywnych danych |
| Niejawna ostatnia przerwa w interwałach | liczba_przerw=n−1; units_v28.stepDistance | Ścisła suma etapów i kontrola liczby przerw | Starszy import bez licznika zachowuje dawną semantykę | Czas i HR nadal szacowane |
| Koszt walidacji i dat | Cache tempa, serializacja dat, koniec tygodnia raz, pruning duplikatu | 1324/1324 identycznych jednostek przed/po optymalizacji | Czas zależny od maszyny/JIT | Cel ≤20 ms raportowany bez gwarancji |
