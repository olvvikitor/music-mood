"use client"
import { useEffect, useState } from "react";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useProfile } from "../hooks/useProfile";
import { RotateCw, Share2 } from 'lucide-react';
import { useMoodProfile } from "../hooks/useMoodProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRefreshProfile } from "../services/getRefreshProfileService";
import NProgress from "nprogress";
import { emotionStyles } from "@/shared/lib/moodHelpers";
import { ShareModal } from "./ShareModal";
import { getGifByMood, type MoodProfileResponse } from "../services/getMoodProfile";

const TEST_MOOD_OPTIONS = [
    "tô voando",
    "na minha era",
    "adrenalina pura",
    "caos controlado",
    "apaixonadx",
    "no calor do abraço",
    "saudade boa",
    "na paz",
    "zerado",
    "viajando",
    "pressentindo",
    "engolindo seco",
    "tô no limite",
    "surtando",
    "chorando no banheiro",
    "apagado",
    "alma aberta",
    "tô confuso",
    "travado",
];

export default function Profile() {
    const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
    const { data: mood, isLoading: moodLoading, isError: moodError } = useMoodProfile();
    const queryClient = useQueryClient();
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [gifLoaded, setGifLoaded] = useState(false);
    const [gifFailed, setGifFailed] = useState(false);
    const [testMood, setTestMood] = useState("");

    const { mutate: refreshUser, isPending } = useMutation({
        mutationFn: getRefreshProfile,
        onMutate: () => NProgress.start(),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['moodProfile'] });
        },
        onSettled: () => NProgress.done(),
    });

    const storageKey = profile?.id ? `musicmood:test-mood:${profile.id}` : "";

    const applyMoodOverride = async (overrideMood: string) => {
        const gifUrl = await getGifByMood(overrideMood);

        queryClient.setQueryData<MoodProfileResponse | undefined>(['moodProfile'], (oldData) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                sentiment: overrideMood,
                url_gif: gifUrl,
            };
        });

        // Reinicia estado visual para animar o novo GIF corretamente.
        setGifFailed(false);
        setGifLoaded(false);
    };

    useEffect(() => {
        if (!storageKey) return;
        const saved = window.localStorage.getItem(storageKey);
        if (!saved) return;

        setTestMood(saved);
        void applyMoodOverride(saved);
    }, [storageKey]);

    if (profileLoading || moodLoading) return <LoadingComponent type="profile" />;
    if (moodError || profileError || !mood || !profile) return (
        <ErrorComponent type="profile" retry={() => refreshUser()} />
    );

    const sentimentKey = mood?.sentiment?.toLowerCase() || "alma aberta";
    const sentimentDisplay = mood?.sentiment || "—";
    const badgeStyle = emotionStyles[sentimentKey] || emotionStyles["alma aberta"];
    const bgMatch = badgeStyle.match(/bg-([^\s\/]+)/);
    const glowClass = bgMatch ? `bg-${bgMatch[1]}` : "bg-brand-primary";
    const moodScore = Math.round((mood?.moodScore ?? 0) * 100);
    const activation = Math.round(Math.abs(mood?.coreAxes?.ativacao ?? 0) * 100);

    const handleChangeTestMood = async (value: string) => {
        setTestMood(value);

        if (!value) {
            window.localStorage.removeItem(storageKey);
            queryClient.invalidateQueries({ queryKey: ['moodProfile'] });
            return;
        }

        window.localStorage.setItem(storageKey, value);
        await applyMoodOverride(value);
    };

    return (
        <div className="glass-card glass-card-hover h-full flex flex-col overflow-hidden relative"
            style={{ minHeight: 300 }}>

            {/* Ambient glow from mood color */}
            <div className={`absolute top-0 right-0 w-56 h-56 rounded-full opacity-10 blur-[80px] pointer-events-none ${glowClass}`} />

            {/* Top bar: avatar + actions */}
            <div className="flex items-center justify-between p-4 pb-3 relative z-10">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 w-11 h-11 rounded-full p-0.5"
                        style={{ background: "linear-gradient(135deg, #00ffb3, #a259ff)" }}>
                        <img
                            src={profile.img_profile}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover"
                            style={{ border: "1.5px solid #07070c" }}
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-800 text-white truncate uppercase tracking-tight"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}>
                            {profile.display_name}
                        </p>
                        <span className="badge-pro">PRO</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={() => setIsShareOpen(true)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}>
                        <Share2 className="w-3.5 h-3.5 text-white/50" />
                    </button>
                    <button
                        onClick={() => refreshUser()}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                        }}>
                        <RotateCw className={`w-3.5 h-3.5 text-white/50 ${isPending ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Mood lab: override local para testar UI do seu perfil */}
            <div className="px-4 pb-2 relative z-10">
                <div className="flex items-center gap-2 rounded-xl px-2.5 py-2"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                    }}>
                    <span className="text-[9px] uppercase tracking-[0.14em] text-white/55 shrink-0"
                        style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                        Mood Lab
                    </span>
                    <select
                        value={testMood}
                        onChange={(e) => void handleChangeTestMood(e.target.value)}
                        className="w-full bg-transparent text-[11px] text-white/80 outline-none"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        <option value="" style={{ color: '#07070c' }}>Real (API)</option>
                        {TEST_MOOD_OPTIONS.map((item) => (
                            <option key={item} value={item} style={{ color: '#07070c' }}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* GIF area */}
            <div className="flex-1 mx-3 mb-3 rounded-2xl overflow-hidden relative min-h-45">
                {!gifFailed ? (
                    <>
                        <img
                            src={mood.image_mood}
                            alt="Mood GIF"
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${gifLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                            onLoad={() => setGifLoaded(true)}
                            onError={() => {
                                setGifFailed(true);
                                setGifLoaded(false);
                            }}
                        />

                        {!gifLoaded && (
                            <div className="absolute inset-0 animate-pulse"
                                style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01), rgba(255,255,255,0.05))" }} />
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center"
                        style={{
                            background: "radial-gradient(circle at 20% 20%, rgba(0,255,179,0.24), transparent 55%), radial-gradient(circle at 80% 80%, rgba(255,45,135,0.22), transparent 60%), #0b0b11",
                        }}>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/70"
                            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>
                            {sentimentDisplay}
                        </p>
                    </div>
                )}

                {/* texture + gradient vignette */}
                <div className="absolute inset-0 opacity-[0.10] mix-blend-soft-light mood-noise" />
                <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)" }} />

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-1 rounded-full text-[10px] uppercase tracking-[0.13em] text-white/85"
                        style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            background: "rgba(0,0,0,0.35)",
                            border: "1px solid rgba(255,255,255,0.16)",
                            backdropFilter: "blur(8px)",
                        }}>
                        Score {moodScore}%
                    </span>
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5 flex flex-col gap-1.5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-700"
                        style={{ fontFamily: "var(--font-display)" }}>
                        Vibe atual
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`self-start text-[11px] font-900 uppercase tracking-widest px-3 py-1.5 rounded-full border backdrop-blur-md ${badgeStyle}`}
                            style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}>
                            {sentimentDisplay}
                        </span>
                        <span className="text-[10px] px-2.5 py-1 rounded-full uppercase tracking-[0.13em] text-white/75"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.14)",
                            }}>
                            Ativacao {activation}%
                        </span>
                    </div>
                </div>
            </div>

            {profile && mood && (
                <ShareModal
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    mood={mood}
                    profile={profile}
                />
            )}

            <style jsx>{`
                .mood-noise {
                    background-image: radial-gradient(rgba(255,255,255,0.38) 0.6px, transparent 0.6px);
                    background-size: 3px 3px;
                }
            `}</style>
        </div>
    );
}
