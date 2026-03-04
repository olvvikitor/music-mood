
export type Mood =
    // 🔥 Positivo + Alta Energia
    | 'EuforiaAtiva'
    | 'ConfiancaDominante'

    // 🌤 Positivo + Baixa Energia
    | 'Serenidade'
    | 'ConexaoAfetiva'

    // 🌙 Reflexivo
    | 'NostalgiaProfunda'
    | 'Contemplacao'

    // ⚡ Negativo + Alta Energia
    | 'IrritacaoAtiva'
    | 'RaivaExplosiva'

    // 🌧 Negativo + Baixa Energia
    | 'Desanimo'
    | 'VulnerabilidadeEmocional';

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
    music: string,
    id: string,
    img_url: string
    artist: string,
    emotionalVector: EmotionalVector,
    moodScore: number,
    dominantSentiment: string,
    coreAxes: CoreAxes
};
