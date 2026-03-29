"use client";

import { useEffect, useRef, useState } from "react";
import { Track } from "../types/music";
import { X, Music2 } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { EmotionalVectorBars } from "@/shared/components/EmotionalVectorBars";
import { MoodBadge } from "@/shared/components/MoodBadge";
import { emotionStyles } from "@/shared/lib/moodHelpers";
import { CLUSTER } from "@/shared/lib/moodCardHelpers";

interface TrackDrawerProps {
    track: Track;
    onClose: () => void;
}

export function TrackDrawer({ track, onClose }: TrackDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const t = setTimeout(() => setIsOpen(true), 10);

        // Trap body scroll without causing layout shift when scrollbar disappears.
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            clearTimeout(t);
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(onClose, 350);
    };

    const sentimentKey = track.dominantSentiment?.toLowerCase() ?? "";
    const badgeStyle = emotionStyles[sentimentKey] ?? "";
    const bgMatch = badgeStyle.match(/bg-([^\s\/]+)/);
    const glowClass = bgMatch ? `bg-${bgMatch[1]}` : "bg-brand-primary";
    const clusterData = CLUSTER[sentimentKey];

    if (!mounted) return null;

    return createPortal(
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                onClick={handleClose}
                className="fixed inset-0 z-100 transition-all duration-300"
                style={{
                    background: isOpen ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)",
                    backdropFilter: isOpen ? "blur(8px)" : "blur(0px)",
                }}
            />

            {/* Drawer panel */}
            <div
                className="fixed top-0 right-0 h-full z-110 flex flex-col overflow-hidden"
                style={{
                    width: "min(420px, 100vw)",
                    background: "var(--surface-solid)",
                    backdropFilter: "blur(40px)",
                    borderLeft: "1px solid var(--border-medium)",
                    boxShadow: "-32px 0 80px rgba(0,0,0,0.8)",
                    transform: isOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            >
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-4 shrink-0"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <span className="text-[10px] uppercase tracking-[0.18em] font-700 text-white/30"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                        Raio-X da Vibe
                    </span>
                    <button onClick={handleClose}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ background: "var(--surface-card-alt)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-hover)"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-card-alt)"}
                    >
                        <X className="w-3.5 h-3.5 text-white/50" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div
                    className="flex-1 overflow-y-auto custom-scrollbar"
                    style={{
                        WebkitOverflowScrolling: "touch",
                        overscrollBehaviorY: "contain",
                        touchAction: "pan-y",
                    }}
                >

                    {/* Hero: cover + title */}
                    <div className="relative px-5 pt-6 pb-5 flex gap-4 items-start">
                        {/* Ambient glow */}
                        <div className={`absolute inset-0 opacity-8 blur-[60px] pointer-events-none ${glowClass}`} />

                        <div className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden"
                            style={{ border: "1px solid var(--border-strong)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
                            <Image src={track.img_url ?? ""} alt={track.music} fill className="object-cover" unoptimized />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col gap-1.5 pt-0.5 relative z-10">
                            <h2 className="text-lg font-800 text-white leading-tight"
                                style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
                                {track.music}
                            </h2>
                            <p className="text-xs text-white/35 uppercase tracking-widest font-500"
                                style={{ fontFamily: "var(--font-body)" }}>
                                {track.artist.replace(/,/g, " Â· ")}
                            </p>
                            <div className="mt-1">
                                <MoodBadge mood={track.dominantSentiment} size="sm" label={track.dominantSentiment} />
                            </div>
                        </div>
                    </div>

                    <div className="mx-5" style={{ height: 1, background: "var(--border-subtle)" }} />

                    {/* Cluster phrase */}
                    {clusterData && (
                        <div className="mx-5 my-4 px-4 py-3 rounded-xl"
                            style={{
                                background: `${clusterData.bg}`,
                                border: `1px solid ${clusterData.border}`,
                            }}>
                            <p className="text-sm font-600 italic"
                                style={{ color: clusterData.color, fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                "{clusterData.phrase}"
                            </p>
                        </div>
                    )}

                    {/* AI verdict */}
                    {track.reasoning && (
                        <div className="px-5 pb-4 flex flex-col gap-2.5">
                            <span className="text-[10px] uppercase tracking-[0.15em] font-700 text-white/25"
                                style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                Veredito da IA
                            </span>
                            <div className="px-4 py-3 rounded-xl"
                                style={{
                                    background: "rgba(176,106,133,0.05)",
                                    borderLeft: "2px solid rgba(176,106,133,0.35)",
                                    border: "1px solid rgba(176,106,133,0.1)",
                                }}>
                                <p className="text-[13px] italic leading-relaxed text-white/70"
                                    style={{ fontFamily: "var(--font-body)" }}>
                                    "{track.reasoning}"
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mx-5" style={{ height: 1, background: "var(--border-subtle)" }} />

                    {/* Score + axes */}
                    <div className="px-5 py-4 grid grid-cols-3 gap-2">
                        {[
                            { label: "Score", value: `${Math.round(track.moodScore * 100)}%`, accent: "#6fae9b" },
                            { label: "Polaridade", value: track.coreAxes.polaridade > 0 ? "Positivo" : "Negativo", accent: track.coreAxes.polaridade > 0 ? "#6fae9b" : "#b06a85" },
                            { label: "Quadrante", value: track.coreAxes.quadrante.replace("Negativo", "Neg.").replace("Positivo", "Pos."), accent: "#8a7bb8" },
                        ].map(item => (
                            <div key={item.label} className="flex flex-col gap-1 px-3 py-2.5 rounded-xl"
                                style={{ background: "var(--surface-card)", border: "1px solid var(--border-medium)" }}>
                                <span className="text-[9px] uppercase tracking-wider text-white/25"
                                    style={{ fontFamily: "var(--font-display)" }}>{item.label}</span>
                                <span className="text-sm font-700 leading-tight"
                                    style={{ color: item.accent, fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mx-5" style={{ height: 1, background: "var(--border-subtle)" }} />

                    {/* Emotional spectrum */}
                    <div className="px-5 py-5 flex flex-col gap-3 pb-[calc(2rem+env(safe-area-inset-bottom))]">
                        <span className="text-[10px] uppercase tracking-[0.15em] font-700 text-white/25"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            Espectro Emocional
                        </span>
                        <EmotionalVectorBars vector={track.emotionalVector} />
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}

