"use client";

import { MoodProfileResponse } from "@/app/dashboard/services/getMoodProfile";
import { useState } from "react";

// ── Cluster config ─────────────────────────────────────────────────────────────
// Usa os labels já renomeados que vêm do renameSentiment do service
const CLUSTER: Record<string, {
  emoji: string;
  color: string;
  bg: string;
  border: string;
  phrase: string;
}> = {
  "Euforia Ativa":             { emoji: "🔥", color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.20)",  phrase: "Você tá pegando fogo hoje!" },
  "Confianca Dominante":       { emoji: "👑", color: "#a3e635", bg: "rgba(163,230,53,0.08)",  border: "rgba(163,230,53,0.20)",  phrase: "Modo chefe ativado." },
  "Serenidade":                { emoji: "🌊", color: "#38bdf8", bg: "rgba(56,189,248,0.08)",  border: "rgba(56,189,248,0.20)",  phrase: "Calma e paz por aqui." },
  "Conexao Afetiva":           { emoji: "🫶", color: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.20)", phrase: "Dia de sentir o amor." },
  "Nostalgia Profunda":        { emoji: "🌧️", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.20)", phrase: "Saudade bateu forte." },
  "Contemplacao":              { emoji: "🌙", color: "#c4b5fd", bg: "rgba(196,181,253,0.08)", border: "rgba(196,181,253,0.20)", phrase: "Modo pensativo ligado." },
  "Irritacao Ativa":           { emoji: "⚡", color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.20)",  phrase: "Tem uma energia tensa rolando." },
  "Raiva Explosiva":           { emoji: "💢", color: "#ef4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.20)",   phrase: "Hoje a playlist tá braba." },
  "Desanimo":                  { emoji: "🩶", color: "#64748b", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.20)", phrase: "Dia pesado. Tá bem?" },
  "Vulnerabilidade Emocional": { emoji: "🫧", color: "#f9a8d4", bg: "rgba(249,168,212,0.08)", border: "rgba(249,168,212,0.20)", phrase: "Tá sensível hoje. Tudo bem." },
};

function valencePhraseShort(pol: number) {
  if (pol > 0.5)  return "Bem positivo";
  if (pol > 0.1)  return "Levemente positivo";
  if (pol > -0.1) return "Neutro";
  if (pol > -0.5) return "Levemente negativo";
  return "Bem negativo";
}

function activationPhraseShort(act: number) {
  if (act > 0.5)  return "Muito agitado";
  if (act > 0.1)  return "Agitado";
  if (act > -0.1) return "Equilibrado";
  if (act > -0.5) return "Relaxado";
  return "Muito relaxado";
}

function intensityLabel(score: number) {
  if (score >= 0.75) return "muito intensa";
  if (score >= 0.50) return "intensa";
  if (score >= 0.30) return "moderada";
  return "leve";
}

// ── Props ──────────────────────────────────────────────────────────────────────
// Aceita MoodProfileResponse (visão geral) ou uma track individual
type TrackItem = MoodProfileResponse["tracksAnalyzeds"][number];

type Props =
  | { data: MoodProfileResponse; mode?: "full" }
  | { data: TrackItem;           mode: "track" };

