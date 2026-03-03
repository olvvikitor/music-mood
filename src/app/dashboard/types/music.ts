
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
    id: string;
    music: string;
    artist: string;
    img_url: string;
    dominantSentiment: string;
    moodScore: number;
    coreAxes: CoreAxes;
    emotionalVector: EmotionalVector;
};
