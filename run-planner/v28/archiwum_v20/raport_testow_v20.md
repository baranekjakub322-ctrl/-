# Raport testów V20

Data uruchomienia: 2026-11-02. Wszystkie liczby poniżej pochodzą z plików `wyniki/*.json` wygenerowanych przez `uruchom_wszystko.sh`.

**Zestawy zaliczone:** podstawowe trudne czulosc regresje porownanie28 porownanie_v19_v20 sweep skrypt_bledy

**Zestawy niezaliczone:** brak

## Podsumowanie

| Zestaw | Zaliczone | Niezaliczone |
|---|---|---|
| podstawowe | 107 | 0 |
| trudne | 93 | 0 |
| czulosc | 28 | 0 |
| regresje | 17 | 0 |
| porownanie28 | 31 | 0 |
| porownanie_v19_v20 | 12 | 0 |
| sweep | 21 | 0 |
| skrypt_bledy | 4 | 0 |
| **Razem** | **313** | **0** |

Uwaga: liczba asercji nie jest miarą jakości planów. Zaliczone testy oznaczają, że plany spełniają *zdefiniowane* niezmienniki; nie dowodzą, że są optymalne treningowo.

## Sweep (pełna siatka)

- Deklarowana liczba scenariuszy: **9408**; wykonane: **9408**; unikalne: **9408**.
- Dni tygodnia jako dzień startu planu: {"0":1344,"1":1344,"2":1344,"3":1344,"4":1344,"5":1344,"6":1344}; dni zawodów: {"0":1344,"1":1344,"2":1344,"3":1344,"4":1344,"5":1344,"6":1344}.
- Plany z krytycznym naruszeniem niezależnych niezmienników: **0** (krytycznych naruszeń: 0).
- Ostrzeżenia miernika (łącznie): 21378.
- „Ślepe plamki” audytu wewnętrznego (miernik niezależny znalazł krytyczne, audyt generatora uznał plan za zgodny): 0.
- Rozkład kodów problemów: `{"DLUGA_PRZERWA:ostrzezenie":1392,"BIEG_ZA_KROTKI:ostrzezenie":1158,"REGENERACJA_ZA_DLUGA:ostrzezenie":16473,"UDZIAL_DLUGIEGO:ostrzezenie":2326,"TAPER_PLYTKI:ostrzezenie":6,"WZROST_KM:ostrzezenie":23}`

**Ten sam sweep na V19 (linia bazowa):** plany z krytycznym: 272, krytyczne naruszenia: 272, ostrzeżenia miernika: 21976, ślepe plamki audytu: 253. (Uwaga: V19 nie ma pola `gotowosc.rozdzielenie`; oba generatory oceniane tym samym miernikiem.)

## Testy regresyjne na V19 (oczekiwane niezaliczenia)

Na V19: zaliczone 8, niezaliczone 7. Niezaliczone na V19 (wady wykryte przez regresje):
- R2d: 1 bieg/tydz. po 40 km/16 km: odciążenie w planie (V19: 8 tygodni obciążenia pod rząd)
- R3: marathon w 6 tyg.: brak długiego biegu ponad pułap tuż przed startem
- R3: half w 6 tyg.: brak długiego biegu ponad pułap tuż przed startem
- R4a: wiek 58 daje inny plan niż 35
- R4b: wiek 58: więcej tygodni odciążających
- R5a: maraton z 10 km/5 km => brak bezpiecznej bazy, brak możliwości ukończenia
- R5c: brak wyniku odniesienia => doKonkretnegoWyniku=false

Na V20: zaliczone 17, niezaliczone 0. Testy R1, R2a–R2c, R6, R7 przechodzą także na V19: chronią przed regresją, ale same nie wykazały wady V19 (patrz zmiany_v19_v20.md).

## V19 vs V20 (ten sam miernik, 1008 scenariuszy)

| Dystans | Śr. ocena V19 | Śr. ocena V20 | Plany z kryt. V19 | Plany z kryt. V20 | Ostrz. V19 | Ostrz. V20 |
|---|---|---|---|---|---|---|
| 5k | 9.051 | 9.105 | 12 | 0 | 636 | 632 |
| 10k | 8.79 | 8.82 | 12 | 0 | 587 | 584 |
| half | 7.956 | 7.983 | 0 | 0 | 608 | 552 |
| marathon | 7.122 | 7.149 | 3 | 0 | 591 | 583 |

Oceny to heurystyka (patrz ocena_jakosci_v20.md), a różnice średnich są małe: poprawki V20 dotyczą głównie krytycznych przypadków brzegowych, a nie typowego planu.

## Statystyki pliku głównego

`planGenerator_v20.js`: 2306 linii, 211655 bajtów.

## Co faktycznie uruchomiono

Uruchomiono: podstawowe, trudne, czulosc, regresje, porownanie28, porownanie_v19_v20, sweep, skrypt_bledy, linię bazową V19 (regresje, sweep). Nie uruchomiono: nic z wymaganej listy nie zostało pominięte.

### Czego ten raport NIE obejmuje

- Testów V19 z folderu `testy/` z oryginalnego pakietu (sweep.mjs, lib.mjs itd.) — nie były dostępne; ich rolę przejęły testy napisane od zera. Zarzuty wobec starego `sweep.mjs` (pkt B) nie mogły być zweryfikowane na jego kodzie; zamiast tego nowy sweep ma asercje pokrycia.
- Weryfikacji treningowej przez trenera ani badań na ludziach.
