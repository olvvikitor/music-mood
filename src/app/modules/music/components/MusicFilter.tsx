"use client"

import { useMusicFilterStore } from "../store/useMusicFilterStore"

export function MusicFilter() {
  const { filter, setFilter } = useMusicFilterStore()

  return (
    <section>
      <h3>Filtrar por humor:</h3>

      <button onClick={() => setFilter("all")}>
        Todos {filter === "all" && "✔"}
      </button>

      <button onClick={() => setFilter("happy")}>
        Feliz {filter === "happy" && "✔"}
      </button>

      <button onClick={() => setFilter("sad")}>
        Triste {filter === "sad" && "✔"}
      </button>

      <button onClick={() => setFilter("energetic")}>
        Energético {filter === "energetic" && "✔"}
      </button>

      <button onClick={() => setFilter("calm")}>
        Calmo {filter === "calm" && "✔"}
      </button>
    </section>
  )
}