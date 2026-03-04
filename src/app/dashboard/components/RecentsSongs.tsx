"use client"
import { useState } from "react";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useMoodProfile } from "../hooks/useMoodProfile";
import Image from "next/image";
import { EmotionalVector, Track } from "../types/music";
import { MoodCard } from "@/shared/components/MoodCard";

export const emotionStyles: Record<string, string> = {
    "Euforia Ativa": 'bg-orange-500/20 text-orange-200 border-orange-500/30',
    "Confianca Dominante": 'bg-amber-500/20 text-amber-200 border-amber-500/30',
    "Serenidade": 'bg-sky-500/20 text-sky-200 border-sky-500/30',
    "Conexao Afetiva": 'bg-pink-500/20 text-pink-200 border-pink-500/30',
    "Nostalgia Profunda": 'bg-violet-500/20 text-violet-200 border-violet-500/30',
    "Contemplacao": 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',
    "Irritacao Ativa": 'bg-rose-500/20 text-rose-200 border-rose-500/30',
    "Raiva Explosiva": 'bg-red-700/20 text-red-300 border-red-700/30',
    "Desanimo": 'bg-zinc-600/20 text-zinc-300 border-zinc-600/30',
    "Vulnerabilidade Emocional": 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30',
};

const DIMENSION_LABELS: Record<string, string> = {
    Valencia: "Valência",
    Energia: "Energia",
    Dominancia: "Dominância",
    Melancolia: "Melancolia",
    Euforia: "Euforia",
    Tensao: "Tensão",
    ConexaoSocial: "Conexão Social",
    Introspeccao: "Introspecção",
    Empoderamento: "Empoderamento",
    Vulnerabilidade: "Vulnerabilidade",
};

const DIMENSION_COLORS: Record<string, string> = {
    Valencia: "bg-emerald-500",
    Energia: "bg-orange-500",
    Dominancia: "bg-amber-500",
    Melancolia: "bg-indigo-400",
    Euforia: "bg-yellow-400",
    Tensao: "bg-rose-500",
    ConexaoSocial: "bg-pink-400",
    Introspeccao: "bg-violet-400",
    Empoderamento: "bg-cyan-400",
    Vulnerabilidade: "bg-fuchsia-400",
};


// ─── Vetor emocional ─────────────────────────────────────────────────────────
function EmotionalVectorBars({ vector }: { vector: EmotionalVector }) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
                Dimensões Emocionais
            </p>
            <div className="space-y-2.5">
                {Object.entries(vector)
                    .sort(([, a], [, b]) => b - a)
                    .map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 w-28 shrink-0 truncate">
                                {DIMENSION_LABELS[key] ?? key}
                            </span>
                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${DIMENSION_COLORS[key] ?? "bg-slate-500"}`}
                                    style={{ width: `${value * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono w-7 text-right shrink-0">
                                {Math.round(value * 100)}%
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    );
}

