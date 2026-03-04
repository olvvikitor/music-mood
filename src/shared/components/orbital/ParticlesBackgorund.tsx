// components/ParticleBackground.tsx
// Wrapper visual do canvas de partículas + glow central.
// Substitui o bloco <canvas> + <div glow> repetido nas 3 páginas.

import { useParticleCanvas } from "./useParticlesCanvas";


type Props = {
  /** Número de partículas */
  count?: number;
  /** Velocidade */
  speed?: number;
  /** Ativa física orbital (LoginPage) */
  gravity?: boolean;
  /** Tamanho do glow em px (default: 400) */
  glowSize?: number;
  /**
   * Posição do glow:
   * - "center" → centro da tela (Onboarding, BuildingEmotions)
   * - "left30"  → 30% da esquerda (LoginPage desktop)
   */
  glowPosition?: "center" | "left30";
};

export function ParticleBackground({
  count = 200,
  speed = 0.3,
  gravity = false,
  glowSize = 400,
  glowPosition = "center",
}: Props) {
  const canvasRef = useParticleCanvas({ count, speed, gravity });

  const glowClass =
    glowPosition === "left30"
      ? "top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2"
      : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";

  return (
    <>
      {/* Partículas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Glow de fundo */}
      <div className={`absolute pointer-events-none ${glowClass}`}>
        <div
          className="bg-emerald-500/5 blur-[120px] rounded-full"
          style={{ width: glowSize, height: glowSize }}
        />
      </div>
    </>
  );
}