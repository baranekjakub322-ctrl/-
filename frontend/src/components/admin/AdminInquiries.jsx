import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { Phone, Mail, Trash2, CheckCircle2, Circle, CalendarRange } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const fmtDay = (s) => format(parseISO(s), "d MMM yyyy", { locale: pl });
const fmtWhen = (s) => format(parseISO(s), "d MMM yyyy, HH:mm", { locale: pl });

const InquiryCard = ({ q, toggle, remove }) => (
  <li data-testid={`admin-inquiry-${q.id}`} className={`rounded-2xl border p-5 ${q.handled ? "border-white/5 bg-white/[0.02] opacity-70" : "border-white/15 bg-[#141414]"}`}>
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="font-display text-lg font-bold text-white">{q.name}</p>
        <p className="text-xs text-zinc-400">Otrzymano: {fmtWhen(q.created_at)}</p>
      </div>
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">{q.service}</span>
    </div>
    <div className="mt-4 grid gap-2 text-sm text-zinc-200 sm:grid-cols-3">
      <a href={`tel:${q.phone.replace(/\s/g, "")}`} data-testid={`admin-inquiry-phone-${q.id}`} className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4 text-zinc-400" />{q.phone}</a>
      <a href={`mailto:${q.email}`} data-testid={`admin-inquiry-email-${q.id}`} className="flex min-w-0 items-center gap-2 hover:text-white"><Mail className="h-4 w-4 shrink-0 text-zinc-400" /><span className="truncate">{q.email}</span></a>
      <span className="flex items-center gap-2"><CalendarRange className="h-4 w-4 text-zinc-400" />{fmtDay(q.from_date)} – {fmtDay(q.to_date)}</span>
    </div>
    {q.driver_age != null && (
      <p data-testid={`admin-inquiry-driver-${q.id}`} className="mt-3 text-sm text-zinc-300">Kierowca: {q.driver_age} lat · prawo jazdy od {q.license_years} lat · państwa: {q.countries || "—"}</p>
    )}
    {q.message && <p className="mt-4 whitespace-pre-line rounded-xl bg-black/40 p-3 text-sm text-zinc-200">{q.message}</p>}
    <div className="mt-4 flex flex-wrap gap-2">
      <button data-testid={`admin-inquiry-toggle-${q.id}`} onClick={() => toggle(q)} className="btn-ghost !px-4 !py-2">
        {q.handled ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}{q.handled ? "Obsłużone" : "Oznacz jako obsłużone"}
      </button>
      <button data-testid={`admin-inquiry-delete-${q.id}`} onClick={() => remove(q.id)} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/15"><Trash2 className="h-4 w-4" />Usuń</button>
    </div>
  </li>
);

export const AdminInquiries = () => {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("new");
  const load = () => api.get("/admin/inquiries").then((r) => setList(Array.isArray(r.data) ? r.data : [])).catch(() => toast.error("Nie udało się pobrać zapytań"));
  useEffect(() => { load(); }, []);
  const toggle = (q) => api.patch(`/admin/inquiries/${q.id}`, { handled: !q.handled }).then(load).catch(() => toast.error("Błąd zapisu"));
  const remove = (id) => {
    if (!window.confirm("Usunąć to zapytanie?")) return;
    api.delete(`/admin/inquiries/${id}`).then(() => { toast.success("Usunięto"); load(); }).catch(() => toast.error("Błąd usuwania"));
  };
  const fresh = list.filter((q) => !q.handled).length;
  const shown = filter === "new" ? list.filter((q) => !q.handled) : list;
  return (
    <div data-testid="admin-inquiries">
      <div className="flex flex-wrap gap-2">
        {[["new", `Nowe (${fresh})`], ["all", `Wszystkie (${list.length})`]].map(([id, label]) => (
          <button key={id} data-testid={`admin-inquiries-filter-${id}`} onClick={() => setFilter(id)} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === id ? "bg-white text-[#0A0A0A]" : "border border-white/15 text-zinc-200 hover:bg-white/10"}`}>{label}</button>
        ))}
      </div>
      <ul className="mt-6 space-y-3">
        {shown.map((q) => <InquiryCard key={q.id} q={q} toggle={toggle} remove={remove} />)}
        {shown.length === 0 && <li data-testid="admin-inquiries-empty" className="text-sm text-zinc-400">{filter === "new" ? "Brak nowych zapytań." : "Brak zapytań."}</li>}
      </ul>
    </div>
  );
};
