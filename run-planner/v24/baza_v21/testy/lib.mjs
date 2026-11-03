// Niezależny miernik jakości planu. NIE używa auditPlan ani pola `kontrola` generatora do oceny (pole kontrola jest czytane
// wyłącznie do statystyki "ślepych plamek" audytu wewnętrznego). Progi wynikają z zasad treningowych opisanych przy każdej regule
// i NIE są dopasowywane do wyników generatora. Generator wybiera plik zmienną GEN (domyślnie ../planGenerator_v21.js).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GEN = process.env.GEN ? path.resolve(process.cwd(), process.env.GEN) : path.join(HERE, "..", "planGenerator_v21.js");
export const GEN_PATH = GEN;
export const G = await import(pathToFileURL(GEN).href);
export const generatePlan = G.generatePlan;

const DAY = 86400000;
const P = (s) => Date.parse(s + "T00:00:00Z");
export const dowOf = (s) => new Date(P(s)).getUTCDay(); // 0 = niedziela
export const addD = (s, n) => new Date(P(s) + n * DAY).toISOString().slice(0, 10);
export const diffD = (a, b) => Math.round((P(b) - P(a)) / DAY);
export const mondayOf = (s) => addD(s, -((dowOf(s) + 6) % 7));
export const DIST_KM = { "5k": 5, "10k": 10, half: 21.0975, marathon: 42.195 };

const QUALITY = new Set(["tempo", "interwaly", "podbiegi", "tempo_startowe", "test"]);
const AUX = new Set(["sila", "cross"]);
export const isRun = (t) => !AUX.has(t.podtyp) && t.podtyp !== "start" && Number(t.dystans_km) > 0;

// ---------- budowa wejścia ----------
export function mkInput(o = {}) {
  const today = o.today || "2026-11-02";
  const weeks = o.weeks ?? 16;
  const type = o.type || "half";
  const raceDow = o.raceDow ?? 0;
  let raceDate = o.raceDate;
  if (raceDate === undefined && o.noRace !== true) {
    // data zawodów: najbliższy dzień tygodnia raceDow co najmniej `weeks` tygodni po dniu startu
    const base = addD(today, weeks * 7);
    raceDate = addD(base, ((raceDow - dowOf(base)) + 7) % 7);
  }
  const inp = {
    today, age: o.age ?? 35, level: o.level || "intermediate",
    availableDays: o.availableDays || [0, 1, 2, 3, 4, 5, 6],
    daysPerWeek: o.days ?? 4,
    currentWeeklyKm: o.km ?? 30, longestRecentRun: o.longest ?? 12,
    goal: raceDate ? { type, raceDate } : { type },
  };
  if (!raceDate) inp.weeks = weeks;
  if (o.result !== false && o.result !== undefined) inp.bestResult = o.result;
  if (o.hrMax) inp.hrMax = o.hrMax;
  for (const k of ["maxMinutes", "maxMinutesWeekday", "maxMinutesWeekend", "injuries", "historiaKontuzji", "breakDays", "gender", "records", "hrRest", "targetTimeSec", "trzymajCel"]) {
    if (o[k] !== undefined) { if (k === "targetTimeSec") inp.goal.targetTimeSec = o[k]; else inp[k] = o[k]; }
  }
  if (o.extra) Object.assign(inp, o.extra);
  return inp;
}

// ---------- agregacja tygodni (własna, z listy treningów) ----------
export function weeksOf(res) {
  const m = new Map();
  for (const t of res.treningi || []) {
    const mon = mondayOf(t.data);
    if (!m.has(mon)) m.set(mon, { mon, tr: [] });
    m.get(mon).tr.push(t);
  }
  const arr = [...m.values()].sort((a, b) => (a.mon < b.mon ? -1 : 1));
  for (const w of arr) {
    const runs = w.tr.filter(isRun);
    w.runs = runs;
    w.n = runs.length;
    w.km = runs.reduce((a, t) => a + Number(t.dystans_km), 0);
    w.longKm = Math.max(0, ...runs.filter((t) => t.podtyp === "dlugi").map((t) => Number(t.dystans_km)));
    w.nQ = runs.filter((t) => QUALITY.has(t.podtyp)).length;
    w.deload = w.tr.some((t) => t.odciazenie === true);
  }
  return arr;
}

