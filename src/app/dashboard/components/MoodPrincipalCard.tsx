"use client";

import { useState } from "react";

type MoodPrincipalCardProps = {
    moodImage?: string;
    sentimentDisplay: string;
    accent: string;
    moodScore: number;
    profileImage?: string;
    displayName?: string;
    topRightText?: string;
    minHeight?: number;
};

export function MoodPrincipalCard({
    moodImage,
    sentimentDisplay,
    accent,
    moodScore,
    profileImage,
    displayName,
    topRightText = "MusicMood",
    minHeight = 390,
}: MoodPrincipalCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <div
            className="flex-1 mx-3 my-3 rounded-2xl overflow-hidden relative"
            style={{
                background: "#05050a",
                minHeight,
                aspectRatio: moodImage && !imageFailed ? "9 / 16" : undefined,
                maxHeight: moodImage && !imageFailed ? 580 : undefined,
            }}
        >
            {!imageFailed && moodImage ? (
                <>
                    <img
                        src={moodImage}
                        alt="Mood"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                        style={{ objectPosition: "center" }}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => {
                            setImageFailed(true);
                            setImageLoaded(false);
                        }}
                    />
                    {!imageLoaded && (
                        <div
                            className="absolute inset-0 animate-pulse"
                            style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01), rgba(255,255,255,0.05))" }}
                        />
                    )}
                </>
            ) : (
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: "radial-gradient(circle at 20% 20%, rgba(111,174,155,0.24), transparent 55%), radial-gradient(circle at 80% 80%, rgba(176,106,133,0.22), transparent 60%), #0b0b11" }}
                >
                    <p className="text-xs uppercase tracking-[0.18em] text-white/70" style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                        {sentimentDisplay}
                    </p>
                </div>
            )}

            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 38%, transparent 52%, rgba(0,0,0,.88) 100%)" }} />
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 40% at 80% 15%, ${accent}33 0%, transparent 60%)` }} />
            <div className="absolute inset-0 opacity-[0.10] mix-blend-soft-light mood-noise" />

            <div className="relative z-10 flex items-center gap-2.5 px-5 pt-5">
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                        style={{ border: "1.5px solid rgba(255,255,255,.25)" }}
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full shrink-0" style={{ border: "1.5px solid rgba(255,255,255,.25)", background: "rgba(255,255,255,.12)" }} />
                )}

                <span className="flex-1 text-[11px] uppercase tracking-[.12em] truncate" style={{ color: "rgba(255,255,255,.6)" }}>
                    {displayName || "Seu perfil"}
                </span>
                <span className="text-[11px] uppercase tracking-[.18em]" style={{ color: "rgba(255,255,255,.28)" }}>
                    {topRightText}
                </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-6">
                <p className="text-[9px] uppercase tracking-[.22em] mb-2" style={{ color: "rgba(255,255,255,.38)" }}>
                    se sentindo
                </p>
                <p
                    className="font-black italic leading-[1.06] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontSize: "clamp(24px, 6.4vw, 34px)", color: "#fff", textShadow: "0 2px 24px rgba(0,0,0,.8)" }}
                >
                    {sentimentDisplay}
                </p>
                <div className="flex items-center gap-3 mt-4">
                    <div className="flex items-center gap-2 rounded-full px-3 py-1" style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)" }}>
                        <span className="text-[12px] font-bold text-white">{moodScore}%</span>
                        <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,.4)" }}>score</span>
                    </div>
                    <div className="flex items-end gap-0.75" style={{ height: 16 }}>
                        {[38, 80, 100, 62, 88].map((h, i) => (
                            <div key={i} style={{ width: 3, height: `${h}%`, borderRadius: "2px 2px 0 0", background: accent, opacity: 0.8 }} />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .mood-noise {
                    background-image: radial-gradient(rgba(255,255,255,0.38) 0.6px, transparent 0.6px);
                    background-size: 3px 3px;
                }
            `}</style>
        </div>
    );
}
