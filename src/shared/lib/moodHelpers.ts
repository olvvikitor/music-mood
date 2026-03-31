// Fonte da verdade para estilos de emocao.
// Paleta alinhada com o design system: brand-primary #6fae9b, brand-secondary #b06a85, brand-accent #8a7bb8.

export const emotionStyles: Record<string, string> = {
    // Positivo + alta energia
    "tô voando": "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    "na minha era": "bg-lime-400/15 text-lime-300 border-lime-400/30",
    "ta numa marra ein?": "bg-lime-400/15 text-lime-300 border-lime-400/30",
    "pilhado": "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    "adrenalina pura": "bg-yellow-400/15 text-yellow-300 border-yellow-400/30",
    "caos controlado": "bg-teal-400/15 text-teal-300 border-teal-400/30",
    "euforiaativa": "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    "confiancadominante": "bg-lime-400/15 text-lime-300 border-lime-400/30",
    "rockeletrizante": "bg-yellow-400/15 text-yellow-300 border-yellow-400/30",
    "tensaocriativa": "bg-teal-400/15 text-teal-300 border-teal-400/30",

    // Positivo + baixa energia
    "apaixonadx": "bg-pink-400/15 text-pink-300 border-pink-400/30",
    "no calor do abraço": "bg-rose-400/15 text-rose-300 border-rose-400/30",
    "love love": "bg-rose-400/15 text-rose-300 border-rose-400/30",
    "saudade boa": "bg-pink-300/15 text-pink-200 border-pink-300/30",
    "na paz": "bg-sky-400/15 text-sky-300 border-sky-400/30",
    "de boa": "bg-sky-400/15 text-sky-300 border-sky-400/30",
    "zerado": "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
    "viajando": "bg-violet-400/15 text-violet-300 border-violet-400/30",
    "amorcalmo": "bg-pink-400/15 text-pink-300 border-pink-400/30",
    "conexaoafetiva": "bg-rose-400/15 text-rose-300 border-rose-400/30",
    "nostalgiafeliz": "bg-pink-300/15 text-pink-200 border-pink-300/30",
    "serenidade": "bg-sky-400/15 text-sky-300 border-sky-400/30",
    "pazinterior": "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
    "contemplacao": "bg-violet-400/15 text-violet-300 border-violet-400/30",

    // Negativo + alta energia
    "pressentindo": "bg-purple-500/15 text-purple-300 border-purple-500/30",
    "engolindo seco": "bg-orange-400/15 text-orange-300 border-orange-400/30",
    "de cara": "bg-orange-400/15 text-orange-300 border-orange-400/30",
    "tô no limite": "bg-rose-500/15 text-rose-400 border-rose-500/30",
    "p da vida": "bg-rose-500/15 text-rose-400 border-rose-500/30",
    "surtando": "bg-red-500/15 text-red-400 border-red-500/30",
    "tensaodramatica": "bg-purple-500/15 text-purple-300 border-purple-500/30",
    "frustracao": "bg-orange-400/15 text-orange-300 border-orange-400/30",
    "irritacaoativa": "bg-rose-500/15 text-rose-400 border-rose-500/30",
    "raivaexplosiva": "bg-red-500/15 text-red-400 border-red-500/30",

    // Negativo + baixa energia
    "chorando no banheiro": "bg-blue-500/15 text-blue-300 border-blue-500/30",
    "apagado": "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    "quebrado": "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    "nostalgiaprofunda": "bg-blue-500/15 text-blue-300 border-blue-500/30",
    "desanimo": "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",

    // Centro / transicao
    "alma aberta": "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    "Deixa pra lá": "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    "tô confuso": "bg-slate-500/15 text-slate-300 border-slate-500/30",
    "travado": "bg-cyan-700/15 text-cyan-400 border-cyan-700/30",
    "vulnerabilidadeemocional": "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    "ambivalencia": "bg-slate-500/15 text-slate-300 border-slate-500/30",
    "estupor": "bg-cyan-700/15 text-cyan-400 border-cyan-700/30",
};

const PROFILE_MOOD_DISPLAY_NAMES: Record<string, string> = {
    EuforiaAtiva: "ligado no 220",
    ConfiancaDominante: "se achando",
    RockEletrizante: "no limite",
    TensaoCriativa: "caos total",
    AmorCalmo: "apaixonadx",
    ConexaoAfetiva: "grudadx",
    NostalgiaFeliz: "saudade boa",
    Serenidade: "de boa total",
    PazInterior: "zerado",
    Contemplacao: "viajando na maionese",
    TensaoDramatica: "pressentindo caô",
    Frustracao: "de cara feia",
    IrritacaoAtiva: "puto da vida",
    RaivaExplosiva: "surtando geral",
    NostalgiaProfunda: "saudade ruim",
    Desanimo: "chorando no banheiro",
    VulnerabilidadeEmocional: "tô fraco",
    Ambivalencia: "tanto faz",
    Estupor: "travado",
};

