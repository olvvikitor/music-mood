import { create } from "zustand"
import { Mood } from "../types/music"

type Filter = Mood | "all"

interface MusicFilterStore {
  filter: Filter
  setFilter: (filter: Filter) => void
}

export const useMusicFilterStore = create<MusicFilterStore>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),
}))