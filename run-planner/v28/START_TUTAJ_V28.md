# Run Planner V28

Rozwinięcie istniejącego V27 bez UI i nowych zależności. Node ≥18, Bash do testów skryptu; Python ≥3.8 do pakowania. Testowano na v24.19.0.

## Uruchomienie

```sh
node --version
npm test
npm run test:v28
npm run test:adaptation
npm run calibrate
npm run benchmark
npm run profile
npm run report
python3 testy/pakuj_v28.py /wybrana/sciezka/RunPlanner_V28.zip
```
Zachowano polecenia compare oraz test:v27; profile obejmuje generowanie, import i adaptację. Nie potrzeba npm install. WYNIKI=/inna/sciezka zmienia katalog wyników; używaj tej samej wartości dla testów, benchmarków i raportu. npm test uruchamia 17 etapów. Raport i pakowanie wymagają pełnego przebiegu i zgodnych hashy źródeł.

## API i dane

```js
import {generatePlan,updatePlan,scoreV23,scoreV25} from './planGenerator_v28.js';
import {auditPlan} from './scoring/v28.mjs';
const input={today:'2026-11-02',age:35,level:'intermediate',currentWeeklyKm:35,longestRecentRun:14,bestResult:{distanceKm:10,timeSec:3120},goal:{type:'10k',targetTimeSec:3214,raceDate:'2027-03-28'},daysPerWeek:3,availableDays:[0,1,2,3,4,5,6]};
const plan=generatePlan(input);
const traced=generatePlan({...input,debugTrace:true});
console.log(plan.ok,plan.athleteEvidence,plan.intentVerification);
console.log(auditPlan(input,plan));
```
Zachowano eksporty i formaty V27. Daty YYYY-MM-DD; dni 0=niedziela..6=sobota; km, minuty sesji, sekundy wyników. Nowe debugTrace to opcjonalne boolean, domyślnie brak danych trace. planningCandidates nadal 2–4. activity.sessionType dodatkowo hill i strides; workMinutes dotyczy samej pracy, nie całej aktywności. Podbiegi mają jawne praca_min (same odcinki pod górę), a economyExposures opisuje planowane rytmy wliczone w dystans easy, bez potwierdzania wykonania. Żywienie nie wyznacza uniwersalnej dawki: podana ilość pozostaje deklaracją wcześniejszych prób, nie automatyczną receptą. Parametry V27 są opisane w 01_START_TUTAJ_V27.md.

athleteEvidence rozdziela observed/declared/inferred/goal/constraints. seasonState.allocatedWeeks i starsze realized to zaalokowany PLAN, nie wykonanie. completedHistory, adaptationDecisions i readinessEvidence pozostają osobno. FeasibleEnvelope.minimum jest miękkim kryterium adekwatności. liczba_przerw opisuje rzeczywiste n−1 przerw; starsze recepty bez pola zachowują obsługę historyczną.

## Wyniki

Baza V27: b6af91c21c4da6ed1537a93c3daf60cec1c66ec0; v24.19.0. Frozen-1008-v24 SHA-256 00ab459021dbf3100e0cc08a1b4472f7cbafa09a5425033307cdb79656ed008d. Historyczne mierniki pozostają bajtowo niezmienione: 23.0.0 a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71, 25.0.0 09dfeeb6b6ab25bdbae4065b5d2166b75f9d1c7f286408337fa8c912f65332b2; audyt 27.0.0 f267bf8bd66c34f026bb44fe2e7592716bfe522018f3499b5219aa8aa7ae8235. Wszystkie porównania stosują ten sam miernik do obu wersji. Audyt 28.0.0 jest odrębny, heurystyczny i nie uczestniczy w wyborze kandydatów.

| Miernik | V27 / 1008 | V28 / 1008 | +/=/- |
|---|---|---|---|
| 23.0.0 | 7.492178 | 7.547016 | 117/882/9 |
| 25.0.0 | 9.315776 | 9.325793 | 77/905/26 |
| Audyt 27.0.0 | 7.419161 | 7.424634 | 47/957/4 |
| Diagnostyczny 28.0.0 | 7.637857 | 7.883759 | 299/705/4 |

2144 PASS / 0 FAIL; sweep 9408, krytyczne 0, ostrzeżenia 181. 47 profili / 46 pełnych planów i jeden bezpiecznie wstrzymany. 150 historii 8–12 tygodni oraz 4 dodatkowe sekwencje 16-tygodniowe.

Pełne pary 1324 wejść w wyniki_v28/full-plans.jsonl.br, profile i trace w podkatalogach wyników. Czytaj je bez bibliotek zewnętrznych:

