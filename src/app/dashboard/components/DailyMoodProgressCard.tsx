"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Clock3, Music2, Headphones, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getRefreshMoodStudios, type RefreshMoodStudio } from "../../dashboard/services/getRefreshProfileService";
import api from "@/shared/services/apiService";

const RELEASE_HOUR = 19;

function buildTimelineState(now: Date) {
    const release = new Date(now);
    release.setHours(RELEASE_HOUR, 0, 0, 0);

    if (now >= release) {
        release.setDate(release.getDate() + 1);
    }

    const start = new Date(release);
    start.setDate(start.getDate() - 1);

    const total = release.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    const progress = Math.max(0, Math.min(1, elapsed / total));

    const remainingMs = Math.max(0, release.getTime() - now.getTime());
    return { progress, remainingMs };
}

function formatRemaining(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
}

function TimerDigit({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className="relative flex items-center justify-center rounded-xl"
                style={{
                    width: 56,
                    height: 64,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
            >
                <span
                    className="font-black tabular-nums"
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 28,
                        color: "#ffffff",
                        textShadow: "0 0 20px rgba(111,174,155,0.4)",
                        lineHeight: 1,
                    }}
                >
                    {value}
                </span>
            </div>
            <span
                className="text-[8px] uppercase tracking-[0.2em] font-bold"
                style={{ color: "rgba(255,255,255,0.3)" }}
            >
                {label}
            </span>
        </div>
    );
}

function TimerSeparator() {
    return (
        <div className="flex flex-col gap-1.5 pb-4">
            <div
                className="w-1 h-1 rounded-full"
                style={{
                    background: "rgba(111,174,155,0.6)",
                    animation: "timerPulse 1s ease-in-out infinite",
                }}
            />
            <div
                className="w-1 h-1 rounded-full"
                style={{
                    background: "rgba(111,174,155,0.6)",
                    animation: "timerPulse 1s 0.5s ease-in-out infinite",
                }}
            />
        </div>
    );
}

