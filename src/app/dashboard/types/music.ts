export type Mood = 'Calmo' | 'Feliz' | 'Nostálgico' | 'Intenso'

export interface Music {
  id: string
  name: string
  artist: string
  mood: Mood
}
