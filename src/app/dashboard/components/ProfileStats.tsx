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

function StatCard({ icon, label, value, accent, onClick }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    accent: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col gap-1 rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
        >
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
        getUserStats().then(setData).catch(() => {}).finally(() => setLoading(false));
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
                        <StatCard
                            icon={<Headphones className="w-3.5 h-3.5" />}
                            label="Musicas"
                            value={data?.totalListened ?? 0}
                            accent="#00ffb3"
                            onClick={() => {
                                setMusicSlide(0);
                                setActivePanel("music");
                            }}
                        />
                        <StatCard
                            icon={<BarChart2 className="w-3.5 h-3.5" />}
                            label="Moods"
                            value={data?.totalMoods ?? 0}
                            accent="#a259ff"
                            onClick={() => setActivePanel("moods")}
                        />
                        <StatCard
                            icon={<Music2 className="w-3.5 h-3.5" />}
                            label="Media"
                            value={`${avgPct}%`}
                            accent="#ff2d87"
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
                                <div className="w-full shrink-0 p-3" style={{ background: "var(--surface-card)" }}>
                                    <ul className="flex flex-col gap-2">
                                        {(data?.topArtists ?? []).map((a, i) => (
                                            <li key={a.name} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: "var(--surface-card-alt)" }}>
                                                <span className="text-xs font-black w-4" style={{ color: i === 0 ? "#00ffb3" : i === 1 ? "#a259ff" : "var(--text-faint)", fontFamily: "var(--font-display)" }}>{i + 1}</span>
                                                {a.img_url ? (
                                                    <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                                                        <Image src={a.img_url} alt={a.name} fill sizes="36px" className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center" style={{ background: "var(--surface-card)" }}>
                                                        <User2 className="w-4 h-4" style={{ color: "var(--text-faint)" }} />
                                                    </div>
                                                )}
                                                <span className="flex-1 text-sm font-semibold truncate" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{a.name}</span>
                                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{a.count}x</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="w-full shrink-0 p-3" style={{ background: "var(--surface-card)" }}>
                                    <ul className="flex flex-col gap-2">
                                        {(data?.topTracks ?? []).map((t, i) => (
                                            <li key={`${t.title}-${i}`} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: "var(--surface-card-alt)" }}>
                                                <span className="text-xs font-black w-4" style={{ color: i === 0 ? "#00ffb3" : i === 1 ? "#a259ff" : "var(--text-faint)", fontFamily: "var(--font-display)" }}>{i + 1}</span>
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
                                                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{t.artist}</p>
                                                </div>
                                                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{t.count}x</span>
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
                                            boxShadow: "inset 0 0 40px rgba(255,45,135,0.08)",
                                        }}>
                                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full"
                                            style={{ background: "radial-gradient(circle, rgba(255,45,135,0.24), transparent 70%)" }} />

                                        <div
                                            className="w-24 h-24 rounded-full shrink-0 flex items-center justify-center"
                                            style={{
                                                background: `conic-gradient(#ff2d87 ${avgPct * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
                                                boxShadow: "0 0 24px rgba(255,45,135,0.22)",
                                            }}
                                        >
                                            <div className="w-18 h-18 rounded-full flex items-center justify-center" style={{ background: "var(--surface-card)" }}>
                                                <span className="text-lg font-black" style={{ color: "#ff2d87", fontFamily: "var(--font-display)" }}>{avgPct}%</span>
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
                                        background: averageSlide === index ? "#ff2d87" : "var(--border-medium)",
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
