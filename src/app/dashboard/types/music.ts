export type Mood = 'Calmo' | 'Feliz' | 'Nostálgico' | 'Intenso'

export interface Music {
  id: string
  name: string
  artist: string
  mood: Mood
}
// 2. Mapeamento de Cores para os Badges
export const emotionStyles: Record<Mood, string> = {
  'Calmo': 'bg-blue-500/20 text-blue-200 border-blue-500/30',
  'Feliz': 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
  'Nostálgico': 'bg-purple-500/20 text-purple-200 border-purple-500/30',
  'Intenso': 'bg-red-500/20 text-red-200 border-red-500/30',
}