"use client";

import { useEffect, useRef, useState } from "react";
import { EmotionalVector } from "@/app/dashboard/types/music";
import { DIMENSION_LABELS } from "@/shared/lib/moodHelpers";
import { useTheme } from "@/shared/providers/ThemeProvider";

interface EmotionalVectorBarsProps {
    vector: EmotionalVector;
    className?: string;
}

const COLOR_HEX: Record<string, string> = {
    Valencia:        "#34d399",
    Energia:         "#fb923c",
    Dominancia:      "#fbbf24",
    Melancolia:      "#60a5fa",
    Euforia:         "#facc15",
    Tensao:          "#f87171",
    ConexaoSocial:   "#f472b6",
    Introspeccao:    "#a78bfa",
    Empoderamento:   "#22d3ee",
    Vulnerabilidade: "#e879f9",
};

export function EmotionalVectorBars({ vector, className = "" }: EmotionalVectorBarsProps) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const isLight = theme === "light";

    // Trigger animation on mount (or when entering viewport)
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    const sorted = Object.entries(vector ?? {})
        .sort(([, a], [, b]) => b - a)
        .filter(([, val]) => val > 0);

    return (
        <div ref={ref} className={`flex flex-col gap-3 ${className}`}>
            {sorted.map(([key, value], i) => {
                const pct = Math.round(value * 100);
                const hex = COLOR_HEX[key] ?? "#6fae9b";
                const label = DIMENSION_LABELS[key] ?? key;
                const labelColor = isLight ? "rgba(12,12,18,0.60)" : "rgba(255,255,255,0.35)";
                const trackColor = isLight ? "rgba(12,12,18,0.10)" : "rgba(255,255,255,0.05)";

                return (
                    <div
                        key={key}
                        className="group flex flex-col gap-1.5"
                        style={{
                            opacity: 0,
                            animation: visible
                                ? `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms both`
                                : "none",
                        }}
                    >
                        {/* Label row */}
                        <div className="flex items-center justify-between">
                            <span
                                className="text-[11px] uppercase tracking-[0.12em] font-700"
                                style={{
                                    color: labelColor,
                                    fontFamily: "var(--font-display)",
                                    fontWeight: 700,
                                }}
                            >
                                {label}
                            </span>
                            <span
                                className="text-[11px] font-700 tabular-nums"
                                style={{ color: hex, fontFamily: "var(--font-display)", fontWeight: 700 }}
                            >
                                {pct}%
                            </span>
                        </div>

                        {/* Track */}
                        <div
                            className="h-1 w-full rounded-full overflow-hidden relative"
                            style={{ background: trackColor }}
                        >
                            {/* Fill */}
                            <div
                                className="absolute left-0 top-0 h-full rounded-full"
                                style={{
                                    width: visible ? `${pct}%` : "0%",
                                    background: `linear-gradient(90deg, ${hex}cc, ${hex})`,
                                    boxShadow: `0 0 8px ${hex}66`,
                                    transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 55 + 100}ms`,
                                }}
                            />
                            {/* Shimmer */}
                            <div
                                className="absolute top-0 h-full rounded-full opacity-40 blur-[1px]"
                                style={{
                                    width: visible ? `${pct}%` : "0%",
                                    background: `linear-gradient(90deg, transparent 60%, ${hex})`,
                                    transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 55 + 100}ms`,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

