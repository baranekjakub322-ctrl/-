// Testy podstawowe: kompatybilność API względem V19, walidacja, determinizm, niemutowanie wejścia, kształt wyniku.
import { mkInput, runAll, independentChecks, makeReporter, finish, G, loadGen, GEN_PATH } from "./lib.mjs";
const rep = makeReporter("podstawowe"); const { ok } = rep;
const V19 = await loadGen("../baza/planGenerator_v19.js");

// --- kompatybilność API: wszystkie eksporty V19 nadal istnieją i są tego samego typu
for (const k of Object.keys(V19)) { if (k === "VERSION") continue; ok(k in G, `eksport ${k} zachowany`, `brak ${k}`); if (k in G) ok(typeof G[k] === typeof V19[k], `eksport ${k} ma ten sam typ`, `${typeof G[k]} vs ${typeof V19[k]}`); }
ok(/^27\./.test(G.VERSION), "VERSION zaczyna się od 27.", G.VERSION);

// --- kształt wyniku
const base = mkInput({ type: "half", weeks: 16, days: 4, result: { distanceKm: 10, timeSec: 3300 } });
const r = G.generatePlan(base);
ok(r.ok === true, "poprawne dane => ok:true");
for (const f of ["wersja", "plan", "treningi", "tygodnie", "kontrola", "gotowosc", "ostrzezenia", "tempa", "strefyTetna", "limityNieosiagniete"]) ok(f in r, `pole wyniku ${f}`);
for (const t of r.treningi) { if (!(typeof t.data === "string" && typeof t.typ === "string" && "dystans_km" in t && "czas_min" in t && typeof t.opis === "string")) { ok(false, "każdy trening ma data/typ/dystans_km/czas_min/opis", JSON.stringify(t).slice(0, 120)); break; } }
ok(r.plan.start && r.plan.start.data === base.goal.raceDate, "plan.start zawiera datę zawodów");
ok(typeof r.gotowosc.rozdzielenie === "object" && "bazaBezpieczna" in r.gotowosc.rozdzielenie, "gotowość zawiera rozdzielone poziomy (V20)");

// --- walidacja
const bad = (o, kod, opis) => { const x = G.generatePlan(o); ok(x.ok === false && x.bledy.length > 0, opis, JSON.stringify(x).slice(0, 120)); };
bad(null, 0, "null => ok:false bez wyjątku"); bad("tekst", 0, "string => ok:false"); bad([], 0, "tablica => ok:false"); bad({}, 0, "pusty obiekt => ok:false");
bad({ ...base, today: "2026-02-30" }, 0, "nieistniejąca data => ok:false");
bad({ ...base, availableDays: [] }, 0, "brak dni => ok:false");
bad({ ...base, availableDays: [0, 9] }, 0, "dzień 9 => ok:false");
bad({ ...base, daysPerWeek: 9 }, 0, "9 dni => ok:false");
bad({ ...base, age: 5 }, 0, "wiek 5 => ok:false");
bad({ ...base, currentWeeklyKm: -3 }, 0, "ujemny kilometraż => ok:false");
bad({ ...base, currentWeeklyKm: 999 }, 0, "nierealny kilometraż => ok:false");
bad({ ...base, goal: { type: "half", raceDate: "2020-01-01" } }, 0, "start w przeszłości => ok:false");
bad({ ...base, goal: { type: "ultra" } }, 0, "nieznany dystans => ok:false");
bad({ ...base, goal: { type: "marathon", raceDate: base.goal.raceDate, targetTimeSec: 4000 } }, 0, "czas maratonu 1:06 (tempo 1:34/km) => ok:false");
bad({ ...base, maxMinutes: 10 }, 0, "limit czasu 10 min => ok:false");
bad({ ...base, hrMax: 50 }, 0, "HRmax 50 => ok:false");
for (const v of ["abc", NaN, Infinity]) { let x; try { x = G.generatePlan({ ...base, currentWeeklyKm: v }); ok(typeof x === "object", `currentWeeklyKm=${String(v)} nie rzuca wyjątku`); } catch (e) { ok(false, `currentWeeklyKm=${String(v)} nie rzuca wyjątku`, e.message); } }

// --- determinizm i niemutowanie wejścia
const before = JSON.stringify(base);
const a = JSON.stringify(G.generatePlan(base)), b = JSON.stringify(G.generatePlan(base));
ok(a === b, "determinizm: dwa wywołania dają identyczny wynik");
ok(JSON.stringify(base) === before, "generatePlan nie mutuje obiektu wejściowego");

// --- limity czasu i dostępność (kontrola niezależna)
for (const [nm, o] of [["limit 45 min w dni robocze", { maxMinutesWeekday: 45, maxMinutesWeekend: 120 }], ["limit 50 min w weekend", { maxMinutesWeekday: 90, maxMinutesWeekend: 50 }], ["limit 60 min ogółem", { maxMinutes: 60 }]]) {
  const inp = mkInput({ type: "10k", weeks: 14, days: 4, km: 25, longest: 10, result: { distanceKm: 10, timeSec: 3300 }, ...o });
  const { res } = runAll(inp); const c = independentChecks(inp, res);
  ok(res.ok && !c.problemy.some((p) => p.kod === "LIMIT_CZASU"), `${nm}: żaden bieg nie przekracza limitu`, JSON.stringify(c.problemy.filter((p) => p.kod === "LIMIT_CZASU").slice(0, 3)));
}
const only = mkInput({ type: "10k", weeks: 12, days: 3, availableDays: [2, 4, 6], km: 20, longest: 8 });
{ const { res } = runAll(only); const c = independentChecks(only, res); ok(res.ok && !c.problemy.some((p) => p.kod === "DZIEN_NIEDOSTEPNY"), "biegi tylko w dostępne dni (wt, czw, sob)"); }

// --- funkcje pomocnicze API
{ const t = G.vdotFrom(10000, 3000); const t2 = G.vdotFrom(10000, 2700); ok(t2 > t, "vdotFrom: szybszy czas => wyższy VDOT"); }
{ const s = G.shiftPlan(r.treningi, 7); ok(s.ok && s.treningi[0].data === G.addDays(r.treningi[0].data, 7), "shiftPlan przesuwa daty o 7 dni"); }
{ const s = G.shiftPlan(r.treningi, 7, { fixedRace: true }); ok(s.ok === false, "shiftPlan z fixedRace odmawia przesunięcia"); }
{ const x = G.sprawdzBezpieczenstwo({ pain: 9 }); ok(x.poziom !== "ok", "sprawdzBezpieczenstwo: silny ból nie jest 'ok'", JSON.stringify(x).slice(0, 80)); }
{ const x = G.sprawdzBezpieczenstwo({}); ok(x.poziom === "ok", "sprawdzBezpieczenstwo: brak objawów => ok"); }
ok(G.fmtTime(3725) === "1:02:05" || G.fmtTime(3725) === "1:02:05", "fmtTime(3725) = 1:02:05", G.fmtTime(3725));
finish(rep, { generatorPlik: GEN_PATH });
