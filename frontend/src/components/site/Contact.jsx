import { useEffect, useState } from "react";
import { Phone, Mail, Send, Copy, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { PHONE, TEL, EMAIL } from "@/lib/api";

const SERVICES = { bus: "Ford Tourneo Custom (8 os.)", wert: "Wertykulator Weibang", aer: "Aerator Weibang", mix: "Kilka pozycji" };
const EMPTY = { name: "", phone: "", service: "bus", from: "", to: "", message: "" };

const Field = ({ label, children }) => (
  <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-300">{label}</span>{children}</label>
);

const InquiryForm = ({ prefill }) => {
  const [f, setF] = useState(EMPTY);
  const [error, setError] = useState("");
  useEffect(() => {
    if (prefill) setF((s) => ({ ...s, ...prefill }));
  }, [prefill]);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.phone.trim()) { setError("Podaj imię i numer telefonu."); return; }
    setError("");
    const body = [`Imię: ${f.name}`, `Telefon: ${f.phone}`, `Usługa: ${SERVICES[f.service]}`, f.from && `Termin: ${f.from} – ${f.to || f.from}`, "", f.message].filter((x) => x !== false && x !== "" || x === "").join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Zapytanie o wynajem — ${SERVICES[f.service]}`)}&body=${encodeURIComponent(body)}`;
  };
  return (
    <form onSubmit={submit} data-testid="inquiry-form" className="rounded-3xl bg-[#0A0A0A] p-6 shadow-2xl shadow-black/40 sm:p-8">
      <p className="font-display text-2xl font-bold text-white">Szybkie zapytanie</p>
      <p className="mt-1 text-sm text-zinc-300">Formularz otworzy Twoją pocztę z gotową wiadomością.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Imię"><input data-testid="inquiry-name-input" className="field" value={f.name} onChange={set("name")} placeholder="Jan" /></Field>
        <Field label="Telefon"><input data-testid="inquiry-phone-input" className="field" value={f.phone} onChange={set("phone")} inputMode="tel" placeholder="+48 ..." /></Field>
        <Field label="Usługa">
          <select data-testid="inquiry-service-select" className="field" value={f.service} onChange={set("service")}>
            {Object.entries(SERVICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Od"><input data-testid="inquiry-from-input" type="date" className="field" value={f.from} onChange={set("from")} /></Field>
          <Field label="Do"><input data-testid="inquiry-to-input" type="date" className="field" value={f.to} onChange={set("to")} /></Field>
        </div>
        <div className="sm:col-span-2"><Field label="Wiadomość"><textarea data-testid="inquiry-message-input" rows={4} className="field resize-none" value={f.message} onChange={set("message")} placeholder="Cel wyjazdu, liczba osób, planowana trasa..." /></Field></div>
      </div>
      {error && <p data-testid="inquiry-error" className="mt-4 text-sm text-red-300">{error}</p>}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="submit" data-testid="inquiry-submit-button" className="btn-amber flex-1 justify-center"><Send className="h-4 w-4" /> Wyślij e-mail</button>
        <a href={TEL} data-testid="inquiry-call-button" className="btn-ghost flex-1 justify-center"><Phone className="h-4 w-4" /> Zadzwoń teraz</a>
      </div>
    </form>
  );
};

export const Contact = ({ prefill }) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = () => { navigator.clipboard?.writeText(EMAIL).then(() => setCopied(true)).catch(() => {}); };
  return (
    <section id="kontakt" data-testid="contact-section" className="relative overflow-hidden bg-[#F4F4F5] py-24 text-[#0A0A0A] sm:py-32">
      <div className="pointer-events-none absolute -right-20 top-10 select-none font-display text-[22vw] font-extrabold leading-none text-[#0A0A0A]/[0.07]">JARO</div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em]">Kontakt · rezerwacje</p>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Zadzwoń — ustalimy termin i cenę od ręki.</h2>
          <a href={TEL} data-testid="contact-phone-button" className="group mt-10 flex items-center gap-5 rounded-3xl bg-[#0A0A0A] p-5 text-white transition-transform duration-300 hover:-tranzinc-y-1 sm:p-6">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-[#0A0A0A] sm:h-16 sm:w-16"><Phone className="h-7 w-7 transition-transform group-hover:rotate-12" /></span>
            <span><span className="block font-mono text-xs uppercase tracking-widest text-zinc-300">Telefon</span><span className="font-display text-2xl font-extrabold sm:text-4xl">{PHONE}</span></span>
          </a>
          <div className="mt-4 flex items-center gap-3 rounded-3xl border-2 border-[#0A0A0A] p-5 sm:p-6">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#0A0A0A] text-white"><Mail className="h-6 w-6" /></span>
            <a href={`mailto:${EMAIL}`} data-testid="contact-email-link" className="min-w-0 flex-1"><span className="block font-mono text-xs uppercase tracking-widest">E-mail</span><span className="block truncate font-display text-lg font-bold sm:text-2xl">{EMAIL}</span></a>
            <button data-testid="contact-email-copy-button" onClick={copy} aria-label="Kopiuj e-mail" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0A0A0A]/10 hover:bg-[#0A0A0A]/20">{copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}</button>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-6"><InquiryForm prefill={prefill} /></Reveal>
      </div>
    </section>
  );
};
