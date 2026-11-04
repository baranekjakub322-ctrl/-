// The same raw-plan rules are applied to V21 and V22. No generator audit/score is used.
import { independentChecks, weeksOf, diffD } from './lib.mjs';
const Q = new Set(['tempo','interwaly','podbiegi','tempo_startowe','test']);
export function evaluate(input, plan) {
  const categories = Object.fromEntries(['bezpieczenstwo','wykonalnosc','progresja','intensywnosc','kalendarz','specyfika','regeneracja','czytelnosc'].map(k => [k, []]));
  const add = (category, code, critical=false) => categories[category].push({code, critical});
  if (!plan.ok) { add('bezpieczenstwo','ODMOWA_LUB_BLAD', true); }
  else {
    const old = independentChecks(input, plan);
    for (const p of old.problemy) {
      const c = /TAPER|DLUGI|GOTOWOSC/.test(p.kod) ? 'specyfika' : /REGENER/.test(p.kod) ? 'regeneracja' : /WZROST|ODCIAZ/.test(p.kod) ? 'progresja' : /DZIEN|MOCNE_DNI|PRZERWA/.test(p.kod) ? 'kalendarz' : 'bezpieczenstwo';
      add(c, p.kod, p.ciezar === 'krytyczny');
    }
    const weeks = weeksOf(plan), actual = Math.max(0, ...weeks.map(w=>w.n));
    if (actual <= 1 && plan.wykonalnosc?.poziom === 'pelna') add('wykonalnosc','JEDEN_BIEG_PELNA',true);
    if (input.goal.type === 'marathon' && actual <= 2 && plan.wykonalnosc?.poziom !== 'niewykonalna') add('wykonalnosc','MARATON_RZADKO',true);
    if (!plan.plan.czestotliwosc || actual < input.daysPerWeek && !plan.ostrzezenia?.length) add('czytelnosc','BRAK_WYJASNIENIA_CZESTOTLIWOSCI');
    if (!input.bestResult && !input.records?.length && !/RPE|orientacyj|szacun|niska/.test(JSON.stringify(plan.tempa))) add('czytelnosc','BRAK_NIEPEWNOSCI_TEMP');
    for (const w of weeks) {
      const runs = w.runs;
      if (runs.length <= 1 && runs.some(t=>Q.has(t.podtyp))) add('intensywnosc','JAKOSC_PRZY_JEDNYM',true);
      if (input.daysPerWeek === 2 && runs.filter(t=>Q.has(t.podtyp)).length > 1) add('intensywnosc','DWA_AKCENTY_DWA_DNI',true);
      for (const t of runs) {
        if (t.podtyp === 'dlugi' && input.goal.type === 'marathon' && t.czas_min > 195) add('bezpieczenstwo','MARATON_PONAD_195_MIN');
        if (Q.has(t.podtyp) && (!t.kroki?.some(s=>s.etap === 'Rozgrzewka') || !t.kroki?.some(s=>s.etap === 'Schłodzenie'))) add('intensywnosc','JAKOSC_BEZ_OPRAWY',true);
        if (t.progresywny && input.daysPerWeek <= 2) add('intensywnosc','DLUGI_MOCNY_RZADKO');
      }
    }
    const adapted = input.goal.type === 'marathon' && input.currentWeeklyKm >= 40 && input.longestRecentRun >= 18 && actual >= 4 && diffD(input.today,input.goal.raceDate) >= 112;
    if (adapted && !plan.treningi.some(t=>t.podtyp==='tempo_startowe')) add('specyfika','BRAK_ODCINKOW_MARATONSKICH');
  }
  const W = Math.max(1,plan.tygodnie?.length || 1);
  const components = Object.fromEntries(Object.entries(categories).map(([k,a])=>[k, +(10*Math.exp(-3*a.reduce((s,p)=>s+(p.critical?1:.25),0)/W)).toFixed(3)]));
  const issues = Object.values(categories).flat();
  return { components, score: +(Object.values(components).reduce((s,x)=>s+x,0)/8).toFixed(3), critical: issues.filter(x=>x.critical).length, warnings: issues.filter(x=>!x.critical).length, issues };
}
