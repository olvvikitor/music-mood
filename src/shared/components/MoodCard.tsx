"use client";

import { MoodProfileResponse } from "@/app/dashboard/services/getMoodProfile";
import { MoodIcon } from "./MoodIcons";


// ── Cluster config ─────────────────────────────────────────────────────────────
const CLUSTER: Record<string, {
  color: string;
  bg: string;
  border: string;
  phrase: string;
}> = {
  // 🔥 Positivo + Alta Energia
  "tô voando":            { color: "#34d399", bg: "rgba(52,211,153,0.08)",   border: "rgba(52,211,153,0.20)",   phrase: "Você tá pegando fogo hoje!" },
  "na minha era":         { color: "#a3e635", bg: "rgba(163,230,53,0.08)",   border: "rgba(163,230,53,0.20)",   phrase: "Modo chefe ativado." },
  "adrenalina pura":      { color: "#facc15", bg: "rgba(250,204,21,0.08)",   border: "rgba(250,204,21,0.20)",   phrase: "Energia no limite máximo." },
  "caos controlado":      { color: "#84cc16", bg: "rgba(132,204,22,0.08)",   border: "rgba(132,204,22,0.20)",   phrase: "Frenético, mas no comando." },

  // 🌤 Positivo + Baixa Energia
  "apaixonadx":           { color: "#f472b6", bg: "rgba(244,114,182,0.08)",  border: "rgba(244,114,182,0.20)",  phrase: "Coração acelerado por alguém." },
  "no calor do abraço":   { color: "#fb7185", bg: "rgba(251,113,133,0.08)",  border: "rgba(251,113,133,0.20)",  phrase: "Dia de sentir o amor." },
  "saudade boa":          { color: "#f9a8d4", bg: "rgba(249,168,212,0.08)",  border: "rgba(249,168,212,0.20)",  phrase: "Aquela memória que aquece." },
  "na paz":               { color: "#38bdf8", bg: "rgba(56,189,248,0.08)",   border: "rgba(56,189,248,0.20)",   phrase: "Calma e paz por aqui." },
  "zerado":               { color: "#2dd4bf", bg: "rgba(45,212,191,0.08)",   border: "rgba(45,212,191,0.20)",   phrase: "Silêncio que restaura." },
  "viajando":             { color: "#818cf8", bg: "rgba(129,140,248,0.08)",  border: "rgba(129,140,248,0.20)",  phrase: "Modo pensativo ligado." },

  // ⚡ Negativo + Alta Energia
  "pressentindo":         { color: "#c084fc", bg: "rgba(192,132,252,0.08)",  border: "rgba(192,132,252,0.20)",  phrase: "Algo no ar tá diferente." },
  "engolindo seco":       { color: "#fb923c", bg: "rgba(251,146,60,0.08)",   border: "rgba(251,146,60,0.20)",   phrase: "Segurando o que não consegue falar." },
  "tô no limite":         { color: "#f87171", bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.20)",  phrase: "Tem uma energia tensa rolando." },
  "surtando":             { color: "#ef4444", bg: "rgba(239,68,68,0.08)",    border: "rgba(239,68,68,0.20)",    phrase: "Hoje a playlist tá braba." },

  // 🌧 Negativo + Baixa Energia
  "chorando no banheiro": { color: "#94a3b8", bg: "rgba(148,163,184,0.08)",  border: "rgba(148,163,184,0.20)",  phrase: "Saudade bateu forte." },
  "apagado":              { color: "#64748b", bg: "rgba(100,116,139,0.08)",  border: "rgba(100,116,139,0.20)",  phrase: "Dia pesado. Tá bem?" },

  // 🌀 Centro / Transição
  "alma aberta":          { color: "#f9a8d4", bg: "rgba(249,168,212,0.08)",  border: "rgba(249,168,212,0.20)",  phrase: "Tá sensível hoje. Tudo bem." },
  "tô confuso":           { color: "#cbd5e1", bg: "rgba(203,213,225,0.08)",  border: "rgba(203,213,225,0.20)",  phrase: "Não sabe bem o que sente. Normal." },
  "travado":              { color: "#67e8f9", bg: "rgba(103,232,249,0.06)",  border: "rgba(103,232,249,0.15)",  phrase: "Entorpecido, mas presente." },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function valenceMeta(pol: number): { label: string; emoji: string; color: string } {
  if (pol >  0.5) return { label: "Muito positivo",     emoji: "😊", color: "#34d399" };
  if (pol >  0.1) return { label: "Levemente positivo", emoji: "🙂", color: "#86efac" };
  if (pol > -0.1) return { label: "Neutro",             emoji: "😐", color: "#94a3b8" };
  if (pol > -0.5) return { label: "Levemente negativo", emoji: "😕", color: "#fca5a5" };
  return                 { label: "Muito negativo",     emoji: "😔", color: "#f87171" };
}

function activationMeta(act: number): { label: string; emoji: string; color: string } {
  if (act >  0.5) return { label: "Muito agitado",  emoji: "⚡", color: "#fb923c" };
  if (act >  0.1) return { label: "Agitado",        emoji: "🔆", color: "#fbbf24" };
  if (act > -0.1) return { label: "Equilibrado",    emoji: "〰️", color: "#94a3b8" };
  if (act > -0.5) return { label: "Relaxado",       emoji: "🌿", color: "#67e8f9" };
  return                 { label: "Muito relaxado", emoji: "🛌", color: "#38bdf8" };
}

function quadrantMeta(q: string): { label: string; desc: string } {
  const map: Record<string, { label: string; desc: string }> = {
    PositivoAtivo: { label: "Animado",     desc: "Alta energia + valência positiva" },
    NegativoAtivo: { label: "Tenso",       desc: "Alta energia + valência negativa" },
    NegativoCalmo: { label: "Melancólico", desc: "Baixa energia + valência negativa" },
    PositivoCalmo: { label: "Sereno",      desc: "Baixa energia + valência positiva" },
  };
  return map[q] ?? { label: q, desc: "Estado emocional" };
}

function intensityMeta(score: number): { label: string; color: string } {
  if (score >= 0.75) return { label: "Muito intensa", color: "#f87171" };
  if (score >= 0.50) return { label: "Intensa",       color: "#fb923c" };
  if (score >= 0.30) return { label: "Moderada",      color: "#fbbf24" };
  return                    { label: "Leve",           color: "#94a3b8" };
}

// ── Props ──────────────────────────────────────────────────────────────────────
type TrackItem = MoodProfileResponse["tracksAnalyzeds"][number];

type Props =
  | { data: MoodProfileResponse; mode?: "full" }
  | { data: TrackItem;           mode: "track" };

// ── Componente ─────────────────────────────────────────────────────────────────
export function MoodCard(props: Props) {
  const { data, mode = "full" } = props;

  const sentimentKey = mode === "full"
    ? (data as MoodProfileResponse).sentiment
    : (data as TrackItem).dominantSentiment;

  const moodScore = data.moodScore;
  const { polaridade, ativacao, quadrante } = data.coreAxes;
  const tracks = mode === "full" ? (data as MoodProfileResponse).tracksAnalyzeds : [];

  const cluster = CLUSTER[sentimentKey] ?? {
    emoji: "🎵", color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.20)",
    phrase: "Música no mood.",
  };

  const valence    = valenceMeta(polaridade);
  const activation = activationMeta(ativacao);
  const quadrant   = quadrantMeta(quadrante ?? "");
  const intensity  = intensityMeta(moodScore);

  // Emoções predominantes (só no modo full)
  const topEmotions = mode === "full" ? (() => {
    const counts = tracks.reduce<Record<string, number>>((acc, t) => {
      acc[t.dominantSentiment] = (acc[t.dominantSentiment] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 4);
  })() : [];

  const positiveCount = tracks.filter(t => t.coreAxes.polaridade >= 0).length;
  const negativeCount = tracks.length - positiveCount;

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>

      {/* ── Hero: Sentimento principal ── */}
      <div className="rounded-2xl p-5 border relative overflow-hidden"
        style={{ background: cluster.bg, borderColor: cluster.border }}>

        {/* Ícone decorativo de fundo */}
        <div className="absolute -right-4 -top-4 select-none pointer-events-none"
          style={{ opacity: 0.07, filter: "blur(2px)" }}>
          <MoodIcon mood={sentimentKey} color={cluster.color} size={96} />
        </div>

        <div className="relative flex flex-col gap-3">
          {/* Topo: label + emoji */}
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black uppercase tracking-[0.25em]"
              style={{ color: cluster.color + "99" }}>
              {mode === "track" ? "emoção da música" : "humor de hoje"}
            </p>
            <div style={{ filter: `drop-shadow(0 0 10px ${cluster.color}66)` }}>
              <MoodIcon mood={sentimentKey} color={cluster.color} size={28} />
            </div>
          </div>

          {/* Nome do sentimento */}
          <div>
            <h3 className="text-2xl font-black italic tracking-tight text-white/90 leading-none">
              {sentimentKey}
            </h3>
            <p className="text-[11px] mt-1.5" style={{ color: cluster.color + "bb" }}>
              {cluster.phrase}
            </p>
          </div>

          {/* Barra de intensidade */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[8px] uppercase tracking-widest font-black"
                style={{ color: cluster.color + "66" }}>intensidade</span>
              <span className="text-[10px] font-bold font-mono"
                style={{ color: intensity.color }}>
                {intensity.label} · {Math.round(moodScore * 100)}%
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${moodScore * 100}%`,
                  background: `linear-gradient(90deg, ${cluster.color}33, ${cluster.color})`,
                }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Quadrante emocional ── */}
      {quadrante && (
        <div className="rounded-xl px-4 py-3 border flex items-center gap-3"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: cluster.bg, border: `1px solid ${cluster.border}` }}>
            <MoodIcon mood={sentimentKey} color={cluster.color} size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[8px] uppercase tracking-widest text-white/25 font-black mb-0.5">quadrante</p>
            <p className="text-sm font-bold text-white/80">{quadrant.label}</p>
            <p className="text-[9px] text-white/30 mt-0.5">{quadrant.desc}</p>
          </div>
        </div>
      )}

      {/* ── Valência + Energia ── */}
      <div className="grid grid-cols-2 gap-2">
        {/* Valência */}
        <div className="rounded-xl p-3.5 border flex flex-col gap-2"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-[8px] uppercase tracking-widest text-white/25 font-black">valência</p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{valence.emoji}</span>  {/* mantém emoji de sentimento — são universais */}
            <span className="text-[11px] font-bold" style={{ color: valence.color }}>
              {valence.label}
            </span>
          </div>
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full"
              style={{
                width: `${((polaridade + 1) / 2) * 100}%`,
                background: valence.color,
              }} />
          </div>
          <div className="flex justify-between">
            <span className="text-[7px] text-white/20 font-mono">negativo</span>
            <span className="text-[7px] text-white/20 font-mono">positivo</span>
          </div>
        </div>

        {/* Energia */}
        <div className="rounded-xl p-3.5 border flex flex-col gap-2"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-[8px] uppercase tracking-widest text-white/25 font-black">energia</p>
          <div className="flex items-center gap-2">
            <span className="text-xl">{activation.emoji}</span>
            <span className="text-[11px] font-bold" style={{ color: activation.color }}>
              {activation.label}
            </span>
          </div>
          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full"
              style={{
                width: `${((ativacao + 1) / 2) * 100}%`,
                background: activation.color,
              }} />
          </div>
          <div className="flex justify-between">
            <span className="text-[7px] text-white/20 font-mono">calmo</span>
            <span className="text-[7px] text-white/20 font-mono">agitado</span>
          </div>
        </div>
      </div>

      {/* ── Modo full: estatísticas do dia ── */}
      {mode === "full" && tracks.length > 0 && (
        <>
          {/* Vibe positiva vs negativa */}
          <div className="rounded-xl p-4 border"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[8px] uppercase tracking-widest text-white/25 font-black">
                vibe do dia
              </p>
              <span className="text-[9px] font-mono text-white/25">{tracks.length} músicas</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center">
                <p className="text-lg font-black text-emerald-400">{positiveCount}</p>
                <p className="text-[8px] text-white/25 font-mono">positivas</p>
              </div>
              <div className="flex-1 h-2 rounded-full overflow-hidden flex"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                {positiveCount > 0 && (
                  <div className="h-full transition-all duration-700"
                    style={{
                      width: `${(positiveCount / tracks.length) * 100}%`,
                      background: "linear-gradient(90deg, #34d39944, #34d399)",
                      borderRadius: negativeCount === 0 ? "9999px" : "9999px 0 0 9999px",
                    }} />
                )}
                {negativeCount > 0 && (
                  <div className="h-full transition-all duration-700"
                    style={{
                      width: `${(negativeCount / tracks.length) * 100}%`,
                      background: "linear-gradient(90deg, #f8717144, #f87171)",
                      borderRadius: positiveCount === 0 ? "9999px" : "0 9999px 9999px 0",
                    }} />
                )}
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-rose-400">{negativeCount}</p>
                <p className="text-[8px] text-white/25 font-mono">negativas</p>
              </div>
            </div>
          </div>

          {/* Emoções predominantes */}
          {topEmotions.length > 0 && (
            <div className="rounded-xl p-4 border"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
              <p className="text-[8px] uppercase tracking-widest text-white/25 font-black mb-3">
                emoções predominantes
              </p>
              <div className="flex flex-col gap-2">
                {topEmotions.map(([sentiment, count]) => {
                  const c = CLUSTER[sentiment];
                  if (!c) return null;
                  const pct = Math.round((count / tracks.length) * 100);
                  return (
                    <div key={sentiment} className="flex items-center gap-2.5">
                      <MoodIcon mood={sentiment} color={c.color} size={18} className="shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold" style={{ color: c.color }}>
                            {sentiment}
                          </span>
                          <span className="text-[9px] font-mono text-white/25">{pct}%</span>
                        </div>
                        <div className="h-0.5 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: c.color }} />
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-white/20 shrink-0">×{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}