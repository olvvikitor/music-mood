"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { CoreAxes } from "@/app/dashboard/types/music";
import { toPercent } from "../utils/functions";

const RUSSELL_EMOTIONS = [
  { label: "Eufórico",   angle: 30,  color: "#34d399" },
  { label: "Animado",    angle: 55,  color: "#34d399" },
  { label: "Feliz",      angle: 75,  color: "#6ee7b7" },
  { label: "Alerta",     angle: 100, color: "#fbbf24" },
  { label: "Tenso",      angle: 120, color: "#f87171" },
  { label: "Irritado",   angle: 145, color: "#f87171" },
  { label: "Estressado", angle: 160, color: "#fb923c" },
  { label: "Triste",     angle: 210, color: "#94a3b8" },
  { label: "Deprimido",  angle: 235, color: "#94a3b8" },
  { label: "Entediado",  angle: 255, color: "#64748b" },
  { label: "Relaxado",   angle: 285, color: "#38bdf8" },
  { label: "Sereno",     angle: 310, color: "#38bdf8" },
  { label: "Calmo",      angle: 330, color: "#7dd3fc" },
];

function polarToXY(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 - radius * Math.sin(rad),
  };
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

export function EmotionalChart({ coreAxes }: { coreAxes: CoreAxes }) {
  const dotX = toPercent(coreAxes.polaridade);
  const dotY = toPercent(-coreAxes.ativacao);

  const containerRef    = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan]   = useState({ x: 0, y: 0 });
  const isDragging      = useRef(false);
  const lastMouse       = useRef({ x: 0, y: 0 });
  const lastTouchDist   = useRef<number | null>(null);
  const lastTouchMid    = useRef<{ x: number; y: number } | null>(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  const clampPan = useCallback(
    (x: number, y: number, z: number) => {
      const maxOffset = ((z - 1) / z) * 50;
      return {
        x: Math.max(-maxOffset, Math.min(maxOffset, x)),
        y: Math.max(-maxOffset, Math.min(maxOffset, y)),
      };
    },
    []
  );

  const applyZoom = useCallback(
    (delta: number, originX: number, originY: number) => {
      setZoom((prev) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev + delta));
        if (next === prev) return prev;
        setPan((p) => {
          const scale = next / prev;
          const newX  = originX + (p.x - originX) * scale;
          const newY  = originY + (p.y - originY) * scale;
          return clampPan(newX, newY, next);
        });
        return next;
      });
    },
    [clampPan]
  );

  // ── wheel zoom ────────────────────────────────────────────────────────────
  const onWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const rect = containerRef.current!.getBoundingClientRect();
      const ox = ((e.clientX - rect.left) / rect.width  - 0.5) * 100;
      const oy = ((e.clientY - rect.top)  / rect.height - 0.5) * 100;
      applyZoom(-e.deltaY * 0.003, ox, oy);
    },
    [applyZoom]
  );

  // ── mouse drag ────────────────────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current  = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx   = ((e.clientX - lastMouse.current.x) / rect.width)  * 100;
      const dy   = ((e.clientY - lastMouse.current.y) / rect.height) * 100;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      setZoom((z) => { setPan((p) => clampPan(p.x + dx, p.y + dy, z)); return z; });
    },
    [clampPan]
  );

  const onMouseUp = () => { isDragging.current = false; };

  // ── touch pinch/pan ───────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const [a, b]          = [e.touches[0], e.touches[1]];
      lastTouchDist.current = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
      lastTouchMid.current  = { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
    } else if (e.touches.length === 1) {
      lastMouse.current  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isDragging.current = true;
    }
  };

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      if (e.touches.length === 2) {
        const [a, b] = [e.touches[0], e.touches[1]];
        const dist   = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
        const mid    = { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };

        if (lastTouchDist.current !== null && lastTouchMid.current !== null) {
          const delta = (dist - lastTouchDist.current) * 0.02;
          const ox    = ((mid.x - rect.left) / rect.width  - 0.5) * 100;
          const oy    = ((mid.y - rect.top)  / rect.height - 0.5) * 100;
          applyZoom(delta, ox, oy);

          const dx = ((mid.x - lastTouchMid.current.x) / rect.width)  * 100;
          const dy = ((mid.y - lastTouchMid.current.y) / rect.height) * 100;
          setZoom((z) => { setPan((p) => clampPan(p.x + dx, p.y + dy, z)); return z; });
        }

        lastTouchDist.current = dist;
        lastTouchMid.current  = mid;
      } else if (e.touches.length === 1 && isDragging.current) {
        const dx = ((e.touches[0].clientX - lastMouse.current.x) / rect.width)  * 100;
        const dy = ((e.touches[0].clientY - lastMouse.current.y) / rect.height) * 100;
        lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setZoom((z) => { setPan((p) => clampPan(p.x + dx, p.y + dy, z)); return z; });
      }
    },
    [applyZoom, clampPan]
  );

  const onTouchEnd = () => {
    isDragging.current    = false;
    lastTouchDist.current = null;
    lastTouchMid.current  = null;
  };

  // ── global listeners ──────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    el?.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      el?.removeEventListener("touchmove", onTouchMove);
    };
  }, [onMouseMove, onTouchMove]);

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const emotionLabelRadius = 43;
  const emotionDotRadius   = 37;

  const svgTransform = `translate(${50 + pan.x} ${50 + pan.y}) scale(${zoom}) translate(-50 -50)`;

  return (
    <div className="flex flex-col gap-3 h-full justify-center">

      <div className="relative w-full max-w-56 mx-auto">

        {/* Controles de zoom */}
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[8px] text-slate-600 font-mono">{zoom.toFixed(1)}×</span>
          <div className="flex gap-1">
            <button
              onClick={() => applyZoom(0.5, 0, 0)}
              className="w-5 h-5 rounded bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors text-xs leading-none flex items-center justify-center"
            >+</button>
            <button
              onClick={() => applyZoom(-0.5, 0, 0)}
              className="w-5 h-5 rounded bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors text-xs leading-none flex items-center justify-center"
            >−</button>
            <button
              onClick={resetView}
              className="w-5 h-5 rounded bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors text-[9px] leading-none flex items-center justify-center"
              title="Resetar"
            >↺</button>
          </div>
        </div>

        {/* Container do gráfico */}
        <div
          ref={containerRef}
          className="relative aspect-square select-none overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="grad-tr" cx="75%" cy="25%" r="55%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-tl" cx="25%" cy="25%" r="55%">
                <stop offset="0%" stopColor="#f87171" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-bl" cx="25%" cy="75%" r="55%">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="grad-br" cx="75%" cy="75%" r="55%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
              <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <clipPath id="chart-clip">
                <rect width="100" height="100" rx="12" />
              </clipPath>
            </defs>

            {/* Background estático */}
            <rect width="100" height="100" rx="12" fill="#0f1117" />
            <rect width="100" height="100" rx="12" fill="url(#grad-tr)" />
            <rect width="100" height="100" rx="12" fill="url(#grad-tl)" />
            <rect width="100" height="100" rx="12" fill="url(#grad-bl)" />
            <rect width="100" height="100" rx="12" fill="url(#grad-br)" />

            {/* Tudo que faz zoom/pan */}
            <g transform={svgTransform} clipPath="url(#chart-clip)">

              {[12, 24, 36].map((r) => (
                <circle key={r} cx="50" cy="50" r={r}
                  fill="none" stroke="white" strokeOpacity="0.04"
                  strokeWidth={0.4 / zoom} />
              ))}

              <line x1="50" y1="4" x2="50" y2="96"
                stroke="white" strokeOpacity="0.12"
                strokeWidth={0.4 / zoom} strokeDasharray={`${1 / zoom},${1 / zoom}`} />
              <line x1="4" y1="50" x2="96" y2="50"
                stroke="white" strokeOpacity="0.12"
                strokeWidth={0.4 / zoom} strokeDasharray={`${1 / zoom},${1 / zoom}`} />

              <polygon points="50,2 48.5,5.5 51.5,5.5" fill="white" fillOpacity="0.2" />
              <polygon points="50,98 48.5,94.5 51.5,94.5" fill="white" fillOpacity="0.2" />
              <polygon points="98,50 94.5,48.5 94.5,51.5" fill="white" fillOpacity="0.2" />
              <polygon points="2,50 5.5,48.5 5.5,51.5" fill="white" fillOpacity="0.2" />

              <text x="50" y="1.5" textAnchor="middle"
                fontSize={2.5 / zoom} fill="white" fillOpacity="0.25" fontFamily="monospace">ATIVAÇÃO</text>
              <text x="50" y="99.5" textAnchor="middle"
                fontSize={2.5 / zoom} fill="white" fillOpacity="0.25" fontFamily="monospace">CALMA</text>
              <text x="97" y="51.5" textAnchor="end"
                fontSize={2.5 / zoom} fill="white" fillOpacity="0.25" fontFamily="monospace">+</text>
              <text x="3" y="51.5" textAnchor="start"
                fontSize={2.5 / zoom} fill="white" fillOpacity="0.25" fontFamily="monospace">−</text>

              {RUSSELL_EMOTIONS.map((e) => {
                const dot   = polarToXY(e.angle, emotionDotRadius);
                const label = polarToXY(e.angle, emotionLabelRadius);
                const anchor =
                  label.x > 55 ? "start" :
                  label.x < 45 ? "end"   : "middle";
                return (
                  <g key={e.label}>
                    <circle cx={dot.x} cy={dot.y} r={1 / zoom}
                      fill={e.color} fillOpacity="0.6" />
                    <text x={label.x} y={label.y + 0.8 / zoom}
                      textAnchor={anchor}
                      fontSize={2.4 / zoom}
                      fontFamily="monospace"
                      fill={e.color}
                      fillOpacity="0.6">
                      {e.label}
                    </text>
                  </g>
                );
              })}

              <line x1={dotX} y1={dotY} x2={dotX} y2="50"
                stroke="#34d399" strokeOpacity="0.25"
                strokeWidth={0.35 / zoom} strokeDasharray={`${1 / zoom},${1 / zoom}`} />
              <line x1={dotX} y1={dotY} x2="50" y2={dotY}
                stroke="#34d399" strokeOpacity="0.25"
                strokeWidth={0.35 / zoom} strokeDasharray={`${1 / zoom},${1 / zoom}`} />

              <circle cx={dotX} cy="50" r={0.8 / zoom} fill="#34d399" fillOpacity="0.5" />
              <circle cx="50" cy={dotY} r={0.8 / zoom} fill="#34d399" fillOpacity="0.5" />

              <circle cx={dotX} cy={dotY} r={5 / zoom}   fill="#34d399" fillOpacity="0.08" />
              <circle cx={dotX} cy={dotY} r={3 / zoom}   fill="#34d399" fillOpacity="0.15" />
              <circle cx={dotX} cy={dotY} r={1.8 / zoom} fill="#34d399" fillOpacity="0.9" filter="url(#glow)" />
            </g>
          </svg>

          {/* Ping animado acompanha zoom/pan */}
          <span
            className="absolute pointer-events-none"
            style={{
              left:      `${50 + (dotX - 50) * zoom + pan.x}%`,
              top:       `${50 + (dotY - 50) * zoom + pan.y}%`,
              width:     `${Math.max(6, 12 / zoom)}px`,
              height:    `${Math.max(6, 12 / zoom)}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
          </span>

          {zoom === 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[7px] text-white/20 font-mono pointer-events-none whitespace-nowrap">
              scroll ou pinça para zoom · arraste para mover
            </div>
          )}
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="flex gap-2">
        <div className="flex-1 bg-white/5 rounded-lg p-2 border border-white/10 text-center">
          <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">Valência</p>
          <p className={`text-xs font-bold ${coreAxes.polaridade >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {coreAxes.polaridade >= 0 ? "Positivo" : "Negativo"}
          </p>
          <p className="text-[9px] text-slate-500 font-mono">
            {coreAxes.polaridade >= 0 ? "+" : ""}{Math.round(coreAxes.polaridade * 100)}%
          </p>
        </div>
        <div className="flex-1 bg-white/5 rounded-lg p-2 border border-white/10 text-center">
          <p className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">Ativação</p>
          <p className={`text-xs font-bold ${coreAxes.ativacao >= 0 ? "text-orange-400" : "text-sky-400"}`}>
            {coreAxes.ativacao >= 0 ? "Alta" : "Baixa"}
          </p>
          <p className="text-[9px] text-slate-500 font-mono">
            {coreAxes.ativacao >= 0 ? "+" : ""}{Math.round(coreAxes.ativacao * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}