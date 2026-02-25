import LoadingComponent from "@/shared/components/Loading";
import { Mood, Music } from "../types/music";
import ErrorComponent from "@/shared/components/Error";
import { useRecentMusics } from "../hooks/useRecentMusics";

// 2. Mapeamento de Cores para os Badges
export const emotionStyles: Record<Mood, string> = {
    'Calmo': 'bg-blue-500/20 text-blue-200 border-blue-500/30',
    'Feliz': 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    'Nostálgico': 'bg-purple-500/20 text-purple-200 border-purple-500/30',
    'Intenso': 'bg-red-500/20 text-red-200 border-red-500/30',
}

export default function RecentSongs() {
    const { data, isLoading, isError } = useRecentMusics()

    if (isLoading) {
        return <LoadingComponent />
    }
    if (isError || !data) {
        return <ErrorComponent />
    }



    return (
        <div className="glass-card p-6">
            <h3 className="font-semibold mb-4 text-lg">Últimas Músicas</h3>
            <div className="overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                <table className="w-full text-left text-sm border-separate border-spacing-0">
                    <thead className="sticky top-0 z-20">
                        <tr className="text-slate-300/70 text-xs uppercase tracking-wider">
                            {/* Aplicamos o fundo e o blur diretamente no TH e não no THEAD */}
                            <th className="pb-3 pt-2 px-2 font-medium bg-black/88 backdrop-blur-2xl bg-opacity-80 border-b border-white/50">Música</th>
                            <th className="pb-3 pt-2 px-2 font-medium bg-black/88 backdrop-blur-2xl bg-opacity-80 border-b border-white/200">Artista</th>
                            <th className="pb-3 pt-2 px-2 font-medium bg-black/88 backdrop-blur-2xl bg-opacity-80 border-b border-white/50 text-right">Emoção</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data?.map((song) => (
                            <tr key={song.id} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 px-2 text-slate-100 font-medium">{song.name}</td>
                                <td className="py-4 px-2 text-slate-300">{song.artist}</td>
                                <td className="py-4 px-2 text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${emotionStyles[song.mood]}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5"></span>
                                        {song.mood}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

}