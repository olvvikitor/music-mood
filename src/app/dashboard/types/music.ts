import { EmotionalVector } from "../services/getMoodProfile"

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

export interface Music {
  id:string,
  name: string
  artist: string
  img_url:string,
  mood: EmotionalVector
  dominantSentiment: Mood

}
