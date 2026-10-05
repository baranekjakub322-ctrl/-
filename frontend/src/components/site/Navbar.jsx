import { useState } from "react";
import { Phone, Menu, X, Facebook, Star } from "lucide-react";
import { Logo } from "./Logo";
import { PHONE, TEL, scrollToId } from "@/lib/api";

const FB_URL = "https://www.facebook.com/profile.php?id=61557774450251";
const REVIEW_URL = "https://share.google/u0KgpUIosKR71n431";
const ext = { target: "_blank", rel: "noopener noreferrer" };

const LINKS = [
  ["oferta", "Oferta"],
  ["cennik", "Cennik"],
  ["kalendarz", "Dostępność"],
  ["galeria", "Galeria"],
  ["kontakt", "Kontakt"],
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };
  return (
    <header data-testid="site-navbar" className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black">
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
          <a href={FB_URL} {...ext} aria-label="Facebook" title="Facebook" data-testid="nav-facebook-link" className="hidden h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10 md:grid">
            <Facebook className="h-5 w-5" />
          </a>
          <a href={REVIEW_URL} {...ext} data-testid="nav-google-review-link" className="hidden h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 md:inline-flex">
            <Star className="h-4 w-4" /> Oceń nas
          </a>
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
          {LINKS.map(([id, label]) => (
            <button key={id} data-testid={`nav-mobile-link-${id}`} onClick={() => go(id)} className="flex w-full items-baseline gap-4 border-b border-white/5 py-4 text-left font-display text-2xl font-bold text-white">
              {label}
            </button>
          ))}
          <div className="mt-5 grid grid-cols-2 gap-2">
            <a href={FB_URL} {...ext} data-testid="nav-mobile-facebook-link" className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-semibold text-white"><Facebook className="h-4 w-4" />Facebook</a>
            <a href={REVIEW_URL} {...ext} data-testid="nav-mobile-google-review-link" className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm font-semibold text-white"><Star className="h-4 w-4" />Oceń nas w Google</a>
          </div>
        </nav>
      )}
    </header>
  );
};
