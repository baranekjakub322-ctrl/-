# Historia rozwoju — kontekst dla Codex

**Źródło:** streszczenie wcześniejszych analiz rozmowy. Dane historyczne nie są ponowną weryfikacją. Zawartość ZIP V21 jest właściwym źródłem kodu i raportów.

## Produkt
Silnik generowania planów biegowych w JavaScript/ESM, docelowo dla 5 km, 10 km, półmaratonu i maratonu, z obsługą zróżnicowanej częstotliwości treningów, ograniczeń, progresji, regeneracji i startu docelowego. Celem V22 jest rzeczywista jakość i personalizacja, nie samo podnoszenie heurystycznej oceny.

## Wersje
- V17: 2053 linii, 184834 B. Raport 212 testów PASS; problem ostrzeżeń `POST_REC_NO_REBOUND`.
- V18: 2194 linii, 200135 B. Raport 83 testy PASS; siatki 2268 + 864. Słabości: 1–2 dni, udział długiego biegu, maraton.
- V19: 2259 linii, 206443 B. Wykryte: sweep pokrywał tylko niedziele wskutek błędu modulo, skrypt `|| true` maskował awarie, słaba indywidualizacja, ograniczenia maratońskie.
- V20: 2305 linii, 211655 B. Wcześniej uruchomiono osobno siedem zestawów testów; historyczny sweep 9408 scenariuszy, zero krytycznych, lecz wiele ostrzeżeń (zwłaszcza regeneracja). Heurystyczna ocena ~8.5/10.
- V21: 2419 linii, 225164 B według wcześniejszej inspekcji. Raport pakietu: 427/427 testów; historyczny sweep 9408 scenariuszy, zero krytycznych. Wcześniej niezależnie uruchomiono 11 zestawów (~406 asercji); pełnego sweepu nie potwierdzono ponownym uruchomieniem. Subiektywna ocena ~8.8/10.

## V21 — najważniejsze zmiany
- Rozdzielenie biegu regeneracyjnego od zwykłego spokojnego Z2; limity czasu regeneracji.
- Lepszy rozkład dni i kontrola sąsiedztwa ciężkich jednostek oraz long run.
- Udział long run liczony od rzeczywistego tygodniowego kilometrażu.
- Korekty taperu i startów w poniedziałek/wtorek.
- Wykonalność: `pelna`, `ograniczona`, `niewykonalna`, opcja `trybScisly`.
- Nowy wielokryterialny `scoreV21`.

## Zidentyfikowane problemy do V22
- Maraton najsłabszy jakościowo; model przygotowania do niego nie jest wystarczająco pełny.
- Plany na 1–2 biegi/tydzień wymagają osobnego, realistycznego modelu.
- Wpływ danych wejściowych na strukturę planu nie zawsze jest dostateczny.
- W 28-planowym teście częstotliwości 5/6/7 mogą dawać identyczne plany przez limit poziomu zaawansowania — wymagana przejrzysta informacja.
- Historyczny sweep V21: 27 ostrzeżeń `WZROST_KM` (8 HM, 19 maraton).
- Brak rzeczywistej walidacji na biegaczach; oceny syntetyczne nie są dowodem skuteczności.

## Historyczne porównanie V20 → V21 (zapisane w raportach)
Średnie oceny z 1008 scenariuszy: 5 km 7.875→9.857; 10 km 7.790→9.731; HM 7.576→9.376; maraton 7.295→8.925. Liczba ostrzeżeń i scoring zmieniały definicje — nie traktować jako ścisłego porównania na niezmiennej skali.

## Kierunek produktu
Użytkownik zamierza rozwijać projekt do V23–V28. Należy zostawić czytelne moduły, dokumentację, automatyczne testy i porównywalne metryki dla przyszłych wersji. Preferować poprawność i bezpieczeństwo nad rozrostem liczby linii.
