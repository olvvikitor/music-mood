"use client";

import { MessageSquareQuote, Sparkles } from "lucide-react";
import { useMoodProfile } from "../hooks/useMoodProfile";

export function InsightsSection() {
    const { data, isLoading, isError } = useMoodProfile();

    if (isLoading) {
        return (
            <div className="glass-card p-5 h-full flex flex-col justify-center gap-4 animate-pulse">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/5" />
                    <div className="h-2 w-20 bg-white/5 rounded-full" />
                </div>
                <div className="space-y-2">
                    <div className="h-5 bg-white/8 rounded-lg w-full" />
                    <div className="h-5 bg-white/6 rounded-lg w-4/5" />
                    <div className="h-5 bg-white/4 rounded-lg w-3/5" />
                </div>
            </div>
        );
    }

    if (isError || !data || !data.reasoning) return null;

    return (
        <div
            className="glass-card glass-card-hover h-full flex flex-col p-4 md:p-5 overflow-hidden relative"
            style={{
                background: "linear-gradient(135deg, rgba(255,45,135,0.06) 0%, rgba(12,12,16,0.70) 60%)",
            }}
        >
            {/* Glow */}
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-[60px] opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #ff2d87, transparent)" }} />

            {/* Label */}
            <div className="flex items-center gap-2 mb-2.5 md:mb-3 relative z-10">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,45,135,0.15)", border: "1px solid rgba(255,45,135,0.3)" }}>
                    <Sparkles className="w-3 h-3" style={{ color: "#ff2d87" }} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] font-800"
                    style={{ color: "#ff2d87", fontFamily: "var(--font-display)", fontWeight: 800 }}>
                    Insight do dia
                </span>
            </div>

            {/* Quote */}
            <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-center">
                <MessageSquareQuote
                    className="w-9 h-9 md:w-10 md:h-10 mb-2 opacity-10"
                    style={{ color: "#ff2d87" }}
                />
                <p
                    className="text-[15px] md:text-lg font-700 italic leading-snug md:leading-normal text-white/85 wrap-break-word text-pretty"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
                >
                    "{data.reasoning}"
                </p>
            </div>
        </div>
    );
}
