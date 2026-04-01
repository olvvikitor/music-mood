"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { useMoodProfile } from "../hooks/useMoodProfile";
import { getMoodHistory, getMoodWeek, getUserStats } from "../services/profileStatsService";
import { buildDashboardInsights } from "../lib/insights";

function SkeletonRow() {
    return (
        <div
            className="rounded-2xl p-4 animate-pulse"
            style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
        >
            <div className="h-3 w-28 rounded mb-2" style={{ background: "var(--surface-card-alt)" }} />
            <div className="h-3 w-full rounded mb-1.5" style={{ background: "var(--surface-card-alt)" }} />
            <div className="h-3 w-4/5 rounded" style={{ background: "var(--surface-card-alt)" }} />
        </div>
    );
}

export function InsightsSection() {
    const { data: mood, isLoading: moodLoading } = useMoodProfile();

    const { data: week = [], isLoading: weekLoading } = useQuery({
        queryKey: ["moodWeek"],
        queryFn: getMoodWeek,
        staleTime: 60_000,
    });

    const { data: history = [], isLoading: historyLoading } = useQuery({
        queryKey: ["moodHistory", 20],
        queryFn: () => getMoodHistory(20),
        staleTime: 60_000,
    });

    const { data: stats } = useQuery({
        queryKey: ["userStats"],
        queryFn: getUserStats,
        staleTime: 60_000,
    });

    const loading = moodLoading || weekLoading || historyLoading;
    const insights = buildDashboardInsights({ mood, week, history, stats });

    const levelMeta = {
        positive: { icon: CheckCircle2, color: "#00ffb3", label: "positivo" },
        warning: { icon: AlertTriangle, color: "#ff2d87", label: "atencao" },
        info: { icon: Activity, color: "#a259ff", label: "analise" },
    } as const;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: "#00ffb3" }} />
                <h2
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}
                >
                    Insights inteligentes
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {loading
                    ? [1, 2, 3].map((item) => <SkeletonRow key={item} />)
                    : insights.map((insight) => {
                        const meta = levelMeta[insight.level];
                        const Icon = meta.icon;

                        return (
                            <article
                                key={insight.id}
                                className="rounded-2xl p-4"
                                style={{
                                    background: "var(--surface-card)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Icon className="w-4 h-4 shrink-0" style={{ color: meta.color }} />
                                        <span
                                            className="text-[11px] uppercase tracking-widest font-bold truncate"
                                            style={{ color: meta.color, fontFamily: "var(--font-display)" }}
                                        >
                                            {insight.title}
                                        </span>
                                    </div>
                                    <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                                        {meta.label}
                                    </span>
                                </div>

                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                                    {insight.message}
                                </p>

                                {insight.cta && (
                                    <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                                        {insight.cta}
                                    </p>
                                )}
                            </article>
                        );
                    })}
            </div>
        </div>
    );
}

