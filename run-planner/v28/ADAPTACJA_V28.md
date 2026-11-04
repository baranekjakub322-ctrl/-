# Adaptacja V28

150 historii po 8 lub 12 tygodni, 151 PASS / 0 FAIL (jedna dodatkowa kontrola importu 3000 wpisów). 140 asercji kompatybilności oraz 4 sekwencje po 16 tygodni, 8 kontroli chronologii. Pełne zdarzenia, decyzje i końcowe plany są w histories_v28.ndjson.gz; to sztuczne, jawnie symulowane wykonanie, nie dane rzeczywistych biegaczy.

Tryby: regularne wykonanie, pominięcie, skrócenie, rosnące RPE i zmęczenie, przerwa, pojedynczy/kolejny test, ból i jawne ustąpienie, korekta, cancel/restore, strefy, dwie aktywności jednego dnia, zmiana dostępności i startu, częściowy import. Sprawdzano rzeczywistą przyszłość, niezmienność wcześniejszego planu, idempotencję, audyt oryginałów i brak krytycznych naruszeń.

comparableExposureState wymaga dat różnych dni, co najmniej 7 dni rozpiętości, zbliżonej efektywnej dawki i RPE/regeneracji. Sam czas całej aktywności nie dowodzi pracy progowej. Hill ma licznik rzeczywistych ekspozycji i osobny limit efektywnej pracy pod górę; strides mają jawną konsolidację i pozostają w obrębie easy, bez wymuszonego wzrostu. Jeden wynik nie powoduje dużej zmiany tempa; istniejące ograniczenia VDOT i redukcje pozostają. familyEvidence zapisuje decyzję, nie fikcyjne wykonanie. Powtarzane problemy ze snem ograniczają przyszłą jakość, nie diagnozują urazu.

Statyczny audyt jest NOT_ASSESSABLE; opis implementacji nie zastępuje oceny skutków. Przyszła pełna walidacja wymaga rzeczywistych dzienników i niezależnej oceny.
