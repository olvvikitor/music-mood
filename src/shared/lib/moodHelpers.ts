// Fonte da verdade para estilos de emoção
// Paleta alinhada com o design system: brand-primary #00ffb3, brand-secondary #ff2d87, brand-accent #a259ff

export const emotionStyles: Record<string, string> = {
    // 🔥 Positivo + Alta Energia
    "tô voando":          "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    "na minha era":       "bg-lime-400/15 text-lime-300 border-lime-400/30",
    "adrenalina pura":    "bg-yellow-400/15 text-yellow-300 border-yellow-400/30",
    "caos controlado":    "bg-teal-400/15 text-teal-300 border-teal-400/30",

    // 🌤 Positivo + Baixa Energia
    "apaixonadx":         "bg-pink-400/15 text-pink-300 border-pink-400/30",
    "no calor do abraço": "bg-rose-400/15 text-rose-300 border-rose-400/30",
    "saudade boa":        "bg-pink-300/15 text-pink-200 border-pink-300/30",
    "na paz":             "bg-sky-400/15 text-sky-300 border-sky-400/30",
    "zerado":             "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
    "viajando":           "bg-violet-400/15 text-violet-300 border-violet-400/30",

    // ⚡ Negativo + Alta Energia
    "pressentindo":       "bg-purple-500/15 text-purple-300 border-purple-500/30",
    "engolindo seco":     "bg-orange-400/15 text-orange-300 border-orange-400/30",
    "tô no limite":       "bg-rose-500/15 text-rose-400 border-rose-500/30",
    "surtando":           "bg-red-500/15 text-red-400 border-red-500/30",

    // 🌧 Negativo + Baixa Energia
    "chorando no banheiro": "bg-blue-500/15 text-blue-300 border-blue-500/30",
    "apagado":            "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",

    // 🌀 Centro / Transição
    "alma aberta":        "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    "tô confuso":         "bg-slate-500/15 text-slate-300 border-slate-500/30",
    "travado":            "bg-cyan-700/15 text-cyan-400 border-cyan-700/30",
};

export const DIMENSION_LABELS: Record<string, string> = {
    Valencia:       "Valência",
    Energia:        "Energia",
    Dominancia:     "Dominância",
    Melancolia:     "Melancolia",
    Euforia:        "Euforia",
    Tensao:         "Tensão",
    ConexaoSocial:  "Conexão Social",
    Introspeccao:   "Introspecção",
    Empoderamento:  "Empoderamento",
    Vulnerabilidade:"Vulnerabilidade",
};

export const DIMENSION_COLORS: Record<string, string> = {
    Valencia:        "bg-emerald-400",
    Energia:         "bg-orange-400",
    Dominancia:      "bg-amber-400",
    Melancolia:      "bg-blue-400",
    Euforia:         "bg-yellow-400",
    Tensao:          "bg-rose-500",
    ConexaoSocial:   "bg-pink-400",
    Introspeccao:    "bg-violet-400",
    Empoderamento:   "bg-cyan-400",
    Vulnerabilidade: "bg-fuchsia-400",
};

export function abbreviateMood(mood: string): string {
    return mood || "—";
}
