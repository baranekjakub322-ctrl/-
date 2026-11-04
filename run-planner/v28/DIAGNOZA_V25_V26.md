# Diagnoza V25 / V26

Baza V25: commit 39d8466e25a35c7ef65e1ca4294decf057d7b8d0. Node v24.19.0, system Linux-6.18.57-x86_64-with-glibc2.41. Wejścia frozen-1008-v24, SHA-256 00ab459021dbf3100e0cc08a1b4472f7cbafa09a5425033307cdb79656ed008d. Mierniki 23.0.0 (a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71) i 25.0.0 (09dfeeb6b6ab25bdbae4065b5d2166b75f9d1c7f286408337fa8c912f65332b2) pozostały bajtowo niezmienione. Daty, cele, profile i warunki obu wersji są identyczne. To heurystyki, bez walidacji klinicznej.

Odtworzono bazę: 28 zestawów, 1356 PASS / 0 FAIL. Osobno wygenerowano pełne 1008 par V24/V25: średnie {"score23":{"v24":7.4174593253968135,"v25":7.443721230158727},"score25":{"v24":9.160130952380971,"v25":9.18744345238097}}, rozkład {"better":179,"same":780,"worse":49}. Zgodność wszystkich 1008 archiwalnych ocen: true. To nowe wykonanie, nie odczyt samych dawnych raportów. Surowe pełne plany i oceny: diagnostyka_v26/baseline/full-v24-v25.ndjson.gz.

49 obniżeń V25/V24 oraz 88 niższych ocen V25/V23 są dwoma zbiorami z częściowym nakładaniem. Listy wejść: baseline/regressions49.json i baseline/historical-below-v23.json. Nie usunięto żadnego przypadku.

Historyczne rodziny 14/56/12/7 dotyczyły V24/V23. Nadal trzeba rozróżniać alokację dwóch dni, iloraz różnych rodzin i taperu, domyślne 120 min HM oraz rotację progu/MP. Nie traktujemy każdej kary jako fizjologicznego błędu. Kategoria każdego z 1008 przypadków jest wewnętrzną hipotezą z parametrami, priorytetem, zmianą, testem i decyzją w diagnosis-all.json i CSV. Pozostawiono kategorię nierozstrzygniętą.

## Błędy odtworzone i naprawione

1. Zerowy dystans albo nierealny split mógł służyć jako wynik testowy. Wynik musi mieścić się w wykonanej sesji i szerokich granicach tempa.
2. Pojedynczy długi bieg omijał regularność w bramce maratońskiej. Bramki są teraz sekwencyjne.
3. Dwa kolejne dni zawsze eliminowały rozwój. U przygotowanych jest rotacja tygodnia rozwojowego i wytrzymałościowego, bez dwóch ciężkich dni obok siebie.
4. Wariant konsolidacyjny zastępował próg dodatkowymi km. Test syntetyczny wymusza zachowanie zamierzonego bodźca przed uzupełnianiem budżetu.
5. Odległość, czas i tempo przerwy progowej były niespójne. Czas wylicza się z rzeczywistej spokojnej recepty.
6. HM zawsze dzielił dłuższy próg. Część przygotowanych ekspozycji budujących jest ciągła, bez podnoszenia tempa lub łącznej dawki.

## 49 wcześniejszych obniżeń — aktualna decyzja

