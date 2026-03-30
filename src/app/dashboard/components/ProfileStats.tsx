"use client";

import { useEffect, useState } from "react";
import { BarChart2, Music2, User2, Headphones } from "lucide-react";
import { getUserStats, type UserStats } from "../services/profileStatsService";
import Image from "next/image";

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "var(--surface-card-alt)" }} />;
}

function StatCard({ icon, label, value, accent }: {
    icon: React.ReactNode; label: string; value: string | number; accent: string;
}) {
    return (
        <div className="flex flex-col gap-1 rounded-2xl p-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center mb-1"
                style={{ background: `${accent}18`, color: accent }}>
                {icon}
            </div>
            <span className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: accent }}>
                {value}
            </span>
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                {label}
            </span>
        </div>
    );
}

export function ProfileStats() {
    const [data, setData] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserStats().then(setData).catch(() => {}).finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                Estatísticas
            </h2>

            {/* Cards resumo */}
            <div className="grid grid-cols-3 gap-3">
                {loading ? (
                    [1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)
                ) : (
                    <>
                        <StatCard icon={<Headphones className="w-3.5 h-3.5" />} label="Músicas" value={data?.totalListened ?? 0} accent="#00ffb3" />
                        <StatCard icon={<BarChart2 className="w-3.5 h-3.5" />} label="Moods" value={data?.totalMoods ?? 0} accent="#a259ff" />
                        <StatCard icon={<Music2 className="w-3.5 h-3.5" />} label="Média" value={`${Math.round((data?.avgMoodScore ?? 0) * 100)}%`} accent="#ff2d87" />
                    </>
                )}
            </div>

            {/* Top Artistas */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                        <User2 className="w-3.5 h-3.5" /> Top Artistas
                    </span>
                </div>
                <ul className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                    {loading ? (
                        [1,2,3].map(i => (
                            <li key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                                <Skeleton className="h-3 flex-1" />
                                <Skeleton className="h-3 w-8" />
                            </li>
                        ))
                    ) : data?.topArtists.map((a, i) => (
                        <li key={a.name} className="flex items-center gap-3 px-4 py-3">
                            <span className="text-xs font-black w-4 shrink-0"
                                style={{ color: i === 0 ? "#00ffb3" : i === 1 ? "#a259ff" : "var(--text-faint)", fontFamily: "var(--font-display)" }}>
                                {i + 1}
                            </span>
                            {a.img_url ? (
                                <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                                    <Image src={a.img_url} alt={a.name} fill sizes="36px" className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center"
                                    style={{ background: "var(--surface-card-alt)" }}>
                                    <User2 className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
                                </div>
                            )}
                            <span className="flex-1 text-sm font-semibold truncate" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                                {a.name}
                            </span>
                            <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                                {a.count}×
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Top Músicas */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                        <Music2 className="w-3.5 h-3.5" /> Top Músicas
                    </span>
                </div>
                <ul className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                    {loading ? (
                        [1,2,3].map(i => (
                            <li key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                                <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <Skeleton className="h-3 w-40" />
                                    <Skeleton className="h-2.5 w-24" />
                                </div>
                                <Skeleton className="h-3 w-8" />
                            </li>
                        ))
                    ) : data?.topTracks.map((t, i) => (
                        <li key={`${t.title}-${i}`} className="flex items-center gap-3 px-4 py-3">
                            <span className="text-xs font-black w-4 shrink-0"
                                style={{ color: i === 0 ? "#00ffb3" : i === 1 ? "#a259ff" : "var(--text-faint)", fontFamily: "var(--font-display)" }}>
                                {i + 1}
                            </span>
                            {t.img_url ? (
                                <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
                                    <Image src={t.img_url} alt={t.title} fill sizes="36px" className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center"
                                    style={{ background: "var(--surface-card-alt)" }}>
                                    <Music2 className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
                                </div>
                            )}
                            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                <span className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                                    {t.title}
                                </span>
                                <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                                    {t.artist}
                                </span>
                            </div>
                            <span className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
                                {t.count}×
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
