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
    EuforiaAtiva: "trend no talo",
    ConfiancaDominante: "main character mode",
    RockEletrizante: "volume no max",
    TensaoCriativa: "caos criativo",
    AmorCalmo: "love session",
    ConexaoAfetiva: "conexao real",
    NostalgiaFeliz: "throwback bom",
    Serenidade: "flow leve",
    PazInterior: "zen em loop",
    Contemplacao: "pensando alto",
    TensaoDramatica: "plot twist vibes",
    Frustracao: "modo impaciente",
    IrritacaoAtiva: "pavio curto",
    RaivaExplosiva: "rage mode",
    NostalgiaProfunda: "saudade em 8d",
    Desanimo: "low battery soul",
    VulnerabilidadeEmocional: "coracao aberto",
    Ambivalencia: "entre hits e silencios",
    Estupor: "mute emocional",
};

const PROFILE_MOOD_DESCRIPTIONS: Record<string, string> = {
    EuforiaAtiva: "Energia no topo e ritmo de festival. Dia de volume alto e movimento.",
    ConfiancaDominante: "Vibe de protagonista. Tudo que toca parece trilha de entrada triunfal.",
    RockEletrizante: "Adrenalina sonora, batida forte e corpo em estado de turbo.",
    TensaoCriativa: "Pressao boa virando expressao. Modo foco intenso com arte pulsando.",
    AmorCalmo: "Afeto suave, calor no peito e playlist que abraca sem pressa.",
    ConexaoAfetiva: "Clima de proximidade real. Sons que aproximam e criam presenca.",
    NostalgiaFeliz: "Memoria boa no repeat. Saudade leve com sorriso no canto.",
    Serenidade: "Respiracao funda, mente alinhada e trilha limpa para desacelerar.",
    PazInterior: "Estado zen ativado. Frequencia calma com zero ruido interno.",
    Contemplacao: "Olhar distante e coracao atento. Musica para sentir e refletir.",
    TensaoDramatica: "Suspense no ar. Batidas que pedem atencao e expectativa alta.",
    Frustracao: "Incomodo acumulado em forma de ritmo. Vibe de descarrego consciente.",
    IrritacaoAtiva: "Nervo aceso e impulso alto. Som para liberar pressao sem filtro.",
    RaivaExplosiva: "Explosao emocional no maximo. Dia de liberar energia no beat.",
    NostalgiaProfunda: "Saudade pesada, cinema interno e trilha para sentir fundo.",
    Desanimo: "Baixa carga emocional. Playlist de acolhimento para recomecar.",
    VulnerabilidadeEmocional: "Pele fina e verdade na superficie. Som para se abrir.",
    Ambivalencia: "Metade luz, metade sombra. Vibe oscilando entre extremos.",
    Estupor: "Modo pausa emocional. Menos ruido, mais processamento interno.",
};

const PROFILE_MOOD_ACCENTS: Record<string, string> = {
    EuforiaAtiva: "#ffaa00",
    ConfiancaDominante: "#a3e635",
    RockEletrizante: "#ff5f1f",
    TensaoCriativa: "#00b4ff",
    AmorCalmo: "#ff6b9d",
    ConexaoAfetiva: "#ff80c0",
    NostalgiaFeliz: "#7b9fff",
    Serenidade: "#6fae9b",
    PazInterior: "#00e5a0",
    Contemplacao: "#8ab4ff",
    TensaoDramatica: "#ffcc44",
    Frustracao: "#ff7a45",
    IrritacaoAtiva: "#ff6060",
    RaivaExplosiva: "#ff2d55",
    NostalgiaProfunda: "#5b7cff",
    Desanimo: "#8c8c8c",
    VulnerabilidadeEmocional: "#d580ff",
    Ambivalencia: "#a6a6a6",
    Estupor: "#666666",
};

const MOOD_ALIAS_TO_BACKEND: Record<string, string> = {
    // aliases legados para manter compatibilidade visual
    "pilhado": "EuforiaAtiva",
    "ta numa marra ein": "ConfiancaDominante",
    "adrenalina pura": "RockEletrizante",
    "caos controlado": "TensaoCriativa",
    "apaixonadx": "AmorCalmo",
    "love love": "ConexaoAfetiva",
    "saudade boa": "NostalgiaFeliz",
    "de boa": "Serenidade",
    "zerado": "PazInterior",
    "viajando": "Contemplacao",
    "pressentindo": "TensaoDramatica",
    "de cara": "Frustracao",
    "p da vida": "IrritacaoAtiva",
    "surtando": "RaivaExplosiva",
    "chorando no banheiro": "NostalgiaProfunda",
    "quebrado": "Desanimo",
    "deixa pra la": "VulnerabilidadeEmocional",
    "to confuso": "Ambivalencia",
    "travado": "Estupor",
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

    for (const [alias, backendKey] of Object.entries(MOOD_ALIAS_TO_BACKEND)) {
        const displayName = PROFILE_MOOD_DISPLAY_NAMES[backendKey];
        if (displayName) lookup[normalizeMoodKey(alias)] = displayName;
    }

    return lookup;
})();

function resolveBackendMoodKey(mood?: string): string | null {
    const normalized = normalizeMoodKey(mood);
    if (!normalized) return null;

    const fromBackend = Object.keys(PROFILE_MOOD_DISPLAY_NAMES).find(
        (key) => normalizeMoodKey(key) === normalized,
    );
    if (fromBackend) return fromBackend;

    const fromAlias = Object.entries(MOOD_ALIAS_TO_BACKEND).find(
        ([alias]) => normalizeMoodKey(alias) === normalized,
    )?.[1];
    if (fromAlias) return fromAlias;

    return null;
}

export type FrontMoodProfile = {
    backendKey: string;
    label: string;
    description: string;
    accent: string;
};

export function getMoodProfile(mood?: string): FrontMoodProfile {
    const backendKey = resolveBackendMoodKey(mood) ?? "Ambivalencia";

    return {
        backendKey,
        label: PROFILE_MOOD_DISPLAY_NAMES[backendKey] ?? "vibe indefinida",
        description: PROFILE_MOOD_DESCRIPTIONS[backendKey] ?? "Sua trilha do dia veio com energia unica.",
        accent: PROFILE_MOOD_ACCENTS[backendKey] ?? "#8a7bb8",
    };
}

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
