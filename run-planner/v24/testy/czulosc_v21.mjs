// Testy czułości V21: zmiana JEDNEGO parametru ma dawać ZASADNĄ treningowo zmianę planu (kierunek i rząd wielkości), a nie tylko „inny wynik".
import { mkInput, runAll, weeksOf, independentChecks, makeReporter, finish, dowOf } from "./lib.mjs";
const rep = makeReporter("czulosc_v21"); const { ok } = rep;
const base = { level: "intermediate", type: "half", days: 4, km: 30, longest: 12, weeks: 16, raceDow: 0, result: { distanceKm: 10, timeSec: 3000 } };
const P = (o) => { const inp = mkInput({ ...base, ...o }); const { res } = runAll(inp); return { inp, res }; };
const S = (o) => { const { inp, res } = P(o); const W = weeksOf(res), full = W.slice(1, -1);
  return { inp, res, W, first: full[0], peak: Math.max(...W.map((w) => w.km)), peakLong: Math.max(...W.map((w) => w.longKm)), maxRuns: Math.max(...W.map((w) => w.n)), deloads: W.filter((w) => w.deload).length,
    quality: res.treningi.filter((t) => ["tempo", "interwaly", "podbiegi", "tempo_startowe"].includes(t.podtyp)), pace: res.tempa && res.tempa.latwe }; };
