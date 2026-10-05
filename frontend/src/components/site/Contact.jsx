import { useEffect, useState } from "react";
import { Phone, Mail, Send, Copy, Check, MessageSquare, MessageCircle, Facebook, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { PHONE, TEL, EMAIL, api, formatErr, copyText, FB_URL, REVIEW_URL } from "@/lib/api";
import { toast } from "sonner";

const SMS_NUMBER = "+48668434331";

const SERVICES = { bus: "Ford Tourneo Custom (8 os.)", wert: "Wertykulator Weibang", aer: "Aerator Weibang", mix: "Kilka pozycji" };
const EMPTY = { name: "", phone: "", email: "", service: "bus", from: "", to: "", message: "" };

const Field = ({ label, children }) => (
  <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-300">{label}</span>{children}</label>
);

const InquiryForm = ({ prefill }) => {
  const [f, setF] = useState(EMPTY);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => {
    if (prefill) setF((s) => ({ ...s, ...prefill }));
  }, [prefill]);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const build = () => {
    if (!f.name.trim() || !f.phone.trim()) { setError("Podaj imię i numer telefonu."); return null; }
    if (!f.from || !f.to) { setError("Podaj daty wynajmu (od – do)."); return null; }
    if (f.to < f.from) { setError("Data „Do” nie może być wcześniejsza niż „Od”."); return null; }
    setError("");
    return [`Imię: ${f.name}`, `Telefon: ${f.phone}`, `Usługa: ${SERVICES[f.service]}`, `Termin: ${f.from} – ${f.to}`, f.message || null].filter(Boolean).join("\n");
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!build()) return;
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) { setError("Podaj swój adres e-mail, abyśmy mogli odpisać."); return; }
    setSending(true);
    try {
      await api.post("/inquiry", { name: f.name, phone: f.phone, email: f.email.trim(), service: f.service, from_date: f.from, to_date: f.to, message: f.message });
      setSent(true);
      setF(EMPTY);
      toast.success("Zapytanie wysłane — odezwiemy się wkrótce!");
    } catch (err) {
      setError(`${formatErr(err.response?.data?.detail)} Możesz też zadzwonić: ${PHONE}.`);
    } finally {
      setSending(false);
    }
  };
  const sms = () => {
    const body = build();
    if (!body) return;
    window.location.href = `sms:${SMS_NUMBER}?body=${encodeURIComponent(body)}`;
  };
  return (
    <form id="szybkie-zapytanie" onSubmit={submit} data-testid="inquiry-form" className="rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 shadow-2xl shadow-black/40 sm:p-8">
      <p className="font-display text-2xl font-bold text-white">Szybkie zapytanie</p>
      <p className="mt-1 text-sm text-zinc-300">Wyślij zapytanie e-mailem prosto z formularza, SMS-em — albo po prostu zadzwoń.</p>
      {sent && <p data-testid="inquiry-success" className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 p-3 text-sm text-white"><Check className="h-4 w-4 shrink-0" />Dziękujemy! Zapytanie dotarło do nas — odpowiemy najszybciej, jak to możliwe.</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Imię"><input data-testid="inquiry-name-input" className="field" value={f.name} onChange={set("name")} placeholder="Jan" /></Field>
        <Field label="Telefon"><input data-testid="inquiry-phone-input" className="field" value={f.phone} onChange={set("phone")} inputMode="tel" placeholder="+48 ..." /></Field>
        <div className="sm:col-span-2"><Field label="Twój e-mail (do odpowiedzi)"><input data-testid="inquiry-email-input" type="email" className="field" value={f.email} onChange={set("email")} placeholder="jan@przyklad.pl" /></Field></div>
        <Field label="Usługa">
          <select data-testid="inquiry-service-select" className="field" value={f.service} onChange={set("service")}>
            {Object.entries(SERVICES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Od *"><input data-testid="inquiry-from-input" type="date" required className="field" value={f.from} onChange={set("from")} /></Field>
          <Field label="Do *"><input data-testid="inquiry-to-input" type="date" required min={f.from || undefined} className="field" value={f.to} onChange={set("to")} /></Field>
        </div>
        <div className="sm:col-span-2"><Field label="Wiadomość"><textarea data-testid="inquiry-message-input" rows={4} className="field resize-none" value={f.message} onChange={set("message")} placeholder="Cel wyjazdu, liczba osób, planowana trasa..." /></Field></div>
      </div>
      {error && <p data-testid="inquiry-error" className="mt-4 text-sm text-red-300">{error}</p>}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button type="button" onClick={sms} data-testid="inquiry-sms-button" className="btn-amber justify-center"><MessageSquare className="h-4 w-4" /> Wyślij SMS</button>
        <button type="submit" disabled={sending} data-testid="inquiry-submit-button" className="btn-amber justify-center disabled:opacity-50"><Send className="h-4 w-4" /> {sending ? "Wysyłanie…" : "Wyślij e-mail"}</button>
        <a href={TEL} data-testid="inquiry-call-button" className="btn-ghost justify-center"><Phone className="h-4 w-4" /> Zadzwoń</a>
      </div>
    </form>
  );
};


const PhoneAction = ({ href, icon: I, label, testId, onClick, external }) => {
  const cls = "flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/[0.06] px-2 py-3 text-xs font-semibold text-white transition-colors hover:bg-white/15";
  return href ? (
    <a href={href} data-testid={testId} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}><I className="h-5 w-5" />{label}</a>
  ) : (
    <button type="button" data-testid={testId} onClick={onClick} className={cls}><I className="h-5 w-5" />{label}</button>
  );
};

export const Contact = ({ prefill }) => {
  const [copied, setCopied] = useState("");
  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(""), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = (what, text) => copyText(text).then(() => { setCopied(what); toast.success("Skopiowano do schowka"); });
  return (
    <section id="kontakt" data-testid="contact-section" className="relative overflow-hidden border-t border-white/10 bg-[#18181B] py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute -right-20 top-10 select-none font-display text-[22vw] font-extrabold leading-none text-white/[0.04]">JARO</div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-300">Kontakt · rezerwacje</p>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Zadzwoń — ustalimy termin i cenę od ręki.</h2>
          <div data-testid="contact-phone-card" className="mt-10 rounded-3xl border border-white/15 bg-white/[0.03] p-5 sm:p-6">
            <a href={TEL} data-testid="contact-phone-button" className="group flex items-center gap-5 text-white">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-[#0A0A0A] sm:h-16 sm:w-16"><Phone className="h-7 w-7 transition-transform group-hover:rotate-12" /></span>
              <span><span className="block font-mono text-xs uppercase tracking-widest text-zinc-300">Telefon</span><span className="select-all font-display text-2xl font-extrabold sm:text-4xl">{PHONE}</span></span>
            </a>
            <div className="mt-5 grid grid-cols-4 gap-2">
              <PhoneAction href={TEL} icon={Phone} label="Zadzwoń" testId="contact-phone-call" />
              <PhoneAction href={`sms:${SMS_NUMBER}`} icon={MessageSquare} label="SMS" testId="contact-phone-sms" />
              <PhoneAction href={`https://wa.me/${SMS_NUMBER.replace("+", "")}`} icon={MessageCircle} label="WhatsApp" testId="contact-phone-whatsapp" external />
              <PhoneAction onClick={() => copy("phone", PHONE)} icon={copied === "phone" ? Check : Copy} label={copied === "phone" ? "Skopiowano" : "Kopiuj"} testId="contact-phone-copy" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-3xl border border-white/15 bg-white/[0.03] p-5 sm:p-6">
            <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-[#0A0A0A] sm:grid"><Mail className="h-6 w-6" /></span>
            <a href={`mailto:${EMAIL}`} data-testid="contact-email-link" className="min-w-0 flex-1"><span className="block font-mono text-xs uppercase tracking-widest text-zinc-300">E-mail</span><span className="block whitespace-nowrap font-display text-[17px] font-bold sm:text-2xl">{EMAIL}</span><span className="mt-1 block text-xs text-zinc-400">Kliknij, aby otworzyć swoją pocztę</span></a>
            <button data-testid="contact-email-copy-button" onClick={() => copy("email", EMAIL)} aria-label="Kopiuj e-mail" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20">{copied === "email" ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}</button>
          </div>
          <div className="mt-6 flex items-center gap-3" data-testid="contact-social">
            <a href={FB_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" data-testid="contact-facebook-link" className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"><Facebook className="h-5 w-5" /></a>
            <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" data-testid="contact-google-review-link" className="inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"><Star className="h-4 w-4" />Oceń nas</a>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-6"><InquiryForm prefill={prefill} /></Reveal>
      </div>
    </section>
  );
};
