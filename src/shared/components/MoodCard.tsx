"use client";

import { useEffect, useState } from "react";
import { CoreAxes, EmotionalVector } from "@/app/dashboard/types/music";
import { CLUSTER, intensityMeta, quadrantMeta, valenceMeta, activationMeta } from "../lib/moodCardHelpers";
import { MoodBadge } from "./MoodBadge";
import { EmotionalVectorBars } from "./EmotionalVectorBars";
import { Sparkles, Zap } from "lucide-react";
import { getMoodDisplayName } from "@/shared/lib/moodHelpers";
import { useTheme } from "@/shared/providers/ThemeProvider";

type MoodCardData = {
    dominantSentiment: string;
    coreAxes: CoreAxes;
    moodScore: number;
    reasoning?: string;
    emotionalVector: EmotionalVector;
    mostListenedSubgenre?: string;
    mostListenedSong?: {
        name: string;
        artist: string;
        img_url: string;
    };
};

interface MoodCardProps {
    data: MoodCardData;
    mode?: "hero" | "track";
}

export function MoodCard({ data, mode = "hero" }: MoodCardProps) {
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const isLight = theme === "light";
    useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

    const key = data.dominantSentiment?.toLowerCase() ?? "";
    const dominantLabel = getMoodDisplayName(data.dominantSentiment, data.dominantSentiment);
    const cluster = CLUSTER[key];
    const { quadrante, polaridade, ativacao } = data.coreAxes;
    const quadrant  = quadrantMeta(quadrante);
    const valence   = valenceMeta(polaridade);
    const activation = activationMeta(ativacao);
    const intensity = intensityMeta(Math.abs(ativacao));
    const metricCardBg = isLight ? "rgba(12,12,18,0.04)" : "rgba(255,255,255,0.025)";
    const metricCardBorder = isLight ? "rgba(12,12,18,0.12)" : "rgba(255,255,255,0.06)";
    const subtleLabelColor = isLight ? "rgba(12,12,18,0.58)" : "rgba(255,255,255,0.25)";
    const secondaryTextColor = isLight ? "rgba(12,12,18,0.78)" : "rgba(255,255,255,0.70)";
    const scoreTrackBg = isLight ? "rgba(12,12,18,0.10)" : "rgba(255,255,255,0.06)";
    const reasoningTextColor = isLight ? "rgba(12,12,18,0.72)" : "rgba(255,255,255,0.55)";

    // â”€â”€ TRACK mode (used in drawer inline) â”€â”€
    if (mode === "track") {
        return (
            <div className="flex flex-col gap-3 p-1">
                {data.reasoning && (
                    <div className="px-3 py-2.5 rounded-xl"
                        style={{
                            background: "rgba(176,106,133,0.05)",
                            borderLeft: "2px solid rgba(176,106,133,0.3)",
                            border: "1px solid rgba(176,106,133,0.08)",
                        }}>
                        <p className="text-[13px] italic leading-relaxed text-white/65"
                            style={{ fontFamily: "var(--font-body)" }}>
                            "{data.reasoning}"
                        </p>
                    </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                    {[
                        { label: "Quadrante", value: quadrant.label, color: "#8a7bb8" },
                        { label: "Intensidade", value: intensity.label, color: "#fb923c" },
                        { label: "Score", value: `${Math.round(data.moodScore * 100)}%`, color: "#6fae9b" },
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <span className="text-[9px] uppercase tracking-wider text-white/30"
                                style={{ fontFamily: "var(--font-display)" }}>{item.label}</span>
                            <span className="text-[10px] font-700"
                                style={{ color: item.color, fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // â”€â”€ HERO mode (dashboard mix emocional) â”€â”€
    const accentColor = cluster?.color ?? "#6fae9b";

    return (
        <div className="flex flex-col gap-4 h-full"
            style={{
                opacity: mounted ? 1 : 0,
                transition: "opacity 0.5s ease",
            }}>

            {/* Hero sentiment block */}
            <div
                className="relative rounded-2xl p-4 overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${accentColor}10, rgba(0,0,0,0))`,
                    border: `1px solid ${accentColor}20`,
                    animation: mounted ? "fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both" : "none",
                }}
            >
                {/* Ambient */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[50px] pointer-events-none"
                    style={{ background: accentColor, opacity: 0.08 }} />

                <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                        <p className="text-[9px] uppercase tracking-[0.2em] font-700 text-white/30"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            Vibe dominante
                        </p>
                        <h2 className="text-2xl font-900 uppercase leading-tight text-white"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}>
                            {dominantLabel}
                        </h2>
                        {cluster?.phrase && (
                            <p className="text-[11px] italic font-500"
                                style={{ color: accentColor, opacity: 0.8, fontFamily: "var(--font-body)" }}>
                                "{cluster.phrase}"
                            </p>
                        )}
                    </div>
                    <MoodBadge mood={data.dominantSentiment} size="sm" label={dominantLabel} />
                </div>

                {/* Score bar */}
                <div className="mt-3 relative z-10 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider text-white/20"
                            style={{ fontFamily: "var(--font-display)" }}>
                            Intensidade
                        </span>
                        <span className="text-[10px] font-700"
                            style={{ color: accentColor, fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            {Math.round(data.moodScore * 100)}%
                        </span>
                    </div>
                    <div className="h-0.5 w-full rounded-full" style={{ background: scoreTrackBg }}>
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: mounted ? `${Math.round(data.moodScore * 100)}%` : "0%",
                                background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
                                boxShadow: `0 0 8px ${accentColor}60`,
                                transition: "width 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Valence + Activation grid */}
            <div
                className="grid grid-cols-2 gap-2"
                style={{ animation: mounted ? "fadeInUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both" : "none" }}
            >
                {[
                    { label: "Valencia", emoji: valence.emoji, value: valence.label, color: valence.color },
                    { label: "Ativacao", emoji: activation.emoji, value: activation.label, color: activation.color },
                ].map(item => (
                    <div key={item.label}
                        className="flex flex-col gap-2 px-3 py-3 rounded-xl"
                        style={{ background: metricCardBg, border: `1px solid ${metricCardBorder}` }}>
                        <span className="text-[10px] uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-display)", color: subtleLabelColor }}>
                            {item.label}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-lg leading-none">{item.emoji}</span>
                            <span className="text-[12px] font-700 leading-tight"
                                style={{ color: item.color, fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                {item.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quadrant chip */}
            <div
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                style={{
                    background: "rgba(138,123,184,0.06)",
                    border: "1px solid rgba(138,123,184,0.15)",
                    animation: mounted ? "fadeInUp 0.5s 0.18s cubic-bezier(0.16,1,0.3,1) both" : "none",
                }}
            >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(138,123,184,0.15)" }}>
                    <Zap className="w-3 h-3" style={{ color: "#8a7bb8" }} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-display)", color: subtleLabelColor }}>
                        Quadrante
                    </span>
                    <span className="text-[12px] font-700"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: secondaryTextColor }}>
                        {quadrant.label} - {quadrant.desc}
                    </span>
                </div>
            </div>

            {/* AI reasoning */}
            {data.reasoning && (
                <div
                    className="px-3 py-3 rounded-xl flex gap-2 items-start"
                    style={{
                        background: "rgba(176,106,133,0.04)",
                        border: "1px solid rgba(176,106,133,0.1)",
                        borderLeft: "2px solid rgba(176,106,133,0.4)",
                        animation: mounted ? "fadeInUp 0.5s 0.25s cubic-bezier(0.16,1,0.3,1) both" : "none",
                    }}
                >
                    <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#b06a85", opacity: 0.6 }} />
                    <p className="text-[12px] italic leading-relaxed"
                        style={{ fontFamily: "var(--font-body)", color: reasoningTextColor }}>
                        "{data.reasoning}"
                    </p>
                </div>
            )}

            {/* Most Listened Info */}
            {(data.mostListenedSong || data.mostListenedSubgenre) && (
                <div
                    className="flex items-center gap-3 px-3 py-3 rounded-xl"
                    style={{
                        background: metricCardBg,
                        border: `1px solid ${metricCardBorder}`,
                        animation: mounted ? "fadeInUp 0.5s 0.28s cubic-bezier(0.16,1,0.3,1) both" : "none",
                    }}
                >
                    {data.mostListenedSong?.img_url ? (
                        <div className="relative shrink-0 w-10 h-10 rounded-md overflow-hidden shadow-sm" style={{ border: `1px solid ${metricCardBorder}` }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={data.mostListenedSong.img_url} 
                                alt={data.mostListenedSong.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0 shadow-sm"
                            style={{ background: "rgba(138,123,184,0.1)", border: `1px solid ${metricCardBorder}` }}>
                            <Zap className="w-4 h-4" style={{ color: "#8a7bb8", opacity: 0.5 }} />
                        </div>
                    )}
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                        <span className="text-[9px] uppercase tracking-wider mb-0.5"
                            style={{ fontFamily: "var(--font-display)", color: subtleLabelColor, fontWeight: 600 }}>
                            Principais do Dia
                        </span>
                        {data.mostListenedSong && (
                            <span className="text-[12px] font-800 truncate block"
                                style={{ fontFamily: "var(--font-display)", color: secondaryTextColor }}>
                                {data.mostListenedSong.name}
                                <span className="font-400 opacity-70 ml-1">· {data.mostListenedSong.artist}</span>
                            </span>
                        )}
                        {data.mostListenedSubgenre && (
                            <span className="text-[10px] italic truncate block mt-0.5"
                                style={{ color: accentColor, fontFamily: "var(--font-body)", opacity: 0.9 }}>
                                Subgênero top: <span className="font-700 capitalize">{data.mostListenedSubgenre}</span>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Emotional vector */}
            <div
                className="flex flex-col gap-2.5"
                style={{ animation: mounted ? "fadeInUp 0.5s 0.32s cubic-bezier(0.16,1,0.3,1) both" : "none" }}
            >
                <span className="text-[10px] uppercase tracking-[0.15em] font-700"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: subtleLabelColor }}>
                    Espectro emocional
                </span>
                <EmotionalVectorBars vector={data.emotionalVector} />
            </div>
        </div>
    );
}