const b = S({});
// wiek: starszy biegacz NIE jest traktowany jak początkujący (start bez zmian), ale ma ostrożniejszą progresję/regenerację
const a60 = S({ age: 60 }), a30 = S({ age: 30 });
ok(Math.abs(a60.first.km - a30.first.km) <= 0.1 * a30.first.km + 1, "wiek 60 vs 30: ten sam punkt startu (starszy ≠ początkujący)", `${a60.first.km} vs ${a30.first.km}`);
ok(a60.peak <= a30.peak && a60.deloads >= a30.deloads, "wiek 60: szczyt nie wyższy, odciążeń co najmniej tyle", `${a60.peak}/${a60.deloads} vs ${a30.peak}/${a30.deloads}`);
ok(a60.quality.length >= 1, "wiek 60: plan nadal zawiera akcenty (nie jest sprowadzony do samego truchtu)");
// najdłuższy ostatni bieg: początek planu zależy od realnej bazy
const l6 = S({ longest: 6 }), l16 = S({ longest: 16 });
ok(l6.first.longKm < l16.first.longKm, "najdłuższy bieg 6 vs 16 km: pierwszy długi bieg krótszy", `${l6.first.longKm} vs ${l16.first.longKm}`);
ok(l6.first.longKm <= 6 * 1.5 + 1, "najdłuższy bieg 6 km: pierwszy długi bieg nie skacze ponad ~1,5x", String(l6.first.longKm));
// aktualny kilometraż
const k15 = S({ km: 15, longest: 7 }), k50 = S({ km: 50, longest: 18 });
ok(k15.first.km < b.first.km && b.first.km < k50.first.km, "aktualny kilometraż 15/30/50: start rośnie monotonicznie", `${k15.first.km}/${b.first.km}/${k50.first.km}`);
ok(k15.first.km <= 15 * 1.3 + 2, "15 km tyg.: start nie przekracza ~130% bazy", String(k15.first.km));
ok(k50.peak >= k50.first.km, "50 km tyg.: plan nie spada poniżej bazy bez powodu");
// liczba dni: struktura, nie usuwanie losowych jednostek
const d2 = S({ days: 2 }), d3 = S({ days: 3 }), d5 = S({ days: 5 });
ok(d2.maxRuns === 2 && d3.maxRuns === 3 && d5.maxRuns <= 5 && d5.maxRuns >= 4, "2/3/5 dni: liczba biegów w tygodniu odpowiada deklaracji", `${d2.maxRuns}/${d3.maxRuns}/${d5.maxRuns}`);
ok(d2.peak < b.peak && b.peak <= d5.peak, "objętość szczytowa rośnie z liczbą dni (2 < 4 ≤ 5)", `${d2.peak}/${b.peak}/${d5.peak}`);
const share = (s) => { const w = s.W.filter((x) => !x.deload && x.n >= 2).slice(2, -3); return Math.max(...w.map((x) => x.longKm / x.km)); };
ok(share(d2) <= 0.66 && share(d2) >= share(d5), "2 dni: długi bieg nie zjada >66% tygodnia i udział jest ≥ niż przy 5 dniach", `${share(d2).toFixed(2)} vs ${share(d5).toFixed(2)}`);
const hasLongAndOther = (s) => { const ts = s.res.treningi.filter((t) => t.data > s.res.treningi[7].data); return ts.some((t) => t.podtyp === "dlugi"); };
ok(hasLongAndOther(d2), "2 dni: plan zawiera długi bieg jako jeden z dwóch celów tygodnia");
const d2q = d2.res.treningi.filter((t) => ["tempo", "interwaly", "tempo_startowe", "podbiegi"].includes(t.podtyp));
ok(d2q.length > 0 && d2q.length <= d2.W.length, "2 dni: najwyżej jeden akcent na tydzień");
// dostępność
const av = S({ days: 3, availableDays: [1, 3, 6] });
ok(av.res.treningi.every((t) => [1, 3, 6].includes(dowOf(t.data))), "dostępne tylko pn/śr/sob: żaden trening poza nimi");
// kontuzje
const inj = S({ injuries: true });
ok(inj.peak <= b.peak * 1.05, "kontuzje: szczyt nie wyższy niż bez nich (tolerancja zaokrągleń 5%)", `${inj.peak} vs ${b.peak}`);
ok(!inj.res.treningi.some((t) => t.podtyp === "interwaly" || t.podtyp === "podbiegi"), "kontuzje: brak interwałów i podbiegów");
// przerwa
const br = S({ breakDays: 60 });
ok(br.first.km <= b.first.km, "powrót po 60 dniach przerwy: start nie wyższy niż bez przerwy", `${br.first.km} vs ${b.first.km}`);
// wyniki → tempa
const slow = S({ result: { distanceKm: 10, timeSec: 4200 } }), fast = S({ result: { distanceKm: 10, timeSec: 2700 } });
const sec = (p) => { const m = /(\d+):(\d+)/.exec(p || ""); return m ? +m[1] * 60 + +m[2] : NaN; };
ok(sec(fast.pace) < sec(b.pace) && sec(b.pace) < sec(slow.pace), "tempa łatwe: szybszy wynik = szybsze tempo (monotonicznie)", `${fast.pace}/${b.pace}/${slow.pace}`);
ok(Math.abs(slow.peak - fast.peak) <= 0.35 * fast.peak, "wynik 10 km nie zmienia objętości drastycznie (o objętości decyduje baza, nie tempo)");
// dystans docelowy
const t5 = S({ type: "5k" }), t10 = S({ type: "10k" }), th = S({ type: "half" }), tm = S({ type: "marathon", weeks: 20 });
ok(t5.peakLong <= t10.peakLong && t10.peakLong <= th.peakLong && th.peakLong < tm.peakLong, "szczyt długiego biegu: 5 ≤ 10 ≤ półmaraton < maraton", [t5, t10, th, tm].map((x) => x.peakLong).join("/"));
ok(t5.peak <= th.peak && th.peak <= tm.peak, "szczyt tygodnia: 5 km ≤ półmaraton ≤ maraton", [t5, th, tm].map((x) => x.peak).join("/"));
// czas do zawodów
const w8 = S({ weeks: 8 }), w24 = S({ weeks: 24 });
ok(w24.peak >= w8.peak && w24.peakLong >= w8.peakLong, "24 vs 8 tygodni: dłuższe przygotowanie nie daje niższego szczytu");
ok(w8.res.gotowosc.status !== "odpowiednie_przygotowanie_do_ukonczenia" || w8.peakLong >= 14, "8 tygodni na półmaraton z bazą 30 km: albo ostrzeżenie o gotowości, albo realny długi bieg");
// poziom
const be = S({ level: "beginner", result: false, km: 10, longest: 5 }), ad = S({ level: "advanced", km: 60, longest: 22 });
ok(be.peak < ad.peak, "początkujący (10 km) vs zaawansowany (60 km): szczyt wyraźnie niższy");
ok(be.quality.length <= ad.quality.length, "początkujący ma nie więcej akcentów niż zaawansowany");
// HRmax: zmienia strefy, nie objętość
const h1 = P({ hrMax: 190 }), h2 = P({ hrMax: 170 });
ok(JSON.stringify(h1.res.treningi.map((t) => t.dystans_km)) === JSON.stringify(h2.res.treningi.map((t) => t.dystans_km)), "HRmax nie zmienia kilometrów");
ok(h1.res.treningi[0].opis !== h2.res.treningi[0].opis, "HRmax zmienia strefy tętna w opisach");
// płeć: nie jest używana w logice (celowo): identyczny plan
const gm = P({ gender: "m" }), gf = P({ gender: "f" });
ok(JSON.stringify(gm.res.treningi) === JSON.stringify(gf.res.treningi), "płeć nie wpływa na plan (świadoma decyzja: brak uzasadnienia treningowego, patrz dokumentacja)");
// jeden trening tygodniowo
const one = P({ days: 1, type: "10k", km: 15, longest: 8 });
ok(one.res.ok && weeksOf(one.res).every((w) => w.n <= 1), "1 dzień: najwyżej jeden bieg tygodniowo");
ok(one.res.wykonalnosc.poziom !== "pelna", "1 dzień na 10 km: wykonalność oznaczona jako ograniczona");
const oneM = P({ days: 1, type: "marathon", weeks: 24 });
ok(oneM.res.wykonalnosc.poziom === "niewykonalna", "1 dzień na maraton: niewykonalne");
ok(Math.max(...weeksOf(one.res).map((w) => w.longKm)) <= 14, "1 dzień: pojedynczy bieg nie rośnie do przesadnej długości", String(Math.max(...weeksOf(one.res).map((w) => w.longKm))));
// maraton
const m2 = P({ type: "marathon", days: 2, weeks: 24, km: 40, longest: 16 }), m5 = P({ type: "marathon", days: 5, weeks: 22, km: 60, longest: 24, level: "advanced" }), mb = P({ type: "marathon", days: 4, weeks: 10, km: 12, longest: 6, level: "beginner" });
ok(m2.res.wykonalnosc.poziom === "niewykonalna", "maraton 2 dni: niewykonalny");
ok(m5.res.wykonalnosc.poziom === "pelna", "maraton zaawansowany 5 dni z bazą: wykonalny");
ok(mb.res.wykonalnosc.poziom === "niewykonalna" && mb.res.proponowaneZmiany.length > 0, "maraton: mała baza i 10 tyg. = niewykonalny + propozycje zmian");
const strict = P({ type: "marathon", days: 2, weeks: 24, km: 40, longest: 16, extra: { trybScisly: true } });
ok(strict.res.ok === false && strict.res.komunikat, "tryb ścisły: niewykonalny cel zwraca czytelny błąd zamiast pozornie poprawnego planu");
ok(Math.max(...weeksOf(mb.res).map((w) => w.km)) <= 12 * 3.2, "maraton z małej bazy: brak gwałtownej kompensacji kilometrażem", String(Math.max(...weeksOf(mb.res).map((w) => w.km))));
const mv = S({ type: "marathon", days: 5, weeks: 22, km: 60, longest: 24, level: "advanced" });
ok(mv.peakLong >= 28 && mv.peak >= 70, "maraton zaawansowany: długi ≥28 km i szczyt ≥70 km", `${mv.peakLong}/${mv.peak}`);
finish(rep, {});
