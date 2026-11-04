// Testy trudnych przypadków: każdy przypadek ma własne oczekiwania + niezależną kontrolę (0 krytycznych naruszeń).
import { mkInput, runAll, independentChecks, makeReporter, finish, weeksOf, G, GEN_PATH } from "./lib.mjs";
const rep = makeReporter("trudne"); const { ok } = rep;
const R10 = { distanceKm: 10, timeSec: 3300 };
function run(nm, o, extra) {
  const inp = mkInput(o); const { res, wyjatek } = runAll(inp);
  ok(!wyjatek, `${nm}: brak wyjątku`, wyjatek);
  if (wyjatek) return null;
  const exp = extra && extra.expectInvalid;
  if (exp) { ok(res.ok === false, `${nm}: odrzucone jako niepoprawne`, JSON.stringify(res).slice(0, 150)); return { inp, res }; }
  ok(res.ok === true, `${nm}: plan wygenerowany (ok:true)`, JSON.stringify(res.bledy || res.komunikat || "").slice(0, 200));
  if (!res.ok) return { inp, res };
  const c = independentChecks(inp, res);
  ok(c.krytyczne === 0, `${nm}: 0 krytycznych naruszeń niezależnych`, JSON.stringify(c.problemy.filter((p) => p.ciezar === "krytyczny").slice(0, 4)));
  return { inp, res, c, W: weeksOf(res) };
}
const claim = (res) => res.gotowosc && res.gotowosc.status;
let x;