const LONG_SHARE = { 2: 0.60, 3: 0.50, 4: 0.44, 5: 0.40, 6: 0.36, 7: 0.33 };
const DIST_SHARE_BONUS = { "5k": 0, "10k": 0, half: 0.02, marathon: 0.04, health: 0 };
const Q_CAP = { beginner: 1, intermediate: 2, advanced: 2 };
const TAPER_LAST = { "5k": 0.70, "10k": 0.65, half: 0.60, marathon: 0.55 };
const BIG_LONG_GAP = { "5k": 3, "10k": 5, half: 10, marathon: 14 };
const BIG_LONG_FRAC = { "5k": 1.0, "10k": 1.0, half: 0.6, marathon: 0.6 }; // ulamek dystansu zawodow uznawany za "duzy" dlugi bieg
const LONG_MAX_MIN = { "5k": 105, "10k": 135, half: 165, marathon: 215 };
// minima przygotowania do UKOŃCZENIA dystansu (heurystyka niezależna od generatora); tolerancja 5% na zaokrąglenia do pełnych km (stosowana przy porównaniu)
export const MIN_FINISH = {
  "5k": { runs: 2, long: 5, km: 12, weeks: 6 },
  "10k": { runs: 2, long: 8, km: 20, weeks: 8 },
  half: { runs: 3, long: 14, km: 28, weeks: 10 },
  marathon: { runs: 3, long: 28, km: 42, weeks: 14 },
};
// minima przygotowania do KONKRETNEGO WYNIKU (wymaga też wiarygodnego wyniku odniesienia)
export const MIN_RESULT = {
  "5k": { runs: 3, long: 7, km: 18, weeks: 8 },
  "10k": { runs: 3, long: 11, km: 26, weeks: 10 },
  half: { runs: 3, long: 17, km: 32, weeks: 12 },
  marathon: { runs: 4, long: 30, km: 50, weeks: 16 },
};

const r1 = (x) => Math.round(x * 10) / 10;

