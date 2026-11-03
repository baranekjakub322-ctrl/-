// Sweep V20/V21 (V21: dodatkowo ocena wielokategorialna i tabele wg dystansu oraz częstotliwości): PEŁNA siatka scenariuszy (bez próbkowania "co n-ta kombinacja") + test, że siatka faktycznie obejmuje to, co deklaruje.
// V19 brała "deterministyczną próbkę co 3. kombinacji" i podawała 700 scenariuszy; tutaj liczba deklarowana = iloczyn osi
// = liczba faktycznie wykonanych unikalnych scenariuszy (sprawdzane asercją), a każdy dzień tygodnia startu planu (today)
// i dzień zawodów występują w każdej komórce (typ x poziom) -- też sprawdzane asercją.
import { mkInput, runAll, independentChecks, scoreV21, makeReporter, finish, dowOf, addD, GEN_PATH } from "./lib.mjs";
import crypto from "node:crypto";

const LEVELS = ["beginner", "intermediate", "advanced"];
const TYPES = ["5k", "10k", "half", "marathon"];
const DAYS = [1, 2, 3, 4, 5, 6, 7];
const PROFILES = [[6, 3], [20, 8], [40, 16], [65, 26]]; // [kmTygodniowo, najdluzszyBieg]
const WEEKS = [5, 9, 14, 22];
const TODAY_BASE = "2026-11-02"; // poniedzialek; today = baza + offset 0..6 => wszystkie dni tygodnia
const rep = makeReporter("sweep");
const { ok } = rep;

const declared = LEVELS.length * TYPES.length * DAYS.length * PROFILES.length * WEEKS.length * 7;
const seen = new Set();
const cover = { todayDow: {}, raceDow: {}, pair: {}, cellToday: {}, cellRace: {} };
const codes = {}; const crit = []; let executed = 0, exceptions = 0, notOk = 0, withCrit = 0, warnTotal = 0, blind = 0, critTotal = 0;
const hash = crypto.createHash("sha256");
const tab = { dystans: {}, czestotliwosc: {} }; const acc = (grp, key, sc, c) => { const a = (tab[grp][key] ||= { n: 0, ogolna: 0, bezp: 0, krytyczne: 0, ostrzezenia: 0, kat: {} }); a.n++; a.ogolna += sc.ogolna; a.bezp += sc.kategorie.bezpieczenstwo; a.krytyczne += c.krytyczne; a.ostrzezenia += c.ostrzezenia; for (const [kk, v] of Object.entries(sc.kategorie)) a.kat[kk] = (a.kat[kk] || 0) + v; };
let k = 0; // licznik komorek (bez dnia startu) => rotacja dnia zawodow
for (const level of LEVELS) for (const type of TYPES) for (const days of DAYS) for (const [km, longest] of PROFILES) for (const weeks of WEEKS) {
  const raceDow = k % 7; k++;
  for (let off = 0; off < 7; off++) {
    const today = addD(TODAY_BASE, off);
    const o = { level, type, days, km, longest, weeks, raceDow, today, result: { distanceKm: 10, timeSec: 3300 } };
    const key = JSON.stringify([level, type, days, km, longest, weeks, raceDow, today]);
    seen.add(key);
    const inp = mkInput(o);
    const td = dowOf(today), rd = dowOf(inp.goal.raceDate);
    cover.todayDow[td] = (cover.todayDow[td] || 0) + 1; cover.raceDow[rd] = (cover.raceDow[rd] || 0) + 1;
    cover.pair[td + "-" + rd] = (cover.pair[td + "-" + rd] || 0) + 1;
    const cell = type + "/" + level;
    (cover.cellToday[cell] ||= {})[td] = 1; (cover.cellRace[cell] ||= {})[rd] = 1;
    const { res, wyjatek } = runAll(inp); executed++;
    if (wyjatek) { exceptions++; crit.push({ key, kod: "WYJATEK", msg: wyjatek.slice(0, 150) }); continue; }
    if (!res.ok) { notOk++; crit.push({ key, kod: "OK_FALSE", msg: JSON.stringify(res.bledy || res.komunikat).slice(0, 150) }); continue; }
    const c = independentChecks(inp, res);
    hash.update(JSON.stringify(res.treningi.map((t) => [t.data, t.podtyp, t.dystans_km])));
    const sc = scoreV21(inp, res, c); acc("dystans", type, sc, c); acc("czestotliwosc", String(days), sc, c);
    warnTotal += c.ostrzezenia; critTotal += c.krytyczne; if (c.krytyczne) withCrit++;
    blind += c.metryki.slepaPlamkaAudytu || 0;
    for (const p of c.problemy) { const kk = p.kod + ":" + p.ciezar; codes[kk] = (codes[kk] || 0) + 1; if (p.ciezar === "krytyczny" && crit.length < 60) crit.push({ key, kod: p.kod, msg: p.msg }); }
  }
}

