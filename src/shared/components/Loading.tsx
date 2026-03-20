interface LoadingProps {
    type?: "profile" | "list" | "header" | "emotionalChart" | "listCompact";
}

const pulse = { animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" };
const shimmerBase = "rounded-lg bg-white/[0.05]";

export default function LoadingComponent({ type = "list" }: LoadingProps) {

    /* ── HEADER pill ── */
    if (type === "header") {
        return (
            <div className="flex items-center gap-2 px-1 pr-3 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", ...pulse }}>
                <div className="w-8 h-8 rounded-full bg-white/[0.07]" />
                <div className="h-2.5 w-16 bg-white/[0.07] rounded-full" />
            </div>
        );
    }

    /* ── PROFILE card ── */
    if (type === "profile") {
        return (
            <div className="glass-card h-full flex flex-col overflow-hidden" style={pulse}>
                {/* Top bar */}
                <div className="flex items-center justify-between p-4 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-white/[0.07]" />
                        <div className="flex flex-col gap-1.5">
                            <div className="h-3 w-24 bg-white/[0.08] rounded-full" />
                            <div className="h-2 w-12 bg-white/[0.05] rounded-full" />
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.05]" />
                        <div className="w-8 h-8 rounded-xl bg-white/[0.05]" />
                    </div>
                </div>
                {/* Cover area */}
                <div className="flex-1 mx-3 mb-3 rounded-2xl bg-white/[0.04] min-h-[180px]" />
            </div>
        );
    }

    /* ── EMOTIONAL CHART ── */
    if (type === "emotionalChart") {
        return (
            <div className="flex flex-col gap-3 h-full" style={pulse}>
                {/* Hero block */}
                <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="h-2 w-20 bg-white/[0.06] rounded-full" />
                                <div className="h-6 w-36 bg-white/[0.08] rounded-lg" />
                                <div className="h-2.5 w-28 bg-white/[0.05] rounded-full" />
                            </div>
                            <div className="h-5 w-20 bg-white/[0.06] rounded-full" />
                        </div>
                        <div className="flex flex-col gap-1 pt-1">
                            <div className="flex justify-between">
                                <div className="h-2 w-14 bg-white/[0.04] rounded-full" />
                                <div className="h-2 w-8 bg-white/[0.04] rounded-full" />
                            </div>
                            <div className="h-0.5 w-full bg-white/[0.04] rounded-full" />
                        </div>
                    </div>
                </div>

                {/* 2-col grid */}
                <div className="grid grid-cols-2 gap-2">
                    {[0, 1].map(i => (
                        <div key={i} className="rounded-xl p-3 flex flex-col gap-2.5"
                            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div className="h-2 w-12 bg-white/[0.04] rounded-full" />
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-white/[0.07]" />
                                <div className="h-3 flex-1 bg-white/[0.06] rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quadrant chip */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="w-6 h-6 rounded-full bg-white/[0.06] shrink-0" />
                    <div className="flex flex-col gap-1.5 flex-1">
                        <div className="h-2 w-12 bg-white/[0.04] rounded-full" />
                        <div className="h-2.5 w-32 bg-white/[0.06] rounded-md" />
                    </div>
                </div>

                {/* Bars */}
                <div className="flex flex-col gap-3 pt-1">
                    {[90, 72, 58, 44, 35, 20].map((w, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <div className="flex justify-between">
                                <div className="h-2 w-16 bg-white/[0.05] rounded-full" />
                                <div className="h-2 w-6 bg-white/[0.04] rounded-full" />
                            </div>
                            <div className="h-0.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                                <div className="h-full bg-white/[0.08] rounded-full" style={{ width: `${w}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* ── LIST COMPACT (RecentSongs) ── */
    if (type === "listCompact") {
        return (
            <div className="flex flex-col gap-0.5" style={pulse}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-2 py-2">
                        <div className="w-5 shrink-0" />
                        <div className="w-10 h-10 rounded-lg bg-white/[0.06] shrink-0" />
                        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                            <div className="h-2.5 bg-white/[0.07] rounded-full"
                                style={{ width: `${55 + (i % 4) * 12}%` }} />
                            <div className="h-2 bg-white/[0.04] rounded-full" style={{ width: "40%" }} />
                        </div>
                        <div className="h-4 w-16 bg-white/[0.05] rounded-full shrink-0" />
                    </div>
                ))}
            </div>
        );
    }

    /* ── DEFAULT list ── */
    return (
        <div className="flex flex-col gap-3" style={pulse}>
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-white/[0.06] rounded-lg shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="h-3 bg-white/[0.07] rounded-full" style={{ width: `${50 + i * 10}%` }} />
                        <div className="h-2 bg-white/[0.04] rounded-full" style={{ width: "35%" }} />
                    </div>
                    <div className="h-4 w-14 bg-white/[0.05] rounded-full shrink-0" />
                </div>
            ))}
        </div>
    );
}
