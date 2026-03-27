"use client";

import { useState } from "react";
import Image from "next/image";
import { Music2, BarChart2, ChevronDown } from "lucide-react";
import { MoodBadge } from "@/shared/components/MoodBadge";
import { compareMood, type CompareMoodData, type Friend } from "@/shared/services/friendService";
import { getMoodTextColor } from "@/shared/lib/moodHelpers";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type FeedPostData = Friend & {
    isPlaying: boolean;
    track?: {
        music: string;
        artist: string;
        img_url: string;
        moodScore: number;
        dominantSentiment: string;
        reasoning: string;
    };
    mood?: {
        moodScore: number;
        sentiment: string;
        emotions: Record<string, number>;
    } | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function moodColor(score: number) {
    if (score >= 0.7) return "#00ffb3";
    if (score >= 0.4) return "#a259ff";
    return "#ff2d87";
}

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-lg bg-white/[0.06] animate-pulse ${className}`} />;
}

// ─── Painel Comparar Mood ─────────────────────────────────────────────────────

function CompareDrawer({ friendId, friendName, onClose }: {
    friendId: string;
    friendName: string;
    onClose: () => void;
}) {
    const [data, setData] = useState<CompareMoodData | null>(null);
    const [loading, setLoading] = useState(true);

    useState(() => {
        compareMood(friendId).then(setData).catch(() => {}).finally(() => setLoading(false));
    });

    const me     = data?.me;
    const friend = data?.friend;
    const myPct   = Math.round((me?.moodScore ?? 0) * 100);
    const themPct = Math.round((friend?.moodScore ?? 0) * 100);
    const harmony = 100 - Math.abs(myPct - themPct);
    const harmonyColor = harmony >= 70 ? "#00ffb3" : harmony >= 40 ? "#a259ff" : "#ff2d87";

    return (
        <div
            className="mx-4 mb-4 rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
            {/* Header do drawer */}
            <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40"
                    style={{ fontFamily: "var(--font-display)" }}>
                    Comparação de Mood
                </span>
                <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col gap-3 p-4 animate-pulse">
                    <Skeleton className="h-8 w-full rounded-xl" />
                    <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-16 rounded-xl" />
                        <Skeleton className="h-16 rounded-xl" />
                    </div>
                </div>
            ) : !me || !friend ? (
                <p className="text-xs text-white/30 p-4 text-center">Dados não disponíveis.</p>
            ) : (
                <div className="p-4 flex flex-col gap-4">
                    {/* Harmonia */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] uppercase tracking-widest text-white/30"
                                style={{ fontFamily: "var(--font-display)" }}>Harmonia emocional</span>
                            <span className="text-base font-black" style={{ color: harmonyColor, fontFamily: "var(--font-display)" }}>
                                {harmony}%
                            </span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                            <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${harmony}%`, background: `linear-gradient(90deg, #00ffb3, ${harmonyColor})` }} />
                        </div>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl p-3" style={{ background: "rgba(0,255,179,0.06)", border: "1px solid rgba(0,255,179,0.15)" }}>
                            <span className="text-[9px] uppercase tracking-widest block" style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>Você</span>
                            <span className="text-2xl font-black block mt-0.5" style={{ color: "#00ffb3", fontFamily: "var(--font-display)" }}>{myPct}%</span>
                            <span className="text-[10px] block truncate mt-0.5" style={{ color: getMoodTextColor(me.sentiment) }}>{me.sentiment}</span>
                        </div>
                        <div className="rounded-xl p-3" style={{ background: "rgba(162,89,255,0.06)", border: "1px solid rgba(162,89,255,0.15)" }}>
                            <span className="text-[9px] uppercase tracking-widest block" style={{ color: "#a259ff", fontFamily: "var(--font-display)" }}>{friendName}</span>
                            <span className="text-2xl font-black block mt-0.5" style={{ color: "#a259ff", fontFamily: "var(--font-display)" }}>{themPct}%</span>
                            <span className="text-[10px] block truncate mt-0.5" style={{ color: getMoodTextColor(friend.sentiment) }}>{friend.sentiment}</span>
                        </div>
                    </div>

                    {/* Emoções em sintonia */}
                    {(() => {
                        const myTop   = Object.entries(me.emotions ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
                        const themTop = Object.entries(friend.emotions ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
                        const shared  = myTop.filter(k => themTop.includes(k));
                        return shared.length > 0 ? (
                            <div>
                                <span className="text-[9px] uppercase tracking-widest text-white/25 block mb-2"
                                    style={{ fontFamily: "var(--font-display)" }}>Em sintonia</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {shared.map(e => (
                                        <span key={e} className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                            style={{ background: "rgba(0,255,179,0.1)", color: "#00ffb3", border: "1px solid rgba(0,255,179,0.2)" }}>
                                            {e}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null;
                    })()}
                </div>
            )}
        </div>
    );
}

// ─── FeedPost ─────────────────────────────────────────────────────────────────

export function FeedPost({ post }: { post: FeedPostData }) {
    const [compareOpen, setCompareOpen] = useState(false);

    const score     = post.mood?.moodScore ?? 0;
    const color     = moodColor(score);
    const pct       = Math.round(score * 100);
    const firstName = post.display_name.split(" ")[0];

    return (
        <article
            className="flex flex-col overflow-hidden"
            style={{
                background: "rgba(14,14,22,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1.25rem",
            }}
        >
            {/* ── Header: avatar + nome + mood ── */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                {/* Avatar com glow de mood */}
                <div className="relative shrink-0">
                    <div className="absolute inset-0 rounded-full blur-md opacity-40"
                        style={{ background: color, transform: "scale(1.3)" }} />
                    <img
                        src={post.img_profile}
                        alt={post.display_name}
                        className="relative w-10 h-10 rounded-full object-cover"
                        style={{ boxShadow: `0 0 0 1.5px ${color}50` }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-white leading-tight truncate"
                        style={{ fontFamily: "var(--font-display)" }}>
                        {post.display_name}
                    </p>
                    {post.mood?.sentiment && (
                        <div className="mt-0.5">
                            <MoodBadge mood={post.mood.sentiment} size="sm" />
                        </div>
                    )}
                </div>

                {/* Score pill */}
                <div
                    className="shrink-0 text-xs font-black px-2.5 py-1 rounded-full"
                    style={{
                        background: `${color}12`,
                        border: `1px solid ${color}30`,
                        color,
                        fontFamily: "var(--font-display)",
                    }}
                >
                    {pct}%
                </div>
            </div>

            {/* ── Barra de mood score ── */}
            <div className="px-4 pb-3">
                <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
                    />
                </div>
            </div>

            {/* ── Música tocando ── */}
            <div className="px-4 pb-3">
                {post.isPlaying && post.track ? (
                    <div
                        className="flex items-center gap-3 rounded-xl p-3"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        {/* Capa */}
                        {post.track.img_url ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0"
                                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                                <Image src={post.track.img_url} alt={post.track.music} fill sizes="48px" className="object-cover" />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center"
                                style={{ background: "rgba(255,255,255,0.05)" }}>
                                <Music2 className="w-4 h-4 text-white/20" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white/90 truncate leading-tight"
                                style={{ fontFamily: "var(--font-display)" }}>
                                {post.track.music}
                            </p>
                            <p className="text-xs text-white/40 truncate mt-0.5">
                                {post.track.artist.split(",")[0]}
                            </p>
                            {/* Live indicator */}
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                                    style={{ background: "#00ffb3" }} />
                                <span className="text-[10px] text-white/30 uppercase tracking-wider">ao vivo</span>
                            </div>
                        </div>

                        {/* Mood da track */}
                        <div className="shrink-0 flex flex-col items-end gap-1">
                            <span className="text-[10px] font-black"
                                style={{ color: moodColor(post.track.moodScore), fontFamily: "var(--font-display)" }}>
                                {Math.round(post.track.moodScore * 100)}%
                            </span>
                            <span className="text-[9px] text-right leading-tight max-w-[64px] truncate" style={{ color: getMoodTextColor(post.track.dominantSentiment) }}>
                                {post.track.dominantSentiment}
                            </span>
                        </div>
                    </div>
                ) : (
                    /* Nada tocando */
                    <div
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                        <div className="flex items-end gap-0.5 opacity-20">
                            {[3, 5, 4, 6, 4].map((h, i) => (
                                <div key={i} className="w-0.5 rounded-full"
                                    style={{ height: `${h * 2}px`, background: "linear-gradient(180deg,#00ffb3,#a259ff)" }} />
                            ))}
                        </div>
                        <span className="text-xs text-white/25 italic">Nada tocando agora</span>
                    </div>
                )}
            </div>

            {/* ── Reasoning da IA ── */}
            {post.track?.reasoning && (
                <div className="px-4 pb-3">
                    <p className="text-xs text-white/30 italic leading-relaxed line-clamp-2">
                        "{post.track.reasoning}"
                    </p>
                </div>
            )}

            {/* ── Emoções em chip ── */}
            {post.mood?.emotions && (
                <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                    {Object.entries(post.mood.emotions)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([k, v]) => (
                            <span key={k} className="text-[9px] px-2 py-0.5 rounded-full"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    color: "rgba(255,255,255,0.30)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}>
                                {k} · {Math.round(v * 100)}
                            </span>
                        ))}
                </div>
            )}

            {/* ── Ação: Comparar ── */}
            <div
                className="px-4 pb-4 pt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
                <button
                    onClick={() => setCompareOpen(p => !p)}
                    className="flex items-center gap-2 text-xs font-semibold transition-all"
                    style={{ color: compareOpen ? "#a259ff" : "rgba(255,255,255,0.30)" }}
                >
                    <BarChart2 className="w-3.5 h-3.5" />
                    Comparar mood
                    <ChevronDown
                        className="w-3 h-3 transition-transform duration-200 ml-auto"
                        style={{ transform: compareOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                </button>
            </div>

            {/* ── Drawer de comparação ── */}
            {compareOpen && (
                <CompareDrawer
                    friendId={post.id}
                    friendName={firstName}
                    onClose={() => setCompareOpen(false)}
                />
            )}
        </article>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function FeedPostSkeleton() {
    return (
        <div
            className="flex flex-col gap-3 p-4 animate-pulse"
            style={{
                background: "rgba(14,14,22,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "1.25rem",
            }}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/[0.07] shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
            </div>
            <Skeleton className="h-0.5 w-full" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-0.5 w-full" />
            <Skeleton className="h-4 w-28" />
        </div>
    );
}
