# Regresje i remisy V28

Baza V27: b6af91c21c4da6ed1537a93c3daf60cec1c66ec0; v24.19.0. Frozen-1008-v24 SHA-256 00ab459021dbf3100e0cc08a1b4472f7cbafa09a5425033307cdb79656ed008d. Historyczne mierniki pozostają bajtowo niezmienione: 23.0.0 a7d2cfe244bb156418e3334b917b39773c1e96ad7c0ff356aac586380aa3eb71, 25.0.0 09dfeeb6b6ab25bdbae4065b5d2166b75f9d1c7f286408337fa8c912f65332b2; audyt 27.0.0 f267bf8bd66c34f026bb44fe2e7592716bfe522018f3499b5219aa8aa7ae8235. Wszystkie porównania stosują ten sam miernik do obu wersji. Audyt 28.0.0 jest odrębny, heurystyczny i nie uczestniczy w wyborze kandydatów.

| Miernik | V27 / 1008 | V28 / 1008 | +/=/- |
|---|---|---|---|
| 23.0.0 | 7.492178 | 7.547016 | 117/882/9 |
| 25.0.0 | 9.315776 | 9.325793 | 77/905/26 |
| Audyt 27.0.0 | 7.419161 | 7.424634 | 47/957/4 |
| Diagnostyczny 28.0.0 | 7.637857 | 7.883759 | 299/705/4 |

250 dawnych regresji V27 sklasyfikowano w całości: {"3_progresja":185,"2_specyfika":23,"5_rozbieznosc_miernikow":9,"6_niejednoznaczne":17,"1_utrata_objetosci_lub_dlugiego":16}. Pełne wejścia, trzy mierniki, pierwsze różne tygodnie i sesje oraz decyzje: wyniki_v28/triage_v28.json. Nie sumujemy nakładających się zbiorów.

## 20 największych dawnych spadków

| ID | V27−V26 | V28−V26 | Kategoria | Decyzja |
|---|---|---|---|---|
| 871 | -1.190000 | 0.555000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 907 | -1.190000 | 0.555000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 943 | -1.188000 | 0.579000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 979 | -1.188000 | 0.579000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 976 | -1.086000 | 0.736000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 904 | -1.079000 | 0.766000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 940 | -1.079000 | 0.766000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 868 | -0.989000 | 0.766000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 881 | -0.944000 | 0.314000 | 2_specyfika | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 880 | -0.929000 | 0.368000 | 2_specyfika | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 883 | -0.929000 | 0.368000 | 2_specyfika | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 869 | -0.916000 | 0.996000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 905 | -0.916000 | 0.996000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 941 | -0.912000 | 0.979000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 977 | -0.912000 | 0.979000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 882 | -0.862000 | 0.678000 | 2_specyfika | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 870 | -0.720000 | 1.025000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 978 | -0.720000 | 1.025000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 906 | -0.716000 | 1.008000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 942 | -0.716000 | 1.008000 | 1_utrata_objetosci_lub_dlugiego | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |

## Każda z 250 regresji

| ID | Kategoria | Pierwszy inny tydzień | V27−V26 | V28−V27 | V28−V26 | Mechanizm | Decyzja |
|---|---|---|---|---|---|---|---|
| 40 | 3_progresja | 2026-11-09 | -0.142000 | 0.000000 | -0.142000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 42 | 3_progresja | 2026-11-02 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 80 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 81 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 82 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 83 | 3_progresja | 2026-11-09 | -0.198000 | 0.000000 | -0.198000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 88 | 3_progresja | 2026-11-09 | -0.105000 | 0.000000 | -0.105000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 89 | 3_progresja | 2026-11-09 | -0.144000 | 0.000000 | -0.144000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 90 | 3_progresja | 2026-11-09 | -0.168000 | 0.000000 | -0.168000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 91 | 3_progresja | 2026-11-09 | -0.136000 | 0.000000 | -0.136000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 92 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 93 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 94 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 95 | 3_progresja | 2026-11-09 | -0.198000 | 0.000000 | -0.198000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 100 | 3_progresja | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 101 | 3_progresja | 2026-11-09 | -0.046000 | 0.000000 | -0.046000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 102 | 3_progresja | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 103 | 3_progresja | 2026-11-09 | -0.029000 | 0.000000 | -0.029000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 104 | 3_progresja | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 105 | 3_progresja | 2026-11-09 | -0.135000 | 0.000000 | -0.135000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 106 | 3_progresja | 2026-11-09 | -0.135000 | 0.000000 | -0.135000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 107 | 3_progresja | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 112 | 3_progresja | 2026-11-23 | -0.049000 | 0.000000 | -0.049000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 114 | 3_progresja | 2026-11-23 | -0.048000 | 0.000000 | -0.048000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 115 | 3_progresja | 2026-11-23 | -0.106000 | 0.000000 | -0.106000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 116 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 117 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 118 | 3_progresja | 2026-11-09 | -0.140000 | 0.000000 | -0.140000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 119 | 3_progresja | 2026-11-09 | -0.168000 | 0.000000 | -0.168000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 125 | 3_progresja | 2026-11-09 | -0.101000 | 0.000000 | -0.101000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 126 | 3_progresja | 2026-11-09 | -0.260000 | 0.000000 | -0.260000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 128 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 129 | 3_progresja | 2026-11-09 | -0.167000 | 0.000000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 130 | 3_progresja | 2026-11-09 | -0.140000 | 0.000000 | -0.140000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 131 | 3_progresja | 2026-11-09 | -0.198000 | 0.000000 | -0.198000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 137 | 3_progresja | 2026-11-09 | -0.034000 | 0.000000 | -0.034000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 138 | 3_progresja | 2026-11-09 | -0.039000 | 0.000000 | -0.039000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 139 | 3_progresja | 2026-11-09 | -0.029000 | 0.000000 | -0.029000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 140 | 3_progresja | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 141 | 3_progresja | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 142 | 3_progresja | 2026-11-09 | -0.039000 | 0.000000 | -0.039000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 143 | 3_progresja | 2026-11-09 | -0.028000 | 0.000000 | -0.028000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 148 | 3_progresja | 2026-11-23 | -0.049000 | 0.000000 | -0.049000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 150 | 3_progresja | 2026-11-23 | -0.063000 | 0.000000 | -0.063000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 151 | 3_progresja | 2026-11-23 | -0.106000 | 0.000000 | -0.106000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 160 | 3_progresja | 2026-11-09 | -0.115000 | 0.000000 | -0.115000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 161 | 3_progresja | 2026-11-09 | -0.353000 | 0.000000 | -0.353000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 162 | 3_progresja | 2026-11-09 | -0.327000 | 0.000000 | -0.327000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 167 | 3_progresja | 2026-11-09 | -0.012000 | 0.000000 | -0.012000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 172 | 3_progresja | 2026-11-09 | -0.404000 | 0.000000 | -0.404000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 173 | 3_progresja | 2026-11-09 | -0.398000 | 0.000000 | -0.398000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 174 | 3_progresja | 2026-11-09 | -0.502000 | 0.000000 | -0.502000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 175 | 3_progresja | 2026-11-09 | -0.266000 | 0.000000 | -0.266000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 179 | 3_progresja | 2026-11-09 | -0.180000 | 0.000000 | -0.180000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 184 | 3_progresja | 2026-11-23 | -0.049000 | 0.000000 | -0.049000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 186 | 3_progresja | 2026-11-23 | -0.063000 | 0.000000 | -0.063000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 187 | 3_progresja | 2026-11-23 | -0.091000 | 0.000000 | -0.091000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 196 | 3_progresja | 2026-11-09 | -0.273000 | 0.000000 | -0.273000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 197 | 3_progresja | 2026-11-09 | -0.182000 | 0.000000 | -0.182000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 198 | 3_progresja | 2026-11-09 | -0.195000 | 0.000000 | -0.195000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 199 | 3_progresja | 2026-11-09 | -0.206000 | 0.000000 | -0.206000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 208 | 3_progresja | 2026-11-09 | -0.404000 | 0.000000 | -0.404000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 209 | 3_progresja | 2026-11-09 | -0.343000 | 0.000000 | -0.343000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 210 | 3_progresja | 2026-11-09 | -0.558000 | 0.000000 | -0.558000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 211 | 3_progresja | 2026-11-09 | -0.266000 | 0.000000 | -0.266000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 215 | 3_progresja | 2026-11-09 | -0.195000 | 0.000000 | -0.195000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 220 | 3_progresja | 2026-11-23 | -0.064000 | 0.000000 | -0.064000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 222 | 3_progresja | 2026-11-23 | -0.048000 | 0.000000 | -0.048000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 223 | 3_progresja | 2026-11-23 | -0.091000 | 0.000000 | -0.091000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 227 | 3_progresja | 2026-11-09 | -0.012000 | 0.000000 | -0.012000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 232 | 3_progresja | 2026-11-09 | -0.115000 | 0.000000 | -0.115000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 233 | 3_progresja | 2026-11-09 | -0.182000 | 0.000000 | -0.182000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 234 | 3_progresja | 2026-11-09 | -0.195000 | 0.000000 | -0.195000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 235 | 3_progresja | 2026-11-09 | -0.206000 | 0.000000 | -0.206000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 244 | 3_progresja | 2026-11-09 | -0.404000 | 0.000000 | -0.404000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 245 | 3_progresja | 2026-11-09 | -0.576000 | 0.000000 | -0.576000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 246 | 3_progresja | 2026-11-09 | -0.558000 | 0.000000 | -0.558000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 247 | 3_progresja | 2026-11-09 | -0.266000 | 0.000000 | -0.266000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 251 | 3_progresja | 2026-11-09 | -0.180000 | 0.000000 | -0.180000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 329 | 2_specyfika | 2026-11-23 | -0.028000 | 0.000000 | -0.028000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 330 | 2_specyfika | 2026-11-23 | -0.028000 | 0.000000 | -0.028000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 333 | 3_progresja | 2026-11-09 | -0.029000 | 0.000000 | -0.029000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 334 | 3_progresja | 2026-11-09 | -0.029000 | 0.000000 | -0.029000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 335 | 3_progresja | 2026-11-09 | -0.060000 | 0.000000 | -0.060000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 345 | 3_progresja | 2026-11-09 | -0.029000 | 0.000000 | -0.029000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 346 | 3_progresja | 2026-11-09 | -0.029000 | 0.000000 | -0.029000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 347 | 3_progresja | 2026-11-09 | -0.060000 | 0.000000 | -0.060000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 366 | 3_progresja | 2026-11-23 | -0.074000 | 0.000000 | -0.074000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 367 | 3_progresja | 2026-11-23 | -0.003000 | 0.000000 | -0.003000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 370 | 3_progresja | 2026-11-09 | -0.219000 | 0.000000 | -0.219000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 382 | 3_progresja | 2026-11-09 | -0.219000 | 0.000000 | -0.219000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 390 | 3_progresja | 2026-11-09 | -0.068000 | 0.000000 | -0.068000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 392 | 3_progresja | 2026-11-09 | -0.019000 | 0.000000 | -0.019000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 393 | 3_progresja | 2026-11-09 | -0.019000 | 0.000000 | -0.019000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 394 | 3_progresja | 2026-11-09 | -0.195000 | 0.000000 | -0.195000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 400 | 3_progresja | 2026-11-23 | -0.033000 | 0.000000 | -0.033000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 402 | 3_progresja | 2026-11-23 | -0.074000 | 0.000000 | -0.074000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 403 | 3_progresja | 2026-11-23 | -0.003000 | 0.000000 | -0.003000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 404 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 405 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 406 | 2_specyfika | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 407 | 2_specyfika | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 412 | 3_progresja | 2026-11-09 | -0.187000 | 0.000000 | -0.187000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 413 | 2_specyfika | 2026-11-09 | -0.235000 | 0.000000 | -0.235000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 414 | 2_specyfika | 2026-11-09 | -0.110000 | 0.000000 | -0.110000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 415 | 2_specyfika | 2026-11-09 | -0.187000 | 0.000000 | -0.187000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 416 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 417 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 418 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 419 | 3_progresja | 2026-11-09 | -0.003000 | 0.000000 | -0.003000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 424 | 3_progresja | 2026-11-09 | -0.400000 | 0.000000 | -0.400000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 425 | 3_progresja | 2026-11-09 | -0.400000 | 0.000000 | -0.400000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 426 | 3_progresja | 2026-11-09 | -0.400000 | 0.000000 | -0.400000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 427 | 2_specyfika | 2026-11-09 | -0.400000 | 0.000000 | -0.400000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 428 | 3_progresja | 2026-11-09 | -0.320000 | 0.000000 | -0.320000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 429 | 3_progresja | 2026-11-09 | -0.320000 | 0.000000 | -0.320000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 430 | 3_progresja | 2026-11-09 | -0.320000 | 0.000000 | -0.320000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 431 | 3_progresja | 2026-11-09 | -0.065000 | 0.000000 | -0.065000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 436 | 3_progresja | 2026-11-23 | -0.033000 | 0.000000 | -0.033000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 438 | 3_progresja | 2026-11-23 | -0.074000 | 0.000000 | -0.074000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 440 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 441 | 2_specyfika | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 442 | 2_specyfika | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 443 | 2_specyfika | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 448 | 3_progresja | 2026-11-09 | -0.187000 | 0.000000 | -0.187000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 449 | 3_progresja | 2026-11-09 | -0.120000 | 0.000000 | -0.120000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 450 | 3_progresja | 2026-11-09 | -0.122000 | 0.000000 | -0.122000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 451 | 3_progresja | 2026-11-09 | -0.047000 | 0.000000 | -0.047000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 452 | 3_progresja | 2026-11-09 | -0.190000 | 0.000000 | -0.190000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 453 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 454 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 455 | 2_specyfika | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 460 | 3_progresja | 2026-11-09 | -0.400000 | 0.000000 | -0.400000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 461 | 3_progresja | 2026-11-09 | -0.400000 | 0.000000 | -0.400000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 462 | 2_specyfika | 2026-11-09 | -0.282000 | 0.000000 | -0.282000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 463 | 2_specyfika | 2026-11-09 | -0.400000 | 0.000000 | -0.400000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 464 | 3_progresja | 2026-11-09 | -0.320000 | 0.000000 | -0.320000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 465 | 3_progresja | 2026-11-09 | -0.320000 | 0.000000 | -0.320000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 466 | 3_progresja | 2026-11-09 | -0.320000 | 0.000000 | -0.320000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 467 | 3_progresja | 2026-11-09 | -0.101000 | 0.000000 | -0.101000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 472 | 3_progresja | 2026-11-23 | -0.033000 | 0.000000 | -0.033000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 474 | 3_progresja | 2026-11-23 | -0.074000 | 0.000000 | -0.074000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 476 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 477 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 478 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 479 | 3_progresja | 2026-11-09 | -0.003000 | 0.000000 | -0.003000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 484 | 3_progresja | 2026-11-09 | -0.187000 | 0.000000 | -0.187000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 485 | 3_progresja | 2026-11-09 | -0.120000 | 0.000000 | -0.120000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 486 | 3_progresja | 2026-11-09 | -0.122000 | 0.000000 | -0.122000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 487 | 3_progresja | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 488 | 3_progresja | 2026-11-09 | -0.190000 | 0.000000 | -0.190000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 489 | 3_progresja | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 490 | 2_specyfika | 2026-11-09 | -0.062000 | 0.000000 | -0.062000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 491 | 2_specyfika | 2026-11-09 | -0.191000 | 0.000000 | -0.191000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 496 | 3_progresja | 2026-11-09 | -0.400000 | 0.000000 | -0.400000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 497 | 2_specyfika | 2026-11-09 | -0.282000 | 0.000000 | -0.282000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 498 | 2_specyfika | 2026-11-09 | -0.282000 | 0.000000 | -0.282000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 499 | 2_specyfika | 2026-11-09 | -0.400000 | 0.000000 | -0.400000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 500 | 3_progresja | 2026-11-09 | -0.320000 | 0.000000 | -0.320000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 501 | 3_progresja | 2026-11-09 | -0.320000 | 0.000000 | -0.320000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 502 | 3_progresja | 2026-11-09 | -0.320000 | 0.000000 | -0.320000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 503 | 3_progresja | 2026-11-09 | -0.086000 | 0.000000 | -0.086000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 544 | 3_progresja | 2026-11-09 | -0.061000 | 0.000000 | -0.061000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 545 | 3_progresja | 2026-11-09 | -0.031000 | 0.000000 | -0.031000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 547 | 3_progresja | 2026-11-02 | -0.087000 | 0.000000 | -0.087000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 580 | 5_rozbieznosc_miernikow | 2026-11-09 | -0.184000 | 0.000000 | -0.184000 | Mierniki historyczne i audyt różnią się; to hipoteza artefaktu, a nie potwierdzenie lepszego treningu. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 581 | 5_rozbieznosc_miernikow | 2026-11-09 | -0.106000 | 0.000000 | -0.106000 | Mierniki historyczne i audyt różnią się; to hipoteza artefaktu, a nie potwierdzenie lepszego treningu. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 582 | 5_rozbieznosc_miernikow | 2026-11-09 | -0.111000 | 0.000000 | -0.111000 | Mierniki historyczne i audyt różnią się; to hipoteza artefaktu, a nie potwierdzenie lepszego treningu. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 583 | 5_rozbieznosc_miernikow | 2026-11-09 | -0.184000 | 0.000000 | -0.184000 | Mierniki historyczne i audyt różnią się; to hipoteza artefaktu, a nie potwierdzenie lepszego treningu. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 592 | 6_niejednoznaczne | 2026-11-09 | -0.407000 | 0.000000 | -0.407000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 595 | 6_niejednoznaczne | 2026-11-09 | -0.407000 | 0.000000 | -0.407000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 605 | 5_rozbieznosc_miernikow | 2026-11-09 | -0.071000 | 0.000000 | -0.071000 | Mierniki historyczne i audyt różnią się; to hipoteza artefaktu, a nie potwierdzenie lepszego treningu. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 606 | 5_rozbieznosc_miernikow | 2026-11-09 | -0.071000 | 0.000000 | -0.071000 | Mierniki historyczne i audyt różnią się; to hipoteza artefaktu, a nie potwierdzenie lepszego treningu. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 628 | 6_niejednoznaczne | 2026-11-09 | -0.407000 | 0.000000 | -0.407000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 630 | 3_progresja | 2026-11-09 | -0.442000 | 0.168000 | -0.274000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 631 | 6_niejednoznaczne | 2026-11-09 | -0.407000 | 0.000000 | -0.407000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 640 | 6_niejednoznaczne | 2026-11-09 | -0.041000 | 0.000000 | -0.041000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 641 | 6_niejednoznaczne | 2026-11-09 | -0.077000 | 0.000000 | -0.077000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 642 | 6_niejednoznaczne | 2026-11-09 | -0.160000 | 0.156000 | -0.004000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 664 | 6_niejednoznaczne | 2026-11-09 | -0.407000 | 0.000000 | -0.407000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 665 | 6_niejednoznaczne | 2026-11-09 | -0.389000 | 0.000000 | -0.389000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 666 | 6_niejednoznaczne | 2026-11-09 | -0.389000 | 0.000000 | -0.389000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 667 | 6_niejednoznaczne | 2026-11-09 | -0.407000 | 0.000000 | -0.407000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 676 | 6_niejednoznaczne | 2026-11-09 | -0.041000 | 0.000000 | -0.041000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 677 | 6_niejednoznaczne | 2026-11-09 | -0.094000 | 0.000000 | -0.094000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 678 | 6_niejednoznaczne | 2026-11-09 | -0.094000 | 0.000000 | -0.094000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 679 | 5_rozbieznosc_miernikow | 2026-11-09 | -0.057000 | 0.000000 | -0.057000 | Mierniki historyczne i audyt różnią się; to hipoteza artefaktu, a nie potwierdzenie lepszego treningu. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 692 | 3_progresja | 2026-11-09 | -0.016000 | 0.000000 | -0.016000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 695 | 3_progresja | 2026-11-09 | -0.016000 | 0.000000 | -0.016000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 700 | 6_niejednoznaczne | 2026-11-09 | -0.407000 | 0.000000 | -0.407000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 704 | 3_progresja | 2026-11-09 | -0.015000 | 0.000000 | -0.015000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 714 | 5_rozbieznosc_miernikow | 2026-11-09 | -0.127000 | 0.000000 | -0.127000 | Mierniki historyczne i audyt różnią się; to hipoteza artefaktu, a nie potwierdzenie lepszego treningu. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 736 | 6_niejednoznaczne | 2026-11-09 | -0.407000 | 0.000000 | -0.407000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 740 | 3_progresja | 2026-11-09 | -0.015000 | 0.000000 | -0.015000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 743 | 3_progresja | 2026-11-09 | -0.016000 | 0.000000 | -0.016000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 749 | 5_rozbieznosc_miernikow | 2026-11-09 | -0.127000 | 0.000000 | -0.127000 | Mierniki historyczne i audyt różnią się; to hipoteza artefaktu, a nie potwierdzenie lepszego treningu. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 750 | 6_niejednoznaczne | 2026-11-09 | -0.127000 | 0.000000 | -0.127000 | Wymaga oceny faktycznych sesji; wynik miernika nie dowodzi straty fizjologicznej. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 836 | 3_progresja | 2026-11-09 | -0.316000 | 0.188000 | -0.128000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 837 | 3_progresja | 2026-11-09 | -0.254000 | 0.255000 | 0.001000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 838 | 3_progresja | 2026-11-09 | -0.247000 | 0.153000 | -0.094000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 839 | 3_progresja | 2026-11-09 | -0.410000 | 0.191000 | -0.219000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 848 | 3_progresja | 2026-11-09 | -0.307000 | 0.187000 | -0.120000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 849 | 3_progresja | 2026-11-09 | -0.247000 | 0.254000 | 0.007000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 850 | 3_progresja | 2026-11-09 | -0.254000 | 0.154000 | -0.100000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 851 | 3_progresja | 2026-11-09 | -0.417000 | 0.191000 | -0.226000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 868 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -0.989000 | 1.755000 | 0.766000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 869 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -0.916000 | 1.912000 | 0.996000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 870 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -0.720000 | 1.745000 | 1.025000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 871 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -1.190000 | 1.745000 | 0.555000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 874 | 3_progresja | 2026-11-09 | -0.080000 | 0.575000 | 0.495000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 880 | 2_specyfika | 2026-11-09 | -0.929000 | 1.297000 | 0.368000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 881 | 2_specyfika | 2026-11-09 | -0.944000 | 1.258000 | 0.314000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 882 | 2_specyfika | 2026-11-09 | -0.862000 | 1.540000 | 0.678000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 883 | 2_specyfika | 2026-11-09 | -0.929000 | 1.297000 | 0.368000 | Mniejsza dawka specyficzna lub inny próg/długi w rzeczywistych sesjach; nie naprawiać samą różnorodnością. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 886 | 3_progresja | 2026-11-09 | -0.086000 | 0.572000 | 0.486000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 887 | 3_progresja | 2026-11-09 | -0.637000 | 0.533000 | -0.104000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 892 | 3_progresja | 2026-11-09 | -0.231000 | 0.587000 | 0.356000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 895 | 3_progresja | 2026-11-09 | -0.407000 | 0.542000 | 0.135000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 897 | 3_progresja | 2026-11-09 | -0.107000 | 0.515000 | 0.408000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 898 | 3_progresja | 2026-11-09 | -0.107000 | 0.515000 | 0.408000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 904 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -1.079000 | 1.845000 | 0.766000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 905 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -0.916000 | 1.912000 | 0.996000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 906 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -0.716000 | 1.724000 | 1.008000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 907 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -1.190000 | 1.745000 | 0.555000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 916 | 3_progresja | 2026-11-09 | -0.320000 | 0.274000 | -0.046000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 917 | 3_progresja | 2026-11-09 | -0.174000 | 0.318000 | 0.144000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 918 | 3_progresja | 2026-11-09 | -0.174000 | 0.000000 | -0.174000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 919 | 3_progresja | 2026-11-09 | -0.330000 | 0.274000 | -0.056000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 923 | 3_progresja | 2026-11-09 | -0.378000 | 0.372000 | -0.006000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 928 | 3_progresja | 2026-11-09 | -0.035000 | 0.000000 | -0.035000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 931 | 3_progresja | 2026-11-09 | -0.036000 | 0.000000 | -0.036000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 933 | 3_progresja | 2026-11-09 | -0.067000 | 0.693000 | 0.626000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 934 | 3_progresja | 2026-11-09 | -0.067000 | 0.693000 | 0.626000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 940 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -1.079000 | 1.845000 | 0.766000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 941 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -0.912000 | 1.891000 | 0.979000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 942 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -0.716000 | 1.724000 | 1.008000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 943 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -1.188000 | 1.767000 | 0.579000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 952 | 3_progresja | 2026-11-09 | -0.320000 | 0.274000 | -0.046000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 953 | 3_progresja | 2026-11-09 | -0.140000 | 0.273000 | 0.133000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 954 | 3_progresja | 2026-11-09 | -0.152000 | 0.000000 | -0.152000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 955 | 3_progresja | 2026-11-09 | -0.352000 | 0.185000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 976 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -1.086000 | 1.822000 | 0.736000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 977 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -0.912000 | 1.891000 | 0.979000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 978 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -0.720000 | 1.745000 | 1.025000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 979 | 1_utrata_objetosci_lub_dlugiego | 2026-11-09 | -1.188000 | 1.767000 | 0.579000 | Porównanie sezonowej intencji, obwiedni i alokacji; w części profili limit utrzymania, w części puste miejsce po krótkim akcencie i ograniczonej regeneracji. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 983 | 3_progresja | 2026-11-09 | -0.116000 | 0.357000 | 0.241000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 988 | 3_progresja | 2026-11-09 | -0.320000 | 0.274000 | -0.046000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 989 | 3_progresja | 2026-11-09 | -0.152000 | 0.273000 | 0.121000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |
| 990 | 3_progresja | 2026-11-09 | -0.152000 | 0.000000 | -0.152000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Zachowano lub nierozstrzygnięto kompromis; nie dodawać km/intensywności dla samej oceny. |
| 991 | 3_progresja | 2026-11-09 | -0.352000 | 0.185000 | -0.167000 | Inny stosunek wczesnej i późnej objętości albo porównanie różnych rodzin bodźca; ocenić plateau, odciążenia i taper osobno. | Częściowo odzyskano dawkę lub układ; nadal bez potwierdzenia skuteczności. |

