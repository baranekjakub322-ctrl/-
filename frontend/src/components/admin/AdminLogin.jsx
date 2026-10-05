import { useState } from "react";
import { Lock } from "lucide-react";
import { api, formatErr } from "@/lib/api";
import { Logo } from "@/components/site/Logo";

export const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      onLogin(data);
    } catch (err) {
      setError(formatErr(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="grid min-h-screen place-items-center bg-[#0A0A0A] px-5 text-white">
      <form onSubmit={submit} data-testid="admin-login-form" className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#141414] p-8">
        <Logo testId="admin-login-logo" className="h-10" />
        <h1 className="mt-8 flex items-center gap-2 font-display text-2xl font-bold"><Lock className="h-5 w-5 text-zinc-400" />Logowanie</h1>
        <label className="mt-6 block text-sm text-zinc-300" htmlFor="adm-email">E-mail</label>
        <input id="adm-email" data-testid="admin-email-input" type="email" required className="field mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="mt-4 block text-sm text-zinc-300" htmlFor="adm-pass">Hasło</label>
        <input id="adm-pass" data-testid="admin-password-input" type="password" required className="field mt-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p data-testid="admin-login-error" className="mt-4 text-sm text-red-300">{error}</p>}
        <button data-testid="admin-login-submit" disabled={busy} className="btn-amber mt-6 w-full justify-center disabled:opacity-50">{busy ? "Logowanie…" : "Zaloguj"}</button>
        <a href="/" className="mt-5 block text-center text-sm text-zinc-400 hover:text-white" data-testid="admin-login-back">← Wróć na stronę</a>
      </form>
    </div>
  );
};