// ---------- główna funkcja oceny ----------
export function independentChecks(inp, res) {
  const out = [];
  const add = (kod, ciezar, msg) => out.push({ kod, ciezar, msg });
  if (!res || res.ok !== true) return { problemy: [], tygodnie: [], metryki: null, pominiety: true };
  const type = inp.goal && inp.goal.type;
  const race = inp.goal && inp.goal.raceDate;
  const today = inp.today;
  // poziom efektywny wg jawnie komunikowanej reguły generatora (korekta poziomu do kilometrażu); niezależna od auditPlan
  let level = ["beginner", "intermediate", "advanced"].includes(inp.level) ? inp.level : "beginner";
  const cwL = Number(inp.currentWeeklyKm) || 0, lrL = Number(inp.longestRecentRun) || 0;
  const cwEff = inp.breakDays >= 56 ? cwL * 0.4 : inp.breakDays >= 28 ? cwL * 0.5 : inp.breakDays >= 14 ? cwL * 0.65 : cwL;
  if (level === "advanced" && cwEff < 20) level = "intermediate";
  else if (level === "beginner" && cwEff >= 35 && lrL >= 14 && !inp.injuries) level = "intermediate";
  const W = weeksOf(res);
  const tr = res.treningi || [];
  const runs = tr.filter(isRun);

  // --- sanity ---
  for (const t of tr) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(t.data)) add("DATA_FORMAT", "krytyczny", `zła data ${t.data}`);
    if (!Number.isFinite(Number(t.dystans_km)) || Number(t.dystans_km) < 0) add("NaN_DYSTANS", "krytyczny", `dystans ${t.dystans_km} (${t.data})`);
    if (isRun(t) && !(Number(t.czas_min) > 0)) add("BRAK_CZASU", "krytyczny", `bieg bez czasu ${t.data}`);
  }
  // --- struktura dat ---
  const perDay = new Map();
  for (const t of runs) perDay.set(t.data, (perDay.get(t.data) || 0) + 1);
  for (const [d, n] of perDay) if (n > 1) add("DWA_BIEGI_JEDNEGO_DNIA", "krytyczny", `${d}: ${n} biegi`);
  for (const t of tr) {
    if (t.data < today) add("TRENING_PRZED_STARTEM", "krytyczny", `${t.data} < ${today}`);
    if (race && t.data >= race) add("TRENING_PO_STARCIE", "krytyczny", `${t.data} >= start ${race}`);
  }
  const avail = new Set((inp.availableDays || []).map(Number));
  for (const t of runs) if (!avail.has(dowOf(t.data))) add("DZIEN_NIEDOSTEPNY", "krytyczny", `${t.data} (dow ${dowOf(t.data)})`);
  const maxRuns = Math.max(0, ...W.map((w) => w.n));
  if (maxRuns > (inp.daysPerWeek ?? 7)) add("WIECEJ_BIEGOW_NIZ_ZADEKLAROWANO", "krytyczny", `${maxRuns} > ${inp.daysPerWeek}`);
  if (maxRuns > avail.size) add("WIECEJ_BIEGOW_NIZ_DOSTEPNYCH_DNI", "krytyczny", `${maxRuns} > ${avail.size}`);

  // --- tygodnie: udział długiego, akcenty, progresja ---
  const raceWeekMon = race ? mondayOf(race) : null;
  const lastIdx = W.length - 1;
  const isTaper = (w) => race && diffD(w.mon, raceWeekMon) <= 14; // 3 ostatnie tygodnie przed startem
  const capQ = Q_CAP[level] ?? 2;
  let prevLoad = null; // ostatni zwykły tydzień (nie odciążenie, nie taper)
  let prevKm = null;
  let prevLong = null;
  let consecutiveLoad = 0, maxConsecutive = 0;
  const curKm = Number(inp.currentWeeklyKm) || 0, curLong = Number(inp.longestRecentRun) || 0;
  const breakF = inp.breakDays >= 56 ? 0.4 : inp.breakDays >= 28 ? 0.5 : inp.breakDays >= 14 ? 0.65 : 1;
  const refStartKm = curKm * breakF, refStartLong = curLong * breakF;
  W.forEach((w, i) => {
    const full = i > 0 && i < lastIdx || (i === 0 && w.n >= 1 && diffD(today, addD(w.mon, 7)) >= 6); // pełne tygodnie
    // udział długiego
    const niepelnyPierwszy = i === 0 && dowOf(today) !== 1;
    if (w.n >= 2 && w.longKm > 10 && !niepelnyPierwszy) {
      const lim = LONG_SHARE[Math.min(7, w.n)] + (DIST_SHARE_BONUS[type] || 0);
      const share = w.longKm / w.km;
      if (share > lim + 0.10) add("UDZIAL_DLUGIEGO", "krytyczny", `${w.mon}: ${Math.round(share * 100)}% przy ${w.n} biegach (limit ${Math.round(lim * 100)}%)`);
      else if (share > lim + 0.015) add("UDZIAL_DLUGIEGO", "ostrzezenie", `${w.mon}: ${Math.round(share * 100)}% przy ${w.n} biegach (limit ${Math.round(lim * 100)}%)`);
    }
    // akcenty
    const cap = w.n <= 1 ? 0 : w.n === 2 ? 1 : Math.min(capQ, w.n - 2);
    if (w.nQ > cap) add("AKCENTY_ZA_DUZO", "krytyczny", `${w.mon}: ${w.nQ} jakościowych przy ${w.n} biegach, poziom ${level} (limit ${cap})`);
    // progresja
    if (!w.deload && !isTaper(w)) {
      const ref = prevLoad ?? (i === 0 ? refStartKm : null);
      if (ref != null && ref > 0 && (i > 0 || full)) {
        if (w.km > Math.max(ref * 1.30, ref + 6)) add("WZROST_KM", "krytyczny", `${w.mon}: ${r1(w.km)} km vs ref ${r1(ref)} km`);
        else if (w.km > Math.max(ref * 1.15, ref + 4)) add("WZROST_KM", "ostrzezenie", `${w.mon}: ${r1(w.km)} km vs ref ${r1(ref)} km`);
      }
      const refL = prevLong ?? (i === 0 ? refStartLong : null);
      if (refL != null && refL > 0 && w.longKm > 0) {
        if (w.longKm > Math.max(refL * 1.4, refL + 6)) add("WZROST_DLUGIEGO", "krytyczny", `${w.mon}: ${r1(w.longKm)} km vs ref ${r1(refL)} km`);
        else if (w.longKm > Math.max(refL * 1.2, refL + 3)) add("WZROST_DLUGIEGO", "ostrzezenie", `${w.mon}: ${r1(w.longKm)} km vs ref ${r1(refL)} km`);
      }
      const partialFirst = i === 0 && diffD(w.mon, today) > -6 && dowOf(today) !== 1; // pierwszy tydzień niepełny (start w trakcie tygodnia)
      if (partialFirst) prevLoad = refStartKm > 0 ? Math.max(refStartKm, w.km) : null;
      else prevLoad = w.km > 0 ? w.km : prevLoad;
      if (w.longKm > 0) prevLong = w.longKm;
      if (w.km >= 10) { consecutiveLoad++; maxConsecutive = Math.max(maxConsecutive, consecutiveLoad); } else consecutiveLoad = 0; // tydzien < 10 km nie kumuluje obciazenia wymagajacego odciazenia
    } else if (w.deload) {
      if (prevKm != null && prevKm > 6 && w.n >= 3 && w.km > prevKm * 0.95 + 0.5) add("ODCIAZENIE_NIESKUTECZNE", w.km >= prevKm ? "krytyczny" : "ostrzezenie", `${w.mon}: ${r1(w.km)} km po tygodniu ${r1(prevKm)} km`);
      consecutiveLoad = 0;
    }
    prevKm = w.km;
  });
  if (maxConsecutive > 7) add("ZA_DLUGO_BEZ_ODCIAZENIA", "krytyczny", `${maxConsecutive} tygodni obciążenia pod rząd`);
  else if (maxConsecutive > 5) add("ZA_DLUGO_BEZ_ODCIAZENIA", "ostrzezenie", `${maxConsecutive} tygodni obciążenia pod rząd`);

  // --- regeneracja: dwa mocne dni pod rząd ---
  const hard = (t) => QUALITY.has(t.podtyp) || t.podtyp === "dlugi";
  const byDate = new Map(); for (const t of runs) byDate.set(t.data, t);
  for (const t of runs) {
    if (!hard(t)) continue;
    const nx = byDate.get(addD(t.data, 1));
    if (nx && hard(nx)) add("MOCNE_DNI_POD_RZAD", "krytyczny", `${t.data} ${t.podtyp} + ${nx.data} ${nx.podtyp}`);
  }
  // v21: bieg regeneracyjny ma sens tylko dzień po mocnej jednostce i jest krótki (limit zależny od poziomu), a nie jest zwykłym biegiem pod inną nazwą
  const REC_LIM = { beginner: 35, intermediate: 45, advanced: 60 };
  const hard2 = (t) => hard(t) || t.podtyp === "ostrzenie";
  for (const t of runs) {
    if (t.podtyp !== "regeneracja") continue;
    const dr = race ? diffD(t.data, race) : 99;
    if (Number(t.czas_min) > (REC_LIM[level] ?? 45)) add("REGENERACJA_POZIOM", "ostrzezenie", `${t.data}: ${t.czas_min} min przy limicie ${REC_LIM[level]} min dla poziomu ${level}`);
    const prev = byDate.get(addD(t.data, -1));
    if (dr > 1 && !(prev && hard2(prev))) add("REGENERACJA_BEZ_MOCNEGO", "ostrzezenie", `${t.data}: bieg regeneracyjny bez mocnej jednostki dzień wcześniej`);
  }
  for (const w of W) if (w.n >= 7) add("BRAK_DNIA_BEZ_BIEGANIA", level === "beginner" ? "krytyczny" : "ostrzezenie", `${w.mon}: 7 biegów`);
  // długie przerwy (>4 dni bez biegu) w planie 3+ dni
  if ((inp.daysPerWeek ?? 0) >= 3) {
    const ds = runs.map((t) => t.data).sort();
    const deloadMons = new Set(W.filter((w) => w.deload).map((w) => w.mon)); // w tygodniu odciazajacym mniej biegow jest dopuszczalne
    for (let i = 1; i < ds.length; i++) if (diffD(ds[i - 1], ds[i]) > 4 && !isTaperDate(ds[i], race) && !deloadMons.has(mondayOf(ds[i - 1])) && !deloadMons.has(mondayOf(ds[i]))) add("DLUGA_PRZERWA", "ostrzezenie", `${ds[i - 1]} → ${ds[i]}`);
  }
  // za krótkie / za długie biegi
  for (const w of W) {
    const final = race && w.mon === raceWeekMon;
    for (const t of w.runs) {
      if (Number(t.dystans_km) < 2.5 && !final) add("BIEG_ZA_KROTKI", "ostrzezenie", `${t.data}: ${t.dystans_km} km`);
      if (t.podtyp === "regeneracja" && Number(t.czas_min) > 60) add("REGENERACJA_ZA_DLUGA", "ostrzezenie", `${t.data}: ${t.dystans_km} km / ${t.czas_min} min`);
      if (t.podtyp === "dlugi" && LONG_MAX_MIN[type]) {
        const lim = LONG_MAX_MIN[type];
        if (t.czas_min > lim * 1.25) add("DLUGI_ZA_DLUGO", "krytyczny", `${t.data}: ${t.czas_min} min (limit ${lim})`);
        else if (t.czas_min > lim) add("DLUGI_ZA_DLUGO", "ostrzezenie", `${t.data}: ${t.czas_min} min (limit ${lim})`);
      }
    }
  }
  // --- limity czasu ---
  const wd = Number(inp.maxMinutesWeekday) > 0 ? Number(inp.maxMinutesWeekday) : Number(inp.maxMinutes) > 0 ? Number(inp.maxMinutes) : null;
  const we = Number(inp.maxMinutesWeekend) > 0 ? Number(inp.maxMinutesWeekend) : Number(inp.maxMinutes) > 0 ? Number(inp.maxMinutes) : null;
  for (const t of runs) {
    const d = dowOf(t.data), lim = d === 0 || d === 6 ? we : wd;
    if (lim && t.czas_min > lim + 3) add("LIMIT_CZASU", "krytyczny", `${t.data}: ${t.czas_min} min > ${lim}`);
  }
  // --- tapering ---
  let peakKm = 0, peakLong = 0;
  W.forEach((w) => { if (!(race && diffD(w.mon, raceWeekMon) <= 7)) { peakKm = Math.max(peakKm, w.km); } peakLong = Math.max(peakLong, w.longKm); });
  const peakKmAll = Math.max(0, ...W.map((w) => w.km));
  if (race && TAPER_LAST[type] && W.length >= 6) {
    const lastW = W.find((w) => w.mon === raceWeekMon);
    const pen = W.find((w) => w.mon === addD(raceWeekMon, -7));
    const base = Math.max(0, ...W.filter((w) => diffD(w.mon, raceWeekMon) >= 21 || w.mon < addD(raceWeekMon, -14)).map((w) => w.km));
    const startsMidWeek = lastW && lastW.mon === W[0].mon;
    if (lastW && base > 0 && !startsMidWeek && lastW.km > base * TAPER_LAST[type] + 1) add("TAPER_PLYTKI", "ostrzezenie", `tydzień startowy ${r1(lastW.km)} km vs szczyt ${r1(base)} km (limit ${Math.round(TAPER_LAST[type] * 100)}%)`);
    if (pen && base > 0 && (type === "half" || type === "marathon") && pen.km > base * 0.88 + 1) add("TAPER_PLYTKI", "ostrzezenie", `przedostatni tydzień ${r1(pen.km)} km vs szczyt ${r1(base)} km`);
    const bigLong = Math.max(peakLong * 0.75, BIG_LONG_FRAC[type] * DIST_KM[type]); // długi bieg będący istotną częścią dystansu zawodów wymaga pełnej regeneracji
    const bigs = runs.filter((t) => t.podtyp === "dlugi" && Number(t.dystans_km) >= bigLong);
    if (bigs.length) {
      const last = bigs[bigs.length - 1];
      const gap = diffD(last.data, race);
      if (gap < BIG_LONG_GAP[type]) add("DLUGI_ZA_BLISKO_STARTU", gap < BIG_LONG_GAP[type] - 3 ? "krytyczny" : "ostrzezenie", `${last.data}: ${last.dystans_km} km, ${gap} dni przed startem (min ${BIG_LONG_GAP[type]})`);
    }
    for (const t of runs) {
      const gap = diffD(t.data, race);
      if (QUALITY.has(t.podtyp) && gap <= 2) add("MOCNY_TUZ_PRZED_STARTEM", "krytyczny", `${t.data} ${t.podtyp} ${gap} dni przed startem`);
      else if (QUALITY.has(t.podtyp) && gap <= 3) add("MOCNY_TUZ_PRZED_STARTEM", "ostrzezenie", `${t.data} ${t.podtyp} ${gap} dni przed startem`);
    }
  }
  // --- tydzień 1 względem danych wejściowych ---
  if (W[0] && W[0].n >= 1 && curKm > 0) {
    const w1 = W[0];
    const wk1 = w1.km, lim = Math.max(refStartKm * 1.3, refStartKm + 6);
    if (wk1 > lim && diffD(today, addD(w1.mon, 7)) >= 6) add("START_ZA_WYSOKO", "krytyczny", `tydzień 1: ${r1(wk1)} km przy bazie ${r1(refStartKm)} km`);
  }
  if (curLong > 0 && W[0] && W[0].longKm > Math.max(refStartLong * 1.4, refStartLong + 6)) add("PIERWSZY_DLUGI_ZA_DLUGI", "krytyczny", `${r1(W[0].longKm)} km przy najdłuższym ${r1(refStartLong)} km`);

  // --- spójność raportu tygodni z listą treningów ---
  const raceKm = race && DIST_KM[type] ? DIST_KM[type] : 0;
  for (const wk of res.tygodnie || []) {
    const mine = W.find((w) => w.mon === wk.od);
    const expected = (mine ? mine.km : 0) + (race && mondayOf(race) === wk.od ? raceKm : 0);
    if (Math.abs(Number(wk.km) - expected) > 1.5) add("RAPORT_TYGODNIA_NIESPOJNY", "ostrzezenie", `${wk.od}: raport ${wk.km} km, lista ${r1(expected)} km`);
  }

  // --- przygotowanie do dystansu i realność gotowości ---
  const metryki = { peakKm: r1(peakKm || peakKmAll), peakKmAll: r1(peakKmAll), peakLong: r1(peakLong), maxRuns, nQuality: runs.filter((t) => QUALITY.has(t.podtyp)).length, weeks: W.length };
  const status = res.gotowosc && res.gotowosc.status;
  if (race && MIN_FINISH[type] && status) {
    const weeksAvail = diffD(today, race) / 7;
    const hasResult = !!(inp.bestResult || (Array.isArray(inp.records) && inp.records.length));
    const mf = MIN_FINISH[type], mr = MIN_RESULT[type];
    const lackF = [];
    if (maxRuns < mf.runs) lackF.push(`biegi/tydz. ${maxRuns}<${mf.runs}`);
    if (metryki.peakLong < mf.long * 0.95) lackF.push(`najdłuższy ${metryki.peakLong}<${mf.long}`);
    if (metryki.peakKm < mf.km * 0.95) lackF.push(`szczyt km ${metryki.peakKm}<${mf.km}`);
    if (weeksAvail < mf.weeks) lackF.push(`tygodnie ${r1(weeksAvail)}<${mf.weeks}`);
    const lackR = [];
    if (!hasResult) lackR.push("brak wyniku odniesienia");
    if (maxRuns < mr.runs) lackR.push(`biegi/tydz. ${maxRuns}<${mr.runs}`);
    if (metryki.peakLong < mr.long * 0.95) lackR.push(`najdłuższy ${metryki.peakLong}<${mr.long}`);
    if (metryki.peakKm < mr.km * 0.95) lackR.push(`szczyt km ${metryki.peakKm}<${mr.km}`);
    if (weeksAvail < mr.weeks) lackR.push(`tygodnie ${r1(weeksAvail)}<${mr.weeks}`);
    metryki.lackFinish = lackF; metryki.lackResult = lackR;
    if (status === "odpowiednie_przygotowanie_do_wyniku" && lackR.length) add("GOTOWOSC_ZAWYZONA", "krytyczny", `deklaruje gotowość do wyniku, a: ${lackR.join("; ")}`);
    if ((status === "odpowiednie_przygotowanie_do_wyniku" || status === "odpowiednie_przygotowanie_do_ukonczenia") && lackF.length) add("GOTOWOSC_ZAWYZONA", "krytyczny", `deklaruje gotowość do ukończenia, a: ${lackF.join("; ")}`);
    metryki.niedoszacowanie = status === "niewystarczajace_przygotowanie" && lackF.length === 0 ? 1 : 0;
  }
  // audyt wewnętrzny vs niezależny
  const crit = out.filter((x) => x.ciezar === "krytyczny").length;
  metryki.audytWewnetrznyZgodny = res.kontrola ? res.kontrola.zgodny === true : null;
  metryki.slepaPlamkaAudytu = crit > 0 && res.kontrola && res.kontrola.zgodny === true ? 1 : 0;
  return { problemy: out, tygodnie: W, metryki, krytyczne: crit, ostrzezenia: out.length - crit };
}
function isTaperDate(d, race) { return race && diffD(d, race) <= 10; }

