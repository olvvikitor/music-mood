"use client"
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useMoodProfile } from "../hooks/useMoodProfile";
import Image from "next/image";
// 2. Mapeamento de Cores para os Badges
export const emotionStyles: Record<string, string> = {

    // 🔥 Positivo + Alta Energia
    "Euforia Ativa": 'bg-orange-500/20 text-orange-200 border-orange-500/30',
    "Confianca Dominante": 'bg-amber-500/20 text-amber-200 border-amber-500/30',

    // 🌤 Positivo + Baixa Energia
    "Serenidade": 'bg-sky-500/20 text-sky-200 border-sky-500/30',
    "Conexao Afetiva": 'bg-pink-500/20 text-pink-200 border-pink-500/30',

    // 🌙 Reflexivo
    "Nostalgia Profunda": 'bg-violet-500/20 text-violet-200 border-violet-500/30',
    "Contemplacao": 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30',

    // ⚡ Negativo + Alta Energia
    "Irritacao Ativa": 'bg-rose-500/20 text-rose-200 border-rose-500/30',
    "Raiva Explosiva": 'bg-red-700/20 text-red-300 border-red-700/30',

    // 🌧 Negativo + Baixa Energia
    "Desanimo": 'bg-zinc-600/20 text-zinc-300 border-zinc-600/30',
    "Vulnerabilidade Emocional": 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-500/30',
};
// 3. Mapeamento de Cores Sólidas para as Barras de Intensidade
const intensityBarColors: Record<string, string> = {
    "Euforia Ativa": "bg-orange-500",
    "Confianca Dominante": "bg-amber-500",
    "Serenidade": "bg-sky-500",
    "Conexao Afetiva": "bg-pink-500",
    "Nostalgia Profunda": "bg-violet-500",
    "Contemplacao": "bg-indigo-500",
    "Irritacao Ativa": "bg-rose-500",
    "Raiva Explosiva": "bg-red-600",
    "Desanimo": "bg-zinc-500",
    "Vulnerabilidade Emocional": "bg-fuchsia-500",
};

export default function RecentSongs() {
    const { data, isLoading, isError, isFetching } = useMoodProfile();

    if (isLoading || isFetching) {
        return <LoadingComponent type="list" />
    }
    if (isError || !data?.tracksAnalyzeds) {
        return <ErrorComponent type="list" />
    }

    return (
        <div className="glass-card p-4">
            <h3 className="font-semibold mb-4 text-lg border-b border-white/30">Últimas Músicas</h3>
            {/* 📱 Mobile Version */}
            <div className="relative md:hidden">
                <div className="overflow-y-auto pr-2 space-y-3 max-h-80 custom-scrollbar">
                    {data.tracksAnalyzeds.map((song, index) => (
                        <div
                            key={`${song.id}-${index}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="glass-card p-4 animate-fade-in-up rounded-xl border border-white/10 bg-white/5"
                        >
                            {/* Linha Superior: Imagem e Textos Principais */}
                            <div className="flex gap-3 items-center mb-3">
                                <div className="shrink-0">
                                    <Image
                                        src={song.img_url}
                                        alt={song.music}
                                        width={44}
                                        height={44}
                                        className="rounded-lg object-cover border border-white/10"
                                        unoptimized
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-100 font-medium text-sm truncate">
                                        {song.music}
                                    </p>
                                    <p className="text-slate-400 text-xs truncate">
                                        {song.artist}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex items-center shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${emotionStyles[song.dominantSentiment]}`}
                                >
                                    {song.dominantSentiment}
                                </span>
                            </div>

                            {/* Linha Inferior: Barra de Intensidade ocupando a largura total */}
                            <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                                    <span>Intensidade</span>
                                    <span>{Math.round(song.moodScore * 100)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${intensityBarColors[song.dominantSentiment] || 'bg-slate-500'
                                            }`}
                                        style={{ width: `${song.moodScore * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop version */}
            <div className="hidden md:block overflow-y-auto max-h-125 pr-2 custom-scrollbar">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20">
                        <tr className="text-slate-400 text-[11px] uppercase tracking-widest">
                            <th className="pb-4 pt-2 px-4 font-semibold bg-[#0d0d0d] border-b border-white/10 rounded-tl-lg">#</th>
                            <th className="pb-4 pt-2 px-2 font-semibold bg-[#0d0d0d] border-b border-white/10">Música</th>
                            <th className="pb-4 pt-2 px-2 font-semibold bg-[#0d0d0d] border-b border-white/10">Artista</th>
                            <th className="pb-4 pt-2 px-2 font-semibold bg-[#0d0d0d] border-b border-white/10 text-right">Emoção</th>
                            <th className="pb-4 pt-2 px-4 font-semibold bg-[#0d0d0d] border-b border-white/10 text-right rounded-tr-lg">Intensidade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.tracksAnalyzeds.map((song, index) => (
                            <tr
                                key={`${song.id}-${index}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                                className="group hover:bg-white/3 transition-all duration-300 opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]"
                            >
                                {/* Index + Capa */}
                                <td className="py-3 px-4 w-16">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-slate-500 font-mono group-hover:hidden w-4">{index + 1}</span>
                                        <div className="w-10 h-10 relative shrink-0 overflow-hidden rounded-md border border-white/10 group-hover:scale-105 transition-transform duration-300">
                                            <Image
                                                src={song.img_url}
                                                alt={song.music}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </td>

                                {/* Info da Música */}
                                <td className="py-3 px-2">
                                    <div className="flex flex-col">
                                        <span className="text-slate-100 font-semibold text-sm line-clamp-1 group-hover:text-green-400 transition-colors">
                                            {song.music}
                                        </span>
                                    </div>
                                </td>

                                {/* Artista */}
                                <td className="py-3 px-2">
                                    <span className="text-slate-400 text-sm line-clamp-1">
                                        {song.artist.split(",")[0]}
                                    </span>
                                </td>

                                {/* Badge de Emoção */}
                                <td className="py-3 px-2 text-right">
                                    <span className={`inline-flex whitespace-nowrap items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tighter border transition-all duration-500 ${emotionStyles[song.dominantSentiment]}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5 animate-pulse "></span>
                                        {song.dominantSentiment.toUpperCase()}
                                    </span>
                                </td>

                                {/* Barra de Intensidade Profissional */}
                                <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <span className="text-[11px] text-slate-500 font-mono w-8">
                                            {Math.round(song.moodScore * 100)}%
                                        </span>
                                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5 relative">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out relative z-10 ${intensityBarColors[song.dominantSentiment]}`}
                                                style={{
                                                    width: `${song.moodScore * 100}%`,
                                                    boxShadow: `0 0 12px ${song.moodScore > 0.7 ? 'rgba(255,255,255,0.3)' : 'transparent'}`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )

}