ok(executed === declared, `liczba wykonanych scenariuszy (${executed}) == deklarowana (${declared})`);
ok(seen.size === declared, `unikalnych scenariuszy ${seen.size} == deklarowana ${declared}`);
ok(Object.keys(cover.todayDow).length === 7, "wszystkie 7 dni tygodnia jako dzień startu planu", JSON.stringify(cover.todayDow));
ok(Object.keys(cover.raceDow).length === 7, "wszystkie 7 dni tygodnia jako dzień zawodów", JSON.stringify(cover.raceDow));
ok(Object.keys(cover.pair).length === 49, "pokryte wszystkie 49 par (dzień startu planu, dzień zawodów)", String(Object.keys(cover.pair).length));
for (const cell of Object.keys(cover.cellToday)) {
  ok(Object.keys(cover.cellToday[cell]).length === 7 && Object.keys(cover.cellRace[cell]).length === 7, `komórka ${cell}: 7 dni startu planu i 7 dni zawodów`, `${Object.keys(cover.cellToday[cell]).length}/${Object.keys(cover.cellRace[cell]).length}`);
}
ok(exceptions === 0, "brak wyjątków", String(exceptions));
ok(notOk === 0, "brak planów ok:false dla poprawnych danych", String(notOk));
ok(critTotal === 0, `brak krytycznych naruszeń niezależnych niezmienników (${withCrit} planów z krytycznym, ${critTotal} naruszeń)`, JSON.stringify(crit.slice(0, 8)));

// powtarzalność: ten sam podzbiór dwa razy => identyczny skrót
function subsetHash() {
  const h = crypto.createHash("sha256");
  for (let i = 0; i < 120; i++) {
    const o = { level: LEVELS[i % 3], type: TYPES[i % 4], days: DAYS[i % 7], km: PROFILES[i % 4][0], longest: PROFILES[i % 4][1], weeks: WEEKS[i % 4], raceDow: i % 7, today: addD(TODAY_BASE, i % 7), result: { distanceKm: 10, timeSec: 3300 } };
    const { res } = runAll(mkInput(o)); h.update(JSON.stringify(res));
  }
  return h.digest("hex");
}
ok(subsetHash() === subsetHash(), "powtarzalność: dwukrotne uruchomienie 120 scenariuszy daje identyczne wyniki");

const fin = (g) => Object.fromEntries(Object.entries(tab[g]).map(([kk, a]) => [kk, { scenariuszy: a.n, ocenaOgolna: +(a.ogolna / a.n).toFixed(2), bezpieczenstwo: +(a.bezp / a.n).toFixed(2), kategorie: Object.fromEntries(Object.entries(a.kat).map(([x, v]) => [x, +(v / a.n).toFixed(2)])), naruszeniaKrytyczne: a.krytyczne, ostrzezenia: a.ostrzezenia }]));
finish(rep, { wynikiWgDystansu: fin("dystans"), wynikiWgCzestotliwosci: fin("czestotliwosc"),  generatorPlik: GEN_PATH, deklarowanaLiczbaScenariuszy: declared, wykonane: executed, unikalne: seen.size, planyZKrytycznymNaruszeniem: withCrit, krytyczneNaruszenia: critTotal, ostrzezeniaMiernika: warnTotal, slepePlamkiAudytuWewnetrznego: blind, kodyProblemow: codes, przykladyKrytycznych: crit.slice(0, 40), pokrycie: { todayDow: cover.todayDow, raceDow: cover.raceDow }, skrotWynikow: hash.digest("hex") });
