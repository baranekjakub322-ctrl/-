# Generator planów biegowych V21

Główny plik: `planGenerator_v21.js` (V20 w `baza/`). Zmiany: `zmiany_v20_v21.md`. Raporty: `raport_testow_v21.md`, `ocena_jakosci_v21.md` (po `bash uruchom_wszystko.sh`). Nowe w V21: pole `wykonalnosc`, opcja `trybScisly`, ocena `scoreV21`, testy `czulosc_v21`, `jakosciowe`, `dostepnosc`, `porownanie_v20_v21`.

(Poniżej README V20, nazwy plików `planGenerator_v20.js` czytaj jako `planGenerator_v21.js`.)

# Generator planów biegowych V20

Pakiet zawiera generator (`planGenerator_v20.js`, ES module), niezależny zestaw testów i raporty.

## Uruchomienie

Wymagany Node.js >= 18 (testowano na v22). Brak zależności zewnętrznych.

```bash
bash uruchom_wszystko.sh        # pełny zestaw (~5 min); kod wyjścia 0 tylko gdy WSZYSTKIE wymagane testy przechodzą
STOP_ON_FAIL=1 bash uruchom_wszystko.sh   # przerwij po pierwszej awarii
node testy/regresje.mjs         # pojedynczy zestaw
GEN=baza/planGenerator_v19.js node testy/regresje.mjs   # ten sam test na V19 (linia bazowa)
```

Wyniki: `wyniki/*.json` i logi `wyniki/log_*.txt`. `raport_testow_v20.md` i `ocena_jakosci_v20.md` są generowane z tych plików przez `testy/buduj_raporty.mjs`.

## Zestawy testów

| Plik | Co sprawdza |
|---|---|
| `testy/podstawowe.mjs` | kompatybilność eksportów API względem V19, walidacja, determinizm, niemutowanie wejścia, limity czasu |
| `testy/trudne.mjs` | przypadki brzegowe (niski/wysoki km, krótki/długi plan, 1–2 dni, kontuzje, przerwa, brak wyniku/historii, ambitny cel) |
| `testy/czulosc.mjs` | wpływ każdego parametru wejściowego (z jawnym oczekiwaniem projektowym) |
| `testy/regresje.mjs` | po jednym testie na każdą naprawioną wadę |
| `testy/porownanie28.mjs` | 28 planów (4 dystanse x 7 częstotliwości), oceny heurystyczne 1–10 |
| `testy/porownanie_v19_v20.mjs` | V19 vs V20 tym samym miernikiem, na wszystkich dystansach |
| `testy/sweep.mjs` | pełna siatka 9408 scenariuszy z asercjami pokrycia dni startu |
| `testy/skrypt_bledy.mjs` | czy `uruchom_wszystko.sh` poprawnie propaguje błędy |
| `testy/lib.mjs` | **niezależny miernik jakości** (nie korzysta z audytu generatora) i funkcja `score()` |

Zmienna `GEN` wybiera testowany generator (domyślnie `planGenerator_v20.js`). Katalog `baza/` zawiera niezmienioną V19 jako linię bazową.

## Ważne

- Oceny 1–10 są heurystyczne (kryteria w `testy/lib.mjs`), nie są wynikami badań.
- Zielone testy nie dowodzą jakości treningowej planów; zob. „Znane ograniczenia” w `zmiany_v19_v20.md`.
- Generator nie jest poradą medyczną ani trenerską.
