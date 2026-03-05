// hooks/useParticleCanvas.ts
// Canvas de partículas flutuantes – compartilhado pelas 3 páginas.
// Uso: const canvasRef = useParticleCanvas();

import { useEffect, useRef } from "react";

type Options = {
  /** Quantidade de partículas (default: 200) */
  count?: number;
  /** Velocidade máxima (default: 0.3) */
  speed?: number;
  /** Ativar gravidade orbital (usado na LoginPage) */
  gravity?: boolean;
};

const COLORS = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#ffffff"];

export function useParticleCanvas(options: Options = {}) {
  const { count = 200, speed = 0.3, gravity = false } = options;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: count }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     0.4 + Math.random() * 2.5,
      vx:    (Math.random() - 0.5) * speed,
      vy:    (Math.random() - 0.5) * speed,
      alpha: 0.1 + Math.random() * 0.55,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    // Satélites orbitais para o modo gravity (LoginPage)
    const orbiters = gravity
      ? [
          { radius: 150, speed: (2 * Math.PI) / (11 * 60), angle: 0 },
          { radius: 210, speed: (2 * Math.PI) / (19 * 60), angle: (2 * Math.PI) / 3 },
          { radius: 275, speed: (2 * Math.PI) / (29 * 60), angle: (4 * Math.PI) / 3 },
        ]
      : [];

    const G        = 120;
    const MAX_SPD  = 0.2;

    let raf: number;

    const draw = () => {
      // Centro gravitacional: 30% horizontal (como na LoginPage original)
      const cx = gravity ? canvas.width * 0.30 : canvas.width  * 0.5;
      const cy = canvas.height * 0.5;

      if (gravity) {
        for (const o of orbiters) o.angle += o.speed;
      }

      const satellites = orbiters.map(o => ({
        x: cx + Math.cos(o.angle) * o.radius,
        y: cy + Math.sin(o.angle) * o.radius,
      }));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of dots) {
        if (gravity) {
          for (const s of satellites) {
            const dx   = s.x - p.x;
            const dy   = s.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 50 || dist > 200) continue;
            const force = G / (dist * dist);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (spd > MAX_SPD) { p.vx = (p.vx / spd) * MAX_SPD; p.vy = (p.vy / spd) * MAX_SPD; }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle   = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, speed, gravity]);

  return canvasRef;
}