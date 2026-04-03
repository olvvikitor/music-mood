"use client"
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import LoadingComponent from "@/shared/components/Loading";
import ErrorComponent from "@/shared/components/Error";
import { useProfile } from "../hooks/useProfile";
import { Camera, Share2, Sparkles } from 'lucide-react';
import { useMoodProfile } from "../hooks/useMoodProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRefreshProfile } from "../services/getRefreshProfileService";
import NProgress from "nprogress";
import { ShareModal } from "./ShareModal";
import { updateFacePhotoService } from "@/shared/services/updateFacePhotoService";
import { getMoodDisplayName, getMoodProfile } from "@/shared/lib/moodHelpers";
import { DailyMoodProgressCard } from "./DailyMoodProgressCard";
import { MoodPrincipalCard } from "./MoodPrincipalCard";
import { FacePhotoNudgeModal } from "./FacePhotoNudgeModal";

export default function Profile() {
    const { data: profile, isLoading: profileLoading, isError: profileError } = useProfile();
    const { data: mood, isLoading: moodLoading, isError: moodError } = useMoodProfile();
    const queryClient = useQueryClient();

    const [isShareOpen, setIsShareOpen] = useState(false);
    const [facePhotoError, setFacePhotoError] = useState("");
    const [showFaceNudge, setShowFaceNudge] = useState(false);
    const autoRefreshTriggered = useRef(false);

    const { mutate: refreshUser, isPending } = useMutation({
        mutationFn: (studioId?: string) => getRefreshProfile(studioId),
        onMutate: () => NProgress.start(),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['moodProfile'] });
            // Show face photo nudge once per session if user has no face photo
            const already = sessionStorage.getItem("faceNudgeSeen");
            if (!already) {
                const prof = queryClient.getQueryData<{ face_photo_path?: string | null }>(['userProfile']);
                if (!prof?.face_photo_path) {
                    setShowFaceNudge(true);
                    sessionStorage.setItem("faceNudgeSeen", "1");
                }
            }
        },
        onSettled: () => {
            NProgress.done();
        },
    });

    const { mutateAsync: updateFacePhoto, isPending: isUpdatingFacePhoto } = useMutation({
        mutationFn: updateFacePhotoService,
        onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ['userProfile'] }); },
    });

    // ── Auto-refresh às 19h ──
    useEffect(() => {
        if (moodLoading || !mood || autoRefreshTriggered.current || isPending) return;

        const now = new Date();
        if (now.getHours() < 19) return;

        // Verifica se o mood atual já foi analisado depois das 19h de hoje
        const todayRelease = new Date(now);
        todayRelease.setHours(19, 0, 0, 0);

        const analyzedAt = new Date(mood.analyzedAt);
        if (analyzedAt >= todayRelease) return; // Já foi atualizado hoje

        autoRefreshTriggered.current = true;
        const preferredStudio = typeof window !== "undefined"
            ? localStorage.getItem("preferredStudioId") ?? undefined
            : undefined;
        refreshUser(preferredStudio);
    }, [mood, moodLoading, isPending, refreshUser]);

    const [activeSlide, setActiveSlide] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);

    if (profileLoading || moodLoading) return <LoadingComponent type="profile" />;
    if (moodError || profileError || !mood || !profile) return (
        <ErrorComponent type="profile" retry={() => refreshUser(undefined)} />
    );

    const sentimentDisplay = getMoodDisplayName(mood?.sentiment, "—");
    const accent = getMoodProfile(mood?.sentiment).accent;
    const moodScore = Math.round((mood?.moodScore ?? 0) * 100);
    const handleFacePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        event.target.value = "";
        if (!selectedFile) return;
        if (!/^image\/(jpeg|png|webp)$/.test(selectedFile.type)) { setFacePhotoError("Envie apenas JPEG, PNG ou WEBP."); return; }
        if (selectedFile.size > 5 * 1024 * 1024) { setFacePhotoError("A imagem deve ter no máximo 5MB."); return; }
        setFacePhotoError("");
        try { await updateFacePhoto(selectedFile); }
        catch { setFacePhotoError("Não foi possível atualizar a foto agora."); }
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        if (touchStartX.current === null || touchStartY.current === null) {
            return;
        }

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX.current;
        const deltaY = touch.clientY - touchStartY.current;

        touchStartX.current = null;
        touchStartY.current = null;

        const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        const passedThreshold = Math.abs(deltaX) > 40;
        if (!isHorizontalSwipe || !passedThreshold) {
            return;
        }

        if (deltaX < 0) {
            setActiveSlide(prev => Math.min(prev + 1, 1));
            return;
        }

        setActiveSlide(prev => Math.max(prev - 1, 0));
    };

    const lastMoodCard = (
        <div className="glass-card glass-card-hover h-full flex flex-col overflow-hidden relative" style={{ minHeight: 520 }}>
            <MoodPrincipalCard
                moodImage={mood.image_mood}
                sentimentDisplay={sentimentDisplay}
                accent={accent}
                moodScore={moodScore}
                profileImage={profile.img_profile}
                displayName={profile.display_name}
                topRightText="MusicMood"
                minHeight={470}
            />

            {/* ── Barra de ações ── */}
            <div className="px-4 pb-3 flex items-center gap-2 relative z-10">

                {!profile.face_photo_path ? (
                    /* ── Premium face photo onboarding ── */
                    <label
                        className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 active:scale-[0.98] group"
                        style={{
                            background: "rgba(111,174,155,0.06)",
                            border: "1px solid rgba(111,174,155,0.22)",
                            opacity: isUpdatingFacePhoto ? 0.7 : 1,
                        }}
                        title="Adicionar sua foto"
                    >
                        {/* Icon */}
                        <div
                            className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                            style={{ background: "rgba(111,174,155,0.12)", border: "1px solid rgba(111,174,155,0.25)" }}
                        >
                            {isUpdatingFacePhoto
                                ? <Sparkles className="w-4 h-4 animate-pulse" style={{ color: "#6fae9b" }} />
                                : <Camera className="w-4 h-4" style={{ color: "#6fae9b" }} />
                            }
                        </div>

                        {/* Copy */}
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold leading-tight" style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                                {isUpdatingFacePhoto ? "Processando sua foto..." : "Adicione seu rosto"}
                            </p>
                            <p className="text-[10px] leading-snug mt-0.5" style={{ color: "var(--text-muted)" }}>
                                Suas imagens de mood serão geradas com você
                            </p>
                        </div>

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            disabled={isUpdatingFacePhoto}
                            onChange={event => { void handleFacePhotoChange(event); }}
                        />
                    </label>
                ) : (
                    /* ── Compact camera button (photo already set) ── */
                    <label
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 cursor-pointer"
                        style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)", opacity: isUpdatingFacePhoto ? 0.7 : 1 }}
                        title="Atualizar foto do rosto"
                    >
                        <Camera className={`w-4.5 h-4.5 text-white/65 ${isUpdatingFacePhoto ? 'animate-pulse' : ''}`} />
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            disabled={isUpdatingFacePhoto}
                            onChange={event => { void handleFacePhotoChange(event); }}
                        />
                    </label>
                )}

                {/* Compartilhar */}
                <button onClick={() => setIsShareOpen(true)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0"
                    style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-medium)" }}
                    title="Compartilhar">
                    <Share2 className="w-4.5 h-4.5 text-white/65" />
                </button>
            </div>

            {facePhotoError && (
                <div className="px-4 pb-3 -mt-1"><p className="text-[10px] text-rose-300">{facePhotoError}</p></div>
            )}
        </div>
    );

    return (
        <>
            <div className="relative w-full">
                <div
                    className="p-1 rounded-xl mb-3 grid grid-cols-2 gap-1"
                    style={{ background: "var(--surface-card-alt)", border: "1px solid var(--border-subtle)" }}
                >
                    <button
                        onClick={() => setActiveSlide(0)}
                        className="px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all"
                        style={{
                            background: activeSlide === 0 ? "var(--surface-card)" : "transparent",
                            color: activeSlide === 0 ? "var(--text-primary)" : "var(--text-muted)",
                            border: activeSlide === 0 ? "1px solid var(--border-medium)" : "1px solid transparent",
                        }}
                    >
                        Ultimo humor
                    </button>

                    <button
                        onClick={() => setActiveSlide(1)}
                        className="px-3 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all"
                        style={{
                            background: activeSlide === 1 ? "var(--surface-card)" : "transparent",
                            color: activeSlide === 1 ? "var(--text-primary)" : "var(--text-muted)",
                            border: activeSlide === 1 ? "1px solid var(--border-medium)" : "1px solid transparent",
                        }}
                    >
                        Proximo humor
                    </button>
                </div>

                <div
                    className="overflow-hidden rounded-3xl w-full"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    style={{ touchAction: "pan-y" }}
                >
                    <div
                        className="flex w-full transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                    >
                        <div className="w-full shrink-0">{lastMoodCard}</div>
                        <div className="w-full shrink-0"><DailyMoodProgressCard /></div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 mt-3">
                    {[0, 1].map(index => (
                        <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            aria-label={index === 0 ? "Mostrar ultimo humor" : "Mostrar proximo humor"}
                            className="h-2.5 rounded-full transition-all"
                            style={{
                                width: activeSlide === index ? 22 : 10,
                                background: activeSlide === index ? "#00c4a0" : "var(--border-medium)",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* ── Modais ── */}
            {profile && mood && (
                <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} mood={mood} profile={profile} />
            )}
            <FacePhotoNudgeModal isOpen={showFaceNudge} onClose={() => setShowFaceNudge(false)} />
        </>
    );
}
