"use client";

import { useEffect, useRef, useState } from "react";
import {
    Flame, TrendingUp, Calendar, Clock, Compass, Award,
    Sun, Sunset, Moon, CloudMoon, Activity, AlertTriangle, CheckCircle2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserInsights, getMoodHistory, getMoodWeek, getUserStats, type UserInsights } from "../services/profileStatsService";
import { useMoodProfile } from "../hooks/useMoodProfile";
import { buildDashboardInsights } from "../lib/insights";
import { getMoodDisplayName } from "@/shared/lib/moodHelpers";

function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
    return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "var(--surface-card-alt)", ...style }} />;
}

function InsightRow({ icon, label, value, sub, last }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
    last?: boolean;
}) {
    return (
        <div
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: last ? "none" : "1px solid var(--border-subtle)" }}
        >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--surface-card-alt)" }}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-faint)", fontFamily: "var(--font-display)" }}>{label}</p>
                <p className="text-sm font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{value}</p>
                {sub && <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{sub}</p>}
            </div>
        </div>
    );
}

function BadgeItem({ label, description, earned }: { label: string; description: string; earned: boolean }) {
    return (
        <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{
                background: earned ? "var(--surface-card-alt)" : "var(--surface-card)",
                border: earned ? "1px solid var(--border-medium)" : "1px solid var(--border-subtle)",
                opacity: earned ? 1 : 0.45,
            }}
        >
            <Award className="w-4 h-4 shrink-0" style={{ color: earned ? "#6fae9b" : "var(--text-faint)" }} />
            <div className="min-w-0">
                <p className="text-xs font-bold" style={{ color: earned ? "var(--text-primary)" : "var(--text-faint)", fontFamily: "var(--font-display)" }}>{label}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{description}</p>
            </div>
        </div>
    );
}

function PeriodBar({ label, icon, count, max }: { label: string; icon: React.ReactNode; count: number; max: number }) {
    const pct = max > 0 ? Math.round((count / max) * 100) : 0;
    return (
        <div className="flex items-center gap-2">
            <div className="w-6 flex items-center justify-center" style={{ color: "var(--text-faint)" }}>
                {icon}
            </div>
            <span className="text-[10px] w-20 shrink-0" style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)" }}>{label}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "#6fae9b", opacity: 0.6 }} />
            </div>
            <span className="text-[10px] tabular-nums w-8 text-right" style={{ color: "var(--text-faint)" }}>{count}</span>
        </div>
    );
}

// ── Horizontal drag-scroll insight cards ─────────────────────────────────────
const levelMeta = {
    positive: { icon: CheckCircle2, color: "#6fae9b", label: "positivo" },
    warning: { icon: AlertTriangle, color: "#b06a85", label: "atenção" },
    info: { icon: Activity, color: "#8a7bb8", label: "análise" },
} as const;

