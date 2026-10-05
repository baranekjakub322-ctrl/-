import { useEffect, useMemo, useState } from "react";
import { addDays, differenceInCalendarDays, format, isWithinInterval, parseISO, startOfToday } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarRange, Send, AlertTriangle } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { RentCalendar } from "./RentCalendar";
import { api } from "@/lib/api";
import { busQuote, zl } from "@/lib/pricing";

const useMonths = () => {
  const [m, setM] = useState(2);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const on = () => setM(mq.matches ? 2 : 1);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
};

const fmt = (d) => format(d, "d MMM yyyy", { locale: pl });

export const Availability = ({ onInquiry }) => {
  const [raw, setRaw] = useState([]);
  const [range, setRange] = useState();
  const months = useMonths();
  useEffect(() => {
    api.get("/bookings").then((r) => setRaw(Array.isArray(r.data) ? r.data : [])).catch(() => setRaw([]));
  }, []);
  const booked = useMemo(() => raw.map((b) => ({ from: parseISO(b.start), to: parseISO(b.end) })), [raw]);
  const today = startOfToday();

  const days = range?.from ? differenceInCalendarDays(range.to ?? range.from, range.from) + 1 : 0;
  const clash = useMemo(() => {
    if (!range?.from) return false;
    for (let i = 0; i < days; i++) {
      const d = addDays(range.from, i);
      if (booked.some((b) => isWithinInterval(d, { start: b.from, end: b.to }))) return true;
    }
    return false;
  }, [range, days, booked]);
  const q = days ? busQuote(days) : null;

  const send = () => {
    const to = range.to ?? range.from;
    onInquiry({ from: format(range.from, "yyyy-MM-dd"), to: format(to, "yyyy-MM-dd"), service: "bus", message: `Dzień dobry, chciałbym zarezerwować Forda Tourneo Custom w terminie ${fmt(range.from)} – ${fmt(to)} (${days} dni).` });
  };

  return (
    <section id="kalendarz" data-testid="availability-section" className="relative bg-[#050505] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Kalendarz dostępności</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Sprawdź wolne terminy busa.</h2>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-zinc-300 lg:col-span-5 lg:justify-end">
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-white/15" />Wolny</span>
            <span className="flex items-center gap-2"><i className="legend-booked h-3 w-3 rounded-sm" />Zajęty</span>
            <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-sm bg-white" />Twój wybór</span>
          </div>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="rounded-3xl border border-white/10 bg-[#141414] p-4 sm:p-8 lg:col-span-8" data-testid="availability-calendar">
            <RentCalendar mode="range" booked={booked} months={months} selected={range} onSelect={setRange} disabled={[{ before: today }, ...booked]} fromMonth={today} />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col rounded-3xl border border-zinc-400/30 bg-gradient-to-b from-zinc-500/10 to-transparent p-6 sm:p-8 lg:col-span-4">
            <CalendarRange className="h-8 w-8 text-zinc-300" />
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-zinc-400">Wybrany termin</p>
            <p data-testid="availability-selected-range" className="mt-2 font-display text-2xl font-bold text-white">
              {range?.from ? `${fmt(range.from)} – ${fmt(range.to ?? range.from)}` : "Wybierz daty w kalendarzu"}
            </p>
            {q && !clash && (
              <p data-testid="availability-estimate" className="mt-4 text-zinc-300">{days} {days === 1 ? "doba" : "dni"} · orientacyjnie <span className="font-semibold text-white">{zl(q.total)}</span> · limit {q.limit} km</p>
            )}
            {clash && (
              <p data-testid="availability-clash-warning" className="mt-4 flex gap-2 rounded-xl bg-red-500/15 p-3 text-sm text-red-200"><AlertTriangle className="h-4 w-4 shrink-0" />Wybrany zakres zawiera zajęte dni. Wybierz inny termin.</p>
            )}
            <div className="mt-auto pt-8">
              <button data-testid="availability-reserve-button" disabled={!range?.from || clash} onClick={send} className="btn-amber w-full justify-center disabled:opacity-40">
                <Send className="h-4 w-4" /> Zapytaj o ten termin
              </button>
              <p className="mt-3 text-xs text-zinc-400">Kalendarz dotyczy busa. Dostępność maszyn ogrodniczych potwierdzamy telefonicznie.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
