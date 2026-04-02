"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Construction } from "lucide-react";

const RELEASE_HOUR = 19;

function buildTimelineState(now: Date) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const release = new Date(now);
    release.setHours(RELEASE_HOUR, 0, 0, 0);

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

    return [hours, minutes, seconds]
        .map(part => String(part).padStart(2, "0"))
        .join(":");
}

export function DailyMoodProgressCard() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(interval);
    }, []);

    const { progress, remainingMs } = useMemo(() => buildTimelineState(now), [now]);
    const percentage = Math.round(progress * 100);

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
                        "radial-gradient(120% 80% at 90% 0%, rgba(111,174,155,0.22), transparent 55%), radial-gradient(120% 80% at 10% 100%, rgba(176,106,133,0.22), transparent 60%), #07090f",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <div className="absolute inset-0 opacity-[0.08] mood-grid" />

                <div className="relative z-10 flex items-center justify-between gap-3 mb-6">
                    <span
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                        style={{
                            color: "rgba(255,255,255,0.78)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            background: "rgba(255,255,255,0.05)",
                        }}
                    >
                        <Construction className="w-3.5 h-3.5" />
                        em construcao
                    </span>

                    <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.45)" }}>
                        atualizacao diaria
                    </span>
                </div>

                <div className="relative z-10">
                    <p className="text-[10px] uppercase tracking-[0.22em] mb-2" style={{ color: "rgba(255,255,255,0.48)" }}>
                        proximo humor em
                    </p>
                    <p
                        className="font-black italic leading-[1.02]"
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(32px, 7vw, 48px)",
                            color: "#ffffff",
                            textShadow: "0 8px 30px rgba(0,0,0,0.45)",
                        }}
                    >
                        {formatRemaining(remainingMs)}
                    </p>

                    <div className="mt-6 rounded-2xl p-3.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.52)" }}>
                                progresso do dia
                            </span>
                            <span className="text-xs font-bold" style={{ color: "#c4fff0" }}>{percentage}%</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${percentage}%`, background: "linear-gradient(90deg, #6fae9b 0%, #00ffb3 100%)" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center gap-2 text-[11px]" style={{ color: "rgba(255,255,255,0.68)" }}>
                    <Clock3 className="w-3.5 h-3.5" />
                    O card principal de humor libera automaticamente as 19:00.
                </div>
            </div>

            <style jsx>{`
                .mood-grid {
                    background-image: linear-gradient(rgba(255,255,255,0.5) 0.6px, transparent 0.6px), linear-gradient(90deg, rgba(255,255,255,0.5) 0.6px, transparent 0.6px);
                    background-size: 22px 22px;
                }
            `}</style>
        </div>
    );
}
