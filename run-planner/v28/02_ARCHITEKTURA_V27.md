# Architektura V27

Zastąpiono inline planowanie faz i kolejnych tygodni trajektorią sezonową obliczaną przed wyborem sesji. Wcześniejsze podejście uzależniało przyszłą objętość od lokalnego przycięcia i mogło resetować bazę przy updatePlan. Teraz jawny seasonState zawiera originStart, granice faz, tygodnie z celami, odciążenia oraz wynik alokacji. pole realized oznacza wynik alokacji PLANU (status planned, notCompleted true), nie wykonanie.

| Warstwa | Implementacja | Kontrakt |
|---|---|---|
| Profil/niepewność | model/profile_v27.mjs + walidacja | Pochodzenie tempa/HR, dane zadeklarowane vs wykonane. |
| Wykonalność/gotowość | readiness_v27 + istniejące assessGoal | Warunkowy harmonogram ≠ osiągnięta gotowość. |
| Sezon/fazy/budżety | model/season_v27.mjs | Cele faz i trajektorie km/min/długiego przed alokacją. |
| Sesje/dawki | model/quality_v27.mjs + konstruktory | Rodziny bodźców, oprawa, dawka i przerwy. |
| Pamięć | model/ledger_v27.mjs + stimulusLedger | Poprzednia dawka, warunki i następny krok pozostają planned. |
| Kalendarz | model/constraints_v27.mjs | Ograniczony wybór i pruning, bez historycznego scoringu. |
| Adaptacja/import | adaptation_v27 + activity_v27 | Korekty, oryginały, idempotencja, 2–6 tygodni trendów. |
| Kontrola | validateSafety + niezależne testy i scoring/v27 | Krytyczne naruszenia osobno od jakości 0–10. |

Kontrakty: seasonState.weeks[index] = {ordinal, phase, adaptiveGoal, targets:{km,longKm,longMinutes,qualityMinutes}, recovery, conditionalOnExecution}. qualityMinutes jest celem miękkim; bezpieczeństwo i recepta mogą ograniczyć ekspozycję. Rozkład zawiera maksymalnie deklarowaną liczbę sesji, łącznie ze startem. Nie ma losowania sesji ani podnoszenia tempa z tygodnia na tydzień.

Istniejący alokator, historia dodatkowych startów, trening uzupełniający, HR i API pozostają; nie napisano uproszczonego generatora od zera. Dobór faz i obciążeń jest nowy, a nie tylko dopisany audyt. Przejścia są warunkowe i nie stanowią potwierdzenia adaptacji. Pełna globalna optymalność nie jest deklarowana.

Budżet: sześć iteracji projektowych z podpróbami naprawczymi. Hipotezy zamrożono przed zmianami w dane/hypotheses.json. Logi i efekty są w diagnostyka_v27/iteracje. Dane holdoutu odtwarza narzedzia/create_holdout_v27.mjs z seedem 270041, bez importu generatora.
