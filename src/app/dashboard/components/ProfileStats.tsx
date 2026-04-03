"use client";

import { type TouchEvent, useEffect, useRef, useState } from "react";
import { BarChart2, Music2, User2, Headphones, ChevronLeft, ChevronRight } from "lucide-react";
import { getUserStats, type UserStats } from "../services/profileStatsService";
import Image from "next/image";
import { MoodTimeline } from "./MoodTimeline";
import { MoodWeekChart } from "./MoodWeekChart";

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "var(--surface-card-alt)" }} />;
}

type PanelType = "music" | "moods" | "average" | null;

function StatCard({ icon, label, value, accent, onClick, isActive }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    accent: string;
    onClick: () => void;
    isActive: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col gap-1 rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
            style={{
                background: isActive ? "var(--surface-card-alt)" : "var(--surface-card)",
                border: isActive ? "1px solid var(--border-strong)" : "1px solid var(--border)",
            }}
        >
            <div className="w-7 h-7 rounded-xl flex items-center justify-center mb-1"
                style={{ background: `${accent}14`, color: accent }}>
                {icon}
            </div>
            <span className="text-2xl font-black" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                {value}
            </span>
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                {label}
            </span>
        </button>
    );
}

export function ProfileStats() {
    const [data, setData] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activePanel, setActivePanel] = useState<PanelType>("music");
    const [musicSlide, setMusicSlide] = useState(0);
    const [averageSlide, setAverageSlide] = useState(0);
    const musicTouchStartX = useRef<number | null>(null);
    const musicTouchStartY = useRef<number | null>(null);
    const averageTouchStartX = useRef<number | null>(null);
    const averageTouchStartY = useRef<number | null>(null);

    useEffect(() => {
        getUserStats().then(setData).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const avgPct = Math.round((data?.avgMoodScore ?? 0) * 100);

    const createTouchStartHandler = (
        xRef: React.MutableRefObject<number | null>,
        yRef: React.MutableRefObject<number | null>,
    ) => (event: TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        xRef.current = touch.clientX;
        yRef.current = touch.clientY;
    };

    const createTouchEndHandler = (
        xRef: React.MutableRefObject<number | null>,
        yRef: React.MutableRefObject<number | null>,
        setSlide: React.Dispatch<React.SetStateAction<number>>,
        maxSlide: number,
    ) => (event: TouchEvent<HTMLDivElement>) => {
        if (xRef.current === null || yRef.current === null) return;

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - xRef.current;
        const deltaY = touch.clientY - yRef.current;

        xRef.current = null;
        yRef.current = null;

        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        const passedThreshold = Math.abs(deltaX) > 40;
        if (!isHorizontalSwipe || !passedThreshold) return;

        if (deltaX < 0) {
            setSlide(prev => Math.min(prev + 1, maxSlide));
            return;
        }

        setSlide(prev => Math.max(prev - 1, 0));
    };

    const onMusicTouchStart = createTouchStartHandler(musicTouchStartX, musicTouchStartY);
    const onMusicTouchEnd = createTouchEndHandler(musicTouchStartX, musicTouchStartY, setMusicSlide, 1);
    const onAverageTouchStart = createTouchStartHandler(averageTouchStartX, averageTouchStartY);
    const onAverageTouchEnd = createTouchEndHandler(averageTouchStartX, averageTouchStartY, setAverageSlide, 1);

    const maxArtistCount = Math.max(...(data?.topArtists ?? []).map(a => a.count), 1);
    const maxTrackCount = Math.max(...(data?.topTracks ?? []).map(t => t.count), 1);

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                Estatísticas
            </h2>

            {/* Cards resumo */}
            <div className="grid grid-cols-3 gap-3">
                {loading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)
                ) : (
                    <>
                        <StatCard
                            icon={<Headphones className="w-3.5 h-3.5" />}
                            label="Musicas"
                            value={data?.totalListened ?? 0}
                            accent="#6fae9b"
                            isActive={activePanel === "music"}
                            onClick={() => {
                                setMusicSlide(0);
                                setActivePanel("music");
                            }}
                        />
                        <StatCard
                            icon={<BarChart2 className="w-3.5 h-3.5" />}
                            label="Moods"
                            value={data?.totalMoods ?? 0}
                            accent="#8a7bb8"
                            isActive={activePanel === "moods"}
                            onClick={() => setActivePanel("moods")}
                        />
                        <StatCard
                            icon={<Music2 className="w-3.5 h-3.5" />}
                            label="Media"
                            value={`${avgPct}%`}
                            accent="#b06a85"
                            isActive={activePanel === "average"}
                            onClick={() => {
                                setAverageSlide(0);
                                setActivePanel("average");
                            }}
                        />
                    </>
                )}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <span className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                        {activePanel === "music" ? "Musicas" : activePanel === "moods" ? "Linha do tempo" : "Media"}
                    </span>
                </div>

                {activePanel === "music" && (
                    <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <button
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}
                                onClick={() => setMusicSlide(prev => Math.max(prev - 1, 0))}
                            >
                                <ChevronLeft className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                            </button>
                            <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                                {musicSlide === 0 ? "Top Artistas" : "Top Musicas"}
                            </div>
                            <button
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}
                                onClick={() => setMusicSlide(prev => Math.min(prev + 1, 1))}
                            >
                                <ChevronRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border)" }}>
                            <div
                                className="flex transition-transform duration-500"
                                style={{ transform: `translateX(-${musicSlide * 100}%)`, touchAction: "pan-y" }}
                                onTouchStart={onMusicTouchStart}
                                onTouchEnd={onMusicTouchEnd}
                            >
                                {/* Top Artistas */}
                                <div className="w-full shrink-0 p-3" style={{ background: "var(--surface-card)" }}>
                                    <ul className="flex flex-col gap-2">
                                        {(data?.topArtists ?? []).map((a, i) => (
                                            <li key={a.name} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "var(--surface-card-alt)" }}>
                                                <span className="text-xs font-black w-5 text-center" style={{
                                                    color: i === 0 ? "#6fae9b" : "var(--text-faint)",
                                                    fontFamily: "var(--font-display)",
                                                }}>{i + 1}</span>
                                                {a.img_url ? (
                                                    <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                                                        <Image src={a.img_url} alt={a.name} fill sizes="36px" className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center" style={{ background: "var(--surface-card)" }}>
                                                        <User2 className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm font-semibold truncate block" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{a.name}</span>
                                                    {/* Frequency bar */}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                                                            <div
                                                                className="h-full rounded-full transition-all duration-500"
                                                                style={{
                                                                    width: `${Math.round((a.count / maxArtistCount) * 100)}%`,
                                                                    background: "#6fae9b",
                                                                    opacity: 0.6,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] tabular-nums" style={{ color: "var(--text-faint)" }}>{a.count}x</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Top Musicas */}
                                <div className="w-full shrink-0 p-3" style={{ background: "var(--surface-card)" }}>
                                    <ul className="flex flex-col gap-2">
                                        {(data?.topTracks ?? []).map((t, i) => (
                                            <li key={`${t.title}-${i}`} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: "var(--surface-card-alt)" }}>
                                                <span className="text-xs font-black w-5 text-center" style={{
                                                    color: i === 0 ? "#8a7bb8" : "var(--text-faint)",
                                                    fontFamily: "var(--font-display)",
                                                }}>{i + 1}</span>
                                                {t.img_url ? (
                                                    <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0">
                                                        <Image src={t.img_url} alt={t.title} fill sizes="36px" className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ background: "var(--surface-card)" }}>
                                                        <Music2 className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{t.title}</p>
                                                    <p className="text-[10px] truncate" style={{ color: "var(--text-faint)" }}>{t.artist}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                                                            <div
                                                                className="h-full rounded-full transition-all duration-500"
                                                                style={{
                                                                    width: `${Math.round((t.count / maxTrackCount) * 100)}%`,
                                                                    background: "#8a7bb8",
                                                                    opacity: 0.5,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] tabular-nums" style={{ color: "var(--text-faint)" }}>{t.count}x</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activePanel === "moods" && (
                    <div className="p-4">
                        <MoodTimeline hideHeader maxItems={12} horizontal />
                    </div>
                )}

                {activePanel === "average" && (
                    <div className="p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <button
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}
                                onClick={() => setAverageSlide(prev => Math.max(prev - 1, 0))}
                            >
                                <ChevronLeft className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                            </button>
                            <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>
                                {averageSlide === 0 ? "Media geral" : "Score por dia"}
                            </div>
                            <button
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}
                                onClick={() => setAverageSlide(prev => Math.min(prev + 1, 1))}
                            >
                                <ChevronRight className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid var(--border)" }}>
                            <div
                                className="flex transition-transform duration-500"
                                style={{ transform: `translateX(-${averageSlide * 100}%)`, touchAction: "pan-y" }}
                                onTouchStart={onAverageTouchStart}
                                onTouchEnd={onAverageTouchEnd}
                            >
                                <div className="w-full shrink-0 p-3" style={{ background: "var(--surface-card)" }}>
                                    <div className="relative rounded-2xl p-4 flex items-center gap-4 overflow-hidden"
                                        style={{
                                            background: "var(--surface-card-alt)",
                                            border: "1px solid var(--border)",
                                        }}>

                                        <div
                                            className="w-24 h-24 rounded-full shrink-0 flex items-center justify-center"
                                            style={{
                                                background: `conic-gradient(#b06a85 ${avgPct * 3.6}deg, var(--border) 0deg)`,
                                            }}
                                        >
                                            <div className="w-18 h-18 rounded-full flex items-center justify-center" style={{ background: "var(--surface-card)" }}>
                                                <span className="text-lg font-black" style={{ color: "#b06a85", fontFamily: "var(--font-display)" }}>{avgPct}%</span>
                                            </div>
                                        </div>

                                        <div className="min-w-0 relative z-10">
                                            <p className="text-sm font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>Media emocional</p>
                                            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Resumo da sua pontuacao media de mood.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full shrink-0 p-3" style={{ background: "var(--surface-card)" }}>
                                    <MoodWeekChart hideHeader />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 mt-1">
                            {[0, 1].map(index => (
                                <button
                                    key={index}
                                    onClick={() => setAverageSlide(index)}
                                    aria-label={index === 0 ? "Mostrar media geral" : "Mostrar score por dia"}
                                    className="h-2 rounded-full transition-all"
                                    style={{
                                        width: averageSlide === index ? 20 : 8,
                                        background: averageSlide === index ? "#b06a85" : "var(--border-medium)",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
