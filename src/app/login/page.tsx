"use client"
import { useState } from "react";
import { Loader2, KeyRound, Mail, ArrowRight, Music2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "./services/authApi";
import { ParticleBackground } from "@/shared/components/orbital/ParticlesBackgorund";
import { OrbitalCore } from "@/shared/components/orbital/orbitalCore";
import { AppBrand } from "@/shared/components/AppBrand";

const PROVIDERS = [
  {
    id: "spotify",
    label: "Spotify",
    href: `${process.env.NEXT_PUBLIC_API_URL}/auth/spotify/callback`,
    color: "#1DB954",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "/api/auth/youtube",
    color: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Apple",
    href: "#",
    color: "#f5f5f7",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.151 0H5.847A5.847 5.847 0 0 0 0 5.847v12.306A5.847 5.847 0 0 0 5.847 24h12.304A5.847 5.847 0 0 0 24 18.153V5.847A5.847 5.847 0 0 0 18.151 0zm-3.14 16.992a3.3 3.3 0 0 1-1.618.43 3.274 3.274 0 0 1-3.27-3.271 3.274 3.274 0 0 1 3.27-3.27c.768 0 1.47.27 2.02.713V7.148a.497.497 0 0 1 .497-.497h1.356a.497.497 0 0 1 .497.497v8.883a4.778 4.778 0 0 1-2.752 1.961z" />
      </svg>
    ),
  },
];

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div
      className="glass-card w-full max-w-[360px] flex flex-col gap-0 overflow-hidden"
      style={{ animation: "fadeSlideIn 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      {/* Header strip */}
      <div
        className="px-7 pt-7 pb-6 flex flex-col gap-1"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <AppBrand className="text-2xl" />
        <p className="text-xs text-white/35 mt-1" style={{ fontFamily: "var(--font-body)" }}>
          Desbloqueie seu universo emocional
        </p>
      </div>

      {/* Form */}
      <div className="px-7 py-6 flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.15em] font-700 text-white/30"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            E-mail
          </label>
          <div className="relative">
            <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors duration-200 ${focusedField === "email" ? "text-brand-primary" : "text-white/20"}`} />
            <input
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className="w-full text-sm text-white placeholder:text-white/20 pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
              style={{
                background: "var(--surface-input)",
                border: focusedField === "email"
                  ? "1px solid rgba(111,174,155,0.35)"
                  : "1px solid var(--border-medium)",
                boxShadow: focusedField === "email" ? "0 0 0 3px rgba(111,174,155,0.06)" : "none",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-[0.15em] font-700 text-white/30"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
            Senha
          </label>
          <div className="relative">
            <KeyRound className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors duration-200 ${focusedField === "password" ? "text-brand-primary" : "text-white/20"}`} />
            <input
              type="password"
              placeholder="********"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className="w-full text-sm text-white placeholder:text-white/20 pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-200"
              style={{
                background: "var(--surface-input)",
                border: focusedField === "password"
                  ? "1px solid rgba(111,174,155,0.35)"
                  : "1px solid var(--border-medium)",
                boxShadow: focusedField === "password" ? "0 0 0 3px rgba(111,174,155,0.06)" : "none",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-rose-400 font-600 text-center"
            style={{ fontFamily: "var(--font-body)" }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={async () => {
            setError(null);
            setLoading(true);
            try {
              const data = await loginWithEmail(email, password);
              localStorage.setItem('auth_token', data.token);
              router.push('/dashboard');
            } catch (err: any) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-800 uppercase tracking-widest transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #6fae9b, #5f9d8c)",
            color: "#07070c",
            boxShadow: "0 0 24px rgba(111,174,155,0.25)",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
          }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>

      {/* Providers */}
      <div className="px-7 pb-7 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 shrink-0"
            style={{ fontFamily: "var(--font-display)" }}>
            ou conecte via
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PROVIDERS.map(p => (
            <a
              key={p.id}
              href={p.href}
              title={p.label}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200 active:scale-95"
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-medium)",
                color: p.color,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = `${p.color}12`;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = `${p.color}35`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-card)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-medium)";
              }}
            >
              {p.icon}
              <span className="text-[9px] font-700 uppercase tracking-wider text-white/30"
                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                {p.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "var(--bg-page)" }}>

      {/* Particle background */}
      <ParticleBackground count={250} speed={0.3} gravity={false} glowSize={500} glowPosition="left30" />

      {/* Orbital - visivel no desktop */}
      <div className="hidden lg:block">
        <OrbitalCore variant="login" />
      </div>

      {/* Left copy - desktop */}
      <div
        className="hidden lg:flex flex-col gap-3 absolute left-[8%] top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ animation: "fadeUp 0.8s 0.4s ease-out both" }}
      >
        <p className="text-[10px] uppercase tracking-[0.35em] font-800"
          style={{ color: "#8a7bb8", fontFamily: "var(--font-display)", fontWeight: 800 }}>
          Analise emocional de musica
        </p>
        <h2 className="text-6xl xl:text-7xl font-900 uppercase leading-[0.88] text-white/10"
          style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}>
          Sua<br />alma<br />em notas
        </h2>
      </div>

      {/* Card - centered on mobile, right on desktop */}
      <div className="relative z-20 w-full max-w-[360px] px-4 lg:px-0 lg:absolute lg:right-[10%] lg:top-1/2 lg:-translate-y-1/2">
        <LoginCard />

        {/* Status */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.2em] text-white/20 font-700"
            style={{ fontFamily: "var(--font-display)" }}>
            Servico online
          </span>
        </div>
      </div>
    </div>
  );
}

