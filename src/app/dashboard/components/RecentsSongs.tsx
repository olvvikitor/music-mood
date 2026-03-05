"use client";

import { useState } from "react";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useMoodProfile } from "../hooks/useMoodProfile";
import Image from "next/image";
import { DIMENSION_COLORS, DIMENSION_LABELS, emotionStyles, Track } from "../types/music";
import { MoodCard } from "@/shared/components/MoodCard";
import { EmotionalVector } from "../types/music";
import { Sparkles, X } from "lucide-react";
import { MoodIcon } from "@/shared/components/MoodIcons";

// ── Helpers ───────────────────────────────────────────────────────────────────

// Abrevia o nome do mood para badges compactas sem cortar no meio da palavra
function abbreviateMood(mood: string): string {
    const overrides: Record<string, string> = {
        "chorando no banheiro": "chorando",
        "no calor do abraço":   "amando",
        "adrenalina pura":      "adrenalina",
        "caos controlado":      "caos",
        "engolindo seco":       "engolindo",
        "tô no limite":         "limite",
        "tô voando":            "voando",
        "tô confuso":           "confuso",
        "na minha era":         "na minha",
        "na paz":               "paz",
        "alma aberta":          "alma",
        "saudade boa":          "saudade",
    };
    return overrides[mood] ?? mood;
}