## Nowe pogorszenia V28

| ID | Dystans/dni/poziom/baza | V27/23 | V28/23 | Δ23 | V27/25 | V28/25 | Δ25 | Audyt27 przed/po |
|---|---|---|---|---|---|---|---|---|
| 620 | half/4/beginner/60 | 7.261000 | 7.049000 | -0.212000 | 9.293000 | 9.116000 | -0.177000 | 7.717000 / 7.757000 |
| 621 | half/4/beginner/60 | 7.075000 | 6.936000 | -0.139000 | 9.255000 | 9.158000 | -0.097000 | 8.017000 / 8.057000 |
| 622 | half/4/beginner/60 | 7.026000 | 6.936000 | -0.090000 | 9.255000 | 9.158000 | -0.097000 | 8.017000 / 8.057000 |
| 623 | half/4/beginner/60 | 7.102000 | 7.067000 | -0.035000 | 9.291000 | 9.305000 | 0.014000 | 8.163000 / 8.163000 |
| 632 | half/4/intermediate/60 | 7.284000 | 7.067000 | -0.217000 | 9.481000 | 9.305000 | -0.176000 | 8.017000 / 7.957000 |
| 633 | half/4/intermediate/60 | 7.052000 | 6.917000 | -0.135000 | 9.072000 | 8.975000 | -0.097000 | 8.017000 / 8.057000 |
| 634 | half/4/intermediate/60 | 7.003000 | 6.917000 | -0.086000 | 9.072000 | 8.975000 | -0.097000 | 8.017000 / 8.057000 |
| 635 | half/4/intermediate/60 | 7.263000 | 7.102000 | -0.161000 | 9.607000 | 9.492000 | -0.115000 | 8.117000 / 8.157000 |
| 647 | half/4/advanced/60 | 7.221000 | 7.168000 | -0.053000 | 9.441000 | 9.380000 | -0.061000 | 8.063000 / 8.097000 |

- 620: Przy 4 dniach lepiej wypełniono początkową deklarowaną bazę. Historyczny iloraz wzrostu spada przy stabilizacji; część weekendowych jednostek jest karana domyślnym 120 min w scorerze, mimo 150 min w API generatora. Brak naruszeń krytycznych. Sprawdź pełne jednostki i relację początek/szczyt; nie jest to automatycznie artefakt miernika.
- 621: Przy 4 dniach lepiej wypełniono początkową deklarowaną bazę. Historyczny iloraz wzrostu spada przy stabilizacji; część weekendowych jednostek jest karana domyślnym 120 min w scorerze, mimo 150 min w API generatora. Brak naruszeń krytycznych. Sprawdź pełne jednostki i relację początek/szczyt; nie jest to automatycznie artefakt miernika.
- 622: Przy 4 dniach lepiej wypełniono początkową deklarowaną bazę. Historyczny iloraz wzrostu spada przy stabilizacji; część weekendowych jednostek jest karana domyślnym 120 min w scorerze, mimo 150 min w API generatora. Brak naruszeń krytycznych. Sprawdź pełne jednostki i relację początek/szczyt; nie jest to automatycznie artefakt miernika.
- 623: Przy 4 dniach lepiej wypełniono początkową deklarowaną bazę. Historyczny iloraz wzrostu spada przy stabilizacji; część weekendowych jednostek jest karana domyślnym 120 min w scorerze, mimo 150 min w API generatora. Brak naruszeń krytycznych. Sprawdź pełne jednostki i relację początek/szczyt; nie jest to automatycznie artefakt miernika.
- 632: Przy 4 dniach lepiej wypełniono początkową deklarowaną bazę. Historyczny iloraz wzrostu spada przy stabilizacji; część weekendowych jednostek jest karana domyślnym 120 min w scorerze, mimo 150 min w API generatora. Brak naruszeń krytycznych. Sprawdź pełne jednostki i relację początek/szczyt; nie jest to automatycznie artefakt miernika.
- 633: Przy 4 dniach lepiej wypełniono początkową deklarowaną bazę. Historyczny iloraz wzrostu spada przy stabilizacji; część weekendowych jednostek jest karana domyślnym 120 min w scorerze, mimo 150 min w API generatora. Brak naruszeń krytycznych. Sprawdź pełne jednostki i relację początek/szczyt; nie jest to automatycznie artefakt miernika.
- 634: Przy 4 dniach lepiej wypełniono początkową deklarowaną bazę. Historyczny iloraz wzrostu spada przy stabilizacji; część weekendowych jednostek jest karana domyślnym 120 min w scorerze, mimo 150 min w API generatora. Brak naruszeń krytycznych. Sprawdź pełne jednostki i relację początek/szczyt; nie jest to automatycznie artefakt miernika.
- 635: Przy 4 dniach lepiej wypełniono początkową deklarowaną bazę. Historyczny iloraz wzrostu spada przy stabilizacji; część weekendowych jednostek jest karana domyślnym 120 min w scorerze, mimo 150 min w API generatora. Brak naruszeń krytycznych. Sprawdź pełne jednostki i relację początek/szczyt; nie jest to automatycznie artefakt miernika.
- 647: Przy 4 dniach lepiej wypełniono początkową deklarowaną bazę. Historyczny iloraz wzrostu spada przy stabilizacji; część weekendowych jednostek jest karana domyślnym 120 min w scorerze, mimo 150 min w API generatora. Brak naruszeń krytycznych. Sprawdź pełne jednostki i relację początek/szczyt; nie jest to automatycznie artefakt miernika.

## Wszystkie remisy

