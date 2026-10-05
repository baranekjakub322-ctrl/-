import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatErr } from "@/lib/api";
import { RentCalendar } from "@/components/site/RentCalendar";

const fmt = (s) => format(parseISO(s), "d MMM yyyy", { locale: pl });

export const AdminBookings = () => {
  const [list, setList] = useState([]);
  const [range, setRange] = useState();
  const [note, setNote] = useState("");
  const load = () => api.get("/admin/bookings").then((r) => setList(Array.isArray(r.data) ? r.data : [])).catch(() => toast.error("Nie udało się pobrać rezerwacji"));
  useEffect(() => { load(); }, []);
  const booked = useMemo(() => list.map((b) => ({ from: parseISO(b.start), to: parseISO(b.end) })), [list]);

  const add = async () => {
    if (!range?.from) return;
    try {
      await api.post("/admin/bookings", { start: format(range.from, "yyyy-MM-dd"), end: format(range.to ?? range.from, "yyyy-MM-dd"), note });
      toast.success("Termin oznaczony jako zajęty");
      setRange(undefined);
      setNote("");
      load();
    } catch (e) {
      toast.error(formatErr(e.response?.data?.detail));
    }
  };
  const remove = async (id) => {
    await api.delete(`/admin/bookings/${id}`).then(() => { toast.success("Usunięto"); load(); }).catch(() => toast.error("Błąd usuwania"));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="rounded-3xl border border-white/10 bg-[#141414] p-4 sm:p-6 lg:col-span-7" data-testid="admin-bookings-calendar">
        <p className="mb-4 text-sm text-zinc-300">Zaznacz zakres dat, w którym bus jest zarezerwowany.</p>
        <RentCalendar mode="range" months={1} booked={booked} selected={range} onSelect={setRange} />
        <input data-testid="admin-booking-note-input" className="field mt-4" placeholder="Notatka (widoczna tylko dla Ciebie), np. nazwisko klienta" value={note} onChange={(e) => setNote(e.target.value)} />
        <button data-testid="admin-booking-add-button" disabled={!range?.from} onClick={add} className="btn-amber mt-4 w-full justify-center disabled:opacity-40">
          <Plus className="h-4 w-4" /> Dodaj rezerwację {range?.from ? `(${format(range.from, "d.MM")} – ${format(range.to ?? range.from, "d.MM")})` : ""}
        </button>
      </div>
      <div className="rounded-3xl border border-white/10 bg-[#141414] p-6 lg:col-span-5">
        <h2 className="font-display text-xl font-bold">Zajęte terminy</h2>
        <ul className="mt-4 divide-y divide-white/10" data-testid="admin-bookings-list">
          {list.length === 0 && <li className="py-4 text-sm text-zinc-400">Brak rezerwacji.</li>}
          {list.map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-3 py-3" data-testid={`admin-booking-${b.id}`}>
              <div>
                <p className="font-semibold">{fmt(b.start)} – {fmt(b.end)}</p>
                {b.note && <p className="text-sm text-zinc-400">{b.note}</p>}
              </div>
              <button data-testid={`admin-booking-delete-${b.id}`} aria-label="Usuń" onClick={() => remove(b.id)} className="grid h-10 w-10 place-items-center rounded-full text-red-300 hover:bg-red-500/15"><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
