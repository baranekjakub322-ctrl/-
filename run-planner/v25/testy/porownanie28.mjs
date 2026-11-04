// Test porównawczy jakości 28 planów: 4 dystanse x 7 deklarowanych częstotliwości. JEDEN stały profil; zmieniają się wyłącznie
// dystans docelowy i deklarowana liczba dni (czas docelowy skaluje się z dystansem: ta sama prognoza z VDOT x 1,03).
// OCENY 1-10 są HEURYSTYCZNE (jawne kryteria w testy/lib.mjs, funkcja score), a NIE wynikami badań naukowych.
import { mkInput, runAll, independentChecks, score, makeReporter, finish, G, GEN_PATH } from "./lib.mjs";
const rep = makeReporter("porownanie28"); const { ok } = rep;
const TYPES = [["5k", 5000], ["10k", 10000], ["half", 21097.5], ["marathon", 42195]];
const vd = G.vdotFrom(10000, 3120); // 10 km w 52:00
const rows = [];
for (const [type, dm] of TYPES) for (let days = 1; days <= 7; days++) {
  const target = Math.round(G.raceTimeFromVdot(dm, vd) * 1.03);
  const inp = mkInput({ type, days, level: "intermediate", age: 35, km: 35, longest: 14, today: "2026-11-02", raceDate: "2027-03-28", result: { distanceKm: 10, timeSec: 3120 }, targetTimeSec: target });
  const { res, wyjatek } = runAll(inp);
  ok(!wyjatek && res.ok, `${type}/${days}d: plan wygenerowany`, wyjatek || JSON.stringify(res && res.bledy));
  if (!res || !res.ok) continue;
  const sc = score(inp, res), c = sc.kontrola;
  rows.push({ dystans: type, zadeklarowane: days, rzeczywiste: c.metryki.maxRuns, szczytKm: c.metryki.peakKm, najdluzszy: c.metryki.peakLong, jakosciowe: c.metryki.nQuality, ostrzezenia: res.ostrzezenia.length, gotowosc: res.gotowosc.status, etykietaGotowosci: res.gotowosc.rozdzielenie.etykieta, problemy: c.problemy.map((p) => `${p.ciezar === "krytyczny" ? "KRYT " : ""}${p.kod}`).reduce((a, k) => { a[k] = (a[k] || 0) + 1; return a; }, {}), brakiDoDystansu: c.metryki.lackFinish, ocena: sc.ocena, powodyOceny: sc.powody, krytyczne: c.krytyczne });
}
ok(rows.length === 28, "wygenerowano dokładnie 28 planów", String(rows.length));
ok(rows.every((r) => r.krytyczne === 0), "żaden z 28 planów nie ma krytycznego naruszenia", JSON.stringify(rows.filter((r) => r.krytyczne).map((r) => r.dystans + "/" + r.zadeklarowane)));
ok(rows.every((r) => r.rzeczywiste <= r.zadeklarowane), "rzeczywista liczba treningów nie przekracza deklarowanej");
const avg = (a) => Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 100) / 100;
const perDist = {}, perFreq = {};
for (const r of rows) { (perDist[r.dystans] ||= []).push(r.ocena); (perFreq[r.zadeklarowane] ||= []).push(r.ocena); }
const sr = { dystans: Object.fromEntries(Object.entries(perDist).map(([k, v]) => [k, avg(v)])), czestotliwosc: Object.fromEntries(Object.entries(perFreq).map(([k, v]) => [k, avg(v)])), ogolnie: avg(rows.map((r) => r.ocena)) };
finish(rep, { generatorPlik: GEN_PATH, profil: "intermediate, 35 lat, 35 km/tydz., najdłuższy 14 km, 10 km w 52:00, start 2027-03-28, dostępne 7 dni", wiersze: rows, srednie: sr });
console.log(JSON.stringify(sr));
for (const r of rows) console.log(`${r.dystans.padEnd(8)} ${r.zadeklarowane}d -> ${r.rzeczywiste} | peak ${r.szczytKm} long ${r.najdluzszy} Q ${r.jakosciowe} warn ${r.ostrzezenia} | ${r.etykietaGotowosci} | ocena ${r.ocena} | ${Object.keys(r.problemy).join(",")}`);
