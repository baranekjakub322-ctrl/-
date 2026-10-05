import { useState } from "react";
import { Minus, Plus, Info, Send, UserRound } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Reveal, Eyebrow } from "./Reveal";
import { RATES, busQuote, zl } from "@/lib/pricing";

const Stepper = ({ value, onChange, min = 0, max = 60, testId }) => (
  <div className="flex items-center rounded-full border border-white/15 bg-white/5">
    <button data-testid={`${testId}-minus`} aria-label="Mniej" onClick={() => onChange(Math.max(min, value - 1))} className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/10"><Minus className="h-4 w-4" /></button>
    <span data-testid={`${testId}-value`} className="w-10 text-center font-mono text-lg font-bold text-white">{value}</span>
    <button data-testid={`${testId}-plus`} aria-label="Więcej" onClick={() => onChange(Math.min(max, value + 1))} className="grid h-10 w-10 place-items-center rounded-full text-white hover:bg-white/10"><Plus className="h-4 w-4" /></button>
  </div>
);

const Row = ({ label, value, testId, strong }) => (
  <div className={`flex items-baseline justify-between gap-4 py-3 ${strong ? "" : "border-b border-dashed border-white/15"}`}>
    <span className="text-sm text-zinc-300">{label}</span>
    <span data-testid={testId} className={`shrink-0 whitespace-nowrap font-mono ${strong ? "text-2xl font-bold text-white sm:text-4xl" : "text-sm text-white"}`}>{value}</span>
  </div>
);

