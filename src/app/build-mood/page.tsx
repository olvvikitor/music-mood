"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMoodProfile } from "../dashboard/hooks/useMoodProfile"
import { OrbitalCore } from "@/shared/components/orbital/orbitalCore"
import { ParticleBackground } from "@/shared/components/orbital/ParticlesBackgorund"

const PHASE_MESSAGES = [
  "Analisando suas músicas...",
  "Identificando padrões emocionais...",
  "Construindo seu perfil...",
  "Calibrando dimensões...",
  "Quase pronto...",
]

export default function BuildingEmotionsPage() {
  const router = useRouter()
  const [msgIdx, setMsgIdx] = useState(0)
  const { isSuccess } = useMoodProfile()

  // rotação das mensagens a cada 3s
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % PHASE_MESSAGES.length), 3000)
    return () => clearInterval(t)
  }, [])

  // redirect correto
  useEffect(() => {
    if (isSuccess) router.push("/dashboard")
  }, [isSuccess, router])

  return (
    <div className="relative bg-black h-screen w-screen overflow-hidden">
      {/* Fundo de partículas — ocupa a tela toda */}
      <ParticleBackground
        count={350}
        speed={5}
        gravity={true}
        glowSize={900}
        glowPosition="center"
      />

      {/* Layout lado a lado */}
      <div className="relative z-10 h-full grid grid-cols-2">

        {/* Esquerda — sistema orbital */}
        <div className="flex items-start justify-start">
          <OrbitalCore variant="login" />
        </div>

        {/* Direita — mensagens */}
        <div className="flex flex-col items-start justify-center gap-6 px-12">

          {/* Título */}
          <div className="flex flex-col items-start gap-1 select-none pointer-events-none">
            <p className="text-[9px] uppercase font-black tracking-[0.35em] text-violet-500">
              preparando sua jornada
            </p>
            <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-[0.9] text-white animate-pulse">
              construindo<br />seu mood
            </h2>
          </div>

          {/* Divisor */}
          <div className="w-full h-px bg-white/5" />

          {/* Frase rotativa */}
          <div className="flex flex-col gap-4 w-full select-none pointer-events-none">
            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500">
              status
            </p>
            <p
              key={msgIdx}
              className="text-sm text-emerald-400/80 font-bold tracking-wide"
              style={{ animation: "fadeMsg 3s ease-in-out forwards" }}
            >
              {PHASE_MESSAGES[msgIdx]}
            </p>
          </div>

          {/* Divisor */}
          <div className="w-full h-px bg-white/5" />

          {/* Loading dots */}
          <div className="flex items-center gap-2 self-start">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                style={{ animation: `ringPulse 1.2s ${i * 0.2}s ease-in-out infinite` }}
              />
            ))}
            <span className="text-[10px] text-white uppercase font-bold tracking-widest ml-2 infinite">
              processando
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}