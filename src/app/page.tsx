"use client"

import { MoodDashboard } from "./modules/music/components/MoodDashboard"
import { MusicList } from "./modules/music/components/MusicList"
import { useRecentMusics } from "./modules/music/hooks/useRecentMusics"
import { MusicFilter } from "./modules/music/components/MusicFilter"

export default function HomePage() {
  const { data, isLoading, isError } = useRecentMusics()

  if (isLoading) return <p>Carregando músicas...</p>
  if (isError || !data) return <p>Erro ao buscar músicas.</p>

  return (
    <main style={{ padding: 20 }}>
      <h1>🎧 MusicMood</h1>

      <MusicFilter></MusicFilter>
      <MoodDashboard musics={data} />
      <MusicList musics={data} />
      
    </main>
  )
}