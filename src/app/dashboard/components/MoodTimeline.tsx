"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { getMoodHistory, type MoodHistoryItem } from "../services/profileStatsService";
import { getMoodTextColor } from "@/shared/lib/moodHelpers";

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "var(--surface-card-alt)" }} />;
}

function moodColor(score: number) {
    if (score >= 0.7) return "#00ffb3";
    if (score >= 0.4) return "#a259ff";
    return "#ff2d87";
}

function formatDate(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 3600)  return `${Math.floor(diff / 60)}min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function MoodTimeline() {
    const [items, setItems]   = useState<MoodHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        getMoodHistory(20).then(setItems).catch(() => {}).finally(() => setLoading(false));
    }, []);

    const visible = showAll ? items : items.slice(0, 6);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                Linha do Tempo
            </h2>

            <div className="relative">
                {/* Linha vertical */}
                {!loading && items.length > 0 && (
                    <div className="absolute left-[19px] top-2 bottom-2 w-px"
                        style={{ background: "var(--border)" }} />
                )}

                <ul className="flex flex-col gap-0">
                    {loading ? (
                        [1,2,3,4].map(i => (
                            <li key={i} className="flex items-start gap-3 pb-4 animate-pulse">
                                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                <div className="flex-1 flex flex-col gap-2 pt-1">
                                    <Skeleton className="h-3.5 w-28" />
                                    <Skeleton className="h-2.5 w-20" />
                                    <Skeleton className="h-1 w-full rounded-full" />
                                </div>
                            </li>
                        ))
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center py-10 gap-3 text-center">
                            <History className="w-8 h-8" style={{ color: "var(--text-ghost)" }} />
                            <p className="text-sm font-semibold" style={{ color: "var(--text-faint)" }}>
                                Nenhum mood registrado ainda.
                            </p>
                            <p className="text-xs" style={{ color: "var(--text-ghost)" }}>
                                Gere seu primeiro mood no perfil.
                            </p>
                        </div>
                    ) : (
                        visible.map((item, i) => {
                            const color = moodColor(item.moodScore);
                            const pct   = Math.round(item.moodScore * 100);
                            const topEmotions = Object.entries(item.emotions ?? {})
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 3);

                            return (
                                <li key={item.id} className="flex items-start gap-3 pb-5 relative">
                                    {/* Dot na linha do tempo */}
                                    <div className="relative shrink-0 z-10">
                                        {item.image_mood ? (
                                            <div className="w-10 h-10 rounded-full overflow-hidden"
                                                style={{ boxShadow: `0 0 0 2px ${color}50, 0 0 0 4px var(--bg-page)` }}>
                                                <img src={item.image_mood} alt={item.sentiment}
                                                    className="w-full h-full object-cover object-top" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                                                style={{
                                                    background: `${color}18`,
                                                    border: `2px solid ${color}50`,
                                                    boxShadow: `0 0 0 3px var(--bg-page)`,
                                                    color,
                                                    fontFamily: "var(--font-display)",
                                                }}>
                                                {pct}
                                            </div>
                                        )}
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="flex-1 min-w-0 rounded-2xl px-3 py-2.5"
                                        style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <span className="text-sm font-bold truncate"
                                                style={{ color: getMoodTextColor(item.sentiment), fontFamily: "var(--font-display)" }}>
                                                {item.sentiment}
                                            </span>
                                            <span className="text-[10px] shrink-0" style={{ color: "var(--text-faint)" }}>
                                                {formatDate(item.analyzedAt)}
                                            </span>
                                        </div>

                                        {/* Barra de score */}
                                        <div className="h-1 rounded-full mb-2" style={{ background: "var(--border)" }}>
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
                                        </div>

                                        {/* Top emoções */}
                                        <div className="flex flex-wrap gap-1">
                                            {topEmotions.map(([k, v]) => (
                                                <span key={k} className="text-[9px] px-1.5 py-0.5 rounded-full"
                                                    style={{
                                                        background: "var(--surface-card-alt)",
                                                        color: "var(--text-faint)",
                                                        border: "1px solid var(--border-subtle)",
                                                    }}>
                                                    {k} {Math.round(v * 100)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    )}
                </ul>

                {/* Ver mais / menos */}
                {!loading && items.length > 6 && (
                    <button
                        onClick={() => setShowAll(p => !p)}
                        className="w-full text-xs font-semibold py-2.5 rounded-xl transition-all"
                        style={{
                            background: "var(--surface-card)",
                            border: "1px solid var(--border)",
                            color: "var(--text-muted)",
                        }}
                    >
                        {showAll ? "Ver menos ↑" : `Ver mais ${items.length - 6} registros ↓`}
                    </button>
                )}
            </div>
        </div>
    );
}
