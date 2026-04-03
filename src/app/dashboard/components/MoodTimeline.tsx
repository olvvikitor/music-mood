"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { getMoodHistory, type MoodHistoryItem } from "../services/profileStatsService";
import { getMoodDisplayName, getMoodProfile } from "@/shared/lib/moodHelpers";
import { useProfile } from "../hooks/useProfile";
import { MoodPrincipalCard } from "./MoodPrincipalCard";

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`rounded-lg animate-pulse ${className}`} style={{ background: "var(--surface-card-alt)" }} />;
}

function moodColor(score: number) {
    if (score >= 0.7) return "#00ffb3";
    if (score >= 0.4) return "#a259ff";
    return "#ff2d87";
}

function formatDate(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)}min atras`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h atras`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d atras`;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

type MoodTimelineProps = {
    hideHeader?: boolean;
    maxItems?: number;
    horizontal?: boolean;
};

export function MoodTimeline({ hideHeader = false, maxItems = 6, horizontal = true }: MoodTimelineProps) {
    const [items, setItems] = useState<MoodHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const { data: profile } = useProfile();

    useEffect(() => {
        getMoodHistory(20)
            .then(setItems)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const visible = showAll ? items : items.slice(0, maxItems);
    const listClassName = horizontal
        ? "flex gap-3 overflow-x-auto snap-x pb-1"
        : "flex flex-col gap-3";
    const itemClassName = horizontal
        ? "rounded-2xl overflow-hidden shrink-0 w-[240px] md:w-[280px] snap-start"
        : "rounded-2xl overflow-hidden";

    return (
        <div className="flex flex-col gap-4">
            {!hideHeader && (
                <h2
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}
                >
                    Linha do Tempo
                </h2>
            )}

            <div className="relative">
                <ul className={listClassName}>
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <li
                                key={i}
                                className={`${itemClassName} animate-pulse`}
                                style={{ border: "1px solid var(--border)", background: "var(--surface-card)" }}
                            >
                                <Skeleton className="h-40 w-full rounded-none" />
                                <div className="p-3 flex flex-col gap-2">
                                    <Skeleton className="h-3.5 w-36" />
                                    <Skeleton className="h-2.5 w-28" />
                                    <Skeleton className="h-2 w-full rounded-full" />
                                </div>
                            </li>
                        ))
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center py-10 gap-3 text-center">
                            <History className="w-8 h-8" style={{ color: "var(--text-ghost)" }} />
                            <p className="text-sm font-semibold" style={{ color: "var(--text-faint)" }}>
                                Nenhum mood registrado ainda.
                            </p>
                            <p className="text-xs" style={{ color: "var(--text-ghost)" }}>
                                Gere seu primeiro mood no perfil.
                            </p>
                        </div>
                    ) : (
                        visible.map((item, i) => {
                            const color = moodColor(item.moodScore);
                            const accent = getMoodProfile(item.sentiment).accent;
                            const moodLabel = getMoodDisplayName(item.sentiment, item.sentiment);
                            const pct = Math.round(item.moodScore * 100);
                            return (
                                <li
                                    key={item.id}
                                    className={itemClassName}
                                    style={{ border: "1px solid var(--border)", background: "var(--surface-card)" }}
                                >
                                    <MoodPrincipalCard
                                        moodImage={item.image_mood}
                                        sentimentDisplay={moodLabel}
                                        accent={accent}
                                        moodScore={pct}
                                        profileImage={profile?.img_profile}
                                        displayName={profile?.display_name}
                                        topRightText={formatDate(item.analyzedAt)}
                                        minHeight={320}
                                    />
                                </li>
                            );
                        })
                    )}
                </ul>

                {!loading && items.length > maxItems && (
                    <button
                        onClick={() => setShowAll(p => !p)}
                        className="w-full text-xs font-semibold py-2.5 rounded-xl transition-all mt-3"
                        style={{
                            background: "var(--surface-card)",
                            border: "1px solid var(--border)",
                            color: "var(--text-muted)",
                        }}
                    >
                        {showAll ? "Ver menos" : `Ver mais ${items.length - maxItems} registros`}
                    </button>
                )}
            </div>
        </div>
    );
}