| ID | V24/23 | V25/23 | V26/23 | Hipoteza | Decyzja |
|---|---|---|---|---|---|
| 175 | 9.380 | 9.335 | 9.335 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 211 | 9.380 | 9.335 | 9.335 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 247 | 9.380 | 9.335 | 9.335 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 406 | 8.943 | 8.890 | 8.890 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 413 | 9.461 | 9.408 | 9.408 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 414 | 9.325 | 9.272 | 9.272 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 431 | 8.825 | 8.809 | 8.809 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 441 | 8.943 | 8.890 | 8.890 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 442 | 8.943 | 8.890 | 8.890 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 462 | 9.347 | 9.304 | 9.304 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 467 | 8.825 | 8.809 | 8.809 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 490 | 8.943 | 8.890 | 8.890 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 497 | 9.347 | 9.304 | 9.304 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 498 | 9.347 | 9.304 | 9.304 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 503 | 9.008 | 8.992 | 8.992 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 549 | 5.418 | 5.326 | 5.326 | czas_HM_lub_koncentracja | Uzasadnione zachowanie planu w granicach zadanych danych. |
| 550 | 6.271 | 6.168 | 6.168 | czas_HM_lub_koncentracja | Uzasadnione zachowanie planu w granicach zadanych danych. |
| 551 | 6.608 | 6.259 | 6.259 | czas_HM_lub_koncentracja | Uzasadnione zachowanie planu w granicach zadanych danych. |
| 561 | 5.418 | 5.326 | 5.326 | czas_HM_lub_koncentracja | Uzasadnione zachowanie planu w granicach zadanych danych. |
| 562 | 5.418 | 5.326 | 5.326 | czas_HM_lub_koncentracja | Uzasadnione zachowanie planu w granicach zadanych danych. |
| 836 | 7.275 | 7.270 | 7.270 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 848 | 7.418 | 7.414 | 7.414 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 908 | 9.285 | 8.934 | 8.934 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 909 | 8.752 | 8.552 | 8.552 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 911 | 9.285 | 8.934 | 8.934 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 920 | 9.122 | 8.772 | 8.772 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 921 | 8.600 | 8.399 | 8.399 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 922 | 8.752 | 8.552 | 8.552 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 932 | 8.526 | 8.523 | 8.523 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 933 | 8.222 | 8.192 | 8.192 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 934 | 8.222 | 8.192 | 8.192 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 944 | 8.582 | 8.402 | 8.402 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 947 | 8.582 | 8.402 | 8.402 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 956 | 8.426 | 8.246 | 8.246 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 957 | 8.215 | 8.022 | 8.022 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 958 | 8.361 | 8.168 | 8.168 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 959 | 8.665 | 8.484 | 8.484 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 968 | 8.670 | 8.664 | 8.664 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 969 | 8.222 | 8.192 | 8.192 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 970 | 8.222 | 8.192 | 8.192 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 980 | 8.665 | 8.484 | 8.484 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 981 | 8.361 | 8.168 | 8.168 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 982 | 8.361 | 8.168 | 8.168 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 992 | 8.426 | 8.246 | 8.246 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 993 | 8.361 | 8.168 | 8.168 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 995 | 8.582 | 8.402 | 8.402 | rotacja_rodzin_MP_prog_taper | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 1004 | 8.507 | 8.502 | 8.502 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 1005 | 8.222 | 8.192 | 8.192 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |
| 1006 | 8.222 | 8.192 | 8.192 | zaokraglenie_dawki_lub_wczesny_prog | Zmiana rzeczywistych jednostek; skuteczność fizjologiczna niepotwierdzona. |

## Nowe obniżenia obu mierników — jawny przegląd

| ID | Dystans/dni/poziom/km | V25/23 | V26/23 | Δ23 | V25/25 | V26/25 | Δ25 | Ocena wewnętrzna |
|---|---|---|---|---|---|---|---|---|


## Iteracje

W diagnostyka_v26/iteracje zapisano próby rozwojowe. Pierwszy wybór zmieniał kalendarz za łatwo (142/789/77, 0 krytycznych), drugi 40/963/5. Kontrola rzeczywistych sesji wykazała utratę progu na rzecz kilometrażu; naprawiono logikę. Późniejsze zmiany dotyczą rzeczywistych progów HM i spójności przerw. Nie wybierano wariantu według historycznego wyniku. Trzy pełne przebiegi rozwojowe przerwano; nie są PASS. Końcowy wynik: 1008 według 23.0.0: **7.444 → 7.447**, poprawy/remisy/obniżenia **40/968/0**.

1008 według 25.0.0: **9.187 → 9.190**. Skale porównujemy osobno. Względem V23 pozostaje 88 niższych wyników (V25: 88). Nie utożsamiamy tego z regresjami V26/V25 ani dawnymi 49 obniżeniami V25/V24.

