import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { PHONE, TEL, scrollToId } from "@/lib/api";

const LINKS = [
  ["oferta", "Oferta"],
  ["cennik", "Cennik"],
  ["kalendarz", "Dostępność"],
  ["galeria", "Galeria"],
  ["kontakt", "Kontakt"],
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };
  return (
    <header data-testid="site-navbar" className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${scrolled || open ? "border-b border-white/10 bg-[#050505]/75 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map(([id, label]) => (
            <button key={id} data-testid={`nav-link-${id}`} onClick={() => go(id)} className="nav-link rounded-full px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:text-white">
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={TEL} data-testid="nav-call-button" className="btn-amber hidden sm:inline-flex">
            <Phone className="h-4 w-4" /> {PHONE}
          </a>
          <a href={TEL} aria-label="Zadzwoń" data-testid="nav-call-icon-mobile" className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0A0A0A] sm:hidden">
            <Phone className="h-5 w-5" />
          </a>
          <button data-testid="nav-mobile-toggle" aria-label="Menu" onClick={() => setOpen((v) => !v)} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white lg:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav data-testid="nav-mobile-menu" className="border-t border-white/10 px-5 pb-6 pt-2 lg:hidden">
          {LINKS.map(([id, label], i) => (
            <button key={id} data-testid={`nav-mobile-link-${id}`} onClick={() => go(id)} className="flex w-full items-baseline gap-4 border-b border-white/5 py-4 text-left font-display text-2xl font-bold text-white">
              <span className="font-mono text-xs text-zinc-300">0{i + 1}</span>
              {label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};
