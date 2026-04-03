// Fonte da verdade para estilos de emocao.
// Paleta alinhada com o design system: brand-primary #6fae9b, brand-secondary #b06a85, brand-accent #8a7bb8.

export const emotionStyles: Record<string, string> = {
    euforiaativa: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    confiancaalta: "bg-lime-400/15 text-lime-300 border-lime-400/30",
    energiabruta: "bg-yellow-400/15 text-yellow-300 border-yellow-400/30",
    intensidadecriativa: "bg-teal-400/15 text-teal-300 border-teal-400/30",

    amorleve: "bg-pink-400/15 text-pink-300 border-pink-400/30",
    conexaoquente: "bg-rose-400/15 text-rose-300 border-rose-400/30",
    nostalgiaboa: "bg-indigo-400/15 text-indigo-300 border-indigo-400/30",
    sereno: "bg-sky-400/15 text-sky-300 border-sky-400/30",
    paztotal: "bg-teal-400/15 text-teal-300 border-teal-400/30",
    reflexivopositivo: "bg-violet-400/15 text-violet-300 border-violet-400/30",

    caosinterno: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    frustracaoativa: "bg-orange-400/15 text-orange-300 border-orange-400/30",
    ansiedadealta: "bg-red-400/15 text-red-300 border-red-400/30",
    raivaexplosiva: "bg-rose-500/15 text-rose-300 border-rose-500/30",

    melancolia: "bg-slate-400/15 text-slate-300 border-slate-400/30",
    tristezaprofunda: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    apatia: "bg-gray-400/15 text-gray-300 border-gray-400/30",
    vazio: "bg-zinc-400/15 text-zinc-300 border-zinc-400/30",

    vulneravel: "bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/30",
    ambivalente: "bg-blue-200/15 text-blue-100 border-blue-200/30",
    desligado: "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
};


// 🔥 NOVO PADRÃO (poético + consistente)
const PROFILE_MOOD_DISPLAY_NAMES: Record<string, string> = {
    // ── POSITIVO / ATIVO ─────────────────────────────────────
    Euforia: "puro hype",
    Confianca: "protagonista",
    Energia: "modo turbo",

    // ── POSITIVO / CALMO ─────────────────────────────────────
    Amor: "coração quentinho",
    Paz: "na paz",
    Reflexao: "pensativo",

    // ── NEGATIVO / ATIVO ─────────────────────────────────────
    Tensao: "mente a mil",
    Revolta: "p da vida",
    Frustracao: "no limite",

    // ── NEGATIVO / CALMO ─────────────────────────────────────
    Melancolia: "pra baixo",
    Tristeza: "na fossa",
    Vazio: "tanto faz",

    // ── CENTRO ───────────────────────────────────────────────
    Ambivalente: "sentimentos mistos",
};

const PROFILE_MOOD_DESCRIPTIONS: Record<string, string> = {
    Euforia: "Energia no máximo. Dia de movimento, intensidade e som alto.",
    Confianca: "Presença firme. Tudo flui com segurança e controle.",
    Energia: "Impulso puro. Ritmo forte e corpo em ação constante.",

    Amor: "Afeto tranquilo. Sensação de conforto e conexão constante.",
    Paz: "Silêncio interno. Estado leve, equilibrado e tranquilo.",
    Reflexao: "Espaço para sentir e entender. Resiliência e ideias claras.",

    Tensao: "Mente acelerada, angústia intensa, difícil desacelerar.",
    Revolta: "Energia no limite. Hora de descarregar com som pesado.",
    Frustracao: "Pressão acumulada pedindo saída. Descontentamento.",

    Melancolia: "Tristeza suave, quase confortável, nostalgia.",
    Tristeza: "Peso emocional forte e persistente.",
    Vazio: "Falta de energia. Desconexão emocional e silêncio interno.",

    Ambivalente: "Oscilação constante entre sentimentos difusos.",
};

const PROFILE_MOOD_ACCENTS: Record<string, string> = {
    Euforia: "#ffaa00",
    Confianca: "#a3e635",
    Energia: "#f97316",

    Amor: "#fb7185",
    Paz: "#2dd4bf",
    Reflexao: "#a78bfa",

    Tensao: "#f87171",
    Revolta: "#ef4444",
    Frustracao: "#fb923c",

    Melancolia: "#94a3b8",
    Tristeza: "#64748b",
    Vazio: "#6b7280",

    Ambivalente: "#cbd5f5",
};

