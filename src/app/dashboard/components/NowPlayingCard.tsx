"use client";

import Image from "next/image";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { MoodBadge } from "@/shared/components/MoodBadge";
import { useListeningNow } from "../hooks/useListeningNow";
import { useTheme } from "@/shared/providers/ThemeProvider";

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export function NowPlayingCard() {
    const { data, isLoading, isError, isFetching } = useListeningNow();
    const { theme } = useTheme();
    const isLight = theme === "light";

    if (isLoading || isFetching) return <LoadingComponent type="emotionalChart" />;
    if (isError || !data?.tracks?.length) {
        return <ErrorComponent type="emotionalChart" message="Sem musica tocando agora." />;
    }

    const track = data.tracks[0];
    const activation = Math.abs(track.coreAxes?.ativacao ?? 0);
    const intensity = clamp(activation, 0.15, 1);
    const moodScore = Math.round((track.moodScore ?? data.moodScore ?? 0) * 100);
    const dominantMood = track.dominantSentiment ?? data.dominantSentiment ?? "Neutro";
    const energy = Math.round(intensity * 100);
    const pulseDuration = `${(2.3 - intensity * 1.2).toFixed(2)}s`;
    const vinylDuration = `${(12 - intensity * 6).toFixed(2)}s`;
    const artistMain = (track.artist ?? "").split(",")[0] ?? "Artista";
    const glowOpacity = 0.12 + intensity * 0.22;
    const barsDuration = `${(1.1 - intensity * 0.55).toFixed(2)}s`;
    const cardBackground = isLight
        ? "linear-gradient(145deg, rgba(239,246,252,0.96), rgba(229,237,247,0.94))"
        : "linear-gradient(145deg, rgba(5,9,15,0.95), rgba(18,7,24,0.92))";
    const waveformLine = isLight
        ? "linear-gradient(90deg, transparent, rgba(12,12,18,0.2), transparent)"
        : "linear-gradient(90deg, transparent, rgba(255,255,255,0.17), transparent)";
    const vinylBackground = isLight
        ? "repeating-radial-gradient(circle at center, rgba(30,44,62,0.16) 0 1px, transparent 1px 6px), radial-gradient(circle at center, rgba(212,223,236,1) 0%, rgba(169,184,202,1) 62%)"
        : "repeating-radial-gradient(circle at center, rgba(255,255,255,0.15) 0 1px, transparent 1px 6px), radial-gradient(circle at center, rgba(40,40,46,1) 0%, rgba(8,8,12,1) 62%)";
    const vinylShadow = isLight
        ? "inset 0 0 0 1px rgba(255,255,255,0.9), 0 14px 40px rgba(39,55,77,0.26)"
        : "inset 0 0 0 1px rgba(255,255,255,0.12), 0 14px 40px rgba(0,0,0,0.5)";

    return (
        <div className="relative h-full min-h-55 rounded-2xl overflow-hidden p-4 md:p-5"
            style={{
                border: "1px solid var(--border-medium)",
                background: cardBackground,
            }}
        >
            <div
                className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: `rgba(111,174,155,${glowOpacity})` }}
            />
            <div
                className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                style={{ background: `rgba(176,106,133,${0.1 + intensity * 0.12})` }}
            />
            <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-screen now-noise" />
            <div
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                    border: "1px solid var(--border-subtle)",
                    boxShadow: `0 0 0 1px rgba(255,255,255,0.02) inset, 0 0 28px rgba(111,174,155,${0.06 + intensity * 0.12}) inset`,
                }}
            />

            <div className="relative z-10 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full px-2.5 py-1"
                        style={{ border: "1px solid var(--border-strong)", background: "var(--surface-card)" }}>
                        <span className="now-live-dot" style={{ animationDuration: pulseDuration }} />
                        <p className="text-[9px] uppercase tracking-[0.18em] text-white/60"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            Audio Signal Live
                        </p>
                    </div>

                    <MoodBadge mood={dominantMood} size="sm" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-4 items-start">
                    <div className="min-w-0 space-y-2">

                        <h3 className="text-lg md:text-xl leading-tight text-white font-800 truncate"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
                            {track.music}
                        </h3>
                        <p className="text-sm text-white/65 truncate" style={{ fontFamily: "var(--font-body)" }}>
                            {artistMain}
                        </p>

                        {track.reasoning && (
                            <p className="text-[11px] leading-relaxed text-white/52 italic line-clamp-2"
                                style={{ fontFamily: "var(--font-body)" }}>
                                "{track.reasoning}"
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="rounded-xl px-3 py-2"
                                style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}>
                                <p className="text-[10px] uppercase tracking-[0.13em] text-white/40"
                                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                    Mood Score
                                </p>
                                <p className="text-base text-brand-primary font-800" style={{ fontFamily: "var(--font-display)" }}>
                                    {moodScore}%
                                </p>
                            </div>

                            <div className="rounded-xl px-3 py-2"
                                style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}>
                                <p className="text-[10px] uppercase tracking-[0.13em] text-white/40"
                                    style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                                    Energia
                                </p>
                                <p className="text-base text-white/90 font-800" style={{ fontFamily: "var(--font-display)" }}>
                                    {energy}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto sm:mx-0 sm:justify-self-end w-37.5 h-37.5">
                        <div className="absolute inset-0 rounded-full now-vinyl-ring" style={{ animationDuration: pulseDuration }} />
                        <div className="absolute inset-2.5 rounded-full now-vinyl" style={{ animationDuration: vinylDuration }}>
                            <div className="absolute inset-4 rounded-full overflow-hidden"
                                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                                {track.img_url ? (
                                    <Image
                                        src={track.img_url}
                                        alt={track.music}
                                        fill
                                        sizes="150px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px]"
                                        style={{
                                            background: "linear-gradient(135deg, rgba(111,174,155,0.22), rgba(176,106,133,0.2))",
                                            color: "rgba(255,255,255,0.72)",
                                            fontFamily: "var(--font-display)",
                                            letterSpacing: "0.11em",
                                            fontWeight: 700,
                                        }}>
                                        NO ART
                                    </div>
                                )}
                            </div>
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                                style={{
                                    background: isLight ? "rgba(236,242,248,1)" : "#06060a",
                                    border: "1px solid rgba(255,255,255,0.18)",
                                    boxShadow: "0 0 0 4px rgba(255,255,255,0.04)",
                                }} />
                        </div>
                    </div>
                </div>

                <div className="relative mt-auto">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px"
                        style={{ background: waveformLine }} />
                    <div className="mx-auto flex w-fit items-end justify-center gap-1 h-14 px-0.5">
                    {Array.from({ length: 28 }).map((_, index) => {
                        const delay = `${(index * 0.08).toFixed(2)}s`;
                        const baseHeight = 10 + (index % 7) * 5;
                        return (
                            <span
                                key={index}
                                className="eq-bar"
                                style={{
                                    height: `${baseHeight}px`,
                                    animationDuration: barsDuration,
                                    animationDelay: delay,
                                }}
                            />
                        );
                    })}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .now-noise {
                    background-image: radial-gradient(rgba(255,255,255,0.4) 0.55px, transparent 0.55px);
                    background-size: 3px 3px;
                }

                .now-live-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 999px;
                    display: inline-block;
                    background: #6fae9b;
                    box-shadow: 0 0 12px rgba(111,174,155,0.9);
                    animation-name: livePulse;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }

                .now-vinyl-ring {
                    background: conic-gradient(
                        from 0deg,
                        rgba(111,174,155,0.1),
                        rgba(176,106,133,0.3),
                        rgba(111,174,155,0.1)
                    );
                    filter: blur(0.2px);
                    animation-name: livePulse;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }

                .now-vinyl {
                    background: ${vinylBackground};
                    box-shadow: ${vinylShadow};
                    animation-name: spinVinyl;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }

                .eq-bar {
                    width: 6px;
                    border-radius: 999px;
                    background: linear-gradient(180deg, rgba(111,174,155,0.95), rgba(176,106,133,0.85));
                    transform-origin: bottom center;
                    animation-name: eqBounce;
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                }

                @keyframes livePulse {
                    0%, 100% { transform: scale(0.86); opacity: 0.42; }
                    50% { transform: scale(1.08); opacity: 1; }
                }

                @keyframes spinVinyl {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes eqBounce {
                    0%, 100% { transform: scaleY(0.35); opacity: 0.55; }
                    25% { transform: scaleY(0.95); opacity: 1; }
                    50% { transform: scaleY(0.5); opacity: 0.72; }
                    75% { transform: scaleY(1.15); opacity: 1; }
                }

                @media (max-width: 420px) {
                    .eq-bar {
                        width: 5px;
                    }
                }
            `}</style>
        </div>
    );
}

