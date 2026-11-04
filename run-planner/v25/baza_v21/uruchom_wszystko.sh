#!/usr/bin/env bash
# Uruchamia KOMPLET testów V20. Zasady: brak "|| true", każdy test ma własny kod wyjścia, po awarii wymaganego testu
# skrypt kończy się kodem != 0, a raport końcowy NIE twierdzi sukcesu. Opcje: STOP_ON_FAIL=1 przerywa po pierwszej awarii;
# EXTRA_TEST=ścieżka dodaje test (używane przez testy/skrypt_bledy.mjs do sprawdzenia propagacji błędów).
set -uo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
export WYNIKI="${WYNIKI:-$PWD/wyniki}"
mkdir -p "$WYNIKI"
STOP_ON_FAIL="${STOP_ON_FAIL:-0}"
TESTS=(podstawowe trudne czulosc regresje czulosc_v21 jakosciowe dostepnosc porownanie28 porownanie_v19_v20 porownanie_v20_v21 sweep skrypt_bledy)
# tryb lekki (używany przez testy/skrypt_bledy.mjs, żeby uniknąć rekurencji i długiego sweepu)
[ "${TESTS_ONLY_LIGHT:-0}" = "1" ] && TESTS=(podstawowe)
[ -n "${EXTRA_TEST:-}" ] && TESTS+=("$EXTRA_TEST")
command -v node >/dev/null 2>&1 || { echo "BŁĄD: brak node w PATH" >&2; exit 2; }
FAILED=(); PASSED=()
for t in "${TESTS[@]}"; do
  f="testy/${t}.mjs"; [ -f "$t" ] && f="$t"
  if [ ! -f "$f" ]; then echo "BŁĄD: brak pliku testu $f" >&2; FAILED+=("$t(brak pliku)"); continue; fi
  echo "=== $t"
  node "$f" 2>&1 | tee "$WYNIKI/log_${t##*/}.txt"
  code=${PIPESTATUS[0]}
  if [ "$code" -ne 0 ]; then FAILED+=("$t(kod $code)"); [ "$STOP_ON_FAIL" = "1" ] && break; else PASSED+=("$t"); fi
done
# Linia bazowa V19 (informacyjnie): te same testy regresyjne i sweep na V19. Niezaliczenia tu są OCZEKIWANE (pokazują wady V19),
# więc nie wpływają na kod wyjścia; zapisujemy kod i wyniki do wyniki/baza_v19. To jawne rozgałęzienie, nie "|| true".
if [ "${TESTS_ONLY_LIGHT:-0}" != "1" ]; then
  for t in regresje sweep; do
    GEN=baza/planGenerator_v19.js WYNIKI="$WYNIKI/baza_v19" node "testy/$t.mjs" > "$WYNIKI/log_baza_v19_$t.txt" 2>&1
    echo "baza V19, $t: kod wyjścia $? (informacyjnie)"
  done
  # linia bazowa V20 (informacyjnie): ten sam sweep (z nową oceną i miernikami) na poprzedniej wersji
  GEN=baza/planGenerator_v20.js WYNIKI="$WYNIKI/baza_v20" node testy/sweep.mjs > "$WYNIKI/log_baza_v20_sweep.txt" 2>&1
  echo "baza V20, sweep: kod wyjścia $? (informacyjnie)"
fi
# raport końcowy generowany z faktycznych wyników; sam zgłasza błąd, gdy brakuje wyników któregoś testu
node testy/buduj_raporty.mjs "${PASSED[*]:-}" "${FAILED[*]:-}"
rc=$?
echo
if [ "${#FAILED[@]}" -gt 0 ]; then echo "WYNIK: NIEPOWODZENIE: ${FAILED[*]}"; exit 1; fi
if [ "$rc" -ne 0 ]; then echo "WYNIK: NIEPOWODZENIE (generowanie raportów, kod $rc)"; exit 1; fi
echo "WYNIK: wszystkie ${#PASSED[@]} zestawy testów zaliczone"
exit 0