// ---------- jawna skala heurystyczna 1-10 ----------
// Start 10. Kary: krytyczny niezależny -2.0 (max -6), ostrzeżenie niezależne -0.4 (max -2.0).
// Dopasowanie do dystansu (czy plan realnie przygotowuje do ukończenia dystansu): -1.0 za każdy niespełniony warunek z MIN_FINISH
// (biegi/tydz., najdłuższy bieg, szczyt km), max -4. Zawyżona gotowość: dodatkowo -3 (liczy się też jako krytyczny).
// Sufit: 10 - 1,5 x liczba niespełnionych warunków dopasowania (plan, który nie przygotowuje do dystansu, nie może mieć wysokiej oceny).
// To OCENA HEURYSTYCZNA wg własnych kryteriów, a nie wynik badań naukowych.
export function score(inp, res) {
  if (!res || res.ok !== true) return { ocena: 1, powody: ["plan niewygenerowany"] };
  const c = independentChecks(inp, res);
  let s = 10; const powody = [];
  const dc = Math.min(6, c.krytyczne * 2); if (dc) { s -= dc; powody.push(`krytyczne x${c.krytyczne} (-${dc})`); }
  const dw = Math.min(2, c.ostrzezenia * 0.4); if (dw) { s -= dw; powody.push(`ostrzeżenia x${c.ostrzezenia} (-${r1(dw)})`); }
  const lack = c.metryki && c.metryki.lackFinish ? c.metryki.lackFinish.filter((x) => !x.startsWith("tygodnie")) : [];
  const dl = Math.min(4, lack.length); if (dl) { s -= dl; powody.push(`brak dopasowania do dystansu: ${lack.join("; ")} (-${dl})`); const cap = 10 - 1.5 * dl; if (s > cap) { s = cap; powody.push(`sufit oceny ${cap} (plan nie przygotowuje do dystansu)`); } }
  return { ocena: Math.max(1, Math.min(10, Math.round(s * 10) / 10)), powody, kontrola: c };
}