// ── EmotionalVectorBars ───────────────────────────────────────────────────────
function EmotionalVectorBars({ vector }: { vector: EmotionalVector }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                Dimensões Emocionais
            </p>
            <div className="space-y-2.5">
                {Object.entries(vector)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 w-28 shrink-0 truncate">
                                {DIMENSION_LABELS[key] ?? key}
                            </span>
                            <div className="flex-1 h-1 bg-white/8 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${DIMENSION_COLORS[key] ?? "bg-slate-500"}`}
                                    style={{ width: `${value * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-slate-600 font-mono w-7 text-right shrink-0">
                                {Math.round(value * 100)}
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    );
}

// ── TrackDrawer ───────────────────────────────────────────────────────────────
function TrackDrawer({ track, onClose }: { track: Track; onClose: () => void }) {
    const style = emotionStyles[track.dominantSentiment] ?? "bg-slate-500/20 text-slate-200 border-slate-500/30";

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className="fixed top-0 right-0 h-full w-80 z-50 flex flex-col bg-[#0d0d0d] border-l border-white/8 shadow-2xl"
                style={{ animation: "slideInRight 0.22s cubic-bezier(0.16,1,0.3,1)" }}
            >
                <style>{`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to   { transform: translateX(0);    opacity: 1; }
                    }
                `}</style>

                {/* ── Header fixo ── */}
                <div className="flex items-center gap-3 p-4 border-b border-white/8 shrink-0">
                    <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-white/10">
                        <Image
                            src={track.img_url} alt={track.music}
                            fill className="object-cover" sizes="44px" unoptimized
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-100 font-semibold text-sm truncate leading-snug">
                            {track.music}
                        </p>
                        <p className="text-slate-500 text-[11px] truncate">
                            {track.artist.split(",")[0]}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-200 hover:bg-white/8 transition-all shrink-0"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* ── Badge + reasoning (fixos, acima do scroll) ── */}
                <div className="px-4 pt-3 pb-1 shrink-0 space-y-3">
                    {/* Badge de sentimento com ícone */}
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${style}`}>
                            <MoodIcon mood={track.dominantSentiment} size={12} color="currentColor" />
                            {track.dominantSentiment}
                        </span>
                    </div>

                    {/* Reasoning da IA */}
                    {track.reasoning && (
                        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 px-3 py-2.5">
                            <p className="text-[9px] uppercase tracking-widest text-emerald-500 font-black mb-1.5 flex items-center gap-1.5">
                                <Sparkles size={10} /> Análise de IA
                            </p>
                            <p className="text-[11px] text-slate-400 italic leading-relaxed">
                                "{track.reasoning}"
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Conteúdo scrollável ── */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6" style={{ scrollbarWidth: "none" }}>
                    <MoodCard data={track} mode="track" />
                    <div className="border-t border-white/5 pt-4">
                        <EmotionalVectorBars vector={track.emotionalVector} />
                    </div>
                </div>
            </div>
        </>
    );
}

// ── RecentSongs ───────────────────────────────────────────────────────────────
export default function RecentSongs({ compact = false }: { compact?: boolean }) {
    const { data, isLoading, isError, isFetching } = useMoodProfile();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [drawerTrack, setDrawerTrack] = useState<Track | null>(null);

    if (isLoading || (isFetching && compact)) return <LoadingComponent type="listCompact" />;
    if (isError || !data?.tracksAnalyzeds)    return <ErrorComponent type="list" />;

    const tracks = compact ? data.tracksAnalyzeds.slice(0, 15) : data.tracksAnalyzeds;

    function toggleMobile(id: string) {
        setExpandedId(prev => prev === id ? null : id);
    }

    return (
        <>
            <div className={`glass-card ${compact ? "p-3" : "p-4"}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-1 mb-3 pb-2 border-b border-white/8">
                    <h3 className={`font-semibold ${compact ? "text-xs text-slate-500" : "text-sm text-slate-300"}`}>
                        Últimas Músicas
                    </h3>
                    {compact && (
                        <span className="text-[9px] uppercase tracking-widest text-slate-600 font-black">
                            {tracks.length} faixas
                        </span>
                    )}
                </div>

                {/* ── Mobile ───────────────────────────────────────────────── */}
                <div
                    className="md:hidden overflow-y-auto space-y-1.5"
                    style={{ maxHeight: compact ? "180px" : "340px", scrollbarWidth: "none" }}
                >
                    {tracks.map((song, index) => {
                        const uid = `${song.id}-${index}`;
                        const style = emotionStyles[song.dominantSentiment] ?? "bg-slate-500/20 text-slate-200 border-slate-500/30";
                        return (
                            <div key={uid}>
                                <div
                                    className="flex gap-2.5 items-center p-2.5 rounded-xl border border-white/8 bg-white/3 cursor-pointer active:scale-[0.98] transition-transform"
                                    onClick={() => !compact && toggleMobile(uid)}
                                >
                                    <Image
                                        src={song.img_url ?? ''} alt={song.music} 
                                        width={compact ? 32 : 40} height={compact ? 32 : 40}
                                        className="rounded-lg object-cover border border-white/10 shrink-0"
                                        unoptimized
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-slate-100 font-medium truncate ${compact ? "text-[11px]" : "text-xs"}`}>
                                            {song.music}
                                        </p>
                                        <p className="text-slate-500 text-[10px] truncate">
                                            {song.artist.split(",")[0]}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-bold border shrink-0 ${compact ? "text-[8px]" : "text-[9px]"} ${style}`}>
                                        <MoodIcon mood={song.dominantSentiment} size={8} color="currentColor" />
                                        {abbreviateMood(song.dominantSentiment)}
                                    </span>
                                </div>

                                {!compact && expandedId === uid && (
                                    <div className="mx-2 p-3 rounded-b-xl border border-t-0 border-white/8 bg-white/2">
                                        <MoodCard data={song} mode="track" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* ── Desktop ──────────────────────────────────────────────── */}
                <div
                    className="hidden md:block overflow-y-auto"
                    style={{ maxHeight: compact ? "200px" : "520px", scrollbarWidth: "none" }}
                >
                    <table className="w-full text-left border-separate border-spacing-0">
                        {!compact && (
                            <thead className="sticky top-0 z-20">
                                <tr className="text-[10px] uppercase tracking-widest text-slate-600 font-black">
                                    <th className="pb-3 pt-1 px-3 bg-[#0d0d0d] border-b border-white/8">#</th>
                                    <th className="pb-3 pt-1 px-2 bg-[#0d0d0d] border-b border-white/8">Música</th>
                                    <th className="pb-3 pt-1 px-2 bg-[#0d0d0d] border-b border-white/8">Artista</th>
                                    <th className="pb-3 pt-1 px-2 bg-[#0d0d0d] border-b border-white/8 text-right">Emoção</th>
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {tracks.map((song, index) => {
                                const style = emotionStyles[song.dominantSentiment] ?? "bg-slate-500/20 text-slate-200 border-slate-500/30";
                                return (
                                    <tr
                                        key={`${song.id}-${index}-row`}
                                        style={{ animationDelay: `${index * 40}ms` }}
                                        className="group hover:bg-white/3 transition-colors duration-150 opacity-0 animate-[fadeInUp_0.35s_ease-out_forwards] cursor-pointer"
                                        onClick={() => setDrawerTrack(song)}
                                    >
                                        {/* Capa + número */}
                                        <td className={`border-b border-white/5 ${compact ? "py-1.5 px-2" : "py-2.5 px-3 w-14"}`}>
                                            <div className="flex items-center gap-2.5">
                                                {!compact && (
                                                    <span className="text-[11px] text-slate-600 font-mono group-hover:opacity-0 w-4 shrink-0 transition-opacity">
                                                        {index + 1}
                                                    </span>
                                                )}
                                                <div className={`relative shrink-0 rounded-md overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-200 ${compact ? "w-7 h-7" : "w-9 h-9"}`}>
                                                    <Image
                                                        src={song.img_url ?? ''} alt={song.music}
                                                        fill className="object-cover" sizes="36px" unoptimized
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        {/* Título (+ artista no compact) */}
                                        <td className={`border-b border-white/5 ${compact ? "py-1.5 px-2" : "py-2.5 px-2"}`}>
                                            <span className={`text-slate-200 font-medium line-clamp-1 group-hover:text-emerald-400 transition-colors ${compact ? "text-[11px]" : "text-sm"}`}>
                                                {song.music}
                                            </span>
                                            {compact && (
                                                <span className="text-slate-600 text-[10px] line-clamp-1 block">
                                                    {song.artist.split(",")[0]}
                                                </span>
                                            )}
                                        </td>

                                        {/* Artista (só no normal) */}
                                        {!compact && (
                                            <td className="py-2.5 px-2 border-b border-white/5">
                                                <span className="text-slate-500 text-sm line-clamp-1">
                                                    {song.artist.split(",")[0]}
                                                </span>
                                            </td>
                                        )}

                                        {/* Badge de emoção */}
                                        <td className={`border-b border-white/5 text-right ${compact ? "py-1.5 px-2" : "py-2.5 px-2"}`}>
                                            <span className={`inline-flex items-center gap-1 rounded-full font-bold border whitespace-nowrap
                                                ${compact ? "px-1.5 py-0.5 text-[8px]" : "px-2 py-1 text-[9px]"}
                                                ${style}`}>
                                                <MoodIcon mood={song.dominantSentiment} size={compact ? 8 : 10} color="currentColor" />
                                                {compact
                                                    ? abbreviateMood(song.dominantSentiment)
                                                    : song.dominantSentiment}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {drawerTrack && (
                <TrackDrawer track={drawerTrack} onClose={() => setDrawerTrack(null)} />
            )}
        </>
    );
}