// Kombinacje dni dostępnych i niedostępnych: wszystkie 127 niepustych podzbiorów dni x deklarowana liczba dni x dystans, plus wszystkie 49 par (dzień startu, dzień zawodów).
import { mkInput, runAll, independentChecks, makeReporter, finish, dowOf, addD, mondayOf } from "./lib.mjs";
const rep = makeReporter("dostepnosc"); const { ok } = rep;
let n = 0, bad = { wyjatek: 0, nieOk: 0, krytyczne: 0, niedostepny: 0, wiecejNizDostepne: 0, wiecejNizDekl: 0, przerwyBezPowodu: 0 }; const ex = [];
for (let mask = 1; mask < 128; mask++) {
  const avail = [0, 1, 2, 3, 4, 5, 6].filter((d) => mask & (1 << d));
  for (const type of ["5k", "half"]) for (const days of [2, 4, 6]) {
    const inp = mkInput({ type, level: "intermediate", availableDays: avail, days, km: 30, longest: 12, weeks: 12, raceDow: avail[0], today: addD("2026-11-02", mask % 7), result: { distanceKm: 10, timeSec: 3300 } });
    const { res, wyjatek } = runAll(inp); n++;
    if (wyjatek) { bad.wyjatek++; continue; }
    if (!res.ok) { bad.nieOk++; ex.push(JSON.stringify(res.bledy).slice(0, 80)); continue; }
    const c = independentChecks(inp, res);
    bad.krytyczne += c.krytyczne ? 1 : 0;
    for (const p of c.problemy) { if (p.kod === "DZIEN_NIEDOSTEPNY") bad.niedostepny++; if (p.kod === "WIECEJ_BIEGOW_NIZ_DOSTEPNYCH_DNI") bad.wiecejNizDostepne++; if (p.kod === "WIECEJ_BIEGOW_NIZ_DEKLAROWANO" ) bad.wiecejNizDekl++; }
    if (c.krytyczne && ex.length < 5) ex.push(JSON.stringify({ avail, type, days }) + " " + JSON.stringify(c.problemy.filter((p) => p.ciezar === "krytyczny").slice(0, 2)));
    // zbyt długa przerwa bez powodu w dostępności: audyt wewnętrzny nie może jej zgłaszać jako DLUGA_PRZERWA (tylko jako sugestię z dostępności)
    if (res.kontrola.kodyBledow && res.kontrola.kodyBledow.DLUGA_PRZERWA) bad.przerwyBezPowodu++;
    // dni w planie wyłącznie z dostępnych
    for (const t of res.treningi) if (!avail.includes(dowOf(t.data))) { bad.niedostepny++; break; }
  }
}
ok(n === 127 * 6, `przetestowano ${n} kombinacji (127 podzbiorów x 2 dystanse x 3 deklaracje)`);
for (const [k, v] of Object.entries(bad)) ok(v === 0, `kombinacje dni: ${k} = ${v}`, ex.join(" | "));
// 49 par dzień startu / dzień zawodów dla każdego dystansu
let pairs = 0, pc = 0;
for (const type of ["5k", "10k", "half", "marathon"]) for (let o = 0; o < 7; o++) for (let r = 0; r < 7; r++) {
  const inp = mkInput({ type, level: "intermediate", days: 4, km: 35, longest: 14, weeks: 14, raceDow: r, today: addD("2026-11-02", o), result: { distanceKm: 10, timeSec: 3300 } });
  const { res } = runAll(inp); pairs++;
  if (res && res.ok) { const c = independentChecks(inp, res); if (c.krytyczne === 0) pc++; }
}
ok(pairs === 196 && pc === pairs, `196 par (start x zawody x dystans): bez krytycznych ${pc}/${pairs}`);
finish(rep, { kombinacji: n, pary: pairs });