// ---------- pomoce testowe ----------
export function runAll(inp) {
  let res;
  try { res = generatePlan(inp); } catch (e) { return { res: null, wyjatek: String(e && e.stack || e) }; }
  return { res };
}
export function makeReporter(nazwa) {
  const t = { nazwa, zaliczone: 0, niezaliczone: 0, bledy: [], testy: [] };
  const ok = (cond, opis, szczegoly) => { if (cond) { t.zaliczone++; t.testy.push({ opis, ok: true }); } else { t.niezaliczone++; t.bledy.push({ opis, szczegoly: String(szczegoly ?? "") }); t.testy.push({ opis, ok: false, szczegoly: String(szczegoly ?? "") }); } };
  return { t, ok };
}

export const WYNIKI_DIR = process.env.WYNIKI ? path.resolve(process.env.WYNIKI) : path.join(HERE, "..", "wyniki");
// zapisuje wynik testu do wyniki/<nazwa>.json i ustawia kod wyjscia (1 gdy cokolwiek niezaliczone)
export function finish(rep, extra = {}) {
  fs.mkdirSync(WYNIKI_DIR, { recursive: true });
  const out = { generator: path.basename(GEN), ...rep.t, ...extra };
  out.testy = undefined;
  fs.writeFileSync(path.join(WYNIKI_DIR, rep.t.nazwa + ".json"), JSON.stringify({ ...out, wszystkieTesty: rep.t.testy }, null, 1));
  console.log(`[${rep.t.nazwa}] zaliczone ${rep.t.zaliczone}, niezaliczone ${rep.t.niezaliczone}` + (rep.t.niezaliczone ? "\n  - " + rep.t.bledy.slice(0, 15).map((b) => b.opis + (b.szczegoly ? " :: " + b.szczegoly.slice(0, 200) : "")).join("\n  - ") : ""));
  process.exitCode = rep.t.niezaliczone > 0 ? 1 : 0;
}

