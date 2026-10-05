import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDownRight, CalendarCheck, Phone } from "lucide-react";
import { PHONE, TEL, scrollToId } from "@/lib/api";

const LINES = [
  [{ t: "Wynajem komfortowego" }],
  [{ t: "busa " }, { t: "8-osobowego", c: "text-zinc-400" }],
  [{ t: "oraz profesjonalnego" }],
  [{ t: "sprzętu " }, { t: "ogrodniczego", c: "text-outline-strong" }],
];
const ease = [0.16, 1, 0.3, 1];

const HeroVisual = () => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={reset} className="relative [perspective:1400px]" data-testid="hero-visual">
      <motion.div style={{ rotateX: rotX, rotateY: rotY }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.5, ease }} className="relative [transform-style:preserve-3d]">
        <div className="clip-speed relative aspect-[5/4] overflow-hidden bg-zinc-900 sm:aspect-[16/12]">
          <motion.img style={{ y: imgY }} src="/img/bus.webp" alt="Czarny Ford Tourneo Custom 8-osobowy" className="absolute inset-0 h-[118%] w-full scale-110 object-cover object-[60%_50%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/90">Ford Tourneo Custom · 8 miejsc</div>
        </div>
        <motion.div style={{ y: cardY, translateZ: 60 }} className="absolute -bottom-10 -right-3 w-[36%] rotate-[4deg] overflow-hidden rounded-2xl border-4 border-[#0A0A0A] shadow-2xl shadow-black/60 sm:-right-4 2xl:-right-8">
          <img src="/img/aerator.webp" alt="Aerator Weibang" className="aspect-[4/5] w-full object-cover" />
          <span className="absolute left-2 top-2 rounded-full bg-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A]">Weibang</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Hero = () => (
  <section id="start" data-testid="hero-section" className="relative overflow-hidden pb-24 pt-32 sm:pt-36 lg:pb-32 lg:pt-40">
    <div className="hero-glow pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px]" />
    <div className="grid-lines pointer-events-none absolute inset-0 opacity-40" />
    <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-7">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-200">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-white" /></span>
          Wypożyczalnia JaroSpeedRent
        </motion.p>
        <h1 data-testid="hero-heading" className="font-display text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl lg:text-[3.5rem] xl:text-[4.1rem]">
          {LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden pb-[0.08em]">
              <motion.span className="block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, delay: 0.15 + i * 0.11, ease }}>
                {line.map((w) => <span key={w.t} className={w.c}>{w.t}</span>)}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.75, ease }}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Ford Tourneo Custom na rodzinne wyjazdy, wakacje i delegacje — oraz spalinowe maszyny Weibang, które przywrócą Twój trawnik do formy.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button data-testid="hero-check-availability-button" onClick={() => scrollToId("kalendarz")} className="btn-amber btn-lg">
              <CalendarCheck className="h-5 w-5" /> Sprawdź dostępność
            </button>
            <button data-testid="hero-reserve-button" onClick={() => scrollToId("kalendarz")} className="btn-ghost btn-lg">
              Zarezerwuj <ArrowDownRight className="h-5 w-5" />
            </button>
            <a href={TEL} data-testid="hero-call-link" className="ml-1 inline-flex items-center gap-2 font-mono text-sm text-zinc-200 underline-offset-4 hover:text-white hover:underline">
              <Phone className="h-4 w-4 text-zinc-400" /> {PHONE}
            </a>
          </div>
          <dl className="mt-14 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-y border-white/10">
            {[["8", "miejsc w busie"], ["350", "km / doba"], ["2", "maszyny Weibang"]].map(([n, l]) => (
              <div key={l} className="px-4 py-5 first:pl-0">
                <dt className="font-display text-3xl font-extrabold text-white sm:text-4xl">{n}</dt>
                <dd className="mt-1 text-xs text-zinc-400 sm:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
      <div className="lg:col-span-5">
        <HeroVisual />
      </div>
    </div>
  </section>
);