function normalizeMoodKey(value?: string): string {
    if (!value) return "";
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

const MOOD_DISPLAY_LOOKUP: Record<string, string> = (() => {
    const entries = Object.entries(PROFILE_MOOD_DISPLAY_NAMES);
    const lookup: Record<string, string> = {};

    for (const [backendKey, displayName] of entries) {
        lookup[normalizeMoodKey(backendKey)] = displayName;
        lookup[normalizeMoodKey(displayName)] = displayName;
    }

    return lookup;
})();

export function getMoodDisplayName(mood?: string, fallback = "-"): string {
    if (!mood) return fallback;
    const trimmed = mood.trim();
    if (!trimmed) return fallback;

    return MOOD_DISPLAY_LOOKUP[normalizeMoodKey(trimmed)] ?? trimmed;
}

export const DIMENSION_LABELS: Record<string, string> = {
    Valencia: "Valencia",
    Energia: "Energia",
    Dominancia: "Dominancia",
    Melancolia: "Melancolia",
    Euforia: "Euforia",
    Tensao: "Tensao",
    ConexaoSocial: "Conexao Social",
    Introspeccao: "Introspeccao",
    Empoderamento: "Empoderamento",
    Vulnerabilidade: "Vulnerabilidade",
};

export const DIMENSION_COLORS: Record<string, string> = {
    Valencia: "bg-emerald-400",
    Energia: "bg-orange-400",
    Dominancia: "bg-amber-400",
    Melancolia: "bg-blue-400",
    Euforia: "bg-yellow-400",
    Tensao: "bg-rose-500",
    ConexaoSocial: "bg-pink-400",
    Introspeccao: "bg-violet-400",
    Empoderamento: "bg-cyan-400",
    Vulnerabilidade: "bg-fuchsia-400",
};

const MOOD_TEXT_COLORS: Record<string, string> = {
    // Positivo + alta energia
    "tô voando": "#34d399",
    "na minha era": "#a3e635",
    "adrenalina pura": "#facc15",
    "caos controlado": "#84cc16",
    "pilhado": "#34d399",
    "ta numa marra ein?": "#a3e635",

    // Positivo + baixa energia
    "apaixonadx": "#f472b6",
    "no calor do abraço": "#fb7185",
    "love love": "#fb7185",
    "saudade boa": "#f9a8d4",
    "na paz": "#38bdf8",
    "de boa": "#38bdf8",
    "zerado": "#2dd4bf",
    "viajando": "#818cf8",

    // Negativo + alta energia
    "pressentindo": "#c084fc",
    "engolindo seco": "#fb923c",
    "de cara": "#fb923c",
    "tô no limite": "#f87171",
    "p da vida": "#f87171",
    "surtando": "#ef4444",

    // Negativo + baixa energia
    "chorando no banheiro": "#94a3b8",
    "apagado": "#64748b",
    "quebrado": "#64748b",

    // Centro / transicao
    "alma aberta": "#f9a8d4",
    "Deixa pra lá": "#f9a8d4",
    "tô confuso": "#cbd5e1",
    "travado": "#67e8f9",

    // Labels internas do backend
    "euforiaativa": "#34d399",
    "confiancadominante": "#a3e635",
    "rockeletrizante": "#facc15",
    "tensaocriativa": "#84cc16",
    "amorcalmo": "#f472b6",
    "conexaoafetiva": "#fb7185",
    "nostalgiafeliz": "#f9a8d4",
    "serenidade": "#38bdf8",
    "pazinterior": "#2dd4bf",
    "contemplacao": "#818cf8",
    "tensaodramatica": "#c084fc",
    "frustracao": "#fb923c",
    "irritacaoativa": "#f87171",
    "raivaexplosiva": "#ef4444",
    "nostalgiaprofunda": "#94a3b8",
    "desanimo": "#64748b",
    "vulnerabilidadeemocional": "#f9a8d4",
    "ambivalencia": "#cbd5e1",
    "estupor": "#67e8f9",
};

export function getMoodTextColor(mood?: string, fallback = "rgba(255,255,255,0.45)"): string {
    const key = normalizeMoodKey(getMoodDisplayName(mood, ""));
    if (!key) return fallback;

    const mappedColor = Object.entries(MOOD_TEXT_COLORS).find(
        ([displayName]) => normalizeMoodKey(displayName) === key,
    )?.[1];

    return mappedColor ?? fallback;
}

export function abbreviateMood(mood: string): string {
    return mood || "-";
}
