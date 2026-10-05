# PRD — Wypożyczalnia JaroSpeedRent

## Original problem statement
Stwórz nowoczesną, przejrzystą i responsywną stronę internetową (landing page) dla wypożyczalni samochodów oraz sprzętu ogrodniczo-budowlanego Jaro Speed Rent. Flota: Ford Tourneo Custom (8-osobowy). Sprzęt: Wertykulator spalinowy Weibang, Aerator spalinowy (rurkowy) Weibang. Sekcje: Hero z CTA, karty oferty, galerie zdjęć (z możliwością wgrania własnych), kalendarz dostępności, bardzo widoczny kontakt (tel +48 668 434 331, e-mail jarospeedrent@gmail.com, formularz). Pełna RWD.

User follow-ups: kalendarz tylko dla busa (admin wpisuje zajęte terminy), kalkulator cen (1 doba 300 zł, >1 doba 250 zł lub mniej, limit 300 km/doba, dopłata indywidualnie; wertykulator 110 zł/doba, aerator 230 zł/doba; cena zawsze indywidualna); zapytania bezpośrednio tel/e-mail/SMS; galeria zarządzana przez właściciela (dużo zdjęć, własna kolejność); nazwa „Wypożyczalnia JaroSpeedRent”, własne logo; kolory biały/szary/czarny; czarny nagłówek; klik w kartę oferty → galeria danej pozycji.

## Architecture
- React (CRA) + framer-motion + lenis; FastAPI + MongoDB; Emergent object storage for uploaded photos; JWT cookie auth (single admin seeded from env).
- Endpoints: /api/auth/*, /api/bookings (public), /api/admin/bookings (CRUD), /api/gallery (public), /api/admin/gallery (upload/reorder/caption/soft-delete), /api/files/{path}.
- Gallery categories: bus, wertykulator, aerator.

## Implemented (2026-10-05)
- Landing: kinetic hero, marquee, bento oferty (z danymi z ulotek), kalkulator cen, kalendarz dostępności busa, galeria z zakładkami + lightbox, kontakt (SMS / e-mail / telefon), mobilny pasek kontaktu.
- Panel /admin: rezerwacje busa (dodaj/usuń zakres), galeria (upload wielu zdjęć, kolejność, podpisy, usuwanie).
- Monochrome redesign, black header, customer logo.
- Formularz kontaktowy wysyła e-mail bezpośrednio (Emergent Resend) na jarospeedrent@gmail.com, kopia w db.inquiries, limit 5/h na IP; karta telefonu: Zadzwoń / SMS / WhatsApp / Kopiuj.
- Panel: zakładka „Zapytania” (nowe/wszystkie, oznacz jako obsłużone, usuń); kalkulator: opcja z kierowcą, dopłata 0,40 zł/km; numery tel: telefon = potwierdzenie, komputer = kopiowanie.

## Backlog
- P1: link do profilu Facebook (brak URL), drag&drop kolejności zdjęć
- P2: lifespan zamiast on_event, async storage client