```sh
node narzedzia/read_plans_v27.mjs wyniki_v28/full-plans.jsonl.br frozen1008 887 > plan887.json
```
| Problem | Zmiana kodu | Dowód | Koszt/ryzyko | Nierozwiązane |
|---|---|---|---|---|
| Prędkość utrzymana ≠ tolerancja maratonu | profile_v28.enduranceIntent + season_v28.buildSeason | Macierz maraton 4–7 dni i explicit-maintain test | Rozwój jest warunkowy; deklaracja nie potwierdza tolerancji | Progi gotowości nie są klinicznie zwalidowane |
| Krótki akcent wypiera easy i skraca long | constraints_v28.constrainedWeek + buildWeek.qualityDow | Referencja 60 km: środa zamiast wtorku; trace 8 tygodni | Więcej pracy alokatora; limit 4 kandydatów | Brak globalnego optimum bloku |
| Utrata celu po korekcie | planning_v28.feasibleEnvelope / verifyWeekIntent / reconcileFinalAllocation | Końcowe tygodnie zgadzają się z rzeczywistymi receptami | Minimum miękkie, bez wymuszania km | Fallback może oznaczać niższą skuteczność celu |
| Planowane ekspozycje udają dowód | quality_v28.comparableExposureState + ledger_v28 | Dwie daty / RPE / dawka; brak dowodu przy samym czasie sesji | Konserwatywne ograniczenia bez RPE | Brak prospektywnych danych |
| Niejawna ostatnia przerwa w interwałach | liczba_przerw=n−1; units_v28.stepDistance | Ścisła suma etapów i kontrola liczby przerw | Starszy import bez licznika zachowuje dawną semantykę | Czas i HR nadal szacowane |
| Koszt walidacji i dat | Cache tempa, serializacja dat, koniec tygodnia raz, pruning duplikatu | 1324/1324 identycznych jednostek przed/po optymalizacji | Czas zależny od maszyny/JIT | Cel ≤20 ms raportowany bez gwarancji |

## Co nie zostało poprawione lub potwierdzone

Nie osiągnięto aspiracyjnej średniej 7,70: wynik 7.547016. Dawnych 250 obniżeń względem V26 pozostało 223; nie zredukowano ich o połowę. P10 historycznego miernika i najgorszy decyl: 4.864000 → 4.864000 i 3.973376 → 3.973376. Nie nazywamy tego przełomem.

Względem V27 jest 21 popraw według rygorystycznego kryterium zmian recept i audytu. Według dokładnie pierwotnego kryterium V27, ze wspólną bazą V26, jest 237 wobec wcześniejszych 233; obie liczby mają różne punkty odniesienia i nie wolno ich utożsamiać. To oceny wewnętrzne, bez dowodu poprawy wyników sportowych.

W frozen-1008 występuje 9 nowych spadków, w holdoucie 64 — 1, w 224 — 11. Miernik 25.0.0 na holdoucie 224: 9.049013 → 9.046366. Zachowano wszystkie przypadki.

Nie przeprowadzono zewnętrznej oceny trenera ani badań efektów, urazowości i gotowości medycznej. Przegląd anonimowy jest wewnętrzny, regułowy, z ukrytymi etykietami wersji; autor zna implementację, więc nie jest to niezależny, zaślepiony eksperyment trenerski.

Deklarowane 60 km i 24 km nie są wykonaniem. Koperta pozostaje warunkowa, minimum jest sygnałem adekwatności, a nie uprawnieniem do wymuszania dawki. Przy 1–2 dniach maraton nadal może wymagać zmiany celu. Estymowane HR i minuty × RPE nie są pomiarem progów ani prognozą urazu.

Przeszukiwanie tygodnia jest lokalne i ograniczone, bez pełnego beam search całego bloku. Zachowuje pamięć sezonu i trudnych dat; nie gwarantuje globalnego optimum. Niektóre warianty są nadal ograniczane historycznymi alokatorami/naprawami, ale trace ujawnia ich skutki. Dawki i progi RPE pozostają heurystyczne. athleteEvidence.declared opisuje roboczy profil po normalizacji i ograniczeniu sprzecznych danych wykonaniem, a nie archiwum surowego formularza; surowe wejście należy zachować osobno. Observed nie jest uzupełniane zaplanowanymi treningami.

Etykiety proponowanych alternatyw rozróżniają teraz kryteria harmonogramu i potwierdzenie wykonaniem. Nadal są oceną heurystyczną, bez gwarancji sportowej lub medycznej.

Instrukcje i dane bazowe zawierają identyfikator V27, niezmienione źródła V27/V26 oraz sumy kontrolne. SHA256SUMS dotyczy zawartości paczki przed testami zapisującymi nowe wyniki.