export async function loadGen(file) { return import(pathToFileURL(path.resolve(HERE, file)).href); }
export const hashTr = (res) => JSON.stringify((res.treningi || []).map((t) => [t.data, t.podtyp, t.dystans_km]));
export function summarizeKm(res) { const W = weeksOf(res); return { peakKm: Math.round(Math.max(0, ...W.map((w) => w.km))), peakLong: Math.max(0, ...W.map((w) => w.longKm)), maxRuns: Math.max(0, ...W.map((w) => w.n)) }; }


// ====================================================================
// OCENA V21: wiele kategorii, kary zależne od GĘSTOŚCI problemów (bez nasycenia), osobno bezpieczeństwo i jakość treningowa.
// ====================================================================
// Każdy kod problemu ma przypisane kategorie. n_eff = (#krytyczne) + 0,25 x (#ostrzeżenia) w kategorii; gęstość = n_eff / max(4, liczba tygodni);
// wynik kategorii = 10 x exp(-3 x gęstość) (np. 1 ostrzeżenie w 12-tygodniowym planie ≈ 9,4; 1 krytyczny ≈ 7,6 i sufit 6; 12 ostrzeżeń ≈ 6,0; 100 ostrzeżeń ≈ 0,6).
// Kary NIE mają sufitu: tysiące ostrzeżeń dają wynik bliski 1, a pojedyncze ostrzeżenie prawie nie zmienia oceny.
// Ocena ogólna = średnia ważona kategorii, ale nie może przekroczyć wyniku bezpieczeństwa + 2 ani najniższej kategorii + 2 (słaba kategoria nie ginie w średniej).
export const KATEGORIE = {
  bezpieczenstwo: ["WZROST_KM", "WZROST_DLUGIEGO", "START_ZA_WYSOKO", "PIERWSZY_DLUGI_ZA_DLUGI", "ODCIAZENIE_NIESKUTECZNE", "ZA_DLUGO_BEZ_ODCIAZENIA", "MOCNE_DNI_POD_RZAD", "AKCENTY_ZA_DUZO", "MOCNY_TUZ_PRZED_STARTEM", "DLUGI_ZA_BLISKO_STARTU", "BRAK_DNIA_BEZ_BIEGANIA", "DLUGI_ZA_DLUGO", "GOTOWOSC_ZAWYZONA"],
  harmonogram: ["DATA_FORMAT", "NaN_DYSTANS", "BRAK_CZASU", "DWA_BIEGI_JEDNEGO_DNIA", "TRENING_PRZED_STARTEM", "TRENING_PO_STARCIE", "DZIEN_NIEDOSTEPNY", "WIECEJ_BIEGOW_NIZ_ZADEKLAROWANO", "WIECEJ_BIEGOW_NIZ_DOSTEPNYCH_DNI", "LIMIT_CZASU", "RAPORT_TYGODNIA_NIESPOJNY", "DLUGA_PRZERWA", "BIEG_ZA_KROTKI"],
  dopasowanieDoBiegacza: ["START_ZA_WYSOKO", "PIERWSZY_DLUGI_ZA_DLUGI", "WZROST_KM", "WZROST_DLUGIEGO", "GOTOWOSC_ZAWYZONA"],
  progresja: ["WZROST_KM", "WZROST_DLUGIEGO", "ODCIAZENIE_NIESKUTECZNE", "ZA_DLUGO_BEZ_ODCIAZENIA", "START_ZA_WYSOKO"],
  jakoscTreningow: ["AKCENTY_ZA_DUZO", "UDZIAL_DLUGIEGO", "DLUGI_ZA_DLUGO", "BIEG_ZA_KROTKI", "REGENERACJA_ZA_DLUGA", "REGENERACJA_POZIOM", "REGENERACJA_BEZ_MOCNEGO"],
  specyfikaDystansu: ["GOTOWOSC_ZAWYZONA", "TAPER_PLYTKI", "DLUGI_ZA_BLISKO_STARTU", "MOCNY_TUZ_PRZED_STARTEM", "DLUGI_ZA_DLUGO"],
  regeneracja: ["REGENERACJA_ZA_DLUGA", "REGENERACJA_POZIOM", "REGENERACJA_BEZ_MOCNEGO", "MOCNE_DNI_POD_RZAD", "BRAK_DNIA_BEZ_BIEGANIA", "ODCIAZENIE_NIESKUTECZNE", "ZA_DLUGO_BEZ_ODCIAZENIA", "DLUGA_PRZERWA"],
};
const WAGI = { bezpieczenstwo: 3, harmonogram: 1.5, dopasowanieDoBiegacza: 1.5, progresja: 1.5, jakoscTreningow: 1.5, specyfikaDystansu: 1.5, regeneracja: 1.5 };
export function scoreV21(inp, res, checks) {
  if (!res || res.ok !== true) return { ogolna: 1, kategorie: {}, powody: ["plan niewygenerowany"] };
  const c = checks || independentChecks(inp, res);
  const nW = Math.max(4, (c.tygodnie || []).length);
  const kat = {}, licz = {};
  for (const [k, kody] of Object.entries(KATEGORIE)) {
    const ps = c.problemy.filter((p) => kody.includes(p.kod));
    const crit = ps.filter((p) => p.ciezar === "krytyczny").length, warn = ps.length - crit;
    const dens = (crit + 0.25 * warn) / nW;
    let v = 10 * Math.exp(-3 * dens);
    if (crit) v = Math.min(v, k === "bezpieczenstwo" ? 4 : 6);
    kat[k] = r1(v); licz[k] = { krytyczne: crit, ostrzezenia: warn };
  }
  // dopasowanie do dystansu: brak minimów przygotowania (poza liczbą tygodni, która zależy od użytkownika, nie od generatora)
  const lack = c.metryki && c.metryki.lackFinish ? c.metryki.lackFinish.filter((x) => !x.startsWith("tygodnie")) : [];
  if (lack.length) { kat.specyfikaDystansu = r1(Math.max(1, Math.min(kat.specyfikaDystansu, 10 - 1.5 * lack.length))); licz.specyfikaDystansu.brakMinimow = lack; }
  let sum = 0, wsum = 0; for (const [k, w] of Object.entries(WAGI)) { sum += w * kat[k]; wsum += w; }
  const mean = sum / wsum, minK = Math.min(...Object.values(kat));
  const ogolna = r1(Math.max(1, Math.min(10, mean, kat.bezpieczenstwo + 2, minK + 2)));
  return { ogolna, kategorie: kat, liczby: licz, brakiDopasowania: lack };
}
