// Testy jakościowe V21: reprezentatywna siatka planów + asercje strukturalne (czy plan ma sens dla biegacza), testy oceny i trimWeekRuns.
import { mkInput, runAll, weeksOf, independentChecks, scoreV21, makeReporter, finish, addD, dowOf, loadGen, G } from "./lib.mjs";

const rep = makeReporter("jakosciowe"); const { ok } = rep;
const LEV = ["beginner", "intermediate", "advanced"], TY = ["5k", "10k", "half", "marathon"], PR = [[12, 6], [45, 18]], WK = [10, 18];
const cnt = {}; const bump = (k, ex) => { (cnt[k] ||= { n: 0, ex: [] }).n++; if (cnt[k].ex.length < 2) cnt[k].ex.push(ex); };
const REC_CAP = { beginner: 35, intermediate: 45, advanced: 60 };
const effL = (l, km, lr) => (l === "advanced" && km < 20 ? "intermediate" : l === "beginner" && km >= 35 && lr >= 14 ? "intermediate" : l);
let n = 0, maxScoreDiff = 0;
for (const level of LEV) for (const type of TY) for (const days of [1, 2, 3, 4, 5, 6, 7]) for (const [km, longest] of PR) for (const weeks of WK) {
  const inp = mkInput({ level, type, days, km, longest, weeks, raceDow: n % 7, today: addD("2026-11-02", n % 7), result: { distanceKm: 10, timeSec: 3400 } }); n++;
  const { res } = runAll(inp); const tag = `${level}/${type}/${days}d/${km}km/${weeks}w`;
  if (!res.ok) { bump("plan_nie_ok", tag); continue; }
  const byDate = new Map(res.treningi.map((t) => [t.data, t]));
  const hard = (t) => t && ["tempo", "interwaly", "podbiegi", "tempo_startowe", "dlugi", "test", "start", "ostrzenie"].includes(t.podtyp);
  let consecRec = 0;
  for (const t of res.treningi) {
    if (t.podtyp === "regeneracja") {
      const dr = Math.round((Date.parse(inp.goal.raceDate) - Date.parse(t.data)) / 864e5);
      if (t.czas_min > REC_CAP[effL(level, km, longest)]) bump("regeneracja_za_dluga_dla_poziomu", `${tag} ${t.data} ${t.czas_min}`);
      if (dr > 1 && !hard(byDate.get(addD(t.data, -1)))) bump("regeneracja_bez_mocnej_jednostki", `${tag} ${t.data}`);
      consecRec++;
      const nx = byDate.get(addD(t.data, 1)); if (nx && nx.podtyp === "regeneracja" && byDate.get(addD(t.data, 2))?.podtyp === "regeneracja") bump("trzy_regeneracje_pod_rzad", tag);
    }
    if (t.dystans_km < 2.5 && !["marszobieg"].includes(t.podtyp) && t.podtyp !== "regeneracja" && t.podtyp !== "sila" && t.podtyp !== "cross" && t.podtyp !== "mobilnosc") bump("bieg_krotszy_niz_2_5km", `${tag} ${t.data} ${t.dystans_km}`);
    if (hard(t) && hard(byDate.get(addD(t.data, 1))) && t.podtyp !== "ostrzenie" && byDate.get(addD(t.data, 1)).podtyp !== "ostrzenie") bump("dwa_mocne_dni_pod_rzad", `${tag} ${t.data}`);
  }
  const c = independentChecks(inp, res);
  if (c.krytyczne) bump("naruszenia_krytyczne", tag);
  for (const p of c.problemy) if (["REGENERACJA_ZA_DLUGA", "DLUGA_PRZERWA", "UDZIAL_DLUGIEGO", "BIEG_ZA_KROTKI", "REGENERACJA_POZIOM", "REGENERACJA_BEZ_MOCNEGO"].includes(p.kod)) bump("kod_" + p.kod, tag);
  // struktura 2 dni: dokładnie 2 biegi w pełnych tygodniach, najwyżej 1 akcent, długi bieg nie jest jedynym bodźcem w tygodniu bez planu
  const W = weeksOf(res).slice(1, -1);
  if (days === 2) for (const w of W) { if (w.n > 2) bump("2dni_wiecej_niz_2_biegi", tag); if (w.n === 2 && w.longKm / w.km > 0.66 && !w.deload) bump("2dni_dlugi_ponad_66proc", `${tag} ${(w.longKm / w.km).toFixed(2)}`); }
  if (days === 1) for (const w of weeksOf(res)) if (w.n > 1) bump("1dzien_wiecej_niz_1_bieg", tag);
  // kategorie oceny w zakresie i wynik ogólny nie wyższy niż bezpieczeństwo + 2
  const s = scoreV21(inp, res, c);
  if (s.ogolna > s.kategorie.bezpieczenstwo + 2 + 1e-9 || Object.values(s.kategorie).some((v) => v < 1 || v > 10)) bump("ocena_poza_zakresem", tag);
  // wykonalność: pole istnieje; maraton ≤2 dni zawsze niewykonalny
  if (!res.wykonalnosc || !["pelna", "ograniczona", "niewykonalna"].includes(res.wykonalnosc.poziom)) bump("brak_wykonalnosci", tag);
  if (type === "marathon" && days <= 2 && res.wykonalnosc.poziom !== "niewykonalna") bump("maraton_2dni_nie_oznaczony", tag);
  // spójność taperingu 5 km vs maraton: ostatni tydzień przed startem krótszy niż szczyt
  const last = weeksOf(res).slice(-2, -1)[0], pk = Math.max(...weeksOf(res).map((w) => w.km));
  if (last && (type === "half" || type === "marathon") && pk > 25 && last.km > 0.85 * pk && inp.goal.raceDate) bump("brak_taperingu_przed_startem", `${tag} ${last.km}/${pk}`);
}
ok(n === 3 * 4 * 7 * 2 * 2, `siatka jakościowa: ${n} planów`);
for (const k of ["plan_nie_ok", "regeneracja_za_dluga_dla_poziomu", "regeneracja_bez_mocnej_jednostki", "trzy_regeneracje_pod_rzad", "bieg_krotszy_niz_2_5km", "dwa_mocne_dni_pod_rzad", "naruszenia_krytyczne", "kod_REGENERACJA_ZA_DLUGA", "kod_DLUGA_PRZERWA", "kod_UDZIAL_DLUGIEGO", "kod_BIEG_ZA_KROTKI", "kod_REGENERACJA_POZIOM", "kod_REGENERACJA_BEZ_MOCNEGO", "2dni_wiecej_niz_2_biegi", "2dni_dlugi_ponad_66proc", "1dzien_wiecej_niz_1_bieg", "ocena_poza_zakresem", "brak_wykonalnosci", "maraton_2dni_nie_oznaczony", "brak_taperingu_przed_startem"])
  ok(!(cnt[k] && cnt[k].n), `jakość: ${k} = ${cnt[k] ? cnt[k].n : 0}`, cnt[k] ? cnt[k].ex.join(" | ") : "");