| ID | Dystans/dni/poziom/baza | V27/23 | V28/23 | Δ23 | V27/25 | V28/25 | Δ25 | Audyt27 przed/po |
|---|---|---|---|---|---|---|---|---|
| 0 | 5k/1/beginner/6 | 5.501000 | 5.501000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 1 | 5k/1/beginner/6 | 5.085000 | 5.085000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 2 | 5k/1/beginner/6 | 5.501000 | 5.501000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 3 | 5k/1/beginner/6 | 5.501000 | 5.501000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 4 | 5k/1/beginner/30 | 5.789000 | 5.789000 | 0.000000 | 9.222000 | 9.222000 | 0.000000 | 6.557000 / 6.557000 |
| 5 | 5k/1/beginner/30 | 5.789000 | 5.789000 | 0.000000 | 9.222000 | 9.222000 | 0.000000 | 6.557000 / 6.557000 |
| 6 | 5k/1/beginner/30 | 5.789000 | 5.789000 | 0.000000 | 9.222000 | 9.222000 | 0.000000 | 6.407000 / 6.407000 |
| 7 | 5k/1/beginner/30 | 5.789000 | 5.789000 | 0.000000 | 9.222000 | 9.222000 | 0.000000 | 6.557000 / 6.557000 |
| 8 | 5k/1/beginner/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.543000 / 6.543000 |
| 9 | 5k/1/beginner/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.543000 / 6.543000 |
| 10 | 5k/1/beginner/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.393000 / 6.393000 |
| 11 | 5k/1/beginner/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.343000 / 6.343000 |
| 12 | 5k/1/intermediate/6 | 5.501000 | 5.501000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 13 | 5k/1/intermediate/6 | 5.085000 | 5.085000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 14 | 5k/1/intermediate/6 | 5.501000 | 5.501000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 15 | 5k/1/intermediate/6 | 5.501000 | 5.501000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 16 | 5k/1/intermediate/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.577000 / 6.577000 |
| 17 | 5k/1/intermediate/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.577000 / 6.577000 |
| 18 | 5k/1/intermediate/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.427000 / 6.427000 |
| 19 | 5k/1/intermediate/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.377000 / 6.377000 |
| 20 | 5k/1/intermediate/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.543000 / 6.543000 |
| 21 | 5k/1/intermediate/60 | 5.215000 | 5.215000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.543000 / 6.543000 |
| 22 | 5k/1/intermediate/60 | 5.633000 | 5.633000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.393000 / 6.393000 |
| 23 | 5k/1/intermediate/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.543000 / 6.543000 |
| 24 | 5k/1/advanced/6 | 5.501000 | 5.501000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 25 | 5k/1/advanced/6 | 5.085000 | 5.085000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 26 | 5k/1/advanced/6 | 5.501000 | 5.501000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 27 | 5k/1/advanced/6 | 5.501000 | 5.501000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 28 | 5k/1/advanced/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.577000 / 6.577000 |
| 29 | 5k/1/advanced/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.577000 / 6.577000 |
| 30 | 5k/1/advanced/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.427000 / 6.427000 |
| 31 | 5k/1/advanced/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.377000 / 6.377000 |
| 32 | 5k/1/advanced/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.543000 / 6.543000 |
| 33 | 5k/1/advanced/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.543000 / 6.543000 |
| 34 | 5k/1/advanced/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.393000 / 6.393000 |
| 35 | 5k/1/advanced/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.543000 / 6.543000 |
| 36 | 5k/2/beginner/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.477000 / 7.477000 |
| 37 | 5k/2/beginner/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.477000 / 7.477000 |
| 38 | 5k/2/beginner/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.277000 / 7.277000 |
| 39 | 5k/2/beginner/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.277000 / 7.277000 |
| 40 | 5k/2/beginner/30 | 8.780000 | 8.780000 | 0.000000 | 9.186000 | 9.186000 | 0.000000 | 7.837000 / 7.837000 |
| 41 | 5k/2/beginner/30 | 8.578000 | 8.578000 | 0.000000 | 8.984000 | 8.984000 | 0.000000 | 7.837000 / 7.837000 |
| 42 | 5k/2/beginner/30 | 8.420000 | 8.420000 | 0.000000 | 8.827000 | 8.827000 | 0.000000 | 7.787000 / 7.787000 |
| 43 | 5k/2/beginner/30 | 8.780000 | 8.780000 | 0.000000 | 9.186000 | 9.186000 | 0.000000 | 7.937000 / 7.937000 |
| 44 | 5k/2/beginner/60 | 8.880000 | 8.880000 | 0.000000 | 9.347000 | 9.347000 | 0.000000 | 7.680000 / 7.680000 |
| 45 | 5k/2/beginner/60 | 8.588000 | 8.588000 | 0.000000 | 9.055000 | 9.055000 | 0.000000 | 7.730000 / 7.730000 |
| 46 | 5k/2/beginner/60 | 8.696000 | 8.696000 | 0.000000 | 9.162000 | 9.162000 | 0.000000 | 7.770000 / 7.770000 |
| 47 | 5k/2/beginner/60 | 8.911000 | 8.911000 | 0.000000 | 9.207000 | 9.207000 | 0.000000 | 7.770000 / 7.770000 |
| 48 | 5k/2/intermediate/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.477000 / 7.477000 |
| 49 | 5k/2/intermediate/6 | 8.865000 | 8.865000 | 0.000000 | 9.623000 | 9.623000 | 0.000000 | 7.510000 / 7.510000 |
| 50 | 5k/2/intermediate/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 51 | 5k/2/intermediate/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.277000 / 7.277000 |
| 52 | 5k/2/intermediate/30 | 8.888000 | 8.888000 | 0.000000 | 9.279000 | 9.279000 | 0.000000 | 8.050000 / 8.050000 |
| 53 | 5k/2/intermediate/30 | 8.713000 | 8.713000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.930000 / 7.930000 |
| 54 | 5k/2/intermediate/30 | 8.713000 | 8.713000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.930000 / 7.930000 |
| 55 | 5k/2/intermediate/30 | 8.928000 | 8.928000 | 0.000000 | 9.198000 | 9.198000 | 0.000000 | 7.730000 / 7.730000 |
| 56 | 5k/2/intermediate/60 | 8.807000 | 8.807000 | 0.000000 | 9.274000 | 9.274000 | 0.000000 | 7.787000 / 7.787000 |
| 57 | 5k/2/intermediate/60 | 8.588000 | 8.588000 | 0.000000 | 9.055000 | 9.055000 | 0.000000 | 7.830000 / 7.830000 |
| 58 | 5k/2/intermediate/60 | 8.588000 | 8.588000 | 0.000000 | 9.055000 | 9.055000 | 0.000000 | 7.830000 / 7.830000 |
| 59 | 5k/2/intermediate/60 | 8.758000 | 8.758000 | 0.000000 | 9.055000 | 9.055000 | 0.000000 | 7.830000 / 7.830000 |
| 60 | 5k/2/advanced/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.477000 / 7.477000 |
| 61 | 5k/2/advanced/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.477000 / 7.477000 |
| 62 | 5k/2/advanced/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.277000 / 7.277000 |
| 63 | 5k/2/advanced/6 | 9.053000 | 9.053000 | 0.000000 | 9.810000 | 9.810000 | 0.000000 | 7.310000 / 7.310000 |
| 64 | 5k/2/advanced/30 | 8.560000 | 8.560000 | 0.000000 | 9.036000 | 9.036000 | 0.000000 | 8.027000 / 8.027000 |
| 65 | 5k/2/advanced/30 | 8.520000 | 8.520000 | 0.000000 | 8.996000 | 8.996000 | 0.000000 | 7.877000 / 7.877000 |
| 66 | 5k/2/advanced/30 | 8.520000 | 8.520000 | 0.000000 | 8.996000 | 8.996000 | 0.000000 | 7.877000 / 7.877000 |
| 67 | 5k/2/advanced/30 | 8.669000 | 8.669000 | 0.000000 | 8.996000 | 8.996000 | 0.000000 | 7.713000 / 7.713000 |
| 68 | 5k/2/advanced/60 | 8.566000 | 8.566000 | 0.000000 | 9.135000 | 9.135000 | 0.000000 | 7.647000 / 7.647000 |
| 69 | 5k/2/advanced/60 | 8.320000 | 8.320000 | 0.000000 | 8.888000 | 8.888000 | 0.000000 | 7.847000 / 7.847000 |
| 70 | 5k/2/advanced/60 | 8.174000 | 8.174000 | 0.000000 | 8.744000 | 8.744000 | 0.000000 | 7.813000 / 7.813000 |
| 71 | 5k/2/advanced/60 | 8.462000 | 8.462000 | 0.000000 | 9.032000 | 9.032000 | 0.000000 | 7.957000 / 7.957000 |
| 72 | 5k/3/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 73 | 5k/3/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 74 | 5k/3/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 75 | 5k/3/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.810000 / 6.810000 |
| 76 | 5k/3/beginner/30 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.873000 / 7.873000 |
| 77 | 5k/3/beginner/30 | 8.770000 | 8.770000 | 0.000000 | 9.032000 | 9.032000 | 0.000000 | 7.853000 / 7.853000 |
| 78 | 5k/3/beginner/30 | 8.770000 | 8.770000 | 0.000000 | 9.032000 | 9.032000 | 0.000000 | 7.853000 / 7.853000 |
| 79 | 5k/3/beginner/30 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.823000 / 7.823000 |
| 80 | 5k/3/beginner/60 | 8.536000 | 8.536000 | 0.000000 | 9.119000 | 9.119000 | 0.000000 | 7.777000 / 7.777000 |
| 81 | 5k/3/beginner/60 | 8.536000 | 8.536000 | 0.000000 | 9.119000 | 9.119000 | 0.000000 | 7.627000 / 7.627000 |
| 82 | 5k/3/beginner/60 | 8.536000 | 8.536000 | 0.000000 | 9.119000 | 9.119000 | 0.000000 | 7.777000 / 7.777000 |
| 83 | 5k/3/beginner/60 | 8.546000 | 8.546000 | 0.000000 | 9.185000 | 9.185000 | 0.000000 | 7.777000 / 7.777000 |
| 84 | 5k/3/intermediate/6 | 9.011000 | 9.011000 | 0.000000 | 9.779000 | 9.779000 | 0.000000 | 7.143000 / 7.143000 |
| 85 | 5k/3/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 86 | 5k/3/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 87 | 5k/3/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 88 | 5k/3/intermediate/30 | 8.732000 | 8.732000 | 0.000000 | 9.282000 | 9.282000 | 0.000000 | 7.960000 / 7.960000 |
| 89 | 5k/3/intermediate/30 | 8.669000 | 8.669000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.960000 / 7.960000 |
| 90 | 5k/3/intermediate/30 | 8.669000 | 8.669000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.960000 / 7.960000 |
| 91 | 5k/3/intermediate/30 | 8.701000 | 8.701000 | 0.000000 | 9.251000 | 9.251000 | 0.000000 | 8.080000 / 8.080000 |
| 92 | 5k/3/intermediate/60 | 8.536000 | 8.536000 | 0.000000 | 9.119000 | 9.119000 | 0.000000 | 7.827000 / 7.827000 |
| 93 | 5k/3/intermediate/60 | 8.536000 | 8.536000 | 0.000000 | 9.119000 | 9.119000 | 0.000000 | 7.827000 / 7.827000 |
| 94 | 5k/3/intermediate/60 | 8.536000 | 8.536000 | 0.000000 | 9.119000 | 9.119000 | 0.000000 | 7.727000 / 7.727000 |
| 95 | 5k/3/intermediate/60 | 8.546000 | 8.546000 | 0.000000 | 9.185000 | 9.185000 | 0.000000 | 7.727000 / 7.727000 |
| 96 | 5k/3/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 97 | 5k/3/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 98 | 5k/3/advanced/6 | 8.824000 | 8.824000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 7.143000 / 7.143000 |
| 99 | 5k/3/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 100 | 5k/3/advanced/30 | 8.544000 | 8.544000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.917000 / 7.917000 |
| 101 | 5k/3/advanced/30 | 8.544000 | 8.544000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.817000 / 7.817000 |
| 102 | 5k/3/advanced/30 | 8.544000 | 8.544000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.817000 / 7.817000 |
| 103 | 5k/3/advanced/30 | 8.610000 | 8.610000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.967000 / 7.967000 |
| 104 | 5k/3/advanced/60 | 8.428000 | 8.428000 | 0.000000 | 9.132000 | 9.132000 | 0.000000 | 7.883000 / 7.883000 |
| 105 | 5k/3/advanced/60 | 8.298000 | 8.298000 | 0.000000 | 8.963000 | 8.963000 | 0.000000 | 7.813000 / 7.813000 |
| 106 | 5k/3/advanced/60 | 8.273000 | 8.273000 | 0.000000 | 8.945000 | 8.945000 | 0.000000 | 7.803000 / 7.803000 |
| 107 | 5k/3/advanced/60 | 8.428000 | 8.428000 | 0.000000 | 9.132000 | 9.132000 | 0.000000 | 7.833000 / 7.833000 |
| 108 | 5k/4/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 109 | 5k/4/beginner/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.110000 / 7.110000 |
| 110 | 5k/4/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.810000 / 6.810000 |
| 111 | 5k/4/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.810000 / 6.810000 |
| 112 | 5k/4/beginner/30 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.830000 / 7.830000 |
| 113 | 5k/4/beginner/30 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.830000 / 7.830000 |
| 114 | 5k/4/beginner/30 | 8.645000 | 8.645000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.730000 / 7.730000 |
| 115 | 5k/4/beginner/30 | 8.589000 | 8.589000 | 0.000000 | 9.021000 | 9.021000 | 0.000000 | 7.630000 / 7.630000 |
| 116 | 5k/4/beginner/60 | 8.611000 | 8.611000 | 0.000000 | 9.176000 | 9.176000 | 0.000000 | 7.807000 / 7.807000 |
| 117 | 5k/4/beginner/60 | 8.611000 | 8.611000 | 0.000000 | 9.176000 | 9.176000 | 0.000000 | 7.807000 / 7.807000 |
| 118 | 5k/4/beginner/60 | 8.552000 | 8.552000 | 0.000000 | 9.176000 | 9.176000 | 0.000000 | 7.807000 / 7.807000 |
| 119 | 5k/4/beginner/60 | 8.669000 | 8.669000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.790000 / 7.790000 |
| 120 | 5k/4/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 121 | 5k/4/intermediate/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.110000 / 7.110000 |
| 122 | 5k/4/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 123 | 5k/4/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 124 | 5k/4/intermediate/30 | 8.871000 | 8.871000 | 0.000000 | 9.422000 | 9.422000 | 0.000000 | 7.973000 / 7.973000 |
| 125 | 5k/4/intermediate/30 | 8.669000 | 8.669000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.973000 / 7.973000 |
| 126 | 5k/4/intermediate/30 | 8.449000 | 8.449000 | 0.000000 | 9.032000 | 9.032000 | 0.000000 | 7.900000 / 7.900000 |
| 127 | 5k/4/intermediate/30 | 8.871000 | 8.871000 | 0.000000 | 9.422000 | 9.422000 | 0.000000 | 8.073000 / 8.073000 |
| 128 | 5k/4/intermediate/60 | 8.611000 | 8.611000 | 0.000000 | 9.176000 | 9.176000 | 0.000000 | 8.007000 / 8.007000 |
| 129 | 5k/4/intermediate/60 | 8.611000 | 8.611000 | 0.000000 | 9.176000 | 9.176000 | 0.000000 | 7.757000 / 7.757000 |
| 130 | 5k/4/intermediate/60 | 8.552000 | 8.552000 | 0.000000 | 9.176000 | 9.176000 | 0.000000 | 7.757000 / 7.757000 |
| 131 | 5k/4/intermediate/60 | 8.621000 | 8.621000 | 0.000000 | 9.241000 | 9.241000 | 0.000000 | 7.907000 / 7.907000 |
| 132 | 5k/4/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 133 | 5k/4/advanced/6 | 8.665000 | 8.665000 | 0.000000 | 9.433000 | 9.433000 | 0.000000 | 7.143000 / 7.143000 |
| 134 | 5k/4/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.910000 / 6.910000 |
| 135 | 5k/4/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 136 | 5k/4/advanced/30 | 8.596000 | 8.596000 | 0.000000 | 9.271000 | 9.271000 | 0.000000 | 7.867000 / 7.867000 |
| 137 | 5k/4/advanced/30 | 8.346000 | 8.346000 | 0.000000 | 9.021000 | 9.021000 | 0.000000 | 7.867000 / 7.867000 |
| 138 | 5k/4/advanced/30 | 8.544000 | 8.544000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.967000 / 7.967000 |
| 139 | 5k/4/advanced/30 | 8.610000 | 8.610000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.967000 / 7.967000 |
| 140 | 5k/4/advanced/60 | 8.544000 | 8.544000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.917000 / 7.917000 |
| 141 | 5k/4/advanced/60 | 8.511000 | 8.511000 | 0.000000 | 9.194000 | 9.194000 | 0.000000 | 7.867000 / 7.867000 |
| 142 | 5k/4/advanced/60 | 8.511000 | 8.511000 | 0.000000 | 9.194000 | 9.194000 | 0.000000 | 7.867000 / 7.867000 |
| 143 | 5k/4/advanced/60 | 8.577000 | 8.577000 | 0.000000 | 9.260000 | 9.260000 | 0.000000 | 7.767000 / 7.767000 |
| 144 | 5k/5/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 145 | 5k/5/beginner/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.010000 / 7.010000 |
| 146 | 5k/5/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.810000 / 6.810000 |
| 147 | 5k/5/beginner/6 | 9.011000 | 9.011000 | 0.000000 | 9.779000 | 9.779000 | 0.000000 | 6.943000 / 6.943000 |
| 148 | 5k/5/beginner/30 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.830000 / 7.830000 |
| 149 | 5k/5/beginner/30 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.730000 / 7.730000 |
| 150 | 5k/5/beginner/30 | 8.447000 | 8.447000 | 0.000000 | 8.956000 | 8.956000 | 0.000000 | 7.630000 / 7.630000 |
| 151 | 5k/5/beginner/30 | 8.589000 | 8.589000 | 0.000000 | 9.021000 | 9.021000 | 0.000000 | 7.630000 / 7.630000 |
| 152 | 5k/5/beginner/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.837000 / 7.837000 |
| 153 | 5k/5/beginner/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.687000 / 7.687000 |
| 154 | 5k/5/beginner/60 | 8.948000 | 8.948000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 7.823000 / 7.823000 |
| 155 | 5k/5/beginner/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.787000 / 7.787000 |
| 156 | 5k/5/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 157 | 5k/5/intermediate/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.110000 / 7.110000 |
| 158 | 5k/5/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 159 | 5k/5/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.810000 / 6.810000 |
| 160 | 5k/5/intermediate/30 | 9.139000 | 9.139000 | 0.000000 | 9.689000 | 9.689000 | 0.000000 | 7.980000 / 7.980000 |
| 161 | 5k/5/intermediate/30 | 8.498000 | 8.498000 | 0.000000 | 8.964000 | 8.964000 | 0.000000 | 7.900000 / 7.900000 |
| 162 | 5k/5/intermediate/30 | 8.621000 | 8.621000 | 0.000000 | 9.087000 | 9.087000 | 0.000000 | 8.050000 / 8.050000 |
| 163 | 5k/5/intermediate/30 | 9.139000 | 9.139000 | 0.000000 | 9.689000 | 9.689000 | 0.000000 | 7.980000 / 7.980000 |
| 164 | 5k/5/intermediate/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.937000 / 7.937000 |
| 165 | 5k/5/intermediate/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.787000 / 7.787000 |
| 166 | 5k/5/intermediate/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.937000 / 7.937000 |
| 167 | 5k/5/intermediate/60 | 8.936000 | 8.936000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.937000 / 7.937000 |
| 168 | 5k/5/advanced/6 | 9.011000 | 9.011000 | 0.000000 | 9.779000 | 9.779000 | 0.000000 | 7.143000 / 7.143000 |
| 169 | 5k/5/advanced/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.110000 / 7.110000 |
| 170 | 5k/5/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 171 | 5k/5/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 172 | 5k/5/advanced/30 | 9.069000 | 9.069000 | 0.000000 | 9.744000 | 9.744000 | 0.000000 | 7.860000 / 7.860000 |
| 173 | 5k/5/advanced/30 | 8.544000 | 8.544000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.960000 / 7.960000 |
| 174 | 5k/5/advanced/30 | 8.695000 | 8.695000 | 0.000000 | 9.370000 | 9.370000 | 0.000000 | 7.960000 / 7.960000 |
| 175 | 5k/5/advanced/30 | 9.069000 | 9.069000 | 0.000000 | 9.744000 | 9.744000 | 0.000000 | 8.080000 / 8.080000 |
| 176 | 5k/5/advanced/60 | 9.015000 | 9.015000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.893000 / 7.893000 |
| 177 | 5k/5/advanced/60 | 9.015000 | 9.015000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.893000 / 7.893000 |
| 178 | 5k/5/advanced/60 | 9.015000 | 9.015000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.793000 / 7.793000 |
| 179 | 5k/5/advanced/60 | 8.768000 | 8.768000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.943000 / 7.943000 |
| 180 | 5k/6/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 181 | 5k/6/beginner/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.010000 / 7.010000 |
| 182 | 5k/6/beginner/6 | 8.824000 | 8.824000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.943000 / 6.943000 |
| 183 | 5k/6/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 184 | 5k/6/beginner/30 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.880000 / 7.880000 |
| 185 | 5k/6/beginner/30 | 8.590000 | 8.590000 | 0.000000 | 8.956000 | 8.956000 | 0.000000 | 7.630000 / 7.630000 |
| 186 | 5k/6/beginner/30 | 8.447000 | 8.447000 | 0.000000 | 8.956000 | 8.956000 | 0.000000 | 7.630000 / 7.630000 |
| 187 | 5k/6/beginner/30 | 8.787000 | 8.787000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.730000 / 7.730000 |
| 188 | 5k/6/beginner/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.853000 / 7.853000 |
| 189 | 5k/6/beginner/60 | 8.948000 | 8.948000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 7.827000 / 7.827000 |
| 190 | 5k/6/beginner/60 | 8.948000 | 8.948000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 7.803000 / 7.803000 |
| 191 | 5k/6/beginner/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.803000 / 7.803000 |
| 192 | 5k/6/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 193 | 5k/6/intermediate/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.110000 / 7.110000 |
| 194 | 5k/6/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 195 | 5k/6/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.810000 / 6.810000 |
| 196 | 5k/6/intermediate/30 | 9.194000 | 9.194000 | 0.000000 | 9.744000 | 9.744000 | 0.000000 | 8.080000 / 8.080000 |
| 197 | 5k/6/intermediate/30 | 8.669000 | 8.669000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 8.080000 / 8.080000 |
| 198 | 5k/6/intermediate/30 | 8.753000 | 8.753000 | 0.000000 | 9.303000 | 9.303000 | 0.000000 | 7.980000 / 7.980000 |
| 199 | 5k/6/intermediate/30 | 8.792000 | 8.792000 | 0.000000 | 9.397000 | 9.397000 | 0.000000 | 7.880000 / 7.880000 |
| 200 | 5k/6/intermediate/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.953000 / 7.953000 |
| 201 | 5k/6/intermediate/60 | 8.909000 | 8.909000 | 0.000000 | 9.087000 | 9.087000 | 0.000000 | 7.703000 / 7.703000 |
| 202 | 5k/6/intermediate/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.953000 / 7.953000 |
| 203 | 5k/6/intermediate/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.927000 / 7.927000 |
| 204 | 5k/6/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 205 | 5k/6/advanced/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.110000 / 7.110000 |
| 206 | 5k/6/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 207 | 5k/6/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 208 | 5k/6/advanced/30 | 9.069000 | 9.069000 | 0.000000 | 9.744000 | 9.744000 | 0.000000 | 7.860000 / 7.860000 |
| 209 | 5k/6/advanced/30 | 9.019000 | 9.019000 | 0.000000 | 9.695000 | 9.695000 | 0.000000 | 7.960000 / 7.960000 |
| 210 | 5k/6/advanced/30 | 8.915000 | 8.915000 | 0.000000 | 9.557000 | 9.557000 | 0.000000 | 8.050000 / 8.050000 |
| 211 | 5k/6/advanced/30 | 9.069000 | 9.069000 | 0.000000 | 9.744000 | 9.744000 | 0.000000 | 8.060000 / 8.060000 |
| 212 | 5k/6/advanced/60 | 9.015000 | 9.015000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.910000 / 7.910000 |
| 213 | 5k/6/advanced/60 | 9.015000 | 9.015000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.810000 / 7.810000 |
| 214 | 5k/6/advanced/60 | 9.015000 | 9.015000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.810000 / 7.810000 |
| 215 | 5k/6/advanced/60 | 8.570000 | 8.570000 | 0.000000 | 9.087000 | 9.087000 | 0.000000 | 7.860000 / 7.860000 |
| 216 | 5k/7/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 217 | 5k/7/beginner/6 | 8.665000 | 8.665000 | 0.000000 | 9.433000 | 9.433000 | 0.000000 | 7.143000 / 7.143000 |
| 218 | 5k/7/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.910000 / 6.910000 |
| 219 | 5k/7/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 220 | 5k/7/beginner/30 | 8.585000 | 8.585000 | 0.000000 | 8.950000 | 8.950000 | 0.000000 | 7.780000 / 7.780000 |
| 221 | 5k/7/beginner/30 | 8.590000 | 8.590000 | 0.000000 | 8.956000 | 8.956000 | 0.000000 | 7.630000 / 7.630000 |
| 222 | 5k/7/beginner/30 | 8.645000 | 8.645000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.730000 / 7.730000 |
| 223 | 5k/7/beginner/30 | 8.787000 | 8.787000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.730000 / 7.730000 |
| 224 | 5k/7/beginner/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.827000 / 7.827000 |
| 225 | 5k/7/beginner/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.803000 / 7.803000 |
| 226 | 5k/7/beginner/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.803000 / 7.803000 |
| 227 | 5k/7/beginner/60 | 8.936000 | 8.936000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.703000 / 7.703000 |
| 228 | 5k/7/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 229 | 5k/7/intermediate/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.010000 / 7.010000 |
| 230 | 5k/7/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 231 | 5k/7/intermediate/6 | 9.011000 | 9.011000 | 0.000000 | 9.779000 | 9.779000 | 0.000000 | 6.943000 / 6.943000 |
| 232 | 5k/7/intermediate/30 | 9.139000 | 9.139000 | 0.000000 | 9.689000 | 9.689000 | 0.000000 | 8.080000 / 8.080000 |
| 233 | 5k/7/intermediate/30 | 8.669000 | 8.669000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.980000 / 7.980000 |
| 234 | 5k/7/intermediate/30 | 8.753000 | 8.753000 | 0.000000 | 9.303000 | 9.303000 | 0.000000 | 7.880000 / 7.880000 |
| 235 | 5k/7/intermediate/30 | 8.792000 | 8.792000 | 0.000000 | 9.397000 | 9.397000 | 0.000000 | 7.880000 / 7.880000 |
| 236 | 5k/7/intermediate/60 | 8.904000 | 8.904000 | 0.000000 | 9.082000 | 9.082000 | 0.000000 | 7.853000 / 7.853000 |
| 237 | 5k/7/intermediate/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.803000 / 7.803000 |
| 238 | 5k/7/intermediate/60 | 8.948000 | 8.948000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 7.927000 / 7.927000 |
| 239 | 5k/7/intermediate/60 | 9.107000 | 9.107000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.903000 / 7.903000 |
| 240 | 5k/7/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 241 | 5k/7/advanced/6 | 8.925000 | 8.925000 | 0.000000 | 9.713000 | 9.713000 | 0.000000 | 7.110000 / 7.110000 |
| 242 | 5k/7/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 243 | 5k/7/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.810000 / 6.810000 |
| 244 | 5k/7/advanced/30 | 9.069000 | 9.069000 | 0.000000 | 9.744000 | 9.744000 | 0.000000 | 7.960000 / 7.960000 |
| 245 | 5k/7/advanced/30 | 8.882000 | 8.882000 | 0.000000 | 9.524000 | 9.524000 | 0.000000 | 8.050000 / 8.050000 |
| 246 | 5k/7/advanced/30 | 8.915000 | 8.915000 | 0.000000 | 9.557000 | 9.557000 | 0.000000 | 8.030000 / 8.030000 |
| 247 | 5k/7/advanced/30 | 9.069000 | 9.069000 | 0.000000 | 9.744000 | 9.744000 | 0.000000 | 7.960000 / 7.960000 |
| 248 | 5k/7/advanced/60 | 9.015000 | 9.015000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.960000 / 7.960000 |
| 249 | 5k/7/advanced/60 | 9.015000 | 9.015000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.810000 / 7.810000 |
| 250 | 5k/7/advanced/60 | 8.817000 | 8.817000 | 0.000000 | 9.087000 | 9.087000 | 0.000000 | 7.860000 / 7.860000 |
| 251 | 5k/7/advanced/60 | 8.768000 | 8.768000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 7.960000 / 7.960000 |
| 252 | 10k/1/beginner/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 253 | 10k/1/beginner/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 254 | 10k/1/beginner/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 255 | 10k/1/beginner/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 256 | 10k/1/beginner/30 | 4.652000 | 4.652000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.557000 / 6.557000 |
| 257 | 10k/1/beginner/30 | 4.652000 | 4.652000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.407000 / 6.407000 |
| 258 | 10k/1/beginner/30 | 4.652000 | 4.652000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.407000 / 6.407000 |
| 259 | 10k/1/beginner/30 | 4.652000 | 4.652000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.557000 / 6.557000 |
| 260 | 10k/1/beginner/60 | 5.633000 | 5.633000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.543000 / 6.543000 |
| 261 | 10k/1/beginner/60 | 5.633000 | 5.633000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.393000 / 6.393000 |
| 262 | 10k/1/beginner/60 | 5.633000 | 5.633000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.393000 / 6.393000 |
| 263 | 10k/1/beginner/60 | 5.765000 | 5.765000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.543000 / 6.543000 |
| 264 | 10k/1/intermediate/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 265 | 10k/1/intermediate/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 266 | 10k/1/intermediate/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 267 | 10k/1/intermediate/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 268 | 10k/1/intermediate/30 | 5.692000 | 5.692000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.577000 / 6.577000 |
| 269 | 10k/1/intermediate/30 | 5.692000 | 5.692000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.427000 / 6.427000 |
| 270 | 10k/1/intermediate/30 | 5.692000 | 5.692000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.427000 / 6.427000 |
| 271 | 10k/1/intermediate/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.577000 / 6.577000 |
| 272 | 10k/1/intermediate/60 | 5.633000 | 5.633000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.543000 / 6.543000 |
| 273 | 10k/1/intermediate/60 | 5.633000 | 5.633000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.393000 / 6.393000 |
| 274 | 10k/1/intermediate/60 | 5.633000 | 5.633000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.393000 / 6.393000 |
| 275 | 10k/1/intermediate/60 | 5.633000 | 5.633000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.543000 / 6.543000 |
| 276 | 10k/1/advanced/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 277 | 10k/1/advanced/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 278 | 10k/1/advanced/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 279 | 10k/1/advanced/6 | 4.163000 | 4.163000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.110000 / 6.110000 |
| 280 | 10k/1/advanced/30 | 5.692000 | 5.692000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.577000 / 6.577000 |
| 281 | 10k/1/advanced/30 | 5.692000 | 5.692000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.427000 / 6.427000 |
| 282 | 10k/1/advanced/30 | 5.692000 | 5.692000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.427000 / 6.427000 |
| 283 | 10k/1/advanced/30 | 5.824000 | 5.824000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.577000 / 6.577000 |
| 284 | 10k/1/advanced/60 | 5.644000 | 5.644000 | 0.000000 | 9.004000 | 9.004000 | 0.000000 | 6.550000 / 6.550000 |
| 285 | 10k/1/advanced/60 | 5.644000 | 5.644000 | 0.000000 | 9.004000 | 9.004000 | 0.000000 | 6.400000 / 6.400000 |
| 286 | 10k/1/advanced/60 | 5.644000 | 5.644000 | 0.000000 | 9.004000 | 9.004000 | 0.000000 | 6.400000 / 6.400000 |
| 287 | 10k/1/advanced/60 | 5.644000 | 5.644000 | 0.000000 | 9.004000 | 9.004000 | 0.000000 | 6.550000 / 6.550000 |
| 288 | 10k/2/beginner/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 289 | 10k/2/beginner/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 290 | 10k/2/beginner/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 291 | 10k/2/beginner/6 | 9.053000 | 9.053000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.477000 / 7.477000 |
| 292 | 10k/2/beginner/30 | 8.586000 | 8.586000 | 0.000000 | 8.894000 | 8.894000 | 0.000000 | 7.563000 / 7.563000 |
| 293 | 10k/2/beginner/30 | 8.390000 | 8.390000 | 0.000000 | 8.698000 | 8.698000 | 0.000000 | 7.563000 / 7.563000 |
| 294 | 10k/2/beginner/30 | 8.293000 | 8.293000 | 0.000000 | 8.617000 | 8.617000 | 0.000000 | 7.533000 / 7.533000 |
| 295 | 10k/2/beginner/30 | 8.461000 | 8.461000 | 0.000000 | 8.728000 | 8.728000 | 0.000000 | 7.533000 / 7.533000 |
| 296 | 10k/2/beginner/60 | 8.647000 | 8.647000 | 0.000000 | 8.898000 | 8.898000 | 0.000000 | 7.570000 / 7.570000 |
| 297 | 10k/2/beginner/60 | 8.365000 | 8.365000 | 0.000000 | 8.616000 | 8.616000 | 0.000000 | 7.420000 / 7.420000 |
| 298 | 10k/2/beginner/60 | 8.471000 | 8.471000 | 0.000000 | 8.721000 | 8.721000 | 0.000000 | 7.460000 / 7.460000 |
| 299 | 10k/2/beginner/60 | 9.053000 | 9.053000 | 0.000000 | 9.303000 | 9.303000 | 0.000000 | 7.460000 / 7.460000 |
| 300 | 10k/2/intermediate/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 301 | 10k/2/intermediate/6 | 8.865000 | 8.865000 | 0.000000 | 9.623000 | 9.623000 | 0.000000 | 7.510000 / 7.510000 |
| 302 | 10k/2/intermediate/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 303 | 10k/2/intermediate/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 304 | 10k/2/intermediate/30 | 8.663000 | 8.663000 | 0.000000 | 8.838000 | 8.838000 | 0.000000 | 7.740000 / 7.740000 |
| 305 | 10k/2/intermediate/30 | 8.490000 | 8.490000 | 0.000000 | 8.715000 | 8.715000 | 0.000000 | 7.620000 / 7.620000 |
| 306 | 10k/2/intermediate/30 | 8.490000 | 8.490000 | 0.000000 | 8.715000 | 8.715000 | 0.000000 | 7.620000 / 7.620000 |
| 307 | 10k/2/intermediate/30 | 9.028000 | 9.028000 | 0.000000 | 9.253000 | 9.253000 | 0.000000 | 7.620000 / 7.620000 |
| 308 | 10k/2/intermediate/60 | 8.529000 | 8.529000 | 0.000000 | 8.782000 | 8.782000 | 0.000000 | 7.690000 / 7.690000 |
| 309 | 10k/2/intermediate/60 | 8.365000 | 8.365000 | 0.000000 | 8.616000 | 8.616000 | 0.000000 | 7.520000 / 7.520000 |
| 310 | 10k/2/intermediate/60 | 8.365000 | 8.365000 | 0.000000 | 8.616000 | 8.616000 | 0.000000 | 7.520000 / 7.520000 |
| 311 | 10k/2/intermediate/60 | 8.835000 | 8.835000 | 0.000000 | 9.086000 | 9.086000 | 0.000000 | 7.670000 / 7.670000 |
| 312 | 10k/2/advanced/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 313 | 10k/2/advanced/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 314 | 10k/2/advanced/6 | 8.865000 | 8.865000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.477000 / 7.477000 |
| 315 | 10k/2/advanced/6 | 8.865000 | 8.865000 | 0.000000 | 9.623000 | 9.623000 | 0.000000 | 7.510000 / 7.510000 |
| 316 | 10k/2/advanced/30 | 8.069000 | 8.069000 | 0.000000 | 8.349000 | 8.349000 | 0.000000 | 7.507000 / 7.507000 |
| 317 | 10k/2/advanced/30 | 8.032000 | 8.032000 | 0.000000 | 8.311000 | 8.311000 | 0.000000 | 7.507000 / 7.507000 |
| 318 | 10k/2/advanced/30 | 8.032000 | 8.032000 | 0.000000 | 8.311000 | 8.311000 | 0.000000 | 7.507000 / 7.507000 |
| 319 | 10k/2/advanced/30 | 8.351000 | 8.351000 | 0.000000 | 8.663000 | 8.663000 | 0.000000 | 7.543000 / 7.543000 |
| 320 | 10k/2/advanced/60 | 8.034000 | 8.034000 | 0.000000 | 8.406000 | 8.406000 | 0.000000 | 7.480000 / 7.480000 |
| 321 | 10k/2/advanced/60 | 7.840000 | 7.840000 | 0.000000 | 8.212000 | 8.212000 | 0.000000 | 7.480000 / 7.480000 |
| 322 | 10k/2/advanced/60 | 7.914000 | 7.914000 | 0.000000 | 8.288000 | 8.288000 | 0.000000 | 7.483000 / 7.483000 |
| 323 | 10k/2/advanced/60 | 7.968000 | 7.968000 | 0.000000 | 8.341000 | 8.341000 | 0.000000 | 7.467000 / 7.467000 |
| 324 | 10k/3/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 325 | 10k/3/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 326 | 10k/3/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 327 | 10k/3/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.810000 / 6.810000 |
| 328 | 10k/3/beginner/30 | 8.686000 | 8.686000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.110000 / 8.110000 |
| 329 | 10k/3/beginner/30 | 8.517000 | 8.517000 | 0.000000 | 8.846000 | 8.846000 | 0.000000 | 7.860000 / 7.860000 |
| 330 | 10k/3/beginner/30 | 8.517000 | 8.517000 | 0.000000 | 8.846000 | 8.846000 | 0.000000 | 7.860000 / 7.860000 |
| 331 | 10k/3/beginner/30 | 8.686000 | 8.686000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 7.860000 / 7.860000 |
| 332 | 10k/3/beginner/60 | 8.871000 | 8.871000 | 0.000000 | 9.238000 | 9.238000 | 0.000000 | 7.653000 / 7.653000 |
| 333 | 10k/3/beginner/60 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.853000 / 7.853000 |
| 334 | 10k/3/beginner/60 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.953000 / 7.953000 |
| 335 | 10k/3/beginner/60 | 9.011000 | 9.011000 | 0.000000 | 9.396000 | 9.396000 | 0.000000 | 7.983000 / 7.983000 |
| 336 | 10k/3/intermediate/6 | 8.824000 | 8.824000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 7.143000 / 7.143000 |
| 337 | 10k/3/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 338 | 10k/3/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 339 | 10k/3/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.910000 / 6.910000 |
| 340 | 10k/3/intermediate/30 | 9.070000 | 9.070000 | 0.000000 | 9.407000 | 9.407000 | 0.000000 | 8.130000 / 8.130000 |
| 341 | 10k/3/intermediate/30 | 8.914000 | 8.914000 | 0.000000 | 9.252000 | 9.252000 | 0.000000 | 8.130000 / 8.130000 |
| 342 | 10k/3/intermediate/30 | 8.914000 | 8.914000 | 0.000000 | 9.252000 | 9.252000 | 0.000000 | 8.130000 / 8.130000 |
| 343 | 10k/3/intermediate/30 | 9.036000 | 9.036000 | 0.000000 | 9.374000 | 9.374000 | 0.000000 | 8.050000 / 8.050000 |
| 344 | 10k/3/intermediate/60 | 8.871000 | 8.871000 | 0.000000 | 9.238000 | 9.238000 | 0.000000 | 7.803000 / 7.803000 |
| 345 | 10k/3/intermediate/60 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 8.003000 / 8.003000 |
| 346 | 10k/3/intermediate/60 | 8.788000 | 8.788000 | 0.000000 | 9.154000 | 9.154000 | 0.000000 | 7.953000 / 7.953000 |
| 347 | 10k/3/intermediate/60 | 9.011000 | 9.011000 | 0.000000 | 9.396000 | 9.396000 | 0.000000 | 7.983000 / 7.983000 |
| 348 | 10k/3/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 349 | 10k/3/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 350 | 10k/3/advanced/6 | 8.824000 | 8.824000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 7.143000 / 7.143000 |
| 351 | 10k/3/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.910000 / 6.910000 |
| 352 | 10k/3/advanced/30 | 8.788000 | 8.788000 | 0.000000 | 9.339000 | 9.339000 | 0.000000 | 8.237000 / 8.237000 |
| 353 | 10k/3/advanced/30 | 8.637000 | 8.637000 | 0.000000 | 9.188000 | 9.188000 | 0.000000 | 8.137000 / 8.137000 |
| 354 | 10k/3/advanced/30 | 8.637000 | 8.637000 | 0.000000 | 9.188000 | 9.188000 | 0.000000 | 8.137000 / 8.137000 |
| 355 | 10k/3/advanced/30 | 8.869000 | 8.869000 | 0.000000 | 9.467000 | 9.467000 | 0.000000 | 8.167000 / 8.167000 |
| 356 | 10k/3/advanced/60 | 8.656000 | 8.656000 | 0.000000 | 9.234000 | 9.234000 | 0.000000 | 7.857000 / 7.857000 |
| 357 | 10k/3/advanced/60 | 8.472000 | 8.472000 | 0.000000 | 8.900000 | 8.900000 | 0.000000 | 7.980000 / 7.980000 |
| 358 | 10k/3/advanced/60 | 8.520000 | 8.520000 | 0.000000 | 8.962000 | 8.962000 | 0.000000 | 7.957000 / 7.957000 |
| 359 | 10k/3/advanced/60 | 8.656000 | 8.656000 | 0.000000 | 9.234000 | 9.234000 | 0.000000 | 7.957000 / 7.957000 |
| 360 | 10k/4/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 361 | 10k/4/beginner/6 | 8.706000 | 8.706000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 7.110000 / 7.110000 |
| 362 | 10k/4/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 363 | 10k/4/beginner/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 364 | 10k/4/beginner/30 | 8.686000 | 8.686000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.060000 / 8.060000 |
| 365 | 10k/4/beginner/30 | 8.686000 | 8.686000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.060000 / 8.060000 |
| 366 | 10k/4/beginner/30 | 8.490000 | 8.490000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 7.960000 / 7.960000 |
| 367 | 10k/4/beginner/30 | 8.676000 | 8.676000 | 0.000000 | 9.053000 | 9.053000 | 0.000000 | 7.980000 / 7.980000 |
| 368 | 10k/4/beginner/60 | 8.761000 | 8.761000 | 0.000000 | 9.109000 | 9.109000 | 0.000000 | 7.683000 / 7.683000 |
| 369 | 10k/4/beginner/60 | 8.779000 | 8.779000 | 0.000000 | 9.126000 | 9.126000 | 0.000000 | 7.983000 / 7.983000 |
| 370 | 10k/4/beginner/60 | 8.485000 | 8.485000 | 0.000000 | 9.126000 | 9.126000 | 0.000000 | 7.983000 / 7.983000 |
| 371 | 10k/4/beginner/60 | 8.820000 | 8.820000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.120000 / 8.120000 |
| 372 | 10k/4/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 373 | 10k/4/intermediate/6 | 8.706000 | 8.706000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 7.110000 / 7.110000 |
| 374 | 10k/4/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 375 | 10k/4/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 376 | 10k/4/intermediate/30 | 9.267000 | 9.267000 | 0.000000 | 9.604000 | 9.604000 | 0.000000 | 8.150000 / 8.150000 |
| 377 | 10k/4/intermediate/30 | 9.020000 | 9.020000 | 0.000000 | 9.357000 | 9.357000 | 0.000000 | 8.150000 / 8.150000 |
| 378 | 10k/4/intermediate/30 | 8.877000 | 8.877000 | 0.000000 | 9.258000 | 9.258000 | 0.000000 | 8.050000 / 8.050000 |
| 379 | 10k/4/intermediate/30 | 9.267000 | 9.267000 | 0.000000 | 9.604000 | 9.604000 | 0.000000 | 8.250000 / 8.250000 |
| 380 | 10k/4/intermediate/60 | 8.949000 | 8.949000 | 0.000000 | 9.297000 | 9.297000 | 0.000000 | 7.983000 / 7.983000 |
| 381 | 10k/4/intermediate/60 | 8.596000 | 8.596000 | 0.000000 | 8.943000 | 8.943000 | 0.000000 | 7.983000 / 7.983000 |
| 382 | 10k/4/intermediate/60 | 8.302000 | 8.302000 | 0.000000 | 8.943000 | 8.943000 | 0.000000 | 7.983000 / 7.983000 |
| 383 | 10k/4/intermediate/60 | 9.069000 | 9.069000 | 0.000000 | 9.435000 | 9.435000 | 0.000000 | 8.113000 / 8.113000 |
| 384 | 10k/4/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 385 | 10k/4/advanced/6 | 8.790000 | 8.790000 | 0.000000 | 9.557000 | 9.557000 | 0.000000 | 7.143000 / 7.143000 |
| 386 | 10k/4/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 387 | 10k/4/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 388 | 10k/4/advanced/30 | 8.750000 | 8.750000 | 0.000000 | 9.300000 | 9.300000 | 0.000000 | 8.037000 / 8.037000 |
| 389 | 10k/4/advanced/30 | 8.552000 | 8.552000 | 0.000000 | 9.102000 | 9.102000 | 0.000000 | 8.037000 / 8.037000 |
| 390 | 10k/4/advanced/30 | 8.610000 | 8.610000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 8.137000 / 8.137000 |
| 391 | 10k/4/advanced/30 | 9.050000 | 9.050000 | 0.000000 | 9.647000 | 9.647000 | 0.000000 | 8.167000 / 8.167000 |
| 392 | 10k/4/advanced/60 | 8.607000 | 8.607000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.897000 / 7.897000 |
| 393 | 10k/4/advanced/60 | 8.599000 | 8.599000 | 0.000000 | 9.151000 | 9.151000 | 0.000000 | 8.047000 / 8.047000 |
| 394 | 10k/4/advanced/60 | 8.474000 | 8.474000 | 0.000000 | 9.151000 | 9.151000 | 0.000000 | 8.047000 / 8.047000 |
| 395 | 10k/4/advanced/60 | 8.769000 | 8.769000 | 0.000000 | 9.368000 | 9.368000 | 0.000000 | 8.127000 / 8.127000 |
| 396 | 10k/5/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 397 | 10k/5/beginner/6 | 8.706000 | 8.706000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 7.010000 / 7.010000 |
| 398 | 10k/5/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 399 | 10k/5/beginner/6 | 8.824000 | 8.824000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 7.143000 / 7.143000 |
| 400 | 10k/5/beginner/30 | 8.686000 | 8.686000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.060000 / 8.060000 |
| 401 | 10k/5/beginner/30 | 8.686000 | 8.686000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 7.960000 / 7.960000 |
| 402 | 10k/5/beginner/30 | 8.307000 | 8.307000 | 0.000000 | 8.909000 | 8.909000 | 0.000000 | 8.010000 / 8.010000 |
| 403 | 10k/5/beginner/30 | 8.676000 | 8.676000 | 0.000000 | 9.053000 | 9.053000 | 0.000000 | 7.980000 / 7.980000 |
| 404 | 10k/5/beginner/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.779000 / 7.779000 |
| 405 | 10k/5/beginner/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.979000 / 7.979000 |
| 406 | 10k/5/beginner/60 | 8.828000 | 8.828000 | 0.000000 | 8.978000 | 8.978000 | 0.000000 | 7.760000 / 7.760000 |
| 407 | 10k/5/beginner/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.727000 / 7.727000 |
| 408 | 10k/5/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 409 | 10k/5/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 410 | 10k/5/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 411 | 10k/5/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 412 | 10k/5/intermediate/30 | 9.345000 | 9.345000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.137000 / 8.137000 |
| 413 | 10k/5/intermediate/30 | 9.173000 | 9.173000 | 0.000000 | 9.437000 | 9.437000 | 0.000000 | 8.050000 / 8.050000 |
| 414 | 10k/5/intermediate/30 | 9.162000 | 9.162000 | 0.000000 | 9.426000 | 9.426000 | 0.000000 | 8.037000 / 8.037000 |
| 415 | 10k/5/intermediate/30 | 9.345000 | 9.345000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.937000 / 7.937000 |
| 416 | 10k/5/intermediate/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.879000 / 7.879000 |
| 417 | 10k/5/intermediate/60 | 8.634000 | 8.634000 | 0.000000 | 8.975000 | 8.975000 | 0.000000 | 7.979000 / 7.979000 |
| 418 | 10k/5/intermediate/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.079000 / 8.079000 |
| 419 | 10k/5/intermediate/60 | 9.005000 | 9.005000 | 0.000000 | 9.316000 | 9.316000 | 0.000000 | 8.077000 / 8.077000 |
| 420 | 10k/5/advanced/6 | 8.824000 | 8.824000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 7.143000 / 7.143000 |
| 421 | 10k/5/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 422 | 10k/5/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 423 | 10k/5/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 424 | 10k/5/advanced/30 | 8.944000 | 8.944000 | 0.000000 | 9.494000 | 9.494000 | 0.000000 | 8.030000 / 8.030000 |
| 425 | 10k/5/advanced/30 | 9.132000 | 9.132000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.130000 / 8.130000 |
| 426 | 10k/5/advanced/30 | 9.132000 | 9.132000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.130000 / 8.130000 |
| 427 | 10k/5/advanced/30 | 9.132000 | 9.132000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.050000 / 8.050000 |
| 428 | 10k/5/advanced/60 | 8.688000 | 8.688000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.903000 / 7.903000 |
| 429 | 10k/5/advanced/60 | 8.688000 | 8.688000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.103000 / 8.103000 |
| 430 | 10k/5/advanced/60 | 8.688000 | 8.688000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.153000 / 8.153000 |
| 431 | 10k/5/advanced/60 | 8.744000 | 8.744000 | 0.000000 | 9.184000 | 9.184000 | 0.000000 | 8.053000 / 8.053000 |
| 432 | 10k/6/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 433 | 10k/6/beginner/6 | 8.706000 | 8.706000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 7.010000 / 7.010000 |
| 434 | 10k/6/beginner/6 | 8.824000 | 8.824000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 7.143000 / 7.143000 |
| 435 | 10k/6/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 436 | 10k/6/beginner/30 | 8.686000 | 8.686000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.110000 / 8.110000 |
| 437 | 10k/6/beginner/30 | 8.503000 | 8.503000 | 0.000000 | 8.909000 | 8.909000 | 0.000000 | 8.010000 / 8.010000 |
| 438 | 10k/6/beginner/30 | 8.307000 | 8.307000 | 0.000000 | 8.909000 | 8.909000 | 0.000000 | 8.010000 / 8.010000 |
| 439 | 10k/6/beginner/30 | 8.874000 | 8.874000 | 0.000000 | 9.251000 | 9.251000 | 0.000000 | 8.080000 / 8.080000 |
| 440 | 10k/6/beginner/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.795000 / 7.795000 |
| 441 | 10k/6/beginner/60 | 8.828000 | 8.828000 | 0.000000 | 8.978000 | 8.978000 | 0.000000 | 7.760000 / 7.760000 |
| 442 | 10k/6/beginner/60 | 8.828000 | 8.828000 | 0.000000 | 8.978000 | 8.978000 | 0.000000 | 7.743000 / 7.743000 |
| 443 | 10k/6/beginner/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.743000 / 7.743000 |
| 444 | 10k/6/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 445 | 10k/6/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 446 | 10k/6/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 447 | 10k/6/intermediate/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 448 | 10k/6/intermediate/30 | 9.345000 | 9.345000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.250000 / 8.250000 |
| 449 | 10k/6/intermediate/30 | 9.319000 | 9.319000 | 0.000000 | 9.656000 | 9.656000 | 0.000000 | 8.237000 / 8.237000 |
| 450 | 10k/6/intermediate/30 | 9.319000 | 9.319000 | 0.000000 | 9.656000 | 9.656000 | 0.000000 | 8.137000 / 8.137000 |
| 451 | 10k/6/intermediate/30 | 9.485000 | 9.485000 | 0.000000 | 9.841000 | 9.841000 | 0.000000 | 8.167000 / 8.167000 |
| 452 | 10k/6/intermediate/60 | 8.629000 | 8.629000 | 0.000000 | 8.969000 | 8.969000 | 0.000000 | 7.795000 / 7.795000 |
| 453 | 10k/6/intermediate/60 | 8.634000 | 8.634000 | 0.000000 | 8.975000 | 8.975000 | 0.000000 | 7.995000 / 7.995000 |
| 454 | 10k/6/intermediate/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.095000 / 8.095000 |
| 455 | 10k/6/intermediate/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.860000 / 7.860000 |
| 456 | 10k/6/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 457 | 10k/6/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 458 | 10k/6/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 459 | 10k/6/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.110000 / 7.110000 |
| 460 | 10k/6/advanced/30 | 9.132000 | 9.132000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.030000 / 8.030000 |
| 461 | 10k/6/advanced/30 | 9.132000 | 9.132000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.130000 / 8.130000 |
| 462 | 10k/6/advanced/30 | 9.022000 | 9.022000 | 0.000000 | 9.437000 | 9.437000 | 0.000000 | 8.050000 / 8.050000 |
| 463 | 10k/6/advanced/30 | 9.132000 | 9.132000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.030000 / 8.030000 |
| 464 | 10k/6/advanced/60 | 8.688000 | 8.688000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.070000 / 8.070000 |
| 465 | 10k/6/advanced/60 | 8.688000 | 8.688000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.170000 / 8.170000 |
| 466 | 10k/6/advanced/60 | 8.505000 | 8.505000 | 0.000000 | 8.975000 | 8.975000 | 0.000000 | 8.070000 / 8.070000 |
| 467 | 10k/6/advanced/60 | 8.708000 | 8.708000 | 0.000000 | 9.148000 | 9.148000 | 0.000000 | 8.070000 / 8.070000 |
| 468 | 10k/7/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 469 | 10k/7/beginner/6 | 8.790000 | 8.790000 | 0.000000 | 9.557000 | 9.557000 | 0.000000 | 7.143000 / 7.143000 |
| 470 | 10k/7/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 471 | 10k/7/beginner/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 472 | 10k/7/beginner/30 | 8.498000 | 8.498000 | 0.000000 | 8.904000 | 8.904000 | 0.000000 | 8.010000 / 8.010000 |
| 473 | 10k/7/beginner/30 | 8.503000 | 8.503000 | 0.000000 | 8.909000 | 8.909000 | 0.000000 | 8.010000 / 8.010000 |
| 474 | 10k/7/beginner/30 | 8.490000 | 8.490000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.110000 / 8.110000 |
| 475 | 10k/7/beginner/30 | 8.874000 | 8.874000 | 0.000000 | 9.251000 | 9.251000 | 0.000000 | 8.080000 / 8.080000 |
| 476 | 10k/7/beginner/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.762000 / 7.762000 |
| 477 | 10k/7/beginner/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.945000 / 7.945000 |
| 478 | 10k/7/beginner/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.945000 / 7.945000 |
| 479 | 10k/7/beginner/60 | 9.005000 | 9.005000 | 0.000000 | 9.316000 | 9.316000 | 0.000000 | 7.993000 / 7.993000 |
| 480 | 10k/7/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 481 | 10k/7/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 482 | 10k/7/intermediate/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.010000 / 7.010000 |
| 483 | 10k/7/intermediate/6 | 8.824000 | 8.824000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 7.143000 / 7.143000 |
| 484 | 10k/7/intermediate/30 | 9.345000 | 9.345000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.237000 / 8.237000 |
| 485 | 10k/7/intermediate/30 | 9.319000 | 9.319000 | 0.000000 | 9.656000 | 9.656000 | 0.000000 | 8.137000 / 8.137000 |
| 486 | 10k/7/intermediate/30 | 9.319000 | 9.319000 | 0.000000 | 9.656000 | 9.656000 | 0.000000 | 8.137000 / 8.137000 |
| 487 | 10k/7/intermediate/30 | 9.287000 | 9.287000 | 0.000000 | 9.643000 | 9.643000 | 0.000000 | 8.067000 / 8.067000 |
| 488 | 10k/7/intermediate/60 | 8.629000 | 8.629000 | 0.000000 | 8.969000 | 8.969000 | 0.000000 | 7.795000 / 7.795000 |
| 489 | 10k/7/intermediate/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.095000 / 8.095000 |
| 490 | 10k/7/intermediate/60 | 8.828000 | 8.828000 | 0.000000 | 8.978000 | 8.978000 | 0.000000 | 7.860000 / 7.860000 |
| 491 | 10k/7/intermediate/60 | 8.817000 | 8.817000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.843000 / 7.843000 |
| 492 | 10k/7/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 493 | 10k/7/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 494 | 10k/7/advanced/6 | 8.740000 | 8.740000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 7.110000 / 7.110000 |
| 495 | 10k/7/advanced/6 | 8.928000 | 8.928000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 7.010000 / 7.010000 |
| 496 | 10k/7/advanced/30 | 9.132000 | 9.132000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.130000 / 8.130000 |
| 497 | 10k/7/advanced/30 | 9.022000 | 9.022000 | 0.000000 | 9.437000 | 9.437000 | 0.000000 | 8.050000 / 8.050000 |
| 498 | 10k/7/advanced/30 | 9.022000 | 9.022000 | 0.000000 | 9.437000 | 9.437000 | 0.000000 | 8.030000 / 8.030000 |
| 499 | 10k/7/advanced/30 | 9.132000 | 9.132000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.930000 / 7.930000 |
| 500 | 10k/7/advanced/60 | 8.688000 | 8.688000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 7.970000 / 7.970000 |
| 501 | 10k/7/advanced/60 | 8.505000 | 8.505000 | 0.000000 | 8.975000 | 8.975000 | 0.000000 | 8.070000 / 8.070000 |
| 502 | 10k/7/advanced/60 | 8.505000 | 8.505000 | 0.000000 | 8.975000 | 8.975000 | 0.000000 | 8.070000 / 8.070000 |
| 503 | 10k/7/advanced/60 | 8.906000 | 8.906000 | 0.000000 | 9.346000 | 9.346000 | 0.000000 | 8.170000 / 8.170000 |
| 504 | half/1/beginner/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 505 | half/1/beginner/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 506 | half/1/beginner/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 507 | half/1/beginner/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 508 | half/1/beginner/30 | 3.887000 | 3.887000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.657000 / 6.657000 |
| 509 | half/1/beginner/30 | 3.887000 | 3.887000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.507000 / 6.507000 |
| 510 | half/1/beginner/30 | 3.887000 | 3.887000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.507000 / 6.507000 |
| 511 | half/1/beginner/30 | 3.887000 | 3.887000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.657000 / 6.657000 |
| 512 | half/1/beginner/60 | 4.512000 | 4.512000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.643000 / 6.643000 |
| 513 | half/1/beginner/60 | 4.512000 | 4.512000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.493000 / 6.493000 |
| 514 | half/1/beginner/60 | 4.512000 | 4.512000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.493000 / 6.493000 |
| 515 | half/1/beginner/60 | 4.621000 | 4.621000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.643000 / 6.643000 |
| 516 | half/1/intermediate/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 517 | half/1/intermediate/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 518 | half/1/intermediate/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 519 | half/1/intermediate/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 520 | half/1/intermediate/30 | 4.560000 | 4.560000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.677000 / 6.677000 |
| 521 | half/1/intermediate/30 | 4.560000 | 4.560000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.527000 / 6.527000 |
| 522 | half/1/intermediate/30 | 4.560000 | 4.560000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.527000 / 6.527000 |
| 523 | half/1/intermediate/30 | 4.669000 | 4.669000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.677000 / 6.677000 |
| 524 | half/1/intermediate/60 | 4.512000 | 4.512000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.643000 / 6.643000 |
| 525 | half/1/intermediate/60 | 4.512000 | 4.512000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.493000 / 6.493000 |
| 526 | half/1/intermediate/60 | 4.512000 | 4.512000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.493000 / 6.493000 |
| 527 | half/1/intermediate/60 | 4.512000 | 4.512000 | 0.000000 | 8.973000 | 8.973000 | 0.000000 | 6.643000 / 6.643000 |
| 528 | half/1/advanced/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 529 | half/1/advanced/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 530 | half/1/advanced/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 531 | half/1/advanced/6 | 3.482000 | 3.482000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 532 | half/1/advanced/30 | 4.560000 | 4.560000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.677000 / 6.677000 |
| 533 | half/1/advanced/30 | 4.560000 | 4.560000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.527000 / 6.527000 |
| 534 | half/1/advanced/30 | 4.560000 | 4.560000 | 0.000000 | 9.098000 | 9.098000 | 0.000000 | 6.527000 / 6.527000 |
| 535 | half/1/advanced/30 | 4.669000 | 4.669000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.677000 / 6.677000 |
| 536 | half/1/advanced/60 | 4.522000 | 4.522000 | 0.000000 | 9.004000 | 9.004000 | 0.000000 | 6.650000 / 6.650000 |
| 537 | half/1/advanced/60 | 4.522000 | 4.522000 | 0.000000 | 9.004000 | 9.004000 | 0.000000 | 6.500000 / 6.500000 |
| 538 | half/1/advanced/60 | 4.522000 | 4.522000 | 0.000000 | 9.004000 | 9.004000 | 0.000000 | 6.500000 / 6.500000 |
| 539 | half/1/advanced/60 | 4.522000 | 4.522000 | 0.000000 | 9.004000 | 9.004000 | 0.000000 | 6.650000 / 6.650000 |
| 540 | half/2/beginner/6 | 6.994000 | 6.994000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.210000 / 7.210000 |
| 541 | half/2/beginner/6 | 6.994000 | 6.994000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.210000 / 7.210000 |
| 542 | half/2/beginner/6 | 6.994000 | 6.994000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.210000 / 7.210000 |
| 543 | half/2/beginner/6 | 7.147000 | 7.147000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.210000 / 7.210000 |
| 544 | half/2/beginner/30 | 6.947000 | 6.947000 | 0.000000 | 9.233000 | 9.233000 | 0.000000 | 7.796000 / 7.796000 |
| 545 | half/2/beginner/30 | 6.720000 | 6.720000 | 0.000000 | 8.940000 | 8.940000 | 0.000000 | 7.796000 / 7.796000 |
| 546 | half/2/beginner/30 | 6.579000 | 6.579000 | 0.000000 | 8.783000 | 8.783000 | 0.000000 | 7.760000 / 7.760000 |
| 547 | half/2/beginner/30 | 6.811000 | 6.811000 | 0.000000 | 9.067000 | 9.067000 | 0.000000 | 7.916000 / 7.916000 |
| 548 | half/2/beginner/60 | 6.686000 | 6.686000 | 0.000000 | 9.592000 | 9.592000 | 0.000000 | 7.816000 / 7.816000 |
| 549 | half/2/beginner/60 | 6.323000 | 6.323000 | 0.000000 | 9.486000 | 9.486000 | 0.000000 | 7.816000 / 7.816000 |
| 550 | half/2/beginner/60 | 6.664000 | 6.664000 | 0.000000 | 9.575000 | 9.575000 | 0.000000 | 7.710000 / 7.710000 |
| 551 | half/2/beginner/60 | 6.791000 | 6.791000 | 0.000000 | 9.762000 | 9.762000 | 0.000000 | 7.710000 / 7.710000 |
| 552 | half/2/intermediate/6 | 6.994000 | 6.994000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.210000 / 7.210000 |
| 553 | half/2/intermediate/6 | 6.994000 | 6.994000 | 0.000000 | 9.623000 | 9.623000 | 0.000000 | 7.243000 / 7.243000 |
| 554 | half/2/intermediate/6 | 6.994000 | 6.994000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.210000 / 7.210000 |
| 555 | half/2/intermediate/6 | 6.994000 | 6.994000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.210000 / 7.210000 |
| 556 | half/2/intermediate/30 | 7.170000 | 7.170000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.990000 / 7.990000 |
| 557 | half/2/intermediate/30 | 6.802000 | 6.802000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.876000 / 7.876000 |
| 558 | half/2/intermediate/30 | 6.802000 | 6.802000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.876000 / 7.876000 |
| 559 | half/2/intermediate/30 | 6.929000 | 6.929000 | 0.000000 | 9.870000 | 9.870000 | 0.000000 | 7.876000 / 7.876000 |
| 560 | half/2/intermediate/60 | 6.511000 | 6.511000 | 0.000000 | 9.381000 | 9.381000 | 0.000000 | 7.946000 / 7.946000 |
| 561 | half/2/intermediate/60 | 6.323000 | 6.323000 | 0.000000 | 9.486000 | 9.486000 | 0.000000 | 7.916000 / 7.916000 |
| 562 | half/2/intermediate/60 | 6.323000 | 6.323000 | 0.000000 | 9.486000 | 9.486000 | 0.000000 | 7.916000 / 7.916000 |
| 563 | half/2/intermediate/60 | 6.515000 | 6.515000 | 0.000000 | 9.780000 | 9.780000 | 0.000000 | 7.916000 / 7.916000 |
| 564 | half/2/advanced/6 | 6.994000 | 6.994000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.210000 / 7.210000 |
| 565 | half/2/advanced/6 | 6.994000 | 6.994000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.210000 / 7.210000 |
| 566 | half/2/advanced/6 | 6.994000 | 6.994000 | 0.000000 | 9.605000 | 9.605000 | 0.000000 | 7.210000 / 7.210000 |
| 567 | half/2/advanced/6 | 6.994000 | 6.994000 | 0.000000 | 9.623000 | 9.623000 | 0.000000 | 7.243000 / 7.243000 |
| 568 | half/2/advanced/30 | 6.895000 | 6.895000 | 0.000000 | 9.273000 | 9.273000 | 0.000000 | 7.996000 / 7.996000 |
| 569 | half/2/advanced/30 | 6.407000 | 6.407000 | 0.000000 | 9.093000 | 9.093000 | 0.000000 | 7.996000 / 7.996000 |
| 570 | half/2/advanced/30 | 6.407000 | 6.407000 | 0.000000 | 9.093000 | 9.093000 | 0.000000 | 7.996000 / 7.996000 |
| 571 | half/2/advanced/30 | 6.737000 | 6.737000 | 0.000000 | 9.554000 | 9.554000 | 0.000000 | 7.883000 / 7.883000 |
| 572 | half/2/advanced/60 | 6.772000 | 6.772000 | 0.000000 | 9.225000 | 9.225000 | 0.000000 | 7.816000 / 7.816000 |
| 573 | half/2/advanced/60 | 6.283000 | 6.283000 | 0.000000 | 9.043000 | 9.043000 | 0.000000 | 7.816000 / 7.816000 |
| 574 | half/2/advanced/60 | 6.120000 | 6.120000 | 0.000000 | 8.838000 | 8.838000 | 0.000000 | 7.800000 / 7.800000 |
| 575 | half/2/advanced/60 | 6.265000 | 6.265000 | 0.000000 | 9.013000 | 9.013000 | 0.000000 | 7.926000 / 7.926000 |
| 576 | half/3/beginner/6 | 7.169000 | 7.169000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.881000 / 6.881000 |
| 577 | half/3/beginner/6 | 7.167000 | 7.167000 | 0.000000 | 9.526000 | 9.526000 | 0.000000 | 6.881000 / 6.881000 |
| 578 | half/3/beginner/6 | 7.169000 | 7.169000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.881000 / 6.881000 |
| 579 | half/3/beginner/6 | 7.328000 | 7.328000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.581000 / 6.581000 |
| 580 | half/3/beginner/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.903000 / 7.903000 |
| 581 | half/3/beginner/30 | 8.877000 | 8.877000 | 0.000000 | 9.434000 | 9.434000 | 0.000000 | 8.210000 / 8.210000 |
| 582 | half/3/beginner/30 | 8.814000 | 8.814000 | 0.000000 | 9.371000 | 9.371000 | 0.000000 | 8.203000 / 8.203000 |
| 583 | half/3/beginner/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.203000 / 8.203000 |
| 584 | half/3/beginner/60 | 7.914000 | 7.914000 | 0.000000 | 9.406000 | 9.406000 | 0.000000 | 7.793000 / 7.793000 |
| 587 | half/3/beginner/60 | 8.209000 | 8.209000 | 0.000000 | 9.705000 | 9.705000 | 0.000000 | 7.993000 / 7.993000 |
| 588 | half/3/intermediate/6 | 7.240000 | 7.240000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.914000 / 6.914000 |
| 589 | half/3/intermediate/6 | 7.167000 | 7.167000 | 0.000000 | 9.526000 | 9.526000 | 0.000000 | 6.881000 / 6.881000 |
| 590 | half/3/intermediate/6 | 7.169000 | 7.169000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.881000 / 6.881000 |
| 591 | half/3/intermediate/6 | 7.328000 | 7.328000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.681000 / 6.681000 |
| 592 | half/3/intermediate/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.973000 / 7.973000 |
| 593 | half/3/intermediate/30 | 9.135000 | 9.135000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.167000 / 8.167000 |
| 594 | half/3/intermediate/30 | 9.135000 | 9.135000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.167000 / 8.167000 |
| 595 | half/3/intermediate/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.280000 / 8.280000 |
| 596 | half/3/intermediate/60 | 7.985000 | 7.985000 | 0.000000 | 9.594000 | 9.594000 | 0.000000 | 7.993000 / 7.993000 |
| 599 | half/3/intermediate/60 | 8.115000 | 8.115000 | 0.000000 | 9.507000 | 9.507000 | 0.000000 | 8.093000 / 8.093000 |
| 600 | half/3/advanced/6 | 7.169000 | 7.169000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.781000 / 6.781000 |
| 601 | half/3/advanced/6 | 7.167000 | 7.167000 | 0.000000 | 9.526000 | 9.526000 | 0.000000 | 6.781000 / 6.781000 |
| 602 | half/3/advanced/6 | 7.240000 | 7.240000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.914000 / 6.914000 |
| 603 | half/3/advanced/6 | 7.169000 | 7.169000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.681000 / 6.681000 |
| 604 | half/3/advanced/30 | 8.284000 | 8.284000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.110000 / 8.110000 |
| 605 | half/3/advanced/30 | 8.308000 | 8.308000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.210000 / 8.210000 |
| 606 | half/3/advanced/30 | 8.308000 | 8.308000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.210000 / 8.210000 |
| 608 | half/3/advanced/60 | 7.357000 | 7.357000 | 0.000000 | 9.435000 | 9.435000 | 0.000000 | 7.930000 / 7.930000 |
| 609 | half/3/advanced/60 | 7.178000 | 7.178000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.110000 / 8.110000 |
| 610 | half/3/advanced/60 | 7.174000 | 7.174000 | 0.000000 | 9.173000 | 9.173000 | 0.000000 | 8.080000 / 8.080000 |
| 611 | half/3/advanced/60 | 7.357000 | 7.357000 | 0.000000 | 9.435000 | 9.435000 | 0.000000 | 8.230000 / 8.230000 |
| 612 | half/4/beginner/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.824000 / 6.824000 |
| 613 | half/4/beginner/6 | 6.723000 | 6.723000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.824000 / 6.824000 |
| 614 | half/4/beginner/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.724000 / 6.724000 |
| 615 | half/4/beginner/6 | 6.900000 | 6.900000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.724000 / 6.724000 |
| 616 | half/4/beginner/30 | 9.532000 | 9.532000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.010000 / 8.010000 |
| 624 | half/4/intermediate/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.824000 / 6.824000 |
| 625 | half/4/intermediate/6 | 6.723000 | 6.723000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.824000 / 6.824000 |
| 626 | half/4/intermediate/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.824000 / 6.824000 |
| 627 | half/4/intermediate/6 | 6.900000 | 6.900000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.824000 / 6.824000 |
| 628 | half/4/intermediate/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.973000 / 7.973000 |
| 629 | half/4/intermediate/30 | 9.135000 | 9.135000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.173000 / 8.173000 |
| 631 | half/4/intermediate/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.273000 / 8.273000 |
| 636 | half/4/advanced/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.724000 / 6.724000 |
| 637 | half/4/advanced/6 | 6.790000 | 6.790000 | 0.000000 | 9.557000 | 9.557000 | 0.000000 | 6.857000 / 6.857000 |
| 638 | half/4/advanced/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.824000 / 6.824000 |
| 639 | half/4/advanced/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.824000 / 6.824000 |
| 640 | half/4/advanced/30 | 8.025000 | 8.025000 | 0.000000 | 9.494000 | 9.494000 | 0.000000 | 7.890000 / 7.890000 |
| 641 | half/4/advanced/30 | 8.221000 | 8.221000 | 0.000000 | 9.500000 | 9.500000 | 0.000000 | 8.090000 / 8.090000 |
| 648 | half/5/beginner/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.824000 / 6.824000 |
| 649 | half/5/beginner/6 | 6.723000 | 6.723000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.724000 / 6.724000 |
| 650 | half/5/beginner/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.724000 / 6.724000 |
| 651 | half/5/beginner/6 | 6.817000 | 6.817000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.857000 / 6.857000 |
| 656 | half/5/beginner/60 | 7.095000 | 7.095000 | 0.000000 | 9.332000 | 9.332000 | 0.000000 | 7.857000 / 7.857000 |
| 657 | half/5/beginner/60 | 6.936000 | 6.936000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.057000 / 8.057000 |
| 658 | half/5/beginner/60 | 6.903000 | 6.903000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.030000 / 8.030000 |
| 659 | half/5/beginner/60 | 7.095000 | 7.095000 | 0.000000 | 9.332000 | 9.332000 | 0.000000 | 8.157000 / 8.157000 |
| 660 | half/5/intermediate/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.767000 / 6.767000 |
| 661 | half/5/intermediate/6 | 6.289000 | 6.289000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.767000 / 6.767000 |
| 662 | half/5/intermediate/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.767000 / 6.767000 |
| 663 | half/5/intermediate/6 | 6.457000 | 6.457000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.667000 / 6.667000 |
| 664 | half/5/intermediate/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.960000 / 7.960000 |
| 665 | half/5/intermediate/30 | 9.059000 | 9.059000 | 0.000000 | 9.617000 | 9.617000 | 0.000000 | 8.280000 / 8.280000 |
| 666 | half/5/intermediate/30 | 9.059000 | 9.059000 | 0.000000 | 9.617000 | 9.617000 | 0.000000 | 8.260000 / 8.260000 |
| 667 | half/5/intermediate/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.160000 / 8.160000 |
| 668 | half/5/intermediate/60 | 7.077000 | 7.077000 | 0.000000 | 9.144000 | 9.144000 | 0.000000 | 7.857000 / 7.857000 |
| 669 | half/5/intermediate/60 | 6.917000 | 6.917000 | 0.000000 | 8.975000 | 8.975000 | 0.000000 | 8.057000 / 8.057000 |
| 670 | half/5/intermediate/60 | 6.936000 | 6.936000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.157000 / 8.157000 |
| 671 | half/5/intermediate/60 | 7.114000 | 7.114000 | 0.000000 | 9.504000 | 9.504000 | 0.000000 | 8.157000 / 8.157000 |
| 672 | half/5/advanced/6 | 6.378000 | 6.378000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.800000 / 6.800000 |
| 673 | half/5/advanced/6 | 6.289000 | 6.289000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.767000 / 6.767000 |
| 674 | half/5/advanced/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.767000 / 6.767000 |
| 675 | half/5/advanced/6 | 6.457000 | 6.457000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.767000 / 6.767000 |
| 676 | half/5/advanced/30 | 8.025000 | 8.025000 | 0.000000 | 9.494000 | 9.494000 | 0.000000 | 7.890000 / 7.890000 |
| 677 | half/5/advanced/30 | 8.308000 | 8.308000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.190000 / 8.190000 |
| 678 | half/5/advanced/30 | 8.308000 | 8.308000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.190000 / 8.190000 |
| 679 | half/5/advanced/30 | 8.096000 | 8.096000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.310000 / 8.310000 |
| 680 | half/5/advanced/60 | 7.278000 | 7.278000 | 0.000000 | 9.516000 | 9.516000 | 0.000000 | 8.097000 / 8.097000 |
| 684 | half/6/beginner/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.724000 / 6.724000 |
| 685 | half/6/beginner/6 | 6.723000 | 6.723000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.724000 / 6.724000 |
| 686 | half/6/beginner/6 | 6.817000 | 6.817000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.857000 / 6.857000 |
| 687 | half/6/beginner/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.824000 / 6.824000 |
| 692 | half/6/beginner/60 | 7.009000 | 7.009000 | 0.000000 | 9.246000 | 9.246000 | 0.000000 | 7.873000 / 7.873000 |
| 693 | half/6/beginner/60 | 6.903000 | 6.903000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.027000 / 8.027000 |
| 694 | half/6/beginner/60 | 6.903000 | 6.903000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.023000 / 8.023000 |
| 695 | half/6/beginner/60 | 7.009000 | 7.009000 | 0.000000 | 9.246000 | 9.246000 | 0.000000 | 8.173000 / 8.173000 |
| 696 | half/6/intermediate/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.767000 / 6.767000 |
| 697 | half/6/intermediate/6 | 6.289000 | 6.289000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.767000 / 6.767000 |
| 698 | half/6/intermediate/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.667000 / 6.667000 |
| 699 | half/6/intermediate/6 | 6.457000 | 6.457000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.667000 / 6.667000 |
| 700 | half/6/intermediate/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.080000 / 8.080000 |
| 701 | half/6/intermediate/30 | 9.135000 | 9.135000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.260000 / 8.260000 |
| 702 | half/6/intermediate/30 | 9.135000 | 9.135000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.160000 / 8.160000 |
| 703 | half/6/intermediate/30 | 9.290000 | 9.290000 | 0.000000 | 9.870000 | 9.870000 | 0.000000 | 8.160000 / 8.160000 |
| 704 | half/6/intermediate/60 | 6.991000 | 6.991000 | 0.000000 | 9.058000 | 9.058000 | 0.000000 | 7.873000 / 7.873000 |
| 705 | half/6/intermediate/60 | 6.917000 | 6.917000 | 0.000000 | 8.975000 | 8.975000 | 0.000000 | 8.073000 / 8.073000 |
| 706 | half/6/intermediate/60 | 6.936000 | 6.936000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.173000 / 8.173000 |
| 707 | half/6/intermediate/60 | 7.041000 | 7.041000 | 0.000000 | 9.278000 | 9.278000 | 0.000000 | 8.277000 / 8.277000 |
| 708 | half/6/advanced/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.767000 / 6.767000 |
| 709 | half/6/advanced/6 | 6.289000 | 6.289000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.767000 / 6.767000 |
| 710 | half/6/advanced/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.767000 / 6.767000 |
| 711 | half/6/advanced/6 | 6.457000 | 6.457000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.767000 / 6.767000 |
| 712 | half/6/advanced/30 | 8.789000 | 8.789000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.890000 / 7.890000 |
| 713 | half/6/advanced/30 | 8.806000 | 8.806000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.190000 / 8.190000 |
| 714 | half/6/advanced/30 | 9.121000 | 9.121000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.110000 / 8.110000 |
| 715 | half/6/advanced/30 | 8.789000 | 8.789000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.290000 / 8.290000 |
| 716 | half/6/advanced/60 | 7.330000 | 7.330000 | 0.000000 | 9.568000 | 9.568000 | 0.000000 | 8.007000 / 8.007000 |
| 720 | half/7/beginner/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.724000 / 6.724000 |
| 721 | half/7/beginner/6 | 6.790000 | 6.790000 | 0.000000 | 9.557000 | 9.557000 | 0.000000 | 6.857000 / 6.857000 |
| 722 | half/7/beginner/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.824000 / 6.824000 |
| 723 | half/7/beginner/6 | 6.750000 | 6.750000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.824000 / 6.824000 |
| 728 | half/7/beginner/60 | 7.041000 | 7.041000 | 0.000000 | 9.278000 | 9.278000 | 0.000000 | 7.977000 / 7.977000 |
| 729 | half/7/beginner/60 | 6.936000 | 6.936000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.023000 / 8.023000 |
| 730 | half/7/beginner/60 | 6.936000 | 6.936000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.023000 / 8.023000 |
| 731 | half/7/beginner/60 | 7.023000 | 7.023000 | 0.000000 | 9.236000 | 9.236000 | 0.000000 | 7.973000 / 7.973000 |
| 732 | half/7/intermediate/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.767000 / 6.767000 |
| 733 | half/7/intermediate/6 | 6.289000 | 6.289000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.667000 / 6.667000 |
| 734 | half/7/intermediate/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.667000 / 6.667000 |
| 735 | half/7/intermediate/6 | 6.378000 | 6.378000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.800000 / 6.800000 |
| 736 | half/7/intermediate/30 | 9.125000 | 9.125000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.060000 / 8.060000 |
| 737 | half/7/intermediate/30 | 9.135000 | 9.135000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.160000 / 8.160000 |
| 738 | half/7/intermediate/30 | 9.135000 | 9.135000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.160000 / 8.160000 |
| 739 | half/7/intermediate/30 | 9.127000 | 9.127000 | 0.000000 | 9.672000 | 9.672000 | 0.000000 | 8.060000 / 8.060000 |
| 740 | half/7/intermediate/60 | 6.991000 | 6.991000 | 0.000000 | 9.058000 | 9.058000 | 0.000000 | 7.873000 / 7.873000 |
| 741 | half/7/intermediate/60 | 6.936000 | 6.936000 | 0.000000 | 9.158000 | 9.158000 | 0.000000 | 8.173000 / 8.173000 |
| 742 | half/7/intermediate/60 | 6.903000 | 6.903000 | 0.000000 | 9.092000 | 9.092000 | 0.000000 | 8.127000 / 8.127000 |
| 743 | half/7/intermediate/60 | 7.009000 | 7.009000 | 0.000000 | 9.246000 | 9.246000 | 0.000000 | 8.273000 / 8.273000 |
| 744 | half/7/advanced/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.767000 / 6.767000 |
| 745 | half/7/advanced/6 | 6.289000 | 6.289000 | 0.000000 | 9.495000 | 9.495000 | 0.000000 | 6.767000 / 6.767000 |
| 746 | half/7/advanced/6 | 6.315000 | 6.315000 | 0.000000 | 9.529000 | 9.529000 | 0.000000 | 6.767000 / 6.767000 |
| 747 | half/7/advanced/6 | 6.457000 | 6.457000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.667000 / 6.667000 |
| 748 | half/7/advanced/30 | 8.789000 | 8.789000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 7.990000 / 7.990000 |
| 749 | half/7/advanced/30 | 9.121000 | 9.121000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.310000 / 8.310000 |
| 750 | half/7/advanced/30 | 9.121000 | 9.121000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.090000 / 8.090000 |
| 751 | half/7/advanced/30 | 8.789000 | 8.789000 | 0.000000 | 9.683000 | 9.683000 | 0.000000 | 8.190000 / 8.190000 |
| 752 | half/7/advanced/60 | 7.312000 | 7.312000 | 0.000000 | 9.379000 | 9.379000 | 0.000000 | 7.907000 / 7.907000 |
| 756 | marathon/1/beginner/6 | 2.794000 | 2.794000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 757 | marathon/1/beginner/6 | 2.794000 | 2.794000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 758 | marathon/1/beginner/6 | 2.795000 | 2.795000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 759 | marathon/1/beginner/6 | 2.795000 | 2.795000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 760 | marathon/1/beginner/30 | 3.192000 | 3.192000 | 0.000000 | 9.222000 | 9.222000 | 0.000000 | 6.657000 / 6.657000 |
| 761 | marathon/1/beginner/30 | 3.192000 | 3.192000 | 0.000000 | 9.222000 | 9.222000 | 0.000000 | 6.507000 / 6.507000 |
| 762 | marathon/1/beginner/30 | 3.141000 | 3.141000 | 0.000000 | 9.097000 | 9.097000 | 0.000000 | 6.507000 / 6.507000 |
| 763 | marathon/1/beginner/30 | 3.192000 | 3.192000 | 0.000000 | 9.222000 | 9.222000 | 0.000000 | 6.657000 / 6.657000 |
| 764 | marathon/1/beginner/60 | 3.825000 | 3.825000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.643000 / 6.643000 |
| 765 | marathon/1/beginner/60 | 3.825000 | 3.825000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.493000 / 6.493000 |
| 766 | marathon/1/beginner/60 | 3.765000 | 3.765000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.493000 / 6.493000 |
| 767 | marathon/1/beginner/60 | 3.765000 | 3.765000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.643000 / 6.643000 |
| 768 | marathon/1/intermediate/6 | 2.794000 | 2.794000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 769 | marathon/1/intermediate/6 | 2.794000 | 2.794000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 770 | marathon/1/intermediate/6 | 2.794000 | 2.794000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 771 | marathon/1/intermediate/6 | 2.794000 | 2.794000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 772 | marathon/1/intermediate/30 | 3.865000 | 3.865000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.677000 / 6.677000 |
| 773 | marathon/1/intermediate/30 | 3.865000 | 3.865000 | 0.000000 | 9.285000 | 9.285000 | 0.000000 | 6.527000 / 6.527000 |
| 774 | marathon/1/intermediate/30 | 3.805000 | 3.805000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.527000 / 6.527000 |
| 775 | marathon/1/intermediate/30 | 3.805000 | 3.805000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.677000 / 6.677000 |
| 776 | marathon/1/intermediate/60 | 3.825000 | 3.825000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.643000 / 6.643000 |
| 777 | marathon/1/intermediate/60 | 3.751000 | 3.751000 | 0.000000 | 9.010000 | 9.010000 | 0.000000 | 6.493000 / 6.493000 |
| 778 | marathon/1/intermediate/60 | 3.752000 | 3.752000 | 0.000000 | 9.010000 | 9.010000 | 0.000000 | 6.493000 / 6.493000 |
| 779 | marathon/1/intermediate/60 | 3.825000 | 3.825000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.643000 / 6.643000 |
| 780 | marathon/1/advanced/6 | 2.794000 | 2.794000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 781 | marathon/1/advanced/6 | 2.794000 | 2.794000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 782 | marathon/1/advanced/6 | 2.795000 | 2.795000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 783 | marathon/1/advanced/6 | 2.795000 | 2.795000 | 0.000000 | 8.745000 | 8.745000 | 0.000000 | 6.210000 / 6.210000 |
| 784 | marathon/1/advanced/30 | 3.792000 | 3.792000 | 0.000000 | 9.135000 | 9.135000 | 0.000000 | 6.527000 / 6.527000 |
| 785 | marathon/1/advanced/30 | 3.792000 | 3.792000 | 0.000000 | 9.135000 | 9.135000 | 0.000000 | 6.527000 / 6.527000 |
| 786 | marathon/1/advanced/30 | 3.744000 | 3.744000 | 0.000000 | 9.035000 | 9.035000 | 0.000000 | 6.527000 / 6.527000 |
| 787 | marathon/1/advanced/30 | 3.805000 | 3.805000 | 0.000000 | 9.160000 | 9.160000 | 0.000000 | 6.527000 / 6.527000 |
| 788 | marathon/1/advanced/60 | 3.857000 | 3.857000 | 0.000000 | 9.041000 | 9.041000 | 0.000000 | 6.500000 / 6.500000 |
| 789 | marathon/1/advanced/60 | 3.857000 | 3.857000 | 0.000000 | 9.041000 | 9.041000 | 0.000000 | 6.500000 / 6.500000 |
| 790 | marathon/1/advanced/60 | 3.808000 | 3.808000 | 0.000000 | 8.942000 | 8.942000 | 0.000000 | 6.500000 / 6.500000 |
| 791 | marathon/1/advanced/60 | 3.857000 | 3.857000 | 0.000000 | 9.041000 | 9.041000 | 0.000000 | 6.500000 / 6.500000 |
| 792 | marathon/2/beginner/6 | 6.001000 | 6.001000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.177000 / 7.177000 |
| 793 | marathon/2/beginner/6 | 5.914000 | 5.914000 | 0.000000 | 9.668000 | 9.668000 | 0.000000 | 7.177000 / 7.177000 |
| 794 | marathon/2/beginner/6 | 5.914000 | 5.914000 | 0.000000 | 9.668000 | 9.668000 | 0.000000 | 7.177000 / 7.177000 |
| 795 | marathon/2/beginner/6 | 5.914000 | 5.914000 | 0.000000 | 9.668000 | 9.668000 | 0.000000 | 7.177000 / 7.177000 |
| 796 | marathon/2/beginner/30 | 5.300000 | 5.300000 | 0.000000 | 9.600000 | 9.600000 | 0.000000 | 7.070000 / 7.070000 |
| 797 | marathon/2/beginner/30 | 5.034000 | 5.034000 | 0.000000 | 9.222000 | 9.222000 | 0.000000 | 7.070000 / 7.070000 |
| 798 | marathon/2/beginner/30 | 5.015000 | 5.015000 | 0.000000 | 9.198000 | 9.198000 | 0.000000 | 7.177000 / 7.177000 |
| 799 | marathon/2/beginner/30 | 5.300000 | 5.300000 | 0.000000 | 9.600000 | 9.600000 | 0.000000 | 7.183000 / 7.183000 |
| 800 | marathon/2/beginner/60 | 4.864000 | 4.864000 | 0.000000 | 9.075000 | 9.075000 | 0.000000 | 7.123000 / 7.123000 |
| 801 | marathon/2/beginner/60 | 4.776000 | 4.776000 | 0.000000 | 8.950000 | 8.950000 | 0.000000 | 6.973000 / 6.973000 |
| 802 | marathon/2/beginner/60 | 4.773000 | 4.773000 | 0.000000 | 8.957000 | 8.957000 | 0.000000 | 6.997000 / 6.997000 |
| 803 | marathon/2/beginner/60 | 5.100000 | 5.100000 | 0.000000 | 9.419000 | 9.419000 | 0.000000 | 6.997000 / 6.997000 |
| 804 | marathon/2/intermediate/6 | 6.001000 | 6.001000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.177000 / 7.177000 |
| 805 | marathon/2/intermediate/6 | 5.895000 | 5.895000 | 0.000000 | 9.660000 | 9.660000 | 0.000000 | 7.210000 / 7.210000 |
| 806 | marathon/2/intermediate/6 | 5.895000 | 5.895000 | 0.000000 | 9.643000 | 9.643000 | 0.000000 | 7.177000 / 7.177000 |
| 807 | marathon/2/intermediate/6 | 6.001000 | 6.001000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.177000 / 7.177000 |
| 808 | marathon/2/intermediate/30 | 5.300000 | 5.300000 | 0.000000 | 9.600000 | 9.600000 | 0.000000 | 7.183000 / 7.183000 |
| 809 | marathon/2/intermediate/30 | 5.031000 | 5.031000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.070000 / 7.070000 |
| 810 | marathon/2/intermediate/30 | 5.031000 | 5.031000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.070000 / 7.070000 |
| 811 | marathon/2/intermediate/30 | 5.212000 | 5.212000 | 0.000000 | 9.475000 | 9.475000 | 0.000000 | 7.070000 / 7.070000 |
| 812 | marathon/2/intermediate/60 | 4.864000 | 4.864000 | 0.000000 | 9.075000 | 9.075000 | 0.000000 | 7.123000 / 7.123000 |
| 813 | marathon/2/intermediate/60 | 4.776000 | 4.776000 | 0.000000 | 8.950000 | 8.950000 | 0.000000 | 6.973000 / 6.973000 |
| 814 | marathon/2/intermediate/60 | 4.776000 | 4.776000 | 0.000000 | 8.950000 | 8.950000 | 0.000000 | 6.973000 / 6.973000 |
| 815 | marathon/2/intermediate/60 | 4.776000 | 4.776000 | 0.000000 | 8.950000 | 8.950000 | 0.000000 | 7.123000 / 7.123000 |
| 816 | marathon/2/advanced/6 | 6.001000 | 6.001000 | 0.000000 | 9.793000 | 9.793000 | 0.000000 | 7.177000 / 7.177000 |
| 817 | marathon/2/advanced/6 | 5.914000 | 5.914000 | 0.000000 | 9.668000 | 9.668000 | 0.000000 | 7.177000 / 7.177000 |
| 818 | marathon/2/advanced/6 | 5.914000 | 5.914000 | 0.000000 | 9.668000 | 9.668000 | 0.000000 | 7.177000 / 7.177000 |
| 819 | marathon/2/advanced/6 | 6.001000 | 6.001000 | 0.000000 | 9.810000 | 9.810000 | 0.000000 | 7.210000 / 7.210000 |
| 820 | marathon/2/advanced/30 | 4.937000 | 4.937000 | 0.000000 | 9.087000 | 9.087000 | 0.000000 | 7.183000 / 7.183000 |
| 821 | marathon/2/advanced/30 | 4.753000 | 4.753000 | 0.000000 | 8.825000 | 8.825000 | 0.000000 | 7.033000 / 7.033000 |
| 822 | marathon/2/advanced/30 | 4.753000 | 4.753000 | 0.000000 | 8.825000 | 8.825000 | 0.000000 | 7.033000 / 7.033000 |
| 823 | marathon/2/advanced/30 | 5.031000 | 5.031000 | 0.000000 | 9.219000 | 9.219000 | 0.000000 | 7.070000 / 7.070000 |
| 824 | marathon/2/advanced/60 | 4.716000 | 4.716000 | 0.000000 | 8.878000 | 8.878000 | 0.000000 | 7.000000 / 7.000000 |
| 825 | marathon/2/advanced/60 | 4.647000 | 4.647000 | 0.000000 | 8.778000 | 8.778000 | 0.000000 | 6.850000 / 6.850000 |
| 826 | marathon/2/advanced/60 | 4.758000 | 4.758000 | 0.000000 | 8.925000 | 8.925000 | 0.000000 | 6.973000 / 6.973000 |
| 827 | marathon/2/advanced/60 | 4.758000 | 4.758000 | 0.000000 | 8.925000 | 8.925000 | 0.000000 | 6.973000 / 6.973000 |
| 828 | marathon/3/beginner/6 | 5.994000 | 5.994000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.710000 / 6.710000 |
| 829 | marathon/3/beginner/6 | 5.906000 | 5.906000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.710000 / 6.710000 |
| 830 | marathon/3/beginner/6 | 5.906000 | 5.906000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.710000 / 6.710000 |
| 831 | marathon/3/beginner/6 | 5.906000 | 5.906000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.410000 / 6.410000 |
| 834 | marathon/3/beginner/30 | 7.063000 | 7.063000 | 0.000000 | 9.002000 | 9.002000 | 0.000000 | 7.734000 / 7.734000 |
| 840 | marathon/3/intermediate/6 | 6.054000 | 6.054000 | 0.000000 | 9.779000 | 9.779000 | 0.000000 | 6.743000 / 6.743000 |
| 841 | marathon/3/intermediate/6 | 5.906000 | 5.906000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.710000 / 6.710000 |
| 842 | marathon/3/intermediate/6 | 5.906000 | 5.906000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.710000 / 6.710000 |
| 843 | marathon/3/intermediate/6 | 5.906000 | 5.906000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.510000 / 6.510000 |
| 846 | marathon/3/intermediate/30 | 7.491000 | 7.491000 | 0.000000 | 9.308000 | 9.308000 | 0.000000 | 7.764000 / 7.814000 |
| 852 | marathon/3/advanced/6 | 5.994000 | 5.994000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.610000 / 6.610000 |
| 853 | marathon/3/advanced/6 | 5.906000 | 5.906000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.610000 / 6.610000 |
| 854 | marathon/3/advanced/6 | 5.948000 | 5.948000 | 0.000000 | 9.629000 | 9.629000 | 0.000000 | 6.743000 / 6.743000 |
| 855 | marathon/3/advanced/6 | 5.994000 | 5.994000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.510000 / 6.510000 |
| 860 | marathon/3/advanced/60 | 7.263000 | 7.263000 | 0.000000 | 9.025000 | 9.025000 | 0.000000 | 7.903000 / 7.903000 |
| 861 | marathon/3/advanced/60 | 7.184000 | 7.184000 | 0.000000 | 8.916000 | 8.916000 | 0.000000 | 7.890000 / 7.890000 |
| 862 | marathon/3/advanced/60 | 7.126000 | 7.126000 | 0.000000 | 8.866000 | 8.866000 | 0.000000 | 7.853000 / 7.853000 |
| 864 | marathon/4/beginner/6 | 5.754000 | 5.754000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.681000 / 6.681000 |
| 865 | marathon/4/beginner/6 | 5.669000 | 5.669000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.681000 / 6.681000 |
| 866 | marathon/4/beginner/6 | 5.669000 | 5.669000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.581000 / 6.581000 |
| 867 | marathon/4/beginner/6 | 5.669000 | 5.669000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.581000 / 6.581000 |
| 876 | marathon/4/intermediate/6 | 5.754000 | 5.754000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.681000 / 6.681000 |
| 877 | marathon/4/intermediate/6 | 5.669000 | 5.669000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.681000 / 6.681000 |
| 878 | marathon/4/intermediate/6 | 5.669000 | 5.669000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.681000 / 6.681000 |
| 879 | marathon/4/intermediate/6 | 5.669000 | 5.669000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.681000 / 6.681000 |
| 888 | marathon/4/advanced/6 | 5.754000 | 5.754000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.581000 / 6.581000 |
| 889 | marathon/4/advanced/6 | 5.709000 | 5.709000 | 0.000000 | 9.629000 | 9.629000 | 0.000000 | 6.714000 / 6.714000 |
| 890 | marathon/4/advanced/6 | 5.652000 | 5.652000 | 0.000000 | 9.566000 | 9.566000 | 0.000000 | 6.681000 / 6.681000 |
| 891 | marathon/4/advanced/6 | 5.754000 | 5.754000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.681000 / 6.681000 |
| 900 | marathon/5/beginner/6 | 5.754000 | 5.754000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.681000 / 6.681000 |
| 901 | marathon/5/beginner/6 | 5.669000 | 5.669000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.581000 / 6.581000 |
| 902 | marathon/5/beginner/6 | 5.669000 | 5.669000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.581000 / 6.581000 |
| 903 | marathon/5/beginner/6 | 5.811000 | 5.811000 | 0.000000 | 9.779000 | 9.779000 | 0.000000 | 6.714000 / 6.714000 |
| 908 | marathon/5/beginner/60 | 9.196000 | 9.196000 | 0.000000 | 9.545000 | 9.545000 | 0.000000 | 8.048000 / 8.048000 |
| 909 | marathon/5/beginner/60 | 8.888000 | 8.888000 | 0.000000 | 9.231000 | 9.231000 | 0.000000 | 8.048000 / 8.048000 |
| 910 | marathon/5/beginner/60 | 8.965000 | 8.965000 | 0.000000 | 9.309000 | 9.309000 | 0.000000 | 8.151000 / 8.151000 |
| 912 | marathon/5/intermediate/6 | 5.508000 | 5.508000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.653000 / 6.653000 |
| 913 | marathon/5/intermediate/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 914 | marathon/5/intermediate/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 915 | marathon/5/intermediate/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.553000 / 6.553000 |
| 918 | marathon/5/intermediate/30 | 8.716000 | 8.716000 | 0.000000 | 9.342000 | 9.342000 | 0.000000 | 8.093000 / 8.093000 |
| 920 | marathon/5/intermediate/60 | 9.023000 | 9.023000 | 0.000000 | 9.369000 | 9.369000 | 0.000000 | 8.048000 / 8.048000 |
| 921 | marathon/5/intermediate/60 | 8.727000 | 8.727000 | 0.000000 | 9.067000 | 9.067000 | 0.000000 | 8.048000 / 8.048000 |
| 922 | marathon/5/intermediate/60 | 8.888000 | 8.888000 | 0.000000 | 9.231000 | 9.231000 | 0.000000 | 8.148000 / 8.148000 |
| 924 | marathon/5/advanced/6 | 5.563000 | 5.563000 | 0.000000 | 9.779000 | 9.779000 | 0.000000 | 6.686000 / 6.686000 |
| 925 | marathon/5/advanced/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 926 | marathon/5/advanced/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 927 | marathon/5/advanced/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 928 | marathon/5/advanced/30 | 8.688000 | 8.688000 | 0.000000 | 9.404000 | 9.404000 | 0.000000 | 7.971000 / 7.971000 |
| 929 | marathon/5/advanced/30 | 8.752000 | 8.752000 | 0.000000 | 9.470000 | 9.470000 | 0.000000 | 8.021000 / 8.021000 |
| 930 | marathon/5/advanced/30 | 8.752000 | 8.752000 | 0.000000 | 9.470000 | 9.470000 | 0.000000 | 8.021000 / 8.021000 |
| 931 | marathon/5/advanced/30 | 8.850000 | 8.850000 | 0.000000 | 9.570000 | 9.570000 | 0.000000 | 8.191000 / 8.191000 |
| 936 | marathon/6/beginner/6 | 5.754000 | 5.754000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.581000 / 6.581000 |
| 937 | marathon/6/beginner/6 | 5.669000 | 5.669000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.581000 / 6.581000 |
| 938 | marathon/6/beginner/6 | 5.709000 | 5.709000 | 0.000000 | 9.629000 | 9.629000 | 0.000000 | 6.714000 / 6.714000 |
| 939 | marathon/6/beginner/6 | 5.754000 | 5.754000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.681000 / 6.681000 |
| 944 | marathon/6/beginner/60 | 8.840000 | 8.840000 | 0.000000 | 9.535000 | 9.535000 | 0.000000 | 7.994000 / 7.994000 |
| 945 | marathon/6/beginner/60 | 8.551000 | 8.551000 | 0.000000 | 9.229000 | 9.229000 | 0.000000 | 8.094000 / 8.094000 |
| 946 | marathon/6/beginner/60 | 8.522000 | 8.522000 | 0.000000 | 9.199000 | 9.199000 | 0.000000 | 8.094000 / 8.094000 |
| 948 | marathon/6/intermediate/6 | 5.508000 | 5.508000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.653000 / 6.653000 |
| 949 | marathon/6/intermediate/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 950 | marathon/6/intermediate/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.553000 / 6.553000 |
| 951 | marathon/6/intermediate/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.553000 / 6.553000 |
| 954 | marathon/6/intermediate/30 | 8.763000 | 8.763000 | 0.000000 | 9.144000 | 9.144000 | 0.000000 | 8.051000 / 8.051000 |
| 956 | marathon/6/intermediate/60 | 8.674000 | 8.674000 | 0.000000 | 9.359000 | 9.359000 | 0.000000 | 7.994000 / 7.994000 |
| 957 | marathon/6/intermediate/60 | 8.377000 | 8.377000 | 0.000000 | 9.046000 | 9.046000 | 0.000000 | 7.994000 / 7.994000 |
| 958 | marathon/6/intermediate/60 | 8.532000 | 8.532000 | 0.000000 | 9.210000 | 9.210000 | 0.000000 | 8.094000 / 8.094000 |
| 960 | marathon/6/advanced/6 | 5.508000 | 5.508000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.653000 / 6.653000 |
| 961 | marathon/6/advanced/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 962 | marathon/6/advanced/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 963 | marathon/6/advanced/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 964 | marathon/6/advanced/30 | 8.299000 | 8.299000 | 0.000000 | 9.404000 | 9.404000 | 0.000000 | 7.914000 / 7.914000 |
| 965 | marathon/6/advanced/30 | 8.361000 | 8.361000 | 0.000000 | 9.470000 | 9.470000 | 0.000000 | 7.964000 / 7.964000 |
| 966 | marathon/6/advanced/30 | 8.394000 | 8.394000 | 0.000000 | 9.504000 | 9.504000 | 0.000000 | 8.084000 / 8.084000 |
| 967 | marathon/6/advanced/30 | 8.456000 | 8.456000 | 0.000000 | 9.570000 | 9.570000 | 0.000000 | 8.114000 / 8.114000 |
| 972 | marathon/7/beginner/6 | 5.754000 | 5.754000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.581000 / 6.581000 |
| 973 | marathon/7/beginner/6 | 5.709000 | 5.709000 | 0.000000 | 9.629000 | 9.629000 | 0.000000 | 6.714000 / 6.714000 |
| 974 | marathon/7/beginner/6 | 5.652000 | 5.652000 | 0.000000 | 9.566000 | 9.566000 | 0.000000 | 6.681000 / 6.681000 |
| 975 | marathon/7/beginner/6 | 5.754000 | 5.754000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.681000 / 6.681000 |
| 980 | marathon/7/beginner/60 | 8.871000 | 8.871000 | 0.000000 | 9.568000 | 9.568000 | 0.000000 | 8.094000 / 8.094000 |
| 981 | marathon/7/beginner/60 | 8.532000 | 8.532000 | 0.000000 | 9.210000 | 9.210000 | 0.000000 | 8.094000 / 8.094000 |
| 982 | marathon/7/beginner/60 | 8.532000 | 8.532000 | 0.000000 | 9.210000 | 9.210000 | 0.000000 | 7.994000 / 7.994000 |
| 984 | marathon/7/intermediate/6 | 5.508000 | 5.508000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.653000 / 6.653000 |
| 985 | marathon/7/intermediate/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.553000 / 6.553000 |
| 986 | marathon/7/intermediate/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.553000 / 6.553000 |
| 987 | marathon/7/intermediate/6 | 5.563000 | 5.563000 | 0.000000 | 9.779000 | 9.779000 | 0.000000 | 6.686000 / 6.686000 |
| 990 | marathon/7/intermediate/30 | 8.763000 | 8.763000 | 0.000000 | 9.144000 | 9.144000 | 0.000000 | 8.051000 / 8.051000 |
| 992 | marathon/7/intermediate/60 | 8.674000 | 8.674000 | 0.000000 | 9.359000 | 9.359000 | 0.000000 | 7.994000 / 7.994000 |
| 993 | marathon/7/intermediate/60 | 8.532000 | 8.532000 | 0.000000 | 9.210000 | 9.210000 | 0.000000 | 8.094000 / 8.094000 |
| 994 | marathon/7/intermediate/60 | 8.551000 | 8.551000 | 0.000000 | 9.229000 | 9.229000 | 0.000000 | 8.194000 / 8.194000 |
| 996 | marathon/7/advanced/6 | 5.508000 | 5.508000 | 0.000000 | 9.716000 | 9.716000 | 0.000000 | 6.653000 / 6.653000 |
| 997 | marathon/7/advanced/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 998 | marathon/7/advanced/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.653000 / 6.653000 |
| 999 | marathon/7/advanced/6 | 5.426000 | 5.426000 | 0.000000 | 9.591000 | 9.591000 | 0.000000 | 6.553000 / 6.553000 |
| 1000 | marathon/7/advanced/30 | 8.456000 | 8.456000 | 0.000000 | 9.570000 | 9.570000 | 0.000000 | 8.014000 / 8.014000 |
| 1001 | marathon/7/advanced/30 | 8.394000 | 8.394000 | 0.000000 | 9.504000 | 9.504000 | 0.000000 | 8.084000 / 8.084000 |
| 1002 | marathon/7/advanced/30 | 8.394000 | 8.394000 | 0.000000 | 9.504000 | 9.504000 | 0.000000 | 8.064000 / 8.064000 |
| 1003 | marathon/7/advanced/30 | 8.456000 | 8.456000 | 0.000000 | 9.570000 | 9.570000 | 0.000000 | 8.014000 / 8.014000 |