// ── Componente ─────────────────────────────────────────────────────────────────
export function MoodCard(props: Props) {
  const { data, mode = "full" } = props;
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

  // Normaliza: MoodProfileResponse usa `sentiment`, TrackItem usa `dominantSentiment`
  const sentimentKey = mode === "full"
    ? (data as MoodProfileResponse).sentiment
    : (data as TrackItem).dominantSentiment;

  const moodScore  = data.moodScore;
  const coreAxes   = data.coreAxes;
  const tracks     = mode === "full" ? (data as MoodProfileResponse).tracksAnalyzeds : [];

  const cluster = CLUSTER[sentimentKey] ?? {
    emoji: "🎵", color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.20)",
    phrase: "Música no mood.",
  };

  const { polaridade, ativacao } = coreAxes;

  // Distribuição de emoções nas tracks
  const emotionCounts = tracks.reduce<Record<string, number>>((acc, t) => {
    acc[t.dominantSentiment] = (acc[t.dominantSentiment] ?? 0) + 1;
    return acc;
  }, {});
  const topEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  const positiveCount = tracks.filter(t => t.coreAxes.polaridade >= 0).length;
  const negativeCount = tracks.length - positiveCount;

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto"
      style={{ scrollbarWidth: "none" }}>

      {/* ── Hero card ── */}
      <div className="rounded-2xl p-4 border relative overflow-hidden"
        style={{ background: cluster.bg, borderColor: cluster.border }}>

        {/* Emoji de fundo decorativo */}
        <div className="absolute -right-2 -top-2 text-6xl select-none pointer-events-none"
          style={{ opacity: 0.12, filter: "blur(2px)" }}>
          {cluster.emoji}
        </div>

        <div className="flex items-start gap-3 relative">
          <div className="text-4xl leading-none shrink-0 mt-0.5"
            style={{ filter: `drop-shadow(0 0 12px ${cluster.color}66)` }}>
            {cluster.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-mono uppercase tracking-widest mb-0.5"
              style={{ color: cluster.color + "aa" }}>
              {mode === "track" ? "emoção da música" : "humor de hoje"}
            </p>
            <p className="text-lg font-bold leading-tight text-white/90 mb-1">
              {sentimentKey}
            </p>
            <p className="text-[11px] text-white/50 leading-snug">
              {cluster.phrase}
            </p>
          </div>
        </div>

        {/* Barra de intensidade */}
        <div className="mt-3">
          <div className="flex justify-between text-[9px] font-mono mb-1"
            style={{ color: cluster.color + "88" }}>
            <span>intensidade</span>
            <span>{intensityLabel(moodScore)} · {Math.round(moodScore * 100)}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${moodScore * 100}%`,
                background: `linear-gradient(90deg, ${cluster.color}44, ${cluster.color})`,
              }} />
          </div>
        </div>
      </div>

      {/* ── Valência + Energia ── */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3 border text-center"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="text-xl mb-1">
            {polaridade > 0.1 ? "😊" : polaridade < -0.1 ? "😔" : "😐"}
          </div>
          <p className="text-[8px] font-mono text-white/30 uppercase tracking-wider mb-0.5">Valência</p>
          <p className="text-[11px] font-semibold"
            style={{ color: polaridade >= 0 ? "#34d399" : "#f87171" }}>
            {valencePhraseShort(polaridade)}
          </p>
        </div>
        <div className="rounded-xl p-3 border text-center"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="text-xl mb-1">
            {ativacao > 0.1 ? "⚡" : ativacao < -0.1 ? "🌿" : "〰️"}
          </div>
          <p className="text-[8px] font-mono text-white/30 uppercase tracking-wider mb-0.5">Energia</p>
          <p className="text-[11px] font-semibold"
            style={{ color: ativacao >= 0 ? "#fb923c" : "#38bdf8" }}>
            {activationPhraseShort(ativacao)}
          </p>
        </div>
      </div>

      {/* ── Seção de tracks (só no modo full) ── */}
      {mode === "full" && tracks.length > 0 && (
        <>
          {/* Barra positivo vs negativo */}
          <div className="rounded-xl p-3 border"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-[8px] font-mono text-white/30 uppercase tracking-wider mb-2">
              vibe do dia · {tracks.length} músicas
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 font-mono w-4 text-right">{positiveCount}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden flex"
                style={{ background: "rgba(255,255,255,0.06)" }}>
                {positiveCount > 0 && (
                  <div className="h-full transition-all duration-700"
                    style={{
                      width: `${(positiveCount / tracks.length) * 100}%`,
                      background: "linear-gradient(90deg, #34d39966, #34d399)",
                      borderRadius: negativeCount === 0 ? "9999px" : "9999px 0 0 9999px",
                    }} />
                )}
                {negativeCount > 0 && (
                  <div className="h-full transition-all duration-700"
                    style={{
                      width: `${(negativeCount / tracks.length) * 100}%`,
                      background: "linear-gradient(90deg, #f8717166, #f87171)",
                      borderRadius: positiveCount === 0 ? "9999px" : "0 9999px 9999px 0",
                    }} />
                )}
              </div>
              <span className="text-[10px] text-white/40 font-mono w-4">{negativeCount}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[8px] text-emerald-400/50 font-mono">😊 positivas</span>
              <span className="text-[8px] text-rose-400/50 font-mono">😔 negativas</span>
            </div>
          </div>

          {/* Chips de emoções predominantes */}
          {topEmotions.length > 0 && (
            <div className="rounded-xl p-3 border"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
              <p className="text-[8px] font-mono text-white/30 uppercase tracking-wider mb-2">
                emoções predominantes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {topEmotions.map(([sentiment, count]) => {
                  const c = CLUSTER[sentiment];
                  if (!c) return null;
                  return (
                    <div key={sentiment}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium border"
                      style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                      <span>{c.emoji}</span>
                      <span>{sentiment}</span>
                      <span className="opacity-50 font-mono">×{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lista de tracks */}
          <div className="rounded-xl border overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p className="text-[8px] font-mono text-white/30 uppercase tracking-wider p-3 pb-2">
              suas músicas
            </p>
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {tracks.map((t) => {
                const c      = CLUSTER[t.dominantSentiment];
                const emoji  = c?.emoji ?? "🎵";
                const color  = c?.color ?? "#ffffff";
                const isOpen = expandedTrack === t.id;

                return (
                  <div key={t.id}>
                    <button
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-white/3"
                      onClick={() => setExpandedTrack(isOpen ? null : t.id)}
                    >
                      {t.img_url && (
                        <img src={t.img_url} alt={t.music}
                          className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                          style={{ border: `1px solid ${color}22` }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-white/80 truncate">{t.music}</p>
                        <p className="text-[9px] text-white/35 truncate">{t.artist}</p>
                      </div>
                      <span className="text-base shrink-0">{emoji}</span>
                    </button>

                    {isOpen && c && (
                      <div className="px-3 pb-3 pt-1" style={{ background: c.bg }}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{c.emoji}</span>
                          <span className="text-[10px] font-bold" style={{ color: c.color }}>
                            {t.dominantSentiment}
                          </span>
                        </div>
                        <p className="text-[9px] text-white/40 italic mb-2">{c.phrase}</p>
                        <div className="flex gap-2">
                          <span className="text-[8px] font-mono px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>
                            {t.coreAxes.polaridade >= 0 ? "😊" : "😔"} {valencePhraseShort(t.coreAxes.polaridade)}
                          </span>
                          <span className="text-[8px] font-mono px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>
                            {t.coreAxes.ativacao >= 0 ? "⚡" : "🌿"} {activationPhraseShort(t.coreAxes.ativacao)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}