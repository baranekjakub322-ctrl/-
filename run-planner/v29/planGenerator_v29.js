import {nativeStep,measureWorkout,syncStructure,retainFamilyRecipes} from './model/dose_v29.mjs';
import {validateUnitCoherence} from './model/units_v29.mjs';
import {createPlanningTrace,feasibleEnvelope,verifyWeekIntent,reconcileFinalAllocation} from './model/planning_v29.mjs';
import {intensityEvidence,athleteEvidence} from "./model/profile_v29.mjs";
import {buildSeason,seasonPhases,recordSeasonWeek} from "./model/season_v29.mjs";
import {constrainedWeek,validateSafety,weekBudget,workDose} from "./model/constraints_v29.mjs";
// functions/_lib/planGenerator.js
// Run Planner V29, rozwinięcie V26 z zachowaniem historycznego silnika i API. Czyste funkcje ESM.
// v19: zmiany opisane w zmiany_v18_v19.md; każdy blok zmian oznaczony komentarzem „v19-Cn".
// v18: zmiany opisane w README_v18.md i porownanie_v17_v18.md; każdy blok zmian oznaczony komentarzem „v18-Pn".
// Dni tygodnia: 0 = niedziela, 1 = poniedziałek ... 6 = sobota. Daty: "RRRR-MM-DD".

import { evidenceInput, qualityPolicy, marathonModel, effortFor, sessionLoad } from "./model/policy_v29.mjs";
import { readyForEarlyQuality, oneRunPrescription, qualityBudget } from "./model/policy_v29.mjs";
import { prescribeQuality, comparableExposureState } from "./model/quality_v29.mjs";
import { adaptWith } from "./model/adaptation_v29.mjs";
export { evaluatePlan as scoreV23 } from "./scoring/v23.mjs";
import {lowFrequencyWeek} from "./model/frequency_v29.mjs";
import {qualityLedger} from "./model/ledger_v29.mjs";
import {processActivityLedger,validTimeZone as validTimeZoneV25,latestSymptom} from "./model/activity_v29.mjs";
import {readinessEvidence,longDurationLimit,supportGuidance} from "./model/readiness_v29.mjs";
export {processActivityLedger as processActivities} from "./model/activity_v29.mjs";
export {evaluatePlan as scoreV25} from "./scoring/v25.mjs";
export const VERSION = "29.0";
const DAY_MS = 86400000;
const DIST = { "5k": 5000, "10k": 10000, half: 21097.5, marathon: 42195 };
const DIST_LABEL = { "5k": "5 km", "10k": "10 km", half: "półmaraton", marathon: "maraton", health: "zdrowie i kondycja" };

// ---------- daty (UTC, bez problemów ze strefami czasowymi) ----------
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
const fmtDate = (ms) => new Date(ms).toISOString().slice(0, 10);
export const addDays = (s, n) => fmtDate(parse(s) + n * DAY_MS);
export const diffDays = (a, b) => Math.round((parse(b) - parse(a)) / DAY_MS);
const dowOf = (s) => new Date(parse(s)).getUTCDay();
const mondayOf = (s) => addDays(s, -((dowOf(s) + 6) % 7));
const pos = (d) => (d + 6) % 7; // pozycja w tygodniu od poniedziałku

const AUX = ["sila", "cross"];
const ACCENT_PODTYPY = ["tempo", "interwaly", "podbiegi", "tempo_startowe"]; // v19: pełne akcenty (dla warunkowych komunikatów o tempach) // treningi uzupełniające (bez kilometrów biegowych)
const DAYNAMES_PL = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
// ---------- pomocnicze ----------
const r1 = (x) => Math.round(x * 10) / 10;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const pad = (n) => String(n).padStart(2, "0");
export const fmtPace = (s) => { s = Math.round(s); return `${Math.floor(s / 60)}:${pad(s % 60)}`; };
export const fmtTime = (s) => {
  s = Math.round(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
};
const range = (p) => `${fmtPace(p.fast)}-${fmtPace(p.slow)}`;

// ---------- fizjologia: VDOT (Daniels/Gilbert) ----------
export function vdotFrom(distM, timeSec) {
  const t = timeSec / 60, v = distM / t;
  const vo2 = -4.6 + 0.182258 * v + 0.000104 * v * v;
  const pct = 0.8 + 0.1894393 * Math.exp(-0.012778 * t) + 0.2989558 * Math.exp(-0.1932605 * t);
  return vo2 / pct;
}
export function raceTimeFromVdot(distM, vdot) {
  let lo = (distM / 1000) * 120, hi = (distM / 1000) * 900;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (vdotFrom(distM, mid) > vdot) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}
function paceAt(vdot, frac) { // sek/km przy danym ułamku VO2max
  const vo2 = vdot * frac, a = 0.000104, b = 0.182258, c = -(4.6 + vo2);
  const v = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  return 60000 / v;
}
function pacesFor(v, thr) {
  return {
    recovery: { fast: paceAt(v, 0.64), slow: paceAt(v, 0.58) },
    easy: { fast: paceAt(v, 0.72), slow: paceAt(v, 0.62) },
    long: { fast: paceAt(v, 0.70), slow: paceAt(v, 0.62) },       // długie wybieganie: wolniejsza połowa zakresu spokojnego
    moderate: { fast: paceAt(v, 0.80), slow: paceAt(v, 0.74) },   // umiarkowane (strefa Z3, między spokojnym a progowym)
    tempo: thr ? { fast: thr * 0.99, slow: thr * 1.01 } : { fast: paceAt(v, 0.88), slow: paceAt(v, 0.84) },
    interval: { fast: paceAt(v, 1.0), slow: paceAt(v, 0.95) },
  };
}
export function hrZones(hrMax, hrRest, lthr) {
  if (lthr) { const lo = [0.68, 0.81, 0.90, 0.94, 1.0], hi = [0.81, 0.89, 0.93, 0.99, null]; return lo.map((a, i) => ({ strefa: "Z" + (i + 1), od: Math.round(lthr * a), do: hi[i] ? Math.round(lthr * hi[i]) : hrMax })); }
  const lim = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  return [0, 1, 2, 3, 4].map((i) => {
    const f = (x) => hrRest ? Math.round(hrRest + (hrMax - hrRest) * x) : Math.round(hrMax * x);
    return { strefa: "Z" + (i + 1), od: f(lim[i]), do: f(lim[i + 1]) };
  });
}

// ---------- normalizacja i walidacja wejścia ----------
function normalize(inp) {
  const I = { ...inp };
  I.level = ["beginner", "intermediate", "advanced"].includes(I.level) ? I.level : "beginner";
  I.age = Number(I.age) || 35;
  if (I.experienceMonths != null) I.experienceMonths = Number(I.experienceMonths);
  I.availableDays = [...new Set((Array.isArray(I.availableDays) ? I.availableDays : []).map(Number))]
    .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
  const requestedDays = Number(I.daysPerWeek);
  I.dniZadeklarowane = Number.isInteger(requestedDays) && requestedDays >= 1 && requestedDays <= 7 ? requestedDays : 3;
  I.dniDostepne = I.availableDays.length;
  // v15: pozostawiamy co najmniej jeden dzień bez biegania; dostępność nie jest obowiązkiem.
  // v18-P6: korekta poziomu PRZED wyznaczeniem limitu biegów (V17 liczyła limit z poziomu zadeklarowanego, a audyt z poziomu
  // skorygowanego, więc plan z 6 biegami dla "zaawansowanego" z 6 km/tydz. dostawał błąd krytyczny i był naprawiany przez usuwanie biegów).
  {
    let cwE = Math.max(0, Number(I.currentWeeklyKm) || 0), lrE = Math.max(0, Number(I.longestRecentRun) || 0);
    const injE = toBool(inp.injuries);
    // v18-P11: przerwa w bieganiu (breakDays/przerwaDni): powrót z ułamkiem dotychczasowej objętości. Idempotentne (normalize bywa wołane 2x).
    const bd = Math.max(0, Number(I.breakDays ?? I.przerwaDni) || 0);
    if (bd >= 14 && !I.przerwaKorekta) {
      const f = bd >= 56 ? 0.4 : bd >= 28 ? 0.5 : 0.65;
      cwE = Math.round(cwE * f * 10) / 10; lrE = Math.round(lrE * f * 10) / 10;
      I.currentWeeklyKm = cwE; I.longestRecentRun = lrE; I.przerwaKorekta = { dni: bd, wspolczynnik: f };
    }
    // v18-P11: wiele rekordów => ostrożny wybór (pomijamy wyniki > 24 mies.; przy rozbieżności > 6% VDOT bierzemy słabszy z dwóch najlepszych)
    if (Array.isArray(I.records) && I.records.length && !I.rekordyAnaliza) {
      const t0 = Date.parse((I.today || "1970-01-01") + "T00:00:00Z");
      const ok = I.records.map((r) => ({ d: Number(r && r.distanceKm), t: Number(r && r.timeSec), date: r && r.date })).filter((r) => r.d > 0 && r.t > 0 && r.t / r.d >= 150 && r.t / r.d <= 720)
        .map((r) => ({ ...r, age: r.date && isRealDate(r.date) ? (t0 - Date.parse(r.date + "T00:00:00Z")) / 86400000 : null, vdot: vdotFrom(r.d * 1000, r.t) }));
      const fresh = ok.filter((r) => r.age == null || r.age <= 730), dropped = ok.length - fresh.length;
      if (fresh.length) {
        const sorted = fresh.slice().sort((a, b) => b.vdot - a.vdot), spread = sorted.length > 1 ? sorted[0].vdot / sorted[sorted.length - 1].vdot - 1 : 0;
        const top2 = sorted.slice(0, 2), diverge = top2.length === 2 && top2[0].vdot / top2[1].vdot - 1 > 0.06;
        const pick = diverge ? top2[1] : top2[0];
        I.bestResult = { distanceKm: pick.d, timeSec: pick.t, date: pick.date };
        I.rekordyAnaliza = { uzyte: fresh.length, pominieteStare: dropped, rozrzutVdotProc: Math.round(spread * 1000) / 10, rozbieznosc: diverge, wybrany: { distanceKm: pick.d, timeSec: pick.t, vdot: Math.round(pick.vdot * 10) / 10 } };
      }
    }
    if (I.level === "advanced" && cwE < 20) { I.level = "intermediate"; I.poziomSkorygowany = true; }
    else if (I.level === "beginner" && cwE >= 35 && lrE >= 14 && !injE) { I.level = "intermediate"; I.poziomPodniesiony = true; }
    I.limitBiegowPoziomuBazowy = { beginner: 4, intermediate: 5, advanced: 6 }[I.level];
    // limit poziomu może być o 1 wyższy tylko przy wyraźnym dowodzie (kilometraż i najdłuższy bieg) i bez kontuzji
    I.limitPodniesionyDowodem = I.level === "intermediate" && cwE >= 45 && lrE >= 16 && !injE || I.level === "advanced" && I.highFrequencyAllowed===true && !injE && I.loadTolerance!=="low" && I.intensityTolerance!=="low";
  }
  I.limitBiegowPoziomu = I.limitBiegowPoziomuBazowy + (I.limitPodniesionyDowodem ? 1 : 0);
  I.daysPerWeek = Math.min(I.dniZadeklarowane, I.availableDays.length, I.limitBiegowPoziomu);
  I.dniOgraniczoneDostepnoscia = I.availableDays.length < I.dniZadeklarowane;
  I.dniOgraniczonePoziomem = I.daysPerWeek < Math.min(I.dniZadeklarowane, I.availableDays.length);
  I.limitCzasuPodany = [inp.maxMinutes, inp.maxMinutesWeekday, inp.maxMinutesWeekend].some((v) => Number(v) > 0);
  I.maxMinutes = Number(I.maxMinutes) > 0 ? Number(I.maxMinutes) : 120;
  I.maxMinutesWd = Number(inp.maxMinutesWeekday) > 0 ? Number(inp.maxMinutesWeekday) : I.maxMinutes;
  I.maxMinutesWe = Number(inp.maxMinutesWeekend) > 0 ? Number(inp.maxMinutesWeekend) : I.maxMinutes;
  I.warm = clamp(Number(inp.rozgrzewkaKm) || 2, 0.5, 5); I.cool = clamp(Number(inp.schlodzenieKm) || 1.5, 0.5, 4);
  I.warmUser = !!inp.rozgrzewkaKm; I.coolUser = !!inp.schlodzenieKm;
  I.przedStartem = inp.dzienPrzedStartem === "trucht" || inp.dzienPrzedStartem === "odpoczynek" ? inp.dzienPrzedStartem : I.daysPerWeek >= 5 && I.level === "advanced" ? "trucht" : "odpoczynek";
  I.currentWeeklyKm = Math.max(0, Number(I.currentWeeklyKm) || 0);
  I.longestRecentRun = Math.max(0, Number(I.longestRecentRun) || 0);
  I.goal = I.goal && typeof I.goal === "object" && !isBlank(I.goal.type) ? I.goal : { ...(I.goal || {}), type: "health" };
  I.weeks = Number(I.weeks) > 0 ? Number(I.weeks) : 12;
  // bez podanego limitu czasu weekendowy limit wynika z dystansu (długi bieg maratończyka trwa dłużej niż 2 h)
  if (!I.limitCzasuPodany) I.maxMinutesWe = { marathon: 210, half: 150 }[I.goal.type] || I.maxMinutes;
  I.injuries = toBool(I.injuries);
  I.historiaKontuzjiFlag = !I.injuries && toBool(inp.historiaKontuzji);
  I.hrMaxEstimated = !inp.hrMax;
  if (I.level === "advanced" && I.currentWeeklyKm < 20) { I.level = "intermediate"; I.poziomSkorygowany = true; }
  // Nie redukujemy częstotliwości z powodu odstępów między dniami. Układ tygodnia
  // ocenia obciążenie i regenerację, a ograniczenia są jawnie raportowane.
  I.hrMax = inp.hrMax || Math.round(208 - 0.7 * I.age);
  return I;
}
const isRealDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && (() => { const [y, m, d] = s.split("-").map(Number); const t = Date.UTC(y, m - 1, d); const x = new Date(t); return x.getUTCFullYear() === y && x.getUTCMonth() === m - 1 && x.getUTCDate() === d; })();
const isBlank = (v) => v === undefined || v === null || v === "";
// v18-P6: flagi z formularzy bywają tekstem ("false", "nie"). V17: !!"false" === true. Niejednoznaczny tekst traktujemy ostrożnie jako "tak".
const toBool = (v) => {
  if (typeof v === "string") return !["", "false", "0", "no", "nie", "n", "none", "brak", "null", "undefined"].includes(v.trim().toLowerCase());
  if (Array.isArray(v)) return v.length > 0;
  if (v && typeof v === "object") return Object.keys(v).length > 0;
  return !!v;
};
const num = (v) => (typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN);
const PACE_MIN = 150, PACE_MAX = 720; // s/km: 2:30 (poniżej rekordów świata) i 12:00 (wolniej niż marsz sportowy)
// Szczegółowa walidacja: {bledy:[{kod,pole,komunikat}], ostrzezenia:[{kod,pole,komunikat}]}
function inputIssuesV25(input){
  const errors=[];
  if(input.controlTests!=null&&!['submaximal','maximal','none'].includes(input.controlTests))errors.push('controlTests: submaximal/maximal/none.');
  if(input.seasonContext!=null){const x=input.seasonContext;if(!x||typeof x!=='object'||!isRealDate(x.originStart)||!isRealDate(input.today)||x.originStart>input.today||diffDays(x.originStart,input.today)>730)errors.push('Nieprawidłowy początek kontekstu sezonu.');}
  if(input.debugTrace!=null&&typeof input.debugTrace!=='boolean')errors.push('debugTrace musi być logiczne.');
  if(input.planningCandidates!=null&&(!Number.isInteger(input.planningCandidates)||input.planningCandidates<2||input.planningCandidates>4))errors.push("planningCandidates musi wynosić 2–4.");
  for(const [name,fields]of [["conditions",[["temperatureC",-40,55],["humidityPct",0,100],["elevationGainM",0,10000]]],["nutrition",[["carbsGramsPerHour",0,120],["practicedRuns",0,1000]]]]){
    const obj=input[name];if(obj!=null && (typeof obj!=="object"||Array.isArray(obj))){errors.push(`${name} musi być obiektem.`);continue;}
    for(const [key,min,max]of fields)if(obj?.[key]!=null && (typeof obj[key]!=="number"||!Number.isFinite(obj[key])||obj[key]<min||obj[key]>max))errors.push(`Nieprawidłowe ${name}.${key}.`);
  }
  if(input.nutrition?.practicedRuns!=null && !Number.isInteger(input.nutrition.practicedRuns))errors.push('Liczba prób żywienia musi być całkowita.');
  if(input.nutrition?.giTolerance!=null&&!['unknown','good','sensitive'].includes(input.nutrition.giTolerance))errors.push('giTolerance: unknown/good/sensitive.');
  if(input.conditions?.terrain!=null&&!['flat','rolling','hilly','trail'].includes(input.conditions.terrain))errors.push('Nieprawidłowy profil trasy.');
  if(input.executionCoverage!=null && (typeof input.executionCoverage!=="object" || Array.isArray(input.executionCoverage) || typeof input.executionCoverage.completeWindow!=="boolean"))errors.push('executionCoverage wymaga obiektu i logicznego completeWindow.');
  if(input.executionCoverage?.completeWindow && !isRealDate(input.executionCoverage.coverageFrom))errors.push('Pełna historia wymaga coverageFrom.');
  if(input.executionCoverage?.coverageFrom && (!isRealDate(input.executionCoverage.coverageFrom)||input.executionCoverage.coverageFrom>input.today))errors.push('Nieprawidłowy początek zakresu wykonania.');
  if(input.executionCoverage?.coverageTo && (!isRealDate(input.executionCoverage.coverageTo)||input.executionCoverage.coverageTo>input.today))errors.push('Nieprawidłowy koniec zakresu wykonania.');
  if(input.timeZone!=null && !validTimeZoneV25(input.timeZone))errors.push('Nieprawidłowa strefa czasowa.');
  if(input.completedHistory!=null && !Array.isArray(input.completedHistory))errors.push('completedHistory musi być listą.');
  if(input.executionObservations!=null && !Array.isArray(input.executionObservations))errors.push('executionObservations musi być listą.');
  const observationInput=input.executionObservations||input.completedHistory;
  if(Array.isArray(observationInput) && observationInput.length && isRealDate(input.today)){
    const data=processActivityLedger({},observationInput,input.today,{timeZone:input.timeZone||'UTC'});
    if(!data.ok)errors.push(...data.bledy);
    else {
      const executedById=new Map(data.completedHistory.map(o=>[o.id,o]));
      if(Array.isArray(input.executionObservations) && Array.isArray(input.completedHistory)){const performed=processActivityLedger({},input.completedHistory,input.today,{timeZone:input.timeZone||'UTC'});if(!performed.ok || performed.completedHistory.length!==data.completedHistory.length || performed.completedHistory.some(o=>{const x=executedById.get(o.id);return !x||x.distanceKm!==o.distanceKm||x.durationMin!==o.durationMin;}))errors.push('Niespójność completedHistory i executionObservations.');}
      const symptom=latestSymptom(data.observations);if(symptom&&(symptom.pain>=4||symptom.activeInjury))errors.push('Zgłoszony ból lub uraz w historii wykonania: wstrzymano obciążenia.');}
  }
  return errors;
}

export function validateInputDetailed(inp) {
  const bledy = [], ostrzezenia = [];
  const E = (kod, pole, komunikat) => bledy.push({ kod, pole, komunikat });
  const W = (kod, pole, komunikat) => ostrzezenia.push({ kod, pole, komunikat });
  if (!inp || typeof inp !== "object" || Array.isArray(inp)) return { bledy: [{ kod: "WEJSCIE_PUSTE", pole: null, komunikat: "Brak danych wejściowych (oczekiwany obiekt)" }], ostrzezenia };
  for(const message of inputIssuesV25(inp))E('PARAMETR_V25',null,message);
  if (!inp.today || !isRealDate(inp.today)) E("DATA_DZISIAJ", "today", "Brak poprawnej daty dzisiejszej (format RRRR-MM-DD, istniejąca data)");
  if (!Array.isArray(inp.availableDays) || inp.availableDays.length < 1) E("DNI_BRAK", "availableDays", "Wybierz co najmniej 1 dzień dostępny do biegania");
  if (inp.daysPerWeek != null && (!Number.isInteger(Number(inp.daysPerWeek)) || Number(inp.daysPerWeek) < 1 || Number(inp.daysPerWeek) > 7)) E("DNI_LICZBA", "daysPerWeek", "Liczba treningów w tygodniu musi być liczbą całkowitą od 1 do 7");
  if (Array.isArray(inp.availableDays) && inp.availableDays.some((d) => !Number.isInteger(Number(d)) || Number(d) < 0 || Number(d) > 6)) E("DNI_WARTOSC", "availableDays", "Dostępne dni muszą mieć wartości od 0 do 6");
  const age = num(inp.age);
  if (!Number.isFinite(age) || age < 14 || age > 90) E("WIEK", "age", "Podaj wiek (14-90 lat)");
  if (!isBlank(inp.level) && !["beginner", "intermediate", "advanced"].includes(inp.level)) E("POZIOM", "level", "Nieznany poziom zaawansowania (dozwolone: beginner, intermediate, advanced)");
  else if (isBlank(inp.level)) W("POZIOM_BRAK", "level", "Brak poziomu zaawansowania: przyjęto poziom początkujący (najbezpieczniejszy).");
  for (const [f, max] of [["currentWeeklyKm", 250], ["longestRecentRun", 100]]) {
    if (isBlank(inp[f])) continue;
    const v = num(inp[f]);
    if (!Number.isFinite(v)) E("LICZBA_" + f.toUpperCase(), f, `Pole ${f} musi być liczbą`);
    else if (v < 0) E("UJEMNA_" + f.toUpperCase(), f, `Pole ${f} nie może być ujemne`);
    else if (v > max) E("NIEREALNA_" + f.toUpperCase(), f, `Pole ${f} ma nierealną wartość (${v} km)`);
  }
  if (inp.recentWeeklyKm != null && (!Array.isArray(inp.recentWeeklyKm) || inp.recentWeeklyKm.length < 2 || inp.recentWeeklyKm.length > 12 || inp.recentWeeklyKm.some(x => !Number.isFinite(num(x)) || num(x) < 0 || num(x) > 250))) E("HISTORIA_TYGODNI", "recentWeeklyKm", "Podaj 2–12 ukończonych tygodni (0–250 km), od najstarszego do najnowszego.");
  if (inp.experienceMonths != null && (!Number.isFinite(num(inp.experienceMonths)) || num(inp.experienceMonths) < 0 || num(inp.experienceMonths) > 900)) E("DOSWIADCZENIE", "experienceMonths", "Staż musi wynosić 0–900 miesięcy.");
  if (inp.pain != null && (!Number.isFinite(num(inp.pain)) || num(inp.pain) < 0 || num(inp.pain) > 10)) E("BOL", "pain", "Ból musi mieścić się w skali 0–10.");
  if (toBool(inp.activeInjury) || Number(inp.pain) >= 4) E("AKTYWNY_URAZ", "activeInjury", "Aktywny uraz lub istotny ból: wstrzymaj generowanie obciążeń i uzgodnij powrót ze specjalistą.");
  if (inp.goal?.mode != null && !["finish", "time", "maintain", "activity"].includes(inp.goal.mode)) E("TRYB_CELU", "goal.mode", "Tryb celu: finish, time, maintain lub activity.");
  for (const [name, rows] of [["bestResult", inp.bestResult ? [inp.bestResult] : []], ["records", Array.isArray(inp.records) ? inp.records : []]]) for (const r of rows) {
    if (r?.date != null && (!isRealDate(r.date) || isRealDate(inp.today) && r.date > inp.today)) E("DATA_WYNIKU", name, "Data wyniku musi być poprawna i nie może być w przyszłości.");
  }
  for(const name of ["volumeTolerance","intensityTolerance"])if(inp[name]!=null && !["low","normal","high"].includes(inp[name]))E("TOLERANCJA",name,"Tolerancja: low, normal lub high.");
  if(inp.fatigue!=null && (!Number.isFinite(num(inp.fatigue)) || num(inp.fatigue)<1 || num(inp.fatigue)>5))E("ZMECZENIE","fatigue","Zmęczenie musi wynosić 1–5.");
  if (inp.loadTolerance != null && !["low","normal","high"].includes(inp.loadTolerance)) E("TOLERANCJA", "loadTolerance", "Tolerancja: low, normal lub high.");
  if (inp.recoveryDays != null && ![2,3].includes(num(inp.recoveryDays))) E("REGENERACJA_DNI", "recoveryDays", "Odstęp między mocnymi jednostkami: 2 lub 3 dni.");
  if (inp.preferredDays != null && (!Array.isArray(inp.preferredDays) || inp.preferredDays.some(d => !Number.isInteger(num(d)) || !inp.availableDays?.map(Number).includes(num(d))))) E("DNI_PREFEROWANE", "preferredDays", "Preferowane dni muszą należeć do dostępnych dni.");
  if (inp.longDistanceRaces != null && (!Number.isInteger(num(inp.longDistanceRaces)) || num(inp.longDistanceRaces)<0 || num(inp.longDistanceRaces)>1000)) E("DOSWIADCZENIE_STARTOWE", "longDistanceRaces", "Liczba startów długodystansowych: 0–1000.");
  if (inp.hrMaxSource != null && !["measured","estimated","unknown"].includes(inp.hrMaxSource)) E("ZRODLO_HR", "hrMaxSource", "Źródło HRmax: measured, estimated lub unknown.");
  if (inp.qualityNotBefore != null && !isRealDate(inp.qualityNotBefore)) E("DATA_JAKOSCI", "qualityNotBefore", "qualityNotBefore wymaga poprawnej daty.");
  const cw = num(inp.currentWeeklyKm), lr = num(inp.longestRecentRun);
  if (Number.isFinite(cw) && Number.isFinite(lr) && cw >= 0 && lr >= 0) {
    if (lr > 5 && cw === 0) W("SPRZECZNE_KM", "longestRecentRun", "Podano najdłuższy bieg, ale zerowy tygodniowy kilometraż: dane są sprzeczne, plan startuje ostrożnie od niskiej objętości.");
    else if (cw > 0 && lr > cw * 2 && lr > 8) W("SPRZECZNE_KM", "longestRecentRun", `Najdłuższy bieg (${lr} km) jest ponad dwa razy dłuższy niż cały średni tydzień (${cw} km): dane wyglądają na sprzeczne, plan traktuje je ostrożnie.`);
  }
  if (isBlank(inp.currentWeeklyKm)) W("HISTORIA_BRAK", "currentWeeklyKm", "Brak informacji o obecnym kilometrażu: plan startuje od bezpiecznego minimum.");
  for (const f of ["maxMinutes", "maxMinutesWeekday", "maxMinutesWeekend", "maxLongMinutes"]) {
    if (isBlank(inp[f])) continue;
    const v = num(inp[f]);
    if (!Number.isFinite(v) || v <= 0) E("LIMIT_CZASU_WARTOSC", f, `Limit czasu ${f} musi być dodatnią liczbą minut`);
    else if (v < 20) E("LIMIT_CZASU_ZA_MALY", f, `Limit czasu ${v} min (${f}) jest za mały na sensowny trening: potrzeba co najmniej 20 min, żeby zachować rozgrzewkę, część główną i schłodzenie`);
    else if (v < 40) W("LIMIT_CZASU_MALY", f, `Limit ${v} min (${f}) wyklucza pełnowartościowe treningi jakościowe i dłuższe biegi; plan będzie złożony głównie z krótkich biegów spokojnych.`);
  }
  if (!isBlank(inp.hrMax)) { const h = num(inp.hrMax); if (!Number.isFinite(h) || h < 120 || h > 230) E("TETNO_MAX", "hrMax", "Tętno maksymalne poza sensownym zakresem 120-230"); }
  if (!isBlank(inp.hrRest)) { const h = num(inp.hrRest); if (!Number.isFinite(h) || h < 30 || h > 100) E("TETNO_SPOCZ", "hrRest", "Tętno spoczynkowe poza sensownym zakresem 30-100"); }
  if (inp.goal != null && (typeof inp.goal !== "object" || Array.isArray(inp.goal))) E("CEL_FORMAT", "goal", "Pole goal musi być obiektem");
  const g = inp.goal && typeof inp.goal === "object" ? inp.goal : {};
  if (!isBlank(g.type) && !DIST[g.type] && g.type !== "health") E("CEL_TYP", "goal.type", "Nieznany cel (dozwolone: 5k, 10k, half, marathon, health)");
  if (!isBlank(g.raceDate)) {
    if (!isRealDate(g.raceDate)) E("DATA_ZAWODOW", "goal.raceDate", "Data zawodów jest niepoprawna (format RRRR-MM-DD, istniejąca data)");
    else if (isRealDate(inp.today) && g.raceDate <= inp.today) E("DATA_ZAWODOW_PRZESZLOSC", "goal.raceDate", "Data zawodów musi być w przyszłości");
    else if (isRealDate(inp.today) && diffDays(inp.today, g.raceDate) > 730) E("DATA_ZAWODOW_ODLEGLA", "goal.raceDate", "Data zawodów jest odleglejsza niż 2 lata: plan tak długo w przód nie ma sensu, ustaw bliższy start lub plan bez daty");
    if (!DIST[g.type]) E("CEL_ZAWODY_DYSTANS", "goal.type", "Zawody wymagają dystansu: 5k, 10k, half lub marathon");
  }
  if (!isBlank(g.targetTimeSec)) {
    const t = num(g.targetTimeSec);
    if (!Number.isFinite(t) || t <= 0) E("CZAS_CELU", "goal.targetTimeSec", "Czas docelowy musi być dodatnią liczbą sekund");
    else if (DIST[g.type]) { const pace = t / (DIST[g.type] / 1000); if (pace < PACE_MIN || pace > PACE_MAX) E("CZAS_CELU_NIEREALNY", "goal.targetTimeSec", `Czas docelowy ${fmtTime(t)} oznacza tempo ${fmtPace(pace)} min/km: to wartość nierealna (dopuszczalne ${fmtPace(PACE_MIN)}-${fmtPace(PACE_MAX)} min/km)`); }
  }
  if (!isBlank(inp.breakDays ?? inp.przerwaDni)) { const bd = num(inp.breakDays ?? inp.przerwaDni); if (!Number.isFinite(bd) || bd < 0 || bd > 3650) E("PRZERWA_WARTOSC", "breakDays", "Długość przerwy (breakDays) musi być liczbą dni od 0 do 3650"); }
  if (inp.records != null) {
    if (!Array.isArray(inp.records)) E("REKORDY_FORMAT", "records", "Pole records musi być listą wyników {distanceKm, timeSec, date?}");
    else inp.records.forEach((r, i) => { const d = num(r && r.distanceKm), t = num(r && r.timeSec); if (!Number.isFinite(d) || d <= 0 || !Number.isFinite(t) || t <= 0) E("REKORDY_WPIS", `records[${i}]`, `Rekord nr ${i + 1} wymaga dodatniego dystansu (km) i czasu (s)`); else if (t / d < PACE_MIN || t / d > PACE_MAX) E("REKORDY_NIEREALNY", `records[${i}]`, `Rekord nr ${i + 1} oznacza tempo ${fmtPace(t / d)} min/km: wartość nierealna`); });
  }
  if (inp.bestResult != null) {
    const b = inp.bestResult, d = num(b && b.distanceKm), t = num(b && b.timeSec);
    if (!Number.isFinite(d) || d <= 0 || !Number.isFinite(t) || t <= 0) E("WYNIK_FORMAT", "bestResult", "Wynik referencyjny wymaga dodatniego dystansu (km) i czasu (s)");
    else if (t / d < PACE_MIN || t / d > PACE_MAX) E("WYNIK_NIEREALNY", "bestResult", `Wynik referencyjny oznacza tempo ${fmtPace(t / d)} min/km: wartość nierealna`);
  }
  if (isBlank(g.raceDate) && !isBlank(inp.weeks)) { const w = num(inp.weeks); if (!Number.isInteger(w) || w < 4 || w > 52) E("TYGODNIE", "weeks", "Liczba tygodni planu bez daty zawodów musi mieścić się w zakresie 4-52"); }
  if (Array.isArray(inp.availableDays) && Number.isInteger(Number(inp.daysPerWeek)) && inp.daysPerWeek > inp.availableDays.length && inp.availableDays.length >= 1) W("DNI_SPRZECZNE", "daysPerWeek", `Zadeklarowano ${inp.daysPerWeek} treningów, ale dostępnych dni jest ${inp.availableDays.length}: plan zostanie ograniczony do dostępnych dni.`);
  return { bledy, ostrzezenia };
}
export function validateInput(inp) { return validateInputDetailed(inp).bledy.map((e) => e.komunikat); }

// ---------- obecna forma i ocena celu ----------
function currentVdot(I) {
  if (I.vdotOverride) return { vdot: I.vdotOverride, source: I.vdotSource || "historia treningów" };
  const b = I.bestResult;
  if (b && b.distanceKm > 0 && b.timeSec > 0) return { vdot: vdotFrom(b.distanceKm * 1000, b.timeSec), source: "wynik" };
  let v = { beginner: 28, intermediate: 38, advanced: 48 }[I.level];
  if (I.age > 40) v -= (I.age - 40) * 0.25;
  const bmi = I.weightKg && I.heightCm ? I.weightKg / (I.heightCm / 100) ** 2 : 0;
  if (bmi > 30) v -= 2;
  return { vdot: clamp(v, 22, 70), source: "szacunek" };
}
function predictions(I, vdot) {
  const vol = Math.max(I.currentWeeklyKm, 1), out = {};
  for (const k of Object.keys(DIST)) {
    let t = raceTimeFromVdot(DIST[k], vdot);
    if (k === "marathon") t *= 1 + clamp((45 - vol) / 45, 0, 1) * 0.08;
    if (k === "half") t *= 1 + clamp((35 - vol) / 35, 0, 1) * 0.04;
    out[k] = Math.round(t);
  }
  return out;
}
const MIN_WEEKS = { "5k": [6, 8], "10k": [8, 10], half: [12, 16], marathon: [16, 24] };

export function assessGoal(inp, weeksAvail) {
  const I = normalize(inp), g = I.goal, { vdot, source } = currentVdot(I);
  const pred = predictions(I, vdot), msgs = [];
  const res = { vdot: r1(vdot), zrodloVdot: source, prognoza: pred, tygodnie: weeksAvail, werdykt: "brak celu czasowego", sugerowanyCzas: null, wiadomosci: msgs };
  if (!DIST[g.type]) return res;
  res.pewnoscOceny = source === "wynik" || source === "historia treningów" ? "umiarkowana" : "niska";
  if (res.pewnoscOceny === "niska") msgs.push("Brak wiarygodnego aktualnego wyniku: prognoza tempa i konkretnego czasu jest orientacyjna.");
  const minW = MIN_WEEKS[g.type][I.level === "beginner" ? 1 : 0];
  res.minimalneTygodnie = minW;
  if (g.targetTimeSec) {
    const need = vdotFrom(DIST[g.type], g.targetTimeSec), gain = need / vdot - 1;
    const rate = { beginner: 0.008, intermediate: 0.005, advanced: 0.003 }[I.level];
    const cap = { beginner: 0.14, intermediate: 0.09, advanced: 0.05 }[I.level];
    const maxGain = Math.min(cap, (weeksAvail != null ? Math.max(weeksAvail, 0.5) : I.weeks) * rate);
    const ratio = gain <= 0 ? 0 : gain / maxGain;
    res.wymaganyWzrost = `${r1(gain * 100)}%`;
    res.mozliwyWzrost = `${r1(maxGain * 100)}%`;
    if (ratio <= 0.6) res.werdykt = "realny";
    else if (ratio <= 1) { res.werdykt = "ambitny"; msgs.push("Cel jest ambitny, ale możliwy przy regularnym treningu i bez przerw."); }
    else {
      res.werdykt = "nierealny";
      res.sugerowanyCzas = Math.round(raceTimeFromVdot(DIST[g.type], vdot * (1 + 0.8 * maxGain)));
      msgs.push(`Cel ${fmtTime(g.targetTimeSec)} wymaga poprawy formy o ok. ${r1(gain * 100)}%, a w tym czasie realnie da się uzyskać ok. ${r1(maxGain * 100)}%. Proponowany czas: ${fmtTime(res.sugerowanyCzas)}.`);
    }
  }
  return res;
}

// ---------- układ tygodnia ----------
function combos(arr, k) {
  const out = [];
  (function rec(s, c) { if (c.length === k) { out.push([...c]); return; } for (let i = s; i < arr.length; i++) { c.push(arr[i]); rec(i + 1, c); c.pop(); } })(0, []);
  return out;
}
const cyc = (a, b) => Math.min((pos(a) - pos(b) + 7) % 7, (pos(b) - pos(a) + 7) % 7);
function chooseDays(avail, k, longPref, rel) {
  let best = null, bs = -1e9;
  for (const c of combos(avail, k)) {
    const p = c.map(pos).sort((a, b) => a - b);
    let minGap = 7, adj = 0;
    for (let i = 0; i < p.length; i++) {
      const g = ((p[(i + 1) % p.length] - p[i]) + 7) % 7 || 7;
      minGap = Math.min(minGap, g); if (g === 1) adj++;
    }
    const longD = pickLong(c, longPref);
    let nextGap = 7;
    for (const d of c) if (d !== longD) nextGap = Math.min(nextGap, (pos(d) - pos(longD) + 7) % 7);
    const q = pickQualityDows(c, longD, 1)[0];
    let s = minGap * 100 - adj * 10 + (nextGap >= 2 ? 30 : -30) + nextGap * 5 + (longD === 0 || longD === 6 ? 10 : 0);
    if (q != null && cyc(q, longD) <= 1) s -= 40;
    if (longPref != null && longD === longPref) s += 15;
    if (rel) for (const d of c) if (rel[d] != null) s += (rel[d] - 0.7) * 60;
    if (s > bs) { bs = s; best = c; }
  }
  return best;
}
function pickLong(chosen, pref) {
  if (pref != null && chosen.includes(pref)) return pref;
  if (chosen.includes(0)) return 0;
  if (chosen.includes(6)) return 6;
  return [...chosen].sort((a, b) => pos(a) - pos(b)).pop();
}
function pickQualityDows(chosen, longDow, count) {
  const cyc = (a, b) => Math.min((pos(a) - pos(b) + 7) % 7, (pos(b) - pos(a) + 7) % 7);
  let cand = chosen.filter((d) => d !== longDow);
  const strict = cand.filter((d) => cyc(d, longDow) > 1);
  if (strict.length) cand = strict;
  // gdy dwa dni biegowe są obok siebie, mocny akcent ma być pierwszym z pary (drugi to bieg regeneracyjny)
  const isPairFirst = (d) => chosen.includes((((pos(d) + 1) % 7) + 1) % 7 === 0 ? 0 : [1, 2, 3, 4, 5, 6, 0][(pos(d) + 1) % 7]);
  cand.sort((a, b) => (isPairFirst(b) ? 1 : 0) - (isPairFirst(a) ? 1 : 0) || cyc(b, longDow) - cyc(a, longDow));
  const out = [];
  for (const c of cand) if (out.length < count && out.every((o) => cyc(o, c) > 1)) out.push(c);
  for (const c of cand) if (out.length < count && !out.includes(c)) out.push(c);
  return out;
}

// ---------- konstruktory jednostek treningowych ----------
const effLevel = (I) => (I.level === "beginner" && I.fitEvidence ? "intermediate" : I.level);
const roundHalf = (x) => Math.round(x * 2) / 2;
const zr = (c, i) => `${c.Z[i].od}-${c.Z[i].do}`;
const stepTxt = (s) => {
  const p = [];
  if (s.serie) p.push(`${s.serie}× ${s.reps}`);
  else if (s.powtorzenia) p.push(s.dystans_m ? `${s.powtorzenia}× ${s.dystans_m} m` : s.czas_odcinka_s?`${s.powtorzenia}× ${s.czas_odcinka_s} s`:`${s.powtorzenia}× podbieg`);
  else { if (s.dystans_km != null) p.push(`${s.dystans_km} km`); if (s.czas_min != null) p.push(`${s.czas_min} min`); }
  if (s.tempo) p.push(`tempo ${s.tempo}${/\d/.test(s.tempo) ? " min/km" : ""}`);
  if (s.czas_odcinka) p.push(`czas odcinka ${s.czas_odcinka}`);
  if (s.przerwa) p.push(`przerwa: ${s.przerwa}`);
  if (s.tetno) p.push(`tętno ${s.tetno}`);
  if (s.uwagi) p.push(s.uwagi);
  return `${s.etap}: ${p.join(", ")}`;
};
const descr = (k) => k.map((s, i) => `${i + 1}. ${stepTxt(s)}`).join("\n");
const warmStep = (c, extra) => nativeStep("warmup",{ etap: "Rozgrzewka", dystans_km: c.warm, tempo: range(c.P.easy), tetno: zr(c, 1) + " (Z2)", uwagi: extra },[c.P.easy.fast,c.P.easy.slow]);
const coolStep = (c) => nativeStep("cooldown",{ etap: "Schłodzenie", dystans_km: c.cool, tempo: range(c.P.recovery), tetno: zr(c, 0) + " (Z1)", uwagi: "spokojne zakończenie bez dodatkowego biegu" },[c.P.recovery.fast,c.P.recovery.slow]);

function qualitySession(c,family) {
  const p=prescribeQuality(c,family);
  if(!p.feasible){const km=Math.max(3,Math.floor(Math.min(c.qMax||5,5)));return {typ:'Bieg spokojny Z2',podtyp:'latwy',strefa:'Z2',tempo:range(c.P.easy),dist:km,min:km*c.easyMid/60,kroki:easyKroki(c,km,false,false,false)};}
  const pace=family==='threshold'?c.P.tempo:family==='interval'?c.P.interval:{fast:p.paceSecPerKm,slow:p.paceSecPerKm};
  const recoveryPace=(c.P.recovery.fast+c.P.recovery.slow)/2;
  const main=nativeStep('work',{etap:'Część główna',powtorzenia:p.reps,dystans_m:p.metres,tempo:range(pace),czas_odcinka:fmtTime(p.metres/1000*p.paceSecPerKm),przerwa:p.rest?`${p.rest} s spokojnego truchtu`:'bez przerwy',przerwa_km:p.rest/recoveryPace,liczba_przerw:Math.max(0,p.reps-1),czas_przerwy_s:p.rest,recoveryType:p.restType,tetno:family==='interval'?'RPE i równe odcinki; HR narasta z opóźnieniem':c.I.hrMaxEstimated?'RPE/test rozmowy; HR jest szacowane':`${c.Z[2].od}-${c.Z[3].do} (orientacyjnie)`,uwagi:p.reason+' Jeśli nie wyszło: nie nadrabiaj; skróć lub biegnij spokojnie.'},[pace.fast,pace.slow],family);
  const kroki=[warmStep(c,'Spokojnie, następnie mobilizacja; bez obowiązkowego dodatkowego akcentu.'),main,coolStep(c)];
  const podtyp={threshold:'tempo',interval:'interwaly',specific:'tempo_startowe'}[family],d=measureWorkout({podtyp,kroki});
  return {typ:family==='interval'?'Interwały':'Tempo',podtyp,strefa:family==='interval'?'Z5':'Z3-Z4',tempo:range(pace),dist:r1(d.total.distanceKm),min:Math.round(d.total.minutes),kroki,prescription:p};
}
function mkTempo(c,k){return qualitySession(c,'threshold');}
function mkInterval(c,k){return qualitySession(c,'interval');}
function mkRacePace(c,k){return qualitySession(c,'specific');}
function mkTest(c) {
  if(c.I.controlTests!=='maximal'){
    const t=['half','marathon'].includes(c.I.goal.type)?mkRacePace(c,c.state.raceK):mkTempo(c,Math.min(c.state.tempoK,3));
    t.typ='Kontrola submaksymalna';
    t.kroki[0].uwagi='Porównaj RPE i warunki z poprzednim podobnym treningiem. Nie jest to maksymalny test VDOT.';
    return t;
  }
  const km = c.I.level === "advanced" ? 5 : 3;
  const kroki = [
    warmStep(c, "pod koniec 4 przebieżki po 20 s"),
    { etap: `Test ${km} km`, dystans_km: km, tempo: "maksymalny równy wysiłek", tetno: `${c.Z[3].od}-${c.Z[4].do} (Z4-Z5)`, uwagi: "zacznij spokojnie, trzymaj równe tempo, ostatni kilometr na ile masz sił. Po biegu wpisz trening z zaznaczeniem 'zawody lub test' i w części głównej podaj dystans i czas samego testu." },
    coolStep(c),
  ];
  return { typ: "Test", podtyp: "test", strefa: "Z5", tempo: "maks. równy", dist: r1(c.warm + c.cool + km), min: Math.round(((c.warm + c.cool) * c.easyMid + km * c.P.interval.slow) / 60), kroki };
}
// co który trening z cyklu interwałowego zamienić na podbiegi: liczba >= 2 wybrana przez użytkownika albo tryb automatyczny
function hillsEvery(I) {
  if (typeof I.podbiegi === "number" && I.podbiegi >= 2) return Math.round(I.podbiegi);
  return I.goal.type === "half" || I.goal.type === "marathon" ? 2 : 3;
}
const HILLS = [[6, 60], [8, 60], [6, 90], [8, 90], [10, 90], [8, 120]];
function mkHills(c, k) {
  let [reps, sec] = HILLS[Math.min(k, HILLS.length - 1)];
  if (c.taper) reps = Math.max(4, reps - 3);
  const up = () => sec / (c.P.interval.slow * 1.15);
  while (c.qMax && reps > 4 && c.warm + c.cool + reps * 2 * up() > c.qMax) reps--;
  const previous=c.state.doseByFamily?.podbiegi,cap=previous?Math.max(previous*1.25,previous+1):Infinity;
  while(reps>4&&reps*sec/60>cap)reps--;
  if(reps*sec/60>cap){const km=Math.max(3,Math.floor(Math.min(c.qMax||6,6)));return {typ:'Bieg spokojny Z2',podtyp:'latwy',strefa:'Z2',tempo:range(c.P.easy),dist:km,min:km*c.easyMid/60,kroki:easyKroki(c,km,false,false,false)};}
  const kroki = [
    warmStep(c, "pod koniec 4 przebieżki po 20 s"),
    nativeStep("work",{ etap: "Podbiegi", praca_min:reps*sec/60,czas_odcinka_s:sec,czas_przerwy_s:Math.round(sec*1.4),liczba_przerw:reps,dystans_km: roundHalf(reps * 2 * up()), powtorzenia: reps, czas_odcinka: `${sec} s`, tempo: "mocny, równy wysiłek pod górę (jak na ok. 5 km)", przerwa: `zbieg truchtem do punktu startu (ok. ${Math.round(sec * 1.4)} s)`, tetno: `${c.Z[4].od}-${c.Z[4].do} (Z5)`, uwagi: "stromość ok. 4-7%, krótki krok, wysoko kolana, ręce pracują. Nie rzucaj się na pierwszy podbieg." },null,"hill"),
    coolStep(c),
  ];
  return { typ: "Interwały", podtyp: "podbiegi", strefa: "Z5", tempo: "pod górę", dist: r1(c.warm + c.cool + roundHalf(reps * 2 * up())), min: Math.round(((c.warm + c.cool) * c.easyMid) / 60 + (reps * (sec + sec * 1.4)) / 60), kroki };
}
function mkSharpen(c) {
  const pace=c.specificPace||c.goalPace,restPace=(c.P.recovery.fast+c.P.recovery.slow)/2;
  const kroki=[warmStep(c,''),nativeStep('work',{etap:'Krótki rytm startowy',powtorzenia:4,dystans_m:60/pace*1000,czas_odcinka_s:60,czas_przerwy_s:120,liczba_przerw:3,przerwa_km:120/restPace,tempo:fmtPace(pace),uwagi:'4 × 1 min swobodnie; 3 przerwy po 2 min. Pomiń przy zmęczeniu.'},pace,'specific'),coolStep(c)];
  const d=measureWorkout({podtyp:'ostrzenie',kroki});return {typ:'Tempo',podtyp:'ostrzenie',strefa:'Z3',tempo:fmtPace(pace),dist:r1(d.total.distanceKm),min:Math.round(d.total.minutes),kroki};
}
const SILA_A = [["Przysiady", "12 powt.", "16 powt. z obciążeniem", "pięty na ziemi, kolana nad stopami, plecy proste"], ["Wykroki w tył", "10 powt./nogę", "12 powt./nogę z hantlami", "tułów pionowo, kolano nie dotyka ziemi"], ["Mostek biodrowy", "12 powt.", "8 powt./nogę (jedna noga)", "ściśnij pośladki na górze, 1 s pauzy"], ["Wspięcia na palce", "15 powt.", "12 powt./nogę (jedna noga)", "powoli w dół, pełny zakres ruchu"]];
const SILA_B = [["Deska (plank)", "30 s", "45 s", "ciało w jednej linii, brzuch napięty"], ["Deska boczna", "20 s/stronę", "30 s/stronę", "biodra wysoko, nie opadają"], ["Martwy ciąg na jednej nodze", "8 powt./nogę", "10 powt./nogę z hantlem", "plecy płaskie, miednica prosto"], ["Bird-dog", "10 powt./stronę", "12 powt./stronę", "powoli, bez bujania biodrami"]];
function mkSila(c, idx) {
  const set = idx % 2 === 0 ? SILA_A : SILA_B, adv = c.I.level === "advanced";
  const serie = c.taper ? 1 : c.phase === "build" ? 3 : 2;
  const kroki = [{ etap: "Mobilizacja", czas_min: 5, uwagi: "krążenia bioder, wymachy nóg, kot-krowa, 20 s marszu w miejscu" }];
  for (const [n, easy, hard, tip] of set) kroki.push({ etap: n, serie, reps: adv ? hard : easy, przerwa: "45 s", uwagi: (c.I.injuries ? "wolniej i płycej, przy bólu przerwij. " : "") + tip });
  kroki.push({ etap: "Rozciąganie", czas_min: 5, uwagi: "łydki, uda, zginacze bioder, pośladki, po 30 s na stronę" });
  return { typ: "Inny", podtyp: "sila", strefa: "-", tempo: "-", dist: 0, min: 30 + (serie - 2) * 5, kroki };
}
function mkCross(c) {
  const kroki = [{ etap: "Rower, orbitrek, pływanie lub szybki marsz", czas_min: 40, tetno: `${c.Z[0].od}-${c.Z[1].do} (Z1-Z2)`, uwagi: "spokojny, równy wysiłek (RPE 3-4). Zastępuje dodatkowy bieg, nie dokłada obciążenia stawom." }];
  return { typ: "Inny", podtyp: "cross", strefa: "Z1-Z2", tempo: "-", dist: 0, min: 40, kroki };
}
const easyKroki = (c, d, strides, recovery, consec) => {
  const z = recovery ? 0 : 1;
  const k = [nativeStep("easy",{ etap: recovery ? "Bieg regeneracyjny" : "Bieg spokojny", dystans_km: d, tempo: range(recovery ? c.P.recovery : c.P.easy), tetno: `${zr(c, z)} (Z${z + 1})`, uwagi: recovery ? "bardzo lekko, bez presji na tempo" : `Tempo rozmowy/RPE ma pierwszeństwo; tętno ${c.I?.hrMaxEstimated !== false ? "szacowane, orientacyjne" : "według podanego HRmax"}. Jeśli czujesz nadmierny wysiłek, zwolnij lub wstaw krótki marsz${consec ? ". Drugi dzień biegowy z rzędu: trzymaj dolną część zakresu tempa" : ""}` },recovery?[c.P.recovery.slow,c.P.recovery.slow]:[c.P.easy.fast,c.P.easy.slow])];
  if (strides) k.push(nativeStep("economy",{ etap: "Przebieżki", powtorzenia:6,czas_odcinka_s:20,czas_przerwy_s:75,liczba_przerw:5,wliczoneWDystansBiegu:true,uwagi: "Wpleć 6× 20 s szybko, ale swobodnie, w końcowy fragment biegu; między odcinkami 60-90 s truchtu. Nie dodawaj tego dystansu ponownie." },null,"strides"));
  return k;
};

// plan jakości na dany tydzień
function qualityKinds(I, phase, k, recovery, raceWeek, lateBase) {
  const policy = qualityPolicy(I, phase, k, recovery, raceWeek, lateBase);
  if (policy !== null) return policy;
  if (recovery) return [];
  const gt = I.goal.type, days = I.daysPerWeek, longGoal = gt === "half" || gt === "marathon";
  if (raceWeek) return days >= 4 ? ["sharpen"] : [];
  const intervalsOk0 = (I.level !== "beginner" || I.fitEvidence) && !I.injuries && !(I.bmi >= 35);
  if (phase === "base") return lateBase && intervalsOk0 && !I.planVdotAktywny ? ["tempo"] : [];
  let n = 0;
  if (phase === "build") n = 1;
  else if (phase === "peak") {
    // Dla półmaratonu i maratonu długi bieg jest już dużym bodźcem:
    // pozostaje jeden trening jakościowy, a reszta objętości ma być spokojna.
    // Dwa akcenty w szczycie zostawiamy tylko zaawansowanym na 5/10 km.
    // v21: dwa akcenty w szczycie także dla średniozaawansowanych na 5/10 km przy 5+ dniach (V20: tylko zaawansowani; 5 dni = 1 akcent + 3 biegi „regeneracyjne”).
    n = days >= 5 && I.level !== "beginner" && !longGoal && intervalsOk0 ? 2 : 1;
  }
  else if (phase === "taper") n = days >= 3 ? 1 : 0;
  if (!n) return [];
  const intervalsOk = intervalsOk0;
  if (phase === "build") {
    const alt = intervalsOk && k % 2 === 1, base = alt && !longGoal ? "interval" : "tempo";
    return [I.podbiegi && alt ? "slot:" + base : base];
  }
  if (phase === "taper") return [longGoal || !intervalsOk ? "tempo" : "interval"];
  let first = longGoal ? "racepace" : gt === "10k" && !I.injuries && k % 2 === 0 ? "racepace" : intervalsOk ? "interval" : "tempo";
  if (I.podbiegi && first === "interval") first = "slot:interval";
  return n === 2 ? [first, "tempo"] : [first];
}

// ---------- marszobiegi dla zupełnie początkujących ----------
const RW = [[1, 2, 8], [2, 2, 6], [3, 2, 5], [5, 2, 4], [8, 2, 3], [25, 0, 1]];
const rwDist = ([run, walk, reps]) => r1(reps * ((run * 8) / 60 + (walk * 5) / 60));

// ---------- budowa jednego tygodnia ----------
function buildWeek(c) {
  const { I, weekStart, vol, startDate, raceDate, chosen, longDow, state } = c;
  const dates = chosen.map((d) => ({ dow: d, date: addDays(weekStart, pos(d)) }))
    .filter((x) => x.date >= startDate && (!raceDate || x.date < raceDate) && !(raceDate && I.przedStartem === "odpoczynek" && x.date === addDays(raceDate, -1)))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  if (!dates.length) return [];
  const scale = Math.min(1, dates.length / chosen.length), V = vol * scale;
  if (!I.warmUser) c.warm = roundHalf(clamp(V * 0.12, 1, I.warm));   // przy małej objętości krótsza rozgrzewka i schłodzenie
  if (!I.coolUser) c.cool = roundHalf(clamp(V * 0.09, 1, I.cool));
  const out = [];
  const push = (date, s) => out.push({ data: date, typ: s.typ, dystans_km: r1(s.dist), czas_min: Math.round(s.min), strefa_tetna: s.strefa, tempo_zakres: s.tempo, opis: descr(s.kroki), kroki: s.kroki, ...(s.prescription ? {prescription:s.prescription} : {}), ...(s.progresywny ? { progresywny: true } : {}), odciazenie: !!c.recovery, faza_planu: c.phase, podtyp: s.podtyp || { "Bieg spokojny Z2": "latwy", "Długi bieg": "dlugi", Regeneracyjny: "regeneracja", Tempo: "tempo", Interwały: "interwaly" }[s.typ] || "inny" });
  const em = c.easyMid, lm = c.longMid || em;
  const limOf = (date) => { const d = dowOf(date); return d === 0 || d === 6 ? I.maxMinutesWe : I.maxMinutesWd; };
  const kmFit = (date, pace) => Math.floor((limOf(date) * 60) / pace + 1e-9); // maks. km mieszczące się w limicie czasu dnia
  const tn = state.timeNotes;

  if (I.daysPerWeek <= 2 && !c.rw) {
    c.qualitySlots=1;
    lowFrequencyWeek(c,dates,V,{push,range,one:oneRunPrescription,limit:limOf,fit:kmFit,share:maxLongShare,policy:qualityPolicy,easy:(km,strides=false)=>easyKroki(c,km,strides,false,false),interval:k=>mkInterval(c,k),threshold:k=>mkTempo(c,k),specific:k=>mkRacePace(c,k),add:addDays,dow:dowOf,strength:()=>mkSila(c,state.silaK++),cross:()=>mkCross(c)});
    return out.sort((a,b)=>a.data.localeCompare(b.data));
  }
  if (c.rw) {
    const st = RW[c.rwStage], cont = st[1] === 0;
    // v17: początkujący z minimalną bazą nie dostaje więcej niż 3 sesji marszobiegu tygodniowo (inaczej skok z 3-4 km do 12+ km)
    const rwDates = I.currentWeeklyKm < 10 && dates.length > 3 ? [dates[0], dates[Math.floor((dates.length - 1) / 2)], dates[dates.length - 1]] : dates;
    rwDates.forEach((x) => {
      const reps = st[2] > 1 && x.dow === longDow && !(I.bmi >= 35) ? st[2] + 2 : st[2];
      const main = cont ? 25 : reps * (st[0] + st[1]);
      const kroki = [
        { etap: "Rozgrzewka", czas_min: 5, tempo: "szybki marsz" },
        { etap: "Część główna", czas_min: main, tetno: `${c.Z[0].od}-${c.Z[1].do} (Z1-Z2)`, uwagi: cont ? "ciągły, bardzo spokojny bieg (rozmowa możliwa)" : `${reps}× (${st[0]} min bardzo wolnego biegu + ${st[1]} min marszu)` },
        { etap: "Schłodzenie", czas_min: 5, tempo: "spokojny marsz" },
      ];
      push(x.date, { typ: "Marszobieg", podtyp: "marszobieg", dist: rwDist([st[0], st[1], reps]), min: main + 10, strefa: "Z1-Z2", tempo: "bardzo wolno", kroki });
    });
    return out;
  }

  const raceWeek = c.raceWeek, shake = raceDate && I.przedStartem === "trucht" ? addDays(raceDate, -1) : null;
  const dr = (d) => (raceDate ? diffDays(d, raceDate) : 99);
  const gateLong = { "5k": 3, "10k": 4, half: 6, marathon: 8 }[I.goal.type] || 4;
  let longItem = !raceWeek && !c.noLong ? dates.find((x) => x.dow === longDow && x.date !== shake && dr(x.date) > gateLong) : null;

  const shakeItem = dates.find((x) => x.date === shake);
  const shakeKm = shakeItem ? 3 : 0;
  const B = (c.budget != null ? c.budget : V) * scale; // budżet kilometrów tygodnia (limit bezpiecznego przyrostu)
  const mEasy = c.minEasy;
  // Przy 5 biegach dokładamy pełne, krótkie jednostki (4 km dla średniozaawansowanych
  // i zaawansowanych). Przy 6 dniach zostawiamy krótszy próg 3 km, bo pięć
  // dodatkowych biegów po 4 km mogłoby wymusić zbyt duży skok objętości.
  const frequencyFloor = I.daysPerWeek === 5 ? mEasy : I.daysPerWeek >= 3 ? 3 : mEasy;
  const mOf = (date) => (raceDate && dr(date) < 7 ? 3 : Math.min(mEasy, frequencyFloor)); // v21: w ostatnim tygodniu min. 3 km (V20: 2 km = 1158 ostrzeżeń BIEG_ZA_KROTKI) // krótsze jednostki uzupełniające przy wyższej częstotliwości
  const E0 = Math.max(mEasy, Math.min(c.weekIdx < 2 ? mEasy : c.easyBaseKm, 7)); // bieg bazowy Z2: stała, krótka jednostka tlenowa
  const kinds = qualityKinds(I, c.phase, c.kQuality, c.recovery, raceWeek, c.lateBase);
  if(I.goal.type==='marathon' && I.daysPerWeek>=4 && I.currentWeeklyKm>=45 && I.longestRecentRun>=20 && I.longDistanceRaces>0 && I.experienceMonths>=24 && I.loadTolerance!=='low' && I.intensityTolerance!=='low' && c.phase==='peak' && !c.recovery && !c.taper && !I.injuries && c.longKm>=24 && c.weekIdx%3===1)kinds.length=0; // replace isolated MP with a controlled long-run finish
  if (B < (c.phase === "base" && I.daysPerWeek <= 3 ? 10 : 8) && c.phase !== "taper") kinds.length = 0;
  if (c.weekIdx < (readyForEarlyQuality(I) ? 1 : 3) || c.noQuality) kinds.length = 0; // pierwsze 3 tygodnie tylko łatwe biegi, bez jakości
  if (c.isTestWeek && kinds.length) kinds[0] = "test";
  kinds.forEach((kd, i) => {
    if (typeof kd === "string" && kd.startsWith("slot:")) { state.slotK++; kinds[i] = state.slotK % hillsEvery(I) === 0 ? "hills" : kd.slice(5); }
  });
  // długi bieg: własna, rosnąca krzywa (nie zależy od podziału reszty kilometrów)
  let L = 0;
  if (longItem) {
    L = c.longKm;
    if ((I.goal.type === "5k" || I.goal.type === "10k") && dr(longItem.date) <= gateLong + 5 && !c.taper) L *= 0.85; // tuż przed startem krócej
    L = Math.max(3, Math.round(L));
    // udział długiego biegu w objętości tygodnia zależy od dystansu i częstotliwości (nie jeden limit dla wszystkich)
    if (I.daysPerWeek >= 2 && !c.recovery) L = Math.min(L, Math.max(3, Math.floor(maxLongShare(I.goal.type, I.daysPerWeek) * Math.max(c.vol, 1))));
    const Lt = Math.min(kmFit(longItem.date, lm), Math.floor(c.longMin * 60 / lm));                 // limit czasu dnia, w którym wypada długi bieg
    if (L > Lt) { tn.dlugiSkrocony++; L = Lt; }
    if (L < 3) { longItem = null; L = 0; tn.dlugiPominiety++; }
  }
  // minimum sensownego tygodnia: długi bieg plus co najmniej jeden pełny bieg (nie ma tygodni z jednym biegiem)
  // v17: liczba biegów wynika z budżetu kilometrów, a nie odwrotnie. Wcześniej wymuszone minimum
  // (np. 5 dni × 4 km) podnosiło objętość tygodnia ponad bezpieczny przyrost (np. 14 → 23 km).
  const wantSlots = Math.max(0, dates.length - (longItem ? 1 : 0) - (shakeItem ? 1 : 0));
  const affordable = Math.floor((B - (longItem ? L : 0) - shakeKm) / Math.max(1, frequencyFloor));
  const plannedRunSlots = wantSlots === 0 ? 0 : clamp(affordable, 1, wantSlots);
  const B2 = Math.max(B, (longItem ? L : 0) + plannedRunSlots * frequencyFloor + shakeKm);
  if (kinds.length > 1 && (longItem ? 1 : 0) + plannedRunSlots < 5) kinds.length = 1; // v21: drugi akcent tylko, gdy w tygodniu faktycznie jest 5+ biegów
  // jakość dostaje to, co zostaje z budżetu po długim biegu
  const targetEasyReserve = Math.max(0, I.daysPerWeek - (longItem ? 1 : 0) - kinds.length) * (I.daysPerWeek >= 5 ? 2 : I.daysPerWeek === 4 ? 3 : I.daysPerWeek === 3 ? 3 : mEasy);
  const qualitySessionCap = qualityBudget(c, ({ "5k": 8, "10k": 9, half: 10, marathon: 10 }[I.goal.type] || 8) + clamp(Math.round((B2 - 40) / 10), 0, 4)); // przy wysokiej objętości akcent może być dłuższy (nadal ograniczony czasem i budżetem)
  c.qMax = Math.min(qualitySessionCap, Math.max(0, B2 - L - shakeKm - targetEasyReserve) / Math.max(1, kinds.length));
  c.qualitySlots=Math.max(1,kinds.length);
  const qMaxBase = c.qMax;
  const qDows = pickQualityDows(chosen, longDow, kinds.length);
  if(c.qualityDow!=null&&qDows.length)qDows[0]=c.qualityDow;
  const qItems = [];
  kinds.forEach((kind, i) => {
    const it = dates.find((x) => x.dow === qDows[i] && x !== longItem && x.date !== shake);
    if (!it) return;
    // v18-P7: długi bieg jest mocną jednostką; akcent dzień przed/po nim to dwa mocne treningi pod rząd (V17 układała i potem "naprawiała" 743 razy)
    // v21: także dzień po długim biegu z POPRZEDNIEGO tygodnia (np. dostępne tylko niedziela i poniedziałek)
    const afterPrevLong = longItem && it.date > startDate && dowOf(addDays(it.date, -1)) === longDow && addDays(it.date, -1) < weekStart;
    if (longItem && (Math.abs(diffDays(it.date, longItem.date)) === 1 || afterPrevLong)) { tn.jakoscPominietaSasiedztwo = (tn.jakoscPominietaSasiedztwo || 0) + 1; return; }
    const d2r = dr(it.date);
    if (state.hardDates.some(date=>date<it.date && diffDays(date,it.date)<I.recoveryDays)) return;
    if (d2r < 3 || I.qualityNotBefore && it.date < I.qualityNotBefore) return;
    if (longItem && Math.abs(diffDays(it.date,longItem.date)) < I.recoveryDays) return;
    c.qMax = Math.max(0, Math.min(qMaxBase, kmFit(it.date, em))); // trening jakościowy musi mieścić się w limicie czasu dnia
    c.dayMinutes=limOf(it.date);
    let s;
    if (d2r < 7 && kind !== "sharpen") s = mkSharpen(c);
    else if (kind === "tempo") s = mkTempo(c, state.tempoK++);
    else if (kind === "interval") s = mkInterval(c, state.intervalK++);
    else if (kind === "racepace") s = mkRacePace(c, state.raceK++);
    else if (kind === "test") s = mkTest(c);
    else if (kind === "hills") s = mkHills(c, state.hillK++);
    else s = mkSharpen(c);
    const qLim = c.qMax * 1.1; // zbyt duży trening jakościowy względem budżetu: łagodniejsza wersja, a gdy nadal za duży, bez jakości
    // v18-P7: test formy (3-5 km + rozgrzewka i schłodzenie) bywał wyjęty spod tego strażnika i przy małych objętościach zastępował
    // bieg 4 km jednostką 7 km (skok +29% zaraz po tygodniu odciążającym). Test musi mieścić się w budżecie (z niewielkim zapasem).
    if (s.podtyp === "test" && s.dist > qLim + 1.5) { tn.testPominiety = (tn.testPominiety || 0) + 1; return; }
    if (s.dist > qLim && s.podtyp !== "ostrzenie" && s.podtyp !== "test") { s = mkTempo(c, state.tempoK); if (s.dist > qLim) return; state.tempoK++; }
    if (s.min > limOf(it.date)) { tn.jakoscPominietaPrzezCzas++; return; } // brak miejsca na rozgrzewkę, część główną i schłodzenie
    qItems.push({ it, s });
  });
  c.qMax = qMaxBase;
  // v18-P3: gdy jednostka jakościowa zajmuje jedyny slot biegu (typowo 2-3 dni biegowe), V17 gubiła budżet tygodnia
  // (np. bieg łatwy 10 km zastąpiony akcentem 6,5 km => tydzień po odciążeniu o 7 km niższy od planu).
  // Teraz akcent przejmuje brakujące kilometry jako dłuższa rozgrzewka/schłodzenie w tempie spokojnym,
  // ale tylko do wysokości zaplanowanego (już ograniczonego rampą) budżetu i limitu czasu dnia.
  if (qItems.length && !c.recovery && !c.taper && !raceWeek) {
    const easySlots = dates.length - (longItem ? 1 : 0) - (shakeItem ? 1 : 0) - qItems.length;
    if (easySlots <= 0) {
      const sessionCap = ({ "5k": 10, "10k": 11, half: 12, marathon: 13 }[I.goal.type] || 10) + clamp(Math.round((B2 - 40) / 10), 0, 4);
      let gap = B2 - L - shakeKm - qItems.reduce((a, q) => a + q.s.dist, 0);
      for (const q of qItems) {
        if (gap < 1) break;
        const w = q.s.kroki.find((k) => k.etap === "Rozgrzewka"), cl = q.s.kroki.find((k) => k.etap === "Schłodzenie");
        if (!w || !cl || q.s.podtyp === "ostrzenie") continue;
        const room = Math.min(gap / qItems.length + 0.01, sessionCap - q.s.dist, ((limOf(q.it.date) - 1 - q.s.min) * 60) / em);
        const wAdd = Math.max(0, Math.min(room * 0.55, (I.daysPerWeek <= 2 ? 2.5 : 4) - w.dystans_km)), cAdd = Math.max(0, Math.min(room - wAdd, (I.daysPerWeek <= 2 ? 2 : 3.5) - cl.dystans_km));
        const added = wAdd + cAdd;
        if (added < 0.5) continue;
        w.dystans_km = r1(w.dystans_km + wAdd); cl.dystans_km = r1(cl.dystans_km + cAdd);
        q.s.dist = r1(q.s.dist + added); q.s.min = Math.round(q.s.min + (added * em) / 60);
        gap -= added; tn.jakoscUzupelnionaKm = r1((tn.jakoscUzupelnionaKm || 0) + added);
      }
    }
  }
  const qSum = qItems.reduce((a, q) => a + q.s.dist, 0);
  const prevLastLong = state.lastLong, prevPlannedLong = state.plannedLong;

  if (longItem) {
    if (!c.recovery && !c.taper) { state.lastLong = Math.max(state.lastLong, L); state.plannedLong = Math.max(state.plannedLong, L); }
    const progOk = I.daysPerWeek >= 4 && I.trainingIntent === "poprawa" && I.goal.type !== "marathon" && c.goalTimed && (c.phase === "build" || c.phase === "peak") && !c.recovery && !c.taper && !I.injuries && L >= 7;
    let acc = null;
    if (progOk) acc = state.longProg++ % 2 === 1 ? (c.phase === "peak" ? "start" : "prog") : null; // co drugi długi bieg jest progresywny
    // A prepared marathoner may replace one isolated MP session with a short controlled finish.
    // Never add this on top of another quality session; qualification is based on observed starting evidence.
    if(I.goal.type==='marathon' && I.daysPerWeek>=4 && I.currentWeeklyKm>=45 && I.longestRecentRun>=20 && I.longDistanceRaces>0 && I.experienceMonths>=24 && I.loadTolerance!=='low' && I.intensityTolerance!=='low' && c.phase==='peak' && !c.recovery && !c.taper && !I.injuries && !qItems.length && L>=24 && c.weekIdx%3===1)acc='start';
    const maxFin = { "5k": 3, "10k": 3, half: 4, marathon: 5 }[I.goal.type] || 3;
    const fin = acc ? clamp(Math.round(L * 0.25), 2, maxFin) : 0;
    const fuel = I.goal.type === "marathon" && (L*lm)/60>75 ? "Próba żywienia: ćwicz małe, indywidualnie tolerowane porcje; nawodnienie według pragnienia, warunków i tolerancji, bez przymusowego picia. " : (L * lm) / 60 > 75 ? "Bieg powyżej 75 min: przećwicz indywidualnie tolerowane żywienie i nawodnienie, bez automatycznej dawki." : "";
    const z3 = { fast: c.P.tempo.slow * 1.03, slow: c.P.easy.fast };
    const kroki = acc
      ? [{ etap: "Część spokojna", dystans_km: r1(L - fin), tempo: range(c.P.long || c.P.easy), tetno: zr(c, 1) + " (Z2)", uwagi: ("buduje wytrzymałość tlenową. " + fuel).trim() },
         acc === "start"
           ? { etap: "Końcówka w tempie startowym", dystans_km: fin, tempo: fmtPace(c.specificPace || c.goalPace), czas_odcinka: fmtTime(fin * (c.specificPace || c.goalPace)), tetno: `${c.Z[2].od}-${c.Z[3].do} (Z3-Z4)`, uwagi: I.goal.type==="marathon"?"Warunkowo po bezobjawowej realizacji bazy: kontrolowane MP, RPE 5; przy zmęczeniu cały bieg spokojnie. Próba żywienia, bez sprintu na końcu.":"pierwsze ok. 75% dystansu spokojnie w Z2, końcówka w tempie startowym na zmęczonych nogach" }
           : { etap: "Końcówka progresywna (tempo progowe)", dystans_km: fin, tempo: range(c.P.tempo), czas_odcinka: fmtTime(fin * ((c.P.tempo.fast + c.P.tempo.slow) / 2)), tetno: `${c.Z[2].od}-${c.Z[3].do} (Z3-Z4)`, uwagi: "pierwsze ok. 75% dystansu spokojnie w Z2, końcówka podciągnięta do tempa progowego" }]
      : [{ etap: "Długi bieg ciągły", dystans_km: L, tempo: range(c.P.long || c.P.easy), tetno: zr(c, 1) + " (Z2)", uwagi: ("buduje wytrzymałość: tempo rozmowy, równo od początku do końca. " + fuel).trim() }];
    kroki.forEach((s,index)=>Object.assign(s,nativeStep(acc&&index===1?'work':'easy',s,acc&&index===1?(acc==='start'?[c.specificPace||c.goalPace,c.specificPace||c.goalPace]:[c.P.tempo.fast,c.P.tempo.slow]):[c.P.long.fast,c.P.long.slow],acc&&index===1?(acc==='start'?'specific':'threshold'):null)));
    push(longItem.date, { typ: "Długi bieg", podtyp: "dlugi", dist: L, min: (L * lm) / 60, strefa: acc ? "Z2-Z4" : "Z2", tempo: range(c.P.long || c.P.easy), kroki, progresywny: !!acc });
  }
  qItems.forEach((q) => push(q.it.date, q.s));

  // v21-A: biegi spokojne i regeneracyjne.
  // (1) Dni biegów spokojnych wybierane są tak, by tydzień był równo rozłożony (najmniejsza największa przerwa), a nie tylko daleko od akcentów.
  // (2) „Regeneracyjny" to wyłącznie krótki bieg w dniu PO mocnej jednostce (długi bieg, akcent, test, start), z limitem czasu zależnym od poziomu.
  //     Każdy inny dodatkowy bieg to zwykły bieg spokojny Z2 (V20 nazywała regeneracją każdy bieg po jakimkolwiek biegu, do 9 km / ponad 60 min).
  // (3) Kilometry ponad limit biegu regeneracyjnego przejmują inne biegi spokojne; jeśli się nie mieszczą, tydzień jest krótszy (jawnie raportowane).
  const HARDT = ["Tempo", "Interwały", "Test", "Start", "Długi bieg"];
  const taken = new Set(out.map((o) => o.data));
  const slots = dates.filter((x) => !taken.has(x.date) && x.date !== shake);
  const capFor = (date) => { const d = dowOf(date); return (((d === 0 || d === 6 ? I.maxMinutesWe : I.maxMinutesWd)) * 60) / em; };
  const left = Math.max(0, B2 - L - qSum - shakeKm);
  const runsBase = (longItem ? 1 : 0) + qItems.length;
  // Przy większej częstotliwości jednostki łatwe mogą być krótsze, ale nadal mają cel tlenowy; tydzień startowy: min. 3 km (2 km nie ma sensu treningowego).
  const minAny = slots.length ? Math.min(...slots.map((x) => Math.max(frequencyFloor, mOf(x.date)))) : frequencyFloor;
  let nE = Math.min(slots.length, Math.floor((left + 0.5) / minAny));
  // Przy 1-3 dniach zachowujemy ostrożne dokładanie maks. jednej jednostki na tydzień.
  if (I.daysPerWeek <= 3 && c.prevRuns > 0 && !c.recovery && !c.taper) nE = Math.min(nE, Math.max(0, c.prevRuns + 1 - runsBase));
  const hardDs = out.map((o) => o.data);
  const hardSet = new Set(out.filter((o) => HARDT.includes(o.typ)).map((o) => o.data));
  const longDateOut = out.find((o) => o.podtyp === "dlugi")?.data;
  let easyDates = [];
  if (nE > 0) {
    const wkEnd = addDays(weekStart, 7);
    const evalCombo = (cmb) => {
      const ds = [...new Set([...hardDs, ...cmb.map((x) => x.date)])].sort();
      let maxGap = 0, minGap = 99;
      for (let i = 1; i < ds.length; i++) { const g = diffDays(ds[i - 1], ds[i]); maxGap = Math.max(maxGap, g); minGap = Math.min(minGap, g); }
      if (ds.length) maxGap = Math.max(maxGap, diffDays(ds[ds.length - 1], wkEnd) + diffDays(weekStart, ds[0]));
      let sc = -100 * maxGap + 10 * Math.min(minGap, 4);
      for (const x of cmb) { const nxt = addDays(x.date, 1); if (nxt === longDateOut) sc -= 8; else if (hardSet.has(nxt)) sc -= 5; }
      return sc;
    };
    let best = null, bs = -Infinity;
    for (const cmb of combos(slots, nE)) { const sc = evalCombo(cmb); if (sc > bs) { bs = sc; best = cmb; } }
    easyDates = best.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
  }
  const nEz = easyDates.length;
  const lvlE = I.level; // v21: limity regeneracji wg poziomu DEKLAROWANEGO (ostrożniej niż poziom efektywny z wyniku)
  const capRace = { "5k": 3, "10k": 4, half: 5, marathon: 6 }[I.goal.type] || 4;
  const enduranceRoom=I.goal.type==='marathon' && I.daysPerWeek>=4 && I.currentWeeklyKm>=45 && I.longestRecentRun>=18 && !I.injuries && I.loadTolerance!=='low'?Math.min(18,I.currentWeeklyKm/I.daysPerWeek):0;
  const eachMax = Math.max(E0 * 1.4, mEasy, c.easyCapKm || 0,enduranceRoom);
  const totalEasy = nEz ? Math.max(nEz * minAny, Math.min(left, nEz * eachMax)) : 0;
  // limit czasu biegu regeneracyjnego (min) zależny od poziomu i objętości; nigdy ponad 60 min
  const recCapMin = Math.min(60, { beginner: 30, intermediate: 40, advanced: 50 }[lvlE] + (lvlE === "advanced" && B2 >= 75 ? 5 : 0));
  const prevDayHard = (date) => hardSet.has(addDays(date, -1)) || (date > startDate && !c.noLong && dowOf(addDays(date, -1)) === longDow && chosen.includes(longDow) && addDays(date, -1) < weekStart);
  const items = easyDates.map((x) => {
    const capD = Math.max(2, Math.floor(capFor(x.date)));
    const rec = prevDayHard(x.date);
    let hi = dr(x.date) < 7 ? Math.min(capD, capRace) : Math.min(capD, Math.ceil(eachMax));
    if (rec) hi = Math.max(2, Math.min(hi, Math.floor((recCapMin * 60) / c.P.recovery.slow)));
    const m = Math.min(mOf(x.date), capD);
    if (capD < mOf(x.date)) tn.latwySkrocony++;
    return { x, rec, hi, lo: Math.min(m, hi), a: 0 };
  });
  let remaining = Math.round(totalEasy);
  for (const it of items) { it.a = it.lo; remaining -= it.lo; }
  while (remaining > 0) {
    const cand = items.filter((it) => it.a < it.hi).sort((p, q) => (p.rec - q.rec) || (p.a - q.a) || (p.x.date < q.x.date ? -1 : 1))[0];
    if (!cand) break;
    cand.a++; remaining--;
  }
  if (remaining > 0) tn.kmPonadLimityBiegow = (tn.kmPonadLimityBiegow || 0) + remaining;
  let strides = c.phase === "base" && I.level !== "beginner" && !raceWeek && c.weekIdx >= 2;
  items.forEach((it) => {
    const x = it.x, d = it.a;
    const consec = out.some((o) => o.data === addDays(x.date, -1) && !AUX.includes(o.podtyp));
    if (it.rec) {
      push(x.date, { typ: "Regeneracyjny", dist: d, min: (d * c.P.recovery.slow) / 60, strefa: "Z1", tempo: range(c.P.recovery), kroki: easyKroki(c, d, false, true) });
    } else {
      push(x.date, { typ: "Bieg spokojny Z2", dist: d, min: (d * em) / 60, strefa: "Z2", tempo: range(c.P.easy), kroki: easyKroki(c, d, strides, false, consec) });
      strides = false;
    }
  });
  if (shakeItem) push(shakeItem.date, { typ: "Regeneracyjny", dist: shakeKm, min: 20, strefa: "Z1", tempo: range(c.P.recovery), kroki: [{ etap: "Lekki trucht przed startem", czas_min: 18, tempo: range(c.P.recovery), tetno: zr(c, 0) + " (Z1)" }, { etap: "Przebieżki", uwagi: "4× 20 s swobodnie. Dziś: nawodnienie, sen, przygotowanie sprzętu." }] });
  // trening siłowy i mobilność w dni bez biegania
  if (c.silaN + (c.crossN || 0) > 0 && !raceWeek) {
    const hardDates = new Set(out.filter((o) => ["Tempo", "Interwały", "Długi bieg", "Test", "Start"].includes(o.typ)).map((o) => o.data));
    const longDate = out.find((o) => o.typ === "Długi bieg")?.data;
    const taken2 = new Set(out.map((o) => o.data));
    const qTyp = pickQualityDows(chosen, longDow, I.daysPerWeek >= 5 ? 2 : 1);
    const n = Math.min(c.taper ? 1 : c.silaN + (c.crossN || 0), 7), picked = [];
    for (let lvl = 0; lvl < 3 && picked.length < n; lvl++) {
      for (let i = 0; i < 7 && picked.length < n; i++) {
        const date = addDays(weekStart, i);
        if (picked.includes(date) || date < startDate || (raceDate && date >= addDays(raceDate, -3)) || taken2.has(date)) continue;
        if (!I.availableDays.includes(dowOf(date)) || limOf(date) < 20) continue; // uzupełniające tylko w dni zadeklarowane jako dostępne
        const nd = dowOf(addDays(date, 1)), pd = dowOf(addDays(date, -1));
        if (hardDates.has(addDays(date, 1)) && lvl < 2) continue;
        if (chosen.includes(nd) && nd === longDow) continue;                       // nigdy dzień przed długim biegiem
        if (lvl < 1 && chosen.includes(nd) && qTyp.includes(nd)) continue;          // wolimy nie przed jakością
        if (lvl < 2 && ((longDate && addDays(date, -1) === longDate) || (chosen.includes(pd) && pd === longDow))) continue; // wolimy nie po długim biegu
        if (picked.some((p) => Math.abs(diffDays(p, date)) < 2)) continue;
        picked.push(date);
      }
    }
    picked.forEach((d, i) => {
      const s2 = i < c.silaN ? mkSila(c, state.silaK++) : mkCross(c), lim = limOf(d);
      if (s2.min > lim) { if (s2.podtyp === "cross") { s2.min = lim; s2.kroki[0].czas_min = lim; tn.auxSkrocony++; } else { tn.auxPominiety++; return; } }
      push(d, s2);
    });
  }
  if(c.traceEnabled)c.beforeShareBudget=weekBudget(out);
  // v21-B: udział długiego biegu liczony z FAKTYCZNEGO tygodnia. V20 ograniczała długi bieg względem planowanej objętości, a drugi bieg
  // (przy 2 dniach) miał twardy limit, więc faktyczny udział dochodził do 67%. Teraz długi bieg nie może przekroczyć udziału dopuszczalnego
  // dla liczby faktycznych biegów (limity dystansu bez zmian); skrócenie jest raportowane, a stan progresji długiego biegu pozostaje spójny.
  if (!c.taper && !raceWeek && !c.rw && dates.length === chosen.length) { // tylko pełne tygodnie (niepełny pierwszy tydzień ma z natury mniej biegów)
    const lgIt = out.find((o) => o.podtyp === "dlugi"), runsIt = out.filter((o) => !AUX.includes(o.podtyp));
    if (lgIt && runsIt.length >= 2) {
      const others = runsIt.reduce((a, o) => a + o.dystans_km, 0) - lgIt.dystans_km, lim = maxLongShare(I.goal.type, runsIt.length);
      const maxL = Math.floor((others * lim) / (1 - lim) + 1e-9);
      if (lgIt.dystans_km > maxL + 0.5 && maxL >= Math.max(4, mEasy) && setRunKm(lgIt, maxL)) {
        tn.dlugiUdzial = (tn.dlugiUdzial || 0) + 1;
        if (!c.recovery) { state.lastLong = Math.max(prevLastLong, maxL); state.plannedLong = Math.max(prevPlannedLong, maxL); }
      }
    }
  }
  return out.sort((a, b) => (a.data < b.data ? -1 : 1));
}

// v19-C4: przycina tydzień do limitu kilometrów (suma po zaokrągleniu do pełnych km). Skraca kolejno najdłuższy bieg spokojny
// (minimum 3 km); przy odciążeniu (allowLong) także długi bieg (minimum 4 km). Akcentów nie rusza. Zwraca true, gdy limit osiągnięty.
export function trimWeekRuns(wk, limit, allowLong, opts = {}) { // v20: eksport na potrzeby testow regresyjnych; v21: opts.minRuns = dolna granica liczby biegów (zdjęcie dodatkowego biegu, gdy skrócenie nie wystarcza)
  const km = () => wk.filter((t) => !AUX.includes(t.podtyp)).reduce((a, t) => a + Math.round(t.dystans_km), 0);
  for (let guard = 40; guard > 0 && km() > limit; guard--) {
    const runs = wk.filter((t) => !AUX.includes(t.podtyp));
    const easy = runs.filter((t) => (t.podtyp === "latwy" || t.podtyp === "regeneracja") && Math.round(t.dystans_km) > 3).sort((a, b) => b.dystans_km - a.dystans_km)[0];
    if (easy && setRunKm(easy, Math.round(easy.dystans_km) - 1)) continue;
    const lg = allowLong ? runs.find((t) => t.podtyp === "dlugi" && Math.round(t.dystans_km) > 4) : null;
    if (lg && setRunKm(lg, Math.round(lg.dystans_km) - 1)) continue;
    // v21: skrócenie niczego nie daje (biegi mają minimalne długości). Jeśli w tym tygodniu pojawił się dodatkowy bieg ponad liczbę biegów
    // sprzed odciążenia (minRuns), zdejmujemy najkrótszy bieg spokojny zamiast cicho przekraczać limit. Tylko biegi spokojne/regeneracyjne.
    if (Number(opts.minRuns) > 0 && runs.length > Number(opts.minRuns)) {
      const cand = runs.filter((t) => t.podtyp === "latwy" || t.podtyp === "regeneracja").sort((a, b) => a.dystans_km - b.dystans_km)[0];
      if (cand) { wk.splice(wk.indexOf(cand), 1); if (opts.dropped) opts.dropped.push(cand.data); continue; }
    }
    break;
  }
  return km() <= limit;
}

// ---------- główny generator ----------
const PEAK = { "5k": { beginner: 25, intermediate: 38, advanced: 55 }, "10k": { beginner: 30, intermediate: 48, advanced: 68 }, half: { beginner: 38, intermediate: 58, advanced: 80 }, marathon: { beginner: 48, intermediate: 68, advanced: 95 }, health: { beginner: 20, intermediate: 32, advanced: 45 } };
// v19-C1: maksymalny udział długiego biegu w tygodniowym kilometrażu zależy OD DYSTANSU i LICZBY DNI BIEGOWYCH (tabela zamiast
// "baza + stały dodatek"). V18 dopuszczała ok. 47-51% dla maratonu przy 4-5 biegach i ok. 40-44% dla 5/10 km niezależnie od liczby dni;
// efekt: przy 5-7 dniach dodatkowe biegi były tylko ok. 4-6 km. Przy 1 dniu udział jest z definicji 100% (brak limitu), przy 2 dniach wyższy.
const LONG_SHARE_TABLE = {
  "5k": { 2: 0.58, 3: 0.46, 4: 0.40, 5: 0.36, 6: 0.33, 7: 0.31 },
  "10k": { 2: 0.58, 3: 0.46, 4: 0.41, 5: 0.37, 6: 0.34, 7: 0.32 },
  half: { 2: 0.60, 3: 0.48, 4: 0.43, 5: 0.39, 6: 0.35, 7: 0.33 },
  marathon: { 2: 0.62, 3: 0.50, 4: 0.46, 5: 0.42, 6: 0.38, 7: 0.35 },
  health: { 2: 0.55, 3: 0.45, 4: 0.40, 5: 0.36, 6: 0.33, 7: 0.31 },
};
const TAPER_FR = { 1: [0.55], 2: [0.75, 0.5], 3: [0.8, 0.65, 0.45] };
// Maksymalny udział długiego biegu w tygodniowej objętości zależy od dystansu i liczby dni biegowych.
export function maxLongShare(type, runDays) {
  if (!(runDays > 1)) return 1;
  const row = LONG_SHARE_TABLE[type] || LONG_SHARE_TABLE["10k"];
  return row[Math.min(Math.max(Math.round(runDays), 2), 7)];
}
const LONGCAP = { "5k": 14, "10k": 18, half: 24, marathon: 34, health: 14 };

// v20-D3: dlugi bieg bedacy duzym obciazeniem nie moze wypadac tuz przed startem (V19: np. 26 km na 9 dni przed maratonem w krotkim planie).
// Pulapy zaleza od dystansu i liczby dni do startu: [[maks. dni do startu, maks. km], ...].
const LONG_NEAR_RACE = { marathon: [[6, 10], [13, 18]], half: [[4, 8], [9, 12]], "10k": [[3, 6], [5, 8]], "5k": [[2, 4], [3, 5]] };
function capLongNearRace(treningi, type, raceDate) {
  const zmiany = [], tab = LONG_NEAR_RACE[type];
  if (!tab || !raceDate) return zmiany;
  for (const t of treningi) {
    if (t.podtyp !== "dlugi") continue;
    const gap = diffDays(t.data, raceDate);
    if (gap < 1) continue;
    const row = tab.find(([d]) => gap <= d);
    if (!row || t.dystans_km <= row[1]) continue;
    const old = t.dystans_km;
    if (setRunKm(t, row[1])) zmiany.push({ data: t.data, bylo: old, jest: row[1], dniDoStartu: gap });
  }
  return zmiany;
}
function generateCore(inp) {
  const val = validateInputDetailed(inp);
  if (val.bledy.length) return { ok: false, bledy: val.bledy.map((e) => e.komunikat), bledySzczegoly: val.bledy, ostrzezenia: val.ostrzezenia.map((w) => w.komunikat) };
  const evidence = evidenceInput(inp);
  const I = normalize(evidence.input), g = I.goal, gt = DIST[g.type] ? g.type : "health";
  const planningTrace=createPlanningTrace(I),intentVerification=[];
  const modelMaratonu = marathonModel(I);
  const hasRace = !!g.raceDate && !!DIST[g.type];
  const today = I.today, startDate = today;
  const startMon = mondayOf(today);
  const W = hasRace ? Math.round(diffDays(startMon, mondayOf(g.raceDate)) / 7) + 1 : I.weeks;
  const warnings = [...val.ostrzezenia.map((w) => w.komunikat), ...evidence.notes];
  // v19-C3: dostępność dni NIE jest rekomendowaną liczbą biegów. Jedna neutralna informacja zamiast trzech osobnych ostrzeżeń
  // (V18: "ograniczono", "aby zachować dzień bez biegania" i ogólnik o wysokiej częstotliwości przy 7 zadeklarowanych dniach).
  if (I.dniZadeklarowane > I.daysPerWeek) {
    const wolne = I.availableDays.length - I.daysPerWeek;
    if (I.dniOgraniczoneDostepnoscia && !I.dniOgraniczonePoziomem) warnings.push(`Zadeklarowano ${I.dniZadeklarowane} treningów tygodniowo, a zaznaczono ${I.availableDays.length} dostępnych dni, więc plan zawiera ${I.daysPerWeek} dni biegowych.`);
    else warnings.push(`Informacja o częstotliwości: plan zawiera ${I.daysPerWeek} dni biegowych w tygodniu (dostępnych dni: ${I.availableDays.length}). Dostępność nie jest tym samym co zalecana liczba biegów: dla Twojego poziomu i obecnej objętości kolejne dni dałyby głównie bardzo krótkie biegi bez wartości treningowej, a dzień bez biegania pomaga regeneracji. ${wolne > 0 ? `Pozostałe dni są wolne; chcąc je wykorzystać, dodaj trening siłowy lub krzyżowy (bez biegania) w ustawieniach planu.` : ""}`.trim());
  }
  if (I.dniZadeklarowane === 1) warnings.push("Plan z jednym treningiem biegowym tygodniowo może podtrzymywać aktywność, ale ma ograniczoną skuteczność w budowaniu formy i przygotowaniu do zawodów. Dla większości celów korzystniejsze są co najmniej 2–3 biegi tygodniowo.");
  if (I.daysPerWeek >= 5 && I.level !== "advanced" && I.dniZadeklarowane <= I.daysPerWeek) warnings.push("Wysoka częstotliwość przy poziomie początkującym lub średniozaawansowanym wymaga szczególnej kontroli zmęczenia. Dodatkowe dni powinny być łatwe, a nie kolejnymi mocnymi jednostkami.");
  if (I.daysPerWeek === 7) warnings.push("7 dni biegania oznacza brak pełnego dnia bez biegania. Jeżeli priorytetem jest regeneracja, bezpieczniejszą alternatywą jest 6 biegów i 1 dzień odpoczynku lub lekkiego treningu uzupełniającego.");
  if (I.przerwaKorekta) warnings.push(`Po przerwie (${I.przerwaKorekta.dni} dni) plan startuje z ok. ${Math.round(I.przerwaKorekta.wspolczynnik * 100)}% dotychczasowej objętości i najdłuższego biegu. Jeśli przerwa wynikała z choroby lub kontuzji, upewnij się, że możesz wrócić do biegania.`);
  if (I.rekordyAnaliza && I.rekordyAnaliza.rozbieznosc) warnings.push(`Rekordy są rozbieżne (rozrzut VDOT ${I.rekordyAnaliza.rozrzutVdotProc}%): do wyznaczenia tempa użyto ostrożniejszego z dwóch najlepszych wyników. Różnice mogą wynikać z dystansu, formy w czasie lub warunków.`);
  if (I.rekordyAnaliza && I.rekordyAnaliza.pominieteStare > 0) warnings.push(`Pominięto ${I.rekordyAnaliza.pominieteStare} wynik(i) starsze niż 24 miesiące.`);
  if (I.bestResult && I.bestResult.date && isRealDate(I.bestResult.date) && diffDays(I.bestResult.date, I.today) > 365) warnings.push("Wynik odniesienia ma ponad rok: tempa treningowe są orientacyjne, wykonaj test formy.");
  if (I.poziomPodniesiony) warnings.push(`Wpisany poziom początkujący nie pasuje do obecnego kilometrażu (${I.currentWeeklyKm} km tygodniowo, najdłuższy bieg ${I.longestRecentRun} km), więc plan korzysta z parametrów poziomu średniozaawansowanego. Jeśli to pomyłka w danych, popraw kilometraż lub poziom.`);
  if (I.limitPodniesionyDowodem) warnings.push(`Limit biegów tygodniowo podniesiono do ${I.limitBiegowPoziomu}, bo Twój kilometraż (${I.currentWeeklyKm} km) i najdłuższy bieg (${I.longestRecentRun} km) wskazują na adaptację do częstszego biegania.`);
  if (I.historiaKontuzjiFlag) warnings.push("Zgłoszona historia przeciążeń: rampa kilometrażu jest nieco wolniejsza. Przy bólu przerwij trening i skonsultuj się ze specjalistą.");
  if (I.poziomSkorygowany) warnings.push(`Wpisany poziom zaawansowany nie pasuje do obecnego kilometrażu (${I.currentWeeklyKm} km tygodniowo), więc plan startuje jak dla poziomu średniozaawansowanego i zwiększa obciążenie stopniowo.`);
  const assess = assessGoal(I, hasRace ? Math.round(diffDays(today, g.raceDate) / 7) : null);
  warnings.push(...assess.wiadomosci);
  const daysToRace = hasRace ? diffDays(today, g.raceDate) : null;
  const przygotowanie = hasRace && DIST[g.type] ? przygotowanieInfo(I, g, daysToRace) : null;
  if (przygotowanie && przygotowanie.tryb !== "pełny") warnings.push(przygotowanie.komunikat);
  else if (przygotowanie && przygotowanie.ryzyko !== "niskie") warnings.push(przygotowanie.komunikat);

  const { vdot } = currentVdot(I);
  const P = pacesFor(vdot, I.tempoProgowe);
  // v17: bez wiarygodnego wyniku/testu tempa są szacunkiem, więc zamiast pozornie precyzyjnych wartości stosujemy szersze, bezpieczniejsze zakresy
  const daneSlabe = assess.zrodloVdot === "szacunek" && !I.tempoProgowe;
  const widen = (Q) => { for (const [k, f, sl] of [["easy", 1, 1.04], ["recovery", 1, 1.05], ["long", 1, 1.05], ["moderate", 0.98, 1.03], ["tempo", 0.98, 1.03], ["interval", 0.97, 1.03]]) if (Q[k]) Q[k] = { fast: Q[k].fast * f, slow: Q[k].slow * sl }; return Q; };
  if (daneSlabe) widen(P);
  let easyMid = (P.easy.fast + P.easy.slow) / 2;
  if (I.observedEasyPace) {
    const f = 1 + (clamp(I.observedEasyPace / easyMid, 0.9, 1.15) - 1) * 0.6;
    for (const k of ["easy", "recovery"]) P[k] = { fast: P[k].fast * f, slow: P[k].slow * f };
    easyMid = (P.easy.fast + P.easy.slow) / 2;
    warnings.push(`Tempa spokojne skorygowałem na podstawie Twoich biegów w Z2 (mediana ${fmtPace(I.observedEasyPace)} min/km).`);
  }
  const Z = hrZones(I.hrMax, I.hrRest, I.tetnoProgowe);
  // tempo docelowe/startowe
  let goalTime = DIST[g.type] ? predictions(I, vdot)[g.type] : null;
  if (g.targetTimeSec && assess.werdykt !== "nierealny") goalTime = g.targetTimeSec;
  else if (assess.sugerowanyCzas) goalTime = assess.sugerowanyCzas;
  if (I.trzymajCel && g.targetTimeSec && DIST[g.type]) goalTime = g.targetTimeSec;
  if (I.trzymajCel && assess.werdykt === "nierealny" && DIST[g.type]) { goalTime = predictions(I, vdot)[g.type]; warnings.push("trzymajCel nie omija limitu bezpieczeństwa intensywności; tempo treningowe pozostaje zgodne z obecną formą."); }
  const goalPace = goalTime ? goalTime / (DIST[g.type] / 1000) : P.tempo.slow;
  const specificPace = DIST[g.type] ? Math.max(goalPace,raceTimeFromVdot(DIST[g.type],vdot)/(DIST[g.type]/1000)) : goalPace;
  if (g.targetTimeSec && DIST[g.type]) {
    const kmD = DIST[g.type] / 1000, same = Math.abs(goalTime - g.targetTimeSec) < 2;
    assess.cel = { zadany: fmtTime(g.targetTimeSec), tempoZadane: fmtPace(g.targetTimeSec / kmD), planowany: fmtTime(goalTime), tempoPlanowane: fmtPace(goalTime / kmD), zgodny: same };
    if (!same) warnings.push(`Plan jest zbudowany pod czas ${fmtTime(goalTime)} (${fmtPace(goalTime / kmD)} min/km), bo cel ${fmtTime(g.targetTimeSec)} (${fmtPace(g.targetTimeSec / kmD)} min/km) jest dla obecnej formy i czasu przygotowań zbyt ambitny. Jeśli chcesz zostać przy swoim celu mimo ryzyka, ustaw trzymajCel: true.`);
    else if (I.trzymajCel && assess.werdykt === "nierealny") warnings.push(`Plan jest zbudowany pod Twój cel ${fmtTime(g.targetTimeSec)} (${fmtPace(g.targetTimeSec / kmD)} min/km) na Twoją prośbę, choć generator ocenia go jako nierealny. Ryzyko niezrealizowania celu jest wysokie.`);
  }

  // fazy
  const shortMode = hasRace && W <= 2;
  const taperBase = { "5k": 1, "10k": 2, half: 2, marathon: 3 }[g.type];
  const taperExtra = I.level === "advanced" && W >= 22 && (g.type === "half" || g.type === "marathon") ? 1 : 0;
  // v21: gdy start wypada na początku tygodnia (pn/wt), „tydzień startowy" ma <3 dni biegowych i realnie nie jest tygodniem taperingu;
  // V20 liczyła go jako tydzień taperingu, więc półmaraton ze startem w poniedziałek miał jeden realny tydzień zmniejszenia obciążeń.
  const taperEdge = hasRace && !shortMode && W >= 6 && pos(dowOf(g.raceDate)) < 2 ? 1 : 0;
  const T = hasRace ? (shortMode ? W : clamp(taperBase + taperExtra + taperEdge, 1, Math.max(1, Math.floor(W / 3)))) : 0;
  const R = W - T;
  const bmi = I.weightKg && I.heightCm ? I.weightKg / (I.heightCm / 100) ** 2 : 0;
  const fitEvidence = !!((I.vdotOverride || (I.bestResult && I.bestResult.timeSec > 0 && I.bestResult.distanceKm > 0)) && vdot >= 32);
  I.fitEvidence = fitEvidence; I.bmi = bmi;
  const rwMode = bmi >= 35 ? I.currentWeeklyKm < 15 : I.level === "beginner" && I.currentWeeklyKm < 8 && I.longestRecentRun < 4 && !fitEvidence;
  const rwLen = rwMode ? (bmi >= 35 ? clamp(Math.round(R * 0.5), 5, 8) : clamp(Math.round(R * 0.4), 3, 6)) : 0;
  const phaseDefinition=seasonPhases(I,{W,T,rwLen,startMon});
  const nBase=phaseDefinition.base,nBuild=phaseDefinition.build;
  const phaseOf=w=>phaseDefinition.phaseOf(w);

  // układ tygodnia
  const chosen = chooseDays(I.availableDays, I.daysPerWeek, I.longRunDow, I.dayReliability);
  const longDow = pickLong(chosen, I.longRunDow);
  {
    const pp = chosen.map(pos).sort((a, b) => a - b);
    const adjPairs = pp.filter((v, i) => ((pp[(i + 1) % pp.length] - v + 7) % 7 || 7) === 1).length;
    if (I.level !== "advanced" && I.daysPerWeek <= 3 && adjPairs > 0) warnings.push("Wybrane dni biegowe są obok siebie. Przy tym poziomie lepiej zostawić przynajmniej jeden dzień przerwy między biegami (ochrona stawów i świeżość). Dodaj do dostępnych dni więcej opcji, a generator rozmieści biegi z odstępami.");
  }

  // objętości
  const kmPerRun = (Math.max(I.maxMinutesWd, I.maxMinutesWe) * 60) / easyMid;
  // v17: limit czasu długiego biegu = limit dnia, w którym ten bieg wypada (weekend lub dzień roboczy), a nie zawsze limit weekendowy
  const longDayLimit = longDow === 0 || longDow === 6 ? I.maxMinutesWe : I.maxMinutesWd;
  const longMin = Math.min(longDayLimit, Number(I.maxLongMinutes) > 0 ? Number(I.maxLongMinutes) : Infinity, modelMaratonu?.limitDlugiegoMin ?? Infinity);
  const capLong = Math.min(LONGCAP[gt], (Math.min(longMin, modelMaratonu?.limitDlugiegoMin ?? Infinity) * 60) / easyMid);
  const perDayMax = { beginner: 9, intermediate: 13, advanced: 18 }[I.level];
  let peak = Math.min(PEAK[gt][I.level], I.daysPerWeek * kmPerRun * 0.8, capLong + (I.daysPerWeek - 1) * perDayMax);
  if (I.injuries) peak *= 0.85;
  const reach = capLong + (I.daysPerWeek - 1) * Math.min(kmPerRun, perDayMax);
  // v18-P1: podłoga objętości startowej nie rośnie z liczbą dni powyżej 3 (wcześniej 6 dni => 15 km niezależnie od historii,
  // np. 6 km/tydz. -> 11 -> 17 km). Częstotliwość narasta stopniowo, bo liczbę biegów wyznacza budżet kilometrów.
  const minViable = Math.min(I.daysPerWeek, 3) * 2.5;
  const startVol = Math.min(Math.max(I.currentWeeklyKm, minViable), Math.max(I.currentWeeklyKm * 1.3 + 3, minViable), reach * 0.9);
  // v18-P5: przy długim przygotowaniu (R > 12 tyg. przed taperem) szczyt może być wyższy niż stały mnożnik; bezpieczeństwo nadal
  // gwarantują: rampa tygodniowa, tygodnie odciążające, tabela PEAK i limity udziału długiego biegu.
  const horizonBonus = clamp((R - 12) * 0.04, 0, 0.4);
  const peakMultiplier = (gt === "marathon" ? (I.level === "advanced" ? 2.0 : 1.9) : 1.7) + horizonBonus;
  const peakAbsoluteGain = gt === "marathon" ? 22 : 15;
  peak = Math.min(peak, Math.max(startVol * peakMultiplier, startVol + peakAbsoluteGain));
  peak = Math.max(peak, startVol);
  if (I.injuries) peak = Math.min(peak, Math.max(startVol, startVol * 1.15));
  if (I.experienceMonths != null && I.experienceMonths < 6) peak = Math.min(peak, Math.max(startVol, startVol * 1.35));
  if (I.trainingIntent === "utrzymanie" && ["5k","10k"].includes(gt) && startVol>=20) peak=Math.min(peak,startVol*1.15);
  if (I.experienceMonths!=null && I.experienceMonths<3 && I.currentWeeklyKm>=20) peak=Math.min(peak,startVol); // no compensatory volume after suppressing novice quality
  if (I.intensityTolerance === "low") peak=Math.min(peak,startVol); // avoid compensating omitted intensity with extra volume
  if (I.loadTolerance === "low") peak=Math.min(peak,startVol*.95);
  let ramp = { beginner: 1.05, intermediate: 1.06, advanced: 1.08 }[effLevel(I)];
  if (bmi >= 30) ramp = 1 + (ramp - 1) * 0.7;
  if (I.liczbaTreningowHistorii !== undefined && I.liczbaTreningowHistorii < 12) ramp = 1 + (ramp - 1) * 0.8; // mało danych o tolerancji, rośniemy ostrożniej
  if (I.injuries) ramp = 1 + (ramp - 1) * 0.7;
  else if (I.historiaKontuzjiFlag) ramp = 1 + (ramp - 1) * 0.85;
  if (I.age >= 50) ramp = 1 + (ramp - 1) * (I.age >= 60 ? 0.7 : 0.85); // v20-E1: wolniejsza regeneracja tkanek u zawodnikow 50+ => wolniejsza rampa i czestsze odciazenia
   // v18-P6: historia przeciążeń (bez aktualnej kontuzji) => nieco wolniejsza rampa

  if (I.loadTolerance === "low") ramp=1+(ramp-1)*.75;
  if (I.loadTolerance === "high" && I.recentWeeklyKm?.length>=4 && I.experienceMonths>=12 && !I.injuries) ramp=1+(ramp-1)*1.1;
  const state = { hardDates:[], lastLong: Math.max(I.longestRecentRun, startVol * 0.3, 3), plannedLong: 0, timeNotes: { dlugiSkrocony: 0, dlugiPominiety: 0, jakoscPominietaPrzezCzas: 0, latwySkrocony: 0, auxSkrocony: 0, auxPominiety: 0 }, tempoK: 0, intervalK: 0, raceK: 0, longK: 0, hillK: 0, silaK: 0, slotK: 0, longB: 0, longProg: 0 };
  state.doseByFamily={};state.familyRecipes={};state.executedProgressions={};
  for(const [key,type,family]of [['tempoK','threshold','tempo'],['intervalK','interval','interwaly'],['raceK','specific','tempo_startowe'],['hillK','hill','podbiegi']]){
    const actual=(I.completedHistory||[]).filter(o=>o.status!=='missed'&&o.sessionType===type&&o.workMinutes>0&&diffDays(o.date,I.today)<=42);
    const observedState=comparableExposureState(actual,I.today,type);
    state[key]=observedState.introductoryStep;
    if(observedState.retainedDoseMinutes)state.doseByFamily[family]=observedState.retainedDoseMinutes;
  }
  const treningi = [], tygodnie = [];
  let lastBuild = startVol, nonTaper = 0, peakSoFar = startVol;

  const silaN = clamp(Math.round(Number(I.silaTreningi) || 0), 0, 2);
  const crossN = clamp(Math.round(Number(I.crossTreningi) || 0), 0, 2);
  // starty poboczne (priorytet B lub C): przygotowanie, odpoczynek przed i po starcie
  const ctxR = { P, Z, easyMid, vdot, startDate, warm: I.warm, cool: I.cool, przedStartem: I.przedStartem, minEasy: effLevel(I) === "beginner" ? 4 : 5 };
  const extraAll = (I.extraRaces || []).filter((r) => r.distanceKm > 0 && r.date).sort((a, b) => (a.date < b.date ? -1 : 1));
  const extra = [];
  for (const r of extraAll) {
    const nm = r.name || r.date;
    if (r.date <= startDate) { warnings.push(`Pominięty start poboczny ${nm}: termin już minął.`); continue; }
    if (hasRace && r.date >= addDays(g.raceDate, -9)) { warnings.push(`Pominięty start poboczny ${nm}: jest za blisko startu głównego lub po nim.`); continue; }
    const prev = extra[extra.length - 1];
    if (prev && diffDays(prev.date, r.date) < 6) { warnings.push(`Pominięty start poboczny ${nm}: mniej niż 6 dni po poprzednim starcie.`); continue; }
    extra.push(r);
  }
  const rateP = { beginner: 0.006, intermediate: 0.004, advanced: 0.0025 }[I.level];
  const capP = { beginner: 0.08, intermediate: 0.05, advanced: 0.03 }[I.level];
  const goalGain = DIST[g.type] && goalTime ? Math.max(0, vdotFrom(DIST[g.type], goalTime) / vdot - 1) : 0;
  const gainAt = () => 0; // adapt volume/structure; pace changes require a fresh result
  const planVdot = goalGain > 0.005 ? Math.min(vdot, vdotFrom(DIST[g.type], goalTime)) : null;

  const cachedPaces={current:pacesFor(vdot,I.tempoProgowe),plan:planVdot?pacesFor(planVdot,I.tempoProgowe?I.tempoProgowe*(vdot/planVdot):undefined):null};
  I.planVdotAktywny = !!planVdot;
  const allowedKm = (pk) => Math.min(Math.max(pk + (pk < 20 ? 2 : 1), Math.floor(pk * 1.15)), pk + 5); // do ok. 15% tygodniowo (przy małych objętościach +2 km), nigdy więcej niż +5 km
  const qualityCap = { "5k": 8, "10k": 9, half: 10, marathon: 10 }[gt] || 8; // przy 2-3 dniach bieg spokojny nie może być znacznie dłuższy niż zastępujący go trening jakościowy (inaczej tydzień z akcentem „traci” kilometry)
  const REQLONG = { "5k": 5, "10k": 8, half: 15, marathon: 26 };
  // krzywa długiego biegu: własna, rosnąca, ze szczytem 3 tygodnie przed startem
  // Przy większej częstotliwości dopuszczamy krótsze, naprawdę lekkie biegi,
  // zamiast blokować dodatkowe dni sztywnym minimum 4–5 km.
  const minEasy = I.daysPerWeek >= 5 ? (effLevel(I) === "beginner" ? 3 : 4) : (effLevel(I) === "beginner" ? 4 : 5);
  const LPEAK = { "5k": 8, "10k": { beginner: 10, intermediate: 11, advanced: 12 }, half: { beginner: 16, intermediate: 18, advanced: 20 }, marathon: { beginner: 28, intermediate: 30, advanced: 32 }, health: 8 };
  const lpRaw = typeof LPEAK[gt] === "number" ? LPEAK[gt] : LPEAK[gt][effLevel(I) === "beginner" ? "beginner" : I.level === "advanced" ? "advanced" : "intermediate"];
  // Nie obniżaj szczytowego długiego biegu poniżej dystansu, który użytkownik
  // już regularnie toleruje; unikamy schematu 12 km -> 8 km -> ponownie 12 km.
  // Długi bieg pozostaje istotny, ale nie może pochłaniać większości tygodnia.
  // Umiarkowanie wyższy limit dla dłuższych dystansów pozwala osiągnąć specyfikę
  // HM/maratonu bez sztucznego wymagania bardzo wysokiego kilometrażu tygodniowego.
  // v19-C1/C2: udział zależy od liczby dni (przy 1 biegu tygodniowo nie ma sensu limit udziału: ten bieg jest całym tygodniem)
  const longShareLimit = maxLongShare(gt, I.daysPerWeek);
  const longByVolume = I.daysPerWeek <= 1 ? Infinity : Math.max(minEasy, Math.floor(peak * longShareLimit));
  const requestedLongPeak = Math.max(lpRaw, I.longestRecentRun || 0);
  // v19-C2: przy 1 biegu tygodniowo ten bieg jest całą objętością tygodnia, więc jego długość ograniczamy twardo (nie dokładamy
  // obciążenia pojedynczej jednostce): nie więcej niż tolerowany dotąd najdłuższy bieg +20% i bezwzględny limit zależny od dystansu.
  const ONE_RUN_CAP = { "5k": 10, "10k": 12, half: 14, marathon: 16, health: 10 }[gt];
  const oneRunCap = I.daysPerWeek <= 1 ? Math.max(minEasy, Math.min(ONE_RUN_CAP, Math.max(Math.round(I.longestRecentRun * 1.2), 6))) : Infinity;
  const Lpeak = Math.min(requestedLongPeak, capLong, longByVolume, oneRunCap);
  if (I.daysPerWeek <= 1) peak = Math.min(peak, Lpeak);
  const L0 = Math.min(Math.max(Math.round(I.longestRecentRun), minEasy), Lpeak);
  if (I.longestRecentRun > longByVolume + 1) warnings.push(`Najdłuższy ostatni bieg (${I.longestRecentRun} km) jest duży względem planowanej objętości szczytowej (${r1(peak)} km/tydz.). Dalsza progresja długiego biegu została ograniczona do ${Lpeak} km.`);
  let wPeak = W - 1;
  if (hasRace) { wPeak = 0; for (let x = 0; x < W; x++) if (diffDays(addDays(startMon, 7 * x), g.raceDate) >= 21) wPeak = x; }
  const growWeeks = Math.max(1, wPeak - rwLen + 1 - Math.floor((wPeak - rwLen + 1) / 4));
  const incLong = clamp((Lpeak - L0) / growWeeks, 0, gt === "marathon" ? 1.5 : 1.25); // maraton: nieco dłuższa, nadal stopniowa progresja długiego biegu
  let longIdx = 0, prevRuns = 0;
  let sinceRec = 0, prevKm = 0, prevActual = 0, prevTaperKm = 0;
  let lastTest = -99, prevWasRec = false, prevFullRuns = 0;
  let previousLoadV22=I.currentWeeklyKm,previousEffortV22=null,previousLongV22=I.longestRecentRun,previousTaperLong=null;
  const seasonState=buildSeason(I,{W,T,rwLen,startMon,startVol,peak,L0,Lpeak,longMin,easyMid,longPace:(P.long.fast+P.long.slow)/2});
  const korektyObciazen = [];
  const limitMisses = [];
  for (let w = 0; w < W; w++) {
    const phase = phaseOf(w), weekStart = addDays(startMon, 7 * w);
    const raceWeek = hasRace && w === W - 1;
    const rw = rwMode && w < rwLen && phase !== "taper";
    const rwSt = rw ? Math.round((w * (RW.length - 1)) / Math.max(1, rwLen - 1)) : 0;
    const seasonWeek=seasonState.weeks[w];I.seasonWeek=seasonWeek;
    planningTrace.record(weekStart,'profile_evidence',{declaredWeeklyKm:I.currentWeeklyKm,declaredLongKm:I.longestRecentRun,observations:I.completedHistory?.length||0},I.completedHistory?.length?[]:['INPUT_UNCERTAINTY']);
    planningTrace.record(weekStart,'season_desired',{targets:seasonWeek.targets},[seasonWeek.recovery?'RECOVERY':phase==='taper'?'TAPER':'PHASE']);
    let vol=seasonWeek.targets.km,recovery=seasonWeek.recovery;
    if(rw){vol=rwDist(RW[rwSt])*(I.currentWeeklyKm<10?Math.min(I.daysPerWeek,3):I.daysPerWeek);recovery=false;}
    if(recovery&&w<=(startMon<startDate?1:0))recovery=false;
    if(recovery&&prevActual>0)vol=Math.min(vol,prevActual*.82);
    let longKm=rw?0:seasonWeek.targets.longKm;
    if(recovery)longKm=Math.min(longKm,previousLongV22*.75);
    else if(phase!=='taper'&&previousLongV22>0)longKm=Math.min(longKm,Math.max(previousLongV22*1.15,previousLongV22+2));
    if(phase==='taper'){
      longKm=Math.min(longKm,previousLongV22*.85,previousTaperLong==null?Infinity:previousTaperLong*.85);
      vol=Math.min(vol,previousLoadV22*.85,prevTaperKm>0?prevTaperKm*.9:Infinity);
    }
    lastBuild=vol;
    let budget;
    // vol jest już ograniczany rampą, tygodniami odciążającymi i limitem peak.
    // Nie ograniczaj go ponownie na podstawie poprzedniego tygodnia kalendarzowego:
    // po tygodniu regeneracyjnym dawało to sprzężenie zwrotne i blokowało odbudowę
    // kilometrażu (każdy kolejny tydzień startował od obniżonej objętości).
    if (rw || phase === "taper" || recovery) budget = vol;
    else budget = Math.min(vol, peak);
    // v21: tydzień po odciążeniu planujemy od razu w limicie powrotu (V20 budowała za dużo i przycinała po fakcie; 57 niezrealizowanych limitów)
    if (prevWasRec && prevKm > 0 && !rw && phase !== "taper" && !recovery) budget = Math.min(budget, Math.max(Math.floor(prevKm * 1.06) + 1, Math.ceil(prevKm) + 2));
    if(!rw&&I.daysPerWeek>=2)longKm=Math.min(longKm,Math.max(3,budget*maxLongShare(gt,I.daysPerWeek)));
    const allowDayAdd = w >= 1 && !rw && !recovery && phase !== "taper" && prevRuns > 0 && prevRuns < I.daysPerWeek && Math.max(prevActual, startVol) >= (prevRuns + 1) * minEasy + 2;
    const Pw=planVdot&&!rw&&phase!=='base'?cachedPaces.plan:cachedPaces.current;
    const Pweek = { ...P, tempo: daneSlabe ? widen({ tempo: Pw.tempo }).tempo : Pw.tempo, interval: daneSlabe ? widen({ interval: Pw.interval }).interval : Pw.interval };
    const isTestWeek = I.controlTests!=='none' && (I.controlTests==='maximal'?lastTest<0:w-lastTest>=8) && I.daysPerWeek >= 3 && w >= 4 && w - rwLen >= 4 && lastBuild >= 15 && w - lastTest >= 6 && (phase === "build" || phase === "peak") && !recovery && !raceWeek && !rw && (!hasRace || diffDays(addDays(weekStart, 6), g.raceDate) >= 21) && !I.injuries;
    if (isTestWeek) lastTest = w;
    const ctxW = { I, seasonWeek, P: Pweek, isTestWeek, crossN, goalTimed: hasRace && !!g.targetTimeSec, longMid: (Pweek.long.fast + Pweek.long.slow) / 2, weekIdx:w+phaseDefinition.offset, easyCapKm: Math.min({ beginner: 9, intermediate: 13, advanced: 18 }[effLevel(I)], Math.max(7, Math.round((Math.max(startVol, I.currentWeeklyKm, vol) / Math.max(I.daysPerWeek, 2)) * 0.9)) /* v18-P2: limit biegu łatwego rośnie razem z celem tygodnia */, I.daysPerWeek <= 2 ? qualityCap + 3 : I.daysPerWeek === 3 ? qualityCap + 2 : 99), budget, longKm, minEasy, prevRuns, allowDayAdd, easyBaseKm: { beginner: 4, intermediate: 5, advanced: 6 }[effLevel(I)], longTarget: hasRace && REQLONG[g.type] ? REQLONG[g.type] * (I.level === "beginner" && !fitEvidence ? 0.85 : 1) * Math.min(1, (w + 1) / Math.max(R - 1, 1)) : 0, lateBase: phase === "base" && !rw && (readyForEarlyQuality(I) ? w>=1 : nBase >= 3 && w >= Math.ceil(nBase / 2)), silaN, Z, warm: I.warm, cool: I.cool, easyMid, goalPace, specificPace, weekStart, vol, startDate, raceDate: hasRace ? g.raceDate : null, chosen, longDow, state, capLong, longMin:longDurationLimit(I,w,longMin,easyMid), phase, recovery, taper: phase === "taper", raceWeek, rw, rwStage: rwSt, kQuality: Math.max(0,w+phaseDefinition.offset-nBase) };
    const snap={tempoK:state.tempoK,intervalK:state.intervalK,raceK:state.raceK,hillK:state.hillK};
    const raceKmWeek = extra.filter((r) => r.date >= weekStart && r.date < addDays(weekStart, 7)).reduce((a, r) => a + r.distanceKm + 3, 0);
    if (raceKmWeek > 0 && phase !== "taper") {
      const capW = prevActual > 0 ? allowedKm(prevActual) : vol * 1.15;
      ctxW.vol = Math.max(0, Math.min(vol, capW - raceKmWeek - 3)); // start liczy się do tygodniowej objętości: reszta biegów się zmniejsza
      ctxW.noQuality = true; ctxW.noLong = true; ctxW.budget = ctxW.vol; // w tygodniu ze startem sam start jest najdłuższym wysiłkiem
      if (raceKmWeek + 3 > capW) warnings.push(`Start poboczny w tygodniu od ${weekStart} (${r1(raceKmWeek - extra.filter((r) => r.date >= weekStart && r.date < addDays(weekStart, 7)).length * 3)} km) jest długi względem Twojego obecnego kilometrażu: tydzień wyniesie ok. ${Math.round(raceKmWeek + 3)} km zamiast bezpiecznych ${capW} km. Potraktuj go jako spokojny bieg albo go pomiń.`);
    }
    ctxW.futureWeeks=extra.length?[]:seasonState.weeks.slice(w+1,w+3);
    ctxW.traceEnabled=planningTrace.enabled;ctxW.envelope=feasibleEnvelope(I,ctxW);
    planningTrace.record(weekStart,'feasible_envelope',{envelope:ctxW.envelope,budget:{km:ctxW.budget,minutes:ctxW.budget*easyMid/60,longKm:ctxW.longKm,sessions:chosen.length,workMinutes:{}}},ctxW.envelope.codes);
    let wk = constrainedWeek(ctxW,buildWeek);
    planningTrace.record(weekStart,'allocated_before_repair',{budget:ctxW.selectedAllocation||weekBudget(wk)},['SCHEDULE']);
    planningTrace.units(weekStart,'allocated_after_share_repair',wk,['ALLOCATOR_CAP']);
    // v19-C4: V18 planowała budżet tygodnia, ale minimalne długości biegów i akcenty (rozgrzewka + schłodzenie) bywały jego przekroczeniem.
    // Skutek: tydzień po odciążeniu mógł mieć +19% (21 -> 25 km, beginner/maraton/4 dni), a "tydzień odciążający" przy małej objętości
    // spadał tylko o 7% (14 -> 13 km). Teraz po zbudowaniu tygodnia przycinamy najdłuższe biegi spokojne (nie akcenty i nie długi bieg poza odciążeniem).
    if (!rw && phase !== "taper" && !raceWeek && raceKmWeek === 0 && prevKm > 0 && w >= 1) {
      // v20-D1: V19 ignorowala wartosc zwracana przez trimWeekRuns (limit mogl byc po cichu przekroczony). Teraz kazda porazka jest rejestrowana.
      let trimLimit = null, trimOk = true;
      const dropped = [];
      if (recovery && prevKm > 6) { trimLimit = Math.floor(prevKm * 0.88); trimOk = trimWeekRuns(wk, trimLimit, true, { minRuns: Math.max(2, prevFullRuns - 1), dropped }); }
      else if (prevWasRec) { trimLimit = Math.max(Math.floor(prevKm * 1.06) + 1, Math.ceil(prevKm) + 2); trimOk = trimWeekRuns(wk, trimLimit, false, { minRuns: Math.max(2, prevFullRuns), dropped }); }
      if (dropped.length) state.timeNotes.biegiZdjeteDlaLimitu = (state.timeNotes.biegiZdjeteDlaLimitu || 0) + dropped.length;
      if (!trimOk) limitMisses.push({ tydzien: w + 1, od: weekStart, typ: recovery ? "tydzien_odciazajacy" : "powrot_po_odciazeniu", limitKm: trimLimit, faktycznieKm: wk.filter((t) => !AUX.includes(t.podtyp)).reduce((a, t) => a + Math.round(t.dystans_km), 0) });
    }
    planningTrace.units(weekStart,'after_recovery_guard',wk,[recovery?'RECOVERY':'SAFETY_LIMIT']);
    if (!rw && phase !== "taper" && !recovery && raceKmWeek === 0 && previousLoadV22 > 0 && weekStart >= startDate) {
      const limit = Math.floor(Math.max(previousLoadV22 * 1.12, previousLoadV22 + 3));
      const kmNow = () => wk.filter(t => !AUX.includes(t.podtyp)).reduce((a,t) => a + Math.round(t.dystans_km), 0);
      const beforeKm = kmNow();
      for (let guard = 0; kmNow() > limit && guard < 100; guard++) {
        const easy = wk.filter(t => ["latwy", "regeneracja", "dlugi"].includes(t.podtyp) && t.dystans_km >= 4).sort((a,b) => b.dystans_km - a.dystans_km)[0];
        if (easy && setRunKm(easy, Math.round(easy.dystans_km) - 1)) continue;
        const q = wk.find(t => ["tempo", "interwaly", "podbiegi", "tempo_startowe", "test"].includes(t.podtyp));
        if (q) { toEasyRun(q, {P: Pweek, Z, easyMid}); continue; }
        const j = wk.findIndex(t => !AUX.includes(t.podtyp));
        if (j < 0) break;
        wk.splice(j,1);
      }
      if (beforeKm !== kmNow()) korektyObciazen.push({ tydzien: w + 1, przedKm: beforeKm, poKm: kmNow(), limitKm: limit });
    }
    planningTrace.units(weekStart,'after_volume_guard',wk,['SAFETY_LIMIT']);
    if (!rw && !recovery && phase !== "taper" && previousEffortV22 != null && weekStart >= startDate && raceKmWeek === 0) {
      const loadNow = () => wk.reduce((a,t) => a + sessionLoad(t,gt),0);
      const limit = Math.max(previousEffortV22 * 1.25, previousEffortV22 + 60);
      for (const t of wk.filter(t => ["tempo", "interwaly", "podbiegi", "tempo_startowe", "test"].includes(t.podtyp)).reverse()) {
        if (loadNow() <= limit) break;
        const before = loadNow(), kind = t.podtyp;
        toEasyRun(t,{P:Pweek,Z,easyMid});
        korektyObciazen.push({tydzien:w+1,typ:"intensywnosc",z:kind,przedObciazenie:before,poObciazenie:loadNow(),limitObciazenia:Math.round(limit)});
      }
    }
    planningTrace.units(weekStart,'after_effort_guard',wk,['SAFETY_LIMIT']);
    if (phase !== "taper" && !raceWeek && weekStart>=startDate) {
      const runs=wk.filter(t=>!AUX.includes(t.podtyp)), long=runs.find(t=>t.podtyp === "dlugi");
      if (long && runs.length>=2) {
        const others=runs.filter(t=>t!==long).reduce((a,t)=>a+Math.round(t.dystans_km),0), share=maxLongShare(gt,runs.length);
        const maximum=Math.max(3,Math.floor(others*share/(1-share)));
        if(long.dystans_km>maximum && setRunKm(long,maximum))korektyObciazen.push({tydzien:w+1,typ:"udzial_dlugi",limitKm:maximum,powod:"faktyczna_struktura_po_korektach"});
      }
    }
    if (!recovery && phase !== "taper") {
      const long = wk.find(t => t.podtyp === "dlugi");
      if (long && previousLongV22 > 0) {
        const limitLong = Math.floor(Math.max(previousLongV22 * 1.15, previousLongV22 + 2));
        if (long.dystans_km > limitLong && setRunKm(long,limitLong)) korektyObciazen.push({tydzien:w+1,typ:"dlugi",limitKm:limitLong,powod:"powrot_po_rzeczywistym_skroceniu"});
      }
      if (long) previousLongV22 = long.dystans_km;
    }
    for (const [key,kind] of [["tempoK","tempo"],["intervalK","interwaly"],["raceK","tempo_startowe"],["hillK","podbiegi"]]) state[key]=snap[key]+wk.filter(t=>t.podtyp===kind).length;
    state.hardDates=[...state.hardDates,...wk.filter(t=>["tempo","interwaly","tempo_startowe","podbiegi","test","dlugi"].includes(t.podtyp)).map(t=>t.data)].slice(-6);
    const sumRounded = (arr) => arr.reduce((a, t) => a + (AUX.includes(t.podtyp) ? 0 : Math.round(t.dystans_km)), 0); // dystanse po zaokrągleniu do pełnych km
    let actualKm = sumRounded(wk);
    if (raceKmWeek > 0) { // symulacja tygodnia ze startem: faktyczna objętość po dołożeniu startu i truchtu przed nim
      let sim = wk.map((x) => ({ ...x }));
      for (const r of extra.filter((r) => r.date >= weekStart && r.date < addDays(weekStart, 7))) sim = applyExtraRace(sim, r, ctxR).treningi;
      actualKm = sumRounded(sim.filter((x) => x.data >= weekStart && x.data < addDays(weekStart, 7)));
    }
    if (phase !== "taper") prevActual = actualKm; else if (!raceWeek) prevTaperKm = actualKm;
    prevRuns = wk.filter((t) => !AUX.includes(t.podtyp)).length;
    // A partial first calendar week is not evidence of a lower habitual frequency.
    if (!rw && weekStart < startDate) prevRuns=Math.min(I.daysPerWeek,Math.max(prevRuns,Math.floor(startVol/minEasy)));
    if (!rw && !recovery && phase !== "taper" && !raceWeek && wk.length && weekStart >= startDate) prevFullRuns = prevRuns;
    if (!rw && !recovery && phase !== "taper" && w <= wPeak) longIdx++;
    if (!rw && phase !== "taper" && !recovery) prevKm = actualKm;
    if (!recovery && phase !== "taper" && weekStart >= startDate && actualKm > 0) previousLoadV22 = actualKm;
    if (!recovery && phase !== "taper" && weekStart >= startDate && wk.length) previousEffortV22 = wk.reduce((a,t) => a + sessionLoad(t,gt),0);
    if(phase==='taper'){const long=wk.find(t=>t.podtyp==='dlugi');if(long)previousTaperLong=long.dystans_km;}
    state.doseByFamily??={};for(const t of wk.filter(t=>['tempo','interwaly','tempo_startowe','podbiegi'].includes(t.podtyp)))state.doseByFamily[t.podtyp]=workDose(t).minutes;
    retainFamilyRecipes(state,wk);
    planningTrace.units(weekStart,'repaired',wk,[recovery?'RECOVERY':phase==='taper'?'TAPER':'REPAIR']);
    intentVerification.push(verifyWeekIntent(seasonWeek.targets,ctxW.envelope,wk,{from:weekStart,partial:weekStart<startDate,raceWeek,candidates:state.constraintDecisions.at(-1)?.candidates.length}));
    recordSeasonWeek(seasonState,w,wk);
    treningi.push(...wk);
    if (w > 0 && phase !== "taper" && !rw && !recovery && wk.length) {
      const actual = wk.reduce((a, t) => a + t.dystans_km, 0);
      peakSoFar = Math.max(peakSoFar, actual);
      // v17: planowana objętość podąża za faktyczną, ale straty z zaokrągleń i biegów regeneracyjnych (zwykle 1-2 km)
      // nie mogą obniżać budżetu następnego tygodnia. Wcześniej każdy tydzień startował od niższej bazy (stagnacja, np. 11 km przez 14 tyg.).
      if (raceKmWeek === 0) lastBuild = Math.max(actualKm, Math.min(vol, actualKm + 2));
    }
    prevWasRec = recovery;
    tygodnie.push({ tydzien: w + 1, od: weekStart, faza: rw ? "adaptacja (marszobiegi)" : { base: "baza", build: "budowanie", peak: "szczyt", taper: "zwolnienie" }[phase] + (recovery ? " (tydzień odciążający)" : "") + (weekStart < startDate ? " (początek, część tygodnia)" : ""), km: r1(wk.reduce((a, t) => a + t.dystans_km, 0)), treningi: wk.length });
  }

  const zmianyPrzezStarty = [];
  if (extra.length) {
    let tr = treningi.slice();
    for (const r of extra) { const res = applyExtraRace(tr, r, ctxR); tr = res.treningi; zmianyPrzezStarty.push({ start: r.name || r.date, data: r.date, ...res.zmiany }); }
    tr.sort((a, b) => (a.data < b.data ? -1 : 1));
    treningi.length = 0; treningi.push(...tr);
    for (const t of tygodnie) {
      const inW = treningi.filter((x) => x.data >= t.od && x.data < addDays(t.od, 7));
      t.km = r1(inW.reduce((a, x) => a + x.dystans_km, 0)); t.treningi = inW.length;
      if (extra.some((r) => r.date >= t.od && r.date < addDays(t.od, 7))) t.faza += " (start poboczny)";
    }
    warnings.push(`W planie uwzględniłem ${extra.length} start(y) poboczne: przed każdym kilka dni bez mocnych treningów i lekki trucht dzień wcześniej, po starcie odpoczynek zależny od dystansu (po półmaratonie dłuższy).`);
  }

  if (I.podbiegi) {
    if (I.level === "beginner" || I.injuries) warnings.push("Podbiegi są dostępne od poziomu średnio zaawansowanego i bez kontuzji, więc w tym planie ich nie ma.");
    else {
      const nh = treningi.filter((t) => t.podtyp === "podbiegi").length;
      warnings.push(nh ? `Podbiegi: ${nh} w planie (zastępują co ${hillsEvery(I)}. trening z cyklu interwałowego${typeof I.podbiegi === "number" ? "" : ", wybór automatyczny"}).` : `W tym planie jest za mało treningów z cyklu interwałowego, żeby podbiegi pojawiły się co ${hillsEvery(I)}. raz. Wybierz tryb automatyczny albo częstsze podbiegi (co 2.).`);
    }
  }
  if (silaN > 0) warnings.push(`Trening siłowy: ${silaN} w tygodniu, w dni bez biegania (nie liczy się do kilometrów).`);
  else if (I.age >= 40 || I.injuries || I.level === "beginner") warnings.push("Wskazówka: przy Twoim profilu warto dodać 1 trening siłowy w tygodniu. Możesz to włączyć w ustawieniach planu.");
  if (I.daysPerWeek === 2 && silaN + crossN === 0) warnings.push("Wskazówka: przy 2 treningach biegowych warto dodać trzeci, lekki trening uzupełniający (siła i mobilność albo rower, pływanie, 30-40 min). Możesz to włączyć w ustawieniach planu.");

  if (hasRace && I.przedStartem === "trucht") {
    const dm1 = addDays(g.raceDate, -1);
    if (dm1 >= startDate && I.availableDays.includes(dowOf(dm1)) && !treningi.some((t) => t.data === dm1)) {
      treningi.push({ data: dm1, typ: "Regeneracyjny", podtyp: "regeneracja", dystans_km: 3, czas_min: 20, strefa_tetna: "Z1", tempo_zakres: range(P.recovery), opis: "Dzień przed startem: lekki trucht 15-20 min + 4 przebieżki po 20 s. Nawodnienie, sen, przygotowanie sprzętu.", kroki: [{ etap: "Lekki trucht przed startem", czas_min: 18, tempo: range(P.recovery), tetno: `${Z[0].od}-${Z[0].do} (Z1)` }, { etap: "Przebieżki", uwagi: "4× 20 s swobodnie. Dziś: nawodnienie, sen, przygotowanie sprzętu." }] });
      treningi.sort((a, b) => (a.data < b.data ? -1 : 1));
      for (const t of tygodnie) { const inW = treningi.filter((x) => x.data >= t.od && x.data < addDays(t.od, 7)); t.km = r1(inW.reduce((a, x) => a + x.dystans_km, 0)); t.treningi = inW.length; }
    }
  }
  if (hasRace && treningi.length === 0) { // start tuż-tuż: zawsze zostaje lekki trucht zamiast pustego planu
    const dm1 = addDays(g.raceDate, -1), dd0 = startDate < dm1 ? startDate : dm1;
    if (dd0 >= startDate && I.availableDays.includes(dowOf(dd0))) treningi.push({ data: dd0, typ: "Regeneracyjny", podtyp: "regeneracja", dystans_km: 3, czas_min: 20, strefa_tetna: "Z1", tempo_zakres: range(P.recovery), opis: "Lekki trucht 15-20 min i 4 przebieżki po 20 s. Do startu zostało bardzo mało czasu: nawodnienie, sen, spokój.", kroki: [{ etap: "Lekki trucht", czas_min: 18, tempo: range(P.recovery), tetno: `${Z[0].od}-${Z[0].do} (Z1)` }, { etap: "Przebieżki", uwagi: "4× 20 s swobodnie" }] });
  }
  if (hasRace) { // tydzień startowy: lekki rozruch 2 dni przed startem, żeby nie było długiej przerwy bez bodźca
    const dm1 = addDays(g.raceDate, -1), dm2 = addDays(g.raceDate, -2);
    const near = treningi.some((t) => (t.data === dm1 || t.data === dm2) && !AUX.includes(t.podtyp));
    // v21: rozruch nie może zwiększyć liczby biegów tygodnia ponad zadeklarowaną (V20 dawała 3 biegi przy 2 deklarowanych)
    const wkMon = mondayOf(dm2), runsThatWeek = treningi.filter((t) => !AUX.includes(t.podtyp) && mondayOf(t.data) === wkMon).length;
    if (!near && I.daysPerWeek >= 3 && dm2 >= startDate && runsThatWeek < I.daysPerWeek) {
      const km = I.level === "advanced" ? 4 : 3, own = I.availableDays.includes(dowOf(dm2)), kroki = easyKroki({ P, Z }, km, true, false);
      if (own) treningi.push({ data: dm2, typ: "Bieg spokojny Z2", podtyp: "latwy", dystans_km: km, czas_min: Math.round((km * easyMid) / 60), strefa_tetna: "Z2", tempo_zakres: range(P.easy), opis: descr(kroki), kroki, dodatkowy: false, faza_planu: "taper" });
      treningi.sort((a, b) => (a.data < b.data ? -1 : 1));
    }
  }
  const korektyTygodniaStartowego=[];
  if (hasRace) {
    const raceMon=mondayOf(g.raceDate);
    let runs=treningi.filter(t=>!AUX.includes(t.podtyp) && mondayOf(t.data)===raceMon);
    const allowed=Math.max(0,I.daysPerWeek-1);
    while(runs.length>allowed) {
      const remove=I.przedStartem === "trucht" ? runs[0] : runs[runs.length-1];
      treningi.splice(treningi.indexOf(remove),1);korektyTygodniaStartowego.push({data:remove.data,powod:"start_wliczony_do_limitu_jednostek"});
      runs=runs.filter(t=>t!==remove);
    }
  }
  const dlugieZmiany = hasRace ? capLongNearRace(treningi, g.type, g.raceDate) : [];
  for (const z of dlugieZmiany) warnings.push(`Dlugi bieg ${z.data} skrocono z ${z.bylo} do ${z.jest} km, bo wypada na ${z.dniDoStartu} dni przed startem (zbyt duze obciazenie tuz przed zawodami).`);
  treningi.forEach(roundWorkout);
  treningi.forEach(t=>syncStructure(t,{recomputeTime:true}));
  const ctxFit = { P, Z, easyMid };
  const limAt = (d) => (dowOf(d) === 0 || dowOf(d) === 6 ? I.maxMinutesWe : I.maxMinutesWd);
  for (let i = treningi.length - 1; i >= 0; i--) {
    const t = treningi[i], lim = limAt(t.data);
    if (!(t.czas_min > lim)) continue;
    const r = fitWorkoutToLimit(t, lim, ctxFit);
    if (r.wynik === "usuniety") { treningi.splice(i, 1); state.timeNotes.auxPominiety++; }
    else if (r.wynik !== "bez_zmian") state.timeNotes.dopasowaniePoZaokragleniu = (state.timeNotes.dopasowaniePoZaokragleniu || 0) + 1;
  }
  // Reclassify from actual preceding load after dose/time edits, not the old recipe.
  for (const t of treningi) {
    if (t.podtyp !== "regeneracja" || hasRace && diffDays(t.data,g.raceDate) <= 1) continue;
    const previous = treningi.find(x => x.data === addDays(t.data,-1));
    if (!previous || !["dlugi","tempo","interwaly","podbiegi","tempo_startowe","test","start","ostrzenie"].includes(previous.podtyp)) {
      toEasyRun(t,ctxFit);
      korektyObciazen.push({ data:t.data,typ:"klasyfikacja",powod:"brak_mocnego_dnia_poprzedniego",na:"latwy" });
    }
  }
  przeliczTygodnie(treningi, tygodnie);
  if (hasRace) {
    const raceWeek = tygodnie.find((t) => g.raceDate >= t.od && g.raceDate < addDays(t.od, 7));
    if (raceWeek) {
      raceWeek.km = r1(raceWeek.km + DIST[g.type] / 1000);
      raceWeek.biegi = (raceWeek.biegi || 0) + 1;
      raceWeek.treningi = (raceWeek.treningi || 0) + 1;
      raceWeek.start = { data: g.raceDate, dystans_km: r1(DIST[g.type] / 1000), uwzglednionyWKilometrazu: true };
      raceWeek.dni_biegowe = [...(raceWeek.dni_biegowe || []), g.raceDate].sort();
    }
  }
  treningi.forEach((t) => {syncStructure(t,{recomputeTime:true});Object.assign(t, metaFor(t));});

  // czy plan realnie dochodzi do poziomu zalecanego dla dystansu
  const REQ = { "5k": { long: 5, week: 15 }, "10k": { long: 10, week: 20 }, half: { long: 16, week: 30 }, marathon: { long: 28, week: 45 } };
  let gotowosc = null;
  if (hasRace && REQ[g.type] && przygotowanie) {
    const f = I.level === "beginner" && !fitEvidence && g.type !== "marathon" ? 0.85 : 1; // v20-F3: ulga dla poczatkujacych nie dotyczy maratonu (V19: ukonczenie maratonu deklarowane juz przy dlugim biegu ok. 24 km)
    const need = { najdluzszyBiegKm: r1(REQ[g.type].long * f), kmTygodniowo: Math.round(REQ[g.type].week * f) };
    const runs = treningi.filter((t) => ["latwy", "dlugi", "marszobieg"].includes(t.podtyp));
    const got = { najdluzszyBiegKm: r1(Math.max(0, ...runs.map((t) => t.dystans_km))), kmTygodniowo: Math.round(Math.max(0, ...tygodnie.filter((t) => !t.faza.startsWith("zwoln")).map((t) => t.km))) };
    const longRatio = got.najdluzszyBiegKm / Math.max(need.najdluzszyBiegKm, 1);
    const volumeRatio = got.kmTygodniowo / Math.max(need.kmTygodniowo, 1);
    const minFrequency = { "5k": 2, "10k": 3, half: 3, marathon: 4 }[g.type];
    const frequencyOk = I.daysPerWeek >= minFrequency;
    const readinessRatio = Math.min(longRatio, volumeRatio);
    const minWeeks = MIN_WEEKS[g.type][I.level === "beginner" ? 1 : 0];
    const timeOk = przygotowanie.dostepneTygodnie >= minWeeks;
    const taperWeeks = T;
    const taperOk = taperWeeks >= (g.type === "marathon" ? 2 : 1);
    const longOk = longRatio >= 0.95;
    const volumeOk = volumeRatio >= 0.95;
    const marathonBaseOk = g.type !== "marathon" || (
      I.daysPerWeek >= 4 &&
      I.currentWeeklyKm >= (I.level === "beginner" ? 30 : 38) &&
      I.longestRecentRun >= (I.level === "beginner" ? 18 : 22)
    );
    const completionReady = readinessRatio >= 0.95 && frequencyOk && timeOk && taperOk && longOk && volumeOk && marathonBaseOk;
    // v19-C5: "gotowość do WYNIKU" wymaga czegoś więcej niż ukończenia: wiarygodnego wyniku odniesienia (fitEvidence), co najmniej 3 biegów
    // tygodniowo (przy 2 biegach nie da się zaplanować sensownej jakości i długiego biegu jednocześnie) i niezbyt starego wyniku.
    const wynikStary = !!(I.bestResult && I.bestResult.date && isRealDate(I.bestResult.date) && diffDays(I.bestResult.date, I.today) > 180);
    const wynikDaneOk = fitEvidence && !wynikStary;
    const wynikCzestotliwoscOk = I.daysPerWeek >= 3;
    // v20-F1: do WYNIKU wymagane sa wyzsze progi niz do ukonczenia (V19 uzywala 1,05 x prog ukonczenia: maraton 47 km/tydz.) oraz 4 biegi przy maratonie.
    const RESULT_NEED = { "5k": { long: 7, week: 18 }, "10k": { long: 11, week: 26 }, half: { long: 17, week: 32 }, marathon: { long: 30, week: 50 } }[g.type];
    const wynikProgiOk = got.najdluzszyBiegKm >= RESULT_NEED.long && got.kmTygodniowo >= RESULT_NEED.week && (g.type !== "marathon" || I.daysPerWeek >= 4);
    const resultReady = completionReady && readinessRatio >= 1.05 && wynikProgiOk && !!g.targetTimeSec && ["realny", "ambitny"].includes(assess.werdykt) && wynikDaneOk && wynikCzestotliwoscOk;
    const status = resultReady
      ? "odpowiednie_przygotowanie_do_wyniku"
      : completionReady ? "odpowiednie_przygotowanie_do_ukonczenia"
      : readinessRatio >= 0.70 && timeOk ? "przygotowanie_czesciowe" : "niewystarczajace_przygotowanie";
    const ok = completionReady;
    // v20-F2: cztery jawnie rozdzielone poziomy (mozliwosc ukonczenia / ukonczenie bez limitu czasu / konkretny wynik / brak bezpiecznej bazy)
    const BASE_MIN = { "5k": { km: 0, long: 0 }, "10k": { km: 8, long: 4 }, half: { km: 14, long: 7 }, marathon: { km: 24, long: 12 } }[g.type];
    const bazaBezpieczna = I.currentWeeklyKm >= BASE_MIN.km && I.longestRecentRun >= BASE_MIN.long;
    const rozdzielenie = {
      bazaBezpieczna, bazaMinimalna: { kmTygodniowo: BASE_MIN.km, najdluzszyBiegKm: BASE_MIN.long },
      mozliwoscUkonczenia: bazaBezpieczna && readinessRatio >= 0.70 && timeOk,
      ukonczenieBezLimituCzasu: completionReady,
      doKonkretnegoWyniku: resultReady,
      etykieta: resultReady ? "przygotowanie_do_wyniku" : completionReady ? "przygotowanie_do_ukonczenia" : !bazaBezpieczna ? "brak_bezpiecznej_bazy" : readinessRatio >= 0.70 && timeOk ? "przygotowanie_czesciowe" : "niewystarczajace_przygotowanie",
      wynikBrakuje: [!wynikDaneOk && "wiarygodny, aktualny wynik odniesienia", !wynikProgiOk && `progi do wyniku (najdluzszy bieg ${RESULT_NEED.long} km, ${RESULT_NEED.week} km/tydz.${g.type === "marathon" ? ", min. 4 biegi" : ""})`, !g.targetTimeSec && "cel czasowy"].filter(Boolean),
    };
    if (!completionReady && !bazaBezpieczna) warnings.push(`Brak bezpiecznej bazy do dystansu ${DIST_LABEL[g.type]}: potrzeba co najmniej ${BASE_MIN.km} km tygodniowo i najdluzszego biegu ${BASE_MIN.long} km (masz ${I.currentWeeklyKm} km i ${I.longestRecentRun} km). Plan odbudowuje baze stopniowo, ale do startu nie da sie z niej bezpiecznie dojsc do pelnej gotowosci: rozwaz pozniejszy start albo krotszy dystans.`);
    gotowosc = { ok, status, rozdzielenie, wynikWiarygodnyPowody: [!wynikDaneOk && "brak wiarygodnego i aktualnego wyniku odniesienia", !wynikCzestotliwoscOk && "mniej niż 3 biegi tygodniowo"].filter(Boolean), wskaznik: r1(readinessRatio), czestotliwoscOk: frequencyOk, minimalnaCzestotliwosc: minFrequency, czasPrzygotowaniaOk: timeOk, minimalneTygodnie: minWeeks, taperTygodnie: taperWeeks, taperOk, dlugiBiegOk: longOk, kilometrazOk: volumeOk, bazaMaratonskaOk: marathonBaseOk, pewnoscOceny: fitEvidence ? "umiarkowana" : "niska", wymagane: need, wPlanie: got };
    if (!ok) {
      const missing = [!frequencyOk && `liczba biegów poniżej ${minFrequency} tygodniowo`, !timeOk && `czas krótszy niż ${minWeeks} tyg.`, !taperOk && "za krótki taper", !longOk && "za krótki długi bieg", !volumeOk && "za mała objętość tygodniowa", !marathonBaseOk && "niewystarczająca baza maratońska"].filter(Boolean).join("; ");
      warnings.push(`Ocena przygotowania: ${status.replaceAll("_", " ")}. Przy ${I.daysPerWeek} ${I.daysPerWeek === 1 ? "biegu" : "biegach"} tygodniowo plan osiąga najdłuższy bieg ${got.najdluzszyBiegKm} km i ${got.kmTygodniowo} km tygodniowo; kryteria orientacyjne to ${need.najdluzszyBiegKm} km i ${need.kmTygodniowo} km. Niespełnione kryteria: ${missing || "nieznane"}. Ocena gotowości nie gwarantuje wyniku.`);
      if (g.targetTimeSec) assess.werdykt = "nierealny";
    }
  }

  // kontrola: czy tempa jakościowe (poza fazą bazową) wynikają z jednej formy docelowej planu
  let spojnoscTemp = null;
  if (planVdot && !I.tempoProgowe) {
    const impl = (pace, f) => { const v = 60000 / pace; return (-4.6 + 0.182258 * v + 0.000104 * v * v) / f; };
    const devs = [];
    for (const t of treningi) {
      if (t.faza_planu === "base" || !t.tempo_zakres) continue;
      const m = String(t.tempo_zakres).match(/^(\d+):(\d{2})-(\d+):(\d{2})$/);
      if (!m) continue;
      const mid = (+m[1] * 60 + +m[2] + +m[3] * 60 + +m[4]) / 2;
      if (t.podtyp === "tempo") devs.push(Math.abs(impl(mid, 0.86) / planVdot - 1));
      else if (t.podtyp === "interwaly") devs.push(Math.abs(impl(mid, 0.975) / planVdot - 1));
    }
    const mx = devs.length ? Math.max(...devs) : 0;
    spojnoscTemp = { ok: mx < 0.02, maxOdchylenieProc: r1(mx * 100), sprawdzone: devs.length };
  }
  let maxRunsActual = 0;
  {
    const runsPerWeek = tygodnie.filter((t) => !t.faza.includes("start poboczny") && !t.faza.startsWith("zwoln")).map((t) => treningi.filter((x) => x.data >= t.od && x.data < addDays(t.od, 7) && !AUX.includes(x.podtyp)).length);
    maxRunsActual = runsPerWeek.length ? Math.max(...runsPerWeek) : 0;
    if (maxRunsActual < I.daysPerWeek && !rwMode) warnings.push(`Zadeklarowano ${I.dniZadeklarowane} treningów tygodniowo; przy obecnym kilometrażu generator realnie układa maksymalnie ${maxRunsActual} biegi w tygodniu (limit wybranych dni: ${I.daysPerWeek}). Dodatkowe jednostki wymagałyby zbyt krótkich biegów albo zbyt szybkiego wzrostu obciążeń.`);
  }
  const faktyczneDni = [...new Set(treningi.filter((t) => !AUX.includes(t.podtyp)).map((t) => dowOf(t.data)))].sort((a, b) => pos(a) - pos(b));
  const proponowaneZmiany = [];
  if (!inp.__noAlt && hasRace && ((gotowosc && !gotowosc.ok) || assess.werdykt === "nierealny")) {
    const alt = (opis, patch) => {
      const q = generatePlan({ ...inp, ...patch, __noAlt: true });
      if (!q.ok) return;
      proponowaneZmiany.push({ opis, zmiana: patch, wynik: { werdykt: q.ocena.werdykt, najdluzszyBiegKm: q.gotowosc ? q.gotowosc.wPlanie.najdluzszyBiegKm : q.kontrola.najdluzszyBiegKm, kmTygodniowo: q.gotowosc ? q.gotowosc.wPlanie.kmTygodniowo : Math.round(q.kontrola.maxTygodniowyKm), gotowosc: q.gotowosc ? ((q.gotowosc.ok||q.gotowosc.planOsiagaKryteria) ? (q.readinessEvidence?.status==="potwierdzona_danymi" ? "orientacyjne kryteria treningowe potwierdzone zgłoszonym wykonaniem" : "warunkowa: harmonogram osiąga kryteria, brak potwierdzenia wykonaniem") : "harmonogram nadal poniżej kryteriów") : "-", kryteriaHarmonogramu:!!(q.gotowosc?.ok||q.gotowosc?.planOsiagaKryteria), gotowoscDanych:q.readinessEvidence?.status||"nieoceniona" } });
    };
    if (I.daysPerWeek < 6 && I.availableDays.length > I.daysPerWeek) alt(`Dodaj ${I.daysPerWeek + 1}. trening biegowy w tygodniu`, { daysPerWeek: I.daysPerWeek + 1 });
    else if (I.daysPerWeek < 6) proponowaneZmiany.push({ opis: `Dodaj kolejny dzień do dostępnych dni biegowych (obecnie ${I.availableDays.length}) i ustaw ${I.daysPerWeek + 1} treningi w tygodniu`, zmiana: { daysPerWeek: I.daysPerWeek + 1 } });
    alt(`Przesuń start o 4 tygodnie (${addDays(g.raceDate, 28)})`, { goal: { ...inp.goal, raceDate: addDays(g.raceDate, 28) } });
    if (g.type === "marathon" && (I.daysPerWeek <= 3 || (gotowosc && gotowosc.rozdzielenie && !gotowosc.rozdzielenie.bazaBezpieczna))) alt("Zmień cel na półmaraton w tym samym terminie (bezpieczniejszy przy obecnej bazie i liczbie biegów)", { goal: { ...inp.goal, type: "half", targetTimeSec: undefined } });
    if (assess.sugerowanyCzas && g.targetTimeSec) proponowaneZmiany.push({ opis: `Zmień cel czasowy na ${fmtTime(assess.sugerowanyCzas)} (realny przy obecnej formie)`, zmiana: { goal: { ...inp.goal, targetTimeSec: assess.sugerowanyCzas } } });
    proponowaneZmiany.push({ opis: "Zostań przy swoich ustawieniach: plan i tak powstaje, ale cel może być nie do osiągnięcia", zmiana: {} });
  }

  // v21: jawna ocena WYKONALNOŚCI celu przy podanych ograniczeniach (częstotliwość, baza, czas, limity czasu treningu).
  // poziom: "pelna" | "ograniczona" (plan powstaje, ale nie zapewnia pełnego przygotowania) | "niewykonalna" (cel nie do zrealizowania bezpiecznie przy tych danych).
  const wykonalnosc = { poziom: "pelna", konflikty: [], zalecenia: [] };
  {
    const K = (kod, opis, poziom) => { wykonalnosc.konflikty.push({ kod, opis, poziom }); if (poziom === "niewykonalna" || (poziom === "ograniczona" && wykonalnosc.poziom === "pelna")) wykonalnosc.poziom = poziom; };
    if (hasRace && assess.werdykt === "nierealny" && g.targetTimeSec) K("CEL_CZASOWY", "Cel czasowy przekracza ocenioną gotowość; zwykły plan jest alternatywą według aktualnej formy.", "niewykonalna");
    if (hasRace && daysToRace < ({ "5k": 21, "10k": 28, half: 42, marathon: 70 }[g.type]) && I.currentWeeklyKm < ({ "5k": 12, "10k": 20, half: 28, marathon: 42 }[g.type])) K("BRAK_CZASU_NA_ADAPTACJE", "Termin i obecna baza nie pozwalają bezpiecznie zbudować przygotowania; plan służy podtrzymaniu, rozważ rezygnację ze startu.", "niewykonalna");
    if (I.age < 18 && ["half", "marathon"].includes(g.type)) K("NIEPELNOLETNI_DLUGI_DYSTANS", "Automatyczny model nie kwalifikuje osoby niepełnoletniej do długiego dystansu; potrzebna indywidualna ocena specjalisty.", "niewykonalna");
    if(Number(inp.pain)>=3)K("DOLEGLIWOSCI","Zgłoszone dolegliwości ograniczają plan do spokojnej bazy; gotowość do celu wymaga ponownej oceny.","ograniczona");
    const baza = gotowosc && gotowosc.rozdzielenie ? gotowosc.rozdzielenie.bazaBezpieczna : true;
    if (I.daysPerWeek === 1 && DIST[g.type]) K("JEDEN_BIEG", `Jeden bieg tygodniowo wystarcza na podtrzymanie aktywności, nie na przygotowanie do dystansu ${DIST_LABEL[g.type]}: nie da się jednocześnie zbudować wytrzymałości i bodźców jakościowych.`, g.type === "half" || g.type === "marathon" ? "niewykonalna" : "ograniczona");
    if (hasRace && g.type === "marathon") {
      if (I.daysPerWeek <= 2) K("MARATON_ZA_MALO_BIEGOW", `Maraton przy ${I.daysPerWeek} biegach tygodniowo: długi bieg musiałby zająć większość tygodnia, a objętość nie wystarczy na ten dystans. Plan może co najwyżej pomóc przejść trasę bardzo ostrożnie, bez celu czasowego.`, "niewykonalna");
      else if (I.daysPerWeek === 3) K("MARATON_MALO_BIEGOW", "Maraton przy 3 biegach tygodniowo to przygotowanie ograniczone: ukończenie jest możliwe tylko przy dużej wcześniejszej bazie, cel czasowy jest ryzykowny. Zalecane min. 4 biegi.", "ograniczona");
      if (!baza && przygotowanie && przygotowanie.dostepneTygodnie < 20) K("MARATON_BRAK_BAZY", `Maraton przy bazie ${I.currentWeeklyKm} km tygodniowo i najdłuższym biegu ${I.longestRecentRun} km w ${przygotowanie.dostepneTygodnie} tyg. wymagałby zbyt szybkiego wzrostu obciążeń (plan nie kompensuje braku bazy gwałtownym zwiększaniem kilometrażu).`, "niewykonalna");
    }
    if (hasRace && g.type === "half" && I.daysPerWeek <= 2) K("PÓŁMARATON_MALO_BIEGOW", "Półmaraton przy 2 biegach tygodniowo: przygotowanie ograniczone, bez treningów specyficznych poza jednym akcentem i długim biegiem.", "ograniczona");
    if (hasRace && !baza && g.type !== "5k" && wykonalnosc.poziom === "pelna") K("BRAK_BAZY", `Brak bezpiecznej bazy dla dystansu ${DIST_LABEL[g.type]} (masz ${I.currentWeeklyKm} km tygodniowo, najdłuższy bieg ${I.longestRecentRun} km).`, "ograniczona");
    if (hasRace && DIST[g.type] && (g.type === "half" || g.type === "marathon") && Number(I.maxLongMinutes) > 0 && Number(I.maxLongMinutes) < (g.type === "marathon" ? 120 : 75)) K("LIMIT_DLUGIEGO_ZA_MALY", `Limit czasu długiego biegu (${I.maxLongMinutes} min) jest za mały, aby przećwiczyć wysiłek zbliżony do dystansu ${DIST_LABEL[g.type]}.`, "ograniczona");
    if (limitMisses.length) K("LIMIT_KM_NIEOSIAGNIETY", `W ${limitMisses.length} tygodniach nie udało się zejść z kilometrażem do założonego limitu bez zniszczenia sensu treningowego.`, "ograniczona");
    if (gotowosc && !gotowosc.ok && wykonalnosc.poziom === "pelna") K("GOTOWOSC", `Plan nie osiąga kryteriów przygotowania do dystansu (${String(gotowosc.status).replaceAll("_", " ")}).`, "ograniczona");
    if (wykonalnosc.poziom !== "pelna") {
      if (g.type === "marathon") wykonalnosc.zalecenia.push("Rozważ półmaraton albo maraton w późniejszym terminie (min. 4 biegi tygodniowo i baza min. ok. 38 km tygodniowo oraz najdłuższy bieg ok. 22 km).");
      else if (DIST[g.type]) wykonalnosc.zalecenia.push("Rozważ więcej biegów tygodniowo, późniejszy start albo krótszy dystans.");
      for (const z of proponowaneZmiany.slice(0, 3)) if (z.opis && !/Zostań/.test(z.opis)) wykonalnosc.zalecenia.push(z.opis);
      warnings.unshift(`Wykonalność celu: ${wykonalnosc.poziom}. ${wykonalnosc.konflikty.map((k) => k.opis).join(" ")}`);
    }
  }
  if (inp.trybScisly && wykonalnosc.poziom === "niewykonalna") return { ok: false, wersja: VERSION, bledy: wykonalnosc.konflikty.map((k) => k.opis), komunikat: "Cel jest niewykonalny przy podanych ograniczeniach (tryb ścisły): zmień cel, dystans, termin lub liczbę biegów.", wykonalnosc, ostrzezenia: warnings };
  const dataKonca = hasRace ? g.raceDate : treningi.length ? treningi[treningi.length - 1].data : addDays(today, 7 * W);
  const sumKm = r1(treningi.reduce((a, t) => a + t.dystans_km, 0) + (hasRace ? DIST[g.type] / 1000 : 0));
  const endGain = gainAt(R);
  if (planVdot && treningi.some((t) => ACCENT_PODTYPY.includes(t.podtyp))) warnings.push(`Tempa progowe i interwałowe nie wyprzedzają obecnej formy. Tempo startowe jest osobnym bodźcem; cel ${fmtTime(goalTime)} (${fmtPace(goalPace)} min/km) nie jest dowodem adaptacji. Wykonaj zaplanowany test formy i przy gorszym wyniku przelicz plan.`);
  else if (endGain > 0.005 && !rwMode && treningi.some((t) => ACCENT_PODTYPY.includes(t.podtyp))) warnings.push(`Tempa tempowe i interwałowe rosną w trakcie planu zgodnie z prognozą poprawy formy (do ok. +${r1(endGain * 100)}%). Wykonaj zaplanowane testy formy i wpisz wyniki, a przy gorszym wyniku przelicz plan.`);
  const realPeak = Math.round(Math.max(...tygodnie.filter((t) => !t.faza.startsWith("zwoln")).map((t) => t.km)));
  if (rwMode) warnings.push(`Zaczynamy od marszobiegów (pierwsze ok. ${rwLen} tyg.), żeby bezpiecznie przyzwyczaić stawy i ścięgna do biegania.`);
  if (bmi >= 35) warnings.push("BMI powyżej 35: przed rozpoczęciem biegania skonsultuj się z lekarzem. Plan zwiększa obciążenie wolniej i omija interwały.");
  else if (bmi >= 30) warnings.push("BMI powyżej 30: obciążenie rośnie wolniej. Warto zadbać o dobre buty i dodać trening siłowy.");
  // v19-C3: usunięto komunikat "dwa treningi to minimum na ten dystans" (sprzeczny z oceną gotowości: półmaraton wymaga 3, maraton 4); powód podaje ocena przygotowania.
  if (I.injuries) warnings.push("Zgłosiłeś kontuzje lub ograniczenia: plan jest łagodniejszy, bez interwałów. Przy bólu przerwij trening i skonsultuj się ze specjalistą.");
  if (I.age >= 45 && I.level !== "advanced") warnings.push("Po 45. roku życia warto zrobić badania kontrolne przed rozpoczęciem intensywnego treningu.");
  if (I.age >= 50) warnings.push("Wiek 50+: rampa kilometrazu jest wolniejsza, a tygodnie odciazajace wypadaja co trzeci tydzien, bo regeneracja tkanek trwa dluzej.");
  if (I.hrMaxEstimated) warnings.push("Tętno maksymalne jest szacowane wzorem 208 − 0,7 × wiek. Jeśli znasz swoje prawdziwe HRmax, wpisz je w profilu.");

  const auditOpts = { minEasy: I.daysPerWeek >= 4 ? 2 : I.daysPerWeek === 3 ? 3 : minEasy, limitCzasuMin: Math.min(I.maxMinutesWd, I.maxMinutesWe), raceDate: hasRace ? g.raceDate : null, raceDistanceKm: hasRace ? DIST[g.type] / 1000 : null, goalType: hasRace ? g.type : null, level: I.level, levelRunLimit: I.limitBiegowPoziomu, daysPerWeek: I.daysPerWeek, declaredDays: I.dniZadeklarowane, availableDays: I.availableDays, maxMinutesWd: I.maxMinutesWd, maxMinutesWe: I.maxMinutesWe, startDate, currentWeeklyKm: I.currentWeeklyKm, longestRecentRun: I.longestRecentRun };
  let kontrola = auditPlan(treningi, auditOpts), naprawa = null;
  if (kontrola.liczbaBledowKrytycznych > 0) {
    const rep = repairPlan(treningi, { ...auditOpts, ctx: { P, Z, easyMid } });
    naprawa = { wykonana: rep.zmiany.length > 0, zmiany: rep.zmiany, przed: rep.przed, po: rep.po, powodzenie: rep.ok };
    if (rep.zmiany.length) {
      treningi.length = 0; treningi.push(...rep.treningi);
      treningi.forEach((t) => {syncStructure(t,{recomputeTime:true});Object.assign(t, metaFor(t));});
      przeliczTygodnie(treningi, tygodnie);
      if (hasRace) { const rw2 = tygodnie.find((t) => g.raceDate >= t.od && g.raceDate < addDays(t.od, 7)); if (rw2) { rw2.km = r1(rw2.km + DIST[g.type] / 1000); rw2.biegi = (rw2.biegi || 0) + 1; rw2.treningi = (rw2.treningi || 0) + 1; rw2.start = { data: g.raceDate, dystans_km: r1(DIST[g.type] / 1000), uwzglednionyWKilometrazu: true }; rw2.dni_biegowe = [...(rw2.dni_biegowe || []), g.raceDate].sort(); } }
      kontrola = rep.kontrola;
      { // v18-P10: automatyczna naprawa nie może być niewidoczna dla użytkownika
        const cnt = {}; for (const z of rep.zmiany) cnt[z.kod] = (cnt[z.kod] || 0) + 1;
        naprawa.kody = cnt;
        warnings.push(`Automatyczna naprawa planu wprowadziła ${rep.zmiany.length} zmian(y) (${Object.entries(cnt).map(([k, v]) => `${k}: ${v}`).join(", ")}); lista w polu naprawa.zmiany.`);
      }
    }
    if (kontrola.liczbaBledowKrytycznych > 0) return { ok: false, wersja: VERSION, bledy: kontrola.bledyKrytyczne, komunikat: "Nie udało się wygenerować planu bez błędów krytycznych; plan roboczy dołączono wyłącznie do diagnostyki.", kontrola, naprawa, treningiRobocze: treningi, tygodnie, ostrzezenia: warnings };
  }
  if (spojnoscTemp && !spojnoscTemp.ok) { kontrola.problemy.push(`Niespójne tempa treningów jakościowych (odchylenie ${spojnoscTemp.maxOdchylenieProc}% od formy planu)`); kontrola.zgodny = false; }
  if (limitMisses.length) { // v20-D1: nie udajemy, ze plan spelnia limit
    warnings.push(`Nie udalo sie zbic ${limitMisses.length} tygodni do zalozonego limitu kilometrow (nie ma juz co skrocic bez zniszczenia sensu treningowego): ${limitMisses.map((m) => `tydz. ${m.tydzien}: ${m.faktycznieKm} km przy limicie ${m.limitKm} km`).join("; ")}.`);
    kontrola.problemy = [...(kontrola.problemy || []), ...limitMisses.map((m) => `LIMIT_KM_NIEOSIAGNIETY tydz. ${m.tydzien} (${m.typ}): ${m.faktycznieKm} km > ${m.limitKm} km`)];
    kontrola.zgodny = false;
  }
  if (korektyObciazen.length) warnings.push(`Kontrola rzeczywistego obciążenia skorygowała ${korektyObciazen.length} tygodni; szczegóły w korektyObciazen.`);
  for (const t of treningi) {
    if(t.podtyp==='tempo_startowe')t.rpe=gt==='marathon'?"5/10, kontrolowane MP":gt==='half'?"6/10, rytm półmaratonu":"7–8/10, rytm 10 km";
    if(t.podtyp==='dlugi' && t.progresywny && gt==='marathon'){t.rpe="3–4/10 spokojnie, 5/10 na odcinku MP";t.cel="Wytrzymałość tlenowa i kontrolowane tempo maratońskie; bez finiszu progowego.";}
    t.intensywnosc = { celFizjologiczny: t.cel, wiarygodnoscTetna: I.hrMaxEstimated ? "szacowane" : I.hrMaxSource === "measured" ? "zmierzone" : "podane_niezweryfikowane", rpeOrientacyjne: effortFor(t,gt), tempoOrientacyjne: daneSlabe, priorytet: daneSlabe ? "RPE i test rozmowy" : "aktualna forma i odczucie", obciazenieSzacunkowe: sessionLoad(t,gt) };
    if (gt === "marathon" && t.podtyp === "dlugi" && t.czas_min >= 75) t.zaleceniaOdzywiania = modelMaratonu.odzywianie;
  }
  for (const w of tygodnie) {
    w.obciazenieSzacunkowe = treningi.filter(t => t.data >= w.od && t.data < addDays(w.od,7)).reduce((a,t) => a + t.intensywnosc.obciazenieSzacunkowe,0);
    w.obciazenieTreningow = w.obciazenieSzacunkowe;
    w.obciazenieZawodowSzacunkowe = w.start && goalTime ? Math.round(goalTime/60*(gt === "marathon" ? 7 : 8)) : 0;
    w.obciazenieSzacunkowe += w.obciazenieZawodowSzacunkowe;
    w.obciazenieUwzgledniaZawody = !!w.start;
    w.obciazenieZrodlo = "szacunek min×RPE; zawody według czasu planu, nie pomiaru";
  }
  const tn = state.timeNotes;
  const ograniczeniaCzasowe = { limitDniRoboczychMin: I.maxMinutesWd, limitWeekendMin: I.maxMinutesWe, limitPodanyPrzezUzytkownika: I.limitCzasuPodany, skroconeDlugieBiegi: tn.dlugiSkrocony, pominiteDlugieBiegi: tn.dlugiPominiety, pominieteAkcentyZPowoduCzasu: tn.jakoscPominietaPrzezCzas, skroconeBiegiSpokojne: tn.latwySkrocony, zmianyPoZaokragleniu: tn.dopasowaniePoZaokragleniu || 0, pominieteUzupelniajace: tn.auxPominiety, komunikat: tn.jakoscPominietaPrzezCzas + tn.dlugiPominiety > 0 ? "Limit czasu uniemożliwił część treningów jakościowych lub długich biegów. Plan nie skraca rozgrzewki ani schłodzenia; jeśli zależy Ci na akcentach, zwiększ limit czasu." : null };
  if (ograniczeniaCzasowe.komunikat) warnings.push(ograniczeniaCzasowe.komunikat);
  // v18-P16: jawny rejestr decyzji planera (żadna zmiana wynikająca z reguł nie jest ukryta)
  const decyzjePlanera = { wariantyTygodni:state.constraintDecisions||[], jakoscPominietaBoSasiedztwoZDlugimBiegiem: tn.jakoscPominietaSasiedztwo || 0, testyPominieteBoNieMiescilySieWBudzecie: tn.testPominiety || 0, kmDopelnionychWJednostkachJakosciowych: tn.jakoscUzupelnionaKm || 0, kmPonadLimityBiegowSpokojnych: tn.kmPonadLimityBiegow || 0, dlugiBiegSkroconyDlaUdzialu: tn.dlugiUdzial || 0, biegiZdjeteDlaLimituPowrotu: tn.biegiZdjeteDlaLimitu || 0 };
  if (decyzjePlanera.jakoscPominietaBoSasiedztwoZDlugimBiegiem > 0) warnings.push(`Pominięto ${decyzjePlanera.jakoscPominietaBoSasiedztwoZDlugimBiegiem} akcent(ów) jakościowych, bo przy Twoich dniach biegowych wypadałyby tuż obok długiego biegu (dwa mocne treningi pod rząd). Dodanie dnia z odstępem umożliwi akcent.`);
  if (decyzjePlanera.testyPominieteBoNieMiescilySieWBudzecie > 0) warnings.push("Zaplanowany test formy został pominięty, bo przy obecnej objętości tygodnia nie mieścił się w budżecie kilometrów. Wykonaj test samodzielnie, gdy będziesz gotowy, i wpisz wynik.");
  const ocenaCelu = ocenaCeluV18({ proponowaneZmiany, I, g, hasRace, assess, gotowosc, przygotowanie, fitEvidence, kontrola, T, goalTime });
  const DAYNAMES = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
  const sortedDays = [...chosen].sort((x, y) => pos(x) - pos(y));
  const gaps = sortedDays.map((d, i) => ((pos(sortedDays[(i + 1) % sortedDays.length]) - pos(d) + 7) % 7) || 7);
  const phaseTxt = hasRace ? `${nBase} tyg. baza, ${nBuild} tyg. budowanie, ${R - nBase - nBuild} tyg. szczyt, ${T} tyg. zwolnienie` : `${nBase} tyg. baza, ${W - nBase} tyg. budowanie`;
  return {
    ok: true,
    wersja: VERSION,
    wiarygodnoscIntensywnosci: { hrMax: I.hrMaxEstimated ? "szacowane" : I.hrMaxSource === "measured" ? "zmierzone" : "podane_niezweryfikowane", priorytet: "RPE/test rozmowy i aktualny wynik; HRmax szacowane ma charakter orientacyjny" },
    periodyzacja: { bazaTygodnie:nBase,budowanieTygodnie:nBuild,specyfikaTygodnie:Math.max(0,R-nBase-nBuild),taperTygodnie:T },
    plan: {
      intencjaTreningowa: I.trainingIntent,
      cel: hasRace ? `${g.raceName || DIST_LABEL[g.type]} ${g.raceDate}${goalTime ? ", cel " + fmtTime(goalTime) : ""}` : DIST_LABEL[gt],
      data_startu: treningi[0]?.data || today, data_konca: dataKonca,
      uzasadnienie: `Forma wyjściowa VDOT ${r1(vdot)} (${assess.zrodloVdot}). Plan na ${W} tyg.: ${phaseTxt}. Najcięższy tydzień ok. ${realPeak} km, maksymalnie ${maxRunsActual} faktycznych biegów w tygodniu (cel: ${I.dniZadeklarowane}), razem ${sumKm} km. Preferowane dni: ${sortedDays.map((d) => DAYNAMES[d]).join(", ")} (odstępy ${gaps.join("/")} dni, długi bieg: ${DAYNAMES[longDow]}).`,
      zawody_docelowe: hasRace ? g.raceName || DIST_LABEL[g.type] : null,
      start: hasRace ? { data: g.raceDate, dzien: DAYNAMES_PL[dowOf(g.raceDate)], nazwa: g.raceName || DIST_LABEL[g.type] } : null,
      tryb: "nowy",
      dni_treningowe: faktyczneDni.map((d) => DAYNAMES[d]),
      preferowaneDniTreningowe: sortedDays.map((d) => DAYNAMES[d]),
      czestotliwosc: { komunikat: `Zadeklarowano ${I.dniZadeklarowane}; plan osiąga maksymalnie ${maxRunsActual} treningów biegowych tygodniowo. ${maxRunsActual<I.dniZadeklarowane ? "Liczbę ogranicza dostępność, poziom i budżet bezpiecznej objętości; szczegóły poniżej." : "Liczba dni jest limitem, nie obowiązkiem w każdym tygodniu."}`, powodyOgraniczenia:[I.dniOgraniczoneDostepnoscia && "dostepnosc", I.dniOgraniczonePoziomem && "limit_poziomu", maxRunsActual<I.daysPerWeek && "budzet_objetosci_lub_czasu"].filter(Boolean), maksymalnieZeStartem:Math.max(0,...tygodnie.map(w=>w.biegi || 0)), zadeklarowaneDni: I.dniZadeklarowane, limitWybranychDni: I.daysPerWeek, zaplanowaneDniTygodnia: maxRunsActual, dostepneDni: I.availableDays.length, limitPoziomu: I.limitBiegowPoziomu, ograniczonoPrzezPoziom: I.dniOgraniczonePoziomem, ograniczonoPrzezDostepnosc: I.dniOgraniczoneDostepnoscia, dzienBezBieganiaZachowany: maxRunsActual<7 },
      dzien_dlugiego_biegu: DAYNAMES[longDow],
      odstepy_miedzy_treningami_dni: gaps,
    },
    seasonState, intentVerification, ...(planningTrace.enabled?{debugTrace:planningTrace.finish(treningi,seasonState,(DIST[g.type]||0)/1000,naprawa?.zmiany||[])}:{}), athleteEvidence:athleteEvidence(I,inp.executionObservations||inp.completedHistory||[],inp), modelMaratonu, korektyObciazen, korektyTygodniaStartowego,
    rejestrJakosci: qualityLedger(I,treningi),
    modelNiskiejCzestotliwosci: I.daysPerWeek<=2 ? {dni:I.daysPerWeek,cel:I.daysPerWeek===1?(gt==="health"?"aktywnosc":I.trainingIntent==="utrzymanie"?"utrzymanie_formy":["half","marathon"].includes(gt)?"baza_zamiast_pelnego_przygotowania":I.trainingIntent==="poprawa"?"poprawa_niepotwierdzona":"ukonczenie_krotkiego_dystansu"):"rozwoj_lub_latwy_plus_wytrzymalosc",pelnePrzygotowanie:false,ograniczenia:"Mała częstotliwość ogranicza rozwój; dodatkowej objętości nie wymusza się w pojedynczej jednostce."}:null,
    indywidualizacja: { poziomJakosci:I.qualityLevel || I.level,tolerancjaIntensywnosci:I.intensityTolerance || "normal",tolerancjaObjetosci:I.loadTolerance || "normal",zmeczenie:I.fatigue ?? null,bazaKm: I.currentWeeklyKm, najdluzszyKm: I.longestRecentRun, stazMiesiace: I.experienceMonths ?? null, historiaTygodni: inp.recentWeeklyKm || null, tryb: I.daysPerWeek === 1 ? "podtrzymanie" : I.daysPerWeek === 2 ? "ograniczona_rotacja" : "przygotowanie", tempaBezAutomatycznejProgresji: true },
    treningi, tygodnie, limityNieosiagniete: limitMisses, wykonalnosc, dlugieSkroconePrzedStartem: dlugieZmiany, ocena: assess, kontrola, naprawa, ograniczeniaCzasowe, decyzjePlanera, ocenaCelu, spojnoscTemp,
    kompletnosc: kompletnosc(inp), jakoscDanych: jakoscDanych(I, inp, assess), regeneracjaPoStarcie: hasRace ? planPoStarcie(g.type, I.level) : null, przygotowanie, gotowosc, proponowaneZmiany, zmianyPrzezStarty, jakRaportowac: JAK_RAPORTOWAC, strategiaStartu: hasRace && goalTime ? strategiaStartu(g.type, goalTime, { Z, level: I.level }) : null,
    strefyTetna: hrZones(I.hrMax, I.hrRest, I.tetnoProgowe),
    tempaPlanu: planVdot ? { czasPlanu: fmtTime(goalTime), vdotPlanu: r1(planVdot), tempoProgowe: range(pacesFor(planVdot, I.tempoProgowe ? I.tempoProgowe * (vdot / planVdot) : undefined).tempo), interwal: range(pacesFor(planVdot).interval), startowe: fmtPace(goalPace) } : null,
    tempa: { regeneracyjne: range(P.recovery), latwe: range(P.easy), dlugieWybieganie: range(P.long), umiarkowane: range(P.moderate), tempo: range(P.tempo), progowe: range(P.tempo), interwal: range(P.interval), startowe: fmtPace(goalPace), sterowanie: daneSlabe ? "RPE i test rozmowy mają pierwszeństwo; zakresy tempa to orientacyjny szacunek" : "aktualny wynik; korekta dopiero po nowym teście", rpe: { regeneracja: "1–2", latwy: "2–3", dlugi: "3–4", tempo: "6–7", interwaly: "7–8", rytmy: "swobodnie, bez sprintu" }, pewnosc: daneSlabe ? "niska: zakresy poszerzone, bo brak wiarygodnego wyniku lub testu" : "umiarkowana lub wysoka", uwaga: "Tempa docelowego nie używa się na zwykłych treningach: pojawia się tylko w jednostkach w tempie startowym." },
    ostrzezenia: warnings,
  };
}

export function generatePlan(input) {
  if(!input || typeof input!=="object")return generateCore(input);
  const validation=validateInputDetailed(input);
  if(validation.bledy.length)return {ok:false,bledy:validation.bledy.map(e=>e.komunikat),bledySzczegoly:validation.bledy};
  const ledger=processActivityLedger({},input.executionObservations||input.completedHistory||[],input.today,{timeZone:input.timeZone||'UTC'});if(!ledger.ok)return ledger;
  const lastSymptom=latestSymptom(ledger.observations);
  const recentFatigue=ledger.observations.filter(o=>diffDays(o.date,input.today)<=14).slice(-3).reduce((m,o)=>Math.max(m,Number(o.fatigue)||0),0);
  const trainingInput={...input,...(lastSymptom?.pain>=3?{pain:Math.max(Number(input.pain)||0,lastSymptom.pain)}:{}),...(recentFatigue>=4?{fatigue:Math.max(Number(input.fatigue)||1,recentFatigue)}:{})};
  const planningInput=ledger.completedHistory.some(o=>o.date===input.today)?{...trainingInput,today:addDays(input.today,1)}:trainingInput;
  const result=generateCore(planningInput);if(!result.ok)return result;
  reconcileFinalAllocation(result,planningInput);
  result.plannedWorkouts=result.treningi;
  result.completedHistory=ledger.completedHistory;
  result.observedActivities=ledger.observations;
  result.adaptationDecisions=[];
  result.readinessEvidence=readinessEvidence({...input,currentWeeklyKm:result.indywidualizacja.bazaKm,longestRecentRun:result.indywidualizacja.najdluzszyKm},ledger.observations,input.executionCoverage||{});
  if(input.goal?.type==='marathon'){
    result.modelMaratonu.bazaDeklarowanaSpelniaKryteria=result.modelMaratonu.bazaPotwierdzona;
    result.modelMaratonu.bazaPotwierdzona=!!(result.readinessEvidence.gates.regularity.passed&&result.readinessEvidence.gates.volume.passed);
    result.modelMaratonu.etapy=result.readinessEvidence.plannedStages;
    result.modelMaratonu.bramki=result.readinessEvidence.gates;
    result.modelMaratonu.gotowoscDanych=result.readinessEvidence.status;
    result.modelMaratonu.zrodloPotwierdzenia=result.readinessEvidence.complete28Days?'wykonanie_pelnego_okna':input.recentWeeklyKm?.length>=4?'deklarowana_historia_tygodni':'deklarowana';
    if(result.readinessEvidence.status!=='potwierdzona_danymi' && result.gotowosc?.ok){
      result.gotowosc.planOsiagaKryteria=true;result.gotowosc.ok=false;result.gotowosc.status='przygotowanie_czesciowe';
      result.gotowosc.rozdzielenie.ukonczenieBezLimituCzasu=false;result.gotowosc.rozdzielenie.doKonkretnegoWyniku=false;result.gotowosc.rozdzielenie.etykieta='przygotowanie_czesciowe';
      if(result.ocenaCelu?.mozliwoscUkonczenia){result.ocenaCelu.mozliwoscUkonczenia.status='przygotowanie_warunkowe';result.ocenaCelu.mozliwoscUkonczenia.uzasadnienie.unshift('Brak potwierdzenia wykonaniem; harmonogram jest scenariuszem warunkowym.');}
      result.ostrzezenia.push('Gotowość maratońska pozostaje szacowana/warunkowa: zaplanowane szczyty nie są wykonaniem.');
    }
  }
  result.ocenaWykonalnosci={status:result.wykonalnosc.poziom==='niewykonalna'?'cel_niewykonalny':input.goal?.type==='marathon'&&result.readinessEvidence.status!=='potwierdzona_danymi'?'plan_warunkowy':result.wykonalnosc.poziom==='ograniczona'?'ograniczona_skutecznosc':'plan_mozliwy',gotowoscDanych:result.readinessEvidence.status,nieJestOcenaJakosciAlgorytmu:true};
  for(const t of result.treningi){
    for(const step of t.kroki||[])if(step.uwagi)step.uwagi=step.uwagi.replace(/Próba żywienia:.*?(?= $|$)/u,'').replace(/Bieg powyżej 75 min:.*$/u,'').trim();
    for(const step of t.kroki||[])if(step.tetno){step.zrodlo_tetna=intensityEvidence(input,ledger.observations).heartRate.source;if(step.zrodlo_tetna==='estimated')step.tetno=step.family==='interval'?'RPE i równe odcinki; HR narasta z opóźnieniem':'RPE / test rozmowy; tętno szacowane, nie zmierzona strefa bpm';}
    syncStructure(t,{recomputeTime:true});if(t.intensywnosc)t.intensywnosc.obciazenieStrukturalne=t.structuredDose.load;
    if(t.prescription)t.feedback=t.prescription.reason+' Przy wysokim RPE skróć; po pominięciu nie nadrabiaj; przy bólu przerwij.';
    t.opis=descr(t.kroki||[]);
    const guidance=supportGuidance(input,t);t.zaleceniaZywieniowe=guidance.nutrition;t.warunki=guidance.conditions;
    t.status='planned';
  }
  result.coherenceValidation=validateUnitCoherence(result.treningi);
  result.safetyValidation=validateSafety(input,result);
  result.weekReadiness={status:result.safetyValidation.critical?'niewykonalny_harmonogram':Number(trainingInput.fatigue)>=4?'ostrozny_powrot':'warunkowo_mozliwy',evidence:ledger.completedHistory.length?'wykonanie_i_deklaracje':'tylko_deklaracje',marathonReadinessIsSeparate:true,clinicalClearance:false};
  const phases=[...new Set(result.treningi.map(t=>t.faza_planu))];
  result.planningStages=[
    {stage:'profil_i_dane',validated:validation.bledy.length===0,observations:ledger.observations.length},
    {stage:'wykonalnosc_celu',validated:!!result.ocenaWykonalnosci,status:result.ocenaWykonalnosci.status},
    {stage:'budzet_wielowymiarowy',validated:result.safetyValidation.weekly.every(w=>Object.values(w).every(v=>typeof v!=='number'||Number.isFinite(v))),weeks:result.safetyValidation.weekly},
    {stage:'bodzce_i_kalendarz',validated:!result.safetyValidation.issues.some(x=>['UNAVAILABLE_DAY','HARD_DENSITY','DUPLICATE_DATE'].includes(x.code)),candidates:result.decyzjePlanera.wariantyTygodni},
    {stage:'progresja_i_taper',validated:phases.length>0,phases,conditionalOnExecution:true},
    {stage:'walidacja_twarda',validated:result.safetyValidation.critical===0},
    {stage:'wyjasnienia',validated:result.rejestrJakosci.every(x=>!!x.powodZastosowania),neverScoringObjective:true},
  ];
  result.stimulusLedger=result.rejestrJakosci.map((r,n,all)=>{
    const next=all.slice(n+1).find(x=>x.rodzaj===r.rodzaj);
    return {...r,physiologicalGoal:({tempo:'prog_i_wytrzymalosc',interwaly:'wydolnosc_tlenowa_i_ekonomia',tempo_startowe:'wytrzymalosc_specyficzna',test:'pomiar_formy'}[r.rodzaj]||'ekonomia'),difficulty:r.rpe,conditions:['Wykonanie poprzedniej porównywalnej sesji bez bólu.','Akceptowalne RPE i regeneracja; pominięcia nie są nadrabiane.'],nextStep:next?{date:next.data,workMinutes:next.pracaMin,workKm:next.pracaKm,conditional:true}:{status:'zakonczenie_lub_nowy_cykl',conditional:true}};
  });
  result.economyExposures=result.treningi.filter(t=>t.kroki.some(k=>k.etap==='Przebieżki'&&k.czas_odcinka_s)).map(t=>{const k=t.kroki.find(k=>k.etap==='Przebieżki');return {date:t.data,status:'planned',family:'strides',workMinutes:k.powtorzenia*k.czas_odcinka_s/60,repeatReason:'consolidation',includedInEasyDistance:true,evidence:comparableExposureState(ledger.completedHistory,input.today,'strides'),reason:'Krótka ekspozycja ekonomii w obrębie spokojnego biegu; potwierdzenie wykonania nie wymusza wzrostu dawki.'};});
  result.intensityEvidence=intensityEvidence(input,ledger.observations);
  result.familyProgression=Object.fromEntries(['threshold','interval','specific','hill','strides'].map(f=>[f,comparableExposureState(ledger.completedHistory,input.today,f)]));
  if(result.intensityEvidence.pace.source==='declared_undated'){result.tempa.pewnosc='niska: PB bez daty jest deklaracją, nie potwierdzeniem świeżej formy';result.tempa.sterowanie='RPE i rozmowa mają pierwszeństwo; potwierdź datę i aktualną tolerancję.';}
  if(result.coherenceValidation.critical||result.safetyValidation.critical)return {ok:false,bledy:['Nie znaleziono harmonogramu zgodnego z twardymi ograniczeniami.'],coherenceValidation:result.coherenceValidation,safetyValidation:result.safetyValidation,planningStages:result.planningStages,completedHistory:result.completedHistory,plannedWorkouts:[],treningi:[],proponowaneZmiany:['Zmień dostępność lub limity czasu; zachowaj ostrożny etap bazowy.']};
  return result;
}

export function updatePlan(input, previousPlan, observations=[], opts={}) {
  const validation=validateInputDetailed(input);
  if(validation.bledy.length)return {ok:false,bledy:validation.bledy.map(e=>e.komunikat)};
  return adaptWith(generatePlan,{vdotFrom,raceTimeFromVdot},input,previousPlan,observations,opts);
}

// ---------- przesunięcie, historia, przeplanowanie ----------
export function shiftPlan(treningi, days, { fixedRace = false } = {}) {
  if (fixedRace) return { ok: false, blad: "Przesunięcie niedozwolone przy zawodach o stałej dacie. Użyj przeliczenia planu." };
  return { ok: true, treningi: treningi.map((t) => ({ ...t, data: addDays(t.data, days) })) };
}
export function summarizeHistory(acts, today) {
  const list = (acts || []).filter((a) => a.date <= today).sort((a, b) => (a.date < b.date ? 1 : -1));
  const sumIn = (from, to) => list.filter((a) => a.date > from && a.date <= to).reduce((s, a) => s + (Number(a.distance_km) || 0), 0);
  const weeks = [0, 1, 2, 3].map((n) => sumIn(addDays(today, -7 * (n + 1)), addDays(today, -7 * n)));
  const longest = Math.max(0, ...list.filter((a) => a.date > addDays(today, -42)).map((a) => Number(a.distance_km) || 0));
  const fe = list.filter((a) => a.feeling).slice(0, 5).map((a) => a.feeling);
  const avgFeeling = fe.length ? fe.reduce((a, b) => a + b, 0) / fe.length : null;
  return {
    currentWeeklyKm: r1(weeks.reduce((a, b) => a + b, 0) / 4), longestRecentRun: r1(longest),
    daysSinceLastRun: list.length ? diffDays(list[0].date, today) : null,
    avgFeeling, przetrenowanie: fe.length >= 3 && avgFeeling <= 2,
  };
}
export function replan(input, acts, opts = {}) {
  const h = summarizeHistory(acts, input.today), w = [];
  let cur = h.currentWeeklyKm || input.currentWeeklyKm || 0, lng = h.longestRecentRun || input.longestRecentRun || 0;
  const gap = Math.max(h.daysSinceLastRun || 0, opts.missedDays || 0);
  if (gap >= 14) {
    const f = gap >= 28 ? 0.5 : 0.65; cur *= f; lng *= f;
    w.push(`Po przerwie (${gap} dni) wracamy z ok. ${Math.round(f * 100)}% dotychczasowej objętości.`);
  }
  if (h.przetrenowanie) { cur *= 0.85; w.push("Ostatnie treningi oceniasz jako ciężkie (1-2/5), dlatego zaczynamy lżej."); }
  const res = generatePlan({ ...input, currentWeeklyKm: r1(cur), longestRecentRun: r1(lng) });
  if (res.ok) { res.plan.tryb = "przeliczenie"; res.ostrzezenia.unshift(...w); }
  return res;
}


// ====================================================================
// ANALIZA DANYCH UŻYTKOWNIKA I GENEROWANIE PLANU Z HISTORII
// ====================================================================
const median = (a) => { const t = [...a].sort((x, y) => x - y), m = Math.floor(t.length / 2); return t.length ? (t.length % 2 ? t[m] : (t[m - 1] + t[m]) / 2) : null; };
const typeByDist = (km) => (km < 7 ? "5k" : km < 15 ? "10k" : km < 32 ? "half" : "marathon");
const typeFromKm = (km) => [[5, "5k"], [10, "10k"], [21.0975, "half"], [42.195, "marathon"]].find(([d]) => Math.abs(km - d) / d < 0.06)?.[1] || null;

// acts: [{date, distance_km, duration_min, avg_hr?, max_hr?, feeling?, isRace?, isTest?}]
export function analyzeHistory(acts, today, prof = {}) {
  const list = (acts || []).filter((a) => a.date <= today && Number(a.distance_km) > 0 && Number(a.duration_min) > 0).sort((a, b) => (a.date < b.date ? 1 : -1));
  const inWeek = (n) => list.filter((a) => a.date > addDays(today, -7 * (n + 1)) && a.date <= addDays(today, -7 * n));
  const weeksKm = [...Array(12).keys()].map((n) => r1(inWeek(n).reduce((s, a) => s + Number(a.distance_km), 0)));
  const w = [4, 3, 2, 1];
  const currentWeeklyKm = r1(weeksKm.slice(0, 4).reduce((s, v, i) => s + v * w[i], 0) / 10);
  const consistency = [...Array(8).keys()].filter((n) => inWeek(n).length >= 2).length / 8;
  const longest = Math.max(0, ...list.filter((a) => a.date > addDays(today, -42)).map((a) => Number(a.distance_km)));
  const hrMaxUsed = prof.hrMax || Math.round(208 - 0.7 * (prof.age || 35));
  const zones = hrZones(hrMaxUsed, prof.hrRest, prof.tetnoProgowe);
  const pace = (a) => (a.duration_min * 60) / a.distance_km;
  const isQuality = (a) => a.typ === "Tempo" || a.typ === "Interwały" || a.typ === "Interwały";
  const easyRuns = list.filter((a) => !isQuality(a) && !a.main && a.avg_hr && a.avg_hr >= zones[0].od && a.avg_hr <= zones[1].do + 3 && a.distance_km >= 3).slice(0, 16);
  const observedEasyPace = easyRuns.length >= 3 ? Math.round(median(easyRuns.map(pace))) : null;
  let efficiencyTrend = null;
  if (easyRuns.length >= 6) {
    const idx = (a) => 60000 / pace(a) / a.avg_hr, h = Math.floor(easyRuns.length / 2);
    const mean = (x) => x.reduce((s, a) => s + idx(a), 0) / x.length;
    efficiencyTrend = r1((mean(easyRuns.slice(0, h)) / mean(easyRuns.slice(h)) - 1) * 100); // % (dodatni = poprawa)
  }
  const maxHrs = list.map((a) => Number(a.max_hr) || 0);
  const fe = list.filter((a) => a.feeling).slice(0, 5).map((a) => a.feeling);
  const avgFeeling = fe.length ? r1(fe.reduce((a, b) => a + b, 0) / fe.length) : null;
  const efforts = list.filter((a) => !a.main && (a.isRace || a.isTest || (a.distance_km >= 3 && a.distance_km <= 45 && a.avg_hr && a.avg_hr >= 0.9 * hrMaxUsed)))
    .map((a) => ({ distanceKm: Number(a.distance_km), timeSec: Math.round(a.duration_min * 60), avgHr: a.avg_hr, date: a.date, isRace: !!(a.isRace || a.isTest), zrodlo: a.isRace ? "zawody" : a.isTest ? "test" : "bieg intensywny" }));
  for (const a of list) {
    const m0 = a.main;
    if ((a.isTest || a.isRace) && m0 && m0.distance_km > 0 && m0.duration_min > 0) efforts.push({ distanceKm: Number(m0.distance_km), timeSec: Math.round(m0.duration_min * 60), avgHr: m0.avg_hr, date: a.date, isRace: true, zrodlo: a.isRace ? "zawody" : "test formy" });
  }
  for (const a of list) {
    const m = a.main;
    if (!m || !(m.distance_km > 0) || !(m.duration_min > 0) || !isQuality(a)) continue;
    const intervals = a.typ === "Interwały";
    if (m.duration_min < (intervals ? 6 : 12)) continue;
    if (m.avg_hr && m.avg_hr > 0.97 * hrMaxUsed) continue;
    const v = (m.distance_km * 1000) / m.duration_min, vo2 = -4.6 + 0.182258 * v + 0.000104 * v * v;
    efforts.push({ vdotDirect: vo2 / (intervals ? 0.97 : 0.88), distanceKm: Number(m.distance_km), timeSec: Math.round(m.duration_min * 60), avgHr: m.avg_hr, date: a.date, isRace: false, zrodlo: "część główna (" + (intervals ? "interwały" : "tempo") + ")" });
  }
  return {
    liczbaTreningow: list.length, tygodnieKm: weeksKm, currentWeeklyKm, longestRecentRun: r1(longest), regularnosc8tyg: r1(consistency * 100) + "%",
    srednieOdczucie: avgFeeling, przetrenowanie: fe.length >= 3 && avgFeeling <= 2, dniOdOstatniegoBiegu: list.length ? diffDays(list[0].date, today) : null,
    obserwowaneTempoSpokojne: observedEasyPace, trendEfektywnosciProc: efficiencyTrend, maxTetnoZObserwacji: Math.max(0, ...maxHrs) || null, wysilki: efforts, _consistency: consistency,
  };
}

function pickBest(cands, hrMax, today) {
  const list = [];
  for (const c of cands) {
    if (!(c.distanceKm >= 1.5 && c.timeSec > 0)) continue;
    let v = c.vdotDirect || vdotFrom(c.distanceKm * 1000, c.timeSec); const notes = [];
    let w = 1;
    if (c.isRace === false) { v *= 0.96; w = 0.6; }
    if (c.avgHr && hrMax && c.isRace !== false) {
      const exp = { "5k": 0.94, "10k": 0.92, half: 0.89, marathon: 0.86 }[typeByDist(c.distanceKm)], ratio = c.avgHr / hrMax;
      if (ratio < exp - 0.06) { v *= 1 + Math.min(0.03, (exp - 0.06 - ratio) * 0.5); notes.push("wynik uzyskany przy niskim tętnie, forma może być wyższa"); }
    }
    if (c.date) {
      const months = diffDays(c.date, today) / 30;
      if (months > 3) { v *= 1 - Math.min(0.08, (months - 3) * 0.006); notes.push(`wynik sprzed ${Math.round(months)} mies., wartość obniżona`); }
    }
    list.push({ distanceKm: c.distanceKm, timeSec: c.timeSec, vdot: v, w, avgHr: c.avgHr, data: c.date, zrodlo: c.zrodlo || "wynik", notes });
  }
  if (!list.length) return null;
  list.sort((a, b) => b.vdot - a.vdot);
  const top = list.slice(0, 3), sw = top.reduce((a, x) => a + x.w, 0);
  const blended = top.reduce((a, x) => a + x.vdot * x.w, 0) / sw;
  return { ...top[0], vdot: blended, wartoscNajlepszegoWyniku: top[0].vdot, uzytoWynikow: top.length, notes: top.length > 1 ? [...top[0].notes, `forma uśredniona z ${top.length} najlepszych wyników (strefy nie opierają się na jednym rekordzie)`] : top[0].notes };
}

// profile: dane z profilu; data: {results:[{distanceKm,timeSec,avgHr?,date?}], activities:[...], races:[{name,date,distanceKm,targetTimeSec?}], today}
export function buildInput(profile, data = {}, opts = {}) {
  const today = data.today || profile.today, notes = [];
  const h = analyzeHistory(data.activities || [], today, profile);
  const hrMax = Math.max(profile.hrMax || 0, h.maxTetnoZObserwacji || 0) || undefined;
  const hrForCalc = hrMax || Math.round(208 - 0.7 * (profile.age || 35));
  const cands = [...(data.results || []).map((r) => ({ ...r, isRace: r.isRace !== false, zrodlo: "wynik" })), ...h.wysilki];
  const best = pickBest(cands, hrForCalc, today);

  let cur = h.liczbaTreningow ? h.currentWeeklyKm : profile.currentWeeklyKm || 0;
  let lng = h.liczbaTreningow ? h.longestRecentRun : profile.longestRecentRun || 0;
  const cut = (f, why) => { cur *= f; lng *= f; notes.push(why); };
  const gap = Math.max(h.dniOdOstatniegoBiegu || 0, opts.missedDays || 0);
  if (gap >= 14) cut(gap >= 28 ? 0.5 : 0.65, `Po przerwie (${gap} dni) wracamy z mniejszą objętością.`);
  if (h.liczbaTreningow >= 6 && h._consistency < 0.5) cut(0.85, "Niska regularność ostatnich 8 tygodni, startujemy ostrożniej.");
  if (h.trendEfektywnosciProc != null && h.trendEfektywnosciProc <= -4) cut(0.9, "Efektywność biegu (tempo przy tym samym tętnie) spadła, możliwe zmęczenie, startujemy lżej.");
  if (h.przetrenowanie) cut(0.85, "Ostatnie treningi oceniasz jako ciężkie (1-2/5), zaczynamy lżej.");
  if (h.trendEfektywnosciProc != null && h.trendEfektywnosciProc >= 4) notes.push("Twoja efektywność biegu rośnie (niższe tętno przy tym samym tempie), dobra forma.");

  const level = profile.level || ((best && best.vdot >= 50) || cur >= 50 ? "advanced" : (best && best.vdot >= 38) || cur >= 20 ? "intermediate" : "beginner");

  let goal = profile.goal, extraRaces = [];
  const upcoming = (data.races || []).filter((r) => r.date > today && r.distanceKm > 0).sort((a, b) => (a.date < b.date ? -1 : 1));
  if (!goal || !goal.raceDate) {
    const known = upcoming.filter((r) => typeFromKm(r.distanceKm));
    const near = known.filter((r) => diffDays(today, r.date) <= 210);
    const A = known.find((r) => r.priority === "A") || near[near.length - 1] || known[0];
    if (A) {
      goal = { ...(goal || {}), type: typeFromKm(A.distanceKm), raceDate: A.date, raceName: A.name, targetTimeSec: A.targetTimeSec || (goal && goal.targetTimeSec) };
      extraRaces = upcoming.filter((r) => r !== A && r.date < A.date);
      if (upcoming.some((r) => r !== A && r.date > A.date)) notes.push("Starty po starcie głównym nie są uwzględnione w tym planie. Po starcie głównym wygeneruj nowy plan.");
    } else extraRaces = upcoming;
  } else extraRaces = upcoming.filter((r) => r.date < goal.raceDate);
  const cnt = {}, done = {}, dayRel = {};
  for (const w of data.workouts || []) {
    if (w.date > today || w.date <= addDays(today, -70) || !["done", "missed", "skipped"].includes(w.status)) continue;
    const d = dowOf(w.date); cnt[d] = (cnt[d] || 0) + 1; if (w.status === "done") done[d] = (done[d] || 0) + 1;
  }
  for (const d of Object.keys(cnt)) if (cnt[d] >= 3) dayRel[d] = (done[d] || 0) / cnt[d];
  const worst = Object.entries(dayRel).filter(([d, v]) => v < 0.5 && (profile.availableDays || []).includes(Number(d)));
  if (worst.length && (profile.availableDays || []).length > (profile.daysPerWeek || 3)) notes.push(`Dni, w które wcześniej często opuszczałeś treningi (${worst.map(([d]) => DAYNAMES_PL[d]).join(", ")}), dostały niższy priorytet przy układaniu planu.`);
  const fb = feedbackDecision(data.feedback);
  if (fb.wspolczynnikObjetosci > 0 && fb.wspolczynnikObjetosci < 1) cut(fb.wspolczynnikObjetosci, `Sprzężenie zwrotne: ${fb.akcja}.`);
  const passKeys = ["debugTrace","controlTests","seasonContext","executionObservations","conditions","nutrition","timeZone","completedHistory","executionCoverage","volumeTolerance","intensityTolerance","fatigue","preferredDays","recoveryDays","loadTolerance","longDistanceRaces","hrMaxSource","qualityNotBefore","recentWeeklyKm", "experienceMonths", "breakDays", "crossTreningi", "trybScisly", "activeInjury", "pain", "tetnoProgowe", "tempoProgowe", "vo2max", "hrv", "maxMinutesWeekday", "maxMinutesWeekend", "rozgrzewkaKm", "schlodzenieKm", "historiaKontuzji", "importFit"];
  const input = {
    ...Object.fromEntries(passKeys.filter((k) => profile[k] !== undefined).map((k) => [k, profile[k]])),
    liczbaTreningowHistorii: h.liczbaTreningow || undefined, liczbaWynikow: (data.results || []).length, liczbaFeedback: (data.feedback || []).length, poziomWywnioskowany: !profile.level,
    dayReliability: Object.keys(dayRel).length ? dayRel : undefined, silaTreningi: profile.silaTreningi, podbiegi: profile.podbiegi,
    today, age: profile.age, sex: profile.sex, weightKg: profile.weightKg, heightCm: profile.heightCm, hrMax, hrRest: profile.hrRest,
    level, availableDays: profile.availableDays, daysPerWeek: profile.daysPerWeek, maxMinutes: profile.maxMinutes, maxLongMinutes: profile.maxLongMinutes,
    longRunDow: profile.longRunDow, injuries: profile.injuries, weeks: profile.weeks, goal: goal || { type: "health" }, extraRaces: extraRaces.map((r) => ({ date: r.date, distanceKm: r.distanceKm, name: r.name, priority: r.priority, targetTimeSec: r.targetTimeSec })), bezProgresji: profile.bezProgresji,
    currentWeeklyKm: r1(cur), longestRecentRun: r1(lng),
    bestResult: best ? { distanceKm: best.distanceKm, timeSec: best.timeSec, avgHr: best.avgHr } : profile.bestResult,
    vdotOverride: best ? best.vdot : undefined, vdotSource: best ? `${best.zrodlo} ${r1(best.distanceKm)} km w ${fmtTime(best.timeSec)}${best.data ? " (" + best.data + ")" : ""}${best.notes.length ? ", " + best.notes.join("; ") : ""}` : undefined,
    observedEasyPace: h.obserwowaneTempoSpokojne || undefined,
  };
  if (best) best.notes.forEach((n) => notes.push("Najlepszy wynik: " + n + "."));
  const { _consistency, wysilki, ...analiza } = h;
  return { input, feedback: fb, analiza: { ...analiza, decyzjaSprzezeniaZwrotnego: fb, najlepszyWynik: best ? { ...best, vdot: r1(best.vdot) } : null, poziomUzyty: level }, uwagi: notes };
}

// Główny punkt wejścia dla endpointu: profil + dane z bazy -> plan.
export function generateFromData(profile, data = {}, opts = {}) {
  if (data.zgloszenie) {
    const sz = sprawdzBezpieczenstwo(data.zgloszenie);
    if (sz.poziom === "pilne" || sz.poziom === "przerwij") return { ok: false, bledy: [sz.komunikat], bezpieczenstwo: sz };
  }
  const b = buildInput(profile, data, opts);
  if (b.feedback && (b.feedback.poziom === "pilne" || b.feedback.poziom === "przerwij")) return { ok: false, bledy: b.feedback.uzasadnienie, bezpieczenstwo: b.feedback.bezpieczenstwo, analiza: b.analiza };
  const res = generatePlan(b.input);
  if (res.ok) {
    if (opts.replan) res.plan.tryb = "przeliczenie";
    res.ostrzezenia.unshift(...b.uwagi);
    res.analiza = b.analiza;
  } else res.analiza = b.analiza;
  return res;
}


// ====================================================================
// KONTROLA JAKOŚCI PLANU (działa też na planie po ręcznych zmianach)
// ====================================================================
const paceMid = (str) => { const m = String(str || "").match(/(\d+):(\d{2})(?:-(\d+):(\d{2}))?/); if (!m) return null; const a = +m[1] * 60 + +m[2]; return m[3] ? (a + +m[3] * 60 + +m[4]) / 2 : a; };
const stepMin = (st) => (st.czas_min != null ? st.czas_min : st.powtorzenia ? ((st.powtorzenia * st.dystans_m) / 1000 * (paceMid(st.tempo) || 0)) / 60 : st.dystans_km != null ? (st.dystans_km * (paceMid(st.tempo) || 0)) / 60 : 0);

export const KODY_BLEDOW = {
  DANE_BRAK: ["krytyczny", "Brakujące lub nieprawidłowe dane treningu"],
  DOSTEPNOSC_DNI: ["krytyczny", "Trening w dniu niedostępnym dla użytkownika"],
  LIMIT_CZASU: ["krytyczny", "Trening dłuższy niż limit czasu dnia"],
  SUMA_DYSTANSU_KROKI: ["krytyczny", "Suma kroków treningu różni się od dystansu treningu"],
  DWA_MOCNE_POD_RZAD: ["krytyczny", "Dwa mocne treningi w kolejnych dniach"],
  SKOK_KILOMETRAZU: ["krytyczny", "Zbyt duży skok tygodniowego kilometrażu"],
  START_SKOK: ["krytyczny", "Pierwszy pełny tydzień znacznie przekracza dotychczasowy kilometraż"],
  DLUGI_WZROST: ["krytyczny", "Długi bieg rośnie zbyt szybko"],
  AKCENTY_LICZBA: ["krytyczny", "Za dużo akcentów względem liczby dni biegowych"],
  TAPER_BRAK_SPADKU: ["krytyczny", "Tapering nie zmniejsza obciążenia"],
  TAPER_DLUGI: ["krytyczny", "Długi bieg w taperingu prawie tak długi jak szczyt planu"],
  TYDZIEN_STARTOWY_DUZY: ["krytyczny", "Tydzień startowy zbyt obciążający"],
  PO_ZAWODACH: ["krytyczny", "Trening zaplanowany po dacie zawodów"],
  CZESTOTLIWOSC_POZIOM: ["krytyczny", "Liczba biegów w tygodniu ponad możliwości poziomu zawodnika"],
  BRAK_DNIA_ODPOCZYNKU: ["ostrzezenie", "Tydzień bez dnia bez biegania"],
  SPADEK_KILOMETRAZU: ["ostrzezenie", "Nieuzasadniony spadek kilometrażu między zwykłymi tygodniami"],
  ODCIAZENIE_NIESKUTECZNE: ["ostrzezenie", "Tydzień odciążający nie zmniejsza obciążenia"],
  BRAK_ODBUDOWY: ["ostrzezenie", "Kilometraż nie wraca po tygodniu odciążającym"],
  BRAK_ODBUDOWY_LIMIT_CZASU: ["sugestia", "Kilometraż po odciążeniu nie wraca w pełni: ogranicza go limit czasu użytkownika"],
  DLUGI_UDZIAL: ["ostrzezenie", "Długi bieg stanowi zbyt duży udział tygodnia"],
  DLUGI_SPADEK: ["ostrzezenie", "Długi bieg skraca się poza tygodniem odciążającym/taperem"],
  DLUGI_SZCZYT: ["ostrzezenie", "Szczyt długiego biegu zbyt blisko startu"],
  DLUGI_DOSWIADCZENIE: ["ostrzezenie", "Długi bieg bardzo duży względem dotychczasowego doświadczenia"],
  DLUGI_PO_JAKOSCI: ["ostrzezenie", "Długi bieg tuż obok treningu jakościowego"],
  REGENERACJA_PO_DLUGIM: ["ostrzezenie", "Brak regeneracji po bardzo długim biegu"],
  CEL_DLUGI_ZA_KROTKI: ["ostrzezenie", "Najdłuższy bieg planu niezgodny z celem"],
  AKCENTY_ODSTEP: ["ostrzezenie", "Zbyt krótki odstęp między akcentami"],
  UDZIAL_MOCNYCH: ["ostrzezenie", "Zbyt duży udział mocnych treningów"],
  ZA_KROTKI_BIEG: ["ostrzezenie", "Bieg krótszy niż sensowne minimum"],
  REGENERACJA_ZA_DLUGA: ["ostrzezenie", "Bieg regeneracyjny za długi jak na lekką regenerację (limit zależny od poziomu)"],
  DLUGA_PRZERWA: ["ostrzezenie", "Zbyt długa przerwa między biegami mimo dostępnych dni"],
  DLUGA_PRZERWA_DOSTEPNOSC: ["sugestia", "Długa przerwa między biegami wynika z dostępności dni użytkownika"],
  CZESTOTLIWOSC_NIE_OSIAGNIETA: ["ostrzezenie", "Plan nie osiąga deklarowanej liczby biegów"],
  TAPER_ZA_GLEBOKI: ["ostrzezenie", "Tapering obcina objętość głębiej niż potrzeba"],
  TAPER_BEZ_BODZCOW: ["sugestia", "W taperingu brak krótkich bodźców intensywności"],
  SUGESTIA_UZUPELNIAJACY: ["sugestia", "Przy małej liczbie biegów warto dodać trening uzupełniający"],
  SUGESTIA_DANE: ["sugestia", "Brakuje danych do dokładniejszej oceny"],
};
const MOCNE_PODTYPY = ["tempo", "interwaly", "podbiegi", "tempo_startowe", "test"]; // pełne akcenty (bez „ostrzenia” i startu)
const LEVEL_RUN_LIMIT = { beginner: 4, intermediate: 5, advanced: 6 };
const LONG_HIST_REQ = { "5k": 0, "10k": 8, half: 12, marathon: 18 };

// Audyt planu (działa także na planie po ręcznych zmianach). Każdy problem ma kod, poziom, opis, tydzień/trening i propozycję naprawy.
// opts: raceDate, raceDistanceKm, goalType, level, daysPerWeek, declaredDays, availableDays, maxMinutesWd, maxMinutesWe,
//       minEasy, startDate (pierwszy dzień planu: tydzień zaczęty wcześniej jest niepełny), currentWeeklyKm, longestRecentRun
export function auditPlan(tr, opts = {}) {
  const trs = tr || [];
  const issues = [];
  const add = (kod, opis, o = {}) => issues.push({ kod, poziom: KODY_BLEDOW[kod][0], opis, tydzien: o.tydzien ?? null, data: o.data ?? null, trening: o.trening ?? null, naprawa: o.naprawa ?? null, dane: o.dane ?? null });
  const wk = new Map();
  for (const t of trs) {
    if (!t || typeof t.data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(t.data) || isNaN(Date.parse(t.data))) { add("DANE_BRAK", `Trening bez poprawnej daty (${t && t.data})`, { naprawa: "Popraw lub usuń trening z niepoprawną datą." }); continue; }
    const k = mondayOf(t.data); if (!wk.has(k)) wk.set(k, []); wk.get(k).push(t);
  }
  const keys = [...wk.keys()].sort(), kms = [], runsCnt = [];
  const startDates = trs.filter((t) => t.podtyp === "start").map((t) => t.data);
  const isRun = (t) => !AUX.includes(t.podtyp);
  const HARD = (t) => isRun(t) && (t.typ === "Tempo" || t.typ === "Interwały" || t.typ === "Test" || t.typ === "Start" || t.typ === "Długi bieg") && t.podtyp !== "ostrzenie";
  const wnum = (k) => keys.indexOf(k) + 1;
  const raceDate = opts.raceDate || null;
  const isRaceWeekKey = (k) => !!(raceDate && raceDate >= k && raceDate < addDays(k, 7));
  const limitFor = (d) => (dowOf(d) === 0 || dowOf(d) === 6 ? opts.maxMinutesWe : opts.maxMinutesWd);
  let total = 0, hard = 0, longest = 0, maxInc = 0;

  // --- kontrola pojedynczych treningów: dane, dostępność, limity czasu, spójność dystansu
  for (const t of trs) {
    if (!t || !wk.has(mondayOf(t.data || "1970-01-01"))) continue;
    const bad = !t.typ || !t.podtyp || !Number.isFinite(Number(t.dystans_km)) || Number(t.dystans_km) < 0 || !Number.isFinite(Number(t.czas_min)) || Number(t.czas_min) < 0 || (isRun(t) && !(Number(t.dystans_km) > 0));
    if (bad) { add("DANE_BRAK", `Trening ${t.data} ma brakujące lub nieprawidłowe dane (typ/dystans/czas)`, { data: t.data, trening: t.podtyp || t.typ || null, naprawa: "Uzupełnij typ, dystans i czas treningu albo usuń go z planu." }); continue; }
    if (raceDate && t.data >= raceDate && t.podtyp !== "start") add("PO_ZAWODACH", `Trening ${t.data} jest w dniu zawodów lub po nich (${raceDate})`, { data: t.data, trening: t.podtyp, naprawa: "Usuń trening po starcie; regeneracja po zawodach jest osobnym planem." });
    if (Array.isArray(opts.availableDays) && !opts.availableDays.includes(dowOf(t.data))) add("DOSTEPNOSC_DNI", `Trening ${t.data} wypada poza zadeklarowanymi dniami dostępności (${DAYNAMES_PL[dowOf(t.data)]}).`, { data: t.data, trening: t.podtyp, naprawa: "Przenieś trening na dzień dostępny (bez sąsiedztwa z mocnym treningiem) albo usuń go, jeśli to jednostka uzupełniająca." });
    const lim = limitFor(t.data);
    if (Number.isFinite(lim) && Number(t.czas_min) > lim) add("LIMIT_CZASU", `Trening ${t.data} trwa ${t.czas_min} min i przekracza limit ${lim} min o ${r1(t.czas_min - lim)} min.`, { data: t.data, trening: t.podtyp, dane: { limit: lim, czas: t.czas_min }, naprawa: "Skróć część główną (bez skracania rozgrzewki i schłodzenia) albo zamień jednostkę jakościową na krótszy bieg spokojny." });
    if (isRun(t) && t.podtyp !== "marszobieg") {
      const sum = (t.kroki || []).reduce((a, st) => a + (st.dystans_km || 0) + (st.powtorzenia && st.dystans_m ? st.powtorzenia * st.dystans_m / 1000 + (st.liczba_przerw ?? st.powtorzenia) * (st.przerwa_km || 0) : 0), 0);
      if (sum > 0 && Math.abs(sum - t.dystans_km) > 0.4) add("SUMA_DYSTANSU_KROKI", `Niespójny dystans treningu ${t.data} (${t.podtyp}): kroki ${r1(sum)} km, razem ${t.dystans_km} km`, { data: t.data, trening: t.podtyp, dane: { kroki: r1(sum) }, naprawa: "Ustaw dystans treningu równy sumie kroków albo popraw kroki." });
    }
    // v21: bieg regeneracyjny ma limit czasu zależny od poziomu (nie jest zwykłym biegiem spokojnym pod inną nazwą)
    if (isRun(t) && t.podtyp === "regeneracja" && !(raceDate && diffDays(t.data, raceDate) >= 0 && diffDays(t.data, raceDate) <= 1)) {
      const recLim = { beginner: 35, intermediate: 45, advanced: 60 }[opts.level] || 45;
      if (Number(t.czas_min) > recLim) add("REGENERACJA_ZA_DLUGA", `Bieg regeneracyjny ${t.data} trwa ${t.czas_min} min (limit dla poziomu ${opts.level || "?"}: ${recLim} min).`, { data: t.data, trening: t.podtyp, dane: { limit: recLim, czas: t.czas_min }, naprawa: "Skróć bieg regeneracyjny albo oznacz go jako zwykły bieg spokojny Z2 i dopasuj tempo." });
    }
    if (isRun(t) && opts.minEasy && (t.podtyp === "latwy" || t.podtyp === "regeneracja") && !t.dodatkowy && t.dystans_km + 1e-9 < (t.podtyp === "regeneracja" ? Math.min(opts.minEasy, 3) : opts.minEasy)) {
      const dr = raceDate ? diffDays(t.data, raceDate) : null;
      if (!(dr != null && dr >= 0 && dr < 7) && !startDates.some((d) => Math.abs(diffDays(t.data, d)) <= 3) && !(opts.limitCzasuMin && t.czas_min >= opts.limitCzasuMin * 0.9)) add("ZA_KROTKI_BIEG", `Za krótki bieg ${t.data}: ${t.dystans_km} km (minimum ${opts.minEasy} km)`, { data: t.data, trening: t.podtyp, naprawa: "Wydłuż bieg do minimum albo połącz go z innym treningiem." });
    }
  }

  // --- kontrola tygodni
  const infoWeek = {};
  keys.forEach((k, i) => {
    const all = wk.get(k).slice().sort((a, b) => (a.data < b.data ? -1 : 1));
    const runsW = all.filter(isRun).filter((t) => Number.isFinite(Number(t.dystans_km)));
    const raceKm = isRaceWeekKey(k) && opts.raceDistanceKm ? opts.raceDistanceKm : 0;
    const km = r1(all.reduce((a, t) => a + (Number(t.dystans_km) || 0), 0) + raceKm);
    kms.push(km); runsCnt.push(runsW.length);
    const runDays = new Set(runsW.map((t) => dowOf(t.data)));
    const partial = opts.startDate ? k < opts.startDate : i === 0; // bez daty startu pierwszy tydzień traktujemy ostrożnie jako niepełny
    const isTaperWeek = all.some((t) => t.faza_planu === "taper");
    const hasTestOrStart = all.some((t) => t.podtyp === "test" || t.podtyp === "start");
    const rw = all.some((t) => t.odciazenie);
    const marsz = all.some((t) => t.podtyp === "marszobieg");
    infoWeek[k] = { km, partial, isTaperWeek, rw, hasTestOrStart, marsz, runs: runsW.length, runDays: runDays.size };
    if (runDays.size === 7) add("BRAK_DNIA_ODPOCZYNKU", `Brak pełnego dnia bez biegania w tygodniu od ${k}; przy 7 dniach biegania regeneracja jest ograniczona. Rozważ 6 biegów i 1 dzień odpoczynku lub treningu uzupełniającego bez biegania${opts.level ? ` (poziom: ${opts.level})` : ""}.`, { tydzien: wnum(k), data: k, naprawa: "Zamień jeden bieg na dzień wolny lub trening uzupełniający bez biegania." });
    const lvlLim = Number(opts.levelRunLimit) > 0 ? Number(opts.levelRunLimit) : LEVEL_RUN_LIMIT[opts.level]; // v18-P6
    if (lvlLim && runDays.size > lvlLim + (opts.level === "advanced" ? 0 : 0) && !runsW.some((t) => t.podtyp === "start")) add("CZESTOTLIWOSC_POZIOM", `W tygodniu od ${k} jest ${runDays.size} dni biegowych, a limit dla poziomu ${opts.level} to ${lvlLim}.`, { tydzien: wnum(k), data: k, dane: { limit: lvlLim }, naprawa: "Usuń najkrótszy bieg spokojny z tego tygodnia." });
    // mocne treningi
    for (const a of runsW) for (const b of runsW) {
      if (diffDays(a.data, b.data) === 1 && HARD(a) && HARD(b)) add("DWA_MOCNE_POD_RZAD", `Dwa mocne treningi dzień po dniu: ${a.data} (${a.typ}) i ${b.data} (${b.typ})`, { tydzien: wnum(k), data: b.data, trening: b.podtyp, naprawa: "Zamień mocniejszy z dwóch treningów jakościowych na bieg spokojny (długi bieg zostaje)." });
    }
    for (const t of runsW) {
      if (t.typ === "Długi bieg") longest = Math.max(longest, t.dystans_km);
      for (const st of t.kroki || []) { const m = stepMin(st); total += m; if (/Z[345]/.test(st.tetno || "")) hard += m; }
    }
    if (!partial && !isTaperWeek && !isRaceWeekKey(k)) {
      const q = runsW.filter((t) => MOCNE_PODTYPY.includes(t.podtyp) && t.podtyp !== "test");
      const lg = runsW.filter((t) => t.podtyp === "dlugi");
      const days = runDays.size;
      const multiOk = opts.level !== "beginner" && (opts.daysPerWeek || days) >= 5 && (opts.goalType === "5k" || opts.goalType === "10k");
      const qLim = multiOk ? 2 : 1;
      const hardN = q.length + lg.length, hLim = days <= 1 ? 1 : days <= 3 ? 2 : 3;
      if (q.length > qLim) add("AKCENTY_LICZBA", `W tygodniu od ${k} jest ${q.length} treningów jakościowych (limit dla tego planu: ${qLim}).`, { tydzien: wnum(k), data: k, naprawa: "Zamień nadmiarowy trening jakościowy na bieg spokojny." });
      else if (hardN > hLim) add("AKCENTY_LICZBA", `W tygodniu od ${k} jest ${hardN} mocnych jednostek (akcenty i długi bieg) przy ${days} dniach biegania (limit ${hLim}).`, { tydzien: wnum(k), data: k, naprawa: "Zamień jeden akcent na bieg spokojny." });
      if (days >= 4) for (const x of q) for (const l of lg) if (Math.abs(diffDays(x.data, l.data)) === 1 && !(x.data < l.data ? false : false)) add("DLUGI_PO_JAKOSCI", `Trening jakościowy (${x.data}) sąsiaduje z długim biegiem (${l.data}) w tygodniu od ${k}.`, { tydzien: wnum(k), data: x.data, naprawa: "Przesuń akcent na dzień co najmniej 2 dni od długiego biegu." });
      for (let a = 0; a < q.length; a++) for (let b = a + 1; b < q.length; b++) if (diffDays(q[a].data, q[b].data) < 2 && diffDays(q[a].data, q[b].data) > 0 && !issues.some((x) => x.kod === "DWA_MOCNE_POD_RZAD" && x.data === q[b].data)) add("AKCENTY_ODSTEP", `Akcenty ${q[a].data} i ${q[b].data} dzieli mniej niż 2 dni.`, { tydzien: wnum(k), data: q[b].data, naprawa: "Zachowaj co najmniej jeden dzień spokojnego biegu lub odpoczynku między akcentami." });
    }
    // regeneracja po bardzo długim biegu
    for (const l of runsW.filter((t) => t.podtyp === "dlugi" && t.dystans_km >= 18)) {
      const nxt = (wk.get(mondayOf(addDays(l.data, 1))) || []).filter(isRun).find((t) => t.data === addDays(l.data, 1));
      if (nxt && !(nxt.podtyp === "regeneracja" || (nxt.podtyp === "latwy" && nxt.dystans_km <= l.dystans_km * 0.5))) add("REGENERACJA_PO_DLUGIM", `Po długim biegu ${l.data} (${l.dystans_km} km) następnego dnia jest ${nxt.typ} ${nxt.dystans_km} km.`, { tydzien: wnum(k), data: nxt.data, naprawa: "Dzień po bardzo długim biegu zaplanuj odpoczynek albo krótki bieg regeneracyjny." });
    }
  });

  // --- v21: długie przerwy między biegami (plany 3+ dni; poza tygodniami odciążającymi i okolicą startu)
  if ((Number(opts.daysPerWeek) || 0) >= 3) {
    const runDatesAll = trs.filter((t) => t && typeof t.data === "string" && isRun(t) && t.podtyp !== "marszobieg").map((t) => t.data).sort();
    const recMons = new Set(trs.filter((t) => t && t.odciazenie && t.data).map((t) => mondayOf(t.data)));
    const hasAvail = Array.isArray(opts.availableDays) && opts.availableDays.length > 0;
    for (let i = 1; i < runDatesAll.length; i++) {
      const a = runDatesAll[i - 1], b = runDatesAll[i], gap = diffDays(a, b);
      if (gap <= 4 || (raceDate && diffDays(b, raceDate) <= 10) || recMons.has(mondayOf(a)) || recMons.has(mondayOf(b))) continue;
      const between = hasAvail ? Array.from({ length: gap - 1 }, (_, j) => addDays(a, j + 1)).filter((d) => opts.availableDays.includes(dowOf(d)) && Math.max(diffDays(a, d), diffDays(d, b)) <= gap - 2) : [1]; // dzień pomaga tylko, jeśli realnie skraca przerwę o co najmniej 2 dni
      if (between.length && gap >= 6) add("DLUGA_PRZERWA", `Przerwa ${gap} dni bez biegu (${a} → ${b}), choć w tym czasie są dostępne dni.`, { data: b, naprawa: "Rozłóż jednostki równiej w tygodniu." });
      else add("DLUGA_PRZERWA_DOSTEPNOSC", `Przerwa ${gap} dni bez biegu (${a} → ${b}) wynika z dostępności dni lub z małej objętości tygodnia.`, { data: b });
    }
  }

  // --- progresja objętości (tylko pełne, zwykłe tygodnie; taper i tydzień startowy to inna logika)
  let ref = null, refIdx = -1, prevRec = false, firstFullSeen = false;
  const baseline = Number(opts.currentWeeklyKm) > 0 ? Number(opts.currentWeeklyKm) : null;
  const nearRace = (k) => !!(raceDate && diffDays(k, raceDate) < 21);
  keys.forEach((k, i) => {
    const w = infoWeek[k];
    if (w.partial || w.isTaperWeek || isRaceWeekKey(k)) return;
    if (w.hasTestOrStart || w.marsz) { if (!w.rw) { ref = kms[i]; refIdx = i; prevRec = false; firstFullSeen = true; } return; } // tydzień z testem/startem: bez oceny skoku, ale staje się punktem odniesienia
    const km = kms[i], rec = w.rw;
    if (!firstFullSeen) {
      firstFullSeen = true;
      if (baseline && !rec && km > Math.max(baseline * 1.35 + 3, baseline + 6) + 1) add("START_SKOK", `Pierwszy pełny tydzień (od ${k}) ma ${r1(km)} km przy dotychczasowych ok. ${r1(baseline)} km tygodniowo.`, { tydzien: wnum(k), data: k, dane: { limit: Math.floor(Math.max(baseline * 1.35 + 3, baseline + 6) + 1) }, naprawa: "Zmniejsz objętość pierwszego tygodnia (krótsze biegi spokojne)." });
      ref = km; refIdx = i; prevRec = rec; return;
    }
    if (rec) {
      if (ref != null && km > ref * 0.93 + 0.3) add("ODCIAZENIE_NIESKUTECZNE", `Tydzień odciążający od ${k} (${r1(km)} km) prawie nie zmniejsza obciążenia względem poprzedniego tygodnia (${r1(ref)} km).`, { tydzien: wnum(k), data: k, naprawa: "Zmniejsz objętość o ok. 15-25% i skróć długi bieg." });
    } else {
      if (ref != null) {
        const runIncrease = runsCnt[i] > runsCnt[refIdx];
        const allowedAbs = runIncrease ? 6 : ref < 20 ? 3 : 2;
        const allowedPct = prevRec ? 0.08 : 0.15;
        const allowed = Math.max(ref + allowedAbs, Math.floor(ref * (1 + allowedPct)) + 1);
        maxInc = Math.max(maxInc, km / ref - 1);
        if (km > allowed + 0.5) add("SKOK_KILOMETRAZU", `Duży skok kilometrażu w tygodniu od ${k}: ${r1(ref)} → ${km} km${prevRec ? " (porównanie z tygodniem przed odciążeniem)" : ""}`, { tydzien: wnum(k), data: k, dane: { limit: Math.floor(allowed) }, naprawa: "Zmniejsz kilometraż tego tygodnia (krótsze biegi spokojne), żeby przyrost mieścił się w limicie." });
        else if (!nearRace(k)) {
          if (prevRec && ref >= 15 && km < ref * 0.9 - 0.6) {
            // v18-P9: brak powrotu do objętości to problem tylko wtedy, gdy nie tłumaczy go ograniczenie użytkownika.
            // Jeśli w tygodniach wokół odciążenia któryś bieg wypełnia >= 92% limitu czasu dnia, brak wzrostu jest skutkiem limitu (sugestia, nie ostrzeżenie).
            const bound = trs.some((t) => isRun(t) && t.data >= addDays(k, -14) && t.data < addDays(k, 7) && Number.isFinite(limitFor(t.data)) && Number(t.czas_min) >= 0.92 * limitFor(t.data));
            const opis = `Po tygodniu odciążającym kilometraż nie wraca: przed ${r1(ref)} km, w tygodniu od ${k} tylko ${km} km${runsCnt[i] < runsCnt[refIdx] ? ` (mniej biegów: ${runsCnt[i]} zamiast ${runsCnt[refIdx]})` : ""}.`;
            if (bound) add("BRAK_ODBUDOWY_LIMIT_CZASU", opis + " Przyczyna: limit czasu na trening.", { tydzien: wnum(k), data: k, naprawa: "Zwiększ limit czasu, jeśli chcesz odbudować objętość." });
            else add("BRAK_ODBUDOWY", opis, { tydzien: wnum(k), data: k, naprawa: "Po odciążeniu wróć do poziomu sprzed odciążenia (nie obniżaj kolejnych tygodni)." });
          }
          else if (!prevRec && ref >= 15 && km < ref * 0.85 - 0.6) add("SPADEK_KILOMETRAZU", `Kilometraż spada w tygodniu od ${k}: ${r1(ref)} → ${km} km bez tygodnia odciążającego ani taperingu.`, { tydzien: wnum(k), data: k, naprawa: "Sprawdź, czy nałożone ograniczenia (limity czasu, minimalne jednostki) nie obniżają objętości bez potrzeby." });
        }
      }
      ref = km; refIdx = i;
    }
    prevRec = rec;
  });

  // --- długie biegi (tylko pełne tygodnie; pierwszy niepełny tydzień nie zawyża udziału)
  const longs = trs.filter((t) => t && t.podtyp === "dlugi" && typeof t.data === "string").sort((a, b) => (a.data < b.data ? -1 : 1));
  for (const k of keys) {
    const w = infoWeek[k]; if (w.partial) continue;
    const runsW = (wk.get(k) || []).filter(isRun), lg = runsW.find((t) => t.podtyp === "dlugi");
    const weekKm = runsW.reduce((s, t) => s + (Number(t.dystans_km) || 0), 0);
    if (lg && weekKm > 0) {
      const share = lg.dystans_km / weekKm, d = w.runDays, limit = maxLongShare(opts.goalType || "health", d);
      if (d >= 3 && share > limit + 0.03) add("DLUGI_UDZIAL", `Długi bieg stanowi ${r1(share * 100)}% tygodniowej objętości w tygodniu od ${k} (${lg.dystans_km}/${r1(weekKm)} km przy ${d} dniach biegania; limit dla tego dystansu ${Math.round(limit * 100)}%). Zwiększaj pozostałe spokojne jednostki stopniowo lub skróć długi bieg.`, { tydzien: wnum(k), data: lg.data, dane: { limitKm: Math.floor(limit * weekKm) }, naprawa: "Skróć długi bieg albo dodaj kilometry w biegach spokojnych." });
    }
  }
  let lastL = 0, plannedMax = 0;
  const hist = Number(opts.longestRecentRun) >= 0 && opts.longestRecentRun != null ? Number(opts.longestRecentRun) : null;
  for (const t of longs) {
    const daysToRace = raceDate ? diffDays(t.data, raceDate) : null;
    const special = t.odciazenie || t.faza_planu === "taper" || (daysToRace != null && daysToRace >= 0 && daysToRace <= 21) || startDates.some((d) => Math.abs(diffDays(t.data, d)) <= 6);
    if (!special && lastL && t.dystans_km < lastL) add("DLUGI_SPADEK", `Spadek długiego biegu ${t.data}: ${lastL} → ${t.dystans_km} km (poza tygodniem odciążającym)`, { data: t.data, trening: "dlugi", naprawa: "Utrzymaj długi bieg na poziomie poprzedniego albo wyjaśnij spadek (limit czasu, tydzień odciążający)." });
    if (!t.odciazenie && t.faza_planu !== "taper") {
      if (plannedMax > 0 && t.dystans_km > plannedMax + 3 && !startDates.length) add("DLUGI_WZROST", `Długi bieg rośnie zbyt szybko: ${plannedMax} → ${t.dystans_km} km (${t.data}).`, { data: t.data, trening: "dlugi", dane: { limitKm: plannedMax + 3 }, naprawa: "Zwiększaj długi bieg o najwyżej 2-3 km między kolejnymi tygodniami." });
      else if (plannedMax === 0 && hist != null && hist > 0 && t.dystans_km > Math.max(hist * 1.3, hist + 4) + 0.01) add("DLUGI_WZROST", `Pierwszy długi bieg (${t.data}, ${t.dystans_km} km) jest znacznie dłuższy niż dotychczasowy najdłuższy (${r1(hist)} km).`, { data: t.data, trening: "dlugi", dane: { limitKm: Math.floor(Math.max(hist * 1.3, hist + 4)) }, naprawa: "Zacznij od dystansu zbliżonego do ostatniego najdłuższego biegu." });
      lastL = Math.max(lastL, t.dystans_km); plannedMax = Math.max(plannedMax, t.dystans_km);
    }
    if (hist != null && opts.level !== "advanced" && !t.odciazenie && t.faza_planu !== "taper" && t.dystans_km > Math.max(hist * 2.2, hist + 12, 8) && !issues.some((x) => x.kod === "DLUGI_DOSWIADCZENIE")) add("DLUGI_DOSWIADCZENIE", `Długi bieg ${t.dystans_km} km (${t.data}) jest bardzo duży przy najdłuższym dotychczasowym biegu ${r1(hist)} km.`, { data: t.data, trening: "dlugi", naprawa: "Rozłóż przygotowanie na więcej tygodni lub obniż szczyt długiego biegu." });
  }
  const prLongs = longs.filter((t) => (t.faza_planu === "build" || t.faza_planu === "peak") && !t.odciazenie);
  const progresywne = { dlugichWBudowieISzczycie: prLongs.length, progresywnych: prLongs.filter((t) => t.progresywny).length };
  let peakInfo = null;
  if (raceDate && longs.length) {
    const peakPool = longs.filter((t) => t.faza_planu !== "taper" && !t.odciazenie && diffDays(t.data, raceDate) > 0);
    const pool = peakPool.length ? peakPool : longs.filter((t) => diffDays(t.data, raceDate) > 0);
    if (pool.length) {
      const mx = Math.max(...pool.map((t) => t.dystans_km));
      const sameMax = pool.filter((t) => Math.abs(t.dystans_km - mx) < 0.01), at = sameMax[sameMax.length - 1];
      peakInfo = { km: mx, data: at.data, dniPrzedStartem: diffDays(at.data, raceDate), liczbaPowtorzenSzczytu: sameMax.length, pierwszeWystapienie: sameMax[0].data, ostatnieWystapienie: at.data };
      const peakLead = { "5k": 7, "10k": 10, half: 16, marathon: 18 }[opts.goalType] || 10;
      if (peakInfo.dniPrzedStartem < peakLead && keys.length >= 11) add("DLUGI_SZCZYT", `Szczyt długiego biegu (${mx} km) wypada tylko ${peakInfo.dniPrzedStartem} dni przed startem (zalecane minimum orientacyjne: ${peakLead} dni dla tego dystansu)`, { data: at.data, trening: "dlugi", naprawa: "Przesuń szczyt długiego biegu wcześniej, tak aby zostały pełne tygodnie na taper." });
      const need = LONG_HIST_REQ[opts.goalType] || 0, weeksToRace = keys.length;
      if (need && weeksToRace >= 12 && mx < need * 0.75) add("CEL_DLUGI_ZA_KROTKI", `Najdłuższy bieg planu (${mx} km) jest wyraźnie krótszy niż zwykle zalecany przy dystansie ${opts.goalType} (ok. ${need}+ km) mimo ${weeksToRace} tygodni przygotowań.`, { data: at.data, trening: "dlugi", naprawa: "Zwiększ szczyt długiego biegu albo zmień cel/dystans na bardziej realny." });
    }
  }

  // --- tapering: osobna logika (nie porównujemy z normalnymi tygodniami jako z równoważnymi krokami progresji)
  if (raceDate) {
    const normal = keys.filter((k) => !infoWeek[k].partial && !infoWeek[k].isTaperWeek && !isRaceWeekKey(k));
    const peakKm = Math.max(0, ...normal.map((k) => kms[keys.indexOf(k)]));
    const peakLong = Math.max(0, ...longs.filter((t) => t.faza_planu !== "taper" && !t.odciazenie).map((t) => t.dystans_km));
    let last = Infinity;
    keys.filter((k) => infoWeek[k].isTaperWeek && !isRaceWeekKey(k)).forEach((k) => {
      const km = kms[keys.indexOf(k)];
      if (km > last + 0.5 || (peakKm >= 15 && km > peakKm * 0.92)) add("TAPER_BRAK_SPADKU", `Tapering w tygodniu od ${k} (${r1(km)} km) ${km > last + 0.5 ? `jest wyższy niż poprzedni tydzień taperingu (${r1(last)} km)` : `prawie nie zmniejsza objętości względem szczytu (${r1(peakKm)} km)`}.`, { tydzien: wnum(k), data: k, dane: { limit: Math.floor(Math.min(last === Infinity ? 1e9 : last - 0.6, peakKm * 0.9)) }, naprawa: "Zmniejsz objętość tygodnia taperingu (krótsze biegi spokojne), zachowaj krótkie bodźce intensywności." });
      else if (peakKm >= 20 && km < peakKm * 0.3) add("TAPER_ZA_GLEBOKI", `Tapering w tygodniu od ${k} (${r1(km)} km) jest bardzo głęboki względem szczytu (${r1(peakKm)} km).`, { tydzien: wnum(k), data: k, naprawa: "Zostaw ok. 40-60% objętości szczytowej w pierwszym tygodniu taperingu." });
      last = Math.min(last, km);
    });
    const rwk = keys.find(isRaceWeekKey);
    if (rwk && peakKm >= 15) { const km = (wk.get(rwk) || []).filter(isRun).reduce((a, t) => a + t.dystans_km, 0); if (km > peakKm * 0.6 + 2) add("TYDZIEN_STARTOWY_DUZY", `Tydzień startowy (od ${rwk}) ma ${r1(km)} km treningu przy szczycie ${r1(peakKm)} km.`, { tydzien: wnum(rwk), data: rwk, dane: { limit: Math.floor(peakKm * 0.55) }, naprawa: "Ogranicz tydzień startowy do krótkich, lekkich biegów." }); }
    for (const t of longs) if (t.faza_planu === "taper" && peakLong >= 10 && t.dystans_km > peakLong * 0.85) add("TAPER_DLUGI", `Długi bieg w taperingu (${t.data}, ${t.dystans_km} km) jest niemal tak długi jak szczyt planu (${peakLong} km).`, { data: t.data, trening: "dlugi", dane: { limitKm: Math.floor(peakLong * 0.8) }, naprawa: "Skróć długi bieg w taperingu do ok. 50-80% szczytu." });
    const taperRuns = trs.filter((t) => t.faza_planu === "taper" && isRun(t));
    if (taperRuns.length >= 3 && !taperRuns.some((t) => [...MOCNE_PODTYPY, "ostrzenie"].includes(t.podtyp))) add("TAPER_BEZ_BODZCOW", "W taperingu nie ma żadnego krótkiego bodźca intensywności; spadek objętości powinien iść w parze z zachowaniem krótkich odcinków w tempie startowym.");
  }

  // --- częstotliwość i udział mocnych
  const maxActualRuns = runsCnt.length ? Math.max(...runsCnt) : 0, expectedRuns = Number(opts.daysPerWeek) || 0;
  if (expectedRuns > 0 && maxActualRuns < expectedRuns) add("CZESTOTLIWOSC_NIE_OSIAGNIETA", `Plan deklaruje ${expectedRuns} dni biegania, ale w żadnym tygodniu nie osiąga tej liczby (maksymalnie ${maxActualRuns}). Sprawdź ograniczenia kilometrażu, minimalną długość jednostki i dostępność dni.`, { naprawa: "Zmień deklarowaną liczbę dni albo zwiększ dostępne dni i czas." });
  const share = total ? (hard / total) * 100 : 0;
  if (share > 25) add("UDZIAL_MOCNYCH", `Udział mocnych treningów ${r1(share)}% (zalecane do ok. 20%)`, { naprawa: "Zamień część akcentów na spokojne biegi." });
  if (expectedRuns <= 2 && expectedRuns > 0 && !trs.some((t) => AUX.includes(t.podtyp))) add("SUGESTIA_UZUPELNIAJACY", "Przy 1-2 biegach tygodniowo warto dodać lekki trening uzupełniający (siła i mobilność lub rower).");
  if (!trs.length) add("SUGESTIA_DANE", "Plan nie zawiera żadnych treningów.");

  // --- wynik: zachowane pola zgodne z v16 + nowe (bledy, sugestie, kody)
  const critical = issues.filter((x) => x.poziom === "krytyczny"), warn = issues.filter((x) => x.poziom === "ostrzezenie"), sugg = issues.filter((x) => x.poziom === "sugestia");
  const problems = [...critical, ...warn].map((x) => x.opis);
  const weeksWithRuns = runsCnt.filter((n) => n > 0);
  const avgRuns = weeksWithRuns.length ? r1(weeksWithRuns.reduce((a, b) => a + b, 0) / weeksWithRuns.length) : 0;
  const maxWeeklyKm = kms.length ? Math.max(...kms) : 0, maxWeeklyIdx = kms.indexOf(maxWeeklyKm);
  const kategoria = (x) => ({ DOSTEPNOSC_DNI: "dostepnosc", LIMIT_CZASU: "limit_czasu", SKOK_KILOMETRAZU: "progresja", START_SKOK: "progresja", SPADEK_KILOMETRAZU: "progresja", BRAK_ODBUDOWY: "regeneracja", REGENERACJA_ZA_DLUGA: "regeneracja", DLUGA_PRZERWA: "harmonogram", DLUGA_PRZERWA_DOSTEPNOSC: "harmonogram", ODCIAZENIE_NIESKUTECZNE: "regeneracja", BRAK_DNIA_ODPOCZYNKU: "regeneracja", REGENERACJA_PO_DLUGIM: "regeneracja", DWA_MOCNE_POD_RZAD: "intensywnosc", AKCENTY_LICZBA: "intensywnosc", AKCENTY_ODSTEP: "intensywnosc", UDZIAL_MOCNYCH: "intensywnosc", CZESTOTLIWOSC_NIE_OSIAGNIETA: "czestotliwosc", CZESTOTLIWOSC_POZIOM: "czestotliwosc" }[x.kod] || (/^DLUGI|^CEL_DLUGI|^TAPER/.test(x.kod) ? (x.kod.startsWith("TAPER") ? "tapering" : "dlugi_bieg") : "spojnosc"));
  const kody = {}; for (const x of issues) kody[x.kod] = (kody[x.kod] || 0) + 1;
  const toDetail = (x) => ({ kod: x.kod, poziom: x.poziom, dataLubTydzien: x.data || (x.tydzien != null ? `tydzień ${x.tydzien}` : null), tydzien: x.tydzien, data: x.data, trening: x.trening, rodzaj: kategoria(x), przyczyna: x.opis, opis: x.opis, naprawa: x.naprawa, dane: x.dane, mozliwaKonsekwencja: x.poziom === "krytyczny" ? "Może oznaczać nadmierne obciążenie lub niezgodność planu z ograniczeniami." : x.poziom === "sugestia" ? "Opcjonalna poprawa jakości planu." : "Warto sprawdzić i w razie potrzeby skorygować plan." });
  return { zgodny: critical.length + warn.length === 0, problemy: problems.slice(0, 40), szczegoly: [...critical, ...warn].map(toDetail), bledy: issues.map(toDetail), bledyKrytyczne: critical.map((x) => x.opis), ostrzezenia: warn.map((x) => x.opis), sugestie: sugg.map((x) => x.opis), liczbaBledowKrytycznych: critical.length, liczbaOstrzezen: warn.length, liczbaSugestii: sugg.length, kodyBledow: kody, czestotliwosc: { zadeklarowaneDni: Number(opts.declaredDays) || expectedRuns || null, doceloweDni: expectedRuns || null, zaplanowaneDni: maxActualRuns, maksymalnaFaktycznaLiczbaBiegowWTygodniu: maxActualRuns, sredniaBiegowWTydzien: avgRuns }, szczytDlugiegoBiegu: peakInfo, szczytTygodniowegoKilometrazu: maxWeeklyIdx >= 0 ? { km: maxWeeklyKm, tydzienOd: keys[maxWeeklyIdx] } : null, dlugieProgresywne: progresywne, udzialMocnychProc: r1(share), maxWzrostTygodniowyProc: r1(maxInc * 100), najdluzszyBiegKm: longest, maxTygodniowyKm: maxWeeklyKm };
}


// ====================================================================
// STRATEGIA STARTU (podział tempa, tętno, odżywianie, rozgrzewka)
// ====================================================================
export function strategiaStartu(type, targetSec, { Z, level } = {}) {
  const D = DIST[type] / 1000;
  if (!D || !targetSec) return null;
  const seg = {
    "5k": [[0, 1, 0.03], [1, 4, 0], [4, 5, -0.02]],
    "10k": [[0, 2, 0.02], [2, 8, 0], [8, 10, -0.015]],
    half: [[0, 3, 0.02], [3, 18, 0], [18, D, -0.01]],
    marathon: [[0, 5, 0.02], [5, 32, 0], [32, D, 0]],
  }[type];
  const sumW = seg.reduce((a, [x, y, f]) => a + (y - x) * (1 + f), 0), base = targetSec / sumW;
  let cum = 0;
  const odcinki = seg.map(([x, y, f]) => { const pace = base * (1 + f); cum += (y - x) * pace; return { odcinek: `${r1(x)}-${r1(y)} km`, tempo: fmtPace(pace), czasNaKoncuOdcinka: fmtTime(cum), uwaga: f > 0 ? "spokojny początek, nie daj się ponieść tłumowi" : f < 0 ? "jeśli masz siły, przyspiesz" : "równe, kontrolowane tempo" }; });
  const marks = [];
  for (let km = 5; km < D; km += type === "marathon" || type === "half" ? 5 : 5) {
    let t = 0;
    for (const [x, y, f] of seg) { const lo = Math.max(x, 0), hi = Math.min(y, km); if (hi > lo) t += (hi - lo) * base * (1 + f); }
    marks.push({ km, czas: fmtTime(t) });
  }
  marks.push({ km: r1(D), czas: fmtTime(targetSec) });
  const odz = { "5k": "Krótki wysiłek zwykle nie wymaga jedzenia w trakcie; korzystaj z wcześniej sprawdzonych nawyków i pij według pragnienia oraz warunków.", "10k": "Dobór żywienia zależy od czasu wysiłku i wcześniejszej tolerancji; nie wprowadzaj nowego produktu na starcie. Pij według pragnienia i warunków.", half: "Stosuj wcześniej przećwiczony, tolerowany sposób przyjmowania węglowodanów; ilość i moment zależą od czasu wysiłku. Nawadniaj się według pragnienia, warunków i tolerancji.", marathon: "Przećwicz żywienie na długich biegach i stosuj indywidualnie tolerowany schemat, bez automatycznej dawki węglowodanów. Pij według pragnienia, warunków i wcześniejszej tolerancji; nie pij przymusowo na każdym punkcie." }[type];
  const rozgrzewka = { "5k": "10-15 min truchtu + 4-6 przebieżek po 20 s.", "10k": "10-15 min truchtu + 4 przebieżki po 20 s.", half: "5-10 min truchtu + 3 przebieżki.", marathon: "Tylko 5 min truchtu i mobilizacja, oszczędzaj siły." }[type];
  return { dystansKm: r1(D), czasDocelowy: fmtTime(targetSec), sredniePace: fmtPace(targetSec / D), odcinki, czasyPosrednie: marks, kontrolaTetna: Z ? `Przez pierwszą 1/3 dystansu trzymaj tętno poniżej ${Z[3].do} (górna granica Z4). Jeśli jest wyżej, zwolnij.` : null, odzywianie: odz, rozgrzewka, wskazowki: ["Nie zmieniaj niczego w dniu startu: buty, jedzenie, żele.", "Śniadanie 2,5-3 h przed startem, znane i lekkostrawne.", type === "marathon" || type === "half" ? "Zacznij wolniej niż plan. Kto zaczyna za szybko, płaci w końcówce." : "Pierwszy kilometr zawsze wydaje się łatwy, trzymaj plan."] };
}

// ====================================================================
// TYGODNIOWY PRZEGLĄD REALIZACJI PLANU
// ====================================================================
// planned: [{data, typ, podtyp?, dystans_km, status?}], acts: [{date, distance_km, feeling?}]
export function weeklyReview(planned, acts, today) {
  const from = addDays(today, -7);
  const P = (planned || []).filter((w) => w.data > from && w.data <= today && !AUX.includes(w.podtyp) && w.typ !== "Odpoczynek");
  const A = (acts || []).filter((a) => a.date > from && a.date <= today);
  const isDone = (w) => w.status === "done" || (w.status == null && A.some((a) => Math.abs(diffDays(w.data, a.date)) <= 1));
  const done = P.filter(isDone), isQ = (w) => ["Tempo", "Interwały"].includes(w.typ);
  const kmPlan = r1(P.reduce((a, w) => a + (w.dystans_km || 0), 0)), kmFakt = r1(A.reduce((a, x) => a + (Number(x.distance_km) || 0), 0));
  const proc = P.length ? Math.round((done.length / P.length) * 100) : null;
  const qP = P.filter(isQ), qD = qP.filter(isDone), fe = A.filter((a) => a.feeling).map((a) => a.feeling);
  const avgF = fe.length ? r1(fe.reduce((a, b) => a + b, 0) / fe.length) : null;
  const k = []; let rec = "kontynuuj";
  if (proc == null) { k.push("W ostatnim tygodniu nie było zaplanowanych treningów biegowych."); rec = "kontynuuj"; }
  else {
    if (proc >= 80) k.push(`Świetnie: wykonałeś ${done.length} z ${P.length} treningów (${proc}%).`);
    else if (proc >= 50) { k.push(`Wykonałeś ${done.length} z ${P.length} treningów (${proc}%). Nie nadrabiaj zaległości, wróć do planu.`); rec = "kontynuuj bez nadrabiania"; }
    else { k.push(`Wykonałeś tylko ${done.length} z ${P.length} treningów (${proc}%). Warto przeliczyć plan.`); rec = "przelicz plan"; }
    if (qP.length && qD.length < qP.length) k.push(`Mocne treningi: ${qD.length} z ${qP.length}. Jeśli opuszczasz je regularnie, rozważ plan z mniejszą liczbą akcentów.`);
    if (kmPlan > 0 && kmFakt > kmPlan * 1.2) { k.push(`Przebiegłeś ${kmFakt} km przy planie ${kmPlan} km (+${Math.round((kmFakt / kmPlan - 1) * 100)}%). Zbyt szybki wzrost obciążenia zwiększa ryzyko kontuzji.`); if (rec === "kontynuuj") rec = "kontynuuj, ale pilnuj objętości"; }
  }
  if (avgF != null && avgF <= 2) { k.push(`Średnie odczucie ${avgF}/5: możliwe zmęczenie. Rozważ lżejszy tydzień.`); rec = "tydzień odciążający"; }
  return { okres: `${addDays(from, 1)} - ${today}`, zaplanowane: P.length, wykonane: done.length, procent: proc, kmPlan, kmFakt, mocneWykonane: `${qD.length}/${qP.length}`, srednieOdczucie: avgF, komentarze: k, rekomendacja: rec };
}

// ====================================================================
// KOREKTA TEMPA O POGODĘ (orientacyjnie)
// ====================================================================
export function skorygujTempoPogoda(tempoSek, tempC, wilgotnoscProc = 50) {
  let f = tempC > 15 ? (tempC - 15) * 0.005 : tempC < -5 ? (-5 - tempC) * 0.003 : 0;
  if (tempC > 20 && wilgotnoscProc > 60) f += (wilgotnoscProc - 60) * 0.001;
  f = clamp(f, 0, 0.15);
  return { tempo: fmtPace(tempoSek * (1 + f)), wolniejszeProc: r1(f * 100), uwaga: f > 0.08 ? "Duże obciążenie cieplne: skróć trening lub biegnij na tętno, nie na tempo." : f > 0 ? "Zwolnij względem planu, ocenę opieraj na tętnie." : "Warunki sprzyjają, trzymaj plan." };
}


// ====================================================================
// WZBOGACENIE TRENINGU: cel, RPE, kryteria przerwania, warianty, raportowanie
// ====================================================================
const STOP_COMMON = "Przerwij trening, gdy pojawi się ból narastający w trakcie biegu, ból w klatce piersiowej, zawroty głowy, nietypowa duszność lub ból stawu zmieniający sposób biegu. Nie dokańczaj treningu na siłę.";
const STOP_QUALITY = " W treningu jakościowym: jeśli w pierwszych dwóch powtórzeniach tętno jest wyraźnie powyżej zakresu albo nie utrzymujesz tempa mimo wysiłku 9/10, zakończ część główną wcześniej i dobiegnij spokojnie.";
const CEL = {
  latwy: "Rozwój bazy tlenowej i regeneracja przy niskim koszcie zmęczenia.",
  dlugi: "Wytrzymałość, ekonomia biegu i odporność mięśni na długi wysiłek.",
  tempo: "Podniesienie progu mleczanowego, czyli tempa, które możesz utrzymać coraz dłużej.",
  interwaly: "Rozwój VO2max i ekonomii biegu przy szybszym tempie.",
  podbiegi: "Siła biegowa i moc, bezpieczniejsza forma pracy szybkościowej niż szybkie odcinki na płaskim.",
  tempo_startowe: "Oswojenie tempa startowego i wytrzymałości w tempie zawodów.",
  ostrzenie: "Utrzymanie świeżości i rytmu startowego przy minimalnym zmęczeniu.",
  test: "Sprawdzenie aktualnej formy i aktualizacja stref treningowych.",
  start: "Start kontrolny: sprawdzenie formy i taktyki przed startem głównym.",
  regeneracja: "Regeneracja i rozruszanie bez dodatkowego zmęczenia.",
  sila: "Wzmocnienie tkanek i stabilizacji, mniejsze ryzyko przeciążeń.",
  cross: "Dodatkowa praca tlenowa bez obciążania stawów, wsparcie regeneracji.",
  marszobieg: "Bezpieczne przyzwyczajenie organizmu do biegania.",
};
const RPE = { latwy: "3-4/10 (rozmowa pełnymi zdaniami)", dlugi: "4-5/10", tempo: "6-7/10", interwaly: "8-9/10 w odcinkach", podbiegi: "8-9/10 w podbiegach", tempo_startowe: "6-7/10", ostrzenie: "6/10 w odcinkach", test: "9/10, ostatni kilometr maksymalnie", start: "8-9/10", regeneracja: "2-3/10", sila: "5-6/10", cross: "3-4/10", marszobieg: "3/10" };
export const JAK_RAPORTOWAC = "Po treningu wpisz: dystans, czas, średnie tętno, odczucie 1-5, RPE 1-10 oraz ewentualny ból (miejsce i siła 0-10). Przy treningach tempowych, interwałach, podbiegach, testach i startach dodaj część główną: łączny dystans i czas samych odcinków lub bloków. Dane z zegarka oznaczaj jako szacunki.";

const ETYKIETY = { latwy: "Bieg spokojny Z2 · tlen i regeneracja", dlugi: "Długi bieg · wytrzymałość", tempo: "Tempo progowe · próg mleczanowy", tempo_startowe: "Tempo startowe · rytm zawodów", interwaly: "Interwały · VO2max", podbiegi: "Podbiegi · siła biegowa", ostrzenie: "Ostrzenie przed startem · świeżość i rytm", test: "Test formy · aktualizacja stref", start: "Start · sprawdzian formy i taktyki", regeneracja: "Bieg regeneracyjny Z1 · rozruch bez zmęczenia", sila: "Siła i mobilność · wzmocnienie tkanek", cross: "Trening uzupełniający · tlen bez obciążania stawów", marszobieg: "Marszobieg · adaptacja do biegania" };
// v18-P15: krótkie, jawne uzasadnienie, dlaczego dany trening jest w planie (nie zastępuje opinii trenera)
function whyFor(t) {
  const pt = t.podtyp || "latwy", faza = t.faza_planu;
  const rec = t.odciazenie ? " To tydzień odciążający: objętość jest celowo niższa, żeby organizm się zaadaptował." : "";
  const tap = faza === "taper" ? " Zmniejszona objętość przed startem ma dać świeżość." : "";
  const m = {
    latwy: "Spokojny bieg tlenowy buduje bazę przy niewielkim koszcie zmęczenia; ma być w tempie rozmowy.",
    regeneracja: "Krótki, bardzo lekki bieg po mocniejszej jednostce: utrzymuje częstotliwość bez dokładania zmęczenia.",
    dlugi: "Długi bieg to główny bodziec wytrzymałościowy tygodnia; jego długość rośnie stopniowo i zależy od objętości tygodnia, dystansu i Twoich limitów czasu.",
    tempo: "Praca w tempie progowym podnosi tempo, które możesz utrzymać dłużej; jedna taka jednostka tygodniowo wystarcza.",
    interwaly: "Krótkie, szybkie odcinki rozwijają pułap tlenowy i ekonomię biegu; pojawiają się tylko tam, gdzie baza i zdrowie na to pozwalają.",
    podbiegi: "Podbiegi wzmacniają siłę i technikę biegu przy mniejszym obciążeniu stawów niż szybkie odcinki na płaskim.",
    tempo_startowe: "Bieg w tempie docelowym uczy rytmu zawodów; używany sparingowo, bo tempo startowe nie jest tempem treningowym.",
    ostrzenie: "Krótkie przyspieszenia przed startem utrzymują świeżość nóg bez zmęczenia.",
    test: "Test formy pozwala zweryfikować tempa treningowe; zaplanowany, gdy plan ma na to zapas objętości.",
    marszobieg: "Naprzemienne bieganie i marsz stopniowo przyzwyczaja stawy i ścięgna do obciążenia.",
    sila: "Trening siłowy zmniejsza ryzyko przeciążeń; w dni bez biegania.",
    cross: "Trening krzyżowy dodaje pracy tlenowej bez obciążania stawów jak bieg.",
    start: "Start zawodów."
  }[pt] || "Trening uzupełniający plan.";
  return m + rec + tap;
}
function metaFor(t) {
  const pt = t.podtyp || "latwy", d = t.dystans_km || 0, k = t.kroki || [];
  const quality = ["tempo", "tempo_startowe", "ostrzenie", "interwaly", "podbiegi"].includes(pt);
  const easyLike = pt === "latwy" || pt === "regeneracja";
  const rs = k.find((x) => x.powtorzenia), nd = r1(Math.max(2.5, d * 0.7));
  const indoor = "Bieżnia mechaniczna z nachyleniem 1% (te same tempa) lub bezpieczna pętla blisko domu. Przy burzy, gołoledzi lub silnym upale zamień na 30-40 min szybkiego marszu.";
  let skr = null, pog = indoor, zm = "";
  if (easyLike) { skr = `Skróć do ok. ${nd} km w tym samym tempie.`; zm = "Biegnij 20-30 min bardzo spokojnie (Z1) albo zrób dzień wolny, jeśli zmęczenie nie mija po rozgrzewce."; }
  else if (pt === "marszobieg") { skr = "Skróć część główną o 1/3."; zm = "Zamień na 30 min szybkiego marszu."; }
  else if (pt === "dlugi") { skr = `Skróć do ok. ${r1(Math.max(4, d * 0.75))} km w tym samym tempie.`; zm = "Skróć do ok. 60% dystansu albo zamień na 40-50 min biegu Z1-Z2. Nie nadrabiaj później."; }
  else if (pt === "interwaly" || pt === "podbiegi") {
    skr = rs ? `Wykonaj ${Math.max(3, Math.ceil((rs.powtorzenia * 2) / 3))} z ${rs.powtorzenia} powtórzeń, rozgrzewka i schłodzenie bez zmian.` : "Wykonaj 2/3 części głównej.";
    if (pt === "podbiegi") pog = "Bieżnia mechaniczna z nachyleniem 4-6% (powtórzenia po tyle samo sekund) albo najbliższy bezpieczny podbieg. Przy oblodzeniu zamień na interwały na płaskim, jeśli to bezpieczne.";
    zm = `Zamień na spokojny bieg ok. ${nd} km (Z2) i przełóż mocny trening o 1-2 dni. Nie nadrabiaj.`;
  } else if (pt === "tempo_startowe") {
    const nb = k.filter((x) => /^Blok/.test(x.etap)).length;
    skr = `Wykonaj ${Math.max(1, nb - 1)} z ${nb} bloków.`; zm = `Zamień na spokojny bieg ok. ${nd} km (Z2), mocny trening przełóż o 1-2 dni.`;
  } else if (pt === "tempo") {
    const m = k.filter((x) => /^(Blok|Część główna)/.test(x.etap) && x.czas_min != null).reduce((a, x) => a + x.czas_min, 0);
    skr = `Skróć część tempową do ok. ${Math.max(8, Math.round((m * 2) / 3))} min.`; zm = `Zamień na spokojny bieg ok. ${nd} km (Z2), mocny trening przełóż o 1-2 dni.`;
  } else if (pt === "ostrzenie") { skr = "Zrób 3 z 4 powtórzeń."; zm = "Zamień na spokojny trucht 20-30 min."; }
  else if (pt === "test") { pog = "Przełóż na dzień o dobrej pogodzie (najlepiej 10-18°C, bez silnego wiatru) albo bieżnia 1%. Test w złych warunkach zaniży Twoje strefy."; zm = "Przełóż test o 3-5 dni. Wynik w zmęczeniu zaniży Twoje strefy."; }
  else if (pt === "start") { pog = "Dostosuj tempo do warunków (upał, wiatr), oceniaj na tętno i RPE."; zm = "Jeśli czujesz silne zmęczenie lub ból, odpuść start albo potraktuj go jako spokojny trening."; }
  else if (pt === "cross") { skr = "Skróć do 30 min."; pog = "Wersja domowa: rowerek stacjonarny, orbitrek lub szybki marsz."; zm = "Zrób 20 min bardzo lekko albo odpocznij."; }
  else if (pt === "sila") { skr = "Zrób o jedną serię mniej w każdym ćwiczeniu (ok. 20 min)."; pog = "Ćwiczenia robisz w domu, nie wymagają dodatkowego sprzętu."; zm = "Zrób tylko 15 min mobilności albo odpocznij."; }
  const kon = pt === "test" || pt === "start" || quality;
  return {
    dlaczego: whyFor(t),
    etykieta: t.progresywny ? "Długi bieg progresywny · wytrzymałość i tempo" : ETYKIETY[pt] || t.typ + " · trening", cel: t.progresywny ? "Wytrzymałość tlenowa oraz umiejętność przyspieszenia na zmęczonych nogach (końcówka w tempie progowym lub startowym)." : CEL[pt] || "", rpe: RPE[pt] || "",
    kryteria_przerwania: STOP_COMMON + (quality ? STOP_QUALITY : ""),
    warianty: { skrocony: skr, zla_pogoda: pog, zmeczenie: zm },
    raportuj: pt === "sila" || pt === "cross" ? "Zaznacz wykonanie i krótką notatkę (trudność, ewentualny ból)." : kon ? "Wpisz całość (dystans, czas, średnie tętno, odczucie 1-5, RPE) oraz część główną: łączny dystans i czas samych odcinków lub bloków." : "Wpisz dystans, czas, średnie tętno, odczucie 1-5 i RPE.",
  };
}

// ====================================================================
// KOMPLETNOŚĆ DANYCH I WIARYGODNOŚĆ (wg priorytetów zbierania danych)
// ====================================================================
const has = (v) => v !== undefined && v !== null && !(typeof v === "number" && isNaN(v));
function kompletnosc(inp) {
  const g = inp.goal || {};
  const L1 = [
    ["cel i dystans", !!DIST[g.type] || g.type === "health"],
    ["data zawodów lub długość planu", has(g.raceDate) || has(inp.weeks)],
    ["wiek", has(inp.age)],
    ["poziom zaawansowania", has(inp.level) && !inp.poziomWywnioskowany],
    ["ostatni wynik lub ocena formy", has(inp.vdotOverride) || !!(inp.bestResult && inp.bestResult.timeSec > 0)],
    ["kilometraż z ostatnich tygodni", has(inp.currentWeeklyKm) && inp.currentWeeklyKm > 0],
    ["dni treningowe", !!(inp.availableDays && inp.availableDays.length && has(inp.daysPerWeek))],
    ["najdłuższy ostatni bieg", has(inp.longestRecentRun) && inp.longestRecentRun > 0],
    ["kontuzje i ograniczenia", has(inp.injuries)],
    ["dostępność czasowa", has(inp.maxMinutes) || has(inp.maxMinutesWeekday)],
  ];
  const L2 = [
    ["historia treningów z 8-12 tygodni", (inp.liczbaTreningowHistorii || 0) >= 16],
    ["tempo spokojnego biegu z historii", has(inp.observedEasyPace)],
    ["tętno maksymalne i spoczynkowe", has(inp.hrMax) && has(inp.hrRest)],
    ["wyniki na kilku dystansach", (inp.liczbaWynikow || 0) >= 2],
    ["preferowane dni lub dzień długiego biegu", has(inp.longRunDow) || (inp.availableDays || []).length < 7],
    ["teren i podbiegi", has(inp.podbiegi)],
    ["trening siłowy", has(inp.silaTreningi)],
    ["sen i regeneracja (samopoczucie po treningach)", (inp.liczbaFeedback || 0) > 0],
    ["historia przeciążeń", has(inp.historiaKontuzji)],
  ];
  const L3 = [
    ["tętno progowe", has(inp.tetnoProgowe)], ["tempo progowe", has(inp.tempoProgowe)], ["VO2max z wiarygodnego testu", has(inp.vo2max)], ["HRV", has(inp.hrv)], ["import plików FIT/GPX", has(inp.importFit)],
  ];
  const sum = (L) => ({ podane: L.filter((x) => x[1]).length, razem: L.length, brakuje: L.filter((x) => !x[1]).map((x) => x[0]) });
  const a = sum(L1), b = sum(L2), c = sum(L3), miss1 = a.razem - a.podane;
  const pewnosc = miss1 >= 3 ? "niska" : miss1 > 0 || b.podane < 4 ? "średnia" : "wysoka";
  return { poziom1_wymagane: a, poziom2_personalizacja: b, poziom3_opcjonalne: c, pewnosc, uwaga: pewnosc === "wysoka" ? "Dane są wystarczające do dokładnej personalizacji." : "Uzupełnienie brakujących danych poprawi dokładność planu i prognoz. Brak danych opcjonalnych nie blokuje planu." };
}
function jakoscDanych(I, inp, assess) {
  return {
    tetnoMaksymalne: I.hrMaxEstimated ? "szacowane (208 − 0,7 × wiek)" : "podane lub z historii",
    tetnoSpoczynkowe: inp.hrRest ? "podane" : "brak",
    tetnoProgowe: inp.tetnoProgowe ? "podane" : "brak",
    forma: I.vdotSource ? "obliczona z wyników i historii treningów" : assess.zrodloVdot === "wynik" ? "obliczona z wyniku" : "szacunek (brak wiarygodnego wyniku)",
    zrodloFormy: I.vdotSource || null,
    tempaSpokojne: I.observedEasyPace ? "skorygowane na podstawie Twoich biegów" : "z modelu",
    historia: I.liczbaTreningowHistorii ? `${I.liczbaTreningowHistorii} treningów` : "brak",
    uwaga: "Wartości z zegarka (VO2max, tętno nadgarstkowe) traktuj jako szacunki, nie pomiar laboratoryjny.",
  };
}

// ====================================================================
// REGENERACJA PO STARCIE
// ====================================================================
export function planPoStarcie(type, level) {
  const e = level === "beginner" ? 1 : 0;
  const t = { "5k": { off: 1, easy: 6, hard: 8 }, "10k": { off: 2, easy: 8, hard: 12 }, half: { off: 4, easy: 12, hard: 16 }, marathon: { off: 7, easy: 14, hard: 28 } }[type];
  if (!t) return null;
  const off = t.off + e;
  return {
    zalecenia: [
      { dni: off > 1 ? `1-${off}` : "1", opis: "Bez biegania: spacer, lekki rower lub pływanie bez wysiłku, dużo snu." },
      { dni: `${off + 1}-${t.easy + e}`, opis: "Powrót do biegania: 20-30 min bardzo spokojnie (Z1-Z2), tylko jeśli nic nie boli. Bez przebieżek, interwałów i długich biegów. Objętość ok. 50-70% sprzed startu." },
      { dni: `od ${t.hard + e}`, opis: "Stopniowy powrót do mocniejszych treningów, jeśli zmęczenie minęło. Zacznij od planu na nowy cel." },
    ],
    uwaga: "Jeśli ból utrzymuje się dłużej niż kilka dni albo nasila się, skonsultuj się z lekarzem lub fizjoterapeutą.",
  };
}

// ====================================================================
// BEZPIECZEŃSTWO I SPRZĘŻENIE ZWROTNE
// ====================================================================
// entry: { symptoms: ["bol_klatki","omdlenie","dusznosc_ciezka","zawroty_glowy","goraczka","choroba"], pain: 0-10, painTrend: "nasila"|"stabilny"|"maleje", painDays }
export function sprawdzBezpieczenstwo(entry = {}) {
  const sy = entry.symptoms || [];
  if (["bol_klatki", "omdlenie", "dusznosc_ciezka"].some((x) => sy.includes(x)))
    return { poziom: "pilne", komunikat: "Przerwij wysiłek. Przy bólu w klatce piersiowej, omdleniu lub nietypowo ciężkiej duszności skontaktuj się pilnie z lekarzem lub zadzwoń pod 112.", dzialania: ["Nie biegaj do czasu konsultacji medycznej."] };
  if (sy.includes("goraczka") || sy.includes("choroba")) return { poziom: "przerwij", komunikat: "Przy gorączce lub chorobie nie trenuj. Wróć do biegania dopiero po ustąpieniu objawów, najpierw spokojnie.", dzialania: ["Odpoczynek do ustąpienia objawów.", "Powrót: pierwsze dni 20-30 min spokojnie."] };
  if (entry.pain >= 7 || entry.painTrend === "nasila" || (entry.pain >= 4 && entry.painDays >= 7))
    return { poziom: "przerwij", komunikat: "Ból jest silny, nasila się albo utrzymuje się od dłuższego czasu. Przerwij bieganie na kilka dni i skonsultuj się z lekarzem lub fizjoterapeutą. Nie biegaj przez narastający ból.", dzialania: ["Odpoczynek lub aktywność bez bólu (spacer, rower).", "Konsultacja ze specjalistą, jeśli ból nie ustępuje."] };
  if (entry.pain >= 3 || sy.includes("zawroty_glowy")) return { poziom: "ostroznie", komunikat: "Zmniejsz obciążenie i unikaj treningów intensywnych, obserwuj objawy. Jeśli ból się nasila lub utrzymuje, skonsultuj się ze specjalistą.", dzialania: ["Zamień mocne treningi na spokojne.", "Obserwuj ból po treningu i następnego dnia."] };
  return { poziom: "ok", komunikat: "Brak sygnałów ostrzegawczych.", dzialania: [] };
}

// entries: [{date, rpe, planRpe, pain, painTrend, painDays, fatigue 1-5, sleep 1-5, restingHrDelta (bpm względem normy), symptoms}]
// Decyzja opiera się na trendzie (min. 2 z 3 ostatnich wpisów), pojedynczy pomiar nie zmienia planu o dużo.
export function feedbackDecision(entries) {
  const e = (entries || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 3);
  const base = { akcja: "utrzymaj plan", poziom: "ok", wspolczynnikObjetosci: 1, uzasadnienie: [], zastapNajblizszaJakosc: false, konsultacja: false, zaLatwo: false };
  if (!e.length) return { ...base, akcja: "brak danych" };
  const safety = sprawdzBezpieczenstwo(e[0]);
  if (safety.poziom === "pilne" || safety.poziom === "przerwij") return { ...base, akcja: safety.poziom === "pilne" ? "pilna pomoc medyczna" : "przerwa w bieganiu", poziom: safety.poziom, wspolczynnikObjetosci: 0, uzasadnienie: [safety.komunikat], zastapNajblizszaJakosc: true, konsultacja: true, bezpieczenstwo: safety };
  const cnt = (f) => e.filter(f).length;
  const sig = {
    zmęczenie: cnt((x) => x.fatigue >= 4), "słaby sen": cnt((x) => x.sleep != null && x.sleep <= 2),
    "podwyższone tętno spoczynkowe": cnt((x) => x.restingHrDelta >= 7), "trening trudniejszy niż plan": cnt((x) => x.rpe != null && x.planRpe != null && x.rpe - x.planRpe >= 2), ból: cnt((x) => x.pain >= 3),
  };
  const active = Object.entries(sig).filter(([, v]) => v >= 2).map(([k]) => k);
  const out = { ...base, uzasadnienie: active.map((a) => `Powtarzający się sygnał: ${a}.`) };
  if (active.length >= 3) Object.assign(out, { akcja: "tydzień odciążający i 2-3 dni odpoczynku", poziom: "ostroznie", wspolczynnikObjetosci: 0.6, zastapNajblizszaJakosc: true, konsultacja: active.includes("ból") });
  else if (active.length === 2) Object.assign(out, { akcja: "zmniejsz objętość o ok. 20% i zamień najbliższy mocny trening na bieg spokojny", poziom: "ostroznie", wspolczynnikObjetosci: 0.8, zastapNajblizszaJakosc: true, konsultacja: active.includes("ból") });
  else if (active.length === 1) Object.assign(out, active[0] === "ból" ? { akcja: "zmniejsz obciążenie i unikaj mocnych treningów, obserwuj ból", poziom: "ostroznie", wspolczynnikObjetosci: 0.9, zastapNajblizszaJakosc: true, konsultacja: false } : { akcja: "utrzymaj plan, obserwuj sygnały", wspolczynnikObjetosci: 0.95 });
  if (e.length === 3 && e.every((x) => x.rpe != null && x.planRpe != null && x.planRpe - x.rpe >= 2 && (x.fatigue == null || x.fatigue <= 2))) { out.zaLatwo = true; out.uzasadnienie.push("Trzy treningi z rzędu były wyraźnie łatwiejsze niż zakładał plan. Wykonaj test formy i zaktualizuj strefy."); }
  return out;
}


// ====================================================================
// STARTY POBOCZNE: przygotowanie, odpoczynek przed i po, dodawanie w trakcie planu
// ====================================================================
const HARD_T = ["Tempo", "Interwały", "Długi bieg", "Test", "Start"];
function raceRecovery(km) {
  if (km >= 35) return { noHard: 14, off: 5 };
  if (km >= 18) return { noHard: 7, off: 2 };
  if (km >= 8) return { noHard: 3, off: 1 };
  return { noHard: 2, off: 0 };
}

// tr: lista treningów, r: {date, distanceKm, name, priority: "B"|"C", targetTimeSec?}, ctx: {P, Z, easyMid, vdot, startDate, warm?, cool?}
// Zwraca {treningi, zmiany: {usuniete, zamienione, dodane}}. Treningi sprzed startDate oraz wykonane/pominięte nie są ruszane.
export function applyExtraRace(tr, r, ctx) {
  const prio = r.priority === "C" ? "C" : "B";
  const rec = raceRecovery(r.distanceKm);
  const off = prio === "C" ? Math.min(rec.off, 1) : rec.off;
  const noHard = prio === "C" ? Math.max(1, Math.round(rec.noHard * 0.6)) : rec.noHard;
  const preHard = prio === "B" ? 3 : 1;
  const d0 = r.date, nm = r.name || "start";
  const zm = { usuniete: [], zamienione: [], dodane: [] };
  const c = { P: ctx.P, Z: ctx.Z, easyMid: ctx.easyMid, warm: ctx.warm || 2, cool: ctx.cool || 1.5 };
  const finish = (o) => { roundWorkout(o); return Object.assign(o, metaFor(o)); };
  const easyObj = (date, km, recovery, id, status) => {
    const kroki = easyKroki(c, r1(km), false, recovery);
    return finish({ ...(id != null ? { id } : {}), ...(status ? { status } : {}), data: date, typ: recovery ? "Regeneracyjny" : "Bieg spokojny Z2", podtyp: recovery ? "regeneracja" : "latwy", dystans_km: r1(km), czas_min: Math.round((km * (recovery ? ctx.P.recovery.slow : ctx.easyMid)) / 60), strefa_tetna: recovery ? "Z1" : "Z2", tempo_zakres: range(recovery ? ctx.P.recovery : ctx.P.easy), opis: descr(kroki), kroki });
  };
  const out = [];
  for (const t of tr) {
    if (t.data < ctx.startDate || t.status === "done" || t.status === "missed") { out.push(t); continue; }
    const dd = diffDays(d0, t.data), hard = HARD_T.includes(t.typ) && !AUX.includes(t.podtyp), sila = AUX.includes(t.podtyp);
    const remove = (why) => zm.usuniete.push({ id: t.id, data: t.data, typ: t.typ, powod: why });
    const down = (why) => {
      const rcv = dd > 0 && dd <= 2, km = Math.min(clamp(t.typ === "Długi bieg" ? t.dystans_km * 0.5 : t.dystans_km * 0.6, ctx.minEasy || 3, 10), rcv ? Math.max(5, ctx.minEasy || 3) : 10), n = easyObj(t.data, km, rcv, t.id, t.status);
      zm.zamienione.push({ id: t.id, data: t.data, z: t.typ, na: n.typ, powod: why }); out.push(n);
    };
    if (dd === 0 || dd === -1) { remove(`zastąpione przez start lub trucht przed startem (${nm})`); continue; }
    if (dd >= 1 && dd <= off) { remove(`dzień odpoczynku po starcie (${nm})`); continue; }
    if (dd < -1 && dd >= -preHard && (hard || sila)) { hard ? down(`lżej przed startem (${nm})`) : remove(`odpoczynek przed startem (${nm})`); continue; }
    if (dd > off && dd <= noHard && (hard || sila)) { hard ? down(`regeneracja po starcie (${nm})`) : remove(`regeneracja po starcie (${nm})`); continue; }
    out.push(t);
  }
  const D = r.distanceKm, pace = r.targetTimeSec ? r.targetTimeSec / D : raceTimeFromVdot(D * 1000, ctx.vdot) / D;
  // ostrzenie w tempie startowym na kilka dni przed startem B (do półmaratonu)
  if (prio === "B" && D <= 21.2) {
    const cand = out.filter((t) => t.podtyp === "latwy" && t.status !== "done" && t.data >= ctx.startDate && diffDays(d0, t.data) <= -3 && diffDays(d0, t.data) >= -5).sort((a, b) => Math.abs(diffDays(d0, a.data) + 4) - Math.abs(diffDays(d0, b.data) + 4))[0];
    if (cand) {
      const sh = mkSharpen({ ...c, goalPace: pace }), idx = out.indexOf(cand);
      out[idx] = finish({ ...(cand.id != null ? { id: cand.id } : {}), data: cand.data, typ: sh.typ, podtyp: sh.podtyp, dystans_km: r1(sh.dist), czas_min: sh.min, strefa_tetna: sh.strefa, tempo_zakres: sh.tempo, opis: descr(sh.kroki), kroki: sh.kroki });
      zm.zamienione.push({ id: cand.id, data: cand.data, z: cand.typ, na: "Tempo (ostrzenie)", powod: `ostrzenie w tempie startu przed ${nm}` });
    }
  }
  const dm1 = addDays(d0, -1);
  const kroki = [
    { etap: "Rozgrzewka", dystans_km: 1.5, tempo: range(ctx.P.easy), tetno: `${ctx.Z[1].od}-${ctx.Z[1].do} (Z2)`, uwagi: "pod koniec 4 przebieżki po 20 s" },
    { etap: `Start: ${nm}`, dystans_km: D, tempo: fmtPace(pace), czas_odcinka: fmtTime(D * pace), uwagi: (prio === "B" ? "start kontrolny (priorytet B): traktuj jak mocny trening, nie ryzykuj kontuzji, przetestuj tempo startowe, nawadnianie i odżywianie" : "start treningowy (priorytet C): bez specjalnego odpoczynku przed, biegnij według samopoczucia") + ". Po biegu wpisz wynik z zaznaczeniem 'zawody lub test', poprawi to ocenę Twojej formy." },
    { etap: "Schłodzenie", dystans_km: 1.5, tempo: range(ctx.P.recovery), tetno: `${ctx.Z[0].od}-${ctx.Z[0].do} (Z1)` },
  ];
  const race = finish({ data: d0, typ: "Start", podtyp: "start", dystans_km: r1(D + 3), czas_min: Math.round((D * pace + 3 * ctx.easyMid) / 60), strefa_tetna: "Z4-Z5", tempo_zakres: fmtPace(pace), opis: descr(kroki), kroki });
  out.push(race); zm.dodane.push({ data: d0, typ: "Start: " + nm });
  if (dm1 >= ctx.startDate && ctx.przedStartem !== "odpoczynek") {
    const shake = finish({ data: dm1, typ: "Regeneracyjny", podtyp: "regeneracja", dystans_km: 3, czas_min: 20, strefa_tetna: "Z1", tempo_zakres: range(ctx.P.recovery), opis: "Dzień przed startem: lekki trucht 15-20 min + 4 przebieżki po 20 s.", kroki: [{ etap: "Lekki trucht", czas_min: 18, tempo: range(ctx.P.recovery), tetno: `${ctx.Z[0].od}-${ctx.Z[0].do} (Z1)` }, { etap: "Przebieżki", uwagi: "4× 20 s swobodnie" }] });
    out.push(shake); zm.dodane.push({ data: dm1, typ: "Trucht przed startem" });
  }
  out.sort((a, b) => (a.data < b.data ? -1 : 1));
  return { treningi: out, zmiany: zm };
}

// Dodaje nieplanowany start do istniejącego planu bez przeliczania całości.
// opts: {today, vdot, hrMax, hrRest, tetnoProgowe, tempoProgowe, dataStartuGlownego, age}
export function dodajStartDoPlanu(treningi, race, opts = {}) {
  if (!(race && race.date && race.distanceKm > 0)) return { ok: false, blad: "Podaj datę i dystans startu." };
  if (!opts.today || race.date <= opts.today) return { ok: false, blad: "Data startu musi być w przyszłości." };
  if (opts.dataStartuGlownego && race.date >= addDays(opts.dataStartuGlownego, -9)) return { ok: false, blad: "Ten start jest za blisko startu głównego lub po nim. Jeśli jest dla Ciebie ważniejszy, przelicz cały plan z nowym startem głównym." };
  const near = (treningi || []).find((t) => t.podtyp === "start" && Math.abs(diffDays(t.data, race.date)) < 6);
  if (near) return { ok: false, blad: `W pobliżu (${near.data}) jest już zaplanowany start. Między startami potrzeba co najmniej 6 dni.` };
  const vdot = opts.vdot || 38, P = pacesFor(vdot, opts.tempoProgowe), hrMax = opts.hrMax || Math.round(208 - 0.7 * (opts.age || 35));
  const Z = hrZones(hrMax, opts.hrRest, opts.tetnoProgowe), easyMid = (P.easy.fast + P.easy.slow) / 2;
  const res = applyExtraRace(treningi, race, { P, Z, easyMid, vdot, startDate: opts.today });
  const pl = (n) => `${n} ${n === 1 ? "dzień" : "dni"}`;
  const prio = race.priority === "C" ? "C" : "B", rec = raceRecovery(race.distanceKm);
  const off = prio === "C" ? Math.min(rec.off, 1) : rec.off;
  return { ok: true, treningi: res.treningi, zmiany: res.zmiany, komunikat: `Dodano start ${race.name || ""} (${race.distanceKm} km, priorytet ${prio}). Przed startem ${pl(prio === "B" ? 3 : 1)} bez mocnych treningów, ${off ? `po starcie ${pl(off)} wolnego i ` : "po starcie "}${pl(prio === "C" ? Math.max(1, Math.round(rec.noHard * 0.6)) : rec.noHard)} bez mocnych treningów. Reszta planu bez zmian.` };
}

// ====================================================================
// CZAS PRZYGOTOWAŃ, TRYB I RYZYKO (plan powstaje zawsze, także na kilka dni przed startem)
// ====================================================================
const IDEAL_WEEKS = { "5k": [8, 10], "10k": [10, 12], half: [14, 16], marathon: [18, 24] };
function przygotowanieInfo(I, g, days) {
  const type = g.type, idx = I.level === "beginner" ? 1 : 0;
  const minW = MIN_WEEKS[type][idx], ideal = IDEAL_WEEKS[type][idx], wk = r1(days / 7), lbl = DIST_LABEL[type];
  const tryb = days <= 14 ? "świeżość" : wk < minW ? "skrócony" : "pełny";
  const longNeed = { "5k": 0, "10k": 0, half: 8, marathon: 16 }[type];
  const score = (wk < minW * 0.5 ? 2 : wk < minW ? 1 : 0) + (I.longestRecentRun < longNeed ? 1 : 0) + (I.injuries ? 1 : 0);
  const ryzyko = score >= 3 ? "wysokie" : score >= 1 ? "średnie" : "niskie";
  let k;
  if (tryb === "świeżość") k = `Do startu zostało ${days} dni. Na budowanie formy jest już za późno, więc plan ma Cię jak najlepiej przygotować: lekkie bieganie, krótkie ostrzenie i świeżość. Nie nadrabiaj zaległości i nie dokładaj mocnych treningów. Na ${lbl} zalecamy zwykle ${ideal} tyg. przygotowań (minimum ${minW}).`;
  else if (tryb === "skrócony") k = `Do startu zostało ${wk} tyg., a na ${lbl} zalecamy ${ideal} tyg. przygotowań (minimum ${minW}). Plan jest skrócony: utrzymuje i delikatnie rozwija formę, nie buduje jej od zera.`;
  else k = wk >= ideal ? `Do startu zostało ${wk} tyg., to wystarczy na pełne przygotowanie.` : `Do startu zostało ${wk} tyg. Wystarczy na przygotowanie, choć optymalnie na ${lbl} warto mieć ${ideal} tyg.`;
  if (ryzyko === "wysokie") k += ` Ryzyko startu jest wysokie: rozważ krótszy dystans, start bez parcia na czas (z marszobiegiem) albo późniejszy termin. Bezpieczeństwo jest ważniejsze niż wynik.`;
  else if (ryzyko === "średnie" && tryb !== "pełny") k += " Ryzyko średnie: biegnij spokojniej niż zakłada cel czasowy.";
  return { dostepneTygodnie: wk, dniDoStartu: days, minimum: minW, optymalnie: ideal, tryb, ryzyko, komunikat: k };
}


// ====================================================================
// ZAOKRĄGLANIE DYSTANSÓW DO PEŁNYCH KILOMETRÓW
// ====================================================================
// Dystans całego treningu jest liczbą całkowitą. Różnicę pokrywa schłodzenie (lub rozgrzewka, a w prostych biegach sam bieg),
// więc suma kroków zawsze zgadza się z dystansem treningu.
function roundWorkout(t) {
  if (AUX.includes(t.podtyp) || !(t.dystans_km > 0)) return;
  if (t.podtyp === "marszobieg") { t.dystans_km = Math.max(2, Math.round(t.dystans_km)); return; }
  const k = t.kroki || [];
  if (!k.some((x) => x.dystans_km > 0)) { t.dystans_km = Math.max(2, Math.round(t.dystans_km)); return; }
  const old = t.dystans_km, min = 2;
  const cool = k.find((x) => x.etap === "Schłodzenie"), warm = k.find((x) => x.etap === "Rozgrzewka"), main = k.find((x) => x.dystans_km > 0);
  const tryTarget = (target) => {
    const delta = target - old;
    for (const [st, lo, hi] of [[cool, 0.8, 4], [warm, 1, 5], [main, 1, 99]]) {
      if (!st) continue;
      const nv = r1((st.dystans_km || 0) + delta);
      if (nv >= lo && nv <= hi) { st.dystans_km = nv; t.dystans_km = target; t.czas_min = Math.max(1, Math.round(t.czas_min + (delta * (paceMid(st.tempo) || 390)) / 60)); t.opis = descr(k); return true; }
    }
    return false;
  };
  const target = Math.max(min, Math.round(old));
  if (tryTarget(target)) return;
  if (!tryTarget(target + (old > target ? 1 : -1))) t.dystans_km = r1(old);
}
function przeliczTygodnie(treningi, tygodnie) {
  for (const t of tygodnie) {
    const inW = treningi.filter((x) => x.data >= t.od && x.data < addDays(t.od, 7));
    const runs = inW.filter((x) => !AUX.includes(x.podtyp)), lg = runs.find((x) => x.podtyp === "dlugi");
    t.km = r1(inW.reduce((a, x) => a + x.dystans_km, 0));
    t.treningi = inW.length;               // wszystkie jednostki (z uzupełniającymi)
    t.biegi = runs.length;                 // faktyczna liczba dni biegowych w tygodniu
    t.dni_biegowe = runs.map((x) => x.data);
    t.uzupelniajace = inW.length - runs.length;
    t.dlugiBiegKm = lg ? lg.dystans_km : 0;
  }
}

// ====================================================================
// DOPASOWANIE JEDNOSTKI DO LIMITU CZASU (v17)
// ====================================================================
// Zasada: nie skracamy rozgrzewki ani schłodzenia, żeby zmieścić się w limicie. Skracamy część główną biegu
// spokojnego/długiego; jednostka jakościowa, która się nie mieści, zamienia się na bieg spokojny (z raportem).
// ctx: {P, Z, easyMid}. Zwraca {wynik: "bez_zmian"|"skrocony"|"zamieniony_na_spokojny"|"usuniety"|"nie_da_sie", ...}.
export function fitWorkoutToLimit(t, limMin, ctx = {}) {
  if (!(t.czas_min > limMin)) return { wynik: "bez_zmian" };
  if (AUX.includes(t.podtyp)) {
    if (t.podtyp === "cross" && limMin >= 20) { const old = t.czas_min; t.czas_min = limMin; if (t.kroki?.[0]) t.kroki[0].czas_min = limMin; t.opis = descr(t.kroki); return { wynik: "skrocony", z: old, na: limMin }; }
    return { wynik: "usuniety" };
  }
  const k = t.kroki || [], oldKm = t.dystans_km, oldMin = t.czas_min;
  const simple = ["latwy", "regeneracja", "dlugi"].includes(t.podtyp);
  const mainStep = k.find((x) => /^(Bieg spokojny|Bieg regeneracyjny|Długi bieg ciągły|Część spokojna)$/.test(x.etap) && x.dystans_km > 0);
  if (simple && mainStep) {
    const minPerKm = oldMin / Math.max(oldKm, 0.1);
    let newKm = Math.floor(((limMin - 0.01) / minPerKm) * 1);
    while (newKm > 0 && Math.round(oldMin * (newKm / oldKm)) > limMin) newKm--;
    if (newKm < (t.podtyp === "dlugi" ? 3 : 2)) return { wynik: "nie_da_sie", powod: `limit ${limMin} min jest za krótki nawet na najkrótszy sensowny bieg` };
    const delta = newKm - oldKm;
    mainStep.dystans_km = r1(mainStep.dystans_km + delta);
    if (mainStep.dystans_km < 0.5) return { wynik: "nie_da_sie", powod: "po skróceniu nie zostaje część główna" };
    t.dystans_km = newKm; t.czas_min = Math.round(oldMin * (newKm / oldKm)); t.opis = descr(k);
    return { wynik: "skrocony", z: oldKm, na: newKm };
  }
  // jednostka jakościowa lub złożona: zamiana na bieg spokojny mieszczący się w limicie (bez fikcyjnego skracania rozgrzewki)
  const em = ctx.easyMid || 390, easy = ctx.P?.easy || { fast: em * 0.95, slow: em * 1.05 };
  const km = Math.floor((limMin * 60) / em - 0.01);
  if (km < 2) return { wynik: "nie_da_sie", powod: `limit ${limMin} min jest za krótki nawet na bieg spokojny 2 km` };
  const z = ctx.Z ? `${ctx.Z[1].od}-${ctx.Z[1].do} (Z2)` : "Z2";
  const kroki = [{ etap: "Bieg spokojny", dystans_km: km, tempo: range(easy), tetno: z, uwagi: "zamieniono z jednostki jakościowej, bo nie mieściła się w limicie czasu" }];
  const old = { typ: t.typ, podtyp: t.podtyp };
  Object.assign(t, { typ: "Bieg spokojny Z2", podtyp: "latwy", dystans_km: km, czas_min: Math.round((km * em) / 60), strefa_tetna: "Z2", tempo_zakres: range(easy), kroki, opis: descr(kroki) });
  delete t.progresywny;
  return { wynik: "zamieniony_na_spokojny", z: old.typ, na: t.typ, km };
}

// ====================================================================
// AUTOMATYCZNA NAPRAWA PLANU (v17)
// ====================================================================
// Zmienia dystans prostego biegu (spokojny/regeneracyjny/długi) zachowując rozgrzewkę i schłodzenie. Zwraca true przy sukcesie.
function setRunKm(t, newKm) {
  if (!["latwy", "regeneracja", "dlugi"].includes(t.podtyp) || !(newKm >= 2)) return false;
  const k = t.kroki || [], st = k.find((x) => /^(Bieg spokojny|Bieg regeneracyjny|Długi bieg ciągły|Część spokojna)$/.test(x.etap) && x.dystans_km > 0);
  if (!st) return false;
  const old = t.dystans_km, nv = r1(st.dystans_km + (newKm - old));
  if (nv < 0.5) return false;
  st.dystans_km = nv; t.czas_min = Math.max(1, Math.round(t.czas_min * (newKm / old))); t.dystans_km = newKm; t.opis = descr(k);
  return true;
}
function toEasyRun(t, ctx = {}) {
  const em = ctx.easyMid || 390, easy = ctx.P?.easy || { fast: em * 0.95, slow: em * 1.05 };
  const km = Math.max(3, Math.min(Math.round(t.dystans_km), 10));
  const kroki = [{ etap: "Bieg spokojny", dystans_km: km, tempo: range(easy), tetno: ctx.Z ? `${ctx.Z[1].od}-${ctx.Z[1].do} (Z2)` : "Z2", uwagi: "zamieniono z mocniejszej jednostki w ramach naprawy planu" }];
  const z = t.typ;
  Object.assign(t, { typ: "Bieg spokojny Z2", podtyp: "latwy", dystans_km: km, czas_min: Math.round((km * em) / 60), strefa_tetna: "Z2", tempo_zakres: range(easy), kroki, opis: descr(kroki) });
  delete t.progresywny;
  return z;
}
// Naprawia błędy krytyczne wykryte przez auditPlan i ZAWSZE raportuje zmiany. Po zmianach ponownie uruchamia audyt.
// Nie ukrywa problemów: to, czego nie da się naprawić bez utraty sensu planu, trafia do `nienaprawialne`.
export function repairPlan(treningi, opts = {}) {
  let tr = JSON.parse(JSON.stringify(treningi || []));
  const zmiany = [], ctx = opts.ctx || {};
  const before = auditPlan(tr, opts);
  let audit = before, nienaprawialne = [];
  const log = (kod, data, akcja) => zmiany.push({ kod, data, akcja });
  const weekRuns = (k) => tr.filter((t) => t.data >= k && t.data < addDays(k, 7) && !AUX.includes(t.podtyp));
  const weekKm = (k) => weekRuns(k).reduce((a, t) => a + t.dystans_km, 0);
  const trimWeek = (k, limit, kod) => {
    let guard = 60;
    while (weekKm(k) > limit + 1e-9 && guard-- > 0) {
      const easy = weekRuns(k).filter((t) => (t.podtyp === "latwy" || t.podtyp === "regeneracja") && t.dystans_km > 3).sort((a, b) => b.dystans_km - a.dystans_km)[0];
      if (easy) { const z = easy.dystans_km; if (setRunKm(easy, z - 1)) { log(kod, easy.data, `skrócono bieg ${easy.podtyp} ${z} → ${easy.dystans_km} km`); continue; } }
      const lg = weekRuns(k).filter((t) => t.podtyp === "dlugi" && t.dystans_km > 5)[0];
      if (lg) { const z = lg.dystans_km; if (setRunKm(lg, z - 1)) { log(kod, lg.data, `skrócono długi bieg ${z} → ${lg.dystans_km} km`); continue; } }
      const runs = weekRuns(k), shortest = runs.filter((t) => t.podtyp === "latwy" || t.podtyp === "regeneracja").sort((a, b) => a.dystans_km - b.dystans_km)[0];
      if (shortest && runs.length > 2) { tr = tr.filter((x) => x !== shortest); log(kod, shortest.data, `usunięto najkrótszy bieg ${shortest.dystans_km} km (nie da się zmieścić w limicie objętości inaczej)`); continue; }
      break;
    }
    return weekKm(k) <= limit + 0.5;
  };
  for (let iter = 0; iter < 6; iter++) {
    const crit = audit.bledy.filter((b) => b.poziom === "krytyczny");
    if (!crit.length) break;
    const sizeBefore = zmiany.length;
    const bad = [];
    for (const b of crit) {
      const t = tr.find((x) => x.data === b.data && (!b.trening || x.podtyp === b.trening)) || tr.find((x) => x.data === b.data);
      let done = false;
      if (b.kod === "LIMIT_CZASU" && t) {
        const lim = b.dane?.limit ?? (dowOf(t.data) === 0 || dowOf(t.data) === 6 ? opts.maxMinutesWe : opts.maxMinutesWd);
        const r = fitWorkoutToLimit(t, lim, ctx);
        if (r.wynik === "usuniety") { tr = tr.filter((x) => x !== t); log(b.kod, b.data, "usunięto jednostkę uzupełniającą, która nie mieści się w limicie"); done = true; }
        else if (r.wynik !== "nie_da_sie") { log(b.kod, b.data, `${r.wynik}: ${r.z ?? ""} → ${r.na ?? r.km ?? ""}`); done = true; }
      } else if (b.kod === "SUMA_DYSTANSU_KROKI" && t) {
        const sum = (t.kroki || []).reduce((a, st) => a + (st.dystans_km || 0) + (st.powtorzenia && st.dystans_m ? st.powtorzenia * st.dystans_m / 1000 + (st.liczba_przerw ?? st.powtorzenia) * (st.przerwa_km || 0) : 0), 0);
        if (sum > 0) { log(b.kod, b.data, `dystans treningu ${t.dystans_km} → ${r1(sum)} km (suma kroków)`); t.dystans_km = r1(sum); done = true; }
      } else if (b.kod === "DWA_MOCNE_POD_RZAD" && t) {
        const prev = tr.find((x) => x.data === addDays(t.data, -1) && !AUX.includes(x.podtyp));
        const target = t.podtyp !== "dlugi" && t.podtyp !== "start" ? t : prev && prev.podtyp !== "dlugi" && prev.podtyp !== "start" ? prev : null;
        if (target) { const z = toEasyRun(target, ctx); log(b.kod, target.data, `zamieniono „${z}” na bieg spokojny (dwa mocne treningi pod rząd)`); done = true; }
      } else if (b.kod === "DOSTEPNOSC_DNI" && t) {
        const k = mondayOf(t.data), occ = new Set(tr.map((x) => x.data));
        const cands = [-3, -2, -1, 1, 2, 3].map((d) => addDays(t.data, d)).filter((d) => d >= (opts.startDate || "0000") && (!opts.raceDate || d < opts.raceDate) && opts.availableDays?.includes(dowOf(d)) && !occ.has(d) && d >= k && d < addDays(k, 7));
        const hardAdj = (d) => tr.some((x) => x !== t && (x.data === addDays(d, 1) || x.data === addDays(d, -1)) && !AUX.includes(x.podtyp) && ["Tempo", "Interwały", "Długi bieg", "Test", "Start"].includes(x.typ));
        const ok = cands.find((d) => !(["Tempo", "Interwały", "Długi bieg", "Test"].includes(t.typ) && hardAdj(d)));
        if (ok) { log(b.kod, b.data, `przeniesiono trening ${t.podtyp} na ${ok}`); t.data = ok; done = true; }
        else if (AUX.includes(t.podtyp)) { tr = tr.filter((x) => x !== t); log(b.kod, b.data, "usunięto jednostkę uzupełniającą w niedostępnym dniu (brak dnia zastępczego)"); done = true; }
      } else if ((b.kod === "SKOK_KILOMETRAZU" || b.kod === "START_SKOK" || b.kod === "TAPER_BRAK_SPADKU" || b.kod === "TYDZIEN_STARTOWY_DUZY") && b.data) {
        const lim = b.dane?.limit;
        if (lim != null) { done = trimWeek(b.data, lim - (b.kod === "TYDZIEN_STARTOWY_DUZY" ? 0 : 0), b.kod); if (!done) log(b.kod, b.data, "skrócono, ale nie osiągnięto limitu"); }
      } else if ((b.kod === "TAPER_DLUGI" || b.kod === "DLUGI_WZROST") && t) {
        const lim = b.dane?.limitKm; if (lim && setRunKm(t, lim)) { log(b.kod, b.data, `długi bieg skrócony do ${lim} km`); done = true; }
      } else if (b.kod === "AKCENTY_LICZBA" && b.data) {
        const q = weekRuns(b.data).filter((x) => ["tempo", "interwaly", "podbiegi", "tempo_startowe"].includes(x.podtyp)).sort((a, b2) => (a.data < b2.data ? 1 : -1))[0];
        if (q) { const z = toEasyRun(q, ctx); log(b.kod, q.data, `zamieniono „${z}” na bieg spokojny (za dużo akcentów)`); done = true; }
      } else if (b.kod === "CZESTOTLIWOSC_POZIOM" && b.data) {
        const e = weekRuns(b.data).filter((x) => x.podtyp === "latwy" || x.podtyp === "regeneracja").sort((a, b2) => a.dystans_km - b2.dystans_km)[0];
        if (e) { tr = tr.filter((x) => x !== e); log(b.kod, e.data, `usunięto najkrótszy bieg (${e.dystans_km} km), limit liczby biegów dla poziomu`); done = true; }
      } else if (b.kod === "PO_ZAWODACH" && t) { tr = tr.filter((x) => x !== t); log(b.kod, b.data, "usunięto trening po dacie zawodów"); done = true; }
      if (!done) bad.push(b);
    }
    tr.sort((a, b2) => (a.data < b2.data ? -1 : a.data > b2.data ? 1 : 0));
    audit = auditPlan(tr, opts);
    nienaprawialne = audit.bledy.filter((x) => x.poziom === "krytyczny" && bad.some((y) => y.kod === x.kod && y.data === x.data));
    if (zmiany.length === sizeBefore) break;
  }
  const remaining = audit.bledy.filter((x) => x.poziom === "krytyczny");
  return { ok: remaining.length === 0, treningi: tr, zmiany, przed: { krytyczne: before.liczbaBledowKrytycznych, ostrzezenia: before.liczbaOstrzezen }, po: { krytyczne: audit.liczbaBledowKrytycznych, ostrzezenia: audit.liczbaOstrzezen }, nienaprawialne: remaining.length ? remaining : nienaprawialne.filter(() => false), kontrola: audit };
}

// ====================================================================
// OCENA REALNOŚCI CELU (v17): osobno plan, ukończenie dystansu, wynik i pewność oceny
// ====================================================================
function ocenaCeluV18(a) {
  // v18-P13: rozdzielenie "czy plan powstał" / "czy można ukończyć" / "czy wynik jest realny" uzupełnione o jawną rekomendację
  const out = ocenaCeluV17core(a);
  const st = a.gotowosc && a.gotowosc.status, ryz = a.przygotowanie && a.przygotowanie.ryzyko;
  let rek, opis;
  if (!a.hasRace || !DIST[a.g.type]) { rek = "plan_rozwojowy"; opis = "Plan rozwojowy bez startu: ocena osiągalności nie dotyczy."; }
  else if (st === "niewystarczajace_przygotowanie" || ryz === "wysokie") { rek = "cel_niezalecany_przy_obecnych_danych"; opis = "Przy tych danych plan nie przygotuje do bezpiecznego ukończenia dystansu. Rozważ krótszy dystans, późniejszy termin albo więcej dni biegowych (patrz proponowaneZmiany)."; }
  else if (st === "przygotowanie_czesciowe" || ryz === "średnie") { rek = "plan_z_zastrzezeniami"; opis = "Plan jest wykonalny, ale przygotowanie jest częściowe: biegnij zachowawczo i traktuj cel czasowy orientacyjnie."; }
  else { rek = "plan_zalecany"; opis = "Dane i czas przygotowań są zgodne z kryteriami orientacyjnymi. To nie gwarancja wyniku."; }
  out.rekomendacja = { status: rek, opis, alternatywy: (a.proponowaneZmiany || []).map((p) => p.opis) };
  // v19-C5: jawne rozdzielenie trzech pytań (ukończenie / konkretny czas / baza do bezpiecznego rozpoczęcia przygotowań)
  if (a.hasRace && DIST[a.g.type] && a.gotowosc) {
    const gt = a.gotowosc, powody = [];
    const baza = a.g.type === "marathon" ? !gt.bazaMaratonskaOk : (gt.wskaznik < 0.5 && !gt.czasPrzygotowaniaOk);
    if (baza) powody.push(a.g.type === "marathon" ? `Obecna baza (${a.I.currentWeeklyKm} km tygodniowo, najdłuższy bieg ${a.I.longestRecentRun} km) jest za mała, by odpowiedzialnie zacząć przygotowania do maratonu w tym terminie.` : "Baza i czas przygotowań są zbyt małe względem wymagań dystansu.");
    if (!gt.czestotliwoscOk) powody.push(`Liczba biegów (${a.I.daysPerWeek}/tydz.) jest poniżej orientacyjnego minimum ${gt.minimalnaCzestotliwosc}.`);
    if (!gt.czasPrzygotowaniaOk) powody.push(`Czas przygotowań (${a.przygotowanie.dostepneTygodnie} tyg.) jest krótszy niż minimum ${gt.minimalneTygodnie} tyg.`);
    out.klasyfikacja = {
      przygotowanieDoUkonczenia: !!gt.ok,
      przygotowanieDoKonkretnegoCzasu: gt.status === "odpowiednie_przygotowanie_do_wyniku",
      bazaNiewystarczajacaDoBezpiecznegoStartu: !!baza,
      mozliwePrzygotowanieOdpowiedzialne: !!gt.ok || (gt.status === "przygotowanie_czesciowe" && !baza),
      powody,
    };
  }
  return out;
}
function ocenaCeluV17core({ I, g, hasRace, assess, gotowosc, przygotowanie, fitEvidence, kontrola, T, goalTime }) {
  const out = { mozliwoscPlanu: { status: kontrola.liczbaBledowKrytycznych === 0 ? "plan_wygenerowany" : "plan_z_bledami", uzasadnienie: [`Audyt: ${kontrola.liczbaBledowKrytycznych} błędów krytycznych, ${kontrola.liczbaOstrzezen} ostrzeżeń.`] }, mozliwoscUkonczenia: null, realnoscWyniku: null, pewnosc: "niska", zastrzezenie: "Ocena jest szacunkiem na podstawie podanych danych i nie gwarantuje wyniku." };
  if (!hasRace || !DIST[g.type]) { out.mozliwoscUkonczenia = { status: "nie_dotyczy", uzasadnienie: ["Brak zawodów z datą: plan rozwojowy bez oceny ukończenia dystansu."] }; out.realnoscWyniku = { status: "nie_dotyczy", uzasadnienie: [] }; return out; }
  const why = [];
  if (gotowosc) {
    const w = gotowosc.wPlanie, n = gotowosc.wymagane;
    out.mozliwoscUkonczenia = { status: gotowosc.status, uzasadnienie: [`Plan osiąga najdłuższy bieg ${w.najdluzszyBiegKm} km (kryterium orientacyjne ${n.najdluzszyBiegKm} km) i ${w.kmTygodniowo} km tygodniowo (kryterium ${n.kmTygodniowo} km).`, gotowosc.czestotliwoscOk ? null : `Częstotliwość ${I.daysPerWeek}/tydz. jest poniżej minimum ${gotowosc.minimalnaCzestotliwosc}.`, gotowosc.czasPrzygotowaniaOk ? null : `Czas przygotowań (${przygotowanie.dostepneTygodnie} tyg.) jest krótszy niż minimum ${gotowosc.minimalneTygodnie} tyg.`, gotowosc.bazaMaratonskaOk ? null : "Obecna baza (kilometraż i najdłuższy bieg) jest zbyt mała na maraton."].filter(Boolean) };
  }
  const src = assess.zrodloVdot;
  if (!g.targetTimeSec) { out.realnoscWyniku = { status: "brak_celu_czasowego", uzasadnienie: ["Nie podano czasu docelowego: oceniono tylko możliwość ukończenia."] }; out.pewnosc = src === "szacunek" ? "niska" : "umiarkowana"; return out; }
  if (src === "szacunek") { out.realnoscWyniku = { status: "niewystarczajace_dane", uzasadnienie: ["Brak aktualnego wyniku lub testu: nie da się wiarygodnie ocenić, czy czas docelowy jest realny. Wykonaj bieg testowy 3-5 km lub podaj ostatni wynik zawodów."] }; out.pewnosc = "niska"; return out; }
  const vdot = assess.vdot, need = vdotFrom(DIST[g.type], g.targetTimeSec), gain = need / vdot - 1;
  const wk = przygotowanie ? przygotowanie.dostepneTygodnie : I.weeks;
  const rate = { beginner: 0.008, intermediate: 0.005, advanced: 0.003 }[I.level], cap = { beginner: 0.14, intermediate: 0.09, advanced: 0.05 }[I.level];
  const maxGain = Math.min(cap, Math.max(wk, 0.5) * rate), ratio = gain <= 0 ? 0 : gain / maxGain;
  let status;
  if (gain < -0.06) status = "cel_prawdopodobnie_zbyt_latwy"; else if (ratio <= 0.5) status = "cel_realistyczny"; else if (ratio <= 1) status = "cel_wymagajacy"; else status = "cel_bardzo_ambitny";
  why.push(`Wymagany wzrost formy: ${r1(gain * 100)}% (możliwy w ${wk} tyg.: ok. ${r1(maxGain * 100)}%); forma wyjściowa VDOT ${vdot} (${src}).`);
  if (gain < -0.06) why.push(`Cel jest wyraźnie wolniejszy niż obecna forma (${fmtTime(assess.prognoza[g.type])} prognozy): rozważ ambitniejszy czas.`);
  const down = (r) => { why.push(r); if (status === "cel_realistyczny") status = "cel_wymagajacy"; else if (status === "cel_wymagajacy") status = "cel_bardzo_ambitny"; };
  if (I.daysPerWeek <= 2 && status !== "cel_prawdopodobnie_zbyt_latwy") { down(`Przy ${I.daysPerWeek === 1 ? "1 biegu" : "2 biegach"} tygodniowo nie da się wiarygodnie zakładać poprawy formy ani nawet utrzymania obecnej: ocena wyniku jest obniżona.`); if (I.daysPerWeek <= 1) down("Jeden bieg tygodniowo nie pozwala na zaplanowanie jakości ani rozwoju wytrzymałości."); }
  if (gotowosc && !gotowosc.ok && status !== "cel_prawdopodobnie_zbyt_latwy") down("Plan nie osiąga kryteriów przygotowania do tego dystansu, co obniża szanse na wynik.");
  if (przygotowanie && przygotowanie.ryzyko === "wysokie" && status !== "cel_bardzo_ambitny") down("Ryzyko związane z czasem przygotowań, historią długich biegów lub kontuzjami jest wysokie.");
  out.realnoscWyniku = { status, uzasadnienie: why, wymaganyWzrostProc: r1(gain * 100), mozliwyWzrostProc: r1(maxGain * 100), czasPlanu: goalTime ? fmtTime(goalTime) : null };
  out.pewnosc = src === "wynik" || src === "historia treningów" ? (fitEvidence ? "umiarkowana" : "niska") : "niska";
  return out;
}

export {importActivityBatch as importActivities} from './model/activity_v29.mjs';
export {validateSafety} from './model/constraints_v29.mjs';
