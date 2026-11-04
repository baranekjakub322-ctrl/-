# Wydajność V28

v24.19.0; osobne świeże procesy, ten sam zestaw 28 × 3 = 84 wejścia, ten sam hash i środowisko.

| Wersja | N | Śr ms | Mediana | P95 | Max | RSS MiB |
|---|---|---|---|---|---|---|
| v27 | 84 | 18.397641 | 13.640701 | 36.697477 | 47.604831 | 181.218750 |
| v28 | 84 | 20.460845 | 14.665101 | 52.799769 | 58.244918 | 188.144531 |

Stosunek V28/V27: 1.112145; cel ≤20 ms nieosiągnięty w tym pomiarze. Brak gwarancji SLA.

Profil CPU przed optymalizacją ujawnił koszt validateUnitCoherence (serializacja całych recept dla samych dat), powtarzania końca tygodnia w filtrze i duplikatu wariantu jakości. Zastąpiono serializacją dat, cache tempa, obliczeniem granicy raz oraz odcięciem identycznego kandydata. 1324/1324 jednostki porównane przed/po są identyczne; dowód w diagnostyka_v28/pruning-equivalence.json. Po odczytaniu holdoutu doprecyzowano obowiązkowe wskazówki żywieniowe, rejestr podbiegów/rytmów i komunikaty. Zmiany te wynikały ze specyfikacji, nie z ocen; samą optymalizację CPU sprawdzono przed tymi uzupełnieniami na 1324 identycznych jednostkach. Pliki CPU sprzed/po optymalizacji oraz profil finalnego źródła i hashe zachowano w diagnostyce; prób przed/po pod obciążeniem nie przedstawiamy jako kontrolowanego A/B czasu.

| Operacja | N | Ms | RSS przed MiB | RSS po MiB |
|---|---|---|---|---|
| v27 strict 100 | 100 | 19.258988 | 33.300781 | 40.300781 |
| v28 strict 100 | 100 | 5.043680 | 40.300781 | 41.675781 |
| v28 quarantine 100 | 101 | 7.131647 | 41.675781 | 41.800781 |
| v27 strict 1000 | 1000 | 31.305945 | 41.925781 | 52.113281 |
| v28 strict 1000 | 1000 | 25.384329 | 52.113281 | 54.230469 |
| v28 quarantine 1000 | 1001 | 47.155148 | 54.855469 | 64.746094 |
| v27 strict 3000 | 3000 | 70.808775 | 64.746094 | 77.621094 |
| v28 strict 3000 | 3000 | 75.797816 | 77.621094 | 87.144531 |
| v28 quarantine 3000 | 3001 | 135.323212 | 87.144531 | 103.769531 |
| v27 update 12 | 12 | 11.648082 | 105.644531 | 109.019531 |
| v28 update 12 | 12 | 12.299177 | 115.769531 | 119.644531 |
| v27 update 60 | 60 | 12.003610 | 125.769531 | 127.519531 |
| v28 update 60 | 60 | 15.306945 | 127.519531 | 128.894531 |
| v27 update 180 | 180 | 26.019272 | 128.894531 | 129.394531 |
| v28 update 180 | 180 | 25.962500 | 129.644531 | 129.644531 |

RAM obejmuje proces, JIT i dane. Osobne operacje są mierzone kolejno w jednym procesie; nie są dodatkowymi testami PASS. Wszystkie pełne plany są zapisywane strumieniowo przez Brotli, bez przechowywania 1008 par sesji w RAM.