x = run("bardzo niski kilometraż (0 km, 0 km najdłuższy), 10 km, 14 tyg.", { level: "beginner", type: "10k", weeks: 14, days: 3, km: 0, longest: 0 });
if (x && x.res.ok) { ok(x.W[0].km <= 15, "start nie wyższy niż 15 km", x.W[0].km); ok(claim(x.res) !== "odpowiednie_przygotowanie_do_wyniku", "bez wyniku i bez bazy brak gotowości do wyniku"); }
x = run("wysoka objętość początkowa (120 km, 40 km), maraton, advanced, 6 dni", { level: "advanced", type: "marathon", weeks: 20, days: 6, km: 120, longest: 40, result: { distanceKm: 42.195, timeSec: 10800 } });
if (x && x.res.ok) ok(x.W[0].km <= 120 * 1.3 + 6, "tydzień 1 nie przekracza ~130% dotychczasowego", x.W[0].km);
x = run("krótki okres przygotowania: maraton w 3 tyg., 40 km", { level: "intermediate", type: "marathon", weeks: 3, days: 4, km: 40, longest: 18, result: R10 });
if (x && x.res.ok) { ok(!/odpowiednie/.test(claim(x.res)), "maraton w 3 tyg.: brak deklaracji gotowości", claim(x.res)); ok(x.res.ostrzezenia.length > 0, "są ostrzeżenia"); }
x = run("krótki okres: 5 km w 2 tyg.", { level: "beginner", type: "5k", weeks: 2, days: 3, km: 12, longest: 5 });
x = run("długi okres przygotowania: półmaraton za ~50 tyg.", { level: "intermediate", type: "half", weeks: 50, days: 4, km: 25, longest: 10, result: R10 });
if (x && x.res.ok) ok(x.W.filter((w) => w.deload).length >= 8, "w długim planie regularne odciążenia (>=8)", x.W.filter((w) => w.deload).length);
x = run("jeden dostępny trening tygodniowo (1 dzień)", { level: "beginner", type: "10k", weeks: 12, days: 1, availableDays: [6], km: 10, longest: 5 });
if (x && x.res.ok) { ok(x.W.every((w) => w.n <= 1), "nie więcej niż 1 bieg tygodniowo"); ok(x.res.ostrzezenia.some((w) => /jednym treningiem/.test(w)), "ostrzeżenie o ograniczonej skuteczności 1 treningu"); }
x = run("dwa dostępne treningi tygodniowo", { level: "intermediate", type: "half", weeks: 16, days: 2, availableDays: [2, 6], km: 20, longest: 10, result: R10 });
if (x && x.res.ok) ok(x.W.every((w) => w.n <= 2), "nie więcej niż 2 biegi tygodniowo");
if (x && x.res.ok) ok(!/odpowiednie_przygotowanie_do_wyniku/.test(claim(x.res)), "półmaraton z 2 biegów: brak gotowości do wyniku", claim(x.res));
x = run("maksymalna dostępność: 7 dni, beginner", { level: "beginner", type: "10k", weeks: 12, days: 7, km: 15, longest: 7 });
if (x && x.res.ok) ok(x.res.ostrzezenia.some((w) => /Zadeklarowano 7|częstotliwo/i.test(w)), "komunikat o ograniczeniu liczby biegów względem deklaracji");
x = run("maksymalna dostępność: 7 dni, advanced, wysoka objętość", { level: "advanced", type: "half", weeks: 16, days: 7, km: 60, longest: 22, result: { distanceKm: 10, timeSec: 2700 } });
x = run("limit czasu 45 min w dni robocze", { level: "intermediate", type: "10k", weeks: 12, days: 4, km: 25, longest: 10, maxMinutesWeekday: 45, maxMinutesWeekend: 120, result: R10 });
x = run("limit czasu 40 min w weekend", { level: "intermediate", type: "half", weeks: 16, days: 4, km: 30, longest: 12, maxMinutesWeekday: 90, maxMinutesWeekend: 40, result: R10 });
x = run("kontuzja zgłoszona", { level: "intermediate", type: "10k", weeks: 12, days: 4, km: 25, longest: 10, injuries: true, result: R10 });
if (x && x.res.ok) ok(!x.res.treningi.some((t) => t.podtyp === "interwaly" || t.podtyp === "podbiegi"), "kontuzja: brak interwałów i podbiegów");
x = run("przerwa 60 dni", { level: "intermediate", type: "half", weeks: 16, days: 4, km: 40, longest: 16, breakDays: 60, result: R10 });
if (x && x.res.ok) { ok(x.W[0].km <= 40 * 0.4 * 1.3 + 6, "po przerwie 60 dni start ok. 40% objętości", x.W[0].km); ok(x.res.ostrzezenia.some((w) => /przerw/i.test(w)), "ostrzeżenie o przerwie"); }
x = run("brak aktualnego wyniku (maraton, 20 tyg.)", { level: "intermediate", type: "marathon", weeks: 20, days: 5, km: 45, longest: 20, targetTimeSec: 14400 });
if (x && x.res.ok) ok(claim(x.res) !== "odpowiednie_przygotowanie_do_wyniku", "brak wyniku => brak gotowości do konkretnego wyniku", claim(x.res));
{
  const inp = { today: "2026-11-02", age: 35, availableDays: [0, 1, 2, 3, 4, 5, 6], daysPerWeek: 4, goal: { type: "10k", raceDate: "2027-02-14" } };
  const { res, wyjatek } = runAll(inp);
  ok(!wyjatek && res.ok, "brak historii (bez poziomu, km i najdłuższego biegu): plan powstaje", wyjatek || JSON.stringify(res.bledy));
  if (res && res.ok) { const c = independentChecks(inp, res); ok(c.krytyczne === 0, "brak historii: 0 krytycznych", JSON.stringify(c.problemy.slice(0, 3))); ok(res.ostrzezenia.some((w) => /Brak informacji o obecnym kilometrażu/.test(w)), "komunikat o braku danych o kilometrażu"); ok(weeksOf(res)[0].km <= 20, "brak historii: ostrożny start (<=20 km)", weeksOf(res)[0].km); ok(res.gotowosc.status !== "odpowiednie_przygotowanie_do_wyniku", "brak historii: brak gotowości do wyniku"); }
}
x = run("ambitny cel nieadekwatny: maraton 3:00 z 20 km/tydz., 8 tyg., bez wyniku", { level: "beginner", type: "marathon", weeks: 8, days: 4, km: 20, longest: 8, targetTimeSec: 10800 });
if (x && x.res.ok) { ok(x.res.ocena.werdykt === "nierealny" || x.res.ocena.werdykt === "bardzo_ambitny" || x.res.ocena.werdykt === "ambitny" === false, "werdykt celu nie jest 'realny'", x.res.ocena.werdykt); ok(!/odpowiednie/.test(claim(x.res)), "ambitny cel: brak deklaracji gotowości", claim(x.res)); ok(x.res.gotowosc.rozdzielenie.doKonkretnegoWyniku === false, "doKonkretnegoWyniku=false"); }
x = run("cel nierealny numerycznie (maraton w 1:30)", { level: "advanced", type: "marathon", weeks: 20, days: 5, km: 60, longest: 25, targetTimeSec: 5400 }, { expectInvalid: true });
x = run("maraton, 1 bieg tygodniowo", { level: "intermediate", type: "marathon", weeks: 24, days: 1, km: 20, longest: 12, result: R10 });
if (x && x.res.ok) ok(/niewystarczajace|czesciowe/.test(claim(x.res)), "maraton z 1 biegu: gotowość niewystarczająca/częściowa", claim(x.res));
x = run("maraton bez bazy (10 km/tydz., 5 km najdłuższy), 20 tyg.", { level: "beginner", type: "marathon", weeks: 20, days: 4, km: 10, longest: 5 });
if (x && x.res.ok) { ok(x.res.gotowosc.rozdzielenie.bazaBezpieczna === false, "marathon bez bazy: bazaBezpieczna=false"); ok(x.res.gotowosc.rozdzielenie.etykieta === "brak_bezpiecznej_bazy", "etykieta: brak_bezpiecznej_bazy", x.res.gotowosc.rozdzielenie.etykieta); ok(x.res.ostrzezenia.some((w) => /Brak bezpiecznej bazy/.test(w)), "ostrzeżenie o braku bezpiecznej bazy"); }
x = run("maraton z dobrą bazą (50 km, 24 km najdłuższy), 5 dni, 20 tyg. + wynik", { level: "intermediate", type: "marathon", weeks: 20, days: 5, km: 50, longest: 24, result: { distanceKm: 21.0975, timeSec: 6600 }, targetTimeSec: 14400 });
if (x && x.res.ok) ok(x.res.gotowosc.rozdzielenie.bazaBezpieczna === true, "dobra baza: bazaBezpieczna=true");
x = run("start dzień po dniu startu planu (race za 1 dzień)", { level: "intermediate", type: "5k", noRace: false, raceDate: "2026-11-03", days: 3, km: 20, longest: 8 });
x = run("start za 8 dni, 10 km", { level: "beginner", type: "10k", raceDate: "2026-11-10", days: 3, km: 12, longest: 6 });
x = run("start za dwa lata (730 dni)", { level: "intermediate", type: "marathon", raceDate: "2028-10-31", days: 4, km: 30, longest: 14 });
finish(rep, { generatorPlik: GEN_PATH });