// ─── Drawer desktop ──────────────────────────────────────────────────────────
function TrackDrawer({ track, onClose }: { track: Track; onClose: () => void }) {
    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className="fixed top-0 right-0 h-full w-80 z-50 bg-[#0d0d0d] border-l border-white/10 flex flex-col shadow-2xl"
                style={{ animation: "slideInRight 0.25s ease-out" }}
            >
                <style>{`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); }
                        to   { transform: translateX(0); }
                    }
                `}</style>

                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/10 shrink-0">
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-white/10">
                        <Image src={track.img_url} alt={track.music} fill className="object-cover" sizes="48px" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-slate-100 font-semibold text-sm truncate">{track.music}</p>
                        <p className="text-slate-400 text-xs truncate">{track.artist.split(",")[0]}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-200 transition-colors text-lg leading-none shrink-0 pb-0.5"
                    >
                        ✕
                    </button>
                </div>

                {/* Badge emoção */}
                <div className="px-4 pt-4 shrink-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${emotionStyles[track.dominantSentiment]}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5 animate-pulse" />
                        {track.dominantSentiment.toUpperCase()}
                    </span>
                </div>

                {/* Conteúdo scrollável */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 custom-scrollbar">
                    <MoodCard data={track}  mode="track"/>
                    <div className="border-t border-white/5 pt-6">
                        <EmotionalVectorBars vector={track.emotionalVector} />
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function RecentSongs() {
    const { data, isLoading, isError, isFetching } = useMoodProfile();
    const [expandedId, setExpandedId] = useState<string | null>(null);   // mobile
    const [drawerTrack, setDrawerTrack] = useState<Track | null>(null);  // desktop

    if (isLoading || isFetching) return <LoadingComponent type="list" />;
    if (isError || !data?.tracksAnalyzeds) return <ErrorComponent type="list" />;

    const toggleMobile = (id: string) =>
        setExpandedId(prev => prev === id ? null : id);

    return (
        <>
            <div className="glass-card p-4">
                <h3 className="font-semibold mb-4 text-lg border-b border-white/30">Últimas Músicas</h3>

                {/* 📱 Mobile — expand inline */}
                <div className="relative md:hidden">
                    <div className="overflow-y-auto pr-2 space-y-3 max-h-80 custom-scrollbar">
                        {data.tracksAnalyzeds.map((song, index) => (
                            <div key={`${song.id}-${index}`}>
                                <div
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    className="glass-card p-4 animate-fade-in-up rounded-xl border border-white/10 bg-white/5 cursor-pointer"
                                    onClick={() => toggleMobile(song.id)}
                                >
                                    <div className="flex gap-3 items-center">
                                        <div className="shrink-0">
                                            <Image src={song.img_url} alt={song.music} width={44} height={44} className="rounded-lg object-cover border border-white/10" unoptimized />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-slate-100 font-medium text-sm truncate">{song.music}</p>
                                            <p className="text-slate-400 text-xs truncate">{song.artist}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${emotionStyles[song.dominantSentiment]}`}>
                                                {song.dominantSentiment}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                {expandedId === song.id ? "▲ fechar" : "▼ ver mais"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {expandedId === song.id && (
                                    <div className="mx-2 p-4 rounded-b-xl border border-t-0 border-white/10 bg-white/3">
                                        <MoodCard data={data} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🖥 Desktop — drawer */}
                <div className="hidden md:block overflow-y-auto max-h-125 pr-2 custom-scrollbar">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="sticky top-0 z-20">
                            <tr className="text-slate-400 text-[11px] uppercase tracking-widest">
                                <th className="pb-4 pt-2 px-4 font-semibold bg-[#0d0d0d] border-b border-white/10 rounded-tl-lg">#</th>
                                <th className="pb-4 pt-2 px-2 font-semibold bg-[#0d0d0d] border-b border-white/10">Música</th>
                                <th className="pb-4 pt-2 px-2 font-semibold bg-[#0d0d0d] border-b border-white/10">Artista</th>
                                <th className="pb-4 pt-2 px-2 font-semibold bg-[#0d0d0d] border-b border-white/10 text-right rounded-tr-lg">Emoção</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.tracksAnalyzeds.map((song, index) => (
                                <tr
                                    key={`${song.id}-row`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    className="group hover:bg-white/3 transition-all duration-300 opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards] cursor-pointer"
                                    onClick={() => setDrawerTrack(song)}
                                >
                                    <td className="py-3 px-4 w-16 border-b border-white/5">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-slate-500 font-mono group-hover:hidden w-4">{index + 1}</span>
                                            <div className="w-10 h-10 relative shrink-0 overflow-hidden rounded-md border border-white/10 group-hover:scale-105 transition-transform duration-300">
                                                <Image src={song.img_url} alt={song.music} fill className="object-cover" sizes="40px" unoptimized />
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3 px-2 border-b border-white/5">
                                        <span className="text-slate-100 font-semibold text-sm line-clamp-1 group-hover:text-green-400 transition-colors">
                                            {song.music}
                                        </span>
                                    </td>

                                    <td className="py-3 px-2 border-b border-white/5">
                                        <span className="text-slate-400 text-sm line-clamp-1">
                                            {song.artist.split(",")[0]}
                                        </span>
                                    </td>

                                    <td className="py-3 px-2 text-right border-b border-white/5">
                                        <span className={`inline-flex whitespace-nowrap items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tighter border transition-all duration-500 ${emotionStyles[song.dominantSentiment]}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5 animate-pulse" />
                                            {song.dominantSentiment.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drawer — fora do card para cobrir a tela toda */}
            {drawerTrack && (
                <TrackDrawer
                    track={drawerTrack}
                    onClose={() => setDrawerTrack(null)}
                />
            )}
        </>
    );
}