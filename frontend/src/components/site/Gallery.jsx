import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { Reveal, Eyebrow } from "./Reveal";
import { api, photoSrc, FALLBACK_PHOTOS } from "@/lib/api";

const TABS = [["bus", "Ford Tourneo Custom"], ["garden", "Maszyny Weibang"], ["all", "Wszystkie"]];

const Lightbox = ({ items, index, setIndex }) => {
  const close = useCallback(() => setIndex(null), [setIndex]);
  const step = useCallback((d) => setIndex((i) => (i + d + items.length) % items.length), [items.length, setIndex]);
  useEffect(() => {
    const on = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [close, step]);
  const item = items[index];
  if (!item) return null;
  return (
    <div data-testid="gallery-lightbox" className="fixed inset-0 z-[80] flex items-center justify-center bg-[#000000]/95 p-4 backdrop-blur-md" onClick={close}>
      <button data-testid="lightbox-close" aria-label="Zamknij" onClick={close} className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X /></button>
      <button data-testid="lightbox-prev" aria-label="Poprzednie" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"><ChevronLeft /></button>
      <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <img src={photoSrc(item.src)} alt={item.caption || "Zdjęcie"} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
        <figcaption className="mt-4 flex justify-between gap-4 font-mono text-xs text-zinc-300"><span>{item.caption}</span><span>{index + 1} / {items.length}</span></figcaption>
      </figure>
      <button data-testid="lightbox-next" aria-label="Następne" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"><ChevronRight /></button>
    </div>
  );
};

export const Gallery = () => {
  const [photos, setPhotos] = useState(FALLBACK_PHOTOS);
  const [tab, setTab] = useState("bus");
  const [index, setIndex] = useState(null);
  useEffect(() => {
    api.get("/gallery").then((r) => { if (Array.isArray(r.data) && r.data.length) setPhotos(r.data); }).catch(() => {});
  }, []);
  const items = tab === "all" ? photos : photos.filter((p) => p.category === tab);

  return (
    <section id="galeria" data-testid="gallery-section" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow tone="green">Galeria</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Prawdziwe zdjęcia. <span className="text-zinc-400">Prawdziwy sprzęt.</span></h2>
          </div>
          <div className="flex flex-wrap gap-2" role="tablist">
            {TABS.map(([id, label]) => (
              <button key={id} role="tab" aria-selected={tab === id} data-testid={`gallery-tab-${id}`} onClick={() => setTab(id)} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${tab === id ? "bg-white text-[#0A0A0A]" : "border border-white/15 text-zinc-200 hover:bg-white/10"}`}>{label}</button>
            ))}
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <motion.button
              key={p.id}
              layout
              data-testid={`gallery-item-${i}`}
              onClick={() => setIndex(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
              className={`group relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#141414] text-left ${i === 0 && items.length > 2 ? "sm:col-span-2 sm:aspect-[16/9] lg:aspect-auto lg:row-span-2" : ""}`}
            >
              <img src={photoSrc(p.src)} alt={p.caption || "Zdjęcie z galerii"} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <span className="text-sm font-medium text-white">{p.caption}</span>
                <Expand className="h-5 w-5 shrink-0 text-white/80" />
              </div>
            </motion.button>
          ))}
        </div>
        {items.length === 0 && <p data-testid="gallery-empty" className="text-zinc-400">Zdjęcia pojawią się wkrótce.</p>}
      </div>
      {index !== null && <Lightbox items={items} index={index} setIndex={setIndex} />}
    </section>
  );
};
