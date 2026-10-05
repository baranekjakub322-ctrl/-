const WORDS = ["Bezpieczny transport", "Ford Tourneo Custom", "Wygoda i komfort", "Wertykulator Weibang", "Punktualność", "Aerator rurkowy", "Wyjazdy rodzinne", "Zdrowy trawnik", "Delegacje"];

const Star = () => (
  <svg viewBox="0 0 24 24" className="mx-8 h-6 w-6 shrink-0 text-zinc-500 sm:mx-12 sm:h-8 sm:w-8" aria-hidden="true">
    <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
  </svg>
);

export const Marquee = () => (
  <section data-testid="editorial-marquee" aria-label="Zastosowania" className="relative overflow-hidden border-y border-white/10 bg-[#050505] py-8 sm:py-10">
    <div className="marquee-track flex w-max">
      {[0, 1].map((k) => (
        <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
          {WORDS.map((w, i) => (
            <span key={w} className="flex items-center">
              <span className={`font-display text-4xl font-extrabold uppercase tracking-tight sm:text-6xl lg:text-7xl ${i % 2 ? "text-outline" : "text-white"}`}>{w}</span>
              <Star />
            </span>
          ))}
        </div>
      ))}
    </div>
  </section>
);
