// ── Tipos de domínio ──────────────────────────────────────────────────────────

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

// ── Estilos e labels — fonte da verdade: @/shared/lib/moodHelpers ─────────────
// Importados aqui para conveniência, não redefinidos.
export { emotionStyles, DIMENSION_LABELS, DIMENSION_COLORS } from "@/shared/lib/moodHelpers";
