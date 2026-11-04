# Adaptacja V26

150 wielotygodniowych historii × 6 tygodni, 151 PASS / 0 FAIL. Każda testuje rzeczywiste wyjście, ochronę poprzedniego planu, niezmienność wykonanej przeszłości, niezależne inwarianty, powtarzaną aktualizację i brak nadrabiania.

Warianty: regularność, pominięcia, skracanie, wysokie RPE i zmęczenie, dwutygodniowa przerwa, pojedynczy i wielokrotny test, ból/wznowienie, korekta po kilku tygodniach, anulowanie/przywrócenie, strefy, dwa biegi dziennie, dni, termin startu, niepełna historia i kwarantanna błędnych importów. Pełne zdarzenia i tygodniowe wyniki, a także końcowe plany: wyniki_v26/histories.ndjson.gz. To symulacje, nie rzeczywiste dzienniki zawodników.

Dodatkowo zachowano 140 testów adaptacji V25 uruchomionych na V26, bez zmiany asercji. Masowy import 3000 obserwacji z 20 duplikatami i brakującym czasem: sprawdzono liczbę aktywności, audyt i idempotencję. Brak czasu nie tworzy wykonanego treningu: rekord pozostaje w kwarantannie przy partialImport.

Pewność: adaptationConfidence i decyzje confidence, z opisowym poziomem oraz notProbability:true. Niepełna historia nie oznacza pominięcia; kompletność jest jawna i nie przedłuża się automatycznie. Test po jednym dobrym dniu nadal podlega limitowi 0,5%, kilka zgodnych ekspozycji maksymalnie 2% od bazy. Korekta/anulowanie przelicza przyszłość.

Czas 37.631 s, maksimum procesu 470.234 MiB. Wyniki obejmują przechowywanie pełnych historii testowych; nie są pamięcią pojedynczego updatePlan.
