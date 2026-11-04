# Raport testów V21

Data: 2026-11-03. Liczby pochodzą z `wyniki/*.json` (generowane przez `uruchom_wszystko.sh`).

**Zestawy zaliczone:** podstawowe trudne czulosc regresje czulosc_v21 jakosciowe dostepnosc porownanie28 porownanie_v19_v20 porownanie_v20_v21 sweep skrypt_bledy

**Zestawy niezaliczone:** brak

## Podsumowanie

| Zestaw | Zaliczone | Niezaliczone |
|---|---|---|
| podstawowe | 107 | 0 |
| trudne | 93 | 0 |
| czulosc | 28 | 0 |
| regresje | 17 | 0 |
| czulosc_v21 | 38 | 0 |
| jakosciowe | 35 | 0 |
| dostepnosc | 9 | 0 |
| porownanie28 | 31 | 0 |
| porownanie_v19_v20 | 12 | 0 |
| porownanie_v20_v21 | 32 | 0 |
| sweep | 21 | 0 |
| skrypt_bledy | 4 | 0 |
| **Razem** | **427** | **0** |

Liczba asercji nie jest miarą jakości planów: zaliczone testy oznaczają spełnienie *zdefiniowanych* niezmienników, nie optymalność treningową.

## Sweep (pełna siatka)

- Scenariusze: deklarowane **9408**, wykonane **9408**, unikalne **9408**.
- Plany z krytycznym naruszeniem: **0**, naruszenia krytyczne: **0**.
- Ostrzeżenia miernika niezależnego: **27**.
- Pokrycie dnia startu planu: {"0":1344,"1":1344,"2":1344,"3":1344,"4":1344,"5":1344,"6":1344}; dnia zawodów: {"0":1344,"1":1344,"2":1344,"3":1344,"4":1344,"5":1344,"6":1344}.

### Ostrzeżenia według kategorii (kod:ciężar → liczba)

- WZROST_KM:ostrzezenie: 27

### Wyniki dla każdego dystansu (ocena V21)

| Dystans | Scenariuszy | Ocena ogólna | Bezpieczeństwo | Harmonogram | Dopasowanie | Progresja | Jakość treningów | Specyfika dystansu | Regeneracja | Kryt. | Ostrz. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 5k | 2352 | 9.86 | 10 | 10 | 10 | 10 | 10 | 9.56 | 10 | 0 | 0 |
| 10k | 2352 | 9.74 | 10 | 10 | 10 | 10 | 10 | 9.29 | 10 | 0 | 0 |
| half | 2352 | 9.4 | 10 | 10 | 10 | 10 | 10 | 8.38 | 10 | 0 | 8 |
| marathon | 2352 | 8.93 | 9.99 | 10 | 9.99 | 9.99 | 10 | 7.42 | 10 | 0 | 19 |

### Wyniki dla każdej częstotliwości treningów

| Dni/tydz. | Scenariuszy | Ocena ogólna | Bezpieczeństwo | Harmonogram | Dopasowanie | Progresja | Jakość treningów | Specyfika dystansu | Regeneracja | Kryt. | Ostrz. |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1344 | 8.34 | 10 | 10 | 10 | 10 | 10 | 6.34 | 10 | 0 | 0 |
| 2 | 1344 | 9.15 | 10 | 10 | 10 | 10 | 10 | 8.23 | 10 | 0 | 0 |
| 3 | 1344 | 9.76 | 9.99 | 10 | 9.99 | 9.99 | 10 | 9.16 | 10 | 0 | 22 |
| 4 | 1344 | 9.78 | 10 | 10 | 10 | 10 | 10 | 9.25 | 10 | 0 | 5 |
| 5 | 1344 | 9.78 | 10 | 10 | 10 | 10 | 10 | 9.26 | 10 | 0 | 0 |
| 6 | 1344 | 9.77 | 10 | 10 | 10 | 10 | 10 | 9.19 | 10 | 0 | 0 |
| 7 | 1344 | 9.78 | 10 | 10 | 10 | 10 | 10 | 9.21 | 10 | 0 | 0 |

**Ten sam sweep na V20 (baza):** plany z krytycznym: 0, naruszenia krytyczne: 0, ostrzeżenia: 121848; kody: {"REGENERACJA_BEZ_MOCNEGO:ostrzezenie":54042,"DLUGA_PRZERWA:ostrzezenie":1392,"BIEG_ZA_KROTKI:ostrzezenie":1158,"REGENERACJA_POZIOM:ostrzezenie":46428,"REGENERACJA_ZA_DLUGA:ostrzezenie":16473,"UDZIAL_DLUGIEGO:ostrzezenie":2326,"TAPER_PLYTKI:ostrzezenie":6,"WZROST_KM:ostrzezenie":23}.

## V20 vs V21 (1008 scenariuszy, ta sama ocena V21 i stary miernik)

| Dystans | Ocena V21 (V20→V21) | Stary miernik (V20→V21) | Plany z kryt. | Krytyczne | Ostrzeżenia |
|---|---|---|---|---|---|
| 5k | 7.875 → 9.857 | 8.568 → 9.571 | 0 → 0 | 0 → 0 | 3409 → 0 |
| 10k | 7.79 → 9.731 | 8.29 → 9.292 | 0 → 0 | 0 → 0 | 3490 → 0 |
| half | 7.576 → 9.376 | 7.503 → 8.366 | 0 → 0 | 0 → 0 | 3347 → 3 |
| marathon | 7.295 → 8.925 | 6.769 → 7.419 | 0 → 0 | 0 → 0 | 3283 → 7 |

Porównanie kodów (V20 → V21) dla problemów wskazanych w zadaniu:

| Kod | 5k | 10k | half | marathon |
|---|---|---|---|---|
| REGENERACJA_ZA_DLUGA | 503 → 0 | 516 → 0 | 443 → 0 | 364 → 0 |
| UDZIAL_DLUGIEGO | 0 → 0 | 37 → 0 | 56 → 0 | 169 → 0 |
| DLUGA_PRZERWA | 27 → 0 | 27 → 0 | 45 → 0 | 45 → 0 |
| BIEG_ZA_KROTKI | 102 → 0 | 4 → 0 | 3 → 0 | 5 → 0 |
| TAPER_PLYTKI | 0 → 0 | 0 → 0 | 3 → 0 | 0 → 0 |

## Porównanie 28 planów (profil: intermediate, 35 lat, 35 km/tydz., najdłuższy 14 km, 10 km w 52:00, start 2027-03-28, dostępne 7 dni)

- dystans: {"5k":9.57,"10k":9.57,"half":9.36,"marathon":8.29}
- czestotliwosc: {"1":6.63,"2":8.5,"3":9.63,"4":9.63,"5":10,"6":10,"7":10}
- ogolnie: 9.2

## Statystyki pliku głównego

`planGenerator_v21.js`: 2420 linii, 225164 bajtów.

### Czego ten raport NIE obejmuje

- Dowodu naukowego jakości planów: ocena i testy są heurystyczne.
- Weryfikacji na prawdziwych biegaczach (brak danych o realizacji planów).
- Linii bazowej V19 w całości (V19 jest uruchamiana tylko jako informacyjna baza regresji): zaliczone 8, niezaliczone 7.
