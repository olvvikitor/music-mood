"use client";

import { useEffect, useState } from "react";
import { getMoodWeek, type MoodWeekItem } from "../services/profileStatsService";
import { getMoodTextColor } from "@/shared/lib/moodHelpers";

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "var(--surface-card-alt)" }} />;
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function moodColor(score: number) {
    if (score >= 0.7) return "#00ffb3";
    if (score >= 0.4) return "#a259ff";
    return "#ff2d87";
}

// Agrupa itens por dia (usa o mais recente de cada dia)
function groupByDay(items: MoodWeekItem[]): (MoodWeekItem | null)[] {
    // Gera os últimos 7 dias
    const days: (MoodWeekItem | null)[] = Array(7).fill(null);
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayStr = d.toISOString().slice(0, 10);

        const match = items.find(item => item.analyzedAt.slice(0, 10) === dayStr);
        days[6 - i] = match ?? null;
    }

    return days;
}

export function MoodWeekChart() {
    const [data, setData] = useState<MoodWeekItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMoodWeek().then(setData).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const days = groupByDay(data);
    const maxScore = 1;

    // Labels dos últimos 7 dias
    const dayLabels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return DAYS[d.getDay()];
    });

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                Humor da Semana
            </h2>

            <div className="rounded-2xl p-4" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
                {loading ? (
                    <div className="flex items-end gap-2 h-32 animate-pulse">
                        {[60,80,40,90,55,70,45].map((h, i) => (
                            <div key={i} className="flex-1 rounded-t-lg"
                                style={{ height: `${h}%`, background: "var(--surface-card-alt)" }} />
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Gráfico de barras */}
                        <div className="flex items-end gap-2" style={{ height: 120 }}>
                            {days.map((item, i) => {
                                const pct = item ? Math.round(item.moodScore * 100) : 0;
                                const color = item ? moodColor(item.moodScore) : "var(--border)";
                                const hasData = !!item;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5" style={{ height: "100%" }}>
                                        {/* Tooltip simples com sentimento */}
                                        {hasData && (
                                            <span className="text-[8px] font-bold text-center leading-tight px-0.5 truncate w-full text-center"
                                                style={{ color, fontFamily: "var(--font-display)" }}>
                                                {pct}%
                                            </span>
                                        )}
                                        <div
                                            className="w-full rounded-t-lg transition-all duration-700 relative group"
                                            style={{
                                                height: hasData ? `${Math.max(pct, 8)}%` : "6%",
                                                background: hasData
                                                    ? `linear-gradient(180deg, ${color}, ${color}55)`
                                                    : "var(--border)",
                                                opacity: hasData ? 1 : 0.4,
                                            }}
                                        >
                                            {/* Tooltip no hover */}
                                            {hasData && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap"
                                                    style={{
                                                        background: "var(--surface-solid)",
                                                        border: "1px solid var(--border-medium)",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                                    }}>
                                                    <span className="text-[10px] font-semibold block"
                                                        style={{ color: getMoodTextColor(item!.sentiment), fontFamily: "var(--font-display)" }}>
                                                        {item!.sentiment}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Labels dos dias */}
                        <div className="flex gap-2 mt-2">
                            {dayLabels.map((label, i) => (
                                <span key={i} className="flex-1 text-center text-[9px] uppercase tracking-wider"
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        color: i === 6 ? "var(--text-secondary)" : "var(--text-faint)",
                                        fontWeight: i === 6 ? 700 : 400,
                                    }}>
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* Legenda de cores */}
                        <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                            {[
                                { color: "#00ffb3", label: "Alto (≥70%)" },
                                { color: "#a259ff", label: "Médio (40-70%)" },
                                { color: "#ff2d87", label: "Baixo (<40%)" },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                                    <span className="text-[9px]" style={{ color: "var(--text-faint)", fontFamily: "var(--font-display)" }}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
