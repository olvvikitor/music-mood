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
    EuforiaAtiva: "puro hype",
    ConfiancaAlta: "protagonista",
    EnergiaBruta: "modo turbo",
    IntensidadeCriativa: "fora da caixa",

    // ── POSITIVO / CALMO ─────────────────────────────────────
    AmorLeve: "coração quentinho",
    ConexaoQuente: "vibe que bate",
    NostalgiaBoa: "saudade boa",
    Sereno: "de boa",
    PazTotal: "na paz",
    ReflexivoPositivo: "pensativo",

    // ── NEGATIVO / ATIVO ─────────────────────────────────────
    CaosInterno: "caos interno",
    FrustracaoAtiva: "no limite",
    AnsiedadeAlta: "mente a mil",
    RaivaExplosiva: "p da vida",

    // ── NEGATIVO / CALMO ─────────────────────────────────────
    Melancolia: "pra baixo",
    TristezaProfunda: "na fossa",
    Apatia: "tanto faz",
    Vazio: "vazio",

    // ── CENTRO ───────────────────────────────────────────────
    Vulneravel: "ralinho",
    Ambivalente: "sentimentos mistos",
    Desligado: "modo fantasma",
};

// (descrições mantidas — já estão boas)
const PROFILE_MOOD_DESCRIPTIONS: Record<string, string> = {
    EuforiaAtiva: "Energia no máximo. Dia de movimento, intensidade e som alto.",
    ConfiancaAlta: "Presença firme. Tudo flui com segurança e controle.",
    EnergiaBruta: "Impulso puro. Ritmo forte e corpo em ação constante.",
    IntensidadeCriativa: "Pressão virando criação. Foco intenso e mente ativa.",

    AmorLeve: "Afeto tranquilo. Sensação de conforto e calor constante.",
    ConexaoQuente: "Clima de proximidade. Sons que aproximam e conectam.",
    NostalgiaBoa: "Memórias suaves. Saudade que aquece sem pesar.",
    Sereno: "Respiração calma. Tudo desacelera naturalmente.",
    PazTotal: "Silêncio interno. Estado leve e equilibrado.",
    ReflexivoPositivo: "Pensamento fluindo. Espaço para sentir e entender.",

    CaosInterno: "Emoções intensas. Tudo acontecendo ao mesmo tempo.",
    FrustracaoAtiva: "Pressão acumulada pedindo saída.",
    AnsiedadeAlta: "Mente acelerada, difícil desacelerar.",
    RaivaExplosiva: "Energia no limite. Hora de descarregar.",

    Melancolia: "Tristeza suave, quase confortável.",
    TristezaProfunda: "Peso emocional forte e persistente.",
    Apatia: "Falta de energia e motivação.",
    Vazio: "Pouca conexão emocional. Espaço interno silencioso.",

    Vulneravel: "Sensibilidade exposta. Emoções à flor da pele.",
    Ambivalente: "Oscilação constante entre sentimentos.",
    Desligado: "Baixa resposta emocional. Estado de pausa.",
};// (accents mantido)
const PROFILE_MOOD_ACCENTS: Record<string, string> = {
    EuforiaAtiva: "#ffaa00",
    ConfiancaAlta: "#a3e635",
    EnergiaBruta: "#f97316",
    IntensidadeCriativa: "#22d3ee",

    AmorLeve: "#fb7185",
    ConexaoQuente: "#f472b6",
    NostalgiaBoa: "#818cf8",
    Sereno: "#38bdf8",
    PazTotal: "#2dd4bf",
    ReflexivoPositivo: "#a78bfa",

    CaosInterno: "#facc15",
    FrustracaoAtiva: "#fb923c",
    AnsiedadeAlta: "#f87171",
    RaivaExplosiva: "#ef4444",

    Melancolia: "#94a3b8",
    TristezaProfunda: "#64748b",
    Apatia: "#6b7280",
    Vazio: "#9ca3af",

    Vulneravel: "#f9a8d4",
    Ambivalente: "#cbd5f5",
    Desligado: "#67e8f9",
};
// aliases aceitos para normalizar inputs antigos/poeticos
const MOOD_ALIAS_TO_BACKEND: Record<string, string> = {
    // aliases legados (dados antigos salvos no banco)
    "confiancadominante": "ConfiancaAlta",
    "rockeletrizante": "EnergiaBruta",
    "tensaocriativa": "IntensidadeCriativa",
    "amorcalmo": "AmorLeve",
    "conexaoafetiva": "ConexaoQuente",
    "nostalgiafeliz": "NostalgiaBoa",
    "serenidade": "Sereno",
    "pazinterior": "PazTotal",
    "contemplacao": "ReflexivoPositivo",
    "tensaodramatica": "CaosInterno",
    "frustracao": "FrustracaoAtiva",
    "irritacaoativa": "AnsiedadeAlta",
    "nostalgiaprofunda": "TristezaProfunda",
    "desanimo": "Apatia",
    "vulnerabilidadeemocional": "Vulneravel",
    "ambivalencia": "Ambivalente",
    "estupor": "Desligado",

    "pilhado": "EuforiaAtiva",
    "ta numa marra ein": "ConfiancaAlta",
    "adrenalina pura": "EnergiaBruta",
    "caos controlado": "IntensidadeCriativa",
    "apaixonadx": "AmorLeve",
    "love love": "ConexaoQuente",
    "saudade boa": "NostalgiaBoa",
    "de boa": "Sereno",
    "zerado": "PazTotal",
    "viajando": "ReflexivoPositivo",
    "pressentindo": "CaosInterno",
    "de cara": "FrustracaoAtiva",
    "p da vida": "AnsiedadeAlta",
    "surtando": "RaivaExplosiva",
    "chorando no banheiro": "TristezaProfunda",
    "quebrado": "Apatia",
    "deixa pra la": "Vulneravel",
    "to confuso": "Ambivalente",
    "travado": "Desligado",
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
    EuforiaAtiva: "#34d399",
    ConfiancaAlta: "#a3e635",
    EnergiaBruta: "#facc15",
    IntensidadeCriativa: "#84cc16",

    AmorLeve: "#f472b6",
    ConexaoQuente: "#fb7185",
    NostalgiaBoa: "#f9a8d4",
    Sereno: "#38bdf8",
    PazTotal: "#2dd4bf",
    ReflexivoPositivo: "#818cf8",

    CaosInterno: "#c084fc",
    FrustracaoAtiva: "#fb923c",
    AnsiedadeAlta: "#f87171",
    RaivaExplosiva: "#ef4444",

    Melancolia: "#94a3b8",
    TristezaProfunda: "#64748b",
    Apatia: "#6b7280",
    Vazio: "#9ca3af",

    Vulneravel: "#f9a8d4",
    Ambivalente: "#cbd5e1",
    Desligado: "#67e8f9",
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