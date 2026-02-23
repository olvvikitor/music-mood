export type Mood = "happy" | "sad" | "energetic" | "calm"

export interface Music {
  id: string
  name: string
  artist: string
  mood: Mood
}