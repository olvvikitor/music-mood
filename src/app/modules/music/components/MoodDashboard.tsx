import { Music } from "../types/music"
import { calculateMoodStats } from "../utils/calculateMoodStats"

interface Props {
  musics: Music[]
}

export function MoodDashboard({ musics }: Props) {
  const stats = calculateMoodStats(musics)

  return (
    <section>
      <h2>Resumo Emocional</h2>

      <p>Total de músicas: {stats.total}</p>
      <p>Humor predominante: {stats.predominantMood}</p>

      <h3>Distribuição:</h3>
      <ul>
        {Object.entries(stats.moodCount).map(([mood, count]) => (
          <li key={mood}>
            {mood}: {count}
          </li>
        ))}
      </ul>
    </section>
  )
}