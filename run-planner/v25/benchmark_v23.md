# Kontrolowany benchmark miernika V23

Ręczny wzorzec i osiem kontrolowanych pogorszeń powstały niezależnie od generatorów. 16/16 kontroli zaliczonych. Wzorzec nie jest dowodem optymalności treningowej.

| Przypadek | Ocena | Δwobec wzorca | Najważniejsze kody |
|---|---:|---:|---|
| prawidlowy | 9.122 | 0.000 | brak naruszeń; nadal oceniane kryteria pozytywne |
| zbyt_duzy_kilometraz | 6.564 | -2.558 | LIMIT_CZASU, ZA_WYSOKI_START, SKOK_KM, SKOK_DLUGIEGO |
| bez_progresji | 7.896 | -1.226 | MONOTONIA_JAKOSCI |
| monotonny | 8.369 | -0.753 | MONOTONIA_JAKOSCI |
| nadmierna_intensywnosc | 0.000 | -9.122 | ZA_DUZO_AKCENTOW, UDZIAL_INTENSYWNOSCI, MONOTONIA_JAKOSCI, AKCENT_BLISKO_STARTU |
| nieprawidlowy_taper | 8.519 | -0.603 | BRAK_TAPERU |
| niedopasowany_dystans | 6.026 | -3.096 | ZA_KROTKI_HORYZONT, NIEZGODNE_TEMPO_SPECYFICZNE |
| niewykonalna_czestotliwosc | 4.218 | -4.904 | ZA_KROTKI_HORYZONT, MARATON_NIEWYKONALNY |
| niebezpieczny_powrot | 8.178 | -0.944 | ZA_WYSOKI_START |

Pełne wzorce, oceny kategorii i uzasadnienia: `wyniki_v23/kalibracja_v23.json`. Testy obejmują też odporność na zmianę etykiet/sfabrykowany audyt oraz brak sufitu liczby kar.
