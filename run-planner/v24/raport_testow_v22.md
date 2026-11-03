# Raport testów V22

Wykonano: 2026-11-03T17:44:07.495Z. Node v24.19.0. Pełny przebieg: 174.2 s. Wszystkie 14 zestawy zakończone kodem 0; bez zestawów pominiętych. Dane: `wyniki_v22/run.json` i pliki wynikowe obok. SHA-256 źródeł zapisane przed uruchomieniem i sprawdzone ponownie po nim.

| Zestaw | Ponowiony V21 PASS/FAIL | Końcowy PASS/FAIL | Zakres |
|---|---:|---:|---|
| podstawowe | 107/0 | 107/0 | V22 |
| trudne | 93/0 | 93/0 | V22 |
| czulosc | 28/0 | 28/0 | V22 |
| regresje | 17/0 | 17/0 | V22 |
| czulosc_v21 | 38/0 | 38/0 | V22 |
| jakosciowe | 35/0 | 35/0 | V22 |
| dostepnosc | 9/0 | 9/0 | V22 |
| porownanie28 | 31/0 | 31/0 | V22 |
| porownanie_v19_v20 | 12/0 | 12/0 | historyczne wersje (jawnie poza V22) |
| porownanie_v20_v21 | 32/0 | 32/0 | historyczne wersje (jawnie poza V22) |
| sweep | 21/0 | 21/0 | V22 |
| skrypt_bledy | 4/0 | 4/0 | V22 |

Nowe testy V22: **73/73**; porównanie obu wersji: **1008 unikalnych scenariuszy**, 14 przykładów.

Baza V21: **427 zaliczonych asercji** w 12 zestawach. Końcowy pakiet: **500 zaliczonych asercji**, w tym **456 dotyczących V22** i 44 dotyczących zachowanych porównań historycznych. Sweep zawiera 21 asercji zbiorczych dla 9408 planów; nie przedstawiamy 9408 jako 9408 odrębnych testów jednostkowych. Porównanie 1008 nie jest doliczane do liczby asercji.

## Pełny sweep

| Miara | Ponowiony V21 | V22 |
|---|---:|---:|
| wykonane / unikalne | 9408/9408 | 9408/9408 |
| naruszenia krytyczne | 0 | 0 |
| ostrzeżenia miernika V21 | 27 | 0 |

V21: `{"WZROST_KM:ostrzezenie":27}`

V22: `{}`

Pokrycie V22: dzień początku {"0":1344,"1":1344,"2":1344,"3":1344,"4":1344,"5":1344,"6":1344}, dzień zawodów {"0":1344,"1":1344,"2":1344,"3":1344,"4":1344,"5":1344,"6":1344}. Asercje potwierdziły wszystkie 49 par dni oraz 7 dni w każdej komórce dystans/poziom.

## Pochodzenie i ograniczenia

Wyniki bazowe są ponownym wykonaniem w tej sesji, nie odczytem historycznych sukcesów. Historyczne porównania V19 pokazują oczekiwane awarie starej wersji; nie są awariami V22. Surowe wyniki, liczby ostrzeżeń i statusy nie zostały filtrowane. Wczesne próby wykazały błędy rotacji/regeneracji/limitów; naprawiono kod, potem uruchomiono końcowy zestaw. Blokada procesów potomnych EPERM w sandboxie wymagała uruchomienia runnera poza sandboxem; nie wyłączano asercji.

Nie wykonano badań skuteczności na biegaczach, badań medycznych ani pomiarów urazowości. Wyniki testów nie zastępują tych badań. Nie ma zewnętrznych zależności do zainstalowania i nie powstał interfejs WWW.

## Rozmiar

Główny generator: **2501 linii tekstowych, 233245 bajtów** (narzędzia liczące końcowy pusty element split mogą pokazać 2502). Moduł reguł: 69 linii, 4220 bajtów. Razem kod produkcyjny V22: 2570 linii. Baza V21 pozostaje identyczna bajtowo.
