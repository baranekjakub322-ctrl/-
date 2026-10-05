import { useEffect, useState } from "react";
import { ArrowUpRight, Users, Camera, Gauge, Snowflake, Sprout, Layers, Check, Images } from "lucide-react";
import { Reveal, Eyebrow, useSpotlight } from "./Reveal";
import { scrollToId, api, photoSrc } from "@/lib/api";

const useFirstPhoto = (category, fallback) => {
  const [src, setSrc] = useState(fallback);
  useEffect(() => {
    api.get("/gallery").then((r) => {
      const first = (Array.isArray(r.data) ? r.data : []).find((p) => p.category === category);
      if (first?.src) setSrc(photoSrc(first.src));
    }).catch(() => {});
  }, [category]);
  return src;
};

const openGallery = (cat) => {
  window.dispatchEvent(new CustomEvent("gallery:show", { detail: cat }));
  scrollToId("galeria");
};

const GalleryHint = () => (
  <span className="absolute bottom-4 right-4 z-[2] flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white opacity-90 backdrop-blur transition-opacity group-hover/img:opacity-100"><Images className="h-3.5 w-3.5" />Zobacz galerię</span>
);

const BUS_FEATURES = [
  [Users, "8 miejsc, różne konfiguracje", "Przestronne wnętrze i duży bagażnik"],
  [Gauge, "185 KM + automat", "Dynamiczny silnik i automatyczna skrzynia"],
  [Snowflake, "Klimatyzacja dwustrefowa", "Przyciemniane szyby i rolety w 2. i 3. rzędzie"],
  [Camera, "Kamera i czujniki", "Kamera cofania, czujniki parkowania przód/tył"],
];

const BUS_EXTRAS = ["Android Auto ze sterowaniem głosowym", "Radio z 8\" ekranem dotykowym", "USB dla każdego rzędu", "Gniazdo 12 V w bagażniku i 230 V", "Asystent pasa ruchu", "Tempomat", "Bluetooth", "Dużo uchwytów na napoje i schowków"];

const MachineCard = ({ id, img, title, model, desc, specs, icon: Icon, price }) => {
  const spot = useSpotlight();
  return (
    <article data-testid={`offer-card-${id}`} onMouseMove={spot} className="spot-card group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#141414]">
      <button type="button" data-testid={`offer-${id}-gallery-link`} onClick={() => openGallery(id)} aria-label={`Galeria: ${title}`} className="group/img relative block h-56 w-full shrink-0 cursor-pointer overflow-hidden sm:h-64 lg:h-48">
        <img src={img} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A]">{price}</span>
        <GalleryHint />
      </button>
      <div className="relative flex-1 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-300">Weibang {model}</p>
            <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">{title}</h3>
          </div>
          <Icon className="mt-1 h-6 w-6 shrink-0 text-zinc-300" />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">{desc}</p>
        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          {specs.map(([k, v]) => (
            <div key={k} className="bg-[#141414] px-3 py-2.5">
              <dt className="text-[11px] uppercase tracking-wider text-zinc-400">{k}</dt>
              <dd className="font-mono text-sm font-semibold text-white">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
};

const BusCard = () => {
  const spot = useSpotlight();
  return (
    <article data-testid="offer-card-bus" onMouseMove={spot} className="spot-card group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#141414] lg:row-span-2">
      <button type="button" data-testid="offer-bus-gallery-link" onClick={() => openGallery("bus")} aria-label="Galeria: Ford Tourneo Custom" className="group/img relative block aspect-[16/9] w-full cursor-pointer overflow-hidden lg:aspect-auto lg:min-h-[300px] lg:flex-1">
        <img src="/img/bus.webp" alt="Ford Tourneo Custom" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#0A0A0A]">od 250 zł / doba</span>
        <GalleryHint />
      </button>
      <div className="relative p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-300">Flota · 01</p>
        <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Ford Tourneo Custom</h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">Bezpieczny transport na każdą okazję. Wyjątkowy komfort podróży — idealny na wyjazdy rodzinne, wakacje, wyjazdy firmowe, delegacje i zlecenia okolicznościowe.</p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {BUS_FEATURES.map(([I, t, d]) => (
            <li key={t} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-zinc-300"><I className="h-5 w-5" /></span>
              <span><span className="block text-sm font-semibold text-white">{t}</span><span className="text-sm text-zinc-400">{d}</span></span>
            </li>
          ))}
        </ul>
        <ul data-testid="bus-extras-list" className="mt-6 flex flex-wrap gap-2">
          {BUS_EXTRAS.map((t) => (
            <li key={t} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200"><Check className="h-3.5 w-3.5 text-zinc-300" />{t}</li>
          ))}
        </ul>
        <button data-testid="offer-bus-inquiry-button" onClick={() => scrollToId("kalendarz")} className="btn-amber mt-8">
          Sprawdź wolne terminy <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};

export const Offer = () => {
  const wertImg = useFirstPhoto("wertykulator", "/img/wertykulator.webp");
  return (
  <section id="oferta" data-testid="offer-section" className="relative py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Reveal className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow>Oferta</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Jeden telefon. <span className="text-zinc-400">Bus na trasę albo maszyna na trawnik.</span></h2>
        </div>
        <p className="text-base text-zinc-300 lg:col-span-5 lg:text-lg">Sprawdzony, zadbany sprzęt gotowy do odbioru. Wybierz, czego potrzebujesz — resztę ustalimy indywidualnie.</p>
      </Reveal>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:grid-rows-2">
        <Reveal className="h-full lg:col-span-8 lg:row-span-2"><BusCard /></Reveal>
        <Reveal delay={0.1} className="h-full lg:col-span-4">
          <MachineCard id="wertykulator" img={wertImg} icon={Sprout} price="110 zł / doba" model="WB486CRB" title="Wertykulator spalinowy" desc="Skutecznie usuwa filc i mech oraz napowietrza glebę. Solidna, stalowa obudowa." specs={[["Szerokość", "47 cm"], ["Regulacja", "do 32 mm"], ["Noże", "28 uchylnych"], ["Waga", "56 kg"]]} />
        </Reveal>
        <Reveal delay={0.2} className="h-full lg:col-span-4">
          <MachineCard id="aerator" img="/img/aerator.webp" icon={Layers} price="230 zł / doba" model="WB457AB" title="Aerator spalinowy rurkowy" desc="Głęboko nakłuwa i rozluźnia zbitą glebę, poprawiając ukorzenienie trawy." specs={[["Rurki", "24 szt."], ["Głębokość", "do 7 cm"], ["Szerokość", "45 cm"], ["Wydajność", "1600 m²/h"]]} />
        </Reveal>
      </div>
    </div>
  </section>
  );
};
