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
    mostListenedSubgenre?: string;
    mostListenedSong?: {
        name: string;
        artist: string;
        img_url: string;
    };
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
    mostListenedSubgenre,
    mostListenedSong,
}: MoodPrincipalCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);

    console.log("DEBUG FRONTEND:", { mostListenedSubgenre, mostListenedSong });

    return (
        <div
            className="flex-1 mx-3 my-3 self-center rounded-2xl overflow-hidden relative flex flex-col items-center w-[calc(100%-24px)] md:w-full max-w-md mx-auto"
            style={{
                background: "#292929ff",
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
            <div className="absolute inset-0  mix-blend-soft-light mood-noise" />

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

            <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-6 flex items-end justify-between gap-4">
                {/* Esquerda: Informações do Mood */}
                <div className="flex flex-col min-w-0 shrink">
                    <p className="text-[9px] uppercase tracking-[.22em] mb-1.5" style={{ color: "rgba(255,255,255,.89)" }}>
                        se sentindo
                    </p>
                    <p
                        className="font-black italic leading-[1.06] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis mb-3"
                        style={{ fontSize: "clamp(22px, 6vw, 32px)", color: "#fff", textShadow: "0 2px 24px rgba(0,0,0,.8)" }}
                    >
                        {sentimentDisplay}
                    </p>

                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5 rounded-full px-2.5 py-0.5" style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)" }}>
                            <span className="text-[12px] font-bold text-white/100">{moodScore}%</span>
                            <span className="text-[9px] uppercase tracking-widest text-white/100">score</span>
                        </div>
                        <div className="flex items-end gap-[3px]" style={{ height: 16 }}>
                            {[38, 80, 100, 62, 88].map((h, i) => (
                                <div key={i} style={{ width: 3, height: `${h}%`, borderRadius: "2px 2px 0 0", background: accent, opacity: 0.8 }} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Direita: Música / Gênero mais tocados */}
                {(mostListenedSong || mostListenedSubgenre) && (
                    <div className="flex flex-col items-end gap-2.5 min-w-0 max-w-[50%]">
                        {mostListenedSubgenre && (
                            <div className="flex flex-col items-end w-full" style={{ color: accent, opacity: 0.9 }}>
                                <span className="text-[8px] uppercase tracking-[0.16em] text-white/100 mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
                                    Subgênero mais tocado
                                </span>
                                <span className="text-[12px] tracking-[0.05em] font-black truncate uppercase text-right w-full">
                                    {mostListenedSubgenre}
                                </span>
                            </div>
                        )}
                        {mostListenedSong && (
                            <div className="flex items-center gap-2 rounded-xl p-1.5 pr-2.5 backdrop-blur-md transition-all shadow-xl max-w-full" 
                                 style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                {mostListenedSong.img_url ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img 
                                        src={mostListenedSong.img_url}
                                        alt="Capa"
                                        className="w-8 h-8 rounded-lg shrink-0 object-cover shadow-sm"
                                        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }} />
                                )}
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-[8px] uppercase tracking-[0.1em] text-white/100" style={{ fontFamily: "var(--font-display)" }}>
                                        Música mais tocada
                                    </span>
                                    <span className="text-[10px] font-bold text-white/100 truncate drop-shadow-md w-full">
                                        {mostListenedSong.name}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .mood-noise {
                    background-image: radial-gradient(rgba(202, 202, 202, 0.38) 0.6px, transparent 0.6px);
                    background-size: 3px 3px;
                }
            `}</style>
        </div>
    );
}
