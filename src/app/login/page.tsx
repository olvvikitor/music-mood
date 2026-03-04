"use client"
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { ParticleBackground } from "@/shared/components/orbital/ParticlesBackgorund";
import { OrbitalCore } from "@/shared/components/orbital/orbitalCore";


const PROVIDERS = [
  {
    id: "spotify",
    label: "Spotify",
    href: "http://localhost:3000/auth/spotify/callback",
    textColor: "text-[#1DB954]",
    borderColor: "border-[#1DB954]/30",
    hoverBg: "hover:bg-[#1DB954]/10",
    hoverBorder: "hover:border-[#1DB954]/60",
    glowColor: "rgba(29,185,84,0.2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    id: "apple",
    label: "Apple Music",
    href: "/api/auth/apple",
    textColor: "text-[#fc3c44]",
    borderColor: "border-[#fc3c44]/30",
    hoverBg: "hover:bg-[#fc3c44]/10",
    hoverBorder: "hover:border-[#fc3c44]/60",
    glowColor: "rgba(252,60,68,0.2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.151 0H5.847A5.847 5.847 0 0 0 0 5.847v12.306A5.847 5.847 0 0 0 5.847 24h12.304A5.847 5.847 0 0 0 24 18.153V5.847A5.847 5.847 0 0 0 18.151 0zm-3.14 16.992a3.3 3.3 0 0 1-1.618.43 3.274 3.274 0 0 1-3.27-3.271 3.274 3.274 0 0 1 3.27-3.27c.768 0 1.47.27 2.02.713V7.148a.497.497 0 0 1 .497-.497h1.356a.497.497 0 0 1 .497.497v8.883a4.778 4.778 0 0 1-2.752 1.961z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube Music",
    href: "/api/auth/youtube",
    textColor: "text-[#FF0000]",
    borderColor: "border-[#FF0000]/30",
    hoverBg: "hover:bg-[#FF0000]/10",
    hoverBorder: "hover:border-[#FF0000]/60",
    glowColor: "rgba(255,0,0,0.2)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
  },
];

function LoginCard({ hoveredId, setHoveredId }: {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}) {
  return (
    <div
      className="p-8 md:p-7 flex flex-col gap-5 border border-white/10 rounded-4xl backdrop-blur-xl"
      style={{
        background: "rgba(10,10,10,0.85)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.7)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <p className="text-[9px] uppercase font-black tracking-[0.3em] text-slate-500">Bem-vindo ao</p>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase leading-none">
          Music<span className="text-emerald-500">Mood</span>
        </h1>
        <p className="text-[11px] text-slate-500 text-center leading-relaxed max-w-[210px]">
          Conecte sua plataforma favorita e descubra seu universo emocional
        </p>
      </div>

      <div className="h-px bg-white/5" />

      {/* Providers */}
      <div className="flex flex-col gap-2">
        {PROVIDERS.map((provider) => (
          <a
            key={provider.id}
            href={provider.href}
            onMouseEnter={() => setHoveredId(provider.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl border
              transition-all duration-300 bg-white/[0.02] active:scale-[0.98] cursor-pointer
              ${provider.textColor} ${provider.borderColor}
              ${provider.hoverBg} ${provider.hoverBorder}
            `}
            style={{
              boxShadow: hoveredId === provider.id ? `0 0 20px ${provider.glowColor}` : "none",
            }}
          >
            <span className="shrink-0">{provider.icon}</span>
            <span className="flex-1 text-sm font-bold tracking-wide">Entrar com {provider.label}</span>
            <span
              className={`text-xs transition-all duration-300 ${
                hoveredId === provider.id ? "opacity-100 translate-x-0.5" : "opacity-25"
              }`}
            >
              →
            </span>
          </a>
        ))}
      </div>

      <p className="text-center text-[10px] text-slate-600">
        Ao continuar, você concorda com os{" "}
        <span className="text-slate-500 underline underline-offset-2 cursor-pointer hover:text-slate-300 transition-colors">
          Termos de Uso
        </span>
      </p>
    </div>
  );
}

function OnlineStatus() {
  return (
    <div className="mt-3 flex items-center justify-center gap-2 text-[9px] uppercase font-bold tracking-widest text-slate-600">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>Serviço online</span>
    </div>
  );
}

export default function LoginPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative bg-black overflow-hidden h-screen flex flex-col md:block">
      {/* Partículas + glow (gravity = true ativa a física orbital) */}
      <ParticleBackground
        count={350}
        speed={0.4}
        gravity={false}
        glowSize={500}
        glowPosition="left30"
      />

      {/* Sistema orbital */}
      <OrbitalCore variant="login" />

      {/* ── MOBILE ── */}
      <div
        className="md:hidden relative z-20 flex flex-col items-center justify-center flex-1 px-5 gap-4"
      >
        <div
          className="text-center select-none pointer-events-none"
          style={{ animation: "fadeUp 0.7s 0.2s ease-out both" }}
        >
          <p className="text-[9px] uppercase font-black tracking-[0.35em] text-violet-500 mb-1">
            Uma viagem pelo seu
          </p>
          <h2 className="text-xl font-black italic tracking-tighter uppercase leading-tight text-white">
            universo sonoro
          </h2>
        </div>

        <div className="w-full" style={{ animation: "fadeSlideIn 0.7s 0.1s ease-out both" }}>
          <LoginCard hoveredId={hoveredId} setHoveredId={setHoveredId} />
          <OnlineStatus />
        </div>
      </div>

      {/* ── DESKTOP: texto canto superior esquerdo ── */}
      <div
        className="hidden md:block absolute pointer-events-none select-none top-[12%] left-[5%]"
        style={{ animation: "fadeUp 0.8s 0.3s ease-out both" }}
      >
        <p className="text-[9px] uppercase font-black tracking-[0.35em] text-violet-500/50 mb-2">
          Uma viagem pelo seu
        </p>
        <h2 className="text-5xl lg:text-6xl font-black italic tracking-tighter uppercase leading-[0.9] text-white/15">
          universo<br />sonoro
        </h2>
      </div>

      {/* ── DESKTOP: card direita ── */}
      <div
        className="hidden md:block absolute z-20 right-40 lg:right-64 top-1/2 -translate-y-1/2 w-90 h-90"
        style={{ animation: "fadeSlideIn 0.1s 0.3s ease-out both" }}
      >
        <LoginCard hoveredId={hoveredId} setHoveredId={setHoveredId} />
        <OnlineStatus />
      </div>
    </div>
  );
}