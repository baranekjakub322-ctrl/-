// Testy regresyjne: po jednym (lub więcej) na każdą naprawioną wadę V19. Uruchomione na V19 (GEN=baza/planGenerator_v19.js) powinny
// wykazać te wady (patrz raport); na V20 muszą przechodzić.
import { mkInput, runAll, independentChecks, makeReporter, finish, weeksOf, dowOf, diffD, G, GEN_PATH } from "./lib.mjs";
const rep = makeReporter("regresje"); const { ok } = rep;
const R10 = { distanceKm: 10, timeSec: 3300 };

// R1 (D1): trimWeekRuns zwraca false, gdy nie da się spełnić limitu; generator to zgłasza
if (typeof G.trimWeekRuns === "function") {
  const mk = (km, podtyp = "latwy") => ({ data: "2026-11-10", podtyp, typ: "x", dystans_km: km, czas_min: km * 6, kroki: [{ etap: "Bieg spokojny", dystans_km: km }] });
  ok(G.trimWeekRuns([mk(3), mk(3), mk(3)], 6, false) === false, "R1a: trimWeekRuns zwraca false przy niemożliwym limicie");
  ok(G.trimWeekRuns([mk(8), mk(8)], 12, false) === true, "R1b: trimWeekRuns zwraca true, gdy limit osiągalny");
}
{ // przegląd siatki: każdy plan z nieosiągniętym limitem musi to jawnie zgłaszać
  let found = 0, silent = 0, total = 0;
  for (const level of ["beginner", "intermediate", "advanced"]) for (const type of ["5k", "10k", "half", "marathon"]) for (const days of [2, 3, 4, 5, 6]) for (const [km, longest] of [[8, 4], [18, 8], [30, 12], [55, 22]]) for (const weeks of [10, 16, 24]) {
    const { res } = runAll(mkInput({ level, type, days, km, longest, weeks, raceDow: (days + weeks) % 7, result: R10 })); total++;
    if (!res.ok) continue;
    const miss = res.limityNieosiagniete || [];
    if (miss.length) { found++; if (!res.ostrzezenia.some((w) => /Nie udalo sie zbic|Nie udało się zbić/.test(w)) || res.kontrola.zgodny !== false) silent++; }
  }
  ok(silent === 0, `R1c: żaden z ${total} planów nie przekracza limitu po cichu (plany z nieosiągniętym limitem: ${found})`, `${silent} cichych`);
}
// R2 (D2): odciążenia również przy małym kilometrażu
{ const inp = mkInput({ level: "beginner", type: "10k", weeks: 14, days: 4, km: 8, longest: 4 }); const { res } = runAll(inp); const W = weeksOf(res);
  ok(W.some((w) => w.deload), "R2a: plan od 8 km/tydz. zawiera tydzień odciążający");
  const c = independentChecks(inp, res); ok(!c.problemy.some((p) => p.kod === "ZA_DLUGO_BEZ_ODCIAZENIA"), "R2b: nie więcej niż 5 tygodni obciążenia pod rząd (miernik niezależny, bez taperu)"); }
{ const inp = mkInput({ level: "beginner", type: "half", weeks: 12, days: 2, km: 8, longest: 4, raceDow: 0 }); const { res } = runAll(inp); const c = independentChecks(inp, res);
  ok(!c.problemy.some((p) => p.kod === "ZA_DLUGO_BEZ_ODCIAZENIA"), "R2c: półmaraton, 2 dni, 8 km/tydz., 12 tyg.: regularne odciążenia (V19: 7 tygodni obciążenia pod rząd)"); }
{ const inp = mkInput({ level: "beginner", type: "5k", weeks: 9, days: 1, km: 40, longest: 16, raceDow: 2, today: "2026-11-04" }); const { res } = runAll(inp); const c = independentChecks(inp, res);
  ok(!c.problemy.some((p) => p.kod === "ZA_DLUGO_BEZ_ODCIAZENIA" && p.ciezar === "krytyczny"), "R2d: 1 bieg/tydz. po 40 km/16 km: odciążenie w planie (V19: 8 tygodni obciążenia pod rząd)"); }
