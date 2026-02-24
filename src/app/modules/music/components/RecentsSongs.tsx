
import LoadingComponent from "@/shared/components/Loading";
import { emotionStyles, Music } from "../types/music";
import ErrorComponent from "@/shared/components/Error";
import { useRecentMusics } from "../hooks/useRecentMusics";

export default function RecentSongs() {
    const { data, isLoading, isError } = useRecentMusics()

    if (isLoading) {
        return <LoadingComponent />
    }
    if (isError || !data) {
        return <ErrorComponent />
    }



    return (
        <div className="overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
            <table className="w-full text-left text-sm">
                <thead className="text-slate-300/70 text-xs uppercase tracking-wider sticky top-0 bg-transparent backdrop-blur-md z-10">
                    <tr>
                        <th className="pb-3 font-medium">Música</th>
                        <th className="pb-3 font-medium">Artista</th>
                        <th className="pb-3 font-medium text-right">Emoção Detetada</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data?.map((song) => (
                        <tr key={song.id} className="group hover:bg-white/5 transition-colors">
                            <td className="py-3 text-slate-100 font-medium">{song.name}</td>
                            <td className="py-3 text-slate-300">{song.artist}</td>
                            <td className="py-3 text-right">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${emotionStyles[song.mood]}`}
                                >
                                    {/* Pequeno ponto de cor ao lado do texto para dar o charme do iCloud */}
                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5"></span>
                                    {song.mood}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}