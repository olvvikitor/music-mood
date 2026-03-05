export type Mood =
    // 🔥 Positivo + Alta Energia
    | 'EuforiaAtiva'
    | 'ConfiancaDominante'
    | 'RockEletrizante'
    | 'TensaoCriativa'

    // 🌤 Positivo + Baixa Energia
    | 'AmorCalmo'
    | 'ConexaoAfetiva'
    | 'NostalgiaFeliz'
    | 'Serenidade'
    | 'PazInterior'
    | 'Contemplacao'

    // ⚡ Negativo + Alta Energia
    | 'TensaoDramatica'
    | 'Frustracao'
    | 'IrritacaoAtiva'
    | 'RaivaExplosiva'

    // 🌧 Negativo + Baixa Energia
    | 'NostalgiaProfunda'
    | 'Desanimo'

    // 🌀 Centro / Transição
    | 'VulnerabilidadeEmocional'
    | 'Ambivalencia'
    | 'Estupor';

export type CoreAxes = {
    polaridade: number;
    ativacao: number;
    quadrante: string;
};

export type EmotionalVector = {
    Valencia: number;
    Energia: number;
    Dominancia: number;
    Melancolia: number;
    Euforia: number;
    Tensao: number;
    ConexaoSocial: number;
    Introspeccao: number;
    Empoderamento: number;
    Vulnerabilidade: number;
};

export type Track = {
    music: string;
    id: string;
    img_url: string;
    artist: string;
    reasoning: string;
    emotionalVector: EmotionalVector;
    moodScore: number;
    dominantSentiment: string;
    coreAxes: CoreAxes;
};


export const emotionStyles: Record<string, string> = {
    // 🔥 Positivo + Alta Energia
    "tô voando": "bg-orange-500/20 text-orange-200 border-orange-500/30",
    "na minha era": "bg-amber-500/20 text-amber-200 border-amber-500/30",
    "adrenalina pura": "bg-yellow-500/20 text-yellow-200 border-yellow-500/30",
    "caos controlado": "bg-lime-500/20 text-lime-200 border-lime-500/30",

    // 🌤 Positivo + Baixa Energia
    "apaixonadx": "bg-pink-400/20 text-pink-200 border-pink-400/30",
    "no calor do abraço": "bg-pink-500/20 text-pink-200 border-pink-500/30",
    "saudade boa": "bg-rose-400/20 text-rose-200 border-rose-400/30",
    "na paz": "bg-sky-500/20 text-sky-200 border-sky-500/30",
    "zerado": "bg-teal-500/20 text-teal-200 border-teal-500/30",
    "viajando": "bg-indigo-500/20 text-indigo-200 border-indigo-500/30",

    // ⚡ Negativo + Alta Energia
    "pressentindo": "bg-purple-500/20 text-purple-200 border-purple-500/30",
    "engolindo seco": "bg-orange-600/20 text-orange-300 border-orange-600/30",
    "tô no limite": "bg-rose-500/20 text-rose-200 border-rose-500/30",
    "surtando": "bg-red-700/20 text-red-300 border-red-700/30",

    // 🌧 Negativo + Baixa Energia
    "chorando no banheiro": "bg-violet-500/20 text-violet-200 border-violet-500/30",
    "apagado": "bg-zinc-600/20 text-zinc-300 border-zinc-600/30",

    // 🌀 Centro / Transição
    "alma aberta": "bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30",
    "tô confuso": "bg-slate-500/20 text-slate-200 border-slate-500/30",
    "travado": "bg-cyan-900/20 text-cyan-300 border-cyan-900/30",
};

// Não alterado — dimensões são eixos internos do vetor, independentes dos clusters
export const DIMENSION_LABELS: Record<string, string> = {
    Valencia: "Valência",
    Energia: "Energia",
    Dominancia: "Dominância",
    Melancolia: "Melancolia",
    Euforia: "Euforia",
    Tensao: "Tensão",
    ConexaoSocial: "Conexão Social",
    Introspeccao: "Introspecção",
    Empoderamento: "Empoderamento",
    Vulnerabilidade: "Vulnerabilidade",
};

export const DIMENSION_COLORS: Record<string, string> = {
    Valencia: "bg-emerald-500",
    Energia: "bg-orange-500",
    Dominancia: "bg-amber-500",
    Melancolia: "bg-indigo-400",
    Euforia: "bg-yellow-400",
    Tensao: "bg-rose-500",
    ConexaoSocial: "bg-pink-400",
    Introspeccao: "bg-violet-400",
    Empoderamento: "bg-cyan-400",
    Vulnerabilidade: "bg-fuchsia-400",
};