// R3 (D3): brak dużego długiego biegu tuż przed startem
{ for (const [type, tab] of [["marathon", [[6, 10], [13, 18]]], ["half", [[4, 8], [9, 12]]]]) {
    const inp = mkInput({ level: "beginner", type, weeks: 6, days: 5, km: 70, longest: 28, raceDow: 2, today: "2026-11-04", result: R10 }); const { res } = runAll(inp);
    const bad = res.treningi.filter((t) => t.podtyp === "dlugi").filter((t) => { const g = diffD(t.data, inp.goal.raceDate); const row = tab.find(([d]) => g <= d); return row && g >= 1 && t.dystans_km > row[1]; });
    ok(bad.length === 0, `R3: ${type} w 6 tyg.: brak długiego biegu ponad pułap tuż przed startem`, JSON.stringify(bad.map((t) => [t.data, t.dystans_km]))); } }
// R4 (E1): wiek wpływa na plan
{ const a = runAll(mkInput({ type: "half", weeks: 16, days: 4, km: 25, longest: 10, age: 35, result: R10 })).res, b = runAll(mkInput({ type: "half", weeks: 16, days: 4, km: 25, longest: 10, age: 58, result: R10 })).res;
  ok(JSON.stringify(a.treningi.map((t) => t.dystans_km)) !== JSON.stringify(b.treningi.map((t) => t.dystans_km)), "R4a: wiek 58 daje inny plan niż 35");
  ok(weeksOf(b).filter((w) => w.deload).length > weeksOf(a).filter((w) => w.deload).length, "R4b: wiek 58: więcej tygodni odciążających"); }
// R5 (F1-F3): rozdzielone poziomy gotowości; brak 'wyniku' bez progów
{ const r = runAll(mkInput({ type: "marathon", weeks: 20, days: 4, km: 10, longest: 5, level: "beginner" })).res;
  ok(r.gotowosc.rozdzielenie?.etykieta === "brak_bezpiecznej_bazy" && r.gotowosc.rozdzielenie?.mozliwoscUkonczenia === false, "R5a: maraton z 10 km/5 km => brak bezpiecznej bazy, brak możliwości ukończenia");
  const r2 = runAll(mkInput({ type: "marathon", weeks: 24, days: 3, km: 45, longest: 22, level: "intermediate", result: { distanceKm: 21.0975, timeSec: 6600 }, targetTimeSec: 14400 })).res;
  ok(r2.gotowosc.status !== "odpowiednie_przygotowanie_do_wyniku", "R5b: maraton z 3 biegów nigdy nie dostaje gotowości do wyniku", r2.gotowosc.status);
  const r3 = runAll(mkInput({ type: "marathon", weeks: 24, days: 5, km: 50, longest: 24, level: "intermediate", targetTimeSec: 14400 })).res;
  ok(r3.gotowosc.rozdzielenie?.doKonkretnegoWyniku === false, "R5c: brak wyniku odniesienia => doKonkretnegoWyniku=false");
  const r4 = runAll(mkInput({ type: "marathon", weeks: 24, days: 5, km: 50, longest: 24, level: "beginner", result: { distanceKm: 21.0975, timeSec: 7800 } })).res;
  const w = weeksOf(r4); const lg = Math.max(...w.map((x) => x.longKm));
  ok(!/odpowiednie_przygotowanie/.test(r4.gotowosc.status) || lg >= 26, "R5d: maraton początkujący: gotowość do ukończenia tylko przy długim biegu >= ~26 km", `${r4.gotowosc.status} long ${lg}`); }
// R6 (B): sweep faktycznie obejmuje wszystkie dni startu -> asercje w testy/sweep.mjs; tu: dwa różne dni startu dają różne plany
{ const a = runAll(mkInput({ type: "10k", weeks: 12, days: 4, today: "2026-11-02", raceDow: 0 })).res, b = runAll(mkInput({ type: "10k", weeks: 12, days: 4, today: "2026-11-06", raceDow: 0 })).res;
  ok(JSON.stringify(a.treningi.map((t) => t.data)) !== JSON.stringify(b.treningi.map((t) => t.data)), "R6: dzień startu planu zmienia daty treningów"); }
// R7: ostatni tydzień przed zawodami: żaden mocny trening w ostatnich 2 dniach
{ let bad = 0, n = 0; for (const type of ["5k", "10k", "half", "marathon"]) for (let d = 0; d < 7; d++) { const inp = mkInput({ type, weeks: 14, days: 4, km: 30, longest: 12, raceDow: d, result: R10 }); const { res } = runAll(inp); n++;
    if (res.treningi.some((t) => ["tempo", "interwaly", "podbiegi", "tempo_startowe", "test"].includes(t.podtyp) && diffD(t.data, inp.goal.raceDate) <= 2)) bad++; }
  ok(bad === 0, `R7: brak mocnych treningów w 2 dniach przed startem (${n} planów)`, String(bad)); }
finish(rep, { generatorPlik: GEN_PATH });