export function DailyMoodProgressCard({ initialStudioId }: { initialStudioId?: string }) {
    const [now, setNow] = useState(() => new Date());
    const [selectedStudio, setSelectedStudio] = useState(initialStudioId ?? "");
    const scrollRef = useRef<HTMLDivElement>(null);

    const { data: studios = [] } = useQuery({
        queryKey: ["refreshMoodStudios"],
        queryFn: getRefreshMoodStudios,
        staleTime: 1000 * 60 * 30,
    });

    const { mutate: updateStudioPreference } = useMutation({
        mutationFn: async (id: string) => api.put("/user/studio-preference", { studioId: id }),
    });

    useEffect(() => {
        const interval = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(interval);
    }, []);

    // Auto-select first studio if none selected
    useEffect(() => {
        if (!selectedStudio && studios.length > 0) {
            const first = studios[0].id;
            setSelectedStudio(first);
            updateStudioPreference(first);
        }
    }, [studios, selectedStudio, updateStudioPreference]);

    const handleStudioChange = (value: string) => {
        setSelectedStudio(value);
        updateStudioPreference(value);
    };

    const scrollStudios = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const { progress, remainingMs } = useMemo(() => buildTimelineState(now), [now]);
    const percentage = Math.round(progress * 100);
    const { hours, minutes, seconds } = formatRemaining(remainingMs);

    return (
        <div
            className="glass-card glass-card-hover h-full flex flex-col overflow-hidden relative"
            style={{ minHeight: 430 }}
        >
            <div
                className="flex-1 mx-3 my-3 rounded-2xl p-5 md:p-6 relative overflow-hidden"
                style={{
                    minHeight: 390,
                    background:
                        "radial-gradient(ellipse 120% 80% at 80% 10%, rgba(111,174,155,0.14), transparent 55%), radial-gradient(ellipse 100% 70% at 20% 90%, rgba(138,123,184,0.12), transparent 60%), #07090f",
                    border: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                {/* Background grid subtle */}
                <div className="absolute inset-0 opacity-[0.04] mood-grid-next" />

                {/* Floating music note decoration */}
                <div className="absolute top-6 right-6 opacity-[0.06]">
                    <Music2 className="w-24 h-24" style={{ color: "#6fae9b" }} />
                </div>
                <div className="absolute bottom-12 left-4 opacity-[0.04]">
                    <Headphones className="w-16 h-16" style={{ color: "#8a7bb8" }} />
                </div>

                {/* Ambient glow */}
                <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full"
                    style={{
                        background: "radial-gradient(circle, rgba(111,174,155,0.08), transparent 70%)",
                        animation: "glowFloat 6s ease-in-out infinite",
                    }}
                />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between gap-3 mb-6">
                    <span
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full font-bold"
                        style={{
                            color: "#6fae9b",
                            border: "1px solid rgba(111,174,155,0.2)",
                            background: "rgba(111,174,155,0.06)",
                            fontFamily: "var(--font-display)",
                        }}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                background: "#6fae9b",
                                boxShadow: "0 0 6px #6fae9b",
                                animation: "timerPulse 2s ease-in-out infinite",
                            }}
                        />
                        analisando
                    </span>

                    <span
                        className="text-[10px] uppercase tracking-[0.18em] font-medium flex items-center gap-1.5"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                        <Clock3 className="w-3 h-3" />
                        19:00
                    </span>
                </div>

                {/* Title */}
                <div className="relative z-10 mb-1">
                    <p
                        className="text-[9px] uppercase tracking-[0.3em] font-bold mb-2"
                        style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-display)" }}
                    >
                        proximo humor em
                    </p>
                </div>

                {/* Timer digits */}
                <div className="relative z-10 flex items-center justify-center gap-2 mb-6">
                    <TimerDigit value={String(hours).padStart(2, "0")} label="hrs" />
                    <TimerSeparator />
                    <TimerDigit value={String(minutes).padStart(2, "0")} label="min" />
                    <TimerSeparator />
                    <TimerDigit value={String(seconds).padStart(2, "0")} label="seg" />
                </div>

                {/* Studio selector */}
                <div className="relative z-10 mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <p
                            className="text-[9px] uppercase tracking-[0.2em] font-bold"
                            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-display)" }}
                        >
                            estilo da proxima arte
                        </p>

                        {/* Desktop Navigation Arrows */}
                        <div className="hidden md:flex items-center gap-1.5">
                            <button
                                onClick={() => scrollStudios('left')}
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 active:scale-90"
                                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                                aria-label="Scroll Left"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
                            </button>
                            <button
                                onClick={() => scrollStudios('right')}
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all bg-white/5 hover:bg-white/10 active:scale-90"
                                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                                aria-label="Scroll Right"
                            >
                                <ChevronRight className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.5)" }} />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 modern-scrollbar snap-x"
                        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
                    >
                        {studios.map(studio => {
                            const isSelected = selectedStudio === studio.id;
                            return (
                                <button
                                    key={studio.id}
                                    onClick={() => handleStudioChange(studio.id)}
                                    className="snap-start shrink-0 flex flex-col items-start px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group text-left"
                                    style={{
                                        minWidth: 156,
                                        maxWidth: 180,
                                        background: isSelected ? "rgba(111,174,155,0.12)" : "rgba(255,255,255,0.03)",
                                        border: isSelected ? "1px solid rgba(111,174,155,0.4)" : "1px solid rgba(255,255,255,0.08)",
                                        boxShadow: isSelected ? "0 4px 12px rgba(111,174,155,0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)" : "none",
                                    }}
                                >
                                    {isSelected && (
                                        <div
                                            className="absolute top-0 right-0 w-16 h-16 rounded-full"
                                            style={{
                                                background: "radial-gradient(circle, rgba(111,174,155,0.2), transparent 70%)",
                                                transform: "translate(30%, -30%)"
                                            }}
                                        />
                                    )}
                                    <span
                                        className="text-sm font-black mb-1 truncate w-full transition-colors duration-300 relative z-10"
                                        style={{
                                            color: isSelected ? "#fff" : "rgba(255,255,255,0.85)",
                                            fontFamily: "var(--font-display)"
                                        }}
                                    >
                                        {studio.company}
                                    </span>
                                    <span
                                        className="text-[9px] uppercase font-bold truncate w-full transition-colors duration-300 relative z-10"
                                        style={{
                                            color: isSelected ? "rgba(111,174,155,0.9)" : "rgba(255,255,255,0.3)",
                                            letterSpacing: "0.05em"
                                        }}
                                    >
                                        {studio.referenceAnimes.slice(0, 2).join(", ")}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Progress section */}
                <div
                    className="relative z-10 rounded-2xl p-4"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                    }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span
                            className="text-[10px] uppercase tracking-[0.18em] font-bold"
                            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-display)" }}
                        >
                            progresso do dia
                        </span>
                        <span
                            className="text-sm font-black tabular-nums"
                            style={{
                                fontFamily: "var(--font-display)",
                                color: "#6fae9b",
                                textShadow: "0 0 12px rgba(111,174,155,0.3)",
                            }}
                        >
                            {percentage}%
                        </span>
                    </div>

                    <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div
                            className="h-full rounded-full transition-all duration-700 relative"
                            style={{
                                width: `${percentage}%`,
                                background: "linear-gradient(90deg, #6fae9b 0%, #00ffb3 60%, #8a7bb8 100%)",
                            }}
                        >
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                                    animation: "progressShine 2s ease-in-out infinite",
                                }}
                            />
                        </div>
                    </div>

                    {/* Mini bars visualizer */}
                    <div className="flex items-end justify-center gap-[3px] mt-4" style={{ height: 20 }}>
                        {[30, 60, 100, 45, 80, 55, 90, 35, 70, 50, 85, 40].map((h, i) => (
                            <div
                                key={i}
                                className="rounded-sm"
                                style={{
                                    width: 3,
                                    height: `${h}%`,
                                    background: `linear-gradient(to top, rgba(111,174,155,0.3), rgba(111,174,155,0.6))`,
                                    animation: `barBounce 1.2s ${i * 0.1}s ease-in-out infinite alternate`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer message */}
                <div className="relative z-10 mt-4 flex items-center gap-2">
                    <p
                        className="text-[11px] leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                        Atualização automática às <span style={{ color: "rgba(111,174,155,0.8)", fontWeight: 700 }}>19:00</span>
                    </p>
                </div>
            </div>

            <style jsx>{`
                .mood-grid-next {
                    background-image:
                        linear-gradient(rgba(255,255,255,0.5) 0.5px, transparent 0.5px),
                        linear-gradient(90deg, rgba(255,255,255,0.5) 0.5px, transparent 0.5px);
                    background-size: 28px 28px;
                }
                
                /* Modern elegant scrollbar for desktop fallback */
                .modern-scrollbar::-webkit-scrollbar { height: 4px; }
                .modern-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; margin: 0 4px; }
                .modern-scrollbar::-webkit-scrollbar-thumb { background: rgba(111, 174, 155, 0.3); border-radius: 10px; }
                .modern-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(111, 174, 155, 0.6); }

                @keyframes timerPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }
                @keyframes glowFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
                    50% { transform: translate(-10px, 10px) scale(1.1); opacity: 0.7; }
                }
                @keyframes progressShine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                @keyframes barBounce {
                    0% { transform: scaleY(0.7); }
                    100% { transform: scaleY(1); }
                }
            `}</style>
        </div>
    );
}