export const Estimator = ({ onInquiry }) => {
  const [busDays, setBusDays] = useState(3);
  const [km, setKm] = useState("");
  const [wert, setWert] = useState(0);
  const [aer, setAer] = useState(0);
  const [driver, setDriver] = useState(false);
  const q = busDays > 0 ? busQuote(busDays, km) : null;
  const busCost = q && !driver ? q.total + q.overCost : 0;
  const total = busCost + wert * RATES.wertykulator + aer * RATES.aerator;

  const send = () => {
    const parts = [];
    if (q) parts.push(`Ford Tourneo Custom${driver ? " Z KIEROWCĄ" : ""}: ${q.days} dni${km ? `, planowane ok. ${km} km` : ""}`);
    if (wert) parts.push(`Wertykulator Weibang: ${wert} dni`);
    if (aer) parts.push(`Aerator Weibang: ${aer} dni`);
    const note = driver ? `\nWynajem busa z kierowcą — proszę o indywidualną wycenę.${total ? `\nSzacunek sprzętu z kalkulatora: ok. ${zl(total)}` : ""}` : `\nSzacunek z kalkulatora: ok. ${zl(total)}`;
    onInquiry({ message: `Dzień dobry, proszę o wycenę:\n- ${parts.join("\n- ")}${note}` });
  };

  return (
    <section id="cennik" data-testid="estimator-section" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-14 max-w-3xl">
          <Eyebrow>Cennik & kalkulator</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Policz orientacyjny koszt wynajmu.</h2>
          <p className="mt-5 text-base text-zinc-300 sm:text-lg">Cena końcowa jest zawsze ustalana indywidualnie — kalkulator pokazuje zarys, od którego zaczynamy rozmowę.</p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="space-y-6 lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-[#141414] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-300">Bus 8-osobowy</p>
                  <h3 className="mt-1 font-display text-2xl font-bold text-white">Ford Tourneo Custom</h3>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span data-testid="calc-bus-days-label" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Wybierz liczbę dni</span>
                  <Stepper value={busDays} onChange={setBusDays} max={60} testId="calc-bus-days" />
                </div>
              </div>
              <input data-testid="calc-bus-days-slider" type="range" min="0" max="30" value={Math.min(busDays, 30)} onChange={(e) => setBusDays(Number(e.target.value))} className="range-amber mt-6 w-full" aria-label="Liczba dni busa" />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[["1 doba", `${RATES.busOneDay} zł`], ["2+ doby", `${RATES.busMultiDay} zł / doba lub mniej`], ["Limit", `${RATES.kmPerDay} km / doba`]].map(([a, b]) => (
                  <div key={a} className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-zinc-400">{a}</p><p className="mt-1 text-sm font-semibold text-white">{b}</p></div>
                ))}
              </div>
              <label className="mt-6 block text-sm text-zinc-300" htmlFor="calc-km">Planowany dystans (km, opcjonalnie)</label>
              <input id="calc-km" data-testid="calc-km-input" inputMode="numeric" value={km} onChange={(e) => setKm(e.target.value.replace(/\D/g, ""))} placeholder="np. 1200" className="field mt-2" />
              <label htmlFor="calc-driver" className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="flex items-start gap-3">
                  <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-zinc-300" />
                  <span><span className="block text-sm font-semibold text-white">Wynajem z kierowcą</span><span className="block text-xs text-zinc-400">Cena ustalana indywidualnie — bez wyliczenia w kalkulatorze</span></span>
                </span>
                <Switch id="calc-driver" data-testid="calc-driver-switch" checked={driver} onCheckedChange={setDriver} />
              </label>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#141414] p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-300">Sprzęt ogrodniczy Weibang</p>
              {[["Wertykulator spalinowy", RATES.wertykulator, wert, setWert, "calc-wert-days"], ["Aerator rurkowy", RATES.aerator, aer, setAer, "calc-aer-days"]].map(([n, r, v, set, id]) => (
                <div key={id} className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 first:border-0">
                  <div><p className="font-semibold text-white">{n}</p><p className="text-sm text-zinc-400">{r} zł / doba</p></div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Liczba dni</span>
                    <Stepper value={v} onChange={set} max={30} testId={id} />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div data-testid="calc-summary" className="receipt sticky top-24 rounded-3xl border border-white/10 bg-[#27272A] p-6 text-white sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-300">Szacunek · Jaro Speed Rent</p>
              <div className="mt-4 rounded-2xl bg-[#0A0A0A] p-5 text-white">
                {q && driver ? (
                  <Row label={`Bus z kierowcą · ${q.days} ${q.days === 1 ? "doba" : "dni"}`} value="wycena indywidualna" testId="calc-bus-total" />
                ) : q ? (
                  <>
                    <Row label={`Bus · ${q.days} × ${zl(q.rate)}`} value={zl(q.total)} testId="calc-bus-total" />
                    <Row label="Limit kilometrów" value={`${new Intl.NumberFormat("pl-PL").format(q.limit)} km`} testId="calc-km-limit" />
                    {q.over > 0 && <Row label={`Nadwyżka · ${new Intl.NumberFormat("pl-PL").format(q.over)} km × ok. 0,40 zł`} value={zl(q.overCost)} testId="calc-km-over-total" />}
                  </>
                ) : <Row label="Bus" value="—" testId="calc-bus-total" />}
                {wert > 0 && <Row label={`Wertykulator · ${wert} × 110 zł`} value={zl(wert * RATES.wertykulator)} testId="calc-wert-total" />}
                {aer > 0 && <Row label={`Aerator · ${aer} × 230 zł`} value={zl(aer * RATES.aerator)} testId="calc-aer-total" />}
                <Row label={driver ? (total ? "Razem ok. (bez busa)" : "Razem") : "Razem ok."} value={driver && !total ? "indywidualnie" : zl(total)} testId="calc-grand-total" strong />
              </div>
              {q?.over > 0 && !driver && (
                <p data-testid="calc-km-over-warning" className="mt-4 rounded-xl bg-white/10 p-3 text-sm text-white">Przekroczenie limitu o {new Intl.NumberFormat("pl-PL").format(q.over)} km — dopłata ok. 0,40 zł/km (ok. {zl(q.overCost)}), ustalana indywidualnie.</p>
              )}
              <p className="mt-4 flex gap-2 text-sm leading-relaxed text-zinc-300"><Info className="mt-0.5 h-4 w-4 shrink-0" />Cena jest orientacyjna i ustalana indywidualnie. Przy dłuższym wynajmie stawka może być niższa niż 250 zł/doba.</p>
              <button data-testid="calc-send-inquiry-button" disabled={total === 0 && !(driver && q)} onClick={send} className="btn-amber mt-6 w-full justify-center disabled:opacity-40">
                <Send className="h-4 w-4" /> Zapytaj o tę wycenę
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
