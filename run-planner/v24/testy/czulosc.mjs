// Czułość na dane wejściowe. Dla każdego parametru JAWNIE zapisano oczekiwanie projektowe (powinien/nie powinien zmieniać plan),
// żeby nie "dorabiać" różnic wyłącznie pod test. Parametry bez wpływu na dystanse są udokumentowaną decyzją, nie przeoczeniem.
import { mkInput, runAll, makeReporter, finish, weeksOf, hashTr, summarizeKm, GEN_PATH } from "./lib.mjs";
const rep = makeReporter("czulosc"); const { ok } = rep;
const B = { type: "half", weeks: 16, days: 4, level: "intermediate", km: 25, longest: 10, age: 35, hrMax: 188, result: { distanceKm: 10, timeSec: 3300 }, extra: { gender: "M" } };
const base = runAll(mkInput(B)).res;
const sb = summarizeKm(base);
const firstLong = (res) => { const w = weeksOf(res).find((x) => x.longKm > 0); return w ? w.longKm : 0; };
const rows = [];
function variant(nazwa, patch, oczekiwanie, check) {
  const o = { ...B, ...patch }; if (patch.extra) o.extra = { ...B.extra, ...patch.extra };
  const res = runAll(mkInput(o)).res; const s = summarizeKm(res);
  const zmiana = hashTr(res) !== hashTr(base);
  const row = { parametr: nazwa, oczekiwanie, planZmienionyStrukturalnie: zmiana, dSzczyt: s.peakKm - sb.peakKm, dNajdluzszy: s.peakLong - sb.peakLong, dPierwszyDlugi: firstLong(res) - firstLong(base) };
  rows.push(row);
  if (oczekiwanie === "zmiana") ok(zmiana, `${nazwa}: plan powinien się zmienić`);
  if (oczekiwanie === "brak_zmiany_struktury") ok(!zmiana, `${nazwa}: struktura (dystanse/daty/typy) bez zmian z założenia projektowego`);
  if (check) check(res, s, row);
  return res;
}
variant("wiek 35→58", { age: 58 }, "zmiana", (r, s) => ok(s.peakKm <= sb.peakKm, "wiek 58: szczyt nie wyższy niż dla 35 lat", `${s.peakKm} vs ${sb.peakKm}`));
variant("wiek 35→22", { age: 22 }, "brak_zmiany_struktury");
variant("płeć M→K", { extra: { gender: "K" } }, "brak_zmiany_struktury");
{ const r = variant("HRmax 188→170", { hrMax: 170 }, "brak_zmiany_struktury"); ok(JSON.stringify(r.strefyTetna) !== JSON.stringify(base.strefyTetna), "HRmax zmienia strefy tętna (jedyny zamierzony wpływ)"); }
variant("poziom → beginner", { level: "beginner" }, "zmiana", (r, s) => ok(s.peakKm <= sb.peakKm, "beginner: szczyt nie wyższy", `${s.peakKm} vs ${sb.peakKm}`));
variant("poziom → advanced", { level: "advanced" }, "zmiana");
variant("kilometraż 25→45", { km: 45 }, "zmiana", (r, s) => ok(s.peakKm >= sb.peakKm, "większy kilometraż: szczyt nie niższy"));
variant("kilometraż 25→10", { km: 10 }, "zmiana", (r, s) => ok(s.peakKm <= sb.peakKm, "mniejszy kilometraż: szczyt nie wyższy"));
// najdłuższy bieg: porównanie przy SPÓJNYM kilometrażu (40 km/tydz.), bo przy 25 km/tydz. długi bieg 16 km to 64% tygodnia i
// limit udziału długiego biegu (zamierzony) skraca go niezależnie od historii.
{ const mk = (longest) => runAll(mkInput({ ...B, km: 40, longest })).res;
  const lo = mk(8), mid = mk(12), hi = mk(16);
  rows.push({ parametr: "najdłuższy bieg 8→12→16 (przy 40 km/tydz.)", oczekiwanie: "zmiana", planZmienionyStrukturalnie: hashTr(lo) !== hashTr(hi), dSzczyt: summarizeKm(hi).peakKm - summarizeKm(lo).peakKm, dNajdluzszy: summarizeKm(hi).peakLong - summarizeKm(lo).peakLong, dPierwszyDlugi: firstLong(hi) - firstLong(lo) });
  // uwaga projektowa: pierwszy długi bieg ma dolny próg ok. 30% objętości startowej, więc historia poniżej tego progu (8 vs 12 km przy 40 km/tydz.) nie zmienia go
  ok(firstLong(lo) <= firstLong(mid) && firstLong(mid) < firstLong(hi), "dłuższy ostatni bieg => nie krótszy, a powyżej progu 30% objętości dłuższy pierwszy długi bieg (8<=12<16)", `${firstLong(lo)}/${firstLong(mid)}/${firstLong(hi)}`);
  ok(firstLong(hi) - firstLong(lo) >= 3, "różnica pierwszego długiego biegu >= 3 km przy różnicy historii 8 km", String(firstLong(hi) - firstLong(lo))); }
variant("najdłuższy bieg 10→16 przy 25 km/tydz. (limit udziału skraca)", { longest: 16 }, "zmiana");
variant("wynik 55:00→50:00", { result: { distanceKm: 10, timeSec: 3000 } }, "zmiana");
variant("liczba dni 4→3", { days: 3 }, "zmiana");
variant("liczba dni 4→5", { days: 5 }, "zmiana");
variant("limit czasu 120→60 min", { maxMinutes: 60 }, "zmiana", (r, s) => ok(s.peakKm < sb.peakKm, "limit 60 min obniża szczyt"));
variant("kontuzja", { injuries: true }, "zmiana", (r, s) => ok(s.peakKm < sb.peakKm, "kontuzja obniża szczyt"));
variant("historia przeciążeń", { historiaKontuzji: true }, "zmiana");
variant("przerwa 60 dni", { breakDays: 60 }, "zmiana", (r, s) => ok(s.peakKm < sb.peakKm, "przerwa obniża szczyt"));
variant("liczba tygodni 16→24", { weeks: 24 }, "zmiana");
// wiek: kadencja odciążeń
{ const w58 = weeksOf(runAll(mkInput({ ...B, age: 58 })).res), w35 = weeksOf(base);
  ok(w58.filter((w) => w.deload).length > w35.filter((w) => w.deload).length, "wiek 58: więcej tygodni odciążających niż przy 35 latach", `${w58.filter((w) => w.deload).length} vs ${w35.filter((w) => w.deload).length}`); }
finish(rep, { generatorPlik: GEN_PATH, tabela: rows, plikBazowy: { szczytKm: sb.peakKm, najdluzszy: sb.peakLong } });