## Dwa dni

144/144 historycznych ocen zachowano, bez nowego pogorszenia. To ochrona ocen i bezpieczeństwa, nie dowód identycznej skuteczności sportowej.

## Holdouty

| ID | Dystans/dni/poziom/baza | V27/23 | V28/23 | Δ23 | V27/25 | V28/25 | Δ25 | Audyt27 przed/po |
|---|---|---|---|---|---|---|---|---|
| 28 | marathon/3/intermediate/17 | 6.279000 | 6.266000 | -0.013000 | 9.464000 | 9.311000 | -0.153000 | 7.709000 / 7.709000 |
| 14 | half/4/intermediate/59 | 7.595000 | 7.341000 | -0.254000 | 9.415000 | 9.397000 | -0.018000 | 8.049000 / 8.079000 |
| 18 | half/5/advanced/31 | 9.280000 | 9.018000 | -0.262000 | 9.686000 | 9.750000 | 0.064000 | 7.953000 / 8.297000 |
| 22 | half/6/intermediate/62 | 8.281000 | 8.227000 | -0.054000 | 8.875000 | 8.770000 | -0.105000 | 7.901000 / 7.901000 |
| 23 | marathon/6/intermediate/67 | 5.049000 | 4.906000 | -0.143000 | 8.719000 | 8.430000 | -0.289000 | 7.373000 / 7.373000 |
| 26 | half/7/beginner/14 | 4.546000 | 4.485000 | -0.061000 | 7.442000 | 7.350000 | -0.092000 | 6.553000 / 6.603000 |
| 42 | half/4/intermediate/66 | 8.061000 | 8.048000 | -0.013000 | 9.797000 | 9.784000 | -0.013000 | 8.093000 / 8.143000 |
| 67 | marathon/3/beginner/30 | 6.421000 | 6.175000 | -0.246000 | 8.810000 | 8.600000 | -0.210000 | 7.476000 / 7.476000 |
| 99 | marathon/4/beginner/70 | 6.198000 | 5.815000 | -0.383000 | 8.651000 | 8.265000 | -0.386000 | 7.396000 / 7.396000 |
| 111 | marathon/7/beginner/44 | 4.952000 | 4.634000 | -0.318000 | 8.774000 | 8.388000 | -0.386000 | 7.362000 / 7.362000 |
| 154 | half/4/intermediate/59 | 8.292000 | 7.999000 | -0.293000 | 8.754000 | 8.478000 | -0.276000 | 7.839000 / 7.239000 |
| 195 | marathon/7/intermediate/75 | 6.981000 | 6.941000 | -0.040000 | 8.374000 | 8.326000 | -0.048000 | 7.550000 / 7.550000 |