function InsightCards({ items, loading }: {
    items: ReturnType<typeof buildDashboardInsights>;
    loading: boolean;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
        scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
        if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
    };
    const onMouseLeave = () => { isDragging.current = false; if (scrollRef.current) scrollRef.current.style.cursor = "grab"; };
    const onMouseUp = () => { isDragging.current = false; if (scrollRef.current) scrollRef.current.style.cursor = "grab"; };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.2;
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    if (loading) {
        return (
            <div className="flex gap-3 mt-1">
                {[1, 2].map(i => <Skeleton key={i} className="h-24 rounded-2xl shrink-0" style={{ width: 220 } as React.CSSProperties} />)}
            </div>
        );
    }

    if (items.length === 0) return null;

    return (
        <div className="mt-3">
            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--text-faint)" }}>
                análises do sistema
            </p>
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-1 select-none"
                style={{ scrollSnapType: "x mandatory", cursor: "grab", scrollbarWidth: "none" }}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onTouchStart={e => e.stopPropagation()}
                onTouchMove={e => e.stopPropagation()}
                onTouchEnd={e => e.stopPropagation()}
            >
                {items.map(insight => {
                    const meta = levelMeta[insight.level];
                    const Icon = meta.icon;
                    return (
                        <div
                            key={insight.id}
                            className="shrink-0 rounded-2xl p-4 flex flex-col gap-2"
                            style={{
                                width: 220,
                                scrollSnapAlign: "start",
                                background: "var(--surface-card-alt)",
                                border: `1px solid ${meta.color}22`,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: meta.color }} />
                                <span
                                    className="text-[10px] font-bold uppercase tracking-widest truncate"
                                    style={{ color: meta.color, fontFamily: "var(--font-display)" }}
                                >
                                    {insight.title}
                                </span>
                            </div>
                            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
                                {insight.message}
                            </p>
                            {insight.cta && (
                                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{insight.cta}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
const SLIDES = [
    { id: "insights", label: "Insights" },
    { id: "escuta", label: "Escuta" },
    { id: "conquistas", label: "Conquistas" },
];

export function ProfileInsights() {
    const [data, setData] = useState<UserInsights | null>(null);
    const [loadingInsights, setLoadingInsights] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    // insights data
    const { data: mood } = useMoodProfile();
    const { data: week = [], isLoading: weekLoading } = useQuery({ queryKey: ["moodWeek"], queryFn: getMoodWeek, staleTime: Infinity, refetchOnWindowFocus: false });
    const { data: history = [], isLoading: historyLoading } = useQuery({ queryKey: ["moodHistory", 20], queryFn: () => getMoodHistory(20), staleTime: Infinity, refetchOnWindowFocus: false });
    const { data: stats } = useQuery({ queryKey: ["userStats"], queryFn: getUserStats, staleTime: Infinity, refetchOnWindowFocus: false });
    const aiInsightsLoading = weekLoading || historyLoading;
    const aiInsights = buildDashboardInsights({ mood, week, history, stats });

    useEffect(() => {
        getUserInsights().then(setData).catch(() => { }).finally(() => setLoadingInsights(false));
    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        touchStartX.current = null;
        touchStartY.current = null;
        if (Math.abs(dx) < Math.abs(dy) || Math.abs(dx) < 40) return;
        if (dx < 0) setActiveSlide(prev => Math.min(prev + 1, SLIDES.length - 1));
        else setActiveSlide(prev => Math.max(prev - 1, 0));
    };

    if (loadingInsights) {
        return (
            <div className="flex flex-col gap-3">
                <Skeleton className="h-10 w-full rounded-xl" />
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 rounded-2xl" />)}
            </div>
        );
    }

    if (!data) return null;

    const maxPeriod = Math.max(data.listeningPeriods.manha, data.listeningPeriods.tarde, data.listeningPeriods.noite, data.listeningPeriods.madrugada, 1);
    const earnedCount = data.badges.filter(b => b.earned).length;
    const dominantLabel = data.dominantMoodMonth ? getMoodDisplayName(data.dominantMoodMonth, data.dominantMoodMonth) : "—";
    const peakLabel = data.peakHour !== null ? `${String(data.peakHour).padStart(2, "0")}:00` : "—";

    // ── Slides ────────────────────────────────────────────────────────────────
    const slideInsights = (
        <div className="flex flex-col">
            <InsightRow icon={<Flame className="w-4 h-4" style={{ color: "#b06a85" }} />} label="Streak" value={data.moodStreak > 0 ? `${data.moodStreak} dias seguidos` : "0 dias"} sub="Moods registrados consecutivamente" />
            <InsightRow icon={<TrendingUp className="w-4 h-4" style={{ color: "#8a7bb8" }} />} label="Humor dominante do mês" value={dominantLabel} />
            <InsightRow icon={<TrendingUp className="w-4 h-4" style={{ color: "#6fae9b" }} />} label="Variação emocional" value={data.volatilityLabel} sub={`${data.volatility}% de variação`} />
            <InsightRow icon={<Calendar className="w-4 h-4" style={{ color: "#6fae9b" }} />} label="Melhor dia" value={data.bestDay ?? "—"} sub={data.worstDay ? `Pior: ${data.worstDay}` : undefined} last />
            <InsightCards items={aiInsights} loading={aiInsightsLoading} />
        </div>
    );

    const slideEscuta = (
        <div className="flex flex-col">
            <InsightRow icon={<Clock className="w-4 h-4" style={{ color: "#8a7bb8" }} />} label="Horário de pico" value={peakLabel} sub="Hora com mais músicas ouvidas" />
            <InsightRow icon={<Compass className="w-4 h-4" style={{ color: "#6fae9b" }} />} label="Tipo de ouvinte" value={data.listenerType === "explorador" ? "Explorador" : "Fiel"} sub={`${data.uniqueArtists} artistas únicos de ${data.totalTracksListened} músicas`} last />
            <div className="pt-3 pb-1 flex flex-col gap-2.5">
                <p className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-display)", color: "var(--text-faint)" }}>Quando você ouve</p>
                <PeriodBar label="Manhã" icon={<Sun className="w-3.5 h-3.5" />} count={data.listeningPeriods.manha} max={maxPeriod} />
                <PeriodBar label="Tarde" icon={<Sunset className="w-3.5 h-3.5" />} count={data.listeningPeriods.tarde} max={maxPeriod} />
                <PeriodBar label="Noite" icon={<Moon className="w-3.5 h-3.5" />} count={data.listeningPeriods.noite} max={maxPeriod} />
                <PeriodBar label="Madrugada" icon={<CloudMoon className="w-3.5 h-3.5" />} count={data.listeningPeriods.madrugada} max={maxPeriod} />
            </div>
        </div>
    );

    const slideConquistas = (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-display)", color: "var(--text-faint)" }}>Conquistas desbloqueadas</p>
                <span className="text-[10px] font-bold" style={{ color: "#6fae9b", fontFamily: "var(--font-display)" }}>{earnedCount}/{data.badges.length}</span>
            </div>
            {data.badges.map(badge => (
                <BadgeItem key={badge.id} label={badge.label} description={badge.description} earned={badge.earned} />
            ))}
        </div>
    );

    const slides = [slideInsights, slideEscuta, slideConquistas];

    return (
        <div className="glass-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 pt-4 pb-0">
                <TrendingUp className="w-4 h-4" style={{ color: "#6fae9b" }} />
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                    Insights inteligentes
                </h2>
            </div>

            {/* Tab bar */}
            <div
                className="p-1 m-3 mb-0 rounded-xl grid gap-1"
                style={{ gridTemplateColumns: `repeat(${SLIDES.length}, 1fr)`, background: "var(--surface-card-alt)", border: "1px solid var(--border-subtle)" }}
            >
                {SLIDES.map((slide, i) => (
                    <button
                        key={slide.id}
                        onClick={() => setActiveSlide(i)}
                        className="px-2 py-2 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-all"
                        style={{
                            background: activeSlide === i ? "var(--surface-card)" : "transparent",
                            color: activeSlide === i ? "var(--text-primary)" : "var(--text-muted)",
                            border: activeSlide === i ? "1px solid var(--border-medium)" : "1px solid transparent",
                            fontFamily: "var(--font-display)",
                        }}
                    >
                        {slide.label}
                    </button>
                ))}
            </div>

            {/* Carousel */}
            <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ touchAction: "pan-y" }}>
                <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                    {slides.map((slide, i) => (
                        <div key={i} className="w-full shrink-0 px-4 py-4">{slide}</div>
                    ))}
                </div>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 pb-4">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveSlide(i)}
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: activeSlide === i ? 22 : 8, background: activeSlide === i ? "#6fae9b" : "var(--border-medium)" }}
                    />
                ))}
            </div>
        </div>
    );
}