// aliases aceitos para normalizar inputs antigos/poeticos
const MOOD_ALIAS_TO_BACKEND: Record<string, string> = {
    // aliases da versão 2.0 (os 21 clusters antigos)
    "euforiaativa": "Euforia",
    "confiancaalta": "Confianca",
    "energiabruta": "Energia",
    "intensidadecriativa": "Energia",
    "amorleve": "Amor",
    "conexaoquente": "Amor",
    "nostalgiaboa": "Reflexao",
    "sereno": "Paz",
    "paztotal": "Paz",
    "reflexivopositivo": "Reflexao",
    "caosinterno": "Tensao",
    "frustracaoativa": "Frustracao",
    "ansiedadealta": "Tensao",
    "raivaexplosiva": "Revolta",
    "tristezaprofunda": "Tristeza",
    "apatia": "Vazio",
    "vulneravel": "Melancolia",
    "desligado": "Vazio",

    // aliases legados
    "confiancadominante": "Confianca",
    "rockeletrizante": "Energia",
    "tensaocriativa": "Energia",
    "amorcalmo": "Amor",
    "conexaoafetiva": "Amor",
    "nostalgiafeliz": "Reflexao",
    "serenidade": "Paz",
    "pazinterior": "Paz",
    "contemplacao": "Reflexao",
    "tensaodramatica": "Tensao",
    "frustracao": "Frustracao",
    "irritacaoativa": "Tensao",
    "nostalgiaprofunda": "Melancolia",
    "desanimo": "Vazio",
    "vulnerabilidadeemocional": "Melancolia",
    "ambivalencia": "Ambivalente",
    "estupor": "Vazio",

    "pilhado": "Euforia",
    "ta numa marra ein": "Confianca",
    "adrenalina pura": "Energia",
    "caos controlado": "Energia",
    "apaixonadx": "Amor",
    "love love": "Amor",
    "saudade boa": "Reflexao",
    "de boa": "Paz",
    "zerado": "Paz",
    "viajando": "Reflexao",
    "pressentindo": "Tensao",
    "de cara": "Frustracao",
    "p da vida": "Tensao",
    "surtando": "Revolta",
    "chorando no banheiro": "Tristeza",
    "quebrado": "Vazio",
    "deixa pra la": "Melancolia",
    "to confuso": "Ambivalente",
    "travado": "Vazio",
};

// 🔧 normalização (mantida)
function normalizeMoodKey(value?: string): string {
    if (!value) return "";
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

// 🔥 resolve centralizado (fonte única)
function resolveBackendMoodKey(mood?: string): string | null {
    const normalized = normalizeMoodKey(mood);
    if (!normalized) return null;

    const direct = Object.keys(PROFILE_MOOD_DISPLAY_NAMES).find(
        (key) => normalizeMoodKey(key) === normalized,
    );
    if (direct) return direct;

    const byDisplayName = Object.entries(PROFILE_MOOD_DISPLAY_NAMES).find(
        ([, displayName]) => normalizeMoodKey(displayName) === normalized,
    )?.[0];
    if (byDisplayName) return byDisplayName;

    const alias = Object.entries(MOOD_ALIAS_TO_BACKEND).find(
        ([alias]) => normalizeMoodKey(alias) === normalized,
    )?.[1];

    return alias ?? null;
}

export type FrontMoodProfile = {
    backendKey: string;
    label: string;
    description: string;
    accent: string;
};

export function getMoodProfile(mood?: string): FrontMoodProfile {
    const backendKey = resolveBackendMoodKey(mood) ?? "Ambivalente";

    return {
        backendKey,
        label: PROFILE_MOOD_DISPLAY_NAMES[backendKey] ?? "vibe indefinida",
        description:
            PROFILE_MOOD_DESCRIPTIONS[backendKey] ??
            "Sua trilha do dia veio com energia unica.",
        accent: PROFILE_MOOD_ACCENTS[backendKey] ?? "#8a7bb8",
    };
}

// 🔥 display agora só UI (não usado pra lógica)
export function getMoodDisplayName(mood?: string, fallback = "-"): string {
    const safeFallback = (fallback ?? "").trim() || "-";
    const safeMood = (mood ?? "").trim();
    if (!safeMood) return safeFallback;

    const backendKey = resolveBackendMoodKey(safeMood);
    if (!backendKey) return safeFallback;

    return PROFILE_MOOD_DISPLAY_NAMES[backendKey] ?? safeFallback;
}

// 🔥 CORES AGORA BASEADAS EM BACKEND (CORREÇÃO IMPORTANTE)
const MOOD_TEXT_COLORS: Record<string, string> = {
    Euforia: "#34d399",
    Confianca: "#a3e635",
    Energia: "#facc15",

    Amor: "#f472b6",
    Paz: "#2dd4bf",
    Reflexao: "#818cf8",

    Tensao: "#f87171",
    Revolta: "#ef4444",
    Frustracao: "#fb923c",

    Melancolia: "#94a3b8",
    Tristeza: "#64748b",
    Vazio: "#9ca3af",

    Ambivalente: "#cbd5e1",
};


export function getMoodTextColor(
    mood?: string,
    fallback = "rgba(255,255,255,0.45)",
): string {
    const backendKey = resolveBackendMoodKey(mood);
    if (!backendKey) return fallback;

    return MOOD_TEXT_COLORS[backendKey] ?? fallback;
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
    Valencia: "#34d399",
    Energia: "#fb923c",
    Dominancia: "#fbbf24",
    Melancolia: "#60a5fa",
    Euforia: "#facc15",
    Tensao: "#f87171",
    ConexaoSocial: "#f472b6",
    Introspeccao: "#a78bfa",
    Empoderamento: "#22d3ee",
    Vulnerabilidade: "#e879f9",
};


export function abbreviateMood(mood: string): string {
    return mood || "-";
}