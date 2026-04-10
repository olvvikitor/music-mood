// Fonte da verdade para estilos de emocao.
// Paleta alinhada com o design system: brand-primary #6fae9b, brand-secondary #b06a85, brand-accent #8a7bb8.
// Keys: 13 arquétipos canônicos (backend key lowercased).

export const emotionStyles: Record<string, string> = {
    // ── POSITIVO / ATIVO ─────────────────────────────────────
    euforia:     "bg-yellow-400/15 text-yellow-300 border-yellow-400/30",
    celebracao:  "bg-rose-400/15 text-rose-300 border-rose-400/30",
    confianca:   "bg-lime-400/15 text-lime-300 border-lime-400/30",
    energia:     "bg-orange-400/15 text-orange-300 border-orange-400/30",

    // ── POSITIVO / CALMO ─────────────────────────────────────
    amor:        "bg-pink-400/15 text-pink-300 border-pink-400/30",
    paz:         "bg-teal-400/15 text-teal-300 border-teal-400/30",
    reflexao:    "bg-violet-400/15 text-violet-300 border-violet-400/30",

    // ── NEGATIVO / ATIVO ─────────────────────────────────────
    tensao:      "bg-red-400/15 text-red-300 border-red-400/30",
    revolta:     "bg-red-500/15 text-red-300 border-red-500/30",
    frustracao:  "bg-orange-400/15 text-orange-300 border-orange-400/30",

    // ── NEGATIVO / CALMO ─────────────────────────────────────
    melancolia:  "bg-slate-400/15 text-slate-300 border-slate-400/30",
    tristeza:    "bg-slate-500/15 text-slate-300 border-slate-500/30",
    vazio:       "bg-zinc-400/15 text-zinc-300 border-zinc-400/30",

    // ── CENTRO ───────────────────────────────────────────────
    ambivalente: "bg-blue-200/15 text-blue-100 border-blue-200/30",
};


// 🔥 Display names poéticos (UI-facing)
const PROFILE_MOOD_DISPLAY_NAMES: Record<string, string> = {
    // ── POSITIVO / ATIVO ─────────────────────────────────────
    Euforia:     "em alta",
    Celebracao:  "a vida? é uma maravilha",
    Confianca:   "protagonista",
    Energia:     "energia pura",

    // ── POSITIVO / CALMO ─────────────────────────────────────
    Amor:        "apaixonadx",
    Paz:         "na paz",
    Reflexao:    "pensativo",

    // ── NEGATIVO / ATIVO ─────────────────────────────────────
    Tensao:      "mente a mil",
    Revolta:     "p da vida",
    Frustracao:  "no limite",

    // ── NEGATIVO / CALMO ─────────────────────────────────────
    Melancolia:  "pra baixo",
    Tristeza:    "na fossa",
    Vazio:       "tanto faz",

    // ── CENTRO ───────────────────────────────────────────────
    Ambivalente: "sentimentos mistos",
};

const PROFILE_MOOD_DESCRIPTIONS: Record<string, string> = {
    Euforia:     "Energia no máximo. Ritmo acelerado, adrenalina e muita intensidade.",
    Celebracao:  "Energia coletiva. Músicas de festa e conexão para cantar junto.",
    Confianca:   "Presença firme. Tudo flui com segurança e controle.",
    Energia:     "Impulso puro. Ritmo forte e corpo em ação constante.",

    Amor:        "Afeto tranquilo. Sensação de conforto e conexão constante.",
    Paz:         "Silêncio interno. Estado leve, equilibrado e tranquilo.",
    Reflexao:    "Espaço para sentir e entender. Resiliência e ideias claras.",

    Tensao:      "Mente acelerada, angústia intensa, difícil desacelerar.",
    Revolta:     "Energia no limite. Hora de descarregar com som pesado.",
    Frustracao:  "Pressão acumulada pedindo saída. Descontentamento.",

    Melancolia:  "Tristeza suave, quase confortável, nostalgia.",
    Tristeza:    "Peso emocional forte e persistente.",
    Vazio:       "Falta de energia. Desconexão emocional e silêncio interno.",

    Ambivalente: "Oscilação constante entre sentimentos difusos.",
};

const PROFILE_MOOD_ACCENTS: Record<string, string> = {
    Euforia:     "#facc15",
    Celebracao:  "#f43f5e",
    Confianca:   "#a3e635",
    Energia:     "#fb923c",

    Amor:        "#f472b6",
    Paz:         "#2dd4bf",
    Reflexao:    "#818cf8",

    Tensao:      "#f87171",
    Revolta:     "#ef4444",
    Frustracao:  "#fb923c",

    Melancolia:  "#94a3b8",
    Tristeza:    "#64748b",
    Vazio:       "#9ca3af",

    Ambivalente: "#cbd5e1",
};

