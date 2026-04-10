// ── Cluster config ─────────────────────────────────────────────────────────────
// Keys match the 13 backend archetypes lowercased (dominantSentiment.toLowerCase())
export const CLUSTER: Record<string, {
  color: string;
  bg: string;
  border: string;
  phrase: string;
}> = {
  // 🔥 Positivo + Alta Energia
  euforia:     { color: "#facc15", bg: "rgba(250,204,21,0.08)",   border: "rgba(250,204,21,0.20)",   phrase: "Energia no limite máximo." },
  celebracao:  { color: "#f43f5e", bg: "rgba(244,63,94,0.08)",    border: "rgba(244,63,94,0.20)",    phrase: "Hora de celebrar junto." },
  confianca:   { color: "#a3e635", bg: "rgba(163,230,53,0.08)",   border: "rgba(163,230,53,0.20)",   phrase: "Modo chefe ativado." },
  energia:     { color: "#fb923c", bg: "rgba(251,146,60,0.08)",   border: "rgba(251,146,60,0.20)",   phrase: "Frenético, mas no comando." },

  // 🌤 Positivo + Baixa Energia
  amor:        { color: "#f472b6", bg: "rgba(244,114,182,0.08)",  border: "rgba(244,114,182,0.20)",  phrase: "Coração acelerado por alguém." },
  paz:         { color: "#2dd4bf", bg: "rgba(45,212,191,0.08)",   border: "rgba(45,212,191,0.20)",   phrase: "Calma e paz por aqui." },
  reflexao:    { color: "#818cf8", bg: "rgba(129,140,248,0.08)",  border: "rgba(129,140,248,0.20)",  phrase: "Modo pensativo ligado." },

  // ⚡ Negativo + Alta Energia
  tensao:      { color: "#f87171", bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.20)",  phrase: "Tem uma energia tensa rolando." },
  revolta:     { color: "#ef4444", bg: "rgba(239,68,68,0.08)",    border: "rgba(239,68,68,0.20)",    phrase: "Hoje a playlist tá braba." },
  frustracao:  { color: "#fb923c", bg: "rgba(251,146,60,0.08)",   border: "rgba(251,146,60,0.20)",   phrase: "Segurando o que não consegue falar." },

  // 🌧 Negativo + Baixa Energia
  melancolia:  { color: "#94a3b8", bg: "rgba(148,163,184,0.08)",  border: "rgba(148,163,184,0.20)",  phrase: "Saudade bateu forte." },
  tristeza:    { color: "#64748b", bg: "rgba(100,116,139,0.08)",  border: "rgba(100,116,139,0.20)",  phrase: "Dia pesado. Tá bem?" },
  vazio:       { color: "#9ca3af", bg: "rgba(156,163,175,0.06)",  border: "rgba(156,163,175,0.15)",  phrase: "Entorpecido, mas presente." },

  // 🌀 Centro / Transição
  ambivalente: { color: "#cbd5e1", bg: "rgba(203,213,225,0.06)",  border: "rgba(203,213,225,0.15)",  phrase: "Sentimentos mistos hoje." },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
export function valenceMeta(pol: number): { label: string; emoji: string; color: string } {
  if (pol >  0.5) return { label: "Muito positivo",     emoji: "😊", color: "#34d399" };
  if (pol >  0.1) return { label: "Levemente positivo", emoji: "🙂", color: "#86efac" };
  if (pol > -0.1) return { label: "Neutro",             emoji: "😐", color: "#94a3b8" };
  if (pol > -0.5) return { label: "Levemente negativo", emoji: "😕", color: "#fca5a5" };
  return                 { label: "Muito negativo",     emoji: "😔", color: "#f87171" };
}

export function activationMeta(act: number): { label: string; emoji: string; color: string } {
  if (act >  0.5) return { label: "Muito agitado",  emoji: "⚡", color: "#fb923c" };
  if (act >  0.1) return { label: "Agitado",        emoji: "🔆", color: "#fbbf24" };
  if (act > -0.1) return { label: "Equilibrado",    emoji: "〰️", color: "#94a3b8" };
  if (act > -0.5) return { label: "Relaxado",       emoji: "🌿", color: "#67e8f9" };
  return                 { label: "Muito relaxado", emoji: "🛌", color: "#38bdf8" };
}

export function quadrantMeta(q: string): { label: string; desc: string } {
  const map: Record<string, { label: string; desc: string }> = {
    PositivoAtivo: { label: "Animado",     desc: "Alta energia + valência positiva" },
    NegativoAtivo: { label: "Tenso",       desc: "Alta energia + valência negativa" },
    NegativoCalmo: { label: "Melancólico", desc: "Baixa energia + valência negativa" },
    PositivoCalmo: { label: "Sereno",      desc: "Baixa energia + valência positiva" },
  };
  return map[q] ?? { label: q, desc: "Estado emocional" };
}

export function intensityMeta(score: number): { label: string; color: string } {
  if (score >= 0.75) return { label: "Muito intensa", color: "#f87171" };
  if (score >= 0.50) return { label: "Intensa",       color: "#fb923c" };
  if (score >= 0.30) return { label: "Moderada",      color: "#fbbf24" };
  return                    { label: "Leve",           color: "#94a3b8" };
}
