"use client";

import { useEffect, useState } from "react";
import { X, Music2, User2, BarChart2, Headphones, History } from "lucide-react";
import Image from "next/image";
import {
    getFriendMoodHistory,
    getFriendMoodWeek,
    getFriendStats,
    getFriendMood,
    type Friend,
} from "@/shared/services/friendService";
import type { MoodHistoryItem, MoodWeekItem, UserStats } from "@/app/dashboard/services/profileStatsService";
import { MoodPrincipalCard } from "@/app/dashboard/components/MoodPrincipalCard";
import { getMoodDisplayName, getMoodProfile, getMoodTextColor } from "@/shared/lib/moodHelpers";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function moodBarColor(score: number) {
    if (score >= 0.7) return "#6fae9b";
    if (score >= 0.4) return "#8a7bb8";
    return "#b06a85";
}

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function groupByDay(items: MoodWeekItem[]): (MoodWeekItem | null)[] {
    const days: (MoodWeekItem | null)[] = Array(7).fill(null);
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayStr = d.toISOString().slice(0, 10);
        const match = items.find(item => item.analyzedAt.slice(0, 10) === dayStr);
        days[6 - i] = match ?? null;
    }
    return days;
}

function formatDate(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: "var(--surface-card-alt)" }} />;
}

// ─── Seção: Gráfico da semana ─────────────────────────────────────────────────