// --- ocena V21: brak nasycenia kar, monotoniczność, rozdzielenie bezpieczeństwa i jakości
{
  const inp = mkInput({ level: "intermediate", type: "10k", days: 4, km: 30, longest: 12, weeks: 12, result: { distanceKm: 10, timeSec: 3400 } });
  const { res } = runAll(inp); const c0 = independentChecks(inp, res);
  const mk = (k, kod, ciezar) => ({ ...c0, problemy: [...c0.problemy, ...Array.from({ length: k }, (_, i) => ({ kod, ciezar, msg: "t" + i }))] });
  const sc = (k, kod, ciezar) => scoreV21(inp, res, mk(k, kod, ciezar)).ogolna;
  const w = [0, 1, 10, 100, 1000].map((k) => sc(k, "REGENERACJA_ZA_DLUGA", "ostrzezenie"));
  ok(w.slice(0, 4).every((v, i) => i === 0 || v < w[i - 1]) && w[4] <= w[3], "ocena: 0 < 1 < 10 < 100 ostrzeżeń = ściśle niższa ocena (V20 nasycała się po kilku), tysiące nie poprawiają wyniku", w.join(" > "));
  ok(w[1] >= 9, "ocena: pojedyncze ostrzeżenie prawie nie zmienia oceny", String(w[1]));
  ok(w[4] <= 2, "ocena: tysiąc ostrzeżeń = ocena ≤ 2 (V20: kara max 2 pkt)", String(w[4]));
  const crit = scoreV21(inp, res, mk(1, "WZROST_KM", "krytyczny"));
  ok(crit.ogolna <= 6 && crit.kategorie.bezpieczenstwo <= 4, "ocena: jedno naruszenie krytyczne obniża bezpieczeństwo do ≤4 i ocenę ogólną do ≤6", JSON.stringify(crit.kategorie));
  const warnOnly = scoreV21(inp, res, mk(30, "BIEG_ZA_KROTKI", "ostrzezenie"));
  ok(warnOnly.kategorie.bezpieczenstwo === 10 && warnOnly.kategorie.harmonogram < 9, "ocena: ostrzeżenia harmonogramu nie psują oceny bezpieczeństwa (rozdzielenie kategorii)", JSON.stringify(warnOnly.kategorie));
  const mixed = scoreV21(inp, res, mk(3, "WZROST_KM", "krytyczny"));
  ok(mixed.ogolna < sc(0, "X", "ostrzezenie"), "ocena: krytyczne obniżają ocenę ogólną");
}
// --- trimWeekRuns: skracanie, brak zdejmowania bez minRuns, zdejmowanie dodatkowego biegu z minRuns
{
  const run = (podtyp, km, d) => ({ data: d, podtyp, typ: podtyp === "dlugi" ? "Długi bieg" : "Bieg spokojny Z2", dystans_km: km, czas_min: km * 6, kroki: [{ etap: podtyp === "dlugi" ? "Część spokojna" : "Bieg spokojny", dystans_km: km, tempo: "6:00-6:30" }], opis: "" });
  const mkWk = () => [run("latwy", 3, "2026-12-01"), run("latwy", 3, "2026-12-03"), run("latwy", 3, "2026-12-05"), run("dlugi", 4, "2026-12-06")];
  const a = mkWk(); const r1 = G.trimWeekRuns(a, 12, false);
  ok(r1 === false && a.length === 4, "trimWeekRuns bez minRuns: nie usuwa biegów, zgłasza niepowodzenie (13 > 12)");
  const b = mkWk(); const dropped = []; const r2 = G.trimWeekRuns(b, 12, false, { minRuns: 3, dropped });
  ok(r2 === true && b.length === 3 && dropped.length === 1, "trimWeekRuns z minRuns=3: zdejmuje dokładnie jeden dodatkowy bieg", `${b.length} biegów, zdjęto ${dropped}`);
  const c = mkWk(); const r3 = G.trimWeekRuns(c, 5, false, { minRuns: 3 });
  ok(r3 === false && c.length >= 3, "trimWeekRuns: nigdy poniżej minRuns");
  const d = [run("latwy", 8, "2026-12-01"), run("latwy", 8, "2026-12-03"), run("dlugi", 14, "2026-12-06")];
  ok(G.trimWeekRuns(d, 24, true) === true && d.reduce((x, t) => x + t.dystans_km, 0) <= 24, "trimWeekRuns: skracanie biegów do limitu działa");
}
// --- regeneracja: konstrukcja – bieg dzień po długim jest krótki; dalsze biegi spokojne nie są „regeneracją"
{
  const inp = mkInput({ level: "intermediate", type: "10k", days: 5, km: 40, longest: 16, weeks: 14, raceDow: 0, result: { distanceKm: 10, timeSec: 3300 } });
  const { res } = runAll(inp); const rec = res.treningi.filter((t) => t.podtyp === "regeneracja"), easy = res.treningi.filter((t) => t.podtyp === "latwy");
  ok(rec.length > 0 && Math.max(...rec.map((t) => t.czas_min)) <= 45, "regeneracja: istnieje i ≤45 min dla średniozaawansowanego", String(Math.max(...rec.map((t) => t.czas_min))));
  ok(easy.length > rec.length, "regeneracja: biegów spokojnych więcej niż regeneracyjnych (regeneracja to wyjątek, nie reguła)", `${easy.length} vs ${rec.length}`);
  const adv = runAll(mkInput({ level: "advanced", type: "marathon", days: 6, km: 70, longest: 26, weeks: 20, raceDow: 0, result: { distanceKm: 10, timeSec: 2700 } })).res;
  const mrec = Math.max(...adv.treningi.filter((t) => t.podtyp === "regeneracja").map((t) => t.czas_min));
  ok(mrec <= 60 && mrec > Math.max(...rec.map((t) => t.czas_min)) - 1, "regeneracja: limit zależy od poziomu (zaawansowany ma dłuższy limit niż średniozaawansowany)", `${mrec}`);
  const be = runAll(mkInput({ level: "beginner", type: "5k", days: 4, km: 12, longest: 6, weeks: 12, raceDow: 0, result: false })).res;
  const brec = Math.max(0, ...be.treningi.filter((t) => t.podtyp === "regeneracja").map((t) => t.czas_min));
  ok(brec <= 35, "regeneracja: początkujący ≤35 min", String(brec));
}
finish(rep, { planow: n, liczniki: Object.fromEntries(Object.entries(cnt).map(([k, v]) => [k, v.n])) });
