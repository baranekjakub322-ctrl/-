// V20 (baza/) kontra V21, te same scenariusze, ta sama ocena V21 (wiele kategorii, bez nasycenia) ORAZ stary miernik V20.
import { mkInput, independentChecks, scoreV21, score, makeReporter, finish, loadGen, GEN_PATH, addD } from "./lib.mjs";
const rep = makeReporter("porownanie_v20_v21"); const { ok } = rep;
const V20 = await loadGen("../baza/planGenerator_v20.js"), V21 = await loadGen("../planGenerator_v21.js");
const LEV = ["beginner", "intermediate", "advanced"], TY = ["5k", "10k", "half", "marathon"], PR = [[6, 3], [20, 8], [40, 16], [65, 26]], DAYS = [1, 2, 3, 4, 5, 6, 7], WK = [6, 12, 20];
const agg = {}; let n = 0;
const KODY = ["REGENERACJA_ZA_DLUGA", "UDZIAL_DLUGIEGO", "DLUGA_PRZERWA", "BIEG_ZA_KROTKI", "TAPER_PLYTKI"];
for (const level of LEV) for (const type of TY) for (const days of DAYS) for (const [km, longest] of PR) for (const weeks of WK) {
  const inp = mkInput({ level, type, days, km, longest, weeks, raceDow: n % 7, today: addD("2026-11-02", n % 7), result: { distanceKm: 10, timeSec: 3300 } }); n++;
  for (const [nm, G] of [["v20", V20], ["v21", V21]]) {
    const res = G.generatePlan(inp); const c = independentChecks(inp, res); const s2 = scoreV21(inp, res, c), s1 = score(inp, res);
    const a = ((agg[type] ||= {})[nm] ||= { s: 0, s20: 0, n: 0, krytyczne: 0, planyKryt: 0, ostrz: 0, kody: {}, bezp: 0 });
    a.s += s2.ogolna; a.s20 += s1.ocena; a.n++; a.bezp += s2.kategorie.bezpieczenstwo || 0; a.krytyczne += c.krytyczne || 0; a.planyKryt += c.krytyczne ? 1 : 0; a.ostrz += c.ostrzezenia || 0;
    for (const p of c.problemy || []) a.kody[p.kod] = (a.kody[p.kod] || 0) + 1;
  }
}
const out = {};
for (const t of TY) {
  const f = (a) => ({ ocenaV21: +(a.s / a.n).toFixed(3), ocenaStarym: +(a.s20 / a.n).toFixed(3), bezpieczenstwo: +(a.bezp / a.n).toFixed(3), planyZKrytycznym: a.planyKryt, krytyczne: a.krytyczne, ostrzezenia: a.ostrz, kody: a.kody });
  out[t] = { v20: f(agg[t].v20), v21: f(agg[t].v21) };
  ok(out[t].v21.ocenaV21 >= out[t].v20.ocenaV21, `${t}: ocena V21 (${out[t].v21.ocenaV21}) nie niższa niż V20 (${out[t].v20.ocenaV21})`);
  ok(out[t].v21.krytyczne <= out[t].v20.krytyczne, `${t}: krytyczne V21 (${out[t].v21.krytyczne}) <= V20 (${out[t].v20.krytyczne})`);
  ok(out[t].v21.ostrzezenia <= out[t].v20.ostrzezenia, `${t}: ostrzeżenia V21 (${out[t].v21.ostrzezenia}) <= V20 (${out[t].v20.ostrzezenia})`);
  for (const k of KODY) ok((out[t].v21.kody[k] || 0) <= (out[t].v20.kody[k] || 0), `${t}: ${k} V21 (${out[t].v21.kody[k] || 0}) <= V20 (${out[t].v20.kody[k] || 0})`);
}
finish(rep, { generatorPlik: GEN_PATH, scenariuszy: n, wyniki: out });
console.log(JSON.stringify(Object.fromEntries(TY.map((t) => [t, { v20: out[t].v20.ocenaV21, v21: out[t].v21.ocenaV21 }]))));
