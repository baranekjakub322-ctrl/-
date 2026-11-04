// V22: conservative evidence and discipline-specific policies; no scoring dependency.
export function evidenceInput(input) {
  const p = { ...input, goal: { ...input.goal } }, notes = [];
  if (input.recentWeeklyKm?.length) {
    const a = input.recentWeeklyKm.map(Number); // oldest -> newest, completed weeks, zeros count
    const mean = a.reduce((s, x) => s + x, 0) / a.length;
    const tail = a.slice(-2).reduce((s, x) => s + x, 0) / Math.min(2, a.length);
    p.currentWeeklyKm = Math.min(Number(input.currentWeeklyKm ?? mean), mean, tail);
    p.longestRecentRun = Math.min(Number(input.longestRecentRun || 0), p.currentWeeklyKm);
    notes.push(`Historia ukończonych tygodni: baza ${p.currentWeeklyKm.toFixed(1)} km; uwzględniono również tygodnie zerowe i spadek regularności.`);
  }
  const ageDays = (date) => (Date.parse(input.today) - Date.parse(date)) / 86400000;
  if (p.bestResult?.date && ageDays(p.bestResult.date) > 365) {
    delete p.bestResult;
    notes.push('Wynik starszy niż rok pominięto przy wyznaczaniu intensywności; potrzebny aktualny test.');
  }
  if (p.records) p.records = p.records.filter(r => !r.date || ageDays(r.date) <= 365);
  // Finishing has no target-time pressure even if a stale UI sends a time.
  if (p.goal.mode === 'finish') { delete p.goal.targetTimeSec; p.trzymajCel = false; }
  return { input: p, notes };
}

export function qualityPolicy(I, phase, k, recovery, raceWeek, lateBase) {
  if (I.daysPerWeek <= 1 || I.injuries || Number(I.breakDays ?? I.przerwaDni) >= 28 && k < 4 || I.currentWeeklyKm < 12 || I.experienceMonths != null && I.experienceMonths < 3) return [];
  if (I.daysPerWeek === 2) {
    if (recovery || raceWeek || phase === 'base' || phase === 'taper' || k % 2 === 0) return [];
    if (I.goal.type === 'marathon') return []; // base alternative, never simulate marathon readiness
    if (I.goal.type === 'half') return k % 4 === 3 ? ['tempo'] : [];
    return I.goal.type === '5k' && I.level !== 'beginner' && k % 4 === 3 ? ['interval'] : ['tempo'];
  }
  if (I.goal.type === 'marathon') {
    if (recovery || raceWeek || phase === 'base') return [];
    if (phase === 'taper') return ['tempo'];
    const adapted = I.currentWeeklyKm >= 35 && I.longestRecentRun >= 16 && I.daysPerWeek >= 4;
    if (!adapted) return k % 2 ? ['tempo'] : [];
    // Specific endurance only after foundation; a finishing plan rotates MP and threshold.
    return phase === 'peak' || k >= 4 && k % 2 ? ['racepace'] : ['tempo'];
  }
  return null; // V21 policy for remaining profiles
}

export function marathonModel(I) {
  if (I.goal.type !== 'marathon') return null;
  const adapted = I.currentWeeklyKm >= 35 && I.longestRecentRun >= 16 && I.daysPerWeek >= 4;
  return {
    tryb: !adapted ? 'odbudowa_bazy' : I.goal.targetTimeSec ? 'wynik' : 'ukonczenie',
    bazaPotwierdzona: adapted,
    limitDlugiegoMin: I.level === 'beginner' ? 180 : 195,
    odzywianie: 'Na długich biegach ćwicz tolerowane 30–60 g węglowodanów/h i indywidualne nawodnienie; bez eksperymentów na zawodach.',
    zastrzezenie: 'Heurystyka treningowa, bez gwarancji ukończenia; przy braku bazy wybierz późniejszy start lub krótszy dystans.'
  };
}

const paceSeconds = value => { const m=String(value || '').match(/(\d+):(\d{2})/); return m ? +m[1]*60 + +m[2] : null; };
export function effortFor(t, type) {
  return ({regeneracja:2,latwy:3,marszobieg:2,dlugi:4,tempo:7,interwaly:8,podbiegi:8,tempo_startowe:type==='marathon'?5:type==='half'?6:8,test:8,ostrzenie:5,sila:4,cross:3})[t.podtyp] ?? 3;
}
// Minutes × estimated effort. Quality's warm-up/cool-down are easy, not threshold.
export function sessionLoad(t,type) {
  const rpe=effortFor(t,type), minutes=t.czas_min || 0;
  if (!['tempo','interwaly','podbiegi','tempo_startowe','test','ostrzenie'].includes(t.podtyp)) return Math.round(minutes*rpe);
  let work=0;
  for(const s of t.kroki || []) {
    if (!/Część główna|Blok |Odcinki|Podbiegi/.test(s.etap || '')) continue;
    const pace=paceSeconds(s.tempo || t.tempo_zakres);
    work += s.czas_min || (pace ? (s.dystans_km || (s.powtorzenia || 0)*(s.dystans_m || 0)/1000)*pace/60 : 0);
  }
  return Math.round(minutes*3 + Math.min(minutes,work)*(rpe-3));
}
