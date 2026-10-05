import { useEffect, useState } from "react";
import { LogOut, CalendarDays, Images, ArrowLeft, Inbox } from "lucide-react";
import { api } from "@/lib/api";
import { Logo } from "@/components/site/Logo";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminBookings } from "@/components/admin/AdminBookings";
import { AdminGallery } from "@/components/admin/AdminGallery";
import { AdminInquiries } from "@/components/admin/AdminInquiries";

const TABS = [["inquiries", "Zapytania", Inbox], ["bookings", "Rezerwacje busa", CalendarDays], ["gallery", "Galeria zdjęć", Images]];
const PANELS = { inquiries: AdminInquiries, bookings: AdminBookings, gallery: AdminGallery };

export default function Admin() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("inquiries");
  useEffect(() => {
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => setUser(false));
  }, []);
  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    setUser(false);
  };

  if (user === null) return <div className="grid min-h-screen place-items-center bg-[#0A0A0A] text-zinc-300" data-testid="admin-loading">Ładowanie…</div>;
  if (!user) return <AdminLogin onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white" data-testid="admin-dashboard">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <Logo testId="admin-logo" className="h-8" />
          <div className="flex items-center gap-2">
            <a href="/" data-testid="admin-back-to-site" className="btn-ghost !px-3 !py-2"><ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Strona</span></a>
            <button data-testid="admin-logout-button" onClick={logout} className="btn-ghost !px-3 !py-2"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Wyloguj</span></button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Panel administratora</h1>
        <p className="mt-2 text-zinc-300">Zalogowano jako {user.email}</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map(([id, label, I]) => (
            <button key={id} data-testid={`admin-tab-${id}`} onClick={() => setTab(id)} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${tab === id ? "bg-white text-[#0A0A0A]" : "border border-white/15 text-zinc-200 hover:bg-white/10"}`}>
              <I className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
        <div className="mt-8">{(() => { const P = PANELS[tab]; return <P />; })()}</div>
      </main>
    </div>
  );
}