Nie osiągnięto aspiracyjnej średniej 7,70: wynik 7.547016. Dawnych 250 obniżeń względem V26 pozostało 223; nie zredukowano ich o połowę. P10 historycznego miernika i najgorszy decyl: 4.864000 → 4.864000 i 3.973376 → 3.973376. Nie nazywamy tego przełomem.

Względem V27 jest 21 popraw według rygorystycznego kryterium zmian recept i audytu. Według dokładnie pierwotnego kryterium V27, ze wspólną bazą V26, jest 237 wobec wcześniejszych 233; obie liczby mają różne punkty odniesienia i nie wolno ich utożsamiać. To oceny wewnętrzne, bez dowodu poprawy wyników sportowych.

W frozen-1008 występuje 9 nowych spadków, w holdoucie 64 — 1, w 224 — 11. Miernik 25.0.0 na holdoucie 224: 9.049013 → 9.046366. Zachowano wszystkie przypadki.

Nie przeprowadzono zewnętrznej oceny trenera ani badań efektów, urazowości i gotowości medycznej. Przegląd anonimowy jest wewnętrzny, regułowy, z ukrytymi etykietami wersji; autor zna implementację, więc nie jest to niezależny, zaślepiony eksperyment trenerski.

Deklarowane 60 km i 24 km nie są wykonaniem. Koperta pozostaje warunkowa, minimum jest sygnałem adekwatności, a nie uprawnieniem do wymuszania dawki. Przy 1–2 dniach maraton nadal może wymagać zmiany celu. Estymowane HR i minuty × RPE nie są pomiarem progów ani prognozą urazu.

Przeszukiwanie tygodnia jest lokalne i ograniczone, bez pełnego beam search całego bloku. Zachowuje pamięć sezonu i trudnych dat; nie gwarantuje globalnego optimum. Niektóre warianty są nadal ograniczane historycznymi alokatorami/naprawami, ale trace ujawnia ich skutki. Dawki i progi RPE pozostają heurystyczne. athleteEvidence.declared opisuje roboczy profil po normalizacji i ograniczeniu sprzecznych danych wykonaniem, a nie archiwum surowego formularza; surowe wejście należy zachować osobno. Observed nie jest uzupełniane zaplanowanymi treningami.

Etykiety proponowanych alternatyw rozróżniają teraz kryteria harmonogramu i potwierdzenie wykonaniem. Nadal są oceną heurystyczną, bez gwarancji sportowej lub medycznej.
