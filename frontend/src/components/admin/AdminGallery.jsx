import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api, formatErr, photoSrc } from "@/lib/api";

const CATS = [["bus", "Bus — Ford Tourneo Custom"], ["garden", "Maszyny ogrodnicze"]];

const PhotoRow = ({ p, i, total, move, remove, saveCaption }) => {
  const [cap, setCap] = useState(p.caption || "");
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0A0A0A] p-3 sm:flex-row sm:items-center" data-testid={`admin-photo-${i}`}>
      <span className="font-mono text-sm text-zinc-300">{String(i + 1).padStart(2, "0")}</span>
      <img src={photoSrc(p.src)} alt="" className="h-24 w-full rounded-xl object-cover sm:h-16 sm:w-24" />
      <input data-testid={`admin-photo-caption-${i}`} className="field flex-1" value={cap} placeholder="Podpis zdjęcia" onChange={(e) => setCap(e.target.value)} onBlur={() => cap !== (p.caption || "") && saveCaption(p.id, cap)} />
      <div className="flex gap-1">
        <button data-testid={`admin-photo-up-${i}`} aria-label="W górę" disabled={i === 0} onClick={() => move(i, -1)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
        <button data-testid={`admin-photo-down-${i}`} aria-label="W dół" disabled={i === total - 1} onClick={() => move(i, 1)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
        <button data-testid={`admin-photo-delete-${i}`} aria-label="Usuń" onClick={() => remove(p.id)} className="grid h-10 w-10 place-items-center rounded-full text-red-300 hover:bg-red-500/15"><Trash2 className="h-4 w-4" /></button>
      </div>
    </li>
  );
};

export const AdminGallery = () => {
  const [cat, setCat] = useState("bus");
  const [all, setAll] = useState([]);
  const [busy, setBusy] = useState(false);
  const input = useRef(null);
  const load = () => api.get("/gallery").then((r) => setAll(Array.isArray(r.data) ? r.data : [])).catch(() => toast.error("Nie udało się pobrać galerii"));
  useEffect(() => { load(); }, []);
  const items = all.filter((p) => p.category === cat);

  const upload = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("category", cat);
    Array.from(files).forEach((f) => fd.append("files", f));
    try {
      await api.post("/admin/gallery", fd);
      toast.success(`Dodano zdjęć: ${files.length}`);
      load();
    } catch (e) {
      toast.error(formatErr(e.response?.data?.detail));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  const move = async (i, d) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setAll([...all.filter((p) => p.category !== cat), ...next]);
    await api.put("/admin/gallery/reorder", { category: cat, ids: next.map((p) => p.id) }).catch(() => toast.error("Błąd zapisu kolejności"));
  };
  const remove = async (id) => {
    if (!window.confirm("Usunąć to zdjęcie z galerii?")) return;
    await api.delete(`/admin/gallery/${id}`).then(() => { toast.success("Usunięto"); load(); }).catch(() => toast.error("Błąd usuwania"));
  };
  const saveCaption = (id, caption) => api.patch(`/admin/gallery/${id}`, { caption }).then(() => toast.success("Zapisano podpis")).catch(() => toast.error("Błąd zapisu"));

  return (
    <div className="rounded-3xl border border-white/10 bg-[#141414] p-4 sm:p-6" data-testid="admin-gallery">
      <div className="flex flex-wrap gap-2">
        {CATS.map(([id, label]) => (
          <button key={id} data-testid={`admin-gallery-cat-${id}`} onClick={() => setCat(id)} className={`rounded-full px-4 py-2 text-sm font-semibold ${cat === id ? "bg-white text-[#0A0A0A]" : "border border-white/15 text-zinc-200 hover:bg-white/10"}`}>{label}</button>
        ))}
      </div>
      <label data-testid="admin-gallery-dropzone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }} className="mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 p-8 text-center hover:border-zinc-400">
        {busy ? <Loader2 className="h-8 w-8 animate-spin text-zinc-400" /> : <Upload className="h-8 w-8 text-zinc-400" />}
        <span className="font-semibold">{busy ? "Wysyłanie…" : "Kliknij lub upuść zdjęcia (można kilka naraz)"}</span>
        <span className="text-sm text-zinc-400">JPG, PNG, WEBP · max 15 MB / plik</span>
        <input ref={input} data-testid="admin-gallery-file-input" type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} disabled={busy} />
      </label>
      <ul className="mt-6 space-y-3">
        {items.map((p, i) => <PhotoRow key={p.id} p={p} i={i} total={items.length} move={move} remove={remove} saveCaption={saveCaption} />)}
        {items.length === 0 && <li className="text-sm text-zinc-400">Brak zdjęć w tej kategorii.</li>}
      </ul>
    </div>
  );
};