// aliases aceitos para normalizar inputs antigos/poéticos → backend key
const MOOD_ALIAS_TO_BACKEND: Record<string, string> = {
    // versão 2.0 (21 clusters antigos)
    "euforiaativa":              "Euforia",
    "confiancaalta":             "Confianca",
    "confiancadominante":        "Confianca",
    "energiabruta":              "Energia",
    "intensidadecriativa":       "Energia",
    "rockeletrizante":           "Energia",
    "tensaocriativa":            "Energia",
    "amorleve":                  "Amor",
    "conexaoquente":             "Amor",
    "amorcalmo":                 "Amor",
    "conexaoafetiva":            "Amor",
    "nostalgiaboa":              "Reflexao",
    "nostalgiafeliz":            "Reflexao",
    "reflexivopositivo":         "Reflexao",
    "contemplacao":              "Reflexao",
    "sereno":                    "Paz",
    "paztotal":                  "Paz",
    "serenidade":                "Paz",
    "pazinterior":               "Paz",
    "caosinterno":               "Tensao",
    "ansiedadealta":             "Tensao",
    "irritacaoativa":            "Tensao",
    "tensaodramatica":           "Tensao",
    "frustracaoativa":           "Frustracao",
    "frustracao":                "Frustracao",
    "raivaexplosiva":            "Revolta",
    "tristezaprofunda":          "Tristeza",
    "nostalgiaprofunda":         "Melancolia",
    "vulneravel":                "Melancolia",
    "vulnerabilidadeemocional":  "Melancolia",
    "apatia":                    "Vazio",
    "desligado":                 "Vazio",
    "desanimo":                  "Vazio",
    "estupor":                   "Vazio",
    "ambivalencia":              "Ambivalente",

    // aliases poéticos da v3
    "pilhado":                   "Euforia",
    "tanumamara":                "Confianca",
    "adrenalinapura":            "Energia",
    "caoscontrolado":            "Energia",
    "apaixonadx":                "Amor",
    "lovelove":                  "Amor",
    "saudadeboa":                "Reflexao",
    "viajando":                  "Reflexao",
    "deboa":                     "Paz",
    "zerado":                    "Paz",
    "pressentindo":              "Tensao",
    "decara":                    "Frustracao",
    "pdavida":                   "Revolta",
    "surtando":                  "Revolta",
    "chorandonobanheiro":        "Tristeza",
    "quebrado":                  "Vazio",
    "deixaprala":                "Melancolia",
    "toconfuso":                 "Ambivalente",
    "travado":                   "Vazio",
};

// 🔧 normalização
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

    const alias = MOOD_ALIAS_TO_BACKEND[normalized];
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

// 🔥 CORES BASEADAS NO BACKEND KEY
const MOOD_TEXT_COLORS: Record<string, string> = {
    Euforia:     "#facc15",
    Celebracao:  "#f43f5e",
    Confianca:   "#a3e635",
    Energia:     "#fb923c",

    Amor:        "#f472b6",
    Paz:         "#2dd4bf",
    Reflexao:    "#818cf8",

    Tensao:      "#f87171",
    Revolta:     "#ef4444",
    Frustracao:  "#fb923c",

    Melancolia:  "#94a3b8",
    Tristeza:    "#64748b",
    Vazio:       "#9ca3af",

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
    Valencia:        "Valencia",
    Energia:         "Energia",
    Dominancia:      "Dominancia",
    Melancolia:      "Melancolia",
    Euforia:         "Euforia",
    Tensao:          "Tensao",
    ConexaoSocial:   "Conexao Social",
    Introspeccao:    "Introspeccao",
    Empoderamento:   "Empoderamento",
    Vulnerabilidade: "Vulnerabilidade",
};

export const DIMENSION_COLORS: Record<string, string> = {
    Valencia:        "#34d399",
    Energia:         "#fb923c",
    Dominancia:      "#fbbf24",
    Melancolia:      "#60a5fa",
    Euforia:         "#facc15",
    Tensao:          "#f87171",
    ConexaoSocial:   "#f472b6",
    Introspeccao:    "#a78bfa",
    Empoderamento:   "#22d3ee",
    Vulnerabilidade: "#e879f9",
};

export function abbreviateMood(mood: string): string {
    return mood || "-";
}