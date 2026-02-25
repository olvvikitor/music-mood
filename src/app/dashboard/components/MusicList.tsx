
import { useMusicFilterStore } from "../store/useMusicFilterStore"
import { Music } from "../types/music"

interface Props {
    musics: Music[]
}

export function MusicList({ musics }: Props) {
    const { filter } = useMusicFilterStore()

    const filteredMusics =
        filter === "all" ? musics : musics.filter((music) => music.mood === filter)
    
        return (
        <section>
            <h2>Lista de músicas</h2>
            <ul>
                {filteredMusics.map((music) => (
                    <li key={music.id}>
                        <strong>{music.name}</strong> - {music.artist} ({music.mood})
                    </li>
                ))}
            </ul>
        </section>
    )
}