function FriendWeekChart({ items, loading }: { items: MoodWeekItem[]; loading: boolean }) {
    const days = groupByDay(items);
    const dayLabels = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return DAYS[d.getDay()];
    });

    return (
        <div className="flex flex-col gap-3 rounded-2xl p-4"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
            <span className="text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                Humor da Semana
            </span>

            {loading ? (
                <div className="flex items-end gap-2 animate-pulse" style={{ height: 80 }}>
                    {[60, 80, 40, 90, 55, 70, 45].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-lg"
                            style={{ height: `${h}%`, background: "var(--surface-card-alt)" }} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="flex items-end gap-2" style={{ height: 90 }}>
                        {days.map((item, i) => {
                            const pct = item ? Math.round(item.moodScore * 100) : 0;
                            const color = item ? moodBarColor(item.moodScore) : "var(--border)";
                            const hasData = !!item;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1" style={{ height: "100%" }}>
                                    {hasData && (
                                        <span className="text-[8px] font-bold text-center"
                                            style={{ color, fontFamily: "var(--font-display)" }}>
                                            {pct}%
                                        </span>
                                    )}
                                    <div className="w-full rounded-t-lg transition-all duration-700 relative group"
                                        style={{
                                            height: hasData ? `${Math.max(pct, 8)}%` : "6%",
                                            background: hasData ? `linear-gradient(180deg, ${color}, ${color}55)` : "var(--border)",
                                            opacity: hasData ? 1 : 0.4,
                                        }}>
                                        {hasData && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap"
                                                style={{ background: "var(--surface-solid)", border: "1px solid var(--border-medium)" }}>
                                                <span className="text-[9px] font-semibold"
                                                    style={{ color: getMoodTextColor(item!.sentiment) }}>
                                                    {getMoodDisplayName(item!.sentiment, item!.sentiment)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-2">
                        {dayLabels.map((label, i) => (
                            <span key={i} className="flex-1 text-center text-[9px] uppercase tracking-wider"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    color: i === 6 ? "var(--text-secondary)" : "var(--text-faint)",
                                    fontWeight: i === 6 ? 700 : 400,
                                }}>
                                {label}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── Seção: Estatísticas ──────────────────────────────────────────────────────

function FriendStats({ data, loading }: { data: UserStats | null; loading: boolean }) {
    const avgPct = Math.round((data?.avgMoodScore ?? 0) * 100);
    const maxArtist = Math.max(...(data?.topArtists ?? []).map(a => a.count), 1);
    const maxTrack = Math.max(...(data?.topTracks ?? []).map(t => t.count), 1);

    return (
        <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                Estatísticas
            </span>

            {/* Cards resumo */}
            <div className="grid grid-cols-3 gap-2">
                {loading ? (
                    [1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)
                ) : (
                    <>
                        {[
                            { icon: <Headphones className="w-3.5 h-3.5" />, label: "Músicas", value: data?.totalListened ?? 0, color: "#6fae9b" },
                            { icon: <BarChart2 className="w-3.5 h-3.5" />, label: "Moods", value: data?.totalMoods ?? 0, color: "#8a7bb8" },
                            { icon: <Music2 className="w-3.5 h-3.5" />, label: "Média", value: `${avgPct}%`, color: "#b06a85" },
                        ].map(card => (
                            <div key={card.label} className="flex flex-col gap-1 rounded-2xl p-3"
                                style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center mb-0.5"
                                    style={{ background: `${card.color}18`, color: card.color }}>
                                    {card.icon}
                                </div>
                                <span className="text-xl font-black"
                                    style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                                    {card.value}
                                </span>
                                <span className="text-[9px] uppercase tracking-widest"
                                    style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                                    {card.label}
                                </span>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Top artistas */}
            {!loading && (data?.topArtists?.length ?? 0) > 0 && (
                <div className="rounded-2xl overflow-hidden"
                    style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
                    <div className="px-3 py-2.5 flex items-center gap-2"
                        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <User2 className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                        <span className="text-[10px] font-bold uppercase tracking-widest"
                            style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                            Top Artistas
                        </span>
                    </div>
                    <ul className="flex flex-col divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                        {data!.topArtists.map((a, i) => (
                            <li key={a.name} className="flex items-center gap-3 px-3 py-2.5">
                                <span className="text-xs font-black w-4 text-center shrink-0"
                                    style={{ color: i === 0 ? "#6fae9b" : "var(--text-faint)", fontFamily: "var(--font-display)" }}>
                                    {i + 1}
                                </span>
                                {a.img_url ? (
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                                        <Image src={a.img_url} alt={a.name} fill sizes="32px" className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
                                        style={{ background: "var(--surface-card-alt)" }}>
                                        <User2 className="w-3.5 h-3.5" style={{ color: "var(--text-faint)" }} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-semibold truncate block"
                                        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                                        {a.name}
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                                            <div className="h-full rounded-full"
                                                style={{ width: `${Math.round((a.count / maxArtist) * 100)}%`, background: "#6fae9b", opacity: 0.6 }} />
                                        </div>
                                        <span className="text-[10px] tabular-nums shrink-0"
                                            style={{ color: "var(--text-faint)" }}>{a.count}×</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Top músicas */}
            {!loading && (data?.topTracks?.length ?? 0) > 0 && (
                <div className="rounded-2xl overflow-hidden"
                    style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}>
                    <div className="px-3 py-2.5 flex items-center gap-2"
                        style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <Music2 className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                        <span className="text-[10px] font-bold uppercase tracking-widest"
                            style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                            Top Músicas
                        </span>
                    </div>
                    <ul className="flex flex-col divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                        {data!.topTracks.map((t, i) => (
                            <li key={`${t.title}-${i}`} className="flex items-center gap-3 px-3 py-2.5">
                                <span className="text-xs font-black w-4 text-center shrink-0"
                                    style={{ color: i === 0 ? "#8a7bb8" : "var(--text-faint)", fontFamily: "var(--font-display)" }}>
                                    {i + 1}
                                </span>
                                {t.img_url ? (
                                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                                        <Image src={t.img_url} alt={t.title} fill sizes="32px" className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                                        style={{ background: "var(--surface-card-alt)" }}>
                                        <Music2 className="w-3.5 h-3.5" style={{ color: "var(--text-faint)" }} />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate"
                                        style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>{t.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] truncate" style={{ color: "var(--text-faint)" }}>{t.artist}</span>
                                        <div className="flex-1 h-1 rounded-full overflow-hidden ml-1" style={{ background: "var(--border)" }}>
                                            <div className="h-full rounded-full"
                                                style={{ width: `${Math.round((t.count / maxTrack) * 100)}%`, background: "#8a7bb8", opacity: 0.5 }} />
                                        </div>
                                        <span className="text-[10px] tabular-nums shrink-0"
                                            style={{ color: "var(--text-faint)" }}>{t.count}×</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ─── Seção: Linha do tempo ────────────────────────────────────────────────────

function FriendTimeline({ items, loading, friendImgProfile, friendName }: {
    items: MoodHistoryItem[];
    loading: boolean;
    friendImgProfile: string;
    friendName: string;
}) {
    const visible = items.slice(0, 8);

    return (
        <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>
                <History className="w-3.5 h-3.5" />
                Linha do Tempo
            </span>

            {loading ? (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-2xl overflow-hidden shrink-0 animate-pulse"
                            style={{ width: 200, border: "1px solid var(--border)", background: "var(--surface-card)" }}>
                            <Skeleton className="h-52 w-full rounded-none" />
                            <div className="p-3 flex flex-col gap-2">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-2 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center py-8 gap-2 text-center">
                    <History className="w-7 h-7" style={{ color: "var(--text-ghost)" }} />
                    <p className="text-sm" style={{ color: "var(--text-faint)" }}>Nenhum mood ainda.</p>
                </div>
            ) : (
                <div className="flex gap-3 overflow-x-auto snap-x pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
                    {visible.map(item => {
                        const moodLabel = getMoodDisplayName(item.sentiment, item.sentiment);
                        const accent = getMoodProfile(item.sentiment).accent;
                        const pct = Math.round(item.moodScore * 100);

                        return (
                            <div key={item.id}
                                className="rounded-2xl overflow-hidden shrink-0 snap-start"
                                style={{ width: 200, border: "1px solid var(--border)", background: "var(--surface-card)" }}>
                                <MoodPrincipalCard
                                    moodImage={item.image_mood}
                                    sentimentDisplay={moodLabel}
                                    accent={accent}
                                    moodScore={pct}
                                    profileImage={friendImgProfile}
                                    displayName={friendName}
                                    topRightText={formatDate(item.analyzedAt)}
                                    minHeight={220}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Drawer principal ─────────────────────────────────────────────────────────

interface FriendProfileDrawerProps {
    friend: Pick<Friend, 'id' | 'display_name' | 'img_profile' | 'country'>;
    onClose: () => void;
}

export function FriendProfileDrawer({ friend, onClose }: FriendProfileDrawerProps) {
    const [mood, setMood]         = useState<any>(null);
    const [history, setHistory]   = useState<MoodHistoryItem[]>([]);
    const [week, setWeek]         = useState<MoodWeekItem[]>([]);
    const [stats, setStats]       = useState<UserStats | null>(null);

    const [loadingMood, setLoadingMood]     = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [loadingWeek, setLoadingWeek]     = useState(true);
    const [loadingStats, setLoadingStats]   = useState(true);

    useEffect(() => {
        const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [onClose]);

    useEffect(() => {
        getFriendMood(friend.id).then(setMood).catch(() => {}).finally(() => setLoadingMood(false));
        getFriendMoodHistory(friend.id, 20).then(setHistory).catch(() => {}).finally(() => setLoadingHistory(false));
        getFriendMoodWeek(friend.id).then(setWeek).catch(() => {}).finally(() => setLoadingWeek(false));
        getFriendStats(friend.id).then(setStats).catch(() => {}).finally(() => setLoadingStats(false));
    }, [friend.id]);

    const sentimentDisplay = getMoodDisplayName(mood?.sentiment, "—");
    const accent = getMoodProfile(mood?.sentiment).accent;
    const moodScore = Math.round((mood?.moodScore ?? 0) * 100);

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-[150]"
                style={{ background: "var(--overlay-bg)", backdropFilter: "blur(6px)" }}
                onClick={onClose}
            />

            {/* Drawer — slide da direita */}
            <div
                className="fixed top-0 right-0 bottom-0 z-[160] flex flex-col overflow-hidden w-full sm:max-w-md"
                style={{
                    background: "var(--bg-page)",
                    borderLeft: "1px solid var(--border-medium)",
                    boxShadow: "-24px 0 80px rgba(0,0,0,0.4)",
                    animation: "slideInRight 0.3s cubic-bezier(0.16,1,0.3,1) both",
                }}
            >
                {/* Header fixo */}
                <div
                    className="shrink-0 flex items-center gap-3 px-4 py-3.5"
                    style={{
                        background: "var(--header-bg)",
                        backdropFilter: "blur(20px)",
                        borderBottom: "1px solid var(--border-subtle)",
                    }}
                >
                    <img
                        src={friend.img_profile}
                        alt={friend.display_name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                        style={{ border: "1.5px solid var(--border-medium)" }}
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate"
                            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                            {friend.display_name}
                        </p>
                        <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                            {friend.country}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all"
                        style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)", color: "var(--text-muted)" }}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Scroll */}
                <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
                    <div className="flex flex-col gap-5 px-4 py-5 pb-10">

                        {/* Card de mood atual */}
                        {loadingMood ? (
                            <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: "9/16", maxHeight: 400 } as any} />
                        ) : (
                            <div className="glass-card overflow-hidden" style={{ minHeight: 320 }}>
                                <MoodPrincipalCard
                                    moodImage={mood?.image_mood}
                                    sentimentDisplay={sentimentDisplay}
                                    accent={accent}
                                    moodScore={moodScore}
                                    profileImage={friend.img_profile}
                                    displayName={friend.display_name}
                                    topRightText="MusicMood"
                                    minHeight={320}
                                />
                            </div>
                        )}

                        {/* Gráfico semana */}
                        <FriendWeekChart items={week} loading={loadingWeek} />

                        {/* Estatísticas */}
                        <FriendStats data={stats} loading={loadingStats} />

                        {/* Linha do tempo */}
                        <FriendTimeline
                            items={history}
                            loading={loadingHistory}
                            friendImgProfile={friend.img_profile}
                            friendName={friend.display_name}
                        />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
            `}</style>
        </>
    );
}
