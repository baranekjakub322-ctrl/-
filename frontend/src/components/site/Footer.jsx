import { Phone, Mail, Facebook } from "lucide-react";
import { Logo } from "./Logo";
import { PHONE, TEL, EMAIL } from "@/lib/api";

export const Footer = () => (
  <footer data-testid="site-footer" className="bg-[#000000] pb-28 pt-16 sm:pb-12">
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 sm:px-8 md:flex-row md:items-end md:justify-between">
      <div>
        <Logo testId="footer-logo" />
        <p className="mt-5 max-w-sm text-sm text-zinc-400">Wynajem busa Ford Tourneo Custom (8 osób) oraz profesjonalnego sprzętu ogrodniczego Weibang.</p>
      </div>
      <div className="flex flex-col gap-3 text-sm text-zinc-300">
        <a href={TEL} data-testid="footer-phone-link" className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4 text-zinc-400" />{PHONE}</a>
        <a href={`mailto:${EMAIL}`} data-testid="footer-email-link" className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4 text-zinc-400" />{EMAIL}</a>
        <a href="https://www.facebook.com/profile.php?id=61557774450251" target="_blank" rel="noopener noreferrer" data-testid="footer-facebook" className="flex items-center gap-2 hover:text-white"><Facebook className="h-4 w-4 text-zinc-400" />Facebook: Wypożyczalnia Jarospeedrent</a>
      </div>
    </div>
    <div className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-between gap-4 border-t border-white/10 px-5 pt-6 text-xs text-zinc-400 sm:px-8">
      <span>© 2026 Wypożyczalnia JaroSpeedRent</span>
      <a href="/admin" data-testid="footer-admin-link" className="hover:text-white">Panel administratora</a>
    </div>
  </footer>
);

export const MobileCallBar = () => (
  <div data-testid="mobile-call-bar" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#050505]/90 p-2 backdrop-blur-xl sm:hidden">
    <a href={TEL} data-testid="mobile-call-button" className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-[#0A0A0A]"><Phone className="h-4 w-4" />Zadzwoń</a>
    <a href={`mailto:${EMAIL}`} data-testid="mobile-email-button" className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-bold text-white"><Mail className="h-4 w-4" />E-mail</a>
  </div>
);
