// Czy V20 nie pogarsza jakości innych dystansów? Te same scenariusze, ten sam niezależny miernik, V19 (baza/) kontra V20.
import { mkInput, independentChecks, score, makeReporter, finish, loadGen, GEN_PATH, addD } from "./lib.mjs";
const rep = makeReporter("porownanie_v19_v20"); const { ok } = rep;
const V19 = await loadGen("../baza/planGenerator_v19.js"), V20 = await loadGen("../baza/planGenerator_v20.js");
const LEV = ["beginner", "intermediate", "advanced"], TY = ["5k", "10k", "half", "marathon"], PR = [[6, 3], [20, 8], [40, 16], [65, 26]], DAYS = [1, 2, 3, 4, 5, 6, 7], WK = [6, 12, 20];
const agg = {}; let n = 0;
for (const level of LEV) for (const type of TY) for (const days of DAYS) for (const [km, longest] of PR) for (const weeks of WK) {
  const inp = mkInput({ level, type, days, km, longest, weeks, raceDow: n % 7, today: addD("2026-11-02", n % 7), result: { distanceKm: 10, timeSec: 3300 } }); n++;
  for (const [nm, G] of [["v19", V19], ["v20", V20]]) {
    const res = G.generatePlan(inp); const sc = score(inp, res);
    const a = (agg[type] ||= { v19: { s: 0, n: 0, krytyczne: 0, planyKryt: 0, ostrz: 0 }, v20: { s: 0, n: 0, krytyczne: 0, planyKryt: 0, ostrz: 0 } })[nm];
    a.s += sc.ocena; a.n++; if (sc.kontrola) { a.krytyczne += sc.kontrola.krytyczne; a.planyKryt += sc.kontrola.krytyczne ? 1 : 0; a.ostrz += sc.kontrola.ostrzezenia; }
  }
}
const out = {};
for (const t of TY) { const a = agg[t]; out[t] = { v19: { srednia: +(a.v19.s / a.v19.n).toFixed(3), planyZKrytycznym: a.v19.planyKryt, krytyczne: a.v19.krytyczne, ostrzezenia: a.v19.ostrz }, v20: { srednia: +(a.v20.s / a.v20.n).toFixed(3), planyZKrytycznym: a.v20.planyKryt, krytyczne: a.v20.krytyczne, ostrzezenia: a.v20.ostrz }, scenariuszy: a.v20.n };
  ok(out[t].v20.srednia >= out[t].v19.srednia - 0.02, `${t}: średnia ocena V20 (${out[t].v20.srednia}) nie niższa niż V19 (${out[t].v19.srednia})`);
  ok(out[t].v20.krytyczne <= out[t].v19.krytyczne, `${t}: krytyczne V20 (${out[t].v20.krytyczne}) <= V19 (${out[t].v19.krytyczne})`);
  ok(out[t].v20.ostrzezenia <= out[t].v19.ostrzezenia * 1.05, `${t}: ostrzeżenia miernika V20 (${out[t].v20.ostrzezenia}) nie wzrosły o >5% względem V19 (${out[t].v19.ostrzezenia})`); }
finish(rep, { generatorPlik: GEN_PATH, scenariuszy: n, wyniki: out });
console.log(JSON.stringify(out));
