"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMoodProfile } from "../dashboard/hooks/useMoodProfile"
import { ParticleBackground } from "@/shared/components/orbital/ParticlesBackgorund"

const PHASES = [
  { label: "Analisando suas músicas",       pct: 20 },
  { label: "Identificando padrões emocionais", pct: 40 },
  { label: "Construindo seu perfil",         pct: 60 },
  { label: "Calibrando dimensões",           pct: 80 },
  { label: "Quase pronto",                   pct: 95 },
]

export default function BuildingEmotionsPage() {
  const router = useRouter()
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { isSuccess } = useMoodProfile()

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setPhaseIdx(i => Math.min(i + 1, PHASES.length - 1)), 3000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (isSuccess) router.push("/dashboard")
  }, [isSuccess, router])

  const phase = PHASES[phaseIdx]

  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center"
      style={{ background: "#07070c" }}>

      {/* Particles */}
      <ParticleBackground count={200} speed={0.8} gravity={true} glowSize={700} glowPosition="center" />

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,255,179,0.05), transparent 65%)" }} />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(162,89,255,0.04), transparent 65%)" }} />
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center gap-10 px-8 text-center"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {/* Animated ring stack */}
        <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: 80 + i * 24,
                height: 80 + i * 24,
                borderColor: `rgba(0,255,179,${0.18 - i * 0.05})`,
                animation: `ringPulse ${1.6 + i * 0.4}s ${i * 0.3}s ease-in-out infinite`,
              }}
            />
          ))}
          {/* Core */}
          <div className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(0,255,179,0.06)",
              border: "1.5px solid rgba(0,255,179,0.25)",
              boxShadow: "0 0 40px rgba(0,255,179,0.12)",
            }}>
            <div className="w-3 h-3 rounded-full"
              style={{
                background: "#00ffb3",
                boxShadow: "0 0 16px #00ffb3",
                animation: "ringPulse 1.2s ease-in-out infinite",
              }} />
          </div>
        </div>

        {/* Text block */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] font-700"
            style={{ color: "#a259ff", fontFamily: "var(--font-display)", fontWeight: 700 }}>
            preparando sua jornada
          </p>
          <h1 className="text-4xl md:text-5xl font-900 uppercase leading-[0.9] text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}>
            Construindo<br />seu mood
          </h1>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-[280px] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p
              key={phaseIdx}
              className="text-xs text-white/40"
              style={{ animation: "fadeUp 0.5s ease both", fontFamily: "var(--font-body)" }}
            >
              {phase.label}...
            </p>
            <span className="text-[11px] font-700 tabular-nums"
              style={{ color: "#00ffb3", fontFamily: "var(--font-display)", fontWeight: 700 }}>
              {phase.pct}%
            </span>
          </div>
          <div className="h-px w-full rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${phase.pct}%`,
                background: "linear-gradient(90deg, #00ffb3, #a259ff)",
                boxShadow: "0 0 12px rgba(0,255,179,0.4)",
                transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>
        </div>

        {/* Pulsing dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#00ffb3",
                animation: `ringPulse 1s ${i * 0.18}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
